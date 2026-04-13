import heroImage from "/src/assets/images/hero-image.png";
import bgImage from "/src/assets/images/bg-image.png";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import api from "../../services/api";

const fadeUp = {
  hidden: { opacity: 0, y: 35 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      delay,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (delay = 0) => ({
    opacity: 1,
    transition: {
      duration: 1,
      delay,
      ease: "easeOut",
    },
  }),
};

const cardVariant = {
  hidden: { opacity: 0, y: 25, scale: 0.96 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.75,
      delay,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export default function Hero() {
  const [stats, setStats] = useState({
    totalDonors: 0,
    currentBloodSupply: 0,
    annualTarget: 2265,
    annualCollectedUnits: 0,
    annualCollectedPercentage: 0,
    upcomingDonationDrives: 0,
  });

  useEffect(() => {
    const fetchLandingStats = async () => {
      try {
        const response = await api.get("/public/landing-stats");
        setStats(response.data);
      } catch (error) {
        console.error("Failed to fetch landing stats:", error);
      }
    };

    fetchLandingStats();
  }, []);

  return (
    <motion.section
      id="home"
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, y: -20, transition: { duration: 0.45, ease: "easeInOut" } }}
      className="
        min-h-[auto] lg:min-h-screen
        text-white
        relative
        bg-cover bg-center
        overflow-hidden
        px-4 pt-24
        sm:px-6 sm:pt-28
        md:px-8 md:pt-32
        lg:px-16 lg:pt-15
      "
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    >
      <motion.div
        variants={fadeIn}
        custom={0}
        className="absolute inset-0 backdrop-blur-sm bg-[linear-gradient(90deg,rgba(201,0,3,0.75),rgba(191,0,67,0.75),rgba(201,0,70,0.75))]"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{
          opacity: 0.35,
          scale: 1,
          transition: { duration: 1.4, ease: "easeOut" },
        }}
        className="absolute -top-24 left-10 w-[420px] h-[420px] rounded-full bg-white/10 blur-3xl pointer-events-none"
      />

      <div className="relative z-10 flex flex-col lg:flex-row w-full items-center lg:items-center justify-between gap-8 lg:gap-10">
        <div className="w-full max-w-xl">
          <motion.h1
            variants={fadeUp}
            custom={0.15}
            className="
              font-[Poppins]
              font-bold
              text-[24px]
              leading-[1.08]
              tracking-[0px]
              mb-4
              sm:text-[36px]
              md:text-[42px]
              lg:text-[50px]
              lg:mb-8
            "
          >
            Every Drop Counts, <br />
            Every Donor Matters.
          </motion.h1>

          <motion.p
            variants={fadeUp}
            custom={0.3}
            className="
  text-[13px] leading-relaxed mb-5
  sm:text-[14px]
  md:text-[16px]
  lg:text-lg lg:mb-8
"
          >
            VELLA helps connect people to life-saving blood donation opportunities
            while ensuring efficient management and coordination.
          </motion.p>

          <motion.div
            variants={fadeUp}
            custom={0.45}
            className="flex flex-wrap gap-3 sm:gap-4"
          >
            <Link to="/register">
              <motion.button
                whileHover={{
                  scale: 1.06,
                  y: -2,
                  boxShadow: "0 16px 40px rgba(221,0,63,0.35)",
                }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 260, damping: 18 }}
                className="
                  px-5 py-2.5 rounded-lg font-bold text-white font-[Poppins]
                  text-sm sm:text-base
                  bg-[linear-gradient(90deg,#FF6780,#DD003F)]
                  shadow-lg shadow-pink-500/30
                  hover:shadow-pink-500/60
                  transition duration-300
                  sm:px-6 sm:py-3
                "
              >
                Register →
              </motion.button>
            </Link>

            <motion.a
              href="/#features"
              whileHover={{
                scale: 1.05,
                y: -2,
                backgroundColor: "rgba(255,255,255,0.10)",
              }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
              className="
                border border-white/70
                px-5 py-2.5 rounded-lg font-bold text-white
                text-sm sm:text-base
                backdrop-blur-sm bg-white/5
                hover:bg-white/10
                transition duration-300
                inline-block
                sm:px-6 sm:py-3
              "
            >
              Learn More
            </motion.a>
          </motion.div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:gap-5 lg:gap-6 max-w-xl">
            <motion.div
              variants={cardVariant}
              custom={0.6}
              whileHover={{
                y: -6,
                scale: 1.02,
                backgroundColor: "rgba(255,255,255,0.14)",
                boxShadow: "0 14px 30px rgba(0,0,0,0.16)",
              }}
              className="
                flex items-center gap-2
                bg-white/10 border border-white/20 backdrop-blur-md
                p-3 rounded-xl min-w-0
                sm:gap-3 sm:p-4
              "
            >
              <motion.img
                src="/src/assets/icons/Reg_Don.png"
                alt="Registered Donors"
                className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-20 lg:h-20 shrink-0"
                whileHover={{ rotate: -3, scale: 1.04 }}
                transition={{ type: "spring", stiffness: 220, damping: 16 }}
              />
              <div className="min-w-0">
                <p className="text-sm sm:text-base md:text-lg font-bold leading-tight break-words">
                  {stats.totalDonors}
                </p>
                <p className="text-[11px] sm:text-xs md:text-sm opacity-80 leading-tight">
                  Total Donors
                </p>
              </div>
            </motion.div>

            <motion.div
              variants={cardVariant}
              custom={0.72}
              whileHover={{
                y: -6,
                scale: 1.02,
                backgroundColor: "rgba(255,255,255,0.14)",
                boxShadow: "0 14px 30px rgba(0,0,0,0.16)",
              }}
              className="
                flex items-center gap-2
                bg-white/10 border border-white/20 backdrop-blur-md
                p-3 rounded-xl min-w-0
                sm:gap-3 sm:p-4
              "
            >
              <motion.img
                src="/src/assets/icons/Cur_Blo_Sup.png"
                alt="Current Blood Supply"
                className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-20 lg:h-20 shrink-0"
                whileHover={{ rotate: -3, scale: 1.04 }}
                transition={{ type: "spring", stiffness: 220, damping: 16 }}
              />
              <div className="min-w-0">
                <p className="text-sm sm:text-base md:text-lg font-bold leading-tight break-words">
                  {stats.currentBloodSupply} Units
                </p>
                <p className="text-[11px] sm:text-xs md:text-sm opacity-80 leading-tight">
                  Current Blood Supply
                </p>
              </div>
            </motion.div>

            <motion.div
              variants={cardVariant}
              custom={0.84}
              whileHover={{
                y: -6,
                scale: 1.02,
                backgroundColor: "rgba(255,255,255,0.14)",
                boxShadow: "0 14px 30px rgba(0,0,0,0.16)",
              }}
              className="
                flex items-center gap-2
                bg-white/10 border border-white/20 backdrop-blur-md
                p-3 rounded-xl min-w-0
                sm:gap-3 sm:p-4
              "
            >
              <motion.img
                src="/src/assets/icons/Blood_Dem.png"
                alt="Blood Demand"
                className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-20 lg:h-20 shrink-0"
                whileHover={{ rotate: -3, scale: 1.04 }}
                transition={{ type: "spring", stiffness: 220, damping: 16 }}
              />
              <div className="min-w-0">
                <p className="text-sm sm:text-base md:text-lg font-bold leading-tight break-words">
                  {stats.annualCollectedUnits} / {stats.annualTarget} Units
                </p>
                <p className="text-[11px] sm:text-xs md:text-sm opacity-80 leading-tight">
                  Blood Collection Progress ({stats.annualCollectedPercentage}%)
                </p>
              </div>
            </motion.div>

            <motion.div
              variants={cardVariant}
              custom={0.96}
              whileHover={{
                y: -6,
                scale: 1.02,
                backgroundColor: "rgba(255,255,255,0.14)",
                boxShadow: "0 14px 30px rgba(0,0,0,0.16)",
              }}
              className="
                flex items-center gap-2
                bg-white/10 border border-white/20 backdrop-blur-md
                p-3 rounded-xl min-w-0
                sm:gap-3 sm:p-4
              "
            >
              <motion.img
                src="/src/assets/icons/Don_Dri.png"
                alt="Upcoming Donation Drives"
                className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-20 lg:h-20 shrink-0"
                whileHover={{ rotate: -3, scale: 1.04 }}
                transition={{ type: "spring", stiffness: 220, damping: 16 }}
              />
              <div className="min-w-0">
                <p className="text-sm sm:text-base md:text-lg font-bold leading-tight break-words">
                  {stats.upcomingDonationDrives} Scheduled
                </p>
                <p className="text-[11px] sm:text-xs md:text-sm opacity-80 leading-tight">
                  Upcoming Donation Drives
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        <motion.div
          variants={fadeUp}
          custom={0.55}
          className="
            relative flex justify-center items-center
            w-full mt-2
            lg:hidden
          "
        >
          <motion.img
            src={heroImage}
            alt="Hero Visual"
            className="
              w-[260px] sm:w-[320px] md:w-[420px]
              object-contain drop-shadow-2xl mx-auto
            "
            animate={{ y: [0, -8, 0] }}
            transition={{
              duration: 5.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>

        <motion.div
          variants={fadeUp}
          custom={0.55}
          className="hidden lg:flex relative flex-1 justify-center items-center"
        >
          <motion.img
            src={heroImage}
            alt="Hero Visual"
            className="max-w-[750px] xl:max-w-[780px] w-full object-contain drop-shadow-2xl mx-auto"
            animate={{ y: [0, -10, 0] }}
            transition={{
              duration: 5.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </div>
    </motion.section>
  );
}

