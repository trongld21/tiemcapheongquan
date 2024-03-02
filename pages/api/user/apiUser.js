import useAxios from '@/hooks/useAxios';

const apiUser = {
    GetInfo: async () => {
        const axios = useAxios();
        try {
            const res = await axios.get('/Users/GetUserInfo');
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

    RequestChangePassword: async () => {
        const axios = useAxios();
        try {
            const res = await axios.post('/Users/RequestChangePassword');
            // Check response from api
            if (res && res.status) {
                return res.data;
            } else {
                console.log('Error');
            }
        } catch (error) {
            // Handle the error
            return error.response;
        }
    },
    UpdateInfo: async (data) => {
        const axios = useAxios();
        try {
            const url = '/Users/UpdateUserInfo';
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

    ChangePassword: async (password, newPassword, code) => {
        const axios = useAxios();
        try {
            const data = { password, newPassword, code };
            const url = '/Users/ChangePassword';
            const res = await axios.post(url, data);
            // Check response from api
            if (res && res.status) {
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

export default apiUser;
