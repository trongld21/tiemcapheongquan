import React, { use, useEffect, useState } from 'react';
import { Table, Tag } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Modal } from 'antd';
const { confirm } = Modal;

import AdminLayout from '@/components/Layout/AdminLayout';
import useNotification from '@/hooks/useNotification';
import managerAccountAPI from '@/pages/api/manager/managerAccountAPI';
import { formateDateTime } from '@/components/Utils/FormatDate';
import getServerSideProps from '@/lib/adminServerProps';
import AdminTitle from '@/components/Admin/AdminTitle';
import removeDiacritics from '@/components/Utils/removeDiacritics';
const Role = ['Customer', 'Admin'];
const Index = () => {
    const { showError, showSuccess } = useNotification();
    const [data, setData] = useState([]);
    const [dataSearch, setSearchData] = useState();
    const [searchValue, setSearchValue] = useState('');

    const getGenderInVietnamese = (gender) => {
        const genderMapping = {
            Male: 'Nam',
            Female: 'Nữ',
            Other: 'Khác',
        };

        return genderMapping[gender] || gender;
    };
    const fetchData = async () => {
        const res = await managerAccountAPI.GetAllUser();
        if (res && res.success) {
            setData(res.data);
            setSearchData(res.data);
        }
    };
    const showConfirm = (id) => {
        confirm({
            title: 'Bạn có muốn tài khoản này?',
            icon: <ExclamationCircleFilled />,
            content: 'Dữ liệu đã xóa không thể phục hồi',
            okType: 'danger',
            async onOk() {
                // callback function
                handleDelete(id);
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };
    const handleSearchOnchange = (event) => {
        const searchTerm = event.target.value.trim().toLowerCase();
        setSearchValue(event.target.value);

        if (searchTerm !== '') {
            const normalizedSearchTerm = removeDiacritics(searchTerm); // Chuẩn hóa không dấu bằng lodash
            const filtered = data.filter(
                (acc) =>
                    removeDiacritics(acc.email.toLowerCase()).includes(normalizedSearchTerm) ||
                    removeDiacritics(acc.fullName.toLowerCase()).includes(normalizedSearchTerm),
            );
            setSearchData(filtered);
        } else {
            setSearchData(data);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const columns = [
        {
            title: 'Ảnh đại diện',
            dataIndex: 'avatarUrl',
            render: (text) => (
                <div className="w-24">
                    <img src={text ? text : '/assets/images/default_avatar.jpeg'} alt="avatar" />
                </div>
            ),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            render: (text) => <p className="font-semibold max-w-[200px] break-words line-clamp-1">{text}</p>,
        },
        {
            title: 'Họ và tên',
            dataIndex: 'fullName',
            render: (text) => <p className="font-semibold line-clamp-1 max-w-[250px]">{text}</p>,
        },
        {
            title: 'Giới tính',
            dataIndex: 'gender',
            render: (text) => <p className="font-semibold">{getGenderInVietnamese(text)}</p>,
        },
        {
            title: 'Ngày tháng năm sinh',
            dataIndex: 'birthDay',
            render: (text) => {
                let dateTime = formateDateTime(text);
                return (
                    <p className="font-semibold">
                        {dateTime.datePart === 'Invalid date' ? 'Chưa cập nhật' : dateTime.datePart}
                        <br />
                        <b className="text-grey text-sm font-medium">{dateTime.timePart}</b>
                    </p>
                );
            },
        },
        {
            title: 'Vai trò',
            dataIndex: 'role',
            render: (text, record) => (
                <select
                    // value={text}
                    onChange={(e) => {
                        handleUpdateRole(record.userId, e.target.value);
                        setSearchValue('');
                    }}
                    className="border-none"
                >
                    <option value="" disabled>
                        Chọn vai trò
                    </option>
                    <option value={Role[0]} selected={record.role == 'Customer'}>
                        Khách hàng
                    </option>
                    <option value={Role[1]} selected={record.role == 'Admin'}>
                        Quản trị viên
                    </option>
                </select>
            ),
        },
        {
            title: 'Thời gian tạo',
            dataIndex: 'createdAt',
            render: (text) => {
                const dateTime = formateDateTime(text);
                return (
                    <p className="font-semibold">
                        {dateTime.datePart}
                        <br />
                        <b className="text-grey text-sm font-medium">{dateTime.timePart}</b>
                    </p>
                );
            },
        },
        {
            title: 'Thời gian cập nhật',
            dataIndex: 'updatedAt',
            render: (text) => {
                const dateTime = formateDateTime(text);

                return (
                    <p className="font-semibold">
                        {dateTime.datePart}
                        <br />
                        <b className="text-grey text-sm font-medium">{dateTime.timePart}</b>
                    </p>
                );
            },
        },
        // {
        //     title: 'Hoạt động',
        //     dataIndex: 'userId',
        //     render: (userId) => {
        //         return (
        //             <div className="flex gap-4 text-gray-50">
        //                 <button onClick={() => showConfirm(userId)}>
        //                     <img src="/assets/svg/delete_icon_red.svg" className="w-8 h-8" alt="reject" />
        //                 </button>
        //             </div>
        //         );
        //     },
        // },
    ];

    const handleUpdateRole = async (userId, role) => {
        const res = await managerAccountAPI.UpdateRole(userId, role);
        if (res && res.success) {
            showSuccess('Cập nhật thành công tài khoản vai trò', `Cập nhật quyền của ${userId} thành công!`, 1);

            // Tạo một bản sao của mảng data
            const updatedData = [...data];

            // Tìm vị trí của người dùng trong mảng data
            const userIndex = updatedData.findIndex((user) => user.userId === userId);

            // Nếu người dùng được tìm thấy trong mảng data
            if (userIndex !== -1) {
                // Cập nhật trường thời gian cập nhật cho người dùng tương ứng
                const currentTime = new Date();
                currentTime.setHours(currentTime.getHours() + 7);
                updatedData[userIndex].updatedAt = currentTime.toISOString();
                // Cập nhật trạng thái dữ liệu với mảng đã cập nhật
                setData(updatedData);
            }
        } else {
            showError('Cập nhật thất bại', $`Cập nhật quyền của ${userId} thất bại!`, 1);
        }
    };

    const handleDelete = async (userId) => {
        const res = await managerAccountAPI.Delete(userId);
        if (res && res.success) {
            showSuccess('Xóa tài khoản thành công', $`Xóa tài khoản ${userId} thành công!`, 1);
            fetchData();
        } else {
            showError('Xóa tài khoản thất bại', $`Xóa tài khoản ${userId} thất bại!`, 1);
        }
    };

    const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };

    return (
        <AdminLayout>
            <AdminTitle content="Quản lý tài khoản" />
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
                </section>
                <section>
                    <Table columns={columns} rowKey="userId" dataSource={dataSearch || []} onChange={onChange} />
                </section>
            </div>
        </AdminLayout>
    );
};

export default Index;

export { getServerSideProps };
