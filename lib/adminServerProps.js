import jwt from 'jsonwebtoken';

export default async function getServerSideProps(context) {
    // Get cookie in the context
    const cookies = context.req.headers.cookie;
    if (cookies) {
        // Filter cookies to get access token
        const parseCookies = (cookie) =>
            cookie.split('; ').reduce((acc, cookie) => {
                const [key, value] = cookie.split('=');
                acc[key] = value;
                return acc;
            }, {});
        const cookiesObj = parseCookies(cookies);
        const access_token = cookiesObj['access_token'];
        // Decode token to user info
        const userInfo = jwt.decode(access_token);
        // Check author based role
        if (userInfo && userInfo.role === 'Admin') {
            return {
                props: {},
            };
        } else if (userInfo && userInfo.role === 'Customer') {
            return {
                redirect: {
                    destination: '/', // Redirect to the login page or any other page you prefer
                    permanent: false,
                },
            };
        }
    }
    // If token in not valid redirect to login
    return {
        redirect: {
            destination: '/auth/login', // Redirect to the login page or any other page you prefer
            permanent: false,
        },
    };
}
