import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom'
import Title from '../components/Title'
import { FaHeart, FaRegHeart, FaShoppingBag } from "react-icons/fa"

const Wishlist = () => {
  const { 
    products, 
    currency, 
    wishlistItems, 
    toggleWishlist, 
    addToCartFromWishlist,
    navigate 
  } = useContext(ShopContext)
  
  const [wishlistData, setWishlistData] = useState([])

  useEffect(() => {
    // Get wishlist product details
    if (wishlistItems && products) {
      const wishlistProducts = products.filter(product => 
        wishlistItems.includes(product._id)
      )
      setWishlistData(wishlistProducts)
    }
  }, [wishlistItems, products])

  const handleAddToCart = (productId, e) => {
    e.preventDefault()
    addToCartFromWishlist(productId, 'M', 1)
  }

  return (
    <div className="border-t pt-14 px-4">
      <div className="text-2xl mb-3">
        <Title text1={'YOUR'} text2={'WISHLIST'}/>
      </div>

      {wishlistData.length === 0 ? (
        <div className="py-20 text-center">
          <FaRegHeart className="text-gray-300 text-5xl mx-auto mb-4" />
          <p className="text-gray-500 mb-2">Your wishlist is empty</p>
          <button 
            onClick={() => navigate('/products')}
            className="bg-black text-white text-sm px-6 py-2 mt-4"
          >
            CONTINUE SHOPPING
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistData.map((product) => (
              <div key={product._id} className="relative group">
                <Link 
                  className="text-gray-700 cursor-pointer block"
                  to={`/products/${product._id}`}
                >
                  <div className="relative overflow-hidden">
                    {/* Wishlist Icon */}
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        toggleWishlist(product._id)
                      }}
                      className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:scale-110 transition z-10"
                    >
                      <FaHeart className="text-red-500 text-lg" />
                    </button>
                    
                    {/* Add to Cart Button */}
                    <button
                      onClick={(e) => handleAddToCart(product._id, e)}
                      className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    >
                      <FaShoppingBag className="text-gray-700 text-lg" />
                    </button>

                    <img 
                      className="w-full h-80 object-cover group-hover:scale-105 transition ease-in-out" 
                      src={product.image[0]} 
                      alt={product.name} 
                    />
                  </div>
                  <div className="py-3">
                    <p className="text-sm font-medium truncate">{product.name}</p>
                    <p className="text-sm font-medium">{currency}{product.price}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
          
          <div className="flex justify-between items-center mt-12 border-t pt-6">
            <button 
              onClick={() => navigate('/')}
              className="border border-black text-black text-sm px-6 py-2"
            >
              CONTINUE SHOPPING
            </button>
            
            <button 
              onClick={() => navigate('/cart')}
              className="bg-black text-white text-sm px-8 py-3"
            >
              VIEW CART
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default Wishlist