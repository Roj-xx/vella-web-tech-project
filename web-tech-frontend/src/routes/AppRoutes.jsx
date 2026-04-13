import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";

// PUBLIC
import Landing from "../pages/Landing.jsx";
import Login from "../pages/Login.jsx";

// USER
import Home from "../pages/User/Home.jsx";
import Register from "../pages/User/Register.jsx";
import Requests from "../pages/User/Requests.jsx";
import Drives from "../pages/User/Drives.jsx";
import Profile from "../pages/User/Profile.jsx";
import UserLogin from "../pages/User/UserLogin";

// ADMIN
import AdminLogin from "../pages/Admin/AdminLogin.jsx";
import AdminLayout from "../components/admin/AdminLayout";
import Dashboard from "../pages/Admin/Dashboard.jsx";
import ManageDonors from "../pages/Admin/ManageDonors.jsx";
import RequestBlood from "../pages/Admin/RequestBlood.jsx";
import BloodRequestDetails from "../pages/Admin/BloodRequestDetails.jsx";
import BloodInventory from "../pages/Admin/BloodInventory.jsx";
import DonationDrives from "../pages/Admin/DonationDrives.jsx";
import DonationDriveDetails from "../pages/Admin/DonationDriveDetails.jsx";

export default function AppRoutes() {
  return (
    <Routes>

      {/* PUBLIC */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/user/login" element={<UserLogin />} />
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* USER PROTECTED */}
      <Route
        path="/home"
        element={
          <ProtectedRoute allowedRole="user">
            <Home />
          </ProtectedRoute>
        }
      />

      <Route
        path="/requests"
        element={
          <ProtectedRoute allowedRole="user">
            <Requests />
          </ProtectedRoute>
        }
      />

      <Route
        path="/drives"
        element={
          <ProtectedRoute allowedRole="user">
            <Drives />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute allowedRole="user">
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* ADMIN PROTECTED */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRole="pho_admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="donors" element={<ManageDonors />} />

        <Route path="drives">
          <Route index element={<DonationDrives />} />
          <Route path=":id" element={<DonationDriveDetails />} />
        </Route>

        <Route path="requests">
          <Route index element={<RequestBlood />} />
          <Route path=":id" element={<BloodRequestDetails />} />
        </Route>

        <Route path="inventory" element={<BloodInventory />} />
      </Route>

    </Routes>
  );
}