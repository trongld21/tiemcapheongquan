import React, { useEffect, useState } from 'react';
import ReactStars from 'react-rating-stars-component';
import Image from 'next/image';
import { Rate, Tooltip, message } from 'antd';
import { useRouter } from 'next/router';
import PrimaryButton from '../Utils/PrimaryButton';
import apiCart from '@/pages/api/user/apiCart';
import useNotification from '@/hooks/useNotification';
import apiFavorite from '@/pages/api/apiFavorite';
import convertToVND from '../Utils/convertToVND';

const Card = ({ dataCard, isLogged, fetchData }) => {
    const { showError, showSuccess } = useNotification();
    const [messageApi, contextHolder] = message.useMessage();
    const router = useRouter();
    const [isHearted, setIsHearted] = useState({});
    const handleClickHeart = async (productId) => {
        const response = await apiFavorite.SetProductFavorite(productId);
        if (response.success) {
            setIsHearted((prevState) => ({
                ...prevState,
                [productId]: !prevState[productId],
            }));
            if (router.pathname === '/user/favorite') {
                fetchData();
            }
        } else {
            showError('Bạn không thể thực hiện hành động', response.data.message);
        }
    };

    const handleProductDetail = (slug) => {
        //go product detail page by id
        router.push(`/product/${slug}`);
    };

    const handleAddToCart = async (id) => {
        console.log('🚀 ~ file: Card.js:34 ~ handleAddToCart ~ id:', id);
        if (isLogged) {
            try {
                const res = await apiCart.AddToCard(id, 1);
                console.log('🚀 ~ file: Card.js:39 ~ handleAddToCart ~ res:', res);
                if (res && res.success) {
                    messageApi.open({
                        type: 'success',
                        content: 'Sản phẩm đã được thêm vào giỏ hàng',
                    });
                } else {
                    messageApi.open({
                        type: 'error',
                        content: res?.message,
                    });
                }
            } catch (error) {
                console.log('🚀 ~ file: ProductInfo.js:16 ~ handleBuyNow ~ error:', error);
            }
        } else {
            router.push('/auth/login');
        }
    };

    useEffect(() => {
        if (dataCard) {
            const initialHeartedState = dataCard.reduce((acc, product) => {
                return { ...acc, [product.productId]: product.isFavorite };
            }, {});
            setIsHearted(initialHeartedState);
        }
    }, [dataCard]);
    if (!dataCard) {
        <div>Loading...</div>;
    }
    return (
        <>
            {contextHolder}
            {dataCard &&
                dataCard.map((item) => (
                    <div
                        className="rounded-xl shadow scale-100 hover:scale-105 ease-in duration-75"
                        key={item.productId}
                    >
                        <div className="relative">
                            <img
                                className="w-full max-sm:h-28 h-52 mx-auto rounded-tr-sm rounded-tl-sm object-cover cursor-pointer"
                                alt="sofa-image"
                                src={item.productImages[0]}
                                onClick={() => handleProductDetail(item.slug)}
                            />
                        </div>
                        <div className="p-4 w-full">
                            <div className="flex gap-2 w-full items-center">
                                <h1
                                    className="font-bold max-sm:font-medium line-clamp-1 max-sm:text-[11px] max-sm:leading-tight text-lg w-full cursor-pointer link-product"
                                    onClick={() => handleProductDetail(item.slug)}
                                >
                                    {item.name}
                                </h1>
                                <Tooltip color="#A69689" title={isHearted[item.productId] ? '' : 'Yêu thích'}>
                                    <button
                                        className={isLogged ? 'btn-favorite h-fit' : 'hidden'}
                                        onClick={() => isLogged && handleClickHeart(item.productId)}
                                        // disabled={!isLogged}
                                    >
                                        <Image
                                            className="w-5 h-5"
                                            alt="svg"
                                            src={
                                                isHearted[item.productId]
                                                    ? '/assets/svg/heart_full.svg'
                                                    : '/assets/svg/heart_empty.svg'
                                            }
                                            width={2}
                                            height={2}
                                        />
                                    </button>
                                </Tooltip>
                            </div>
                            <div className="flex gap-1 lg:gap-4 items-center">
                                <Rate className=" text-[9px] lg:text-sm pointer-events-none" value={item.averageRate} />
                                <span className="text-secondary max-sm:text-[8px] text-xs lg:text-sm">
                                    {item.countRate} đánh giá
                                </span>
                            </div>
                            <p className="font-bold max-sm:text-xs text-sm lg:text-lg">{convertToVND(item.price)}</p>
                            <div className="w-full justify-center flex">
                                <PrimaryButton
                                    classCss={
                                        'w-fit max mt-4 bg-white border-secondary border-2 max-sm:py-1.5 py-2 max-sm:px-1 px-5 max-sm:text-[9px] text-xs font-medium lg:text-sm text-secondary hover:bg-secondary hover:text-white'
                                    }
                                    content={'Thêm Vào Giỏ hàng'}
                                    onClick={() => handleAddToCart(item.productId)}
                                    disabled={!isLogged}
                                />
                            </div>
                        </div>
                    </div>
                ))}
        </>
    );
};

export default Card;
