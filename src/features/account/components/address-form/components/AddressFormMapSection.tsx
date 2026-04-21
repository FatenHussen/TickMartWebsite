import { useTranslation } from "react-i18next";
import { HiLocationMarker, HiSearch } from "react-icons/hi";
import LocationPickerMap from "@/features/account/components/LocationPickerMap";

type AddressFormMapSectionProps = {
    latitude: number;
    longitude: number;
    onLocationChange: (lat: number, lng: number) => void;
    onUseCurrentLocation: () => void;
};

export function AddressFormMapSection({
    latitude,
    longitude,
    onLocationChange,
    onUseCurrentLocation,
}: AddressFormMapSectionProps) {
    const { t } = useTranslation();

    const latNum = Number(latitude);
    const lngNum = Number(longitude);

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2">
                <HiLocationMarker className="h-5 w-5 shrink-0 text-primary" />
                <label className="text-sm font-medium text-custom-primary">
                    {t("account.addAddress.locationOnMap")}
                </label>
            </div>
            <div className="relative">
                <HiSearch className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-custom-tertiary" />
                <input
                    type="text"
                    placeholder={t("account.addAddress.searchLocationPlaceholder")}
                    readOnly
                    className="w-full rounded-xl border border-custom-secondary bg-custom-light py-2.5 pr-4 pl-10 text-sm text-custom-secondary"
                />
            </div>
            <LocationPickerMap
                lat={latitude}
                lng={longitude}
                onLocationChange={onLocationChange}
            />
            <button
                type="button"
                onClick={onUseCurrentLocation}
                className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-custom-secondary py-2.5 text-sm font-medium text-custom-secondary transition-colors hover:border-primary hover:text-primary"
            >
                <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                </svg>
                {t("account.addAddress.useCurrentLocation")}
            </button>
            <p className="text-xs text-custom-secondary">
                {t("account.addAddress.pinnedLocation")}: {latNum?.toFixed(4)}°
                {latNum >= 0 ? "N" : "S"}, {lngNum?.toFixed(4)}°
                {lngNum >= 0 ? "E" : "W"}
            </p>
        </div>
    );
}
