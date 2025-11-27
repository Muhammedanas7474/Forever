import { createContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is authenticated via cookies
  const checkAuth = async () => {
    try {
      const response = await api.get("user/", {
        withCredentials: true,
      });
      
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

  // Load user on first mount
  useEffect(() => {
    checkAuth();
  }, []);

  // --------------------
  // REGISTER
  // --------------------
  const register = async ({ username, email, password, password2 }) => {
    try {
      console.log("Registering user:", { username, email });
      
      const res = await api.post("register/", {
        username,
        email,
        password,
        password2,
      }, {
        withCredentials: true,
      });
      
      console.log("Registration response:", res.data);
      return res.data;
    } catch (err) {
      console.error("Registration error:", err);
      
      const errorData = err.response?.data;
      if (errorData) {
        let errorMessage = "Registration failed";
        
        if (typeof errorData === 'string') {
          errorMessage = errorData;
        } else if (typeof errorData === 'object') {
          const errorMessages = [];
          
          Object.keys(errorData).forEach(field => {
            if (Array.isArray(errorData[field])) {
              errorMessages.push(`${field}: ${errorData[field].join(', ')}`);
            } else if (typeof errorData[field] === 'string') {
              errorMessages.push(`${field}: ${errorData[field]}`);
            }
          });
          
          if (errorMessages.length > 0) {
            errorMessage = errorMessages.join(', ');
          } else if (errorData.detail) {
            errorMessage = errorData.detail;
          } else if (errorData.error) {
            errorMessage = errorData.error;
          }
        }
        
        throw new Error(errorMessage);
      }
      
      if (err.message.includes("Network Error")) {
        throw new Error("Cannot connect to server. Please check if the backend is running.");
      }
      
      throw new Error(err.message || "Registration failed");
    }
  };

  // --------------------
  // LOGIN - UPDATED FOR COOKIE AUTH
  // --------------------
  const login = async ({ username, password }) => {
    try {
      console.log("Logging in user:", username);

      const res = await api.post("login/", 
        { username, password }, 
        { withCredentials: true }
      );

      console.log("Login response:", res.data);

      if (res.data.user) {
        setUser(res.data.user);
        window.dispatchEvent(new Event("login"));
        return res.data.user;
      }
    } catch (err) {
      console.error("Login error:", err);
      const errorData = err.response?.data;
      
      let errorMessage = "Invalid username or password";
      if (errorData?.error) {
        errorMessage = errorData.error;
      } else if (err.response?.status === 401) {
        errorMessage = "Invalid credentials";
      } else if (err.message.includes("Network Error")) {
        errorMessage = "Cannot connect to server. Please check if the backend is running.";
      }
      
      throw new Error(errorMessage);
    }
  };

  // --------------------
  // LOGOUT - UPDATED FOR COOKIE AUTH
  // --------------------
  const logout = async () => {
    try {
      await api.post("logout/", {}, { withCredentials: true });
    } catch (err) {
      console.log("Logout API error:", err);
    } finally {
      setUser(null);
      window.dispatchEvent(new Event("logout"));
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
      checkAuth // Export checkAuth if needed elsewhere
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