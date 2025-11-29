import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import api from "../../api";
import { toast } from "react-toastify";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState([]); 
  const [loading, setLoading] = useState(false);

  // ─────────────────────────────
  // 📌 CORRECTED Cart API - Match your backend URLs
  // ─────────────────────────────
  const cartAPI = {
    getCart: async () => {
      const res = await api.get("cart/");
      return res.data;
    },

    addToCart: async (product_id, size, quantity = 1) => {
      const payload = { product_id, size, quantity };
      // ✅ Use the correct endpoint that matches your backend
      const res = await api.post("cart/", payload);
      return res.data;
    },

    updateCart: async (item_id, quantity) => {
      const payload = { quantity };
      // ✅ Use cart/item/{item_id}/ for updates
      const res = await api.put(`cart/item/${item_id}/`, payload);
      return res.data;
    },

    deleteCart: async (item_id) => {
      // ✅ Use cart/item/{item_id}/ for deletion
      const res = await api.delete(`cart/item/${item_id}/`);
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
      loadCart(); // Reload cart to get updated data with size
    } catch (err) {
      console.error("Add to cart error:", err.response?.data || err.message);
      toast.error("Add to cart failed");
    }
  };

  // ─────────────────────────────────────────────
  // 🔁 Update Quantity
  // ─────────────────────────────────────────────
  const updateCartQuantity = async (item_id, quantity) => {
    try {
      await cartAPI.updateCart(item_id, quantity);
      loadCart();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update");
    }
  };

  // ─────────────────────────────────────────────
  // ❌ Remove Item
  // ─────────────────────────────────────────────
  const removeFromCart = async (item_id) => {
    try {
      await cartAPI.deleteCart(item_id);
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
      (sum, item) => sum + (item.product?.price || 0) * item.quantity,
      0
    );
  };

  const clearCart = () => {
    setCart([]);
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