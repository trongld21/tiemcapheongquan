import { firestore } from '@/firebase';
import useAxios from '@/hooks/useAxios';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

const apiArticle = {
    // Get all article api
    GetAllArticle: async () => {
        try {
            const querySnapshot = await getDocs(
                collection(firestore, "blogs")
            );
            const blogList = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            console.log(blogList);
            return blogList;
        } catch (error) {
            return [];
            console.log(error)
        }
    },
    // Get all article api for admin role
    GetAllArticleAdmin: async () => {
        try {
            const querySnapshot = await getDocs(
                collection(firestore, "blogs")
            );
            const blogList = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            // console.log(blogList);
            return blogList;
        } catch (error) {
            console.log(error);
            return [];
        }
    },
    // Get all article api for admin role
    GetArticleById: async (id) => {
        try {
            const blog = await getDoc(
                doc(firestore, "blogs", id)
            );

            if (blog.exists()) {
                const articleData = {
                    id: blog.id,
                    ...blog.data(),
                };
                console.log(articleData);
                return articleData;
            } else {
                return null; // Document with the specified ID does not exist
            }
        } catch (error) {
            console.error(error);
            return null; // Handle the error appropriately
        }
    },
    // Delete article by id
    DeleteArticleById: async (id) => {
        try {
            const blogDoc = doc(firestore, 'blogs', id);
            await deleteDoc(blogDoc);
            console.log(`Document with ID ${id} deleted successfully`);
            return true;
        } catch (error) {
            console.error(`Error deleting document with ID ${id}:`, error);
            return false;
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
        try {
            const blogCollection = collection(firestore, 'blogs');
            await addDoc(blogCollection, {
                title: title,
                content: content,
                thumbnail: thumbnail,
                createdAt: new Date().toDateString(),
                updatedAt: new Date().toDateString(),
            });
            return true;
        } catch (error) {
            return false;
        }
    },
    // Public article
    UpdateArticle: async (articleId, title, content, thumbnail) => {
        try {

            const blogDoc = doc(firestore, 'blogs', articleId);
            // Check if the article exists
            const articleDocSnapshot = await getDoc(blogDoc);

            if (!articleDocSnapshot.exists()) {
                // Return false if the article doesn't exist
                console.log("apiArtical.js 119 error");
                return false;
            }

            // Update the article document
            await updateDoc(blogDoc, {
                title: title,
                content: content,
                thumbnail: thumbnail,
                updatedAt: new Date().toDateString(),
            });

            return true;
        } catch (error) {
            // Return false if an error occurs during the update
            console.error('Error updating article:', error);
            return false;
        }
    },
};

export default apiArticle;
