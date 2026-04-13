    import { FiMapPin, FiCalendar, FiEdit, FiTrash } from "react-icons/fi";
    import { useNavigate } from "react-router-dom";

    const BloodRequestCard = ({ request, onEdit, onDelete }) => {
    const navigate = useNavigate();
    const joinedCount = request.joinedCount || 0;
    const maxParticipants = request.maxParticipants || 0;
    const progressPercent =
    maxParticipants > 0
        ? Math.round((joinedCount / maxParticipants) * 100)
        : 0;
    const formattedUrgency = request.urgency
    ? request.urgency.charAt(0).toUpperCase() + request.urgency.slice(1)
    : "";

    const handleView = () => {
        navigate(`/admin/requests/${request._id}`);
    };
    
    const priorityColor =
    request.urgency === "high"
        ? "bg-red-100 text-red-500"
        : request.urgency === "medium"
        ? "bg-yellow-100 text-yellow-600"
        : "bg-blue-100 text-blue-500";

    const statusColor =
    request.status === "Fulfilled"
        ? "bg-green-100 text-green-600"
        : "bg-yellow-100 text-yellow-700";
    return (
        <div className="bg-white rounded-3xl shadow-sm p-6 space-y-5">

        <span className={`text-xs px-3 py-1 rounded-full ${priorityColor}`}>
        {formattedUrgency} Priority
        </span>
        <span className={`inline-block text-xs px-3 py-1 rounded-full ${statusColor}`}>
        {request.status || "Pending"}
        </span>

        <div className="flex justify-center">
            <div className="w-24 h-24 bg-red-50 rounded-2xl flex items-center justify-center">
            <span className="text-3xl font-bold text-red-500">
                {request.bloodType}
            </span>
            </div>
        </div>
        
        <div className="text-center">
            <h3 className="font-semibold text-gray-900">{request.title}</h3>
            <p className="text-sm text-gray-500">{request.description}</p>
        </div>

        <div className="text-sm text-gray-500 space-y-1">
            <div className="flex items-center gap-2">
            <FiMapPin /> {request.venue}
            </div>
            <div className="flex items-center gap-2">
            <FiCalendar /> {request.date} • {request.time}
            </div>
        </div>

        <div>
            <div className="flex justify-between text-sm">
            <span>{joinedCount}/{maxParticipants}</span>
            <span>{progressPercent}%</span>
            </div>

            <div className="bg-gray-100 h-2 rounded-full">
            <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${progressPercent}%` }}
            />
            </div>
        </div>

        <div className="flex gap-2">

            <button
            onClick={handleView}
            className="flex-1 bg-green-500 text-white py-2 rounded-xl"
            >
            View Details
            </button>

            <button
            onClick={() => onEdit(request)}
            className="p-3 bg-gray-100 rounded-xl"
            >
            <FiEdit />
            </button>

            <button
            onClick={() => onDelete(request)} // ✅ IMPORTANT
            className="p-3 bg-red-100 text-red-500 rounded-xl"
            >
            <FiTrash />
            </button>

        </div>

        </div>
    );
    };

    export default BloodRequestCard;