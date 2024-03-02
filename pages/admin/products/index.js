/* eslint-disable @next/next/no-img-element */
import AdminProductCard from '@/components/Admin/AdminProductCard';
import AdminLayout from '@/components/Layout/AdminLayout';
import AdminTitle from '@/components/Admin/AdminTitle';
import { Select, Space, message } from 'antd';
import { useEffect, useState } from 'react';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import managerProductAPI from '@/pages/api/manager/managerProductAPI';
import Link from 'next/link';
import managerCategoryAPI from '@/pages/api/manager/managerCategoryAPI';
import getServerSideProps from '@/lib/adminServerProps';
import convertToVND from '@/components/Utils/convertToVND';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Modal } from 'antd';
import removeDiacritics from '@/components/Utils/removeDiacritics';
import AdminPagination from '@/components/Utils/AdminPagination';
const { confirm } = Modal;

const Add = 'Thêm sản phẩm';
const Edit = 'Chỉnh sửa sản phẩm';

function Products() {
    const [data, setData] = useState();

    const [showForm, setShowForm] = useState(false);
    const [nameForm, setNameForm] = useState(Add);
    const [productId, setAddressId] = useState('');

    const [dataCategories, setDataCategories] = useState([]);
    const [productFilter, setProductFilter] = useState();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('default');

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const handleShowForm = (fname) => {
        setNameForm(fname);
        setShowForm(true);
    };

    const [messageApi, contextHolder] = message.useMessage();
    const successNotification = () => {
        messageApi.open({
            type: 'success',
            content: 'Xóa sản phẩm thành công',
        });
    };

    // api get data
    const fetchData = async () => {
        try {
            const response = await managerProductAPI.GetAll();
            if (response && response.success) {
                setData(response.data);
                setProductFilter(response.data);
            }
            //call api Category
            const responseCategory = await managerCategoryAPI.GetAll();
            if (responseCategory && responseCategory.success) {
                setDataCategories(responseCategory.data);
            }
        } catch (err) {
            console.log(err.message);
        }
    };

    const handleSelectChange = (event) => {
        setSelectedCategory(event.target.value);
        if (event.target.value !== 'default') {
            setProductFilter(
                data.filter(
                    (product) =>
                        product.categoryId === event.target.value &&
                        product.name.toLowerCase().includes(searchQuery.toLowerCase()),
                ),
            );
        } else {
            setProductFilter(data);
        }
    };
    const handleSearchOnchange = (event) => {
        const searchTerm = removeDiacritics(event.target.value.trim().toLowerCase());
        if (event.target.value !== '') {
            if (selectedCategory !== 'default') {
                setProductFilter(
                    data.filter(
                        (product) =>
                            product.categoryId === selectedCategory &&
                            removeDiacritics(product.name.toLowerCase()).includes(searchTerm),
                    ),
                );
            } else {
                setProductFilter(
                    data.filter((product) => removeDiacritics(product.name.toLowerCase()).includes(searchTerm)),
                );
            }
        } else {
            if (selectedCategory !== 'default') {
                setProductFilter(data.filter((product) => product.categoryId === selectedCategory));
            } else {
                setProductFilter(data);
            }
        }
        setSearchQuery(event.target.value);
    };
    //Pagination
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const itemsToShow = productFilter?.slice(startIndex, endIndex);

    const handleDeleteProduct = async (id) => {
        try {
            confirm({
                title: 'Bạn có muốn xóa sản phẩm này?',
                icon: <ExclamationCircleFilled />,
                content: 'Dữ liệu đã xóa không thể phục hồi',
                okType: 'danger',
                okText: 'Xóa',
                cancelText: 'Quay lại',
                async onOk() {
                    // callback function
                    const deleteResult = await managerProductAPI.Delete(id);
                    if (deleteResult.success) {
                        fetchData();
                        successNotification();
                    }
                },
                onCancel() {
                    console.log('Cancel');
                },
            });
            // Gọi đến phương thức Delete của managerProductAPI để xóa sản phẩm
        } catch (error) {
            // Xử lý lỗi nếu có
            console.log(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
            {contextHolder}
            <AdminLayout>
                <AdminTitle content="Danh sách sản phẩm" />
                <div className="flex flex-col gap-10">
                    <section className="flex justify-between text-sm items-center">
                        <div className="w-8/12 border-b relative  h-fit">
                            <input
                                placeholder="Tìm kiếm sản phẩm"
                                onChange={handleSearchOnchange}
                                className="outline-none p-2 w-full rounded-lg"
                            />
                        </div>

                        <Link
                            href="/admin/products/create"
                            className="p-2 flex gap-1 border-dashed border-2 font-bold justify-center items-center text-grey rounded-md"
                        >
                            <div className="w-4 h-4 bg-black flex justify-center items-center rounded-full">
                                <img src="/assets/svg/plus.svg" alt="icon" />
                            </div>
                            <p>Thêm sản phẩm</p>
                        </Link>
                    </section>
                    <section className="flex justify-between">
                        <div className="flex gap-6">
                            <p className="text-base my-auto font-semibold text-[#00000080]">Danh mục:</p>
                            <Space wrap>
                                <select
                                    className="border border-gray-300 px-3 py-2 rounded-lg max-w-xl min-w-[5rem]"
                                    id="categoryId"
                                    name="categoryId"
                                    required
                                    onChange={handleSelectChange}
                                >
                                    <option value="default">Tất cả</option>
                                    {dataCategories &&
                                        dataCategories?.map((item) => {
                                            return (
                                                <option key={item.name} value={item.categoryId}>
                                                    {item.name}
                                                </option>
                                            );
                                        })}
                                </select>
                            </Space>
                        </div>

                        <p className="text-sm text-secondary">{productFilter?.length} sản phẩm</p>
                    </section>

                    <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {itemsToShow &&
                            itemsToShow?.map((item) => (
                                <AdminProductCard
                                    key={item.productId}
                                    thumbnails={item.productImages[0]}
                                    name={item.name}
                                    quantity={item.quantity}
                                    id={item.productId}
                                    description={item.description}
                                    price={convertToVND(item.price)}
                                    category={item.categoryName}
                                    onDelete={() => handleDeleteProduct(item.productId)}
                                    slug={item.slug}
                                />
                            ))}
                    </section>
                    <AdminPagination
                        currentPage={currentPage}
                        itemsPerPage={itemsPerPage}
                        totalItems={productFilter?.length}
                        onPageChange={handlePageChange}
                    ></AdminPagination>
                </div>
            </AdminLayout>
        </>
    );
}

export default Products;

export { getServerSideProps };
