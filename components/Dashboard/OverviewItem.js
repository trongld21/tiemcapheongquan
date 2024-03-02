import Image from 'next/image';

const OverviewItem = ({ urlIcon, title, total }) => {
    return (
        <div className="w-60 min-h-24 border-solid border-2 border-gray-600 rounded-lg flex flex-col gap-4 p-4 items-start justify-start">
            <div className="flex justify-start items-center gap-2">
                <Image src={urlIcon || ''} width={16} height={16} alt="icon item" />
                <p className="text-grey">{title}</p>
            </div>
            <h2 className="font-medium text-2xl text-center w-full">{total}</h2>
        </div>
    );
};
export default OverviewItem;
