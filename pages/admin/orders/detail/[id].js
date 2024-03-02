import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
// Component
import BackButton from '@/components/Utils/BackButton';
import convertToVND from '@/components/Utils/convertToVND';
import AdminLayout from '@/components/Layout/AdminLayout';
// Ant Design
import { Tag } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Modal } from 'antd';
const { confirm } = Modal;
// API
import ordersApi from '@/pages/api/manager/managerOrderAPI';
import managerOrderAPI from '@/pages/api/manager/managerOrderAPI';
import useNotification from '@/hooks/useNotification';
import getServerSideProps from '@/lib/adminServerProps';
import { formateDateTimeVN } from '@/components/Utils/FormatDate';

function OrdersDetail() {
    const { showError, showSuccess } = useNotification();
    const router = useRouter();
    const { id } = router.query;
    const [data, setData] = useState([]);
    // console.log('🚀 ~ file: [id].js:18 ~ OrdersDetail ~ data:', data);
    const orderStatus = {
        0: 'Ordered',
        1: 'Delivering',
        2: 'Received',
        3: 'Canceled',
        4: 'Refund',
    };

    const orderStatusMapping = {
        Ordered: 'Đã đặt hàng',
        Delivering: 'Đang giao hàng',
        Received: 'Đã nhận hàng',
        Canceled: 'Đã hủy',
        Refund: 'Hoàn tiền',
    };

    const fetchData = async () => {
        if (id) {
            const dataFetch = await ordersApi.GetByID(id);
            if (dataFetch && dataFetch.success) {
                setData(dataFetch.data);
                console.log('🚀 ~ file: [id].js:32 ~ fetchData ~ dataFetch.data:', dataFetch.data);
            }
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const totalPriceProduct = (price, quantity) => {
        const total = price * quantity;
        return convertToVND(total);
    };

    // const formateDateTime = (text) => {
    //     const dateTime = moment(text, 'YYYY-MM-DD HH:mm:ss.SSS');
    //     const formattedDateString = dateTime.format('D MMMM YYYY h:mm A');
    //     const splittedDate = formattedDateString.split(' ');
    //     const datePart = splittedDate.slice(0, 3).join(' ');
    //     const timePart = splittedDate.slice(3).join(' ');
    //     return {
    //         datePart: datePart,
    //         timePart: timePart,
    //     };
    // };

    const handleUpdateStatus = async (status) => {
        const res = await managerOrderAPI.UpdateStatus(data.orderId, status);
        if (res && res.success === true) {
            if (status == 'Delivering') {
                showSuccess('Chấp nhận đơn hàng thành công', '', 1);
            } else if (status == 'Canceled') {
                showSuccess('Hủy đơn hàng thành công', '', 1);
            }
            fetchData();
        } else {
            showError('Cập nhật trạng thái đơn hàng thất bại', res.data.message);
        }
    };

    const showConfirm = (id) => {
        confirm({
            title: id == 'Delivering' ? 'Chấp nhận đơn hàng' : 'Huỷ đơn hàng',
            icon: <ExclamationCircleFilled />,
            content:
                id == 'Delivering'
                    ? 'Hãy chắc chắn bạn đã kiểm tra thông tin của đơn hàng'
                    : 'Bạn có chắc chắn sẽ huỷ đơn hàng này không?',
            okType: 'danger',
            okText: 'Chấp nhận',
            cancelText: 'Quay lại',
            async onOk() {
                // callback function
                handleUpdateStatus(id);
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };

    return (
        <AdminLayout>
            <BackButton title={'QUAY LẠI DANH SÁCH ĐƠN HÀNG'} />
            <div className="flex flex-col my-6 gap-10">
                <section className="flex flex-col gap-3">
                    <h2 className="font-semibold text-xl">
                        Mã đơn hàng <b className="font-bold text-[#FF0000]">#{data?.orderId || ''} </b>
                    </h2>
                    <div className="flex">
                        <h2 className="font-semibold text-xl flex items-center gap-4">Trạng thái: </h2>
                        <Tag
                            className="text-xl"
                            color={
                                data?.orderStatus === orderStatus[0]
                                    ? 'default'
                                    : data?.orderStatus === orderStatus[1]
                                    ? 'processing'
                                    : data?.orderStatus === orderStatus[2]
                                    ? 'success'
                                    : data?.orderStatus === orderStatus[3]
                                    ? 'error'
                                    : 'warning'
                            }
                        >
                            {orderStatusMapping[data?.orderStatus]}
                        </Tag>

                        {data?.orderStatus === 'Ordered' ? (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => showConfirm('Delivering')}
                                    className="flex gap-2 justify-center items-center bg-green-400 text-white px-2 py-1 rounded-md"
                                >
                                    <img src="/assets/svg/pencil_white.svg" alt="icon" />
                                    <p className="font-semibold text-base">Chấp nhận đơn hàng</p>
                                </button>
                                <button
                                    onClick={() => showConfirm('Canceled')}
                                    className="flex gap-2 justify-center items-center bg-red-400 text-white px-2 py-1 rounded-md"
                                >
                                    <img src="/assets/svg/pencil_white.svg" alt="icon" />
                                    <p className="font-semibold text-base">Huỷ đơn hàng</p>
                                </button>
                            </div>
                        ) : (
                            ''
                        )}
                    </div>
                </section>

                <section className="flex justify-between gap-10">
                    <div className="flex flex-col gap-10 w-2/4">
                        <div className="rounded-md p-3 flex flex-col border border-secondary">
                            <div className="flex gap-2 font-semibold py-2 border-b border-[#A6968980]">
                                <h3 className="w-2/5">Sản phẩm</h3>
                                <h3 className="w-1/5 text-center">Số lượng</h3>
                                <h3 className="w-1/5">Giá</h3>
                                <h3 className="w-1/5">Thành tiền</h3>
                            </div>
                            {data?.orderDetails?.map((item) => (
                                <div
                                    key={item?.orderDetailId}
                                    className="flex gap-2 font-semibold py-2 items-center text-xs"
                                >
                                    <div
                                        className="flex w-2/5 gap-2 items-center cursor-pointer"
                                        onClick={() => router.push(`/admin/products/detail/${item?.productid}`)}
                                    >
                                        <img
                                            className="w-1/3 rounded-md"
                                            src={item?.productImages[0]}
                                            alt="image product"
                                        />
                                        <p className="w-2/3 truncate h-fit">{item?.productName}</p>
                                    </div>
                                    <p className="w-1/5 text-center">x {item?.quantity}</p>
                                    <p className="w-1/5 ">{convertToVND(item?.paymentPrice || 0)}</p>
                                    <p className="w-1/5">{totalPriceProduct(item?.paymentPrice, item?.quantity)}</p>
                                </div>
                            ))}
                        </div>

                        <div className="rounded-md p-3 flex flex-col border gap-1 border-secondary">
                            <p className="font-semibold text-lg border-b py-2 border-[#A6968980]">
                                Thông tin khách hàng và đơn hàng
                            </p>
                            <div className="font-semibold text-sm border-b py-2 border-[#A6968980] flex justify-between">
                                <p>Tên khách hàng: </p>
                                <p>{data?.fullName}</p>
                            </div>
                            <div className="font-semibold text-sm border-b py-2 border-[#A6968980] flex justify-between">
                                <p>Số điện thoại: </p>
                                <p>{data?.phone}</p>
                            </div>
                            <div className="font-semibold text-sm border-b py-2 border-[#A6968980] flex justify-between">
                                <p>Email</p>
                                <p>{data?.email}</p>
                            </div>
                            <div className="font-semibold text-sm py-2 flex justify-between">
                                <p>Ghi chú: </p>
                                <p>{data?.note}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-6 w-2/4">
                        {/* <div className="rounded-md p-3 flex flex-col border border-secondary">
                            <div className="flex items-center gap-2 justify-between font-semibold py-2 border-b border-[#A6968980]">
                                <h3 className="w-2/5 text-lg">Transport detail</h3>
                                <h3 className="text-xs font-normal text-grey">Tracking Nr: F123456789</h3>
                            </div>
                            <div className="flex gap-10 font-semibold py-2 items-center text-sm">
                                <img className="w-1/5" src="/assets/images/viettel_logo.png" alt="image product" />
                                <p>Viettel Post</p>
                            </div>
                        </div> */}

                        <div className="rounded-md font-medium text-sm p-3 gap-3 flex flex-col border border-secondary">
                            <div className="flex justify-between items-center">
                                <p className="font-semibold text-lg py-2">Tổng quan đơn hàng: </p>
                            </div>
                            <div className="flex justify-between">
                                <p>Ngày tạo đơn hàng: </p>
                                <p>{formateDateTimeVN(data?.createdAt).datePart}</p>
                            </div>
                            <div className="flex justify-between">
                                <p>Tạm tính: </p>
                                <p>
                                    {convertToVND(
                                        data?.orderDetails?.reduce((acc, orderDetail) => {
                                            const price = orderDetail.paymentPrice || 0;
                                            const quantity = orderDetail.quantity || 0;
                                            return acc + price * quantity;
                                        }, 0),
                                    )}
                                </p>
                            </div>
                            {/* <div className="flex justify-between">
                                <p>Phí giao hàng: </p>
                                <p>+ 0.0 VND</p>
                            </div> */}
                            <div className="flex justify-between pb-3 border-b border-secondary">
                                <p>Giá được giảm: </p>
                                <p>
                                    {convertToVND(
                                        data?.orderDetails?.reduce((acc, orderDetail) => {
                                            const price = orderDetail.paymentPrice || 0;
                                            const quantity = orderDetail.quantity || 0;
                                            return acc + price * quantity;
                                        }, 0) - data?.totalPrice,
                                    )}
                                </p>
                            </div>
                            <div className="flex justify-between text-base font-semibold">
                                <p>Thành tiền: </p>
                                <p>{convertToVND(data?.totalPrice || 0)}</p>
                            </div>
                        </div>

                        <div className="rounded-md font-medium text-xs p-3 gap-2 flex flex-col border border-secondary">
                            <div className="flex justify-between items-center">
                                <p className="font-semibold text-lg">Địa chỉ giao hàng: </p>
                            </div>
                            <div className="flex gap-3 items-center">
                                <p>{data?.address}</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </AdminLayout>
    );
}

export default OrdersDetail;

export { getServerSideProps };
