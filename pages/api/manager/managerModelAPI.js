import useAxios from '@/hooks/useAxios';

const managerModelAPI = {
    GetAll: async () => {
        const axios = useAxios();
        try {
            const url = '/ManagementProduct3DModels/GetAll';
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

    GetAllByID: async (id) => {
        const axios = useAxios();
        try {
            const url = `/ManagementProduct3DModels/GetAllByProductId/${id}`;
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

    CreateModel: async (modelName, videoUrl, modelUrl, thumbnailUrl) => {
        const axios = useAxios();
        try {
            const data = { modelName, videoUrl, modelUrl, thumbnailUrl };
            const url = '/ManagementProduct3DModels/Create';
            const res = await axios.post(url, data);
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
    DeleteModel: async (id) => {
        const axios = useAxios();
        try {
            const url = `/ManagementProduct3DModels/Delete/${id}`;
            const res = await axios.delete(url);
            console.log('🚀 ~ file: managerModelAPI.js:26 ~ CreateModel: ~ res:', res);
            // Check response from api
            if (res.status) {
                return res.data;
            } else {
                return res;
            }
        } catch (error) {
            // Handle the error
            return error.response;
        }
    },
};

export default managerModelAPI;
