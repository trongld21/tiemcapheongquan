import UserLayout from '@/components/Layout/UserLayout';
import Card from '@/components/Product/Card';
import CustomPagination from '@/components/Utils/Pagination';
import CustomSort from '@/components/Utils/Sort';
import Thumbnail from '@/components/Utils/Thumbnail';
import { sortOptionProduct } from '@/constant';
import { UserContext } from '@/contexts/userContext';
import { useContext, useEffect, useState } from 'react';
import apiCategory from '../api/apiCategory';
import apiProduct from '../api/apiProduct';
import { useRouter } from 'next/router';
import { Empty } from 'antd';
import Spinner from '@/components/Utils/Spinner';
import GetToken from '@/components/Utils/GetToken';
function ProductList() {
    const { isLogged, search } = useContext(UserContext);
    const router = useRouter();
    const [sort, setSort] = useState(sortOptionProduct[0].value);
    const [categoryOptions, setCategoryOptions] = useState();
    const [sortCategory, setSortCategory] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [dataProduct, setDataProduct] = useState([]);
    const reviewPerPage = 12;

    const fetchData = async () => {
        try {
            // Check lug is valid
            const res = await apiProduct.GetAll(sortCategory, search, sort, currentPage, reviewPerPage);
            if (res && res.success) {
                setDataProduct(res?.data);
            } else {
                console.log(res);
            }
        } catch (error) {
            console.log('🚀 ~ file: [productSlug].js:491 ~ fetchProductData ~ error:', error);
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sortCategory, sort, currentPage, search]);

    useEffect(() => {
        const fetchCategory = async () => {
            const res = await apiCategory.GetAllCategory();
            if (res && res.success) {
                let covertListOption = [
                    {
                        value: '',
                        label: 'Tất cả',
                    },
                ];
                res.data.forEach((item) => {
                    covertListOption.push({
                        value: item.categoryId,
                        label: item.name,
                    });
                });
                setCategoryOptions(covertListOption);
                setSortCategory(covertListOption[0].value);
            }
        };
        fetchCategory();
    }, []);

    return (
        <UserLayout className="flex flex-col gap-10">
            <Thumbnail title={'Sản phẩm'} />
            <div className="w-10/12 max-sm:my-6 my-10 mx-auto flex flex-col gap-10">
                <section className="flex justify-between w-full">
                    <div className="flex gap-2 lg:gap-10 w-full lg:flex-row flex-col">
                        <div className="flex gap-4 items-center w-full lg:w-4/12">
                            <h3 className="font-semibold max-sm:text-xs max-sm:w-1/5">Danh mục: </h3>
                            <div className="max-sm:w-2/4 w-6/12">
                                {categoryOptions && (
                                    <CustomSort
                                        sort={sortCategory}
                                        setSort={setSortCategory}
                                        sortOption={categoryOptions || []}
                                        isCategory={true}
                                    />
                                )}
                            </div>
                        </div>
                        <div className="flex gap-4 items-center w-full lg:w-4/12">
                            <h3 className="font-semibold max-sm:text-xs max-sm:w-1/5">Sắp xếp: </h3>
                            <div className="max-sm:w-2/4 w-6/12">
                                <CustomSort sort={sort} setSort={setSort} sortOption={sortOptionProduct} />
                            </div>
                        </div>
                    </div>
                </section>
                {dataProduct?.products?.length > 0 ? (
                    <section className="grid lg:grid-cols-4 grid-cols-3 max-sm:grid-cols-2 max-sm:gap-5 gap-6 lg:gap-10">
                        <Card dataCard={dataProduct.products} isLogged={isLogged} />
                    </section>
                ) : (
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={'Sản phẩm hiện chưa có'}
                        className="w-full mx-auto"
                    />
                )}
                <CustomPagination
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    totalPages={Number(dataProduct?.totalPages)}
                />
            </div>
        </UserLayout>
    );
}
export default ProductList;

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
