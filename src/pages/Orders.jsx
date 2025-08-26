import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { AuthContext } from "../context/AuthContext"; 
import Title from "../components/Title";
import axios from "axios";

const Orders = () => {
  const { currency } = useContext(ShopContext);
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [cancellingOrderId, setCancellingOrderId] = useState(null);

  useEffect(() => {
    if (user?.id) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = () => {
    axios.get(`http://localhost:3000/users/${user.id}`)
      .then(res => {
        setOrders(res.data.orders || []);
      })
      .catch(err => console.error("Error fetching orders:", err));
  };

  const handleCancelOrder = async (orderId) => {
    setCancellingOrderId(orderId);
    try {
      // Update order status to "cancelled"
      const updatedOrders = orders.map(order => 
        order.id === orderId ? { ...order, status: "cancelled" } : order
      );

      // Update user data with cancelled order
      await axios.patch(`http://localhost:3000/users/${user.id}`, {
        orders: updatedOrders
      });

      // Update local state
      setOrders(updatedOrders);
      alert("Order cancelled successfully!");
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert("Failed to cancel order. Please try again.");
    } finally {
      setCancellingOrderId(null);
    }
  };

  const canCancelOrder = (order) => {
    // Allow cancellation only for pending orders (not shipped/delivered/cancelled)
    return order.status === "pending" || order.status === "processing";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "bg-yellow-500";
      case "processing": return "bg-blue-500";
      case "shipped": return "bg-purple-500";
      case "delivered": return "bg-green-500";
      case "cancelled": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending": return "Pending";
      case "processing": return "Processing";
      case "shipped": return "Shipped";
      case "delivered": return "Delivered";
      case "cancelled": return "Cancelled";
      default: return status;
    }
  };

  return (
    <div className="border-t pt-16 p-3">
      <div className="text-2xl">
        <Title text1={"MY"} text2={"ORDERS"} />
      </div>

      <div>
        {orders.length === 0 ? (
          <p className="text-gray-500 mt-4">No orders found</p>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="py-4 border-t border-b text-gray-700">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm text-gray-500">
                  Order ID: <span className="font-medium">{order.id}</span>
                </p>
                <p className="text-sm text-gray-500">
                  Date: <span className="text-gray-400">{new Date(order.orderDate).toDateString()}</span>
                </p>
              </div>

              {order.cart.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-3 border-t"
                >
                  <div className="flex items-start gap-6 text-sm">
                    <img className="w-16 sm:w-20" src={item.image || "/placeholder.png"} alt={item.name} />
                    <div>
                      <p className="sm:text-base font-medium">{item.name}</p>
                      <div className="flex items-center gap-3 mt-2 text-base text-gray-700">
                        <p className="text-lg">
                          {currency}{item.price}
                        </p>
                        <p>Quantity: {item.quantity}</p>
                        <p>Size: {item.size}</p>
                      </div>
                    </div>
                  </div>

                  <div className="md:w-1/2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-2">
                      <p className={`min-w-2 h-2 rounded-full ${getStatusColor(order.status)}`}></p>
                      <p className="text-sm md:text-base">{getStatusText(order.status)}</p>
                    </div>
                    
                    <div className="flex gap-2">
                      <button className="border px-4 py-2 text-sm font-medium rounded-sm hover:bg-gray-100">
                        Track order
                      </button>
                      
                      {canCancelOrder(order) && (
                        <button
                          onClick={() => handleCancelOrder(order.id)}
                          disabled={cancellingOrderId === order.id}
                          className="border border-red-500 text-red-500 px-4 py-2 text-sm font-medium rounded-sm hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {cancellingOrderId === order.id ? "Cancelling..." : "Cancel Order"}
                        </button>
                      )}
                      
                      {order.status === "cancelled" && (
                        <span className="text-red-500 text-sm px-4 py-2">Cancelled</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;