import axios from "axios";
const prod_url = "https://chris-market-place-server.onrender.com";
const dev_url = "http://localhost:8000";

const resolvedBaseUrl =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? dev_url : prod_url) + "/api";

const api = axios.create({
  baseURL: resolvedBaseUrl,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;
