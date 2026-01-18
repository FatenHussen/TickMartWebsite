export const QueryConfig = {
  LOGIN: {
    key: "login",
    url: "user/auth/login",
  },
  REGISTER: {
    key: "register",
    url: "user/auth/register",
  },
  VERIFY_OTP: {
    key: "verify_otp",
    url: "user/auth/verify_otp",
  },
  SEND_OTP: {
    key: "send_otp",
    url: "user/auth/send_otp",
  },
  SEND_PASSWORD: {
    key: "send_password",
    url: "user/auth/send_password",
  },
  VERIFY_PASSWORD: {
    key: "verify_password",
    url: "user/auth/verify_password",
  },
  GOVERNORATES: {
    key: "governorates",
    url: "admin/governorates",
  },
  CITIES: {
    key: "cities",
    url: "admin/cities",
  },
  ME: {
    key: "me",
    url: "user/auth/me",
  },
  LOGOUT: {
    key: "logout",
    url: "user/auth/logout",
  },
} as const;
