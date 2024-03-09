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
        <header className="flex max-md:flex-col md:flex-col lg:px-2 lg:h-[80px] z-50 shadow sticky top-0 h-fit bg-[#594633] justify-between items-center px-8">
            <div className="flex justify-between pt-[1rem] pb-5 lg:px-2 w-full">
                <div className="w-1/6 max-sm:w-full flex items-center">
                    <Link href="/" className="ml-8">
                        <img className="h-12 scale-150" src="/assets/images/tiemcapheongquan/logo.png" alt="logo tiệm cà phê ông quan" />
                    </Link>
                </div>
                <div className="w-5/6 lg:w-4/5 max-sm:hidden flex text-xs xl:text-sm font-bold items-center justify-around px-2">
                    <section className="flex justify-between gap-4 md:gap-8 lg:gap-16">
                        <Link href="/">
                            <p className="font-medium lg:text-lg sm:text-sm  text-[#F1E8C7] font-iCielBCCartelDeuxAlt border-b-2 border-transparent hover:border-[#A69689] uppercase">TRANG CHỦ</p>
                        </Link>
                        <Link href="/product" id="btn-product">
                            <p className="font-medium lg:text-lg sm:text-sm  text-[#F1E8C7] font-iCielBCCartelDeuxAlt border-b-2 border-transparent hover:border-[#A69689] uppercase">Thực đơn</p>
                        </Link>
                        <Link href="/news">
                            <p className="font-medium lg:text-lg sm:text-sm  text-[#F1E8C7] font-iCielBCCartelDeuxAlt border-b-2 border-transparent hover:border-[#A69689] uppercase">TIN TỨC</p>
                        </Link>
                        <Link href="/about">
                            <p className="font-medium lg:text-lg sm:text-sm  text-[#F1E8C7] font-iCielBCCartelDeuxAlt border-b-2 border-transparent hover:border-[#A69689] uppercase">
                                VỀ CHÚNG TÔI
                            </p>
                        </Link>
                        <Link href="/contact">
                            <p className="font-medium lg:text-lg sm:text-sm  text-[#F1E8C7] font-iCielBCCartelDeuxAlt border-b-2 border-transparent hover:border-[#A69689] uppercase">LIÊN HỆ</p>
                        </Link>
                    </section>

                    <section className="relative bg-white rounded-50 border border-[#A69689] hidden -mt-2 md:hidden xl:flex p-1">
                        <input
                            className="rounded-50 border-none font-iCielBCLivory mr-5 pl-3 pr-16 py-1 text-sm placeholder:text-sm font-medium"
                            placeholder="Tìm kiếm"
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
                </div>
                <div className="max-sm:flex hidden w-8 h-8 my-auto mr-4">
                    <img src="/assets/svg/mobile.svg" alt="icon" onClick={showDrawer} />
                </div>
            </div>
            <div className="relative bg-white max-sm:flex rounded-50 border border-[#A69689] p-1 mb-6 mx-4 lg:hidden">
                <input
                    className="rounded-50 border-none font-iCielBCLivory w-full mr-5 pl-3 pr-16 py-1 text-sm placeholder:text-sm font-medium"
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
