import { createContext, useState, useContext } from "react";
import adminService from "../Admin/services/adminService";
import { toast } from "react-toastify";

export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  // Reusable handler wrapper
  const handleRequest = async (apiFunc, ...params) => {
    try {
      setLoading(true);
      const data = await apiFunc(...params);
      return data;
    } catch (error) {
      toast.error(error.message || "Something went wrong");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Dashboard
  const fetchDashboardStats = () =>
    handleRequest(adminService.getDashboardStats);

  // Users
  const fetchUsers = (page, search) =>
    handleRequest(adminService.getUsers, page, search);

  const updateUserBlockStatus = (userId, blocked) =>
    handleRequest(adminService.updateUserStatus, userId, blocked);

  // Products
  const fetchProducts = (page, search, category) =>
    handleRequest(adminService.getProducts, page, search, category);

  // Orders
  const fetchOrders = (page, status, search) =>
    handleRequest(adminService.getOrders, page, status, search);

  const updateOrder = (orderId, status) =>
    handleRequest(adminService.updateOrderStatus, orderId, status);

  const value = {
    loading,
    fetchDashboardStats,
    fetchUsers,
    updateUserBlockStatus,
    fetchProducts,
    fetchOrders,
    updateOrder,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};

export const useAdmin = () => useContext(AdminContext);
