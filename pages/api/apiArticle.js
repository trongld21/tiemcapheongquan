import useAxios from '@/hooks/useAxios';

const apiArticle = {
    // Get all article api
    GetAllArticle: async () => {
        const axios = useAxios();
        try {
            const url = '/Articles/GetAll';
            const res = await axios.get(url);
            // Check response from api
            if (res.status) {
                return res.data;
            } else {
                console.log('Error');
            }
        } catch (error) {
            // Handle the error
            return error.message;
        }
    },
    // Get all article api for admin role
    GetAllArticleAdmin: async () => {
        const axios = useAxios();
        try {
            const url = '/ManagementArticles/GetAll';
            const res = await axios.get(url);
            // Check response from api
            if (res.status) {
                return res.data;
            } else {
                console.log('Error');
            }
        } catch (error) {
            // Handle the error
            return error.message;
        }
    },
    // Get all article api for admin role
    GetArticleById: async (id) => {
        const axios = useAxios();
        try {
            const url = `/ManagementArticles/GetById/${id}`;
            const res = await axios.get(url);
            // Check response from api
            if (res.status && res.status === 200) {
                return res.data;
            } else {
                console.log('Error');
            }
        } catch (error) {
            // Handle the error
            return error.message;
        }
    },
    // Delete article by id
    DeleteArticleById: async (id) => {
        const axios = useAxios();
        try {
            const url = `/ManagementArticles/Delete/${id}`;
            const res = await axios.delete(url);
            // Check response from api
            if (res.status === 200) {
                return res.data;
            } else {
                return false;
            }
        } catch (error) {
            // Handle the error
            return error.message;
        }
    },
    // Public article
    SetPublicArticle: async (articleId, published) => {
        const axios = useAxios();
        try {
            const url = '/ManagementArticles/SetPublish';
            const data = { articleId, published };
            const res = await axios.post(url, data);
            // Check response from api
            if (res.status === 200) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            // Handle the error
            return error.message;
        }
    },
    // Public article
    CreateArticle: async (title, content, thumbnail) => {
        const axios = useAxios();
        try {
            const url = '/ManagementArticles/Create';
            const data = { title, content, thumbnail };
            const res = await axios.post(url, data);
            if (res.status) {
                return res.data;
            } else {
                return false;
            }
        } catch (error) {
            // Handle the error
            return error.message;
        }
    },
    // Public article
    UpdateArticle: async (articleId, title, content, thumbnail) => {
        const axios = useAxios();
        try {
            const url = `/ManagementArticles/Update/${articleId}`;
            const data = { articleId, title, content, thumbnail };
            const res = await axios.put(url, data);
            if (res.status) {
                return res.data;
            } else {
                return false;
            }
        } catch (error) {
            // Handle the error
            return error.message;
        }
    },
};

export default apiArticle;
