import { useNavigate } from "react-router-dom";

import logo from "../../assets/images/vella-logo-big.png";
import fbIcon from "../../assets/icons/fb.png";
import twitterIcon from "../../assets/icons/twitter.png";
import igIcon from "../../assets/icons/insta.png";
import linkedinIcon from "../../assets/icons/linkedin.png";

export default function Footer() {
  const navigate = useNavigate();

  return (
    <div className="mt-16">

      {/* 🔥 MAIN FOOTER */}
      <div
        className="text-white px-4 sm:px-6 md:px-10 py-10 md:py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        style={{
          background: "linear-gradient(90deg, #FF4B5C 0%, #A50036 100%)",
        }}
      >
        {/* LEFT */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <img
              src={logo}
              alt="vella logo"
              className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
            />
            <h2 className="text-xl sm:text-2xl font-bold">vella</h2>
          </div>

          <p className="text-sm opacity-90 mb-3">
            Saving Lives is Just a Heartbeat Away.
          </p>

          <p className="text-xs opacity-70 italic">
            Every drop counts. Every donor matters.
          </p>
        </div>

        {/* NAVIGATE */}
        <div>
          <h3 className="font-semibold mb-3">Navigate</h3>
          <ul className="space-y-2 text-sm opacity-90">
            <li onClick={() => navigate("/home")} className="cursor-pointer hover:underline">
              Home
            </li>
            <li onClick={() => navigate("/requests")} className="cursor-pointer hover:underline">
              Blood Requests
            </li>
            <li onClick={() => navigate("/drives")} className="cursor-pointer hover:underline">
              Donation Drives
            </li>
          </ul>
        </div>

        {/* SUPPORT */}
        <div>
          <h3 className="font-semibold mb-3">Support</h3>
          <ul className="space-y-2 text-sm opacity-90">
            <li className="hover:underline cursor-pointer">Help Center</li>
            <li className="hover:underline cursor-pointer">FAQs</li>
            <li className="hover:underline cursor-pointer">Contact Us</li>
            <li className="hover:underline cursor-pointer">Privacy Policy</li>
            <li className="hover:underline cursor-pointer">Terms of Service</li>
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h3 className="font-semibold mb-3">Get in Touch</h3>

          <p className="text-sm opacity-90 mb-2">
            📧 support@vella.com
          </p>

          <p className="text-sm opacity-90 mb-4">
            📞 +1 (234) 567-890
          </p>

          <p className="text-sm mb-2">Follow Us</p>

          <div className="flex gap-3 flex-wrap">

            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center cursor-pointer hover:bg-white/30 transition">
              <img src={fbIcon} alt="facebook" className="w-4 h-4" />
            </div>

            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center cursor-pointer hover:bg-white/30 transition">
              <img src={twitterIcon} alt="twitter" className="w-4 h-4" />
            </div>

            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center cursor-pointer hover:bg-white/30 transition">
              <img src={igIcon} alt="instagram" className="w-4 h-4" />
            </div>

            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center cursor-pointer hover:bg-white/30 transition">
              <img src={linkedinIcon} alt="linkedin" className="w-4 h-4" />
            </div>

          </div>
        </div>
      </div>

      {/* 🔥 BOTTOM BAR */}
      <div className="bg-gray-200 text-gray-600 text-xs px-4 sm:px-6 md:px-10 py-3 flex flex-col sm:flex-row justify-between items-center gap-2 text-center sm:text-left">
        <p>© 2026 VELLA. Developed by the VELLA TEAM</p>
        <p className="opacity-70">
          BUILT WITH CARE FOR LIFE-SAVING IMPACT
        </p>
      </div>

    </div>
  );
}