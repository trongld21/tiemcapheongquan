import moment from 'moment';
import React from 'react';
import { FaShoppingBag } from 'react-icons/fa';
import convertToVND from '../Utils/convertToVND';
import { formateDateTimeVN } from '../Utils/FormatDate';

const RecentOrders = ({ data }) => {
    const diffTime = (time) => {
        const orderTime = moment(time);
        const diffDuration = moment.duration(moment().diff(orderTime));
        const hoursDiff = diffDuration.hours() ?? 0;
        const minutesDiff = diffDuration.minutes() ?? 0;
        return `${hoursDiff} giờ ${minutesDiff} phút`;
    };
    // console.log(data);
    return (
        <>
            {data && (
                <div className="w-full col-span-1 relative lg:h-[70vh] h-[50vh] m-auto p-4 border rounded-lg bg-white overflow-scroll">
                    <h1>Những đơn đặt hàng gần đây</h1>
                    <ul>
                        {data?.map((order, id) => (
                            <li key={id} className="bg-gray-50 hover:bg-gray-100 rounded-lg my-3 p-2 flex items-center">
                                <div className="bg-purple-100 rounded-lg p-3">
                                    <FaShoppingBag className="text-purple-800" />
                                </div>
                                <div className="pl-4">
                                    <p className="text-gray-800 font-bold">{convertToVND(order.totalPrice)}</p>
                                    <p className="text-gray-400 text-sm">{order.fullName}</p>
                                </div>
                                <p className="lg:flex md:hidden absolute right-6 text-sm">
                                    {formateDateTimeVN(order.updatedAt).datePart +
                                        ' - ' +
                                        formateDateTimeVN(order.updatedAt).timePart}
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </>
    );
};

export default RecentOrders;
