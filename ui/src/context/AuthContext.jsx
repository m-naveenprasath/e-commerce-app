import { createContext, useState, useEffect } from "react";
import axios from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // ⬅️ Add this

  const login = async (email, password) => {
    try {
      const res = await axios.post("/token/", { email, password });
      const { access, refresh } = res.data;
      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);

      // Get user info
      const userRes = await axios.get("/user/me/", {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });
      setUser(userRes.data);
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setUser(null);
  };

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (token) {
      axios
        .get("/user/me/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => setUser(res.data))
        .catch((err) => {
          console.error("Auto-login failed:", err);
          logout();
        })
        .finally(() => setLoading(false)); // ✅ always turn off loading
    } else {
      setLoading(false);

    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
