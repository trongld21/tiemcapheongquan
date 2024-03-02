import { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';

export default function Document() {
    return (
        <Html lang="en">
            <Head />
            <div className="container">
                <Script src="https://www.googletagmanager.com/gtag/js?id=G-FRETMJ5J1F" />
                <Script id="google-analytics">
                    {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
 
          gtag('config', 'G-FRETMJ5J1F');
        `}
                </Script>
            </div>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
