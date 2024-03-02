import NewsLayout from '@/components/Layout/NewsLayout';
import UserLayout from '@/components/Layout/UserLayout';
import NewsCard from '@/components/News/NewsCard';
import { formateDateTime } from '@/components/Utils/FormatDate';
import CustomPagination from '@/components/Utils/Pagination';
import CustomSort from '@/components/Utils/Sort';
import Thumbnail from '@/components/Utils/Thumbnail';
import { sortArticleOptions } from '@/constant';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import apiArticle from '../api/apiArticles';
import GetToken from '@/components/Utils/GetToken';
import { Empty } from 'antd';

function News() {
    const router = useRouter();
    const [sort, setSort] = useState(sortArticleOptions[0].value);

    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [sortValue, setSortValue] = useState('default');
    const [dataAllArticle, setDataAllArticle] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const reviewPerPage = 12;

    const handleSortChange = (value) => {
        setSortValue(value);
    };

    const handlePageChange = (page) => {
        setPageIndex(page);
    };

    const fetchData = async () => {
        try {
            const res = await apiArticle.GetAll(sort, currentPage, reviewPerPage);
            if (res && res?.success) {
                setDataAllArticle(res?.data);
            }
        } catch (error) {
            console.log('🚀 ~ file: [productSlug].js:491 ~ fetchArticle ~ error:', error);
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sort, currentPage]);

    return (
        <UserLayout>
            <Thumbnail title={'Tin tức'} />
            <NewsLayout>
                {dataAllArticle?.articles?.length != 0 ? (
                    <div className="flex flex-col gap-8 lg:gap-16">
                        <section className="flex gap-6 lg:gap-11 items-center">
                            <p className="text-base my-auto font-semibold text-[#00000080]">Sắp xếp:</p>
                            <div className="w-2/12 max-sm:w-4/12">
                                <CustomSort sort={sort} setSort={setSort} sortOption={sortArticleOptions} />
                            </div>
                        </section>

                        <section className="flex flex-col gap-10">
                            {dataAllArticle &&
                                dataAllArticle?.articles?.map((item) => (
                                    <NewsCard
                                        key={item.articleId}
                                        title={item.title}
                                        imgUrl={item.thumbnail}
                                        date={formateDateTime(item.createdAt).datePart}
                                        actor={item.userName}
                                        description={item.content}
                                        id={item.articleId}
                                        slug={item.slug}
                                    />
                                ))}
                        </section>
                    </div>
                ) : (
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={'Chưa có tin tức'} />
                )}
                <CustomPagination
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    totalPages={Number(dataAllArticle?.totalPages)}
                />
            </NewsLayout>
        </UserLayout>
    );
}

export default News;

export async function getServerSideProps(context) {
    // Get cookie in the context
    const cookies = context.req.headers.cookie;
    if (cookies) {
        const userInfo = GetToken(cookies);
        // Check author based role
        if (userInfo && userInfo.role === 'Customer') {
            return {
                props: {
                    isLogged: true,
                },
            };
        } else if (userInfo && userInfo.role === 'Admin') {
            return {
                redirect: {
                    destination: '/admin', // Redirect to the login page or any other page you prefer
                    permanent: false,
                },
            };
        }
    }
    return {
        props: {
            isLogged: false,
        },
    };
}
