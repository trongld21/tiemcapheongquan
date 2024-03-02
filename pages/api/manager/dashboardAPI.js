import useAxios from '@/hooks/useAxios';

const dashboardAPI = {
    GetTotalUser: async () => {
        const axios = useAxios();
        try {
            const res = await axios.get('/Statisticals/GetTotalUser');
            // Check response from api
            if (res.status) {
                return res.data;
            } else {
                console.log('Error');
            }
        } catch (error) {
            // Handle the error
            return error.response;
        }
    },
    GetTotalRevenue: async () => {
        const axios = useAxios();
        try {
            const res = await axios.get('/Statisticals/GetTotalRevenue');
            // Check response from api
            if (res.status) {
                return res.data;
            } else {
                console.log('Error');
            }
        } catch (error) {
            // Handle the error
            return error.response;
        }
    },
    GetTotalReturns: async () => {
        const axios = useAxios();
        try {
            const res = await axios.get('/Statisticals/GetTotalReturns');
            // Check response from api
            if (res.status) {
                return res.data;
            } else {
                console.log('Error');
            }
        } catch (error) {
            // Handle the error
            return error.response;
        }
    },
    GetTotalOrder: async () => {
        const axios = useAxios();
        try {
            const res = await axios.get('/Statisticals/GetTotalOrder');
            // Check response from api
            if (res.status) {
                return res.data;
            } else {
                console.log('Error');
            }
        } catch (error) {
            // Handle the error
            return error.response;
        }
    },
    GetTopProductSale: async () => {
        const axios = useAxios();
        try {
            const res = await axios.get(`/Statisticals/GetTopProductSale`);
            // Check response from api
            if (res.status) {
                return res.data;
            } else {
                console.log('Error');
            }
        } catch (error) {
            // Handle the error
            return error.response;
        }
    },
    GetDataChartByYear: async (year = 2023) => {
        const axios = useAxios();
        try {
            const res = await axios.get(`/Statisticals/GetRevenueChart?year=${year}`);
            // Check response from api
            if (res.status) {
                return res.data;
            } else {
                console.log('Error');
            }
        } catch (error) {
            // Handle the error
            return error.response;
        }
    },
    GetRecentOrders: async () => {
        const axios = useAxios();
        try {
            const res = await axios.get(`/Statisticals/RecentOrders`);
            // Check response from api
            if (res.status) {
                return res.data;
            } else {
                console.log('Error');
            }
        } catch (error) {
            // Handle the error
            return error.response;
        }
    },
};

export default dashboardAPI;
