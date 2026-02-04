// ==================== Page Routes ====================
export const ROOTS = {
  AUTH: "/auth",
  PRODUCT: "/product",
  CATEGORIES: "/categories",
  STORE: "/store",
  CART: "/cart",
  TRACK_ORDER: "/track-order",
  ACCOUNT: "/account",
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
    categories: ROOTS.CATEGORIES,
    cart: ROOTS.CART,
    orders: "/cart/orders",
    checkout: "/cart/checkout",
    review: "/cart/review",
    store: ROOTS.STORE,
    brandProducts: "/brand/:brandId/products",
    trackOrder: "/track-order/:orderId",
    // New routes for sections API
    brands: "/brands",
    recipes: "/recipes",
    products: "/products",
    baskets: "/baskets",
    brandDetails: (id: number | string) => `/brand/${id}`,
    productDetails: (id: number | string) => `${ROOTS.PRODUCT}/${id}`,
    recipeDetails: (id: number | string) => `/recipe/${id}`,
    basketDetails: (id: number | string) => `/basket/${id}`,
    shopDetails: (id: number | string) => `/shop_details/${id}`,
  },
  account: {
    root: ROOTS.ACCOUNT,
    profile: `${ROOTS.ACCOUNT}/profile`,
    addresses: `${ROOTS.ACCOUNT}/addresses`,
    addAddress: `${ROOTS.ACCOUNT}/addresses/add`,
    editAddress: (id: number | string) =>
      `${ROOTS.ACCOUNT}/addresses/${id}/edit`,
    paymentMethods: `${ROOTS.ACCOUNT}/payment-methods`,
    orders: `${ROOTS.ACCOUNT}/orders`,
    baskets: `${ROOTS.ACCOUNT}/baskets`,
    packages: `${ROOTS.ACCOUNT}/packages`,
    wishlist: `${ROOTS.ACCOUNT}/wishlist`,
    pointsRewards: `${ROOTS.ACCOUNT}/points-rewards`,
    notifications: `${ROOTS.ACCOUNT}/notifications`,
    reviews: `${ROOTS.ACCOUNT}/reviews`,
    helpSupport: `${ROOTS.ACCOUNT}/help-support`,
    settings: `${ROOTS.ACCOUNT}/settings`,
    delete: `${ROOTS.ACCOUNT}/delete`,
  },
};
