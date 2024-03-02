import React from 'react';

const SaleByProducts = ({ data }) => {
    return (
        <>
            {data && (
                <div className="min-w-[300px] lg:h-[70vh] h-[50vh] p-4 border rounded-lg bg-white overflow-scroll">
                    <h1>Top 5 sản phẩm bán chạy gần đây</h1>
                    <ul className="grid grid-cols-1 gap-2">
                        {data &&
                            data.map((order, productId) => (
                                <li
                                    key={productId}
                                    className="bg-gray-50 hover:bg-gray-100 rounded-lg my-3 p-2 flex w-fit items-center"
                                >
                                    <div className="pl-4 flex gap-2 items-center justify-start">
                                        <p className="text-gray-400 text-sm">{order.productName}</p>
                                        <span>-</span>
                                        <p className="text-gray-800 font-bold">{order.totalQuantity} sản phẩm</p>
                                    </div>
                                </li>
                            ))}
                    </ul>
                </div>
            )}
        </>
    );
};

export default SaleByProducts;
