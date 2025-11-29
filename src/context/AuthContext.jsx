import { createContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check login session (cookie based)
  const checkAuth = async () => {
    try {
      const response = await api.get("user/", { withCredentials: true });

      if (response.data) {
        setUser(response.data);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  // REGISTER
  const register = async ({ username, email, password, password2 }) => {
    try {
      const res = await api.post(
        "register/",
        { username, email, password, password2 },
        { withCredentials: true }
      );
      return res.data;
    } catch (err) {
      console.error("Registration error:", err);
      const errorData = err.response?.data;
      let errorMessage = "Registration failed";

      if (errorData) {
        if (typeof errorData === "string") {
          errorMessage = errorData;
        } else {
          const errorMessages = [];
          Object.keys(errorData).forEach((field) => {
            const value = errorData[field];
            if (Array.isArray(value)) errorMessages.push(`${field}: ${value.join(", ")}`);
            else if (typeof value === "string") errorMessages.push(`${field}: ${value}`);
          });
          if (errorMessages.length > 0) errorMessage = errorMessages.join(", ");
        }
      }

      throw new Error(errorMessage);
    }
  };

  // LOGIN - FIXED
  const login = async ({ username, password }) => {
    try {
      console.log("Logging in user:", username);

      const res = await api.post(
        "login/",
        { username, password },
        { withCredentials: true }
      );

      if (res.data.user) {
        setUser(res.data.user);
        return res.data.user;
      }
    } catch (err) {
      console.error("Login error:", err);
      const errorData = err.response?.data;

      let errorMessage = "Invalid username or password";

      if (errorData?.error) errorMessage = errorData.error;
      else if (err.response?.status === 401) errorMessage = "Invalid credentials";
      else if (err.message.includes("Network Error"))
        errorMessage = "Backend server not reachable";

      throw new Error(errorMessage);
    }
  };

  // LOGOUT
  const logout = async () => {
    try {
      await api.post("logout/", {}, { withCredentials: true });
    } catch (err) {
      console.log("Logout API error:", err);
    } finally {
      setUser(null);
      navigate("/");
    }
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      register,
      login,
      logout,
      checkAuth,
    }),
    [user, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-lg">Loading...</div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}
