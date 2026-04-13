import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  RadialBarChart,
  RadialBar,
} from "recharts";
import {
  FiUsers,
  FiDroplet,
  FiClock,
  FiCalendar,
  FiAlertTriangle,
  FiPlus,
  FiTrendingUp,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import CreateBloodRequestModal from "../../components/modals/admin/CreateBloodRequestModal";

const Dashboard = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    bloodType: "",
    title: "",
    location: "",
    date: "",
    time: "",
    urgency: "Medium",
    maxParticipants: "",
    description: "",
  });

  const [dashboardData, setDashboardData] = useState({
    topCards: {
      totalBloodDonors: 0,
      availableBloodUnits: 0,
      pendingBloodRequests: 0,
      upcomingDonationDrives: 0,
    },
    monthlyDonationTrend: [],
    annualProgress: {
      collectedUnits: 0,
      targetUnits: 2265,
      collectedPercentage: 0,
      remainingUnits: 2265,
      remainingPercentage: 100,
    },
    criticalBloodStockAlerts: [],
  });

  const fetchDashboardSummary = async () => {
    try {
      const res = await api.get("/dashboard/summary");
      setDashboardData(res.data);
    } catch (error) {
      console.error("Failed to fetch dashboard summary:", error);
    }
  };

  useEffect(() => {
    fetchDashboardSummary();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      await api.post("/requests", {
        title: formData.title,
        bloodType: formData.bloodType,
        urgency: formData.urgency.toLowerCase(),
        venue: formData.location,
        date: formData.date,
        startTime: formData.time,
        maxParticipants: formData.maxParticipants
          ? Number(formData.maxParticipants)
          : 0,
        description: formData.description,
      });

      setIsModalOpen(false);

      setFormData({
        bloodType: "",
        title: "",
        location: "",
        date: "",
        time: "",
        urgency: "Medium",
        maxParticipants: "",
        description: "",
      });

      fetchDashboardSummary();
    } catch (error) {
      console.error("Failed to create blood request:", error);
    }
  };

  const stats = [
    {
      title: "Total Blood Donors",
      value: dashboardData.topCards.totalBloodDonors,
      subtitle: "Active registered donors",
      badge: "ACTIVE",
      icon: <FiUsers size={14} />,
      gradient: "from-[#5A9CFF] to-[#2D6BDF]",
    },
    {
      title: "Available Blood Units",
      value: dashboardData.topCards.availableBloodUnits,
      subtitle: "Total inventory units",
      badge: "IN STOCK",
      icon: <FiDroplet size={14} />,
      gradient: "from-[#FF6A6A] to-[#E12424]",
    },
    {
      title: "Pending Blood Requests",
      value: dashboardData.topCards.pendingBloodRequests,
      subtitle: "Awaiting action",
      badge: "PENDING",
      icon: <FiClock size={14} />,
      gradient: "from-[#FFA63D] to-[#F06B00]",
    },
    {
      title: "Upcoming Donation Drives",
      value: dashboardData.topCards.upcomingDonationDrives,
      subtitle: "Scheduled events",
      badge: "SCHEDULED",
      icon: <FiCalendar size={14} />,
      gradient: "from-[#A780FF] to-[#7246E8]",
    },
  ];

  const trendData = (dashboardData.monthlyDonationTrend || []).map((item) => ({
    month: item.month,
    donations: item.units,
  }));

  const alerts = dashboardData.criticalBloodStockAlerts || [];

  const collectedUnits = Number(dashboardData.annualProgress?.collectedUnits || 0);
  const targetUnits = Number(dashboardData.annualProgress?.targetUnits || 0);

  const exactPercent =
    targetUnits > 0 ? (collectedUnits / targetUnits) * 100 : 0;

  const safePercent = Math.min(Math.max(exactPercent, 0), 100);
  const roundedPercent = Math.round(safePercent);
  const remainingPercent = 100 - roundedPercent;

  // this controls how much of the ring is filled
  const progressEndAngle = 90 - (safePercent / 100) * 360;

  return (
    // add ng p-4 tanggal ng bg-#f4 dagdagan ng min-h-screen bago -ml-10
    <div 
      className="min-h-screen overflow-hidden relative z-10 p-4 -ml-10"
    >
      <div className="h-full w-full p-[8px]">
        {/* remove the div with bg-#eef2f7, pangalwang closing na div sa before createblood bago*/}
          <div className="grid h-full grid-rows-[auto_auto_1fr_auto] gap-[8px]">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="min-h-0"
            >
              {/* text gawing 3xl bago*/}
              <h1 className="text-3xl font-bold leading-tight text-[#111827]">
                Dashboard Overview
              </h1>
              <p className="mt-0.5 text-[11px] text-[#6B7280] leading-snug">
                Monitor your blood donation system performance and key metrics
              </p>
            </motion.div>

            {/*  Ito bago */}
            <div className="grid min-h-0 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[8px]">
              {stats.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  whileHover={{ y: -2 }}
                  className={`rounded-[16px] bg-gradient-to-br ${item.gradient} px-[12px] py-[10px] text-white shadow-[0_8px_20px_rgba(0,0,0,0.08)]`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-[30px] w-[30px] items-center justify-center rounded-[9px] border border-white/25 bg-white/15">
                      {item.icon}
                    </div>
                    <span className="rounded-full bg-white/20 px-2.5 py-[3px] text-[8px] font-medium tracking-wide">
                      {item.badge}
                    </span>
                  </div>

                  <div className="mt-4">
                    <h2 className="text-[2.2rem] font-bold leading-none">
                      {item.value}
                    </h2>
                    <p className="mt-1.5 text-[11px] font-medium">
                      {item.title}
                    </p>
                    <p className="mt-0.5 text-[9px] text-white/85">
                      {item.subtitle}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* div bago */}
            <div className="grid min-h-0 grid-cols-1 gap-[8px] lg:grid-cols-[2fr_1fr] xl:grid-cols-[2.3fr_0.85fr]">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex min-h-0 flex-col rounded-[16px] border border-[#D9DEE7] bg-white px-[14px] py-[12px] shadow-[0_6px_16px_rgba(15,23,42,0.06)] overflow-hidden"
              >
                <div className="flex items-start justify-between gap-3 border-b border-[#EEF2F7] pb-3">
                  <div>
                    <h2 className="text-[12px] font-bold text-[#111827]">
                      Monthly Donation Trend
                    </h2>
                    <p className="mt-1 text-[9px] text-[#6B7280]">
                      Verified donations performance analysis
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 rounded-[10px] bg-[#F3F4F6] px-3 py-2 text-[9px] font-medium text-[#4B5563]">
                    <FiCalendar size={11} />
                    Jan – Dec {new Date().getFullYear()}
                  </div>
                </div>

                {/* ito bago div*/}
                <div className="h-[180px] sm:h-[210px] py-3">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={trendData}
                      margin={{ top: 14, right: 2, left: -24, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#FF6B6B" stopOpacity={0.16} />
                          <stop offset="100%" stopColor="#FF6B6B" stopOpacity={0.03} />
                        </linearGradient>
                      </defs>

                      <CartesianGrid
                        strokeDasharray="4 4"
                        vertical={false}
                        stroke="#D1D5DB"
                      />
                      <XAxis
                        dataKey="month"
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: "#6B7280", fontSize: 10, fontWeight: 500 }}
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        width={24}
                        tick={{ fill: "#6B7280", fontSize: 10, fontWeight: 500 }}
                      />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="donations"
                        stroke="#FF6B6B"
                        strokeWidth={3}
                        fill="url(#trendFill)"
                        isAnimationActive
                        animationDuration={1200}
                        dot={{
                          r: 4.5,
                          strokeWidth: 3,
                          stroke: "#FF6B6B",
                          fill: "#fff",
                        }}
                        activeDot={{
                          r: 5.5,
                          strokeWidth: 3,
                          stroke: "#FF6B6B",
                          fill: "#fff",
                        }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="border-t border-[#EEF2F7] pt-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-[#E8F0FF] text-[#3B82F6]">
                      <FiTrendingUp size={13} />
                    </div>
                    <div>
                      <h3 className="text-[11px] font-bold text-[#111827]">
                        Performance Insight
                      </h3>
                      <p className="mt-1 text-[10px] text-[#6B7280]">
                        {collectedUnits > 0
                          ? "Donation data is being tracked based on verified attendance this year."
                          : "No verified donation data recorded yet for this year."}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex min-h-0 flex-col rounded-[16px] border border-[#D9DEE7] bg-white px-[14px] py-[12px] shadow-[0_6px_16px_rgba(15,23,42,0.06)] overflow-hidden"
              >
                <div>
                  <h2 className="text-[12px] font-bold text-[#111827]">
                    Blood Collection Progress
                  </h2>
                  <p className="mt-1 text-[9px] text-[#6B7280]">
                    Annual target tracking ({new Date().getFullYear()})
                  </p>
                </div>

                {/* div ito bago */}
                <div className="relative mx-auto mt-3 h-[130px] w-[130px] sm:h-[150px] sm:w-[150px] flex-shrink-0">
                {/* Background chart */}
                <div className="absolute inset-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                      cx="50%"
                      cy="50%"
                      innerRadius="78%"
                      outerRadius="100%"
                      barSize={16}
                      startAngle={90}
                      endAngle={-270}
                      data={[{ value: 100 }]}
                    >
                      <RadialBar
                        dataKey="value"
                        cornerRadius={100}
                        fill="#D1D5DB"
                        clockWise
                        isAnimationActive={false}
                      />
                    </RadialBarChart>
                  </ResponsiveContainer>
                </div>

                {/* Progress chart */}
                <div className="absolute inset-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                      cx="50%"
                      cy="50%"
                      innerRadius="78%"
                      outerRadius="100%"
                      barSize={16}
                      startAngle={90}
                      endAngle={90 - (safePercent / 100) * 360}
                      data={[{ value: safePercent }]}
                    >
                      <RadialBar
                        dataKey="value"
                        cornerRadius={100}
                        fill="#22C55E"
                        clockWise
                        isAnimationActive
                        animationDuration={1200}
                      />
                    </RadialBarChart>
                  </ResponsiveContainer>
                </div>

                {/* Center text */}
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <h3 className="text-[2.1rem] font-bold leading-none text-[#111827]">
                    {collectedUnits}
                  </h3>
                  <p className="mt-1 text-[10px] font-medium text-[#94A3B8]">
                    / {targetUnits} units
                  </p>
                </div>
              </div>

                <div className="mt-2 space-y-3">
                  <div className="flex items-center justify-between text-[10px]">
                    <div className="flex items-center gap-2 font-medium text-[#374151]">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#22C55E]" />
                      Collected
                    </div>
                    <span className="font-bold text-[#16A34A]">{roundedPercent}%</span>
                  </div>

                  <div className="flex items-center justify-between text-[10px]">
                    <div className="flex items-center gap-2 font-medium text-[#374151]">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#D1D5DB]" />
                      Remaining
                    </div>
                    <span className="font-bold text-[#9CA3AF]">{remainingPercent}%</span>
                  </div>
                </div>

                <div className="mt-4 border-t border-[#EEF2F7] pt-3 text-center text-[10px] text-[#6B7280]">
                  Based on monthly donation data
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[16px] border border-[#F5B5B5] bg-[#FFF5F5] px-[14px] py-[12px]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-[#FF2E2E] text-white">
                    <FiAlertTriangle size={15} />
                  </div>

                  <div>
                    <h2 className="text-[12px] font-bold text-[#111827]">
                      Critical Blood Stock Alerts
                    </h2>
                    <p className="mt-1 text-[9px] text-[#6B7280]">
                      Blood types with low inventory
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/admin/requests")}
                  className="flex items-center gap-2 rounded-[10px] bg-[#FF1E1E] px-4 py-2 text-[9px] font-medium text-white shadow-[0_8px_18px_rgba(255,30,30,0.25)] transition hover:scale-[1.02]"
                >
                  <FiPlus size={11} />
                  <span className="hidden sm:inline">Create Blood Request</span>
                </button>
              </div>

              {/* ito bago div */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {alerts.length === 0 ? (
                  <div className="col-span-full rounded-[14px] border border-[#F7A8A8] bg-white px-3 py-6 text-center text-[10px] text-[#6B7280]">
                    No critical low-stock blood types right now.
                  </div>
                ) : (
                  alerts.map((a) => (
                    <motion.div
                      key={a.bloodType}
                      whileHover={{ y: -2 }}
                      // ito bago className
                      className="flex items-center gap-3 rounded-[14px] border border-[#F7A8A8] bg-white px-3 py-3"
                    >
                      {/* ito bago div */}
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="flex h-10 w-10 items-center justify-center rounded-[11px] bg-[#FF1E1E] text-[0.95rem] font-bold text-white">
                          {a.bloodType}
                        </div>

                        <div>
                          <p className="text-[9px] text-[#6B7280]">Available Units</p>
                          <h3 className="text-[1.8rem] font-bold leading-none text-[#111827]">
                            {a.units}
                          </h3>
                        </div>
                      </div>

                      {/* ito bago span */}
                      <span className="ml-auto shrink-0 rounded-[9px] bg-[#FF1E1E] px-2 sm:px-3 py-1 text-[8px] sm:text-[9px] font-bold text-white whitespace-nowrap">
                        LOW
                      </span>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
      </div>

      <CreateBloodRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        setFormData={setFormData}
      />
    </div>
  );
};

export default Dashboard;