import Image from 'next/image';
import React, { useContext, useEffect, useState } from 'react';
import { Rate } from 'antd';
import { format } from 'date-fns';
import apiInteraction from '@/pages/api/apiInteraction';
import useNotification from '@/hooks/useNotification';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import apiReport from '@/pages/api/apiReport';
import { UserContext } from '@/contexts/userContext';

const ProductReview = ({ dataProductReview }) => {
    const { isLogged } = useContext(UserContext);

    const [likedReviews, setLikedReviews] = useState({});
    const [numLikes, setNumLikes] = useState({});
    const { showError, showSuccess } = useNotification();
    const handleClickLike = async (productReviewId, interaction) => {
        const updateInteractions = await apiInteraction.UpdateUserReviewInteractions(productReviewId, interaction);
        if (isLogged) {
            setLikedReviews((prevState) => ({
                ...prevState,
                [productReviewId]: !prevState[productReviewId],
            }));
            setNumLikes((prevNumLikes) => ({
                ...prevNumLikes,
                [productReviewId]: likedReviews[productReviewId]
                    ? prevNumLikes[productReviewId] - 1
                    : prevNumLikes[productReviewId] + 1,
            }));
            if (likedReviews[productReviewId]) {
                showSuccess('You unlike the review', 'You have taken an action that is unlike review!', 1);
            } else {
                showSuccess('You unlike the review', 'You have taken an action that is like review!', 1);
            }
        } else {
            showError('You cannot take action', 'Please login to take action!', 1);
        }
    };
    //report product review
    const [showFormReportReview, setShowFormReportReview] = useState(false);

    //get
    const [initialValues, setInitialValues] = useState({
        content: '',
    });
    const validation = Yup.object({
        content: Yup.string()
            .required('Content is required')
            .min(3, 'Content must be at least 3 characters')
            .max(200, 'Content must be less than 200 characters'),
    });
    const handleClickReportReview = async () => {
        if (isLogged) {
            setShowFormReportReview(true);
        } else {
            showError('You cannot take action report', 'Please login to take action!', 1);
        }
    };
    const handleSummitReportReview = async (productReviewReportedId, reason) => {
        console.log(productReviewReportedId);
        console.log(reason);
        const response = await apiReport.ReportProductReview(productReviewReportedId, reason);
        if (response && response.success) {
            setShowFormReportReview(false);
            showSuccess(
                'You have submitted a product report',
                'Thank you.Please wait for our Admin to check and respond soon.',
                1,
            );
        } else {
            showError('You cannot submit a report', 'Please try again !!!', 1);
        }
    };

    useEffect(() => {
        if (dataProductReview) {
            const initialLikedReviews = dataProductReview.reduce((acc, review) => {
                return { ...acc, [review.productReviewId]: review.interactionOfUser === 'Like' };
            }, {});
            setLikedReviews(initialLikedReviews);
            // Khởi tạo numLikes với số lượng like ban đầu của từng review
            const initialNumLikes = dataProductReview.reduce((acc, review) => {
                return { ...acc, [review.productReviewId]: review.totalLike };
            }, {});
            setNumLikes(initialNumLikes);
        }
    }, [dataProductReview]);
    return (
        <>
            {dataProductReview &&
                dataProductReview.map((item) => {
                    const likeCount = numLikes[item.productReviewId] || 0;
                    const formattedDate = format(new Date(item.createdAt), 'MMMM do, yyyy');
                    return (
                        <div key={item.productReviewId}>
                            <div className="flex relative">
                                <img
                                    onClick={() => handleClickReportReview()}
                                    className="w-4 h-4 absolute top-0 right-0"
                                    src="/img/icon/menu.svg"
                                    alt="svg"
                                ></img>
                                <img className="rounded-full w-32 h-32 mr-5" alt="image" src={item.userAvatarUrl} />
                                <div className="w-auto ml-5">
                                    <p className="font-semibold text-xl">{item.userName}</p>
                                    <p className="mt-2 text-black text-opacity-50 text-sm font-medium">
                                        {formattedDate}
                                    </p>
                                    <p className="mt-5">Product classify</p>
                                    <div className="flex items-center mt-5">
                                        <div className="flex gap-2 items-center">
                                            <Rate
                                                className="text-secondary max-sm:text-xs text-sm pointer-events-none"
                                                value={item.rate}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <p className="mt-11">{item.description}</p>
                            <div className="flex mt-5 items-center">
                                <button onClick={() => handleClickLike(item.productReviewId, item.interactionOfUser)}>
                                    <Image
                                        className="w-5 h-5"
                                        alt="svg"
                                        src={
                                            likedReviews[item.productReviewId]
                                                ? '/img/icon/liked.svg'
                                                : '/img/icon/like.svg'
                                        }
                                        width={30}
                                        height={30}
                                    />
                                </button>
                                <p className="ml-2 text-black text-opacity-50">{likeCount}</p>
                            </div>
                            <div className="my-8 border-b-[2px] border-dashed border-black border-opacity-50"></div>
                            {showFormReportReview && (
                                <div className="fixed top-0 left-0 right-0 bottom-0 bg-opacity-500 bg-gray-500 z-50 flex justify-center items-center">
                                    <div className=" p-4 bg-white rounded">
                                        <div className="mb-4 flex justify-between">
                                            <p>Report This Review</p>
                                            <button onClick={() => setShowFormReportReview(false)} className="w-4 h-4">
                                                <Image src="/svgs/close.svg" alt="Close" width={30} height={30} />
                                            </button>
                                        </div>
                                        <Formik
                                            initialValues={initialValues}
                                            validationSchema={validation}
                                            onSubmit={(values) => {
                                                handleSummitReportReview(item.productReviewId, values.content);
                                            }}
                                        >
                                            <Form>
                                                <div className="grid md:grid-cols-1 md:gap-6">
                                                    <div className="relative z-0 w-full mb-6 group">
                                                        <Field
                                                            as="textarea"
                                                            type="text"
                                                            name="content"
                                                            id="content"
                                                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                                            placeholder=" "
                                                        />
                                                        <ErrorMessage
                                                            name="content"
                                                            component="p"
                                                            className="text-error text-xs"
                                                        />

                                                        <label
                                                            htmlFor="content"
                                                            className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                                        >
                                                            Content
                                                        </label>
                                                    </div>
                                                </div>

                                                <button
                                                    type="submit"
                                                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                                                >
                                                    Save
                                                </button>
                                            </Form>
                                        </Formik>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
        </>
    );
};

export default ProductReview;
