import axios from "axios";

/* ============================
   AXIOS INSTANCE
============================ */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // MUST be https://backend-url/api
  withCredentials: true, // safe even if you use Bearer tokens
  headers: {
    "Content-Type": "application/json",
  },
});

console.log("API URL:", import.meta.env.VITE_API_URL);

/* ============================
   REQUEST INTERCEPTOR
   - SINGLE auth source
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
   - Hard logout on 401
============================ */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("blackpearl-user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
