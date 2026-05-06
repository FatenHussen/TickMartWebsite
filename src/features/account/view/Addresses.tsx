import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/shared/lib/utils";
import { PremiumInlineLoader } from "@/shared/component/loading";
import { MapPin, Phone, Trash2, Plus } from "lucide-react";
import { paths } from "@/app/routes/path/paths";
import {
    useAddresses,
    useDeleteAddress,
    useSetDefaultAddress,
} from "../hooks/useAddress";
import { API_SECOND_BUTTON_CLASS } from "../components/profile/apiPaletteClasses";
import {
    ADDRESS_FORM_HERO_BACKDROP_STYLE,
    ADDRESS_PAGES_DARK_HERO_BACKDROP_STYLE,
} from "../components/address-form/constants";

function resolveLocalized(value: unknown, lang: string): string {
    if (value == null) return "";
    if (typeof value === "string") return value;
    if (
        typeof value === "object" &&
        value !== null &&
        ("ar" in value || "en" in value)
    ) {
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
    const handleDelete = (id: number | string) => deleteAddress.mutate(id);
    const handleSetDefault = (address: (typeof addresses)[0]) =>
        setDefault.mutate(address);

    const buildAddressLine = (address: (typeof addresses)[0]) => {
        const parts: string[] = [];
        if (address.street_name) parts.push(address.street_name);
        if (address.floor_apartment) parts.push(address.floor_apartment);
        return parts.join(",");
    };

    const buildCityLine = (address: (typeof addresses)[0]) => {
        const parts: string[] = [];
        const areaName = resolveLocalized(address.area?.name, lang);
        if (areaName) parts.push(areaName);
        const cityName = resolveLocalized(address.area?.city?.name, lang);
        if (cityName) parts.push(cityName);
        return parts.join(",");
    };

    return (
        <div className="relative space-y-6" dir={isRTL ? "rtl" : "ltr"}>
            {/* Hero header card */}
            <section
                className="relative z-10 overflow-hidden rounded-3xl border border-custom-primary/80 bg-custom-card shadow-[0_24px_60px_-12px_color-mix(in_srgb,var(--color-main)_12%,transparent)] transition-shadow duration-300 dark:border-[rgba(255,255,255,0.06)] dark:bg-[rgba(16,17,20,0.75)] dark:shadow-[0_28px_88px_-32px_rgba(0,0,0,0.75),inset_0_1px_0_0_rgba(255,255,255,0.04)] dark:backdrop-blur-xl"
                aria-labelledby="addresses-page-title"
            >
                <div
                    className="pointer-events-none absolute inset-0 opacity-[0.97] dark:hidden"
                    style={ADDRESS_FORM_HERO_BACKDROP_STYLE}
                />
                <div
                    className="pointer-events-none absolute inset-0 hidden dark:block"
                    style={ADDRESS_PAGES_DARK_HERO_BACKDROP_STYLE}
                />
                <div className="pointer-events-none absolute -right-12 top-1/2 h-48 w-48 -translate-y-1/2 rounded-full bg-[var(--color-main)] opacity-[0.11] blur-3xl dark:opacity-[0.055]" />
                <div className="pointer-events-none absolute -left-8 bottom-0 h-36 w-36 rounded-full bg-[var(--color-api-second)] opacity-[0.18] blur-3xl dark:opacity-[0.07]" />

                <div className="relative flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-end lg:justify-between">
                    <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
                        {/* Icon */}
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--color-main)] to-[var(--color-primary-dark)] shadow-md ring-2 ring-white/25 dark:shadow-[0_0_28px_-6px_color-mix(in_srgb,var(--color-main)_28%,transparent)] dark:ring-white/[0.08]">
                            <MapPin className="h-7 w-7 text-white" aria-hidden />
                        </div>
                        <div className="min-w-0 space-y-1">
                            <h1
                                id="addresses-page-title"
                                className="text-2xl font-bold tracking-tight text-custom-primary sm:text-3xl"
                            >
                                {t("account.addresses.title")}
                            </h1>
                            <p className="max-w-xl text-sm leading-relaxed text-custom-secondary">
                                {t("account.addresses.subtitle")}
                            </p>
                        </div>
                    </div>

                    {/* Add new address button */}
                    <div className="flex shrink-0 sm:justify-end lg:pt-1">
                        <button
                            type="button"
                            onClick={handleAddNewAddress}
                            className={cn(
                                API_SECOND_BUTTON_CLASS,
                                "dark:shadow-[0_12px_36px_-18px_color-mix(in_srgb,var(--color-api-second)_35%,transparent)] dark:ring-1 dark:ring-white/[0.06]",
                            )}
                        >
                            <Plus className="h-4 w-4 shrink-0" aria-hidden />
                            {t("account.addresses.addNewAddress")}
                        </button>
                    </div>
                </div>
            </section>

            {/* Address list */}
            {isLoading ? (
                <div className="relative z-10 flex items-center justify-center py-16">
                    <PremiumInlineLoader size="md" />
                </div>
            ) : addresses.length === 0 ? (
                <div className="relative z-10 py-16 text-center">
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-custom-tertiary dark:bg-[rgba(255,255,255,0.04)] dark:ring-1 dark:ring-white/[0.06]">
                        <MapPin className="h-10 w-10 text-custom-tertiary dark:text-[color-mix(in_srgb,var(--color-main)_42%,#71717A)]" />
                    </div>
                    <h3 className="text-lg font-semibold text-custom-primary mb-1">
                        {t("account.addresses.noAddresses")}
                    </h3>
                </div>
            ) : (
                <div className="relative z-10 space-y-4">
                    {addresses.map((address) => (
                        <div
                            key={address.id}
                            className={cn(
                                "rounded-3xl border bg-custom-card p-5 sm:p-6 transition-all duration-300 hover:shadow-md",
                                "dark:border-[rgba(255,255,255,0.06)] dark:bg-[rgba(16,17,20,0.75)] dark:shadow-[0_10px_40px_-20px_rgba(0,0,0,0.65)] dark:backdrop-blur-sm",
                                "dark:hover:border-[rgba(255,255,255,0.09)] dark:hover:shadow-[0_18px_48px_-22px_rgba(0,0,0,0.72)]",
                                address.is_default
                                    ? "border-primary-light bg-accent-light-bg shadow-sm dark:border-[color-mix(in_srgb,var(--color-main)_22%,transparent)] dark:bg-[color-mix(in_srgb,var(--color-main)_10%,rgba(16,17,20,0.85))] dark:shadow-[0_0_44px_-14px_color-mix(in_srgb,var(--color-main)_22%,transparent),inset_0_0_0_1px_color-mix(in_srgb,var(--color-main)_14%,transparent)]"
                                    : "border-custom-primary bg-custom-light/50",
                            )}
                        >
                            <div className="flex items-start justify-between gap-4 flex-wrap sm:flex-nowrap">
                                {/* Left: address info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-2">
                                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary dark:text-[color-mix(in_srgb,var(--color-main)_70%,#a1a1aa)]" />
                                        <h3 className="text-base font-bold text-custom-primary">
                                            {address.label}
                                        </h3>
                                        {address.is_default && (
                                            <span className="px-2.5 py-0.5 bg-success text-white text-xs font-semibold rounded-full">
                                                {t("account.addresses.default")}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-custom-primary ml-6">
                                        {buildAddressLine(address)}
                                        {buildCityLine(address)
                                            ? `, ${buildCityLine(address)}`
                                            : ""}
                                    </p>
                                    {address.contact_phone && (
                                        <div className="flex items-center gap-2 mt-2 ml-6">
                                            <Phone className="w-4 h-4 text-custom-secondary shrink-0" />
                                            <span className="text-sm text-custom-secondary">
                                                {address.contact_phone}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Right: actions */}
                                <div
                                    className={cn(
                                        "flex items-center gap-3 shrink-0 pt-0.5",
                                        isRTL && "flex-row-reverse",
                                    )}
                                >
                                    {!address.is_default && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleSetDefault(address)
                                            }
                                            disabled={setDefault.isPending}
                                            className="text-sm font-medium text-primary transition-colors duration-200 hover:text-primary-dark hover:underline dark:text-[color-mix(in_srgb,var(--color-main)_78%,#FFFFFF)] dark:hover:text-[color-mix(in_srgb,var(--color-main)_92%,#FFFFFF)]"
                                        >
                                            {t(
                                                "account.addresses.setAsDefault",
                                            )}
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => handleEdit(address.id)}
                                        className="text-sm font-medium text-custom-primary transition-colors duration-200 hover:underline dark:text-[#A1A1AA] dark:hover:text-[#FFFFFF]"
                                    >
                                        {t("account.addresses.edit")}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleDelete(address.id)
                                        }
                                        disabled={deleteAddress.isPending}
                                        className="flex items-center gap-1.5 text-sm font-medium text-error hover:text-error transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
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
