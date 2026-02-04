import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/shared/ui";
import { HiPencil, HiUser, HiExclamation } from "react-icons/hi";

interface ProfileData {
  fullName: string;
  email: string;
  phone: string;
  avatar?: string;
}

export default function Profile() {
  const { t } = useTranslation();

  const [profileData] = useState<ProfileData>({
    fullName: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567",
    avatar: "/images/shared/avatar-placeholder.png",
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            {t("account.profile.title")}
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            {t("account.profile.subtitle")}
          </p>
        </div>
        <Button variant="primary" className="gap-2">
          <HiPencil className="w-4 h-4" />
          {t("account.profile.editProfile")}
        </Button>
      </div>

      {/* Profile Card */}
      <div className="bg-white dark:bg-bg-primary rounded-2xl p-6 ">
        {/* Profile Info Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="relative">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary/20">
              {profileData.avatar ? (
                <img
                  src={profileData.avatar}
                  alt={profileData.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                  <HiUser className="w-10 h-10 text-primary" />
                </div>
              )}
            </div>
            <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-text-primary">
              {profileData.fullName}
            </h2>
            <p className="text-text-secondary">{profileData.email}</p>
          </div>
        </div>

        {/* Profile Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              {t("account.profile.fullName")}
            </label>
            <div className="w-full px-4 py-3 rounded-xl bg-primary-light/10 border border-primary/20 text-text-primary">
              {profileData.fullName}
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              {t("account.profile.mobileNumber")}
            </label>
            <div className="w-full px-4 py-3 rounded-xl bg-primary-light/10 border border-primary/20 text-text-primary">
              {profileData.phone}
            </div>
          </div>

          {/* Email - Full Width */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-text-secondary mb-2">
              {t("account.profile.emailAddress")}
            </label>
            <div className="w-full px-4 py-3 rounded-xl bg-primary-light/10 border border-primary/20 text-text-primary">
              {profileData.email}
            </div>
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className="bg-white dark:bg-bg-primary rounded-2xl p-6 ">
        <h2 className="text-lg font-semibold text-text-primary mb-4">
          {t("account.profile.security")}
        </h2>

        <div className="flex items-center justify-between flex-wrap gap-4 py-4 border-b border-border-primary">
          <div>
            <h3 className="font-medium text-text-primary">
              {t("account.profile.changePassword")}
            </h3>
            <p className="text-sm text-text-secondary">
              {t("account.profile.changePasswordDesc")}
            </p>
          </div>
          <Button variant="outline" className="border-primary text-primary">
            {t("account.profile.changePassword")}
          </Button>
        </div>

        <p className="text-sm text-text-tertiary mt-4">
          {t("account.profile.loginActivityNote")}
        </p>
      </div>

      {/* Delete Account Section */}
      <div className="bg-red-50 dark:bg-red-900/10 rounded-2xl p-6 border border-red-200 dark:border-red-800">
        <div className="flex items-start gap-3">
          <HiExclamation className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-red-600 dark:text-red-400">
              {t("account.profile.deleteAccount")}
            </h2>
            <p className="text-sm text-red-500/80 mt-1 mb-4">
              {t("account.profile.deleteAccountDesc")}
            </p>
            <a
              href="/account/delete"
              className="text-sm font-medium text-red-600 hover:text-red-700 underline"
            >
              {t("account.profile.manageAccountStatus")}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
