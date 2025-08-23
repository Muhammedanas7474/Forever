import React, { useState } from 'react';
import { 
  FiBell, 
  FiMessageSquare, 
  FiSearch, 
  FiLogOut, 
  FiUser, 
  FiSettings,
  FiChevronDown,
  FiMenu,
  FiX
} from 'react-icons/fi';

const AdminNavbar = ({ toggleSidebar, isSidebarOpen }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [messagesOpen, setMessagesOpen] = useState(false);

  const userData = {
    name: "Alex Morgan",
    email: "alex@fashionflair.com",
    role: "Store Manager",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1287&q=80"
  };

  const notifications = [
    { id: 1, text: "New order received", time: "10 mins ago", read: false },
    { id: 2, text: "Payment of $234 completed", time: "1 hour ago", read: false },
    { id: 3, text: "Inventory low on summer dresses", time: "5 hours ago", read: true },
    { id: 4, text: "New customer registered", time: "Yesterday", read: true }
  ];

  const messages = [
    { id: 1, text: "When will my order ship?", sender: "Customer #4829", time: "10:42 AM" },
    { id: 2, text: "Do you have this in size M?", sender: "Customer #5712", time: "9:15 AM" },
    { id: 3, text: "Exchange request for order #2841", sender: "Customer #3394", time: "Yesterday" }
  ];

  return (
    <nav className="bg-white shadow-md py-3 px-6 flex items-center justify-between">
      {/* Left side - Toggle sidebar and search */}
      <div className="flex items-center">
        <button 
          onClick={toggleSidebar}
          className="p-2 rounded-lg mr-4 text-gray-600 hover:bg-gray-100 lg:hidden"
        >
          {isSidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>
        
        <div className="relative hidden md:block">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Right side - Icons and profile */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              setMessagesOpen(false);
            }}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 relative"
          >
            <FiBell size={20} />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
              3
            </span>
          </button>
          
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50 border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-800">Notifications</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.map(notification => (
                  <div 
                    key={notification.id} 
                    className={`p-4 border-b border-gray-100 hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}
                  >
                    <p className="text-sm font-medium text-gray-800">{notification.text}</p>
                    <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-gray-200 text-center">
                <button className="text-sm text-indigo-600 font-medium hover:text-indigo-800">
                  Mark all as read
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Messages */}
        <div className="relative">
          <button 
            onClick={() => {
              setMessagesOpen(!messagesOpen);
              setNotificationsOpen(false);
            }}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 relative"
          >
            <FiMessageSquare size={20} />
            <span className="absolute -top-1 -right-1 bg-indigo-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
              2
            </span>
          </button>
          
          {messagesOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50 border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-800">Messages</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {messages.map(message => (
                  <div key={message.id} className="p-4 border-b border-gray-100 hover:bg-gray-50">
                    <p className="text-sm font-medium text-gray-800">{message.sender}</p>
                    <p className="text-sm text-gray-600 truncate">{message.text}</p>
                    <p className="text-xs text-gray-500 mt-1">{message.time}</p>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-gray-200 text-center">
                <button className="text-sm text-indigo-600 font-medium hover:text-indigo-800">
                  View all messages
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile dropdown */}
        <div className="relative">
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
          >
            <img 
              src={userData.avatar} 
              alt={userData.name} 
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-gray-800">{userData.name}</p>
              <p className="text-xs text-gray-500">{userData.role}</p>
            </div>
            <FiChevronDown className="text-gray-500" />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-50 border border-gray-200 py-1">
              <div className="px-4 py-2 border-b border-gray-200">
                <p className="text-sm font-medium text-gray-800">{userData.name}</p>
                <p className="text-xs text-gray-500 truncate">{userData.email}</p>
              </div>
              
              <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <FiUser className="mr-3" />
                My Profile
              </a>
              
              <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <FiSettings className="mr-3" />
                Settings
              </a>
              
              <div className="border-t border-gray-200"></div>
              
              <button className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                <FiLogOut className="mr-3" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;