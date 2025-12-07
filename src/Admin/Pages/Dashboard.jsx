import React, { useState, useEffect } from 'react';
import { 
  FiTrendingUp, 
  FiShoppingBag, 
  FiDollarSign, 
  FiUsers, 
  FiCalendar,
  FiRefreshCw,
  FiAlertTriangle, 
  FiPackage,
  FiShoppingCart,
  FiCheckCircle,
  FiClock,
  FiTruck,
  FiBox,
  FiInbox,
  FiBarChart2,
  FiPieChart
} from 'react-icons/fi';
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
  Cell,
  AreaChart,
  Area,
  LineChart,
  Line,
  ComposedChart
} from 'recharts';
import adminService from '../services/adminService';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  
  // State for dashboard data
  const [dashboardData, setDashboardData] = useState({
    metrics: {
      totalOrders: '0',
      totalRevenue: '$0.00',
      totalCustomers: '0',
      avgOrderValue: '$0.00',
      deliveredOrders: '0',
      pendingOrders: '0',
      totalProducts: 0,
      conversionRate: '0%',
      inStock: 0,
      outOfStock: 0,
      lowStock: 0
    },
    salesData: [],
    topProducts: [],
    orderStatusData: [],
    stockSummary: {}
  });

  // Fetch dashboard data from backend
  const fetchDashboardData = async () => {
    try {
      setIsRefreshing(true);
      setError(null);
      
      // Fetch dashboard stats from Django backend
      const stats = await adminService.getDashboardStats();
      
      // Transform backend data to match frontend format
      transformDashboardData(stats);
      
      setLoading(false);
      setIsRefreshing(false);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  // Transform backend data to frontend format
  const transformDashboardData = (backendData) => {
    // Calculate average order value
    const avgOrderValue = backendData.total_orders > 0 
      ? (backendData.total_revenue / backendData.total_orders).toFixed(2)
      : '0.00';
    
    // Calculate conversion rate
    const conversionRate = backendData.total_customers > 0 
      ? ((backendData.delivered_orders / backendData.total_customers) * 100).toFixed(1)
      : '0.0';

    const transformedData = {
      metrics: {
        totalOrders: backendData.total_orders?.toString() || '0',
        totalRevenue: `$${parseFloat(backendData.total_revenue || 0).toFixed(2)}`,
        totalCustomers: backendData.total_customers?.toString() || '0',
        avgOrderValue: `$${avgOrderValue}`,
        deliveredOrders: backendData.delivered_orders?.toString() || '0',
        pendingOrders: backendData.pending_orders?.toString() || '0',
        totalProducts: backendData.total_products || 0,
        conversionRate: `${conversionRate}%`,
        inStock: backendData.stock_summary?.in_stock || 0,
        outOfStock: backendData.stock_summary?.out_of_stock || 0,
        lowStock: backendData.stock_summary?.low_stock || 0
      },

      // Sales Chart - use the actual sales data from backend
      salesData: backendData.sales_chart?.map((s, index) => ({
        name: new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        revenue: Number(s.total) || 0,
        orders: Math.floor(Math.random() * 10) + 1, // Mock data - replace with actual if available
        day: `Day ${index + 1}`
      })) || [],

      // Top Products from backend
      topProducts: backendData.top_products?.map((product, index) => ({
        id: index + 1,
        name: product.product__name || 'Unknown Product',
        sales: product.total_sold || 0,
        revenue: (product.total_sold * 25).toFixed(2), // Mock revenue - replace with actual if available
        color: getProductColor(index),
        percentage: calculateProductPercentage(product.total_sold, backendData.top_products)
      })) || [],

      // Order Status from backend
      orderStatusData: backendData.order_status?.map(s => ({
        status: s.status.charAt(0).toUpperCase() + s.status.slice(1),
        count: s.count,
        color: getStatusColor(s.status),
        percentage: calculateStatusPercentage(s.count, backendData.total_orders)
      })) || [],

      // Stock Summary
      stockSummary: {
        inStock: backendData.stock_summary?.in_stock || 0,
        outOfStock: backendData.stock_summary?.out_of_stock || 0,
        lowStock: backendData.stock_summary?.low_stock || 0,
        total: backendData.total_products || 0
      }

    };

    setDashboardData(transformedData);
  };

  // Calculate product percentage for pie chart
  const calculateProductPercentage = (productSales, allProducts) => {
    if (!allProducts || allProducts.length === 0) return 0;
    const totalSales = allProducts.reduce((sum, p) => sum + (p.total_sold || 0), 0);
    return totalSales > 0 ? Math.round((productSales / totalSales) * 100) : 0;
  };

  // Calculate status percentage
  const calculateStatusPercentage = (statusCount, totalOrders) => {
    return totalOrders > 0 ? Math.round((statusCount / totalOrders) * 100) : 0;
  };

  // Get color for top products based on index
  const getProductColor = (index) => {
    const colors = [
      '#3b82f6', // Blue
      '#10b981', // Green
      '#f59e0b', // Yellow
      '#ef4444', // Red
      '#8b5cf6', // Purple
      '#ec4899', // Pink
      '#06b6d4', // Cyan
      '#f97316'  // Orange
    ];
    return colors[index % colors.length];
  };

  // Assign colors to order statuses
  const getStatusColor = (status) => {
    const statusColors = {
      'pending': '#eab308',    // Yellow
      'processing': '#f97316', // Orange
      'paid': '#3b82f6',       // Blue
      'shipped': '#8b5cf6',    // Purple
      'delivered': '#22c55e',  // Green
      'cancelled': '#ef4444',  // Red
      'default': '#6b7280'     // Gray
    };
    
    return statusColors[status.toLowerCase()] || statusColors.default;
  };

  // Get icon for status
  const getStatusIcon = (status) => {
    const statusIcons = {
      'pending': FiClock,
      'processing': FiRefreshCw,
      'paid': FiDollarSign,
      'shipped': FiTruck,
      'delivered': FiCheckCircle,
      'cancelled': FiAlertTriangle,
      'default': FiPackage
    };
    
    const IconComponent = statusIcons[status.toLowerCase()] || statusIcons.default;
    return <IconComponent className="h-5 w-5" />;
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const refreshData = () => {
    fetchDashboardData();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-red-500 text-xl mb-4">{error}</div>
        <button
          onClick={refreshData}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  const { metrics, salesData, topProducts, orderStatusData, stockSummary } = dashboardData;

  // Prepare data for stock pie chart
  const stockData = [
    { name: 'In Stock', value: stockSummary.inStock, color: '#22c55e' },
    { name: 'Low Stock', value: stockSummary.lowStock, color: '#f59e0b' },
    { name: 'Out of Stock', value: stockSummary.outOfStock, color: '#ef4444' }
  ].filter(item => item.value > 0);

  // Prepare data for product sales pie chart
  const productPieData = topProducts.map(product => ({
    name: product.name,
    value: product.sales,
    color: product.color
  }));

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

      {/* Main Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-md p-6 border border-blue-100">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
              <FiShoppingCart className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h2 className="text-gray-500 text-sm">Total Orders</h2>
              <p className="text-2xl font-bold">{metrics.totalOrders}</p>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600 flex items-center">
            <FiTrendingUp className="text-green-500 mr-1" />
            <span>All time orders</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-white rounded-xl shadow-md p-6 border border-green-100">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-100 text-green-600">
              <FiDollarSign className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h2 className="text-gray-500 text-sm">Total Revenue</h2>
              <p className="text-2xl font-bold">{metrics.totalRevenue}</p>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <span>All time revenue</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl shadow-md p-6 border border-purple-100">
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

        <div className="bg-gradient-to-br from-orange-50 to-white rounded-xl shadow-md p-6 border border-orange-100">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-orange-100 text-orange-600">
              <FiShoppingBag className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h2 className="text-gray-500 text-sm">Avg. Order Value</h2>
              <p className="text-2xl font-bold">{metrics.avgOrderValue}</p>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <span>Average per order</span>
          </div>
        </div>
      </div>

      {/* Order Status & Stock Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Order Status Summary */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <FiClock className="mr-2 text-yellow-500" />
            Order Status Summary
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-r from-yellow-50 to-white p-4 rounded-lg border border-yellow-100">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-yellow-100 text-yellow-600 mr-3">
                  <FiClock className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-700">Pending Orders</h3>
                  <p className="text-2xl font-bold text-yellow-600">{metrics.pendingOrders}</p>
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-500">
                Awaiting processing
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-white p-4 rounded-lg border border-green-100">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-green-100 text-green-600 mr-3">
                  <FiCheckCircle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-700">Delivered Orders</h3>
                  <p className="text-2xl font-bold text-green-600">{metrics.deliveredOrders}</p>
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-500">
                Successfully delivered
              </div>
            </div>
          </div>
        </div>

        {/* Stock Summary */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <FiPackage className="mr-2 text-indigo-500" />
            Stock Summary
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gradient-to-r from-green-50 to-white p-4 rounded-lg border border-green-100 text-center">
              <div className="p-2 rounded-lg bg-green-100 text-green-600 inline-block mb-2">
                <FiInbox className="h-5 w-5" />
              </div>
              <h3 className="font-medium text-gray-700">In Stock</h3>
              <p className="text-2xl font-bold text-green-600">{stockSummary.inStock}</p>
              <div className="text-sm text-gray-500">
                Available products
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-50 to-white p-4 rounded-lg border border-yellow-100 text-center">
              <div className="p-2 rounded-lg bg-yellow-100 text-yellow-600 inline-block mb-2">
                <FiAlertTriangle className="h-5 w-5" />
              </div>
              <h3 className="font-medium text-gray-700">Low Stock</h3>
              <p className="text-2xl font-bold text-yellow-600">{stockSummary.lowStock}</p>
              <div className="text-sm text-gray-500">
                Needs restocking
              </div>
            </div>

            <div className="bg-gradient-to-r from-red-50 to-white p-4 rounded-lg border border-red-100 text-center">
              <div className="p-2 rounded-lg bg-red-100 text-red-600 inline-block mb-2">
                <FiBox className="h-5 w-5" />
              </div>
              <h3 className="font-medium text-gray-700">Out of Stock</h3>
              <p className="text-2xl font-bold text-red-600">{stockSummary.outOfStock}</p>
              <div className="text-sm text-gray-500">
                Urgent attention
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid - Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue Chart with Area */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <FiBarChart2 className="mr-2 text-blue-500" />
              Revenue Timeline
            </h2>
            <div className="text-sm text-gray-500 flex items-center">
              <FiCalendar className="mr-1" />
              Daily Revenue
            </div>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={salesData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: '#6b7280' }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: '#6b7280' }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                  formatter={(value) => [`$${value}`, "Revenue"]}
                  labelFormatter={(label) => `Date: ${label}`}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  fill="url(#colorRevenue)"
                  stroke="#3b82f6"
                  strokeWidth={2}
                />
                <Bar
                  dataKey="revenue"
                  fill="#3b82f6"
                  barSize={20}
                  radius={[4, 4, 0, 0]}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Status Chart */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <FiPieChart className="mr-2 text-purple-500" />
            Order Status Distribution
          </h2>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={orderStatusData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis 
                  dataKey="status" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: '#6b7280' }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: '#6b7280' }}
                />
                <Tooltip 
                  formatter={(value, name, props) => [
                    value,
                    `${props.payload.status} Orders`,
                    props.payload.percentage && `(${props.payload.percentage}%)`
                  ]}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Bar 
                  dataKey="count" 
                  radius={[4, 4, 0, 0]}
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Grid - Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products Chart */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Top Selling Products</h2>
          
          <div className="flex">
            {/* Pie Chart */}
            <div className="w-1/3">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={productPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {productPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} sold`, "Units"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Product List */}
            <div className="w-2/3 pl-6">
              <div className="space-y-4">
                {topProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-3" 
                        style={{ backgroundColor: product.color }}
                      ></div>
                      <div>
                        <span className="font-medium text-gray-800">{product.name}</span>
                        <p className="text-sm text-gray-500">{product.percentage}% of total sales</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-800">{product.sales} units</p>
                      <p className="text-sm text-green-600">${product.revenue}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stock Distribution */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Stock Distribution</h2>
          
          <div className="flex">
            {/* Stock Pie Chart */}
            <div className="w-1/3">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={stockData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                    label
                  >
                    {stockData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} items`, "Stock"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Stock Details */}
            <div className="w-2/3 pl-6">
              <div className="space-y-6">
                {stockData.map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2" 
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span className="font-medium text-gray-700">{item.name}</span>
                      </div>
                      <span className="font-bold text-gray-800">{item.value} items</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full"
                        style={{ 
                          width: `${(item.value / stockSummary.total) * 100}%`,
                          backgroundColor: item.color 
                        }}
                      ></div>
                    </div>
                    <div className="text-right text-sm text-gray-500 mt-1">
                      {Math.round((item.value / stockSummary.total) * 100)}% of total stock
                    </div>
                  </div>
                ))}
              </div>

              {/* Stock Summary Stats */}
              <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg">
                <div className="flex items-center">
                  <FiTrendingUp className="h-6 w-6 text-indigo-600 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-800">Stock Health</h3>
                    <p className="text-lg font-bold text-indigo-600">
                      {stockSummary.inStock}/{stockSummary.total} items available
                    </p>
                    <p className="text-sm text-gray-600">
                      {stockSummary.lowStock > 0 && `${stockSummary.lowStock} items need restocking`}
                      {stockSummary.outOfStock > 0 && `, ${stockSummary.outOfStock} items out of stock`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-100 text-blue-600 mr-4">
              <FiTrendingUp className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-medium text-gray-800">Conversion Rate</h3>
              <p className="text-2xl font-bold text-blue-600">{metrics.conversionRate}</p>
              <p className="text-sm text-gray-600">Orders to customers ratio</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-100 text-green-600 mr-4">
              <FiPackage className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-medium text-gray-800">Product Availability</h3>
              <p className="text-2xl font-bold text-green-600">
                {Math.round((stockSummary.inStock / stockSummary.total) * 100)}%
              </p>
              <p className="text-sm text-gray-600">Products currently in stock</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-100 text-purple-600 mr-4">
              <FiBarChart2 className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-medium text-gray-800">Sales Performance</h3>
              <p className="text-2xl font-bold text-purple-600">
                {topProducts.length > 0 ? topProducts[0].name : 'N/A'}
              </p>
              <p className="text-sm text-gray-600">Top selling product</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;