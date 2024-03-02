import NewsLayout from '@/components/Layout/NewsLayout';
import UserLayout from '@/components/Layout/UserLayout';
import BackButton from '@/components/Utils/BackButton';
import { formateDateTime } from '@/components/Utils/FormatDate';
import GetToken from '@/components/Utils/GetToken';
import PrimaryButton from '@/components/Utils/PrimaryButton';
import SocialListIcon from '@/components/Utils/SocialListIcon';
import Thumbnail from '@/components/Utils/Thumbnail';
import apiArticle from '@/pages/api/apiArticles';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

function NewsDetail() {
    const router = useRouter();
    const { slug } = router.query;

    const [dataArticle, setDataArticle] = useState();
    const [isNotFound, setIsNotFound] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            console.log(slug);
            if (slug) {
                const slugId = slug?.toString();
                const responseArticle = await apiArticle.GetBySlug(slugId);
                if (responseArticle && responseArticle.success) {
                    setDataArticle(responseArticle.data);
                    setIsNotFound(false);
                    console.log(dataArticle);
                } else {
                    setIsNotFound(true);
                }
            }
        };
        fetchData();
    }, [slug]);
    return (
        <UserLayout>
            <Thumbnail title={dataArticle?.title || slug} hrefCenter={'/news'} center={'Tin tức'} content={'Tin tức'} />
            <section className="w-10/12 max-sm:w-11/12 m-auto mt-10">
                <button type="button" onClick={() => router.push('/news')} className="flex gap-4 items-center">
                    <img src="/assets/svg/arrow_left.svg" alt="arrow icon" />
                    <p className="my-auto text-lg font-semibold">Về trang tin tức</p>
                </button>
            </section>
            <NewsLayout>
                {isNotFound ? (
                    <div className="pb-4">
                        Xin lỗi, chúng tôi không tìm thấy bài viết phù hợp với yêu cầu của bạn. Vui lòng thử lại hoặc
                        khám phá thêm các bài viết khác trong danh mục của chúng tôi.
                    </div>
                ) : (
                    <div className="flex flex-col gap-12">
                        <section className="flex flex-col gap-5">
                            <h1 className="font-semibold max-sm:text-2xl text-3xl lg:text-5xl uppercase">
                                {dataArticle.title}
                            </h1>
                            <div className="flex w-full justify-between text-sm">
                                <p className="font-normal">
                                    {formateDateTime(dataArticle.createdAt).datePart}

                                    <b className="text-grey ml-4">Người đăng: {dataArticle.userName}</b>
                                </p>
                                <SocialListIcon
                                    url={`${process.env.NEXT_PUBLIC_DOMAIN}/news/${slug}`}
                                    content="TKDecor"
                                />
                            </div>
                        </section>

                        <section className="flex flex-col gap-4">
                            <img src={dataArticle.thumbnail} alt="Thumbnails" />
                            <p dangerouslySetInnerHTML={{ __html: dataArticle.content }}></p>
                        </section>
                        <section className="flex gap-10">
                            {/* <PrimaryButton content={'Furniture'} classCss={'text-white bg-primary w-36 py-2'} />
                            <PrimaryButton content={'Design'} classCss={'text-white bg-primary w-36 py-2'} /> */}
                        </section>
                    </div>
                )}
            </NewsLayout>
        </UserLayout>
    );
}

export default NewsDetail;

export async function getServerSideProps(context) {
    // Get cookie in the context
    const cookies = context.req.headers.cookie;
    if (cookies) {
        const userInfo = GetToken(cookies);
        // Check author based role
        if (userInfo && userInfo.role === 'Customer') {
            return {
                props: {
                    isLogged: true,
                },
            };
        } else if (userInfo && userInfo.role === 'Admin') {
            return {
                redirect: {
                    destination: '/admin', // Redirect to the login page or any other page you prefer
                    permanent: false,
                },
            };
        }
    }
    return {
        props: {
            isLogged: false,
        },
    };
}
