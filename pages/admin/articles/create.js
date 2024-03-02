import { useState } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
// CSS component
import { InboxOutlined } from '@ant-design/icons';
import { CardBody } from '@material-tailwind/react';
import { Button, Card, Upload, message } from 'antd';
const { Dragger } = Upload;
// Custom component
import AdminTitle from '@/components/Admin/AdminTitle';
import AdminLayout from '@/components/Layout/AdminLayout';
import BackButton from '@/components/Utils/BackButton';
// Custom hook
import useNotification from '@/hooks/useNotification';
// api
import apiArticle from '@/pages/api/apiArticle';
// firebase component
import { getDownloadURL, ref, uploadBytes } from '@firebase/storage';
import DOMPurify from 'dompurify';
import { v4 as uuidv4 } from 'uuid';
import { storage } from '../../../firebase';
// constant
import { formatArticleCreate, modulesArticleCreate } from '@/constant';
import getServerSideProps from '@/lib/adminServerProps';
// Text editor import dynamic
const QuillNoSSRWrapper = dynamic(import('react-quill'), {
    ssr: false,
    loading: () => <p>Loading ...</p>,
});

function CreateArticle() {
    const router = useRouter();
    const [valueFromEditor, setValueFromEditor] = useState(null);
    const { showError, showSuccess, showWarning } = useNotification();
    const [selectedFile, setSelectedFile] = useState();
    const [articleInfo, setArticleInfo] = useState({
        title: '',
        thumbnails: '',
        description: '',
        published: 1,
    });
    const [messageError, setMessageError] = useState({
        msgTitle: '',
        msgThumbnails: '',
        msgDescription: '',
    });

    const renderError = (message) => <p className="text-xs text-error">{message}</p>;

    const handleChange = (e) => {
        if (articleInfo.title === '') {
            setMessageError((prev) => ({
                ...prev,
                msgTitle: 'Vui lòng nhập tiêu đề',
            }));
        } else if (e.target.value.length < 5) {
            setMessageError((prev) => ({
                ...prev,
                msgTitle: 'Tiêu đề ít nhất 5 ký tự',
            }));
        } else if (e.target.value.length > 100) {
            setMessageError((prev) => ({
                ...prev,
                msgTitle: 'Tiêu đề nhiều nhất 100 ký tự',
            }));
        } else {
            setMessageError((prev) => ({
                ...prev,
                msgTitle: '',
            }));
        }

        setArticleInfo((prev) => ({
            ...prev,
            title: e.target.value,
        }));
    };

    // Config input image
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif']; // Các định dạng hình ảnh cho phép

    const props = {
        accept: 'image/*',
        beforeUpload: (file) => {
            const isImage = file.type.startsWith('image/');
            if (!isImage) {
                message.error(`${file.name} không phải là một tập tin hình ảnh`);
                return Upload.LIST_IGNORE;
            }

            const fileExtension = file.name.split('.').pop().toLowerCase();
            if (!allowedExtensions.includes(fileExtension)) {
                message.error(
                    `Định dạng ${fileExtension} không được hỗ trợ. Chỉ chấp nhận tệp hình ảnh (jpg, jpeg, png, gif).`,
                );
                return Upload.LIST_IGNORE;
            }

            return isPNG || Upload.LIST_IGNORE;
        },
        maxCount: 1,
        progress: {
            type: 'line',
            showInfo: true,
        },
        onChange(info) {
            setArticleInfo((prevState) => ({
                ...prevState,
                thumbnails: info.file,
            }));
            setMessageError((prev) => ({
                ...prev,
                msgThumbnails: '',
            }));
            // Check image deleted
            if (info?.fileList && info?.fileList.length > 0) {
                setSelectedFile(URL.createObjectURL(info.file));
            } else {
                setSelectedFile(null);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };

    const handleQuillChange = (value) => {
        if (isQuillEmpty(value)) {
            setMessageError((prev) => ({
                ...prev,
                msgContent: 'Vui lòng nhập nội dung',
            }));
        } else {
            setMessageError((prev) => ({
                ...prev,
                msgContent: '',
            }));
        }
        setValueFromEditor(value);
    };

    // Handle onclick to get value from editor
    const handleClick = async (e) => {
        e.preventDefault();
        handleCreateArticle();
    };

    // Function to handle upload image into firebase and return a url to storage in database
    const handleUploadImage = async (file) => {
        // random id to avoid image name exist
        const id = uuidv4();
        // Connect to firebase storage
        const imageRef = ref(storage, `articles/${id}`);
        try {
            // Upload and get image url on firebase
            const snapshot = await uploadBytes(imageRef, file);
            const url = await getDownloadURL(snapshot.ref);
            if (!!url) {
                return url;
            } else {
                return null;
            }
        } catch (error) {
            console.error(error);
        }
    };
    // Function to check text editor is empty
    function isQuillEmpty(value) {
        if (value?.replace(/<(.|\n)*?>/g, '').trim().length === 0 && !value.includes('<img')) {
            return true;
        }
        return false;
    }

    // Create new article
    const handleCreateArticle = async () => {
        if (
            !isQuillEmpty(valueFromEditor) &&
            articleInfo.title != '' &&
            articleInfo.title.length >= 5 &&
            articleInfo.title.length <= 100 &&
            !!selectedFile
        ) {
            try {
                const imageURL = await handleUploadImage(articleInfo.thumbnails);
                const res = await apiArticle.CreateArticle(articleInfo.title, valueFromEditor, imageURL);
                if (res.success) {
                    showSuccess(
                        'Tạo bài viết mới thành công',
                        'Bạn sẽ được chuyển hướng đến trang liệt kê bài viết',
                        3,
                    );
                    router.push('/admin/articles');
                }
                // Check if any error
                else {
                    showError('Không thể tạo bài viết mới', 'Một số lỗi xảy ra khi tạo bài viết', 5);
                }
            } catch (error) {
                console.log('🚀 ~ file: create.js:112 ~ handleCreateArticle ~ error:', error);
            }
        } else {
            if (selectedFile == null) {
                setMessageError((prev) => ({
                    ...prev,
                    msgThumbnails: 'Vui lòng tải lên ảnh bìa',
                }));
            }

            if (articleInfo.title === '') {
                setMessageError((prev) => ({
                    ...prev,
                    msgTitle: 'Vui lòng nhập tiêu đề',
                }));
            } else if (articleInfo.title.length < 5) {
                setMessageError((prev) => ({
                    ...prev,
                    msgTitle: 'Tiêu đề ít nhất 5 ký tự',
                }));
            } else if (articleInfo.title.length > 100) {
                setMessageError((prev) => ({
                    ...prev,
                    msgTitle: 'Tiêu đề nhiều nhất 100 ký tự',
                }));
            } else {
                setMessageError((prev) => ({
                    ...prev,
                    msgTitle: '',
                }));
            }
            if (valueFromEditor === null) {
                setMessageError((prev) => ({
                    ...prev,
                    msgContent: 'Vui lòng nhập nội dung',
                }));
            } else {
                setMessageError((prev) => ({
                    ...prev,
                    msgContent: '',
                }));
            }
        }
    };

    return (
        <AdminLayout>
            <AdminTitle content="Tạo bài viết" />
            <form onSubmit={handleClick}>
                <Card>
                    <div className="align-items-center flex justify-between">
                        <div className="text-right" xs="4">
                            <BackButton title={'Trở về danh sách tin tức'} />
                        </div>
                        <div className="text-right" xs="4">
                            <Button
                                color="primary"
                                type="submit"
                                size="sm"
                                className="bg-secondary text-white"
                                onClick={handleClick}
                            >
                                Tạo mới
                            </Button>
                        </div>
                    </div>
                    <CardBody className="flex flex-col gap-6">
                        <section>
                            <label className="block text-gray-700 font-bold text-lg mb-2" htmlFor="username">
                                Tiêu đề
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="username"
                                type="text"
                                name="title"
                                value={articleInfo.title}
                                onChange={(e) => handleChange(e)}
                                placeholder="Tiêu đề bài viết"
                                required
                            />
                            <div className="pt-1">{renderError(messageError.msgTitle)}</div>
                        </section>

                        <section>
                            <label className="block mt-2 mb-2 font-medium text-lg" htmlFor="file_input">
                                Ảnh bìa
                            </label>
                            {!!selectedFile ? (
                                <div className="relative">
                                    <img
                                        src={'/assets/svg/delete_icon.svg'}
                                        alt="delete icon"
                                        className={
                                            !selectedFile
                                                ? 'hidden'
                                                : 'absolute top-2 right-2 w-4 h-4 hover:scale-110 cursor-pointer'
                                        }
                                        onClick={() => {
                                            setSelectedFile('');
                                        }}
                                    />
                                    <img src={selectedFile} alt="Thumbnail" />
                                </div>
                            ) : (
                                <Dragger {...props}>
                                    <>
                                        <p className="ant-upload-drag-icon">
                                            <InboxOutlined />
                                        </p>
                                        <p className="ant-upload-text">Nhấp hoặc kéo tệp vào khu vực này để tải lên</p>
                                        <p className="ant-upload-hint">
                                            Hỗ trợ tải lên một lần hoặc hàng loạt. Nghiêm cấm tải lên dữ liệu công ty
                                            hoặc các tập tin bị cấm khác.
                                        </p>
                                    </>
                                </Dragger>
                            )}
                            <div className="pt-1">{renderError(messageError.msgThumbnails)}</div>
                        </section>
                        <QuillNoSSRWrapper
                            className=" h-[300px]"
                            onChange={handleQuillChange}
                            modules={modulesArticleCreate}
                            formats={formatArticleCreate}
                            theme="snow"
                        />
                        <div className="pt-5">{renderError(messageError.msgContent)}</div>
                    </CardBody>
                </Card>
            </form>
        </AdminLayout>
    );
}

export default CreateArticle;

export { getServerSideProps };
