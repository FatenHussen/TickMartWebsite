// ==================== Auth Method Types ====================
export type AuthMethod ="email"|"phone";

// ==================== Form Types ====================
export type SignUpFormValues = {
 fullName: string;
 emailOrPhone: string;
 password: string;
 confirmPassword: string;
 governorate: string;
 city: string;
 agree: boolean;
};

export type SignInFormValues = {
 emailOrPhone: string;
 password: string;
};

export type ForgotPasswordFormValues = {
 emailOrPhone: string;
};

// ==================== Auth API Types ====================
export interface LoginPayload {
 email?: string;
 phone?: string;
 password: string;
}

export interface RegisterPayload {
 name: string;
 email?: string;
 phone?: string;
 password: string;
 city_id: number;
 governorate_id: number;
}

export interface LoginResponse {
 status: boolean;
 message: string;
 data: {
 user: {
 id: number;
 name: string;
 email?: string;
 phone?: string;
 };
 token: string;
 };
}

export interface RegisterResponse {
 status: boolean;
 message: string;
 data: {
 message?: string;
 [key: string]: unknown;
 };
}

export interface VerifyOtpPayload {
 email?: string;
 phone?: string;
 code: string;
}

export interface VerifyOtpResponse {
 status: boolean;
 message: string;
 data: {
 user: {
 id: number;
 name: string;
 email?: string;
 phone?: string;
 };
 token: string;
 };
}

export interface SendOtpPayload {
 email?: string;
 phone?: string;
}

export interface SendOtpResponse {
 status: boolean;
 message: string;
 data: {
 message?: string;
 [key: string]: unknown;
 };
}

export interface SendPasswordPayload {
 email?: string;
 phone?: string;
}

export interface SendPasswordResponse {
 status: boolean;
 message: string;
 data: {
 message?: string;
 [key: string]: unknown;
 };
}

export interface VerifyPasswordPayload {
 email?: string;
 phone?: string;
 code: string;
}

export interface VerifyPasswordResponse {
 status: boolean;
 message: string;
 data: {
 user: {
 id: number;
 name: string;
 email?: string;
 phone?: string;
 };
 };
}

export interface ResetPasswordPayload {
 new_password: string;
 new_password_confirmation: string;
}

export interface ResetPasswordResponse {
 status: boolean;
 message: string;
 data: {
 message?: string;
 [key: string]: unknown;
 };
}

export type ChangePasswordFormValues = {
 currentPassword: string;
 newPassword: string;
 confirmNewPassword: string;
};

// ==================== Country (phone prefix) Types ====================
export interface Country {
 id: number;
 name: string;
 code: string; // e.g."+963"
}

export interface CountriesResponse {
 status: boolean;
 message: string;
 data: {
 items: Country[];
 pagination: unknown;
 };
}

// ==================== Location API Types ====================
export interface Governorate {
 id: number;
 name: string;
 created_at: string;
}

export interface City {
 id: number;
 name: string;
 governorate?: {
 id: number;
 name: string;
 created_at: string;
 };
 created_at: string;
}

export interface Pagination {
 current_page: number;
 last_page: number;
 per_page: number;
 total: number;
}

export interface GovernoratesResponse {
 status: boolean;
 message: string;
 data: {
 items: Governorate[];
 pagination: Pagination;
 };
}

export interface CitiesResponse {
 status: boolean;
 message: string;
 data: City;
}

export interface Area {
 id: number;
 name: string;
 city_id: number;
 created_at?: string;
}

export interface AreasResponse {
 status: boolean;
 message: string;
 data:
 | {
 items: Area[];
 }
 | Area[];
}

// ==================== User Types ====================
export interface User {
 id: number;
 name: string;
 email?: string;
 phone?: string;
}

export type UserRole ="customer"|"seller";

// ==================== Seller Registration Types ====================
export type SellerSignUpFormValues = {
 emailOrPhone: string;
 password: string;
 confirmPassword: string;
 sellerName: string;
 storeName: string;
 storeAddress: string;
 commercialRegisterNumber: string;
 commercialRegisterDate: string;
 country: string;
 governorate: string;
 storeCity: string;
 isRestaurant: boolean;
 serviceTypeIds: number[];
};

export interface SellerRegisterPayload {
 email?: string;
 phone?: string;
 password: string;
 seller_name: string;
 store_name: string;
 address: string;
 commercial_register_number: string;
 commercial_register_date: string;
 country: string;
 /** Shop registration */
 is_restaurant?: boolean;
 /** When true, `service_type_ids` should be sent */
 is_service_provider?: boolean;
 /** Vendor service type ids (`vendor_service_types.id`), required when registering as service provider */
 service_type_ids?: number[];
}
