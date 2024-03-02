import { useEffect } from 'react';
import Cookies from 'js-cookie';

export const useCookie = () => {
    const setCookie = (key, value, options = {}) => {
        Cookies.set(key, value, options);
    };

    const getCookie = (key) => {
        return Cookies.get(key);
    };

    const removeCookie = (key) => {
        Cookies.remove(key);
    };

    return { setCookie, getCookie, removeCookie };
};
