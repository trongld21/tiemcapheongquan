import useAxios from '@/hooks/useAxios';

const managerAccountAPI = {
    GetAllUser: async () => {
        const axios = useAxios();
        try {
            const res = await axios.get('/ManagementUsers/GetAllUser');
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
    UpdateRole: async (userId, role) => {
        const axios = useAxios();
        try {
            const data = { userId, role };
            const res = await axios.put('/ManagementUsers/SetRole/' + userId, data);
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
    Delete: async (userId) => {
        const axios = useAxios();
        try {
            const res = await axios.delete('/ManagementUsers/Delete/' + userId);
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

export default managerAccountAPI;
