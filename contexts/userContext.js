import { useCookie } from '@/hooks/useCookie';
import { useRouter } from 'next/router';
import { createContext, useEffect, useState } from 'react';

export const UserContext = createContext();

export default function UserProvider({ children }) {
    const router = useRouter();
    const [isLogged, setIsLogged] = useState(false);
    const [orderInfo, setOrderInfo] = useState([]);
    const { setCookie, getCookie } = useCookie();
    const [search, setSearch] = useState();

    useEffect(() => {
        setIsLogged(getCookie('access_token') ? true : false);
    }, [getCookie]);

    // Lấy dữ liệu từ local storage khi component được tạo lần đầu
    useEffect(() => {
        const listItemCart = JSON.parse(localStorage.getItem('itemsCart'));
        if (listItemCart) {
            setOrderInfo(listItemCart);
        }
    }, [isLogged]);

    useEffect(() => {
        try {
            const { search } = router.query;
            if (search) {
                setSearch(search);
            } else {
                setSearch('');
            }
        } catch (error) {
            console.log('🚀 ~ file: userContext.js:30 ~ useEffect ~ error:', error);
        }
    }, [router]);

    const value = { isLogged, orderInfo, setOrderInfo, setIsLogged, search, setSearch };

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
