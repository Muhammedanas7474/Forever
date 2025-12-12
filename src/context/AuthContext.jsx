import { createContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import authApi from "../../api";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const navigate = useNavigate();

  const checkAuth = async () => {
    try {
      const res = await authApi.get("user/"); // Reads token from cookies

      setUser(res.data);
      setIsAdmin(res.data.role === "admin");
      localStorage.setItem("user", JSON.stringify(res.data));

    } catch (error) {
      console.log("Auth check failed, restoring from localStorage...");

      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        setIsAdmin(parsed.role === "admin");
      } else {
        setUser(null);
        setIsAdmin(false);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async ({ username, password }) => {
    try {
      const res = await authApi.post("login/", { username, password });
      console.log("Login response:", res.data);

      const updatedUser = {
        ...res.data.user,
        role: res.data.user.role || "user",
      };

      setUser(updatedUser);
      setIsAdmin(updatedUser.role === "admin");
      localStorage.setItem("user", JSON.stringify(updatedUser));
      localStorage.setItem("access_token", res.data.access_token);

      return { success: true };
    } catch (err) {
      console.error("Login error:", err);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await authApi.post("logout/", {});
    } catch (err) {
      console.log("Logout API error:", err);
    } finally {
      setUser(null);
      setIsAdmin(false);
      localStorage.removeItem("user");
      localStorage.removeItem("access_token");
      navigate("/");
    }
  };

  const register = async (data) => {
    return authApi.post("register/", data);
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      register,
      login,
      logout,
      checkAuth,
      isAdmin,
    }),
    [user, loading, isAdmin]
  );

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <h2>Loading...</h2>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}
