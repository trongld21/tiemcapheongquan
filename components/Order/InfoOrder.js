import { formateDateTimeVN } from '@/components/Utils/FormatDate';
import { itemSteps, itemStepsCancel } from '@/constant';
import useNotification from '@/hooks/useNotification';
import apiOrder from '@/pages/api/user/apiOrder';
import { CheckCircleTwoTone, ExclamationCircleFilled } from '@ant-design/icons';
import { Modal, Steps } from 'antd';
import PrimaryButton from '../Utils/PrimaryButton';
import OrderItem from './OrderItem';
import convertToVND from '../Utils/convertToVND';
const { confirm } = Modal;

const InfoOrder = ({ data, setSortBy, fetchData }) => {
    const { showError, showSuccess } = useNotification();

    const revertDataToStatus = (status) => {
        if (status.includes('Ordered')) {
            return {
                value: 1,
                title: 'Đã đặt hàng',
            };
        } else if (status.includes('Delivering')) {
            return {
                value: 2,
                title: 'Đang giao hàng',
            };
        } else if (status.includes('Received')) {
            return {
                value: 3,
                title: 'Đã nhận hàng',
            };
        } else {
            return {
                value: 2,
                title: 'Đã hủy đơn hàng',
            };
        }
    };

    // update status order
    const onClickUpdateStatus = async (status) => {
        confirm({
            title: status.includes('Canceled') ? 'Xác nhận hủy đơn hàng' : 'Xác nhận nhận hàng',
            icon: status.includes('Canceled') ? <ExclamationCircleFilled /> : <CheckCircleTwoTone />,
            content: status.includes('Canceled')
                ? 'Bạn có chắc chắn muốn hủy đơn hàng của mình? Xin vui lòng xác nhận quyết định của bạn.'
                : 'Xin vui lòng xác nhận rằng bạn đã nhận được đầy đủ sản phẩm và dịch vụ mà bạn đã đặt.',
            okType: status.includes('Canceled') ? 'danger' : 'default',
            okText: 'Xác nhận',
            cancelText: 'Quay lại',
            async onOk() {
                // callback function
                try {
                    const res = await apiOrder.UpdateStatus(data.orderId, status);
                    if (res && res.success === true) {
                        showSuccess(
                            status.includes('Canceled') ? 'Hủy đơn hàng thành công' : 'Xác nhận nhận hàng thành công',
                            'Nếu bạn có bất kỳ câu hỏi hoặc cần hỗ trợ, xin vui lòng liên hệ với chúng tôi. Chúc bạn có trải nghiệm sử dụng sản phẩm thú vị và hài lòng!                            ',
                            3,
                        );
                        fetchData();
                        setSortBy();
                    } else {
                        showError('Fail', res.data.message);
                    }
                } catch (err) {
                    console.log(err);
                }
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };

    return (
        <div className="p-5 shadow flex flex-col rounded gap-10 max-sm:gap-5">
            <section className="flex justify-between lg:flex-row flex-col-reverse gap-4 lg:gap-0">
                <div className="flex flex-col gap-2">
                    {/* <p className="text-grey text-sm">Mã đơn hàng: {data?.orderId}</p> */}
                    {data.orderDetails.map((item) => (
                        <OrderItem
                            key={item.orderDetailId}
                            data={item}
                            canReview={data.orderStatus.includes('Received')}
                        />
                    ))}
                </div>
                <div className="flex flex-col text-sm text-grey lg:text-end gap-1 text-left lg:w-5/12 w-full">
                    <h3
                        className={`font-bold text-base ${data.orderStatus.includes('Canceled') ? 'text-error' : ''} ${
                            data.orderStatus.includes('Ordered')
                                ? 'text-grey'
                                : data.orderStatus.includes('Delivering')
                                ? 'text-progress'
                                : data.orderStatus.includes('Received')
                                ? 'text-success'
                                : 'text-error'
                        } `}
                    >
                        {revertDataToStatus(data.orderStatus).title}
                    </h3>
                    <p className="text-sm">
                        Tổng giá tiền: <b>{convertToVND(data?.totalPrice)}</b>
                    </p>
                    <div className="flex lg:flex-col flex-row gap-2 lg:gap-0">
                        <h2>{formateDateTimeVN(data.createdAt).datePart}</h2>
                        <h2>{formateDateTimeVN(data.createdAt).timePart}</h2>
                    </div>
                </div>
            </section>
            <section className="w-full">
                <Steps
                    current={revertDataToStatus(data.orderStatus).value}
                    size="small"
                    labelPlacement="vertical"
                    items={data.orderStatus.includes('Canceled') ? itemStepsCancel : itemSteps}
                />
            </section>
            <p className="text-grey text-sm">Địa chỉ: {data?.address}</p>
            {data.orderStatus.includes('Delivering') && (
                <section className="flex justify-end gap-6 max-sm:flex-col -mt-5">
                    <PrimaryButton
                        onClick={() => onClickUpdateStatus('Received')}
                        classCss={'bg-secondary text-white px-4 py-2'}
                        content={'Nhận hàng'}
                    />
                </section>
            )}
            {data.orderStatus.includes('Ordered') && (
                <section className="flex justify-between gap-6 -mt-5">
                    <PrimaryButton
                        onClick={() => onClickUpdateStatus('Canceled')}
                        classCss={'bg-[#FFA895] opacity-90 text-white text-xs px-3 py-2 h-fit '}
                        content={'Hủy đơn hàng'}
                    />
                </section>
            )}
        </div>
    );
};

export default InfoOrder;
