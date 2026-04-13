import { useState } from "react";
import { useEffect } from "react";
import api from "../../services/api";
import CreateBloodRequestModal from "../../components/modals/admin/CreateBloodRequestModal";
import EditBloodRequestModal from "../../components/modals/admin/EditBloodRequestModal";
import DeleteDonationDriveModal from "../../components/modals/admin/DeleteDonationDriveModal"; // ✅ REUSED
import BloodRequestCard from "../../components/cards/admin/BloodRequestCard";

const RequestBlood = () => {

  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [selectedRequest, setSelectedRequest] = useState(null);

  const [requests, setRequests] = useState([]);

  const [formData, setFormData] = useState({
    bloodType: "",
    title: "",
    urgency: "Medium",
    location: "",
    date: "",
    time: "",
    maxParticipants: "",
    description: "",
  });

  // ✅ HANDLE INPUT
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ CREATE
  const handleSubmit = async () => {
    try {
      await api.post("/requests", {
        title: formData.title,
        bloodType: formData.bloodType,
        urgency: formData.urgency.toLowerCase(),
        venue: formData.location,
        date: formData.date,
        startTime: formData.time,
        maxParticipants: formData.maxParticipants ? Number(formData.maxParticipants) : 0,
        description: formData.description,
      });

      fetchRequests();

      setFormData({
        bloodType: "",
        title: "",
        urgency: "Medium",
        location: "",
        date: "",
        time: "",
        maxParticipants: "",
        description: "",
      });
      setOpen(false);

    } catch (error) {
      console.error("Failed to create request:", error);
    }
  };

  // ✅ OPEN EDIT
  const handleEdit = (req) => {
    setSelectedRequest(req);

    setFormData({
      title: req.title || "",
      bloodType: req.bloodType || "",
      urgency: req.urgency || "medium",
      location: req.venue || "",
      date: req.date || "",
      time: req.startTime || "",
      maxParticipants: req.maxParticipants || "",
      description: req.description || "",
    });

    setEditOpen(true);
  };

  // ✅ UPDATE
  const handleUpdate = async () => {
    try {
      await api.put(`/requests/${selectedRequest._id}`, {
        title: formData.title,
        bloodType: formData.bloodType,
        urgency: formData.urgency,
        venue: formData.location,
        date: formData.date,
        startTime: formData.time,
        maxParticipants: formData.maxParticipants ? Number(formData.maxParticipants) : 0,
        description: formData.description,
      });

      fetchRequests();
      setEditOpen(false);

    } catch (error) {
      console.error("Failed to update request:", error);
    }
  };

  // ✅ OPEN DELETE MODAL
  const handleDeleteClick = (req) => {
    setSelectedRequest(req);
    setDeleteOpen(true);
  };

  // ✅ CONFIRM DELETE
  const confirmDelete = async () => {
    try {
      await api.delete(`/requests/${selectedRequest._id}`);

      fetchRequests();
      setDeleteOpen(false);

    } catch (error) {
      console.error("Failed to delete request:", error);
    }
  };

  const fetchRequests = async () => {
    try {
      const response = await api.get("/requests");
      const requestList = response.data.data || [];

      const requestsWithCounts = await Promise.all(
        requestList.map(async (req) => {
          try {
            const participantsRes = await api.get(`/requests/${req._id}/participants`);
            const participants = participantsRes.data.participants || [];

            const joinedCount = participants.filter(
              (participant) =>
                participant.status === "joined" || participant.status === "attended"
            ).length;

            return {
              ...req,
              joinedCount,
            };
          } catch (error) {
            console.error(`Failed to fetch participants for request ${req._id}:`, error);
            return {
              ...req,
              joinedCount: 0,
            };
          }
        })
      );

      setRequests(requestsWithCounts);
    } catch (error) {
      console.error("Failed to fetch requests:", error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="space-y-6 p-6 -ml-10">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          {/* font ginawang bold */}
          <h1 className="text-3xl font-bold text-gray-900">
            Blood Requests
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Create and manage blood type-specific requests
          </p>
        </div>

        <button
          onClick={() => {
            setFormData({
              bloodType: "",
              title: "",
              urgency: "Medium",
              location: "",
              date: "",
              time: "",
              maxParticipants: "",
              description: "",
            });
            setOpen(true);
          }}
          className="flex items-center gap-2 bg-gradient-to-r from-[#FF6971] to-[#E0003C] text-white px-6 py-3 rounded-xl font-medium shadow-md"
        >
          + Create Request
        </button>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {requests.map((req) => (
          <BloodRequestCard
            key={req._id}
            request={{
              ...req,
              title: req.title || `${req.bloodType} Blood Request`,
              description: req.description || "",
              venue: req.venue,
              date: req.date,
              time: req.startTime,
              maxParticipants: req.maxParticipants || 0,
              joinedCount: req.joinedCount || 0,
            }}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />
        ))}
      </div>

      {/* CREATE MODAL */}
      <CreateBloodRequestModal
        isOpen={open}
        onClose={() => setOpen(false)}
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        setFormData={setFormData}
      />

      {/* EDIT MODAL */}
      <EditBloodRequestModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleUpdate}
        setFormData={setFormData}
      />

      {/* ✅ DELETE MODAL (REUSED 🔥) */}
      <DeleteDonationDriveModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Blood Request"
        message="Are you sure you want to delete this blood request? This action cannot be undone."
      />

    </div>
  );
};

export default RequestBlood;