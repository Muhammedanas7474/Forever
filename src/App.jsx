import { Routes, Route } from "react-router-dom";
import AdminRoutes from "./Admin/AdminRoutes";
import UserRoutes from "./routes/UserRouters";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";


export default function App() {
  return (
    <>
      <ToastContainer position="top-center" autoClose={1000} />
      <Navbar/>
      
      <Routes>  
        {/* Public routes */}
        {/* <Route path="/login" element={<Login />} /> */}
        <Route path="/" element={<Home/>}/>

        {/* USER SIDE (only for normal users) -----*/}
        <Route
          path="/*"
          element={
            <ProtectedRoute userOnly={true}>
              <UserRoutes />
            </ProtectedRoute>
          }
        />

        {/* ADMIN SIDE (only for admins) */}
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
