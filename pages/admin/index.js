import BarChart from '@/components/Dashboard/BarChart';
import OverviewItem from '@/components/Dashboard/OverviewItem';
import RecentOrders from '@/components/Dashboard/RecentOrder';
import SaleByProducts from '@/components/Dashboard/SaleByProduct';
import AdminLayout from '@/components/Layout/AdminLayout';
import dashboardAPI from '../api/manager/dashboardAPI';
import { useEffect, useState } from 'react';
import getServerSideProps from '@/lib/adminServerProps';
import convertToVND from '@/components/Utils/convertToVND';
// import { HubConnectionBuilder } from '@microsoft/signalr';
// import { getCookie } from '@/components/Utils/cookie';

function Index() {
    const [totalUser, setTotalUser] = useState(0);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [totalOrder, setTotalOrder] = useState(0);
    // const [totalReturn, setTotalReturn] = useState(0);
    const [topProducts, setTopProducts] = useState();
    const [recentOrders, setRecentOrders] = useState();
    // const [totalCountUser, setTotalCountUser] = useState(0);

    useEffect(() => {
        fetchData();
        // const access_token = getCookie('access_token');
        // const connectionUser = new HubConnectionBuilder()
        //     .withUrl(process.env.NEXT_PUBLIC_URL + '/hubs/user', {
        //         accessTokenFactory: () => {
        //             return access_token;
        //         },
        //     })
        //     .withAutomaticReconnect()
        //     .build();

        // const startConnection = async () => {
        //     try {
        //         await connectionUser.start();
        //     } catch (error) {
        //         console.error('Error connecting to Chat Hub', error);
        //     }
        // };
        // startConnection();
        // connectionUser.on('updateTotalUsers', (data) => {
        //     setTotalCountUser(data);
        //     // console.log('🚀 ~ file: index.js:82 ~ connectionUser.on ~ data:', data);
        // });
        // connectionUser.onclose(async () => {
        //     console.log('Connection closed, attempting to reconnect...');
        //     try {
        //         await startConnection();
        //     } catch (error) {
        //         console.error('Error reconnecting to Chat Hub', error);
        //     }
        // });
        // return async () => {
        //     connectionUser.off('updateTotalUsers');
        //     await connectionUser.stop();
        // };
    }, []);

    const fetchData = async () => {
        try {
            const totalUsers = await dashboardAPI.GetTotalUser();
            if (totalUsers && totalUsers.success) {
                setTotalUser(totalUsers.data.totalUser);
            }

            // const totalReturns = await dashboardAPI.GetTotalReturns();
            // if (totalReturns && totalReturns.success) {
            //     setTotalReturn(totalReturns.data.totalOrderReturn);
            // }

            const totalRevenues = await dashboardAPI.GetTotalRevenue();
            if (totalRevenues && totalRevenues.success) {
                setTotalRevenue(totalRevenues.data.totalRevenue);
            }

            const totalOrders = await dashboardAPI.GetTotalOrder();
            if (totalOrders && totalOrders.success) {
                setTotalOrder(totalOrders.data.totalOrder);
            }

            const topProducts = await dashboardAPI.GetTopProductSale();
            if (topProducts && topProducts.success) {
                setTopProducts(topProducts.data);
            }

            const recentOrders = await dashboardAPI.GetRecentOrders();
            if (recentOrders && recentOrders.success) {
                setRecentOrders(recentOrders.data);
            }
        } catch (error) {
            // Xử lý lỗi nếu có
            console.log(error);
        }
    };
    return (
        <AdminLayout>
            <div className="p-10">
                <h1 className="font-sans font-semibold text-2xl">Tổng quan</h1>
                <div className="flex justify-start gap-8 my-8">
                    <OverviewItem
                        urlIcon={'/assets/svg/user.svg'}
                        title="Tổng số khách hàng"
                        total={totalUser}
                        key={1}
                    />
                    <OverviewItem
                        urlIcon={'/assets/svg/revenue.svg'}
                        title="Tổng doanh thu"
                        total={convertToVND(totalRevenue)}
                        key={2}
                    />
                    <OverviewItem urlIcon={'/assets/svg/order.svg'} title="Tổng đơn hàng" total={totalOrder} key={3} />
                    {/* <OverviewItem
                        urlIcon={'/assets/svg/user.svg'}
                        title="Người dùng truy cập hiện tại"
                        total={totalCountUser}
                        key={4}
                    /> */}
                </div>
                <BarChart />

                <div className="py-4 flex justify-between gap-4 my-8">
                    <SaleByProducts data={topProducts} />
                    <RecentOrders data={recentOrders} />
                </div>
            </div>
        </AdminLayout>
    );
}

export default Index;

export { getServerSideProps };
