import useAxios from '@/hooks/useAxios';

const managerCouponAPI = {
    GetAll: async () => {
        const axios = useAxios();
        try {
            const url = '/ManagementCoupons/GetAll';
            const res = await axios.get(url);
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
    Create: async (data) => {
        const axios = useAxios();
        try {
            const url = '/ManagementCoupons/Create';
            const res = await axios.post(url, data);
            // Check response from api
            if (res.status) {
                return res.data;
            } else {
                console.log(res);
            }
        } catch (error) {
            // Handle the error
            return error.response;
        }
    },
    Update: async (couponId, data) => {
        const axios = useAxios();
        try {
            const url = '/ManagementCoupons/Update/' + couponId;
            const res = await axios.put(url, data);
            // Check response from api
            if (res.status) {
                return res.data;
            } else {
                console.log(res);
            }
        } catch (error) {
            // Handle the error
            return error.response;
        }
    },
    Delete: async (couponId) => {
        console.log(couponId);
        const axios = useAxios();
        try {
            const res = await axios.delete(`/ManagementCoupons/Delete/${couponId}`);
            console.log(res);
            if (res.status) {
                return res.data;
            } else {
                return;
            }
        } catch (error) {
            return error;
        }
    },
};

export default managerCouponAPI;
