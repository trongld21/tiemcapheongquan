import { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
// Ant design component
import { Drawer, Dropdown, notification } from 'antd';
// Custom hook
import { useToken } from '@/hooks/useToken';
// Items header
import { itemsNews, itemsProducts, itemsProfile } from '@/constant';
// Router
import { useRouter } from 'next/router';
import { UserContext } from '@/contexts/userContext';
import apiNotification from '@/pages/api/user/apiNotification';
// Custom Hook
import { useCookie } from '@/hooks/useCookie';
import { HubConnectionBuilder, NullLogger } from '@microsoft/signalr';
import { formatDateForHtml, formateDateTimeVN } from './Utils/FormatDate';

function HeaderUser() {
    const { isLogged, setIsLogged, search, setSearch } = useContext(UserContext);
    const { setCookie, getCookie } = useCookie();
    const [isShow, setIsShow] = useState(false);
    // console.log('🚀 ~ file: HeaderUser.js:16 ~ HeaderUser ~ isLogged:', isLogged);
    const [stateShowNotification, setStateShowNotification] = useState(false);
    const { getDataAccessToken } = useToken();
    const [userInfo, setUserInfo] = useState();
    const { removeCookie } = useCookie();
    const [searchValue, setSearchValue] = useState('');
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [childrenDrawer, setChildrenDrawer] = useState(false);

    const showDrawer = () => {
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
    };

    const [notificationData, setNotificationData] = useState([]);

    const fetchNotification = async () => {
        if (isLogged) {
            const res = await apiNotification.GetAll();
            // console.log('🚀 ~ file: HeaderUser.js:31 ~ fetchNotification ~ res:', res);
            if (res && res.success) {
                setNotificationData(res.data);
            }
        }
    };
    useEffect(() => {
        if (isLogged) {
            fetchNotification();
            const access_token = getCookie('access_token');
            const connection = new HubConnectionBuilder()
                .withUrl(process.env.NEXT_PUBLIC_URL + '/hubs/notification', {
                    accessTokenFactory: () => {
                        return access_token;
                    },
                })
                .withAutomaticReconnect()
                .build();

            const startConnection = async () => {
                try {
                    await connection.start();
                } catch (error) {
                    // console.error('Error connecting to Chat Hub', error);
                }
            };
            startConnection();
            connection.on('NewNotification', (data) => {
                setNotificationData((prevNotification) => [data, ...prevNotification]);
            });
            connection.onclose(async () => {
                try {
                    await startConnection();
                } catch (error) {
                    // console.error('Error reconnecting to Chat Hub', error);
                }
            });
            return async () => {
                connection.off('NewNotification');
                await connection.stop();
            };
        }
    }, [isLogged]);

    const handleReadNotification = async () => {
        const res = await apiNotification.ReadAll();
        if (res && res.success) {
            fetchNotification();
        }
    };

    // Avoid infinite loop when get user info from token
    useEffect(() => {
        setUserInfo(getDataAccessToken());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Remove cookie and reset token
    const Logout = () => {
        setIsLogged(false);
        removeCookie('access_token');
        removeCookie('refresh_token');
        setUserInfo(getDataAccessToken());
        router.push('/');
    };
    const searchProduct = () => {
        setSearch(searchValue);
        router.push(`/product/?search=${encodeURIComponent(searchValue)}`);
    };

    const showChildrenDrawer = () => {
        setChildrenDrawer(true);
    };
    const onChildrenDrawerClose = () => {
        setChildrenDrawer(false);
    };

    return (
        <header className="flex max-sm:flex-col md:flex-col lg:px-2 lg:h-[70px] h-fit z-50 shadow sticky top-0 bg-white">
            <div className="flex justify-between pt-[1rem] pb-5 lg:px-2 w-full">
                <div className="w-1/6 max-sm:w-full flex items-center">
                    <Link href="/">
                        <img src="/assets/svg/logo_white.svg" alt="TKDecor Logo" />
                    </Link>
                </div>
                <div className="w-5/6 lg:w-4/5 max-sm:hidden flex text-xs xl:text-sm font-bold items-center justify-between px-2">
                    <section className="flex gap-3 lg:gap-6">
                        <Link href="/">
                            <p className="py-1 border-b-2 border-transparent hover:border-[#A69689]">TRANG CHỦ</p>
                        </Link>
                        <Link href="/product" id="btn-product">
                            <p className="flex py-1 border-b-2 border-transparent hover:border-[#A69689]">SẢN PHẨM</p>
                        </Link>
                        <Link href="/news">
                            <p className="flex py-1 border-b-2 border-transparent hover:border-[#A69689]">TIN TỨC</p>
                        </Link>
                        <Link href="/about">
                            <p className="flex py-1 border-b-2 border-transparent hover:border-[#A69689]">
                                VỀ CHÚNG TÔI
                            </p>
                        </Link>
                        <Link href="/contact">
                            <p className="flex py-1 border-b-2 border-transparent hover:border-[#A69689]">LIÊN HỆ</p>
                        </Link>
                    </section>

                    <section className="relative rounded-50 border border-black hidden md:hidden xl:flex p-1">
                        <input
                            className="rounded-50 border-none mr-5 pl-3 pr-16 py-1 text-sm placeholder:text-sm font-medium"
                            placeholder="Tìm kiếm sản phẩm"
                            defaultValue={search}
                            onChange={(event) => setSearchValue(event?.target?.value?.trim())}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter') {
                                    event.preventDefault();
                                    searchProduct(); // Gọi hàm searchProduct khi người dùng nhấn Enter trong ô input
                                }
                            }}
                        />
                        <img
                            className="absolute top-0 bottom-0 my-auto right-3 cursor-pointer"
                            src="/assets/svg/search.svg"
                            alt="arrow icon"
                            onClick={searchProduct}
                        />
                    </section>
                    {!!userInfo ? (
                        <section className="flex gap-1 lg:gap-3 pr-3">
                            <Link href={'/user/cart'} id="btn-cart">
                                <button className="hover:bg-hover-header p-1.5 lg:p-2.5 rounded-10">
                                    <img
                                        className="lg:w-5 w-4 h-4 lg:h-5"
                                        src="/assets/svg/cart.svg"
                                        alt="arrow icon"
                                    />
                                </button>
                            </Link>
                            <div className="relative">
                                <button
                                    id="noti"
                                    className="hover:bg-hover-header p-1.5 lg:p-2.5 rounded-10 relative"
                                    onClick={() => {
                                        setStateShowNotification(!stateShowNotification);
                                    }}
                                >
                                    {notificationData.some((item) => !item.isRead) && (
                                        <div className="absolute right-2 top-1 w-2 h-2 bg-primary rounded-full item-read"></div>
                                    )}
                                    <img
                                        className="lg:w-5 w-4 h-4 lg:h-5"
                                        src="/assets/svg/bell.svg"
                                        alt="arrow icon"
                                    />
                                </button>
                                {stateShowNotification && (
                                    <div className="absolute w-96 right-0 bg-white rounded-lg p-5 shadow z-20">
                                        <div className="flex justify-between items-center">
                                            <h1 className="font-semibold text-lg">Thông báo</h1>
                                            <button
                                                onClick={handleReadNotification}
                                                className="text-xs text-primary font-light z-50"
                                            >
                                                Đánh dấu đã đọc tất cả
                                            </button>
                                        </div>
                                        <div
                                            className="fixed bg-none w-screen h-screen top-0 left-0 bottom-0 right-0 z-2"
                                            onClick={() => {
                                                setStateShowNotification(false);
                                            }}
                                        ></div>
                                        <ul className="max-h-96 overflow-y-scroll relative bg-white z-50">
                                            {notificationData &&
                                                notificationData.map((notification) => (
                                                    <li
                                                        key={notification.notificationId}
                                                        className="flex justify-start gap-4 items-center py-2"
                                                    >
                                                        {notification.isRead === true ? (
                                                            <p className="w-2 h-2"></p>
                                                        ) : (
                                                            <img
                                                                src="/assets/svg/dot.svg"
                                                                className="w-2 h-2"
                                                                alt="notification not read"
                                                            />
                                                        )}
                                                        <div className=" border-solid border-0 border-b border-gray-500 w-11/12">
                                                            <p className="text-xs font-light line-clamp-2">
                                                                {notification.message}
                                                            </p>
                                                            <span className="text-xs font-light text-primary ">
                                                                {formateDateTimeVN(notification.createdAt).datePart +
                                                                    ' ' +
                                                                    formateDateTimeVN(notification.createdAt).timePart}
                                                            </span>
                                                        </div>
                                                    </li>
                                                ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            <Dropdown
                                menu={{
                                    items: itemsProfile(Logout),
                                }}
                                className="group"
                                placement="bottomLeft"
                            >
                                <button className="hover:bg-hover-header p-1.5 lg:p-2.5 rounded-10" id="profile-icon">
                                    <img
                                        className="lg:w-5 w-4 h-4 lg:h-5"
                                        src="/assets/svg/user.svg"
                                        alt="arrow icon"
                                    />
                                </button>
                            </Dropdown>
                        </section>
                    ) : (
                        <section className="flex">
                            <Link href="/auth/login">
                                <p className="py-1 px-2 lg:px-4 rounded-10">ĐĂNG NHẬP</p>
                            </Link>
                            <div className="border-r border-black"></div>
                            <Link href="/auth/register">
                                <p className="py-1 px-2 lg:px-4 rounded-10">ĐĂNG KÝ</p>
                            </Link>
                        </section>
                    )}
                </div>
                <div className="max-sm:flex hidden w-4 h-4 my-auto mr-4">
                    <img src="/assets/svg/mobile.svg" alt="icon" onClick={showDrawer} />
                </div>
            </div>
            <div className="relative max-sm:flex rounded-50 border border-black p-1 mb-6 mx-4 lg:hidden">
                <input
                    className="rounded-50 border-none w-full mr-5 pl-3 pr-16 py-1 text-sm placeholder:text-sm font-medium"
                    placeholder="Tìm kiếm sản phẩm"
                    defaultValue={search}
                    onChange={(event) => setSearchValue(event?.target?.value?.trim())}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                            event.preventDefault();
                            searchProduct(); // Gọi hàm searchProduct khi người dùng nhấn Enter trong ô input
                        }
                    }}
                />
                <img
                    className="absolute top-0 bottom-0 my-auto right-3 cursor-pointer"
                    src="/assets/svg/search.svg"
                    alt="arrow icon"
                    onClick={searchProduct}
                />
            </div>
            <Drawer width={'90%'} title=" " placement="right" onClose={onClose} open={open}>
                <Link href="/" className="link-item">
                    <div className="flex justify-start gap-2 items-center py-3 ">
                        <img src="/assets/svg/mobile_home.svg" alt="cart icon" className="w-6 h-6" />
                        <p className="text-base font-bold capitalize" onClick={onClose}>
                            Trang chủ
                        </p>
                    </div>
                </Link>
                <Link href="/product" className="link-item">
                    <div className="flex justify-start gap-2 items-center py-3 ">
                        <img src="/assets/svg/mobile_product.svg" alt="cart icon" className="w-6 h-6" />
                        <p className="text-base font-bold capitalize" onClick={onClose}>
                            Sản phẩm
                        </p>
                    </div>
                </Link>
                <Link href="/news" className="link-item">
                    <div className="flex justify-start gap-2 items-center py-3 ">
                        <img src="/assets/svg/mobile_article.svg" alt="cart icon" className="w-6 h-6" />
                        <p className="text-base font-bold capitalize" onClick={onClose}>
                            Tin tức
                        </p>
                    </div>
                </Link>
                <Link href="/about" className="link-item">
                    <div className="flex justify-start gap-2 items-center py-3 ">
                        <img src="/assets/svg/mobile_about_us.svg" alt="cart icon" className="w-6 h-6" />
                        <p className="text-base font-bold capitalize" onClick={onClose}>
                            Về chúng tôi
                        </p>
                    </div>
                </Link>
                <Link href="/contact" className="link-item">
                    <div className="flex justify-start gap-2 items-center py-3 ">
                        <img src="/assets/svg/mobile_contact.svg" alt="cart icon" className="w-6 h-6" />
                        <p className="text-base font-bold capitalize" onClick={onClose}>
                            Liên hệ
                        </p>
                    </div>
                </Link>
                {!!userInfo ? (
                    <div>
                        <Link href="/user/cart" className="link-item">
                            <div className="flex justify-start gap-2 items-center py-3 ">
                                <img src="/assets/svg/mobile_cart.svg" alt="cart icon" className="w-6 h-6" />
                                <p className="text-base font-bold capitalize" onClick={onClose}>
                                    Giỏ hàng
                                </p>
                            </div>
                        </Link>
                        <Link href="javascript:void(0)" className="link-item" onClick={showChildrenDrawer}>
                            <div className="flex justify-start gap-2 items-center py-3 ">
                                <img src="/assets/svg/mobile_user.svg" alt="cart icon" className="w-6 h-6" />
                                <p className="text-base font-bold capitalize">
                                    Cá nhân <span className="text-2xl">+</span>
                                </p>
                            </div>
                        </Link>
                        <Drawer
                            title=" "
                            width={'80%'}
                            closable={true}
                            placement="right"
                            onClose={onChildrenDrawerClose}
                            open={childrenDrawer}
                        >
                            <Link href="/user/info" className="link-item">
                                <div className="flex justify-start gap-2 items-center py-3 ">
                                    <img src="/assets/svg/mobile_user.svg" alt="cart icon" className="w-6 h-6" />
                                    <p className="text-base font-bold capitalize" onClick={onClose}>
                                        Hồ sơ
                                    </p>
                                </div>
                            </Link>
                            <Link href="/user/address" className="link-item">
                                <div className="flex justify-start gap-2 items-center py-3 ">
                                    <img src="/assets/svg/mobile_address.svg" alt="cart icon" className="w-6 h-6" />
                                    <p className="text-base font-bold capitalize" onClick={onClose}>
                                        Địa chỉ
                                    </p>
                                </div>
                            </Link>
                            <Link href="/user/favorite" className="link-item">
                                <div className="flex justify-start gap-2 items-center py-3 ">
                                    <img src="/assets/svg/mobile_favorite.svg" alt="cart icon" className="w-6 h-6" />
                                    <p className="text-base font-bold capitalize" onClick={onClose}>
                                        Sản phẩm yêu thích
                                    </p>
                                </div>
                            </Link>
                            <Link href="/user/orders" className="link-item">
                                <div className="flex justify-start gap-2 items-center py-3 ">
                                    <img src="/assets/svg/mobile_order.svg" alt="cart icon" className="w-6 h-6" />
                                    <p className="text-base font-bold capitalize" onClick={onClose}>
                                        Đơn hàng
                                    </p>
                                </div>
                            </Link>
                            <Link href="javascript:void(0)" className="link-item" onClick={() => Logout()}>
                                <div className="flex justify-start gap-2 items-center py-3 ">
                                    <img src="/assets/svg/mobile_logout.svg" alt="cart icon" className="w-6 h-6" />
                                    <p className="text-base font-bold capitalize" onClick={onClose}>
                                        Đăng xuất
                                    </p>
                                </div>
                            </Link>
                        </Drawer>
                        <Link href="javascript:void(0)" className="link-item" onClick={() => Logout()}>
                            <div className="flex justify-start gap-2 items-center py-3 ">
                                <img src="/assets/svg/mobile_logout.svg" alt="cart icon" className="w-6 h-6" />
                                <p className="text-base font-bold capitalize" onClick={onClose}>
                                    Đăng xuất
                                </p>
                            </div>
                        </Link>
                    </div>
                ) : (
                    <div>
                        <Link href="/auth/login" className="link-item">
                            <div className="flex justify-start gap-2 items-center py-3 ">
                                <img src="/assets/svg/mobile_login.svg" alt="cart icon" className="w-6 h-6" />
                                <p className="text-base font-bold capitalize" onClick={onClose}>
                                    Đăng nhập
                                </p>
                            </div>
                        </Link>
                        <Link href="/auth/register" className="link-item">
                            <div className="flex justify-start gap-2 items-center py-3 ">
                                <img src="/assets/svg/mobile_register.svg" alt="cart icon" className="w-6 h-6" />
                                <p className="text-base font-bold capitalize" onClick={onClose}>
                                    Đăng ký
                                </p>
                            </div>
                        </Link>
                    </div>
                )}
            </Drawer>
        </header>
    );
}

export default HeaderUser;
