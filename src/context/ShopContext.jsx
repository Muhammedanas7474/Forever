import { createContext, useEffect, useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext"; 

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const { user } = useContext(AuthContext); 
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const currency = "$";
  const delivery_fee = 10;
  const [search, setSearch] = useState("");
  const [ShowSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [wishlistItems, setWishlistItems] = useState([]);

  // --- Load cart and wishlist from localStorage per user ---
  useEffect(() => {
    if (user) {
      // Load cart
      const storedCart = localStorage.getItem(`cart_${user.id}`);
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      } else {
        setCartItems({});
      }
      
      // Load wishlist
      const storedWishlist = localStorage.getItem(`wishlist_${user.id}`);
      if (storedWishlist) {
        setWishlistItems(JSON.parse(storedWishlist));
      } else {
        setWishlistItems([]);
      }
    } else {
      setCartItems({});
      setWishlistItems([]);
    }
  }, [user]);

  // --- Save cart to localStorage whenever it changes ---
  useEffect(() => {
    if (user) {
      localStorage.setItem(`cart_${user.id}`, JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  // --- Save wishlist to localStorage whenever it changes ---
  useEffect(() => {
    if (user) {
      localStorage.setItem(`wishlist_${user.id}`, JSON.stringify(wishlistItems));
    }
  }, [wishlistItems, user]);

  // --- Add to Cart ---
  const addToCart = (itemId, size, quantity = 1) => {
    if (!size) {
      toast.error("Select Product size");
      return;
    }

    let cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += quantity;
      } else {
        cartData[itemId][size] = quantity;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = quantity;
    }

    setCartItems(cartData);
    // toast.success("Added to cart!");
  };

  // --- Toggle Wishlist ---
  const toggleWishlist = (itemId) => {
    setWishlistItems(prev => {
      if (prev.includes(itemId)) {
        toast.info("Removed from wishlist");
        return prev.filter(id => id !== itemId);
      } else {
        toast.success("Added to wishlist!");
        return [...prev, itemId];
      }
    });
  };

  // --- Add to Cart from Wishlist ---
  const addToCartFromWishlist = (itemId, size = "M", quantity = 1) => {
    addToCart(itemId, size, quantity);
    // Optionally remove from wishlist after adding to cart
    // toggleWishlist(itemId);
  };

  // {--- Get total cart count ---}
  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalCount += cartItems[items][item];
          }
        } catch (error) {}
      }
    }
    return totalCount;
  };

  // --- Get wishlist count ---
  const getWishlistCount = () => {
    return wishlistItems.length;
  };

  // --- Update quantity ---
  const updateQuantity = (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);
    if (quantity <= 0) {
      delete cartData[itemId][size];
      if (Object.keys(cartData[itemId]).length === 0) delete cartData[itemId];
    } else {
      cartData[itemId][size] = quantity;
    }
    setCartItems(cartData);
  };

  // --- Get total cart amount ---
  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      const itemInfo = products.find((product) => product._id === items);
      if (!itemInfo) continue;
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalAmount += itemInfo.price * cartItems[items][item];
          }
        } catch (error) {}
      }
    }
    return totalAmount;
  };

    // --- Clear Cart ---
  const clearCart = () => {
    setCartItems({});
    if (user) {
      localStorage.removeItem(`cart_${user.id}`); // ✅ also clear storage
    }
  };


  // --- Fetch Products ---
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/products");
        setProducts(response.data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);






  const getProductCount = () => {
  return products.length;
};

const getOutOfStockProducts = () => {
  return products.filter(product => product.stock <= 0);
};

const getLowStockProducts = () => {
  return products.filter(product => product.stock > 0 && product.stock < 10);
};

  const value = {
    products,
    currency,
    delivery_fee,
    loading,
    error,
    search,
    setSearch,
    ShowSearch,
    setShowSearch,
    cartItems,
    wishlistItems,
    addToCart,
    toggleWishlist,
    addToCartFromWishlist,
    getCartCount,
    getWishlistCount,
    updateQuantity,
    getCartAmount,
    navigate,
    clearCart,
    getProductCount,
    getOutOfStockProducts,
    getLowStockProducts,
  };

  return <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>;
};

export default ShopContextProvider;