import { Rate, Modal, message } from 'antd';
import { formateDateTimeVN } from '../Utils/FormatDate';
import { useRef, useState } from 'react';
import apiInteraction from '@/pages/api/apiInteraction';
import { useRouter } from 'next/router';
import { InteractionStatus, validationReportReview } from '@/constant';
import apiReport from '@/pages/api/apiReport';
import { ErrorMessage, Field, Form, Formik } from 'formik';

function ReviewCard({ data, isLogged, fetchData }) {
    const [interaction, setInteraction] = useState(data.interactionOfUser);
    const [messageApi, contextHolder] = message.useMessage();
    const router = useRouter();
    const formikRef = useRef();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // handle change interaction status
    const handleChangeInteraction = async (status) => {
        try {
            // Check user is logged
            if (isLogged) {
                const res = await apiInteraction.UpdateUserReviewInteractions(data.productReviewId, status);
                if (res && res.success) {
                    setInteraction(status);
                    fetchData();
                }
            } else {
                router.push('/auth/login');
            }
        } catch (error) {
            console.log('🚀 ~ file: [productSlug].js:491 ~ fetchProductData ~ error:', error);
        }
    };

    // handle report review
    const handleReportReview = async (values) => {
        try {
            // Check user is logged
            if (isLogged) {
                const res = await apiReport.ReportProductReview(data.productReviewId, values.reason);
                if (res && res.success) {
                    messageApi.open({
                        type: 'success',
                        content: 'Tố cáo của bạn đã được gửi, vui lòng đợi phản hồi!',
                    });
                }
                setIsModalOpen(false);
            } else {
                router.push('/auth/login');
            }
        } catch (error) {
            console.log('🚀 ~ file: [productSlug].js:491 ~ fetchProductData ~ error:', error);
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        formikRef.current.resetForm();
    };
    return (
        <div className="flex flex-col gap-2 border-dashed border-b-2 pb-3 max-sm:pb-4">
            {contextHolder}
            <div className="flex gap-6 max-sm:gap-3">
                <img
                    src={data?.userAvatarUrl || '/assets/images/default_avatar.jpeg'}
                    alt="avatar"
                    className="max-sm:h-14 max-sm:w-14 w-20 h-20 object-cover rounded-full border"
                />
                <div className="flex flex-col w-full">
                    <div className="flex justify-between w-full">
                        <h2 className="font-bold max-sm:text-sm">{data.userName}</h2>
                        <img
                            src="/assets/svg/report_review.svg"
                            alt="report icon"
                            className={`${!isLogged ? 'hidden' : 'cursor-pointer'}`}
                            onClick={() => setIsModalOpen(true)}
                        />
                    </div>
                    <p className="text-sm text-secondary max-sm:text-xs">
                        {formateDateTimeVN(data.updatedAt).datePart}
                    </p>
                    <Rate allowHalf value={data.rate} disabled style={{ fontSize: 10 }} />
                </div>
            </div>
            <p className="text-sm max-sm:text-xs">{data.description}</p>
            <div className="flex gap-4">
                <div className="flex gap-1 items-center text-sm text-secondary">
                    {interaction === InteractionStatus.Like ? (
                        <img
                            className="w-4 h-4 cursor-pointer "
                            src="/assets/svg/like_full.svg"
                            alt="like icon"
                            onClick={() => handleChangeInteraction(InteractionStatus.Normal)}
                        />
                    ) : (
                        <img
                            className="w-4 h-4 cursor-pointer "
                            src="/assets/svg/like_empty.svg"
                            alt="like icon"
                            onClick={() => handleChangeInteraction(InteractionStatus.Like)}
                        />
                    )}
                    <p>{data.totalLike}</p>
                </div>
                <div className="flex gap-1 items-center text-sm text-secondary">
                    {interaction === InteractionStatus.Dislike ? (
                        <img
                            className="w-4 h-4 cursor-pointer rotate-180"
                            src="/assets/svg/like_full.svg"
                            alt="like icon"
                            onClick={() => handleChangeInteraction(InteractionStatus.Normal)}
                        />
                    ) : (
                        <img
                            className="w-4 h-4 cursor-pointer rotate-180"
                            src="/assets/svg/like_empty.svg"
                            alt="like icon"
                            onClick={() => handleChangeInteraction(InteractionStatus.Dislike)}
                        />
                    )}
                    <p>{data.totalDisLike}</p>
                </div>
            </div>
            <Modal
                title="Tố cáo đánh giá của người dùng"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={[
                    <button
                        form={data.productReviewId}
                        className="bg-secondary text-white px-5 rounded py-1.5 "
                        key="submit"
                        htmltype="submit"
                        type="submit"
                    >
                        Tố Cáo
                    </button>,
                ]}
            >
                <Formik
                    initialValues={{ reason: '' }}
                    validationSchema={validationReportReview}
                    onSubmit={(values, { resetForm }) => {
                        handleReportReview(values);
                        resetForm();
                    }}
                    innerRef={formikRef}
                >
                    <Form className="flex flex-col gap-1 w-full" id={data.productReviewId}>
                        <Field
                            name="reason"
                            className="border border-secondary rounded text-sm h-20"
                            as="textarea"
                            placeholder="Vui lòng nhập lý do tố cáo của bạn"
                        />
                        <ErrorMessage name="reason" component="p" className="text-error text-xs" />
                    </Form>
                </Formik>
            </Modal>
        </div>
    );
}

export default ReviewCard;
