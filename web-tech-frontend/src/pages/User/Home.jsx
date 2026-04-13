import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMapPin, FiCalendar } from "react-icons/fi";

import Navbar from "../../components/user/Navbar";
import Footer from "../../components/user/Footer";
import CompleteProfileModal from "../../components/modals/user/CompleteProfile";
import JoinDriveModal from "../../components/modals/user/JoinDrive";
import RequestBloodModal from "../../components/modals/user/RequestBlood";
import CancelRequestModal from "../../components/modals/user/CancelRequest";

import bloodIcon from "../../assets/icons/blood.png";
import locationIcon from "../../assets/icons/Location.png";
import contactIcon from "../../assets/icons/contact.png";
import calendarIcon from "../../assets/icons/date.png";
import donorProfileIcon from "../../assets/icons/Don_Prof.png";

import greenIcon from "../../assets/icons/prio-green.png";
import brownIcon from "../../assets/icons/prio-brown.png";
import redIcon from "../../assets/icons/prio-red.png";
import coverImage from "../../assets/images/cover.png";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";
const API_ORIGIN = API_URL.replace("/api/v1", "");
const DEFAULT_DRIVE_IMAGE = coverImage;

const getToken = () =>
  localStorage.getItem("token") ||
  localStorage.getItem("authToken") ||
  localStorage.getItem("accessToken") ||
  "";

