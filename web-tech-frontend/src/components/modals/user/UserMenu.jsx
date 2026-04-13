import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import userGray from "../../../assets/icons/user-gray.png";
import logoutIcon from "../../../assets/icons/logout.png";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

export default function UserMenu({ onClose }) {
  const navigate = useNavigate();

  const [userName, setUserName] = useState("User");

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

  useEffect(() => {
    // 🔹 1. try localStorage first (fast)
    const storedUser = getStoredUser();

    if (storedUser?.name) {
      setUserName(storedUser.name);
    }

    // 🔹 2. fetch real profile from backend
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_URL}/donors/me`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`
          }
        });

        const data = await res.json();

        if (!res.ok) return;

        const name =
          data?.donor?.displayName ||
          data?.donor?.fullName ||
          storedUser?.name ||
          "User";

        setUserName(name);

      } catch (error) {
        console.error("UserMenu fetch error:", error);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl text-gray-800 overflow-hidden z-50">

      {/* HEADER */}
      <div className="p-4 bg-gray-100">
        <p className="font-semibold">{userName}</p>
        <p className="text-sm text-gray-500">Donor</p>
      </div>

      {/* MENU */}
      <div className="p-3 space-y-2">

        {/* PROFILE */}
        <div
          onClick={() => {
            navigate("/profile");
            onClose();
          }}
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition"
        >
          <img src={userGray} className="w-5 h-5 opacity-70" />
          <span>My Profile</span>
        </div>

        {/* LOGOUT */}
        <div
          onClick={() => {
            localStorage.clear();
            navigate("/");
          }}
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-red-50 text-red-500 cursor-pointer transition"
        >
          <img src={logoutIcon} className="w-5 h-5 opacity-80" />
          <span>Logout</span>
        </div>

      </div>

    </div>
  );
}