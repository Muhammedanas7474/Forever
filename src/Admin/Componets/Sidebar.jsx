import React from "react";
import { NavLink } from "react-router-dom";
import {
  FiTrendingUp,
  FiShoppingBag,
  FiDollarSign,
  FiUsers,
  FiMenu,
  FiX,
} from "react-icons/fi";

const AdminSidebar = ({ isOpen, toggleSidebar }) => {
  const navLinkClasses = ({ isActive }) =>
    `flex items-center py-2 px-4 rounded-lg transition-all duration-200 ${
      isActive ? "bg-indigo-700 text-white" : "hover:bg-indigo-700 text-gray-200"
    }`;

  return (
    <div
      className={`h-screen bg-indigo-800 text-white flex-shrink-0 transition-all duration-300 ${
        isOpen ? "w-64" : "w-20"
      }`}
    >
      {/* Header with Toggle */}
      <div className="flex items-center justify-between p-4">
        {isOpen && (
          <div className="flex items-center">
            <FiShoppingBag className="h-8 w-8 mr-2" />
            <span className="text-2xl font-bold">Forever</span>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-indigo-700"
        >
          {isOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="space-y-2 px-2">
        <NavLink to="/admin/dashboard" className={navLinkClasses}>
          <FiTrendingUp className="mr-3" />
          {isOpen && "Dashboard"}
        </NavLink>

        <NavLink to="/admin/products" className={navLinkClasses}>
          <FiShoppingBag className="mr-3" />
          {isOpen && "Products"}
        </NavLink>

        <NavLink to="/admin/customers" className={navLinkClasses}>
          <FiUsers className="mr-3" />
          {isOpen && "Customers"}
        </NavLink>

        <NavLink to="/admin/orders" className={navLinkClasses}>
          <FiDollarSign className="mr-3" />
          {isOpen && "Orders"}
        </NavLink>
      </nav>
    </div>
  );
};

export default AdminSidebar;
