import { useRouter } from 'next/router';

const BackButton = ({ title }) => {
    const router = useRouter();

    return (
        <button type="button" onClick={() => router.back()} className="flex gap-4 items-center">
            <img src="/assets/svg/arrow_left.svg" alt="arrow icon" />
            <p className="my-auto text-lg font-semibold">{title}</p>
        </button>
    );
};

export default BackButton;
