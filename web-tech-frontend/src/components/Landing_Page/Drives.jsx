import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import api from "../../services/api";

import coverImage from "../../assets/images/cover.png";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";
const BACKEND_ORIGIN = API_URL.replace("/api/v1", "");

const imageModules = import.meta.glob(
  "../../assets/images/drives/*.png",
  { eager: true, import: "default" }
);

const sortedImages = Object.entries(imageModules)
  .sort(([a], [b]) => {
    const getNum = (path) =>
      Number(path.match(/\/(\d+)\.png$/)?.[1] || 0);
    return getNum(a) - getNum(b);
  })
  .map(([, src]) => src);

const topRow = sortedImages.slice(0, 19);
const bottomRow = sortedImages.slice(19, 38);

export default function Drives() {
  const [upcomingDrives, setUpcomingDrives] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUpcomingDrives = async () => {
      try {
        const response = await api.get("/public/upcoming-drives");
        setUpcomingDrives(response.data.data || []);
      } catch (error) {
        console.error("Failed to fetch upcoming donation drives:", error);
      }
    };

    fetchUpcomingDrives();
  }, []);

  return (
    <>
      {/* ================= CAROUSEL ================= */}
      <section
        id="drives"
        className="bg-[#F5F5F5] py-24 overflow-hidden scroll-mt-24"
      >
        <div className="text-center mb-10 px-6">
          <h2 className="text-3xl md:text-5xl font-bold text-[#1F2937]">
            <span className="text-[#F04444]">Blood Donation</span> Drives
          </h2>
          <p className="text-gray-500 mt-2 text-sm md:text-base">
            Showcasing real community participation across the province.
          </p>
        </div>

        <div className="space-y-5">
          <CarouselRow images={topRow} direction="left" />
          <CarouselRow images={bottomRow} direction="right" />
        </div>
      </section>

      {/* ================= UPCOMING DRIVES ================= */}
      <section id="upcoming" className="bg-[#FCE7E7] py-24 px-6 md:px-10">
        <div className="text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-[#1F2937]">
            Upcoming <span className="text-[#F04444]">Donation Drives</span>
          </h2>
          <p className="text-gray-500 mt-2 text-sm md:text-base">
            Join our upcoming blood donation events and make a difference
          </p>
        </div>

        <div className="mt-12 max-w-6xl mx-auto">
          {upcomingDrives.length === 0 ? (
            <div className="text-center text-gray-500 py-20">
              No upcoming donation drives available right now.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingDrives.map((drive) => {
                const registered = drive.registered || 0;
                const maxParticipants = drive.maxParticipants || 0;

                const percentage =
                  maxParticipants > 0
                    ? Math.round((registered / maxParticipants) * 100)
                    : 0;

                const rawImage =
                  drive.image ||
                  drive.imageURL ||
                  drive.imageUrl ||
                  "";

                const image = rawImage
                  ? rawImage.startsWith("http")
                    ? rawImage
                    : `${BACKEND_ORIGIN}${rawImage}`
                  : coverImage;

                return (
                  <div
                    key={drive._id}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                  >
                    <img
                      src={image}
                      alt={drive.title}
                      className="w-full h-40 object-cover"
                      onError={(e) => {
                        e.target.src = coverImage;
                      }}
                    />

                    <div className="p-5 space-y-4">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-600">
                        {drive.status || "Upcoming"}
                      </span>

                      <h3 className="text-lg font-semibold text-gray-900">
                        {drive.title || "Untitled Drive"}
                      </h3>

                      <div className="text-sm text-gray-500">
                        📍 {drive.location || "No location"}
                      </div>

                      <div className="text-sm text-gray-500">
                        📅 {drive.date || "No date"} • {drive.time || "No time"}
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>
                            {registered} / {maxParticipants}
                          </span>
                          <span>{percentage}%</span>
                        </div>

                        <div className="w-full bg-gray-200 h-2 rounded-full">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          const token = localStorage.getItem("token");
                          navigate(token ? "/home" : "/login");
                        }}
                        className="w-full bg-green-500 text-white py-2 rounded-xl text-sm font-medium hover:bg-green-600 transition"
                      >
                        Join
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ================= INSIGHTS ================= */}
      <section
        id="insights"
        className="relative bg-[#F5F5F5] py-24 px-6 md:px-10 overflow-hidden"
      >
        {/* bubbles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <span className="insight-bubble bubble-1"></span>
          <span className="insight-bubble bubble-2"></span>
          <span className="insight-bubble bubble-3"></span>
          <span className="insight-bubble bubble-4"></span>
          <span className="insight-bubble bubble-5"></span>
          <span className="insight-bubble bubble-6"></span>
        </div>

        <div className="relative z-10 text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-[#1F2937]">
            <span className="text-[#F04444]">Blood Insights</span> in the Philippines
          </h2>
          <p className="text-gray-500 mt-2 text-sm md:text-base">
            Understanding the importance of blood donation.
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
          {[
            "A single blood donation can save up to three lives, making every donor a real-life hero in someone’s story.",
            "Blood cannot be manufactured, which is why voluntary donors remain the only source of life-saving blood.",
            "Red blood cells only last for about 42 days, making regular blood donation essential to maintain supply.",
            "Every two seconds, someone somewhere needs blood for emergencies, surgeries, childbirth, or serious medical treatments.",
            "A healthy blood supply is critical for hospitals to respond quickly to accidents, disasters, and life-threatening conditions at any time.",
            "Blood donation not only helps patients in need, but also strengthens the spirit of community by turning compassion into immediate action.",
          ].map((text, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-sm"
            >
              <div className="w-3 h-3 bg-[#F04444] mb-4 rounded-full insight-dot"></div>
              <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                {text}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function CarouselRow({ images, direction = "left" }) {
  const loopImages = [...images, ...images];

  return (
    <div className="overflow-hidden">
      <div
        className={`flex w-max gap-6 ${
          direction === "left"
            ? "animate-drives-left"
            : "animate-drives-right"
        }`}
      >
        {loopImages.map((src, index) => (
          <div
            key={`${direction}-${index}`}
            className="drives-card group shrink-0 w-[210px] md:w-[250px] lg:w-[270px]"
          >
            <img
              src={src}
              alt="drive"
              className="drives-image"
              draggable="false"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

