import adminApi from "../adminApi";

const adminService = {
  // ==================== DASHBOARD ====================
  getDashboardStats: async () => {
    try {
      const response = await adminApi.get("dashboard/");
      return response.data;
    } catch (error) {
      console.error("Dashboard stats error:", error);
      throw new Error(
        error.response?.data?.message || 
        `Failed to fetch dashboard: ${error.message}`
      );
    }
  },

  // ==================== USERS/CUSTOMERS ====================
  getUsers: async (page = 1, search = "") => {
    try {
      const response = await adminApi.get("users/", {
        params: { page, search },
      });
      return response.data;
    } catch (error) {
      console.error("Get users error:", error);
      throw new Error(
        error.response?.data?.message || 
        `Failed to fetch users: ${error.message}`
      );
    }
  },

  updateUserStatus: async (userId, blocked) => {
    try {
      const response = await adminApi.patch(`users/${userId}/`, { blocked });
      return response.data;
    } catch (error) {
      console.error("Update user status error:", error);
      throw new Error(
        error.response?.data?.message || 
        `Failed to update user: ${error.message}`
      );
    }
  },

  deleteUser: async (userId) => {
    try {
      const response = await adminApi.delete(`users/${userId}/`);
      return response.data;
    } catch (error) {
      console.error("Delete user error:", error);
      throw new Error(
        error.response?.data?.message || 
        `Failed to delete user: ${error.message}`
      );
    }
  },

  // ==================== PRODUCTS ====================
  getProducts: async (page = 1, search = "", category = "") => {
    try {
      const response = await adminApi.get("products/", {
        params: { page, search, category },
      });
      return response.data;
    } catch (error) {
      console.error("Get products error:", error);
      throw new Error(
        error.response?.data?.message || 
        `Failed to fetch products: ${error.message}`
      );
    }
  },

  searchProducts: async (search = "") => {
    try {
      const response = await adminApi.get("products/", {
        params: { search },
      });
      return response.data;
    } catch (error) {
      console.error("Search products error:", error);
      throw new Error(
        error.response?.data?.message || 
        `Failed to search products: ${error.message}`
      );
    }
  },

  getProductDetail: async (productId) => {
    try {
      const response = await adminApi.get(`products/${productId}/`);
      return response.data;
    } catch (error) {
      console.error("Get product detail error:", error);
      throw new Error(
        error.response?.data?.message || 
        `Failed to fetch product details: ${error.message}`
      );
    }
  },

  createProduct: async (formData) => {
    try {
      const response = await adminApi.post("products/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Create product error:", error.response?.data || error);
      throw error; // Throw the actual error for better handling
    }
  },

  updateProduct: async (productId, productData) => {
    try {
      // productData must contain stock_count, not stock
      const response = await adminApi.patch(`products/${productId}/`, productData);
      return response.data;
    } catch (error) {
      console.error("Update product error:", error);
      throw error;
    }
  },


  deleteProduct: async (productId) => {
    try {
      const response = await adminApi.delete(`products/${productId}/`);
      return response.data;
    } catch (error) {
      console.error("Delete product error:", error);
      throw new Error(
        error.response?.data?.message || 
        `Failed to delete product: ${error.message}`
      );
    }
  },

  // ==================== ORDERS ====================
  getOrders: async (page = 1, status = "", search = "") => {
    try {
      console.log("Fetching orders with params:", { page, status, search });
      
      const response = await adminApi.get("orders/", {
        params: { page, status, search },
      });
      
      console.log("Orders API response:", response.data);
      return response?.data;
    } catch (error) {
      console.error("Get orders error:", error);
      throw new Error(
        error.response?.data?.message || 
        `Failed to fetch orders: ${error.message}`
      );
    }
  },

  getOrderDetail: async (orderId) => {
    try {
      const response = await adminApi.get(`orders/${orderId}/`);
      return response.data;
    } catch (error) {
      console.error("Get order detail error:", error);
      throw new Error(
        error.response?.data?.message || 
        `Failed to fetch order details: ${error.message}`
      );
    }
  },

  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await adminApi.patch(`orders/${orderId}/`, { status });
      return response.data;
    } catch (error) {
      console.error("Update order status error:", error);
      throw new Error(
        error.response?.data?.message || 
        `Failed to update order: ${error.message}`
      );
    }
  },
};

export default adminService;