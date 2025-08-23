import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import Dashboard from "./Pages/Dashboard";
import Products from "./Pages/Products";
import Customers from "./Pages/Customers";
import Orders from "./Pages/Orders";
import Analytics from "./Pages/Analytics";
import Settings from "./Pages/Settings";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard/>} />
        <Route path="products" element={<Products/>}/>
        <Route path="customers" element={<Customers/>}/>
        <Route path="orders" element={<Orders/>}/>
        <Route path="analytics" element={<Analytics/>}/>
        <Route path="settings" element={<Settings/>}/>
      </Route>
    </Routes>
  );
};

export default AdminRoutes;