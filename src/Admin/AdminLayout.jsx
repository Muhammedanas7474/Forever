import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import AdminSidebar from "./Componets/Sidebar";
import AdminNavbar from "./Componets/Navbar";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  // Check if user is admin on mount
  // useEffect(() => {
  //   const checkAdminAccess = () => {
  //     try {
  //       const savedUser = localStorage.getItem("user");
  //       if (savedUser) {
  //         const user = JSON.parse(savedUser);
  //         if (user.role !== "admin") {
  //           // Not admin, redirect to home
  //           navigate("/", { replace: true });
  //         }
  //       } else {
  //         // No user, redirect to login
  //         navigate("/login", { replace: true });
  //       }
  //     } catch (error) {
  //       console.error("Error checking admin access:", error);
  //       navigate("/login", { replace: true });
  //     }
  //   };

  //   checkAdminAccess();
  // }, [navigate]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <AdminSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminNavbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        
        <div className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;