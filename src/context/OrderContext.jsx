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
      const res = await api.post("order/", {
        payment_method: "cod"
      });
      return res.data;
    },
    
    createRazorpayOrder: async () => {
      const res = await api.post("order/razorpay/create/");
      return res.data;
    },
    
    verifyRazorpayPayment: async (paymentData) => {
      const res = await api.post("order/razorpay/verify/", paymentData);
      return res.data;
    },
    
    cancelOrder: async (order_id) => {
      const res = await api.patch(`order/${order_id}/cancel/`);
      return res.data;
    }
  };

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
      loadOrders();
      return order;
    } catch (err) {
      console.error("COD Order error:", err);
      toast.error("Failed to place COD order");
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
      toast.error("Failed to create Razorpay order");
      throw err;
    }
  };

  // Verify Razorpay Payment
  const verifyRazorpayPayment = async (paymentData) => {
    try {
      const order = await orderAPI.verifyRazorpayPayment(paymentData);
      toast.success("Payment successful! Order placed.");
      loadOrders();
      return order;
    } catch (err) {
      console.error("Razorpay verification error:", err);
      toast.error("Payment verification failed");
      throw err;
    }
  };

  const cancelOrder = async (order_id) => {
    try {
      await orderAPI.cancelOrder(order_id);
      toast.info("Order cancelled");
      loadOrders();
    } catch (err) {
      console.error(err);
      toast.error("Failed to cancel order");
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
      default:
        return { color: "bg-gray-500", text: status };
    }
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
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};