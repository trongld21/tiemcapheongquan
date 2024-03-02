import { useEffect, useState } from 'react';
import Link from 'next/link';
// Component
import AdminTitle from '@/components/Admin/AdminTitle';
import ArticleItem from '@/components/Article/ArticleItem';
import AdminLayout from '@/components/Layout/AdminLayout';
// api
import apiArticle from '@/pages/api/apiArticle';
// ant design component
import { Select, Space } from 'antd';
// Custom hok
import useNotification from '@/hooks/useNotification';
import getServerSideProps from '@/lib/adminServerProps';
import removeDiacritics from '@/components/Utils/removeDiacritics';
import AdminPagination from '@/components/Utils/AdminPagination';

function Articles() {
    const [data, setData] = useState([]);
    const { showError, showSuccess } = useNotification();
    const [dataSearch, setSearchArticle] = useState();
    const [searchValue, setSearchValue] = useState('');
    //Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const itemsToShow = dataSearch?.slice(startIndex, endIndex);
    //search
    const handleSearchOnchange = (event) => {
        const searchTerm = removeDiacritics(event.target.value.trim().toLowerCase());
        setSearchValue(event.target.value);

        if (searchTerm !== '') {
            const filtered = data.filter(
                (article) =>
                    removeDiacritics(article.title?.toLowerCase() || '').includes(searchTerm) ||
                    removeDiacritics(article.content?.toLowerCase() || '').includes(searchTerm) ||
                    removeDiacritics(article.userName?.toLowerCase() || '').includes(searchTerm),
            );
            setSearchArticle(filtered);
        } else {
            setSearchArticle(data);
        }
    };

    // Function to handle delete article
    const handleDeleteArticle = async (id) => {
        const res = await apiArticle.DeleteArticleById(id);
        if (res.success) {
            fetchData();
            showSuccess('Xóa thành công', `Xóa bài viết ${id} thành công`, 2);
        } else {
            showError('Xóa lỗi', 'Một số lỗi khi xóa mục này, Vui lòng thử lại', 2);
        }
    };

    // Function to fetch initial data
    const fetchData = async () => {
        try {
            const res = await apiArticle.GetAllArticleAdmin();
            if (res && res.success) {
                setData(res.data);
                setSearchArticle(res.data);
            }
        } catch (error) {
            console.error('Fetch Data Fail');
        }
    };
    // Fetch data every component mount
    useEffect(() => {
        fetchData();
    }, []);
    return (
        <AdminLayout>
            <AdminTitle content="Danh sách bài viết" />
            <div className="flex flex-col gap-10">
                <section className="flex justify-between text-sm items-center">
                    <div className="w-8/12 relative border-b h-fit">
                        <input
                            placeholder="Tìm kiếm"
                            className="outline-none p-2 w-full rounded-lg"
                            value={searchValue}
                            onChange={handleSearchOnchange}
                        />
                    </div>
                    <Link
                        href="/admin/articles/create"
                        className="p-2 flex gap-1 border-dashed border-2 font-bold justify-center items-center text-grey rounded-md"
                    >
                        <div className="w-4 h-4 bg-black flex justify-center items-center rounded-full">
                            <img src="/assets/svg/plus.svg" alt="icon" />
                        </div>
                        <p>Tạo bài viết</p>
                    </Link>
                </section>

                <section className="grid grid-cols-1 gap-10 items-start">
                    {itemsToShow &&
                        itemsToShow.map((item) => {
                            return (
                                <ArticleItem
                                    key={item.articleId}
                                    urlThumbnail={item.thumbnail}
                                    title={item.title}
                                    slug={item.articleId}
                                    author={item.userName}
                                    description={item.content}
                                    createdDate={item.createdAt}
                                    published={item.isPublish}
                                    id={item.articleId}
                                    onDelete={(itemId) => handleDeleteArticle(itemId)}
                                />
                            );
                        })}
                </section>
                <AdminPagination
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    totalItems={dataSearch?.length}
                    onPageChange={handlePageChange}
                ></AdminPagination>
            </div>
        </AdminLayout>
    );
}

export default Articles;

export { getServerSideProps };
