import UserLayout from '@/components/Layout/UserLayout';
import Link from 'next/link';

export default function Custom404() {
    return (
        <UserLayout>
            <div
                class="relative flex items-center 
        justify-center h-screen overflow-hidden"
            >
                <video
                    autoPlay
                    loop
                    muted
                    className="absolute z-10 w-auto 
            min-w-full min-h-full max-w-none"
                >
                    <source src="/assets/video/video_tkdecor.mp4" />
                </video>
                <div className="bg-[rgba(0,0,0,0.5)] w-full h-full absolute z-20 flex justify-center items-center text-center">
                    <div className="text-cente bg-white p-16 rounded-xl">
                        <h1 class="hover-cut  text-9xl font-extrabold" data-text="404">
                            404
                        </h1>
                        <h1>Oops! Trang không tồn tại.</h1>
                        <p>Xin lỗi, nhưng trang bạn đang tìm kiếm không tồn tại.</p>
                        <Link href="/" class="button my-8 mx-auto">
                            Quay về trang chủ <div class="button__horizontal"></div>
                            <div class="button__vertical"></div>
                        </Link>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
