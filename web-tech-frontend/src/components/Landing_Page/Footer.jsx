import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer
      className="text-white px-10 py-16"
      style={{
        background: "linear-gradient(90deg, #FF4063, #730015)",
      }}
    >
      {/* TOP SECTION */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* LEFT */}
        <div>
          <h2 className="text-xl font-bold mb-4">VELLA</h2>
          <p className="text-sm opacity-80 max-w-xs">
            Saving lives through smarter blood donation
            management and coordination.
          </p>
        </div>

        {/* MIDDLE */}
        <div>
          <h3 className="font-semibold mb-4">QUICK LINKS</h3>
          <ul className="space-y-2 text-sm opacity-80">
            <li><a href="#home">Home</a></li>
            <li><a href="#features">About</a></li>
            <li><a href="#drives">Donation Drives</a></li>
            <li><a href="#about">Donate</a></li>
          </ul>
        </div>

        {/* RIGHT */}
        <div>
          <h3 className="font-semibold mb-4">GET STARTED</h3>
          <ul className="space-y-2 text-sm opacity-80">
            <li><Link to="/register">Register as Donor</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><a href="#drives">Find a Drive</a></li>
          </ul>
        </div>

      </div>

      {/* LINE */}
      <div className="border-t border-white/20 mt-10 pt-6 flex flex-col md:flex-row justify-between text-xs opacity-80">
        
        <p>© 2026 VELLA. Developed by the VELLA TEAM</p>
        
        <p className="mt-2 md:mt-0">
          BUILT WITH CARE FOR LIFE-SAVING IMPACT
        </p>

      </div>
    </footer>
  );
}