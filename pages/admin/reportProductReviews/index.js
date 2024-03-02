import React, { useEffect, useState } from 'react';
import { Empty, Table, Tag } from 'antd';

import AdminLayout from '@/components/Layout/AdminLayout';
import useNotification from '@/hooks/useNotification';
import { formateDateTime } from '@/components/Utils/FormatDate';

import managerReportAPI from '@/pages/api/manager/managerReportAPI';

import getServerSideProps from '@/lib/adminServerProps';
import AdminTitle from '@/components/Admin/AdminTitle';
import removeDiacritics from '@/components/Utils/removeDiacritics';
// Ant design component
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Modal } from 'antd';
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

    function getStatusInVietnamese(statusEnglish) {
        return orderStatusMapping[statusEnglish] || 'Trạng thái không hợp lệ';
    }

    const fetchData = async () => {
        const res = await managerReportAPI.GetAllReportProductReview();
        if (res && res.success) {
            setData(res.data);
            setSearchData(res.data);
        }
    };
    const handleSearchOnchange = (event) => {
        const searchTerm = event.target.value.toLowerCase().trim(); // Chuyển giá trị nhập vào thành chữ thường và loại bỏ khoảng trống thừa

        if (searchTerm !== '') {
            const normalizedSearchTerm = removeDiacritics(searchTerm);
            const filtered = data.filter(
                (report) =>
                    removeDiacritics(report.userReportEmail.toLowerCase() || '').includes(normalizedSearchTerm) || // Tìm kiếm theo tiêu đề
                    removeDiacritics(report.userReportName.toLowerCase() || '').includes(normalizedSearchTerm) || // Tìm kiếm theo nội dung
                    removeDiacritics(report.reportProductReviewId.toLowerCase() || '').includes(normalizedSearchTerm), // Tìm kiếm theo nội dung
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
            title: 'Mã số',
            dataIndex: 'reportProductReviewId',
            render: (text) => <p className="font-semibold">{text}</p>,
        },
        {
            title: 'Người báo cáo',
            dataIndex: 'userReportName',
            render: (text) => <p className="font-semibold max-w-[200px] break-words">{text}</p>,
        },
        {
            title: 'Email',
            dataIndex: 'userReportEmail',
            render: (text) => <p className="font-semibold max-w-[200px] break-words">{text}</p>,
        },
        {
            title: 'Đánh giá',
            dataIndex: 'productReviewReportedDescription',
            render: (text) => <p className="font-semibold max-w-[200px] break-words">{text}</p>,
        },
        {
            title: 'Lí do',
            dataIndex: 'reason',
            render: (text) => <p className="font-semibold max-w-[200px] break-words">{text}</p>,
        },
        {
            title: 'Thời gian',
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
            title: 'Được cập nhât',
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
            dataIndex: 'reportProductReviewId',
            render: (reportProductReviewId, record) => {
                return (
                    <div className="flex gap-4 text-gray-50">
                        {record.reportStatus === 'Pending' && (
                            <>
                                <button
                                    className="btn-accept"
                                    onClick={() => showConfirm(reportProductReviewId, Accept)}
                                >
                                    <img className="btn-accept" src="/svgs/check.svg" alt="accept" />
                                </button>
                                <button
                                    className="btn-reject"
                                    onClick={() => showConfirm(reportProductReviewId, Reject)}
                                >
                                    <img className="btn-reject" src="/svgs/cancel.svg" alt="reject" />
                                </button>
                            </>
                        )}
                    </div>
                );
            },
        },
    ];
    const showConfirm = (reportProductReviewId, reportStatus) => {
        if (reportStatus == 'Accept') {
            confirm({
                title: 'Bạn có muốn chấp nhận báo cáo này?',
                icon: <ExclamationCircleFilled />,
                content: 'Dữ liệu sẽ không thể phục hồi',
                okType: 'danger',
                okText: 'Chấp nhận',
                cancelText: 'Quay lại',
                async onOk() {
                    // callback function
                    handleUpdateStatus(reportProductReviewId, reportStatus);
                },
                onCancel() {
                    console.log('Cancel');
                },
            });
        } else {
            confirm({
                title: 'Bạn có muốn từ chối báo cáo này?',
                icon: <ExclamationCircleFilled />,
                content: 'Dữ liệu sẽ không thể phục hồi',
                okType: 'danger',
                okText: 'Từ chối',
                cancelText: 'Quay lại',
                async onOk() {
                    // callback function
                    handleUpdateStatus(reportProductReviewId, reportStatus);
                },
                onCancel() {
                    console.log('Cancel');
                },
            });
        }
    };

    const handleUpdateStatus = async (reportProductReviewId, reportStatus) => {
        const res = await managerReportAPI.UpdateReportProductReview(reportProductReviewId, reportStatus);
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
            <AdminTitle content="Báo cáo đánh giá của sản phẩm" />
            <div className="flex flex-col gap-10">
                <section className="flex justify-between text-sm items-center">
                    <div className="w-8/12 relative border-b h-fit">
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
                            rowKey="reportProductReviewId"
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
