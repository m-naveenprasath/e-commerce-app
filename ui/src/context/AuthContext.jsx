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

  const register = async (email, password) => {
    try {
      const res = await axios.post("/register/", {
        email,
        password,
        password2: password,     // your serializer requires password2
        is_customer: true,       // mark user as customer
      });
      setUser(res.data.user);
      return { success: true };
    } catch (error) {
      if (error.response && error.response.data) {
        const errors = error.response.data;
        const message = Object.values(errors).flat().join(" ");
        return { success: false, message };
      }
      return { success: false, message: "Registration failed" };
    }
  };

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setUser(null);
    window.location.href = "/"; // Works globally
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
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
