/**
 * Query Keys for React Query
 *
 * This file contains all query keys as functions that return arrays.
 * Each category has an `all()` function for bulk invalidation.
 * All keys use `as const` for maximum type safety.
 */

export const queryKeys = {
  /**
   * Authentication query keys
   */
  auth: {
    all: () => ["auth"] as const,
    login: () => ["auth", "login"] as const,
    register: () => ["auth", "register"] as const,
    verifyOtp: () => ["auth", "verifyOtp"] as const,
    sendOtp: () => ["auth", "sendOtp"] as const,
    sendPassword: () => ["auth", "sendPassword"] as const,
    verifyPassword: () => ["auth", "verifyPassword"] as const,
    resetPassword: () => ["auth", "resetPassword"] as const,
    me: () => ["auth", "me"] as const,
    logout: () => ["auth", "logout"] as const,
    sellerRegister: () => ["auth", "sellerRegister"] as const,
  },

  /**
   * Location query keys
   */
  location: {
    all: () => ["location"] as const,
    governorates: () => ["location", "governorates"] as const,
    cities: (governorateId?: number) =>
      governorateId
        ? (["location", "cities", governorateId] as const)
        : (["location", "cities"] as const),
    areas: (cityId?: number) =>
      cityId
        ? (["location", "areas", cityId] as const)
        : (["location", "areas"] as const),
  },

  /**
   * Addresses query keys
   */
  addresses: {
    all: () => ["addresses"] as const,
    list: (params?: unknown) =>
      params
        ? (["addresses", "list", params] as const)
        : (["addresses", "list"] as const),
  },

  /**
   * Sections query keys
   */
  sections: {
    all: () => ["sections"] as const,
    list: (pageSlug?: string) =>
      pageSlug
        ? (["sections", "list", pageSlug] as const)
        : (["sections", "list"] as const),
  },

  /**
   * Categories query keys
   */
  categories: {
    all: () => ["categories"] as const,
    list: (params?: unknown) =>
      params
        ? (["categories", "list", params] as const)
        : (["categories", "list"] as const),
  },

  /**
   * Product query keys
   */
  product: {
    all: () => ["product"] as const,
    details: (productId?: number, shopId?: number) =>
      productId !== undefined && shopId !== undefined
        ? (["product", "details", productId, shopId] as const)
        : (["product", "details"] as const),
    listByCategory: (categoryId?: number, page?: number) =>
      categoryId !== undefined
        ? page !== undefined
          ? (["product", "listByCategory", categoryId, page] as const)
          : (["product", "listByCategory", categoryId] as const)
        : (["product", "listByCategory"] as const),
    ratings: (rateableId?: number, rateableType?: string, page?: number) =>
      rateableId !== undefined && rateableType
        ? page !== undefined
          ? (["product", "ratings", rateableId, rateableType, page] as const)
          : (["product", "ratings", rateableId, rateableType] as const)
        : (["product", "ratings"] as const),
  },

  /**
   * Recipe query keys
   */
  recipes: {
    all: () => ["recipes"] as const,
    list: (page?: number) =>
      page !== undefined
        ? (["recipes", "list", page] as const)
        : (["recipes", "list"] as const),
    details: (id?: number) =>
      id !== undefined
        ? (["recipes", "details", id] as const)
        : (["recipes", "details"] as const),
  },

  /**
   * Brand query keys
   */
  brands: {
    all: () => ["brands"] as const,
    list: (page?: number) =>
      page !== undefined
        ? (["brands", "list", page] as const)
        : (["brands", "list"] as const),
    details: (id?: number | string) =>
      id !== undefined
        ? (["brands", "details", id] as const)
        : (["brands", "details"] as const),
    products: (brandId?: number, page?: number) =>
      brandId !== undefined
        ? page !== undefined
          ? (["brands", "products", brandId, page] as const)
          : (["brands", "products", brandId] as const)
        : (["brands", "products"] as const),
  },

  /**
   * Schedules query keys (delivery frequency options)
   */
  schedules: {
    all: () => ["schedules"] as const,
    list: (page?: number) =>
      page !== undefined
        ? (["schedules", "list", page] as const)
        : (["schedules", "list"] as const),
  },

  /**
   * Scheduled Basket query keys (user account)
   */
  scheduledBaskets: {
    all: () => ["scheduledBaskets"] as const,
    list: (page?: number) =>
      page !== undefined
        ? (["scheduledBaskets", "list", page] as const)
        : (["scheduledBaskets", "list"] as const),
    details: (id?: number | string) =>
      id !== undefined
        ? (["scheduledBaskets", "details", id] as const)
        : (["scheduledBaskets", "details"] as const),
  },

  /**
   * Basket query keys
   */
  baskets: {
    all: () => ["baskets"] as const,
    list: (isSchedule?: 0 | 1, page?: number) =>
      isSchedule !== undefined
        ? page !== undefined
          ? (["baskets", "list", isSchedule, page] as const)
          : (["baskets", "list", isSchedule] as const)
        : page !== undefined
        ? (["baskets", "list", page] as const)
        : (["baskets", "list"] as const),
    details: (id?: number | string) =>
      id !== undefined
        ? (["baskets", "details", id] as const)
        : (["baskets", "details"] as const),
  },

  /**
   * Shop query keys
   */
  shop: {
    all: () => ["shop"] as const,
    list: (page?: number) =>
      page !== undefined
        ? (["shop", "list", page] as const)
        : (["shop", "list"] as const),
    details: (id?: number) =>
      id !== undefined
        ? (["shop", "details", id] as const)
        : (["shop", "details"] as const),
  },

  /**
   * Order query keys
   */
  orders: {
    all: () => ["orders"] as const,
    list: (page?: number) => ["orders", "list", page] as const,
    listInfinite: () => ["orders", "list", "infinite"] as const,
    details: (id: number | string) => ["orders", "details", id] as const,
    preview: (
      addressId?: number | null,
      items?: unknown,
      cartType?: string,
      recipeId?: number,
      adminBasketId?: number,
      coupon?: string
    ) =>
      [
        "orders",
        "preview",
        addressId,
        items,
        cartType,
        recipeId,
        adminBasketId,
        coupon,
      ] as const,
  },

  /**
   * Profile query keys
   */
  profile: {
    all: () => ["profile"] as const,
    details: () => ["profile", "details"] as const,
  },

  /**
   * Packages & subscription query keys
   */
  packages: {
    all: () => ["packages"] as const,
    list: () => ["packages", "list"] as const,
    mySubscription: () => ["packages", "mySubscription"] as const,
  },

  /**
   * Legal documents query keys
   */
  legalDocuments: {
    privacyPolicy: () => ["legalDocuments", "privacyPolicy"] as const,
    termsConditions: () => ["legalDocuments", "termsConditions"] as const,
    marketerTermsConditions: () =>
      ["legalDocuments", "marketerTermsConditions"] as const,
  },

  /**
   * Points & rewards query keys
   */
  points: {
    all: () => ["points"] as const,
    summary: () => ["points", "summary"] as const,
    transactions: (page?: number) =>
      page !== undefined
        ? (["points", "transactions", page] as const)
        : (["points", "transactions"] as const),
    exchangeOptions: () => ["points", "exchangeOptions"] as const,
  },

  /**
   * Favorites query keys
   */
  favorites: {
    all: () => ["favorites"] as const,
    list: (type?: string) =>
      type !== undefined
        ? (["favorites", "list", type] as const)
        : (["favorites", "list"] as const),
  },
} as const;
