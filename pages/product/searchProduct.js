import Image from 'next/image';
import React, { useState, useEffect, useContext } from 'react';
import Thumbnail from '@/components/Utils/Thumbnail';
import { useRouter } from 'next/router';
import { Pagination, Select, Space } from 'antd';
import Card from '@/components/Product/Card';
import UserLayout from '@/components/Layout/UserLayout';
import apiProduct from '../api/apiProduct';
import apiFavorite from '../api/apiFavorite';
import { UserContext } from '@/contexts/userContext';
import Spinner from '@/components/Utils/Spinner';

function SearchProduct() {
    const { isLogged } = useContext(UserContext);

    const router = useRouter();
    const [dataSearch, setDataSearch] = useState();
    const [productDisplayList, setProductDisplayList] = useState([]);
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(6);
    const [sortValue, setSortValue] = useState('default');
    const [totalItem, setTotalItem] = useState();
    const [isNotFound, setIsNotFound] = useState(true);

    const handlePageChange = (page) => {
        setPageIndex(page);
    };
    const handleSortChange = (value) => {
        setSortValue(value);
    };
    useEffect(() => {
        const fetchData = async () => {
            const { search_query } = router.query;
            const decodedData = search_query ? decodeURIComponent(search_query) : '';
            const response = await apiProduct.GetAll('', decodedData, sortValue, pageIndex, pageSize);
            if (response.success) {
                if (response.data.products === 0) {
                    setIsNotFound(true);
                } else {
                    setIsNotFound(false);
                    setDataSearch(response);
                    setProductDisplayList(response.data.products);
                    setTotalItem(response.data.totalItem);
                }
            } else {
                setIsNotFound(true);
            }
        };
        fetchData();
    }, [router.query, isNotFound, isLogged, sortValue, pageIndex]);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const handleStart = () => {
            setLoading(true);
        };
        const handleComplete = () => {
            setLoading(false);
        };

        router.events.on('routeChangeStart', handleStart);
        router.events.on('routeChangeComplete', handleComplete);
        router.events.on('routeChangeError', handleComplete);

        return () => {
            router.events.off('routeChangeStart', handleStart);
            router.events.off('routeChangeComplete', handleComplete);
            router.events.off('routeChangeError', handleComplete);
        };
    }, [router]);

    return (
        <UserLayout>
            <Thumbnail title={'Tìm kiếm'} content={'Kết quả tìm kiếm'} />
            {loading && <Spinner />}
            <>
                {isNotFound ? (
                    <div>
                        Rất tiếc, chúng tôi không tìm thấy sản phẩm phù hợp với yêu cầu của bạn. Vui lòng thử lại hoặc
                        khám phá thêm các sản phẩm khác trong danh mục của chúng tôi.
                    </div>
                ) : (
                    <div className="scale-90 mx-auto w-full flex flex-col gap-10">
                        <section className="flex justify-between">
                            <div className="flex gap-28">
                                <div className="flex gap-2">
                                    <p className="text-base my-auto font-semibold text-primary">{totalItem}</p>
                                    <p className="text-base my-auto font-extrabold text-black">Sản phẩm</p>
                                </div>

                                <div className="hidden lg:flex gap-2">
                                    <p className="text-base my-auto font-semibold text-[#00000080]">Sắp xếp theo:</p>
                                    <Space wrap>
                                        <Select
                                            defaultValue="Mặc định"
                                            style={{ width: 200 }}
                                            options={[
                                                { value: 'default', label: 'Mặc định' },
                                                { value: 'price-high-to-low', label: 'Giá: Từ cao đến thấp' },
                                                { value: 'price-low-to-high', label: 'Giá: Từ thấp đến cao' },
                                                { value: 'average-rate', label: 'Theo đánh giá của khách hàng' },
                                            ]}
                                            onChange={(value, option) => {
                                                handleSortChange(option.value);
                                            }}
                                        />
                                    </Space>
                                </div>
                            </div>
                        </section>
                        <section className="grid lg:grid-cols-3 grid-cols-3 max-sm:grid-cols-2 max-sm:gap-5 gap-6 lg:gap-10">
                            <Card dataCard={productDisplayList} isLogged={isLogged} />
                        </section>
                        {totalItem > pageSize ? (
                            <Pagination
                                defaultCurrent={pageIndex}
                                total={totalItem}
                                pageSize={pageSize}
                                onChange={handlePageChange}
                            />
                        ) : null}
                    </div>
                )}
            </>
        </UserLayout>
    );
}
export default SearchProduct;
