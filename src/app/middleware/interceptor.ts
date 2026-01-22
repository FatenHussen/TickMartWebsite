import axios from "axios";
import { useAuthStore } from "@/store/auth";

const BASE_URL = import.meta.env.DEV
  ? "https://tikmool.octopus-software.online/api"
  : "https://tikmool.octopus-software.online/api/";

const _axios = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-CLIENT": "web",
    "Accept-Language": "en",
  },
});

// Request interceptor - Add token to requests
_axios.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor
_axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Handle 401 Unauthorized - clear auth state
      if (error.response.status === 401) {
        useAuthStore.getState().logoutLocal();
      }
      console.error("API Error:", error.response.data);
    } else if (error.request) {
      console.error("Network Error:", error.request);
    } else {
      console.error("Error:", error.message);
    }
    return Promise.reject(error);
  },
);

export default _axios;
