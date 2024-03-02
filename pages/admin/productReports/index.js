import React, { useEffect, useState } from 'react';
import { Empty, Space, Table, Tag } from 'antd';
import getServerSideProps from '@/lib/adminServerProps';
import AdminLayout from '@/components/Layout/AdminLayout';
import managerReportAPI from '@/pages/api/manager/managerReportAPI';
import { formateDateTime } from '@/components/Utils/FormatDate';
import useNotification from '@/hooks/useNotification';
import AdminTitle from '@/components/Admin/AdminTitle';

// Ant design component
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Modal } from 'antd';
import removeDiacritics from '@/components/Utils/removeDiacritics';
const { confirm } = Modal;

const Accept = 'Accept';
const Reject = 'Reject';
const orderStatus = {
    0: 'Pending',
    1: 'Accept',
    2: 'Reject',
};

const orderStatusMapping = {
    Pending: 'Chưa xử lý',
    Accept: 'Chấp nhận',
    Reject: 'Từ chối',
};

const Index = () => {
    const { showError, showSuccess } = useNotification();
    const [data, setData] = useState([]);
    const [dataSearch, setSearchData] = useState();
    const showConfirm = (productReportId, reportStatus) => {
        if (reportStatus == 'Accept') {
            confirm({
                title: 'Bạn có muốn chấp nhận báo cáo sản phẩm này?',
                icon: <ExclamationCircleFilled />,
                content: 'Dữ liệu sẽ không thể phục hồi',
                okType: 'danger',
                okText: 'Chấp nhận',
                cancelText: 'Quay lại',
                async onOk() {
                    // callback function
                    handleUpdateStatus(productReportId, reportStatus);
                },
                onCancel() {
                    console.log('Cancel');
                },
            });
        } else {
            confirm({
                title: 'Bạn có muốn từ chối báo cáo sản phẩm này?',
                icon: <ExclamationCircleFilled />,
                content: 'Dữ liệu sẽ không thể phục hồi',
                okType: 'danger',
                okText: 'Từ chối',
                cancelText: 'Quay lại',
                async onOk() {
                    // callback function
                    handleUpdateStatus(productReportId, reportStatus);
                },
                onCancel() {
                    console.log('Cancel');
                },
            });
        }
    };
    const fetchData = async () => {
        const res = await managerReportAPI.GetAllProductReport();
        if (res && res.success) {
            console.log(res.data);
            setData(res.data);
            setSearchData(res.data);
        }
    };

    function getStatusInVietnamese(statusEnglish) {
        console.log(statusEnglish);
        return orderStatusMapping[statusEnglish] || 'Trạng thái không hợp lệ';
    }

    const handleSearchOnchange = (event) => {
        const searchTerm = event.target.value.toLowerCase().trim(); // Chuyển giá trị nhập vào thành chữ thường và loại bỏ khoảng trống thừa
        if (searchTerm !== '') {
            const normalizedSearchTerm = removeDiacritics(searchTerm);
            const filtered = data.filter(
                (report) =>
                    removeDiacritics(report.userReportEmail.toLowerCase() || '').includes(normalizedSearchTerm) || // Tìm kiếm theo tiêu đề
                    removeDiacritics(report.userReportName.toLowerCase() || '').includes(normalizedSearchTerm) || // Tìm kiếm theo nội dung
                    removeDiacritics(report.productName.toLowerCase() || '').includes(normalizedSearchTerm) || // Tìm kiếm theo nội dung
                    removeDiacritics(report.productReportId.toLowerCase() || '').includes(normalizedSearchTerm), // Tìm kiếm theo nội dung
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
            title: 'Mã báo cáo',
            dataIndex: 'productReportId',
            render: (text) => <p className="font-semibold">{text}</p>,
        },
        {
            title: 'Email',
            dataIndex: 'userReportEmail',
            render: (text) => <p className="font-semibold max-w-[200px] break-words">{text}</p>,
        },
        {
            title: 'Tên',
            dataIndex: 'userReportName',
            render: (text) => <p className="font-semibold max-w-[200px] break-words">{text}</p>,
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'productName',
            render: (text) => <p className="font-semibold">{text}</p>,
        },
        {
            title: 'Lí do',
            dataIndex: 'reason',
            render: (text) => <p className="font-semibold max-w-[200px] break-words">{text}</p>,
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
        {
            title: 'Trạng thái',
            dataIndex: 'reportStatus',
            render: (status) => (
                <Tag
                    color={
                        status === orderStatus[0]
                            ? 'default'
                            : status === orderStatus[1]
                            ? 'success'
                            : status === orderStatus[2]
                            ? 'error'
                            : status === orderStatus[3]
                    }
                >
                    {getStatusInVietnamese(status)}
                </Tag>
            ),
        },
        {
            title: 'Hành động',
            dataIndex: 'productReportId',
            render: (productReportId, record) => {
                return (
                    <div className="flex gap-4 text-gray-50">
                        {record.reportStatus === 'Pending' && (
                            <>
                                <button className="btn-accept" onClick={() => showConfirm(productReportId, Accept)}>
                                    <img src="/svgs/check.svg" alt="accept" />
                                </button>
                                <button className="btn-reject" onClick={() => showConfirm(productReportId, Reject)}>
                                    <img src="/svgs/cancel.svg" alt="reject" />
                                </button>
                            </>
                        )}
                    </div>
                );
            },
        },
    ];

    const handleUpdateStatus = async (productReportId, reportStatus) => {
        const res = await managerReportAPI.UpdateProductReport(productReportId, reportStatus);
        if (res && res.success) {
            if (reportStatus == 'Accept') {
                showSuccess('Chấp nhận báo cáo thành công', '', 1);
            } else {
                showSuccess('Từ chối báo cáo thành công', '', 1);
            }
            fetchData();
        } else {
            showError('Thao tác thất bại', '', 1);
        }
    };

    const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };

    return (
        <AdminLayout>
            <AdminTitle content="Báo cáo sản phẩm" />
            <div className="flex flex-col gap-10">
                <section className="flex justify-between text-sm items-center">
                    <div className="w-8/12 border-b relative  h-fit">
                        <input
                            placeholder="Tìm kiếm báo cáo"
                            className="outline-none p-2 w-full rounded-lg"
                            onChange={handleSearchOnchange}
                        />
                    </div>
                </section>
                <section>
                    {dataSearch?.length > 0 ? (
                        <Table
                            columns={columns}
                            rowKey="productReportId"
                            dataSource={dataSearch || []}
                            onChange={onChange}
                        />
                    ) : (
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={'Chưa có dữ liệu'} />
                    )}
                </section>
            </div>
        </AdminLayout>
    );
};

export default Index;

export { getServerSideProps };
