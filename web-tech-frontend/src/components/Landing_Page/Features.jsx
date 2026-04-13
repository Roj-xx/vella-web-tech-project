import { useEffect, useRef, useState } from "react";
import dnIcon from "../../assets/icons/dn_icon.png";
import brIcon from "../../assets/icons/br_icon.png";
import rbIcon from "../../assets/icons/rb_icon.png";
import smIcon from "../../assets/icons/sm_icon.png";
import bgAbout from "../../assets/images/bg_about.png";

export default function About() {
  const sectionRef = useRef(null);
  const analyticsRef = useRef(null);

  const [isVisible, setIsVisible] = useState(false);
  const [analyticsVisible, setAnalyticsVisible] = useState(false);

  const [collected, setCollected] = useState(0);
  const [targetUnits, setTargetUnits] = useState(0);
  const [deficit, setDeficit] = useState(0);
  const [completionRate, setCompletionRate] = useState(0);

  useEffect(() => {
    const currentSection = sectionRef.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.2,
      }
    );

    if (currentSection) observer.observe(currentSection);

    return () => {
      if (currentSection) observer.unobserve(currentSection);
    };
  }, []);

  useEffect(() => {
    const currentAnalytics = analyticsRef.current;

    const analyticsObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnalyticsVisible(true);
          analyticsObserver.unobserve(entry.target);
        }
      },
      {
        threshold: 0.55,
        rootMargin: "0px 0px -80px 0px",
      }
    );

    if (currentAnalytics) analyticsObserver.observe(currentAnalytics);

    return () => {
      if (currentAnalytics) analyticsObserver.unobserve(currentAnalytics);
    };
  }, []);

  useEffect(() => {
    if (!analyticsVisible) return;

    animateValue(setCollected, 697, 2600, false);
    animateValue(setTargetUnits, 2265, 2800, false);
    animateValue(setDeficit, 1568, 2700, false);
    animateValue(setCompletionRate, 30.7, 3000, true);
  }, [analyticsVisible]);

  const animateValue = (setter, end, duration, isDecimal = false) => {
    const startTime = performance.now();

    const updateValue = (currentTime) => {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      const value = end * eased;

      setter(isDecimal ? Number(value.toFixed(1)) : Math.floor(value));

      if (progress < 1) {
        requestAnimationFrame(updateValue);
      } else {
        setter(end);
      }
    };

    requestAnimationFrame(updateValue);
  };

  const fadeUp = (delay = "") =>
    `transform transition-all duration-700 ease-out ${delay} ${
      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
    }`;

  const analyticsFade = (delay = "") =>
    `transform transition-all duration-1000 ease-out ${delay} ${
      analyticsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
    }`;

  const progress = analyticsVisible ? completionRate : 0;
  const radius = 92;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (progress / 100) * circumference;

  const aboutCards = [
    {
      icon: dnIcon,
      title: "Join Donation Drives",
      desc: "Find and participate in local blood donation events in your community.",
      delay: "delay-200",
    },
    {
      icon: brIcon,
      title: "Receive Blood Requests",
      desc: "Get notified when your blood type is urgently needed nearby.",
      delay: "delay-300",
    },
    {
      icon: rbIcon,
      title: "Earn Rewards",
      desc: "Collect points and recognition for your life-saving contributions.",
      delay: "delay-500",
    },
    {
      icon: smIcon,
      title: "Smart Management",
      desc: "Efficient tools for administrators to coordinate and track donations.",
      delay: "delay-700",
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="features"
      className="bg-[#FFE5E6] pt-24 pb-0 px-6 md:px-10 scroll-mt-1"
    >
      <div className="w-12 h-1 bg-red-500 mx-auto mb-6 rounded-full"></div>

      <div className={`text-center mb-14 ${fadeUp("delay-100")}`}>
        <h2
          className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
          style={{ fontFamily: "Google Sans" }}
        >
          About <span className="text-[#DD003F]">VELLA</span>
        </h2>
        <p
          className="text-gray-500 max-w-2xl mx-auto leading-relaxed text-sm sm:text-base"
          style={{ fontFamily: "Google Sans" }}
        >
          VELLA connects users to blood donation opportunities—allowing them to
          join drives, receive requests, and earn rewards—while enabling
          administrators to efficiently manage donation processes.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 max-w-7xl mx-auto pb-24">
        {aboutCards.map((card, index) => (
          <div
            key={index}
            className={`bg-white rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${fadeUp(
              card.delay
            )}`}
          >
            <img
              src={card.icon}
              alt={card.title}
              className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 object-contain mb-3 sm:mb-4"
            />
            <h3
              className="font-semibold text-sm sm:text-base md:text-lg text-gray-800 mb-2"
              style={{ fontFamily: "Google Sans" }}
            >
              {card.title}
            </h3>
            <p
              className="text-gray-500 text-xs sm:text-sm leading-relaxed"
              style={{ fontFamily: "Google Sans" }}
            >
              {card.desc}
            </p>
          </div>
        ))}
      </div>

      <div
        id="analytics"
        ref={analyticsRef}
        className="-mx-6 md:-mx-10 mt-0"
        style={{
          backgroundImage: `url(${bgAbout})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="px-6 md:px-36 py-24 md:py-20">
          <div className={`mb-10 ${analyticsFade()}`}>
            <p
              className="text-white/95 text-sm md:text-base font-semibold uppercase tracking-wider"
              style={{ fontFamily: "Google Sans" }}
            >
              As of 2025
            </p>
            <h3
              className="text-white text-3xl md:text-6xl font-bold leading-tight"
              style={{ fontFamily: "Google Sans" }}
            >
              Blood Supply Gap in Marinduque
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div
              className={`grid grid-cols-2 gap-4 sm:gap-6 ${analyticsFade(
                "delay-150"
              )}`}
            >
              <StatCard
                title="Units Collected"
                value={collected.toLocaleString()}
              />
              <StatCard
                title="Target Units"
                value={targetUnits.toLocaleString()}
              />
              <StatCard
                title="Units Deficit"
                value={deficit.toLocaleString()}
              />
              <StatCard
                title="Completion Rate"
                value={`${completionRate.toFixed(1)}%`}
              />
            </div>

            <div
              className={`flex flex-col items-center justify-center ${analyticsFade(
                "delay-300"
              )}`}
            >
              <div className="relative w-[260px] h-[260px] md:w-[360px] md:h-[360px]">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 240 240">
                  <circle
                    cx="120"
                    cy="120"
                    r={radius}
                    stroke="rgba(255,255,255,0.82)"
                    strokeWidth="46"
                    fill="none"
                  />
                  <circle
                    cx="120"
                    cy="120"
                    r={radius}
                    stroke="url(#progressGradient)"
                    strokeWidth="46"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={dashOffset}
                    style={{
                      transition: analyticsVisible
                        ? "stroke-dashoffset 3s cubic-bezier(0.22, 1, 0.36, 1)"
                        : "none",
                      filter:
                        "drop-shadow(0 12px 10px rgba(0,0,0,0.25)) drop-shadow(0 6px 6px rgba(0,0,0,0.15))",
                    }}
                  />
                  <defs>
                    <linearGradient
                      id="progressGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#FF4D6D" />
                      <stop offset="100%" stopColor="#FF0055" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <div
                className="mt-6 flex flex-wrap justify-center gap-6 text-white text-sm md:text-base font-medium"
                style={{ fontFamily: "Google Sans" }}
              >
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#FF5A6F]"></span>
                  <span>Collected (30.7%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-white"></span>
                  <span>Deficit (69.3%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatCard({ value, title }) {
  return (
    <div className="relative overflow-hidden rounded-[20px] bg-white/[0.06] backdrop-blur-md border border-white/25 shadow-none px-0 py-10 text-center">
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-white/[0.03] to-transparent pointer-events-none"></div>

      <div className="relative z-10">
        <h4
          className="text-white text-3xl md:text-5xl font-bold leading-none mb-1"
          style={{ fontFamily: "Google Sans" }}
        >
          {value}
        </h4>
        <p
          className="text-white text-base md:text-lg font-medium"
          style={{ fontFamily: "Google Sans" }}
        >
          {title}
        </p>
      </div>
    </div>
  );
}


