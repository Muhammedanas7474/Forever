import React, { useContext, useEffect, useState } from "react";
import { WishlistContext } from "../context/Wishlistcontext";
import { ProductContext } from "../context/Productcontext";
import { CartContext } from "../context/Cartcontext";
import Title from "../components/Title";
import { Link, useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart, FaShoppingBag } from "react-icons/fa";

const Wishlist = () => {
  const navigate = useNavigate();

  const { wishlist, loading, loadWishlist, toggleWishlist } =
    useContext(WishlistContext);

  const { products } = useContext(ProductContext);

  const { addToCart } = useContext(CartContext);

  const [displayWishlist, setDisplayWishlist] = useState([]);

  // -------------------------------
  // LOAD WISHLIST DATA
  // -------------------------------
  useEffect(() => {
  loadWishlist();   // load once
}, []);

// Recalculate formatted items when wishlist updates
useEffect(() => {
  formatWishlist(wishlist);
}, [wishlist]);


  // -------------------------------
  // FORMAT WISHLIST ITEMS
  // -------------------------------
  const formatWishlist = (items) => {
    const formatted = items.map((item) => ({
      id: item.product.id,
      name: item.product.name,
      price: item.product.price,
      description: item.product.description,
      category: item.product.category?.name || "Uncategorized",
      images: item.product.images || [],
    }));

    setDisplayWishlist(formatted);
  };

  // -------------------------------
  // ADD TO CART FROM WISHLIST
  // -------------------------------
  // const handleAddToCart = (productId, e) => {
  //   e.preventDefault();
  //   addToCart(productId, "M", 1); // default size
  // };

  // -------------------------------
  // Get Product Image
  // -------------------------------
  const getProductImage = (product) => {
    if (Array.isArray(product.images) && product.images.length > 0) {
      return product.images[0].url || "/Images/no-image.png";
    }
    return "/Images/no-image.png";
  };

  // -------------------------------
  // Loading Screen
  // -------------------------------
  if (loading) {
    return (
      <div className="border-t pt-14 px-4">
        <div className="text-2xl mb-3">
          <Title text1={"YOUR"} text2={"WISHLIST"} />
        </div>
        <div className="py-20 text-center">
          <p className="text-gray-500">Loading wishlist...</p>
        </div>
      </div>
    );
  }

  // -------------------------------
  // Main UI
  // -------------------------------
  return (
    <div className="border-t pt-14 px-4">
      <div className="text-2xl mb-3">
        <Title text1={"YOUR"} text2={"WISHLIST"} />
      </div>

      {displayWishlist.length === 0 ? (
        <div className="py-20 text-center">
          <FaRegHeart className="text-gray-300 text-5xl mx-auto mb-4" />
          <p className="text-gray-500 mb-2">Your wishlist is empty</p>

          <button
            onClick={() => navigate("/collection")}
            className="bg-black text-white text-sm px-6 py-2 mt-4"
          >
            CONTINUE SHOPPING
          </button>
        </div>
      ) : (
        <>
          {/* Wishlist Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayWishlist.map((product) => (
              <div key={product.id} className="relative group">
                <Link
                  className="text-gray-700 cursor-pointer block"
                  to={`/products/${product.id}`}
                >
                  <div className="relative overflow-hidden">
                    {/* Remove From Wishlist */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleWishlist(product.id);
                      }}
                      className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:scale-110 transition z-10"
                    >
                      <FaHeart className="text-red-500 text-lg" />
                    </button>

                    {/* Add To Cart */}
                    <button
                      onClick={(e) => handleAddToCart(product.id, e)}
                      className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    >
                      <FaShoppingBag className="text-gray-700 text-lg" />
                    </button>

                    {/* Product Image */}
                    <img
                      className="w-full h-80 object-cover group-hover:scale-105 transition ease-in-out"
                      src={getProductImage(product)}
                      alt={product.name}
                    />
                  </div>

                  <div className="py-3">
                    <p className="text-sm font-medium truncate">{product.name}</p>
                    <p className="text-sm font-medium">${product.price}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {/* Bottom Buttons */}
          <div className="flex justify-between items-center mt-12 border-t pt-6">
            <button
              onClick={() => navigate("/collection")}
              className="border border-black text-black text-sm px-6 py-2"
            >
              CONTINUE SHOPPING
            </button>

            <button
              onClick={() => navigate("/cart")}
              className="bg-black text-white text-sm px-8 py-3"
            >
              VIEW CART
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Wishlist;
