import { useEffect, useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import api from "../../../services/api";

const AddDriveParticipantModal = ({
  isOpen,
  onClose,
  driveId,
  onAdded,
}) => {
  const [search, setSearch] = useState("");
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addingId, setAddingId] = useState(null);
  const [participantStatuses, setParticipantStatuses] = useState({});

  const fetchDonors = async () => {
    if (!isOpen) return;

    try {
      setLoading(true);

      const response = await api.get("/donors", {
        params: {
          search: search || undefined,
          page: 1,
          limit: 50,
        },
      });

      setDonors(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch donors:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchParticipants = async () => {
  if (!isOpen) return;

  try {
    const response = await api.get(`/drives/${driveId}/participants`);
    console.log("DRIVE PARTICIPANTS RESPONSE:", response.data);

    const statusMap = {};
    const participants =
      response.data.data ||
      response.data.participants ||
      response.data ||
      [];

    participants.forEach((participant) => {
      const donorId =
        participant.donorId?._id ||
        participant.donorId ||
        participant.donor?._id ||
        participant.donor;

      if (donorId) {
        statusMap[donorId] = participant.status;
      }
    });

    setParticipantStatuses(statusMap);
  } catch (error) {
    console.error("Failed to fetch request participants:", error);
  }
};

  useEffect(() => {
  fetchDonors();
  fetchParticipants();
}, [isOpen, search, driveId]);

  const handleAdd = async (donorId) => {
    try {
      setAddingId(donorId);

      await api.post(`/drives/${driveId}/participants/manual`, {
        donorId,
      });

      setParticipantStatuses((prev) => ({
        ...prev,
        [donorId]: "joined",
      }));
      onAdded?.();
      setSearch("");
    } catch (error) {
      console.error("Failed to add donor to drive:", error);
      alert(error.response?.data?.message || "Failed to add donor");
    } finally {
      setAddingId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-[680px] max-h-[85vh] rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col">
        <div className="flex justify-between items-start p-6 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Add Donor to Drive
            </h2>
            <p className="text-sm text-gray-500">
              Search existing complete donor profiles
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition"
          >
            <FiX className="text-gray-600 text-lg" />
          </button>
        </div>

        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2">
            <FiSearch className="text-gray-400" />
            <input
              type="text"
              placeholder="Search donor by name or contact..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 outline-none text-sm"
            />
          </div>
        </div>

        <div className="p-6 overflow-y-auto">
          {loading ? (
            <p className="text-sm text-gray-400">Loading donors...</p>
          ) : donors.length === 0 ? (
            <p className="text-sm text-gray-400">No matching donors found.</p>
          ) : (
            <div className="space-y-3">
              {donors.map((donor) => {
              const donorStatus = participantStatuses[donor._id];
              const isAdded = donorStatus === "joined" || donorStatus === "attended";

              return (
                <div
                  key={donor._id}
                  className="border border-gray-200 rounded-2xl p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-r from-[#FF6971] to-[#E0003C] text-white flex items-center justify-center font-semibold">
                      {donor.displayName
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </div>

                    <div>
                      <p className="font-semibold text-gray-800">{donor.displayName}</p>
                      <p className="text-xs text-gray-400">
                        {donor.contactNumber || "No contact number"}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {donor.bloodType} • {donor.address || "No address"}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAdd(donor._id)}
                    disabled={addingId === donor._id || isAdded}
                    className={`px-4 py-2 rounded-xl text-sm font-medium ${
                      isAdded
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-gradient-to-r from-[#FF6971] to-[#E0003C] text-white"
                    }`}
                  >
                    {addingId === donor._id
                    ? "Adding..."
                    : donorStatus === "attended"
                    ? "Attended"
                    : donorStatus === "joined"
                    ? "Joined"
                    : "Add"}
                  </button>
                </div>
              );
            })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddDriveParticipantModal;