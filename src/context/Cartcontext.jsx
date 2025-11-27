import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import api from "../../api";   // adjust path if needed
import { toast } from "react-toastify";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);

  const [cart, setCart] = useState([]); 
  const [loading, setLoading] = useState(false);

  // ─────────────────────────────
  // 📌 Cart API Inside One File
  // ─────────────────────────────
  const cartAPI = {
    getCart: async () => {
      const res = await api.get("cart/");
      return res.data;
    },

    addToCart: async (product_id, size, quantity = 1) => {
      const payload = { product_id, size, quantity };
      const res = await api.post("cart/add/", payload);
      return res.data;
    },

    updateCart: async (cart_id, quantity) => {
      const payload = { quantity };
      const res = await api.put(`cart/update/${cart_id}/`, payload);
      return res.data;
    },

    deleteCart: async (cart_id) => {
      const res = await api.delete(`cart/delete/${cart_id}/`);
      return res.data;
    }
  };

  // ─────────────────────────────────────────────
  // 🔄 Load cart when user logs in
  // ─────────────────────────────────────────────
  useEffect(() => {
    if (user) loadCart();
    else setCart([]);
  }, [user]);

  const loadCart = async () => {
    try {
      setLoading(true);
      const data = await cartAPI.getCart();
      setCart(data);
    } catch (err) {
      console.error("Error loading cart", err);
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────
  // ➕ Add to Cart
  // ─────────────────────────────────────────────
  const addToCart = async (product_id, size, quantity = 1) => {
    if (!user) return toast.error("Login to add items");

    try {
      await cartAPI.addToCart(product_id, size, quantity);
      toast.success("Added to cart");
      loadCart();
    } catch (err) {
      console.error(err);
      toast.error("Add to cart failed");
    }
  };

  // ─────────────────────────────────────────────
  // 🔁 Update Quantity
  // ─────────────────────────────────────────────
  const updateCartQuantity = async (cart_id, quantity) => {
    try {
      await cartAPI.updateCart(cart_id, quantity);
      loadCart();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update");
    }
  };

  // ─────────────────────────────────────────────
  // ❌ Remove Item
  // ─────────────────────────────────────────────
  const removeFromCart = async (cart_id) => {
    try {
      await cartAPI.deleteCart(cart_id);
      toast.info("Item removed");
      loadCart();
    } catch (err) {
      console.error(err);
      toast.error("Remove failed");
    }
  };

  // ─────────────────────────────────────────────
  // 🧮 Total Item Count
  // ─────────────────────────────────────────────
  const getCartCount = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  // ─────────────────────────────────────────────
  // 💲 Total Price
  // ─────────────────────────────────────────────
  const getCartTotal = () => {
    return cart.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
  };
  const clearCart = () => {
  setCart([]);
  localStorage.removeItem('cart'); // if you're using localStorage
};

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        getCartCount,
        getCartTotal,
        loadCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
