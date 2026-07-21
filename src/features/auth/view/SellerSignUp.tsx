import { useForm } from"react-hook-form";
import { useState, useRef, useEffect } from"react";
import { useTranslation } from"react-i18next";
import { useQuery } from"@tanstack/react-query";
import { toast } from"sonner";
import AuthLayout from"@/features/auth/layout/Auth-Layout";
import AuthRoleToggle from"@/features/auth/components/AuthRoleToggle";
import EmailOrPhoneInput from"@/features/auth/components/EmailOrPhoneInput";
import InputField from"@/shared/ui/InputField";
import Button from"@/shared/ui/Button";
import Label from"@/shared/ui/Label";
import { HiOutlinePhotograph } from"react-icons/hi";
import { cn, detectEmailOrPhone } from"@/shared/lib/utils";
import { useTheme } from"@/context/ThemeContext";
import { _LocationApi } from"@/features/auth/api/location.service";
import { _ShopApi } from"@/features/store/api/shopApi";
import { useSellerRegister } from"@/features/auth/hooks/useAuth";
import { useInfiniteSelect } from"@/shared/hooks/useInfiniteSelect";
import { queryKeys } from"@/utils/queryKeys";
import type { VendorServiceField } from"@/features/store/types/shop";
import type {
 City,
 Governorate,
 SellerRegisterPayload,
 SellerSignUpFormValues,
 UserRole,
} from"@/features/auth/types";

function pickVendorServiceLabel(
 text: VendorServiceField | undefined | null,
 lang: "ar" | "en"
) {
 if (text == null || text ==="") return"";
 if (typeof text ==="string") return text;
 return (lang ==="ar" ? text.ar : text.en) ?? text.en ?? text.ar ??"";
}

type SellerSignUpProps = {
 role: UserRole;
 setRole: (r: UserRole) => void;
};

