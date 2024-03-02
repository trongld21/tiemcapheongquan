import useAxios from '@/hooks/useAxios';

const apiProduct = {
    // Get all product api
    GetAll: async (categoryId, search, sort, pageIndex, pageSize) => {
        const axios = useAxios();
        try {
            const response = await axios.get(
                `/Products/GetAll?categoryId=${categoryId}&search=${search}&sort=${sort}&pageIndex=${pageIndex}&pageSize=${pageSize}`,
            );
            // Check response from api
            if (response.status) {
                return response.data;
            } else {
                console.log('Error');
            }
        } catch (error) {
            // Handle the error
            return error.message;
        }
    },
    GetBySlug: async (slug) => {
        const axios = useAxios();
        try {
            const response = await axios.get(`/Products/GetBySlug/${slug}`);
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
    GetFeaturedProducts: async () => {
        const axios = useAxios();
        try {
            const response = await axios.get('/Products/FeaturedProducts');
            if (response.status) {
                return response.data;
            }
        } catch (error) {
            return error;
        }
    },
    GetRelatedProducts: async (slug) => {
        const axios = useAxios();
        try {
            const response = await axios.get(`/Products/RelatedProducts/${slug}`);
            if (response.status) {
                return response.data;
            }
        } catch (error) {
            return error;
        }
    },
};

export default apiProduct;
