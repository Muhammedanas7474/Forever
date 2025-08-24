import React, { useState, useContext, useEffect, useRef } from 'react';
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
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const AdminNavbar = ({ 
  toggleSidebar, 
  isSidebarOpen, 
  userData, 
  notifications = [], 
  messages = [] 
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [messagesOpen, setMessagesOpen] = useState(false);
  const { logout } = useContext(AuthContext); 

  // Refs for dropdowns
  const profileRef = useRef(null);
  const notificationsRef = useRef(null);
  const messagesRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        profileRef.current && !profileRef.current.contains(e.target) &&
        notificationsRef.current && !notificationsRef.current.contains(e.target) &&
        messagesRef.current && !messagesRef.current.contains(e.target)
      ) {
        setIsProfileOpen(false);
        setNotificationsOpen(false);
        setMessagesOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Calculate unread counts
  const unreadNotificationsCount = notifications.filter(n => !n.read).length;
  const unreadMessagesCount = messages.length;

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
  };

  return (
    <nav className="bg-white shadow-md py-3 px-6 flex items-center justify-between">
      {/* Left side */}
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

      {/* Right side */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <div className="relative" ref={notificationsRef}>
          <button 
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              setMessagesOpen(false);
              setIsProfileOpen(false);
            }}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 relative"
          >
            <FiBell size={20} />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                {unreadNotificationsCount}
              </span>
            )}
          </button>
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50 border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-800">Notifications</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map(notification => (
                    <div 
                      key={notification.id} 
                      className={`p-4 border-b border-gray-100 hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}
                    >
                      <p className="text-sm font-medium text-gray-800">{notification.text}</p>
                      <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">No notifications</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Messages */}
        <div className="relative" ref={messagesRef}>
          <button 
            onClick={() => {
              setMessagesOpen(!messagesOpen);
              setNotificationsOpen(false);
              setIsProfileOpen(false);
            }}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 relative"
          >
            <FiMessageSquare size={20} />
            {unreadMessagesCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-indigo-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                {unreadMessagesCount}
              </span>
            )}
          </button>
          {messagesOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50 border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-800">Messages</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {messages.length > 0 ? (
                  messages.map(message => (
                    <div key={message.id} className="p-4 border-b border-gray-100 hover:bg-gray-50">
                      <p className="text-sm font-medium text-gray-800">{message.sender}</p>
                      <p className="text-sm text-gray-600 truncate">{message.text}</p>
                      <p className="text-xs text-gray-500 mt-1">{message.time}</p>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">No messages</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button 
            onClick={() => {
              setIsProfileOpen(!isProfileOpen);
              setMessagesOpen(false);
              setNotificationsOpen(false);
            }}
            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
          >
            {userData?.avatar ? (
              <img src={userData.avatar} alt={userData.name} className="w-8 h-8 rounded-full object-cover" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-medium">
                {userData?.name?.charAt(0) || 'U'}
              </div>
            )}
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-gray-800">{userData?.name || 'User'}</p>
              <p className="text-xs text-gray-500 capitalize">{userData?.role || 'user'}</p>
            </div>
            <FiChevronDown className="text-gray-500" />
          </button>
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-50 border border-gray-200 py-1">
              <div className="px-4 py-2 border-b border-gray-200">
                <p className="text-sm font-medium text-gray-800">{userData?.name || 'User'}</p>
                <p className="text-xs text-gray-500 truncate">{userData?.email || ''}</p>
              </div>
              <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <FiUser className="mr-3" /> My Profile
              </a>
              <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <FiSettings className="mr-3" /> Settings
              </a>
              <div className="border-t border-gray-200"></div>
              <Link to="/login"
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                <FiLogOut className="mr-3" /> Logout
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
