import React , { useState, useContext, useEffect } from 'react';
import { ShopContext } from '../../context/ShopContext';
import { 
  FiUsers, 
  FiSearch, 
  FiMail, 
  FiPhone, 
  FiMapPin,
  FiCalendar,
  FiEdit,
  FiTrash2,
  FiPlus,
  FiShoppingBag,
  FiDollarSign,
} from 'react-icons/fi';

const Customers = () => {
  const { products, loading } = useContext(ShopContext);
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Generate mock customer data based on your products
  useEffect(() => {
    if (products && products.length > 0) {
      generateCustomerData();
    }
  }, [products]);

  const generateCustomerData = () => {
    // This would normally come from your API
    const mockCustomers = [
      {
        id: 1,
        name: 'Sarah Johnson',
        email: 'sarah.johnson@example.com',
        phone: '+1 (555) 123-4567',
        location: 'New York, USA',
        joinDate: '2023-03-15',
        orders: 12,
        totalSpent: 1245.50,
        lastOrder: '2023-10-28'
      },
      {
        id: 2,
        name: 'Michael Chen',
        email: 'michael.chen@example.com',
        phone: '+1 (555) 987-6543',
        location: 'San Francisco, USA',
        joinDate: '2023-05-22',
        orders: 8,
        totalSpent: 876.25,
        lastOrder: '2023-10-25'
      },
      {
        id: 3,
        name: 'Emma Rodriguez',
        email: 'emma.rodriguez@example.com',
        phone: '+1 (555) 456-7890',
        location: 'Miami, USA',
        joinDate: '2023-01-10',
        orders: 15,
        totalSpent: 2100.00,
        lastOrder: '2023-10-27'
      },
      {
        id: 4,
        name: 'James Wilson',
        email: 'james.wilson@example.com',
        phone: '+44 20 7946 0958',
        location: 'London, UK',
        joinDate: '2023-02-28',
        orders: 5,
        totalSpent: 450.75,
        lastOrder: '2023-10-20'
      },
      {
        id: 5,
        name: 'Sophia Kim',
        email: 'sophia.kim@example.com',
        phone: '+82 2 312 3456',
        location: 'Seoul, South Korea',
        joinDate: '2023-07-12',
        orders: 9,
        totalSpent: 1120.30,
        lastOrder: '2023-10-29'
      }
    ];

    setCustomers(mockCustomers);
    setFilteredCustomers(mockCustomers);
    setIsLoading(false);
  };

  // Filter customers based on search term
  useEffect(() => {
    if (searchTerm === '') {
      setFilteredCustomers(customers);
    } else {
      const filtered = customers.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCustomers(filtered);
    }
  }, [searchTerm, customers]);

  const handleViewCustomer = (customer) => {
    setSelectedCustomer(customer);
  };

  const handleCloseDetails = () => {
    setSelectedCustomer(null);
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Customer Management</h1>
        <div className="flex space-x-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search customers..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center">
            <FiPlus className="mr-2" /> Add Customer
          </button>
        </div>
      </div>

      {/* Customer Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
              <FiUsers className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h2 className="text-gray-500 text-sm">Total Customers</h2>
              <p className="text-2xl font-bold">{customers.length}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <span>+12% from last month</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-100 text-green-600">
              <FiShoppingBag className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h2 className="text-gray-500 text-sm">Avg. Orders per Customer</h2>
              <p className="text-2xl font-bold">
                {(customers.reduce((sum, customer) => sum + customer.orders, 0) / customers.length).toFixed(1)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-100 text-purple-600">
              <FiDollarSign className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h2 className="text-gray-500 text-sm">Avg. Customer Value</h2>
              <p className="text-2xl font-bold">
                ${(customers.reduce((sum, customer) => sum + customer.totalSpent, 0) / customers.length).toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-orange-100 text-orange-600">
              <FiCalendar className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h2 className="text-gray-500 text-sm">New This Month</h2>
              <p className="text-2xl font-bold">24</p>
            </div>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left">Customer</th>
              <th className="p-4 text-left">Contact</th>
              <th className="p-4 text-left">Location</th>
              <th className="p-4 text-left">Orders</th>
              <th className="p-4 text-left">Total Spent</th>
              <th className="p-4 text-left">Last Order</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((customer) => (
              <tr key={customer.id} className="border-t border-gray-200 hover:bg-gray-50">
                <td className="p-4 font-medium">{customer.name}</td>
                <td className="p-4">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-600">{customer.email}</span>
                    <span className="text-xs text-gray-500">{customer.phone}</span>
                  </div>
                </td>
                <td className="p-4">{customer.location}</td>
                <td className="p-4">{customer.orders}</td>
                <td className="p-4">${customer.totalSpent.toFixed(2)}</td>
                <td className="p-4">{customer.lastOrder}</td>
                <td className="p-4">
                  <div className="flex space-x-2">
                    <button 
                      className="text-blue-600 hover:text-blue-800 p-1"
                      onClick={() => handleViewCustomer(customer)}
                    >
                      <FiEdit />
                    </button>
                    <button className="text-red-600 hover:text-red-800 p-1">
                      <FiTrash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Customer Details Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Customer Details</h2>
              <button onClick={handleCloseDetails} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Personal Information</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Name:</span> {selectedCustomer.name}</p>
                  <p><span className="font-medium">Email:</span> {selectedCustomer.email}</p>
                  <p><span className="font-medium">Phone:</span> {selectedCustomer.phone}</p>
                  <p><span className="font-medium">Location:</span> {selectedCustomer.location}</p>
                  <p><span className="font-medium">Member since:</span> {selectedCustomer.joinDate}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Order Statistics</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Total Orders:</span> {selectedCustomer.orders}</p>
                  <p><span className="font-medium">Total Spent:</span> ${selectedCustomer.totalSpent.toFixed(2)}</p>
                  <p><span className="font-medium">Average Order Value:</span> ${(selectedCustomer.totalSpent / selectedCustomer.orders).toFixed(2)}</p>
                  <p><span className="font-medium">Last Order:</span> {selectedCustomer.lastOrder}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-4">
              <button className="px-4 py-2 border border-gray-300 rounded-lg">Send Email</button>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg">View Order History</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;