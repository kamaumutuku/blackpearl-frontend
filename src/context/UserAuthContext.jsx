import { createContext, useContext, useEffect, useState } from "react";
import api from "../utils/axiosInstance";

const UserAuthContext = createContext();

/* =========================
   Helpers
========================= */
const normalizePhone = (phone) => {
  if (!phone) return "";
  let p = phone.replace(/\s+/g, "");

  if (p.startsWith("0")) return "254" + p.slice(1);
  if (p.startsWith("+")) return p.slice(1);
  return p;
};

/* =========================
   Provider
========================= */
export const UserAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_BASE = "/users";

  /* =========================
     Load stored user
  ========================= */
  useEffect(() => {
    try {
      const stored = localStorage.getItem("blackpearl-user");
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (err) {
      console.error("Auth load error:", err);
      localStorage.removeItem("blackpearl-user");
    } finally {
      setLoading(false);
    }
  }, []);

  /* =========================
     Login (phone + password)
  ========================= */
  const login = async (phone, password) => {
    const normalizedPhone = normalizePhone(phone);

    const { data } = await api.post(`${API_BASE}/login`, {
      phone: normalizedPhone,
      password,
    });

    setUser(data);
    localStorage.setItem("blackpearl-user", JSON.stringify(data));
    return data;
  };

  /* =========================
     Register
  ========================= */
  const register = async (name, phone, password) => {
    const normalizedPhone = normalizePhone(phone);

    const { data } = await api.post(`${API_BASE}/register`, {
      name,
      phone: normalizedPhone,
      password,
    });

    setUser(data);
    localStorage.setItem("blackpearl-user", JSON.stringify(data));
    return data;
  };

  /* =========================
     Logout
  ========================= */
  const logout = () => {
    setUser(null);
    localStorage.removeItem("blackpearl-user");
    localStorage.removeItem("cart"); // 🔑 important
  };

  /* =========================
     Update profile
  ========================= */
  const updateProfile = async (updates) => {
    if (!user?.token) throw new Error("No auth token");

    const { data } = await api.put(`${API_BASE}/profile`, updates, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });

    setUser(data);
    localStorage.setItem("blackpearl-user", JSON.stringify(data));
    return data;
  };

  return (
    <UserAuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </UserAuthContext.Provider>
  );
};

/* =========================
   Hook
========================= */
export const useAuth = () => useContext(UserAuthContext);
