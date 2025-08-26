import { createContext, useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();
const API = "http://localhost:3000/users";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate=useNavigate()

  // 🔹 Load user from localStorage on first mount
  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (raw) {
      setUser(JSON.parse(raw));
    }
    setLoading(false);
  }, []);

  // 🔹 Persist session whenever user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  // --- Register (Default role: "user") ---
  const register = async ({ name, email, password }) => {
    const exists = await axios.get(`${API}?email=${encodeURIComponent(email)}`);
    if (exists.data.length) throw new Error("User already exists");

    const newUser = {
      id: Date.now().toString(16),
      name,
      email,
      password,
      role: "user",
      isBlock: false,
      cart: [],
      orders: [],
      wishlist: [],
      created_at: new Date().toISOString(),
    };

    const res = await axios.post(API, newUser);
    return res.data; // don't auto-login
  };

  // --- Login ---
  const login = async ({ email, password }) => {
    const res = await axios.get(
      `${API}?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
    );

    if (!res.data.length) throw new Error("Invalid email or password");

    const foundUser = res.data[0];

    if (foundUser.isBlock) {
      throw new Error("Your account has been blocked. Contact admin.");
    }

    setUser(foundUser);
    localStorage.setItem("user", JSON.stringify(foundUser));

    return foundUser;
  };

  // --- Logout ---
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/")
  };

  const value = useMemo(
    () => ({ user, loading, register, login, logout }),
    [user, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
}
