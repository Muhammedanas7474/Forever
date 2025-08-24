import { Routes, Route } from "react-router-dom";
import AdminRoutes from "./Admin/AdminRoutes";
import UserRoutes from "./routes/UserRouters";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "./components/ProtectedRoute";

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
            <ProtectedRoute adminOnly={true}>
              <AdminRoutes />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}
