import { UserContext } from '@/contexts/userContext';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { getCookie } from '../Utils/cookie';
import { HubConnectionBuilder } from '@microsoft/signalr';
import apiNotification from '@/pages/api/user/apiNotification';
import { useCookie } from '@/hooks/useCookie';
import { useToken } from '@/hooks/useToken';
import { Layout, Menu, Button, theme } from 'antd';
const { Header, Sider, Content } = Layout;
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { formateDateTimeVN } from '../Utils/FormatDate';

function AdminHeader({ collapsed, setCollapsed, colorBgContainer }) {
    const router = useRouter();
    const [stateShowNotification, setStateShowNotification] = useState(false);
    const [notificationData, setNotificationData] = useState([]);
    const { isLogged, setIsLogged } = useContext(UserContext);

    const { removeCookie } = useCookie();
    const [userInfo, setUserInfo] = useState();
    const { getDataAccessToken } = useToken();

    const fetchNotification = async () => {
        if (isLogged) {
            const res = await apiNotification.GetAll();
            // console.log('🚀 ~ file: HeaderUser.js:31 ~ fetchNotification ~ res:', res);
            if (res && res.success) {
                setNotificationData(res.data);
                // console.log('🚀 ~ file: AdminHeader.js:21 ~ fetchNotification ~ res.data:', res.data);
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

    const Logout = () => {
        setIsLogged(false);
        removeCookie('access_token');
        removeCookie('refresh_token');
        setUserInfo(getDataAccessToken());
        router.push('/');
    };

    const handleReadNotification = async () => {
        const res = await apiNotification.ReadAll();
        if (res && res.success) {
            fetchNotification();
        }
    };

    return (
        <Header
            style={{
                padding: 0,
                background: colorBgContainer,
                position: 'sticky',
                top: 0,
                zIndex: '50',
                boxShadow: '0 1px 2px -2px gray',
            }}
        >
            <div className="flex justify-between bg-white">
                <Button
                    type="text"
                    icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    onClick={() => setCollapsed(!collapsed)}
                    style={{
                        fontSize: '16px',
                        width: 64,
                        height: 64,
                    }}
                />
                <section className="flex gap-5 items-center pr-10 relative">
                    <div className="relative items-center flex">
                        <button
                            className="hover:bg-hover-header p-1.5 lg:p-2.5 rounded-10 relative"
                            onClick={() => {
                                setStateShowNotification(!stateShowNotification);
                            }}
                        >
                            {notificationData.some((item) => !item.isRead) && (
                                <div className="absolute right-2 top-1 w-2 h-2 bg-primary rounded-full"></div>
                            )}
                            <img className="lg:w-5 w-4 h-4 lg:h-5" src="/assets/svg/bell.svg" alt="arrow icon" />
                        </button>
                        {stateShowNotification && (
                            <div className="absolute w-96 right-10 top-10 bg-white rounded-lg p-5 shadow z-50">
                                <div className="flex justify-between items-center relative bg-white z-50">
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
                                                <div className=" border-solid border-0 border-b border-gray-500 w-11/12 flex flex-col gap-2">
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
                    <div className="flex gap-6 items-center cursor-pointer">
                        {/* <img className="h-10 w-10 rounded-full" src="/assets/images/admin_avatar.png" alt="avatar" />
                        <div className="flex flex-col gap-1 justify-center items-center ">
                            <p className="font-medium text-xs opacity-50">Admin</p>
                        </div> */}
                        <button
                            onClick={Logout}
                            type="button"
                            data-te-ripple-init
                            data-te-ripple-color="light"
                            className="inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                        >
                            Đăng xuất
                        </button>
                    </div>
                </section>
            </div>
        </Header>
    );
}

export default AdminHeader;
