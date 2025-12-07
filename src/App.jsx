// App.jsx
import { Route, Routes, useLocation, Navigate, Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useContext } from "react";

import { AuthContext } from "./context/AuthContext";

// Public Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Products from "./pages/Products";
import Collection from "./pages/Collection ";
import Navbar from "./components/Navbar";

// User Protected Pages
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Orders from "./pages/Orders";
import PlaceOrder from "./pages/PlaceOrder";
import Settings from "./components/Settings";

// Admin Pages
import AdminLayout from "./Admin/AdminLayout";
import Dashboard from "./Admin/Pages/Dashboard";
import AdminProducts from "./Admin/Pages/Products";
import Customers from "./Admin/Pages/Customers";
import AdminOrders from "./Admin/Pages/AdminOrders";

// Not Found Page
import Notfound from "./routes/notfound";

// *******************************
// 🛡 PROTECTED ROUTE WRAPPER
// *******************************
const ProtectedRoute = ({ adminOnly = false }) => {
  const { user, isAdmin, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        Loading...
      </div>
    );
  }

  const storedUser = JSON.parse(localStorage.getItem("user") || "null");
  const currentUser = user || storedUser;
  const currentIsAdmin = isAdmin || (currentUser?.role === "admin");

  if (!currentUser) return <Navigate to="/login" replace />;
  if (adminOnly && !currentIsAdmin) return <Navigate to="/" replace />;

  return <Outlet />; // ⭐ Allow nested routes
};

export default function App() {
  const location = useLocation();
  const hideNavbar = location.pathname.startsWith("/admin");

  return (
    <>
      <ToastContainer position="top-center" autoClose={1500} />

      {!hideNavbar && <Navbar />}

      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/products/:productId" element={<Products />} />

        {/* USER PROTECTED ROUTES */}
        <Route element={<ProtectedRoute />}>
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/place-order" element={<PlaceOrder />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* ADMIN PROTECTED ROUTES */}
        <Route element={<ProtectedRoute adminOnly={true} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="customers" element={<Customers />} />
            <Route path="orders" element={<AdminOrders />} />
          </Route>
        </Route>

        {/* 404 NOT FOUND */}
        <Route path="*" element={<Notfound />} />
      </Routes>
    </>
  );
}
