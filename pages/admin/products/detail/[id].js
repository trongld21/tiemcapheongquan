import AdminTitle from '@/components/Admin/AdminTitle';
import AdminLayout from '@/components/Layout/AdminLayout';
import managerProductAPI from '@/pages/api/manager/managerProductAPI';
import { getDownloadURL, ref, uploadBytes } from '@firebase/storage';
import { CardBody } from '@material-tailwind/react';
import { Button, Card, Col, Form, Image, InputNumber, Row, Select } from 'antd';
import DOMPurify from 'dompurify';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { v4 as uuidv4 } from 'uuid';
import { storage } from '../../../../firebase';
import { moduleProductCreate, validateProduct } from '@/constant';
import managerCategoryAPI from '@/pages/api/manager/managerCategoryAPI';
import apiProduct from '@/pages/api/apiProduct';
import getServerSideProps from '@/lib/adminServerProps';
import ProductUploadImage from '@/components/Product/ProductUploadImage';
import { ErrorMessage, Field, Formik } from 'formik';
import ModelListValid from '@/components/Model/ModelListValid';
import PrimaryButton from '@/components/Utils/PrimaryButton';
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

function ProductDetail() {
    const router = useRouter();
    const { id } = router.query;
    const [dataCategories, setDataCategories] = useState([]);
    const [data, setData] = useState();
    console.log('🚀 ~ file: [id].js:52 ~ ProductDetail ~ data:', data);
    const [fileList, setFileList] = useState([]);
    const [modelList, setModelList] = useState([]);
    const [modelSelect, setModelSelect] = useState('');

    const [productInfo, setProductInfo] = useState({
        name: '',
        description: '',
        categoryId: '',
        quantity: '',
        price: '',
        images: [],
    });
    const [selectedImages, setSelectedImages] = useState([]);

    // Handle get data from api
    useEffect(() => {
        if (id) {
            getData(id);
        }
    }, [id]);

    // Handle match data
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

    // Handle editor on change
    const handleQuillChange = (value) => {
        setProductInfo((prevState) => ({
            ...prevState,
            description: DOMPurify.sanitize(value),
        }));
    };

    const selected_images = selectedImages?.map((file) => (
        <div key={file}>
            <div className=" dz-preview dz-preview-multiple list-group-lg" flush>
                <div className=" px-0">
                    <Row className=" align-items-center">
                        <Col className=" col-auto  w-80">
                            <Image alt="..." className="dropzone-preview" data-dz-thumbnail src={file} />
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    ));

    // Handle input on change
    const handleInputChange = async (event) => {
        const { name, files } = event.target;
        setProductInfo((prevState) => ({
            ...prevState,
            [name]: event.target.value,
        }));
        console.log(productInfo);
    };

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

    const renderError = (message) => <p className="text-xs text-error">{message}</p>;

    const defaultCategory = categoryOptions.find((option) => option.label === data.categoryName);

    return (
        <AdminLayout>
            <AdminTitle content={`Chi tiết sản phẩm: ${productInfo.name}`} />
            <form>
                <Card>
                    <div className="align-items-center flex justify-between">
                        <div className="text-right" xs="4">
                            <Link
                                color="primary"
                                type="submit"
                                size="sm"
                                className="bg-white text-secondary border-solid border-2 border-secondary px-[15px] py-[4px] rounded-md hover:bg-secondary hover:text-white"
                                href="/admin/products"
                            >
                                Trở lại danh sách
                            </Link>
                        </div>
                        <div className="text-right" xs="4">
                            <Link
                                href={`/admin/products/edit/${id}`}
                                color="primary"
                                type="submit"
                                size="sm"
                                className="bg-secondary text-white border-solid border-2 border-secondary px-[15px] py-[4px] rounded-md hover:bg-white hover:text-secondary"
                            >
                                Cập nhật
                            </Link>
                        </div>
                    </div>
                    <CardBody>
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
                                        <div className="flex gap-20 w-full">
                                            <div className="flex flex-col w-full gap-4">
                                                <section className="flex flex-col gap-1 text-sm">
                                                    <label htmlFor="name" className="font-bold text-sm">
                                                        Tên sản phẩm
                                                    </label>
                                                    <Field
                                                        name="name"
                                                        type="text"
                                                        disabled
                                                        disable
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
                                                                    disabled
                                                                    defaultValue={defaultCategory?.value}
                                                                    name="category"
                                                                    options={categoryOptions}
                                                                    placeholder="Chọn danh mục"
                                                                    className="w-full"
                                                                    onChange={(values) =>
                                                                        setFieldValue('category', values)
                                                                    }
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
                                                                    disabled
                                                                    defaultValue={data?.price}
                                                                    className="flex-1"
                                                                    onChange={(values) =>
                                                                        setFieldValue('price', values)
                                                                    }
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
                                                                    min={1}
                                                                    disabled
                                                                    defaultValue={data?.quantity}
                                                                    className="flex-1"
                                                                    onChange={(values) =>
                                                                        setFieldValue('quantity', values)
                                                                    }
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
                                                        readOnly
                                                        defaultValue={data?.description}
                                                    />
                                                    <ErrorMessage name="description" render={renderError} />
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <section className="font-bold text-sm">Danh sách Model:</section>
                                                    {!!data?.product3DModel ? (
                                                        <div
                                                            key={data?.product3DModel?.product3DModelId}
                                                            className={`h-40 w-40 border-2 p-2 rounded-lg border-dashed flex group relative justify-center items-center border-secondary`}
                                                        >
                                                            <img
                                                                src={data?.product3DModel?.thumbnailUrl}
                                                                alt="Thumbnail"
                                                                className="w-full h-full rounded-lg object-cover"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div
                                                            className={`h-40 w-40 border-2 rounded-lg border-dashed flex justify-center items-center hover:border-secondary border-secondary`}
                                                        >
                                                            <p className="font-bold text-sm">Không có Model</p>
                                                        </div>
                                                    )}
                                                </div>

                                                <div>
                                                    <ProductUploadImage
                                                        disable={true}
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
                    </CardBody>
                </Card>
            </form>
        </AdminLayout>
    );
}

export default ProductDetail;

export { getServerSideProps };
