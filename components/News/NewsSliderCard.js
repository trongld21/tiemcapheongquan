import { useRouter } from 'next/router';
import React from 'react';

const NewsSliderCard = ({ slug, date, title, description, imgUrl }) => {
    const router = useRouter();
    const handleClick = () => {
        console.log(slug);
        router.push(`/news/${slug}`);
    };
    return (
        <div className="flex gap-4 lg:gap-10 max-sm:gap-0 max-sm:h-fit h-72 lg:h-80 bg-secondary max-sm:flex-wrap-reverse">
            <div className="max-sm:py-3 max-sm:h-56 py-10 px-8 lg:px-16 flex flex-col max-sm:w-full w-7/12 text-white gap-2 my-auto h-fit">
                <p className="text-xs">{date}</p>
                <h1 className="font-semibold uppercase text-sm lg:text-xl line-clamp-2">{title}</h1>
                <span
                    className="text-xs font-light max-sm:line-clamp-3 line-clamp-4"
                    dangerouslySetInnerHTML={{ __html: description }}
                ></span>
                <button
                    className="w-fit border-2 my-2 mx-0 max-sm:mx-auto border-white py-1 lg:py-2 px-2 lg:px-4 font-medium text-sm text-white hover:bg-white hover:text-secondary"
                    onClick={() => handleClick(slug)}
                >
                    Xem Thêm
                </button>
            </div>
            <div className="w-5/12 max-sm:h-48 h-70 max-sm:w-full">
                <img className="lg:w-full h-full" alt="sofa-image" src={imgUrl} />
            </div>
        </div>
    );
};

export default NewsSliderCard;
