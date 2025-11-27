import React, { useContext, useState } from "react";
import { Link, NavLink } from "react-router-dom";

import { ProductContext } from "../context/Productcontext";
import { CartContext } from "../context/Cartcontext";
import { WishlistContext } from "../context/Wishlistcontext";
import { AuthContext } from "../context/AuthContext";

import { assets } from "../../public/Images/products/assets";
import { FaRegHeart } from "react-icons/fa";

const Navbar = () => {
  const [visible, setVisible] = useState(false);

  // PRODUCT CONTEXT — Search bar
  const { ShowSearch, setShowSearch, setSearch } = useContext(ProductContext);

  // CART CONTEXT — Cart count
  const { getCartCount } = useContext(CartContext);

  // WISHLIST CONTEXT — Wishlist count
  const { wishlist } = useContext(WishlistContext);

  // AUTH CONTEXT — User data
  const { user, logout } = useContext(AuthContext);

  const getUserDisplayName = () => {
    if (!user) return "";
    return user.name || user.username || "User";
  };

  return (
    <div className="flex items-center justify-between p-6 font-medium relative z-50">
      
      {/* LOGO */}
      <Link to="/">
        <img src={assets.logo} className="w-36" alt="logo" />
      </Link>

      {/* MENU LINKS */}
      <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
        <NavLink to="/" className="flex flex-col items-center gap-1">
          <p>HOME</p>
        </NavLink>
        <NavLink to="/collection" className="flex flex-col items-center gap-1">
          <p>COLLECTION</p>
        </NavLink>
        <NavLink to="/about" className="flex flex-col items-center gap-1">
          <p>ABOUT</p>
        </NavLink>
        <NavLink to="/contact" className="flex flex-col items-center gap-1">
          <p>CONTACT</p>
        </NavLink>
      </ul>

      {/* RIGHT SIDE ICONS */}
      <div className="flex items-center gap-6">

        {/* Search Bar */}
        {ShowSearch && (
          <input
            type="text"
            placeholder="Search products..."
            className="border rounded px-2 py-1 text-sm"
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
        )}

        {/* Search Icon */}
        <img
          onClick={() => setShowSearch(!ShowSearch)}
          src={assets.search_icon}
          className="w-5 cursor-pointer"
        />

        {/* Wishlist */}
        <Link to="/wishlist" className="relative">
          <FaRegHeart className="text-gray-700 w-5 h-5 cursor-pointer" />
          {wishlist?.length > 0 && (
            <span className="absolute -right-2 -top-2 bg-black text-white rounded-full text-[10px] px-[6px]">
              {wishlist.length}
            </span>
          )}
        </Link>

        {/* Cart */}
        <Link to="/cart" className="relative">
          <img src={assets.cart_icon} className="w-5" />
          <p className="absolute -right-2 -bottom-2 bg-black text-white w-4 h-4 text-[10px] rounded-full flex items-center justify-center">
            {getCartCount() || 0}
          </p>
        </Link>

        {/* PROFILE DROPDOWN */}
        <div className="group relative">
          <img className="w-5 cursor-pointer" src={assets.profile_icon} />

          <div className="group-hover:block hidden absolute right-0 top-full pt-2 z-50">
            <div className="flex flex-col gap-2 w-40 py-3 px-5 bg-white shadow-lg border rounded text-gray-600">

              {user ? (
                <>
                  <p className="text-sm">Hi, {getUserDisplayName()}</p>
                  <Link to="/orders" className="hover:text-black text-sm">
                    Orders
                  </Link>
                  <button
                    onClick={logout}
                    className="text-left hover:text-black text-sm"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="hover:text-black text-sm">
                    Login
                  </Link>
                  <Link to="/login" className="hover:text-black text-sm">
                    Create Account
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* MOBILE MENU BUTTON */}
        <img
          onClick={() => setVisible(true)}
          src={assets.menu_icon}
          className="w-5 cursor-pointer sm:hidden"
        />
      </div>

      {/* MOBILE MENU */}
      <div
        className={`absolute top-0 right-0 bottom-0 bg-white transition-all ${
          visible ? "w-full" : "w-0"
        } sm:hidden`}
      >
        <div className="flex flex-col text-gray-600">

          {/* BACK BUTTON */}
          <div
            onClick={() => setVisible(false)}
            className="flex items-center gap-4 p-3 cursor-pointer border-b"
          >
            <img src={assets.dropdown_icon} className="h-4 rotate-180" />
            <p>Back</p>
          </div>

          {/* NAV LINKS */}
          <NavLink onClick={() => setVisible(false)} className="py-3 pl-6 border-b" to="/">
            Home
          </NavLink>
          <NavLink onClick={() => setVisible(false)} className="py-3 pl-6 border-b" to="/collection">
            Collection
          </NavLink>
          <NavLink onClick={() => setVisible(false)} className="py-3 pl-6 border-b" to="/about">
            About
          </NavLink>
          <NavLink onClick={() => setVisible(false)} className="py-3 pl-6 border-b" to="/contact">
            Contact
          </NavLink>
          <NavLink onClick={() => setVisible(false)} className="py-3 pl-6 border-b" to="/wishlist">
            Wishlist
          </NavLink>

          {/* AUTH LINKS */}
          {user ? (
            <>
              <div className="py-3 pl-6 border-b text-sm">Hi, {getUserDisplayName()}</div>
              <NavLink
                onClick={() => setVisible(false)}
                to="/orders"
                className="py-3 pl-6 border-b"
              >
                Orders
              </NavLink>

              <button
                onClick={() => {
                  logout();
                  setVisible(false);
                }}
                className="py-3 pl-6 border-b text-left"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                onClick={() => setVisible(false)}
                className="py-3 pl-6 border-b"
                to="/login"
              >
                Login
              </NavLink>
              <NavLink
                onClick={() => setVisible(false)}
                className="py-3 pl-6 border-b"
                to="/login"
              >
                Create Account
              </NavLink>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
