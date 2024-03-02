import React, { useState } from 'react';
import Image from 'next/image';
import * as Yup from 'yup';

import Thumbnail from '@/components/Utils/Thumbnail';
import useNotification from '@/hooks/useNotification';

import apiContact from './api/apiContact';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import UserLayout from '@/components/Layout/UserLayout';
import ReCAPTCHA from 'react-google-recaptcha';

function ContactUs() {
    const { showError, showSuccess } = useNotification();
    const recaptchaRef = React.useRef();
    const [initialValues, setInitialValues] = useState({
        name: '',
        mailSender: '',
        content: '',
    });
    // Check validate form
    const validation = Yup.object({
        name: Yup.string()
            .required('Vui lòng nhập học và tên')
            .min(3, 'Họ và tên ít nhất 3 ký tự')
            .max(50, 'Họ và tên nhiều nhất 50 ký tự')
            .matches(/^[a-zA-ZÀ-ỹ ]+$/, 'Họ và tên chỉ chứa ký tự hoa, thường và khoảng trắng'),
        mailSender: Yup.string()
            .required('Vui lòng nhập email')
            .email('Định dạng email không đúng')
            .max(100, 'Địa chỉ email nhiều nhất 100 ký tự'),
        content: Yup.string().required('Vui lòng nhập nội dung').max(2000, 'Nội dung nhiều nhất 2000 kí tự'),
    });

    const handleSubmitForm = async (values) => {
        // Generate ReCaptcha token
        const token = await recaptchaRef.current.executeAsync();
        if (token) {
            const res = await apiContact.GetComment(values.name, values.mailSender, values.content);
            if (res && res.success === true) {
                showSuccess('Đã gửi thành công', ' Cảm ơn vì đã liên hệ', 10);
            } else {
                showError('Gửi bình luận thất bại', 'Hãy thử lại!!!', 1);
            }
        }
    };

    return (
        <UserLayout>
            <Thumbnail title={'Liên hệ'} />
            <section className="xl:my-20 my-10 font-inter mx-auto xl:w-4/6 flex flex-col gap-10 w-5/6">
                <div className="w-full md:flex md:justify-center mt-7 md:items-start flex-wrap gap-2  justify-start items-start ">
                    <div className="col-1/4 flex flex-col flex-1 items-center">
                        <div className="text-2xl font-semibold flex flex-start gap-2 items-center uppercase h-12">
                            {' '}
                            <Image
                                className="text-center location_indicator"
                                alt="svg"
                                src="/assets/svg/address.svg"
                                width={22}
                                height={26}
                            />
                            Địa chỉ
                        </div>
                        <p className="font-medium text-lg text-[#A69689] flex text-center">
                            600 Nguyễn Văn Cừ nối dài, An Bình, Ninh Kiều, Cần Thơ
                        </p>
                    </div>
                    <div className="col-1/4 flex flex-col flex-1 items-center">
                        <div className="text-2xl font-semibold text-center flex flex-start gap-2 items-center uppercase h-12">
                            <div>
                                <svg class="navbar-icon icon icon-phone-active-3" viewBox="0 0 32 32">
                                    <path
                                        class="path1"
                                        d="M18.317 23.228c-0.276-0.497-0.497-0.993-0.772-1.49-0.607-1.159-1.766-1.876-3.090-1.876h-1.655l-1.048-1.931-1.545-3.2 0.993-1.324c0.497-0.607 1.159-1.986 0.166-3.917l-1.324-2.593c-0.386-0.828-1.103-1.379-1.986-1.545-0.828-0.166-1.655 0.055-2.372 0.607-1.545 1.269-2.703 2.979-3.31 4.91-0.441 1.379-0.276 2.924 0.386 4.303l5.241 10.428c0.662 1.379 1.821 2.372 3.145 2.869 1.103 0.386 2.262 0.607 3.476 0.607 0.883 0 1.766-0.11 2.648-0.331 0.772-0.221 1.434-0.772 1.821-1.545 0.331-0.772 0.331-1.655-0.055-2.372-0.166-0.552-0.441-1.048-0.717-1.6zM17.159 26.262c-0.055 0.11-0.11 0.221-0.331 0.276-1.6 0.441-3.31 0.331-4.8-0.221-0.828-0.276-1.49-0.938-1.931-1.766l-5.297-10.372c-0.441-0.883-0.552-1.821-0.276-2.648 0.441-1.545 1.379-2.869 2.593-3.862 0.11-0.11 0.276-0.166 0.386-0.166 0.055 0 0.055 0 0.11 0 0.166 0.055 0.331 0.166 0.441 0.386l1.324 2.593c0.497 0.993 0.166 1.49 0.055 1.6l-1.379 1.876c-0.276 0.331-0.276 0.772-0.11 1.159l1.821 3.862c0 0 0 0.055 0.055 0.055l1.379 2.538c0.221 0.331 0.552 0.607 0.993 0.552l2.317-0.055c0.497 0 0.883 0.276 1.103 0.662 0.276 0.497 0.497 0.993 0.772 1.49s0.552 1.048 0.772 1.545c0.055 0.166 0.055 0.331 0 0.497z"
                                    ></path>
                                    <path
                                        class="wave wave-sm"
                                        d="M16.607 10.152c-0.552-0.276-1.214-0.055-1.49 0.441-0.276 0.552-0.055 1.214 0.441 1.49 1.379 0.717 2.593 3.034 2.538 4.855 0 0.607 0.497 1.214 1.103 1.214 0 0 0 0 0 0 0.607 0 1.103-0.552 1.103-1.159 0.055-2.648-1.6-5.738-3.697-6.841z"
                                    ></path>
                                    <path
                                        class="wave wave-md"
                                        d="M19.531 6.676c-0.552-0.276-1.214-0.055-1.49 0.441-0.276 0.552-0.055 1.214 0.441 1.49 2.703 1.434 4.303 4.359 4.248 7.834 0 0.607 0.497 1.159 1.103 1.159 0 0 0 0 0 0 0.607 0 1.103-0.497 1.103-1.103 0.055-4.303-1.986-8-5.407-9.821z"
                                    ></path>
                                    <path
                                        class="wave wave-lg"
                                        d="M22.952 3.090c-0.552-0.276-1.214-0.11-1.49 0.441s-0.11 1.214 0.441 1.49c3.697 2.097 5.848 6.179 5.683 10.979 0 0.607 0.441 1.103 1.048 1.103 0 0 0 0 0.055 0 0.607 0 1.103-0.441 1.103-1.048 0.166-5.628-2.372-10.428-6.841-12.966z"
                                    ></path>
                                </svg>
                            </div>{' '}
                            Điện thoại
                        </div>
                        <p className="font-medium text-lg text-[#A69689]">0337336138</p>
                    </div>
                    <div className="col-1/4 flex flex-col flex-1 items-center justify-center">
                        {/* <Image className="text-center" alt="svg" src="/svgs/mail.svg" width={16} height={20} /> */}

                        <div className="text-2xl font-semibold text-center flex flex-start gap-2 items-center uppercase h-12">
                            <div class="letter-image">
                                <div class="animated-mail">
                                    <div class="back-fold">
                                        <div class="letter">
                                            <div class="letter-border"></div>
                                            <div class="letter-title"></div>
                                            <div class="letter-context"></div>
                                            <div class="letter-stamp">
                                                <div class="letter-stamp-inner"></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="middle-body"></div>
                                    <div class="left-fold"></div>
                                </div>
                            </div>
                            Mail
                        </div>
                        <p className="font-medium text-lg text-[#A69689]">tkdecor123@gmail.com</p>
                    </div>
                </div>
                <div className="text-center items-center justify-center border-black border-dashed border-2 rounded-xl">
                    <h1 className=" text-2xl my-6 font-semibold capitalize">Gửi yêu cầu tư vấn</h1>
                    <h2 className="font-normal text-base text-[#A69689] mx-4">
                        Vui lòng điền vào biểu mẫu này và chúng tôi sẽ liên lạc ngay khi có thể.
                    </h2>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validation}
                        onSubmit={(values, { resetForm }) => {
                            handleSubmitForm(values);
                            resetForm();
                        }}
                    >
                        <Form>
                            <div className="xl:w-3/4 mx-auto">
                                <div className="flex flex-col items-center justify-center gap-4 p-4">
                                    <Field
                                        className="p-2 bot border-b border-t-0 border-l-0 border-r-0 border-black leading-tight focus:outline-none w-3/4"
                                        type="text"
                                        name="name"
                                        placeholder="Hãy nhập tên..."
                                    />
                                    <ErrorMessage name="name" component="p" className="text-error text-xs" />
                                    <Field
                                        className="p-2 bot border-b border-t-0 border-l-0 border-r-0 border-black leading-tight focus:outline-none w-3/4"
                                        type="text"
                                        name="mailSender"
                                        placeholder="Hãy nhập địa chỉ email.."
                                    />
                                    <ErrorMessage name="mailSender" component="p" className="text-error text-xs" />
                                    <Field
                                        className="border p-2 border-black leading-tight focus:outline-none h-32 w-3/4 mt-8"
                                        type="text"
                                        as="textarea"
                                        name="content"
                                        placeholder="Nhập tin nhắn của bạn..."
                                    />
                                    <ErrorMessage name="content" component="p" className="text-error text-xs" />
                                    <ReCAPTCHA
                                        ref={recaptchaRef}
                                        size="invisible"
                                        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                                    />
                                    <div className="flex justify-center items-center">
                                        <button
                                            className="text-sm font-bold border border-black w-32 h-9 hover:bg-secondary hover:text-white hover:border-white"
                                            type="submit"
                                        >
                                            Gửi
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Form>
                    </Formik>
                </div>
            </section>
        </UserLayout>
    );
}

export default function ContactUsPage() {
    return (
        <div>
            <ContactUs />
        </div>
    );
}
