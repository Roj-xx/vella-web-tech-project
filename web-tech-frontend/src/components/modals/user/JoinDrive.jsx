import { useEffect } from "react";

const formatDate = (value) => {
  if (!value) return "No date";

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function JoinDriveModal({ drive, onClose, onConfirm }) {
  if (!drive) return null;

  const current = drive.registered || 0;
  const total = drive.maxParticipants || 0;
  const percent = total > 0 ? Math.round((current / total) * 100) : 0;

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl w-full max-w-xl p-10 shadow-[0_20px_60px_rgba(0,0,0,0.15)]">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              Join Donation Drive
            </h2>
            <p className="text-sm text-gray-500">
              Confirm your participation
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

        <div className="space-y-5 text-sm">
          <div>
            <p className="text-gray-400 text-xs">EVENT</p>
            <p className="font-medium text-base">{drive.title}</p>
          </div>

          <div className="flex justify-between">
            <div>
              <p className="text-gray-400 text-xs">DATE</p>
              <p>{formatDate(drive.date)}</p>
            </div>

            <div>
              <p className="text-gray-400 text-xs">TIME</p>
              <p>{drive.time || "No time"}</p>
            </div>
          </div>

          <div>
            <p className="text-gray-400 text-xs">LOCATION</p>
            <p>{drive.location || "No location"}</p>
          </div>

          <div className="flex justify-between">
            <div>
              <p className="text-gray-400 text-xs">PARTICIPANTS</p>
              <p>
                {current} / {total}
              </p>
            </div>

            <div>
              <p className="text-gray-400 text-xs">CAPACITY</p>
              <p>{percent}%</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={() => onConfirm(drive)}
            className="px-7 py-2.5 rounded-xl text-sm font-semibold text-white bg-green-500 hover:bg-green-600"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}