import React, { useEffect, useState } from 'react';
import { useToken } from '@/hooks/useToken';
import apiNotification from '@/pages/api/user/apiNotification';

const NotificationOfUser = ({ data }) => {
    // const [data, setData] = useState([]);
    console.log('🚀 ~ file: NotificationOfUser.js:7 ~ NotificationOfUser ~ data:', data);

    // const fetchData = async () => {
    //     try {
    //         // Lấy token từ session storage
    //         const access_token = sessionStorage.getItem('access_token');
    //         // console.log('🚀 ~ file: [roomId].js:17 ~ fetchData ~ token:', token);

    //         // Lấy tin nhắn từ API bằng token
    //         const response = await axios.get(`https://localhost:7294/api/Notification/GetForUser`, {
    //             headers: {
    //                 Authorization: `Bearer ${access_token}`,
    //             },
    //         });
    //         setData(response.data);
    //         // console.log('🚀 ~ file: [roomId].js:26 ~ fetchData ~ response:', response);
    //     } catch (error) {
    //         console.error('Error fetching messages', error);
    //     }
    // };

    useEffect(() => {
        // const fetchData = async () => {
        //     try {
        //         var res = await apiNotification.GetAll();
        //         if (res && res.success) {
        //             setData(response.data);
        //         }
        //         // console.log('🚀 ~ file: [roomId].js:26 ~ fetchData ~ response:', response);
        //     } catch (error) {
        //         console.error('Error fetching messages', error);
        //     }
        // };
        // fetchData();
        // // Kết nối tới Chat Hub và tham gia vào phòng chat
        // const connection = new HubConnectionBuilder()
        //     .withUrl('https://localhost:7294/hubs/notification', {
        //         accessTokenFactory: () => {
        //             // Lấy token từ session storage và trả về để gửi trong header của yêu cầu SignalR
        //             return sessionStorage.getItem('access_token');
        //         },
        //     })
        //     .withAutomaticReconnect()
        //     .build();
        // var userId = sessionStorage.getItem('id');
        // const startConnection = async () => {
        //     try {
        //         await connection.start();
        //         console.log('Connected to notification Hub');
        //         // Gửi yêu cầu tham gia vào phòng chat
        //         if (userId) {
        //             await connection.invoke('JoinGroup', parseInt(userId));
        //         }
        //     } catch (error) {
        //         console.error('Error connecting to Chat Hub', error);
        //     }
        // };
        // startConnection();
        // // Lắng nghe sự kiện nhận tin nhắn mới từ server và cập nhật vào state
        // connection.on('NewNotification', (data) => {
        //     setData((prevNotification) => [...prevNotification, data]);
        // });
        // // Xử lý sự kiện mất kết nối và khởi động lại kết nối
        // connection.onclose(async () => {
        //     console.log('Connection closed, attempting to reconnect...');
        //     try {
        //         await startConnection();
        //     } catch (error) {
        //         console.error('Error reconnecting to Chat Hub', error);
        //     }
        // });
        // return async () => {
        //     // Rời khỏi phòng chat khi component unmount
        //     if (userId) {
        //         await connection.invoke('LeaveRoom', parseInt(userId)).catch((error) => {
        //             console.error('Error leaving room', error);
        //         });
        //     }
        //     connection.off('NewNotification');
        //     await connection.stop();
        // };
    }, []);

    return (
        <div className="absolute w-96 right-0 bg-white rounded-lg p-5 shadow">
            <div className="flex justify-between items-center">
                <h1 className="font-semibold text-lg">Thông báo</h1>
                <p className="text-xs text-primary font-light z-50">Đánh dấu đã đọc tất cả</p>
            </div>
            <ul className="max-h-96 overflow-y-scroll">
                <li className="flex justify-start gap-4 items-center py-2">
                    <img src="/assets/svg/dot.svg" />
                    <div className=" border-solid border-0 border-b border-gray-500 w-full">
                        <p className="text-xs font-light">Package from your order #123456 has arrived</p>
                        <span className="text-xs font-light text-primary ">Yesterday at 12:00 p.m</span>
                    </div>
                </li>
                <li className="flex justify-start gap-4 items-center py-2">
                    <img src="/assets/svg/dot.svg" />
                    <div className=" border-solid border-0 border-b border-gray-500 w-full">
                        <p className="text-xs font-light">Package from your order #123456 has arrived</p>
                        <span className="text-xs font-light text-primary ">Yesterday at 12:00 p.m</span>
                    </div>
                </li>
                <li className="flex justify-start gap-4 items-center py-2">
                    <img src="/assets/svg/dot.svg" />
                    <div className=" border-solid border-0 border-b border-gray-500 w-full">
                        <p className="text-xs font-light">
                            Package from your order #123456 has arrived. Package from your order #123456 has arrived.
                            Package from your order #123456 has arrived
                        </p>
                        <span className="text-xs font-light text-primary ">Yesterday at 12:00 p.m</span>
                    </div>
                </li>
                <li className="flex justify-start gap-4 items-center py-2">
                    <img src="/assets/svg/dot.svg" />
                    <div className=" border-solid border-0 border-b border-gray-500 w-full">
                        <p className="text-xs font-light">
                            Package from your order #123456 has arrived. Package from your order #123456 has arrived.
                            Package from your order #123456 has arrived
                        </p>
                        <span className="text-xs font-light text-primary ">Yesterday at 12:00 p.m</span>
                    </div>
                </li>
                <li className="flex justify-start gap-4 items-center py-2">
                    <img src="/assets/svg/dot.svg" />
                    <div className=" border-solid border-0 border-b border-gray-500 w-full">
                        <p className="text-xs font-light">
                            Package from your order #123456 has arrived. Package from your order #123456 has arrived.
                            Package from your order #123456 has arrived
                        </p>
                        <span className="text-xs font-light text-primary ">Yesterday at 12:00 p.m</span>
                    </div>
                </li>
                <li className="flex justify-start gap-4 items-center py-2">
                    <img src="/assets/svg/dot.svg" />
                    <div className=" border-solid border-0 border-b border-gray-500 w-full">
                        <p className="text-xs font-light">
                            Package from your order #123456 has arrived. Package from your order #123456 has arrived.
                            Package from your order #123456 has arrived
                        </p>
                        <span className="text-xs font-light text-primary ">Yesterday at 12:00 p.m</span>
                    </div>
                </li>
            </ul>
        </div>
    );
};

export default NotificationOfUser;
