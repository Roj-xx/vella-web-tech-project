    import { FiX, FiClock } from "react-icons/fi";

    const CreateDonationDriveModal = ({
    isOpen,
    onClose,
    formData,
    handleChange,
    handleSubmit,
    }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">

        <div className="bg-white w-[640px] max-h-[90vh] overflow-y-auto rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.15)]">

            {/* HEADER */}
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
            <div>
                <h2 className="text-xl font-semibold text-gray-900">
                Create Donation Drive
                </h2>
                <p className="text-sm text-gray-500">
                Fill in the details to organize a new blood drive
                </p>
            </div>

            <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 transition"
            >
                <FiX className="text-gray-600" />
            </button>
            </div>

            {/* BODY */}
            <div className="p-6 space-y-6">

            {/* BASIC INFO */}
            <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Basic Information
                </h3>

                <div className="space-y-4">

                <InputField
                    label="Title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Community Blood Drive"
                    required
                />

                <InputField
                    label="Location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g., Marinduque Provincial Hospital"
                    required
                />

                </div>
            </div>

            {/* SCHEDULE */}
            <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Schedule
                </h3>

                <div className="grid grid-cols-2 gap-4">

                <InputField
                    label="Date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                />

                {/* ✅ CLEAN TIME INPUT */}
                <div>
                    <label className="text-sm font-medium text-gray-700">
                    Time <span className="text-red-500">*</span>
                    </label>

                    <div className="relative mt-1">

                    {/* CLOCK ICON */}
                    <FiClock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                    <input
                        type="text"
                        name="time"
                        placeholder="e.g., 9:00 AM - 5:00 PM"
                        value={formData.time}
                        onChange={handleChange}
                        className="w-full border border-gray-200 rounded-xl pl-10 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#FF6971]/30"
                    />

                    </div>
                </div>

                </div>
            </div>

            {/* DETAILS */}
            <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Details
                </h3>

                <div className="space-y-4">

                <InputField
                    label="Max Participants"
                    name="maxParticipants"
                    type="number"
                    value={formData.maxParticipants}
                    onChange={handleChange}
                    required
                />

                {/* DESCRIPTION */}
                <div>
                    <label className="text-sm font-medium text-gray-700">
                    Description <span className="text-red-500">*</span>
                    </label>

                    <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe the donation drive, goals, and requirements..."
                    className="w-full mt-1 border border-gray-200 rounded-xl p-3 text-sm outline-none h-28 focus:ring-2 focus:ring-[#FF6971]/30"
                    />
                </div>

                </div>
            </div>

        </div>

            {/* FOOTER */}
            <div className="flex justify-end gap-3 p-5 border-t border-gray-100">

            <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition"
            >
                Cancel
            </button>

            <button
                onClick={handleSubmit}
                className="px-6 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#FF6971] to-[#E0003C] hover:opacity-90 transition shadow-sm"
            >
                Create Drive
            </button>

            </div>

        </div>
        </div>
    );
    };

    export default CreateDonationDriveModal;


    /* 🔥 INPUT FIELD */
    const InputField = ({
    label,
    name,
    value,
    onChange,
    placeholder,
    type = "text",
    required = false,
    }) => (
    <div>
        <label className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
        </label>

        <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#FF6971]/30"
        />
    </div>
    );