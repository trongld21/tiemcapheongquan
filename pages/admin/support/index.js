import AdminTitle from '@/components/Admin/AdminTitle';
import AdminLayout from '@/components/Layout/AdminLayout';
import getServerSideProps from '@/lib/adminServerProps';
function Support() {
    return (
        <AdminLayout>
            <AdminTitle content="Support Message" />
        </AdminLayout>
    );
}
export default Support;

export { getServerSideProps };
