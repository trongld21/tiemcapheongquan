import React, { useState } from 'react';
import Image from 'next/image';
const ProductCard = () => {
    const [isClicked, setIsClicked] = useState(false);

    const handleClick = () => {
        setIsClicked(!isClicked);
    };
    return (
        //sm:w-1/2 md:w-1/4 lg:w-1/4
        <div className="w-full ">
            <div className="w-full h-[28rem] block max-w-sm mx-auto bg-white rounded-lg hover:scale-110  hover:shadow-lg shadow">
                <div className="p-6">
                    <button onClick={handleClick}>
                        <Image
                            className="w-5 h-5"
                            alt="svg"
                            src={isClicked ? '/assets/svg/heart_full.svg' : '/assets/svg/heart_empty.svg'}
                            width={2}
                            height={2}
                        />
                    </button>

                    <div className="flex items-center justify-center ">
                        <div className="bg-center bg-no-repeat bg-cover bg-[url('/img/simple-gray-system-indoor-home-background-template_149197-18.jpg')] w-52 h-56 flex items-center justify-center"></div>
                    </div>
                    <div className="font-medium text-lg leading-[1.34rem] text-left flex items-center mt-2">
                        Name Name Name
                    </div>
                    <div className="inline-flex items-center justify-center">
                        <label className="inline-flex items-center justify-center text-[#A69689] font-normal text-base leading-[1.37rem]">
                            <Image className="w-4 h-4" alt="svg" src="/svgs/starclicked.svg" width={2} height={2} />
                            <Image className="w-4 h-4" alt="svg" src="/svgs/starclicked.svg" width={2} height={2} />
                            <Image className="w-4 h-4" alt="svg" src="/svgs/starclicked.svg" width={2} height={2} />
                            <Image className="w-4 h-4" alt="svg" src="/svgs/starclicked.svg" width={2} height={2} />
                            <Image className="w-4 h-4" alt="svg" src="/svgs/star.svg" width={2} height={2} />
                            <p className="ml-1">(10)</p>
                        </label>
                    </div>
                    <div className="font-inter font-bold text-[1.25rem] leading-44 text-left w-full">$1023</div>
                    <div className="w-full flex items-center justify-center mt-5">
                        <button className="flex items-center justify-center bg-transparent hover:bg-[#A69689] text-[#A69689] font-semibold hover:text-white py-2 px-4 border border[#A69689] hover:border-transparent rounded">
                            ADD TO CARD
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
