import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { format } from 'date-fns';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import ImageGallery from "react-image-gallery";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

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

const images = [
    {
        original: "/assets/images/tiemcapheongquan/1.png",
        thumbnail: "/assets/images/tiemcapheongquan/1.png",
    },
    {
        original: "/assets/images/tiemcapheongquan/2.png",
        thumbnail: "/assets/images/tiemcapheongquan/2.png",
    },
    {
        original: "/assets/images/tiemcapheongquan/3.png",
        thumbnail: "/assets/images/tiemcapheongquan/3.png",
    },
    {
        original: "/assets/images/tiemcapheongquan/4.png",
        thumbnail: "/assets/images/tiemcapheongquan/4.png",
    },
    {
        original: "/assets/images/tiemcapheongquan/5.png",
        thumbnail: "/assets/images/tiemcapheongquan/5.png",
    },
    {
        original: "/assets/images/tiemcapheongquan/6.png",
        thumbnail: "/assets/images/tiemcapheongquan/6.png",
    },
    {
        original: "/assets/images/tiemcapheongquan/7.png",
        thumbnail: "/assets/images/tiemcapheongquan/7.png",
    },
    {
        original: "/assets/images/tiemcapheongquan/8.png",
        thumbnail: "/assets/images/tiemcapheongquan/8.png",
    },
    {
        original: "/assets/images/tiemcapheongquan/9.png",
        thumbnail: "/assets/images/tiemcapheongquan/9.png",
    },
    {
        original: "/assets/images/tiemcapheongquan/10.png",
        thumbnail: "/assets/images/tiemcapheongquan/10.png",
    },
    {
        original: "/assets/images/tiemcapheongquan/11.png",
        thumbnail: "/assets/images/tiemcapheongquan/11.png",
    },
    {
        original: "/assets/images/tiemcapheongquan/12.png",
        thumbnail: "/assets/images/tiemcapheongquan/12.png",
    },
    {
        original: "/assets/images/tiemcapheongquan/13.png",
        thumbnail: "/assets/images/tiemcapheongquan/13.png",
    },
    {
        original: "/assets/images/tiemcapheongquan/14.png",
        thumbnail: "/assets/images/tiemcapheongquan/14.png",
    },
    {
        original: "/assets/images/tiemcapheongquan/15.png",
        thumbnail: "/assets/images/tiemcapheongquan/15.png",
    },
    {
        original: "/assets/images/tiemcapheongquan/15_1.png",
        thumbnail: "/assets/images/tiemcapheongquan/15_1.png",
    },
    {
        original: "/assets/images/tiemcapheongquan/16.png",
        thumbnail: "/assets/images/tiemcapheongquan/16.png",
    },
    {
        original: "/assets/images/tiemcapheongquan/17.png",
        thumbnail: "/assets/images/tiemcapheongquan/17.png",
    },
    {
        original: "/assets/images/tiemcapheongquan/18.png",
        thumbnail: "/assets/images/tiemcapheongquan/18.png",
    },
];

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
            <div className="flex-row gap-20 bg-[#F1E8C7]">
                <div className="main-section w-full min-h-[40rem]">
                    {/* Overlay */}
                    <div className="absolute top-0 left-0 right-0 bottom-0 bg-[#594633] opacity-[0.59]"></div>

                    <div className="absolute top-0 left-0 right-0 bottom-0 flex flex-col justify-center items-center gap-3">
                        <h1 className="uppercase text-white font-normal text-9xl font-iCielBCHolidaySerif">
                            Tiệm Cà Phê Ông Quan
                        </h1>
                        <h2 className="text-[#F1E8C7] text-3xl font-light font-iCielBCLeJeunePoster">
                            Không chỉ là coffee, chúng tôi bán với sự trải nghiệm
                        </h2>
                        <button className="bg-[#F1E8C7] text-[#594633] text-lg px-7 py-3 uppercase font-medium font-iCielBCCartelDeuxAlt">
                            Đặt bàn
                        </button>
                    </div>
                </div>
                <div className="p-16">
                    <div className="flex flex-col justify-center items-center gap-12 pb-12">
                        <h3 className="uppercase text-[#594633] text-xl font-iCielBCLivory">
                            trải nghiệm
                        </h3>
                        <h1 className="uppercase text-[#594633] font-normal text-6xl font-iCielBCBjola">
                            Về không gian
                        </h1>
                        <p className="text-center text-lg font-normal text-[#594633] leading-[128%] tracking-wider font-iCielBCLivory">
                            Tiệm Cà Phê Ông Quan là một ẩn mình trong lòng Cần Thơ, mang đến cho
                            bạn một trải nghiệm độc đáo với không gian lấy cảm hứng từ vẻ đẹp
                            của Đà Lạt. Với tông màu ấm áp và thoải mái, chúng tôi đã thiết kế
                            đồ nội thất thông minh và tinh tế để tạo ra một môi trường đặc biệt,
                            mang đến sự thoải mái tối đa cho khách hàng. Bạn có thể lựa chọn
                            ngồi ở các góc ngồi riêng tư, nơi bạn có thể thả lỏng và tận hưởng
                            không gian riêng tư yên bình, hoặc bạn cũng có thể chọn các bàn đơn
                            tại quán, tùy theo sở thích của mình. Tiệm Cà Phê Ông Quan sẽ luôn
                            sẵn sàng đón tiếp bạn và mang đến cho bạn cảm giác thư giãn và hòa
                            mình vào vẻ đẹp độc đáo của Đà Lạt tại trung tâm Cần Thơ.
                        </p>
                    </div>
                    <ImageGallery items={images} />
                </div>
                <div className="bg-[#594633] w-full min-h-[50rem] relative overflow-y-hidden">
                    <div className="absolute top-0 left-0 right-0 bottom-0 bg-[#594633] opacity-30 z-[1]"></div>
                    <div className="absolute w-96 -bottom-40 left-1/2 transform -translate-x-1/2">
                        <img src="/assets/images/tiemcapheongquan/best_seller.png" className="w-96" alt="cà phê sữa best seller" />
                    </div>
                    <div className="absolute top-0 left-0 right-0 bottom-0 flex flex-col justify-center items-center gap-7 z-[2]">
                        <h1 className="uppercase text-[#F1E8C7] font-normal text-9xl font-iCielBCBjola">
                            BEST SELLER #1
                        </h1>
                        <h2 className="text-[#F1E8C7] text-6xl font-light font-iCielBCDowntown">
                            CÀ PHÊ SỮA
                        </h2>
                        <button className="bg-[#F1E8C7] text-[#594633] text-lg px-7 py-3 uppercase font-medium font-iCielBCCartelDeuxAlt">
                            TÌM HIỂU THÊM
                        </button>
                    </div>
                </div>
                <div className="w-full min-h-[50rem] px-16 pt-16 pb-8">
                    <div className="pb-12">
                        <div className="flex flex-col justify-center items-center gap-12 pb-20">
                            <h1 className="uppercase text-[#594633] font-normal text-6xl font-iCielBCBjola">
                                Thực đơn có gì?
                            </h1>
                            <div className="flex justify-center items-center gap-8">
                                <Link
                                    href="javascript:void(0)"
                                    className="font-medium text-xl uppercase text-[#594633] font-iCielBCCartelDeuxAlt border-b-4 border-[#594633]"
                                >
                                    Cà Phê
                                </Link>
                                <Link
                                    href="javascript:void(0)"
                                    className="font-medium text-xl uppercase text-[#594633] font-iCielBCCartelDeuxAlt opacity-70"
                                >
                                    Trà
                                </Link>
                                <Link
                                    href="javascript:void(0)"
                                    className="font-medium text-xl uppercase text-[#594633] font-iCielBCCartelDeuxAlt opacity-70"
                                >
                                    Sữa Chua
                                </Link>
                                <Link
                                    href="javascript:void(0)"
                                    className="font-medium text-xl uppercase text-[#594633] font-iCielBCCartelDeuxAlt opacity-70"
                                >
                                    Cacao
                                </Link>
                                <Link
                                    href="javascript:void(0)"
                                    className="font-medium text-xl uppercase text-[#594633] font-iCielBCCartelDeuxAlt opacity-70"
                                >
                                    Đá Xay
                                </Link>
                                <Link
                                    href="javascript:void(0)"
                                    className="font-medium text-xl uppercase text-[#594633] font-iCielBCCartelDeuxAlt opacity-70"
                                >
                                    Khác
                                </Link>
                            </div>
                        </div>
                        <Swiper
                            modules={[Navigation, Pagination, Scrollbar, A11y]}
                            spaceBetween={50}
                            slidesPerView={3}
                            navigation
                            pagination={{ clickable: true }}
                            onSwiper={(swiper) => console.log(swiper)}
                            onSlideChange={() => console.log("slide change")}
                        >
                            <SwiperSlide>
                                <div className="w-80 h-96 bg-[#B68C62] flex flex-col justify-center items-center gap-4">
                                    <img src="/assets/images/tiemcapheongquan/product_1.png" className="w-40" alt="món cà phê" />
                                </div>
                                <h1 className="font-medium text-xl uppercase text-[#594633] font-iCielBCCartelDeuxAlt pt-6">
                                    Cà Phê Đen
                                </h1>
                                <h3 className="font-medium text-xl uppercase text-[#594633] font-iCielBCDowntown pt-1">
                                    25.0000 VND
                                </h3>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div className="w-80 h-96 bg-[#B68C62] flex flex-col justify-center items-center gap-4">
                                    <img src="/assets/images/tiemcapheongquan/product_2.png" className="w-40" alt="món cà phê" />
                                </div>
                                <h1 className="font-medium text-xl uppercase text-[#594633] font-iCielBCCartelDeuxAlt pt-6">
                                    Cà phê SỮA
                                </h1>
                                <h3 className="font-medium text-xl uppercase text-[#594633] font-iCielBCDowntown pt-1">
                                    25.0000 VND
                                </h3>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div className="w-80 h-96 bg-[#B68C62] flex flex-col justify-center items-center gap-4">
                                    <img src="/assets/images/tiemcapheongquan/product_3.png" className="w-40" alt="món cà phê" />
                                </div>
                                <h1 className="font-medium text-xl uppercase text-[#594633] font-iCielBCCartelDeuxAlt pt-6">
                                    Cà phê thường
                                </h1>
                                <h3 className="font-medium text-xl uppercase text-[#594633] font-iCielBCDowntown pt-1">
                                    25.0000 VND
                                </h3>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div className="w-80 h-96 bg-[#B68C62] flex flex-col justify-center items-center gap-4">
                                    <img src="/assets/images/tiemcapheongquan/product_1.png" className="w-40" alt="món cà phê" />
                                </div>
                                <h1 className="font-medium text-xl uppercase text-[#594633] font-iCielBCCartelDeuxAlt pt-6">
                                    Cà Phê Đen
                                </h1>
                                <h3 className="font-medium text-xl uppercase text-[#594633] font-iCielBCDowntown pt-1">
                                    25.0000 VND
                                </h3>
                            </SwiperSlide>
                        </Swiper>
                    </div>
                </div>
                <div className="w-full min-h-[10rem] px-16">
                    <div className="pb-8">
                        <div className="flex flex-col justify-center items-center gap-12 pb-20">
                            <h1 className="uppercase text-[#594633] font-normal text-4xl font-iCielBCBjola">
                                Cùng với những ưu đãi
                            </h1>
                            <div className="flex justify-center items-start gap-16">
                                <div className="flex flex-col justify-center items-center w-[40vw] gap-2">
                                    <img
                                        src="/assets/images/tiemcapheongquan/content_1.png"
                                        className="w-60 h-60 rounded-full"
                                        alt="icon ưu đãi tiệm cà phê ông quan"
                                    />
                                    <h1 className="text-[#594633] text-3xl px-7 py-3 uppercase font-medium font-iCielBCCartelDeuxAlt">
                                        ƯU ĐÃI #1
                                    </h1>
                                    <p className="text-justify text-lg font-normal text-[#594633] leading-[128%] tracking-wider font-iCielBCLivory">
                                        Sự kết hợp giữa Cappuccino và bánh bông lan nhân khô nho là
                                        một cách tuyệt vời để kết hợp hương vị ngọt ngào và tươi mát.
                                        Cappucino thơm ngon và mát lạnh sẽ làm dịu cơn khát vào những
                                        ngày nóng bức. Bánh bông lan nhân khô nho sẽ tạo ra một vị
                                        ngọt dịu, cùng với vị giòn của bánh, mang lại trải nghiệm
                                        thưởng thức đầy tuyệt vời. Hãy đến Tiệm cà phê Ông Quan của
                                        chúng tôi để thưởng thức ưu đãi này ngay hôm nay!
                                    </p>
                                </div>
                                <div className="flex flex-col justify-center items-center w-[40vw] gap-2">
                                    <img
                                        src="/assets/images/tiemcapheongquan/content_2.png"
                                        className="w-60 h-60 rounded-full"
                                        alt="icon ưu đãi tiệm cà phê ông quan"
                                    />
                                    <h1 className="text-[#594633] text-3xl px-7 py-3 uppercase font-medium font-iCielBCCartelDeuxAlt">
                                        ƯU ĐÃI #2
                                    </h1>
                                    <p className="text-justify text-lg font-normal text-[#594633] leading-[128%] tracking-wider font-iCielBCLivory">
                                        Cappuccino kết hợp với bánh sừng bò mặn tạo ra sự kết hợp ngon
                                        miệng giữa hương vị ngọt và mặn. Bạn có thể thưởng thức miếng
                                        bánh sừng bò mặn giòn tan kèm với một cốc Cappuccino thơm ngon
                                        và mát lạnh để tạo ra một trải nghiệm thưởng thức thực phẩm
                                        hoàn hảo.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full min-h-[50rem] px-16">
                    <div className="pb-12">
                        <div className="flex flex-col justify-center items-center gap-12 pb-20">
                            <h1 className="uppercase text-[#594633] font-normal text-4xl font-iCielBCBjola">
                                BÁNH NGỌT, SAO LẠI KHÔNG?
                            </h1>
                            <div className="flex justify-center items-start gap-16">
                                <div className="grid grid-cols-4 gap-12">
                                    <div>
                                        <div className="w-80 h-96 bg-[#B68C62] flex flex-col justify-center items-center gap-4">
                                            <img src="/assets/images/tiemcapheongquan/cake_1.png" className="w-40" alt="bánh ngọt tiệm cà phê ông quan" />
                                        </div>
                                        <h1 className="font-medium text-xl uppercase text-[#594633] font-iCielBCCartelDeuxAlt pt-6">
                                            BÁNH CUỘN NHO KHÔ
                                        </h1>
                                        <h3 className="font-medium text-xl uppercase text-[#594633] font-iCielBCDowntown pt-1">
                                            25.0000 VND
                                        </h3>
                                    </div>
                                    <div>
                                        <div className="w-80 h-96 bg-[#B68C62] flex flex-col justify-center items-center gap-4">
                                            <img src="/assets/images/tiemcapheongquan/cake_2.png" className="w-40" alt="bánh ngọt tiệm cà phê ông quan" />
                                        </div>
                                        <h1 className="font-medium text-xl uppercase text-[#594633] font-iCielBCCartelDeuxAlt pt-6">
                                            BÁNH NƯỚNG MÈ
                                        </h1>
                                        <h3 className="font-medium text-xl uppercase text-[#594633] font-iCielBCDowntown pt-1">
                                            25.0000 VND
                                        </h3>
                                    </div>
                                    <div>
                                        <div className="w-80 h-96 bg-[#B68C62] flex flex-col justify-center items-center gap-4">
                                            <img src="/assets/images/tiemcapheongquan/cake_3.png" className="w-40" alt="bánh ngọt tiệm cà phê ông quan" />
                                        </div>
                                        <h1 className="font-medium text-xl uppercase text-[#594633] font-iCielBCCartelDeuxAlt pt-6">
                                            BÁNH SỪNG
                                        </h1>
                                        <h3 className="font-medium text-xl uppercase text-[#594633] font-iCielBCDowntown pt-1">
                                            25.0000 VND
                                        </h3>
                                    </div>
                                    <div>
                                        <div className="w-80 h-96 bg-[#B68C62] flex flex-col justify-center items-center gap-4">
                                            <img src="/assets/images/tiemcapheongquan/cake_4.png" className="w-40" alt="bánh ngọt tiệm cà phê ông quan" />
                                        </div>
                                        <h1 className="font-medium text-xl uppercase text-[#594633] font-iCielBCCartelDeuxAlt pt-6">
                                            BÁNH MẬT NGỌT
                                        </h1>
                                        <h3 className="font-medium text-xl uppercase text-[#594633] font-iCielBCDowntown pt-1">
                                            25.0000 VND
                                        </h3>
                                    </div>
                                    <div>
                                        <div className="w-80 h-96 bg-[#B68C62] flex flex-col justify-center items-center gap-4">
                                            <img src="/assets/images/tiemcapheongquan/cake_5.png" className="w-40" alt="bánh ngọt tiệm cà phê ông quan" />
                                        </div>
                                        <h1 className="font-medium text-xl uppercase text-[#594633] font-iCielBCCartelDeuxAlt pt-6">
                                            BÁNH MỨT DÂU
                                        </h1>
                                        <h3 className="font-medium text-xl uppercase text-[#594633] font-iCielBCDowntown pt-1">
                                            25.0000 VND
                                        </h3>
                                    </div>
                                    <div>
                                        <div className="w-80 h-96 bg-[#B68C62] flex flex-col justify-center items-center gap-4">
                                            <img src="/assets/images/tiemcapheongquan/cake_6.png" className="w-40" alt="bánh ngọt tiệm cà phê ông quan" />
                                        </div>
                                        <h1 className="font-medium text-xl uppercase text-[#594633] font-iCielBCCartelDeuxAlt pt-6">
                                            BÁNH TRỨNG MUỐI
                                        </h1>
                                        <h3 className="font-medium text-xl uppercase text-[#594633] font-iCielBCDowntown pt-1">
                                            25.0000 VND
                                        </h3>
                                    </div>
                                    <div>
                                        <div className="w-80 h-96 bg-[#B68C62] flex flex-col justify-center items-center gap-4">
                                            <img src="/assets/images/tiemcapheongquan/cake_7.png" className="w-40" alt="bánh ngọt tiệm cà phê ông quan" />
                                        </div>
                                        <h1 className="font-medium text-xl uppercase text-[#594633] font-iCielBCCartelDeuxAlt pt-6">
                                            BÁNH QUẾ MẬT ONG
                                        </h1>
                                        <h3 className="font-medium text-xl uppercase text-[#594633] font-iCielBCDowntown pt-1">
                                            25.0000 VND
                                        </h3>
                                    </div>
                                    <div>
                                        <div className="w-80 h-96 bg-[#B68C62] flex flex-col justify-center items-center gap-4">
                                            <img src="/assets/images/tiemcapheongquan/cake_8.png" className="w-40" alt="bánh ngọt tiệm cà phê ông quan" />
                                        </div>
                                        <h1 className="font-medium text-xl uppercase text-[#594633] font-iCielBCCartelDeuxAlt pt-6">
                                            BÁNH TRỨNG NƯỚNG
                                        </h1>
                                        <h3 className="font-medium text-xl uppercase text-[#594633] font-iCielBCDowntown pt-1">
                                            25.0000 VND
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-[#594633] w-full min-h-[50rem] relative overflow-y-hidden">
                    <div class="flex flex-col justify-center items-center px-16 pt-24">
                        <h1 className="uppercase text-[#F1E8C7] font-normal text-4xl font-iCielBCBjola pb-24">
                            Vì sao chúng tôi là nơi lí tưởng cho bạn?
                        </h1>
                        <div className="grid grid-cols-3 gap-12">
                            <div className="flex flex-col justify-center items-center gap-8">
                                <img src="/assets/images/tiemcapheongquan/icon_1.png" alt="icon" />
                                <h1 className="text-[#F1E8C7] text-2xl font-iCielBCCartelDeuxAlt">
                                    VỀ CÀ PHÊ
                                </h1>
                                <p className="text-[#F1E8C7] text-xl font-iCielBCLivory text-justify">
                                    Cà phê tại quán của chúng tôi được pha chế từ những hạt cà phê
                                    chọn lọc kỹ càng và rang theo phương pháp truyền thống để đảm
                                    bảo hương vị đặc trưng và chất lượng tuyệt vời. Đến với quán cà
                                    phê của chúng tôi, bạn sẽ được thưởng thức một tách cà phê đậm
                                    đà và thơm ngon nhất.
                                </p>
                            </div>
                            <div className="flex flex-col justify-center items-center gap-8">
                                <img src="/assets/images/tiemcapheongquan/icon_2.png" alt="icon" />
                                <h1 className="text-[#F1E8C7] text-2xl font-iCielBCCartelDeuxAlt">
                                    VỀ MÔI TRƯỜNG
                                </h1>
                                <p className="text-[#F1E8C7] text-xl font-iCielBCLivory text-justify">
                                    Quán của chúng tôi có không gian ấm cúng và thiết kế sang trọng,
                                    tạo ra một môi trường thư giãn và đầy cảm hứng cho khách hàng.
                                    Bạn sẽ có cơ hội thưởng thức cà phê tuyệt vời trong một không
                                    gian thoải mái và đầy hứng khởi. Hãy ghé thăm quán của chúng tôi
                                    để tận hưởng không gian đẹp và thoải mái nhất.
                                </p>
                            </div>
                            <div className="flex flex-col justify-center items-center gap-8">
                                <img src="/assets/images/tiemcapheongquan/icon_3.png" alt="icon" />
                                <h1 className="text-[#F1E8C7] text-2xl font-iCielBCCartelDeuxAlt">
                                    VỀ GIAO HÀNG
                                </h1>
                                <p className="text-[#F1E8C7] text-xl font-iCielBCLivory text-justify">
                                    Quán của chúng tôi có không gian ấm cúng và thiết kế sang trọng,
                                    tạo ra một môi trường thư giãn và đầy cảm hứng cho khách hàng.
                                    Bạn sẽ có cơ hội thưởng thức cà phê tuyệt vời trong một không
                                    gian thoải mái và đầy hứng khởi. Hãy ghé thăm quán của chúng tôi
                                    để tận hưởng không gian đẹp và thoải mái nhất.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full px-16 pt-16">
                    <div className="pb-12">
                        <div className="flex flex-col justify-center items-center gap-12 pb-20">
                            <h1 className="uppercase text-[#594633] font-normal text-4xl font-iCielBCBjola">
                                lời cảm ơn
                            </h1>
                            <p className="text-[#594633] font-normal text-base font-iCielBCLivory text-center">
                                Chúng tôi rất cảm kích sự quan tâm của bạn đến Tiệm cà phê Ông
                                Quan và mong muốn có cơ hội chào đón bạn tới thưởng thức các loại
                                nước uống và bánh ngọt tuyệt vời của chúng tôi. Chúng tôi rất trân trọng sự quan tâm của bạn và
                                hy vọng được đón tiếp bạn tại Tiệm cà phê Ông Quan sớm nhất!
                            </p>
                        </div>
                    </div>
                </div>
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
