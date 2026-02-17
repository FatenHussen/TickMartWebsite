import { useTranslation } from "react-i18next";
import { HiCheck } from "react-icons/hi";
import Button from "@/shared/ui/Button";
import type { SubscriptionPackage } from "../types";

type PackageCardProps = {
  package: SubscriptionPackage;
  onSubscribe?: (packageId: number | string) => void;
};

export default function PackageCard({
  package: pkg,
  onSubscribe,
}: PackageCardProps) {
  const { t } = useTranslation();

  const isFeatured = pkg.isFeatured || pkg.isCurrentPlan;

  return (
    <div
      className={`relative rounded-2xl overflow-hidden transition-all ${
        isFeatured
          ? "ring-2 ring-primary shadow-lg"
          : "border border-gray-200 hover:border-gray-300"
      }`}
    >
      {/* Featured Background */}
      {isFeatured && (
        <div
          className="absolute inset-0 opacity-10"
          style={{
            background: pkg.gradient || "linear-gradient(135deg, #0891B2 0%, #164E63 100%)",
          }}
        />
      )}

      <div className="relative p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3
              className={`text-lg font-bold ${
                isFeatured ? "text-primary" : "text-gray-900"
              }`}
            >
              {pkg.name.startsWith("packages.") ? t(pkg.name) : pkg.name}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {pkg.duration.startsWith("packages.")
                ? t(pkg.duration)
                : pkg.duration}
            </p>
          </div>

          {/* Current Plan Badge */}
          {pkg.isCurrentPlan && (
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary text-white">
              {t("packages.currentPlan")}
            </span>
          )}
        </div>

        {/* Features */}
        <ul className="space-y-2.5 mb-5">
          {pkg.features.map((feature) => (
            <li key={feature.id} className="flex items-center gap-2">
              <span
                className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${
                  isFeatured ? "bg-primary/20 text-primary" : "bg-gray-100 text-gray-600"
                }`}
              >
                <HiCheck className="w-2.5 h-2.5" />
              </span>
              <span className="text-sm text-gray-700">
                {feature.text.startsWith("packages.")
                  ? t(feature.text)
                  : feature.text}
              </span>
            </li>
          ))}
        </ul>

        {/* Price & Action */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <span
              className={`text-xl font-bold ${
                isFeatured ? "text-primary" : "text-gray-900"
              }`}
            >
              {pkg.price}
            </span>
            <span className="text-sm text-gray-500 ms-1">
              {pkg.currency ? `${pkg.currency}/` : ""}
              {t("packages.month")}
            </span>
          </div>

          {!pkg.isCurrentPlan && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSubscribe?.(pkg.id)}
              className="px-5"
            >
              {t("packages.subscribe")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
