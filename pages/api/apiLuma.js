import axios from 'axios';

const apiLuma = {
    // Create new capture
    CreateCapture: async () => {
        try {
            const res = await axios({
                method: 'POST',
                url: process.env.NEXT_PUBLIC_LUMA_URL,
                headers: {
                    Authorization: `luma-api-key=${process.env.NEXT_PUBLIC_LUMA_API_KEY}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                data: {
                    title: 'TKDecor Model',
                },
            });
            // Check response from api
            console.log('🚀 ~ file: apiLuma.js:20 ~ CreateCapture: ~ res:', res);
            if (res.status === 200) {
                return res.data;
            }
            return res;
        } catch (error) {
            // Handle the error
            return error;
        }
    },
    // Upload video to capture
    UploadCapture: async (arrayBuf, url) => {
        try {
            const res = await axios({
                method: 'PUT',
                url: url,
                headers: { 'Content-Type': 'text/plain' },
                data: arrayBuf,
            });
            if (res.status === 200) {
                return true;
            }
            // Check response from api
            return res;
        } catch (error) {
            // Handle the error
            return error;
        }
    },
    // Trigger capture
    TriggerCapture: async (url) => {
        try {
            const res = await axios({
                method: 'POST',
                url: `${process.env.NEXT_PUBLIC_LUMA_URL}/${url}`,
                headers: { Authorization: `luma-api-key=${process.env.NEXT_PUBLIC_LUMA_API_KEY}` },
            });
            // Check response from api
            return res;
        } catch (error) {
            console.log('🚀 ~ file: apiLuma.js:62 ~ TriggerCapture: ~ error:', error);
            // Handle the error
            return error;
        }
    },
    // Update the capture
    UpdateCapture: async (url) => {
        try {
            const res = await axios({
                method: 'PUT',
                url: `${process.env.NEXT_PUBLIC_LUMA_URL}/${url}`,
                headers: {
                    Authorization: `luma-api-key=${process.env.NEXT_PUBLIC_LUMA_API_KEY}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                data: {
                    title: 'TKDecor',
                    privacy: 'private',
                    location: {
                        latitude: 0,
                        longitude: 0,
                        name: 'From TKDecor',
                        isVisible: false,
                    },
                },
            });
            // Check response from api
            return res;
        } catch (error) {
            // Handle the error
            return error;
        }
    },
    // Update the capture
    CheckStatus: async (url) => {
        try {
            const res = await axios({
                method: 'GET',
                url: `${process.env.NEXT_PUBLIC_LUMA_URL}/${url}`,
                headers: { Authorization: `luma-api-key=${process.env.NEXT_PUBLIC_LUMA_API_KEY}` },
            });
            return res.data;
        } catch (error) {
            // Handle the error
            return error;
        }
    },
};

export default apiLuma;
