import { useEffect, useMemo, useState } from "react";
import { FiMapPin, FiCalendar } from "react-icons/fi";

import Navbar from "../../components/user/Navbar";
import Footer from "../../components/user/Footer";
import JoinDriveModal from "../../components/modals/user/JoinDrive";
import CancelRequestModal from "../../components/modals/user/CancelRequest";
import CompleteProfileModal from "../../components/modals/user/CompleteProfile";

import bloodIcon from "../../assets/icons/blood.png";
import locationIcon from "../../assets/icons/location.png";
import contactIcon from "../../assets/icons/contact.png";
import calendarIcon from "../../assets/icons/date.png";
import coverImage from "../../assets/images/cover.png";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";
const API_ORIGIN = API_URL.replace("/api/v1", "");
const DEFAULT_DRIVE_IMAGE = coverImage;

const getToken = () =>
  localStorage.getItem("token") ||
  localStorage.getItem("authToken") ||
  localStorage.getItem("accessToken") ||
  "";

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

const normalizeImage = (drive) => {
  const raw = drive.image || drive.imageURL || drive.imageUrl || "";
  if (!raw) return DEFAULT_DRIVE_IMAGE;
  if (raw.startsWith("http")) return raw;
  return `${API_ORIGIN}${raw}`;
};

const formatDate = (value) => {
  if (!value) return "No date";

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function Drives() {
  const [donorProfile, setDonorProfile] = useState(null);
  const [drives, setDrives] = useState([]);
  const [selectedDrive, setSelectedDrive] = useState(null);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const isProfileComplete = donorProfile?.isProfileComplete || false;

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${API_URL}/donors/me`, {
        headers: authHeaders(),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 404) {
          setDonorProfile(null);
          return;
        }
        throw new Error(data.message || "Failed to fetch donor profile");
      }

      setDonorProfile(data.donor);
    } catch (err) {
      console.error("Failed to fetch donor profile:", err);
    }
  };

  const fetchDrives = async () => {
    const res = await fetch(`${API_URL}/drives`, {
      headers: authHeaders(),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to fetch drives");
    }

    const visibleDrives = (data.data || []).filter((drive) =>
      ["Upcoming", "Completed", "Cancelled"].includes(drive.status)
    );

    setDrives(visibleDrives);
  };

  const refreshData = async () => {
    setLoading(true);
    setError("");

    try {
      await Promise.all([fetchProfile(), fetchDrives()]);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load donation drives");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const stats = useMemo(() => {
    const upcomingCount = drives.filter(
      (drive) => drive.status === "Upcoming"
    ).length;

    const joinedCount = drives.filter(
      (drive) =>
        drive.hasJoined === true || drive.myParticipationStatus === "joined"
    ).length;

    const attendedCount = drives.filter(
      (drive) => drive.myParticipationStatus === "attended"
    ).length;

    return {
      upcomingCount,
      joinedCount,
      attendedCount,
    };
  }, [drives]);

  const handleOpenJoin = (drive) => {
    if (!isProfileComplete) {
      setShowProfileModal(true);
      return;
    }

    setSelectedDrive(drive);
  };

  const handleJoin = async (drive) => {
    try {
      setActionLoadingId(drive._id);

      const res = await fetch(`${API_URL}/drives/${drive._id}/join`, {
        method: "POST",
        headers: authHeaders(),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to join drive");
      }

      setSelectedDrive(null);
      await refreshData();
    } catch (err) {
      alert(err.message || "Failed to join drive");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleCancel = async (drive) => {
    try {
      setActionLoadingId(drive._id);

      const res = await fetch(`${API_URL}/drives/${drive._id}/cancel`, {
        method: "PUT",
        headers: authHeaders(),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to cancel drive");
      }

      setCancelTarget(null);
      await refreshData();
    } catch (err) {
      alert(err.message || "Failed to cancel drive");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleSaveProfile = async () => {
    setShowProfileModal(false);
    await refreshData();
  };

  return (
    <div className="min-h-screen bg-gray-100 mt-15 relative">
      <Navbar />

      <div className="px-4 sm:px-6 md:px-10 py-6 md:py-8 pt-24">
        <h1 className="text-2xl sm:text-4xl font-bold mb-2">
          Donation Drives
        </h1>

        <p className="text-gray-500 mb-8 text-sm sm:text-base">
          Discover and join upcoming blood donation drives in your area
        </p>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 rounded-2xl px-4 py-3 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <div
            className="text-white p-6 rounded-2xl shadow-lg h-[260px] flex flex-col justify-between"
            style={{
              background:
                "linear-gradient(135deg, #FFB900 0%, #FF6900 50%, #E7000B 100%)",
            }}
          >
            <p className="text-lg font-semibold">● UPCOMING DRIVES</p>
            <div className="flex items-end gap-3">
              <h2 className="text-4xl sm:text-6xl font-bold">
                {stats.upcomingCount}
              </h2>
              <p className="text-lg sm:text-xl">events</p>
            </div>
            <hr className="opacity-30" />
            <p className="text-sm opacity-80">Available to join</p>
          </div>

          <div
            className="text-white p-6 rounded-2xl shadow-lg h-[260px] flex flex-col justify-between"
            style={{
              background:
                "linear-gradient(135deg, #00D5BE 0%, #00B8DB 50%, #0084D1 100%)",
            }}
          >
            <p className="text-lg font-semibold">● YOU JOINED</p>
            <div className="flex items-end gap-3">
              <h2 className="text-4xl sm:text-6xl font-bold">
                {stats.joinedCount}
              </h2>
              <p className="text-lg sm:text-xl">joined</p>
            </div>
            <hr className="opacity-30" />
            <p className="text-sm opacity-80">Your active participation</p>
          </div>

          <div
            className="text-white p-6 rounded-2xl shadow-lg h-[260px] flex flex-col justify-between"
            style={{
              background:
                "linear-gradient(135deg, #ED6AFF 0%, #F6339A 50%, #EC003F 100%)",
            }}
          >
            <p className="text-lg font-semibold">● YOU ATTENDED</p>
            <div className="flex items-end gap-3">
              <h2 className="text-4xl sm:text-6xl font-bold">
                {stats.attendedCount}
              </h2>
              <p className="text-lg sm:text-xl">attended</p>
            </div>
            <hr className="opacity-30" />
            <p className="text-sm opacity-80">Attended Donation Drives</p>
          </div>
        </div>

        <p className="text-gray-500 mb-6 text-sm sm:text-base">
          Showing Donation Drives ({drives.length})
        </p>

        {loading ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-sm text-gray-500">
            Loading...
          </div>
        ) : drives.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-sm text-gray-500">
            No donation drives available.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {drives.map((drive) => {
              const registered = drive.registered || 0;
              const maxParticipants = drive.maxParticipants || 0;
              const percentage =
                maxParticipants > 0
                  ? Math.round((registered / maxParticipants) * 100)
                  : 0;

              const statusColor =
                drive.status === "Completed"
                  ? "bg-green-100 text-green-600"
                  : drive.status === "Cancelled"
                  ? "bg-red-100 text-red-600"
                  : "bg-yellow-100 text-yellow-700";

              const isJoined =
                drive.hasJoined === true ||
                drive.myParticipationStatus === "joined";

              const isMissed = drive.myParticipationStatus === "missed";
              const isAttended = drive.myParticipationStatus === "attended";
              const isFull =
                maxParticipants > 0 && registered >= maxParticipants;
              const isCompleted = drive.status === "Completed";
              const isCancelled = drive.status === "Cancelled";

              return (
                <div
                  key={drive._id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                >
                  <img
                    src={normalizeImage(drive)}
                    alt={drive.title}
                    className="w-full h-40 object-cover"
                  />

                  <div className="p-5 space-y-4">
                    <span className={`inline-block text-xs px-3 py-1 rounded-full ${statusColor}`}>
                      {drive.status || "Upcoming"}
                    </span>

                    <h3 className="text-lg font-semibold text-gray-900">
                      {drive.title}
                    </h3>

                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <FiMapPin />
                      {drive.location}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <FiCalendar />
                      {formatDate(drive.date)} • {drive.time}
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>
                          {registered} / {maxParticipants}
                        </span>
                        <span>{percentage}%</span>
                      </div>

                      <div className="w-full bg-gray-200 h-2 rounded-full">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>

                    {isCompleted ? (
                      <button className="w-full bg-green-100 text-green-600 py-2 rounded-xl text-sm font-medium cursor-default">
                        Completed
                      </button>
                    ) : isCancelled ? (
                      <button className="w-full bg-red-100 text-red-600 py-2 rounded-xl text-sm font-medium cursor-default">
                        Cancelled
                      </button>
                    ) : isAttended ? (
                      <button className="w-full bg-blue-100 text-blue-600 py-2 rounded-xl text-sm font-medium">
                        ✓ Attended
                      </button>
                    ) : isMissed ? (
                      <button className="w-full bg-gray-200 text-gray-500 py-2 rounded-xl text-sm font-medium">
                        ○ Missed
                      </button>
                    ) : isFull && !isJoined ? (
                      <button className="w-full bg-red-500 text-white py-2 rounded-xl text-sm font-medium cursor-not-allowed">
                        Full
                      </button>
                    ) : isJoined ? (
                      <button
                        onClick={() => setCancelTarget(drive)}
                        disabled={actionLoadingId === drive._id}
                        className="w-full bg-gray-300 text-gray-400 py-2 rounded-xl text-sm font-medium hover:bg-red-500 text-white transition disabled:opacity-60"
                      >
                        {actionLoadingId === drive._id
                          ? "Cancelling..."
                          : "Cancel"}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleOpenJoin(drive)}
                        disabled={actionLoadingId === drive._id}
                        className="w-full bg-green-500 text-white py-2 rounded-xl text-sm font-medium hover:bg-green-600 transition disabled:opacity-60"
                      >
                        {actionLoadingId === drive._id ? "Joining..." : "Join"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selectedDrive && (
        <JoinDriveModal
          drive={selectedDrive}
          onClose={() => setSelectedDrive(null)}
          onConfirm={() => handleJoin(selectedDrive)}
        />
      )}

      {cancelTarget && (
        <CancelRequestModal
          isOpen={!!cancelTarget}
          onClose={() => setCancelTarget(null)}
          onConfirm={() => handleCancel(cancelTarget)}
          title="Cancel Donation Drive"
          message={`Do you really want to cancel ${cancelTarget.title}?`}
        />
      )}

      <CompleteProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        onSave={handleSaveProfile}
        bloodIcon={bloodIcon}
        locationIcon={locationIcon}
        contactIcon={contactIcon}
        calendarIcon={calendarIcon}
      />

      <Footer />
    </div>
  );
}