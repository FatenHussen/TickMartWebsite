/** Shared product listing filter params (products API + sections API). */
export type UserProductListFilters = {
    category_id?: number;
    brand_id?: number;
    shop_id?: number;
    country_id?: number;
    country?: string;
    name?: string;
    price_min?: number;
    price_max?: number;
    is_free_delivery?: boolean | 0 | 1;
    is_instant_delivery?: boolean | 0 | 1;
    on_sale?: boolean | 0 | 1;
    in_stock_only?: boolean | 0 | 1;
    attribute_values?: number[];
    type?:
        | "new"
        | "trend"
        | "top_rated"
        | "offers"
        | "recommended"
        | "for_you"
        | "search_based"
        | "most_popular";
    search?: string;
    sort_by?:
        | "price_desc"
        | "price_asc"
        | "newest"
        | "oldest"
        | "rating_desc"
        | "rating_asc"
        | "rating";
    sortField?: string;
    sortOrder?: "asc" | "desc";
    page?: number;
    per_page?: number;
};

function appendUserProductListFilters(
    params: URLSearchParams,
    filters?: UserProductListFilters,
) {
    if (filters?.category_id != null)
        params.append("category_id", String(filters.category_id));
    if (filters?.brand_id != null) params.append("brand_id", String(filters.brand_id));
    if (filters?.shop_id != null) params.append("shop_id", String(filters.shop_id));
    if (filters?.country_id != null)
        params.append("country_id", String(filters.country_id));
    if (filters?.country) params.append("country", filters.country.trim());
    if (filters?.name) params.append("name", filters.name.trim());
    if (filters?.price_min != null) params.append("price_min", String(filters.price_min));
    if (filters?.price_max != null) params.append("price_max", String(filters.price_max));
    if (filters?.is_free_delivery === true || filters?.is_free_delivery === 1)
        params.append("is_free_delivery", "1");
    if (filters?.is_instant_delivery != null) {
        const inst =
            filters.is_instant_delivery === true
                ? 1
                : filters.is_instant_delivery === false
                  ? 0
                  : filters.is_instant_delivery;
        params.append("is_instant_delivery", String(inst));
    }
    if (filters?.on_sale === true || filters?.on_sale === 1) params.append("on_sale", "1");
    if (filters?.in_stock_only === true || filters?.in_stock_only === 1)
        params.append("in_stock_only", "1");
    if (filters?.attribute_values?.length) {
        filters.attribute_values.forEach((v) =>
            params.append("attribute_values[]", String(v)),
        );
    }
    if (filters?.type) params.append("type", filters.type);
    if (filters?.search) params.append("search", filters.search.trim());
    if (filters?.sort_by) {
        params.append("sort_by", filters.sort_by);
    } else {
        if (filters?.sortField) params.append("sortField", filters.sortField);
        if (filters?.sortOrder) params.append("sortOrder", filters.sortOrder);
    }
}

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
        storeToken: "/user/auth/store-token" as const,
    },

    /**
    * Search endpoints (navbar autocomplete)
    * GET user/search?type=product|brand|shop|recipe&search=value
    */
    search: {
        list: (type: "product" | "brand" | "shop" | "recipe", search: string) => {
            const params = new URLSearchParams();
            params.set("type", type);
            if (search.trim()) params.set("search", search.trim());
            return `/user/search?${params.toString()}` as const;
        },
    },

    /**
    * Location endpoints
    */
    location: {
        governorates: "/user/governorates" as const,
        cities: "/user/cities" as const,
        areas: (cityId: number) => `/user/areas?city_id=${cityId}` as const,
        countries: "/user/countries" as const,
    },

    /**
    * Address endpoints
    */
    addresses: {
        list: "/user/addresses" as const,
        create: "/user/addresses" as const,
        update: (id: number | string) => `/user/addresses/${id}` as const,
        delete: (id: number | string) => `/user/addresses/${id}` as const,
    },

    /**
    * Sections endpoints
    */
    sections: {
        getByPage: (pageSlug: string, filters?: UserProductListFilters) => {
            const params = new URLSearchParams();
            params.set("page_slug", pageSlug);
            appendUserProductListFilters(params, filters);
            return `/user/sections?${params.toString()}` as const;
        },
    },

    /**
     * CMS promotions (public — active promos, optionally scoped by page slug)
     * GET /user/promotions?page_slug=...
     */
    promotions: {
        list: (pageSlug?: string) => {
            if (!pageSlug?.trim()) return `/user/promotions` as const;
            const q = new URLSearchParams();
            q.set("page_slug", pageSlug.trim());
            return `/user/promotions?${q.toString()}` as const;
        },
    },

    /**
    * FAQs endpoints (Help Center)
    * Requires type param. Returns { types: string[], faqs: { id, question, answer, type }[] }
    */
    faqs: {
        list: (type: string) =>
            `/user/faqs?type=${encodeURIComponent(type)}` as const,
    },

    notifications: {
        list: "/notifications" as const,
        markAsRead: "/notifications/mark-as-read" as const,
        markAllAsRead: "/notifications/mark-all-as-read" as const,
    },

    /**
    * App settings (contact, welcome, colors - public)
    */
    settings: {
        get: "/user/settings" as const,
    },

    /**
    * Categories endpoints
    */
    categories: {
        list: (filters?: {
            name?: string;
            parent_id?: number;
            search?: string;
            shop_id?: number;
            type?: "new" | "most_popular" | "top_rated";
            page?: number;
            per_page?: number;
        }) => {
            const params = new URLSearchParams();
            if (filters?.name) params.append("name", filters.name);
            if (filters?.parent_id) params.append("parent_id", String(filters.parent_id));
            if (filters?.search) params.append("search", filters.search.trim());
            if (filters?.shop_id) params.append("shop_id", String(filters.shop_id));
            if (filters?.type) params.append("type", filters.type);
            if (filters?.page) params.append("page", String(filters.page));
            if (filters?.per_page) params.append("per_page", String(filters.per_page));
            return `/user/categories${params.toString() ? `?${params.toString()}` : ""}` as const;
        },
        attributes: (categoryId: number) =>
            `/user/categories/${categoryId}/attributes` as const,
        /**
         * Category page (any level): `{ category, sections }` rendered by the shared
         * sections renderer. Product filters are forwarded because the page's `type: "api"`
         * sections resolve their items through the same product query — without them the
         * sections keep showing unfiltered items while the listing below is filtered.
         */
        page: (categoryId: number, filters?: UserProductListFilters) => {
            const params = new URLSearchParams();
            appendUserProductListFilters(params, filters);
            const qs = params.toString();
            return `/user/categories/${categoryId}/page${qs ? `?${qs}` : ""}` as const;
        },
    },

    /**
    * Product endpoints
    */
    product: {
        list: (filters?: UserProductListFilters) => {
            const params = new URLSearchParams();
            appendUserProductListFilters(params, filters);
            if (filters?.page) params.append("page", String(filters.page));
            if (filters?.per_page) params.append("per_page", String(filters.per_page));
            return `/user/products${params.toString() ? `?${params.toString()}` : ""
                }` as const;
        },
        details: (productId: number, lat: number, lng: number, shopId?: number) =>
            `/user/products/${productId}?lat=${lat}&lng=${lng}${shopId ? `&shop_id=${shopId}` : ""}` as const,
        listByCategory: (categoryId: number, page?: number) =>
            `/user/products?category_id=${categoryId}${page ? `&page=${page}` : ""
            }` as const,
        listByShop: (shopId: number, page?: number, categoryId?: number) =>
            `/user/products?shop_id=${shopId}${page ? `&page=${page}` : ""}${categoryId != null ? `&category_id=${categoryId}` : ""
            }` as const,
    },

    /**
    * Shop endpoints
    */
    shop: {
        list: (filters?: {
            page?: number;
            area_id?: number;
            city_id?: number;
            lat?: number;
            lng?: number;
            max_distance?: number;
            governorate_id?: number;
            category_id?: number;
            brand_id?: number;
            search?: string;
            type?: "top_rated" | "offers" | "nearby" | "active";
            is_service_provider?: 0 | 1;
        }) => {
            const params = new URLSearchParams();
            if (filters?.page) params.append("page", String(filters.page));
            if (filters?.area_id != null) params.append("area_id", String(filters.area_id));
            if (filters?.city_id != null) params.append("city_id", String(filters.city_id));
            if (filters?.type) params.append("type", filters.type);
            if (filters?.lat != null) params.append("lat", String(filters.lat));
            if (filters?.lng != null) params.append("lng", String(filters.lng));
            if (filters?.max_distance != null)
                params.append("max_distance", String(filters.max_distance));
            if (filters?.governorate_id != null)
                params.append("governorate_id", String(filters.governorate_id));
            if (filters?.category_id != null)
                params.append("category_id", String(filters.category_id));
            if (filters?.brand_id != null)
                params.append("brand_id", String(filters.brand_id));
            if (filters?.is_service_provider != null)
                params.append("is_service_provider", String(filters.is_service_provider));
            if (filters?.search)
                params.append("search", filters.search.trim());
            return `/user/shops${params.toString() ? `?${params.toString()}` : ""
                }` as const;
        },
        details: (shopId: number) => `/user/shops/${shopId}` as const,
        services: (shopId: number) => `/user/shops/${shopId}/services` as const,
    },

    vendorServices: {
        list: "/user/vendor-services" as const,
    },

    /**
    * Service Orders endpoints (booking a vendor service)
    */
    serviceOrders: {
        list: (params?: {
            status?: string;
            search?: string;
            sort_field?: "id" | "created_at" | "date";
            sort_order?: "asc" | "desc";
            page?: number;
            per_page?: number;
        }) => {
            const p = new URLSearchParams();
            if (params?.status) p.append("status", params.status);
            if (params?.search) p.append("search", params.search.trim());
            if (params?.sort_field) p.append("sort_field", params.sort_field);
            if (params?.sort_order) p.append("sort_order", params.sort_order);
            if (params?.page) p.append("page", String(params.page));
            if (params?.per_page) p.append("per_page", String(params.per_page));
            return `/user/service-orders${p.toString() ? `?${p.toString()}` : ""}` as const;
        },
        details: (id: number | string) => `/user/service-orders/${id}` as const,
        create: "/user/service-orders" as const,
    },

    /**
    * Ratings endpoints (product, recipe, shop, delivery, basket, etc.)
    */
    ratings: {
        list: (
            rateableId: number,
            rateableType: string,
            page?: number,
            perPage?: number
        ) => {
            const params = new URLSearchParams();
            params.set("rateable_id", String(rateableId));
            params.set("rateable_type", rateableType);
            if (page) params.set("page", String(page));
            if (perPage) params.set("per_page", String(perPage));
            return `/user/ratings?${params.toString()}` as const;
        },
        myRatings: (type?: string, rateableId?: number) => {
            const params = new URLSearchParams();
            if (type) params.set("type", type);
            if (rateableId != null) params.set("rateable_id", String(rateableId));
            const q = params.toString();
            return `/user/ratings/my_ratings${q ? `?${q}` : ""}` as const;
        },
        canRate: (productId: number) =>
            `/user/ratings/can-rate?product_id=${productId}` as const,
        create: "/user/ratings" as const,
        update: (id: number) => `/user/ratings/${id}` as const,
        delete: (id: number) => `/user/ratings/${id}` as const,
    },

    /**
    * Recipe endpoints
    */
    recipes: {
        list: (filters?: {
            search?: string;
            discount_min?: number;
            discount_max?: number;
            serves_min?: number;
            serves_max?: number;
            prepare_time_min?: number;
            prepare_time_max?: number;
            type?: "newest" | "popular" | "top_rated" | "on_sale";
            sort_by?: "newest" | "oldest" | "price_desc" | "price_asc";
            sortField?: string;
            sortOrder?: "asc" | "desc";
            page?: number;
            per_page?: number;
        }) => {
            const params = new URLSearchParams();
            if (filters?.search) params.append("search", filters.search.trim());
            if (filters?.discount_min != null) params.append("discount_min", String(filters.discount_min));
            if (filters?.discount_max != null) params.append("discount_max", String(filters.discount_max));
            if (filters?.serves_min != null) params.append("serves_min", String(filters.serves_min));
            if (filters?.serves_max != null) params.append("serves_max", String(filters.serves_max));
            if (filters?.prepare_time_min != null) params.append("prepare_time_min", String(filters.prepare_time_min));
            if (filters?.prepare_time_max != null) params.append("prepare_time_max", String(filters.prepare_time_max));
            if (filters?.type) params.append("type", filters.type);
            if (filters?.sort_by) {
                params.append("sort_by", filters.sort_by);
            } else {
                if (filters?.sortField) params.append("sortField", filters.sortField);
                if (filters?.sortOrder) params.append("sortOrder", filters.sortOrder);
            }
            if (filters?.page) params.append("page", String(filters.page));
            if (filters?.per_page) params.append("per_page", String(filters.per_page));
            return `/user/recipes${params.toString() ? `?${params.toString()}` : ""}` as const;
        },
        details: (id: number | string) => `/user/recipes/${id}` as const,
    },

    /**
    * Brand endpoints
    */
    brands: {
        list: (filters?: {
            search?: string;
            type?: "new" | "top_rated" | "most_popular";
            page?: number;
            per_page?: number;
        }) => {
            const params = new URLSearchParams();
            if (filters?.search) params.append("search", filters.search.trim());
            if (filters?.type) params.append("type", filters.type);
            if (filters?.page) params.append("page", String(filters.page));
            if (filters?.per_page) params.append("per_page", String(filters.per_page));
            return `/user/brands${params.toString() ? `?${params.toString()}` : ""
                }` as const;
        },
        details: (id: number | string) => `/user/brands/${id}` as const,
        products: (brandId: number, page?: number) =>
            `/user/products?brand_id=${brandId}${page ? `&page=${page}` : ""
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
        list: (filters?: {
            is_schedule?: 0 | 1;
            category_id?: number;
            price_min?: number;
            price_max?: number;
            rating_min?: number;
            items_count_min?: number;
            items_count_max?: number;
            type?: "new" | "best_selling" | "top_rated";
            page?: number;
            per_page?: number;
        }) => {
            const params = new URLSearchParams();
            if (filters?.is_schedule !== undefined)
                params.append("is_schedule", String(filters.is_schedule));
            if (filters?.category_id) params.append("category_id", String(filters.category_id));
            if (filters?.price_min != null) params.append("price_min", String(filters.price_min));
            if (filters?.price_max != null) params.append("price_max", String(filters.price_max));
            if (filters?.rating_min != null) params.append("rating_min", String(filters.rating_min));
            if (filters?.items_count_min != null) params.append("items_count_min", String(filters.items_count_min));
            if (filters?.items_count_max != null) params.append("items_count_max", String(filters.items_count_max));
            if (filters?.type) params.append("type", filters.type);
            if (filters?.page) params.append("page", String(filters.page));
            if (filters?.per_page) params.append("per_page", String(filters.per_page));
            return `/user/baskets${params.toString() ? `?${params.toString()}` : ""
                }` as const;
        },
        details: (id: number | string) => `/user/baskets/${id}` as const,
    },

    /**
    * Order endpoints
    */
    orders: {
        list: (filters?: { status?: string; page?: number; per_page?: number }) => {
            const params = new URLSearchParams();
            if (filters?.status) params.append("status", filters.status);
            if (filters?.page) params.append("page", String(filters.page));
            if (filters?.per_page) params.append("per_page", String(filters.per_page));
            return `/user/orders${params.toString() ? `?${params.toString()}` : ""}` as const;
        },
        details: (id: number | string) => `/user/orders/${id}` as const,
        preview: "/user/orders/preview" as const,
        create: "/user/orders" as const,
        couponPreview: "/user/orders/coupon-preview" as const,
        cancel: (id: number | string) => `/user/orders/${id}/cancel` as const,
        reorder: (id: number | string) => `/user/orders/reorder/${id}` as const,
        active: "/user/orders/active" as const,
    },

    /**
    * Active benefits (points exchanges + subscription benefits)
    */
    activeBenefits: {
        get: "/user/active-benefits" as const,
    },

    /**
    * Payment methods
    */
    paymentMethods: {
        list: "/user/payment-methods" as const,
    },

    /**
    * Favorites endpoints
    */
    favorites: {
        list: (
            type?: string,
            params?: { shop_id?: number; category_id?: number; page?: number; per_page?: number }
        ) => {
            const p = new URLSearchParams();
            if (type != null && type !== "") p.set("type", type);
            if (params?.shop_id != null) p.append("shop_id", String(params.shop_id));
            if (params?.category_id != null)
                p.append("category_id", String(params.category_id));
            if (params?.page != null) p.append("page", String(params.page));
            if (params?.per_page != null) p.append("per_page", String(params.per_page));
            const qs = p.toString();
            return (qs ? `/user/favorites?${qs}` : "/user/favorites") as `${string}`;
        },
        toggle: "/user/favorites/toggle" as const,
    },

    /**
    * Complaints endpoints
    */
    complaints: {
        list: (params?: {
            status?: string;
            order_id?: number;
            from?: string;
            to?: string;
            page?: number;
            per_page?: number;
        }) => {
            const p = new URLSearchParams();
            if (params?.status) p.append("status", params.status);
            if (params?.order_id != null) p.append("order_id", String(params.order_id));
            if (params?.from) p.append("from", params.from);
            if (params?.to) p.append("to", params.to);
            if (params?.page != null) p.append("page", String(params.page));
            if (params?.per_page != null) p.append("per_page", String(params.per_page));
            return `/user/complaints${p.toString() ? `?${p.toString()}` : ""}` as const;
        },
        store: "/user/complaints/store" as const,
        orders: "/user/complaints/orders" as const,
    },

    /**
    * Packages & subscription endpoints
    */
    packages: {
        list: "/user/packages" as const,
        mySubscription: "/user/my-subscription" as const,
        subscribe: "/user/subscribe" as const,
        renew: "/user/renew" as const,
        benefits: "/user/subscription/benefits" as const,
        cancelSubscription: (packageId: number | string) =>
            `/user/cancel-subscription/${packageId}` as const,
    },

    /**
    * Currencies (list, user's currency, update)
    */
    currencies: {
        list: "/user/currencies" as const,
        myCurrency: "/user/currencies/my-currency" as const,
        updateCurrency: "/user/currencies/update-currency" as const,
    },

    /**
    * My Baskets (user's subscription/custom/scheduled baskets)
    */
    myBaskets: {
        list: (type?: "subscription" | "custom" | "user-schedule") => {
            if (!type) return "/user/my-baskets" as const;
            return `/user/my-baskets?type=${encodeURIComponent(type)}` as const;
        },
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
        activePoints: "/user/active-points" as const,
        summary: "/user/points/summary" as const,
        transactions: (page?: number) =>
            `/user/points/transactions${page ? `?page=${page}` : ""}` as const,
        exchangeOptions: "/user/points/exchange/options" as const,
        exchangeCoupon: "/user/points/exchange/coupon" as const,
        exchangeGift: "/user/points/exchange/gift" as const,
        exchangeHistory: (page?: number) =>
            `/user/points/exchange/history${page ? `?page=${page}` : ""}` as const,
    },

    userGifts: {
        setAddress: (id: number | string) => `/user/user-gifts/${id}/address` as const,
    },

    /**
    * Marketer / Affiliate endpoints
    */
    marketer: {
        request: "/user/auth/markter-request" as const,
        statistics: "/user/markter/statistics" as const,
        profile: "/user/markter/profile" as const,
        orders: (params?: { per_page?: number; from?: string; to?: string; coupon_code?: string; page?: number }) => {
            const p = new URLSearchParams();
            if (params?.per_page) p.append("per_page", String(params.per_page));
            if (params?.from) p.append("from", params.from);
            if (params?.to) p.append("to", params.to);
            if (params?.coupon_code) p.append("coupon_code", params.coupon_code);
            if (params?.page) p.append("page", String(params.page));
            return `/user/markter/orders${p.toString() ? `?${p.toString()}` : ""}` as const;
        },
        transactions: (params?: { per_page?: number; type?: string; from?: string; to?: string; page?: number }) => {
            const p = new URLSearchParams();
            if (params?.per_page) p.append("per_page", String(params.per_page));
            if (params?.type) p.append("type", params.type);
            if (params?.from) p.append("from", params.from);
            if (params?.to) p.append("to", params.to);
            if (params?.page) p.append("page", String(params.page));
            return `/user/markter/transactions${p.toString() ? `?${p.toString()}` : ""}` as const;
        },
        withdrawRequest: "/user/markter/withdraw-request" as const,
        withdrawRequests: (params?: { per_page?: number; status?: string; page?: number }) => {
            const p = new URLSearchParams();
            if (params?.per_page) p.append("per_page", String(params.per_page));
            if (params?.status) p.append("status", params.status);
            if (params?.page) p.append("page", String(params.page));
            return `/user/markter/withdraw-requests${p.toString() ? `?${p.toString()}` : ""}` as const;
        },
        monthlyOrders: (year?: number) =>
            `/user/markter/monthly-orders${year ? `?year=${year}` : ""}` as const,
    },

    /**
    * Affiliate welcome / quick actions (authenticated)
    */
    quickActions: {
        list: "/user/quick-actions" as const,
    },

    /**
    * Dashboard-managed top navigation bar (public — no auth required).
    * Returns enabled items only, sorted by `order`; titles follow Accept-Language.
    */
    navMenu: {
        list: "/user/nav-menu" as const,
    },

    /**
    * Popup campaign endpoints (public — no auth required)
    */
    popups: {
        active: (params?: {
            page_type?: string;
            current_url?: string;
            product_id?: number;
            shop_id?: number;
            recipe_id?: number;
            basket_id?: number;
            shop_vendor_service_id?: number;
        }) => {
            const p = new URLSearchParams();
            if (params?.page_type) p.set("page_type", params.page_type);
            if (params?.current_url) p.set("current_url", params.current_url);
            if (params?.product_id != null) p.set("product_id", String(params.product_id));
            if (params?.shop_id != null) p.set("shop_id", String(params.shop_id));
            if (params?.recipe_id != null) p.set("recipe_id", String(params.recipe_id));
            if (params?.basket_id != null) p.set("basket_id", String(params.basket_id));
            if (params?.shop_vendor_service_id != null)
                p.set("shop_vendor_service_id", String(params.shop_vendor_service_id));
            const qs = p.toString();
            return `/popups/active${qs ? `?${qs}` : ""}`;
        },
        trackView: (id: number) => `/popups/${id}/track-view`,
        trackClick: (id: number) => `/popups/${id}/track-click`,
        trackDismiss: (id: number) => `/popups/${id}/track-dismiss`,
        submitForm: (id: number) => `/popups/${id}/submit-form`,
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
        deleteAccount: "/user/auth/profile/delete-account" as const,
    },
} as const;
