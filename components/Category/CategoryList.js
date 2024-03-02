import Image from 'next/image';
import React from 'react';
import PrimaryButton from '../Utils/PrimaryButton';
import { useRouter } from 'next/router';

const CategoryList = ({ dataCategory }) => {
    const router = useRouter();
    return (
        <div className="w-11/12 mx-auto">
            <h2 className="lg:text-lg font-semibold max-md:mb-6 mb-10">DANH MỤC SẢN PHẨM</h2>
            <div className="w-11/12 lg:w-9/12 grid grid-cols-3 lg:grid-cols-5 gap-10 justify-between mx-auto">
                {dataCategory &&
                    dataCategory.map((item) => (
                        <div
                            onClick={() => router.push(`/product?categoryId=${item.categoryId}`)}
                            className="custom-box-category lg:py-10 flex cursor-pointer flex-col gap-2 w-48 max-sm:w-24 mx-auto overflow-hidden bg-white rounded-xl "
                            key={item.categoryId}
                        >
                            <div className="bg-white rounded-lg py-2">
                                <Image
                                    alt="sofa-image"
                                    src={item.thumbnail}
                                    className="w-12 lg:w-24 lg:h-20 h-12 mx-auto"
                                    width={100}
                                    height={100}
                                />
                            </div>
                            <span className="text-secondary text-base text-center font-semibold mx-auto w-full break-words">
                                {item.name}
                            </span>
                        </div>
                    ))}
            </div>
            <PrimaryButton
                content={'Xem tất cả'}
                classCss={'hidden mx-auto mt-10 border border-black px-4 py-2 text-xs font-semibold rounded-lg'}
            />
        </div>
    );
};

export default CategoryList;
