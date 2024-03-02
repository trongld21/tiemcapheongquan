import axios from 'axios';
import { useCookie } from './useCookie';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

const useAxios = () => {
    const { setCookie, getCookie } = useCookie();

    // Create a instance axios with custom url and content type
    const axiosInstance = axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_URL,
        headers: {
            'Content-Type': 'application/json',
        },
        paramsSerializer: (params) => {
            return JSON.stringify(params);
        },
    });

    // Catch send request with access token
    axiosInstance.interceptors.request.use((config) => {
        try {
            const accessToken = getCookie('access_token');
            if (accessToken) {
                config.headers['Authorization'] = `Bearer ${accessToken}`;
            }
            return config;
        } catch (error) {
            return error;
        }
    });

    // Catch api response
    axiosInstance.interceptors.response.use(
        (response) => response,
        async (error) => {
            const accessToken = getCookie('access_token');
            // Check the token has expired and the user is logged in
            if (error.response.status === 401 && accessToken) {
                // Call api to get new access and refresh token
                try {
                    const refreshToken = await axios({
                        method: 'post',
                        baseURL: process.env.NEXT_PUBLIC_API_URL + '/Authentications/RenewToken',
                        data: JSON.stringify({
                            accessToken: getCookie('access_token'),
                            refreshToken: getCookie('refresh_token'),
                        }),
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                    // Check call api success and reset cookie
                    if (refreshToken.status === 200) {
                        console.log('🚀 ~ file: useAxios.js:54 ~ refreshToken:', refreshToken);
                        if (refreshToken?.data?.success) {
                            setCookie('access_token', refreshToken?.data?.data?.accessToken);
                            setCookie('refresh_token', refreshToken?.data?.data?.refreshToken);
                            return axiosInstance(error.config);
                        }
                    }
                } catch (error) {
                    console.log('🚀 ~ file: useAxios.js:67 ~ error:', error);
                    handleTokenExpiration();
                }
            } else if (error.response.status === 400) {
                return error?.response;
            }
            return Promise.reject(error);
        },
    );

    // Return the axios instance
    return axiosInstance;
};

// Function to handle token expiration
const handleTokenExpiration = () => {
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    // window.location.href = '/auth/login';
};

export default useAxios;
