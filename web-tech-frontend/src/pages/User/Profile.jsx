import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/user/Navbar";
import Footer from "../../components/user/Footer";

import bloodTypeIcon from "../../assets/icons/bloodtype.png";
import userIcon from "../../assets/icons/user-gray.png";
import contactIcon from "../../assets/icons/contact-white.png";
import locationIcon from "../../assets/icons/location-white.png";
import saveIcon from "../../assets/icons/save.png";
import bloodtype from "../../assets/icons/blood-gray.png";

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

const formatDateDisplay = (value) => {
  if (!value) return "No donation recorded yet";

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatDateInput = (value) => {
  if (!value) return "";

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";

  return parsed.toISOString().split("T")[0];
};

const getInitials = (name) => {
  if (!name || typeof name !== "string") return "U";

  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0][0].toUpperCase();

  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
};

export default function Profile() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    fullName: "",
    contactNumber: "",
    address: "",
    bloodType: "",
    lastDonationDate: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const displayName =
    profile?.displayName || profile?.fullName || form.fullName || "User";

  const initials = useMemo(() => getInitials(displayName), [displayName]);

  const fetchProfile = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`${API_URL}/donors/me`, {
        headers: authHeaders(),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch donor profile");
      }

      const donor = data.donor;
      setProfile(donor);

      setForm({
        fullName: donor.displayName || donor.fullName || "",
        contactNumber: donor.contactNumber || "",
        address: donor.address || "",
        bloodType:
          donor.bloodType && donor.bloodType !== "unknown"
            ? donor.bloodType
            : "",
        lastDonationDate: formatDateInput(donor.lastDonationDate),
      });
    } catch (err) {
      setError(err.message || "Failed to fetch donor profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (success) setSuccess("");
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        bloodType: form.bloodType || "unknown",
        address: form.address,
        contactNumber: form.contactNumber,
        lastDonationDate: form.lastDonationDate || null,
      };

      const res = await fetch(`${API_URL}/donors/me`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update donor profile");
      }

      setSuccess(data.message || "Profile updated successfully");
      await fetchProfile();
    } catch (err) {
      setError(err.message || "Failed to update donor profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="px-4 sm:px-6 md:px-10 py-6 md:py-8 pt-24 mt-15">
        <p
          onClick={() => navigate("/home")}
          className="text-sm text-gray-500 mb-6 cursor-pointer hover:text-red-500"
        >
          ← Back to Home
        </p>

        <h1 className="text-xl sm:text-2xl font-bold mb-1">
          Account Settings
        </h1>

        <p className="text-gray-500 mb-8 text-sm sm:text-base">
          Manage your personal information and donation profile
        </p>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 rounded-2xl px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 rounded-2xl px-4 py-3 text-sm">
            {success}
          </div>
        )}

        {loading ? (
          <div className="bg-white rounded-2xl shadow p-6 text-sm text-gray-500">
            Loading profile...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow">
              <div className="flex justify-center">
                <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-red-100 flex items-center justify-center text-2xl sm:text-3xl font-bold text-red-500">
                  {initials}
                </div>
              </div>

              <div className="text-center mt-4">
                <h3 className="font-semibold">{displayName}</h3>
                <p className="text-sm text-gray-500">Blood Donor</p>

                <span
                  className={`inline-block mt-3 text-sm px-3 py-1 rounded-full ${
                    profile?.isProfileComplete
                      ? "text-green-600 bg-green-100"
                      : "text-orange-600 bg-orange-100"
                  }`}
                >
                  {profile?.isProfileComplete
                    ? "● Verified Profile"
                    : "● Incomplete Profile"}
                </span>
              </div>

              <hr className="my-6" />

              <div className="bg-[#FDECEC] p-4 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={bloodTypeIcon}
                    className="w-10 h-10 sm:w-12 sm:h-12"
                    alt="blood type"
                  />

                  <div>
                    <p className="text-xs text-red-500 font-semibold">
                      BLOOD TYPE
                    </p>
                    <p className="text-lg sm:text-xl font-bold text-red-500">
                      {profile?.bloodType && profile.bloodType !== "unknown"
                        ? profile.bloodType
                        : "Not set"}
                    </p>
                  </div>
                </div>

                <hr className="my-3 opacity-30" />

                <p className="text-xs text-gray-500">Last Donation</p>
                <p className="text-sm font-medium">
                  {formatDateDisplay(profile?.lastDonationDate)}
                </p>
              </div>
            </div>

            <div className="md:col-span-2 bg-white rounded-2xl shadow">
              <div className="p-6 border-b">
                <h2 className="font-semibold">Personal Information</h2>
                <p className="text-sm text-gray-500">
                  Update your personal details and contact information
                </p>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div>
                  <label className="text-sm font-medium">Full Name</label>
                  <div className="relative mt-2">
                    <img
                      src={userIcon}
                      className="absolute left-3 top-4 w-5 h-5 opacity-60"
                      alt="user"
                    />
                    <input
                      name="fullName"
                      value={form.fullName}
                      readOnly
                      className="w-full pl-10 pr-4 py-3 border rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Your name is managed by your account and is not editable here.
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium">Contact Number *</label>
                  <div className="relative mt-2">
                    <img
                      src={contactIcon}
                      className="absolute left-3 top-4 w-5 h-5 opacity-60"
                      alt="contact"
                    />
                    <input
                      name="contactNumber"
                      placeholder="+63 912 345 6789"
                      value={form.contactNumber}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Address *</label>
                  <div className="relative mt-2">
                    <img
                      src={locationIcon}
                      className="absolute left-3 top-4 w-5 h-5 opacity-60"
                      alt="location"
                    />
                    <input
                      name="address"
                      placeholder="Address"
                      value={form.address}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Blood Type *</label>
                  <div className="relative mt-2">
                    <img
                      src={bloodtype}
                      className="absolute left-3 top-4 w-5 h-5 opacity-60 pointer-events-none"
                      alt="blood"
                    />
                    <select
                      name="bloodType"
                      value={form.bloodType}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border rounded-xl appearance-none bg-white"
                    >
                      <option value="">Select Blood Type</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>

                    <div className="absolute right-3 top-3 text-gray-400 pointer-events-none">
                      ▼
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">
                    Last Donation Date (Optional)
                  </label>

                  <input
                    type="date"
                    name="lastDonationDate"
                    value={form.lastDonationDate}
                    onChange={handleChange}
                    className="w-full mt-2 px-4 py-3 border rounded-xl"
                  />

                  <p className="text-xs text-gray-400 mt-1">
                    This helps us track your donation eligibility
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => navigate("/home")}
                    className="w-full sm:w-auto px-6 py-2 rounded-full border text-gray-600"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2 rounded-full text-white disabled:opacity-70"
                    style={{
                      background:
                        "linear-gradient(90deg, #FF6971 0%, #E0003C 100%)",
                    }}
                  >
                    <img src={saveIcon} className="w-4 h-4" alt="save" />
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}