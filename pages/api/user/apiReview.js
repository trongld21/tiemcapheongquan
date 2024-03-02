import useAxios from '@/hooks/useAxios';

const apiReview = {
    SentReview: async (data) => {
        const axios = useAxios();
        try {
            const response = await axios.post('/ProductReviews/Review', data);
            console.log('🚀 ~ file: apiReview.js:8 ~ SentReview: ~ response:', response);
            if (response) {
                return response.data;
            } else {
                console.log(response);
            }
        } catch (error) {
            return error.message;
        }
    },
    GetReviewByProductId: async (id, sort, pageIndex, pageSize) => {
        const axios = useAxios();
        try {
            const response = await axios.get(
                `Products/GetReview/${id}?sort=${sort}&pageIndex=${pageIndex}&pageSize=${pageSize}`,
            );
            if (response) {
                return response.data;
            } else {
                return null;
            }
        } catch (error) {
            return error.message;
        }
    },
};
export default apiReview;
