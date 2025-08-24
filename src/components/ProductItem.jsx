import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom'
import { FaRegHeart, FaHeart } from "react-icons/fa";

const ProductItem = ({ id, image, name, price }) => {
  const { currency, wishlistItems, toggleWishlist } = useContext(ShopContext)
  const isInWishlist = wishlistItems.includes(id)

  const handleWishlistClick = (e) => {
    e.preventDefault()
    toggleWishlist(id)
  }

  // ✅ Handle image safely (string or array)
  const productImage =
    Array.isArray(image) && image.length > 0
      ? image[0]
      : typeof image === "string"
      ? image
      : "/Images/no-image.png" // fallback image

  return (
    <Link
      className="text-grey-700 cursor-pointer block group"
      to={`/products/${id}`}
    >
      <div className="relative overflow-hidden">
        {/* Wishlist Icon */}
        <button
          onClick={handleWishlistClick}
          className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:scale-110 transition z-10"
          aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          {isInWishlist ? (
            <FaHeart className="text-red-500 text-lg" />
          ) : (
            <FaRegHeart className="text-gray-500 text-lg" />
          )}
        </button>

        {/* ✅ Safe image rendering */}
        <img
          className="w-full h-110 object-cover group-hover:scale-105 transition ease-in-out"
          src={productImage}
          alt={name || "Product"}
        />
      </div>
      <div className="py-3">
        <p className="pt-3 pb-1 text-sm truncate">{name || "Unnamed Product"}</p>
        <p className="text-sm font-medium">
          {currency}
          {price ?? "N/A"}
        </p>
      </div>
    </Link>
  )
}

export default ProductItem
