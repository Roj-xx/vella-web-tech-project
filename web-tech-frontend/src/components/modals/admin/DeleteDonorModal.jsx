    import { FiX, FiTrash2 } from "react-icons/fi";

    const DeleteDonorModal = ({
    isOpen,
    onClose,
    onConfirm,
    donor,
    }) => {
    if (!isOpen || !donor) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">

        <div className="bg-white w-[420px] rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden">

            {/* HEADER */}
            <div className="flex justify-between items-start p-6 border-b border-gray-100">
            <div>
                <h2 className="text-lg font-semibold text-gray-900">
                Delete Donor
                </h2>
                <p className="text-sm text-gray-500">
                This action cannot be undone
                </p>
            </div>

            <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100"
            >
                <FiX className="text-gray-500" />
            </button>
            </div>

            {/* CONTENT */}
            <div className="p-6 text-center">

            <div className="w-14 h-14 mx-auto flex items-center justify-center rounded-full bg-red-100 text-red-600 mb-4">
                <FiTrash2 className="text-xl" />
            </div>

            <p className="text-sm text-gray-600">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-gray-800">
                {donor.name}
                </span>
                ?
            </p>

            </div>

            {/* FOOTER */}
            <div className="flex justify-end gap-3 p-5 border-t border-gray-100">
            <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100"
            >
                Cancel
            </button>

            <button
                onClick={onConfirm}
                className="px-6 py-2 rounded-xl text-sm font-semibold text-white bg-red-500 hover:bg-red-600"
            >
                Delete
            </button>
            </div>

        </div>
        </div>
    );
    };

    export default DeleteDonorModal;