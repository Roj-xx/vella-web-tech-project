import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

const getToken = () =>
  localStorage.getItem("token") ||
  localStorage.getItem("authToken") ||
  localStorage.getItem("accessToken") ||
  "";

export default function CompleteProfileModal({
  isOpen,
  onClose,
  onSave,
  bloodIcon,
  locationIcon,
  contactIcon,
  calendarIcon,
}) {
  const [form, setForm] = useState({
    bloodType: "",
    address: "",
    contactNumber: "",
    lastDonationDate: "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_URL}/donors/me`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
        });

        const data = await res.json();

        if (!res.ok) return;

        const donor = data?.donor || {};

        setForm({
          bloodType:
            donor.bloodType && donor.bloodType !== "unknown"
              ? donor.bloodType
              : "",
          address: donor.address || "",
          contactNumber: donor.contactNumber || "",
          lastDonationDate: donor.lastDonationDate
            ? new Date(donor.lastDonationDate).toISOString().split("T")[0]
            : "",
        });
      } catch (err) {
        console.error("Failed to load donor profile in modal:", err);
      }
    };

    fetchProfile();
    setError("");
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) setError("");
  };

  const handleSubmit = async () => {
    if (!form.address.trim() || !form.contactNumber.trim()) {
      setError("Address and contact number are required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const payload = {
        bloodType: form.bloodType || "unknown",
        address: form.address.trim(),
        contactNumber: form.contactNumber.trim(),
        lastDonationDate: form.lastDonationDate || null,
      };

      // 🔁 TRY UPDATE FIRST
      let res = await fetch(`${API_URL}/donors/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(payload),
      });

      let data = await res.json();

      // 🔥 IF NOT FOUND → CREATE
      if (!res.ok && data.message === "Donor profile not found") {
        res = await fetch(`${API_URL}/donors`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify(payload),
        });

        data = await res.json();
      }

      if (!res.ok) {
        throw new Error(data.message || "Failed to save donor profile");
      }

      if (onSave) {
        await onSave();
      }

    } catch (err) {
      setError(err.message || "Failed to save donor profile");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-3xl w-full max-w-xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.15)]">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Complete Your Donor Profile
            </h2>
            <p className="text-sm text-gray-500">
              Help us match you with the right donation opportunities
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100"
            disabled={saving}
          >
            ✕
          </button>
        </div>

        <hr className="mb-6" />

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-5">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <img src={bloodIcon} className="w-4 h-4 opacity-70" alt="blood" />
              Blood Type
            </label>

            <select
              name="bloodType"
              value={form.bloodType}
              onChange={handleChange}
              className="w-full mt-2 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-200 bg-white"
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
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <img
                src={locationIcon}
                className="w-4 h-4 opacity-70"
                alt="location"
              />
              Address *
            </label>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Enter your full address"
              className="w-full mt-2 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-200"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <img
                src={contactIcon}
                className="w-4 h-4 opacity-70"
                alt="contact"
              />
              Contact Number *
            </label>
            <input
              name="contactNumber"
              value={form.contactNumber}
              onChange={handleChange}
              placeholder="e.g., 09123456789"
              className="w-full mt-2 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-200"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <img
                src={calendarIcon}
                className="w-4 h-4 opacity-70"
                alt="calendar"
              />
              Last Donation Date
            </label>
            <input
              type="date"
              name="lastDonationDate"
              value={form.lastDonationDate}
              onChange={handleChange}
              className="w-full mt-2 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-200"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={onClose}
            disabled={saving}
            className="px-6 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-60"
          >
            Skip for now
          </button>

          <button
            onClick={handleSubmit}
            disabled={saving}
            className="px-7 py-2.5 rounded-xl text-sm font-semibold text-white bg-green-500 hover:bg-green-600 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save and Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}