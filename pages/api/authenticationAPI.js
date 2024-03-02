// import axiosClient from './axiosClient';
import useAxios from '@/hooks/useAxios';

const authenticationApi = {
    Register: async (email, password, fullName) => {
        const axios = useAxios();
        try {
            const data = { email, password, fullName };
            const res = await axios.post('/Authentications/Register', data);
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
    ConfirmMail: async (email, code) => {
        const axios = useAxios();
        try {
            const data = { email, code };
            const res = await axios.post('/Authentications/ConfirmMail', data);
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
    ResendConfirmationCode: async (email) => {
        const axios = useAxios();
        try {
            const data = { email };
            const res = await axios.post('/Authentications/resendConfirmationCode', data);
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
    // Login api
    Login: async (email, password) => {
        const axios = useAxios();
        try {
            const data = { email, password };
            const res = await axios.post('/Authentications/Login', data);
            // console.log('🚀 ~ file: authenticationAPI.js:59 ~ Login: ~ res:', res);
            // Check response from api
            if (res && res.status) {
                return res.data;
            } else {
                return res.data;
            }
        } catch (error) {
            if (error && !error?.response?.data?.success) {
                return error?.response?.data;
            }
            // Handle the error
            return error.response;
        }
    },
    ForgotPassword: async (email) => {
        const axios = useAxios();
        try {
            const data = { email };
            const res = await axios.post('/Authentications/ForgotPassword', data);
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
    ConfirmForgotPassword: async (email, password, code) => {
        const axios = useAxios();
        try {
            const data = { email, password, code };
            const res = await axios.post('/Authentications/ConfirmForgotPassword', data);
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
    RenewToken: async (accessToken, refreshToken) => {
        const axios = useAxios();
        try {
            const data = { accessToken, refreshToken };
            const res = await axios.post('/Authentications/RenewToken', data);
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

export default authenticationApi;
