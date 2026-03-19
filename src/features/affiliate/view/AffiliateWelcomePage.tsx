import { Link } from"react-router-dom";
import { useTranslation } from"react-i18next";
import { useLanguage } from"@/context/LanguageContext";
import {
 HiPlus,
 HiLocationMarker,
 HiBell,
 HiQuestionMarkCircle,
 HiArrowRight,
} from"react-icons/hi";
import { paths } from"@/app/routes/path/paths";
import { useProfile } from"@/features/account/hooks/useProfile";
import { useAddresses } from"@/features/account/hooks/useAddress";
import { useCheckoutStore } from"@/store/checkout";
import { useMemo } from"react";
import type { Address } from"@/features/account/types";

function resolveLocalized(value: unknown, lang: string): string {
 if (value == null) return"";
 if (typeof value ==="string") return value;
 if (
 typeof value ==="object"&&
 value !== null &&
 ("ar"in value ||"en"in value)
 ) {
 const o = value as { ar?: string; en?: string };
 return (lang.startsWith("ar") ? o.ar ?? o.en : o.en ?? o.ar) ??"";
 }
 return String(value);
}

const quickActions = [
 {
 id:"create-order",
 icon: HiPlus,
 iconBg:"bg-blue-600",
 iconColor:"text-white",
 labelKey:"affiliateWelcome.createNewOrder",
 path: paths.client.baskets,
 },
 {
 id:"track-order",
 icon: HiLocationMarker,
 iconBg:"bg-green-500",
 iconColor:"text-white",
 labelKey:"affiliateWelcome.trackMyOrder",
 path: paths.account.orders,
 },
 {
 id:"notifications",
 icon: HiBell,
 iconBg:"bg-purple-500",
 iconColor:"text-white",
 labelKey:"affiliateWelcome.notifications",
 path: paths.account.notifications,
 },
 {
 id:"help-center",
 icon: HiQuestionMarkCircle,
 iconBg:"bg-amber-500",
 iconColor:"text-white",
 labelKey:"affiliateWelcome.helpCenter",
 path: paths.account.helpSupport,
 },
];

export default function AffiliateWelcomePage() {
 const { t, i18n } = useTranslation();
 const lang = i18n.language ||"en";
 const { isRTL } = useLanguage();
 const { data: profile } = useProfile();
 const { data: addresses = [] } = useAddresses();
 const { addressId } = useCheckoutStore();

 const selectedAddress = useMemo(() => {
 if (addressId != null) {
 return addresses.find(
 (a: Address) => a.id === addressId || a.id === Number(addressId)
 );
 }
 return addresses.find((a: Address) => a.is_default) ?? addresses[0];
 }, [addresses, addressId]);

 const governorateName = selectedAddress
 ? resolveLocalized(
 selectedAddress.area?.city?.governorate?.name,
 lang
 )
 :"";
 const cityName = selectedAddress
 ? resolveLocalized(selectedAddress.area?.city?.name, lang)
 :"";

 const displayName = profile?.name
 ? typeof profile.name ==="string"
 ? profile.name
 : resolveLocalized(profile.name, lang)
 : t("affiliateWelcome.guest","Guest");

 return (
 <div
 className="min-h-screen bg-custom-light"
 dir={isRTL ?"rtl":"ltr"}
 >
 <div className="page-container py-8 md:py-10">
 {/* Welcome Banner */}
 <div className="mb-6">
 <div className="rounded-2xl bg-blue-100 dark:bg-blue-900/30 p-8 md:p-10 text-center">
 <h1 className="text-2xl md:text-3xl font-bold text-custom-primary mb-2">
 {t("affiliateWelcome.welcomeBack","Welcome back, {{name}}!", {
 name: displayName.split("")[0] || displayName,
 })}
 </h1>
 <p className="text-custom-primary mb-1">
 {t("affiliateWelcome.happyToSeeYou","We're happy to see you again 👋")}
 </p>
 <p className="text-custom-secondary text-sm">
 {t("affiliateWelcome.pickQuickAction","Pick a quick action below to get started.")}
 </p>
 </div>
 </div>

 {/* Your current location */}
 <div className="mb-6">
 <div className="bg-custom-card rounded-xl border border-custom-primary p-5 md:p-6">
 <h2 className="text-base font-bold text-custom-primary mb-3">
 {t("affiliateWelcome.yourCurrentLocation","Your current location")}
 </h2>
 <div className="flex flex-wrap gap-x-12 gap-y-2">
 <p className="text-custom-primary text-sm">
 <span className="font-medium">{t("auth.governorate","Governorate")}:</span>{""}
 <span className="text-custom-primary">
 {governorateName || t("affiliateWelcome.notSet","Not set")}
 </span>
 </p>
 <p className="text-custom-primary text-sm">
 <span className="font-medium">{t("auth.city","City")}:</span>{""}
 <span className="text-custom-primary">
 {cityName || t("affiliateWelcome.notSet","Not set")}
 </span>
 </p>
 </div>
 </div>
 </div>

 {/* Quick actions */}
 <div>
 <div className="flex items-center justify-between mb-4">
 <h2 className="text-base font-bold text-custom-primary">
 {t("affiliateWelcome.quickActions","Quick actions")}
 </h2>
 <Link
 to={paths.client.home}
 className="text-sm font-medium text-primary-light hover:text-primary transition-colors"
 >
 {t("affiliateWelcome.goToHome","Go to home")}
 </Link>
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
 {quickActions.map((action) => {
 const Icon = action.icon;
 return (
 <Link
 key={action.id}
 to={action.path}
 className="flex items-center gap-3 p-4 bg-custom-card rounded-xl border border-custom-primary hover:shadow-md hover:border-primary-light/30 transition-all group"
 >
 <div
 className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${action.iconBg} ${action.iconColor}`}
 >
 <Icon className="w-5 h-5"/>
 </div>
 <span className="flex-1 text-sm font-medium text-custom-primary">
 {t(action.labelKey)}
 </span>
 <HiArrowRight className="w-4 h-4 text-custom-tertiary group-hover:text-primary-light transition-colors shrink-0"/>
 </Link>
 );
 })}
 </div>
 </div>
 </div>
 </div>
 );
}
