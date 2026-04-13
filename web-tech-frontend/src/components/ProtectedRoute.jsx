import { Navigate } from "react-router-dom";
import { getStoredToken, getStoredUser } from "../utils/auth";

export default function ProtectedRoute({ children, allowedRole }) {
  const token = getStoredToken();
  const user = getStoredUser();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/login" replace />;
  }

  return children;
}