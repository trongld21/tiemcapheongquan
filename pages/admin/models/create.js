import AdminLayout from '@/components/Layout/AdminLayout';
import VideoPreview from '@/components/Utils/VideoPreview';
import getServerSideProps from '@/lib/adminServerProps';

function create() {
    return (
        <AdminLayout>
            <VideoPreview />
        </AdminLayout>
    );
}

export default create;
export { getServerSideProps };
