import { useState } from 'react';
// Ant design component
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Modal } from 'antd';
const { confirm } = Modal;
// Api
import apiArticle from '@/pages/api/apiArticle';
// Custom hook
import useNotification from '@/hooks/useNotification';
import Link from 'next/link';
import { formatDateForInput, formateDateTime } from '../Utils/FormatDate';

const ArticleItem = ({ urlThumbnail, title, author, createdDate, description, slug, id, published, onDelete }) => {
    const { showError, showSuccess, showWarning } = useNotification();
    const [isPublic, setIsPublic] = useState(published);

    // Show popup to confirm after delete
    const showConfirm = (id) => {
        confirm({
            title: 'Bạn có muốn xóa bài viết này?',
            icon: <ExclamationCircleFilled />,
            content: 'Dữ liệu đã xóa không thể phục hồi',
            okType: 'danger',
            okText: 'Xóa',
            cancelText: 'Quay lại',
            async onOk() {
                // callback function
                onDelete(id);
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };

    // Function to handle checkbox change status to public
    const handleCheckboxChange = async (id) => {
        setIsPublic(!isPublic);
        const res = await apiArticle.SetPublicArticle(id, !isPublic);
        console.log(res);
        if (res) {
            if (!isPublic) {
                showSuccess('Thay đổi trạng thái thành công', 'Bài viết này sẽ được xuất bản ', 2);
            } else {
                showWarning('Thay đổi trạng thái thành công', 'Bài đăng này sẽ được ẩn', 2);
            }
        } else {
            showError(
                'Thay đổi trạng thái không thành công',
                'Một số lỗi khi thay đổi trạng thái, Vui lòng thử lại',
                2,
            );
        }
    };

    return (
        <div className="flex group relative justify-start items-start border-solid border border-transparent hover:border-secondary rounded-10">
            <figure className="w-1/3">
                <img
                    src={urlThumbnail}
                    alt="thumbnail"
                    className="h-64 w-full object-cover rounded-tl-10 rounded-bl-10"
                />
            </figure>
            <div className="px-10 py-5 flex flex-col w-2/3 gap-2.5">
                <span className="text-secondary text-sm font-inter font-normal">{formatDateForInput(createdDate)}</span>
                <h1 className="text-black text-2xl font-oswald font-semibold leading-tight uppercase h-14 overflow-hidden">
                    {title}
                </h1>
                <p className="text-secondary text-sm font-inter font-normal leading-normal">Bởi: {author}</p>
                <div className="text-black text-sm font-normal font-inter line-clamp-4 h-10 overflow-hidden">
                    <div dangerouslySetInnerHTML={{ __html: description }} />
                </div>
                <div className="flex justify-between items-center">
                    <div className="flex flex-start gap-3 lg:gap-6">
                        <Link
                            href={`/admin/articles/detail/${slug}`}
                            className="text-sm rounded-md flex justify-center items-center font-normal lg:font-semibold border border-black w-32 h-9"
                        >
                            Xem chi tiết
                        </Link>
                        <Link
                            href={`/admin/articles/edit/${slug}`}
                            className="w-fit h-fit flex gap-2 justify-center items-center bg-black text-white px-2.5 py-1.5 rounded-md"
                        >
                            <img src="/assets/svg/pencil_white.svg" alt="icon" />
                            <p className="font-normal text-sm lg:font-semibold">Chỉnh sửa</p>
                        </Link>
                    </div>
                    <div>
                        <input
                            type="checkbox"
                            checked={isPublic}
                            onChange={() => handleCheckboxChange(id)}
                            className="form-checkbox cursor-pointer h-5 w-5 text-black mr-2"
                        />
                        <label className="text-sm font-normal lg:font-semibold">Hiển thị</label>
                    </div>
                </div>
            </div>
            <div className="absolute top-3 group-hover:flex hidden right-3 cursor-pointer">
                <img onClick={() => showConfirm(id)} src="/assets/svg/delete_icon.svg" alt="delete icon" />
            </div>
        </div>
    );
};

export default ArticleItem;
