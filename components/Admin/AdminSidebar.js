import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
    BarChartOutlined,
    PieChartOutlined,
    PercentageOutlined,
    SolutionOutlined,
    ShoppingCartOutlined,
    TeamOutlined,
    ShoppingOutlined,
    ExclamationCircleOutlined,
    CloseCircleOutlined,
    ScanOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import Link from 'next/link';
const { Sider } = Layout;

function AdminSidebar({ collapsed }) {
    const router = useRouter();
    const { push } = useRouter();
    const [active, setActive] = useState(router.asPath.split('/')[2] || '');

    const handleItemClick = (name) => {
        setActive(name);
        push(`/admin/${name}`);
    };

    // Get url when route change
    useEffect(() => {
        const parts = router.asPath.split('/');
        setActive(parts[2]);
    }, [router]);

    return (
        <Sider
            trigger={null}
            collapsible
            collapsed={collapsed}
            style={{ minHeight: '100vh', background: 'white', position: 'sticky', top: 0, left: 0 }}
        >
            <Link href="/">
                <img className="h-20" src="/assets/svg/logo_white.svg" alt="logo" />
            </Link>
            <Menu
                mode="inline"
                defaultSelectedKeys={[active]}
                items={[
                    {
                        key: '',
                        icon: <BarChartOutlined />,
                        label: 'Thống kê',
                        onClick: () => handleItemClick(''),
                    },
                    {
                        key: 'accounts',
                        icon: <TeamOutlined />,
                        label: 'Tài khoản',
                        onClick: () => handleItemClick('accounts'),
                    },
                    {
                        key: 'articles',
                        icon: <SolutionOutlined />,
                        label: 'Bài viết',
                        onClick: () => handleItemClick('articles'),
                    },
                    {
                        key: 'categories',
                        icon: <PieChartOutlined />,
                        label: 'Danh mục',
                        onClick: () => handleItemClick('categories'),
                    },
                    {
                        key: 'products',
                        icon: <ShoppingCartOutlined />,
                        label: 'Sản phẩm',
                        onClick: () => handleItemClick('products'),
                    },
                    {
                        key: 'models',
                        icon: <ScanOutlined />,
                        label: 'Mô hình 3D',
                        onClick: () => handleItemClick('models'),
                    },
                    {
                        key: 'coupons',
                        icon: <PercentageOutlined />,
                        label: 'Mã giảm giá',
                        onClick: () => handleItemClick('coupons'),
                    },
                    {
                        key: 'orders',
                        icon: <ShoppingOutlined />,
                        label: 'Đơn hàng',
                        onClick: () => handleItemClick('orders'),
                    },
                    {
                        key: 'productReports',
                        icon: <ExclamationCircleOutlined />,
                        label: 'Báo cáo sản phẩm',
                        onClick: () => handleItemClick('productReports'),
                    },
                    {
                        key: 'reportProductReviews',
                        icon: <CloseCircleOutlined />,
                        label: 'Báo cáo đánh giá',
                        onClick: () => handleItemClick('reportProductReviews'),
                    },
                ]}
            />
        </Sider>
    );
}

export default AdminSidebar;
