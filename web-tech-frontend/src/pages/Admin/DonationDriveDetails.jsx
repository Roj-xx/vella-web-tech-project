    import { useState, useEffect } from "react";
    import { useNavigate, useParams } from "react-router-dom";
    import api from "../../services/api";
    import { FiArrowLeft, FiMapPin, FiCalendar } from "react-icons/fi";
    import AddDriveParticipantModal from "../../components/modals/admin/AddDriveParticipantModal";
    import coverImage from "../../assets/images/cover.png";

    /* 🔥 ROW COMPONENT */
    const Row = ({
    _id,
    donor,
    registeredAt,
    status,
    handleMarkAttended,
    handleMarkMissed,
    handleUndo,
    }) => {
    return (
        <tr className="hover:bg-gray-50 transition">

        {/* NAME */}
        <td className="px-6 py-5">
            <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 text-sm font-semibold">
                {donor?.displayName?.split(" ").map(n => n[0]).join("").slice(0, 2)}
            </div>

            <div>
                <p className="font-semibold text-gray-800">{donor?.displayName}</p>
                <p className="text-xs text-gray-400">Joined {new Date(registeredAt).toLocaleDateString("en-GB")}</p>
            </div>
            </div>
        </td>

        {/* BLOOD */}
        <td className="px-6 py-5">
            <span className="px-3 py-1.5 rounded-full bg-red-500 text-white text-xs">
            {donor?.bloodType}
            </span>
        </td>

        {/* ADDRESS */}
        <td className="px-6 py-5 text-gray-500 text-sm">
            {donor?.address || "N/A"}
        </td>

        {/* STATUS */}
        <td className="px-6 py-5">
            {status === "joined" && (
            <span className="px-4 py-1.5 rounded-full bg-yellow-50 text-yellow-600 text-xs">
                Joined
            </span>
            )}

            {status === "attended" && (
            <span className="px-4 py-1.5 rounded-full bg-green-50 text-green-600 text-xs">
                Attended
            </span>
            )}

            {status === "missed" && (
            <span className="px-4 py-1.5 rounded-full bg-red-50 text-red-500 text-xs">
                Missed
            </span>
            )}
        </td>

        {/* ACTIONS */}
        <td className="px-6 py-5 text-right">

            {/* JOINED */}
            {status === "joined" && (
            <div className="flex justify-end gap-2">

                <button
                onClick={() => handleMarkAttended(_id)}
                className="px-4 py-2 text-xs rounded-lg bg-green-500 text-white hover:bg-green-600 transition"
                >
                Mark Attended
                </button>

                <button
                onClick={() => handleMarkMissed(_id)}
                className="px-4 py-2 text-xs rounded-lg text-red-500 hover:bg-red-50 transition"
                >
                Mark Missed
                </button>

            </div>
            )}

            {/* VERIFIED / MISSED */}
            {(status === "attended" || status === "missed") && (
            <button
                onClick={() => handleUndo(_id)}
                className="px-4 py-2 text-xs rounded-lg text-gray-500 hover:bg-gray-100 transition"
            >
                Undo
            </button>
            )}

        </td>

        </tr>
    );
    };



    /* 🔥 MAIN COMPONENT */
    const DonationDriveDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [drive, setDrive] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [addDonorOpen, setAddDonorOpen] = useState(false);
    
    const fetchDetails = async () => {
    try {
        const res = await api.get(`/drives/${id}/participants`, {
        params: { t: Date.now() }
        });

        setDrive(res.data.drive);
        setParticipants(res.data.participants);

    } catch (error) {
        console.error("Failed to fetch drive details:", error);
    }
    };

    useEffect(() => {
    fetchDetails();
    }, []);

    // 🔥 AUTO COUNT VERIFIED
    const attendedCount = participants.filter(
    (p) => p.status === "attended"
    ).length;

    const joinedCount = participants.filter(
    (p) => p.status === "joined" || p.status === "attended"
    ).length;

    // 🔥 HANDLERS
    const handleMarkAttended = async (id) => {
    try {
        await api.put(`/drives/participants/${id}`, {
        status: "attended",
        });
        fetchDetails();
    } catch (error) {
        console.error("Failed to mark attended:", error);
    }
    };

    const handleMarkMissed = async (id) => {
    try {
        await api.put(`/drives/participants/${id}`, {
        status: "missed",
        });
        fetchDetails();
    } catch (error) {
        console.error("Failed to mark missed:", error);
    }
    };

    const handleUndo = async (id) => {
    try {
        await api.put(`/drives/participants/${id}`, {
        status: "joined",
        });
        fetchDetails();
    } catch (error) {
        console.error("Failed to undo:", error);
    }
    };

    if (!drive) {
    return <div className="p-6 text-gray-400">Loading...</div>;
    }

    return (
        <div className="space-y-6 p-6 bg-gray-50 min-h-screen">

        {/* BACK */}
        <button
            onClick={() => navigate(-1)}
            className="text-sm text-gray-400 flex items-center gap-2 hover:text-gray-600"
        >
            <FiArrowLeft />
            Back to Donation Drives
        </button>

        {/* HEADER */}
        <div className="bg-white rounded-3xl p-6 shadow-sm space-y-4">
            <img
                src={drive.image || coverImage}
                alt="Drive Cover"
                className="w-full h-48 object-cover rounded-2xl"
            />
            <h2 className="text-xl font-semibold text-gray-900">
            {drive.title}
            </h2>

            <div className="flex items-center gap-4 text-sm text-gray-400">
            <FiCalendar />
            {drive.date} • {drive.time}
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-400">
            <FiMapPin />
            {drive.location}
            </div>

            <div className="h-px bg-gray-100" />

            <p className="text-sm text-gray-500">
            {drive.description}
            </p>

            {/* 🔥 LIVE COUNT */}
            <div className="text-sm text-gray-600">
            <strong>{attendedCount}</strong> / {joinedCount} Donors Attended
            </div>

        </div>

        {/* PARTICIPANTS TABLE */}
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden">

            <div className="p-6 flex items-start justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                        Participants
                    </h3>
                    <p className="text-sm text-gray-400">
                        Manage participant attendance and verification
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

            {/* 🔥 HEADER BACK */}
            <thead className="text-gray-400 text-xs uppercase">
                <tr>
                <th className="text-left px-6 py-3">Name</th>
                <th className="text-left px-6 py-3">Blood</th>
                <th className="text-left px-6 py-3">Address</th>
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
                    <Row
                    key={p._id}
                    {...p}
                    handleMarkAttended={handleMarkAttended}
                    handleMarkMissed={handleMarkMissed}
                    handleUndo={handleUndo}
                    />
                ))
                )}
            </tbody>

            </table>
            <AddDriveParticipantModal
                isOpen={addDonorOpen}
                onClose={() => setAddDonorOpen(false)}
                driveId={id}
                onAdded={fetchDetails}
            />
        </div>

        </div>
    );
    };

    export default DonationDriveDetails;