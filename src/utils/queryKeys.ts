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
 login: () => ["auth","login"] as const,
 register: () => ["auth","register"] as const,
 verifyOtp: () => ["auth","verifyOtp"] as const,
 sendOtp: () => ["auth","sendOtp"] as const,
 sendPassword: () => ["auth","sendPassword"] as const,
 verifyPassword: () => ["auth","verifyPassword"] as const,
 resetPassword: () => ["auth","resetPassword"] as const,
 me: () => ["auth","me"] as const,
 logout: () => ["auth","logout"] as const,
 sellerRegister: () => ["auth","sellerRegister"] as const,
 },

 /**
 * Location query keys
 */
 location: {
 all: () => ["location"] as const,
 governorates: () => ["location","governorates"] as const,
 cities: (governorateId?: number) =>
 governorateId
 ? (["location","cities", governorateId] as const)
 : (["location","cities"] as const),
 areas: (cityId?: number) =>
 cityId
 ? (["location","areas", cityId] as const)
 : (["location","areas"] as const),
 countries: () => ["location","countries"] as const,
 },

 /**
 * Addresses query keys
 */
 addresses: {
 all: () => ["addresses"] as const,
 list: (params?: unknown) =>
 params
 ? (["addresses","list", params] as const)
 : (["addresses","list"] as const),
 },

 /**
 * Sections query keys
 */
 sections: {
 all: () => ["sections"] as const,
 list: (pageSlug?: string, filters?: Record<string, unknown>) =>
 pageSlug
 ? (["sections","list", pageSlug, filters ?? {}] as const)
 : (["sections","list"] as const),
 },

 /**
 * User promotions (CMS / marketing banners)
 */
 promotions: {
 all: () => ["promotions"] as const,
 list: (pageSlug?: string) =>
 pageSlug
 ? (["promotions","list", pageSlug] as const)
 : (["promotions","list"] as const),
 },

 /**
 * FAQs query keys (Help Center)
 */
 faqs: {
 all: () => ["faqs"] as const,
 list: (type?: string) =>
 type ? (["faqs","list", type] as const) : (["faqs","list"] as const),
 },

 /**
 * App settings query keys
 */
 appSettings: {
 all: () => ["appSettings"] as const,
 get: () => ["appSettings","get"] as const,
 },

 /**
 * Categories query keys
 */
 categories: {
 all: () => ["categories"] as const,
 list: (params?: unknown) =>
 params
 ? (["categories","list", params] as const)
 : (["categories","list"] as const),
 page: (categoryId?: number, filters?: Record<string, unknown>) =>
 categoryId !== undefined
 ? (["categories","page", categoryId, filters ?? {}] as const)
 : (["categories","page"] as const),
 /** Attribute chips cached by root category id (same attrs for the whole tree). */
 attributesRoot: (rootCategoryId: number) =>
 ["categories", "attributes", "root", rootCategoryId] as const,
 },

 /**
 * Product query keys
 */
 product: {
 all: () => ["product"] as const,
 details: (productId?: number, shopId?: number) =>
 productId !== undefined && shopId !== undefined
 ? (["product","details", productId, shopId] as const)
 : (["product","details"] as const),
 listByCategory: (categoryId?: number, page?: number) =>
 categoryId !== undefined
 ? page !== undefined
 ? (["product","listByCategory", categoryId, page] as const)
 : (["product","listByCategory", categoryId] as const)
 : (["product","listByCategory"] as const),
 ratings: (rateableId?: number, rateableType?: string, page?: number) =>
 rateableId !== undefined && rateableType
 ? page !== undefined
 ? (["product","ratings", rateableId, rateableType, page] as const)
 : (["product","ratings", rateableId, rateableType] as const)
 : (["product","ratings"] as const),
 },

 /**
 * Recipe query keys
 */
 recipes: {
 all: () => ["recipes"] as const,
 list: (filters?: object) =>
 filters && Object.keys(filters).length > 0
 ? (["recipes","list", filters] as const)
 : (["recipes","list"] as const),
 details: (id?: number) =>
 id !== undefined
 ? (["recipes","details", id] as const)
 : (["recipes","details"] as const),
 },

 /**
 * Brand query keys
 */
 brands: {
 all: () => ["brands"] as const,
 list: (filters?: { search?: string; type?: string; page?: number }) =>
 filters && Object.keys(filters).length > 0
 ? (["brands","list", filters] as const)
 : (["brands","list"] as const),
 listInfinite: (filters?: { search?: string; type?: string }) =>
 filters && Object.keys(filters).length > 0
 ? (["brands","list","infinite", filters] as const)
 : (["brands","list","infinite"] as const),
 details: (id?: number | string) =>
 id !== undefined
 ? (["brands","details", id] as const)
 : (["brands","details"] as const),
 products: (brandId?: number, filters?: object) =>
 brandId !== undefined
 ? filters && Object.keys(filters).length > 0
 ? (["brands","products", brandId, filters] as const)
 : (["brands","products", brandId] as const)
 : (["brands","products"] as const),
 },

 /**
 * Schedules query keys (delivery frequency options)
 */
 schedules: {
 all: () => ["schedules"] as const,
 list: (page?: number) =>
 page !== undefined
 ? (["schedules","list", page] as const)
 : (["schedules","list"] as const),
 },

 /**
 * Scheduled Basket query keys (user account)
 */
 scheduledBaskets: {
 all: () => ["scheduledBaskets"] as const,
 list: (page?: number) =>
 page !== undefined
 ? (["scheduledBaskets","list", page] as const)
 : (["scheduledBaskets","list"] as const),
 details: (id?: number | string) =>
 id !== undefined
 ? (["scheduledBaskets","details", id] as const)
 : (["scheduledBaskets","details"] as const),
 },

 /**
 * Basket query keys
 */
 baskets: {
 all: () => ["baskets"] as const,
 list: (filters?: object) =>
 filters && Object.keys(filters).length > 0
 ? (["baskets","list", filters] as const)
 : (["baskets","list"] as const),
 details: (id?: number | string) =>
 id !== undefined
 ? (["baskets","details", id] as const)
 : (["baskets","details"] as const),
 },

 /**
 * Shop query keys
 */
 shop: {
 all: () => ["shop"] as const,
 list: (filters?: {
 page?: number;
 type?: string;
 lat?: number;
 lng?: number;
 }) =>
 filters
 ? (["shop","list", filters] as const)
 : (["shop","list"] as const),
 listInfinite: (filters?: {
 type?: string;
 area_id?: number;
 city_id?: number;
 governorate_id?: number;
 category_id?: number;
 brand_id?: number;
 search?: string;
 lat?: number;
 lng?: number;
 max_distance?: number;
 is_service_provider?: 0 | 1;
 }) =>
 filters && Object.keys(filters).length > 0
 ? (["shop","list","infinite", filters] as const)
 : (["shop","list","infinite"] as const),
 details: (id?: number) =>
 id !== undefined
 ? (["shop","details", id] as const)
 : (["shop","details"] as const),
 services: (id?: number) =>
 id !== undefined
 ? (["shop","services", id] as const)
 : (["shop","services"] as const),
 vendorServices: () => ["shop","vendorServices"] as const,
 },

 /**
 * Order query keys
 */
 orders: {
 all: () => ["orders"] as const,
 list: (page?: number) => ["orders","list", page] as const,
 listInfinite: (status?: string) =>
 status
 ? (["orders","list","infinite", status] as const)
 : (["orders","list","infinite"] as const),
 details: (id: number | string) => ["orders","details", id] as const,
 active: () => ["orders","active"] as const,
 preview: (
 addressId?: number | null,
 items?: unknown,
 cartType?: string,
 recipeId?: number,
 adminBasketId?: number,
 coupon?: string,
 benefits?: unknown
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
 benefits,
 ] as const,
 },

 /**
 * Active Benefits query keys
 */
 activeBenefits: {
 all: () => ["activeBenefits"] as const,
 get: () => ["activeBenefits","get"] as const,
 },

 /**
 * Payment Methods query keys
 */
 paymentMethods: {
 all: () => ["paymentMethods"] as const,
 list: () => ["paymentMethods","list"] as const,
 },

 /**
 * Profile query keys
 */
 profile: {
 all: () => ["profile"] as const,
 details: () => ["profile","details"] as const,
 },

 /**
 * Packages & subscription query keys
 */
 packages: {
 all: () => ["packages"] as const,
 list: () => ["packages","list"] as const,
 mySubscription: () => ["packages","mySubscription"] as const,
 benefits: () => ["packages","benefits"] as const,
 },

 /**
 * Currencies query keys
 */
 currencies: {
 all: () => ["currencies"] as const,
 list: () => ["currencies","list"] as const,
 myCurrency: () => ["currencies","myCurrency"] as const,
 },

 /**
 * My Baskets query keys (user's baskets)
 */
 myBaskets: {
 all: () => ["myBaskets"] as const,
 list: (type?:"subscription"|"custom"|"user-schedule") =>
 type
 ? (["myBaskets","list", type] as const)
 : (["myBaskets","list"] as const),
 },

 /**
 * Legal documents query keys
 */
 legalDocuments: {
 privacyPolicy: () => ["legalDocuments","privacyPolicy"] as const,
 termsConditions: () => ["legalDocuments","termsConditions"] as const,
 marketerTermsConditions: () =>
 ["legalDocuments","marketerTermsConditions"] as const,
 },

 /**
 * Points & rewards query keys
 */
 points: {
 all: () => ["points"] as const,
 activePoints: () => ["points","activePoints"] as const,
 summary: () => ["points","summary"] as const,
 transactions: (page?: number) =>
 page !== undefined
 ? (["points","transactions", page] as const)
 : (["points","transactions"] as const),
 exchangeOptions: () => ["points","exchangeOptions"] as const,
 exchangeHistory: (page?: number) =>
 page !== undefined
 ? (["points","exchangeHistory", page] as const)
 : (["points","exchangeHistory"] as const),
 },

 /**
 * Affiliate welcome page
 */
 affiliate: {
 all: () => ["affiliate"] as const,
 quickActions: () => ["affiliate","quickActions"] as const,
 },

 /**
 * Marketer / Affiliate query keys
 */
 marketer: {
 all: () => ["marketer"] as const,
 statistics: () => ["marketer","statistics"] as const,
 profile: () => ["marketer","profile"] as const,
 orders: (params?: unknown) =>
 params ? (["marketer","orders", params] as const) : (["marketer","orders"] as const),
 transactions: (params?: unknown) =>
 params ? (["marketer","transactions", params] as const) : (["marketer","transactions"] as const),
 withdrawRequests: (params?: unknown) =>
 params ? (["marketer","withdrawRequests", params] as const) : (["marketer","withdrawRequests"] as const),
 monthlyOrders: (year?: number) =>
 year !== undefined ? (["marketer","monthlyOrders", year] as const) : (["marketer","monthlyOrders"] as const),
 },

 /**
 * Favorites query keys
 */
 favorites: {
 all: () => ["favorites"] as const,
 list: (type?: string, params?: object) =>
 type !== undefined
 ? params
 ? (["favorites","list", type, params] as const)
 : (["favorites","list", type] as const)
 : (["favorites","list"] as const),
 },

 /**
 * Custom / quick order request query keys
 */
 customOrderRequests: {
 all: () => ["customOrderRequests"] as const,
 list: (params?: object) =>
 params
 ? (["customOrderRequests", "list", params] as const)
 : (["customOrderRequests", "list"] as const),
 details: (id?: number | string) =>
 id !== undefined
 ? (["customOrderRequests", "details", id] as const)
 : (["customOrderRequests", "details"] as const),
 },

 /**
 * Complaints query keys
 */
 complaints: {
 all: () => ["complaints"] as const,
 list: (params?: object) =>
 params ? (["complaints","list", params] as const) : (["complaints","list"] as const),
 orders: () => ["complaints","orders"] as const,
 },

 /**
 * Ratings query keys (my ratings, can-rate, list)
 */
 ratings: {
 all: () => ["ratings"] as const,
 list: (rateableId?: number, rateableType?: string, page?: number) =>
 rateableId !== undefined && rateableType
 ? page !== undefined
 ? (["ratings","list", rateableId, rateableType, page] as const)
 : (["ratings","list", rateableId, rateableType] as const)
 : (["ratings","list"] as const),
 myRatings: (type?: string, rateableId?: number) =>
 type !== undefined || rateableId !== undefined
 ? (["ratings","myRatings", type, rateableId] as const)
 : (["ratings","myRatings"] as const),
 canRate: (productId?: number) =>
 productId !== undefined
 ? (["ratings","canRate", productId] as const)
 : (["ratings","canRate"] as const),
 },
 notifications: {
 all: () => ["notifications"] as const,
 list: (params?: { read?: boolean; page?: number; target_page?: string }) =>
 params ? (["notifications","list", params] as const) : (["notifications","list"] as const),
 },

 /**
 * Top navigation bar query keys.
 * Keyed by language — item titles come back in the requested language only.
 */
 navMenu: {
 all: () => ["navMenu"] as const,
 list: (language?: string) =>
 language
 ? (["navMenu","list", language] as const)
 : (["navMenu","list"] as const),
 },

 /**
 * Popup campaign query keys
 */
 popups: {
        all: () => ["popups"] as const,
        active: (params?: {
            page_type?: string;
            current_url?: string;
            product_id?: number;
            shop_id?: number;
            recipe_id?: number;
            basket_id?: number;
        }) =>
            params && Object.keys(params).filter((k) => params[k as keyof typeof params] != null).length > 0
                ? (["popups", "active", params] as const)
                : (["popups", "active"] as const),
    },
} as const;
