import useAxios from '@/hooks/useAxios';

const apiInteraction = {
    GetInteractionOfUser: async () => {
        const axios = useAxios();
        try {
            const response = await axios.get('/ProductReviewInteractions/GetInteractionOfUser');
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
    UpdateUserReviewInteractions: async (productReviewId, interaction) => {
        const axios = useAxios();
        try {
            const data = { productReviewId, interaction };
            const response = await axios.post('/ProductReviewInteractions/Interaction', data);
            console.log('🚀 ~ file: apiInteraction.js:24 ~ UpdateUserReviewInteractions: ~ response:', response);
            if (response && response.status) {
                return response.data;
            } else {
                console.log('Error');
            }
        } catch (error) {
            // Xử lý lỗi nếu có
            console.log('Error:', error);
        }
    },
};
export default apiInteraction;