export default function SellerSignUp({ role, setRole }: SellerSignUpProps) {
 const { t, i18n } = useTranslation();
 const { theme } = useTheme();
 const isDark = theme ==="dark";
 const lang = i18n.language?.toLowerCase().startsWith("ar") ?"ar" :"en";
 const { mutate: sellerRegister, isPending } = useSellerRegister();
 const fileInputRef = useRef<HTMLInputElement>(null);
 const [previewUrl, setPreviewUrl] = useState<string | null>(null);
 const [sellerKind, setSellerKind] = useState<"shop"|"service_provider">("shop");

 const {
 register,
 control,
 handleSubmit,
 watch,
 setValue,
 formState: { errors },
 } = useForm<SellerSignUpFormValues>({
 defaultValues: {
 emailOrPhone:"",
 password:"",
 confirmPassword:"",
 sellerName:"",
 storeName:"",
 storeAddress:"",
 commercialRegisterNumber:"",
 commercialRegisterDate:"",
 country:"",
 governorate:"",
 storeCity:"",
 isRestaurant: false,
 serviceTypeIds: [],
 },
 });

 const selectedGovernorateId = watch("governorate");
 const serviceTypeIds = watch("serviceTypeIds") ?? [];

 const { data: vendorServiceTypes = [], isLoading: isLoadingVendorTypes } =
 useQuery({
 queryKey: queryKeys.shop.vendorServices(),
 queryFn: () => _ShopApi.getVendorServices(),
 enabled: sellerKind ==="service_provider",
 staleTime: 5 * 60 * 1000,
 });

 useEffect(() => {
 if (sellerKind !=="service_provider") {
 setValue("serviceTypeIds", []);
 }
 }, [sellerKind, setValue]);

 const govId =
 selectedGovernorateId &&
 selectedGovernorateId !=="" &&
 selectedGovernorateId !=="0"
 ? Number(selectedGovernorateId)
 : null;

 const {
 options: governorateOptions,
 handleScroll: handleGovScroll,
 isFetchingNextPage: isFetchingMoreGov,
 } = useInfiniteSelect<Governorate>({
 queryKey: ["location","governorates","seller-select"],
 fetchFn: async (page) => {
 const res = await _LocationApi.getGovernorates(page);
 return res.data;
 },
 mapToOption: (gov) => ({
 value: String(gov.id),
 label: typeof gov.name ==="string" ? gov.name : String(gov.name),
 }),
 });

 const {
 options: cityOptions,
 isLoading: isLoadingCities,
 handleScroll: handleCityScroll,
 isFetchingNextPage: isFetchingMoreCities,
 } = useInfiniteSelect<City>({
 queryKey: ["location","cities","seller-select", govId],
 fetchFn: async (page) => {
 const res = await _LocationApi.getCities(govId!, page);
 const data = res.data;
 if (data && typeof data ==="object" && "items" in data) {
 return data as unknown as { items: City[]; pagination: { current_page: number; last_page: number; per_page: number; total: number } };
 }
 if (Array.isArray(data)) {
 return { items: data as City[], pagination: null };
 }
 return { items: [], pagination: null };
 },
 mapToOption: (city) => ({
 value: String(city.id),
 label: typeof city.name ==="string" ? city.name : String(city.name),
 }),
 enabled: !!govId,
 });

 useEffect(() => {
 setValue("storeCity","");
 }, [selectedGovernorateId, setValue]);

 const toggleServiceTypeId = (id: number) => {
 const next = serviceTypeIds.includes(id)
 ? serviceTypeIds.filter((x) => x !== id)
 : [...serviceTypeIds, id];
 setValue("serviceTypeIds", next, { shouldDirty: true });
 };

 const onSubmit = (data: SellerSignUpFormValues) => {
 if (
 sellerKind ==="service_provider" &&
 (!data.serviceTypeIds || data.serviceTypeIds.length === 0)
 ) {
 toast.error(t("validation.selectServiceTypes"));
 return;
 }

 const detectedType = detectEmailOrPhone(data.emailOrPhone);

 const formatDate = (dateString: string): string => {
 if (!dateString) return"";
 if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return dateString;
 const parts = dateString.split("/");
 if (parts.length === 3) {
 const [month, day, year] = parts;
 return `${year}-${month.padStart(2,"0")}-${day.padStart(2,"0")}`;
 }
 return dateString;
 };

 const payload: SellerRegisterPayload = {
 password: data.password,
 seller_name: data.sellerName,
 store_name: data.storeName,
 address: data.storeAddress,
 commercial_register_number: data.commercialRegisterNumber,
 commercial_register_date: formatDate(data.commercialRegisterDate),
 country: data.country,
 };

 if (sellerKind ==="shop") {
 payload.is_restaurant = data.isRestaurant;
 payload.is_service_provider = false;
 } else {
 payload.is_service_provider = true;
 payload.is_restaurant = false;
 payload.service_type_ids = data.serviceTypeIds;
 }

 if (detectedType ==="email") {
 payload.email = data.emailOrPhone;
 } else if (detectedType ==="phone") {
 payload.phone = data.emailOrPhone;
 }

 sellerRegister(payload);
 };

 const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
 const file = e.target.files?.[0];
 if (file) setPreviewUrl(URL.createObjectURL(file));
 };

 const selectClasses =
