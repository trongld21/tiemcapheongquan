import AdminTitle from '@/components/Admin/AdminTitle';
import AdminLayout from '@/components/Layout/AdminLayout';
import BackButton from '@/components/Utils/BackButton';
import PrimaryButton from '@/components/Utils/PrimaryButton';
import { moduleProductCreate, validateProduct } from '@/constant';
import managerCategoryAPI from '@/pages/api/manager/managerCategoryAPI';
import managerProductAPI from '@/pages/api/manager/managerProductAPI';
import { getDownloadURL, ref, uploadBytes } from '@firebase/storage';
import { InputNumber } from 'antd';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { storage } from '../../../firebase';

import { Select } from 'antd';

// Component validate form
import { ErrorMessage, Field, Form, Formik } from 'formik';
// Component toast message
import ModelListValid from '@/components/Model/ModelListValid';
import ProductUploadImage from '@/components/Product/ProductUploadImage';
import useNotification from '@/hooks/useNotification';
import getServerSideProps from '@/lib/adminServerProps';
import managerModelAPI from '@/pages/api/manager/managerModelAPI';

const QuillNoSSRWrapper = dynamic(import('react-quill'), {
    ssr: false,
    loading: () => <p>Loading ...</p>,
});

const formats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
];

function CreateArticle() {
    const router = useRouter();
    const { showError, showSuccess, showWarning } = useNotification();

    const [dataCategories, setDataCategories] = useState([]);
    const [modelList, setModelList] = useState([]);
    const [modelSelect, setModelSelect] = useState('');
    const [fileList, setFileList] = useState([]);
    const [isDisable, setIsDisable] = useState(false);

    // Handle get data from api
    useEffect(() => {
        const fetchData = async () => {
            //call api Category
            const responseCategory = await managerCategoryAPI.GetAll();
            if (responseCategory && responseCategory.success) {
                setDataCategories(responseCategory.data);
            }
            const responseModelList = await managerModelAPI.GetAll();
            if (responseModelList && responseModelList.success) {
                const modelListValid = responseModelList?.data?.filter((item) => item.productName === null);
                setModelList(modelListValid);
            }
        };
        fetchData();
    }, []);

    const handleCreateProduct = async (values, resetForm) => {
        setIsDisable(true);
        if (values.image.length > 0) {
            const id = uuidv4();
            let arrURL = [];
            try {
                await Promise.all(
                    values.image.map(async (image) => {
                        const imageRef = ref(storage, `products/${id}/${image.originFileObj.name}`);
                        await uploadBytes(imageRef, image.originFileObj, 'data_url');
                        const downloadURL = await getDownloadURL(imageRef);
                        arrURL.push(downloadURL);
                    }),
                );
            } catch (error) {
                // Xử lý lỗi nếu có
                console.log(error);
                setIsDisable(false);
            }

            try {
                const data = {
                    categoryId: values.category,
                    product3DModelId: modelSelect?.product3DModelId || '',
                    name: values.name,
                    description: values.description,
                    quantity: values.quantity,
                    price: values.price,
                    productImages: arrURL,
                };
                console.log('🚀 ~ file: create.js:124 ~ handleCreateProduct ~ data:', data);
                const res = await managerProductAPI.Create(data);
                if (res && res.success) {
                    resetForm();
                    showSuccess('Tạo thành công', 'Tạo thành công sản phẩm mới', 1);
                    router.push('/admin/products');
                    setIsDisable(false);
                } else {
                    showError('Tạo thất bại', 'Có một số lỗi khi tạo sản phẩm mới, hãy thử lại!', 2);
                    setIsDisable(false);
                }
            } catch (error) {
                setIsDisable(false);
                console.error(error); // Xử lý lỗi nếu có
            }
        } else {
            setIsDisable(false);
            showWarning('Phải nhập ảnh', 'Xin cung cấp một số hình ảnh tạo sản phẩm', 3);
        }
    };

    function isQuillEmpty(value) {
        if (value.replace(/<(.|\n)*?>/g, '').trim().length === 0 && !value.includes('<img')) {
            return true;
        }
        return false;
    }

    const renderError = (message) => <p className="text-xs text-error">{message}</p>;

    let categoryOptions = [];
    console.log('🚀 ~ file: create.js:212 ~ CreateArticle ~ categoryOptions:', categoryOptions);

    dataCategories.forEach((item) => {
        categoryOptions.push({
            value: item.categoryId,
            label: item.name,
        });
    });

    return (
        <AdminLayout>
            <AdminTitle content="Tạo sản phẩm mới" />
            <Formik
                initialValues={{
                    name: '',
                    price: '',
                    category: categoryOptions[0]?.value,
                    quantity: '',
                    description: '',
                    image: [],
                }}
                validationSchema={validateProduct}
                onSubmit={async (values, { resetForm }) => {
                    console.log('🚀 ~ file: create.js:236 ~ onSubmit={ ~ values:', values);
                    await handleCreateProduct(values, resetForm);
                }}
            >
                {({ setFieldValue }) => (
                    <Form className="flex flex-col gap-6 w-11/12 mx-auto px-6 py-4 border rounded-10">
                        <div className="flex justify-between">
                            <BackButton title={'Quay lại'} />
                            <PrimaryButton
                                content={'Thêm mới'}
                                classCss={'border px-3 py-2 hover:bg-secondary hover:text-white'}
                                type={'submit'}
                                active={!isDisable}
                            />
                        </div>
                        <div className="flex gap-20 w-full">
                            <div className="flex flex-col w-full gap-4">
                                <section className="flex flex-col gap-1 text-sm">
                                    <label htmlFor="name" className="font-bold text-sm">
                                        Tên sản phẩm
                                    </label>
                                    <Field
                                        name="name"
                                        type="text"
                                        className="input w-full border text-sm border-gray-300 px-3 py-2 rounded-lg"
                                        placeholder="Tên sản phấm"
                                    />
                                    <ErrorMessage name="name" render={renderError} />
                                </section>
                                <div className="w-full flex gap-10">
                                    <section className="field w-4/12">
                                        <label htmlFor="product" className="font-bold text-sm">
                                            Danh mục
                                        </label>
                                        <div className="control">
                                            {categoryOptions && (
                                                <Select
                                                    name="category"
                                                    options={categoryOptions}
                                                    placeholder="Chọn danh mục"
                                                    className="w-full"
                                                    onChange={(values) => setFieldValue('category', values)}
                                                />
                                            )}
                                            <ErrorMessage name="category" render={renderError} />
                                        </div>
                                    </section>
                                    <section className="field w-4/12">
                                        <label htmlFor="product" className="font-bold text-sm">
                                            Giá sản phẩm
                                        </label>
                                        <div className="control">
                                            <div className="flex gap-4 items-center">
                                                <InputNumber
                                                    min={1000}
                                                    className="flex-1"
                                                    step={1000}
                                                    onChange={(values) => setFieldValue('price', values)}
                                                />
                                                <p className="w-fit">VND</p>
                                            </div>
                                            <ErrorMessage name="price" render={renderError} />
                                        </div>
                                    </section>
                                    <section className="field w-4/12">
                                        <label htmlFor="product" className="font-bold text-sm">
                                            Số lượng
                                        </label>
                                        <div className="control">
                                            <div className="flex gap-4 items-center">
                                                <InputNumber
                                                    min={0}
                                                    className="flex-1"
                                                    onChange={(values) => setFieldValue('quantity', values)}
                                                />
                                                <p className="w-fit">Sản phẩm</p>
                                            </div>
                                            <ErrorMessage name="quantity" render={renderError} />
                                        </div>
                                    </section>
                                </div>
                                <div className="flex flex-col ">
                                    <label className="font-bold text-sm">Mô tả sản phẩm</label>
                                    <QuillNoSSRWrapper
                                        className="mt-2 h-40 mb-12"
                                        modules={moduleProductCreate}
                                        formats={formats}
                                        name="description"
                                        theme="snow"
                                        onChange={(value) => {
                                            console.log('🚀 ~ file: create.js:386 ~ CreateArticle ~ value:', value);
                                            if (isQuillEmpty(value)) {
                                                console.log(
                                                    '🚀 ~ file: create.js:391 ~ CreateArticle ~ isQuillEmpty(value):',
                                                    isQuillEmpty(value),
                                                );
                                                setFieldValue('description', '');
                                            } else {
                                                setFieldValue('description', value);
                                            }
                                        }}
                                    />
                                    <ErrorMessage name="description" render={renderError} />
                                </div>
                                <div>
                                    <ModelListValid
                                        listModel={modelList || []}
                                        modelSelect={modelSelect}
                                        setModelSelect={setModelSelect}
                                    />
                                </div>

                                <div>
                                    <ProductUploadImage
                                        fileList={fileList}
                                        setFileList={setFileList}
                                        setFieldValue={setFieldValue}
                                    />
                                    <ErrorMessage name="image" render={renderError} />
                                </div>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </AdminLayout>
    );
}

export default CreateArticle;

export { getServerSideProps };
