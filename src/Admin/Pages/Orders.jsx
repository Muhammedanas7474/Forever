import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FiRefreshCw,
  FiFilter,
  FiEye,
  FiTruck,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  // Fetch orders from backend (users -> orders)
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:3000/users");

      // Flatten orders from all users
      const allOrders = res.data.flatMap((user) =>
        user.orders && Array.isArray(user.orders)
          ? user.orders.map((order) => ({
              ...order,
              userId: user.id,
              userName: user.name,
              userEmail: user.email,
            }))
          : []
      );

      setOrders(allOrders);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId, newStatus, userId) => {
    try {
      const userRes = await axios.get(`http://localhost:3000/users/${userId}`);
      const user = userRes.data;

      const updatedOrders = user.orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      );

      await axios.put(`http://localhost:3000/users/${userId}`, {
        ...user,
        orders: updatedOrders,
      });

      fetchOrders();
    } catch (err) {
      console.error("Error updating order status:", err);
      alert("Error updating order status. Please try again.");
    }
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <FiRefreshCw className="inline mr-1" />;
      case "shipped":
        return <FiTruck className="inline mr-1" />;
      case "delivered":
        return <FiCheckCircle className="inline mr-1" />;
      case "cancelled":
        return <FiXCircle className="inline mr-1" />;
      default:
        return null;
    }
  };

  const filteredOrders =
    statusFilter === "all"
      ? orders
      : orders.filter((order) => order.status === statusFilter);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Order Management</h1>
        <button
          onClick={fetchOrders}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
        >
          <FiRefreshCw className="mr-2" /> Refresh Orders
        </button>
      </div>

      {/* Filter */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
        <div className="flex items-center">
          <FiFilter className="text-gray-500 mr-2" />
          <label className="mr-3 text-sm font-medium text-gray-700">
            Filter by Status:
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Items
              </th>
              <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="p-4">
                  <div className="text-sm font-medium text-gray-900">
                    #{order.id}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(order.orderDate).toLocaleDateString()}
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-sm font-medium text-gray-900">
                    {order.userName}
                  </div>
                  <div className="text-sm text-gray-500">{order.userEmail}</div>
                </td>
                <td className="p-4">
                  <div className="text-sm text-gray-900">
                    {order.cart.length} item
                    {order.cart.length !== 1 ? "s" : ""}
                  </div>
                  <div className="text-xs text-gray-500">
                    {order.cart.slice(0, 2).map((item, i) => (
                      <div key={i}>
                        {item.name} × {item.quantity}
                      </div>
                    ))}
                    {order.cart.length > 2 && (
                      <div>+{order.cart.length - 2} more</div>
                    )}
                  </div>
                </td>
                <td className="p-4 text-sm font-medium text-gray-900">
                  ${order.totalAmount.toFixed(2)}
                </td>
                <td className="p-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {getStatusIcon(order.status)}
                    {order.status}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => viewOrderDetails(order)}
                      className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-50"
                      title="View Details"
                    >
                      <FiEye size={18} />
                    </button>
                    <select
                      value={order.status}
                      onChange={(e) =>
                        updateOrderStatus(order.id, e.target.value, order.userId)
                      }
                      className="border border-gray-300 rounded-lg p-1 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="pending">Pending</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredOrders.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {statusFilter === "all"
              ? "No orders found"
              : `No ${statusFilter} orders found`}
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Order Details
                </h2>
                <button
                  onClick={() => setShowOrderDetails(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiXCircle size={24} />
                </button>
              </div>

              {/* Order Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Order ID
                  </h3>
                  <p className="text-gray-900">#{selectedOrder.id}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Order Date
                  </h3>
                  <p className="text-gray-900">
                    {new Date(selectedOrder.orderDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Customer
                  </h3>
                  <p className="text-gray-900">{selectedOrder.userName}</p>
                  <p className="text-gray-600 text-sm">
                    {selectedOrder.userEmail}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Status
                  </h3>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      selectedOrder.status
                    )}`}
                  >
                    {getStatusIcon(selectedOrder.status)}
                    {selectedOrder.status}
                  </span>
                </div>
              </div>

              {/* Address */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Shipping Address
                </h3>
                <div className="text-gray-900">
                  {selectedOrder.address.firstName}{" "}
                  {selectedOrder.address.lastName}
                  <br />
                  {selectedOrder.address.street}, {selectedOrder.address.city},{" "}
                  {selectedOrder.address.state} -{" "}
                  {selectedOrder.address.pincode}
                  <br />
                  {selectedOrder.address.country}
                  <br />
                  Phone: {selectedOrder.address.phone}
                </div>
              </div>

              {/* Order Items */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Order Items
                </h3>
                <div className="border rounded-lg">
                  {selectedOrder.cart.map((item, index) => (
                    <div
                      key={index}
                      className="p-3 border-b last:border-b-0 flex justify-between"
                    >
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          Quantity: {item.quantity}
                        </p>
                        {item.size && (
                          <p className="text-sm text-gray-500">
                            Size: {item.size}
                          </p>
                        )}
                      </div>
                      <p className="font-medium">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center border-t pt-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Total Amount
                  </h3>
                  <p className="text-xl font-bold text-gray-900">
                    ${selectedOrder.totalAmount.toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={() => setShowOrderDetails(false)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
