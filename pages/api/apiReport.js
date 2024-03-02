import useAxios from '@/hooks/useAxios';
const apiReport = {
    ReportProduct: async (productReportedId, reason) => {
        const axios = useAxios();
        const data = { productReportedId, reason };
        try {
            const response = await axios.post('/ProductReports/MakeProductReport', data);
            if (response) {
                return response.data;
            }
        } catch (error) {
            return error;
        }
    },
    ReportProductReview: async (productReviewReportedId, reason) => {
        const axios = useAxios();
        try {
            const data = { productReviewReportedId, reason };
            const response = await axios.post('ReportProductReviews/MakeReport', data);
            // console.log(reason);
            return response.data;
        } catch (error) {
            console.log(error);
        }
    },
};
export default apiReport;
