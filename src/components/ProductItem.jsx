import React, { useContext } from 'react';
import { WishlistContext } from '../context/Wishlistcontext';
import { ProductContext } from '../context/Productcontext';
import { Link } from 'react-router-dom';
import { FaRegHeart, FaHeart } from "react-icons/fa";

const ProductItem = ({ id, image, name, price }) => {
  
  const { isInWishlist, toggleWishlist } = useContext(WishlistContext);

  // Currency comes from ProductContext (or you can hardcode "$")
  const { } = useContext(ProductContext);
  const currency = "$"; // add your custom currency

  const handleWishlistClick = (e) => {
    e.preventDefault();
    toggleWishlist(id);
  };

  // --------------------------------------------------------------------
  // FIXED: Standardized image handling for Django backend
  // --------------------------------------------------------------------
  const getProductImage = () => {
    // If `image` is an array from backend (images = [ { url }, { url } ])
    if (Array.isArray(image) && image.length > 0) {
      return image[0].url || "/Images/no-image.png";
    }

    // If image is a single object with a url
    if (image && typeof image === "object" && image.url) {
      return image.url;
    }

    // If image is already a string URL
    if (typeof image === "string" && image) {
      return image;
    }

    // Default
    return "/Images/no-image.png";
  };

  const productImage = getProductImage();

  return (
    <Link
      className="text-grey-700 cursor-pointer block group"
      to={`/products/${id}`}
    >
      <div className="relative overflow-hidden">

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:scale-110 transition z-10"
          aria-label={isInWishlist(id) ? "Remove from wishlist" : "Add to wishlist"}
        >
          {isInWishlist(id) ? (
            <FaHeart className="text-red-500 text-lg" />
          ) : (
            <FaRegHeart className="text-gray-500 text-lg" />
          )}
        </button>

        {/* Product Image */}
        <img
          className="w-full h-110 object-cover group-hover:scale-105 transition ease-in-out"
          src={productImage}
          alt={name || "Product"}
          onError={(e) => {
            e.target.src = "/Images/no-image.png";
          }}
        />
      </div>

      {/* Product Info */}
      <div className="py-3">
        <p className="pt-3 pb-1 text-sm truncate">{name || "Unnamed Product"}</p>
        <p className="text-sm font-medium">
          {currency}{price ?? "N/A"}
        </p>
      </div>

    </Link>
  );
};

export default ProductItem;
