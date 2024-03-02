import useAxios from '@/hooks/useAxios';

const apiCoupon = {
    GetByCode: async (code) => {
        const axios = useAxios();
        try {
            const res = await axios.get('/Coupons/GetByCode/' + code);
            // Check response from api
            if (res.status) {
                return res.data;
            } else {
                console.log('Error');
            }
        } catch (error) {
            // Handle the error
            return error.response;
        }
    },
};

export default apiCoupon;
