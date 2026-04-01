import { useForm } from"react-hook-form";
import { useState, useRef, useEffect } from"react";
import { useTranslation } from"react-i18next";
import AuthLayout from"@/features/auth/layout/Auth-Layout";
import AuthRoleToggle from"@/features/auth/components/AuthRoleToggle";
import EmailOrPhoneInput from"@/features/auth/components/EmailOrPhoneInput";
import InputField from"@/shared/ui/InputField";
import Button from"@/shared/ui/Button";
import Label from"@/shared/ui/Label";
import { HiOutlinePhotograph } from"react-icons/hi";
import { detectEmailOrPhone } from"@/shared/lib/utils";
import { _LocationApi } from"@/features/auth/api/location.service";
import { useSellerRegister } from"@/features/auth/hooks/useAuth";
import { useInfiniteSelect } from"@/shared/hooks/useInfiniteSelect";
import type { City, Governorate, SellerSignUpFormValues, UserRole } from"@/features/auth/types";

type SellerSignUpProps = {
 role: UserRole;
 setRole: (r: UserRole) => void;
};

export default function SellerSignUp({ role, setRole }: SellerSignUpProps) {
 const { t } = useTranslation();
 const { mutate: sellerRegister, isPending } = useSellerRegister();
 const fileInputRef = useRef<HTMLInputElement>(null);
 const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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
 },
 });

 const selectedGovernorateId = watch("governorate");

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

 const onSubmit = (data: SellerSignUpFormValues) => {
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

 const payload: {
 password: string;
 seller_name: string;
 store_name: string;
 address: string;
 commercial_register_number: string;
 commercial_register_date: string;
 country: string;
 email?: string;
 phone?: string;
 } = {
 password: data.password,
 seller_name: data.sellerName,
 store_name: data.storeName,
 address: data.storeAddress,
 commercial_register_number: data.commercialRegisterNumber,
 commercial_register_date: formatDate(data.commercialRegisterDate),
 country: data.country,
 };

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
"w-full appearance-none rounded-lg border border-[#E4F0FB] bg-[linear-gradient(180deg,#E4F0FB_0%,#E5F3FF_100%)] px-4 py-2.5 pe-10 text-sm text-custom-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors";
 const disabledSelectClasses =
 `${selectClasses} disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-custom-light`;

 return (
 <AuthLayout
 leftPanel="image"
 leftImageSrc="/images/auth/seller.jpg"
 leftImageAlt="Store"
 leftImageHeight="100vh"
 maxWidth="640"
 useFormCard
 >
 <div className="space-y-4">
 <AuthRoleToggle role={role} setRole={setRole} t={t} />

 <h1 className="text-lg font-bold text-custom-primary">
 {t("auth.createSellerAccount")}
 </h1>

 <form onSubmit={handleSubmit(onSubmit)} className="space-y-2.5">
 <EmailOrPhoneInput
 name="emailOrPhone"
 control={control}
 label={t("auth.emailOrPhone")}
 placeholder="your.email@example.com / +963xxxxxxxxx"
 error={errors.emailOrPhone}
 required
 />

 <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
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

 <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
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

 <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
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

 <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
 <div className="space-y-1">
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
 <div className="space-y-1">
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
 <div className="space-y-1">
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
 className="mt-3! py-2.5 rounded-full font-semibold"
 >
 {t("auth.createStoreAccount")}
 </Button>
 </form>
 </div>
 </AuthLayout>
 );
}
