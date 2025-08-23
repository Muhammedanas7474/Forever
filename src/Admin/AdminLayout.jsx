import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./Componets/Sidebar";
import AdminNavbar from "./Componets/Navbar";


const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
     
      <AdminSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        <AdminNavbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen}/>
        
        <div className="flex-1 overflow-y-auto p-6">
          <Outlet /> {/* This will render the Dashboard component */}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;