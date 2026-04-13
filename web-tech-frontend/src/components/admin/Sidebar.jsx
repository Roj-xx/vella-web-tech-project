import logo from "../../assets/images/vella-logo-colored.png";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FiGrid, FiUsers, FiDroplet, FiCalendar,
  FiDatabase, FiSettings, FiLogOut,
} from "react-icons/fi";

const Sidebar = () => {
  const navigate = useNavigate();

  const menu = [
    { name: "Dashboard", icon: <FiGrid />, path: "/admin/dashboard" },
    { name: "Manage Donors", icon: <FiUsers />, path: "/admin/donors" },
    { name: "Request Blood", icon: <FiDroplet />, path: "/admin/requests" },
    { name: "Donation Drives", icon: <FiCalendar />, path: "/admin/drives" },
    { name: "Blood Inventory", icon: <FiDatabase />, path: "/admin/inventory" },
  ];

  return (
    <aside
      className="
        fixed left-0 top-0 h-screen
        w-[70px] md:w-[250px] lg:w-[280px]
        bg-[#F5F5F5]
        flex flex-col
        z-50 
        /* Inalis natin ang border-r para mas malinis ang curve, 
           at pinalitan ng shadow kung gusto mo, or retain border-r 
           pero kailangan rounded din ang border. */
        border-r border-gray-200
        
        /* DITO ANG PAGBABAGO: Rounded right side */
        rounded-r-[25px] md:rounded-r-[35px] 
        shadow-[10px_0_15px_-3px_rgba(0,0,0,0.07)]
        py-4 px-2 md:px-4
        overflow-hidden
      "
    >
      {/* 1. TOP: LOGO - Mas maliit na margin para makatipid sa space */}
      <div className="flex items-center gap-3 mb-6 shrink-0 justify-center md:justify-start">
        <img src={logo} alt="Vella" className="w-10 h-10 md:w-11 md:h-11 object-contain" />
        <div className="hidden md:block leading-tight">
          <h1 className="text-xl font-bold text-red-500">vella</h1>
          <p className="text-[10px] text-[#A50036] font-medium leading-none">Saving Lives</p>
        </div>
      </div>

      {/* 2. MIDDLE: MENU ITEMS - Gagamit ng 'flex-grow' pero hindi mag-ooverflow */}
      <div className="flex-1 flex flex-col justify-between overflow-hidden">
        
        {/* Main Menu */}
        <div className="space-y-1">
          <p className="hidden md:block text-[9px] font-bold text-gray-400 tracking-widest mb-2 uppercase px-2">
            Menu
          </p>
          {menu.map((item, i) => (
            <NavLink
              key={i}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 p-2.5 md:p-3 rounded-xl transition-all justify-center md:justify-start
                ${isActive 
                  ? "bg-gradient-to-r from-[#ff4d6d] to-[#e60023] text-white shadow-md" 
                  : "text-gray-600 hover:bg-gray-200"}
              `}
            >
              <span className="text-xl shrink-0">{item.icon}</span>
              <span className="hidden md:block font-medium text-sm truncate">
                {item.name}
              </span>
            </NavLink>
          ))}
        </div>

        {/* Account & Profile (Dikit sa baba pero parte ng main flex) */}
        <div className="space-y-4">
          <div>
            <p className="hidden md:block text-[9px] font-bold text-gray-400 tracking-widest mb-2 uppercase px-2">
              Account
            </p>
            <div className="space-y-1">
              <div className="flex items-center gap-3 p-2.5 md:p-3 text-gray-600 hover:bg-gray-200 rounded-xl cursor-pointer justify-center md:justify-start">
                <FiSettings className="text-xl shrink-0" />
                <span className="hidden md:block font-medium text-sm">Settings</span>
              </div>
              <div 
                onClick={() => navigate("/admin/login")}
                className="flex items-center gap-3 p-2.5 md:p-3 text-gray-600 hover:bg-gray-200 rounded-xl cursor-pointer justify-center md:justify-start"
              >
                <FiLogOut className="text-xl shrink-0" />
                <span className="hidden md:block font-medium text-sm">Logout</span>
              </div>
            </div>
          </div>

          {/* PROFILE CARD - Ginawang mas manipis para kumasya sa zoom */}
          <div className="bg-white p-2 rounded-xl shadow-sm flex items-center gap-2 justify-center md:justify-start border border-gray-100">
            <div className="w-8 h-8 bg-red-500 text-white flex items-center justify-center rounded-full font-bold shrink-0 text-xs">
              PA
            </div>
            <div className="hidden md:block overflow-hidden">
              <p className="font-bold text-gray-800 text-[11px] leading-tight truncate">PHO Admin</p>
              <p className="text-[9px] text-gray-500 truncate">Admin</p>
            </div>
          </div>
        </div>

      </div>
    </aside>
  );
};

export default Sidebar;