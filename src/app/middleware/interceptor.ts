import axios from "axios";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth";
import i18n from "@/i18n/config";
import { getApiErrorMessage, getApiSuccessMessage } from "@/shared/lib/apiMessage";

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

// Dev goes through the Vite proxy (see vite.config.ts) so the browser never
// makes a cross-origin request and CORS preflight never happens.
const prodApiBase =
  import.meta.env.VITE_SERVER_URL?.replace(/\/user\/?$/, "") ||
  "https://tickdash.tickmartsy.com/api";

const BASE_URL = import.meta.env.DEV ? "/api" : `${prodApiBase.replace(/\/$/, "")}/`;

// No `Accept-Language` default here on purpose: the request interceptor fills it
// in from the active language, and leaving it unset is what lets a caller pass
// its own value per request (see `navMenuApi`) without the default masking it.
const _axios = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-CLIENT": "web",
    },
});

// Request interceptor - Add token and Accept-Language
_axios.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        // A caller that set the header itself knows which language it wants —
        // `i18n.language` can still be the previous one at that moment, so an
        // explicit value must not be overwritten here.
        if (!config.headers["Accept-Language"]) {
            config.headers["Accept-Language"] = getAcceptLanguage();
        }
        // Let the browser set Content-Type with boundary when sending FormData
        if (config.data instanceof FormData) {
            delete config.headers["Content-Type"];
        }
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
            const message = getApiSuccessMessage(response.data);
            toast.success(message);
        }
        return response;
    },
    (error) => {
        if (error.response) {
            if (error.response.status === 401) {
                useAuthStore.getState().logoutLocal();
            }
            const message = getApiErrorMessage(error);
            if (isMutationMethod(error.config?.method ?? "")) {
                error.__toastHandled = true;
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
