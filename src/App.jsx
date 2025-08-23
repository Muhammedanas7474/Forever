import { Routes, Route } from "react-router-dom";
import AdminRoutes from "./Admin/AdminRoutes";
import UserRoutes from "./routes/UserRouters";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        {/* public/user site */}
        <Route path="/*" element={<UserRoutes />} />

        {/* admin site (admin only) */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute adminOnly>
              <AdminRoutes />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}
