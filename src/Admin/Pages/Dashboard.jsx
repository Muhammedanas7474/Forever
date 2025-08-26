import React, { useState, useContext, useEffect } from 'react';
import { 
  FiTrendingUp, 
  FiShoppingBag, 
  FiDollarSign, 
  FiUsers, 
  FiCalendar,
  FiSettings,
  FiRefreshCw,
  FiAlertTriangle, 
  FiPackage,
  FiShoppingCart
} from 'react-icons/fi';
import axios from 'axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [metrics, setMetrics] = useState({
    totalSales: '0',
    totalRevenue: '0.00',
    totalOrders: '0',
    totalCustomers: '0',
    avgOrderValue: '0.00',
    conversionRate: '0%'
  });
  const [adminMetrics, setAdminMetrics] = useState({
    totalProducts: 0,
    outOfStock: 0,
    lowStock: 0
  });
  const [salesData, setSalesData] = useState([]);

  // Fetch all data from JSON Server
  const fetchData = async () => {
    try {
      setIsRefreshing(true);
      const [productsRes, usersRes] = await Promise.all([
        axios.get('http://localhost:3000/products'),
        axios.get('http://localhost:3000/users')
      ]);

      setProducts(productsRes.data);
      setUsers(usersRes.data);
      
      // Extract orders from all users
      const allOrders = usersRes.data.flatMap(user => 
        user.orders && Array.isArray(user.orders) ? user.orders : []
      );
      setOrders(allOrders);
      
      setLoading(false);
      setIsRefreshing(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (products.length > 0 && orders.length > 0 && users.length > 0) {
      calculateMetrics();
    }
  }, [products, orders, users]);

  const calculateMetrics = () => {
    
    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    
    const totalOrders = orders.length;
    
    const customersWithOrders = users.filter(user => 
      user.orders && user.orders.length > 0
    ).length;
    
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    const conversionRate = users.length > 0 ? (customersWithOrders / users.length) * 100 : 0;
    
    // Calculate inventory metrics
    const outOfStockProducts = products.filter(product => (product.stock || 0) === 0).length;
    const lowStockProducts = products.filter(product => (product.stock || 0) > 0 && (product.stock || 0) < 10).length;

    setMetrics({
      totalSales: totalOrders.toLocaleString(),
      totalRevenue: totalRevenue.toFixed(2),
      totalOrders: totalOrders.toLocaleString(),
      totalCustomers: customersWithOrders.toLocaleString(),
      avgOrderValue: avgOrderValue.toFixed(2),
      conversionRate: conversionRate.toFixed(1) + '%'
    });

    setAdminMetrics({
      totalProducts: products.length,
      outOfStock: outOfStockProducts,
      lowStock: lowStockProducts
    });

    // Generate sales data for the last 7 days
    generateSalesData();
  };

  const generateSalesData = () => {
    // Get last 7 days
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push({
        name: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        sales: 0
      });
    }

    // Calculate sales for each day
    const updatedDays = days.map(day => {
      const daySales = orders.filter(order => {
        if (!order.orderDate) return false;
        const orderDate = new Date(order.orderDate);
        return orderDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) === day.name;
      }).reduce((sum, order) => sum + (order.totalAmount || 0), 0);
      
      return {
        ...day,
        sales: daySales
      };
    });

    setSalesData(updatedDays);
  };

  const refreshData = () => {
    setIsRefreshing(true);
    fetchData();
  };

  // Calculate categories data from products
  const categories = products.reduce((acc, product) => {
    if (product.category) {
      const existingCategory = acc.find(item => item.name === product.category);
      if (existingCategory) {
        existingCategory.count++;
      } else {
        acc.push({ 
          name: product.category, 
          count: 1, 
          color: getCategoryColor(product.category) 
        });
      }
    }
    return acc;
  }, []);

  // Assign colors to categories
  function getCategoryColor(category) {
    const colors = {
      'Men': '#3b82f6',
      'Women': '#ec4899',
      'Kids': '#8b5cf6',
      'Topwear': '#6366f1',
      'Bottomwear': '#10b981',
      'Winterwear': '#f97316'
    };
    return colors[category] || '#6b7280';
  }

  // Calculate total products per category for percentages
  const totalProducts = products.length;
  const categoriesWithPercentage = categories.map(category => ({
    ...category,
    value: totalProducts > 0 ? Math.round((category.count / totalProducts) * 100) : 0
  }));

  // Order status data
  const orderStatusData = [
    { status: 'Pending', count: orders.filter(o => o.status === 'pending').length, color: '#eab308' },
    { status: 'Shipped', count: orders.filter(o => o.status === 'shipped').length, color: '#3b82f6' },
    { status: 'Delivered', count: orders.filter(o => o.status === 'delivered').length, color: '#22c55e' },
    { status: 'Cancelled', count: orders.filter(o => o.status === 'cancelled').length, color: '#ef4444' }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your store today.</p>
        </div>
        <button
          onClick={refreshData}
          disabled={isRefreshing}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors disabled:opacity-50"
        >
          <FiRefreshCw className={`mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </div>

      {/* Sales Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
              <FiShoppingCart className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h2 className="text-gray-500 text-sm">Total Orders</h2>
              <p className="text-2xl font-bold">{metrics.totalOrders}</p>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <span>All time orders</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-100 text-green-600">
              <FiDollarSign className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h2 className="text-gray-500 text-sm">Total Revenue</h2>
              <p className="text-2xl font-bold">${metrics.totalRevenue}</p>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <span>All time revenue</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-100 text-purple-600">
              <FiUsers className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h2 className="text-gray-500 text-sm">Total Customers</h2>
              <p className="text-2xl font-bold">{metrics.totalCustomers}</p>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <span>Customers with orders</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-orange-100 text-orange-600">
              <FiShoppingBag className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h2 className="text-gray-500 text-sm">Avg. Order Value</h2>
              <p className="text-2xl font-bold">${metrics.avgOrderValue}</p>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <span>Average per order</span>
          </div>
        </div>
      </div>

      {/* Inventory Overview Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Inventory Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-indigo-100 text-indigo-600">
                <FiPackage className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <h2 className="text-gray-500 text-sm">Total Products</h2>
                <p className="text-2xl font-bold">{adminMetrics.totalProducts}</p>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <span>In inventory</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-yellow-100 text-yellow-600">
                <FiAlertTriangle className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <h2 className="text-gray-500 text-sm">Low Stock</h2>
                <p className="text-2xl font-bold">{adminMetrics.lowStock}</p>
              </div>
            </div>
            <div className="mt-4 text-sm text-yellow-600">
              <span>Needs restocking</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-red-100 text-red-600">
                <FiAlertTriangle className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <h2 className="text-gray-500 text-sm">Out of Stock</h2>
                <p className="text-2xl font-bold">{adminMetrics.outOfStock}</p>
              </div>
            </div>
            <div className="mt-4 text-sm text-red-600">
              <span>Urgent attention needed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Revenue (Last 7 Days)</h2>
            <button className="text-sm text-indigo-600 flex items-center">
              <FiCalendar className="mr-1" />
              Last 7 days
            </button>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`$${value}`, 'Revenue']}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Bar dataKey="sales" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categories Chart */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Products by Category</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            {categoriesWithPercentage.map((category, index) => (
              <div key={index} className="flex items-center">
                <div 
                  className="w-4 h-4 rounded-full mr-3" 
                  style={{ backgroundColor: category.color }}
                ></div>
                <span className="text-sm font-medium flex-1">{category.name}</span>
                <span className="text-sm font-bold">{category.value}%</span>
              </div>
            ))}
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoriesWithPercentage}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {categoriesWithPercentage.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Status Chart */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Order Status</h2>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={orderStatusData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" />
                <YAxis 
                  type="category" 
                  dataKey="status" 
                  width={80}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  formatter={(value) => [value, 'Orders']}
                  labelFormatter={(label) => `Status: ${label}`}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Quick Stats</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4">
              <span className="text-sm text-blue-600">Conversion Rate</span>
              <p className="text-xl font-bold mt-1">{metrics.conversionRate}</p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4">
              <span className="text-sm text-purple-600">Total Users</span>
              <p className="text-xl font-bold mt-1">{users.length}</p>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4">
              <span className="text-sm text-green-600">Active Customers</span>
              <p className="text-xl font-bold mt-1">{metrics.totalCustomers}</p>
            </div>
            
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-4">
              <span className="text-sm text-amber-600">Bestsellers</span>
              <p className="text-xl font-bold mt-1">
                {products.filter(p => p.bestseller).length}
              </p>
            </div>
          </div>
          
          <div className="mt-6 p-3 bg-gray-100 rounded-lg text-center">
            <p className="text-sm text-gray-600">
              Last updated: {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;