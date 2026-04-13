//DONATE NOW

import { Link } from "react-router-dom";
import heartIcon from "../../assets/icons/heartw.png";

export default function About() {
  return (
    <section
      id="about"
      className="
        py-24 px-10 text-center scroll-mt-20
      "
      style={{ backgroundColor: "#FFE5E6" }}
    >
      {/* SMALL TOP LINE */}
      <div className="w-12 h-1 bg-red-500 mx-auto mb-6 rounded-full"></div>

      {/* MAIN TEXT */}
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 font-poppins mb-4 mt-25">
        With VELLA, Saving Lives <br />
        <span className="text-[#DD003F]">
          is Just a Heartbeat Away.
        </span>
      </h2>

      {/* DESCRIPTION */}
      <p className="text-gray-600 max-w-2xl mx-auto mb-10 mt-15">
        Every donation can save a life. VELLA makes it simple to connect
        with those in need and take action when it matters most.
      </p>

      {/* BUTTON */}
      <Link to="/login">
        <button
          className="
            px-8 py-5 rounded-xl text-white font-medium
            text-white font-semibold
            bg-gradient-to-r from-[#FF6780] to-[#DD003F]
            flex items-center justify-center gap-2   /* 🔥 KEY FIX */
            shadow-lg shadow-pink-500/30
            hover:shadow-pink-500/60
            hover:scale-105
            transition duration-300
            mx-auto
          "
        >
        <img src={heartIcon} alt="heart" className="w-4 h-4" />
            Donate Now
        </button>
      </Link>
    </section>
    
  );
}

