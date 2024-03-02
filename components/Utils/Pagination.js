import { Pagination } from 'antd';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

function CustomPagination({ currentPage, setCurrentPage, totalPages }) {
    const router = useRouter();
    const elementPerPage = 10;

    const handlePageChange = (page) => {
        setCurrentPage(page);
        /// Change url based pagination
        router.push(
            {
                pathname: router.pathname,
                query: { ...router.query, page },
            },
            undefined,
            { shallow: true },
        );
    };

    // Get current page in url
    useEffect(() => {
        try {
            const { page } = router.query;
            // Validate page number is valid
            if (page && page > totalPages) {
                setCurrentPage(totalPages);
            } else if (page && page < 1) {
                setCurrentPage(1);
            } else {
                setCurrentPage(Number(page) || 1);
            }
        } catch (error) {
            console.log('🚀 ~ file: [productSlug].js:57 ~ useEffect ~ error:', error);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router]);

    return (
        <Pagination
            current={currentPage}
            onChange={handlePageChange}
            hideOnSinglePage
            total={totalPages * elementPerPage}
        />
    );
}

export default CustomPagination;
