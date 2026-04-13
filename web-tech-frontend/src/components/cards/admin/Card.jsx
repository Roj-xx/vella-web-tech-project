import highIcon from "../../../assets/icons/high-stock.png";
import normalIcon from "../../../assets/icons/normal-stock.png";
import lowIcon from "../../../assets/icons/low-stock.png";
import totalIcon from "../../../assets/icons/blood-units.png";

export default function Card({ title, value, subtitle, color, type }) {
  
  const config = {
    total: {
      icon: totalIcon,
      badge: "TOTAL",
      glow: "hover:shadow-[0_20px_60px_rgba(255,90,100,0.45)]",
    },
    low: {
      icon: lowIcon,
      badge: "URGENT",
      glow: "hover:shadow-[0_20px_60px_rgba(220,38,38,0.5)]",
    },
    normal: {
      icon: normalIcon,
      badge: "STABLE",
      glow: "hover:shadow-[0_20px_60px_rgba(245,158,11,0.5)]",
    },
    high: {
      icon: highIcon,
      badge: "HEALTHY",
      glow: "hover:shadow-[0_20px_60px_rgba(16,185,129,0.5)]",
    },
  };

  const { icon, badge, glow } = config[type];

  return (
    <div
      className={`${color} text-white 
      p-4 sm:p-5 md:p-6 /* Responsive Padding */
      rounded-2xl shadow-lg relative overflow-hidden font-inter
      transition-all duration-300 ease-out
      hover:scale-[1.03] sm:hover:scale-105 /* Bahagyang scale down sa mobile hover */
      hover:-translate-y-1 sm:hover:-translate-y-2
      ${glow}
      cursor-pointer flex flex-col justify-between h-full`}
    >

      {/* BASE GLOW SHAPES - Pinaliit para sa responsive layout */}
      <div className="absolute top-0 right-0 w-20 h-20 sm:w-32 sm:h-32 bg-white/10 rounded-full blur-2xl"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-24 sm:h-24 bg-white/10 rounded-full blur-xl"></div>

      {/* EXTRA LIGHT OVERLAY */}
      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition duration-300 bg-white/5"></div>

      {/* TOP SECTION */}
      <div className="flex justify-between items-start mb-2 sm:mb-4 relative z-10">
        {/* ICON - Responsive Size */}
        <div className="shrink-0">
          <img src={icon} alt="icon" className="w-8 h-8 sm:w-10 sm:w-12 h-12" />
        </div>

        {/* BADGE - Dynamic text size */}
        <span className="text-[10px] sm:text-xs px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-white/20 font-bold tracking-wide">
          {badge}
        </span>
      </div>

      {/* TEXT CONTENT */}
      <div className="relative z-10">
        <h2 className="text-[10px] sm:text-xs md:text-sm opacity-90 tracking-wide font-medium">
          {title.toUpperCase()}
        </h2>

        <p className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight tracking-tight my-0.5 sm:my-1">
          {value}
        </p>

        <p className="text-[11px] sm:text-xs md:text-sm opacity-90 font-medium truncate">
          {subtitle}
        </p>
      </div>
    </div>
  );
}