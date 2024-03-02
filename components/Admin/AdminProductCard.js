import managerProductAPI from '@/pages/api/manager/managerProductAPI';
import { Checkbox, Popover } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

function AdminProductCard({ thumbnails, name, quantity, id, description, price, category, onDelete, slug }) {
    const [statePopup, setStatePopup] = useState(false);
    const parser = new DOMParser();
    const desc = parser.parseFromString(description, 'text/html');
    const handleShowHidePopup = () => {
        setStatePopup(!statePopup);
    };

    // const content = (
    //     <div>
    //         <Link href={`/admin/products/edit/${slug}`}>
    //             <p className="text-sm">Sửa</p>
    //         </Link>
    //         <p onClick={onDelete} className="text-sm cursor-pointer">
    //             Xóa
    //         </p>
    //     </div>
    // );
    const buttonWidth = 70;
    return (
        <div className="flex gap-4 p-4 rounded-md border border-secondary justify-between">
            <div className="w-5/12 h-32">
                <Link href={`/admin/products/detail/${slug}`} className="">
                    <img
                        className="object-center h-full w-full object-cover"
                        src={thumbnails}
                        alt="product thumbnail"
                    />
                </Link>
            </div>
            <ul className="w-7/12 text-xs flex justify-between flex-wrap items-center">
                <li className="w-5/12">
                    <p className="text-secondary">Tên hiển thị</p>
                    <Link href={`/admin/products/detail/${slug}`} className="">
                        <h3 className="text-sm font-semibold truncate">{name}</h3>
                    </Link>
                </li>
                <li className="w-5/12">
                    <p className="text-secondary">Số lượng</p>
                    <h3 className="text-sm font-semibold truncate">{quantity}</h3>
                </li>
                <li className="w-5/12">
                    <p className="text-secondary">Mã sản phẩm</p>
                    <h3 className="text-sm font-semibold truncate">{id}</h3>
                </li>
                <li className="w-5/12">
                    <p className="text-secondary">Danh mục</p>
                    <h3 className="text-sm font-semibold truncate">{category}</h3>
                </li>
                <li className="w-5/12">
                    <p className="text-secondary">Mô tả</p>
                    <h3 className="text-sm font-semibold truncate">{desc.body.textContent}</h3>
                </li>
                <li className="w-5/12">
                    <p className="text-secondary">Giá</p>
                    <h3 className="text-sm font-semibold truncate">{price}</h3>
                </li>
            </ul>
            <div className=" flex justify-end items-start h-fit">
                {/* <Popover placement="left" content={content} trigger="click">
                    <img className="cursor-pointer h-fit" src="/assets/svg/dots.svg" alt="" />
                </Popover> */}
                <Link href={`/admin/products/edit/${slug}`}>
                    <img className="cursor-pointer h-fit pr-3" src="/assets/svg/pencil.svg" alt="" />
                </Link>
                <p onClick={onDelete} className="text-sm cursor-pointer">
                    <img className="cursor-pointer h-fit" src="/assets/svg/delete_icon.svg" alt="" />
                </p>
            </div>
        </div>
    );
}

export default AdminProductCard;
