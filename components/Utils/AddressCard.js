import { validationAddressForm } from '@/constant';
import useNotification from '@/hooks/useNotification';
import apiUserAddress from '@/pages/api/user/apiUserAddress';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useEffect, useRef, useState } from 'react';
// Ant design component
import { Modal, Select } from 'antd';

function AddressCard({ id, data, onClickSetDefault, handleDeleteAddress, dataCity, fetchData }) {
    const { showError, showSuccess } = useNotification();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [city, setCity] = useState();
    const [dataDistricts, setDataDistricts] = useState();
    const [district, setDistrict] = useState();
    const [dataWards, setDataWards] = useState();
    const [wards, setWards] = useState();
    // Initial value form
    const initialFormValues = { name: data.fullName, phone: data.phone, street: data.street };
    const formikRef = useRef();

    // function to update address
    const handleUpdateAddress = async (values) => {
        try {
            const res = await apiUserAddress.UpdateUserAddress(
                id,
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
                setIsModalOpen(false);
                showSuccess('Cập nhật địa chỉ thành công', 'Địa chỉ của bạn đã được cập nhật thông tin', 3);
                fetchData();
            } else {
                showError('Cập nhật địa chỉ thất bại', res, 5);
                console.log(res);
            }
        } catch (err) {
            console.log(err.message);
        }
    };

    // Handle cancel and reset form data
    const handleCancel = () => {
        formikRef.current.resetForm();
        const city = dataCity.find((item) => item.code === data.cityCode);
        const district = city.districts.find((item) => item.code === data.districtCode);
        const ward = district.wards.find((item) => item.code === data.wardCode);
        setCity(city);
        setDataDistricts(city.districts);
        setDistrict(district);
        setDataWards(district.wards);
        setWards(ward);
        setIsModalOpen(false);
    };

    const handleOpenEditModel = () => {
        setIsModalOpen(true);
    };

    // Catch city change to change district and ward
    const handleCityChange = (value) => {
        const listDistrict = dataCity.find((item) => item.code === value);
        if (listDistrict) {
            setCity(listDistrict);
            setDataDistricts(listDistrict?.districts);
            setDistrict(listDistrict?.districts[0]);
            setWards(listDistrict?.districts[0].wards[0]);
        }
    };
    // Catch district change to change ward data
    const handleDistrictsChange = (value) => {
        const districtValue = dataDistricts.find((item) => item.code === value);
        setDistrict(districtValue);
        setWards(districtValue.wards[0]);
    };
    // Catch ward change to get data
    const handleWardsChange = (value) => {
        const wardValue = dataWards.find((item) => item.code === value);
        setWards(wardValue);
    };

    // Set initial data for city, district and ward
    useEffect(() => {
        if (dataCity) {
            const city = dataCity.find((item) => item.code === data.cityCode);
            const district = city.districts.find((item) => item.code === data.districtCode);
            const ward = district.wards.find((item) => item.code === data.wardCode);
            setCity(city);
            setDataDistricts(city.districts);
            setDistrict(district);
            setDataWards(district.wards);
            setWards(ward);
        }
    }, [data.cityCode, data.districtCode, data.wardCode, dataCity]);

    // To get all district when city change
    useEffect(() => {
        if (city) {
            setDataDistricts(city.districts);
        }
    }, [city]);

    // To get all ward when district change
    useEffect(() => {
        if (district || dataDistricts) {
            setDataWards(district?.wards || dataDistricts[0].wards);
        }
    }, [district, dataDistricts]);

    return (
        <div className="w-full flex flex-col gap-2 border-b-2 pb-8 border-dashed last:border-none">
            <section className="flex justify-between max-sm:gap-3">
                <div className="flex gap-5 w-11/12">
                    <p className="font-medium text-base max-sm:text-sm max-sm:w-7/12 max-sm:line-clamp-2 line-clamp-1 max-w-[60%]">
                        {data?.fullName}
                    </p>
                    <div className="flex gap-5">
                        <button onClick={() => handleOpenEditModel(data)}>
                            <img src="/assets/svg/pencil.svg" alt="icon pencil" />
                        </button>
                        <button
                            onClick={onClickSetDefault}
                            disabled={data?.isDefault}
                            className={`border-secondary max-sm:w-20 border max-sm:text-xs px-2 py-1 font-normal max-sm:text-[10px] text-xs ${
                                data?.isDefault ? 'text-secondary' : 'bg-secondary text-white'
                            }`}
                        >
                            {data?.isDefault ? 'Mặc định' : 'Đặt làm mặc định'}
                        </button>
                    </div>
                </div>
                <button onClick={handleDeleteAddress} className={`${data?.isDefault ? 'invisible' : 'btn-delete'} `}>
                    <img src="/assets/svg/delete_icon.svg" alt="icon pencil" />
                </button>
            </section>

            <section className="text-grey font-medium text-sm">{data?.phone}</section>

            <section className="text-grey font-medium text-sm">
                {data?.street}, {data?.ward}, {data?.district}, {data?.city}
            </section>
            <Modal
                title="THAY ĐỔI THÔNG TIN ĐỊA CHỈ"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={[
                    <button
                        form={id}
                        className="bg-secondary text-white px-5 rounded py-1.5 mt-4"
                        key="submit"
                        htmltype="submit"
                        type="submit"
                    >
                        Thay Đổi
                    </button>,
                ]}
            >
                <Formik
                    initialValues={initialFormValues}
                    validationSchema={validationAddressForm}
                    onSubmit={(values) => {
                        handleUpdateAddress(values);
                    }}
                    innerRef={formikRef}
                >
                    <Form className="flex flex-col gap-3 w-full" id={id}>
                        <section className="flex w-full my-2 gap-16 max-sm:flex-col max-sm:gap-4">
                            <div className="w-2/4 max-sm:w-full">
                                <p className="font-bold">Họ Và Tên</p>
                                <Field
                                    name="name"
                                    className=" focus:outline-none border-t-0 border-l-0 w-full border-r-0 text-sm border-b py-1 px-2 border-black focus-visible:outline-none"
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
                        {wards && (
                            <section className="grid grid-cols-3 max-sm:grid-cols-1 my-2 gap-3">
                                <div className="flex flex-col">
                                    <p className="font-bold">Tỉnh / Thành Phố</p>
                                    <Select
                                        value={city?.code}
                                        defaultValue={data.cityCode}
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
                                        defaultValue={data.districtCode}
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
        </div>
    );
}

export default AddressCard;
