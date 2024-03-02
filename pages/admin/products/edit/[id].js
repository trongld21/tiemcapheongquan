import AdminTitle from '@/components/Admin/AdminTitle';
import AdminLayout from '@/components/Layout/AdminLayout';
import BackButton from '@/components/Utils/BackButton';
import PrimaryButton from '@/components/Utils/PrimaryButton';
import { moduleProductCreate, validateProduct } from '@/constant';
import managerCategoryAPI from '@/pages/api/manager/managerCategoryAPI';
import managerProductAPI from '@/pages/api/manager/managerProductAPI';
import { getDownloadURL, ref, uploadBytes } from '@firebase/storage';
import { InputNumber, Select } from 'antd';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
// Component validate form
import { ErrorMessage, Field, Form, Formik } from 'formik';
// Component toast message
import ModelListValid from '@/components/Model/ModelListValid';
import ProductUploadImage from '@/components/Product/ProductUploadImage';
import { storage } from '@/firebase';
import useNotification from '@/hooks/useNotification';
import getServerSideProps from '@/lib/adminServerProps';
import managerModelAPI from '@/pages/api/manager/managerModelAPI';

const QuillNoSSRWrapper = dynamic(import('react-quill'), {
    ssr: false,
    loading: () => <p>Loading ...</p>,
});

/*
 * Quill editor formats
 * See https://quilljs.com/docs/formats/
 */
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

function UpdateArticle() {
    const router = useRouter();
    const { id } = router.query;
    const { showError, showSuccess, showWarning } = useNotification();

    const [data, setData] = useState();
    const [isDisable, setIsDisable] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [dataCategories, setDataCategories] = useState([]);
    const [modelList, setModelList] = useState([]);
    const [modelSelect, setModelSelect] = useState('');

    // fetch data
    const getData = async (slug) => {
        try {
            const res = await managerProductAPI.GetBySlug(slug);
            // Fetch product data
            if (res && res.success) {
                setData(res.data);
                setModelSelect(res.data.product3DModel);
                setFileList(
                    res.data.productImages.map((url, index) => ({
                        uid: index,
                        name: `default-image-${index + 1}`,
                        status: 'done',
                        url: url,
                    })),
                );
                //call api Category
                const responseCategory = await managerCategoryAPI.GetAll();
                if (responseCategory && responseCategory.success) {
                    setDataCategories(responseCategory.data);
                }
                const responseModelList = await managerModelAPI.GetAllByID(res.data.productId);
                if (responseModelList && responseModelList.success) {
                    setModelList(responseModelList?.data);
                }
            }
        } catch (error) {
            console.error('Fetch Data Fail');
        }
    };

    // Handle get data from api
    useEffect(() => {
        if (id) {
            getData(id);
        }
    }, [id]);

    // Update product
    const handleUpdateProduct = async (values) => {
        setIsDisable(true);
        try {
            if (values.image.length > 0) {
                let arrURL = [];
                const arraysWithAndWithoutUrls = fileList.reduce(
                    (result, item) => {
                        if (item.url) {
                            result.arrayWithUrls.push(item);
                        } else {
                            result.arrayWithoutUrls.push(item);
                        }
                        return result;
                    },
                    { arrayWithUrls: [], arrayWithoutUrls: [] },
                );
                if (arraysWithAndWithoutUrls.arrayWithUrls.length > 0) {
                    arraysWithAndWithoutUrls.arrayWithUrls.map((item) => arrURL.push(item.url));
                }
                const arrayWithoutUrls = arraysWithAndWithoutUrls.arrayWithoutUrls;
                if (arrayWithoutUrls.length > 0) {
                    const id = uuidv4();
                    try {
                        await Promise.all(
                            arrayWithoutUrls.map(async (image) => {
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
                }
                try {
                    const dataUpdate = {
                        productId: data.productId,
                        categoryId: values.category,
                        product3DModelId: modelSelect?.product3DModelId || '',
                        name: values.name,
                        description: values.description,
                        quantity: values.quantity,
                        price: values.price,
                        productImages: arrURL,
                    };
                    const res = await managerProductAPI.Update(data.productId, dataUpdate);
                    if (res && res.success) {
                        showSuccess('Cập nhật thành công', 'Cập nhật sản phẩm thành công', 3);
                        router.push('/admin/products');
                        setIsDisable(false);
                    } else {
                        showError('Cập nhật thất bại', 'Có một số lỗi trong khi cập nhật', 4);
                        setIsDisable(false);
                    }
                } catch (error) {
                    setIsDisable(false);
                    console.error(error); // Xử lý lỗi nếu có
                }
            }
        } catch (error) {
            console.log('🚀 ~ file: [id].js:128 ~ handleUpdateProduct ~ error:', error);
        }
    };

    function isQuillEmpty(value) {
        if (value.replace(/<(.|\n)*?>/g, '').trim().length === 0 && !value.includes('<img')) {
            return true;
        }
        return false;
    }

    const renderError = (message) => <p className="text-xs text-error">{message}</p>;

    const initialValues = {
        name: data?.name,
        price: data?.price,
        category: data?.categoryId,
        quantity: data?.quantity,
        description: data?.description,
        image: data?.productImages,
    };

    let categoryOptions = [];

    dataCategories.forEach((item) => {
        categoryOptions.push({
            value: item.categoryId,
            label: item.name,
        });
    });

    const defaultCategory = categoryOptions.find((option) => option.label === data.categoryName);

    return (
        <AdminLayout>
            <AdminTitle content="Cập nhật sản phẩm" />
            {data && (
                <Formik
                    initialValues={initialValues}
                    validationSchema={validateProduct}
                    onSubmit={async (values) => {
                        await handleUpdateProduct(values);
                    }}
                >
                    {({ setFieldValue }) => (
                        <Form className="flex flex-col gap-6 w-11/12 mx-auto px-6 py-4 border rounded-10">
                            <div className="flex justify-between">
                                <BackButton title={'Quay lại'} />
                                <PrimaryButton
                                    content={'Cập nhật'}
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
                                                {defaultCategory && (
                                                    <Select
                                                        defaultValue={defaultCategory?.value}
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
                                                        min={1}
                                                        defaultValue={data?.price}
                                                        className="flex-1"
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
                                                        defaultValue={data?.quantity}
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
                                            defaultValue={data?.description}
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
            )}
        </AdminLayout>
    );
}

export default UpdateArticle;

export { getServerSideProps };
