    import { FiX, FiUser, FiDroplet, FiPhone, FiMapPin, FiCalendar } from "react-icons/fi";

    const EditDonorModal = ({
    isOpen,
    onClose,
    formData,
    handleChange,
    handleBloodChange,
    handleSubmit,
    }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">

        <div className="bg-white w-[520px] rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden">

            {/* HEADER */}
            <div className="flex justify-between items-start p-6 border-b border-gray-100">
            <div>
                <h2 className="text-lg font-semibold text-gray-900">
                Edit Donor
                </h2>
                <p className="text-sm text-gray-500">
                Update donor information
                </p>
            </div>

            <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 transition"
            >
                <FiX className="text-gray-500 text-lg" />
            </button>
            </div>

            {/* FORM */}
            <div className="p-6 space-y-5">

            <InputField
                icon={<FiUser />}
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
            />

            <SelectField
                icon={<FiDroplet className="text-red-500" />}
                label="Blood Type"
                name="blood"
                value={formData.blood}
                onChange={handleBloodChange}
            />

            <InputField
                icon={<FiPhone />}
                label="Contact Number"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
            />

            <InputField
                icon={<FiMapPin />}
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
            />

            <InputField
                icon={<FiCalendar />}
                label="Last Donation Date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
            />

            </div>

            {/* FOOTER */}
            <div className="flex justify-end gap-3 p-5 border-t border-gray-100">
            <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100"
            >
                Cancel
            </button>

            <button
                onClick={handleSubmit}
                className="px-6 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#FF6971] to-[#E0003C]"
            >
                Save Changes
            </button>
            </div>

        </div>
        </div>
    );
    };

    export default EditDonorModal;


    /* REUSABLE INPUT */
    const InputField = ({ icon, label, name, value, onChange, type = "text" }) => (
    <div>
        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
        {label}
        </label>

        <div className="mt-2 flex items-center gap-3 border border-gray-200 rounded-xl px-3 py-2.5 bg-white">
        <span className="text-gray-400">{icon}</span>
        <input
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            className="w-full outline-none text-sm bg-transparent"
        />
        </div>
    </div>
    );


    /* REUSABLE SELECT */
    const SelectField = ({ icon, label, name, value, onChange }) => (
    <div>
        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
        {label}
        </label>

        <div className="mt-2 flex items-center gap-3 border border-gray-200 rounded-xl px-3 py-2.5 bg-white">
        <span className="text-gray-400">{icon}</span>
        <select
            name={name}
            value={value}
            onChange={onChange}
            className="w-full outline-none text-sm bg-transparent"
        >
            <option value="">Select blood type</option>
            <option>O+</option><option>O-</option>
            <option>A+</option><option>A-</option>
            <option>B+</option><option>B-</option>
            <option>AB+</option><option>AB-</option>
        </select>
        </div>
    </div>
    );