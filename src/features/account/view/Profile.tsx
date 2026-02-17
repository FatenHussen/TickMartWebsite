import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Button, InputField } from "@/shared/ui";
import { HiPencil, HiUser, HiExclamation, HiCamera } from "react-icons/hi";
import { useProfile, useUpdateProfile } from "../hooks/useProfile";
import { useGovernorates, useCities } from "@/features/auth/hooks/useLocation";
import ChangePasswordModal from "../components/ChangePasswordModal";
import UpdateEmailModal from "../components/UpdateEmailModal";
import UpdatePhoneModal from "../components/UpdatePhoneModal";
import VerifyProfileModal from "../components/VerifyProfileModal";
import type { UpdateProfilePayload } from "../types";

interface ProfileFormData {
  name: string;
  city_id: string;
  governorate_id: string;
}

export default function Profile() {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch profile data
  const { data: profileData, isLoading, error } = useProfile();
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();

  // Location data
  const { data: governorates = [] } = useGovernorates();
  const [selectedGovernorateId, setSelectedGovernorateId] = useState<
    number | null
  >(null);
  const { data: citiesData } = useCities(selectedGovernorateId);
  const cities = (Array.isArray(citiesData) ? citiesData : []) as Array<{ id: number; name: string }>;

  // Modals state
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState<string | undefined>();
  const [verifyPhone, setVerifyPhone] = useState<string | undefined>();

  // Profile image state
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ProfileFormData>();

  const selectedGovernorate = watch("governorate_id");

  // Initialize form when profile data loads
  useEffect(() => {
    if (profileData) {
      setValue("name", profileData.name);
      // We need to find the governorate_id based on city name
      // For now, we'll just set the city_id if we can match it
      // In a real scenario, you'd need to get governorate_id from the API
    }
  }, [profileData, setValue]);

  // Update selected governorate when form changes
  useEffect(() => {
    if (selectedGovernorate) {
      setSelectedGovernorateId(Number(selectedGovernorate));
    }
  }, [selectedGovernorate]);

  // Handle image selection
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <HiExclamation className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-lg text-text-primary">
            {t("account.profile.loadError", "فشل تحميل البيانات")}
          </p>
        </div>
      </div>
    );
  }

  const currentAvatar = imagePreview || profileData.image;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-custom-primary">
            {t("account.profile.title")}
          </h1>
          <p className="text-custom-secondary text-sm mt-1">
            {t("account.profile.subtitle")}
          </p>
        </div>
      </div>

      {/* Profile Card */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="bg-custom-primary rounded-2xl p-6 shadow-sm">
          {/* Profile Info Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="relative">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-custom-primary">
                {currentAvatar ? (
                  <img
                    src={currentAvatar}
                    alt={profileData.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                    <HiUser className="w-10 h-10 text-primary" />
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-7 h-7 bg-primary hover:bg-primary/90 text-white rounded-full flex items-center justify-center transition-colors"
              >
                <HiCamera className="w-4 h-4" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-text-primary dark:text-white">
                {profileData.name}
              </h2>
              <p className="text-text-secondary dark:text-gray-400">
                {profileData.email}
              </p>
            </div>
          </div>

          {/* Profile Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <InputField
              label={t("account.profile.fullName")}
              placeholder={t("account.profile.enterFullName")}
              error={errors.name}
              {...register("name", {
                required: t("validation.required", "هذا الحقل مطلوب"),
              })}
              className="bg-gray-50 dark:bg-gray-700 dark:text-white"
            />

            {/* Governorate */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-secondary dark:text-gray-300">
                {t("auth.governorate", "المحافظة")}
              </label>
              <select
                {...register("governorate_id", {
                  required: t("validation.required", "هذا الحقل مطلوب"),
                })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-text-primary dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">
                  {t("auth.selectGovernorate", "اختر المحافظة")}
                </option>
                {governorates.map((gov) => (
                  <option key={gov.id} value={gov.id}>
                    {gov.name}
                  </option>
                ))}
              </select>
              {errors.governorate_id && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.governorate_id.message}
                </p>
              )}
            </div>

            {/* City */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-secondary dark:text-gray-300">
                {t("auth.city", "المدينة")}
              </label>
              <select
                {...register("city_id", {
                  required: t("validation.required", "هذا الحقل مطلوب"),
                })}
                disabled={!selectedGovernorateId}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-text-primary dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">
                  {t("auth.selectCity", "اختر المدينة")}
                </option>
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>
              {errors.city_id && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.city_id.message}
                </p>
              )}
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-6 flex justify-end">
            <Button
              type="submit"
              variant="primary"
              isLoading={isUpdating}
              className="gap-2"
            >
              <HiPencil className="w-4 h-4" />
              {t("common.saveChanges", "حفظ التغييرات")}
            </Button>
          </div>
        </div>
      </form>

      {/* Security Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-text-primary dark:text-white mb-4">
          {t("account.profile.security")}
        </h2>

        {/* Change Password */}
        <div className="flex items-center justify-between flex-wrap gap-4 py-4 border-b border-border-primary dark:border-gray-700">
          <div>
            <h3 className="font-medium text-text-primary dark:text-white">
              {t("account.profile.changePassword")}
            </h3>
            <p className="text-sm text-text-secondary dark:text-gray-400">
              {t("account.profile.changePasswordDesc")}
            </p>
          </div>
          <Button
            variant="outline"
            className="border-primary text-primary dark:border-primary/50 dark:text-primary-light"
            onClick={() => setIsPasswordModalOpen(true)}
          >
            {t("account.profile.changePassword")}
          </Button>
        </div>

        {/* Update Email */}
        <div className="flex items-center justify-between flex-wrap gap-4 py-4 border-b border-border-primary dark:border-gray-700">
          <div>
            <h3 className="font-medium text-text-primary dark:text-white">
              {t("account.profile.updateEmail")}
            </h3>
            <p className="text-sm text-text-secondary dark:text-gray-400">
              {t("account.profile.currentEmail")}: {profileData.email}
            </p>
          </div>
          <Button
            variant="outline"
            className="border-primary text-primary dark:border-primary/50 dark:text-primary-light"
            onClick={() => setIsEmailModalOpen(true)}
          >
            {t("account.profile.updateEmail")}
          </Button>
        </div>

        {/* Update Phone */}
        <div className="flex items-center justify-between flex-wrap gap-4 py-4">
          <div>
            <h3 className="font-medium text-text-primary dark:text-white">
              {t("account.profile.updatePhone")}
            </h3>
            <p className="text-sm text-text-secondary dark:text-gray-400">
              {t("account.profile.currentPhone")}: {profileData.phone}
            </p>
          </div>
          <Button
            variant="outline"
            className="border-primary text-primary dark:border-primary/50 dark:text-primary-light"
            onClick={() => setIsPhoneModalOpen(true)}
          >
            {t("account.profile.updatePhone")}
          </Button>
        </div>

        <p className="text-sm text-text-tertiary dark:text-gray-500 mt-4">
          {t("account.profile.loginActivityNote")}
        </p>
      </div>

      {/* Delete Account Section */}
      <div className="bg-red-50 dark:bg-red-900/10 rounded-2xl p-6 border border-red-200 dark:border-red-800 shadow-sm">
        <div className="flex items-start gap-3">
          <HiExclamation className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-red-600 dark:text-red-400">
              {t("account.profile.deleteAccount")}
            </h2>
            <p className="text-sm text-red-500/80 dark:text-red-400/80 mt-1 mb-4">
              {t("account.profile.deleteAccountDesc")}
            </p>
            <a
              href="/account/delete"
              className="text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 underline"
            >
              {t("account.profile.manageAccountStatus")}
            </a>
          </div>
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
    </div>
  );
}
