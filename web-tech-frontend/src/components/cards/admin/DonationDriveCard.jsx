    import { FiMapPin, FiCalendar, FiEdit, FiTrash, FiEye } from "react-icons/fi";
    import { useNavigate } from "react-router-dom";

    const DonationDriveCard = ({ drive, onEdit, onDelete }) => {
    const navigate = useNavigate();

    const percentage =
    drive.maxParticipants > 0
        ? Math.round((drive.registered / drive.maxParticipants) * 100)
        : 0;

    const handleView = () => {
        navigate(`/admin/drives/${drive._id}`);
    };
    const statusColor =
    drive.status === "Completed"
        ? "bg-green-100 text-green-600"
        : drive.status === "Cancelled"
        ? "bg-red-100 text-red-600"
        : "bg-yellow-100 text-yellow-700";

    return (
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            
        {/* IMAGE */}
        <img
            src={drive.image || "/assets/images/cover.png"}
            alt="drive"
            className="w-full h-40 object-cover"
        />

        {/* CONTENT */}
        <div className="p-5 space-y-4">
            {/* STATUS */}
            <span className={`inline-block text-xs px-3 py-1 rounded-full ${statusColor}`}>
            {drive.status || "Upcoming"}
            </span>
            {/* TITLE */}
            <h3 className="text-lg font-semibold text-gray-900">
            {drive.title}
            </h3>

            {/* LOCATION */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
            <FiMapPin />
            {drive.location}
            </div>

            {/* DATE & TIME */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
            <FiCalendar />
            {drive.date} • {drive.time}
            </div>

            {/* PROGRESS */}
            <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
                <span>
                {drive.registered} / {drive.maxParticipants}
                </span>
                <span>{percentage}%</span>
            </div>

            <div className="w-full bg-gray-200 h-2 rounded-full">
                <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${percentage}%` }}
                />
            </div>
            </div>

            {/* ACTIONS */}
            <div className="flex items-center gap-3 pt-2">

            {/* VIEW */}
            <button
                onClick={handleView}
                className="flex-1 bg-green-500 text-white py-2 rounded-xl flex items-center justify-center gap-2 text-sm font-medium hover:bg-green-600 transition"
            >
                <FiEye />
                View Details
            </button>

            {/* EDIT */}
            <button
                onClick={() => onEdit && onEdit(drive)} // ✅ CONNECTED
                className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200"
            >
                <FiEdit />
            </button>

            {/* DELETE */}
            <button
                onClick={() => onDelete && onDelete(drive)} // ✅ OPTIONAL
                className="p-3 rounded-xl bg-red-100 text-red-500 hover:bg-red-200"
            >
                <FiTrash />
            </button>

            </div>

        </div>
        </div>
    );
    };

    export default DonationDriveCard;