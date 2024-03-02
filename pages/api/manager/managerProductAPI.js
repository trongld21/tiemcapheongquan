import useAxios from '@/hooks/useAxios';

const managerProductAPI = {
    GetAll: async () => {
        const axios = useAxios();
        try {
            const url = '/ManagementProducts/GetAll';
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
    Create: async (data) => {
        const axios = useAxios();
        try {
            const url = '/ManagementProducts/Create';
            const res = await axios.post(url, data);
            // Check response from api
            if (res.status) {
                return res.data;
            } else {
                console.log(res);
            }
        } catch (error) {
            // Handle the error
            return error.response;
        }
    },
    Delete: async (productId) => {
        // Phương thức API DELETE Delete
        const axios = useAxios();
        try {
            const url = `/ManagementProducts/Delete/${productId}`;
            const res = await axios.delete(url);
            // Kiểm tra phản hồi từ API
            if (res.status === 200) {
                return res.data;
            } else {
                console.log(res);
            }
        } catch (error) {
            // Xử lý lỗi
            console.log(error.response);
            return error.response;
        }
    },
    Update: async (productId, data) => {
        // Phương thức API PUT Edit
        const axios = useAxios();
        try {
            const url = `/ManagementProducts/Update/${productId}`;
            const res = await axios.put(url, data);
            // Kiểm tra phản hồi từ API
            if (res.status === 200) {
                return res.data;
            } else {
                console.log(res);
            }
        } catch (error) {
            // Xử lý lỗi
            console.log(error.response);
            return error.response;
        }
    },

    GetBySlug: async (slug) => {
        const axios = useAxios();
        try {
            const response = await axios.get(`/ManagementProducts/GetBySlug/${slug}`);
            // Check response from api
            if (response && response.status) {
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

export default managerProductAPI;
