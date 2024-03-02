import { Modal, Tag } from 'antd';
import convertToVND from '../Utils/convertToVND';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useRef, useState } from 'react';
import { Rate } from 'antd';
import * as Yup from 'yup';
import apiReview from '@/pages/api/user/apiReview';
import useNotification from '@/hooks/useNotification';
import Link from 'next/link';

function OrderItem({ data, canReview }) {
    const { showSuccess, showError } = useNotification();
    const [isModalOpen, setIsModalOpen] = useState();
    const [rateValue, setRateValue] = useState(5);
    const [statusReview, setStatusReview] = useState(data?.hasUserReviewed);
    const formikRef = useRef();

    const handleCancel = () => {
        formikRef.current.resetForm();
        setRateValue(5);
        setIsModalOpen(false);
    };
    const validation = Yup.object({
        description: Yup.string()
            .trim()
            .required('Đánh giá sản phẩm không được bỏ trống')
            .min(5, 'Đánh giá sản phẩm không được ít hơn 5 ký tự')
            .max(255, 'Đánh giá sản phẩm không được dài hơn 255 ký tự'),
    });

    const handleCreatePreview = async (values) => {
        try {
            const dataForm = {
                orderDetailId: data.orderDetailId,
                rate: rateValue,
                description: values.description,
            };
            const res = await apiReview.SentReview(dataForm);
            if (res && res.success === true) {
                setIsModalOpen(false);
                setRateValue(5);
                showSuccess('Đánh giá thành công', 'Đánh giá của bạn sẽ được hiển thị công khai', 3);
                setStatusReview(true);
            } else {
                showError('Đánh giá thất bại', res.data.message);
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="flex gap-4 items-center">
            <Link href={`/product/${data.productSlug}`}>
                <div className="w-24 h-20 max-sm:w-20 max-sm:h-20 items-center">
                    <img
                        src={data.productImages[0]}
                        alt="Thumbnail"
                        className="rounded w-full h-full object-cover my-auto cursor-pointer"
                    />
                </div>
            </Link>
            <div className="flex flex-col gap-1 text-sm max-sm:text-xs">
                <Link href={`/product/${data.productSlug}`}>
                    <h2 className="font-bold max-sm:line-clamp-1 text-base max-sm:text-sm line-clamp-1">
                        {data.productName}
                    </h2>
                </Link>
                <p className="text-grey">
                    Số lượng: <b className="text-black font-semibold">{data.quantity}</b>
                </p>
                <p className="text-grey">
                    Thành tiền: <b className="text-black font-semibold">{convertToVND(data.paymentPrice)}</b>
                </p>
                {canReview && (
                    <Tag
                        className="h-fit my-auto cursor-pointer w-fit flex gap-1"
                        color="#A69689"
                        onClick={() => setIsModalOpen(true)}
                    >
                        <img className="w-3 h-3 my-auto" src="/assets/svg/pencil_white.svg" alt="edit" />
                        <p className="font-medium">{statusReview ? 'Cập nhật đánh giá' : 'Viết đánh giá'}</p>
                    </Tag>
                )}
            </div>
            <Modal
                title="ĐÁNH GIÁ SẢN PHẨM"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={[
                    <button
                        form={data.productId}
                        className="bg-secondary text-white px-5 rounded py-1.5 mt-4"
                        key="submit"
                        type="submit"
                        htmltype="submit"
                    >
                        Đánh Giá
                    </button>,
                ]}
            >
                <p>Đánh giá của bạn sẽ được đăng công khai trên web.</p>
                <div className="flex flex-col gap-2">
                    <Rate
                        defaultValue={5}
                        value={rateValue}
                        onChange={(value) => {
                            if (value >= 1 && value <= 5) {
                                setRateValue(value);
                            }
                        }}
                    />
                    <Formik
                        initialValues={{ description: '' }}
                        validationSchema={validation}
                        onSubmit={(values, { resetForm }) => {
                            handleCreatePreview(values);
                            resetForm();
                        }}
                        innerRef={formikRef}
                    >
                        <Form className="flex flex-col gap-1 w-full" id={data.productId}>
                            <Field
                                name="description"
                                className="border border-secondary rounded text-sm h-20"
                                as="textarea"
                                placeholder="Chia sẻ chi tiết về trải nghiệm của riêng bạn về sản phẩm"
                            />
                            <ErrorMessage name="description" component="p" className="text-error text-xs" />
                        </Form>
                    </Formik>
                </div>
            </Modal>
        </div>
    );
}

export default OrderItem;
