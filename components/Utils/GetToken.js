import jwt from 'jsonwebtoken';

function GetToken(cookies) {
    try {
        if (cookies) {
            const parseCookies = (cookie) =>
                cookie.split('; ').reduce((acc, cookie) => {
                    const [key, value] = cookie.split('=');
                    acc[key] = value;
                    return acc;
                }, {});
            const cookiesObj = parseCookies(cookies);
            const access_token = cookiesObj['access_token'];
            const userInfo = jwt.decode(access_token);
            return userInfo;
        } else {
            return null;
        }
    } catch (error) {
        console.log(error);
        return null;
    }
}

export default GetToken;
