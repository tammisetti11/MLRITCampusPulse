import axios from "axios";

const api = axios.create({
  baseURL: axios.get("https://campuspulse-api.onrender.com/api/events")
});

// Automatically attach JWT to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
