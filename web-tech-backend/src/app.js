const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const donorRoutes = require("./routes/donorRoutes");
const requestRoutes = require("./routes/requestRoutes");
const driveRoutes = require("./routes/driveRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const publicRoutes = require("./routes/publicRoutes");
const { protect, authorize } = require("./middleware/authMiddleware");

const app = express();

const BASE_URI = process.env.BASE_URI || "/api/v1";

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

// middleware
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// basic routes
app.get("/", (req, res) => {
  res.send("VELLA API is running...");
});

app.get(`${BASE_URI}/test`, (req, res) => {
  res.status(200).json({
    message: "API test route is working",
  });
});

// api routes
app.use(`${BASE_URI}/auth`, authRoutes);
app.use(`${BASE_URI}/donors`, donorRoutes);
app.use(`${BASE_URI}/requests`, requestRoutes);
app.use(`${BASE_URI}/drives`, driveRoutes);
app.use(`${BASE_URI}/inventory`, inventoryRoutes);
app.use(`${BASE_URI}/dashboard`, dashboardRoutes);
app.use(`${BASE_URI}/public`, publicRoutes);

// protected test
app.get(`${BASE_URI}/protected`, protect, (req, res) => {
  res.json({
    message: "Protected route accessed",
    user: req.user,
  });
});

// admin test
app.get(`${BASE_URI}/admin`, protect, authorize("pho_admin"), (req, res) => {
  res.json({
    message: "Admin route accessed",
  });
});

module.exports = app;