import { useEffect } from "react";

export default function JoinRequestModal({
  request,
  onClose,
  onConfirm,
}) {
  if (!request) return null;

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
      <div className="bg-white rounded-3xl w-full max-w-md sm:max-w-lg md:max-w-xl p-6 sm:p-8 md:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.15)]">

        {/* HEADER */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
              Join Blood Request
            </h2>
            <p className="text-sm text-gray-500">
              You are about to join this blood request.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            ✕
          </button>
        </div>

        <hr className="mb-6" />

        {/* DETAILS */}
        <div className="space-y-5 text-sm">

          <div>
            <p className="text-gray-400 text-xs">BLOOD TYPE</p>
            <p className="font-medium text-base">{request.blood}</p>
          </div>

          {/* ✅ STACK ON MOBILE */}
          <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
            <div>
              <p className="text-gray-400 text-xs">HOSPITAL</p>
              <p>{request.hospital}</p>
            </div>

            <div>
              <p className="text-gray-400 text-xs">DATE & TIME</p>
              <p>{request.date}</p>
            </div>
          </div>

        </div>

        {/* BUTTONS */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8">

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              onConfirm(request);
              onClose();
            }}
            className="w-full sm:w-auto px-7 py-2.5 rounded-xl text-sm font-semibold text-white bg-green-500 hover:bg-green-600"
          >
            Confirm
          </button>

        </div>

      </div>

    </div>
  );
}