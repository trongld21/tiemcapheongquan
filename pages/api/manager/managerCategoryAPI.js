import useAxios from '@/hooks/useAxios';

const managerCategoryAPI = {
    GetAll: async () => {
        const axios = useAxios();
        try {
            const res = await axios.get('/ManagementCategories/GetAll');
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
    Create: async (name, thumbnail) => {
        const axios = useAxios();
        try {
            const data = { name, thumbnail };
            const res = await axios.post('/ManagementCategories/Create', data);
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
    Update: async (categoryId, name, thumbnail) => {
        const axios = useAxios();
        try {
            const data = { categoryId, name, thumbnail };
            const res = await axios.put('/ManagementCategories/Update/' + categoryId, data);
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
    Delete: async (categoryId) => {
        const axios = useAxios();
        try {
            const res = await axios.delete('/ManagementCategories/Delete/' + categoryId);
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

export default managerCategoryAPI;
