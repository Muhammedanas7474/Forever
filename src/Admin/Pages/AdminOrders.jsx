import React, { useEffect, useState } from "react";
import {
  FiArrowLeft,
  FiEye,
  FiPackage,
  FiShoppingBag,
  FiUsers,
  FiCalendar,
  FiDollarSign,
  FiTruck,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiCreditCard,
  FiSearch,
  FiFilter,
  FiRefreshCw,
  FiChevronLeft,
  FiChevronRight
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import adminService from "../services/adminService";
import { toast } from "react-toastify";

const AdminOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch orders - USING CORRECT API CALL
  const fetchOrders = async (page = 1, search = "", status = "all") => {
    try {
      setLoading(true);
      setIsRefreshing(true);
      
      console.log("Fetching orders with:", { page, search, status });
      
      // Call your service correctly with separate parameters
      const res = await adminService.getOrders(
        page, 
        status === "all" ? "" : status, 
        search
      );
      
      console.log("Orders API Response:", res);
      
      // Handle Django REST Framework pagination response
      let ordersData = [];
      let totalCount = 0;
      let totalPagesCount = 1;
      
      if (res) {
        // Django paginated response structure
        if (res.results && Array.isArray(res.results)) {
          ordersData = res.results;
          totalCount = res.count || 0;
          totalPagesCount = res.total_pages || Math.ceil(totalCount / 10) || 1;
        } 
        // If response is directly an array
        else if (Array.isArray(res)) {
          ordersData = res;
          totalCount = res.length;
          totalPagesCount = 1;
        }
        // Fallback for other structures
        else {
          // Try to find any array in the response
          const arrayKeys = Object.keys(res).filter(key => Array.isArray(res[key]));
          if (arrayKeys.length > 0) {
            ordersData = res[arrayKeys[0]];
            totalCount = res.count || res.total || res.total_count || ordersData.length;
            totalPagesCount = res.total_pages || res.pages || Math.ceil(totalCount / 10) || 1;
          }
        }
      }
      
      console.log("Processed orders:", {
        ordersData,
        totalCount,
        totalPagesCount,
        currentPage: page
      });
      
      setOrders(ordersData);
      setFilteredOrders(ordersData);
      setTotalOrders(totalCount);
      setTotalPages(totalPagesCount);
      setCurrentPage(page);
      
      if (ordersData.length > 0) {
        toast.success(`Loaded ${ordersData.length} orders`);
      } else {
        toast.info("No orders found");
      }
      
    } catch (err) {
      console.error("GET ORDERS ERROR:", err);
      toast.error("Failed to load orders");
      setOrders([]);
      setFilteredOrders([]);
      setTotalOrders(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  // Handle status change
  const handleStatusChange = async (orderId, status) => {
    try {
      await adminService.updateOrderStatus(orderId, status);
      toast.success("Order status updated");
      
      // Update local state
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status } : order
      ));
      
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status });
      }
      
    } catch (err) {
      console.error("UPDATE ORDER ERROR:", err);
      toast.error("Failed to update status");
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch (e) {
      return dateString;
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount) return "$0.00";
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(parseFloat(amount));
    } catch (e) {
      return `$${amount}`;
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'processing': 'bg-blue-100 text-blue-800',
      'paid': 'bg-indigo-100 text-indigo-800',
      'shipped': 'bg-purple-100 text-purple-800',
      'delivered': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  // Get status icon
  const getStatusIcon = (status) => {
    const icons = {
      'pending': FiClock,
      'processing': FiPackage,
      'paid': FiCreditCard,
      'shipped': FiTruck,
      'delivered': FiCheckCircle,
      'cancelled': FiXCircle
    };
    return icons[status] || FiPackage;
  };

  // Get payment method icon
  const getPaymentMethodIcon = (method) => {
    return method === 'cod' ? FiDollarSign : FiCreditCard;
  };

  // Calculate total items in order
  const getTotalItems = (order) => {
    if (!order.items || !Array.isArray(order.items)) return 0;
    return order.items.reduce((total, item) => total + (item.quantity || 0), 0);
  };

  // Filter orders locally
  useEffect(() => {
    let filtered = orders;
    
    // Apply search filter locally
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.id?.toString().includes(searchTerm) ||
        order.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.status?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter locally
    if (statusFilter !== "all") {
      filtered = filtered.filter(order => order.status === statusFilter);
    }
    
    setFilteredOrders(filtered);
  }, [searchTerm, statusFilter, orders]);

  // Handle search
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  // Refresh orders
  const refreshOrders = () => {
    toast.info("Refreshing orders...");
    fetchOrders(1, searchTerm, statusFilter);
  };

  // Handle search submit (when Enter is pressed)
  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter') {
      fetchOrders(1, searchTerm, statusFilter);
    }
  };

  // Apply filters and fetch from server
  const applyFilters = () => {
    fetchOrders(1, searchTerm, statusFilter);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    fetchOrders(1);
  };

  // Pagination controls
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      fetchOrders(newPage, searchTerm, statusFilter);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      fetchOrders(newPage, searchTerm, statusFilter);
    }
  };

  // Go to specific page
  const goToPage = (pageNum) => {
    setCurrentPage(pageNum);
    fetchOrders(pageNum, searchTerm, statusFilter);
  };

  // Initial load
  useEffect(() => {
    fetchOrders(1);
  }, []);

  // Render loading
  if (loading && orders.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-indigo-600 rounded-full mb-4"></div>
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div className="mb-4 md:mb-0">
          <button 
            onClick={() => navigate("/admin/dashboard")} 
            className="flex items-center text-indigo-600 hover:text-indigo-800 mb-4"
          >
            <FiArrowLeft className="mr-2" /> Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Orders Management</h1>
          <p className="text-gray-600">Manage and track all customer orders</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={refreshOrders}
            disabled={isRefreshing}
            className={`p-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center ${
              isRefreshing ? 'opacity-70 cursor-not-allowed' : ''
            }`}
            title="Refresh Orders"
          >
            <FiRefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="ml-2 hidden md:inline">Refresh</span>
          </button>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-800">{totalOrders}</p>
            <p className="text-sm text-gray-600">Total Orders</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-6 border border-blue-100">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-100 text-blue-600 mr-4">
              <FiClock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending Orders</p>
              <p className="text-2xl font-bold text-gray-800">
                {orders.filter(o => o.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-6 border border-green-100">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-100 text-green-600 mr-4">
              <FiTruck className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Processing</p>
              <p className="text-2xl font-bold text-gray-800">
                {orders.filter(o => o.status === 'processing' || o.status === 'shipped').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl p-6 border border-purple-100">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-100 text-purple-600 mr-4">
              <FiCheckCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Delivered</p>
              <p className="text-2xl font-bold text-gray-800">
                {orders.filter(o => o.status === 'delivered').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-red-50 to-white rounded-xl p-6 border border-red-100">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-red-100 text-red-600 mr-4">
              <FiXCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Cancelled</p>
              <p className="text-2xl font-bold text-gray-800">
                {orders.filter(o => o.status === 'cancelled').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="relative w-full md:w-96">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Order ID, Customer, or Status..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={searchTerm}
              onChange={handleSearch}
              onKeyPress={handleSearchSubmit}
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <FiFilter className="text-gray-400 mr-2" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="paid">Paid</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <button
              onClick={applyFilters}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Apply Filters
            </button>
            {(searchTerm || statusFilter !== "all") && (
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left text-sm font-semibold text-gray-700">Order ID</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700">Customer</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700">Date</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700">Items</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700">Total Amount</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700">Payment</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => {
                  const StatusIcon = getStatusIcon(order.status);
                  const PaymentIcon = getPaymentMethodIcon(order.payment_method);
                  const totalItems = getTotalItems(order);
                  
                  return (
                    <tr key={order.id} className="border-t hover:bg-gray-50 group">
                      <td className="p-4">
                        <div className="font-semibold text-gray-800">#{order.id}</div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                            <FiUsers className="text-indigo-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{order.user_name || order.user?.username || "N/A"}</p>
                            <p className="text-sm text-gray-500">ID: {order.user}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center">
                          <FiCalendar className="text-gray-400 mr-2" />
                          <div>
                            <p className="text-sm text-gray-800">{formatDate(order.created_at)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center">
                          <FiPackage className="text-gray-400 mr-2" />
                          <div>
                            <p className="font-medium text-gray-800">{totalItems} items</p>
                            <p className="text-sm text-gray-500">
                              {order.items?.length || 0} products
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center">
                          <FiDollarSign className="text-green-500 mr-2" />
                          <p className="font-bold text-gray-800">{formatCurrency(order.total_amount)}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center">
                          <PaymentIcon className="text-purple-500 mr-2" />
                          <span className="capitalize font-medium">
                            {order.payment_method === 'cod' ? 'Cash on Delivery' : order.payment_method}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center w-fit ${getStatusColor(order.status)}`}>
                          <StatusIcon className="mr-1 h-3 w-3" />
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-2 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <FiEye className="h-4 w-4" />
                          </button>
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="paid">Paid</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-500">
                    <FiShoppingBag className="mx-auto text-4xl text-gray-300 mb-2" />
                    <p>No orders found</p>
                    {(searchTerm || statusFilter !== "all") && (
                      <p className="text-sm mt-1">Try adjusting your filters</p>
                    )}
                    <div className="mt-4 flex justify-center space-x-2">
                      <button
                        onClick={refreshOrders}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        Refresh Orders
                      </button>
                      {(searchTerm || statusFilter !== "all") && (
                        <button
                          onClick={clearFilters}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                          Clear Filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {!loading && filteredOrders.length > 0 && totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-600">
            Page {currentPage} of {totalPages} • Showing {filteredOrders.length} of {totalOrders} orders
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg transition-colors ${
                currentPage === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <FiChevronLeft className="w-5 h-5" />
            </button>
            
            <div className="flex space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => goToPage(pageNum)}
                    className={`px-3 py-1 rounded-lg transition-colors ${
                      currentPage === pageNum
                        ? "bg-indigo-600 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-lg transition-colors ${
                currentPage === totalPages
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <FiChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-5xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Order Details</h2>
                <p className="text-gray-600">Order #{selectedOrder.id}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Order Summary */}
              <div className="col-span-1 lg:col-span-2">
                <div className="bg-gradient-to-br from-indigo-50 to-white rounded-xl p-6 border border-indigo-100">
                  <h3 className="font-semibold text-lg mb-4">Order Summary</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">Customer Name</label>
                      <p className="font-medium">{selectedOrder.user_name || selectedOrder.user?.username || "N/A"}</p>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">Customer ID</label>
                      <p className="font-medium">#{selectedOrder.user}</p>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">Order Date</label>
                      <p className="font-medium">{formatDate(selectedOrder.created_at)}</p>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">Payment Method</label>
                      <div className="flex items-center">
                        {getPaymentMethodIcon(selectedOrder.payment_method)({
                          className: "text-purple-500 mr-2 h-4 w-4"
                        })}
                        <p className="font-medium capitalize">
                          {selectedOrder.payment_method === 'cod' ? 'Cash on Delivery' : selectedOrder.payment_method}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Order Items */}
                <div className="mt-6">
                  <h3 className="font-semibold text-lg mb-4">Order Items ({getTotalItems(selectedOrder)} items)</h3>
                  <div className="space-y-3">
                    {selectedOrder.items && selectedOrder.items.map((item, index) => (
                      <div key={item.id || index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                            <FiPackage className="text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{item.product_name}</p>
                            <div className="flex items-center mt-1">
                              <span className="text-sm text-gray-600 mr-3">Size: {item.size}</span>
                              <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-800">{formatCurrency(item.price)}</p>
                          <p className="text-sm text-gray-600">
                            Total: {formatCurrency(parseFloat(item.price) * (item.quantity || 1))}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Order Status & Actions */}
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-100">
                  <h3 className="font-semibold text-lg mb-4">Order Status</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-500 mb-2">Current Status</label>
                      <span className={`px-4 py-2 rounded-full text-sm font-medium flex items-center justify-center ${getStatusColor(selectedOrder.status)}`}>
                        {getStatusIcon(selectedOrder.status)({ className: "mr-2 h-4 w-4" })}
                        {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                      </span>
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-500 mb-2">Update Status</label>
                      <select
                        value={selectedOrder.status}
                        onChange={(e) => {
                          handleStatusChange(selectedOrder.id, e.target.value);
                          setSelectedOrder({...selectedOrder, status: e.target.value});
                        }}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="paid">Paid</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-6 border border-green-100">
                  <h3 className="font-semibold text-lg mb-4">Order Total</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">{formatCurrency(selectedOrder.total_amount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Items</span>
                      <span className="font-medium">{getTotalItems(selectedOrder)}</span>
                    </div>
                    <div className="flex justify-between pt-3 border-t border-gray-200">
                      <span className="font-semibold text-lg">Grand Total</span>
                      <span className="font-bold text-xl text-green-600">{formatCurrency(selectedOrder.total_amount)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Actions */}
            <div className="border-t pt-6">
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-6 py-3 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={refreshOrders}
                  className="px-6 py-3 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 rounded-lg font-medium transition-colors"
                >
                  <FiRefreshCw className="inline mr-2" />
                  Refresh Orders
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;