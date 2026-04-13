import Navbar from "../components/Landing_Page/Navbar";
import Hero from "../components/Landing_Page/Hero";
import Features from "../components/Landing_Page/Features";
import Drives from "../components/Landing_Page/Drives";
import About from "../components/Landing_Page/About";
import Footer from "../components/Landing_Page/Footer";

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function Landing() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <Drives />
      <About />
      <Footer />
    </>
  );
}