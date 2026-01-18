// Query Keys for React Query
export const queryKeys = {
  auth: {
    login: "login",
    register: "register",
    verifyOtp: "verify_otp",
    sendOtp: "send_otp",
    sendPassword: "send_password",
    verifyPassword: "verify_password",
    resetPassword: "reset_password",
    me: "me",
    logout: "logout",
  },
  location: {
    governorates: "governorates",
    cities: "cities",
  },
} as const;
