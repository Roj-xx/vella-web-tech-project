import { useEffect } from "react";

export default function CancelRequestModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Cancel Request",
  message = "Do you really want to cancel?",
}) {
  if (!isOpen) return null;

  // ESC CLOSE
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">

      {/* ✅ RESPONSIVE MODAL */}
      <div className="bg-white rounded-3xl w-full max-w-sm sm:max-w-md p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.15)]">
        
        {/* HEADER */}
        <div className="mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
            {title}
          </h2>
          <p className="text-sm text-gray-500">
            {message}
          </p>
        </div>

        <hr className="mb-6" />

        {/* BUTTONS */}
        <div className="flex flex-col sm:flex-row justify-end gap-3">

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="w-full sm:w-auto px-7 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-500 hover:bg-red-600"
          >
            Confirm
          </button>

        </div>

      </div>

    </div>
  );
}