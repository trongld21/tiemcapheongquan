import { BounceLoader } from 'react-spinners';

export default function Spinner() {
    return (
        <span className="h-screen w-full flex justify-center items-center fixed top-0 left-0 right-0 bottom-0 z-40 bg-white">
            {/* <span className="animate-spin relative flex h-10 w-10 rounded-sm bg-purple-400 opacity-75"></span> */}
            <BounceLoader color="#a69689" size={32} />
        </span>
    );
}
