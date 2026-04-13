import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import logo from "../../assets/images/vella-logo-v1.png"; // palitan mo sa tamang file path
import api from "../../services/api";

const imageModules = import.meta.glob(
  "../../assets/images/slideshow/*.png",
  { eager: true, import: "default" }
);

export default function Register() {
  const navigate = useNavigate();

  const images = useMemo(
    () =>
      Object.entries(imageModules)
        .sort(([a], [b]) => {
          const getNum = (path) =>
            Number(path.match(/\/(\d+)\.png$/)?.[1] || 0);
          return getNum(a) - getNum(b);
        })
        .map(([, src]) => src),
    []
  );

  const [index, setIndex] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [images.length]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    if (errors[e.target.name]) {
      setErrors((prev) => ({
        ...prev,
        [e.target.name]: "",
      }));
    }

    if (serverError) {
      setServerError("");
    }
  };

  const validate = () => {
    let newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Full name is required";
    }

    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      setErrors({});
      setServerError("");

      await api.post("/auth/register", {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });

      const loginResponse = await api.post("/auth/login", {
        email: form.email.trim(),
        password: form.password,
      });

      const { token, user } = loginResponse.data;

      if (user.role !== "user") {
        setServerError("Account created, but automatic login failed due to invalid role.");
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      navigate("/home");
    } catch (error) {
      console.error("Register error:", error);

      if (error.response?.data?.message) {
        setServerError(error.response.data.message);
      } else {
        setServerError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="min-h-screen relative overflow-hidden px-4 sm:px-6 md:px-8 lg:px-10 py-6 md:py-8 flex items-center justify-center"
    >
      {/* Background slideshow */}
      <div className="absolute inset-0">
        <AnimatePresence initial={false} mode="sync">
          <motion.img
            key={index}
            src={images[index]}
            alt={`Slide ${index + 1}`}
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1.08 }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { duration: 1.8, ease: "easeInOut" },
              scale: { duration: 4.5, ease: "linear" },
            }}
          />
        </AnimatePresence>
      </div>

      {/* Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(
              90deg,
              rgba(130,24,26,0.88) 0%,
              rgba(165,0,54,0.72) 50%,
              rgba(70,8,9,0.88) 100%
            )
          `,
        }}
      />

      {/* Main content */}
      <div className="relative z-10 w-full max-w-[1400px] grid grid-cols-1 lg:grid-cols-2 items-center gap-8 lg:gap-12">
        {/* MOBILE HEADER (LABAS NG CARD) */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="lg:hidden relative z-10 flex flex-col items-center text-center text-white px-5 mb-5 col-span-1"
        >
          <motion.img
            src={logo}
            alt="Vella logo"
            className="w-[85px] mb-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
          />

          <motion.h2
            className="text-[16px] font-bold leading-tight max-w-[260px]"
            style={{ fontFamily: "Google Sans" }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.32 }}
          >
            Saving Lives, <br /> Just a Heartbeat Away.
          </motion.h2>

          <motion.p
            className="text-[12px] opacity-90 leading-relaxed max-w-[280px] mt-1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Join as a donor <br /> and help save lives in your community.
          </motion.p>
        </motion.div>

        {/* Left branding */}
        <motion.div
          initial={{ opacity: 0, x: -35 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="hidden lg:flex flex-col justify-center text-white min-h-[520px] px-2 xl:px-6"
        >
          <motion.img
            src={logo}
            alt="Vella logo"
            className="w-[200px] xl:w-[250px] mb-4"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
          />

          <motion.h2
            className="text-[36px] xl:text-[44px] font-bold leading-tight max-w-[500px]"
            style={{ fontFamily: "Google Sans" }}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
          >
            Saving Lives, <br /> Just a Heartbeat Away.
          </motion.h2>

          <motion.p
            className="mt-3 text-[15px] xl:text-[17px] opacity-95 leading-relaxed max-w-[520px]"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55 }}
          >
            Create and manage blood requests, organize donation drives,
            track donor participation, and monitor system data.
          </motion.p>
        </motion.div>

        {/* Right form */}
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: "easeOut" }}
          className="w-full flex justify-center lg:justify-end"
        >
          <div className="w-full max-w-[680px]">
            <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[24px] md:rounded-[28px] shadow-[0_8px_32px_rgba(0,0,0,0.25)] px-5 sm:px-7 md:px-8 py-6 sm:py-8 md:py-9">
              <motion.h2
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.45 }}
                className="text-[22px] sm:text-[24px] font-bold text-white mb-1"
              >
                Create your account
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.52 }}
                className="text-white/75 text-[13px] sm:text-[14px] mb-6"
              >
                Join as a donor and save lives
              </motion.p>

              {serverError && (
                <p className="text-red-200 text-sm mb-3">{serverError}</p>
              )}

              <form className="space-y-3.5" onSubmit={handleSubmit}>
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: 0.58 }}
                >
                  <label className="text-[13px] font-medium text-white/85">
                    Full Name
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    type="text"
                    placeholder="Enter your full name"
                    className="w-full mt-2 px-4 py-[11px] bg-white/18 border border-white/20 rounded-[10px] text-[14px] text-white placeholder:text-white/55 outline-none backdrop-blur-md transition-all duration-300 focus:border-white/30 focus:ring-2 focus:ring-white/30"
                  />
                  {errors.name && (
                    <p className="text-red-200 text-xs mt-1">{errors.name}</p>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: 0.66 }}
                >
                  <label className="text-[13px] font-medium text-white/85">
                    Email
                  </label>
                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    type="email"
                    placeholder="e.g. lastname.firstname@gmail.com"
                    className="w-full mt-2 px-4 py-[11px] bg-white/18 border border-white/20 rounded-[10px] text-[14px] text-white placeholder:text-white/55 outline-none backdrop-blur-md transition-all duration-300 focus:border-white/30 focus:ring-2 focus:ring-white/30"
                  />
                  {errors.email && (
                    <p className="text-red-200 text-xs mt-1">{errors.email}</p>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: 0.74 }}
                >
                  <label className="text-[13px] font-medium text-white/85">
                    Password
                  </label>
                  <div className="relative mt-2">
                    <input
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••••••••••"
                      className="w-full px-4 py-[11px] bg-white/18 border border-white/20 rounded-[10px] text-[14px] text-white placeholder:text-white/55 outline-none backdrop-blur-md transition-all duration-300 focus:border-white/30 focus:ring-2 focus:ring-white/30 pr-11"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/65 hover:text-white transition"
                    >
                      {showPassword ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-[18px] h-[18px]"
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
                          className="w-[18px] h-[18px]"
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
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-200 text-xs mt-1">{errors.password}</p>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: 0.82 }}
                >
                  <label className="text-[13px] font-medium text-white/85">
                    Confirm Password
                  </label>
                  <div className="relative mt-2">
                    <input
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••••••••••"
                      className="w-full px-4 py-[11px] bg-white/18 border border-white/20 rounded-[10px] text-[14px] text-white placeholder:text-white/55 outline-none backdrop-blur-md transition-all duration-300 focus:border-white/30 focus:ring-2 focus:ring-white/30 pr-11"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/65 hover:text-white transition"
                    >
                      {showConfirmPassword ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-[18px] h-[18px]"
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
                          className="w-[18px] h-[18px]"
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
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-200 text-xs mt-1">
                      {errors.confirmPassword}
                    </p>
                  )}
                </motion.div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: 0.9 }}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.985 }}
                  className="w-full mt-5 py-3.5 rounded-full text-white font-semibold text-[15px] bg-gradient-to-r from-[#FF6780] to-[#DD003F] shadow-lg shadow-pink-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </motion.button>
              </form>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-center mt-4"
              >
                <span className="text-sm text-white/75">
                  Already have an account?{" "}
                </span>
                <Link
                  to="/user/login"
                  className="text-sm text-white font-medium hover:underline"
                >
                  Log in
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <Link
                  to="/"
                  className="block text-left mt-6 text-sm text-white/75 hover:text-white hover:underline"
                >
                  ← Back to Home
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

