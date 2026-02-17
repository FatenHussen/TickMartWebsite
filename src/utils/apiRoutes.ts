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
    sellerRegister: "/user/auth/seller-register" as const,
  },

  /**
   * Location endpoints
   */
  location: {
    governorates: "/user/governorates" as const,
    cities: "/user/cities" as const,
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
    list: (filters?: {
      category_id?: number;
      brand_id?: number;
      shop_id?: number;
      page?: number;
    }) => {
      const params = new URLSearchParams();
      if (filters?.category_id)
        params.append("category_id", String(filters.category_id));
      if (filters?.brand_id) params.append("brand_id", String(filters.brand_id));
      if (filters?.shop_id) params.append("shop_id", String(filters.shop_id));
      if (filters?.page) params.append("page", String(filters.page));
      return `/user/products${
        params.toString() ? `?${params.toString()}` : ""
      }` as const;
    },
    details: (productId: number, lat: number, lng: number, shopId?: number) =>
      `/user/products/${productId}?lat=${lat}&lng=${lng}${shopId ? `&shop_id=${shopId}` : ""}` as const,
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
    list: (page?: number) =>
      `/user/shops${page ? `?page=${page}` : ""}` as const,
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

  /**
   * Brand endpoints
   */
  brands: {
    list: (page?: number) =>
      `/user/brands${page ? `?page=${page}` : ""}` as const,
    details: (id: number | string) => `/user/brands/${id}` as const,
    products: (brandId: number, page?: number) =>
      `/user/products?brand_id=${brandId}${
        page ? `&page=${page}` : ""
      }` as const,
  },

  /**
   * Schedule endpoints (delivery frequency options)
   */
  schedules: {
    list: (page?: number) =>
      `/user/schedules${page ? `?page=${page}` : ""}` as const,
  },

  /**
   * Scheduled Basket endpoints (user account)
   */
  scheduledBaskets: {
    list: (page?: number) =>
      `/user/scheduled-baskets${page ? `?page=${page}` : ""}` as const,
    details: (id: number | string) =>
      `/user/scheduled-baskets/${id}` as const,
    update: (id: number | string) =>
      `/user/scheduled-baskets/${id}` as const,
    delete: (id: number | string) =>
      `/user/scheduled-baskets/${id}` as const,
  },

  /**
   * Basket endpoints
   */
  baskets: {
    list: (isSchedule?: 0 | 1, page?: number) => {
      const params = new URLSearchParams();
      if (isSchedule !== undefined)
        params.append("is_schedule", String(isSchedule));
      if (page) params.append("page", String(page));
      return `/user/baskets${
        params.toString() ? `?${params.toString()}` : ""
      }` as const;
    },
    details: (id: number | string) => `/user/baskets/${id}` as const,
  },

  /**
   * Order endpoints
   */
  orders: {
    list: (page?: number) =>
      `/user/orders${page ? `?page=${page}` : ""}` as const,
    details: (id: number | string) => `/user/orders/${id}` as const,
    preview: "/user/orders/preview" as const,
    create: "/user/orders" as const,
    couponPreview: "/user/orders/coupon-preview" as const,
  },

  /**
   * Favorites endpoints
   */
  favorites: {
    list: (type: string) => `/user/favorites?type=${type}` as const,
    toggle: "/user/favorites/toggle" as const,
  },

  /**
   * Packages & subscription endpoints
   */
  packages: {
    list: "/user/packages" as const,
    mySubscription: "/user/my-subscription" as const,
    subscribe: "/user/subscribe" as const,
  },

  /**
   * Legal documents (privacy policy, terms & conditions)
   */
  legalDocuments: {
    privacyPolicy: "/user/legal-documents/privacy_policy" as const,
    termsConditions: "/user/legal-documents/terms_conditions" as const,
    marketerTermsConditions: "/user/legal-documents/marketer_terms_conditions" as const,
  },

  /**
   * Points & rewards endpoints
   */
  points: {
    summary: "/user/points/summary" as const,
    transactions: (page?: number) =>
      `/user/points/transactions${page ? `?page=${page}` : ""}` as const,
    exchangeOptions: "/user/points/exchange/options" as const,
  },

  /**
   * Profile endpoints
   */
  profile: {
    get: "/user/auth/profile" as const,
    update: "/user/auth/profile/update" as const,
    updatePassword: "/user/auth/profile/update_password" as const,
    updateEmail: "/user/auth/profile/update_email" as const,
    updatePhone: "/user/auth/profile/update_phone" as const,
    verify: "/user/auth/profile/verify" as const,
  },
} as const;
