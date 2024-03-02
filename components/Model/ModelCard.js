import React, { useState } from 'react';
import { Modal, Upload } from 'antd';
// Ant design component
import { ExclamationCircleFilled } from '@ant-design/icons';
const { confirm } = Modal;

function ModelCard({ id, name, videoUrl, thumbnails, productName, modelUrl, onDelete }) {
    const [previewOpen, setPreviewOpen] = useState(false);
    const handleCancel = () => setPreviewOpen(false);

    // Show popup to confirm after delete
    const showConfirm = (id) => {
        confirm({
            title: 'Bạn có muốn xóa model này?',
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
    return (
        <>
            <div className="w-full h-48 lg:h-96 rounded-md justify-between flex flex-col border-dashed border-2 p-4">
                <img
                    src={thumbnails || ''}
                    className="w-full cursor-pointer hover:opacity-25 h-36 lg:h-64 object-cover rounded"
                    alt="thumbnails"
                    onClick={() => setPreviewOpen(true)}
                />
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="font-semibold text-secondary text-xl">{name}</h3>

                        {productName ? (
                            <p className="text-sm line-clamp-2 w-12/12">
                                Mô hình đã được áp dụng cho sản phẩm: {productName}
                            </p>
                        ) : (
                            <p className="text-sm line-clamp-2 w-12/12">Mô hình chưa được dùng cho sản phẩm</p>
                        )}
                    </div>
                    <img
                        className="w-3 h-3  cursor-pointer"
                        onClick={() => showConfirm(id)}
                        src="/assets/svg/delete_icon.svg"
                        alt="delete"
                    />
                </div>
            </div>
            <Modal
                className="max-h-full my-auto"
                destroyOnClose={true}
                open={previewOpen}
                title={name}
                footer={null}
                onCancel={handleCancel}
            >
                {videoUrl && (
                    <video width="100%" controls>
                        <source src={videoUrl} />
                    </video>
                )}
            </Modal>
        </>
    );
}

export default ModelCard;
