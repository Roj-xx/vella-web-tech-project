import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../assets/icons/vella_colored.png";
import userIcon from "../assets/icons/user.png";
import adminIcon from "../assets/icons/admin.png";

export default function Login() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 flex flex-col items-center justify-center px-4 sm:px-6"
    >
      {/* LOGO */}
      <motion.img
        src={logo}
        alt="logo"
        className="w-20 sm:w-24 md:w-28 mb-4 sm:mb-6 drop-shadow-md"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      />

      {/* TITLE */}
      <motion.h1
        className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-3 text-center tracking-tight"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
      >
        Choose Your Role
      </motion.h1>

      <motion.p
        className="text-gray-500 mb-8 sm:mb-12 text-sm sm:text-base md:text-lg text-center max-w-lg px-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
      >
        Select how you want to continue. Each role unlocks a tailored experience.
      </motion.p>

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 max-w-6xl w-full">
        {/* USER CARD */}
        <Link to="/user/login">
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            whileHover={{ scale: 1.04, y: -6 }}
            className="
              group relative bg-white/70 backdrop-blur-lg
              rounded-3xl p-6 sm:p-8 md:p-10
              border border-white/40
              shadow-lg
              transition-all duration-500 ease-in-out
              hover:shadow-2xl
              hover:border-[#DE0541]/40
              cursor-pointer
            "
          >
            <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-r from-[#DE0541]/10 to-transparent blur-xl"></div>

            <div className="relative z-10">
              <div
                className="
                  w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-2xl
                  bg-gradient-to-r from-[#FF8C8C] to-[#DE0541]
                  flex items-center justify-center mb-5 sm:mb-6 md:mb-8
                  shadow-md group-hover:scale-110 transition
                "
              >
                <img src={userIcon} alt="user" className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
              </div>

              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
                User
              </h2>

              <p className="text-gray-500 text-sm sm:text-base mb-6 sm:mb-7 md:mb-8 leading-relaxed">
                Access the system to view blood requests, participate in donation drives, and manage your donor profile.
              </p>

              <button
                className="
                  bg-[#DE0541] text-white
                  px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 rounded-xl
                  text-sm sm:text-base font-semibold
                  shadow-md
                  group-hover:shadow-lg
                  transition-all duration-300
                "
              >
                Login →
              </button>
            </div>
          </motion.div>
        </Link>

        {/* ADMIN CARD */}
        <Link to="/admin/login">
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.65 }}
            whileHover={{ scale: 1.04, y: -6 }}
            className="
              group relative bg-white/70 backdrop-blur-lg
              rounded-3xl p-6 sm:p-8 md:p-10
              border border-white/40
              shadow-lg
              transition-all duration-500 ease-in-out
              hover:shadow-2xl
              hover:border-[#DE0541]/40
              cursor-pointer
            "
          >
            <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-r from-[#DE0541]/10 to-transparent blur-xl"></div>

            <div className="relative z-10">
              <div
                className="
                  w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-2xl
                  bg-gradient-to-r from-[#71A9FF] to-[#155DFC]
                  flex items-center justify-center mb-5 sm:mb-6 md:mb-8
                  shadow-md group-hover:scale-110 transition
                "
              >
                <img src={adminIcon} alt="admin" className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
              </div>

              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
                Admin
              </h2>

              <p className="text-gray-500 text-sm sm:text-base mb-6 sm:mb-7 md:mb-8 leading-relaxed">
                Access the system to manage blood requests, organize donation drives, monitor donor participation, and oversee system data.
              </p>

              <button
                className="
                  bg-[#DE0541] text-white
                  px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 rounded-xl
                  text-sm sm:text-base font-semibold
                  shadow-md
                  group-hover:shadow-lg
                  transition-all duration-300
                "
              >
                Admin Login →
              </button>
            </div>
          </motion.div>
        </Link>
      </div>

      {/* BACK */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
      >
        <Link to="/">
          <p className="mt-10 sm:mt-12 md:mt-14 text-gray-500 text-sm hover:underline">
            ← Back to Home
          </p>
        </Link>
      </motion.div>
    </motion.div>
  );
}