const getStoredUser = () => {
  const possibleKeys = ["user", "authUser", "loggedInUser"];

  for (const key of possibleKeys) {
    const raw = localStorage.getItem(key);
    if (!raw) continue;

    try {
      return JSON.parse(raw);
    } catch {
      continue;
    }
  }

  return null;
};

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`
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
    year: "numeric"
  });
};

const formatUrgency = (urgency = "") => {
  if (!urgency) return "";
  return urgency.charAt(0).toUpperCase() + urgency.slice(1).toLowerCase();
};

export default function Home() {
  const navigate = useNavigate();

  const [userName, setUserName] = useState("User");
  const [donorProfile, setDonorProfile] = useState(null);

  const [drives, setDrives] = useState([]);
  const [requests, setRequests] = useState([]);

  const [selectedDrive, setSelectedDrive] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [cancelDriveTarget, setCancelDriveTarget] = useState(null);
  const [cancelRequestTarget, setCancelRequestTarget] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [showBanner, setShowBanner] = useState(true);

  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [error, setError] = useState("");

  const isProfileComplete = donorProfile?.isProfileComplete || false;
  const donorBloodType = donorProfile?.bloodType || "unknown";

  useEffect(() => {
    const storedUser = getStoredUser();
    if (storedUser?.name) {
      setUserName(storedUser.name);
    }
  }, []);

  const fetchMyProfile = async () => {
    try {
      const res = await fetch(`${API_URL}/donors/me`, {
        headers: authHeaders()
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

      if (data.donor?.displayName) {
        setUserName(data.donor.displayName);
      } else if (data.donor?.fullName) {
        setUserName(data.donor.fullName);
      }
    } catch (err) {
      console.error("Failed to fetch donor profile:", err);
    }
  };

  const fetchDrives = async () => {
    const res = await fetch(`${API_URL}/drives`, {
      headers: authHeaders()
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to fetch drives");
    }

    const upcomingDrives = (data.data || []).filter(
      (drive) =>
        drive.status === "Upcoming" &&
        drive.myParticipationStatus !== "attended"
    );

    setDrives(upcomingDrives);
  };

  const fetchRequests = async () => {
    const res = await fetch(`${API_URL}/requests`, {
      headers: authHeaders()
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to fetch requests");
    }

    const filteredRequests = (data.data || []).filter(
      (request) =>
        request.status === "Pending" &&
        request.myParticipationStatus !== "joined"
    );

    setRequests(filteredRequests);
  };

  const refreshHomeData = async () => {
    setLoading(true);
    setError("");

    try {
      await Promise.all([fetchMyProfile(), fetchDrives(), fetchRequests()]);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load home page data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshHomeData();
  }, []);

  useEffect(() => {
    if (donorProfile === null) return;

    if (donorProfile?.isProfileComplete === false) {
      setShowModal(true);
      setShowBanner(true);
    } else {
      setShowModal(false);
      setShowBanner(false);
    }
  }, [donorProfile]);

  const visibleRequests = useMemo(() => {
    if (!donorBloodType || donorBloodType === "unknown") return [];

    return requests.filter(
      (request) =>
        request.status === "Pending" &&
        request.bloodType === donorBloodType
    );
  }, [requests, donorBloodType]);

  const handleOpenJoinDrive = (drive) => {
    if (!isProfileComplete) {
      setShowModal(true);
      return;
    }

    setSelectedDrive(drive);
  };

  const handleOpenJoinRequest = (request) => {
    if (!isProfileComplete) {
      setShowModal(true);
      return;
    }

    setSelectedRequest(request);
  };

  const handleJoinDrive = async (drive) => {
    try {
      setActionLoadingId(drive._id);

      const res = await fetch(`${API_URL}/drives/${drive._id}/join`, {
        method: "POST",
        headers: authHeaders()
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to join drive");
      }

      setSelectedDrive(null);
      await refreshHomeData();
    } catch (err) {
      alert(err.message || "Failed to join drive");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleCancelDrive = async (drive) => {
    try {
      setActionLoadingId(drive._id);

      const res = await fetch(`${API_URL}/drives/${drive._id}/cancel`, {
        method: "PUT",
        headers: authHeaders()
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to cancel drive participation");
      }

      setCancelDriveTarget(null);
      await refreshHomeData();
    } catch (err) {
      alert(err.message || "Failed to cancel drive participation");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleJoinRequest = async (request) => {
    try {
      setActionLoadingId(request._id);

      const res = await fetch(`${API_URL}/requests/${request._id}/join`, {
        method: "POST",
        headers: authHeaders()
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to join blood request");
      }

      setSelectedRequest(null);
      await refreshHomeData();
    } catch (err) {
      alert(err.message || "Failed to join blood request");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleCancelRequest = async (request) => {
    try {
      setActionLoadingId(request._id);

      const res = await fetch(`${API_URL}/requests/${request._id}/cancel`, {
        method: "PUT",
        headers: authHeaders()
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message || "Failed to cancel blood request participation"
        );
      }

      setCancelRequestTarget(null);
      await refreshHomeData();
    } catch (err) {
      alert(err.message || "Failed to cancel blood request participation");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleSaveProfile = async () => {
    await refreshHomeData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 mt-15">
        <Navbar />
        <div className="px-4 sm:px-6 md:px-10 py-6 md:py-8 pt-24">
          <p className="text-gray-500">Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 relative mt-15">
      <Navbar />

      <div className="px-4 sm:px-6 md:px-10 py-6 md:py-8 pt-24">
        <h1 className="text-2xl sm:text-3xl font-bold text-red-500 mb-1">
          Hello, {userName}
        </h1>
        <p className="text-gray-500 mb-6 text-sm sm:text-base">
          Welcome back to VELLA
        </p>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 rounded-2xl px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {!isProfileComplete && showBanner && (
          <div className="bg-[#FDECEC] border border-red-200 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
                <img src={donorProfileIcon} className="w-6 h-6" alt="profile" />
              </div>

              <div>
                <h3 className="font-semibold text-gray-800">
                  Complete Your Donor Profile
                </h3>
                <p className="text-sm text-gray-500">
                  Complete your donor details to join drives and blood requests
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <button
                onClick={() => setShowBanner(false)}
                className="w-full sm:w-auto px-4 py-2 border border-gray-300 text-gray-600 rounded-full text-sm hover:bg-gray-100"
              >
                Maybe Later
              </button>

              <button
                onClick={() => {
                  if (!isProfileComplete) {
                    setShowModal(true);
                  }
                }}
                className="w-full sm:w-auto px-4 py-2 bg-red-500 text-white rounded-full text-sm"
              >
                Complete Profile
              </button>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg sm:text-xl font-bold">
            Upcoming Donation Drives
          </h2>

          <button
            onClick={() => navigate("/drives")}
            className="text-red-500 text-sm font-medium"
          >
            View All →
          </button>
        </div>

        {drives.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-sm text-gray-500 mb-12">
            No upcoming donation drives available.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
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
                        onClick={() => setCancelDriveTarget(drive)}
                        disabled={actionLoadingId === drive._id}
                        className="w-full bg-gray-300 text-gray-400 py-2 rounded-xl text-sm font-medium hover:bg-red-500 text-white transition disabled:opacity-60"
                      >
                        {actionLoadingId === drive._id ? "Cancelling..." : "Cancel"}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleOpenJoinDrive(drive)}
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

        <div className="mt-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg sm:text-xl font-bold">Upcoming Blood Requests</h2>

            <button
              onClick={() => navigate("/requests")}
              className="text-red-500 text-sm font-medium"
            >
              View All →
            </button>
          </div>

          {donorBloodType === "unknown" ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-sm text-gray-500">
              Complete your donor profile and set your blood type to view matching blood requests.
            </div>
          ) : visibleRequests.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-sm text-gray-500">
              No matching pending blood requests for your blood type right now.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {visibleRequests.map((request) => {
                const joinedCount = request.joinedCount || 0;
                const maxParticipants = request.maxParticipants || 0;
                const progressPercent =
                  maxParticipants > 0
                    ? Math.round((joinedCount / maxParticipants) * 100)
                    : 0;

                const formattedUrgency = formatUrgency(request.urgency);

                const priorityColor =
                  request.urgency === "high"
                    ? "bg-red-100 text-red-500"
                    : request.urgency === "medium"
                    ? "bg-orange-100 text-orange-500"
                    : "bg-green-100 text-green-500";

                const priorityIcon =
                  request.urgency === "high"
                    ? redIcon
                    : request.urgency === "medium"
                    ? brownIcon
                    : greenIcon;

                const requestStatusColor =
                  request.status === "Fulfilled"
                    ? "bg-green-100 text-green-600"
                    : "bg-yellow-100 text-yellow-700";

                const isJoined =
                  request.hasJoined === true ||
                  request.myParticipationStatus === "joined";

                const isMissed = request.myParticipationStatus === "missed";
                const isAttended = request.myParticipationStatus === "attended";
                const isFull =
                  maxParticipants > 0 && joinedCount >= maxParticipants;
                const isFulfilled = request.status === "Fulfilled";

                return (
                  <div
                    key={request._id}
                    className="bg-white rounded-3xl shadow-sm p-6 space-y-5"
                  >
                    <div className="flex flex-wrap gap-2">
                      <span
                        className={`inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full ${priorityColor}`}
                      >
                        <img src={priorityIcon} className="w-4 h-4" alt="priority" />
                        {formattedUrgency} Priority
                      </span>

                      <span className={`text-xs px-3 py-1 rounded-full ${requestStatusColor}`}>
                        {request.status || "Pending"}
                      </span>
                    </div>

                    <div className="flex justify-center">
                      <div className="w-24 h-24 bg-red-50 rounded-2xl flex items-center justify-center">
                        <span className="text-3xl font-bold text-red-500">
                          {request.bloodType}
                        </span>
                      </div>
                    </div>

                    <div className="text-center">
                      <h3 className="font-semibold text-gray-900">
                        {request.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {request.description}
                      </p>
                    </div>

                    <div className="text-sm text-gray-500 space-y-1">
                      <div className="flex items-center gap-2">
                        <FiMapPin /> {request.venue}
                      </div>
                      <div className="flex items-center gap-2">
                        <FiCalendar /> {formatDate(request.date)} • {request.startTime}
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>
                          {joinedCount}/{maxParticipants}
                        </span>
                        <span>{progressPercent}%</span>
                      </div>

                      <div className="bg-gray-100 h-2 rounded-full">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>

                    {isFulfilled ? (
                      <button className="w-full bg-green-100 text-green-600 py-2 rounded-xl text-sm font-medium cursor-default">
                        Fulfilled
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
                        onClick={() => setCancelRequestTarget(request)}
                        disabled={actionLoadingId === request._id}
                        className="w-full bg-gray-300 text-gray-400 py-2 rounded-xl text-sm font-medium hover:bg-red-500 text-white transition disabled:opacity-60"
                      >
                        {actionLoadingId === request._id ? "Cancelling..." : "Cancel"}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleOpenJoinRequest(request)}
                        disabled={actionLoadingId === request._id}
                        className="w-full bg-green-500 text-white py-2 rounded-xl text-sm font-medium hover:bg-green-600 transition disabled:opacity-60"
                      >
                        {actionLoadingId === request._id ? "Joining..." : "Join"}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {selectedDrive && (
        <JoinDriveModal
          drive={selectedDrive}
          onClose={() => setSelectedDrive(null)}
          onConfirm={() => handleJoinDrive(selectedDrive)}
        />
      )}

      {cancelDriveTarget && (
        <CancelRequestModal
          isOpen={!!cancelDriveTarget}
          onClose={() => setCancelDriveTarget(null)}
          onConfirm={() => handleCancelDrive(cancelDriveTarget)}
          title="Cancel Donation Drive"
          message={`Do you really want to cancel ${cancelDriveTarget.title}?`}
        />
      )}

      {selectedRequest && (
        <RequestBloodModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onConfirm={() => handleJoinRequest(selectedRequest)}
        />
      )}

      {cancelRequestTarget && (
        <CancelRequestModal
          isOpen={!!cancelRequestTarget}
          onClose={() => setCancelRequestTarget(null)}
          onConfirm={() => handleCancelRequest(cancelRequestTarget)}
          title="Cancel Blood Request"
          message={`Do you really want to cancel ${cancelRequestTarget.title}?`}
        />
      )}

      <CompleteProfileModal
        isOpen={!isProfileComplete && showModal}
        onClose={() => setShowModal(false)}
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