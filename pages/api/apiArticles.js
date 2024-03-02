import useAxios from '@/hooks/useAxios';

const apiArticles = {
    GetAll: async (sort, pageIndex = 1, pageSize = 20) => {
        const axios = useAxios();
        try {
            const response = await axios.get(
                `/Articles/GetAll?sort=${sort}&pageIndex=${pageIndex}&pageSize=${pageSize}`,
            );
            if (response) {
                return response.data;
            } else {
                console.log('Error');
            }
        } catch (error) {
            return error.response;
        }
    },
    GetBySlug: async (slug) => {
        const axios = useAxios();
        try {
            const response = await axios.get(`/Articles/GetBySlug/${slug}`);
            if (response) {
                return response.data;
            }
        } catch (error) {
            return error;
        }
    },
};

export default apiArticles;
