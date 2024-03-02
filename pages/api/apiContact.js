import useAxios from '@/hooks/useAxios';

const apiContact = {
    GetComment: async (name, mailSender, content) => {
        const axios = useAxios();
        try {
            const data = { name, mailSender, content };
            const res = await axios.post('/Mails/GetComment', data);
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

export default apiContact;
