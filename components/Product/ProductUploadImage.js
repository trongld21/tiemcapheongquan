import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Modal, Upload, message } from 'antd';
const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

function ProductUploadImage({ fileList, setFileList, setFieldValue, disable = false }) {
    const [messageApi, contextHolder] = message.useMessage();

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const handleCancel = () => setPreviewOpen(false);
    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };
    const handleChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
        setFieldValue('image', newFileList);
    };
    const uploadButton = (
        <div>
            <PlusOutlined />
            <div
                style={{
                    marginTop: 8,
                }}
            >
                Upload
            </div>
        </div>
    );

    return (
        <div className="flex flex-col gap-1">
            {contextHolder}

            <label className="font-bold text-sm">Danh sách ảnh sản phẩm: </label>
            <Upload
                disabled={disable}
                beforeUpload={(file) => {
                    const acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
                    const isAcceptedType = acceptedTypes.includes(file.type);
                    if (!isAcceptedType) {
                        message.error(`Chỉ chấp nhận tệp hình ảnh (jpg, jpeg, png, gif).`);
                    }
                    return isAcceptedType || Upload.LIST_IGNORE;
                }}
                accept="image/*"
                style={{ height: '150px' }}
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
            >
                {fileList.length >= 8 ? null : uploadButton}
            </Upload>
            <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                <img
                    alt="example"
                    style={{
                        width: '100%',
                    }}
                    src={previewImage}
                />
            </Modal>
        </div>
    );
}

export default ProductUploadImage;
