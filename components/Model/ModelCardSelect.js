import { Modal, message } from 'antd';
import { useState } from 'react';

function ModelCardSelect({ item, modelSelect, setModelSelect }) {
    const [messageApi, contextHolder] = message.useMessage();
    const [previewOpen, setPreviewOpen] = useState(false);

    const handleCancel = () => setPreviewOpen(false);

    const handleSelectModel = (item) => {
        messageApi.open({
            type: 'success',
            content: 'Đã áp dụng mô hình cho sản phẩm thành công',
        });
        setModelSelect(item);
    };
    return (
        <>
            {contextHolder}
            <div
                key={item.product3DModelId}
                onClick={() => handleSelectModel(item)}
                className={`h-40 w-40 border-2 p-2 rounded-lg border-dashed flex group relative justify-center items-center hover:border-secondary cursor-pointer ${
                    modelSelect?.product3DModelId === item.product3DModelId ? 'border-secondary' : 'border'
                }`}
            >
                <img
                    src={item.thumbnailUrl}
                    alt="Thumbnail"
                    className="w-full h-full rounded-lg object-cover group-hover:opacity-25"
                />
                <img
                    className="hidden absolute center p-3 group-hover:flex"
                    src="/assets/svg/view.svg"
                    alt="View icon"
                    onClick={() => setPreviewOpen(true)}
                />
            </div>

            <Modal
                className="max-h-full my-auto"
                open={previewOpen}
                title={item.modelName}
                footer={null}
                onCancel={handleCancel}
            >
                {item.videoUrl && (
                    <video width="100%" controls>
                        <source src={item.videoUrl} />
                    </video>
                )}
            </Modal>
        </>
    );
}

export default ModelCardSelect;
