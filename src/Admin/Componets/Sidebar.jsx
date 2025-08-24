import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FiTrendingUp,
  FiShoppingBag,
  FiDollarSign,
  FiUsers,
  FiPieChart,
  FiMap,
  FiSettings,
  FiMenu,
  FiX,
} from "react-icons/fi";

const AdminSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const navLinkClasses = ({ isActive }) =>
    `flex items-center py-2 px-4 rounded-lg transition-all duration-200 ${
      isActive
        ? "bg-indigo-700 text-white"
        : "hover:bg-indigo-700 text-gray-200"
    }`;

  return (
    <div
      className={`h-screen bg-indigo-800 text-white flex-shrink-0 transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Header with Toggle */}
      <div className="flex items-center justify-between p-4">
        {!collapsed && (
          <div className="flex items-center">
            <FiShoppingBag className="h-8 w-8 mr-2" />
            <span className="text-2xl font-bold">Forever</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-indigo-700"
        >
          {collapsed ? <FiMenu className="h-6 w-6" /> : <FiX className="h-6 w-6" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="space-y-2 px-2">
        <NavLink to="/admin/dashboard" className={navLinkClasses}>
          <FiTrendingUp className="mr-3" />
          {!collapsed && "Dashboard"}
        </NavLink>

        <NavLink to="/admin/products" className={navLinkClasses}>
          <FiShoppingBag className="mr-3" />
          {!collapsed && "Products"}
        </NavLink>

        <NavLink to="/admin/customers" className={navLinkClasses}>
          <FiUsers className="mr-3" />
          {!collapsed && "Customers"}
        </NavLink>

        <NavLink to="/admin/orders" className={navLinkClasses}>
          <FiDollarSign className="mr-3" />
          {!collapsed && "Orders"}
        </NavLink>

       
      </nav>
    </div>
  );
};

export default AdminSidebar;
