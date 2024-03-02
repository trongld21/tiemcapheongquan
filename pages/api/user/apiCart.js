import useAxios from '@/hooks/useAxios';

const apiCart = {
    GetAll: async () => {
        const axios = useAxios();
        try {
            const response = await axios.get('/Carts/GetAll');
            // Check response from api
            if (response.status) {
                return response.data;
            } else {
                console.log('Error');
            }
        } catch (error) {
            // Handle the error
            return error.response;
        }
    },
    UpdateQuantity: async (cartId, quantity) => {
        const axios = useAxios();
        try {
            const data = { cartId, quantity };
            const response = await axios.put('/Carts/UpdateQuantity/' + cartId, data);
            // Check response from api
            if (response.status) {
                return response.data;
            } else {
                console.log('Error');
            }
        } catch (error) {
            // Handle the error
            return error.response;
        }
    },
    Delete: async (cartId) => {
        const axios = useAxios();
        try {
            const response = await axios.delete('/Carts/Delete/' + cartId);
            // Check response from api
            if (response.status) {
                return response.data;
            } else {
                console.log('Error');
            }
        } catch (error) {
            // Handle the error
            return error.response;
        }
    },
    AddToCard: async (productId, quantity) => {
        const axios = useAxios();
        try {
            const data = { productId, quantity };
            const response = await axios.post('/Carts/AddProductToCart', data);
            // Check response from api
            if (response.status) {
                return response.data;
            } else {
                console.log('Error');
            }
        } catch (error) {
            // Handle the error
            return error.response;
        }
    },
};
export default apiCart;
