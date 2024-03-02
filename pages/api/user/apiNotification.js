import useAxios from '@/hooks/useAxios';

const apiNotification = {
    GetAll: async () => {
        const axios = useAxios();
        try {
            const response = await axios.get('/Notifications/GetAll');
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
    ReadAll: async () => {
        const axios = useAxios();
        try {
            const response = await axios.get('/Notifications/ReadAll');
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
export default apiNotification;
