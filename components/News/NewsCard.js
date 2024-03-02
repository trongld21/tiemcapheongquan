import React from 'react';
import SocialListIcon from '../Utils/SocialListIcon';
import { useRouter } from 'next/router';

const NewsCard = ({ date, title, imgUrl, actor, description, id, slug }) => {
    const router = useRouter();
    const handleNewDetail = (slug) => {
        //go product detail page by id
        router.push(`/news/${slug}`);
    };
    return (
        <div className="w-full max-sm:pb-5 pb-10 flex justify-between max-sm:gap-5 gap-10 items-center last:border-none border-b border-[#00000080]">
            <div className="w-1/3 max-sm:w-5/12 h-60 lg:h-80 max-sm:h-40">
                <img className="w-full h-full object-cover rounded-10" src={imgUrl} alt="img card" />
            </div>
            <div className="flex flex-col items-start max-sm:gap-2 gap-6 lg:pr-10 w-2/3 max-sm:w-7/12">
                <div className="flex flex-col items-start">
                    <p className="max-sm:text-xs text-grey text-sm">{date}</p>
                    <h4 className="font-bold uppercase max-sm:text-sm text-2xl lg:text-3xl m-0 ">{title}</h4>
                    <p className="font-medium text-secondary text-sm my-1 max-sm:text-xs">Người đăng: {actor}</p>
                    <p
                        className="font-normal text-sm mt-3 max-sm:line-clamp-2 line-clamp-5 max-sm:hidden"
                        dangerouslySetInnerHTML={{ __html: description }}
                    ></p>
                </div>
                <div className="flex flex-row gap-2 w-full max-md:items-center items-start justify-between lg:gap-2 max-sm:flex-col max-sm:items-start">
                    <button
                        className="py-2 px-4 lg:px-6 w-fit font-bold text-xs rounded lg:text-sm bg-transparent border border-black hover:bg-primary hover:text-white hover:border-white"
                        onClick={() => handleNewDetail(slug)}
                    >
                        Xem thêm
                    </button>
                    <SocialListIcon url={`${process.env.NEXT_PUBLIC_DOMAIN}/news/${slug}`} content="TKDecor" />
                </div>
            </div>
        </div>
    );
};

export default NewsCard;
