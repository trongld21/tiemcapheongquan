import { useRouter } from 'next/router';
import React from 'react';

const LatestCard = ({ date, title, imgUrl, slug }) => {
    const router = useRouter();
    const handleNewDetail = (slug) => {
        //go product detail page by id
        router.push(`/news/${slug}`);
    };
    return (
        <div
            className="w-full flex justify-between gap-5 items-center cursor-pointer"
            onClick={() => handleNewDetail(slug)}
        >
            <img className="w-28 h-32 object-cover" src={imgUrl} alt="thumbnail" />
            <div className="flex flex-col gap-2 h-full">
                <h3 className="font-bold uppercase text-sm">{title}</h3>
                <p className="text-secondary text-sm font-normal">{date}</p>
            </div>
        </div>
    );
};

export default LatestCard;
