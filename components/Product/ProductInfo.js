import { useRouter } from 'next/router';
import { useRef, useState } from 'react';
// Component
import UpdateQuantity from '../Utils/UpdateQuantity';
import convertToVND from '../Utils/convertToVND';
import PrimaryButton from '../Utils/PrimaryButton';
// ant design
import { Rate, Tooltip, message, Modal } from 'antd';
// api
import apiFavorite from '@/pages/api/apiFavorite';
import apiCart from '@/pages/api/user/apiCart';
import { ErrorMessage, Field, Formik, Form } from 'formik';
import { validationReportReview } from '@/constant';
import apiReport from '@/pages/api/apiReport';
import Link from 'next/link';
import SocialListIcon from '../Utils/SocialListIcon';

function ProductInfo({ data, isLogged }) {
    const [messageApi, contextHolder] = message.useMessage();
    const [isOpenOverview, setIsOpenOverview] = useState(true);
    const [favorite, setFavorite] = useState(data?.isFavorite);
    const [quantity, setQuantity] = useState(1);
    const router = useRouter();
    const formikRef = useRef();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // add product to cart and redirect to cart
    const handleBuyNow = async () => {
        if (isLogged) {
            try {
                const res = await apiCart.AddToCard(data.productId, quantity);
                if (res && res.success) {
                    router.push('/user/cart');
                } else {
                    messageApi.open({
                        type: 'warning',
                        content: res.message,
                    });
                }
            } catch (error) {
                console.log('🚀 ~ file: ProductInfo.js:16 ~ handleBuyNow ~ error:', error);
            }
        } else {
            router.push('/auth/login');
        }
    };

    // add product to cart and show mess
    const handleAddToCart = async () => {
        if (isLogged) {
            try {
                const res = await apiCart.AddToCard(data.productId, quantity);
                if (res && res.success) {
                    messageApi.open({
                        type: 'success',
                        content: 'Sản phẩm đã được thêm vào giỏ hàng',
                    });
                } else {
                    messageApi.open({
                        type: 'warning',
                        content: res.message,
                    });
                }
            } catch (error) {
                console.log('🚀 ~ file: ProductInfo.js:16 ~ handleBuyNow ~ error:', error);
            }
        } else {
            router.push('/auth/login');
        }
    };

    // change the favorite status and show mess
    const handleChangeFavorite = async () => {
        if (isLogged) {
            try {
                setFavorite(!favorite);
                const res = await apiFavorite.SetProductFavorite(data.productId);
                if (res && res.success && !favorite) {
                    messageApi.open({
                        type: 'success',
                        content: 'Sản phẩm đã được thêm vào danh sách yêu thích',
                    });
                }
            } catch (error) {
                console.log('🚀 ~ file: ProductInfo.js:16 ~ handleBuyNow ~ error:', error);
            }
        } else {
            router.push('/auth/login');
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        formikRef.current.resetForm();
    };

    // handle report product
    const handleReportProduct = async (values) => {
        try {
            // Check user is logged
            if (isLogged) {
                const res = await apiReport.ReportProduct(data.productId, values.reason);
                if (res && res.success) {
                    messageApi.open({
                        type: 'success',
                        content: 'Báo cáo của bạn đã được gửi, vui lòng đợi phản hồi!',
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

    return (
        <>
            {contextHolder}
            <div className="flex w-full justify-between gap-2">
                <h2 className="font-bold text-xl max-sm:text-lg uppercase w-fit">{data?.name}</h2>
                <div className="flex gap-3">
                    <Tooltip color="#A69689" title={favorite ? '' : 'Yêu thích'}>
                        <img
                            className={`${isLogged ? 'w-5 h-5 cursor-pointer btn-favorite' : 'hidden'}`}
                            alt="svg"
                            src={favorite ? '/assets/svg/heart_full.svg' : '/assets/svg/heart_empty.svg'}
                            onClick={() => handleChangeFavorite()}
                        />
                    </Tooltip>
                    <img
                        src="/assets/svg/report_product.svg"
                        alt="report icon"
                        className={`${isLogged ? 'w-5 h-5 cursor-pointer' : 'hidden'}`}
                        onClick={() => setIsModalOpen(true)}
                    />
                </div>
            </div>
            <div className="flex justify-between w-full flex-wrap-reverse ">
                <div className="flex gap-6">
                    <Rate disabled allowHalf value={data?.averageRate} style={{ fontSize: 14 }} />
                    <p className="text-sm text-grey">{data?.countRate} đánh giá</p>
                </div>
                <div className="">
                    <SocialListIcon url={`${process.env.NEXT_PUBLIC_DOMAIN}/product/${data?.slug}`} content="TKDecor" />
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <div
                    className="flex gap-2 text-base font-semibold w-fit cursor-pointer"
                    onClick={() => setIsOpenOverview(!isOpenOverview)}
                >
                    <p>Mô tả sản phẩm</p>
                    <img src="/assets/svg/up.svg" alt="icon show" className={isOpenOverview ? 'rotate-180' : ''} />
                </div>

                {isOpenOverview && (
                    <div
                        className="text-xs lg:text-sm font-normal"
                        dangerouslySetInnerHTML={{ __html: data?.description }}
                    />
                )}
            </div>
            <p className="font-normal text-sm max-sm:text-xs text-grey">{data?.quantity} sản phẩm có sẵn</p>
            <div className="text-base font-semibold flex gap-2">
                <p>Số lượng: </p>
                <UpdateQuantity maxValue={data?.quantity} quantity={quantity} setQuantity={setQuantity} />
            </div>
            <h3 className="font-bold text-lg">{convertToVND(data?.price)}</h3>
            {data?.product3DModel && (
                <div className="lg:hidden">
                    <Tooltip color="#A69689" title={'Trải Nghiệm Sản Phẩm Với Thực Tế Ảo Tăng Cường'}>
                        <Link
                            href={`${process.env.NEXT_PUBLIC_AR_DOMAIN}?id=${data?.slug}`}
                            rel="noopener noreferrer"
                            target="_blank"
                            className="capitalize text-blue-500 inline-block"
                        >
                            <img src="/assets/svg/3d_icon.svg" alt="AR" className="w-12" />
                        </Link>
                    </Tooltip>
                </div>
            )}

            <div className="flex gap-4 max-sm:justify-between">
                <PrimaryButton
                    content={'Mua Ngay'}
                    classCss={'border border-black px-3 py-1.5 max-sm:text-xs max-sm:font-semibold max-sm:px-2.5'}
                    onClick={() => handleBuyNow()}
                />
                <PrimaryButton
                    content={'Thêm Vào Giỏ hàng'}
                    classCss={
                        'border bg-secondary text-white px-3 py-1.5 max-sm:text-xs max-sm:font-semibold max-sm:px-2.5'
                    }
                    onClick={handleAddToCart}
                />
            </div>

            <Modal
                title="BÁO CÁO SẢN PHẨM"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={[
                    <button
                        form={data?.productId}
                        className="bg-secondary text-white px-5 rounded py-1.5 "
                        key="submit"
                        htmltype="submit"
                        type="submit"
                    >
                        Báo Cáo
                    </button>,
                ]}
            >
                <Formik
                    initialValues={{ reason: '' }}
                    validationSchema={validationReportReview}
                    onSubmit={(values, { resetForm }) => {
                        handleReportProduct(values);
                        resetForm();
                    }}
                    innerRef={formikRef}
                >
                    <Form className="flex flex-col gap-1 w-full" id={data?.productId}>
                        <Field
                            name="reason"
                            className="border border-secondary rounded text-sm h-20"
                            as="textarea"
                            placeholder="Vui lòng nhập lý do báo cáo của bạn"
                        />
                        <ErrorMessage name="reason" component="p" className="text-error text-xs" />
                    </Form>
                </Formik>
            </Modal>
        </>
    );
}

export default ProductInfo;
