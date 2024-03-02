import { message } from 'antd';
import ModelCardSelect from './ModelCardSelect';

function ModelListValid({ listModel, modelSelect, setModelSelect }) {
    const [messageApi, contextHolder] = message.useMessage();

    const handleSelectEmptyModel = () => {
        messageApi.open({
            type: 'warning',
            content: 'Sản phẩm không áp dụng mô hình',
        });
        setModelSelect(null);
    };

    return (
        <div className="flex flex-col gap-2">
            {contextHolder}

            <section className="font-bold text-sm">Danh sách Model:</section>
            <section className="grid max-sm:grid-cols-2 grid-cols-3 xl:grid-cols-5 gap-10">
                <div
                    onClick={() => handleSelectEmptyModel()}
                    className={`h-40 w-40 border-2 rounded-lg border-dashed flex justify-center items-center hover:border-secondary cursor-pointer ${
                        !modelSelect && 'border-secondary'
                    }`}
                >
                    <p className="font-bold text-sm">Không có Model</p>
                </div>
                {listModel.map((item) => (
                    <ModelCardSelect
                        key={item.product3DModelId}
                        item={item}
                        modelSelect={modelSelect}
                        setModelSelect={setModelSelect}
                    />
                ))}
            </section>
        </div>
    );
}

export default ModelListValid;
