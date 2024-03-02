import AdminSidebar from '../Admin/AdminSidebar';
import AdminHeader from '../Admin/AdminHeader';
import getServerSideProps from '@/lib/adminServerProps';
import { Layout, theme } from 'antd';
import { useState } from 'react';
const { Content } = Layout;

function AdminLayout({ children }) {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    return (
        <Layout className="relative flex">
            <div className="sticky top-0">
                <AdminSidebar collapsed={collapsed} />
            </div>
            <Layout>
                <AdminHeader collapsed={collapsed} setCollapsed={setCollapsed} colorBgContainer={colorBgContainer} />
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: colorBgContainer,
                    }}
                >
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
}

export default AdminLayout;
export { getServerSideProps };
