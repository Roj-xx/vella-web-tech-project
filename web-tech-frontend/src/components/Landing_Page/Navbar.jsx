import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import logo from "../../assets/images/vella-logo.png";
import logoColor from "../../assets/images/vella-logo-colored.png";
import arrowIcon from "../../assets/icons/arrow_login.png";

export default function Navbar() {
  const [isDarkText, setIsDarkText] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const featuresSection = document.getElementById("features");
      const analyticsSection = document.getElementById("analytics");
      const drivesSection = document.getElementById("drives");

      const scrollPosition = window.scrollY + 120;

      // Simula Blood Donation Drives pababa = dark mode na lahat
      if (drivesSection && scrollPosition >= drivesSection.offsetTop) {
        setIsDarkText(true);
        return;
      }

      // Analytics = white
      if (analyticsSection) {
        const analyticsTop = analyticsSection.offsetTop;
        const analyticsBottom = analyticsTop + analyticsSection.offsetHeight;

        if (scrollPosition >= analyticsTop && scrollPosition < analyticsBottom) {
          setIsDarkText(false);
          return;
        }
      }

      // Features = dark
      if (featuresSection) {
        const featuresTop = featuresSection.offsetTop;
        const featuresBottom = featuresTop + featuresSection.offsetHeight;

        if (scrollPosition >= featuresTop && scrollPosition < featuresBottom) {
          setIsDarkText(true);
          return;
        }
      }

      // Default = Home/Hero white
      setIsDarkText(false);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const textColor = isDarkText ? "text-[#DE0541]" : "text-white";
  const linkColor = isDarkText ? "text-black" : "text-white";
  const burgerLineColor = isDarkText ? "bg-[#DE0541]" : "bg-white";

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 border-b border-white/20 bg-white/10 backdrop-blur-md transition-all duration-300 ${textColor}`}
    >
      <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-4 py-3 sm:px-6 md:px-8 lg:px-10">
        <div className="flex items-center gap-2 sm:gap-3">
          <img
            src={isDarkText ? logoColor : logo}
            alt="Vella Logo"
            className="h-10 w-10 object-contain transition-all duration-300 sm:h-11 sm:w-11 md:h-12 md:w-12"
          />
          <h1
            className={`text-2xl font-bold transition-colors duration-300 sm:text-[28px] md:text-3xl ${textColor}`}
            style={{ fontFamily: "Google Sans" }}
          >
            vella
          </h1>
        </div>

        {/* DESKTOP */}
        <div className="hidden lg:flex items-center gap-10">
          <div
            className={`flex gap-8 font-semibold transition-colors duration-300 ${linkColor}`}
            style={{ fontFamily: "Google Sans" }}
          >
            <a href="#home" className="hover:opacity-80 transition">
              Home
            </a>
            <a href="#features" className="hover:opacity-80 transition">
              About
            </a>
            <a href="#drives" className="hover:opacity-80 transition">
              Donation Drives
            </a>
            <a href="#about" className="hover:opacity-80 transition">
              Donate
            </a>
          </div>

          <Link to="/login">
            <button
              className="bg-white text-black px-5 py-2 rounded-full font-medium flex items-center gap-2 hover:bg-gray-100 transition"
              style={{ fontFamily: "Google Sans" }}
            >
              <img src={arrowIcon} alt="" className="w-5 h-5" />
              Login
            </button>
          </Link>
        </div>

        {/* MOBILE RIGHT SIDE: LOGIN + BURGER */}
        <div className="flex items-center gap-2 lg:hidden">
          <Link to="/login">
            <button
              className="bg-white text-black px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-gray-100 transition whitespace-nowrap"
              style={{ fontFamily: "Google Sans" }}
            >
              <img src={arrowIcon} alt="" className="w-4 h-4" />
              Login
            </button>
          </Link>

          <button
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className={`
              flex h-11 w-11 items-center justify-center rounded-full
              border transition-all duration-200
              active:scale-95 active:bg-white/20
              ${isDarkText ? "bg-white/70 border-[#DE0541]/20" : "bg-white/10 border-white/20"}
            `}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            <div className="relative h-5 w-5">
              <span
                className={`absolute left-0 top-0 h-[2px] w-5 rounded-full transition-all duration-300 ${burgerLineColor} ${
                  isMenuOpen ? "translate-y-[9px] rotate-45" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-[9px] h-[2px] w-5 rounded-full transition-all duration-300 ${burgerLineColor} ${
                  isMenuOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 top-[18px] h-[2px] w-5 rounded-full transition-all duration-300 ${burgerLineColor} ${
                  isMenuOpen ? "-translate-y-[9px] -rotate-45" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* MOBILE MENU: LINKS ONLY */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ${
          isMenuOpen ? "max-h-[260px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 pb-4 sm:px-6">
          <div className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md shadow-lg">
            <div
              className={`flex flex-col py-3 ${linkColor}`}
              style={{ fontFamily: "Google Sans" }}
            >
              <a
                href="#home"
                onClick={closeMenu}
                className="px-5 py-3 text-sm font-semibold hover:bg-white/10 transition"
              >
                Home
              </a>
              <a
                href="#features"
                onClick={closeMenu}
                className="px-5 py-3 text-sm font-semibold hover:bg-white/10 transition"
              >
                About
              </a>
              <a
                href="#drives"
                onClick={closeMenu}
                className="px-5 py-3 text-sm font-semibold hover:bg-white/10 transition"
              >
                Donation Drives
              </a>
              <a
                href="#about"
                onClick={closeMenu}
                className="px-5 py-3 text-sm font-semibold hover:bg-white/10 transition"
              >
                Donate
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

