import { SessionProvider } from 'next-auth/react';
import '@/styles/globals.css';
import 'react-quill/dist/quill.snow.css';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import { CookiesProvider } from 'react-cookie';
import UserProvider from '@/contexts/userContext';

export default function App({ Component, pageProps: { ...pageProps } }) {
    return (
        <CookiesProvider>
            <UserProvider>
                <Component {...pageProps} />
            </UserProvider>
        </CookiesProvider>
    );
}
