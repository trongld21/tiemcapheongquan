import React, { useState } from 'react';
import Image from 'next/image';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Rate } from 'antd';
import apiReview from '@/pages/api/user/apiReview';
import useNotification from '@/hooks/useNotification';

const ItemOrder = ({ orderDetail, review }) => {
    const { showError, showSuccess } = useNotification();

    const [rate, setRating] = useState(0);

    const [showFormReview, setShowFormReview] = useState(false);

    const [initialValues, setInitialValues] = useState({
        content: '',
    });

    const validation = Yup.object({
        content: Yup.string()
            .required('Content is required')
            .min(3, 'Content must be at least 3 characters')
            .max(200, 'Content must be less than 200 characters'),
    });

    const handleRateChange = (value) => {
        setRating(value);
    };

    const handleSummitReview = async (productId, description) => {
        const data = { productId, rate, description };
        const response = await apiReview.SentReview(data);
        if (response.success) {
            showSuccess('You have submitted a successful review.', '', 1);
            setShowFormReview(false);
        } else {
            showError('You cannot submit reviews', response.ErrorMessage);
        }
    };

    return (
        <div className="flex gap-4">
            <Image src={orderDetail.productImages[0]} alt="anh" width={100} height={100} />
            <div className="flex flex-col gap-1">
                <p className="font-semibold text-lg">{orderDetail.productName}</p>
                {/* <p className="text-sm font-semibold">
                    <span className="text-black text-opacity-50">Color:</span> Brown
                </p> */}
                <p className="text-sm font-semibold">
                    <span className="text-black text-opacity-50">Quantity:</span> {orderDetail.quantity}
                </p>
                <p className="text-sm font-semibold">
                    <span className="text-black text-opacity-50">Price buy:</span> $ {orderDetail.paymentPrice}
                </p>
            </div>
            {review && (
                <div className="flex flex-col gap-1 ml-auto">
                    <img alt="svg" src="/assets/svg/comment.svg" onClick={() => setShowFormReview(true)}></img>
                </div>
            )}
            {showFormReview && (
                <div className="fixed top-0 left-0 right-0 bottom-0 bg-opacity-50 bg-gray-500 z-50 flex justify-center items-center">
                    {/* <div className=" p-4 bg-white rounded"> */}
                    <div className="p-4 bg-white rounded w-4/5 max-w-xl h-2/4 max-h-[300px] overflow-y-auto">
                        <div className="mb-4 flex justify-between">
                            <p>Review {orderDetail.productName}</p>
                            <button onClick={() => setShowFormReview(false)} className="w-4 h-4">
                                <Image src="/svgs/close.svg" alt="Close" width={30} height={30} />
                            </button>
                        </div>
                        <Formik
                            initialValues={initialValues}
                            validationSchema={validation}
                            onSubmit={(values) => {
                                handleSummitReview(orderDetail.productId, values.content);
                            }}
                        >
                            <Form>
                                <div className="grid md:grid-cols-1 md:gap-6 mb-5">
                                    <div className="relative z-0 w-full mb-6 group">
                                        <Field
                                            as="textarea"
                                            type="text"
                                            name="content"
                                            id="content"
                                            className="h-5/6 block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                            placeholder=" "
                                        />
                                        <ErrorMessage name="content" component="p" className="text-error text-xs" />
                                        <Rate
                                            className="text-secondary max-sm:text-xs text-xl"
                                            onChange={handleRateChange}
                                        />
                                        <label
                                            htmlFor="content"
                                            className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 left-0 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                        >
                                            Description
                                        </label>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                                >
                                    Send Review
                                </button>
                            </Form>
                        </Formik>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ItemOrder;
