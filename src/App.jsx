import { Routes, Route, useLocation } from "react-router-dom";
import AdminRoutes from "./Admin/AdminRoutes";
import UserRoutes from "./routes/UserRouters";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";

export default function App() {
  const location = useLocation();

  // Hide navbar if route starts with /admin
  const hideNavbar = location.pathname.startsWith("/admin");

  return (
    <>
      <ToastContainer position="top-center" autoClose={1500} />

      {!hideNavbar && <Navbar />}

      <Routes>
        {/* PUBLIC ROUTE */}
        <Route path="/" element={<Home />} />

        {/* USER ROUTES */}
        <Route
          path="/*"
          element={
            <ProtectedRoute userOnly={true}>
              <UserRoutes />
            </ProtectedRoute>
          }
        />

        {/* ADMIN ROUTES */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminRoutes />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}
