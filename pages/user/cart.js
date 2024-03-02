import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
// Component
import CartItems from '@/components/Cart/CartItems';
import UserLayout from '@/components/Layout/UserLayout';
import PrimaryButton from '@/components/Utils/PrimaryButton';
import Thumbnail from '@/components/Utils/Thumbnail';
import convertToVND from '@/components/Utils/convertToVND';
// custom hook
import useNotification from '@/hooks/useNotification';
import { UserContext } from '@/contexts/userContext';
// Ant design component
import { Modal, Checkbox, Empty } from 'antd';
const CheckboxGroup = Checkbox.Group;
import { ExclamationCircleFilled } from '@ant-design/icons';
const { confirm } = Modal;
// Api
import apiCart from '../api/user/apiCart';
// Author
import getServerSideProps from '@/lib/userServerProps';
import apiUserAddress from '../api/user/apiUserAddress';
import Spinner from '@/components/Utils/Spinner';

function Cart() {
    const router = useRouter();
    const { orderInfo, setOrderInfo } = useContext(UserContext);
    const { showWarning } = useNotification();
    const [data, setData] = useState();
    const [showItem, setShowItem] = useState();
    const [checkedList, setCheckedList] = useState();
    const [selectedItems, setSelectedItems] = useState([]);
    const [indeterminate, setIndeterminate] = useState(true);
    const [totalCart, setTotalCart] = useState(0);
    const [checkAll, setCheckAll] = useState(false);
    const [canPayment, setCanPayment] = useState(false);

    const onChange = (list) => {
        setCheckedList(list);
        setIndeterminate(!!list.length && list.length < data.length);
        setCheckAll(list.length === data.length);
    };
    const onCheckAllChange = (e) => {
        setCheckedList(e.target.checked ? data.map((item) => item.cartId) : []);
        setIndeterminate(false);
        setCheckAll(e.target.checked);
    };

    // Check selected items is valid and checkout
    const handleCheckout = (selectedItems) => {
        if (selectedItems && selectedItems.length > 0) {
            // Set order info to context
            setOrderInfo(selectedItems);
            const itemSelectedJSON = JSON.stringify(selectedItems);
            localStorage.setItem('itemsCart', itemSelectedJSON);
            if (canPayment) {
                router.push('/user/payment');
            } else {
                showWarning('Không tìm thấy địa chỉ!', 'Vui lòng cung cấp địa chỉ giao hàng', 3);
                router.push('/user/address');
            }
        } else {
            showWarning('Không có sản phẩm để thanh toán', 'Vui lòng chọn ít nhất 1 sản phẩm để thanh toán', 5);
        }
    };

    // Fetch user address after make order
    const fetchUserAddress = async () => {
        try {
            const res = await apiUserAddress.GetUserAddressDefault();
            if (res && res.success) {
                setCanPayment(true);
            } else {
                setCanPayment(false);
            }
        } catch (error) {
            console.log(error);
        }
    };

    // Show popup to confirm after delete
    const showConfirm = (cartId, productName) => {
        confirm({
            title: `Xóa sản phẩm "${productName}" khỏi giỏ hàng?`,
            icon: <ExclamationCircleFilled />,
            content: 'Sản phẩm sẽ bị xóa khỏi giỏ hàng và không thể khôi phục lại',
            okText: 'Xóa',
            okType: 'danger',
            async onOk() {
                try {
                    await apiCart.Delete(cartId);
                    fetchData();
                } catch (err) {
                    console.log('🚀 ~ file: cart.js:55 ~ handleDeleteCart ~ err:', err);
                }
            },
            cancelText: 'Hủy',
            onCancel() {
                console.log('Cancel');
            },
        });
    };

    // Fetch data using api
    const fetchData = async () => {
        try {
            const response = await apiCart.GetAll();
            if (response && response.success) {
                setData(response.data);
                console.log(data);
            }
        } catch (err) {
            console.log(err.message);
        }
    };

    // Fetch list of cart
    useEffect(() => {
        fetchData();
        fetchUserAddress();
    }, []);

    // Check items selected before
    useEffect(() => {
        if (orderInfo) {
            setCheckedList(orderInfo.map((item) => item.cartId));
        }
    }, [orderInfo]);

    // Render list of checked
    useEffect(() => {
        if (data && checkedList) {
            setSelectedItems(data.filter((item) => checkedList.includes(item.cartId)));
        }
    }, [checkedList, data]);

    // Total price
    useEffect(() => {
        setTotalCart(selectedItems.reduce((total, item) => total + item.productPrice * item.quantity, 0));
    }, [selectedItems]);

    // Update product quantity
    const handleUpdateQuantity = async (cartId, quantity) => {
        try {
            await apiCart.UpdateQuantity(cartId, quantity);
            setCheckedList((prevItems) => {
                const updatedItems = prevItems.map((item) => {
                    if (item.cartId === cartId) {
                        return {
                            ...item,
                            quantity: quantity,
                        };
                    }
                    return item;
                });

                return updatedItems;
            });
            fetchData();
        } catch (err) {
            console.log('🚀 ~ file: cart.js:65 ~ handleUpdateQuantity ~ err:', err);
        }
    };

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const handleStart = () => {
            setLoading(true);
        };
        const handleComplete = () => {
            setLoading(false);
        };

        router.events.on('routeChangeStart', handleStart);
        router.events.on('routeChangeComplete', handleComplete);
        router.events.on('routeChangeError', handleComplete);

        return () => {
            router.events.off('routeChangeStart', handleStart);
            router.events.off('routeChangeComplete', handleComplete);
            router.events.off('routeChangeError', handleComplete);
        };
    }, [router]);

    return (
        <UserLayout>
            <Thumbnail title={'Giỏ hàng'} />
            {loading && <Spinner />}
            <div className="max-sm:w-full w-11/12 lg:w-4/5 mx-auto my-10">
                <div
                    className={`${
                        data?.length <= 0 && 'hidden'
                    } max-sm:w-11/12 w-10/12 lg:w-8/12 max-sm:text-sm mx-auto lg:mx-0 flex`}
                >
                    <Checkbox
                        className="flex justify-center items-center relative"
                        indeterminate={indeterminate}
                        onChange={onCheckAllChange}
                        checked={checkAll}
                    >
                        {!checkAll && (
                            <span className="absolute p-[8px] bg-white border rounded-md -left-[1px] bottom-[3px]"></span>
                        )}
                        Chọn tất cả
                    </Checkbox>
                    <p className="w-fit my-auto"> / {data?.length} Sản phẩm</p>
                </div>
                <div className="flex my-8 gap-2 lg:gap-6 flex-wrap lg:flex-nowrap">
                    <section className="max-sm:w-11/12 w-10/12 lg:w-8/12 max-sm:text-sm mx-auto text-base gap-3">
                        <CheckboxGroup value={checkedList} onChange={onChange} className="w-full">
                            {data?.length > 0 ? (
                                data.map((item) => (
                                    <div key={item.cartId} className="w-full">
                                        <CartItems
                                            item={item}
                                            onClickUpdateQuantity={handleUpdateQuantity}
                                            onClickDelete={() => showConfirm(item.cartId, item.productName)}
                                        />
                                    </div>
                                ))
                            ) : (
                                <div className="flex flex-col w-full">
                                    <button
                                        type="button"
                                        onClick={() => router.push('/product')}
                                        className="flex gap-4 items-center"
                                    >
                                        <img src="/assets/svg/arrow_left.svg" alt="arrow icon" />
                                        <p className="my-auto text-lg font-semibold">Sản phẩm</p>
                                    </button>
                                    <Empty
                                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                                        description={'Chưa có sản phẩm trong giỏ hàng'}
                                        className="w-full mx-auto"
                                    />
                                </div>
                            )}
                        </CheckboxGroup>
                    </section>

                    <section className="max-sm:w-11/12 w-10/12 lg:w-4/12 mx-auto gap-4 flex flex-col lg:m-0 rounded-xl text-white bg-secondary py-8 px-6 lg:px-10 text-center h-fit">
                        <h2 className="text-2xl font-semibold">Tổng Quan</h2>
                        <div className="flex flex-col gap-3">
                            <section className="flex flex-col gap-3">
                                <div className="flex justify-between">
                                    <div
                                        className="flex gap-2 items-center cursor-pointer"
                                        onClick={() => setShowItem(!showItem)}
                                    >
                                        <h3 className="text-lg font-semibold my-auto">Sản phẩm đã chọn</h3>
                                        <img
                                            className={`cursor-pointer h-3 w-3 ${!showItem ? '' : 'rotate-180'}`}
                                            src="/assets/svg/arrow_show.svg"
                                            alt="show debug"
                                        />
                                    </div>
                                </div>
                                {!showItem && (
                                    <table class="table-auto">
                                        <tbody>
                                            {selectedItems &&
                                                selectedItems.map((item) => (
                                                    <tr key={item.cartId} className="border">
                                                        <td className="text-left line-clamp-2">{item.productName}</td>
                                                        <td className="text-center px-2 border">x{item.quantity}</td>
                                                        <td className="text-left w-1/2">
                                                            {convertToVND(item.productPrice * item.quantity)}
                                                        </td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                )}
                            </section>

                            <section className="flex justify-between font-bold text-xl border-b pt-4 pb-1">
                                <p>Tổng số tiền</p>
                                <p>{convertToVND(totalCart)}</p>
                            </section>

                            <section className="w-full justify-center mt-4">
                                <PrimaryButton
                                    onClick={() => handleCheckout(selectedItems)}
                                    content={'Mua Hàng'}
                                    classCss={'bg-white text-primary px-4 py-2'}
                                />
                            </section>
                        </div>
                    </section>
                </div>
            </div>
        </UserLayout>
    );
}

export default Cart;

export { getServerSideProps };
