import useAxios from '@/hooks/useAxios';

const managerReportAPI = {
    GetAllProductReport: async () => {
        const axios = useAxios();
        try {
            const url = '/ManagementProductReports/GetAll';
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
    UpdateProductReport: async (productReportId, reportStatus) => {
        const axios = useAxios();
        try {
            const data = { productReportId, reportStatus };
            const url = '/ManagementProductReports/UpdateStatusReport/' + productReportId;
            const res = await axios.put(url, data);
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
    GetAllReportProductReview: async () => {
        const axios = useAxios();
        try {
            const url = '/ManagementReportProductReviews/GetAll';
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
    UpdateReportProductReview: async (reportProductReviewId, reportStatus) => {
        const axios = useAxios();
        try {
            const data = { reportProductReviewId, reportStatus };
            const url = '/ManagementReportProductReviews/UpdateStatusReport/' + reportProductReviewId;
            const res = await axios.put(url, data);
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

export default managerReportAPI;
