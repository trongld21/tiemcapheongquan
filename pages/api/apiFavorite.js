import useAxios from '@/hooks/useAxios';
const apiFavorite = {
    GetFavoriteOfUser: async (pageIndex, pageSize) => {
        const axios = useAxios();
        try {
            const response = await axios.get(
                `/Favorites/GetFavoriteOfUser?pageIndex=${pageIndex}&pageSize=${pageSize}`,
            );
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

    SetProductFavorite: async (productId) => {
        const axios = useAxios();
        try {
            const data = { productId }; // Truyền productId vào đối tượng data
            const response = await axios.post('/Favorites/SetFavorite', data);
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
export default apiFavorite;
