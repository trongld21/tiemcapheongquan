import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
// Custom component
import UserLayout from '@/components/Layout/UserLayout';
import BackButton from '@/components/Utils/BackButton';
import PrimaryButton from '@/components/Utils/PrimaryButton';
import Thumbnail from '@/components/Utils/Thumbnail';
import convertToVND from '@/components/Utils/convertToVND';
import { UserContext } from '@/contexts/userContext';
import useNotification from '@/hooks/useNotification';
// Icon component
import { ChevronUpIcon, PencilIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
// API
import apiCoupon from '../api/apiCoupon';
import apiOrder from '../api/user/apiOrder';
import apiUserAddress from '../api/user/apiUserAddress';
import jwt from 'jsonwebtoken';
import { Modal, Radio } from 'antd';

const Payment = () => {
    const router = useRouter();
    const { orderInfo } = useContext(UserContext);
    const { showWarning, showSuccess, showError } = useNotification();
    const [userAddress, setUserAddress] = useState();
    const [userListAddress, setUserListAddress] = useState();
    const [payment, setPayment] = useState(1);
    const [editAddress, setEditAddress] = useState(false);
    const [paymentCard, setPaymentCard] = useState(false);
    const [couponCode, setCouponCode] = useState('');
    const [couponActive, setCouponActive] = useState();
    const [totalPrice, setTotalPrice] = useState();
    const [maxCoupon, setMaxCoupon] = useState();
    const [subtotal, setSubtotal] = useState({
        total: 0,
        isOpen: true,
    });

    // Change total price when get coupon
    useEffect(() => {
        // Check coupon is value or percent
        if (couponActive && couponActive.isActive) {
            if (couponActive.couponType === 'ByValue') {
                if (couponActive.value > subtotal.total) {
                    setTotalPrice(0);
                } else {
                    setTotalPrice(subtotal.total - couponActive.value);
                }
                setMaxCoupon(couponActive.value);
            } else if (couponActive.couponType === 'ByPercent') {
                const discountAmount = (couponActive.value / 100) * subtotal.total;
                if (discountAmount > couponActive.maxValue) {
                    setMaxCoupon(couponActive.maxValue);
                    setTotalPrice(subtotal.total - couponActive.maxValue);
                } else {
                    setMaxCoupon(discountAmount);
                    setTotalPrice(subtotal.total - discountAmount);
                }
            }
        } else {
            setTotalPrice(subtotal.total);
        }
    }, [couponActive, subtotal]);

    // Get default subtotal
    useEffect(() => {
        if (orderInfo) {
            let totalItem = 0;
            orderInfo.map((item) => {
                totalItem += item.quantity * item.productPrice;
            });
            setSubtotal({
                total: totalItem,
                isOpen: true,
            });
            fetchUserAddress();
        }
    }, [orderInfo]);

    // Fetch user address after make order
    const fetchUserAddress = async () => {
        try {
            const res = await apiUserAddress.GetUserAddressDefault();
            const resList = await apiUserAddress.GetUserAddress();
            if (res && res.success) {
                setUserAddress(res.data);
            }
            if (resList && resList.success) {
                setUserListAddress(resList.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    // Handle make order
    const handleMakeOrder = async () => {
        try {
            // Get list product id
            const arrayItemID = orderInfo.map((item) => item.cartId);
            let coupon = null;
            // Check coupon is using
            if (couponActive) {
                coupon = couponActive.code;
            }
            const res = await apiOrder.MakeOrder(arrayItemID, userAddress.userAddressId, couponActive?.code, '');
            if (res && res.success) {
                showSuccess('Đặt hàng thành công', 'Đơn hàng của bạn sẽ được xử lý', 2);
                localStorage.removeItem('itemsCart');
                router.push('/user/orders');
            } else {
                showError(
                    'Đặt hàng thất bại',
                    'Có lỗi xảy ra trong quá trình đặt hàng. Vui lòng liên hệ với chúng tôi để được hỗ trợ.',
                    2,
                );
            }
        } catch (error) {}
    };

    // Call api to get coupon using code
    const handleGetCoupon = async () => {
        try {
            const res = await apiCoupon.GetByCode(couponCode);
            if (res && res.success) {
                setCouponActive(res.data);
                showSuccess('Thêm thành công', 'Đơn hàng của bạn sẽ được áp dụng mã giảm giá', 3);
            } else if (res && res.status === 404) {
                setCouponActive();
                showWarning('Mã giảm giá không tồn tại', res.data.message, 4);
            } else {
                setCouponActive();
                showWarning('Thêm mã giảm giá thất bại', res.message, 3);
            }
        } catch (error) {
            showError(
                'Thêm mã giảm giá thất bại',
                'Có lỗi xảy ra trong quá trình xử lý. Vui lòng liên hệ với chúng tôi để được hỗ trợ',
                3,
            );
        }
    };

    return (
        <UserLayout>
            <Thumbnail center={'Giỏ hàng'} hrefCenter={'/user/cart'} title={'Đặt Hàng'} />
            <div className="max-sm:w-full w-11/12 lg:w-4/5 mx-auto my-10">
                <BackButton title={'Quay lại giỏ hàng'} />
                <div className="flex my-8 gap-2 lg:gap-6 flex-wrap lg:flex-nowrap">
                    <section className="max-sm:w-11/12 w-10/12 lg:w-8/12 max-sm:text-sm text-base max-sm:px-4 px-10 mx-auto lg:m-0 max-sm:py-4 py-6 gap-3 flex flex-col rounded-2xl shadow">
                        <div className="flex items-center justify-between">
                            <h2 className="font-semibold max-sm:text-lg text-xl">Địa chỉ giao hàng</h2>
                            <button className="flex items-center gap-2" onClick={() => setEditAddress(!editAddress)}>
                                <h2 className="font-semibold max-sm:text-xs text-sm">Thay đổi</h2>
                                <PencilIcon className="w-3 h-3" />
                            </button>
                        </div>
                        {userAddress && (
                            <Radio.Group
                                name="radiogroup"
                                defaultValue={userAddress?.userAddressId}
                                className={editAddress ? 'flex flex-col gap-2' : 'hidden'}
                            >
                                {userListAddress?.map((item) => (
                                    <Radio
                                        key={item?.userAddressId}
                                        value={item?.userAddressId}
                                        onChange={() => setUserAddress(item)}
                                    >
                                        <p>
                                            {item?.street}, {item?.district}, {item?.city}
                                        </p>
                                    </Radio>
                                ))}
                            </Radio.Group>
                        )}

                        <div className="flex flex-col max-sm:gap-3 gap-6">
                            <div className="font-medium">
                                <p className="text-grey max-sm:text-xs text-sm">Họ và Tên *</p>
                                <p className="font-semibold">{userAddress?.fullName}</p>
                            </div>
                            <div className="flex justify-between max-sm:flex-wrap max-sm:gap-3">
                                <div className="max-sm:w-full w-6/12 font-medium">
                                    <p className="text-grey max-sm:text-xs text-sm">Địa chỉ cụ thể *</p>
                                    <p className="font-semibold">{userAddress?.street}</p>
                                </div>
                                <div className="w-4/12 font-medium">
                                    <p className="text-grey max-sm:text-xs text-sm">Số điện thoại *</p>
                                    <p className="font-semibold">{userAddress?.phone}</p>
                                </div>
                            </div>

                            <div className="grid max-sm:grid-cols-2 max-sm:gap-5 grid-cols-3 gap-2 font-medium max-sm:gap-y-3 gap-y-6">
                                <div className="">
                                    <p className="text-grey max-sm:text-xs text-sm">Xã / Thị Trấn *</p>
                                    <p className="font-semibold">{userAddress?.ward}</p>
                                </div>
                                <div className="">
                                    <p className="text-grey max-sm:text-xs text-sm">Quận / Huyện *</p>
                                    <p className="font-semibold">{userAddress?.district}</p>
                                </div>
                                <div className="">
                                    <p className="text-grey max-sm:text-xs text-sm">Tỉnh / Thành Phố *</p>
                                    <p className="font-semibold">{userAddress?.city}</p>
                                </div>
                            </div>

                            <div className="font-medium">
                                <p className="text-grey max-sm:text-xs text-sm">Loại địa chỉ *</p>
                                <div className="flex justify-between font-semibold max-sm:flex-wrap max-sm:gap-1">
                                    <label className="max-sm:w-full w-4/12 flex items-center hover:cursor-pointer">
                                        <input
                                            type="radio"
                                            name="addressType"
                                            className="mr-2 checked:bg-black"
                                            defaultChecked
                                        />
                                        <span className="text-left">Nhà Riêng</span>
                                    </label>
                                    {/* <label className="max-sm:w-full flex items-center hover:cursor-pointer">
                                        <input type="radio" name="addressType" className="mr-2 checked:bg-black" />
                                        <span className="text-left">Văn Phòng (Giao hàng từ 7:00 - 17:00)</span>
                                    </label> */}
                                </div>
                            </div>

                            <div className="border w-fit flex p-1 rounded active:border focus:border">
                                <input
                                    className="p-1 ml-1 rounded-tl rounded-bl border-none"
                                    onChange={(e) => {
                                        setCouponCode(e.target.value);
                                    }}
                                    onKeyDown={(event) => {
                                        if (event.key === 'Enter') {
                                            event.preventDefault();
                                            handleGetCoupon();
                                        }
                                    }}
                                    placeholder="Nhập mã giảm giá"
                                />
                                <PlusCircleIcon
                                    width={20}
                                    height={20}
                                    className="inline-block self-center w-7 cursor-pointer"
                                    onClick={handleGetCoupon}
                                />
                            </div>

                            <div className="font-medium flex flex-col max-sm:gap-1 gap-3">
                                <h2 className="font-semibold text-xl block">Phương thức thanh toán</h2>
                                <div className="flex flex-col gap-1">
                                    <label className="block hover:cursor-pointer">
                                        <input
                                            type="radio"
                                            name="payment"
                                            className="mr-2 checked:bg-black"
                                            defaultChecked
                                            onChange={() => {
                                                setPaymentCard(false);
                                            }}
                                        />
                                        <span className="text-left">Thanh toán khi nhận hàng</span>
                                    </label>
                                    <label className="hover:cursor-pointer hidden">
                                        <input
                                            type="radio"
                                            name="payment"
                                            className="mr-2 checked:bg-black"
                                            onChange={() => {
                                                setPaymentCard(true);
                                            }}
                                        />
                                        <span className="text-left">Payment via Bank Card</span>
                                    </label>
                                </div>
                            </div>
                            {paymentCard && (
                                <>
                                    <div className="flex items-center gap-7">
                                        <button
                                            onClick={() => setPayment(1)}
                                            className="w-16 h-6 flex items-center justify-center shadow-md rounded relative"
                                        >
                                            {payment == 1 && (
                                                <div className="absolute bg-[#A69689] rounded-full -right-2 -top-1">
                                                    <Image
                                                        src="/assets/svg/tick.svg"
                                                        className="shadow-lg w-4 h-4 p-1"
                                                        alt="visa"
                                                        width={30}
                                                        height={30}
                                                    />
                                                </div>
                                            )}
                                            <Image
                                                src="/img/visa.png"
                                                className="shadow-lg"
                                                alt="visa"
                                                width={30}
                                                height={30}
                                            />
                                        </button>
                                        <button
                                            onClick={() => setPayment(2)}
                                            className="w-16 h-6 flex items-center justify-center shadow-md rounded relative"
                                        >
                                            {payment == 2 && (
                                                <div className="absolute bg-[#A69689] rounded-full -right-2 -top-1">
                                                    <Image
                                                        src="/assets/svg/tick.svg"
                                                        className="shadow-lg w-4 h-4 p-1"
                                                        alt="visa"
                                                        width={30}
                                                        height={30}
                                                    />
                                                </div>
                                            )}
                                            <Image src="/img/mastercard.png" alt="visa" width={30} height={30} />
                                        </button>
                                        <button
                                            onClick={() => setPayment(3)}
                                            className="w-16 h-6 flex items-center justify-center shadow-md rounded relative"
                                        >
                                            {payment == 3 && (
                                                <div className="absolute bg-[#A69689] rounded-full -right-2 -top-1">
                                                    <Image
                                                        src="/assets/svg/tick.svg"
                                                        className="shadow-lg w-4 h-4 p-1"
                                                        alt="visa"
                                                        width={30}
                                                        height={30}
                                                    />
                                                </div>
                                            )}
                                            <Image src="/img/maestro.png" alt="visa" width={30} height={30} />
                                        </button>
                                        <button
                                            onClick={() => setPayment(4)}
                                            className="w-16 h-6 flex items-center justify-center shadow-md rounded relative"
                                        >
                                            {payment == 4 && (
                                                <div className="absolute bg-[#A69689] rounded-full -right-2 -top-1">
                                                    <Image
                                                        src="/assets/svg/tick.svg"
                                                        className="shadow-lg w-4 h-4 p-1"
                                                        alt="visa"
                                                        width={30}
                                                        height={30}
                                                    />
                                                </div>
                                            )}
                                            <Image src="/img/american.png" alt="visa" width={30} height={30} />
                                        </button>
                                        <button
                                            onClick={() => setPayment(5)}
                                            className="w-16 h-6 flex items-center justify-center shadow-md rounded relative"
                                        >
                                            {payment == 5 && (
                                                <div className="absolute bg-[#A69689] rounded-full -right-2 -top-1">
                                                    <Image
                                                        src="/assets/svg/tick.svg"
                                                        className="shadow-lg w-4 h-4 p-1"
                                                        alt="visa"
                                                        width={30}
                                                        height={30}
                                                    />
                                                </div>
                                            )}
                                            <Image src="/img/discover.png" alt="visa" width={30} height={30} />
                                        </button>
                                    </div>
                                    <div className="font-medium">
                                        <p className="text-grey max-sm:text-xs text-sm">Name On Card *</p>
                                        <p className="font-semibold">LE DUC TRONG</p>
                                    </div>
                                    <div className="font-medium">
                                        <p className="text-grey max-sm:text-xs text-sm">Card Number *</p>
                                        <p className="font-semibold">1234 **** **** ****</p>
                                    </div>
                                    <div className="flex flex-wrap">
                                        <div className="w-4/12 font-medium">
                                            <p className="text-grey max-sm:text-xs text-sm">Expiration Date *</p>
                                            <p className="font-semibold">02/25</p>
                                        </div>
                                        <div className="w-4/12 font-medium">
                                            <p className="text-grey max-sm:text-xs text-sm">CVV *</p>
                                            <p className="font-semibold">231</p>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </section>

                    <section className="max-sm:w-11/12 w-10/12 lg:w-4/12 mx-auto lg:m-0">
                        <div className="px-10 py-8 rounded-2xl bg-secondary flex flex-col gap-4 w-full text-white">
                            <h1 className="text-2xl font-semibold pb-3 text-center border-b border-white">
                                Đơn đặt hàng của bạn
                            </h1>
                            <div className="flex justify-between text-base font-semibold">
                                <button
                                    className="flex gap-1 items-center"
                                    onClick={() => {
                                        setSubtotal((prev) => ({
                                            ...prev,
                                            isOpen: !prev.isOpen,
                                        }));
                                    }}
                                >
                                    <p className="">Sản phẩm đã chọn</p>
                                    <ChevronUpIcon className={`w-4 ${subtotal.isOpen && 'rotate-180'}`} />
                                </button>
                                <p>{convertToVND(subtotal.total)}</p>
                            </div>

                            <div className="font-medium max-sm:text-xs max-h-80 overflow-y-auto text-sm flex flex-col gap-3">
                                {subtotal?.isOpen &&
                                    orderInfo.map((item) => (
                                        <div
                                            key={item.cartId}
                                            className="flex gap-2 justify-between [&:not(:last-child)]:border-b [&:not(:last-child)]:border-white pb-1.5 pr-1"
                                        >
                                            <img
                                                className="w-16 h-16 object-cover my-auto rounded-md"
                                                src={item.productImages[0]}
                                                alt="anh"
                                            />
                                            <div className="text-right">
                                                <p className="text-base line-clamp-1">{item.productName}</p>
                                                <p>x{item.quantity}</p>
                                                <p>+ {convertToVND(item.quantity * item.productPrice)}</p>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                            <div className="flex justify-between font-semibold">
                                <p className="">Phí giao hàng</p>
                                <p>+ 0.00 VND</p>
                            </div>
                            {couponActive && couponActive?.isActive && (
                                <div className="flex justify-between font-semibold">
                                    <p className="">Mã giảm giá</p>
                                    <p>{couponActive.code}</p>
                                </div>
                            )}
                            {couponActive && couponActive?.isActive && (
                                <div className="flex justify-between font-semibold">
                                    <p className="">Số tiền được giảm</p>
                                    <p>- {convertToVND(maxCoupon)}</p>
                                </div>
                            )}
                            <div className="flex justify-between font-semibold my-4 border-b pb-2">
                                <p className="text-lg">Tổng số tiền</p>
                                <p className="text-lg">{totalPrice && convertToVND(totalPrice)}</p>
                            </div>
                            <div className="flex justify-center">
                                <PrimaryButton
                                    content={'Đặt Hàng'}
                                    classCss={'bg-white px-4 py-2 text-secondary'}
                                    onClick={handleMakeOrder}
                                />
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </UserLayout>
    );
};

export default Payment;

export async function getServerSideProps(context) {
    // Get cookie in the context
    const cookies = context.req.headers.cookie;
    // Filter cookies to get access token
    const parseCookies = (cookie) =>
        cookie.split('; ').reduce((acc, cookie) => {
            const [key, value] = cookie.split('=');
            acc[key] = value;
            return acc;
        }, {});
    const cookiesObj = parseCookies(cookies);
    const access_token = cookiesObj['access_token'];
    // Decode token to user info
    const userInfo = jwt.decode(access_token);
    // Check author based role
    if (userInfo && userInfo.role === 'Customer') {
        // Check prev url is user cart
        if (context.req.headers.referer) {
            const parsedURL = new URL(context.req.headers.referer);
            if (parsedURL.pathname === '/user/cart') {
                return {
                    props: {},
                };
            }
        } else {
            return {
                redirect: {
                    destination: '/user/cart', // Redirect to the login page or any other page you prefer
                    permanent: false,
                },
            };
        }
    } else if (userInfo && userInfo.role === 'Admin') {
        return {
            redirect: {
                destination: '/admin', // Redirect to the login page or any other page you prefer
                permanent: false,
            },
        };
    }
    // If token in not valid redirect to login
    return {
        redirect: {
            destination: '/auth/login', // Redirect to the login page or any other page you prefer
            permanent: false,
        },
    };
}
