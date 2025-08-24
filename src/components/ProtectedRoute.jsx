import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, adminOnly = false, userOnly = false }) => {
  const { user, loading } = useContext(AuthContext);

  // 🔹 Wait until AuthContext finishes loading
  if (loading) {
    return <div className="flex items-center justify-center h-screen text-xl">
      Checking session...
    </div>;
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Blocked user
  if (user.isBlock) {
    return <Navigate to="/blocked" replace />;
  }

  // Admin-only routes
  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // User-only routes
  if (userOnly && user.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default ProtectedRoute;
