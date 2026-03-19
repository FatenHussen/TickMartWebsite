import { useState, useRef, useEffect } from"react";
import { useForm } from"react-hook-form";
import { useTranslation } from"react-i18next";
import { Button } from"@/shared/ui";
import {
 HiPencil,
 HiUser,
 HiExclamation,
 HiCamera,
 HiPhone,
 HiMail,
 HiLockClosed,
 HiLogout,
} from"react-icons/hi";
import { useProfile, useUpdateProfile } from"../hooks/useProfile";
import { _LocationApi } from"@/features/auth/api/location.service";
import { useInfiniteSelect } from"@/shared/hooks/useInfiniteSelect";
import type { Governorate, City } from"@/features/auth/types";
import ChangePasswordModal from"../components/ChangePasswordModal";
import UpdateEmailModal from"../components/UpdateEmailModal";
import UpdatePhoneModal from"../components/UpdatePhoneModal";
import VerifyProfileModal from"../components/VerifyProfileModal";
import { LogoutPopup } from"@/shared/component";
import { useLogout } from"@/features/auth/hooks/useAuth";
import type { UpdateProfilePayload } from"../types";

import accountBg from"/images/accounts/Account.png";

/** Resolve API value that may be a string or localized object { ar, en } */
function resolveLocalized(
 value: unknown,
 lang: string
): string {
 if (value == null) return"";
 if (typeof value ==="string") return value;
 if (typeof value ==="object"&&"ar"in value &&"en"in value) {
 const o = value as { ar?: string; en?: string };
 const s = lang.startsWith("ar") ? o.ar ?? o.en : o.en ?? o.ar;
 return typeof s ==="string"? s :"";
 }
 return String(value);
}

interface ProfileFormData {
 name: string;
 city_id: string;
 governorate_id: string;
}

