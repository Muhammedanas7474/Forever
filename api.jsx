

import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api/v1/user/",
  withCredentials: true, 
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("API ERROR:", error.response?.status);

    if (error.response?.status === 403) {
      alert("Your account has been blocked by the admin");

      localStorage.removeItem("user");
      localStorage.removeItem("access_token");

      window.location.href = "/login"; 
    }

    
    if (error.response?.status === 401) {
      console.log("Unauthorized. Redirecting to login...");
    }

    return Promise.reject(error);
  }
);

export default api;
