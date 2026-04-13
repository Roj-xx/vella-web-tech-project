    import { FiX, FiUser, FiDroplet, FiMapPin, FiCalendar } from "react-icons/fi";

    const ViewDonorModal = ({
    isOpen,
    onClose,
    donor,
    }) => {
    if (!isOpen || !donor) return null;

    const name = donor.displayName || "Unknown";
    const blood = donor.bloodType || "Not Set";
    const address = donor.address || "Not Provided";
    const date = donor.lastDonationDate
    ? new Date(donor.lastDonationDate).toLocaleDateString("en-GB")
    : "No Record";

    const initials = name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2);

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">

        <div className="bg-white w-[520px] rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden">

            {/* HEADER */}
            <div className="flex justify-between items-start p-6 border-b border-gray-100">
            <div>
                <h2 className="text-lg font-semibold text-gray-900">
                View Donor
                </h2>
                <p className="text-sm text-gray-500">
                Donor profile information
                </p>
            </div>

            <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 transition hover:scale-105"
            >
                <FiX className="text-gray-600 text-lg" />
            </button>
            </div>

            {/* PROFILE */}
            <div className="flex flex-col items-center py-8 bg-gradient-to-b from-[#FFF5F6] to-white">

            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#FF6971] to-[#E0003C] text-white flex items-center justify-center text-2xl font-semibold shadow-lg">
                {initials}
            </div>

            <h3 className="mt-4 text-lg font-semibold text-gray-800">
                {name}
            </h3>

            <div className="mt-2 px-4 py-1.5 rounded-full bg-[#FDECEC] text-[#E0003C] text-xs font-semibold flex items-center gap-2">
                <FiDroplet />
                {blood}
            </div>
            </div>

            {/* DETAILS (LIST STYLE) */}
            <div className="px-6 pb-6 space-y-4">

            <ListItem icon={<FiUser />} label="Full Name" value={name} />

            <ListItem
                icon={<FiDroplet className="text-red-500" />}
                label="Blood Type"
                value={blood}
            />

            <ListItem
                icon={<FiMapPin />}
                label="Address"
                value={address}
            />

            <ListItem
                icon={<FiCalendar />}
                label="Last Donation Date"
                value={date}
            />

            </div>

        </div>
        </div>
    );
    };

    export default ViewDonorModal;


    /* 🔥 LIST ITEM STYLE */
    const ListItem = ({ icon, label, value }) => (
    <div className="flex items-start gap-3 py-2 border-b border-gray-100 last:border-none">

        <div className="text-gray-400 mt-1">
        {icon}
        </div>

        <div className="flex flex-col">
        <span className="text-xs text-gray-500">
            {label}
        </span>
        <span className="text-sm font-medium text-gray-800">
            {value}
        </span>
        </div>

    </div>
    );