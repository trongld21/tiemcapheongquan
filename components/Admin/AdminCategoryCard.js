import { validationCategory } from '@/constant';
import useNotification from '@/hooks/useNotification';
import managerCategoryAPI from '@/pages/api/manager/managerCategoryAPI';
import { Modal, message } from 'antd';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { getDownloadURL, ref, uploadBytes } from '@firebase/storage';
import { storage } from '@/firebase';

function AdminCategoryCard({ id, title, image, onDeleteClick, fetchData }) {
    const { showError, showSuccess } = useNotification();
    const [messageApi, contextHolder] = message.useMessage();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDisable, setIsDisable] = useState(false);
    const [imageUpload, setImageUpload] = useState(image);
    const formikEditRef = useRef();
    const fileInputRef = useRef();

    const InitialValue = { name: title, image: image };

    const handleClickUpload = () => {
        fileInputRef.current.click();
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        formikEditRef.current.resetForm();
        setImageUpload(image);
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
                let imageUrl = values.image;
                if (imageUrl !== null) {
                    if (imageUrl !== imageUpload) {
                        imageUrl = await handleUploadImage(values?.image);
                    }
                    const res = await managerCategoryAPI.Update(id, values?.name, imageUrl);
                    if (res && res.success) {
                        setIsModalOpen(false);
                        showSuccess(
                            'Cập nhật danh mục thành công',
                            'Danh mục sẽ được thay đổi trong danh sách danh mục',
                            3,
                        );
                        setIsDisable(false);
                        fetchData();
                    } else {
                        showError('Cập nhật danh mục thất bại', res.message, 5);
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

    return (
        <div className="relative group">
            <div className="flex flex-col group-hover:opacity-30 gap-10 justify-center items-center relative p-4 rounded-md border-dashed border-2 w-full">
                <img className="h-20 w-20 rounded-10" src={image} alt="image" />
                <p className="text-secondary text-lg font-semibold line-clamp-1">{title}</p>
            </div>
            <button
                onClick={() => setIsModalOpen(true)}
                className="group-hover:flex bottom-0 left-0 right-0 top-0 m-auto w-fit h-fit group-hover:opacity-100 hidden absolute gap-2 justify-center items-center bg-black text-white px-2.5 py-1.5 rounded-md"
            >
                <img src="/assets/svg/pencil_white.svg" className="w-6 h-6" alt="icon" />
                <p className="font-semibold text-base">Chỉnh sửa</p>
            </button>
            <button
                onClick={onDeleteClick}
                className="group-hover:flex bottom-0 left-0 right-0 top-24 m-auto w-fit h-fit group-hover:opacity-100 hidden absolute gap-2 justify-center items-center bg-black text-white px-2.5 py-1.5 rounded-md"
            >
                <img src="/assets/svg/delete_icon_white.svg" className="w-6 h-6" alt="icon" />
                <p className="font-semibold text-base">Xoá</p>
            </button>
            {contextHolder}
            <Modal
                title={'Chỉnh sửa danh mục'}
                open={isModalOpen}
                onCancel={handleCancel}
                footer={[
                    <button
                        form={id}
                        className="bg-secondary text-white px-5 rounded py-1.5 mt-4"
                        key="submit"
                        htmltype="submit"
                        disabled={isDisable}
                        type="submit"
                    >
                        Cập nhật
                    </button>,
                ]}
            >
                <Formik
                    initialValues={InitialValue}
                    validationSchema={validationCategory}
                    onSubmit={(values) => {
                        handleCreateCategory(values);
                    }}
                    innerRef={formikEditRef}
                >
                    {({ setFieldValue }) => (
                        <Form className="flex flex-col gap-3 w-full" id={id}>
                            <div className="flex w-full my-2 max-sm:flex-col max-sm:gap-4 flex-col gap-4">
                                <section className="w-full">
                                    <p className="font-bold">Tên danh mục</p>
                                    <Field
                                        name="name"
                                        className=" focus:outline-none rounded-10 border-secondary text-sm p-2 w-full focus-visible:outline-none"
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
                                            accept="image/*"
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
        </div>
    );
}

export default AdminCategoryCard;
