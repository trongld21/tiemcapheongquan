import { Checkbox } from 'antd';
import CountQuantity from '../Utils/CountQuantity';
import convertToVND from '../Utils/convertToVND';
import { useRouter } from 'next/router';

function CartItems({ item, onClickUpdateQuantity, onClickDelete }) {
    const router = useRouter();
    return (
        <div className="h-fit max-sm:py-3 py-4 max-sm:px-3 px-5 rounded-lg justify-between max-sm:gap-4 gap-6 shadow flex mb-6">
            <section className="w-1/3 flex gap-2 ">
                <Checkbox key={item.cartId} value={item.cartId} />
                <div
                    className="w-full h-40 max-sm:h-28  cursor-pointer"
                    onClick={() => {
                        router.push(`/product/${item.productSlug}`);
                    }}
                >
                    <img
                        src={item.productImages[0]}
                        alt="thumbnail"
                        className="w-full h-full overflow-hidden object-cover rounded-lg mx-2"
                    />
                </div>
            </section>

            <section className="flex gap-2 max-sm:gap-0 h-fit w-full items-center">
                <div className="w-full flex flex-col gap-2">
                    <h1
                        className="line-clamp-1 font-bold text-base  cursor-pointer"
                        onClick={() => {
                            router.push(`/product/${item.productSlug}`);
                        }}
                    >
                        {item.productName}
                    </h1>
                    <div className="w-full flex flex-col gap-2 max-sm:text-xs">
                        <p>
                            Danh mục: <b className="text-black">{item.category}</b>
                        </p>
                        <p className="font-normal max-sm:text-xs">{item.maxQuantity} sản phẩm có sẵn</p>
                        <CountQuantity
                            item={item}
                            onClickUpdateQuantity={onClickUpdateQuantity}
                            maxQuantity={item.maxQuantity}
                        />
                        <p className="font-bold text-lg max-sm:text-sm">{convertToVND(item.productPrice)}</p>
                    </div>
                </div>
                <img
                    className="cursor-pointer h-4 w-4"
                    src="/assets/svg/delete_icon.svg"
                    onClick={onClickDelete}
                    alt="delete"
                />
            </section>
        </div>
    );
}

export default CartItems;
