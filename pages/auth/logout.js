import { UserContext } from '@/contexts/userContext';
import { useCookie } from '@/hooks/useCookie';
import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';

function LogoutPage() {
    const router = useRouter();
    const { removeCookie } = useCookie();
    const { isLogged, setIsLogged } = useContext(UserContext);

    const Logout = () => {
        setIsLogged(false);
        removeCookie('access_token');
        removeCookie('refresh_token');
        router.push('/');
    };

    // useEffect sẽ tự động được gọi khi component được render
    useEffect(() => {
        Logout(); // Gọi hàm logout khi component được render
    }, []); // [] để đảm bảo useEffect chỉ gọi một lần khi component mount

    return <div>Logging out...</div>;
}

export default LogoutPage;
