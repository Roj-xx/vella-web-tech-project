import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import logo from "../../assets/images/vella-logo-v1.png";
import api from "../../services/api";
import bgImage from "../../assets/images/bg-image.png";

export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    if (error) {
      setError("");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await api.post("/auth/login", {
        email: form.email,
        password: form.password,
      });

      const { token, user } = response.data;

      if (user.role !== "pho_admin") {
        setError("This login is for admins only.");
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      navigate("/admin/dashboard");
    } catch (err) {
      console.error("Admin login error:", err);

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const fadeSoft = {
    initial: { opacity: 0, y: 10 },
    animate: (delay = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        delay,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
    exit: {
      opacity: 0,
      y: 6,
      transition: {
        duration: 0.35,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="min-h-screen flex flex-col lg:flex-row items-center justify-center lg:justify-between px-4 sm:px-6 md:px-8 lg:px-10 py-6 md:py-8 bg-cover bg-center relative overflow-hidden"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* OVERLAY */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(70,8,9,0.85) 100%, rgba(165,0,54,0.8) 70%, rgba(130,24,26,0.85) 10%)",
        }}
      />

      {/* MOBILE HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
        className="lg:hidden relative z-10 flex flex-col items-center text-center text-white px-5 mb-6"
      >
        <motion.img
          src={logo}
          alt="Vella logo"
          className="w-[130px] sm:w-[150px] mb-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
        />

        <motion.h2
          className="text-[16px] font-bold max-w-[260px] leading-tight"
          style={{ fontFamily: "Google Sans" }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.32 }}
        >
          Saving Lives, Just a <br /> Heartbeat Away.
        </motion.h2>

        <motion.p
          className="text-[12px] opacity-90 mt-1 max-w-[280px] leading-relaxed"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Create and manage blood requests, organize donation drives, and
          monitor system data.
        </motion.p>
      </motion.div>

      {/* LEFT */}
      <motion.div
        initial={{ opacity: 0, x: -18 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -10 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="hidden lg:block relative z-10 text-white max-w-lg"
      >
        <motion.img
          src={logo}
          alt="logo"
          className="w-[200px] xl:w-[250px] mb-4"
          variants={fadeSoft}
          initial="initial"
          animate="animate"
          custom={0.05}
        />

        <motion.h2
          className="text-[36px] xl:text-[44px] font-bold leading-tight max-w-[500px]"
          style={{ fontFamily: "Google Sans" }}
          variants={fadeSoft}
          initial="initial"
          animate="animate"
          custom={0.18}
        >
          Saving Lives, Just a <br /> Heartbeat Away.
        </motion.h2>

        <motion.p
          className="mt-3 text-[15px] xl:text-[17px] opacity-95 leading-relaxed max-w-[520px]"
          variants={fadeSoft}
          initial="initial"
          animate="animate"
          custom={0.24}
        >
          Create and manage blood requests, organize donation drives, track
          donor participation, and monitor system data.
        </motion.p>
      </motion.div>

      {/* RIGHT */}
      <motion.div
        initial={{ opacity: 0, x: 18 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 10 }}
        transition={{ duration: 0.55, ease: "easeOut", delay: 0.05 }}
        className="relative z-10 w-full max-w-3xl"
      >
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.995 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.25)] p-6 sm:p-10 lg:p-16"
        >
          {/* HEADER */}
          <motion.h2
            variants={fadeSoft}
            initial="initial"
            animate="animate"
            custom={0.14}
            className="text-[24px] sm:text-3xl font-bold text-white mb-1"
            style={{ fontFamily: "Google Sans" }}
          >
            Welcome Admin!
          </motion.h2>

          <motion.p
            variants={fadeSoft}
            initial="initial"
            animate="animate"
            custom={0.2}
            className="text-white/75 text-sm mb-10"
          >
            Please enter your admin credentials to continue
          </motion.p>

          {/* FORM */}
          {error && <p className="text-red-200 text-sm mb-4">{error}</p>}

          <form className="space-y-6" onSubmit={handleLogin}>
            {/* EMAIL */}
            <motion.div
              variants={fadeSoft}
              initial="initial"
              animate="animate"
              custom={0.26}
            >
              <label className="text-sm sm:text-base text-white/85">Email</label>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                type="email"
                placeholder="marinduque.pho@vella.ph"
                className="w-full mt-2 px-5 py-3 bg-white/18 border border-white/20 rounded-xl text-white placeholder:text-white/55 outline-none backdrop-blur-md focus:ring-2 focus:ring-white/30 focus:border-white/30"
              />
            </motion.div>

            {/* PASSWORD */}
            <motion.div
              variants={fadeSoft}
              initial="initial"
              animate="animate"
              custom={0.32}
            >
              <label className="text-sm sm:text-base text-white/85">
                Password
              </label>
              <div className="relative mt-2">
                <input
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  className="w-full px-5 py-3 bg-white/18 border border-white/20 rounded-xl text-white placeholder:text-white/55 outline-none backdrop-blur-md focus:ring-2 focus:ring-white/30 focus:border-white/30"
                />

                <motion.button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  whileHover={{ opacity: 1 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/65 hover:text-white opacity-90"
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7Z"
                      />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 3l18 18"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10.584 10.587A2 2 0 0012 14a2 2 0 001.414-.586"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.88 5.09A10.94 10.94 0 0112 5c4.478 0 8.268 2.943 9.542 7a11.05 11.05 0 01-4.132 5.411M6.228 6.228A10.972 10.972 0 002.458 12c1.274 4.057 5.064 7 9.542 7a10.94 10.94 0 005.772-1.651"
                      />
                    </svg>
                  )}
                </motion.button>
              </div>
            </motion.div>

            {/* REMEMBER */}
            <motion.div
              variants={fadeSoft}
              initial="initial"
              animate="animate"
              custom={0.38}
            >
              <label className="flex items-center gap-2 text-sm text-white/75">
                <input type="checkbox" />
                Remember Me
              </label>
            </motion.div>

            {/* BUTTON */}
            <motion.button
              type="submit"
              disabled={loading}
              variants={fadeSoft}
              initial="initial"
              animate="animate"
              custom={0.44}
              className="w-full py-3 rounded-full text-white font-medium bg-gradient-to-r from-[#FF6780] to-[#DD003F] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in..." : "Log In"}
            </motion.button>

            <motion.p className="text-sm text-center text-white/75 mt-4">
              🔒 Authorized Personnel Only
            </motion.p>
          </form>

          {/* BACK */}
          <motion.div
            variants={fadeSoft}
            initial="initial"
            animate="animate"
            custom={0.56}
          >
            <Link
              to="/login"
              className="block text-left mt-6 text-sm sm:text-base text-white/75 hover:text-white hover:underline"
            >
              ← Back to Roles
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

