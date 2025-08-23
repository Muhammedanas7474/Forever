import React, { useState, useContext, useEffect } from 'react';
import { 
  FiTrendingUp, 
  FiShoppingBag, 
  FiDollarSign, 
  FiUsers, 
  FiCalendar,
  FiSettings,
  FiRefreshCw,
  FiAlertTriangle, // Added missing import
  FiPackage // Added missing import
} from 'react-icons/fi';
import { ShopContext } from '../../context/ShopContext';

const Dashboard = () => {
  const { products, loading, getCartAmount, getCartCount, currency, getProductCount, getOutOfStockProducts, getLowStockProducts } = useContext(ShopContext);
  
  const [salesData, setSalesData] = useState([]);
  const [metrics, setMetrics] = useState({
    totalSales: '0',
    avgOrderValue: '0.00',
    conversionRate: '0%',
    returningCustomers: '0%'
  });
  const [adminMetrics, setAdminMetrics] = useState({
    totalProducts: 0,
    outOfStock: 0,
    lowStock: 0
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (products && products.length > 0) {
      calculateMetrics();
      setAdminMetrics({
        totalProducts: getProductCount(),
        outOfStock: getOutOfStockProducts().length,
        lowStock: getLowStockProducts().length
      });
    }
  }, [products]);

  // Calculate metrics from your products and cart data
  useEffect(() => {
    if (products && products.length > 0) {
      calculateMetrics();
    }
  }, [products]);

  const calculateMetrics = () => {
    // Calculate total sales (example calculation)
    const totalSalesAmount = getCartAmount();
    const formattedSales = new Intl.NumberFormat().format(totalSalesAmount);
    
    // Calculate average order value (example)
    const totalOrders = getCartCount();
    const avgOrderValue = totalOrders > 0 ? totalSalesAmount / totalOrders : 0;
    
    // Calculate conversion rate (example - you might need real data for this)
    const visitors = 1000; // This should come from your analytics
    const conversionRate = totalOrders > 0 ? (totalOrders / visitors) * 100 : 0;
    
    // Calculate returning customers (example)
    const returningCustomers = 38; // This should come from your user data
    
    setMetrics({
      totalSales: formattedSales,
      avgOrderValue: avgOrderValue.toFixed(2),
      conversionRate: conversionRate.toFixed(1) + '%',
      returningCustomers: returningCustomers + '%'
    });
    
    // Generate sales data for the chart (example)
    generateSalesData();
  };

  const generateSalesData = () => {
    // This is mock data - replace with actual sales data from your backend
    const days = ['1 Jul', '2 Jul', '3 Jul', '4 Jul', '5 Jul', '6 Jul', 
                 '7 Jul', '8 Jul', '9 Jul', '10 Jul', '11 Jul', '12 Jul'];
    const data = days.map(day => ({
      day,
      sales: Math.floor(Math.random() * 50) + 30 // Random sales between 30-80
    }));
    setSalesData(data);
  };

  const refreshData = () => {
    setIsRefreshing(true);
    calculateMetrics();
    setTimeout(() => setIsRefreshing(false), 1000); // Simulate loading
  };

  // Find max sales for chart scaling
  const maxSales = salesData.length > 0 
    ? Math.max(...salesData.map(item => item.sales)) 
    : 100;

  // Categories data (example - you might want to calculate this from your products)
  const categories = [
    { name: 'Men\'s Wear', percentage: 25, color: 'bg-blue-500' },
    { name: 'Women\'s Wear', percentage: 22, color: 'bg-pink-500' },
    { name: 'Kids', percentage: 17, color: 'bg-purple-500' },
    { name: 'Accessories', percentage: 13, color: 'bg-yellow-500' },
    { name: 'Footwear', percentage: 10, color: 'bg-green-500' },
    { name: 'Sportswear', percentage: 8, color: 'bg-orange-500' },
    { name: 'Formal Wear', percentage: 5, color: 'bg-indigo-500' }
  ];

  // Countries data (example)
  const countries = [
    { name: 'United States', percentage: 28 },
    { name: 'United Kingdom', percentage: 22 },
    { name: 'Germany', percentage: 15 },
    { name: 'France', percentage: 12 },
    { name: 'Canada', percentage: 10 },
    { name: 'Australia', percentage: 8 },
    { name: 'Japan', percentage: 5 }
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
          className="flex items-center px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
          disabled={isRefreshing}
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
              <FiDollarSign className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h2 className="text-gray-500 text-sm">Total Sales</h2>
              <p className="text-2xl font-bold">{currency}{metrics.totalSales}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <FiTrendingUp className="mr-1" />
            <span>12.5% from last week</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-100 text-green-600">
              <FiShoppingBag className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h2 className="text-gray-500 text-sm">Avg. Order Value</h2>
              <p className="text-2xl font-bold">{currency}{metrics.avgOrderValue}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <FiTrendingUp className="mr-1" />
            <span>3.2% from last week</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-100 text-purple-600">
              <FiUsers className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h2 className="text-gray-500 text-sm">Conversion Rate</h2>
              <p className="text-2xl font-bold">{metrics.conversionRate}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-red-600">
            <FiTrendingUp className="mr-1 transform rotate-180" />
            <span>1.5% from last week</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-orange-100 text-orange-600">
              <FiUsers className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h2 className="text-gray-500 text-sm">Returning Customers</h2>
              <p className="text-2xl font-bold">{metrics.returningCustomers}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <FiTrendingUp className="mr-1" />
            <span>5.7% from last week</span>
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
            <div className="mt-4 flex items-center text-sm text-gray-600">
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
            <div className="mt-4 flex items-center text-sm text-yellow-600">
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
            <div className="mt-4 flex items-center text-sm text-red-600">
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
            <h2 className="text-xl font-bold text-gray-800">Product Sales</h2>
            <button className="text-sm text-indigo-600 flex items-center">
              <FiCalendar className="mr-1" />
              Last 30 days
            </button>
          </div>
          
          <div className="h-64">
            <div className="flex items-end h-5/6 gap-2 mt-4">
              {salesData.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-gradient-to-t from-indigo-500 to-indigo-300 rounded-t-lg"
                    style={{ height: `${(item.sales / maxSales) * 100}%` }}
                  ></div>
                  <span className="text-xs text-gray-500 mt-1">{item.day}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1 px-2">
              <span>0</span>
              <span>20K</span>
              <span>40K</span>
              <span>60K</span>
              <span>80K</span>
            </div>
          </div>
        </div>

        {/* Categories Chart */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Sales by Product Category</h2>
          
          <div className="grid grid-cols-2 gap-4">
            {categories.map((category, index) => (
              <div key={index} className="flex items-center">
                <div className={`w-4 h-4 rounded-full ${category.color} mr-3`}></div>
                <span className="text-sm font-medium flex-1">{category.name}</span>
                <span className="text-sm font-bold">{category.percentage}%</span>
              </div>
            ))}
          </div>
          
          <div className="mt-6 flex justify-center">
            <div className="relative w-40 h-40 rounded-full" 
              style={{ background: 'conic-gradient(#3B82F6 0% 25%, #EC4899 25% 47%, #A855F7 47% 64%, #EAB308 64% 74%, #10B981 74% 84%, #F97316 84% 89%, #6366F1 89% 94%, #8B5CF6 94% 100%)' }}>
              <div className="absolute inset-4 bg-white rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Countries Chart */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Sales by Countries</h2>
          
          <div className="space-y-4">
            {countries.map((country, index) => (
              <div key={index}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">{country.name}</span>
                  <span className="text-sm font-bold">{country.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full" 
                    style={{ width: `${country.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trading Metrics */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Trading Metrics</h2>
          
          <div className="bg-indigo-50 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-indigo-800 font-medium">Total Returns</span>
              <span className="text-2xl font-bold text-indigo-800">1,289</span>
            </div>
            <div className="w-full bg-indigo-200 rounded-full h-2 mt-2">
              <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '12%' }}></div>
            </div>
            <div className="text-right text-xs text-indigo-600 mt-1">12% Return Rate</div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4">
              <span className="text-sm text-blue-600">Inventory Turnover</span>
              <p className="text-xl font-bold mt-1">4.2x</p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4">
              <span className="text-sm text-purple-600">Sell-through Rate</span>
              <p className="text-xl font-bold mt-1">68%</p>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4">
              <span className="text-sm text-green-600">Gross Margin</span>
              <p className="text-xl font-bold mt-1">52.5%</p>
            </div>
            
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-4">
              <span className="text-sm text-amber-600">Sell-out Rate</span>
              <p className="text-xl font-bold mt-1">86%</p>
            </div>
          </div>
          
          <button className="w-full mt-6 py-2 bg-indigo-100 text-indigo-700 rounded-lg font-medium flex items-center justify-center">
            <FiSettings className="mr-2" />
            Add Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;