"w-full appearance-none rounded-lg border border-custom-secondary bg-custom-card px-4 py-2.5 pe-10 text-sm text-custom-primary transition-colors focus:border-[var(--color-main)] focus:outline-none focus:ring-2 focus:ring-[color-mix(in_srgb,var(--color-main)_22%,transparent)]";
 const disabledSelectClasses =
 `${selectClasses} disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-custom-light`;

 return (
 <AuthLayout
 leftPanel="image"
 leftImageSrc="/images/auth/seller.jpg"
 leftImageAlt="Store"
 leftImageHeight="100vh"
 maxWidth="authWide"
 useFormCard
 >
 <div className="w-full min-w-0 space-y-4">
 <div className="w-full min-w-0">
 <AuthRoleToggle role={role} setRole={setRole} t={t} />
 </div>

 <h1 className="text-lg font-bold text-custom-primary">
 {t("auth.createSellerAccount")}
 </h1>

 <div className="relative z-30 flex w-full min-w-0 gap-2 pt-1">
 <button
 type="button"
 onClick={() => setSellerKind("shop")}
 className={cn(
 "min-w-0 flex-1 rounded-xl px-2.5 py-2.5 text-sm font-medium transition-all duration-200 sm:px-4",
 sellerKind ==="shop"
 ?"bg-primary text-[var(--color-text-inverse)] shadow-[0_8px_24px_-10px_color-mix(in_srgb,var(--color-main)_45%,transparent)]"
 : isDark
 ?"border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.04)] text-custom-secondary hover:bg-[rgba(255,255,255,0.07)] hover:text-custom-primary"
 :"bg-custom-card border border-primary text-primary hover:bg-primary/5"
 )}
 >
 {t("auth.sellerRegisterKindShop")}
 </button>
 <button
 type="button"
 onClick={() => setSellerKind("service_provider")}
 className={cn(
 "min-w-0 flex-1 rounded-xl px-2.5 py-2.5 text-sm font-medium transition-all duration-200 sm:px-4",
 sellerKind ==="service_provider"
 ?"bg-primary text-[var(--color-text-inverse)] shadow-[0_8px_24px_-10px_color-mix(in_srgb,var(--color-main)_45%,transparent)]"
 : isDark
 ?"border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.04)] text-custom-secondary hover:bg-[rgba(255,255,255,0.07)] hover:text-custom-primary"
 :"bg-custom-card border border-primary text-primary hover:bg-primary/5"
 )}
 >
 {t("auth.sellerRegisterKindServiceProvider")}
 </button>
 </div>

 <form onSubmit={handleSubmit(onSubmit)} className="w-full min-w-0 space-y-2.5">
 <EmailOrPhoneInput
 name="emailOrPhone"
 control={control}
 label={t("auth.emailOrPhone")}
 placeholder="your.email@example.com / +963xxxxxxxxx"
 error={errors.emailOrPhone}
 required
 />

 <div className="grid min-w-0 grid-cols-1 gap-2.5 sm:grid-cols-2">
 <InputField
 label={t("common.password")}
 type="password"
 placeholder="••••••••"
 required
 {...register("password", {
 required: t("validation.required"),
 minLength: {
 value: 8,
 message: t("validation.passwordTooShort"),
 },
 })}
 error={errors.password}
 />
 <InputField
 label={t("common.confirmPassword")}
 type="password"
 placeholder="••••••••"
 required
 {...register("confirmPassword", {
 required: t("validation.required"),
 validate: (v) =>
 v === watch("password") ||
 t("validation.passwordsDoNotMatch"),
 })}
 error={errors.confirmPassword}
 />
 </div>

 <p className="text-[10px] text-custom-tertiary -mt-1!">
 {t("auth.passwordHelper")}
 </p>

 <InputField
 label={t("auth.sellerFullName")}
 placeholder={t("auth.enterSellerName")}
 required
 maxLength={255}
 {...register("sellerName", {
 required: t("validation.required"),
 })}
 error={errors.sellerName}
 />

 <div className="grid min-w-0 grid-cols-1 gap-2.5 sm:grid-cols-2">
 <InputField
 label={t("auth.storeName")}
 placeholder={t("auth.enterStoreName")}
 required
 maxLength={255}
 {...register("storeName", {
 required: t("validation.required"),
 })}
 error={errors.storeName}
 />
 <InputField
 label={t("auth.storeAddress")}
 placeholder={t("auth.enterStoreAddress")}
 required
 maxLength={500}
 {...register("storeAddress", {
 required: t("validation.required"),
 })}
 error={errors.storeAddress}
 />
 </div>

 {sellerKind ==="shop" && (
 <label className="flex cursor-pointer items-start gap-2.5 rounded-lg border border-custom-secondary bg-custom-card/40 px-3 py-2.5">
 <input
 type="checkbox"
 className="mt-0.5 h-4 w-4 shrink-0 rounded border-custom-secondary text-primary focus:ring-primary"
 {...register("isRestaurant")}
 />
 <span className="text-sm text-custom-primary">
 {t("auth.isRestaurant")}
 </span>
 </label>
 )}

 {sellerKind ==="service_provider" && (
 <div className="space-y-2 rounded-lg border border-custom-secondary bg-custom-card/40 p-3">
 <Label className="block text-sm font-medium text-custom-primary">
 {t("auth.serviceTypesHeading")}
 </Label>
 <p className="text-[11px] leading-snug text-custom-tertiary">
 {t("auth.serviceTypesHint")}
 </p>
 {isLoadingVendorTypes ? (
 <p className="text-xs text-custom-secondary">{t("common.loading")}</p>
 ) : vendorServiceTypes.length === 0 ? (
 <p className="text-xs text-custom-tertiary">
 {t("auth.serviceTypesEmpty")}
 </p>
 ) : (
 <div className="max-h-48 space-y-2 overflow-y-auto pe-1">
 {vendorServiceTypes.map((type) => (
 <label
 key={type.id}
 className="flex cursor-pointer items-center gap-2"
 >
 <input
 type="checkbox"
 className="h-4 w-4 shrink-0 rounded border-custom-secondary text-primary focus:ring-primary"
 checked={serviceTypeIds.includes(type.id)}
 onChange={() => toggleServiceTypeId(type.id)}
 />
 <span className="text-sm font-medium text-custom-primary">
 {pickVendorServiceLabel(type.name, lang)}
 </span>
 </label>
 ))}
 </div>
 )}
 </div>
 )}

 <div className="grid min-w-0 grid-cols-1 gap-2.5 sm:grid-cols-2">
 <InputField
 label={t("auth.commercialRegisterDate")}
 type="date"
 {...register("commercialRegisterDate")}
 error={errors.commercialRegisterDate}
 />
 <InputField
 label={t("auth.commercialRegNumber")}
 placeholder={t("auth.enterCommercialRegNumber")}
 maxLength={100}
 {...register("commercialRegisterNumber")}
 error={errors.commercialRegisterNumber}
 />
 </div>

 <div className="grid min-w-0 grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
 <div className="min-w-0 space-y-1">
 <Label className="block text-sm font-medium text-custom-primary">
 {t("auth.storeCountry")}
 <span className="text-red-500 dark:text-red-400 ms-0.5">*</span>
 </Label>
 <div className="relative">
 <select
 className={selectClasses}
 {...register("country", {
 required: t("validation.required"),
 })}
 >
 <option value="">{t("auth.selectCountry")}</option>
 <option value="syria">Syria</option>
 <option value="saudi-arabia">Saudi Arabia</option>
 <option value="uae">UAE</option>
 </select>
 <svg
 className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 h-4 w-4 text-custom-tertiary"
 fill="none"
 stroke="currentColor"
 viewBox="0 0 24 24"
 >
 <path
 strokeLinecap="round"
 strokeLinejoin="round"
 strokeWidth={2}
 d="M19 9l-7 7-7-7"
 />
 </svg>
 </div>
 {errors.country && (
 <p className="text-xs text-red-500 dark:text-red-400">
 {errors.country.message}
 </p>
 )}
 </div>
 <div className="min-w-0 space-y-1">
 <Label className="block text-sm font-medium text-custom-primary">
 {t("auth.governorate")}
 <span className="text-red-500 dark:text-red-400 ms-0.5">*</span>
 </Label>
 <div className="relative">
 <select
 className={selectClasses}
 onScroll={handleGovScroll}
 {...register("governorate", {
 required: t("validation.selectGovernorate"),
 validate: (v) =>
 (v !=="" && v !=="0") || t("validation.selectGovernorate"),
 })}
 >
 <option value="">{t("auth.selectGovernorate")}</option>
 {governorateOptions.map((opt) => (
 <option key={opt.value} value={opt.value}>
 {opt.label}
 </option>
 ))}
 {isFetchingMoreGov && (
 <option value="" disabled>
 {t("common.loading")}
 </option>
 )}
 </select>
 <svg
 className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 h-4 w-4 text-custom-tertiary"
 fill="none"
 stroke="currentColor"
 viewBox="0 0 24 24"
 >
 <path
 strokeLinecap="round"
 strokeLinejoin="round"
 strokeWidth={2}
 d="M19 9l-7 7-7-7"
 />
 </svg>
 </div>
 {errors.governorate && (
 <p className="text-xs text-red-500 dark:text-red-400">
 {errors.governorate.message}
 </p>
 )}
 </div>
 <div className="min-w-0 space-y-1 sm:col-span-2 lg:col-span-1">
 <Label className="block text-sm font-medium text-custom-primary">
 {t("auth.storeCity")}
 <span className="text-red-500 dark:text-red-400 ms-0.5">*</span>
 </Label>
 <div className="relative">
 <select
 className={disabledSelectClasses}
 disabled={
 !selectedGovernorateId ||
 selectedGovernorateId ==="" ||
 selectedGovernorateId ==="0" ||
 isLoadingCities
 }
 onScroll={handleCityScroll}
 {...register("storeCity", {
 required: t("validation.selectCity"),
 validate: (v) =>
 (v !=="" && v !=="0") || t("validation.selectCity"),
 })}
 >
 <option value="">{t("auth.selectCity")}</option>
 {cityOptions.map((opt) => (
 <option key={opt.value} value={opt.value}>
 {opt.label}
 </option>
 ))}
 {isFetchingMoreCities && (
 <option value="" disabled>
 {t("common.loading")}
 </option>
 )}
 </select>
 <svg
 className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 h-4 w-4 text-custom-tertiary"
 fill="none"
 stroke="currentColor"
 viewBox="0 0 24 24"
 >
 <path
 strokeLinecap="round"
 strokeLinejoin="round"
 strokeWidth={2}
 d="M19 9l-7 7-7-7"
 />
 </svg>
 </div>
 {errors.storeCity && (
 <p className="text-xs text-red-500 dark:text-red-400">
 {errors.storeCity.message}
 </p>
 )}
 </div>
 </div>

 <div className="space-y-1">
 <Label className="block text-sm font-medium text-custom-primary">
 {t("auth.storeImageUpload")}
 </Label>
 <button
 type="button"
 onClick={() => fileInputRef.current?.click()}
 className="w-full rounded-lg border-2 border-dashed border-custom-primary bg-custom-light px-4 py-3 text-center hover:border-primary/40 transition-colors"
 >
 {previewUrl ? (
 <img
 src={previewUrl}
 alt="Preview"
 className="mx-auto h-12 w-12 rounded-lg object-cover"
 />
 ) : (
 <HiOutlinePhotograph className="mx-auto h-7 w-7 text-custom-tertiary"/>
 )}
 <p className="mt-1 text-xs text-custom-secondary">
 {t("auth.uploadStoreLogo")}
 </p>
 <p className="text-[10px] text-custom-tertiary">
 {t("auth.uploadHint")}
 </p>
 </button>
 <input
 ref={fileInputRef}
 type="file"
 accept="image/png,image/jpeg"
 className="hidden"
 onChange={handleFileChange}
 />
 </div>

 <Button
 type="submit"
 isLoading={isPending}
 fullWidth
 variant="primary"
 className="mt-3! py-3 rounded-xl font-semibold"
 >
 {t("auth.createStoreAccount")}
 </Button>
 </form>
 </div>
 </AuthLayout>
 );
}
