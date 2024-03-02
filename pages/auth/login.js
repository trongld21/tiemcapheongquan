import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
// Custom Hook
import { useCookie } from '@/hooks/useCookie';
// Api component
// import apiUser from '../api/user/apiUser';
import authenticationApi from '../api/authenticationAPI';
// Component
import UserLayout from '@/components/Layout/UserLayout';
import Thumbnail from '@/components/Utils/Thumbnail';
import PrimaryButton from '@/components/Utils/PrimaryButton';
// Component validate form
import * as Yup from 'yup';
import { ErrorMessage, Field, Form, Formik } from 'formik';
//Component toast message
import useNotification from '@/hooks/useNotification';
// Json
import jwt from 'jsonwebtoken';

const LoginPage = () => {
    const { showError, showSuccess } = useNotification();
    const { setCookie, getCookie } = useCookie();
    const [isDisable, setIsDisable] = useState(false);
    const router = useRouter();
    const isLogged = getCookie('access_token');
    useEffect(() => {}, [isLogged, router]);
    const [showPassword, setShowPassword] = useState(false);
    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };
    // Check validate form
    const validation = Yup.object({
        email: Yup.string()
            .trim()
            .required('Vui lòng nhập địa chỉ email')
            .email('Định dạng email không đúng')
            .max(100, 'Địa chỉ email nhiều nhất 100 ký tự'),
        password: Yup.string()
            .trim()
            .required('Vui lòng nhập mật khẩu')
            .min(7, 'Mật khẩu ít nhất 7 ký tự')
            .max(20, 'Mật khẩu nhiều nhất 20 ký tự'),
    });

    // Function to handle submit call api
    const handleSubmitForm = async (values) => {
        setIsDisable(true);
        const res = await authenticationApi.Login(values.email, values.password);
        // console.log('🚀 ~ file: login.js:41 ~ handleSubmitForm ~ res:', res);
        if (res && res.success === true) {
            showSuccess('Đăng nhập thành công', 'Bạn sẽ được chuyển hướng đến trang chủ!', 1);
            setCookie('access_token', res.data.accessToken);
            setCookie('refresh_token', res.data.refreshToken);
            if (res.data.role === 'Admin') {
                router.push('/admin');
            } else {
                router.push('/');
            }
        } else if (res && !res.success) {
            setIsDisable(false);
            showError('Đăng nhập thất bại', res?.message, 2);
        } else {
            setIsDisable(false);
            showError('Đăng nhập thất bại', res?.data?.message, 2);
        }
    };

    const handleClickRegister = () => {
        router.push('/auth/register');
    };

    // Check user is logged
    useEffect(() => {
        if (isLogged) {
            router.push('/');
        }
    }, [isLogged, router]);

    return (
        <UserLayout>
            <Thumbnail title={'Đăng nhập'} />
            <div className="flex bg-white w-full my-10">
                <div className="max-sm:w-full md:w-4/5 lg:w-3/5 mx-auto flex max-sm:shadow-none shadow">
                    <section className="w-3/5 max-sm:w-full flex flex-col max-sm:p-8 p-10 gap-10">
                        <div className="flex flex-col gap-4">
                            <h1 className="font-semibold text-3xl">Đăng nhập</h1>
                            <p className="text-sm text-grey">
                                Đăng nhập để mua và sử dụng đồ nội thất mới nhất từ ​{process.env.NEXT_PUBLIC_DOMAIN}
                            </p>
                        </div>

                        <Formik
                            initialValues={{ email: '', password: '' }}
                            validationSchema={validation}
                            onSubmit={(values) => {
                                handleSubmitForm(values);
                            }}
                        >
                            <Form className="flex flex-col gap-1">
                                <Field
                                    type="text"
                                    name="email"
                                    className="border-t-0 border-l-0 border-r-0 focus:outline-none text-sm py-1 px-2 border-black focus-visible:outline-none"
                                    placeholder="Nhập email của bạn..."
                                />
                                <ErrorMessage name="email" component="p" className="text-error text-xs" />

                                {/* <Field
                                    type="password"
                                    name="password"
                                    className="border-t-0 border-l-0 border-r-0 focus:outline-none text-sm py-1 px-2 border-black focus-visible:outline-none mt-6"
                                    placeholder="Nhập mật khẩu của bạn..."
                                /> */}

                                <section className="relative mt-4">
                                    <Field
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        className="border-t-0 border-l-0 w-full border-r-0 focus:outline-none text-sm py-1 px-2 border-black focus-visible:outline-none"
                                        placeholder="Mật khẩu"
                                    />
                                    <button
                                        type="button"
                                        className="absolute top-1/2 right-2 transform -translate-y-1/2 cursor-pointer"
                                        onClick={toggleShowPassword}
                                    >
                                        {showPassword ? (
                                            <img src="/assets/svg/eye_icon_show.svg" className="w-5 h-w-5" />
                                        ) : (
                                            <img src="/assets/svg/eye_icon_hide.svg" className="w-5 h-w-5" />
                                        )}
                                    </button>
                                </section>
                                <ErrorMessage name="password" component="p" className="text-error text-xs" />
                                <div className="w-full justify-end flex">
                                    <Link href="/auth/forgot-password" className="w-fit">
                                        <p className="text-grey my-3 text-sm text-right underline w-fit self-end font-medium">
                                            Quên mật khẩu?
                                        </p>
                                    </Link>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <PrimaryButton
                                        content={'Đăng nhập'}
                                        classCss={'border-black rounded border w-fit px-5 py-1 mx-auto'}
                                        type={'submit'}
                                        active={!isDisable}
                                    />
                                    <p className="text-center text-sm text-grey">
                                        Bạn chưa có tài khoản?
                                        <b
                                            className="ml-2 font-medium underline cursor-pointer"
                                            onClick={handleClickRegister}
                                        >
                                            Đăng ký tài khoản
                                        </b>
                                    </p>
                                </div>
                            </Form>
                        </Formik>
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

export default LoginPage;

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
