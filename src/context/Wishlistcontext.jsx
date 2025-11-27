import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import api from "../../api";   // adjust path
import { toast } from "react-toastify";

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useContext(AuthContext);

  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  // ─────────────────────────────────────────────
  // 📌 Wishlist API (inside same file)
  // ─────────────────────────────────────────────
  const wishlistAPI = {
    getWishlist: async () => {
      const res = await api.get("wishlist/");
      return res.data;
    },

    addToWishlist: async (product_id) => {
      const res = await api.post("wishlist/", { product_id });
      return res.data;
    },

    removeFromWishlist: async (product_id) => {
      const res = await api.delete("wishlist/", {
        data: { product_id },
      });
      return res.data;
    }
  };

  // ─────────────────────────────────────────────
  // 🔄 Load wishlist when user logs in
  // ─────────────────────────────────────────────
  useEffect(() => {
    if (user) loadWishlist();
    else setWishlist([]);
  }, [user]);

  const loadWishlist = async () => {
    try {
      setLoading(true);
      const data = await wishlistAPI.getWishlist();
      setWishlist(data);
    } catch (err) {
      console.error("Error loading wishlist", err);
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────
  // ❤️ Toggle Wishlist
  // ─────────────────────────────────────────────
  const toggleWishlist = async (product_id) => {
    if (!user) return toast.error("Login to manage wishlist");

    const exists = wishlist.some(item => item.product.id === product_id);

    try {
      if (exists) {
        await wishlistAPI.removeFromWishlist(product_id);
        toast.info("Removed from wishlist");
      } else {
        await wishlistAPI.addToWishlist(product_id);
        toast.success("Added to wishlist");
      }
      loadWishlist();
    } catch (err) {
      console.error("Wishlist toggle failed:", err);
      toast.error("Wishlist update failed");
    }
  };

  // ─────────────────────────────────────────────
  // ❤️ Check if a product is in wishlist
  // ─────────────────────────────────────────────
  const isInWishlist = (product_id) => {
    return wishlist.some(item => item.product.id === product_id);
  };

  // ─────────────────────────────────────────────
  // ❤️ Get Wishlist Count
  // ─────────────────────────────────────────────
  const getWishlistCount = () => {
    return wishlist.length;
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loading,
        toggleWishlist,
        isInWishlist,
        getWishlistCount,
        loadWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
