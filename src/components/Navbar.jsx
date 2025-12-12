import React, { useContext, useState, useEffect, useRef } from "react";
import { Link, NavLink } from "react-router-dom";

import { ProductContext } from "../context/Productcontext";
import { CartContext } from "../context/Cartcontext";
import { WishlistContext } from "../context/Wishlistcontext";
import { AuthContext } from "../context/AuthContext";

// Import React Icons
import { 
  FaRegHeart, 
  FaSearch, 
  FaShoppingCart, 
  FaUser, 
  FaTimes, 
  FaBars,
  FaChevronLeft,
  FaHome,
  FaBox,
  FaInfoCircle,
  FaEnvelope,
  FaUserPlus
} from "react-icons/fa";

// Import your logo asset
import { assets } from "../../public/Images/products/assets";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const searchRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Contexts
  const { setShowSearch, setSearch, search } = useContext(ProductContext);
  const { getCartCount } = useContext(CartContext);
  const { wishlist } = useContext(WishlistContext);
  const { user, logout } = useContext(AuthContext);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchFocused(false);
        setShowSearch(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setShowSearch]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && 
          !mobileMenuRef.current.contains(event.target) &&
          !event.target.closest('button[aria-label="Menu"]')) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileMenuOpen]);

  const getUserDisplayName = () => {
    if (!user) return "Guest";
    return user.name || user.username || user.email?.split('@')[0] || "User";
  };

  const handleSearchClick = () => {
    setSearchFocused(true);
    setShowSearch(true);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="sticky top-0 left-0 right-0 bg-white shadow-sm z-50 border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14 md:h-16">
            
            {/* LOGO */}
            <Link to="/" className="flex-shrink-0">
              <img 
                src={assets.logo} 
                className="h-6 md:h-8 w-auto" 
                alt="Brand Logo" 
                loading="eager"
                width={120}
                height={32}
              />
            </Link>

            {/* DESKTOP NAVIGATION - Center */}
            <div className="hidden md:flex items-center justify-center flex-1 max-w-xl mx-8">
              <div className="flex space-x-6 lg:space-x-8">
                <NavLink 
                  to="/" 
                  className={({ isActive }) => 
                    `text-xs lg:text-sm font-medium transition-colors duration-200 px-1 ${
                      isActive 
                        ? "text-black border-b-2 border-black" 
                        : "text-gray-600 hover:text-black"
                    }`
                  }
                >
                  HOME
                </NavLink>
                <NavLink 
                  to="/collection" 
                  className={({ isActive }) => 
                    `text-xs lg:text-sm font-medium transition-colors duration-200 px-1 ${
                      isActive 
                        ? "text-black border-b-2 border-black" 
                        : "text-gray-600 hover:text-black"
                    }`
                  }
                >
                  COLLECTION
                </NavLink>
                <NavLink 
                  to="/about" 
                  className={({ isActive }) => 
                    `text-xs lg:text-sm font-medium transition-colors duration-200 px-1 ${
                      isActive 
                        ? "text-black border-b-2 border-black" 
                        : "text-gray-600 hover:text-black"
                    }`
                  }
                >
                  ABOUT
                </NavLink>
                <NavLink 
                  to="/contact" 
                  className={({ isActive }) => 
                    `text-xs lg:text-sm font-medium transition-colors duration-200 px-1 ${
                      isActive 
                        ? "text-black border-b-2 border-black" 
                        : "text-gray-600 hover:text-black"
                    }`
                  }
                >
                  CONTACT
                </NavLink>
              </div>
            </div>

            {/* RIGHT SIDE ICONS - Desktop */}
            <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
              {/* Search Icon */}
              <div ref={searchRef} className="relative">
                {searchFocused ? (
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={search || ''}
                      onChange={handleSearchChange}
                      className="w-48 lg:w-64 px-4 py-2 pl-10 pr-8 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      autoFocus
                    />
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                    <button
                      onClick={() => {
                        setSearchFocused(false);
                        setShowSearch(false);
                        setSearch('');
                      }}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      aria-label="Close search"
                    >
                      <FaTimes size={12} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleSearchClick}
                    className="p-2 hover:text-black transition-colors"
                    aria-label="Search"
                  >
                    <FaSearch size={18} className="text-gray-700" />
                  </button>
                )}
              </div>

              {/* Wishlist */}
              <Link 
                to="/wishlist" 
                className="relative p-2 hover:text-black transition-colors"
                aria-label="Wishlist"
              >
                <FaRegHeart size={18} className="text-gray-700" />
                {wishlist?.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                    {wishlist.length > 9 ? '9+' : wishlist.length}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link 
                to="/cart" 
                className="relative p-2 hover:text-black transition-colors"
                aria-label="Cart"
              >
                <FaShoppingCart size={18} className="text-gray-700" />
                {getCartCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                    {getCartCount() > 9 ? '9+' : getCartCount()}
                  </span>
                )}
              </Link>

              {/* User Profile */}
              <div className="relative group">
                <button 
                  className="p-2 hover:text-black transition-colors flex items-center gap-1"
                  aria-label="User menu"
                >
                  <FaUser size={18} className="text-gray-700" />
                  <span className="text-xs text-gray-600 hidden lg:inline">
                    {getUserDisplayName().split(' ')[0]}
                  </span>
                </button>
                
                <div className="absolute right-0 top-full pt-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 z-50">
                  <div className="w-48 bg-white shadow-xl border border-gray-200 rounded-lg py-2">
                    {user ? (
                      <>
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-semibold">Hi, {getUserDisplayName()}</p>
                          <p className="text-xs text-gray-500 mt-1">{user.email}</p>
                        </div>
                        <Link
                          to="/orders"
                          className="block px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors"
                        >
                          My Orders
                        </Link>
                        <Link
                          to="/profile"
                          className="block px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors"
                        >
                          Profile Settings
                        </Link>
                        <button
                          onClick={logout}
                          className="block w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors border-t border-gray-100"
                        >
                          Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/login"
                          className="block px-4 py-3 text-sm hover:bg-gray-50 transition-colors"
                        >
                          Login
                        </Link>
                        <Link
                          to="/register"
                          className="block px-4 py-3 text-sm hover:bg-gray-50 transition-colors border-t border-gray-100"
                        >
                          Create Account
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* MOBILE MENU BUTTON */}
            <div className="flex md:hidden items-center space-x-4">
              {/* Mobile Search */}
              <button
                onClick={handleSearchClick}
                className="p-2"
                aria-label="Search"
              >
                <FaSearch size={18} className="text-gray-700" />
              </button>

              {/* Mobile Cart */}
              <Link to="/cart" className="relative p-2" aria-label="Cart">
                <FaShoppingCart size={18} className="text-gray-700" />
                {getCartCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                    {getCartCount()}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2"
                aria-label="Menu"
              >
                {mobileMenuOpen ? (
                  <FaTimes size={20} className="text-gray-700" />
                ) : (
                  <FaBars size={20} className="text-gray-700" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* MOBILE SEARCH OVERLAY */}
      {searchFocused && (
        <div className="md:hidden fixed inset-0 bg-white z-50 p-4 pt-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Search Products</h2>
            <button
              onClick={() => {
                setSearchFocused(false);
                setShowSearch(false);
                setSearch('');
              }}
              className="p-2 text-gray-600 hover:text-black"
              aria-label="Close search"
            >
              <FaTimes size={20} />
            </button>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="What are you looking for?"
              value={search || ''}
              onChange={handleSearchChange}
              className="w-full px-4 py-3 pl-12 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              autoFocus
            />
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>
          {search && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                Search results for: <span className="font-semibold">{search}</span>
              </p>
            </div>
          )}
        </div>
      )}

      {/* MOBILE MENU OVERLAY */}
      <div
        ref={mobileMenuRef}
        className={`md:hidden fixed inset-0 bg-white z-40 transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 border-b bg-gray-50 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                <FaUser size={20} className="text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-800">
                  {user ? getUserDisplayName() : "Welcome"}
                </p>
                {user && (
                  <p className="text-xs text-gray-600">{user.email}</p>
                )}
              </div>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-gray-600 hover:text-black"
              aria-label="Close menu"
            >
              <FaTimes size={20} />
            </button>
          </div>

          {/* Mobile Navigation Links */}
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="space-y-1 px-4">
              <NavLink
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center py-3 px-4 rounded-lg text-base font-medium ${
                    isActive
                      ? "bg-black text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                <FaHome className="mr-3" />
                Home
              </NavLink>
              <NavLink
                to="/collection"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center py-3 px-4 rounded-lg text-base font-medium ${
                    isActive
                      ? "bg-black text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                <FaBox className="mr-3" />
                Collection
              </NavLink>
              <NavLink
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center py-3 px-4 rounded-lg text-base font-medium ${
                    isActive
                      ? "bg-black text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                <FaInfoCircle className="mr-3" />
                About
              </NavLink>
              <NavLink
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center py-3 px-4 rounded-lg text-base font-medium ${
                    isActive
                      ? "bg-black text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                <FaEnvelope className="mr-3" />
                Contact
              </NavLink>
              
              {/* Additional Mobile Links */}
              <div className="pt-4 mt-4 border-t">
                <Link
                  to="/wishlist"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between py-3 px-4 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  <div className="flex items-center">
                    <FaRegHeart className="mr-3" />
                    <span className="text-base font-medium">Wishlist</span>
                  </div>
                  {wishlist?.length > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                      {wishlist.length > 9 ? '9+' : wishlist.length}
                    </span>
                  )}
                </Link>
                <Link
                  to="/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center py-3 px-4 text-gray-700 hover:bg-gray-100 rounded-lg text-base font-medium"
                >
                  <FaBox className="mr-3" />
                  My Orders
                </Link>
              </div>
            </nav>
          </div>

          {/* Auth Actions */}
          <div className="border-t p-6 bg-gray-50">
            {user ? (
              <>
                <button
                  onClick={handleLogout}
                  className="w-full py-3 px-4 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors mb-3"
                >
                  Logout
                </button>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full py-3 px-4 border border-gray-300 text-gray-800 text-center rounded-lg font-medium hover:bg-white transition-colors"
                >
                  Profile Settings
                </Link>
              </>
            ) : (
              <div className="space-y-3">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full py-3 px-4 bg-black text-white text-center rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center w-full py-3 px-4 border border-black text-black text-center rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  <FaUserPlus className="mr-2" />
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;