import { firestore } from '@/firebase';
import useAxios from '@/hooks/useAxios';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';

const apiArticles = {
    GetAll: async () => {
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
    GetBySlug: async (id) => {
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
                return null;
            }
        } catch (error) {
            console.error(error);
            return null;
        }
    },
};

export default apiArticles;
