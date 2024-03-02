import { useEffect, useRef, useState } from 'react';

import AdminCategoryCard from '@/components/Admin/AdminCategoryCard';
import AdminLayout from '@/components/Layout/AdminLayout';
import AdminTitle from '@/components/Admin/AdminTitle';
import useNotification from '@/hooks/useNotification';

import managerCategoryAPI from '@/pages/api/manager/managerCategoryAPI';
import { message } from 'antd';
import getServerSideProps from '@/lib/adminServerProps';
import { v4 as uuidv4 } from 'uuid';
import { Modal } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
const { confirm } = Modal;
import { storage } from '../../../firebase';
import { getDownloadURL, ref, uploadBytes } from '@firebase/storage';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { validationCategory } from '@/constant';
import removeDiacritics from '@/components/Utils/removeDiacritics';
import AdminPagination from '@/components/Utils/AdminPagination';
function Categories() {
    const [messageApi, contextHolder] = message.useMessage();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDisable, setIsDisable] = useState(false);
    const [imageUpload, setImageUpload] = useState();
    const formikRef = useRef();
    const fileInputRef = useRef();

    // data for categories
    const [dataCategory, setDataCategory] = useState([]);
    // search
    const [dataSearch, setSearchData] = useState();
    const [searchValue, setSearchValue] = useState('');
    //Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;
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
            const filtered = dataCategory.filter((categories) =>
                removeDiacritics(categories.name?.toLowerCase() ?? '').includes(normalizedSearchTerm),
            );
            setSearchData(filtered);
        } else {
            setSearchData(dataCategory);
        }
    };

    const handleClickUpload = () => {
        fileInputRef.current.click();
    };

    const { showError, showSuccess } = useNotification();
    const handleCancel = () => {
        setIsModalOpen(false);
        formikRef.current.resetForm();
        setImageUpload();
    };

    // handle upload image to firebase
    const handleUploadImage = async (file) => {
        // random id to avoid image name exist
        const id = uuidv4();
        // Connect to firebase storage
        const imageRef = ref(storage, `categories/${id}`);
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

    // submit form add or update category
    const handleCreateCategory = async (values) => {
        setIsDisable(true);
        try {
            if (values) {
                const imageUrl = await handleUploadImage(values?.image);
                if (imageUrl !== null) {
                    const res = await managerCategoryAPI.Create(values?.name, imageUrl);
                    if (res && res.success) {
                        setIsModalOpen(false);
                        showSuccess(
                            'Tạo danh mục thành công',
                            'Danh mục mới sẽ được hiển thị trong danh sách danh mục',
                            3,
                        );
                        setImageUpload();
                        fetchData();
                        formikRef.current.resetForm();
                        setIsDisable(false);
                    } else {
                        showError('Tạo danh mục thất bại', res.message, 5);
                        formikRef.current.resetForm();
                        setImageUpload();
                        setIsDisable(false);
                    }
                } else {
                    showError('Có lỗi xảy ra', 'Lưu hình ảnh thất bại. Vui lòng thực hiện lại!', 5);
                    setIsDisable(false);
                }
            }
        } catch (error) {
            console.log('🚀 ~ file: index.js:241 ~ handleCreateCategory ~ error:', error);
        }
    };

    //remove category
    const handleDeleteCategory = async (id) => {
        confirm({
            title: 'Bạn có muốn xóa danh mục này?',
            icon: <ExclamationCircleFilled />,
            okText: 'Xóa',
            cancelText: 'Quay lại',
            content: 'Dữ liệu đã xóa không thể phục hồi',
            okType: 'danger',
            async onOk() {
                // callback function
                const res = await managerCategoryAPI.Delete(id);
                if (res && res.success === true) {
                    showSuccess('Xoá danh mục thành công', 'Danh mục đã được xóa trong danh sách danh mục', 3);
                    fetchData();
                } else {
                    showError('Xoá danh mục thất bại', res.message);
                }
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };

    // call api to get categories
    const fetchData = async () => {
        const responseCategory = await managerCategoryAPI.GetAll();
        if (responseCategory && responseCategory.success) {
            setDataCategory(responseCategory.data);
            setSearchData(responseCategory.data);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);

    return (
        <AdminLayout>
            {contextHolder}
            <AdminTitle content="Danh sách danh mục" />
            <div className="w-8/12 relative border-b h-fit mb-8">
                <input
                    placeholder="Tìm kiếm"
                    className="outline-none p-2 w-full rounded-lg"
                    value={searchValue}
                    onChange={handleSearchOnchange}
                />
            </div>
            <div className="grid max-sm:grid-cols-1 grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-10 w-11/12 mx-auto mb-8">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex w-full flex-col group-hover:opacity-30 gap-4 justify-center items-center px-4 py-10 rounded-md border-dashed border-2"
                >
                    <div className="bg-black rounded-full w-16 h-16 flex justify-center items-center">
                        <img className="w-7 h-7" src="/assets/svg/plus.svg" alt="icon" />
                    </div>
                    <p className="text-secondary text-center text-lg font-semibold line-clamp-1">Thêm danh mục</p>
                </button>
                {itemsToShow &&
                    itemsToShow?.map((item) => (
                        <div key={item.categoryId} className="cursor-pointer">
                            <AdminCategoryCard
                                id={item.categoryId}
                                title={item.name}
                                image={item.thumbnail}
                                onDeleteClick={() => handleDeleteCategory(item.categoryId)}
                                fetchData={() => fetchData()}
                            />
                        </div>
                    ))}
            </div>
            <AdminPagination
                className="pt-8"
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                totalItems={dataSearch?.length}
                onPageChange={handlePageChange}
            ></AdminPagination>
            <Modal
                title={'Thêm danh mục mới'}
                open={isModalOpen}
                onCancel={handleCancel}
                footer={[
                    <button
                        form="formCreateCategory"
                        className="bg-secondary text-white px-5 rounded py-1.5 mt-4"
                        key="submit"
                        htmltype="submit"
                        disabled={isDisable}
                        type="submit"
                    >
                        Tạo Mới
                    </button>,
                ]}
            >
                <Formik
                    initialValues={{ name: '', image: '' }}
                    validationSchema={validationCategory}
                    onSubmit={(values) => {
                        handleCreateCategory(values);
                    }}
                    innerRef={formikRef}
                >
                    {({ setFieldValue }) => (
                        <Form className="flex flex-col gap-3 w-full" id={'formCreateCategory'}>
                            <div className="flex w-full my-2 max-sm:flex-col max-sm:gap-4 flex-col gap-4">
                                <section className="w-full">
                                    <p className="font-bold">Tên danh mục</p>
                                    <Field
                                        name="name"
                                        className=" focus:outline-none border-b-[1px] text-sm p-2 w-full focus-visible:outline-none"
                                        placeholder="Tên danh mục"
                                    />
                                    <ErrorMessage name="name" component="p" className="text-error text-xs" />
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
                            </div>
                        </Form>
                    )}
                </Formik>
            </Modal>
        </AdminLayout>
    );
}

export default Categories;

export { getServerSideProps };
