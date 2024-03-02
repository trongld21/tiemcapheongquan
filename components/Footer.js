import Image from 'next/image';
import Link from 'next/link';
import Facebook from './Chat/Facebook';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

function Footer() {
    const router = useRouter();
    useEffect(() => { }, [router]);

    return (
        <section className="w-full bg-[#594633]">
            <footer className="bg-[#594633] w-full min-h-[20rem] p-16">
                <div className="grid grid-cols-4">
                    <div className="flex flex-col justify-start items-start gap-2">
                        <img src="/assets/images/tiemcapheongquan/logo.png" className="w-28" alt="logo tiệm cà phê ông quan" />
                        <h1 className="uppercase text-[#F1E8C7] font-normal text-3xl font-iCielBCHolidaySerif">
                            Tiệm Cà Phê Ông Quan
                        </h1>
                    </div>
                    <div>
                        <h1 className="uppercase text-[#F1E8C7] font-normal text-3xl font-iCielBCHolidaySerif">Giới thiệu</h1>
                        <Link href="javascript:void(0)" className="block text-[#F1E8C7] font-normal text-xl leading-[128%] tracking-wider font-iCielBCLivory">Về chúng tôi</Link>
                        <Link href="javascript:void(0)" className="block text-[#F1E8C7] font-normal text-xl leading-[128%] tracking-wider font-iCielBCLivory">Ưu đãi</Link>
                    </div>
                    <div>
                        <h1 className="uppercase text-[#F1E8C7] font-normal text-3xl font-iCielBCHolidaySerif">Dịch vụ khách hàng</h1>
                        <Link href="javascript:void(0)" className="block text-[#F1E8C7] font-normal text-xl leading-[128%] tracking-wider font-iCielBCLivory">Thực đơn</Link>
                        <Link href="javascript:void(0)" className="block text-[#F1E8C7] font-normal text-xl leading-[128%] tracking-wider font-iCielBCLivory">Bánh ngọt</Link>
                    </div>
                    <div>
                        <h1 className="uppercase text-[#F1E8C7] font-normal text-3xl font-iCielBCHolidaySerif">Liên hệ</h1>
                        <div className="flex justify-start gap-4 items-center">
                            <Link target="_blank" href="https://www.facebook.com/tiemcafeongquan">
                                <img src="/assets/images/tiemcapheongquan/facebook.png" className="w-10" alt="icon social media tiệm cà phê ông quan" />
                            </Link>
                            <Link target="_blank" href="https://www.tiktok.com/@ongquan_251223">
                                <img src="/assets/images/tiemcapheongquan/tiktok.png" className="w-10" alt="icon social media tiệm cà phê ông quan" />
                            </Link>
                        </div>

                    </div>
                </div>
                <p className="text-[#F1E8C7] font-normal text-xl leading-[128%] tracking-wider font-iCielBCLivory">Địa chỉ: hẻm 583, đường 30/4, phường Hưng Lợi, quận Ninh Kiều, TP Cần Thơ, Việt Nam</p>
                <Link href="callto:0937296565" className="text-[#F1E8C7] font-normal text-xl leading-[128%] tracking-wider font-iCielBCLivory">Điện thoại: 093 729 65 65</Link>
            </footer>
            <div className="fixed rounded-full bottom-8 right-8 z-[60]">
                <Facebook />
            </div>
        </section>
    );
}
export default Footer;
