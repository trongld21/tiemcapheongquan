import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { format } from 'date-fns';
import dynamic from 'next/dynamic';
import Image from 'next/image';

// custom component
import CategoryList from '@/components/Category/CategoryList';
import UserLayout from '@/components/Layout/UserLayout';
import NewsSliderCard from '@/components/News/NewsSliderCard';
import Card from '@/components/Product/Card';
import { UserContext } from '@/contexts/userContext';

// api custom
import apiArticles from './api/apiArticles';
import apiCategory from './api/apiCategory';
import apiProduct from './api/apiProduct';
import Link from 'next/link';
import GetToken from '@/components/Utils/GetToken';
import Spinner from '@/components/Utils/Spinner';

var $ = require('jquery');
if (typeof window !== 'undefined') {
    window.$ = window.jQuery = require('jquery');
}
const OwlCarousel = dynamic(() => import('react-owl-carousel'), {
    ssr: false,
});

function Home({ isLogged }) {
    // const { isLogged } = useContext(UserContext);

    const router = useRouter();

    const [dataFeaturedProducts, setDataFeaturedProducts] = useState([]);
    const [dataCategory, setDataCategory] = useState([]);
    const [dataArticles, setDataArticles] = useState([]);
    const handleViewAllProduct = () => {
        router.push('/product');
    };

    useEffect(() => {
        const fetchData = async () => {
            //call api Category
            const responseCategory = await apiCategory.GetAll();
            if (responseCategory && responseCategory.success) {
                setDataCategory(responseCategory.data);
            }
            //call api FeaturedProduct
            const responseUserFavorite = await apiProduct.GetFeaturedProducts();

            if (responseUserFavorite && responseUserFavorite.success) {
                setDataFeaturedProducts(responseUserFavorite.data);
            }

            //call api Articles
            const responseArticles = await apiArticles.GetAll('', 1, 5);
            if (responseArticles && responseArticles.success) {
                // console.log('🚀 ~ file: index.js:56 ~ fetchData ~ responseArticles:', responseArticles);
                setDataArticles(responseArticles.data.articles);
            }
            // console.log('1');
        };
        fetchData();
    }, []);

    return (
        <UserLayout>
            <div className="flex-row gap-20">
                <section className="bg-[url('/assets/images/home_main.png')] bg-cover bg-center lg:h-[38.5rem] h-[30rem] max-sm:h-80">
                    <div className="h-fit my-auto lg:mx-0 mx-10 lg:ml-52 flex flex-col pt-24 lg:pt-36 md:gap-2">
                        <span className="text-sm lg:text-2xl font-semibold text-white drop-shadow-2xl shadow-lg	custom-shadow">
                            CHÀO MỪNG ĐẾN VỚI CHÚNG TÔI
                        </span>
                        {/* <h1 className="font-semibold text-8xl text-white drop-shadow-2xl max-sm:text-4xl">TKDECOR</h1> */}
                        <div className="relative">
                            <img src="/assets/images/TKDECOR_v2.png" className="w-80" />
                            <div className="glitch__imgs out block" id="glicth__imgs">
                                <div className="glitch__img"></div>
                                <div className="glitch__img"></div>
                                <div className="glitch__img"></div>
                                <div className="glitch__img"></div>
                                <div className="glitch__img"></div>
                                <div className="glitch__img"></div>
                                <div className="glitch__img"></div>
                                <div className="glitch__img"></div>
                                <div className="glitch__img"></div>
                                <div className="glitch__img"></div>
                            </div>
                        </div>
                        <p className="text-[#FF9844] font-medium text-3xl max-sm:text-sm uppercase custom-shadow">
                            Nội thất cao cấp
                        </p>
                        <span className="lg:text-base text-sm mb-10 text-white font-medium max-sm:text-xs custom-shadow">
                            Nâng tầm không gian sống <br />
                            với nội thất đẳng cấp và tinh tế
                        </span>
                        <Link href={'/product'}>
                            <button className="w-fit bg-secondary py-1.5 lg:py-2.5 px-4 lg:px-6 rounded-sm font-bold text-xs lg:text-sm text-white">
                                MUA NGAY
                            </button>
                        </Link>
                    </div>
                </section>

                <section className="w-11/12 h-fit mx-auto py-6 lg:py-20">
                    <p className="text-sm font-semibold py-4 lg:hidden uppercase">BỘ SƯU TẬP CỦA CHÚNG TÔI</p>
                    <div className="flex flex-col gap-6 mx-auto max-sm:w-full w-10/12">
                        <section className="w-full flex bg-center bg-cover justify-end rounded-2xl bg-[url('/assets/images/thumbnail_0.jpeg')] py-10 lg:py-20 px-20 lg:px-40 groupbanner-hover">
                            <div className="w-fit flex flex-col text-white text-xs lg:text-sm">
                                <p className="custom-shadow capitalize">Nâng Tầm Không Gian</p>
                                <h2 className="text-2xl lg:text-4xl font-bold uppercase custom-shadow">Sáng tạo</h2>
                                <Link href={'/product'}>
                                    <button className="w-fit mt-8 bg-secondary py-1.5 lg:py-2.5 px-4 lg:px-6 rounded-sm font-bold text-xs lg:text-sm text-white">
                                        MUA NGAY
                                    </button>
                                </Link>
                            </div>
                        </section>

                        <section className="flex gap-6 justify-between max-sm:flex-col">
                            <div className="bg-[url('/assets/images/thumbnail_4.png')] bg-center bg-cover rounded-2xl w-1/2 max-sm:w-full p-10 text-white text-sm groupbanner-hover">
                                <p className="custom-shadow capitalize">Chất Lượng Vượt Trội</p>
                                <h2 className="text-2xl lg:text-4xl font-bold uppercase custom-shadow">Hoàn Hảo</h2>
                                <Link href={'/product'}>
                                    <button className="w-fit mt-8 bg-secondary py-1.5 lg:py-2.5 px-4 lg:px-6 rounded-sm font-bold text-xs lg:text-sm text-white">
                                        MUA NGAY
                                    </button>
                                </Link>
                            </div>
                            <div className="bg-[url('/assets/images/thumbnail_3.png')] bg-center bg-cover rounded-2xl w-1/2 max-sm:w-full p-10 text-white text-sm groupbanner-hover">
                                <p className="custom-shadow capitalize">Góc Tự Do Sáng Tạo</p>
                                <h2 className="text-2xl lg:text-4xl font-bold uppercase custom-shadow">Nghệ Thuật</h2>
                                <Link href={'/product'}>
                                    <button className="w-fit mt-8 bg-secondary py-1.5 lg:py-2.5 px-4 lg:px-6 rounded-sm font-bold text-xs lg:text-sm text-white">
                                        MUA NGAY
                                    </button>
                                </Link>
                            </div>
                        </section>
                    </div>

                    <div className="flex flex-col gap-10 lg:gap-20 max-sm:pb-0 py-10 relative">
                        <div className="flex justify-between items-center">
                            <h1 className="font-semibold text-sm lg:text-lg">SẢN PHẨM NỔI BẬT</h1>
                            <div className="flex gap-2 items-center">
                                <Link href="/product" className="font-medium text-sm lg:text-base">
                                    Xem tất cả sản phẩm
                                </Link>
                                <button
                                    className="w-6 h-6 bg-black flex justify-center items-center rounded-full hover-me"
                                    onClick={handleViewAllProduct}
                                >
                                    <Image
                                        className="w-3 h-3 pl-0.5"
                                        alt="svg"
                                        src="/assets/svg/vector_right.svg"
                                        width={2}
                                        height={2}
                                    />
                                </button>
                            </div>
                        </div>
                        <OwlCarousel
                            items={3}
                            dots={true}
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
                            margin={70}
                        >
                            <Card dataCard={dataFeaturedProducts} isLogged={isLogged} />
                        </OwlCarousel>
                    </div>
                </section>

                <section className="w-full h-fit mx-auto py-10 bg-[#EBEBEB]">
                    <CategoryList dataCategory={dataCategory} />
                </section>

                {dataArticles.length > 0 ? (
                    <section className="w-full h-fit mx-auto py-10 bg-white relative">
                        <div className="w-11/12 mx-auto ">
                            <h2 className="lg:text-lg font-semibold mb-10">TIN MỚI NHẤT</h2>
                            <OwlCarousel
                                items={1}
                                responsiveRefreshRate={0}
                                autoplay={true}
                                autoplayTimeout={7000}
                                autoplayHoverPause={true}
                                nav={true}
                                navText={[
                                    "<button class='icon-arrow-paginate absolute top-1/2 transform -translate-y-1/2 -left-20 max-sm:-left-10 flex justify-center items-center w-10 h-10 border-secondary border rounded-full max-sm:w-8 max-sm:h-8'><img class='w-4 h-4 -ml-0.5 max-sm:w-4 max-sm:h-4' alt='arrow-left' src='/assets/svg/vector_left.svg' /></button>",
                                    "<button class='icon-arrow-paginate absolute top-1/2 transform -translate-y-1/2 -right-20 max-sm:-right-10 flex justify-center items-center w-10 h-10 border-secondary border rounded-full max-sm:w-8 max-sm:h-8'><img class='w-4 h-4 -mr-0.5 max-sm:w-4 max-sm:h-4' alt='arrow-left' src='/assets/svg/vector_right.svg' /></button>",
                                ]}
                                dots={false}
                                margin={30}
                            >
                                {dataArticles &&
                                    dataArticles.map((item) => {
                                        const formattedDate = format(new Date(item.createdAt), 'dd/MM/yyyy');
                                        return (
                                            <NewsSliderCard
                                                slug={item.slug}
                                                key={item.articleId}
                                                date={formattedDate}
                                                title={item.title}
                                                description={item.content}
                                                imgUrl={item.thumbnail}
                                            />
                                        );
                                    })}
                            </OwlCarousel>
                        </div>
                    </section>
                ) : (
                    <></>
                )}
            </div>
        </UserLayout>
    );
}

export async function getServerSideProps(context) {
    // Get cookie in the context
    const cookies = context.req.headers.cookie;
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
    return {
        props: {
            isLogged: false,
        },
    };
}

export default Home;
