import axios from "axios";

// Use proxy in development, direct URL in production
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
  withCredentials: true, // Enable sending HttpOnly cookies automatically
});

// Response interceptor
_axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle errors globally if needed
    if (error.response) {
      // Server responded with error status
      console.error("API Error:", error.response.data);
    } else if (error.request) {
      // Request was made but no response received
      console.error("Network Error:", error.request);
    } else {
      // Something else happened
      console.error("Error:", error.message);
    }
    return Promise.reject(error);
  },
);

export default _axios;
