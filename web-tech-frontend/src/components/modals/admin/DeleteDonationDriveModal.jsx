    import { FiX, FiTrash2 } from "react-icons/fi";

    const DeleteDonationDriveModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">

        <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl space-y-5">

            {/* HEADER */}
            <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">
                {title || "Confirm Delete"}
            </h2>

            <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 transition"
            >
                <FiX className="text-gray-400" />
            </button>
            </div>

            {/* ICON + MESSAGE */}
            <div className="flex flex-col items-center text-center space-y-3">

            {/* ICON */}
            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-red-50">
                <FiTrash2 className="text-red-500 text-xl" />
            </div>

            {/* MESSAGE */}
            <p className="text-sm text-gray-500 leading-relaxed max-w-sm">
                {message || "Are you sure you want to delete this item? This action cannot be undone."}
            </p>

            </div>

            {/* ACTIONS */}
            <div className="flex justify-end gap-3 pt-2">

            <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
            >
                Cancel
            </button>

            <button
                onClick={onConfirm}
                className="px-6 py-2 rounded-xl bg-red-500 text-white shadow-sm hover:bg-red-600 transition"
            >
                Delete
            </button>

            </div>

        </div>

        </div>
    );
    };

    export default DeleteDonationDriveModal;