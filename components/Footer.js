import Image from 'next/image';
import Link from 'next/link';
import Facebook from './Chat/Facebook';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

function Footer() {
    const router = useRouter();
    useEffect(() => {}, [router]);

    return (
        <section className="w-full bg-[#A69689]">
            <div className="flex flex-col justify-center items-center text-white flex-wrap lg:mx-16 mx-8">
                <div className="max-w-[1200px] flex items-start text-white py-8 xl:gap-32 md:gap-16 gap-8 justify-between lg:flex-nowrap flex-wrap">
                    <div className="lg:w-1/2">
                        <div className="">
                            <p className="text-base font-semibold mb-4 uppercase">
                                TÔN VINH VẺ ĐẸP CHO NGÔI NHÀ CỦA BẠN
                            </p>
                            <Link href="/">
                                <Image
                                    className="w-48 bg-[#A69689] -ml-11 mb-4"
                                    alt="svg"
                                    src="/svgs/logotkdecorfooter.svg"
                                    width={100}
                                    height={100}
                                />
                            </Link>
                            <p className="text-sm font-normal">
                                Chào mừng bạn đến với TKDecor - Nơi tôn vinh và thể hiện vẻ đẹp của không gian sống!
                                Chúng tôi tự hào là một thương hiệu nội thất và trang trí nhà hàng đầu, mang đến cho bạn
                                những giải pháp sáng tạo và độc đáo để biến ngôi nhà của bạn thành một tác phẩm nghệ
                                thuật độc nhất.
                            </p>
                        </div>
                    </div>
                    <div className="lg:w-fit w-full flex flex-col gap-6">
                        <div className="flex gap-6 flex-wrap lg:flex-nowrap">
                            <div className="lg:w-1/4">
                                <h1 className="text-base font-semibold uppercase">Thông tin</h1>
                                <div className="mt-6 font-normal flex flex-col gap-2">
                                    <Link href="/about" className="capitalize">
                                        về chúng tôi
                                    </Link>
                                    <Link href="/product" className="capitalize">
                                        sản phẩm
                                    </Link>
                                    <Link href="/news" className="capitalize">
                                        tin tức
                                    </Link>
                                </div>
                            </div>
                            <div className="lg:w-2/4">
                                <h1 className="text-base font-semibold uppercase">Liên hệ</h1>
                                <div className="mt-6 font-normal flex flex-col gap-2">
                                    <ul className="flex justify-between flex-col">
                                        <li className="flex flex-start gap-2">
                                            <Image
                                                src="/assets/svg/phone_white.svg"
                                                alt="address"
                                                width={16}
                                                height={16}
                                            />{' '}
                                            <Link href="callto:0337336138">0337336138</Link>
                                        </li>
                                        <li className="flex flex-start gap-2">
                                            <Image
                                                src="/assets/svg/email_white.svg"
                                                alt="address"
                                                width={16}
                                                height={16}
                                            />{' '}
                                            <Link href="mailto:tkdecor123@gmail.com">tkdecor123@gmail.com</Link>
                                        </li>
                                        <li className="flex flex-start gap-2">
                                            <Image
                                                src="/assets/svg/address_white.svg"
                                                alt="address"
                                                width={16}
                                                height={16}
                                            />{' '}
                                            600 Nguyễn Văn Cừ nối dài, An Bình, Ninh Kiều, Cần Thơ
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="lg:w-1/4">
                                <h1 className="text-base font-semibold uppercase">Kết nối với TKDecor</h1>
                                <div className="mt-6 font-normal flex flex-row gap-6">
                                    <a href="https://www.facebook.com/tkdecorfurniture/" target="_blank">
                                        <Image
                                            className="w-8 h-8 text-white "
                                            alt="svg"
                                            src="/svgs/fb1.svg"
                                            width={100}
                                            height={100}
                                        />
                                    </a>
                                    <a href="https://www.youtube.com/@TKDecor" target="_blank">
                                        <Image
                                            className="w-8 h-8 text-white "
                                            alt="svg"
                                            src="/svgs/youtube.svg"
                                            width={100}
                                            height={100}
                                        />
                                    </a>
                                    <a href="https://twitter.com/DecorTk52006" target="_blank">
                                        <Image
                                            className="w-8 h-8 text-white "
                                            alt="svg"
                                            src="/svgs/twitter.svg"
                                            width={100}
                                            height={100}
                                        />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <div className="fixed rounded-full bottom-8 right-8 z-[60]">
                    <Facebook />
                </div> */}

                {/* <div className="pb-8 w-full max-w-[1200px]">
                    <h1 className="text-base font-semibold uppercase">Liên hệ với chúng tôi: </h1>
                    <ul className="flex justify-between">
                        <li>
                            Số điện thoại: <Link href="callto:0337336138">0337336138</Link>
                        </li>
                        <li>Địa chỉ: 600 Nguyễn Văn Cừ nối dài, An Bình, Ninh Kiều, Cần Thơ</li>
                        <li>
                            Email: <Link href="mailto:tkdecor123@gmail.com">tkdecor123@gmail.com</Link>
                        </li>
                    </ul>
                </div> */}
            </div>
        </section>
    );
}
export default Footer;
