import { validationAddressForm } from '@/constant';
import { useEffect, useRef, useState } from 'react';

import UserLayout from '@/components/Layout/UserLayout';
import AddressCard from '@/components/Utils/AddressCard';
import Thumbnail from '@/components/Utils/Thumbnail';
import UserSideBar from '@/components/Utils/UserSideBar';
import useNotification from '@/hooks/useNotification';
import getServerSideProps from '@/lib/userServerProps';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Modal, Select } from 'antd';
import axios from 'axios';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import apiUserAddress from '../api/user/apiUserAddress';
const { confirm } = Modal;

function Address() {
    // data user addresses
    const { showError, showSuccess } = useNotification();
    const [data, setData] = useState();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [dataCity, setDataCity] = useState();
    const [city, setCity] = useState();
    const [dataDistricts, setDataDistricts] = useState();
    const [district, setDistrict] = useState();
    const [dataWards, setDataWards] = useState();
    const [wards, setWards] = useState();
    const formikRef = useRef();

    const showModal = () => {
        setIsModalOpen(true);
    };
    // Handle create new address
    const handleCreateNewAddress = async (values) => {
        try {
            const res = await apiUserAddress.CreateUserAddress(
                values.name,
                values.phone,
                city.code,
                city.name,
                district.code,
                district.name,
                wards.code,
                wards.name,
                values.street,
            );
            if (res && res.success === true) {
                showSuccess('Tạo mới thành công', 'Địa chỉ mới sẽ được thêm vào danh sách địa chỉ của bạn', 3);
                setIsModalOpen(false);
                fetchData();
            } else {
                showError('Tạo mới thất bại', res, 5);
                console.log(res);
            }
        } catch (err) {
            console.log(err.message);
        }

        // setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
        formikRef.current.resetForm();
    };

    const fetchData = async () => {
        try {
            const res = await apiUserAddress.GetUserAddress();
            if (res && res.success === true) {
                // showSuccess('Edit coupon success', 'You can be close form!', 1);
                setData(res.data);
            } else {
                console.log(res);
            }
        } catch (err) {
            console.log(err.message);
        }
    };

    useEffect(() => {
        // api get data
        const fetchAddress = async () => {
            try {
                const res = await axios.get(process.env.NEXT_PUBLIC_API_ADDRESS);
                // Check response from api
                if (res && res.status === 200) {
                    setDataCity(res.data);
                } else {
                    console.log('Error');
                }
            } catch (error) {
                // Handle the error
                return error.response;
            }
        };
        fetchData();
        fetchAddress();
    }, []);

    // call api set address default
    const handleSetDefault = async (userAddressId) => {
        try {
            const res = await apiUserAddress.SetDefaultAddress(userAddressId);
            if (res && res.success === true) {
                // showSuccess('Edit coupon success', 'You can be close form!', 1);
                fetchData();
            } else {
                showError('Fail', res.data.message);
            }
        } catch (err) {
            console.log(err.message);
        }
    };

    const handleCityChange = (value) => {
        const listDistrict = dataCity.find((item) => item.code === value);
        if (listDistrict) {
            setCity(listDistrict);
            setDataDistricts(listDistrict?.districts);
            setDistrict(listDistrict?.districts[0]);
            setWards(listDistrict?.districts[0].wards[0]);
        }
    };

    const handleDistrictsChange = (value) => {
        const districtValue = dataDistricts.find((item) => item.code === value);
        setDistrict(districtValue);
        setWards(districtValue.wards[0]);
    };

    const handleWardsChange = (value) => {
        const wardValue = dataWards.find((item) => item.code === value);
        setWards(wardValue);
    };

    //handle delete address if not is default
    const handleDeleteAddress = async (id) => {
        confirm({
            title: 'Bạn có muốn xóa địa chỉ?',
            icon: <ExclamationCircleFilled />,
            content: 'Dữ liệu xóa đi sẽ không thể khôi phục',
            okType: 'danger',
            okText: 'Xóa',
            cancelText: 'Quay lại',
            async onOk() {
                // callback function
                try {
                    const res = await apiUserAddress.Delete(id);
                    if (res && res.success === true) {
                        fetchData();
                        showSuccess('Xóa địa chỉ thành công', 'Địa chỉ của bạn đã được xóa thành công', 3);
                    } else {
                        showError('Xóa địa chỉ thất bại', res.data.message);
                    }
                } catch (err) {
                    console.log(err);
                }
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };

    useEffect(() => {
        if (dataCity) {
            setCity(dataCity[0]);
            setDataDistricts(dataCity[0]?.districts);
            setDistrict(dataCity[0]?.districts[0]);
            setDataWards(dataCity[0]?.districts?.wards);
            setWards(dataCity[0]?.districts[0].wards[0]);
        }
    }, [dataCity]);

    useEffect(() => {
        if (district || dataDistricts) {
            setDataWards(district?.wards || dataDistricts[0].wards);
        }
    }, [district, dataDistricts]);

    return (
        <UserLayout>
            <Thumbnail title={'Địa Chỉ'} />
            <UserSideBar>
                <div className="relative flex flex-col gap-10">
                    <button
                        onClick={showModal}
                        className="bg-secondary gap-2 text-white font-medium w-fit flex justify-center items-center py-2 px-3"
                    >
                        <img src="/assets/svg/plus.svg" alt="icon plus" />
                        <p>Thêm địa chỉ</p>
                    </button>
                    <div className="flex flex-col gap-10">
                        {data &&
                            data.map((item) => (
                                <AddressCard
                                    key={item.userAddressId}
                                    id={item.userAddressId}
                                    data={item}
                                    onClickSetDefault={() => handleSetDefault(item.userAddressId)}
                                    handleDeleteAddress={() => handleDeleteAddress(item.userAddressId)}
                                    dataCity={dataCity}
                                    fetchData={fetchData}
                                />
                            ))}
                    </div>
                </div>
                <Modal
                    title="THÊM ĐỊA CHỈ MỚI"
                    open={isModalOpen}
                    onCancel={handleCancel}
                    footer={[
                        <button
                            form="createAddressForm"
                            className="bg-secondary text-white px-5 rounded py-1.5 mt-4"
                            key="submit"
                            htmltype="submit"
                            type="submit"
                        >
                            Tạo Mới
                        </button>,
                    ]}
                >
                    <Formik
                        initialValues={{ name: '', phone: '', street: '' }}
                        validationSchema={validationAddressForm}
                        onSubmit={(values, { resetForm }) => {
                            handleCreateNewAddress(values);
                            resetForm();
                        }}
                        innerRef={formikRef}
                    >
                        <Form className="flex flex-col gap-3 w-full" id="createAddressForm">
                            <section className="flex w-full my-2 gap-16 max-sm:flex-col max-sm:gap-4">
                                <div className="w-2/4 max-sm:w-full">
                                    <p className="font-bold">Họ Và Tên</p>
                                    <Field
                                        name="name"
                                        className=" focus:outline-none border-t-0 border-l-0 w-full border-b border-r-0 text-sm py-1 px-2 border-black focus-visible:outline-none"
                                        placeholder="Họ và tên"
                                    />
                                    <ErrorMessage name="name" component="p" className="text-error text-xs" />
                                </div>
                                <div className="w-2/4 max-sm:w-full">
                                    <p className="font-bold">Số Điện Thoại</p>
                                    <Field
                                        name="phone"
                                        className=" focus:outline-none border-t-0 border-l-0 w-full border-r-0 text-sm border-b py-1 px-2 border-black focus-visible:outline-none"
                                        placeholder="Số điện thoại"
                                    />
                                    <ErrorMessage name="phone" component="p" className="text-error text-xs" />
                                </div>
                            </section>
                            <section className="w-full">
                                <p className="font-bold">Địa Chỉ Cụ Thể {`(Không nhập lại Tỉnh, Quận, Xã)`}</p>
                                <Field
                                    name="street"
                                    className="border-t-0 border-l-0 w-full border-b border-r-0 focus:outline-none text-sm py-1 px-2 border-black focus-visible:outline-none"
                                    placeholder="Tên đường, Tòa nhà, Số nhà"
                                />
                                <ErrorMessage name="street" component="p" className="text-error text-xs" />
                            </section>
                            {dataWards && (
                                <section className="grid grid-cols-3 max-sm:grid-cols-1 my-2 gap-3">
                                    <div className="flex flex-col">
                                        <p className="font-bold">Tỉnh / Thành Phố</p>
                                        <Select
                                            defaultValue={dataCity[0].code}
                                            onChange={handleCityChange}
                                            options={dataCity.map((province) => ({
                                                label: province.name,
                                                value: province.code,
                                            }))}
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <p className="font-bold">Quận / Huyện</p>
                                        <Select
                                            value={district?.code}
                                            defaultValue={dataDistricts[0].code}
                                            onChange={handleDistrictsChange}
                                            options={dataDistricts.map((district) => ({
                                                label: district.name,
                                                value: district.code,
                                            }))}
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <p className="font-bold">Xã / Thị Trấn</p>
                                        <Select
                                            value={wards?.code}
                                            defaultValue={dataWards[0].code}
                                            onChange={handleWardsChange}
                                            options={dataWards.map((district) => ({
                                                label: district.name,
                                                value: district.code,
                                            }))}
                                        />
                                    </div>
                                </section>
                            )}
                        </Form>
                    </Formik>
                </Modal>
            </UserSideBar>
        </UserLayout>
    );
}

export default Address;

export { getServerSideProps };
