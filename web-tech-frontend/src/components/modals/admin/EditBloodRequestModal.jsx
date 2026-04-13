    import { FiX } from "react-icons/fi";

    const EditBloodRequestModal = ({
    isOpen,
    onClose,
    formData,
    handleChange,
    handleSubmit,
    setFormData,
    }) => {
    if (!isOpen) return null;

    const bloodTypes = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

    const handleBloodSelect = (type) => {
        setFormData((prev) => ({
        ...prev,
        bloodType: type,
        }));
    };

    const handleUrgency = (level) => {
        setFormData((prev) => ({
        ...prev,
        urgency: level,
        }));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">

        {/* MODAL */}
        <div className="bg-white w-full max-w-2xl rounded-3xl shadow-xl p-6 max-h-[90vh] overflow-y-auto">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
                Edit Blood Request
            </h2>

            <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
            >
                <FiX size={20} />
            </button>
            </div>

            {/* BLOOD TYPE */}
            <div className="mb-6 p-4 rounded-2xl border border-red-200 bg-red-50">
            <p className="text-sm font-medium text-gray-700 mb-3">
                Blood Type *
            </p>

            <div className="grid grid-cols-4 gap-3">
                {bloodTypes.map((type) => (
                <button
                    key={type}
                    onClick={() => handleBloodSelect(type)}
                    className={`py-2 rounded-xl text-sm font-medium transition ${
                    formData.bloodType === type
                        ? "bg-red-500 text-white"
                        : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-100"
                    }`}
                >
                    {type}
                </button>
                ))}
            </div>

            <p className="text-xs text-red-400 mt-3">
                This request will only be visible to users with the selected blood type
            </p>
            </div>

            {/* TITLE */}
            <div className="mb-4">
            <label className="text-sm text-gray-600">Title *</label>
            <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Emergency Blood Needed - Surgery"
                className="w-full mt-1 p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-200"
            />
            </div>

            {/* URGENCY */}
            <div className="mb-4">
            <label className="text-sm text-gray-600">Urgency Level</label>

            <div className="grid grid-cols-3 gap-3 mt-2">
                {["Low", "Medium", "High"].map((level) => (
                <button
                    key={level}
                    onClick={() => handleUrgency(level)}
                    className={`py-2 rounded-xl text-sm font-medium transition ${
                    formData.urgency === level
                        ? level === "High"
                        ? "bg-red-500 text-white"
                        : level === "Medium"
                        ? "bg-orange-500 text-white"
                        : "bg-gray-500 text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                >
                    {level}
                </button>
                ))}
            </div>
            </div>
            {/* STATUS */}
            <div className="mb-4">
            <label className="text-sm text-gray-600">Request Status</label>

            <div className="grid grid-cols-2 gap-3 mt-2">
                {["Pending", "Fulfilled"].map((status) => (
                <button
                    type="button"
                    key={status}
                    onClick={() =>
                    setFormData((prev) => ({
                        ...prev,
                        status,
                    }))
                    }
                    className={`py-2 rounded-xl text-sm font-medium transition ${
                    formData.status === status
                        ? status === "Fulfilled"
                        ? "bg-green-500 text-white"
                        : "bg-yellow-500 text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                >
                    {status}
                </button>
                ))}
            </div>
            </div>
            {/* LOCATION */}
            <div className="mb-4">
            <label className="text-sm text-gray-600">Location *</label>
            <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Manila General Hospital"
                className="w-full mt-1 p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-200"
            />
            </div>

            {/* DATE & TIME */}
            <div className="grid grid-cols-2 gap-4 mb-4">

            <div>
                <label className="text-sm text-gray-600">Date *</label>
                <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full mt-1 p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-200"
                />
            </div>

            <div>
                <label className="text-sm text-gray-600">Time *</label>
                <input
                type="text"
                name="time"
                value={formData.time}
                onChange={handleChange}
                placeholder="e.g., 9:00 AM – 5:00 PM"
                className="w-full mt-1 p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-200"
                />
            </div>

            </div>

            {/* MAX PARTICIPANTS */}
            <div className="mb-4">
            <label className="text-sm text-gray-600">
                Max Participants *
            </label>
            <input
                type="number"
                name="maxParticipants"
                value={formData.maxParticipants}
                onChange={handleChange}
                placeholder="e.g., 40"
                className="w-full mt-1 p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-200"
            />
            </div>

            {/* DESCRIPTION */}
            <div className="mb-6">
            <label className="text-sm text-gray-600">Description</label>
            <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                placeholder="Describe the request..."
                className="w-full mt-1 p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-200"
            />
            </div>

            {/* ACTIONS */}
            <div className="flex justify-end gap-3">

            <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200"
            >
                Cancel
            </button>

            <button
                onClick={handleSubmit}
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#FF6971] to-[#E0003C] text-white shadow-md hover:opacity-90"
            >
                Save Changes
            </button>

            </div>

        </div>
        </div>
    );
    };

    export default EditBloodRequestModal;