import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, adminOnly = false, userOnly = false }) => {
  const { user } = useContext(AuthContext);

  // If not logged in → go to login
  // if (!user) {
  //   return <Navigate to="/" replace />;
  // }

  // If blocked user
  // if (user.isBlock) {
  //   return <Navigate to="/blocked" replace />;
  // }

  // // ✅ Only admins allowed
  // if (adminOnly && user.role !== "admin") {
  //   return <Navigate to="/" replace />; // send non-admins to home
  // }

  // // ✅ Only normal users allowed
  // if (userOnly && user.role !== "user") {
  //   return <Navigate to="/admin" replace />; // send admins to admin dashboard
  // }

  // ✅ Allowed → render children
  return children;
};

export default ProtectedRoute;
