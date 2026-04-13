import { useEffect, useMemo, useState } from "react";
import { FiMapPin, FiCalendar } from "react-icons/fi";

import Navbar from "../../components/user/Navbar";
import Footer from "../../components/user/Footer";
import RequestBloodModal from "../../components/modals/user/RequestBlood";
import CancelRequestModal from "../../components/modals/user/CancelRequest";
import CompleteProfileModal from "../../components/modals/user/CompleteProfile";

import greenIcon from "../../assets/icons/prio-green.png";
import brownIcon from "../../assets/icons/prio-brown.png";
import redIcon from "../../assets/icons/prio-red.png";

import bloodIcon from "../../assets/icons/blood.png";
import locationIcon from "../../assets/icons/location.png";
import contactIcon from "../../assets/icons/contact.png";
import calendarIcon from "../../assets/icons/date.png";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

const getToken = () =>
  localStorage.getItem("token") ||
  localStorage.getItem("authToken") ||
  localStorage.getItem("accessToken") ||
  "";

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

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

const formatUrgency = (urgency = "") => {
  if (!urgency) return "";
  return urgency.charAt(0).toUpperCase() + urgency.slice(1).toLowerCase();
};

export default function Requests() {
  const [donorProfile, setDonorProfile] = useState(null);
  const [requests, setRequests] = useState([]);

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const donorBloodType = donorProfile?.bloodType || "unknown";
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

  const fetchRequests = async () => {
    const res = await fetch(`${API_URL}/requests`, {
      headers: authHeaders(),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to fetch requests");
    }

    const visibleRequests = (data.data || []).filter((request) =>
      ["Pending", "Fulfilled"].includes(request.status)
    );

    setRequests(visibleRequests);
  };

  const refreshData = async () => {
    setLoading(true);
    setError("");

    try {
      await Promise.all([fetchProfile(), fetchRequests()]);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load blood requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const visibleRequests = useMemo(() => {
    if (!donorBloodType || donorBloodType === "unknown") return [];

    return requests.filter(
      (request) =>
        ["Pending", "Fulfilled"].includes(request.status) &&
        request.bloodType === donorBloodType
    );
  }, [requests, donorBloodType]);

  const stats = useMemo(() => {
    const activeCount = visibleRequests.filter(
      (request) => request.status === "Pending"
    ).length;

    const joinedCount = visibleRequests.filter(
      (request) =>
        request.hasJoined === true || request.myParticipationStatus === "joined"
    ).length;

    const attendedCount = visibleRequests.filter(
      (request) => request.myParticipationStatus === "attended"
    ).length;

    return {
      activeCount,
      joinedCount,
      attendedCount,
    };
  }, [visibleRequests]);

  const handleOpenJoin = (request) => {
    if (!isProfileComplete) {
      setShowProfileModal(true);
      return;
    }

    setSelectedRequest(request);
  };

  const handleJoin = async (request) => {
    try {
      setActionLoadingId(request._id);

      const res = await fetch(`${API_URL}/requests/${request._id}/join`, {
        method: "POST",
        headers: authHeaders(),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to join blood request");
      }

      setSelectedRequest(null);
      await refreshData();
    } catch (err) {
      alert(err.message || "Failed to join blood request");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleCancel = async (request) => {
    try {
      setActionLoadingId(request._id);

      const res = await fetch(`${API_URL}/requests/${request._id}/cancel`, {
        method: "PUT",
        headers: authHeaders(),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to cancel blood request");
      }

      setCancelTarget(null);
      await refreshData();
    } catch (err) {
      alert(err.message || "Failed to cancel blood request");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleSaveProfile = async () => {
    setShowProfileModal(false);
    await refreshData();
  };

  return (
    <div className="min-h-screen bg-gray-100 relative mt-15">
      <Navbar />

      <div className="px-4 sm:px-6 md:px-10 py-6 md:py-8 pt-24">
        <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-2">
          Blood Requests
        </h1>

        <p className="text-gray-500 mb-8 text-sm sm:text-base">
          Respond to blood needs and help save lives.
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
                "linear-gradient(135deg, #00D3F3 0%, #2B7FFF 50%, #4F39F6 100%)",
            }}
          >
            <p className="text-lg font-bold tracking-widest">● ACTIVE REQUESTS</p>
            <div className="flex items-center gap-3">
              <h2 className="text-4xl sm:text-6xl font-bold">
                {stats.activeCount}
              </h2>
              <span className="text-lg sm:text-xl">pending</span>
            </div>
            <hr className="opacity-30 my-4" />
            <p className="text-sm opacity-80">Matching your blood type</p>
          </div>

          <div
            className="text-white p-6 rounded-2xl shadow-lg h-[260px] flex flex-col justify-between"
            style={{
              background:
                "linear-gradient(135deg, #FF6467 0%, #F6339A 50%, #EC003F 100%)",
            }}
          >
            <p className="text-lg font-bold tracking-widest">● YOU JOINED</p>
            <div className="flex items-center gap-3">
              <h2 className="text-4xl sm:text-6xl font-bold">
                {stats.joinedCount}
              </h2>
              <span className="text-lg sm:text-xl">joined</span>
            </div>
            <hr className="opacity-30 my-4" />
            <p className="text-sm opacity-80">Your participation</p>
          </div>

          <div
            className="text-white p-6 rounded-2xl shadow-lg h-[260px] flex flex-col justify-between"
            style={{
              background:
                "linear-gradient(135deg, #C27AFF 0%, #AD46FF 50%, #7F22FE 100%)",
            }}
          >
            <p className="text-lg font-bold tracking-widest">● YOU ATTENDED</p>
            <div className="flex items-center gap-3">
              <h2 className="text-4xl sm:text-6xl font-bold">
                {stats.attendedCount}
              </h2>
              <span className="text-lg sm:text-xl">attended</span>
            </div>
            <hr className="opacity-30 my-4" />
            <p className="text-sm opacity-80">Attended blood requests</p>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-sm text-gray-500">
            Loading...
          </div>
        ) : donorBloodType === "unknown" ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-sm text-gray-500">
            Complete your donor profile and set your blood type to view matching blood requests.
          </div>
        ) : visibleRequests.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-sm text-gray-500">
            No matching blood requests for your blood type right now.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {visibleRequests.map((request) => {
              const joinedCount = request.joinedCount || 0;
              const maxParticipants = request.maxParticipants || 0;
              const progressPercent =
                maxParticipants > 0
                  ? Math.round((joinedCount / maxParticipants) * 100)
                  : 0;

              const urgency = (request.urgency || "").toLowerCase();

              const priorityColor =
                urgency === "high"
                  ? "bg-red-100 text-red-500"
                  : urgency === "medium"
                  ? "bg-orange-100 text-orange-500"
                  : "bg-green-100 text-green-500";

              const priorityIcon =
                urgency === "high"
                  ? redIcon
                  : urgency === "medium"
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
                      {formatUrgency(request.urgency)} Priority
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
                      onClick={() => setCancelTarget(request)}
                      disabled={actionLoadingId === request._id}
                      className="w-full bg-gray-300 text-gray-400 py-2 rounded-xl text-sm font-medium hover:bg-red-500 text-white transition disabled:opacity-60"
                    >
                      {actionLoadingId === request._id
                        ? "Cancelling..."
                        : "Cancel"}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleOpenJoin(request)}
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

      {selectedRequest && (
        <RequestBloodModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onConfirm={() => handleJoin(selectedRequest)}
        />
      )}

      {cancelTarget && (
        <CancelRequestModal
          isOpen={!!cancelTarget}
          onClose={() => setCancelTarget(null)}
          onConfirm={() => handleCancel(cancelTarget)}
          title="Cancel Blood Request"
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