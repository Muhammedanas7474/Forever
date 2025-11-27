import { createContext, useEffect, useState } from "react";
import api from "../../api"; // adjust path

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [productDetail, setProductDetail] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState(null);

  // ─────────────────────────────────────────────
  // 📌 Backend API (inside same file)
  // ─────────────────────────────────────────────
  const productAPI = {
    getCategories: async () => {
      const res = await api.get("categories/");
      return res.data;
    },

    getProducts: async () => {
      const res = await api.get("products/");
      return res.data;
    },

    getProductDetail: async (product_id) => {
      const res = await api.get(`products/${product_id}/`);
      return res.data;
    },

    getRelatedProducts: async (product_id) => {
      const res = await api.get(`products/${product_id}/related/`);
      return res.data;
    },
  };

  // ─────────────────────────────────────────────
  // 🔄 Load all products & categories on app start
  // ─────────────────────────────────────────────
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);

      const [categoryRes, productRes] = await Promise.all([
        productAPI.getCategories(),
        productAPI.getProducts(),
      ]);

      setCategories(categoryRes.categories || categoryRes);
      setProducts(productRes.products || productRes);
      setError(null);
    } catch (err) {
      console.error("Initial product load error:", err);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────
  // 📌 Load Single Product
  // ─────────────────────────────────────────────
  const loadProductDetail = async (product_id) => {
    try {
      setDetailLoading(true);
      const detail = await productAPI.getProductDetail(product_id);
      setProductDetail(detail.product || detail);
      return detail;
    } catch (err) {
      console.error("Product detail loading failed:", err);
      return null;
    } finally {
      setDetailLoading(false);
    }
  };

  // ─────────────────────────────────────────────
  // 📌 Load Related Products
  // ─────────────────────────────────────────────
  const loadRelatedProducts = async (product_id) => {
    try {
      const related = await productAPI.getRelatedProducts(product_id);
      setRelatedProducts(related.products || related);
      return related;
    } catch (err) {
      console.error("Failed to load related products:", err);
      return [];
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        categories,
        productDetail,
        relatedProducts,

        loading,
        detailLoading,
        error,

        fetchInitialData,
        loadProductDetail,
        loadRelatedProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
