import { FiX, FiCalendar, FiClock } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";

const bloodTypes = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

const CreateBloodRequestModal = ({
  isOpen,
  onClose,
  formData,
  handleChange,
  handleSubmit,
  setFormData,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/25 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          onClick={onClose}
        >
          <div className="flex h-full w-full items-center justify-center px-4 py-6">
            <motion.div
              className="w-full max-w-3xl rounded-[28px] bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.18)] max-h-[90vh] overflow-y-auto"
              initial={{ opacity: 0, scale: 0.96, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ duration: 0.24, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              style={{ fontFamily: "Google Sans, sans-serif" }}
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-[18px] font-semibold text-gray-800">
                  Create Blood Request
                </h2>
                <button onClick={onClose} className="rounded-full p-1">
                  <FiX className="text-[20px] text-gray-400 transition hover:text-gray-600" />
                </button>
              </div>

              <div className="mb-6 rounded-2xl border border-red-100 bg-red-50/50 p-5">
                <p className="mb-3 text-sm font-medium text-gray-700">
                  Blood Type <span className="text-red-500">*</span>
                </p>

                <div className="grid grid-cols-4 gap-3">
                  {bloodTypes.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, bloodType: type }))
                      }
                      className={`rounded-xl py-2 text-sm font-medium transition ${
                        formData.bloodType === type
                          ? "bg-red-500 text-white shadow-sm"
                          : "bg-white text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                <p className="mt-3 text-xs text-red-400">
                  This request will only be visible to users with the selected blood type
                </p>
              </div>

              <div className="mb-6">
                <p className="mb-3 text-sm font-semibold text-gray-800">
                  Basic Information
                </p>

                <div className="mb-4">
                  <label className="text-sm text-gray-600">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Emergency Blood Needed - Surgery"
                    className="mt-1 w-full rounded-xl bg-gray-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-red-200"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g., Manila General Hospital, Emergency Unit"
                    className="mt-1 w-full rounded-xl bg-gray-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-red-200"
                  />
                </div>
              </div>

              <div className="mb-6">
                <p className="mb-3 text-sm font-semibold text-gray-800">
                  Schedule
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600">
                      Date <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1 flex items-center gap-2 rounded-xl bg-gray-50 px-4 py-3">
                      <FiCalendar className="text-gray-400" />
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="w-full bg-transparent text-sm outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-600">
                      Time <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1 flex items-center gap-2 rounded-xl bg-gray-50 px-4 py-3">
                      <FiClock className="text-gray-400" />
                      <input
                        type="text"
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        placeholder="e.g., 9:00 AM – 5:00 PM"
                        className="w-full bg-transparent text-sm outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="text-sm text-gray-600">Urgency Level</label>

                <div className="mt-2 flex gap-3">
                  {["Low", "Medium", "High"].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, urgency: level }))
                      }
                      className={`flex-1 rounded-xl py-2 text-sm font-medium transition ${
                        formData.urgency === level
                          ? level === "High"
                            ? "bg-red-500 text-white"
                            : level === "Medium"
                            ? "bg-orange-500 text-white"
                            : "bg-gray-400 text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <p className="mb-3 text-sm font-semibold text-gray-800">
                  Details
                </p>

                <div className="mb-4">
                  <label className="text-sm text-gray-600">
                    Max Participants <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="maxParticipants"
                    value={formData.maxParticipants}
                    onChange={handleChange}
                    placeholder="e.g., 40"
                    className="mt-1 w-full rounded-xl bg-gray-50 px-4 py-3 text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Describe the blood request, urgency, and requirements..."
                    className="mt-1 w-full rounded-xl bg-gray-50 px-4 py-3 text-sm outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={onClose}
                  className="rounded-xl bg-gray-100 px-5 py-2 text-sm text-gray-600 transition hover:bg-gray-200"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSubmit}
                  className="rounded-xl bg-gradient-to-r from-[#FF6971] to-[#E0003C] px-6 py-2 text-sm text-white shadow-md transition hover:opacity-90"
                >
                  Create Request
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreateBloodRequestModal;