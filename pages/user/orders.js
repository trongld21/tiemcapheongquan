import { useEffect, useState } from 'react';

import UserLayout from '@/components/Layout/UserLayout';
import InfoOrder from '@/components/Order/InfoOrder';
import Thumbnail from '@/components/Utils/Thumbnail';
import UserSideBar from '@/components/Utils/UserSideBar';
import useNotification from '@/hooks/useNotification';

import apiOrder from '../api/user/apiOrder';

import getServerSideProps from '@/lib/userServerProps';
import { Empty, Select } from 'antd';

const All = 'All';

const Orders = () => {
    // toast message
    const { showError } = useNotification();

    // data order
    const [data, setData] = useState();
    const [dataFilter, setDataFilter] = useState();

    // sort order
    const [sortBy, setSortBy] = useState(All);

    // api get data
    const fetchData = async () => {
        try {
            const res = await apiOrder.GetAllOfUser();
            if (res && res.success === true) {
                setData(res.data);
                setDataFilter(res.data);
            } else {
                showError('Fail', res.data.message);
            }
        } catch (err) {
            console.log(err.message);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSortByChange = (value) => {
        if (value.value === All) {
            setDataFilter(data);
        } else {
            setDataFilter(data.filter((item) => item.orderStatus === value.value));
        }
        setSortBy(value.value);
    };

    return (
        <UserLayout>
            <Thumbnail title={'Đơn hàng'} />
            <UserSideBar>
                <div className="lg:w-11/12 w-full mx-auto flex flex-col gap-4">
                    <div className="flex gap-4 items-center">
                        <label htmlFor="sortBy" className="font-semibold text-opacity-50 text-black">
                            Sắp xếp:
                        </label>
                        <Select
                            labelInValue
                            defaultValue={{
                                value: 'All',
                                label: 'Tất cả',
                            }}
                            style={{
                                width: '150px',
                            }}
                            onChange={(value) => handleSortByChange(value)}
                            options={[
                                {
                                    value: 'All',
                                    label: 'Tất cả',
                                },
                                {
                                    value: 'Ordered',
                                    label: 'Đã đặt hàng',
                                },
                                {
                                    value: 'Delivering',
                                    label: 'Đang giao hàng',
                                },
                                {
                                    value: 'Received',
                                    label: 'Đã nhận hàng',
                                },
                                {
                                    value: 'Canceled',
                                    label: 'Đã hủy đơn hàng',
                                },
                            ]}
                        />
                    </div>
                    <div className="flex flex-col gap-10">
                        {dataFilter ? (
                            dataFilter.map((order) => (
                                <InfoOrder
                                    key={order.orderId}
                                    data={order}
                                    fetchData={() => fetchData()}
                                    setSortBy={() => setSortBy(All)}
                                />
                            ))
                        ) : (
                            <Empty
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description={'Sản phẩm không tồn tại'}
                                className="w-full h-full"
                            />
                        )}
                    </div>
                </div>
            </UserSideBar>
        </UserLayout>
    );
};

export default Orders;

export { getServerSideProps };
