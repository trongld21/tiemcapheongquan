import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const UserSideBar = ({ children }) => {
    const router = useRouter();
    const { push } = useRouter();
    const [active, setActive] = useState('');
    const handleItemClick = (name) => {
        setActive(name);
        push(`/user/${name}`);
    };

    // Get url when route change
    useEffect(() => {
        const parts = router.asPath.split('/');
        setActive(parts[parts.length - 1]);
    }, [router]);

    return (
        <div className="lg:w-11/12 w-full lg:px-0 px-3 mx-auto flex flex-col gap-10 mt-10 h-full">
            {/* <h2 className="text-xl font-semibold max-sm:hidden">Hồ sơ người dùng</h2> */}
            <div className="flex h-full relative">
                <div className="w-[300px] flex flex-col max-sm:hidden lg:text-base text-sm h-full min-h-[420px] sticky left-0 top-20">
                    <div className="flex flex-col gap-9 text-base font-semibold text-[#0D0D0D]">
                        <div
                            className={`flex gap-4 cursor-pointer ${
                                active === 'info' ? 'opacity-1 opacity-1 border-r-8' : 'opacity-50'
                            }`}
                            onClick={() => handleItemClick('info')}
                        >
                            <img className="h-5 w-5" src="/assets/svg/user_icon.svg" alt="user" />
                            <p>Hồ sơ</p>
                        </div>

                        <div
                            className={`flex gap-4 cursor-pointer ${
                                active === 'address' ? 'opacity-1 opacity-1 border-r-8' : 'opacity-50'
                            }`}
                            onClick={() => handleItemClick('address')}
                        >
                            <img className="h-5 w-5" src="/assets/svg/address_icon.svg" alt="user" />
                            <p>Địa chỉ</p>
                        </div>

                        <div
                            className={`flex gap-4 cursor-pointer ${
                                active === 'favorite' ? 'opacity-1 opacity-1 border-r-8' : 'opacity-50'
                            }`}
                            onClick={() => handleItemClick('favorite')}
                        >
                            <img className="h-5 w-5" src="/assets/svg/favorite_icon.svg" alt="user" />
                            <p>Sản phẩm yêu thích</p>
                        </div>

                        <div
                            className={`flex gap-4 cursor-pointer ${
                                active === 'orders' ? 'opacity-1 opacity-1 border-r-8' : 'opacity-50'
                            }`}
                            onClick={() => handleItemClick('orders')}
                        >
                            <img className="h-5 w-5" src="/assets/svg/order.svg" alt="user" />
                            <p>Đơn hàng</p>
                        </div>
                    </div>
                </div>
                <div className="max-sm:border-none max-sm:w-full border-l w-full">
                    <div className="w-11/12 mx-auto mb-10">{children}</div>
                </div>
            </div>
        </div>
    );
};

export default UserSideBar;
