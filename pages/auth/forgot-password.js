import UserLayout from '@/components/Layout/UserLayout';
import BackButton from '@/components/Utils/BackButton';
import PrimaryButton from '@/components/Utils/PrimaryButton';
import Thumbnail from '@/components/Utils/Thumbnail';
import { validationEmail, validationForgot } from '@/constant';
import useNotification from '@/hooks/useNotification';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import jwt from 'jsonwebtoken';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';
import authenticationApi from '../api/authenticationAPI';

const ForgotPassword = () => {
    const router = useRouter();
    const formikRef = useRef();
    const confirmRef = useRef();
    const [isOpenConfirm, setIsOpenConfirm] = useState(false);
    const [isDisable, setIsDisable] = useState(false);
    const [currentData, setCurrentData] = useState({
        email: '',
    });
    const { showError, showSuccess, showWarning } = useNotification();

    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const toggleShowPasswordConfirmation = () => {
        setShowPasswordConfirmation(!showPasswordConfirmation);
    };

    // function to handle request forgot
    const handleRequestForgot = async (values) => {
        setIsDisable(true);
        try {
            const res = await authenticationApi.ForgotPassword(values.email);
            if (res && res.success) {
                setCurrentData(values);
                setIsOpenConfirm(true);
                setIsDisable(false);
            } else if (res && !res.success) {
                formikRef.current.resetForm();
                setIsDisable(false);
                showWarning('Thất bại', res?.message, 3);
            } else {
                formikRef.current.resetForm();
                setIsDisable(false);
                showError(
                    'Thất bại',
                    'Có lỗi xảy ra trong quá trình xử lý. Vui lòng liên hệ với chúng tôi để được hỗ trợ',
                    3,
                );
            }
        } catch (error) {
            console.log('🚀 ~ file: forgot-password.js:62 ~ handleRequestForgot ~ error:', error);
        }
    };

    // handle confirm code
    const handleConfirmCode = async (values) => {
        try {
            setIsDisable(true);
            // Check values is valid
            if (values) {
                const res = await authenticationApi.ConfirmForgotPassword(
                    currentData.email,
                    values.password,
                    values.code,
                );
                if (res && res.success) {
                    showSuccess('Đặt lại mật khẩu thành công', 'Bạn sẽ được chuyển hướng đến trang đăng nhập', 4);
                    router.push('/auth/login');
                    setIsDisable(false);
                } else if (res && !res.success) {
                    confirmRef.current.resetForm();
                    setIsDisable(false);
                    showWarning(res.message, 'Vui lòng nhập lại mã xác nhận!', 5);
                } else {
                    confirmRef.current.resetForm();
                    setIsDisable(false);
                    showError(
                        'Thất bại',
                        'Có lỗi xảy ra trong quá trình xử lý. Vui lòng liên hệ với chúng tôi để được hỗ trợ',
                        5,
                    );
                }
            }
        } catch (error) {
            console.log('🚀 ~ file: [productSlug].js:491 ~ fetchProductData ~ error:', error);
        }
    };

    return (
        <UserLayout>
            <Thumbnail title={'Quên mật khẩu'} />
            <div className="flex bg-white w-full my-10">
                <div className="max-sm:w-full md:w-4/5 lg:w-3/5 mx-auto flex max-sm:shadow-none shadow">
                    <section className="w-3/5 max-sm:w-full flex flex-col max-sm:p-8 p-10 gap-6">
                        {!isOpenConfirm ? (
                            <>
                                <BackButton title={'Quay lại trang đăng nhập'} />
                                <div className="flex flex-col gap-4">
                                    <h1 className="font-semibold text-3xl">Quên Mật Khẩu</h1>
                                    <p className="text-sm text-grey">
                                        Nhập email của bạn cho quá trình xác minh, chúng tôi sẽ gửi mã xác nhận vào
                                        email của bạn.
                                    </p>
                                </div>

                                <Formik
                                    initialValues={{
                                        email: currentData.email,
                                    }}
                                    validationSchema={validationEmail}
                                    onSubmit={(values) => {
                                        handleRequestForgot(values);
                                    }}
                                    innerRef={formikRef}
                                >
                                    <Form className="flex flex-col gap-6">
                                        <section className="w-full">
                                            <Field
                                                type="text"
                                                name="email"
                                                className="border-t-0 border-l-0 border-r-0 w-full focus:outline-none text-sm py-1 px-2 border-black focus-visible:outline-none"
                                                placeholder="Địa chỉ email"
                                            />
                                            <ErrorMessage name="email" component="p" className="text-error text-xs" />
                                        </section>

                                        <div className="flex flex-col gap-2">
                                            <PrimaryButton
                                                active={!isDisable}
                                                content={'Xác nhận'}
                                                classCss={'border-black rounded border w-fit px-5 py-1 mx-auto'}
                                                type={'submit'}
                                            />
                                            <p className="text-center text-sm text-grey">
                                                Bạn chưa có tài khoản?
                                                <b
                                                    className="ml-2 font-medium underline cursor-pointer"
                                                    onClick={() => router.push('/auth/register')}
                                                >
                                                    Đăng ký tài khoản
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
                                        setIsDisable(false);
                                        setIsOpenConfirm(false);
                                    }}
                                >
                                    <img src="/assets/svg/arrow_left.svg" alt="arrow icon" />
                                    <p>Quay lại</p>
                                </button>
                                <div className="flex flex-col gap-4 h-full justify-center">
                                    <h1 className="text-3xl font-bold">Nhập mật khẩu mới</h1>
                                    <h3 className="text-sm font-semibold text-grey">
                                        Vui lòng nhập mã xác nhận được gửi vào địa chỉ email
                                        {currentData.email}*
                                    </h3>
                                    <Formik
                                        initialValues={{
                                            password: '',
                                            passwordConfirmation: '',
                                            code: '',
                                        }}
                                        validationSchema={validationForgot}
                                        onSubmit={(values) => {
                                            handleConfirmCode(values);
                                        }}
                                        innerRef={confirmRef}
                                    >
                                        <Form className="flex flex-col gap-6">
                                            <section className="relative">
                                                <Field
                                                    type={showPassword ? 'text' : 'password'}
                                                    name="password"
                                                    className="border-t-0 border-l-0 w-full border-r-0 focus:outline-none text-sm py-1 px-2 border-black focus-visible:outline-none "
                                                    placeholder="Mật khẩu mới"
                                                />
                                                <ErrorMessage
                                                    name="password"
                                                    component="p"
                                                    className="text-error text-xs"
                                                />
                                                <button
                                                    type="button"
                                                    className="absolute top-[0.25rem] right-2 cursor-pointer"
                                                    onClick={toggleShowPassword}
                                                >
                                                    {showPassword ? (
                                                        <img
                                                            src="/assets/svg/eye_icon_show.svg"
                                                            className="w-5 h-w-5"
                                                        />
                                                    ) : (
                                                        <img
                                                            src="/assets/svg/eye_icon_hide.svg"
                                                            className="w-5 h-w-5"
                                                        />
                                                    )}
                                                </button>
                                            </section>
                                            <section className="relative">
                                                <Field
                                                    type={showPasswordConfirmation ? 'text' : 'password'}
                                                    name="passwordConfirmation"
                                                    className="border-t-0 border-l-0 w-full border-r-0 focus:outline-none text-sm py-1 px-2 border-black focus-visible:outline-none "
                                                    placeholder="Xác nhận mật khẩu mới"
                                                />
                                                <ErrorMessage
                                                    name="passwordConfirmation"
                                                    component="p"
                                                    className="text-error text-xs"
                                                />
                                                <button
                                                    type="button"
                                                    className="absolute top-[0.25rem] right-2 cursor-pointer"
                                                    onClick={toggleShowPasswordConfirmation}
                                                >
                                                    {showPasswordConfirmation ? (
                                                        <img
                                                            src="/assets/svg/eye_icon_show.svg"
                                                            className="w-5 h-w-5"
                                                        />
                                                    ) : (
                                                        <img
                                                            src="/assets/svg/eye_icon_hide.svg"
                                                            className="w-5 h-w-5"
                                                        />
                                                    )}
                                                </button>
                                            </section>
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
                                                active={!isDisable}
                                                classCss={'border-black rounded border w-fit px-5 py-1 mx-auto'}
                                                type={'submit'}
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
};

export default ForgotPassword;

export async function getServerSideProps(context) {
    // Get cookie in the context
    const cookies = context.req.headers.cookie;
    // Filter cookies to get access token
    const parseCookies = (cookie) =>
        cookie.split('; ').reduce((acc, cookie) => {
            const [key, value] = cookie.split('=');
            acc[key] = value;
            return acc;
        }, {});
    if (cookies) {
        const cookiesObj = parseCookies(cookies);
        const access_token = cookiesObj['access_token'];
        // Decode token to user info
        const userInfo = jwt.decode(access_token);
        // Check author based role
        if (userInfo && userInfo.role === 'Customer') {
            return {
                props: {},
                redirect: {
                    destination: '/', // Redirect to the login page or any other page you prefer
                    permanent: false,
                },
            };
        } else if (userInfo && userInfo.role === 'Admin') {
            return {
                redirect: {
                    destination: '/admin', // Redirect to the login page or any other page you prefer
                    permanent: false,
                },
            };
        }
    }
    // If token in not valid redirect to login
    return {
        props: {},
    };
}
