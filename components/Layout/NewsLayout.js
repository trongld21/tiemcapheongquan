import { useRouter } from 'next/router';
import LatestCard from '../News/LatestCard';
import { useEffect, useState } from 'react';
import apiArticle from '@/pages/api/apiArticles';
import { useCookie } from '@/hooks/useCookie';
import { formateDateTime } from '../Utils/FormatDate';

const NewsLayout = ({ children }) => {
    const router = useRouter();
    const [dataOldArticle, setDataOldArticle] = useState();
    useEffect(() => {
        const fetchData = async () => {
            const responseArticle = await apiArticle.GetAll('', 1, 3);
            if (responseArticle) {
                setDataOldArticle(responseArticle.data.articles);
            }
        };
        fetchData();
    }, []);
    return (
        <div className="w-10/12 max-sm:w-11/12 m-auto max-sm:py-2 py-10 h-fit mx-auto flex flex-wrap lg:flex-nowrap gap-8 lg:gap-16 flex-col-reverse lg:flex-row">
            <section className="w-full lg:w-3/4">{children}</section>
            {dataOldArticle?.length != 0 && (
                <section className="w-full lg:w-1/4 flex flex-col gap-16">
                    <div className="lg:flex flex-col gap-9 hidden">
                        <p className="text-xl font-semibold">Tin gần đây</p>
                        <div className="flex flex-col gap-7">
                            {dataOldArticle &&
                                dataOldArticle.map((item) => (
                                    <LatestCard
                                        key={item.articleId}
                                        date={formateDateTime(item.createdAt).datePart}
                                        title={item.title}
                                        imgUrl={item.thumbnail}
                                        slug={item.slug}
                                    />
                                ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
};

export default NewsLayout;
