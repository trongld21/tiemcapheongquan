import Link from 'next/link';

const Thumbnail = ({ title, hrefCenter, content, center }) => {
    return (
        <section className="w-full max-sm:h-36 h-48 lg:h-56 bg-hero-pattern bg-no-repeat bg-cover bg-center text-center">
            <div className="h-full flex flex-col max-sm:gap-0 gap-1 justify-center my-auto">
                <h1 className="text-[#F1E8C7] font-iCielBCCartelDeuxAlt custom-shadow max-sm:text-3xl text-3xl lg:text-5xl font-semibold lg:font-bold uppercase">
                    {!!content ? content : title}
                </h1>
                <div className="flex gap-2 justify-center text-center max-sm:text-xs text-sm text-white">
                    <Link href="/" className="font-semibold text-lg text-white custom-shadow w-fit font-iCielBCHolidaySerif">
                        Trang Chủ
                    </Link>
                    <Link
                        href={hrefCenter ? hrefCenter : '/'}
                        className={`font-semibold text-lg custom-shadow text-white font-iCielBCHolidaySerif ${center ? '' : 'hidden'}`}
                    >
                        / {center}
                    </Link>
                    <span className="text-lg font-iCielBCHolidaySerif">/</span>
                    <p className="font-medium text-lg max-sm:line-clamp-1 font-iCielBCHolidaySerif">{title}</p>
                </div>
            </div>
        </section>
    );
};

export default Thumbnail;
