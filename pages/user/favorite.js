import UserLayout from '@/components/Layout/UserLayout';
import Thumbnail from '@/components/Utils/Thumbnail';
import UserSideBar from '@/components/Utils/UserSideBar';
import Card from '@/components/Product/Card';
import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '@/contexts/userContext';
import getServerSideProps from '@/lib/userServerProps';
import apiFavorite from '../api/apiFavorite';
import { Pagination } from 'antd';
import Link from 'next/link';
import CustomPagination from '@/components/Utils/Pagination';

const Favorite = () => {
    const { isLogged } = useContext(UserContext);
    const [currentPage, setCurrentPage] = useState(1);
    const [productDisplayList, setProductDisplayList] = useState([]);
    const elementPerPage = 9;

    const fetchData = async () => {
        const response = await apiFavorite.GetFavoriteOfUser(currentPage, elementPerPage);
        if (response.success) {
            setProductDisplayList(response?.data);
        }
    };
    useEffect(() => {
        fetchData();
    }, [currentPage]);
    return (
        <UserLayout>
            <Thumbnail title={'Sản phẩm yêu thích'} />
            <UserSideBar>
                {productDisplayList?.favorites?.length > 0 ? (
                    <div className="flex flex-col gap-10">
                        <div className="grid lg:grid-cols-3 gap-6 grid-cols-2">
                            <Card dataCard={productDisplayList?.favorites} isLogged={isLogged} fetchData={fetchData} />
                        </div>
                        <CustomPagination
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            totalPages={Number(productDisplayList?.totalPages)}
                        />
                    </div>
                ) : (
                    <div>
                        <p>
                            Danh sách sản phẩm yêu thích của bạn đang trống. <br /> Hãy bắt đầu bằng cách thêm các sản
                            phẩm mà bạn yêu thích vào danh sách này. Điều này giúp bạn dễ dàng theo dõi và quản lý những
                            sản phẩm mà bạn quan tâm.
                        </p>
                        <div className="relative w-64 overflow-hidden h-16 left-[30%]">
                            <Link href="/product" className="text-primary">
                                Xem thêm các sản phẩm khác
                            </Link>
                            <img
                                alt="thumbnail"
                                src="/assets/svg/arrow_right_anim.svg"
                                className="h-6 w-12 absolute -left-12 animation-arrow-right"
                            ></img>
                        </div>
                    </div>
                )}
            </UserSideBar>
        </UserLayout>
    );
};

export default Favorite;
export { getServerSideProps };
