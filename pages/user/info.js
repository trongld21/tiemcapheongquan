import UserLayout from '@/components/Layout/UserLayout';
import Thumbnail from '@/components/Utils/Thumbnail';
import UserSideBar from '@/components/Utils/UserSideBar';

import { useEffect, useRef, useState } from 'react';

import PrimaryButton from '@/components/Utils/PrimaryButton';
import { optionGender, validationChangePassword, validationUserInfo } from '@/constant';
import { storage } from '@/firebase';
import useNotification from '@/hooks/useNotification';
import getServerSideProps from '@/lib/userServerProps';
import { getDownloadURL, ref, uploadBytes } from '@firebase/storage';
import { DatePicker, Modal, Select, Upload, message } from 'antd';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import apiUser from '../api/user/apiUser';
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const { Dragger } = Upload;

function Information() {
    const [messageApi, contextHolder] = message.useMessage();
    const { showError, showSuccess } = useNotification();
    const [data, setData] = useState();
    const [countdown, setCountdown] = useState(0);
    const [isCounting, setIsCounting] = useState(false);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [imageUrl, setImageUrl] = useState();
    const [userInfo, setUserInfo] = useState();
    const [isEdit, setIsEdit] = useState(false);
    const [selectedFile, setSelectedFile] = useState();
    const [select, setSelect] = useState();
    const [disableButtonRequest, setDisableButtonRequest] = useState(false);
    const formikRef = useRef();
    const dateFormat = 'YYYY-MM-DD';
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif']; // Các định dạng hình ảnh cho phép

    const [showOldPassword, setShowOldPassword] = useState(false);
    const toggleShowOldPassword = () => {
        setShowOldPassword(!showOldPassword);
    };

    const [showNewPassword, setShowNewPassword] = useState(false);
    const toggleShowNewPassword = () => {
        setShowNewPassword(!showNewPassword);
    };

    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const toggleShowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

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
            setImageUrl(info.file);
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

    // Fetch data initial
    const fetchData = async () => {
        const response = await apiUser.GetInfo();
        if (response && response.success === true) {
            setData(response.data);
        }
    };

    // Call initial data
    useEffect(() => {
        fetchData();
    }, []);

    // Change initial data after call data
    useEffect(() => {
        if (data) {
            setUserInfo(data);
            setSelect(data.gender);
        }
    }, [data]);

    // Function to handle upload image into firebase and return a url to storage in database
    const handleUploadImage = async (file) => {
        // random id to avoid image name exist
        const id = uuidv4();
        // Connect to firebase storage
        const imageRef = ref(storage, `avatars/${id}`);
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

    const handleSubmitForm = async (values) => {
        try {
            let image = userInfo.avatarUrl;
            if (imageUrl) {
                image = await handleUploadImage(imageUrl);
            }

            const dataUpdate = {
                fullName: values.fullName,
                email: values.email,
                phone: values.phone,
                gender: values.gender,
                birthDay: values.birthDay,
                avatarUrl: image,
            };
            const res = await apiUser.UpdateInfo(dataUpdate);
            console.log('🚀 ~ file: info.js:88 ~ handleSubmitForm ~ res:', res);
            if (res && res.success === true) {
                fetchData();
                messageApi.open({
                    type: 'success',
                    content: 'Cập nhật thông tin người dùng thành công',
                });
                setIsEdit(false);
            } else {
                showError('Cập nhật thông tin thất bại', res.data.message);
            }
        } catch (error) {
            console.log('🚀 ~ file: create.js:112 ~ handleCreateArticle ~ error:', error);
        }
    };

    const convertGender = (value) => {
        if (value === 'Male') {
            return 'Nam';
        } else if (value === 'Female') {
            return 'Nữ';
        }
        return 'Khác';
    };

    const handleCancel = () => {
        setIsOpenModal(false);
        formikRef.current.resetForm();
    };

    const handleRequestChangePassword = async () => {
        setIsOpenModal(true);
    };

    const handleRequestCode = async () => {
        setIsCounting(true);
        setCountdown(60); // Start countdown
        const res = await apiUser.RequestChangePassword();
        if (res && !res.success) {
            showError('Lỗi nhận mã xác nhận', res.message, 3);
        } else {
            showSuccess('Gửi mã xác nhận thành công', 'Mã xác nhận sẽ được gửi vào mail', 5);
        }
    };

    const handleChangePassword = async (values) => {
        setDisableButtonRequest(true);
        const res = await apiUser.ChangePassword(values.oldPassword, values.newPassword, values.code);
        if (res && res.success) {
            messageApi.open({
                type: 'success',
                content: 'Cập nhật mật khẩu thành công',
            });
            formikRef.current.resetForm();
            setIsOpenModal(false);
        } else {
            setDisableButtonRequest(false);
            showError('Cập nhật thất bại', res?.message);
        }
    };

    useEffect(() => {
        let interval;
        if (countdown > 0) {
            interval = setInterval(() => {
                setCountdown((prevCountdown) => prevCountdown - 1);
            }, 1000);
        }

        if (countdown === 0) {
            setIsCounting(false); // Khi thời gian đếm ngược kết thúc, enable nút lại
        }

        return () => {
            clearInterval(interval);
        };
    }, [countdown]);

    return (
        <UserLayout>
            <Thumbnail title={'Hồ sơ'} />
            <UserSideBar>
                {contextHolder}
                <div className="lg:w-10/12 w-11/12 mx-auto max-sm:gap-4 gap-10 flex flex-col">
                    <div className="flex gap-6 w-full items-center avatar-wrapper">
                        <Dragger {...props} disabled={!isEdit}>
                            {!!selectedFile ? (
                                <img src={selectedFile} alt="Thumbnail" className="w-28 h-28 rounded-full" />
                            ) : !!userInfo?.avatarUrl ? (
                                <img src={userInfo.avatarUrl} alt="Thumbnail" className="w-28 h-28 rounded-full" />
                            ) : (
                                <img
                                    src="/assets/svg/logo_white.svg"
                                    alt="Thumbnail"
                                    className="w-28 h-28 rounded-full"
                                />
                            )}
                        </Dragger>
                        <h2 className="font-bold text-2xl max-sm:text-lg">{userInfo?.fullName}</h2>
                    </div>
                    {userInfo && (
                        <Formik
                            initialValues={{
                                fullName: userInfo?.fullName,
                                phone: data?.phone,
                                birthDay: data?.birthDay ? moment(data.birthDay, dateFormat) : null,
                                email: data?.email,
                                gender: data?.gender,
                            }}
                            validationSchema={validationUserInfo}
                            onSubmit={(values) => {
                                handleSubmitForm(values);
                            }}
                        >
                            {({ setFieldValue, resetForm }) => (
                                <>
                                    <Form className="flex flex-col gap-3 w-full" id="userInfoForm">
                                        <section className="flex w-full lg:my-2 gap-4 lg:gap-16 lg:flex-row flex-col max-sm:gap-4">
                                            <div className="w-full lg:w-2/5 flex items-center">
                                                <label className="font-semibold text-sm lg:text-base w-2/5">
                                                    Họ và tên:
                                                </label>
                                                <div className="w-2/5">
                                                    <Field
                                                        name="fullName"
                                                        disabled={!isEdit}
                                                        className=" focus:outline-none border-t-0 truncate border-l-0 w-full border-b disabled:border-none border-r-0 text-sm p-0 border-black focus-visible:outline-none bg-white"
                                                        placeholder="Họ và tên"
                                                    />
                                                    <ErrorMessage
                                                        name="fullName"
                                                        component="p"
                                                        className="text-error text-xs"
                                                    />
                                                </div>
                                            </div>
                                            <div className="w-full lg:w-2/5 flex items-center">
                                                <label className="font-semibold text-sm lg:text-base w-2/5">
                                                    Ngày sinh:
                                                </label>
                                                <div className="w-2/5">
                                                    {isEdit ? (
                                                        // <Field name="birthDay">
                                                        //     {({ field }) => (
                                                        //         <>
                                                        //             <DatePicker
                                                        //                 id="dob"
                                                        //                 {...field}
                                                        //                 className="bg-white"
                                                        //                 // format="YYYY-MM-DD"
                                                        //                 onChange={(value) => {
                                                        //                     console.log(
                                                        //                         '🚀 ~ file: info.js:215 ~ Information ~ value:',
                                                        //                         value,
                                                        //                     );
                                                        //                     setFieldValue('birthDay', value); // Set the value using setFieldValue
                                                        //                 }}
                                                        //             />
                                                        //         </>
                                                        //     )}
                                                        // </Field>
                                                        <input
                                                            type="date"
                                                            id="dob"
                                                            defaultValue={moment(data?.birthDay).format('YYYY-MM-DD')}
                                                            className="rounded-10 border-[#d9d9d9] border-opacity-50 text-sm"
                                                            onChange={(event) => {
                                                                console.log(
                                                                    '🚀 ~ file: info.js:300 ~ Information ~ event:',
                                                                    event.target.value,
                                                                );
                                                                return setFieldValue('birthDay', event.target.value);
                                                            }}
                                                            name="birthDay"
                                                        />
                                                    ) : (
                                                        <p className="flex w-full text-sm">
                                                            {data?.birthDay
                                                                ? moment(data?.birthDay).format('MM/DD/YYYY')
                                                                : 'Chưa cung cấp'}
                                                        </p>
                                                    )}
                                                    <ErrorMessage
                                                        name="birthDay"
                                                        component="p"
                                                        className="text-error text-xs w-full"
                                                    />
                                                </div>
                                            </div>
                                        </section>
                                        <section className="flex w-full lg:my-2 gap-4 lg:gap-16 lg:flex-row flex-col max-sm:gap-4">
                                            <div className="w-full lg:w-2/5 flex items-center">
                                                <label className="font-semibold text-sm lg:text-base w-2/5">
                                                    Số điện thoại:
                                                </label>
                                                {isEdit ? (
                                                    <div className="w-2/5">
                                                        <Field
                                                            name="phone"
                                                            disabled={!isEdit}
                                                            className=" focus:outline-none border-t-0 truncate border-l-0 w-full border-b disabled:border-none border-r-0 text-sm p-0 border-black focus-visible:outline-none bg-white"
                                                            placeholder="Số điện thoại"
                                                        />
                                                        <ErrorMessage
                                                            name="phone"
                                                            component="p"
                                                            className="text-error text-xs"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="w-2/5">
                                                        <p className="flex w-full text-sm">
                                                            {data?.phone ? data?.phone : 'Chưa cung cấp'}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="w-full lg:w-2/5 flex items-center">
                                                <label className="font-semibold text-sm lg:text-base w-2/5">
                                                    Giới tính
                                                </label>
                                                {isEdit ? (
                                                    <Field name="gender">
                                                        {({ field }) => (
                                                            <Select
                                                                defaultValue={select || 'Other'}
                                                                {...field}
                                                                style={{
                                                                    width: 120,
                                                                }}
                                                                onChange={(value) => {
                                                                    setFieldValue('gender', value);
                                                                }}
                                                                options={optionGender}
                                                            />
                                                        )}
                                                    </Field>
                                                ) : (
                                                    <p className="flex w-fit text-sm ">
                                                        {convertGender(userInfo?.gender) || 'Khác'}
                                                    </p>
                                                )}
                                            </div>
                                        </section>
                                        <section className="flex w-full lg:my-2 gap-4 lg:gap-16 lg:flex-row flex-col max-sm:gap-4">
                                            <div className="w-full lg:w-2/5 flex items-center">
                                                <label className="font-semibold text-sm lg:text-base w-2/5">
                                                    Địa chỉ email:
                                                </label>
                                                <div className="w-2/5">
                                                    <Field
                                                        name="email"
                                                        disabled={true}
                                                        className=" focus:outline-none border-t-0 truncate border-l-0 w-full border-b disabled:border-none border-r-0 text-sm p-0 border-black focus-visible:outline-none bg-white"
                                                        placeholder="Địa chỉ email"
                                                    />
                                                    <ErrorMessage
                                                        name="email"
                                                        component="p"
                                                        className="text-error text-xs"
                                                    />
                                                </div>
                                            </div>
                                        </section>
                                    </Form>
                                    {!isEdit ? (
                                        <div className="flex max-sm:gap-4 gap-10">
                                            <PrimaryButton
                                                content={'Cập nhật thông tin'}
                                                id="btn-update-info"
                                                classCss={
                                                    'max-sm:px-2 max-sm:py-1.5 px-4 py-2 border font-bold max-sm:text-xs text-sm text-white bg-secondary w-fit'
                                                }
                                                onClick={() => setIsEdit(!isEdit)}
                                            />
                                            <PrimaryButton
                                                content={'Thay đổi mật khẩu'}
                                                id="btn-change-password"
                                                classCss={
                                                    'max-sm:px-2 max-sm:py-1.5 px-4 py-2 border font-bold max-sm:text-xs text-sm text-secondary bg-transparent w-fit'
                                                }
                                                onClick={() => handleRequestChangePassword()}
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex gap-4">
                                            <button
                                                onClick={() => {
                                                    setIsEdit(false);
                                                    resetForm(); // Reset lại form
                                                    setSelectedFile();
                                                }}
                                                className="px-4 py-2 border font-bold text-sm text-secondary bg-transparent w-fit uppercase rounded disabled:opacity-40"
                                            >
                                                Quay lại
                                            </button>
                                            <button
                                                form="userInfoForm"
                                                type="submit"
                                                className="px-4 py-2 border font-bold text-sm text-white bg-secondary w-fit uppercase rounded disabled:opacity-40"
                                            >
                                                Cập nhật
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </Formik>
                    )}
                </div>
                <Modal
                    title="Thay đổi mật khẩu"
                    open={isOpenModal}
                    width={400}
                    onCancel={handleCancel}
                    footer={[
                        <button
                            disabled={disableButtonRequest}
                            form="ChangePassword"
                            className="bg-secondary text-white px-5 rounded py-1.5 mt-4"
                            key="submit"
                            htmltype="submit"
                            type="submit"
                        >
                            Đặt mật khẩu
                        </button>,
                    ]}
                >
                    <Formik
                        initialValues={{ oldPassword: '', newPassword: '', passwordConfirmation: '', code: '' }}
                        validationSchema={validationChangePassword}
                        onSubmit={(values) => {
                            handleChangePassword(values);
                        }}
                        innerRef={formikRef}
                    >
                        <Form className="flex flex-col gap-4" id="ChangePassword">
                            <div className="flex flex-col gap-1 relative">
                                <Field
                                    type={showOldPassword ? 'text' : 'password'}
                                    name="oldPassword"
                                    className="w-full rounded-50 border-2 border-secondary text-sm focus:outline-none"
                                    placeholder="Nhập mật khẩu cũ"
                                />
                                <ErrorMessage name="oldPassword" component="p" className="text-error text-xs" />
                                <button
                                    type="button"
                                    className="absolute top-[0.6rem] right-2 cursor-pointer"
                                    onClick={toggleShowOldPassword}
                                >
                                    {showOldPassword ? (
                                        <img src="/assets/svg/eye_icon_show.svg" className="w-5 h-w-5" />
                                    ) : (
                                        <img src="/assets/svg/eye_icon_hide.svg" className="w-5 h-w-5" />
                                    )}
                                </button>
                            </div>
                            <div className="flex flex-col gap-1 relative">
                                <Field
                                    type={showNewPassword ? 'text' : 'password'}
                                    name="newPassword"
                                    className="w-full rounded-50 border-2 border-secondary text-sm"
                                    placeholder="Nhập mật khẩu mới"
                                />
                                <ErrorMessage name="newPassword" component="p" className="text-error text-xs" />
                                <button
                                    type="button"
                                    className="absolute top-[0.6rem] right-2 cursor-pointer"
                                    onClick={toggleShowNewPassword}
                                >
                                    {showNewPassword ? (
                                        <img src="/assets/svg/eye_icon_show.svg" className="w-5 h-w-5" />
                                    ) : (
                                        <img src="/assets/svg/eye_icon_hide.svg" className="w-5 h-w-5" />
                                    )}
                                </button>
                            </div>
                            <div className="flex flex-col gap-1 relative">
                                <Field
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="passwordConfirmation"
                                    className="w-full rounded-50 border-2 border-secondary text-sm"
                                    placeholder="Nhập lại mật khẩu mới"
                                />
                                <ErrorMessage
                                    name="passwordConfirmation"
                                    component="p"
                                    className="text-error text-xs"
                                />
                                <button
                                    type="button"
                                    className="absolute top-[0.6rem] right-2 cursor-pointer"
                                    onClick={toggleShowConfirmPassword}
                                >
                                    {showConfirmPassword ? (
                                        <img src="/assets/svg/eye_icon_show.svg" className="w-5 h-w-5" />
                                    ) : (
                                        <img src="/assets/svg/eye_icon_hide.svg" className="w-5 h-w-5" />
                                    )}
                                </button>
                            </div>
                            <div className="flex flex-col gap-1 relative">
                                <Field
                                    type="text"
                                    name="code"
                                    className="w-full rounded-50 border-2 border-secondary text-sm"
                                    placeholder="Nhập mã xác nhận"
                                />
                                <ErrorMessage name="code" component="p" className="text-error text-xs" />
                                <button
                                    type="button"
                                    className="absolute px-2 py-1 right-1 top-1 bg-secondary text-white rounded-50"
                                    onClick={() => handleRequestCode()}
                                    disabled={isCounting}
                                >
                                    {isCounting ? `${countdown} giây` : 'Gửi mã'}
                                </button>
                            </div>
                        </Form>
                    </Formik>
                </Modal>
            </UserSideBar>
        </UserLayout>
    );
}

export default Information;

export { getServerSideProps };
