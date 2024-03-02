import React from 'react';
import { Pagination } from 'antd';

function AdminPagination({ currentPage, totalItems, itemsPerPage, onPageChange }) {
    const handlePageChange = (page) => {
        onPageChange(page);
    };

    return totalItems > itemsPerPage ? ( // Kiểm tra nếu tổng số mục lớn hơn số mục trên mỗi trang
        <Pagination
            current={currentPage}
            pageSize={itemsPerPage}
            total={totalItems}
            onChange={handlePageChange}
            showSizeChanger={false}
        />
    ) : null; // Ẩn thanh phân trang nếu không đủ mục để phân trang
}

export default AdminPagination;
