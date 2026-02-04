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
} as const;
