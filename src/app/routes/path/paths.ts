// ==================== Page Routes ====================
export const ROOTS = {
  AUTH: "/auth",
  PRODUCT: "/product",
  CATEGORIES: "/categories",
  STORE: "/store",
  CART: "/cart",
  TRACK_ORDER: "/track-order",
};

export const paths = {
  auth: {
    jwt: {
      signIn: `${ROOTS.AUTH}/sign-in`,
      signUp: `${ROOTS.AUTH}/sign-up`,
      otp: `${ROOTS.AUTH}/otp`,
      forgotPassword: `${ROOTS.AUTH}/forgot-password`,
      changePassword: `${ROOTS.AUTH}/change-password`,
    },
  },
  client: {
    home: "/home",
    cart: "/cart",
    orders: "/cart/orders",
    brandProducts: "/brand/:brandId/products",
    trackOrder: "/track-order/:orderId",
  },
};

// ==================== API Endpoints ====================
const API_BASE = {
  USER_AUTH: "user/auth",
  ADMIN: "admin",
};

export const endpoints = {
  auth: {
    login: `${API_BASE.USER_AUTH}/login`,
    register: `${API_BASE.USER_AUTH}/register`,
    sendOtp: `${API_BASE.USER_AUTH}/send-otp`,
    verifyOtp: `${API_BASE.USER_AUTH}/verify-otp`,
    sendPassword: `${API_BASE.USER_AUTH}/send-password`,
    verifyPassword: `${API_BASE.USER_AUTH}/verify-password`,
    resetPassword: `${API_BASE.USER_AUTH}/reset-password`,
    me: `${API_BASE.USER_AUTH}/me`,
    logout: `${API_BASE.USER_AUTH}/logout`,
  },
  location: {
    governorates: `${API_BASE.ADMIN}/governorates`,
    cities: `${API_BASE.ADMIN}/cities`,
  },
};
