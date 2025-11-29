import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import api from "../../api";
import { toast } from "react-toastify";

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // ORDER API
  const orderAPI = {
    getOrders: async () => {
      const res = await api.get("order/");
      return res.data;
    },
    
    createCODOrder: async () => {
      const res = await api.post(
        "order/",
        { payment_method: "cod" },
        { withCredentials: true }
      );
      return res.data;
    },

    createRazorpayOrder: async () => {
      const res = await api.post(
        "order/razorpay/create/",
        {},
        { withCredentials: true }
      );
      return res.data;
    },

    verifyRazorpayPayment: async (paymentData) => {
      const res = await api.post(
        "order/razorpay/verify/",
        paymentData,
        { withCredentials: true }
      );
      return res.data;
    },

    cancelOrder: async (order_id) => {
      const res = await api.patch(
        `order/${order_id}/cancel/`,
        {},
        { withCredentials: true }
      );
      return res.data;
    }
  }; // Added missing closing brace for orderAPI

  useEffect(() => {
    if (user) loadOrders();
    else setOrders([]);
  }, [user]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await orderAPI.getOrders();
      setOrders(data);
    } catch (err) {
      console.error("Error loading orders:", err);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  // Create COD Order
  const createCODOrder = async () => {
    if (!user) {
      toast.error("Login to place order");
      throw new Error("User not logged in");
    }

    try {
      const order = await orderAPI.createCODOrder();
      toast.success("COD Order placed successfully!");
      await loadOrders(); // Added await to ensure orders are reloaded
      return order;
    } catch (err) {
      console.error("COD Order error:", err);
      const errorMessage = err.response?.data?.message || "Failed to place COD order";
      toast.error(errorMessage);
      throw err;
    }
  };

  // Create Razorpay Order
  const createRazorpayOrder = async () => {
    if (!user) {
      toast.error("Login to place order");
      throw new Error("User not logged in");
    }

    try {
      const razorpayData = await orderAPI.createRazorpayOrder();
      return razorpayData;
    } catch (err) {
      console.error("Razorpay order creation error:", err);
      const errorMessage = err.response?.data?.message || "Failed to create Razorpay order";
      toast.error(errorMessage);
      throw err;
    }
  };

  // Verify Razorpay Payment
  const verifyRazorpayPayment = async (paymentData) => {
    try {
      const order = await orderAPI.verifyRazorpayPayment(paymentData);
      toast.success("Payment successful! Order placed.");
      await loadOrders(); // Added await to ensure orders are reloaded
      return order;
    } catch (err) {
      console.error("Razorpay verification error:", err);
      const errorMessage = err.response?.data?.message || "Payment verification failed";
      toast.error(errorMessage);
      throw err;
    }
  };

  const cancelOrder = async (order_id) => {
    try {
      await orderAPI.cancelOrder(order_id);
      toast.info("Order cancelled");
      await loadOrders(); // Added await to ensure orders are reloaded
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.message || "Failed to cancel order";
      toast.error(errorMessage);
      throw err; // Added throw to handle error in calling component
    }
  };

  const getStatusDisplay = (status) => {
    switch (status) {
      case "pending":
        return { color: "bg-yellow-500", text: "Pending" };
      case "processing":
        return { color: "bg-blue-500", text: "Processing" };
      case "paid":
        return { color: "bg-green-500", text: "Paid" };
      case "shipped":
        return { color: "bg-purple-500", text: "Shipped" };
      case "delivered":
        return { color: "bg-green-500", text: "Delivered" };
      case "cancelled":
        return { color: "bg-red-500", text: "Cancelled" };
      case "refunded":
        return { color: "bg-orange-500", text: "Refunded" };
      default:
        return { color: "bg-gray-500", text: status };
    }
  };

  // Helper function to get order by ID
  const getOrderById = (orderId) => {
    return orders.find(order => order.id === orderId || order._id === orderId);
  };

  // Helper function to get orders by status
  const getOrdersByStatus = (status) => {
    return orders.filter(order => order.status === status);
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        loading,
        loadOrders,
        createCODOrder,
        createRazorpayOrder,
        verifyRazorpayPayment,
        cancelOrder,
        getStatusDisplay,
        getOrderById, // Added helper function
        getOrdersByStatus, // Added helper function
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};