import { SessionProvider } from 'next-auth/react';
import '@/styles/globals.css';
import 'react-quill/dist/quill.snow.css';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import { CookiesProvider } from 'react-cookie';
import UserProvider from '@/contexts/userContext';
import { Analytics } from "@vercel/analytics/react";
import Head from 'next/head';


export default function App({ Component, pageProps: { ...pageProps } }) {
    return (
        <CookiesProvider>
            <UserProvider>
                <Head>
                    <meta charSet="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <title>Tiệm Cà Phê Ông Quan</title>
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <Component {...pageProps} />
                <Analytics />
            </UserProvider>
        </CookiesProvider>
    );
}
