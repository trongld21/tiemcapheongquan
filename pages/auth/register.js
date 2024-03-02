import React, { useState } from 'react';
import { Field, Form, Formik, ErrorMessage } from 'formik';
import { useRouter } from 'next/router';
import jwt from 'jsonwebtoken';
import authenticationApi from '../api/authenticationAPI';
import useNotification from '@/hooks/useNotification';
import UserLayout from '@/components/Layout/UserLayout';
import PrimaryButton from '@/components/Utils/PrimaryButton';
import Thumbnail from '@/components/Utils/Thumbnail';
import { validationCode, validationRegisterForm } from '@/constant';

function RegisterPage() {
    const router = useRouter();
    const [isOpenConfirm, setIsOpenConfirm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isDisable, setIsDisable] = useState(false);
    const [currentData, setCurrentData] = useState({
        name: '',
        email: '',
        password: '',
        passwordConfirmation: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
    const { showSuccess, showWarning } = useNotification();

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const toggleShowPasswordConfirmation = () => {
        setShowPasswordConfirmation(!showPasswordConfirmation);
    };

    const handleRegister = async (values) => {
        try {
            if (values) {
                setIsLoading(true);
                const res = await authenticationApi.Register(values.email, values.password, values.name);
                if (res && res.success) {
                    setCurrentData(values);
                    setIsOpenConfirm(true);
                } else if (res && !res.success) {
                    showWarning(res.message, 'Vui lòng lựa chọn địa chỉ email khác!', 4);
                    setIsLoading(false);
                }
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleSubmitForm = async (values) => {
        handleRegister(values);
    };

    const handleConfirmCode = async (values) => {
        try {
            setIsDisable(true);
            if (values) {
                const res = await authenticationApi.ConfirmMail(currentData.email, values.code);
                if (res && res.success) {
                    showSuccess('Đăng ký tài khoản thành công', 'Bạn sẽ được chuyển hướng đến trang đăng nhập', 4);
                    router.push('/auth/login');
                } else if (res && !res.success) {
                    setIsDisable(false);
                    showWarning(res.message, 'Vui lòng nhập lại mã xác nhận!', 4);
                }
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <UserLayout>
            <Thumbnail title={'Đăng ký'} />
            <div className="flex bg-white w-full my-10">
                <div className="max-sm:w-full md:w-4/5 lg:w-3/5 mx-auto flex max-sm:shadow-none shadow">
                    <section className="w-3/5 max-sm:w-full flex flex-col max-sm:p-8 p-10 gap-6">
                        {!isOpenConfirm ? (
                            <>
                                <div className="flex flex-col gap-4">
                                    <h1 className="font-semibold text-3xl">Đăng ký</h1>
                                    <p className="text-sm text-grey">
                                        Đăng ký để mua và sử dụng đồ nội thất mới nhất từ{' '}
                                        {process.env.NEXT_PUBLIC_DOMAIN}
                                    </p>
                                </div>

                                <Formik
                                    initialValues={{
                                        name: currentData.name,
                                        email: currentData.email,
                                        password: currentData.password,
                                        passwordConfirmation: currentData.passwordConfirmation,
                                    }}
                                    validationSchema={validationRegisterForm}
                                    onSubmit={(values) => {
                                        handleSubmitForm(values);
                                    }}
                                >
                                    <Form className="flex flex-col gap-6">
                                        <section className="w-full">
                                            <Field
                                                name="name"
                                                className="border-t-0 w-full border-l-0 border-r-0 border focus:outline-none text-sm py-1 px-2 border-black focus-visible:outline-none"
                                                placeholder="Họ và tên"
                                            />
                                            <ErrorMessage name="name" component="p" className="text-error text-xs" />
                                        </section>

                                        <section className="w-full">
                                            <Field
                                                type="text"
                                                name="email"
                                                className="border-t-0 border-l-0 border-r-0 w-full focus:outline-none text-sm py-1 px-2 border-black focus-visible:outline-none"
                                                placeholder="Địa chỉ email"
                                            />
                                            <ErrorMessage name="email" component="p" className="text-error text-xs" />
                                        </section>

                                        <section className="relative">
                                            <Field
                                                type={showPassword ? 'text' : 'password'}
                                                name="password"
                                                className="border-t-0 border-l-0 w-full border-r-0 focus:outline-none text-sm py-1 px-2 border-black focus-visible:outline-none"
                                                placeholder="Mật khẩu"
                                            />
                                            <ErrorMessage
                                                name="password"
                                                component="p"
                                                className="text-error text-xs"
                                            />
                                            <button
                                                type="button"
                                                className="absolute top-[6px] right-2 cursor-pointer"
                                                onClick={toggleShowPassword}
                                            >
                                                {showPassword ? (
                                                    <img src="/assets/svg/eye_icon_show.svg" className="w-5 h-w-5" />
                                                ) : (
                                                    <img src="/assets/svg/eye_icon_hide.svg" className="w-5 h-w-5" />
                                                )}
                                            </button>
                                        </section>

                                        <section className="relative">
                                            <Field
                                                type={showPasswordConfirmation ? 'text' : 'password'}
                                                name="passwordConfirmation"
                                                className="border-t-0 border-l-0 w-full border-r-0 focus:outline-none text-sm py-1 px-2 border-black focus-visible:outline-none"
                                                placeholder="Xác nhận mật khẩu"
                                            />
                                            <ErrorMessage
                                                name="passwordConfirmation"
                                                component="p"
                                                className="text-error text-xs"
                                            />
                                            <button
                                                type="button"
                                                className="absolute top-[6px] right-2 cursor-pointer"
                                                onClick={toggleShowPasswordConfirmation}
                                            >
                                                {showPasswordConfirmation ? (
                                                    <img src="/assets/svg/eye_icon_show.svg" className="w-5 h-w-5" />
                                                ) : (
                                                    <img src="/assets/svg/eye_icon_hide.svg" className="w-5 h-w-5" />
                                                )}
                                            </button>
                                        </section>

                                        <div className="flex flex-col gap-2">
                                            <PrimaryButton
                                                active={!isLoading}
                                                content={'Đăng ký'}
                                                classCss={'border-black rounded border w-fit px-5 py-1 mx-auto'}
                                                type={'submit'}
                                            />
                                            <p className="text-center text-sm text-grey">
                                                Bạn đã có tài khoản?{' '}
                                                <b
                                                    className="font-medium underline cursor-pointer"
                                                    onClick={() => router.push('/auth/login')}
                                                >
                                                    Đăng nhập
                                                </b>
                                            </p>
                                        </div>
                                    </Form>
                                </Formik>
                            </>
                        ) : (
                            <div className="flex flex-col gap-10 w-10/12 max-sm:w-full">
                                <button
                                    className="w-fit flex items-center gap-2 font-bold uppercase"
                                    onClick={() => {
                                        setIsOpenConfirm(false);
                                        setIsLoading(false);
                                    }}
                                >
                                    <img src="/assets/svg/arrow_left.svg" alt="arrow icon" />
                                    <p>Quay lại</p>
                                </button>
                                <div className="flex flex-col gap-4 h-full justify-center">
                                    <h1 className="text-3xl font-bold">Nhập mã xác nhận</h1>
                                    <h3 className="text-sm font-semibold text-grey">
                                        Vui lòng nhập mã xác nhận được gửi vào địa chỉ email {currentData.email}*
                                    </h3>
                                    <Formik
                                        initialValues={{
                                            code: '',
                                        }}
                                        validationSchema={validationCode}
                                        onSubmit={(values) => {
                                            handleConfirmCode(values);
                                        }}
                                    >
                                        <Form className="flex flex-col gap-6">
                                            <section className="w-full">
                                                <Field
                                                    name="code"
                                                    className="border-t-0 w-full border-l-0 border-r-0 border focus:outline-none text-sm py-1 px-2 border-black focus-visible:outline-none"
                                                    placeholder="Mã xác nhận"
                                                />
                                                <ErrorMessage
                                                    name="code"
                                                    component="p"
                                                    className="text-error text-xs"
                                                />
                                            </section>
                                            <PrimaryButton
                                                content={'Xác nhận'}
                                                classCss={'border-black rounded border w-fit px-5 py-1 mx-auto'}
                                                type={'submit'}
                                                active={!isDisable}
                                            />
                                        </Form>
                                    </Formik>
                                </div>
                            </div>
                        )}
                    </section>

                    <section className="w-2/5 max-sm:hidden">
                        <img
                            className="w-full h-full object-cover"
                            src="/assets/images/login_thumbnail2.png"
                            alt="Login thumbnail"
                        />
                    </section>
                </div>
            </div>
        </UserLayout>
    );
}

export default RegisterPage;
