import AdminTitle from '@/components/Admin/AdminTitle';
import AdminLayout from '@/components/Layout/AdminLayout';
import ModelCard from '@/components/Model/ModelCard';
import useNotification from '@/hooks/useNotification';
import managerModelAPI from '@/pages/api/manager/managerModelAPI';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import getServerSideProps from '@/lib/adminServerProps';
import PrimaryButton from '@/components/Utils/PrimaryButton';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Modal } from 'antd';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { validationUploadModel } from '@/constant';
import { InboxOutlined } from '@ant-design/icons';
import { Progress, Spin, Upload, message } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import { storage } from '../../../firebase';
import { getDownloadURL, ref, uploadBytes } from '@firebase/storage';
import removeDiacritics from '@/components/Utils/removeDiacritics';
import AdminPagination from '@/components/Utils/AdminPagination';
const { Dragger } = Upload;

function ModelList() {
    const router = useRouter();
    const formikRef = useRef();
    const fileInputRef = useRef();
    const [messageApi, contextHolder] = message.useMessage();
    const { showError, showSuccess, showWarning } = useNotification();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [videoUpload, setVideoUpload] = useState(null);
    const [videoFile, setVideoFile] = useState();
    const [loadingVideo, setLoadingVideo] = useState(false);
    const [data, setData] = useState([]);
    const [imageUpload, setImageUpload] = useState();

    // search
    const [dataSearch, setSearchData] = useState();
    const [searchValue, setSearchValue] = useState('');
    //Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 19;
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const itemsToShow = dataSearch?.slice(startIndex, endIndex);

    const handleSearchOnchange = (event) => {
        const searchTerm = event.target.value.trim().toLowerCase();
        setSearchValue(event.target.value);

        if (searchTerm !== '') {
            const normalizedSearchTerm = removeDiacritics(searchTerm); // Chuẩn hóa không dấu bằng lodash
            const filtered = data.filter(
                (models) =>
                    removeDiacritics(models.modelName?.toLowerCase() || '').includes(normalizedSearchTerm) ||
                    removeDiacritics(models.productName?.toLowerCase() || '').includes(normalizedSearchTerm),
            );
            setSearchData(filtered);
        } else {
            setSearchData(data);
        }
    };

    const getData = async () => {
        const res = await managerModelAPI.GetAll();
        if (res && res.success) {
            setData(res.data);
            setSearchData(res.data);
        }
    };

    const handleClickUpload = () => {
        fileInputRef.current.click();
    };

    // Function to handle delete article
    const handleDeleteModel = async (id) => {
        const res = await managerModelAPI.DeleteModel(id);
        if (res.success) {
            getData();
            showSuccess('Xóa thành công', `Xóa models ${id} thành công`, 2);
        } else if (res && !res.success) {
            showWarning('Xóa thất bại', res.message, 4);
        } else {
            showError('Xóa bị lỗi', 'Một số lỗi khi xóa mục này, Vui lòng thử lại', 2);
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setVideoFile();
        setVideoUpload(null);
        setImageUpload();
        formikRef.current.resetForm();
    };

    const props = {
        name: 'file',
        accept: 'video/*',
        maxCount: 1,
        progress: {
            type: 'line',
            showInfo: true,
        },
        onRemove: clearFiles,
        multiple: false,
        // Check video file
        beforeUpload: (file) => {
            const iVideo = file.type === 'video/mp4';
            if (!iVideo) {
                message.error(`${file.name} không phải là một tập tin video`);
            }
            return iVideo || Upload.LIST_IGNORE;
        },
        onChange(info) {
            let reader = new FileReader();
            const { status } = info.file;
            // Get origin file
            const selectedFile = info.file.originFileObj;
            // Remove current video
            setVideoUpload(null);
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            } else {
                setLoadingVideo(true);
            }
            // Check file is Blob type
            if (status === 'done' && selectedFile instanceof Blob) {
                message.success(`${info.file.name} tải video thành công.`);
                // read the file object
                reader.readAsDataURL(info.file.originFileObj);
            } else if (status === 'error') {
                message.error(`${info.file.name} tải video thất bại.`);
            }

            reader.onload = (readerEvent) => {
                // Set video to state
                if (selectedFile.type.includes('video')) {
                    setVideoUpload(readerEvent.target.result);
                    // setVideoFile(selectedFile);
                    setVideoFile(selectedFile);
                } else {
                    message.error('Không lưu được video');
                }
            };
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };

    function clearFiles() {
        setVideoUpload(null);
    }

    function handleVideoLoad() {
        setLoadingVideo(false);
    }

    const handleUploadFirebase = async (file, type = '') => {
        // random id to avoid image name exist
        const id = uuidv4();
        // Connect to firebase storage
        const imageRef = ref(storage, `images/${id}.${type}`);
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

    const handleCreateModel = async (values) => {
        try {
            if (values) {
                // video intro
                let videoUrl =
                    'https://firebasestorage.googleapis.com/v0/b/tkdecor-acd26.appspot.com/o/video%2Fvideo_tkdecor.mp4?alt=media&token=9515020e-ce72-4b14-aabe-2f8924589806';
                const imageUrl = await handleUploadFirebase(values.image);
                const modelUrl = await handleUploadFirebase(values.model, 'glb');
                if (videoFile) {
                    videoUrl = await handleUploadFirebase(videoFile, 'mp4');
                }
                const res = await managerModelAPI.CreateModel(values.name, videoUrl, modelUrl, imageUrl);
                if (res && res.success) {
                    showSuccess('Tạo thành công', 'Mô hình đã được thên vào danh sách', 3);
                    getData();
                    setVideoFile();
                    setIsModalOpen(false);
                    setImageUpload();
                }
            } else {
            }
        } catch (error) {
            console.log('🚀 ~ file: index.js:179 ~ handleCreateModel ~ error:', error);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <AdminLayout>
            {contextHolder}
            <div className="flex justify-between items-center">
                <AdminTitle content="Danh sách mô hình 3D" />
                <button
                    className="p-2 flex gap-2 hover:bg-secondary border-dashed border-secondary group border-2 font-bold justify-center items-center text-grey rounded-md"
                    onClick={() => setIsModalOpen(true)}
                >
                    <div className="w-4 h-4 bg-black flex justify-center items-center rounded-full">
                        <img src="/assets/svg/plus.svg" alt="icon" />
                    </div>
                    <p className="group-hover:text-white">Tải lên mô hình từ máy tính</p>
                </button>
            </div>
            <div className="w-8/12 relative border-b h-fit mb-8">
                <input
                    placeholder="Tìm kiếm"
                    className="outline-none p-2 w-full rounded-lg"
                    value={searchValue}
                    onChange={handleSearchOnchange}
                />
            </div>
            <div className="grid max-sm:grid-cols-2 grid-cols-3 gap-10 w-11/12 mx-auto mb-6">
                <button
                    onClick={() => router.push('/admin/models/create')}
                    className="flex hover:bg-grey hover:opacity-30 group w-full h-full flex-col group-hover:opacity-30 gap-4 justify-center items-center px-4 py-10 rounded-md border-dashed border-2"
                >
                    <div className="bg-black rounded-full w-16 h-16 flex justify-center items-center">
                        <img className="w-7 h-7" src="/assets/svg/plus.svg" alt="icon" />
                    </div>
                    <p className="text-secondary group-hover:text-white text-center text-sm max-sm:text-xs lg:text-lg font-semibold">
                        Tạo Model
                    </p>
                </button>

                {itemsToShow &&
                    itemsToShow.map((item) => (
                        <ModelCard
                            id={item.product3DModelId}
                            key={item.product3DModelId}
                            videoUrl={item.videoUrl}
                            name={item.modelName}
                            modelUrl={item.modelUrl}
                            thumbnails={item.thumbnailUrl}
                            productName={item.productName}
                            onDelete={(itemId) => handleDeleteModel(itemId)}
                        />
                    ))}
            </div>
            <Modal
                title="TẢI LÊN MÔ HÌNH TỪ MÁY TÍNH"
                open={isModalOpen}
                onCancel={handleCancel}
                destroyOnClose={true}
                footer={[
                    <button
                        form="createModel3D"
                        className="bg-secondary text-white px-5 rounded py-1.5 mt-4"
                        key="submit"
                        htmltype="submit"
                        type="submit"
                    >
                        Tải lên
                    </button>,
                ]}
            >
                <Formik
                    initialValues={{ name: '', image: '', model: '' }}
                    validationSchema={validationUploadModel}
                    onSubmit={(values, { resetForm }) => {
                        handleCreateModel(values);
                        resetForm();
                    }}
                    innerRef={formikRef}
                >
                    {({ setFieldValue }) => (
                        <Form className="flex flex-col gap-3 w-full" id="createModel3D">
                            <section className="w-full">
                                <p className="font-bold">Tên mô hình 3D</p>
                                <Field
                                    name="name"
                                    className="border-t-0 border-l-0 w-full border-b border-r-0 focus:outline-none text-sm py-1 px-2 border-black focus-visible:outline-none"
                                    placeholder="Nhập tên mô hình 3D"
                                />
                                <ErrorMessage name="name" component="p" className="text-error text-xs" />
                            </section>
                            <section>
                                <p className="font-bold">Mô hình 3D</p>
                                <Upload
                                    accept=".glb"
                                    listType="picture"
                                    maxCount={1}
                                    beforeUpload={(file) => {
                                        const part = file.name.split('.');
                                        const isModel = part[part.length - 1] === 'glb';
                                        if (!isModel) {
                                            message.error(`${file.name} không phải là một tập tin glb`);
                                        }
                                        return isModel || Upload.LIST_IGNORE;
                                    }}
                                    onChange={(info) => {
                                        console.log('🚀 ~ file: index.js:270 ~ ModelList ~ info:', info);
                                        return setFieldValue('model', info?.file?.originFileObj);
                                    }}
                                >
                                    <Button icon={<UploadOutlined />}>Tải lên mô hình</Button>
                                </Upload>
                                <ErrorMessage name="model" component="p" className="text-error text-xs" />
                            </section>
                            <section className="justify-center flex flex-col gap-10">
                                <h1 className="font-semibold -mb-8">Tải Video lên</h1>
                                <Dragger {...props} className="w-full mx-auto">
                                    <div className={`${videoUpload || loadingVideo ? 'hidden' : 'block p-4'}`}>
                                        <p className="ant-upload-drag-icon">
                                            <InboxOutlined />
                                        </p>
                                        <p className="ant-upload-text">Nhấp hoặc kéo tệp vào khu vực này để tải lên</p>
                                        <p className="ant-upload-hint">
                                            Hỗ trợ tải lên một lần hoặc hàng loạt. Nghiêm cấm tải lên dữ liệu của công
                                            ty hoặc các tệp bị cấm khác.
                                        </p>
                                    </div>
                                    {loadingVideo && <Spin spinning className="w-full h-full" />}
                                    {videoUpload && (
                                        <video
                                            controls
                                            muted
                                            autoPlay
                                            className={`h-full w-full ${loadingVideo ? 'hidden' : 'flex'}`}
                                            preload="none"
                                            onLoadedData={handleVideoLoad}
                                        >
                                            <source type="video/webm" src={videoUpload} />
                                        </video>
                                    )}
                                </Dragger>
                            </section>
                            <section className="flex justify-between">
                                <div>
                                    <p>Tải lên</p>
                                    <button
                                        type="button"
                                        className="h-48 w-48 rounded-10 border-dashed border-2 hover:border-secondary flex flex-col items-center gap-3 justify-center"
                                        onClick={handleClickUpload}
                                    >
                                        <div className="bg-black rounded-full w-12 h-12 flex justify-center items-center">
                                            <img className="w-7 h-7" src="/assets/svg/plus.svg" alt="icon" />
                                        </div>
                                        <p>Chọn ảnh</p>
                                    </button>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        name="image"
                                        className="hidden"
                                        key={Math.random()}
                                        onChange={(event) => {
                                            const selectedFile = event.target.files[0];

                                            // Kiểm tra xem tệp tin có phải là hình ảnh hay không
                                            if (selectedFile && selectedFile.type.startsWith('image/')) {
                                                setFieldValue('image', selectedFile);
                                                setImageUpload(URL.createObjectURL(selectedFile));
                                            } else {
                                                messageApi.open({
                                                    type: 'error',
                                                    content: 'Chỉ chấp nhận tệp hình ảnh (jpg, jpeg, png, gif).',
                                                });
                                            }
                                        }}
                                    />
                                    <ErrorMessage name="image" component="p" className="text-error text-xs" />
                                </div>
                                <div>
                                    <p>Xem trước hình ảnh</p>
                                    <div className="relative h-48 w-48 rounded-10 border-dashed border-2">
                                        <img
                                            src={imageUpload}
                                            alt="image category"
                                            className={
                                                !imageUpload ? 'hidden' : 'w-full h-full rounded-10 object-cover'
                                            }
                                        />
                                        <img
                                            src={'/assets/svg/delete_icon.svg'}
                                            alt="delete icon"
                                            className={
                                                !imageUpload
                                                    ? 'hidden'
                                                    : 'absolute top-2 right-2 w-4 h-4 hover:scale-110 cursor-pointer'
                                            }
                                            onClick={() => {
                                                setFieldValue('image', '');
                                                setImageUpload();
                                            }}
                                        />
                                    </div>
                                </div>
                            </section>
                        </Form>
                    )}
                </Formik>
            </Modal>
            <AdminPagination
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                totalItems={dataSearch?.length}
                onPageChange={handlePageChange}
            ></AdminPagination>
        </AdminLayout>
    );
}

export default ModelList;
export { getServerSideProps };
