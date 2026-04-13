    import { useNavigate, useParams } from "react-router-dom";
    import { useState, useEffect } from "react";
    import { FiArrowLeft, FiMapPin, FiCalendar } from "react-icons/fi";
    import api from "../../services/api";
    import AddRequestParticipantModal from "../../components/modals/admin/AddRequestParticipantModal";

    const BloodRequestDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [request, setRequest] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [addDonorOpen, setAddDonorOpen] = useState(false);

    const fetchDetails = async () => {
    try {
        const res = await api.get(`/requests/${id}/participants`);

        setRequest(res.data.request);
        setParticipants(res.data.participants);

    } catch (error) {
        console.error("Failed to fetch request details:", error);
    }
    };

    useEffect(() => {
    fetchDetails();
    }, []);

    const handleAttend = async (id) => {
    try {
        await api.put(`/requests/participants/${id}`, {
        status: "attended",
        });

        fetchDetails();
    } catch (error) {
        console.error("Failed to mark attended:", error);
    }
    };

    const handleMissed = async (id) => {
    try {
        await api.put(`/requests/participants/${id}`, {
        status: "missed",
        });

        fetchDetails();
    } catch (error) {
        console.error("Failed to mark missed:", error);
    }
    };

    const handleUndo = async (id) => {
    try {
        await api.put(`/requests/participants/${id}`, {
        status: "joined",
        });

        fetchDetails();
    } catch (error) {
        console.error("Failed to undo:", error);
    }
    };

    const attendedCount = participants.filter(
    (p) => p.status === "attended"
    ).length;

    const joinedCount = participants.filter(
    (p) => p.status === "joined" || p.status === "attended"
    ).length;

    if (!request) {
    return (
        <div className="p-6 text-gray-500">
        Loading request details...
        </div>
    );
    }
    return (
        <div className="space-y-6">

        {/* BACK */}
        <button
            onClick={() => navigate("/admin/requests")}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600"
        >
            <FiArrowLeft />
            Back to Blood Requests
        </button>

        {/* HEADER */}
        <div className="bg-white rounded-3xl p-6 shadow-sm space-y-4">

            <div className="flex justify-between items-start">

            <div>
                <h1 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                {request.title}

                <span className="text-xs px-3 py-1 rounded-full bg-red-50 text-red-500">
                    {request.urgency
                    ? request.urgency.charAt(0).toUpperCase() + request.urgency.slice(1)
                    : ""}
                </span>
                </h1>

                <div className="flex items-center gap-3 text-sm text-gray-400 mt-2">
                <FiCalendar />
                {request.date} • {request.startTime}
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                <FiMapPin />
                {request.venue}
                </div>
            </div>

            {/* BLOOD TYPE */}
            <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center">
                <span className="text-xl font-bold text-red-500">
                {request.bloodType}
                </span>
            </div>

            </div>

            <div className="h-px bg-gray-100" />

            <p className="text-sm text-gray-500">
            {request.description || "Urgent blood request."}
            </p>

            {/* STATS */}
            <div className="text-sm text-gray-600">
            <strong>{attendedCount}</strong> / {joinedCount} Donors Attended
            </div>

        </div>

        {/* PARTICIPANTS */}
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden">

            <div className="p-6 flex items-start justify-between">
            <div>
                <h2 className="text-lg font-semibold text-gray-900">
                Participants
                </h2>
                <p className="text-sm text-gray-400">
                Manage participant fulfillment and verification
                </p>
            </div>

            <button
                onClick={() => setAddDonorOpen(true)}
                className="bg-gradient-to-r from-[#FF6971] to-[#E0003C] text-white px-5 py-2.5 rounded-xl text-sm font-medium shadow-sm"
            >
                + Add Donor
            </button>
            </div>

            <table className="w-full text-sm">

            {/* HEADER */}
            <thead className="text-gray-400 text-xs uppercase">
                <tr>
                <th className="text-left px-6 py-3">Name</th>
                <th className="text-left px-6 py-3">Blood Type</th>
                <th className="text-left px-6 py-3">Contact</th>
                <th className="text-left px-6 py-3">Status</th>
                <th className="text-right px-6 py-3">Actions</th>
                </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
            {participants.length === 0 ? (
                <tr>
                <td colSpan="5" className="px-6 py-10 text-center text-gray-400">
                    No participants yet
                </td>
                </tr>
            ) : (
                participants.map((p) => (
                <tr key={p._id} className="hover:bg-gray-50 transition">

                    {/* NAME */}
                    <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 text-sm font-semibold">
                        {p.donor?.displayName?.split(" ").map(n => n[0]).join("").slice(0,2)}
                        </div>

                        <div>
                        <p className="font-semibold text-gray-800">{p.donor?.displayName}</p>
                        <p className="text-xs text-gray-400">
                            Joined {new Date(p.registeredAt).toLocaleDateString("en-GB")}
                        </p>
                        </div>
                    </div>
                    </td>

                    {/* BLOOD */}
                    <td className="px-6 py-5">
                    <span className="px-3 py-1 rounded-full bg-red-500 text-white text-xs">
                        {p.donor?.bloodType}
                    </span>
                    </td>

                    {/* CONTACT */}
                    <td className="px-6 py-5 text-gray-500">
                    {p.donor?.contactNumber || "N/A"}
                    </td>

                    {/* STATUS */}
                    <td className="px-6 py-5">
                    {p.status === "joined" && (
                        <span className="px-3 py-1 rounded-full bg-yellow-50 text-yellow-600 text-xs">
                        Joined
                        </span>
                    )}

                    {p.status === "attended" && (
                        <span className="px-3 py-1 rounded-full bg-green-50 text-green-600 text-xs">
                        Attended
                        </span>
                    )}

                    {p.status === "missed" && (
                        <span className="px-3 py-1 rounded-full bg-red-50 text-red-500 text-xs">
                        Missed
                        </span>
                    )}

                    {p.status === "cancelled" && (
                        <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-500 text-xs">
                        Cancelled
                        </span>
                    )}
                    </td>

                    {/* ACTIONS */}
                    <td className="px-6 py-5 text-right">
                    {p.status === "joined" && (
                        <div className="flex justify-end gap-2">
                        <button
                            onClick={() => handleAttend(p._id)}
                            className="px-4 py-2 text-xs rounded-lg bg-green-500 text-white hover:bg-green-600 transition"
                        >
                            Verify & Mark Attended
                        </button>

                        <button
                            onClick={() => handleMissed(p._id)}
                            className="px-4 py-2 text-xs rounded-lg text-red-500 hover:bg-red-50 transition"
                        >
                            Mark Missed
                        </button>
                        </div>
                    )}

                    {(p.status === "attended" || p.status === "missed") && (
                        <button
                        onClick={() => handleUndo(p._id)}
                        className="text-gray-400 hover:text-gray-600 text-xs"
                        >
                        Undo
                        </button>
                    )}
                    </td>

                </tr>
                ))
            )}
            </tbody>

            </table>
            <AddRequestParticipantModal
            isOpen={addDonorOpen}
            onClose={() => setAddDonorOpen(false)}
            requestId={id}
            bloodType={request.bloodType}
            onAdded={fetchDetails}
            />
        </div>

    </div>
    );
    };

    export default BloodRequestDetails;