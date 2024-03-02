/* eslint-disable react-hooks/exhaustive-deps */
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
// component
import UserLayout from '@/components/Layout/UserLayout';
import Thumbnail from '@/components/Utils/Thumbnail';
import ProductInfo from '@/components/Product/ProductInfo';
import ReviewCard from '@/components/Review/ReviewCard';
import jwt from 'jsonwebtoken';
// ant design
import { Empty, Rate, Select } from 'antd';
// constant
import { sortOptionReview } from '@/constant';
// api
import apiProduct from '../api/apiProduct';
import apiReview from '../api/user/apiReview';
import Card from '@/components/Product/Card';
import PageNotFound from '@/components/Utils/PageNotFound';
import Pagination from '@/components/Utils/Pagination';
import CustomPagination from '@/components/Utils/Pagination';
import CustomSort from '@/components/Utils/Sort';
import GetToken from '@/components/Utils/GetToken';
import { fetch } from '@forge/api';
import { Agent } from 'https';
// Carousel
var $ = require('jquery');
if (typeof window !== 'undefined') {
    window.$ = window.jQuery = require('jquery');
}
const OwlCarousel = dynamic(() => import('react-owl-carousel'), {
    ssr: false,
});

function ProductDetail({ isLogged }) {
    const router = useRouter();
    // Get slug of product from url
    const { productSlug } = router.query;
    const [productDetail, setProductDetail] = useState();
    const [relatedProducts, setRelatedProducts] = useState();
    const [listReview, setListReview] = useState();
    const [sort, setSort] = useState(sortOptionReview[0].value);
    const [currentPage, setCurrentPage] = useState(1);
    const reviewPerPage = 10;

    // Get product detail using slug
    const fetchProductData = async () => {
        try {
            // Check lug is valid
            if (productSlug) {
                const res = await apiProduct.GetBySlug(productSlug);
                const resRelate = await apiProduct.GetRelatedProducts(productSlug);
                if (res && res.success) {
                    setProductDetail(res.data);
                }
                if (resRelate && resRelate.success) {
                    setRelatedProducts(resRelate.data);
                }
            }
        } catch (error) {
            console.log('🚀 ~ file: [productSlug].js:491 ~ fetchProductData ~ error:', error);
        }
    };

    // fetch list review
    const fetchListReview = async () => {
        try {
            // Check lug is valid
            if (productSlug) {
                const res = await apiReview.GetReviewByProductId(productSlug, sort, currentPage, reviewPerPage);
                if (res && res.success) {
                    setListReview(res.data);
                } else {
                    console.log(res);
                }
            }
        } catch (error) {
            console.log('🚀 ~ file: [productSlug].js:491 ~ fetchProductData ~ error:', error);
        }
    };

    // Fetch data every time the slug changes
    useEffect(() => {
        fetchProductData();
    }, [productSlug]);

    // Fetch list review every time the sort, current page and product detail change
    useEffect(() => {
        fetchListReview();
    }, [sort, currentPage, productDetail]);

    return (
        <UserLayout>
            <Thumbnail title={productDetail?.name} />
            <div className="w-11/12 lg:w-10/12 mx-auto flex flex-col gap-8 my-10">
                <section className="flex justify-between max-sm:flex-col gap-6 ">
                    <div className="w-6/12 max-sm:w-full">
                        <OwlCarousel
                            items={1}
                            loop={true}
                            responsiveRefreshRate={0}
                            autoplay={true}
                            autoplayTimeout={7000}
                            autoplayHoverPause={true}
                            nav={true}
                            navText={[
                                "<button class='icon-arrow-paginate hover:bg-transparent absolute top-1/2 transform -translate-y-1/2 -left-16 max-sm:-left-10 flex justify-center items-center w-10 h-10max-sm:w-8 max-sm:h-8'><img class='w-5 h-5 -ml-1 max-sm:w-4 max-sm:h-4' alt='arrow-left' src='/assets/svg/vector_left.svg' /></button>",
                                "<button class='icon-arrow-paginate hover:bg-transparent absolute top-1/2 transform -translate-y-1/2 -right-14 max-sm:-right-10 flex justify-center items-center w-10 h-10max-sm:w-8 max-sm:h-8'><img class='w-5 h-5 -mr-1 max-sm:w-4 max-sm:h-4' alt='arrow-left' src='/assets/svg/vector_right.svg' /></button>",
                            ]}
                            margin={50}
                        >
                            {productDetail?.productImages.map((item) => (
                                <img
                                    className="max-sm:h-56 h-fit rounded object-cover"
                                    key={item}
                                    src={item}
                                    alt="Thumbnail"
                                />
                            ))}
                        </OwlCarousel>
                    </div>
                    <div className="w-6/12 max-sm:w-full flex flex-col gap-2">
                        <ProductInfo data={productDetail} isLogged={isLogged} />
                    </div>
                </section>
                <section>
                    <h3 className="font-semibold uppercase max-sm:text-sm">Sản phẩm đề xuất</h3>
                    <OwlCarousel
                        items={3}
                        responsiveRefreshRate={0}
                        autoplay={true}
                        autoplayTimeout={7000}
                        autoplayHoverPause={true}
                        responsive={{
                            1: {
                                items: 1,
                            },
                            900: {
                                items: 2,
                            },
                            1025: {
                                items: 3,
                            },
                        }}
                        nav={true}
                        navText={[
                            "<button class='icon-arrow-paginate absolute top-1/2 transform -translate-y-1/2 -left-20 max-sm:-left-10 flex justify-center items-center w-10 h-10 border-secondary border rounded-full max-sm:w-8 max-sm:h-8'><img class='w-4 h-4 -ml-0.5 max-sm:w-4 max-sm:h-4' alt='arrow-left' src='/assets/svg/vector_left.svg' /></button>",
                            "<button class='icon-arrow-paginate absolute top-1/2 transform -translate-y-1/2 -right-20 max-sm:-right-10 flex justify-center items-center w-10 h-10 border-secondary border rounded-full max-sm:w-8 max-sm:h-8'><img class='w-4 h-4 -mr-0.5 max-sm:w-4 max-sm:h-4' alt='arrow-left' src='/assets/svg/vector_right.svg' /></button>",
                        ]}
                        margin={50}
                    >
                        <Card dataCard={relatedProducts} isLogged={isLogged} />
                    </OwlCarousel>
                </section>

                <section className="flex flex-col gap-2">
                    <div className="flex gap-4 items-center justify-between">
                        <h3 className="font-semibold uppercase max-sm:text-sm">Đánh giá sản phẩm</h3>
                        <div className="max-sm:w-2/4 w-4/12 lg:w-2/12">
                            <CustomSort sort={sort} setSort={setSort} sortOption={sortOptionReview} />
                        </div>
                    </div>
                    <div className="flex justify-between max-sm:flex-col max-sm:gap-4">
                        <div className="flex gap-8 text-sm items-center">
                            <p>{productDetail?.countRate} đánh giá</p>
                            <div className="flex gap-1 items-end">
                                <Rate disabled allowHalf value={productDetail?.averageRate} style={{ fontSize: 18 }} />
                                <p>{Number(productDetail?.averageRate).toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-8 my-6">
                        {listReview?.totalItem === 0 ? (
                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={'Sản phẩm chưa có đánh giá'} />
                        ) : (
                            listReview?.reviews.map((item) => (
                                <ReviewCard
                                    key={item.productReviewId}
                                    data={item}
                                    isLogged={isLogged}
                                    fetchData={() => fetchListReview()}
                                />
                            ))
                        )}
                    </div>
                    {listReview?.totalPages > 0 && (
                        <CustomPagination
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            totalPages={Number(listReview?.totalPages)}
                        />
                    )}
                </section>
            </div>
        </UserLayout>
    );
}

export default ProductDetail;

export async function getServerSideProps(context) {
    const { productSlug } = context.query;
    const product = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Products/GetBySlug/${productSlug}`, {
        agent: new Agent({
            rejectUnauthorized: false,
        }),
    });
    const res = await product.json();
    if (res && res.success) {
        // Get cookie in the context
        const cookies = context.req.headers.cookie;
        // Filter cookies to get access token
        if (cookies) {
            const userInfo = GetToken(cookies);
            // Check author based role
            if (userInfo && userInfo.role === 'Customer') {
                return {
                    props: {
                        isLogged: true,
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
            props: {
                isLogged: false,
            },
        };
    } else {
        return {
            redirect: {
                destination: '/404', // Redirect to the login page or any other page you prefer
                permanent: false,
            },
        };
    }
}
