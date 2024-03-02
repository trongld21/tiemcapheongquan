// import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Facebook from '../Chat/Facebook';
import Footer from '../Footer';
import HeaderUser from '../HeaderUser';
import Spinner from '../Utils/Spinner';
// import { HubConnectionBuilder } from '@microsoft/signalr';

function UserLayout({ children }) {
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    // const connectionUser = new HubConnectionBuilder()
    //     .withUrl(process.env.NEXT_PUBLIC_URL + '/hubs/user')
    //     .withAutomaticReconnect()
    //     .build();
    // useEffect(() => {
    //     const startConnection = async () => {
    //         try {
    //             await connectionUser.start();
    //         } catch (error) {
    //             // console.error('Error connecting to Chat Hub', error);
    //         }
    //     };
    //     startConnection();
    //     connectionUser.onclose(async () => {
    //         // console.log('Connection closed, attempting to reconnect...');
    //         try {
    //             await startConnection();
    //         } catch (error) {
    //             // console.error('Error reconnecting to Chat Hub', error);
    //         }
    //     });
    //     return async () => {
    //         await connectionUser.stop();
    //     };
    // }, []);

    useEffect(() => {
        const handleStart = () => {
            setLoading(true);
        };
        const handleComplete = () => {
            setLoading(false);
        };

        router.events.on('routeChangeStart', handleStart);
        router.events.on('routeChangeComplete', handleComplete);
        router.events.on('routeChangeError', handleComplete);

        return () => {
            router.events.off('routeChangeStart', handleStart);
            router.events.off('routeChangeComplete', handleComplete);
            router.events.off('routeChangeError', handleComplete);
        };
    }, [router]);

    return (
        <div>
            <HeaderUser />
            <main>
                {loading && <Spinner />}
                <div className="pt-headerHeight">{children}</div>
            </main>
            <div className="fixed rounded-full bottom-8 right-8 z-[60]">
                <Facebook />
            </div>
            <Footer />
        </div>
    );
}

export default UserLayout;
