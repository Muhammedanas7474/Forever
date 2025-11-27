import React, { useContext } from "react";
import { CartContext } from "../context/Cartcontext";
import { ProductContext } from "../context/Productcontext";
import { AuthContext } from "../context/AuthContext";
import CartTotal from "../components/CartTotal";
import Title from "../components/Title";
import { useNavigate } from "react-router-dom";
import { assets } from "../../public/Images/products/assets";

const Cart = () => {
  const navigate = useNavigate();

  const { cart, updateCartQuantity, removeFromCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const currency = "$";

  // Get first product image
  const getImage = (images) => {
    if (Array.isArray(images) && images.length > 0) {
      return images[0].url || "/Images/no-image.png";
    }
    return "/Images/no-image.png";
  };

  return (
    <div className="border-t pt-14 px-4">
      <div className="text-2xl mb-3">
        <Title text1={"YOUR"} text2={"CART"} />
      </div>

      {/* Guest Cart Warning */}
      {!user && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
          💡 <strong>Guest Cart</strong> — Your cart is saved locally.
          <button
            onClick={() => navigate("/login")}
            className="ml-1 underline text-blue-600 hover:text-blue-800"
          >
            Login
          </button>
          to sync your cart with your account.
        </div>
      )}

      {/* CART EMPTY */}
      {cart.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          Your cart is empty.
        </div>
      ) : (
        <>
          {/* CART ITEMS */}
          {cart.map((item) => (
            <div
              key={item.id}
              className="py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4"
            >
              {/* PRODUCT INFO */}
              <div className="flex items-start gap-6">
                <img
                  className="w-16 sm:w-20"
                  src={getImage(item.product.images)}
                  alt={item.product.name}
                />

                <div>
                  <p className="text-xs sm:text-lg font-medium">{item.product.name}</p>

                  <div className="flex items-center gap-5 mt-2">
                    <p>
                      {currency}
                      {item.product.price}
                    </p>
                    <p className="px-2 sm:px-3 sm:py-1 border bg-slate-50">
                      {item.size}
                    </p>
                  </div>
                </div>
              </div>

              {/* QUANTITY INPUT */}
              <input
                className="border max-w-10 sm:max-w-20 px-2 py-1"
                type="number"
                min={1}
                value={item.quantity}     // controlled input
                onChange={(e) => {
                  const q = Number(e.target.value);

                  if (Number.isNaN(q) || q <= 0) return;
                  updateCartQuantity(item.id, q);   // item.id = CART ITEM ID
                }}
              />


              {/* REMOVE ITEM */}
              <img
                onClick={() => removeFromCart(item.id)}
                className="w-4 sm:w-5 cursor-pointer"
                src={assets.bin_icon}
                alt="Remove"
              />
            </div>
          ))}

          {/* CART TOTAL + CHECKOUT */}
          <div className="flex justify-end my-14">
            <div className="w-full sm:w-[450px]">
              <CartTotal />

              <div className="w-full text-end pr-10">
                <button
                  onClick={() => navigate("/place-order")}
                  className="bg-black text-white text-sm my-8 px-8 py-3 hover:bg-gray-900"
                >
                  PROCEED TO CHECKOUT
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
