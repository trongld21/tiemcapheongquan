import useAxios from '@/hooks/useAxios';

const apiOrder = {
    // Api to make order
    MakeOrder: async (listCartIdSelect, addressId, codeCoupon, note) => {
        const axios = useAxios();
        try {
            const data = { listCartIdSelect, addressId, codeCoupon, note };
            const response = await axios.post('/Orders/MakeOrder', data);
            console.log('🚀 ~ file: apiOrder.js:10 ~ MakeOrder: ~ response:', response);
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
    GetAllOfUser: async () => {
        const axios = useAxios();
        try {
            const response = await axios.get('/Orders/GetAllOfUser');
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
    UpdateStatus: async (orderId, orderStatus) => {
        const axios = useAxios();
        try {
            const data = { orderId, orderStatus };
            const response = await axios.put('/Orders/UpdateStatusOrder/' + orderId, data);
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
export default apiOrder;
