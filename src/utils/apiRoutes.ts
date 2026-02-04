export const apiRoutes = {
  /**
   * Authentication endpoints
   */
  auth: {
    login: "/user/auth/login" as const,
    register: "/user/auth/register" as const,
    sendOtp: "/user/auth/send-otp" as const,
    verifyOtp: "/user/auth/verify-otp" as const,
    sendPassword: "/user/auth/send-password" as const,
    verifyPassword: "/user/auth/verify-password" as const,
    resetPassword: "/user/auth/reset-password" as const,
    me: "/user/auth/me" as const,
    logout: "/user/auth/logout" as const,
  },

  /**
   * Location endpoints
   */
  location: {
    governorates: "/admin/governorates" as const,
    cities: "/admin/cities" as const,
    areas: (cityId: number) => `/user/areas?city_id=${cityId}` as const,
  },

  /**
   * Address endpoints
   */
  addresses: {
    list: "/user/addresses" as const,
    create: "/user/addresses" as const,
    update: (id: number | string) => `/user/addresses/${id}` as const,
  },

  /**
   * Sections endpoints
   */
  sections: {
    getByPage: (pageSlug: string) =>
      `/user/sections?page_slug=${pageSlug}` as const,
  },

  /**
   * Categories endpoints
   */
  categories: {
    list: "/user/categories" as const,
  },

  /**
   * Product endpoints
   */
  product: {
    details: (productId: number, lat: number, lng: number, shopId: number) =>
      `/user/products/${productId}?lat=${lat}&lng=${lng}&shop_id=${shopId}` as const,
    listByCategory: (categoryId: number, page?: number) =>
      `/user/products?category_id=${categoryId}${
        page ? `&page=${page}` : ""
      }` as const,
    listByShop: (shopId: number, page?: number) =>
      `/user/products?shop_id=${shopId}${page ? `&page=${page}` : ""}` as const,
  },

  /**
   * Shop endpoints
   */
  shop: {
    details: (shopId: number) => `/user/shops/${shopId}` as const,
  },

  /**
   * Ratings endpoints (product, brand, etc.)
   */
  ratings: {
    list: (rateableId: number, rateableType: string, page?: number) =>
      `/user/ratings?rateable_id=${rateableId}&rateable_type=${rateableType}${
        page ? `&page=${page}` : ""
      }` as const,
  },

  /**
   * Recipe endpoints
   */
  recipes: {
    list: (page?: number) =>
      `/user/recipes${page ? `?page=${page}` : ""}` as const,
    details: (id: number | string) => `/user/recipes/${id}` as const,
  },
} as const;
