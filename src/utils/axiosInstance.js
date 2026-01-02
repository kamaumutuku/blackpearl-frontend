// frontend/src/utils/axiosInstance.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

/* ============================
   AXIOS INSTANCE
============================ */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
  },
});


/* ============================
   REQUEST INTERCEPTOR
   - SINGLE auth source
   - Admin === user with role "admin"
============================ */
api.interceptors.request.use(
  (config) => {
    const raw = localStorage.getItem("blackpearl-user");

    if (raw) {
      try {
        const user = JSON.parse(raw);
        if (user?.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      } catch {
        localStorage.removeItem("blackpearl-user");
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ============================
   RESPONSE INTERCEPTOR
   - NO admin refresh
   - Hard logout on 401
============================ */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      localStorage.removeItem("blackpearl-user");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
