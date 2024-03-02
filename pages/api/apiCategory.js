import useAxios from '@/hooks/useAxios';

const apiCategory = {
    // Get all product api
    GetAllCategory: async () => {
        const axios = useAxios();
        try {
            const url = '/Categories/GetAll';
            const res = await axios.get(url);
            if (res.status) {
                return res.data;
            } else {
                console.log('Error');
            }
        } catch (error) {
            // Handle the error
            return error.message;
            return error.response;
        }
    },

    GetAll: async () => {
        const axios = useAxios();
        try {
            const res = await axios.get('/Categories/GetAll');
            // Check response from api
            if (res.status) {
                return res.data;
            } else {
                console.log('Error');
            }
        } catch (error) {
            // Handle the error
            return error.message;
            return error.response;
        }
    },
};

export default apiCategory;
