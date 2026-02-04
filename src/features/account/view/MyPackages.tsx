import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import PackageCard from "../components/PackageCard";
import { mockPackages } from "../data/mockData";

export default function MyPackages() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  const handleSubscribe = (packageId: string) => {
    console.log("Subscribe to package:", packageId);
    // TODO: Call API to subscribe
  };

  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          {t("packages.myPackages")}
        </h1>
        <p className="text-sm text-gray-600">
          {t("packages.myPackagesDescription")}
        </p>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {mockPackages.map((pkg) => (
          <PackageCard
            key={pkg.id}
            package={pkg}
            onSubscribe={handleSubscribe}
          />
        ))}
      </div>

      {/* Promo Banner */}
      <div className="relative rounded-2xl overflow-hidden h-48 md:h-56">
        <img
          src="/images/accounts/promo-banner.jpg"
          alt="Promo Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-center p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white italic mb-2">
            {t("packages.promoBanner.title")}
          </h2>
          <p className="text-white/90 text-sm md:text-base mb-4 max-w-md">
            {t("packages.promoBanner.description")}
          </p>
          <button className="w-fit px-6 py-2.5 bg-white text-gray-900 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors">
            {t("packages.promoBanner.shopNow")}
          </button>
        </div>
      </div>
    </div>
  );
}
