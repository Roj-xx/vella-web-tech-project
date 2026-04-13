export default function BloodCard({ type, units }) {
  let status = "LOW";
  let border = "border-red-400";
  let textColor = "text-red-500";
  let badge = "bg-red-100 text-red-600";
  let glow = "hover:shadow-[0_15px_40px_rgba(239,68,68,0.35)]";

  if (units >= 15) {
    status = "HIGH";
    border = "border-green-400";
    textColor = "text-green-600";
    badge = "bg-green-100 text-green-700";
    glow = "hover:shadow-[0_15px_40px_rgba(16,185,129,0.35)]";
  } else if (units >= 5) {
    status = "NORMAL";
    border = "border-yellow-400";
    textColor = "text-orange-500";
    badge = "bg-yellow-100 text-yellow-700";
    glow = "hover:shadow-[0_15px_40px_rgba(245,158,11,0.35)]";
  }

  return (
    <div
      className={`bg-white p-5 rounded-2xl shadow-sm border ${border} relative font-inter
      transition-all duration-300 ease-out
      hover:scale-105 hover:-translate-y-2
      ${glow}
      cursor-pointer`}
    >

      {/* LIGHT OVERLAY */}
      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition duration-300 bg-black/5 rounded-2xl"></div>

      {/* TOP */}
      {/* ito bago div */}
      <div className="flex items-center mb-4 relative z-10 min-w-0">
        
        {/* BLOOD TYPE */}
        {/* ito bago div */}
        <div className="bg-gray-100 px-2 sm:px-3 py-1 rounded-lg font-semibold shrink min-w-0 truncate">
          {type}
        </div>

        {/* STATUS */}
        {/* ito bago span */}
        <span className={`ml-auto shrink-0 text-[10px] sm:text-xs px-2 sm:px-3 py-1 rounded-full font-medium whitespace-nowrap ${badge}`}>
          {status}
        </span>
      </div>

      {/* LABEL */}
      <p className="text-xs text-gray-400 uppercase tracking-wide relative z-10">
        Available Units
      </p>

      {/* VALUE */}
      <div className="flex items-baseline gap-1 mt-1 relative z-10">
        <p className={`text-3xl font-bold ${textColor}`}>{units}</p>
        <span className="text-gray-400 text-sm">units</span>
      </div>

      {/* DIVIDER */}
      <div className="border-t my-4 relative z-10"></div>

      {/* FOOTER */}
      <p className="text-xs text-gray-400 relative z-10">
        ⏱ Updated Apr {Math.floor(Math.random() * 10) + 1}
      </p>
    </div>
  );
}