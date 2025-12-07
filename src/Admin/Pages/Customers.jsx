import React, { useEffect, useState } from "react";
import {
  FiUsers,
  FiSearch,
  FiTrash2,
  FiLock,
  FiUnlock,
  FiEye,
  FiChevronLeft,
  FiChevronRight,
  FiShoppingBag,
  FiShoppingCart,
  FiDollarSign,
  FiCalendar,
  FiPackage,
  FiCheckCircle,
  FiClock,
  FiTruck,
  FiXCircle
} from "react-icons/fi";
import adminService from "../services/adminService";
import { toast } from "react-toastify";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [customerOrders, setCustomerOrders] = useState([]);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  
  // Sorting state
  const [sortConfig, setSortConfig] = useState({
    key: 'id',
    direction: 'desc'
  });

  // Tab state for customer details modal
  const [activeTab, setActiveTab] = useState('details');

  // Fetch users from Django backend
  const fetchCustomers = async (page = 1, search = "") => {
    try {
      setIsLoading(true);
      const response = await adminService.getUsers(page, search);
      
      setCustomers(response.results || []);
      setFilteredCustomers(response.results || []);
      setTotalUsers(response.total_users || 0);
      setTotalPages(response.total_pages || 1);
      setCurrentPage(response.current_page || page);
      
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching customers:", err);
      toast.error("Failed to load customers");
      setIsLoading(false);
    }
  };

  // Fetch customer orders
  const fetchCustomerOrders = async (customerId) => {
    try {
      setIsLoadingOrders(true);
      // You need to implement this function in adminService
      const response = await adminService.getUserOrders(customerId);
      setCustomerOrders(response.orders || response || []);
      setIsLoadingOrders(false);
    } catch (err) {
      console.error("Error fetching customer orders:", err);
      toast.error("Failed to load customer orders");
      setIsLoadingOrders(false);
      // Mock data for demonstration
      setCustomerOrders(getMockOrders());
    }
  };

  // Mock data for orders (remove when backend is ready)
  const getMockOrders = () => {
    if (!selectedCustomer) return [];
    
    return [
      {
        id: `ORD-${selectedCustomer.id}001`,
        date: "2025-11-29T12:35:55.395878Z",
        status: "delivered",
        total: "399.00",
        items: [
          { product_name: "Premium Shirt", quantity: 2, price: "99.50" },
          { product_name: "Casual Pants", quantity: 1, price: "200.00" }
        ]
      },
      {
        id: `ORD-${selectedCustomer.id}002`,
        date: "2025-11-28T10:20:30.123456Z",
        status: "pending",
        total: "150.00",
        items: [
          { product_name: "T-Shirt", quantity: 3, price: "50.00" }
        ]
      }
    ];
  };

  useEffect(() => {
    fetchCustomers(currentPage, searchTerm);
  }, [currentPage]);

  // Handle search input with debounce
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
    
    const timeoutId = setTimeout(() => {
      fetchCustomers(1, value);
    }, 500);
    
    return () => clearTimeout(timeoutId);
  };

  // Handle sorting
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    
    const sorted = [...filteredCustomers].sort((a, b) => {
      const aValue = a[key] || 0;
      const bValue = b[key] || 0;
      
      if (aValue < bValue) {
        return direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    
    setFilteredCustomers(sorted);
  };

  // View customer details
  const handleViewCustomerDetails = async (customer) => {
    setSelectedCustomer(customer);
    setActiveTab('details');
    // Clear previous orders
    setCustomerOrders([]);
  };

  // View customer orders
  const handleViewCustomerOrders = async (customer) => {
    setSelectedCustomer(customer);
    setActiveTab('orders');
    // Fetch customer orders
    await fetchCustomerOrders(customer.id);
  };

  const handleDeleteCustomer = async (id) => {
    if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      try {
        await adminService.deleteUser(id);
        toast.success("User deleted successfully");
        fetchCustomers(currentPage, searchTerm);
        if (selectedCustomer && selectedCustomer.id === id) {
          setSelectedCustomer(null);
        }
      } catch (err) {
        console.error("Error deleting user:", err);
        toast.error("Failed to delete user");
      }
    }
  };

  const toggleBlockCustomer = async (customer) => {
    try {
      await adminService.updateUserStatus(customer.id, !customer.blocked);
      toast.success(`User ${!customer.blocked ? 'blocked' : 'unblocked'} successfully`);
      fetchCustomers(currentPage, searchTerm);
      if (selectedCustomer && selectedCustomer.id === customer.id) {
        setSelectedCustomer({...selectedCustomer, blocked: !customer.blocked});
      }
    } catch (err) {
      console.error("Error updating block status:", err);
      toast.error("Failed to update user status");
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount) return "$0.00";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(parseFloat(amount));
  };

  // Get status color
  const getStatusColor = (status) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'processing': 'bg-blue-100 text-blue-800',
      'shipped': 'bg-purple-100 text-purple-800',
      'delivered': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800',
      'paid': 'bg-indigo-100 text-indigo-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  // Get status icon
  const getStatusIcon = (status) => {
    const icons = {
      'pending': FiClock,
      'processing': FiPackage,
      'shipped': FiTruck,
      'delivered': FiCheckCircle,
      'cancelled': FiXCircle,
      'paid': FiDollarSign
    };
    return icons[status] || FiPackage;
  };

  // Get activity status color
  const getActivityColor = (lastOrder) => {
    if (!lastOrder) return "gray";
    const lastOrderDate = new Date(lastOrder);
    const now = new Date();
    const diffDays = Math.floor((now - lastOrderDate) / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 7) return "green";
    if (diffDays <= 30) return "blue";
    if (diffDays <= 90) return "yellow";
    return "red";
  };

  // Get activity status text
  const getActivityStatus = (lastOrder, ordersCount) => {
    if (ordersCount === 0) return "New";
    if (!lastOrder) return "Never Ordered";
    
    const lastOrderDate = new Date(lastOrder);
    const now = new Date();
    const diffDays = Math.floor((now - lastOrderDate) / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 7) return "Active";
    if (diffDays <= 30) return "Recent";
    if (diffDays <= 90) return "Occasional";
    return "Inactive";
  };

  // Pagination controls
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Sort indicator
  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Customer Management
          </h1>
          <p className="text-gray-600">
            Total {totalUsers} users • Page {currentPage} of {totalPages}
          </p>
        </div>
        <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by username, email, or ID..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left text-sm font-semibold text-gray-700">ID</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700">Customer</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700">Joined Date</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700">Orders</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700">Cart Items</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700">Total Spent</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700">Last Activity</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((c) => (
                  <tr key={c.id} className="border-t hover:bg-gray-50 group">
                    <td className="p-4 text-sm font-medium text-gray-600">#{c.id}</td>
                    <td className="p-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-full flex items-center justify-center mr-3">
                          <FiUsers className="text-indigo-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{c.username || "N/A"}</p>
                          <p className="text-sm text-gray-500">{c.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm">
                      <div className="text-gray-600">{formatDate(c.date_joined)}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center">
                        <div className="p-2 rounded-lg bg-blue-50 text-blue-600 mr-2">
                          <FiShoppingBag className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-semibold">{c.orders_count || 0}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center">
                        <div className="p-2 rounded-lg bg-green-50 text-green-600 mr-2">
                          <FiShoppingCart className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-semibold">{c.cart_items_count || 0}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center">
                        <div className="p-2 rounded-lg bg-purple-50 text-purple-600 mr-2">
                          <FiDollarSign className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">
                            {formatCurrency(c.total_spent)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center">
                        <div className="p-2 rounded-lg bg-gray-50 text-gray-600 mr-2">
                          <FiCalendar className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">
                            {c.last_order ? formatDate(c.last_order) : 'Never'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 text-xs rounded-full font-medium ${
                          c.blocked
                            ? "bg-red-100 text-red-700"
                            : c.orders_count > 0
                            ? "bg-green-100 text-green-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {c.blocked ? "Blocked" : 
                         c.orders_count > 0 ? "Customer" : "Registered"}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewCustomerDetails(c)}
                          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <FiEye />
                        </button>
                        <button
                          onClick={() => handleViewCustomerOrders(c)}
                          className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
                          title="View Orders"
                        >
                          <FiShoppingBag />
                        </button>
                        <button
                          onClick={() => toggleBlockCustomer(c)}
                          className={`p-2 rounded-lg transition-colors ${
                            c.blocked
                              ? "text-green-600 hover:text-green-800 hover:bg-green-50"
                              : "text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50"
                          }`}
                          title={c.blocked ? "Unblock User" : "Block User"}
                        >
                          {c.blocked ? <FiUnlock /> : <FiLock />}
                        </button>
                        {c.role !== "admin" && (
                          <button
                            onClick={() => handleDeleteCustomer(c.id)}
                            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete User"
                          >
                            <FiTrash2 />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="p-8 text-center text-gray-500">
                    <FiUsers className="mx-auto text-4xl text-gray-300 mb-2" />
                    <p>No customers found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Showing {filteredCustomers.length} of {totalUsers} users
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
                    onClick={() => setCurrentPage(pageNum)}
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

      {/* Customer Details Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-full flex items-center justify-center mr-3">
                  <FiUsers className="text-indigo-600 text-xl" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{selectedCustomer.username}</h2>
                  <p className="text-gray-600">{selectedCustomer.email}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>
            
            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`py-2 px-1 border-b-2 text-sm font-medium transition-colors ${
                    activeTab === 'details'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="flex items-center">
                    <FiEye className="mr-2" />
                    Customer Details
                  </span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('orders');
                    fetchCustomerOrders(selectedCustomer.id);
                  }}
                  className={`py-2 px-1 border-b-2 text-sm font-medium transition-colors ${
                    activeTab === 'orders'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="flex items-center">
                    <FiShoppingBag className="mr-2" />
                    Orders ({selectedCustomer.orders_count || 0})
                  </span>
                </button>
              </nav>
            </div>
            
            {/* Tab Content */}
            {activeTab === 'details' ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Customer Stats */}
                <div className="col-span-1 lg:col-span-2">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-white p-4 rounded-lg border border-blue-100">
                      <div className="flex items-center">
                        <div className="p-2 rounded-lg bg-blue-100 text-blue-600 mr-3">
                          <FiShoppingBag className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Total Orders</p>
                          <p className="text-xl font-bold text-gray-800">{selectedCustomer.orders_count || 0}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-green-50 to-white p-4 rounded-lg border border-green-100">
                      <div className="flex items-center">
                        <div className="p-2 rounded-lg bg-green-100 text-green-600 mr-3">
                          <FiShoppingCart className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Cart Items</p>
                          <p className="text-xl font-bold text-gray-800">{selectedCustomer.cart_items_count || 0}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-lg border border-purple-100">
                      <div className="flex items-center">
                        <div className="p-2 rounded-lg bg-purple-100 text-purple-600 mr-3">
                          <FiDollarSign className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Total Spent</p>
                          <p className="text-xl font-bold text-gray-800">{formatCurrency(selectedCustomer.total_spent)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Additional Info */}
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-semibold text-gray-700 mb-2">Average Order Value</h3>
                      <p className="text-lg font-bold text-indigo-600">
                        {selectedCustomer.orders_count > 0 ? 
                          formatCurrency(parseFloat(selectedCustomer.total_spent || 0) / selectedCustomer.orders_count) : 
                          '$0.00'
                        }
                      </p>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-semibold text-gray-700 mb-2">Activity Status</h3>
                      <div className="flex items-center">
                        <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
                          getActivityColor(selectedCustomer.last_order) === 'green' ? 'bg-green-500' :
                          getActivityColor(selectedCustomer.last_order) === 'blue' ? 'bg-blue-500' :
                          getActivityColor(selectedCustomer.last_order) === 'yellow' ? 'bg-yellow-500' :
                          'bg-gray-500'
                        }`}></span>
                        <p className="font-medium">
                          {getActivityStatus(selectedCustomer.last_order, selectedCustomer.orders_count)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Account Info */}
                <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-lg border border-indigo-100">
                  <h3 className="font-semibold text-lg mb-4">Account Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-500">User ID</label>
                      <p className="font-medium">#{selectedCustomer.id}</p>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500">Joined Date</label>
                      <p className="font-medium">{formatDate(selectedCustomer.date_joined)}</p>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500">Last Order</label>
                      <p className="font-medium">{selectedCustomer.last_order ? formatDate(selectedCustomer.last_order) : 'Never'}</p>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500">Role</label>
                      <p className="font-medium capitalize">{selectedCustomer.role || 'user'}</p>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500">Account Status</label>
                      <p className={`font-medium ${selectedCustomer.blocked ? 'text-red-600' : 'text-green-600'}`}>
                        {selectedCustomer.blocked ? "Blocked" : "Active"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Orders Tab Content */
              <div>
                {isLoadingOrders ? (
                  <div className="flex justify-center items-center h-48">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                  </div>
                ) : customerOrders.length > 0 ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-gradient-to-br from-blue-50 to-white p-4 rounded-lg border border-blue-100">
                        <p className="text-sm text-gray-500">Total Orders</p>
                        <p className="text-2xl font-bold text-gray-800">{customerOrders.length}</p>
                      </div>
                      <div className="bg-gradient-to-br from-green-50 to-white p-4 rounded-lg border border-green-100">
                        <p className="text-sm text-gray-500">Total Amount</p>
                        <p className="text-2xl font-bold text-gray-800">
                          {formatCurrency(customerOrders.reduce((sum, order) => sum + parseFloat(order.total || 0), 0))}
                        </p>
                      </div>
                      <div className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-lg border border-purple-100">
                        <p className="text-sm text-gray-500">Average Order</p>
                        <p className="text-2xl font-bold text-gray-800">
                          {formatCurrency(customerOrders.length > 0 ? 
                            customerOrders.reduce((sum, order) => sum + parseFloat(order.total || 0), 0) / customerOrders.length : 
                            0)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {customerOrders.map((order, index) => {
                        const StatusIcon = getStatusIcon(order.status);
                        return (
                          <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <p className="font-semibold text-gray-800">Order #{order.id}</p>
                                <p className="text-sm text-gray-500">{formatDate(order.date)}</p>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${getStatusColor(order.status)}`}>
                                <StatusIcon className="mr-1 h-3 w-3" />
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </span>
                            </div>
                            
                            <div className="mb-3">
                              <p className="text-sm font-medium text-gray-700 mb-2">Items:</p>
                              <div className="space-y-2">
                                {order.items && order.items.map((item, itemIndex) => (
                                  <div key={itemIndex} className="flex justify-between items-center text-sm">
                                    <div>
                                      <span className="font-medium">{item.product_name}</span>
                                      <span className="text-gray-500 ml-2">×{item.quantity}</span>
                                    </div>
                                    <span className="font-medium">{formatCurrency(item.price)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                              <div>
                                <p className="text-sm text-gray-500">Order Total</p>
                                <p className="text-lg font-bold text-gray-800">{formatCurrency(order.total)}</p>
                              </div>
                              <button
                                onClick={() => {
                                  // You can add more order details view here
                                  toast.info(`Viewing details for order ${order.id}`);
                                }}
                                className="px-4 py-2 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 rounded-lg text-sm font-medium transition-colors"
                              >
                                View Details
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FiShoppingBag className="mx-auto text-4xl text-gray-300 mb-3" />
                    <p className="text-gray-500">No orders found for this customer</p>
                    <p className="text-sm text-gray-400 mt-1">This customer hasn't placed any orders yet</p>
                  </div>
                )}
              </div>
            )}
            
            {/* Actions */}
            <div className="border-t pt-6 mt-6">
              <div className="flex flex-wrap gap-3">
                {activeTab === 'details' && selectedCustomer.orders_count > 0 && (
                  <button
                    onClick={() => {
                      setActiveTab('orders');
                      fetchCustomerOrders(selectedCustomer.id);
                    }}
                    className="px-4 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg font-medium transition-colors flex items-center"
                  >
                    <FiShoppingBag className="mr-2" />
                    View Orders ({selectedCustomer.orders_count})
                  </button>
                )}
                
                <button
                  onClick={() => {
                    toggleBlockCustomer(selectedCustomer);
                  }}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCustomer.blocked
                      ? "bg-green-100 text-green-700 hover:bg-green-200"
                      : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                  }`}
                >
                  {selectedCustomer.blocked ? "Unblock User" : "Block User"}
                </button>
                
                {selectedCustomer.role !== "admin" && (
                  <button
                    onClick={() => {
                      if (window.confirm("Are you sure you want to delete this user?")) {
                        handleDeleteCustomer(selectedCustomer.id);
                      }
                    }}
                    className="px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg font-medium transition-colors"
                  >
                    Delete User Account
                  </button>
                )}
                
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg font-medium transition-colors"
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

export default Customers;