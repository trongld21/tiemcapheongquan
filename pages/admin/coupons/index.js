import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { Table, Tag } from 'antd';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';

import { ExclamationCircleFilled } from '@ant-design/icons';
import { Modal } from 'antd';
const { confirm } = Modal;

import AdminTitle from '@/components/Admin/AdminTitle';
import AdminLayout from '@/components/Layout/AdminLayout';
import useNotification from '@/hooks/useNotification';
import PrimaryButton from '@/components/Utils/PrimaryButton';
import { formatDateForHtml, formatDateForInput } from '@/components/Utils/FormatDate';

import managerCouponAPI from '@/pages/api/manager/managerCouponAPI';

import getServerSideProps from '@/lib/adminServerProps';
import convertToVND from '@/components/Utils/convertToVND';
import removeDiacritics from '@/components/Utils/removeDiacritics';

const Create = 'Thêm mã giảm giá';
const Edit = 'Cập nhật mã giảm giá';

const typeCounponMapping = {
    ByPercent: 'Theo phần trăm',
    ByValue: 'Theo giá trị',
};

const Index = () => {
    const [data, setData] = useState();
    const [showForm, setShowForm] = useState(false);
    const [couponId, setCouponId] = useState('');
    const [nameForm, setNameForm] = useState(Create);
    const [dataSearch, setSearchData] = useState();

    const [initialValues, setInitialValues] = useState({
        couponType: '',
        code: '',
        value: 0,
        maxValue: 0,
        remainingUsageCount: 0,
        isActive: 'true',
        startDate: '',
        endDate: '',
    });
    const { showError, showSuccess } = useNotification();
    const handleSearchOnchange = (event) => {
        const searchTerm = event.target.value.toLowerCase().trim(); // Chuyển giá trị nhập vào thành chữ thường và loại bỏ khoảng trống thừa
        const normalizedSearchTerm = removeDiacritics(searchTerm);
        if (searchTerm !== '') {
            const filtered = data.filter(
                (coupons) =>
                    removeDiacritics(coupons.couponId.toLowerCase()).includes(normalizedSearchTerm) || // Tìm kiếm theo tiêu đề
                    removeDiacritics(coupons.couponType.toLowerCase()).includes(normalizedSearchTerm) || // Tìm kiếm theo nội dung
                    removeDiacritics(coupons.code.toLowerCase()).includes(normalizedSearchTerm), // Tìm kiếm theo nội dung
            );
            setSearchData(filtered);
        } else {
            setSearchData(data);
        }
    };
    const fetchData = async () => {
        const dataFetch = await managerCouponAPI.GetAll();
        if (dataFetch && dataFetch.success) {
            setData(dataFetch.data);
            setSearchData(dataFetch.data);
        }
    };
    const showConfirm = (couponId) => {
        confirm({
            title: 'Bạn có muốn xóa mã giảm giá này?',
            icon: <ExclamationCircleFilled />,
            content: 'Dữ liệu đã xóa không thể phục hồi',
            okType: 'danger',
            okText: 'Xóa',
            cancelText: 'Quay lại',
            async onOk() {
                handleDelete(couponId);
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };
    const handleDelete = async (couponId) => {
        const res = await managerCouponAPI.Delete(couponId);
        if (res && res.success) {
            showSuccess('Xóa mã giảm giá thành công', `Xóa mã giảm giá ${couponId} thành công!`, 1);
            fetchData();
        } else {
            showError('Xóa mã giảm giá thất bại', `Xóa mã giảm giá ${couponId} thất bại!`, 1);
        }
    };

    function getStatusInVietnamese(statusEnglish) {
        return typeCounponMapping[statusEnglish] || 'Không xác định';
    }

    useEffect(() => {
        fetchData();
    }, []);

    const columns = [
        {
            title: 'Mã giảm giá',
            dataIndex: 'code',
            render: (text) => <p className="font-semibold">{text}</p>,
        },
        {
            title: 'Loại giảm giá',
            dataIndex: 'couponType',
            render: (text) => <p className="font-semibold">{getStatusInVietnamese(text)}</p>,
        },
        {
            title: 'Chiết khấu',
            dataIndex: 'value',
            render: (text, record) => {
                const displayValue = record.couponType === 'ByPercent' ? `${text}%` : `${convertToVND(text)}`;
                return <p className="font-semibold">{displayValue}</p>;
            },
        },
        {
            title: 'Giá giảm tối đa',
            dataIndex: 'maxValue',
            render: (text) => <p className="font-semibold">{convertToVND(text)}</p>,
        },
        {
            title: 'Số lần sử dụng còn lại',
            dataIndex: 'remainingUsageCount',
            render: (text) => <p className="font-semibold text-center">{text}</p>,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'isActive',
            render: (text) => (
                <Tag color={text == true ? 'success' : 'default'} className="font-semibold">
                    {text == true ? 'Còn hiệu lực' : 'Hết hiệu lực'}
                </Tag>
            ),
        },
        {
            title: 'Ngày bắt đầu',
            dataIndex: 'startDate',
            render: (text) => <p className="font-semibold">{formatDateForHtml(text)}</p>,
        },
        {
            title: 'Ngày hết hạn',
            dataIndex: 'endDate',
            render: (text) => <p className="font-semibold">{formatDateForHtml(text)}</p>,
        },
        {
            title: 'Hành động',
            dataIndex: 'couponId',
            render: (text, record) => (
                <div className="flex gap-4 text-gray-50">
                    <button onClick={() => handleEditCoupon(record)}>
                        <Image src="/assets/svg/pencil.svg" alt="Edit" height={24} width={24} />
                    </button>
                    <button onClick={() => showConfirm(record.couponId)}>
                        <Image src="/svgs/trash.svg" alt="Delete" height={30} width={30} />
                    </button>
                </div>
            ),
        },
    ];

    const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };

    // Check validate form
    const validation = Yup.object({
        couponType: Yup.string().required('Vui lòng chọn loại giảm giá'),
        code: Yup.string()
            .trim()
            .required('Vui lòng nhập mã giảm giá')
            .min(5, 'Mã giảm giá ít nhất 5 ký tự')
            .max(50, 'Mã giảm giá nhiều nhất 50 kí tự'),
        value: Yup.number()
            .required('Vui lòng nhập chiết khấu')
            .min(1, 'Chiết khấu ít nhất là 1')
            .max(99999999, 'Chiết khấu lớn nhất 99,999,999'),
        maxValue: Yup.number()
            .required('Vui lòng nhập chiết khấu tối đa')
            .min(1, 'Chiết khấu tối đa ít nhất là 1')
            .max(99999999, 'Chiết khấu tối đa 99,999,999'),
        // .when('value', (value, schema) => schema.min(value, 'Giá trị tối đa phải lớn hơn hoặc bằng giá trị')),
        remainingUsageCount: Yup.number()
            .required('Vui lòng nhâp số lần sử dụng')
            .min(1, 'Số lần sử dụng bé nhất là 1')
            .max(1000, 'Số lần sử dụng lớn nhất là 1000'),
        isActive: Yup.string('true').required('Vui lòng chọn trạng thái.'),
        startDate: Yup.date().required('Vui lòng nhập ngày bắt đầu'),
        endDate: Yup.date()
            .required('Vui lòng nhập ngày kết thúc')
            .min(Yup.ref('startDate'), 'Ngày kết thúc phải sau hoặc bằng với ngày bắt đầu'),
    });

    const handleAddCoupon = () => {
        setInitialValues({
            couponType: '',
            code: '',
            value: 0,
            maxValue: 0,
            remainingUsageCount: 0,
            isActive: 'true',
            startDate: '',
            endDate: '',
        });
        setNameForm(Create);
        setShowForm(true);
    };

    const handleEditCoupon = (coupon) => {
        coupon.startDate = formatDateForInput(coupon.startDate);
        coupon.endDate = formatDateForInput(coupon.endDate);
        setCouponId(coupon.couponId);
        setNameForm(Edit);
        setShowForm(true);
        coupon.isActive = coupon.isActive + '';
        setInitialValues(coupon);
        console.log('🚀 ~ file: index.js:225 ~ handleEditCoupon ~ coupon:', coupon);
    };

    // Function to handle submit call api
    const handleSubmitForm = async (values) => {
        if (nameForm === Create) {
            console.log(values);
            const res = await managerCouponAPI.Create(values);
            if (res && res.success === true) {
                fetchData();
                setShowForm(false);
                showSuccess('Tạo mã giảm giá thành công', 'Form sẽ đóng!', 1);
            } else {
                showError('Tạo mã giảm giá thất bại', res?.message, 1);
            }
        } else if (nameForm === Edit) {
            const res = await managerCouponAPI.Update(couponId, values);
            if (res && res.success === true) {
                fetchData();
                setShowForm(false);
                showSuccess('Chỉnh sử mã giảm giá thành công', 'Form sẽ đóng!', 1);
            } else {
                showError('Chỉnh sửa mã giảm giá thất bại', 'Có một số lỗi sảy ra. Hãy thử lại', 1);
            }
        }
    };

    return (
        <AdminLayout>
            <AdminTitle content="Danh sách mã giảm giá" />
            {showForm && (
                <div className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-opacity-50 bg-gray-500 z-50">
                    <div className="p-6 bg-white rounded-lg">
                        <div className="flex justify-between uppercase font-semibold text-xl">
                            {nameForm}
                            <button onClick={() => setShowForm(false)} className="w-4 h-4">
                                <Image src="/svgs/close.svg" alt="Close" width={30} height={30} />
                            </button>
                        </div>
                        <Formik
                            initialValues={initialValues}
                            validationSchema={validation}
                            onSubmit={(values) => {
                                handleSubmitForm(values);
                            }}
                        >
                            <Form className="flex flex-col gap-2 w-96">
                                <div className="mt-2 flex flex-col">
                                    <label htmlFor="couponType">Loại giảm giá</label>
                                    <Field
                                        as="select"
                                        name="couponType"
                                        className="border border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring focus:border-blue-500"
                                    >
                                        <option value="" disabled>
                                            Chọn thể loại
                                        </option>
                                        <option value="ByPercent">Giảm giá theo phần trăm</option>
                                        <option value="ByValue">Giảm giá theo giá trị</option>
                                    </Field>
                                    <ErrorMessage name="couponType" component="p" className="text-error text-xs" />
                                </div>
                                <div className="mt-2 flex flex-col">
                                    <label htmlFor="code">Mã giảm giá</label>
                                    <Field
                                        id="code"
                                        type="text"
                                        name="code"
                                        disabled={nameForm === Edit}
                                        className="border-t-0 border-l-0 border-r-0 focus:outline-none text-sm py-1 px-2 border-black focus-visible:outline-none"
                                        placeholder="Nhập mã giảm giá..."
                                    />
                                    <ErrorMessage name="code" component="p" className="text-error text-xs" />
                                </div>
                                <div className="mt-2 flex flex-col">
                                    <label htmlFor="value">Chiết khấu</label>
                                    <Field
                                        id="value"
                                        type="number"
                                        name="value"
                                        placeholder="Nhập chiết khấu..."
                                        className="border-t-0 border-l-0 border-r-0 focus:outline-none text-sm py-1 px-2 border-black focus-visible:outline-none"
                                    />
                                    <ErrorMessage name="value" component="p" className="text-error text-xs" />
                                </div>
                                <div className="mt-2 flex flex-col">
                                    <label htmlFor="maxValue">Chiết khấu tối đa</label>
                                    <Field
                                        id="maxValue"
                                        type="number"
                                        name="maxValue"
                                        placeholder="Nhập chiết khấu tối đa..."
                                        className="border-t-0 border-l-0 border-r-0 focus:outline-none text-sm py-1 px-2 border-black focus-visible:outline-none"
                                    />
                                    <ErrorMessage name="maxValue" component="p" className="text-error text-xs" />
                                </div>
                                <div className="mt-2 flex flex-col">
                                    <label htmlFor="remainingUsageCount">Số lượt dùng</label>
                                    <Field
                                        id="remainingUsageCount"
                                        type="number"
                                        name="remainingUsageCount"
                                        placeholder="Nhập số lượt dùng tối đa..."
                                        className="border-t-0 border-l-0 border-r-0 focus:outline-none text-sm py-1 px-2 border-black focus-visible:outline-none"
                                    />
                                    <ErrorMessage
                                        name="remainingUsageCount"
                                        component="p"
                                        className="text-error text-xs"
                                    />
                                </div>
                                <div className="mt-2 flex flex-col">
                                    <label htmlFor="state">Trạng thái</label>
                                    <div
                                        role="group"
                                        className="flex justify-start gap-4 items-center"
                                        aria-labelledby="my-radio-group"
                                    >
                                        {/* <Field type="radio" id="isActive" name="isActive" value={true} />
                                        <label htmlFor="isActive">Hiệu lực</label>

                                        <Field type="radio" id="notActive" name="isActive" value={false} />
                                        <label htmlFor="notActive">Không hiệu lực</label> */}

                                        <label className="flex justify-start items-center gap-2">
                                            <Field type="radio" name="isActive" value="true" required />
                                            Còn hiệu lực
                                        </label>
                                        <label className="flex justify-start items-center gap-2">
                                            <Field type="radio" name="isActive" value="false" required />
                                            Hết hiệu lực
                                        </label>
                                    </div>
                                    <ErrorMessage name="isActive" component="p" className="text-error text-xs" />
                                </div>
                                <div className="mt-2 flex flex-col">
                                    <label htmlFor="startDate">Ngày bắt đầu</label>
                                    <Field
                                        id="startDate"
                                        type="date"
                                        name="startDate"
                                        className="border-t-0 border-l-0 border-r-0 focus:outline-none text-sm py-1 px-2 border-black focus-visible:outline-none"
                                    />
                                    <ErrorMessage name="startDate" component="p" className="text-error text-xs" />
                                </div>
                                <div className="mt-2 flex flex-col">
                                    <label htmlFor="endDate">Ngày kết thúc</label>
                                    <Field
                                        id="endDate"
                                        type="date"
                                        name="endDate"
                                        className="border-t-0 border-l-0 border-r-0 focus:outline-none text-sm py-1 px-2 border-black focus-visible:outline-none"
                                    />
                                    <ErrorMessage name="endDate" component="p" className="text-error text-xs" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <PrimaryButton
                                        content={nameForm}
                                        classCss={
                                            'border-black rounded border w-fit px-5 py-1 mx-auto hover:bg-primary hover:text-white hover:border-white'
                                        }
                                        type={'submit'}
                                    />
                                </div>
                            </Form>
                        </Formik>
                    </div>
                </div>
            )}
            <div className="flex flex-col gap-10">
                <section className="flex justify-between text-sm items-center">
                    <div className="w-8/12 relative border-b h-fit">
                        <input
                            placeholder="Tìm kiếm"
                            className="outline-none border-b p-2 w-full rounded-lg"
                            onChange={handleSearchOnchange}
                        />
                    </div>
                    <button
                        onClick={handleAddCoupon}
                        className="p-2 flex gap-1 border-dashed border-2 font-bold justify-center items-center text-grey rounded-md"
                    >
                        <div className="w-4 h-4 bg-black flex justify-center items-center rounded-full">
                            <img src="/assets/svg/plus.svg" alt="icon" />
                        </div>
                        <a>Thêm mã giảm giá</a>
                    </button>
                </section>
                <section>
                    <Table columns={columns} rowKey="couponId" dataSource={dataSearch || []} onChange={onChange} />
                </section>
            </div>
        </AdminLayout>
    );
};

export default Index;
export { getServerSideProps };
