import { useNavigate, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

import homeIcon from "../../assets/icons/home.png";
import homeRed from "../../assets/icons/home-red.png";
import logo from "../../assets/images/vella-logo.png";

import drivesIcon from "../../assets/icons/drives.png";
import drivesRed from "../../assets/icons/drives-red.png";

import bloodReqIcon from "../../assets/icons/bloodreq.png";
import bloodReqRed from "../../assets/icons/bloodreq-red.png";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [showMenu, setShowMenu] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [userName, setUserName] = useState("User");
  const [userInitials, setUserInitials] = useState("U");

  const menuRef = useRef(null);
  const mobileNavRef = useRef(null);

  const isActive = (path) => location.pathname.startsWith(path);

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

  const getInitials = (name) => {
    if (!name || typeof name !== "string") return "U";

    const parts = name.trim().split(/\s+/).filter(Boolean);

    if (parts.length === 0) return "U";
    if (parts.length === 1) return parts[0][0].toUpperCase();

    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    localStorage.removeItem("authUser");
    localStorage.removeItem("loggedInUser");
    navigate("/");
  };

  const handleProfileClick = () => {
    setShowMenu(false);
    setMobileNavOpen(false);
    navigate("/profile");
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }

      if (mobileNavRef.current && !mobileNavRef.current.contains(e.target)) {
        const burgerBtn = document.getElementById("mobile-menu-button");
        if (burgerBtn && !burgerBtn.contains(e.target)) {
          setMobileNavOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileNavOpen(false);
    setShowMenu(false);
  }, [location.pathname]);

  useEffect(() => {
    const storedUser = getStoredUser();

    if (storedUser?.name) {
      setUserName(storedUser.name);
      setUserInitials(getInitials(storedUser.name));
    }

    const fetchUserProfile = async () => {
      try {
        const token = getToken();
        if (!token) return;

        const res = await fetch(`${API_URL}/donors/me`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) return;

        const name =
          data?.donor?.displayName ||
          data?.donor?.fullName ||
          storedUser?.name ||
          "User";

        setUserName(name);
        setUserInitials(getInitials(name));
      } catch (error) {
        console.error("Failed to fetch navbar user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const navItems = [
    {
      label: "Home",
      path: "/home",
      icon: homeIcon,
      activeIcon: homeRed,
    },
    {
      label: "Blood Requests",
      path: "/requests",
      icon: bloodReqIcon,
      activeIcon: bloodReqRed,
    },
    {
      label: "Donation Drives",
      path: "/drives",
      icon: drivesIcon,
      activeIcon: drivesRed,
    },
  ];

  return (
    <>
      <header
        className="fixed top-0 left-0 w-full z-50 text-white"
        style={{
          background: "linear-gradient(90deg, #FF6675 0%, #F44C67 45%, #E0003C 100%)",
          boxShadow: "0 10px 30px rgba(185, 0, 52, 0.22)",
        }}
      >
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
          <div className="h-[82px] md:h-[86px] flex items-center justify-between gap-4">
            {/* LEFT */}
            <div
              onClick={() => navigate("/home")}
              className="flex items-center gap-3 cursor-pointer shrink-0 select-none"
            >
              <img
                src={logo}
                alt="vella logo"
                className="w-[40px] h-[40px] sm:w-[44px] sm:h-[44px] md:w-[48px] md:h-[48px] object-contain"
              />
              <span
                className="text-[24px] sm:text-[28px] md:text-[30px] font-bold leading-none tracking-[-0.02em]"
                style={{ fontFamily: "Google Sans, Poppins, sans-serif" }}
              >
                vella
              </span>
            </div>

            {/* CENTER NAV - DESKTOP/TABLET */}
            <div className="hidden md:flex flex-1 justify-center px-3">
              <div
                className="flex items-center gap-2 rounded-full px-2 py-1.5"
                style={{
                  background: "rgba(255,255,255,0.18)",
                  backdropFilter: "blur(14px)",
                  WebkitBackdropFilter: "blur(14px)",
                  boxShadow:
                    "inset 0 1px 0 rgba(255,255,255,0.22), 0 10px 24px rgba(116, 0, 33, 0.18)",
                  border: "1px solid rgba(255,255,255,0.18)",
                }}
              >
                {navItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`flex items-center gap-2.5 px-4 lg:px-6 py-2.5 rounded-full whitespace-nowrap transition-all duration-200 ${
                      isActive(item.path)
                        ? "bg-white text-[#D9334E] shadow-[0_4px_14px_rgba(255,255,255,0.18)]"
                        : "text-white/95 hover:bg-white/10"
                    }`}
                  >
                    <img
                      src={isActive(item.path) ? item.activeIcon : item.icon}
                      alt={item.label}
                      className="w-[15px] h-[15px] object-contain"
                    />
                    <span className="text-[13px] lg:text-[14px] font-medium">
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* RIGHT USER - DESKTOP/TABLET */}
            <div className="hidden md:flex relative shrink-0" ref={menuRef}>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-3 lg:gap-4 cursor-pointer text-left"
              >
                <div className="w-[46px] h-[46px] rounded-full bg-white text-[#D9334E] flex items-center justify-center font-bold text-[16px] shadow-[0_6px_18px_rgba(255,255,255,0.16)]">
                  {userInitials}
                </div>

                <div className="leading-tight">
                  <p className="text-[15px] lg:text-[16px] font-semibold text-white">
                    {userName}
                  </p>
                  <p className="text-[12px] text-white/85">User</p>
                </div>
              </button>

              {showMenu && (
                <div className="absolute right-0 top-[58px] w-56 rounded-2xl border border-white/15 bg-white/95 backdrop-blur-xl shadow-[0_20px_40px_rgba(0,0,0,0.16)] overflow-hidden">
                  <button
                    onClick={handleProfileClick}
                    className="w-full px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-[#FFF1F4] transition"
                  >
                    My Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 text-left text-sm font-semibold text-[#D9334E] hover:bg-[#FFF1F4] transition border-t border-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* MOBILE RIGHT */}
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={handleProfileClick}
                className="w-10 h-10 rounded-full bg-white text-[#D9334E] flex items-center justify-center font-bold text-sm shadow-md"
              >
                {userInitials}
              </button>

              <button
                id="mobile-menu-button"
                onClick={() => setMobileNavOpen(!mobileNavOpen)}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/15 hover:bg-white/20 transition border border-white/15"
                aria-label="Toggle menu"
              >
                <div className="flex flex-col justify-center items-center gap-[3px]">
                  <span className="w-5 h-[2px] bg-white rounded-full"></span>
                  <span className="w-5 h-[2px] bg-white rounded-full"></span>
                  <span className="w-5 h-[2px] bg-white rounded-full"></span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE NAV */}
        {mobileNavOpen && (
          <div className="md:hidden px-4 pb-4" ref={mobileNavRef}>
            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-3 shadow-lg border border-white/15">
              <div className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                      isActive(item.path)
                        ? "bg-white text-[#D9334E]"
                        : "text-white hover:bg-white/10"
                    }`}
                  >
                    <img
                      src={isActive(item.path) ? item.activeIcon : item.icon}
                      alt={item.label}
                      className="w-5 h-5 object-contain"
                    />
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                ))}

                <button
                  onClick={handleLogout}
                  className="mt-2 w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white text-[#D9334E] font-semibold shadow-[0_8px_20px_rgba(255,255,255,0.12)]"
                >
                  <span>Logout</span>
                  <span>↗</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

