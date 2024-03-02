const PrimaryButton = ({ content, classCss, onClick, active = true, type }) => {
    return (
        <button
            type={type}
            disabled={!active}
            className={`uppercase rounded font-semibold disabled:opacity-40 ${classCss}`}
            onClick={onClick}
        >
            {content}
        </button>
    );
};

export default PrimaryButton;
