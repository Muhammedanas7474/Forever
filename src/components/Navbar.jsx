import React, { useContext, useState } from "react";
// import { assets } from "../assets/frontend_assets/assets";
import { Link, NavLink } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { AuthContext } from "../context/AuthContext";
import { assets } from "../../public/Images/products/assets";
import { FaRegHeart } from "react-icons/fa";



const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const { ShowSearch, setShowSearch, getCartCount, setSearch } = useContext(ShopContext);
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="flex items-center justify-between p-6 font-medium">
      <Link to="/">
        <img src={assets.logo} className="w-36" alt="" />
      </Link>

      <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
        <NavLink to="/" className="flex flex-col items-center gap-1">
          <p>HOME</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/collection" className="flex flex-col items-center gap-1">
          <p>COLLECTION</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/about" className="flex flex-col items-center gap-1">
          <p>ABOUT</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/contact" className="flex flex-col items-center gap-1">
          <p>CONTACT</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
      </ul>

      <div className="flex items-center gap-6">
        {/* Search Input */}
        {ShowSearch && (
          <input
            type="text"
            placeholder="Search products..."
            className="border rounded px-2 py-1 text-sm"
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
        )}

        <img
          onClick={() => setShowSearch(!ShowSearch)}
          src={assets.search_icon}
          className="w-5 cursor-pointer"
          alt="search"
        />
        {/* Wishlist Icon */}
        <Link to="/wishlist" className="relative">
          <FaRegHeart className="text-gray-700 w-5 h-5 cursor-pointer" />
          {/* Optional: Add wishlist count badge similar to cart */}
          {/* <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
            {wishlistCount || 0}
          </p> */}
        </Link>

        <Link to="/cart" className="relative">
          <img src={assets.cart_icon} className="w-5" alt="" />
          <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
            {getCartCount() || 0}
          </p>
        </Link>

        <div className="group relative">
          <Link to="/login">
            <img
              className="w-5 cursor-pointer"
              src={assets.profile_icon}
              alt=""
            />
          </Link>
          <div className="group-hover:block hidden absolute right-0 pt-4 z-10">
            <div className="flex flex-col gap-2 w-40 py-3 px-5 bg-slate-100 text-gray-600 rounded">
              {user ? (
                <>
                  <Link to='/settings'>
                  <p className="text-sm hover:text-black">Hi, {user.name}</p>
                  </Link>
                  <Link to="/orders" className="hover:text-black">
                    Orders
                  </Link>
                  <button
                    onClick={logout}
                    className="text-left hover:text-black"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="hover:text-black">
                    Login
                  </Link>
                  <Link to="/login" className="hover:text-black">
                    Create account
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        

        <img
          onClick={() => setVisible(true)}
          src={assets.menu_icon}
          className="w-5 cursor-pointer sm:hidden"
          alt=""
        />
      </div>

      {/* mobile menu */}
      <div
        className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${
          visible ? "w-full" : "w-0"
        }`}
      >
        <div className="flex flex-col text-gray-600">
          <div
            onClick={() => setVisible(false)}
            className="flex items-center gap-4 p-3 cursor-pointer"
          >
            <img src={assets.dropdown_icon} className="h-4 rotate-180" alt="" />
            <p>Back</p>
          </div>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/"
          >
            Home
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/collection"
          >
            Collection
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/about"
          >
            About
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/contact"
          >
            Contact
          </NavLink>
          {/* Add Wishlist to mobile menu */}
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/wishlist"
          >
            Wishlist
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Navbar;