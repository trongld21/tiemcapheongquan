import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

// Ant Design
import { Table, Tag } from 'antd';

// Component
import AdminTitle from '@/components/Admin/AdminTitle';
import AdminLayout from '@/components/Layout/AdminLayout';

// Library to convert date time
import moment from 'moment';

// API
import ordersApi from '@/pages/api/manager/managerOrderAPI';
import getServerSideProps from '@/lib/adminServerProps';
import { formateDateTimeVN } from '@/components/Utils/FormatDate';
import removeDiacritics from '@/components/Utils/removeDiacritics';

function Orders() {
    const router = useRouter();
    const [data, setData] = useState([]);
    const [dataSearch, setSearchData] = useState();

    const orderStatusMapping = {
        Ordered: 'Đã đặt hàng',
        Delivering: 'Đang giao hàng',
        Received: 'Đã nhận hàng',
        Canceled: 'Đã hủy',
        Refund: 'Hoàn tiền',
    };

    const orderStatus = {
        0: 'Ordered',
        1: 'Delivering',
        2: 'Received',
        3: 'Canceled',
        4: 'Refund',
    };

    function getStatusInVietnamese(statusEnglish) {
        console.log(statusEnglish);
        return orderStatusMapping[statusEnglish] || 'Trạng thái không hợp lệ';
    }

    function getStatusInEnglish(statusVietnamese) {
        for (const [english, vietnamese] of Object.entries(orderStatusMapping)) {
            if (vietnamese === statusVietnamese) {
                return english;
            }
        }
        return 'Trạng thái không hợp lệ';
    }

    function getStatusInVietnamese(statusKey) {
        return orderStatusMapping[statusKey] || 'Trạng thái không hợp lệ';
    }

    useEffect(() => {
        const fetchData = async () => {
            const res = await ordersApi.GetAll();
            if (res && res.success) {
                console.log(res.data);
                setData(res.data);
                setSearchData(res.data);
            }
        };
        fetchData();
    }, []);

    const handleClick = (id) => {
        router.push(`/admin/orders/detail/${id}`);
    };

    const formateDateTime = (text) => {
        const dateTime = moment(text, 'YYYY-MM-DD HH:mm:ss.SSS');
        const formattedDateString = dateTime.format('D MMMM YYYY h:mm A');
        const splittedDate = formattedDateString.split(' ');
        const datePart = splittedDate.slice(0, 3).join(' ');
        const timePart = splittedDate.slice(3).join(' ');
        return {
            datePart: datePart,
            timePart: timePart,
        };
    };
    const handleSearchOnchange = (event) => {
        const searchTerm = event.target.value.toLowerCase().trim(); // Chuyển giá trị nhập vào thành chữ thường và loại bỏ khoảng trống thừa
        if (searchTerm !== '') {
            const normalizedSearchTerm = removeDiacritics(searchTerm);
            const filteredOrder = data.filter(
                (order) =>
                    removeDiacritics(order.orderId?.toLowerCase() || '').includes(normalizedSearchTerm) || // Tìm kiếm theo tiêu đề
                    removeDiacritics(order.email?.toLowerCase() || '').includes(normalizedSearchTerm) || // Tìm kiếm theo nội dung
                    removeDiacritics(order.fullName?.toLowerCase() || '').includes(normalizedSearchTerm), // Tìm kiếm theo nội dung
            );
            setSearchData(filteredOrder);
        } else {
            setSearchData(data);
        }
    };
    const columns = [
        {
            title: 'Mã đơn hàng',
            dataIndex: 'orderId',
            // sorter: (a, b) => a.id.localeCompare(b.id),
            render: (text) => (
                <button onClick={() => handleClick(text)} className="text-grey link-order-detail">
                    {text}
                </button>
            ),
        },
        {
            title: 'Họ và tên',
            dataIndex: 'fullName',
            // sorter: (a, b) => a.username.localeCompare(b.username),
            render: (text) => <p className="font-semibold">{text}</p>,
        },
        {
            title: 'Mail',
            dataIndex: 'email',
            // sorter: (a, b) => a.username.localeCompare(b.username),
            render: (text) => <p className="font-semibold">{text}</p>,
        },
        {
            title: 'Ngày tạo đơn',
            dataIndex: 'createdAt',
            render: (text) => {
                const dateTime = formateDateTimeVN(text);

                return (
                    <p className="font-semibold">
                        {dateTime.datePart}
                        <br />
                        <b className="text-grey text-sm font-medium">{dateTime.timePart}</b>
                    </p>
                );
            },
        },
        {
            title: 'Ngày giao hàng',
            dataIndex: 'updatedAt',
            render: (text) => {
                const dateTime = formateDateTime(text);

                return (
                    <p className="font-semibold">
                        {dateTime.datePart}
                        <br />
                        <b className="text-grey text-sm font-medium">{dateTime.timePart}</b>
                    </p>
                );
            },
        },
        {
            title: 'Tình trạng đặt hàng',
            dataIndex: 'orderStatus',
            render: (status) => (
                <Tag
                    color={
                        status === orderStatus[0]
                            ? 'default'
                            : status === orderStatus[1]
                            ? 'processing'
                            : status === orderStatus[2]
                            ? 'success'
                            : status === orderStatus[3]
                            ? 'error'
                            : 'warning'
                    }
                >
                    {getStatusInVietnamese(status)}
                </Tag>
            ),
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
            render: (text) => <p className="truncate w-40">{text}</p>,
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'totalPrice',
            render: (text) => <p>{text} VND</p>,
        },
        {
            title: '',
            dataIndex: 'orderId',
            render: (text) => (
                <Link href={`/admin/orders/detail/${text}`} className="w-8 h-8">
                    <img className="cursor-pointer w-8 h-8" src="/assets/svg/pencil.svg" alt="" />
                </Link>
            ),
        },
    ];

    const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };

    return (
        <AdminLayout>
            <AdminTitle content="Danh sách đơn hàng" />
            <div className="flex flex-col gap-10">
                <section className="flex justify-between text-sm items-center">
                    <div className="w-8/12 relative border-b h-fit">
                        <input
                            placeholder="Tìm kiếm đơn hàng"
                            className="outline-none p-2 w-full rounded-lg"
                            onChange={handleSearchOnchange}
                        />
                    </div>
                </section>
                <section>
                    <Table columns={columns} rowKey="orderId" dataSource={dataSearch || []} onChange={onChange} />
                </section>
            </div>
        </AdminLayout>
    );
}

export default Orders;

export { getServerSideProps };
