// services/adminApi.js
import axios from "axios";

const adminApi = axios.create({
  baseURL: "http://localhost:8000/api/v1/admin/",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

// Add token to every request
adminApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // take token from storage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log("ADMIN REQUEST:", config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("ADMIN API ERROR:", error.response?.status, error.response?.data);

    if (error.response?.status === 401) {
      console.log("ADMIN 401 - Unauthenticated");
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default adminApi;
