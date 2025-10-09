import axios from "axios";

// const baseURL = "http://localhost:8000/api"; //Local
// const baseURL = "https://dev5.digi360.ai/api/"; //server
const baseURL = "http://136.113.233.247/api"; //server

const instance = axios.create({
  baseURL,
});

// Request interceptor — attach access token
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — refresh token on 401
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Prevent infinite loop
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem("refresh")
    ) {
      originalRequest._retry = true;

      try {
        // Attempt refresh token
        const refreshRes = await axios.post(`${baseURL}/token/refresh/`, {
          refresh: localStorage.getItem("refresh"),
        });

        const newAccess = refreshRes.data.access;
        localStorage.setItem("access", newAccess);

        // Update the Authorization header and retry the request
        originalRequest.headers["Authorization"] = `Bearer ${newAccess}`;
        return instance(originalRequest);
      } catch (refreshErr) {
        // Refresh failed → logout
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        window.location.href = "/login";
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
