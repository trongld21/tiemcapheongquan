import { useState } from 'react';

function CountQuantity({ item, onClickUpdateQuantity, maxQuantity }) {
    const [quantityCurrent, SetQuantityCurrent] = useState(item.quantity);

    const updateQuantity = async (quantity) => {
        await onClickUpdateQuantity(item.cartId, quantity);
    };

    const handleDecrement = async () => {
        if (quantityCurrent > 1) {
            try {
                await updateQuantity(quantityCurrent - 1);
                SetQuantityCurrent(quantityCurrent - 1);
            } catch (err) {
                console.log('🚀 ~ file: CountQuantity.js:17 ~ handleDecrement ~ err:', err);
            }
        }
    };

    const handleIncrement = async () => {
        if (quantityCurrent < maxQuantity) {
            try {
                await updateQuantity(quantityCurrent + 1);
                SetQuantityCurrent(quantityCurrent + 1);
            } catch (err) {
                console.log('🚀 ~ file: CountQuantity.js:17 ~ handleDecrement ~ err:', err);
            }
        }
    };

    return (
        <div className="w-fit flex gap-4 max-sm:gap-2 items-center">
            <button
                disabled={quantityCurrent <= 1 && true}
                className={`${quantityCurrent <= 1 && 'opacity-20'}
                 border flex justify-center items-center w-6 h-6 max-sm:h-4 max-sm:w-4 border-black`}
                onClick={handleDecrement}
            >
                <img src="/assets/svg/devive.svg" alt="sub" />
            </button>
            <p className="text-base my-auto font-semibold">{quantityCurrent}</p>
            <button
                disabled={quantityCurrent >= maxQuantity && true}
                className={`${
                    quantityCurrent === maxQuantity && 'opacity-20'
                } border flex justify-center items-center bg-black w-6 h-6 max-sm:h-4 max-sm:w-4 border-black`}
                onClick={handleIncrement}
            >
                <img src="/assets/svg/plus.svg" alt="plus" />
            </button>
        </div>
    );
}

export default CountQuantity;
