const Alert = ({ alert, onClose }) => {
    if (!alert) return null;

    const styles = {
        success: "bg-green-100 text-green-800 border-green-300",
        error: "bg-red-100 text-red-800 border-red-300",
    };

    return (
        <div className={`border px-4 py-3 rounded mb-4 ${styles[alert.type]}`}>
            <span>{alert.message}</span>
            <button
                onClick={onClose}
                className="float-right font-bold cursor-pointer"
            >
                ×
            </button>
        </div>
    );
};

export default Alert;
