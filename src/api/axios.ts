import axios from "axios";

const BASE_URL = "http://localhost:8000/api";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// ── Request interceptor: attach JWT access token ──────────────────────────
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// ── Response interceptor: auto-refresh on 401 ────────────────────────────
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (typeof window !== "undefined") {
        const refreshToken = localStorage.getItem("refresh_token");
        if (refreshToken) {
          try {
            const { data } = await axios.post(`${BASE_URL}/token/refresh/`, {
              refresh: refreshToken,
            });
            localStorage.setItem("access_token", data.access);
            originalRequest.headers.Authorization = `Bearer ${data.access}`;
            return api(originalRequest);
          } catch {
            // Refresh failed — clear tokens and redirect to login
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            window.location.href = "/login";
          }
        } else {
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  },
);

export default api;
