function UpdateQuantity({ maxValue, setQuantity, quantity }) {
    const handleDecrement = async () => {
        if (quantity > 1) {
            try {
                setQuantity(quantity - 1);
            } catch (err) {
                console.log('🚀 ~ file: UpdateQuantity.js:17 ~ handleDecrement ~ err:', err);
            }
        }
    };

    const handleIncrement = async () => {
        if (quantity < maxValue) {
            try {
                setQuantity(quantity + 1);
            } catch (err) {
                console.log('🚀 ~ file: UpdateQuantity.js:17 ~ handleDecrement ~ err:', err);
            }
        }
    };

    return (
        <div className="w-fit flex gap-4 items-center">
            <button className="border flex justify-center items-center w-6 h-6 border-black" onClick={handleDecrement}>
                <img src="/assets/svg/devive.svg" alt="sub" />
            </button>
            <p className="text-base my-auto font-semibold">{quantity}</p>
            <button
                className="border flex justify-center items-center bg-black w-6 h-6 border-black"
                onClick={handleIncrement}
            >
                <img src="/assets/svg/plus.svg" alt="plus" />
            </button>
        </div>
    );
}

export default UpdateQuantity;
