import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
// Custom component
import AdminTitle from '@/components/Admin/AdminTitle';
import AdminLayout from '@/components/Layout/AdminLayout';
import BackButton from '@/components/Utils/BackButton';
import PrimaryButton from '@/components/Utils/PrimaryButton';
// Ant design component
import { Card } from 'antd';
// Tailwind component
import { CardBody } from '@material-tailwind/react';
// api
import apiArticle from '@/pages/api/apiArticle';
import getServerSideProps from '@/lib/adminServerProps';
const QuillNoSSRWrapper = dynamic(import('react-quill'), {
    ssr: false,
    loading: () => <p>Loading ...</p>,
});

function DetailArticle() {
    const router = useRouter();
    const { id } = router.query;
    console.log('🚀 ~ file: [id].js:24 ~ DetailArticle ~ id:', id);
    const [data, setData] = useState({});

    //Fetch data from database
    useEffect(() => {
        if (id) {
            getData(id);
        }
    }, [id]);

    // Get data by id
    const getData = async (id) => {
        try {
            const res = await apiArticle.GetArticleById(id);
            if (res && res.success) {
                setData(res.data);
            }
        } catch (error) {
            console.error('Fetch Data Fail');
        }
    };

    return (
        <AdminLayout>
            <AdminTitle content="Xem bài viết" />
            <Card>
                <div className="align-items-center flex justify-between">
                    <div className="text-right" xs="4">
                        <BackButton title={'Trở về danh sách bài viết'} />
                    </div>
                    <PrimaryButton
                        content={'Chỉnh sửa'}
                        classCss={'bg-secondary text-white px-4'}
                        onClick={() => router.push(`/admin/articles/edit/${id}`)}
                    />
                </div>
                <CardBody>
                    <h1 className="text-5xl text-center font-semibold pb-4">{data.title}</h1>
                    <div className="flex justify-center items-center">
                        <img src={data.thumbnail} alt="" />
                    </div>
                    <div>
                        <QuillNoSSRWrapper value={data.content} readOnly={true} theme={'bubble'} />
                    </div>
                </CardBody>
            </Card>
        </AdminLayout>
    );
}

export default DetailArticle;

export { getServerSideProps };
