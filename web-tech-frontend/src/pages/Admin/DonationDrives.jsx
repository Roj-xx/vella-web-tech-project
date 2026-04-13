import { useState, useEffect } from "react";
import CreateDonationDriveModal from "../../components/modals/admin/CreateDonationDriveModal";
import EditDonationDriveModal from "../../components/modals/admin/EditDonationDriveModal";
import DeleteDonationDriveModal from "../../components/modals/admin/DeleteDonationDriveModal";
import DonationDriveCard from "../../components/cards/admin/DonationDriveCard";
import coverImage from "../../assets/images/cover.png";
import api from "../../services/api";

const DonationDrives = () => {

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";
  const BACKEND_ORIGIN = API_URL.replace("/api/v1", "");
  // CREATE MODAL
  const [createOpen, setCreateOpen] = useState(false);

  // EDIT MODAL
  const [editOpen, setEditOpen] = useState(false);
  const [selectedDrive, setSelectedDrive] = useState(null);

  // DELETE MODAL
  const [deleteOpen, setDeleteOpen] = useState(false);

  // DRIVES DATA
  const [drives, setDrives] = useState([]);

  // FORM DATA
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    date: "",
    time: "",
    maxParticipants: "",
    description: "",
    image: null,
    preview: null,
  });

  const fetchDrives = async () => {
    try {
      const response = await api.get("/drives");
      const driveList = response.data.data || [];

      const drivesWithCounts = await Promise.all(
        driveList.map(async (drive) => {
          try {
            const participantsRes = await api.get(`/drives/${drive._id}/participants`);
            const participants = participantsRes.data.participants || [];

            const joinedCount = participants.filter(
              (participant) =>
                participant.status === "joined" || participant.status === "attended"
            ).length;

            return {
              ...drive,
              registered: joinedCount,
              image: drive.imageUrl
              ? `${BACKEND_ORIGIN}${drive.imageUrl}`
              : coverImage,
            };
          } catch (error) {
            console.error(`Failed to fetch participants for drive ${drive._id}:`, error);
            return {
              ...drive,
              registered: 0,
              image: drive.imageUrl
                ? `${BACKEND_ORIGIN}${drive.imageUrl}`
                : coverImage,
            };
          }
        })
      );

      setDrives(drivesWithCounts);
    } catch (error) {
      console.error("Failed to fetch donation drives:", error);
    }
  };

  useEffect(() => {
    fetchDrives();
  }, []);

  // HANDLE INPUT
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // IMAGE UPLOAD
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);

    setFormData((prev) => ({
      ...prev,
      image: file,
      preview,
    }));
  };

  // REMOVE IMAGE
  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: null,
      preview: null,
    }));
  };

  // CREATE DRIVE
  const handleCreateDrive = async () => {
    try {
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("location", formData.location);
      payload.append("date", formData.date);
      payload.append("time", formData.time);
      payload.append(
        "maxParticipants",
        formData.maxParticipants ? Number(formData.maxParticipants) : 0
      );
      payload.append("description", formData.description);
      payload.append("status", "Upcoming");

      if (formData.image) {
        payload.append("image", formData.image);
      }

      await api.post("/drives", payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      fetchDrives();
      setCreateOpen(false);

      setFormData({
        title: "",
        location: "",
        date: "",
        time: "",
        maxParticipants: "",
        description: "",
        image: null,
        preview: null,
      });
    } catch (error) {
      console.error("Failed to create donation drive:", error);
    }
  };

  // EDIT CLICK
  const handleEditClick = (drive) => {
    setSelectedDrive(drive);

    setFormData({
      title: drive.title || "",
      location: drive.location || "",
      date: drive.date || "",
      time: drive.time || "",
      maxParticipants: drive.maxParticipants || "",
      description: drive.description || "",
      image: null,
      preview: drive.image || null,
    });

    setEditOpen(true);
  };

  // UPDATE DRIVE
  const handleUpdateDrive = async () => {
    try {
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("location", formData.location);
      payload.append("date", formData.date);
      payload.append("time", formData.time);
      payload.append(
        "maxParticipants",
        formData.maxParticipants ? Number(formData.maxParticipants) : 0
      );
      payload.append("description", formData.description);

      if (formData.image instanceof File) {
        payload.append("image", formData.image);
      }

      await api.put(`/drives/${selectedDrive._id}`, payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      fetchDrives();
      setEditOpen(false);
    } catch (error) {
      console.error("Failed to update donation drive:", error);
    }
  };

  // DELETE CLICK
  const handleDeleteClick = (drive) => {
    setSelectedDrive(drive);
    setDeleteOpen(true);
  };

  // CONFIRM DELETE
  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/drives/${selectedDrive._id}`);

      fetchDrives();
      setDeleteOpen(false);
    } catch (error) {
      console.error("Failed to delete donation drive:", error);
    }
  };

  return (
    // add ng p-6
    <div className="space-y-6 p-6 -ml-10">

      {/* HEADER */}
      <div className="flex justify-between items-center">

{/* font  ginawang bold */}

        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Donation Drives
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Organize and manage blood donation events
          </p>
        </div>

        <button
          onClick={() => {
            setFormData({
              title: "",
              location: "",
              date: "",
              time: "",
              maxParticipants: "",
              description: "",
              image: null,
              preview: null,
            });
            setCreateOpen(true);
          }}
          className="flex items-center gap-2 bg-gradient-to-r from-[#FF6971] to-[#E0003C] text-white px-6 py-3 rounded-xl font-medium shadow-md hover:opacity-90 transition"
        >
          <span className="text-lg font-bold">+</span>
          Create Donation Drive
        </button>

      </div>

      {/* CARD GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {drives.length === 0 ? (
          <p className="text-gray-400 text-sm">
            No donation drives yet
          </p>
        ) : (
          drives.map((drive) => (
            <DonationDriveCard
              key={drive._id}
              drive={{
                ...drive,
                registered: drive.registered || 0,
              }}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          ))
        )}

      </div>

      {/* CREATE MODAL */}
      <CreateDonationDriveModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        formData={formData}
        handleChange={handleChange}
        handleImageUpload={handleImageUpload}
        handleSubmit={handleCreateDrive}
      />

      {/* EDIT MODAL */}
      <EditDonationDriveModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        formData={formData}
        handleChange={handleChange}
        handleImageUpload={handleImageUpload}
        handleRemoveImage={handleRemoveImage}
        handleSubmit={handleUpdateDrive}
      />

      {/* DELETE MODAL */}
      <DeleteDonationDriveModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        drive={selectedDrive}
      />

    </div>
  );
};


export default DonationDrives;