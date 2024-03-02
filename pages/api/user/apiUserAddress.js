import useAxios from '@/hooks/useAxios';

const apiUserAddress = {
    GetUserAddress: async () => {
        const axios = useAxios();
        try {
            const res = await axios.get('/UserAddresses/GetUserAddresses');
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
    GetUserAddressDefault: async () => {
        const axios = useAxios();
        try {
            const res = await axios.get('/UserAddresses/GetUserAddressDefault');
            // Check response from api
            if (res && res.status === 200) {
                return res.data;
            } else if (res && res.status === 404) {
                return res.data;
            } else {
                console.log('Error');
            }
        } catch (error) {
            // Handle the error
            return error.response;
        }
    },
    SetDefaultAddress: async (userAddressId) => {
        const axios = useAxios();
        try {
            const data = { userAddressId };
            const res = await axios.post('/UserAddresses/SetDefault', data);
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
    Create: async (fullName, phone, address) => {
        const axios = useAxios();
        try {
            const data = { fullName, phone, address };
            const res = await axios.post('/UserAddresses/Create', data);
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
    CreateUserAddress: async (fullName, phone, cityCode, city, districtCode, district, wardCode, ward, street) => {
        const axios = useAxios();
        try {
            const data = { fullName, phone, cityCode, city, districtCode, district, wardCode, ward, street };
            const res = await axios.post('/UserAddresses/Create', data);
            // Check response from api
            if (res && res.status) {
                return res.data;
            } else {
                console.log('Error');
            }
        } catch (error) {
            // Handle the error
            return error.response;
        }
    },

    UpdateUserAddress: async (
        userAddressId,
        fullName,
        phone,
        cityCode,
        city,
        districtCode,
        district,
        wardCode,
        ward,
        street,
    ) => {
        const axios = useAxios();
        try {
            const data = {
                userAddressId,
                fullName,
                phone,
                cityCode,
                city,
                districtCode,
                district,
                wardCode,
                ward,
                street,
            };
            const res = await axios.put('/UserAddresses/Update/' + userAddressId, data);
            // Check response from api
            if (res && res.status === 200) {
                return res.data;
            } else {
                console.log('Error');
            }
        } catch (error) {
            // Handle the error
            return error.response;
        }
    },

    Update: async (userAddressId, fullName, phone, address) => {
        const axios = useAxios();
        try {
            const data = { userAddressId, fullName, phone, address };
            const res = await axios.put('/UserAddresses/Update/' + userAddressId, data);
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
    Delete: async (userAddressId) => {
        const axios = useAxios();
        try {
            const res = await axios.delete('/UserAddresses/Delete/' + userAddressId);
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

export default apiUserAddress;
