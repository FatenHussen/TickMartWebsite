import axios from "axios";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth";
import i18n from "@/i18n/config";

const MUTATION_METHODS = ["post", "put", "patch", "delete"] as const;

function isMutationMethod(
  method: string
): method is (typeof MUTATION_METHODS)[number] {
  return MUTATION_METHODS.includes(
    method.toLowerCase() as (typeof MUTATION_METHODS)[number]
  );
}

function getAcceptLanguage(): string {
  const lang = i18n.language || localStorage.getItem("language") || "en";
  return lang.startsWith("ar") ? "ar" : "en";
}

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

// Request interceptor - Add token and Accept-Language
_axios.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers["Accept-Language"] = getAcceptLanguage();
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
_axios.interceptors.response.use(
  (response) => {
    if (isMutationMethod(response.config.method ?? "")) {
      const message =
        (response.data?.message as string) ||
        (response.data?.data?.message as string) ||
        "Operation completed successfully.";
      toast.success(message);
    }
    return response;
  },
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        useAuthStore.getState().logoutLocal();
      }
      const message =
        (error.response?.data?.message as string) ||
        (error.response?.data?.data?.message as string) ||
        error.message ||
        "Something went wrong.";
      if (isMutationMethod(error.config?.method ?? "")) {
        toast.error(message);
      }
      console.error("API Error:", error.response.data);
    } else if (error.request) {
      if (isMutationMethod(error.config?.method ?? "")) {
        toast.error("Network error. Please try again.");
      }
      console.error("Network Error:", error.request);
    } else {
      if (isMutationMethod(error.config?.method ?? "")) {
        toast.error(error.message || "Something went wrong.");
      }
      console.error("Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default _axios;
