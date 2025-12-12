// services/adminApi.js
import axios from "axios";

const adminApi = axios.create({
  baseURL: "https://forever-e-com.duckdns.org/api/v1/admin/",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

adminApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token"); // FIXED HERE
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("ADMIN TOKEN FOUND:", token);
    } else {
      console.log("❌ ADMIN TOKEN MISSING");
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default adminApi;