export default function Profile() {
 const { t, i18n } = useTranslation();
 const lang = i18n.language ||"en";
 const fileInputRef = useRef<HTMLInputElement>(null);
 const [isEditing, setIsEditing] = useState(false);

 const { data: profileData, isLoading, error } = useProfile();
 const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();

 const [selectedGovernorateId, setSelectedGovernorateId] = useState<
 number | null
 >(null);

 const {
 options: governorateOptions,
 handleScroll: handleGovScroll,
 isFetchingNextPage: isFetchingMoreGov,
 } = useInfiniteSelect<Governorate>({
 queryKey: ["location","governorates","select"],
 fetchFn: async (page) => {
 const res = await _LocationApi.getGovernorates(page);
 return res.data;
 },
 mapToOption: (gov) => ({
 value: gov.id,
 label: resolveLocalized(gov.name, lang),
 }),
 });

 const {
 options: cityOptions,
 handleScroll: handleCityScroll,
 isFetchingNextPage: isFetchingMoreCities,
 } = useInfiniteSelect<City>({
 queryKey: ["location","cities","select", selectedGovernorateId],
 fetchFn: async (page) => {
 const res = await _LocationApi.getCities(selectedGovernorateId!, page);
 const data = res.data as unknown;
 if (data && typeof data ==="object"&&"items"in (data as Record<string, unknown>)) {
 const d = data as { items: City[]; pagination: { current_page: number; last_page: number; per_page: number; total: number } | null };
 return { items: d.items, pagination: d.pagination ?? null };
 }
 if (Array.isArray(data)) {
 return { items: data as City[], pagination: null };
 }
 return { items: [], pagination: null };
 },
 mapToOption: (city) => ({
 value: city.id,
 label: resolveLocalized(city.name, lang),
 }),
 enabled: !!selectedGovernorateId,
 });

 const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
 const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
 const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
 const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
 const [verifyEmail, setVerifyEmail] = useState<string | undefined>();
 const [verifyPhone, setVerifyPhone] = useState<string | undefined>();
 const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

 const logoutMutation = useLogout();

 const [selectedImage, setSelectedImage] = useState<File | null>(null);
 const [imagePreview, setImagePreview] = useState<string | null>(null);

 const {
 register,
 handleSubmit,
 formState: { errors },
 setValue,
 watch,
 } = useForm<ProfileFormData>();

 const selectedGovernorate = watch("governorate_id");

 useEffect(() => {
 if (profileData) {
 setValue("name", resolveLocalized(profileData.name, lang));
 }
 }, [profileData, setValue, lang]);

 useEffect(() => {
 if (selectedGovernorate) {
 setSelectedGovernorateId(Number(selectedGovernorate));
 }
 }, [selectedGovernorate]);

 const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
 const file = e.target.files?.[0];
 if (file) {
 setSelectedImage(file);
 const reader = new FileReader();
 reader.onloadend = () => {
 setImagePreview(reader.result as string);
 };
 reader.readAsDataURL(file);
 }
 };

 const onSubmit = (data: ProfileFormData) => {
 const payload: UpdateProfilePayload = {
 name: data.name,
 city_id: Number(data.city_id),
 };

 if (selectedImage) {
 payload.image = selectedImage;
 }

 updateProfile(payload, {
 onSuccess: () => {
 setSelectedImage(null);
 setImagePreview(null);
 setIsEditing(false);
 },
 });
 };

 const handleVerifyEmail = (email: string) => {
 setVerifyEmail(email);
 setVerifyPhone(undefined);
 setIsVerifyModalOpen(true);
 };

 const handleVerifyPhone = (phone: string) => {
 setVerifyPhone(phone);
 setVerifyEmail(undefined);
 setIsVerifyModalOpen(true);
 };

 if (isLoading) {
 return (
 <div className="flex items-center justify-center h-96">
 <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"/>
 </div>
 );
 }

 if (error || !profileData) {
 return (
 <div className="flex items-center justify-center h-96">
 <div className="text-center">
 <HiExclamation className="w-16 h-16 text-red-500 mx-auto mb-4"/>
 <p className="text-lg text-custom-primary">
 {t("account.profile.loadError","فشل تحميل البيانات")}
 </p>
 </div>
 </div>
 );
 }

 const currentAvatar = imagePreview || profileData.image;
 const displayName = resolveLocalized(profileData.name, lang);
 const displayEmail = resolveLocalized(profileData.email, lang);
 const displayPhone = resolveLocalized(profileData.phone, lang);

 return (
 <div className="space-y-6 relative">

 {/* Background illustration - public/images/accounts/Account.png */}
 <img
 src={accountBg}
 alt="account background"
 aria-hidden="true"
 className="pointer-events-none absolute top-1/2 right-0 -translate-y-1/2 h-screen w-auto object-contain select-none z-0"
 />
 {/* Header */}
 <div className="flex items-start justify-between flex-wrap gap-4">
 <div>
 <h1 className="text-2xl font-bold text-custom-primary">
 {t("account.profile.title")}
 </h1>
 <p className="text-sm text-custom-secondary mt-0.5">
 {t("account.profile.subtitle")}
 </p>
 </div>
 <button
 type="button"
 onClick={() => setIsEditing((v) => !v)}
 className="flex items-center gap-2 px-5 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-semibold rounded-full transition-colors shadow-sm"
 >
 <HiPencil className="w-4 h-4"/>
 {t("account.profile.editProfile")}
 </button>
 </div>

 {/* Profile Card */}
 <form onSubmit={handleSubmit(onSubmit)}>
 <div className="relative rounded-2xl p-6 sm:p-8 shadow-sm overflow-hidden">
 

 {/* Avatar + Name */}
 <div className="relative flex items-center gap-4 mb-6">
 <div className="relative shrink-0">
 <div className="w-[72px] h-[72px] rounded-full overflow-hidden border-2 border-custom-primary shadow-sm">
 {currentAvatar ? (
 <img
 src={currentAvatar}
 alt={displayName}
 className="w-full h-full object-cover"
 />
 ) : (
 <div className="w-full h-full bg-cyan-50 dark:bg-cyan-900/30 flex items-center justify-center">
 <HiUser className="w-8 h-8 text-cyan-500"/>
 </div>
 )}
 </div>
 {/* Green online dot */}
 <span className="absolute bottom-0 left-0 w-4 h-4 bg-green-500 border-2 border-custom-primary rounded-full"/>
 {/* Camera button */}
 {isEditing && (
 <button
 type="button"
 onClick={() => fileInputRef.current?.click()}
 className="absolute -bottom-1 -right-1 w-7 h-7 bg-cyan-500 hover:bg-cyan-600 text-white rounded-full flex items-center justify-center transition-colors shadow-sm"
 >
 <HiCamera className="w-3.5 h-3.5"/>
 </button>
 )}
 <input
 ref={fileInputRef}
 type="file"
 accept="image/*"
 onChange={handleImageChange}
 className="hidden"
 />
 </div>
 <div>
 <h2 className="text-xl font-bold text-custom-primary">
 {displayName}
 </h2>
 <a
 href={`mailto:${displayEmail}`}
 className="text-sm text-custom-secondary underline underline-offset-2 hover:text-cyan-600 transition-colors"
 >
 {displayEmail}
 </a>
 </div>
 </div>

 {/* Gradient divider */}
 <div className="h-px bg-gradient-to-r from-cyan-400 via-cyan-300 to-transparent mb-8"/>

 {/* Profile Fields */}
 <div className="relative grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
 {/* Full name */}
 <div className="space-y-2">
 <label className="block text-sm font-medium text-custom-primary">
 {t("account.profile.fullName")}
 </label>
 <div className="relative">
 <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
 <HiUser className="w-5 h-5 text-cyan-400"/>
 </span>
 <input
 {...register("name", {
 required: t("validation.required","هذا الحقل مطلوب"),
 })}
 readOnly={!isEditing}
 placeholder={t("account.profile.enterFullName")}
 className="w-full pl-11 pr-4 py-3 rounded-xl border border-cyan-300 dark:border-cyan-700 bg-cyan-50/40 dark:bg-cyan-950/20 text-custom-primary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all read-only:cursor-default"
 />
 </div>
 {errors.name && (
 <p className="text-xs text-red-500">{errors.name.message}</p>
 )}
 </div>

 {/* Mobile number */}
 <div className="space-y-2">
 <label className="block text-sm font-medium text-custom-primary">
 {t("account.profile.mobileNumber")}
 </label>
 <div className="relative">
 <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
 <HiPhone className="w-5 h-5 text-cyan-400"/>
 </span>
 <input
 readOnly
 value={displayPhone}
 className="w-full pl-11 pr-4 py-3 rounded-xl border border-cyan-300 dark:border-cyan-700 bg-cyan-50/40 dark:bg-cyan-950/20 text-custom-primary cursor-default focus:outline-none"
 />
 </div>
 </div>
 </div>

 {/* Email address */}
 <div className="relative space-y-2 mb-1">
 <label className="block text-sm font-medium text-custom-primary">
 {t("account.profile.emailAddress")}
 </label>
 <div className="relative">
 <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
 <HiMail className="w-5 h-5 text-cyan-400"/>
 </span>
 <input
 readOnly
 value={displayEmail}
 className="w-full pl-11 pr-4 py-3 rounded-xl border border-cyan-300 dark:border-cyan-700 bg-cyan-50/40 dark:bg-cyan-950/20 text-custom-primary cursor-default focus:outline-none"
 />
 </div>
 </div>

 {/* Governorate & City (edit mode only) */}
 {isEditing && (
 <div className="relative grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
 <div className="space-y-2">
 <label className="block text-sm font-medium text-custom-primary">
 {t("auth.governorate","المحافظة")}
 </label>
 <select
 {...register("governorate_id", {
 required: t("validation.required","هذا الحقل مطلوب"),
 })}
 onScroll={handleGovScroll}
 className="w-full px-4 py-3 rounded-xl border border-cyan-300 dark:border-cyan-700 bg-cyan-50/40 dark:bg-cyan-950/20 text-custom-primary focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
 >
 <option value="">
 {t("auth.selectGovernorate","اختر المحافظة")}
 </option>
 {governorateOptions.map((opt) => (
 <option key={opt.value} value={opt.value}>
 {opt.label}
 </option>
 ))}
 {isFetchingMoreGov && (
 <option value=""disabled>
 {t("common.loading")}
 </option>
 )}
 </select>
 {errors.governorate_id && (
 <p className="text-xs text-red-500">
 {errors.governorate_id.message}
 </p>
 )}
 </div>

 <div className="space-y-2">
 <label className="block text-sm font-medium text-custom-primary">
 {t("auth.city","المدينة")}
 </label>
 <select
 {...register("city_id", {
 required: t("validation.required","هذا الحقل مطلوب"),
 })}
 disabled={!selectedGovernorateId}
 onScroll={handleCityScroll}
 className="w-full px-4 py-3 rounded-xl border border-cyan-300 dark:border-cyan-700 bg-cyan-50/40 dark:bg-cyan-950/20 text-custom-primary focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
 >
 <option value="">
 {t("auth.selectCity","اختر المدينة")}
 </option>
 {cityOptions.map((opt) => (
 <option key={opt.value} value={opt.value}>
 {opt.label}
 </option>
 ))}
 {isFetchingMoreCities && (
 <option value=""disabled>
 {t("common.loading")}
 </option>
 )}
 </select>
 {errors.city_id && (
 <p className="text-xs text-red-500">
 {errors.city_id.message}
 </p>
 )}
 </div>
 </div>
 )}

 {/* Save button (edit mode only) */}
 {isEditing && (
 <div className="relative mt-6 flex justify-end">
 <Button
 type="submit"
 variant="primary"
 isLoading={isUpdating}
 className="gap-2 bg-cyan-500 hover:bg-cyan-600 rounded-full px-6"
 >
 <HiPencil className="w-4 h-4"/>
 {t("common.saveChanges","حفظ التغييرات")}
 </Button>
 </div>
 )}
 </div>
 </form>

 {/* Security Section */}
 <div className="bg-custom-card rounded-2xl p-6 sm:p-8 shadow-sm">
 <h2 className="text-xl font-bold text-custom-primary mb-6">
 {t("account.profile.security")}
 </h2>

 {/* Change Password */}
 <div className="flex items-center justify-between flex-wrap gap-4 py-4 border-b border-custom-primary">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-lg bg-custom-tertiary flex items-center justify-center shrink-0">
 <HiLockClosed className="w-5 h-5 text-custom-secondary"/>
 </div>
 <div>
 <h3 className="font-semibold text-custom-primary">
 {t("account.profile.changePassword")}
 </h3>
 <p className="text-sm text-custom-secondary">
 {t("account.profile.changePasswordDesc")}
 </p>
 </div>
 </div>
 <button
 type="button"
 onClick={() => setIsPasswordModalOpen(true)}
 className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-semibold rounded-full transition-colors shadow-sm"
 >
 {t("account.profile.changePassword")}
 </button>
 </div>

 {/* Update Email */}
 <div className="flex items-center justify-between flex-wrap gap-4 py-4 border-b border-custom-primary">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-lg bg-custom-tertiary flex items-center justify-center shrink-0">
 <HiMail className="w-5 h-5 text-custom-secondary"/>
 </div>
 <div>
 <h3 className="font-semibold text-custom-primary">
 {t("account.profile.updateEmail")}
 </h3>
 <p className="text-sm text-custom-secondary">
 {t("account.profile.currentEmail")}: {displayEmail}
 </p>
 </div>
 </div>
 <button
 type="button"
 onClick={() => setIsEmailModalOpen(true)}
 className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-semibold rounded-full transition-colors shadow-sm"
 >
 {t("account.profile.updateEmail")}
 </button>
 </div>

 {/* Update Phone */}
 <div className="flex items-center justify-between flex-wrap gap-4 py-4">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-lg bg-custom-tertiary flex items-center justify-center shrink-0">
 <HiPhone className="w-5 h-5 text-custom-secondary"/>
 </div>
 <div>
 <h3 className="font-semibold text-custom-primary">
 {t("account.profile.updatePhone")}
 </h3>
 <p className="text-sm text-custom-secondary">
 {t("account.profile.currentPhone")}: {displayPhone}
 </p>
 </div>
 </div>
 <button
 type="button"
 onClick={() => setIsPhoneModalOpen(true)}
 className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-semibold rounded-full transition-colors shadow-sm"
 >
 {t("account.profile.updatePhone")}
 </button>
 </div>

 {/* Gradient divider */}
 <div className="h-px bg-gradient-to-r from-cyan-400 via-cyan-300 to-transparent my-5"/>

 <p className="text-sm text-custom-tertiary">
 {t("account.profile.loginActivityNote")}
 </p>
 </div>

 {/* Logout Section */}
 <div className="bg-custom-card rounded-2xl p-6 sm:p-8 shadow-sm">
 <div className="flex items-center justify-between flex-wrap gap-4">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-lg bg-custom-tertiary flex items-center justify-center shrink-0">
 <HiLogout className="w-5 h-5 text-red-500 dark:text-red-400"/>
 </div>
 <div>
 <h3 className="font-semibold text-custom-primary">
 {t("account.profile.logout")}
 </h3>
 <p className="text-sm text-custom-secondary">
 {t("account.profile.logoutDesc")}
 </p>
 </div>
 </div>
 <button
 type="button"
 onClick={() => setIsLogoutModalOpen(true)}
 className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-full transition-colors shadow-sm"
 >
 {t("account.profile.logout")}
 </button>
 </div>
 </div>

 {/* Modals */}
 <ChangePasswordModal
 isOpen={isPasswordModalOpen}
 onClose={() => setIsPasswordModalOpen(false)}
 />
 <UpdateEmailModal
 isOpen={isEmailModalOpen}
 onClose={() => setIsEmailModalOpen(false)}
 onVerify={handleVerifyEmail}
 />
 <UpdatePhoneModal
 isOpen={isPhoneModalOpen}
 onClose={() => setIsPhoneModalOpen(false)}
 onVerify={handleVerifyPhone}
 />
 <VerifyProfileModal
 isOpen={isVerifyModalOpen}
 onClose={() => setIsVerifyModalOpen(false)}
 email={verifyEmail}
 phone={verifyPhone}
 />
 <LogoutPopup
 isOpen={isLogoutModalOpen}
 onClose={() => setIsLogoutModalOpen(false)}
 onConfirm={() => {
 logoutMutation.mutate();
 setIsLogoutModalOpen(false);
 }}
 cancelButtonText={t("common.cancel")}
 />
 </div>
 );
}
