import { useCookie } from './useCookie';
import jwt from 'jsonwebtoken';

export const useToken = () => {
    const { getCookie } = useCookie();
    // Function to get all data from access token in cookie
    const getDataAccessToken = () => {
        try {
            // Get access token from cookie
            const token = getCookie('access_token');
            // Decode token to get data
            const userInfo = jwt.decode(token);
            // Check data is valid to return
            if (userInfo) {
                return userInfo;
            }
            return null;
        } catch (error) {
            console.log(error);
        }
    };

    return { getDataAccessToken };
};
