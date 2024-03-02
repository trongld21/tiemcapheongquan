import { Select } from 'antd';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

function CustomSort({ sort, setSort, sortOption, isCategory = false }) {
    const router = useRouter();
    // handle sort
    const handleSortChange = (sortValue) => {
        const { page, ...currentQuery } = router.query;
        setSort(sortValue);
        /// Change url based on sort value
        if (isCategory) {
            router.push(
                {
                    pathname: router.pathname,
                    query: { ...currentQuery, categoryId: sortValue },
                },
                undefined,
                { shallow: true },
            );
        } else {
            router.push(
                {
                    pathname: router.pathname,
                    query: { ...currentQuery, sort: sortValue },
                },
                undefined,
                { shallow: true },
            );
        }
    };

    // check sort when change url
    useEffect(() => {
        try {
            if (isCategory) {
                const { categoryId } = router.query;
                if (sortOption.some((option) => option.value === categoryId)) {
                    setSort(categoryId);
                } else {
                    setSort(sortOption[0].value);
                }
            } else {
                const { sort } = router.query;

                if (sortOption.some((option) => option.value === sort)) {
                    setSort(sort);
                } else {
                    setSort(sortOption[0].value);
                }
            }
        } catch (error) {
            console.log('🚀 ~ file: [productSlug].js:57 ~ useEffect ~ error:', error);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router]);

    return (
        <Select
            style={{ width: '100%' }}
            value={sort}
            defaultValue={sortOption[0]?.value}
            options={sortOption}
            onChange={handleSortChange}
        />
    );
}

export default CustomSort;
