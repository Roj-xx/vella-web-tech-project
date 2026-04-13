    import { FiX } from "react-icons/fi";

    const EditDonationDriveModal = ({
    isOpen,
    onClose,
    formData,
    handleChange,
    handleSubmit,
    setFormData,
    }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

        <div className="bg-white w-[620px] rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden">

            {/* HEADER */}
            <div className="flex justify-between items-start p-6 border-b border-gray-100">
            <div>
                <h2 className="text-lg font-semibold text-gray-900">
                Edit Donation Drive
                </h2>
                <p className="text-sm text-gray-500">
                Update donation drive details
                </p>
            </div>

            <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 transition"
            >
                <FiX className="text-gray-500 text-lg" />
            </button>
            </div>

            {/* BODY */}
            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">

            {/* INPUT FIELD */}
            <Field
                label="Title *"
                name="title"
                value={formData.title}
                onChange={handleChange}
            />

            <Field
                label="Location *"
                name="location"
                value={formData.location}
                onChange={handleChange}
            />

            {/* DATE + TIME */}
            <div className="grid grid-cols-2 gap-4">
                <Field
                label="Date *"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                />

                <Field
                label="Time *"
                name="time"
                placeholder="e.g. 09:00 AM"
                value={formData.time}
                onChange={handleChange}
                />
            </div>

            {/* STATUS */}
            <div className="mb-4">
            <label className="text-sm text-gray-600">Drive Status</label>

            <div className="grid grid-cols-3 gap-3 mt-2">
                {["Upcoming", "Completed", "Cancelled"].map((status) => (
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
                        ? status === "Completed"
                        ? "bg-green-500 text-white"
                        : status === "Cancelled"
                        ? "bg-red-500 text-white"
                        : "bg-yellow-500 text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                >
                    {status}
                </button>
                ))}
            </div>
            </div>

            <Field
                label="Max Participants *"
                name="maxParticipants"
                type="number"
                value={formData.maxParticipants}
                onChange={handleChange}
            />

            {/* DESCRIPTION */}
            <div>
                <label className="text-sm text-gray-600">
                Description *
                </label>

                <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6971]"
                />
            </div>

        </div>

            {/* FOOTER */}
            <div className="flex justify-end gap-3 p-5 border-t border-gray-100">

            <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl text-sm text-gray-600 hover:bg-gray-100 transition"
            >
                Cancel
            </button>

            <button
                onClick={handleSubmit}
                className="px-5 py-2 rounded-xl text-sm text-white bg-gradient-to-r from-[#FF6971] to-[#E0003C] shadow hover:opacity-90 transition"
            >
                Save Changes
            </button>

            </div>

        </div>
        </div>
    );
    };

    export default EditDonationDriveModal;


    /* 🔥 REUSABLE FIELD */
    const Field = ({
    label,
    name,
    value,
    onChange,
    type = "text",
    placeholder = "",
    }) => (
    <div>
        <label className="text-sm text-gray-600">
        {label}
        </label>

        <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6971]"
        />
    </div>
    );