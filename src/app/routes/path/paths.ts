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
      reset: `${ROOTS.AUTH}/reset`,
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

// ----------- key to endponit is fixed -----------

// const MAINBASES = {
//   USERS: "user",
// };

export const BASES = {
  //   AUTH: `/${MAINBASES.USERS}/auth`,
  AUTH: `/auth`,
  PRODUCT: `/product`,
};
