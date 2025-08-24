// src/pages/admin/Customers.jsx
import React, { useEffect, useState } from "react";
import {
  FiUsers,
  FiSearch,
  FiTrash2,
  FiPlus,
  FiLock,
  FiUnlock,
} from "react-icons/fi";
import axios from "axios";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch users
  const fetchCustomers = async () => {
    try {
      const res = await axios.get("http://localhost:3000/users");
      setCustomers(res.data);
      setFilteredCustomers(res.data);
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching customers:", err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Search filter
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredCustomers(customers);
    } else {
      const filtered = customers.filter(
        (c) =>
          c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.role?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCustomers(filtered);
    }
  }, [searchTerm, customers]);

  const handleDeleteCustomer = async (id) => {
    if (window.confirm("Delete this customer?")) {
      try {
        await axios.delete(`http://localhost:3000/users/${id}`);
        fetchCustomers();
      } catch (err) {
        console.error("Error deleting customer:", err);
      }
    }
  };

  const toggleBlockCustomer = async (customer) => {
    try {
      await axios.patch(`http://localhost:3000/users/${customer.id}`, {
        isBlock: !customer.isBlock,
      });
      fetchCustomers();
    } catch (err) {
      console.error("Error updating block status:", err);
    }
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Customer Management
        </h1>
        <div className="flex space-x-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search customers..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center">
            <FiPlus className="mr-2" /> Add Customer
          </button>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left">Customer</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Role</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((c) => (
              <tr key={c.id} className="border-t hover:bg-gray-50">
                <td
                  className="p-4 font-medium cursor-pointer text-indigo-600"
                  onClick={() => setSelectedCustomer(c)}
                >
                  {c.name}
                </td>
                <td className="p-4">{c.email}</td>
                <td className="p-4">{c.role}</td>
                <td className="p-4">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      c.isBlock
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {c.isBlock ? "Blocked" : "Active"}
                  </span>
                </td>
                <td className="p-4 flex space-x-2">
                  <button
                    onClick={() => handleDeleteCustomer(c.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FiTrash2 />
                  </button>
                  <button
                    onClick={() => toggleBlockCustomer(c)}
                    className={`${
                      c.isBlock
                        ? "text-green-600 hover:text-green-800"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    {c.isBlock ? <FiUnlock /> : <FiLock />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Customer Details Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Customer Details</h2>
              <button onClick={() => setSelectedCustomer(null)}>✕</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Info */}
              <div>
                <h3 className="font-semibold mb-2">Personal Info</h3>
                <p>
                  <strong>Name:</strong> {selectedCustomer.name}
                </p>
                <p>
                  <strong>Email:</strong> {selectedCustomer.email}
                </p>
                <p>
                  <strong>Role:</strong> {selectedCustomer.role}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  {selectedCustomer.isBlock ? "Blocked" : "Active"}
                </p>
                <p>
                  <strong>Joined:</strong>{" "}
                  {new Date(selectedCustomer.created_at).toLocaleDateString()}
                </p>
              </div>

              {/* Orders */}
              <div>
                <h3 className="font-semibold mb-2">Orders</h3>
                {selectedCustomer.orders?.length > 0 ? (
                  selectedCustomer.orders.map((o) => (
                    <div
                      key={o.id}
                      className="border p-3 rounded-md mb-2 bg-gray-50"
                    >
                      <p>
                        <strong>Order ID:</strong> {o.id}
                      </p>
                      <p>
                        <strong>Status:</strong> {o.status}
                      </p>
                      <p>
                        <strong>Total:</strong> ${o.totalAmount}
                      </p>
                      <p>
                        <strong>Date:</strong>{" "}
                        {new Date(o.orderDate).toLocaleString()}
                      </p>
                      <div className="mt-2">
                        <h4 className="font-medium">Items:</h4>
                        {o.cart.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center space-x-2 border-b py-1"
                          >
                            <img
                              src={item.image[0]}
                              alt={item.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div>
                              <p>{item.name}</p>
                              <p className="text-sm text-gray-600">
                                Size: {item.size} | Qty: {item.quantity}
                              </p>
                              <p className="text-sm font-medium">
                                ${item.price}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No orders found</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
