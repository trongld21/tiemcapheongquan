import useAxios from '@/hooks/useAxios';

const managerOrderAPI = {
    GetAll: async () => {
        const axios = useAxios();
        try {
            const url = '/ManagementOrders/GetAll';
            const res = await axios.get(url);
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
    GetByID: async (orderId) => {
        const axios = useAxios();
        try {
            const url = '/ManagementOrders/FindById/' + orderId;
            const res = await axios.get(url);
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
    UpdateStatus: async (orderId, orderStatus) => {
        const axios = useAxios();
        try {
            const data = { orderId, orderStatus };
            const response = await axios.put('/ManagementOrders/UpdateStatusOrder/' + orderId, data);
            // Check response from api
            if (response.status) {
                return response.data;
            } else {
                console.log('Error');
            }
        } catch (error) {
            // Handle the error
            return error.response;
        }
    },
};

export default managerOrderAPI;
