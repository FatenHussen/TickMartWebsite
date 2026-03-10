import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/shared/lib/utils";
import {
  HiPlus,
  HiLocationMarker,
  HiPhone,
  HiTrash,
} from "react-icons/hi";
import { paths } from "@/app/routes/path/paths";
import {
  useAddresses,
  useDeleteAddress,
  useSetDefaultAddress,
} from "../hooks/useAddress";

import addressesBg from "/images/accounts/Addresses.png";

function resolveLocalized(value: unknown, lang: string): string {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object" && value !== null && ("ar" in value || "en" in value)) {
    const o = value as { ar?: string; en?: string };
    return (lang.startsWith("ar") ? o.ar ?? o.en : o.en ?? o.ar) ?? "";
  }
  return String(value);
}

export default function Addresses() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || "en";
  const { isRTL } = useLanguage();
  const navigate = useNavigate();
  const { data: addresses = [], isLoading } = useAddresses();
  const deleteAddress = useDeleteAddress();
  const setDefault = useSetDefaultAddress();

  const handleAddNewAddress = () => navigate(paths.account.addAddress);
  const handleEdit = (id: number | string) =>
    navigate(paths.account.editAddress(id));

  const handleDelete = (id: number | string) => {
    deleteAddress.mutate(id);
  };

  const handleSetDefault = (id: number | string) => {
    setDefault.mutate(id);
  };

  const buildAddressLine = (address: (typeof addresses)[0]) => {
    const parts: string[] = [];
    if (address.street_name) parts.push(address.street_name);
    if (address.floor_apartment) parts.push(address.floor_apartment);
    return parts.join(", ");
  };

  const buildCityLine = (address: (typeof addresses)[0]) => {
    const parts: string[] = [];
    const areaName = resolveLocalized(address.area?.name, lang);
    if (areaName) parts.push(areaName);
    const cityName = resolveLocalized(address.area?.city?.name, lang);
    if (cityName) parts.push(cityName);
    return parts.join(", ");
  };

  return (
    <div className="relative space-y-6" dir={isRTL ? "rtl" : "ltr"}>
      {/* Background illustration - light orange/yellow, bottom right */}
      <img
        src={addressesBg}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -top-1/2 -right-1/4 w-auto  object-contain select-none z-0"
      />

      {/* Header */}
      <div className="relative z-10 flex items-start justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-sm">
            <HiLocationMarker className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t("account.addresses.title")}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {t("account.addresses.subtitle")}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleAddNewAddress}
          className="flex items-center gap-2 px-5 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
        >
          <HiPlus className="w-4 h-4" />
          {t("account.addresses.addNewAddress")}
        </button>
      </div>

      {/* Address List */}
      {isLoading ? (
        <div className="relative z-10 flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-cyan-500" />
        </div>
      ) : addresses.length === 0 ? (
        <div className="relative z-10 py-16 text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <HiLocationMarker className="w-10 h-10 text-gray-300 dark:text-gray-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            {t("account.addresses.noAddresses")}
          </h3>
        </div>
      ) : (
        <div className="relative z-10 space-y-4">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={cn(
                "rounded-xl border p-5 sm:p-6 bg-white dark:bg-gray-800 transition-all hover:shadow-md",
                address.is_default
                  ? "border-cyan-400 dark:border-cyan-500 bg-cyan-50/40 dark:bg-cyan-950/20 shadow-sm"
                  : "border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/80"
              )}
            >
              <div className="flex items-start justify-between gap-4 flex-wrap sm:flex-nowrap">
                {/* Left: address info */}
                <div className="flex-1 min-w-0">
                  {/* Label + Default badge */}
                  <div className="flex items-center gap-2 mb-2">
                    <HiLocationMarker className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
                    <h3 className="text-base font-bold text-gray-900 dark:text-white">
                      {address.label}
                    </h3>
                    {address.is_default && (
                      <span className="px-2.5 py-0.5 bg-green-500 text-white text-xs font-semibold rounded-full">
                        {t("account.addresses.default")}
                      </span>
                    )}
                  </div>

                  {/* Street + floor + city */}
                  <p className="text-sm text-gray-700 dark:text-gray-300 ml-6">
                    {buildAddressLine(address)}
                    {buildCityLine(address) ? `, ${buildCityLine(address)}` : ""}
                  </p>

                  {/* Phone */}
                  {address.contact_phone && (
                    <div className="flex items-center gap-2 mt-2 ml-6">
                      <HiPhone className="w-4 h-4 text-gray-500 dark:text-gray-400 shrink-0" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {address.contact_phone}
                      </span>
                    </div>
                  )}
                </div>

                {/* Right: actions */}
                <div
                  className={cn(
                    "flex items-center gap-3 shrink-0 pt-0.5",
                    isRTL && "flex-row-reverse"
                  )}
                >
                  {!address.is_default && (
                    <button
                      type="button"
                      onClick={() => handleSetDefault(address.id)}
                      disabled={setDefault.isPending}
                      className="text-sm font-medium text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 hover:underline transition-colors"
                    >
                      {t("account.addresses.setAsDefault")}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleEdit(address.id)}
                    className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:underline transition-colors"
                  >
                    {t("account.addresses.edit")}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(address.id)}
                    disabled={deleteAddress.isPending}
                    className="flex items-center gap-1.5 text-sm font-medium text-red-500 hover:text-red-600 transition-colors"
                  >
                    <HiTrash className="w-4 h-4" />
                    {t("account.addresses.delete")}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
