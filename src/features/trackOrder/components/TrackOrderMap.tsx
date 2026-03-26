import { useEffect, useRef, useState } from "react";
import { HiChevronUp, HiChevronDown } from "react-icons/hi";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/shared/lib/utils";
import L from "leaflet";
import type { TrackOrderData } from "../types";

type TrackOrderMapProps = {
    order: TrackOrderData;
    liveLocation?: { lat: number; lng: number } | null;
};

// Fix for default marker icon in Leaflet with Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Custom icons
const createCustomIcon = (
    color: string,
    iconType: "car" | "location" = "location"
) => {
    const iconHtml =
        iconType === "car"
            ? `<svg width="32"height="32"viewBox="0 0 24 24"fill="${color}"xmlns="http://www.w3.org/2000/svg">
 <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
 </svg>`
            : `<svg width="32"height="32"viewBox="0 0 24 24"fill="${color}"xmlns="http://www.w3.org/2000/svg">
 <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
 </svg>`;

    return L.divIcon({
        html: iconHtml,
        className: "custom-marker",
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
    });
};

export default function TrackOrderMap({ order, liveLocation }: TrackOrderMapProps) {
    const { t } = useTranslation();
    const { isRTL } = useLanguage();
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const markersRef = useRef<L.Marker[]>([]);
    const polylineRef = useRef<L.Polyline | null>(null);
    const [currentLocation, setCurrentLocation] = useState<{
        lat: number;
        lng: number;
    } | null>(null);

    // Get user's current location via browser geolocation
    useEffect(() => {
        if (!navigator.geolocation) return;
        const id = navigator.geolocation.watchPosition(
            (position) => {
                setCurrentLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
            },
            (error) => {
                console.warn("Geolocation error:", error.message);
            },
            { enableHighAccuracy: true, maximumAge: 10000, timeout: 15000 }
        );
        return () => navigator.geolocation.clearWatch(id);
    }, []);


    // Initialize map ONCE when liveLocation first arrives (no reload when driver/user moves)
    const hasLiveLocation = Boolean(liveLocation);
    useEffect(() => {
        if (!hasLiveLocation) {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
                markersRef.current = [];
                polylineRef.current = null;
            }
            return;
        }
        if (!mapRef.current || mapInstanceRef.current) return;

        const loc = liveLocation!;
        const map = L.map(mapRef.current, {
            center: [loc.lat, loc.lng],
            zoom: 18,
            zoomControl: false,
        });

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19,
        }).addTo(map);

        const driverIcon = createCustomIcon("#eab308", "car");

        const driverPopupContent = order.driver
            ? `<div class="p-2">
 <div class="font-semibold text-custom-primary">${order.driver.name}</div>
 <div class="text-sm text-custom-secondary">${t("trackOrder.eta")}: ${order.driver.eta}</div>
 </div>`
            : `<div class="p-2">
 <div class="font-semibold text-custom-primary">${t("trackOrder.driver", "Driver")}</div>
 </div>`;

        const driverMarker = L.marker([loc.lat, loc.lng], {
            icon: driverIcon,
        })
            .addTo(map)
            .bindPopup(driverPopupContent, { className: "custom-popup" });

        mapInstanceRef.current = map;
        markersRef.current = [driverMarker];
        polylineRef.current = null;

        map.setView([loc.lat, loc.lng], 18);

        return () => {
            map.remove();
            mapInstanceRef.current = null;
            markersRef.current = [];
            polylineRef.current = null;
        };
    }, [hasLiveLocation, order, t]);

    // Add/update destination marker and polyline when currentLocation changes (no map reload)
    useEffect(() => {
        if (!liveLocation || !currentLocation) return;

        const map = mapInstanceRef.current;
        const driverMarker = markersRef.current[0];
        let destinationMarker = markersRef.current[1];
        let polyline = polylineRef.current;

        // Add destination marker + polyline when currentLocation first arrives
        if (!destinationMarker && map) {
            const destinationIcon = createCustomIcon("#2563eb", "location");
            destinationMarker = L.marker(
                [currentLocation.lat, currentLocation.lng],
                { icon: destinationIcon }
            )
                .addTo(map)
                .bindPopup(
                    `<div class="p-2">
 <div class="font-semibold text-custom-primary">${t("trackOrder.currentLocation")}</div>
 <div class="text-sm text-custom-secondary">${currentLocation.lat.toFixed(5)}, ${currentLocation.lng.toFixed(5)}</div>
 </div>`,
                    { className: "custom-popup" }
                );

            polyline = L.polyline(
                [
                    [liveLocation.lat, liveLocation.lng],
                    [currentLocation.lat, currentLocation.lng],
                ],
                {
                    color: "var(--color-accent-primary)",
                    weight: 4,
                    opacity: 0.7,
                    dashArray: "10, 10",
                }
            ).addTo(map);

            const group = new L.FeatureGroup([driverMarker, destinationMarker]);
            map.fitBounds(group.getBounds().pad(0.1));

            markersRef.current = [driverMarker, destinationMarker];
            polylineRef.current = polyline;
        }

        // Update positions when locations change (no map reload)
        if (driverMarker) {
            driverMarker.setLatLng([liveLocation.lat, liveLocation.lng]);
        }
        if (destinationMarker) {
            destinationMarker.setLatLng([currentLocation.lat, currentLocation.lng]);
        }
        if (polyline) {
            polyline.setLatLngs([
                [liveLocation.lat, liveLocation.lng],
                [currentLocation.lat, currentLocation.lng],
            ]);
        }
        if (map) {
            map.panTo([liveLocation.lat, liveLocation.lng], { animate: true });
        }
    }, [liveLocation, currentLocation, order, t]);

    const handleZoomIn = () => {
        if (mapInstanceRef.current) {
            mapInstanceRef.current.zoomIn();
        }
    };

    const handleZoomOut = () => {
        if (mapInstanceRef.current) {
            mapInstanceRef.current.zoomOut();
        }
    };

    return (
        <div
            className="bg-custom-primary rounded-2xl border border-custom-secondary shadow-sm overflow-hidden"
            dir={isRTL ? "rtl" : "ltr"}
        >
            {/* Map Container */}
            <div className="relative" style={{ height: "650px", minHeight: "500px" }}>
                {!liveLocation && (
                    <div className="absolute inset-0 flex items-center justify-center bg-custom-tertiary z-10">
                        <p className="text-custom-secondary">{t("trackOrder.waitingLocation")}</p>
                    </div>
                )}
                {/* Leaflet Map */}
                <div ref={mapRef} className="w-full h-full" />

                {/* ETA Badge - Top Left */}
                <div
                    className={cn(
                        "absolute top-4 left-4 bg-custom-primary rounded-lg shadow-lg border border-custom-secondary px-3 py-2",
                        isRTL && "right-4 left-auto"
                    )}
                    style={{ zIndex: 1000 }}
                >
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-custom-secondary">
                            {t("trackOrder.eta")}:
                        </span>
                        <span className="text-sm font-semibold text-custom-primary">
                            {order.eta}
                        </span>
                    </div>
                </div>

                {/* Custom Zoom Controls - Bottom Right */}
                <div
                    className={cn(
                        "absolute bottom-4 right-4 flex flex-col gap-1 bg-custom-primary rounded-lg shadow-lg border border-custom-secondary overflow-hidden",
                        isRTL && "left-4 right-auto"
                    )}
                    style={{ zIndex: 1000 }}
                >
                    <button
                        type="button"
                        onClick={handleZoomIn}
                        className="p-2 hover:bg-custom-hover transition-colors text-custom-primary"
                        aria-label={t("trackOrder.zoomIn")}
                    >
                        <HiChevronUp className="w-5 h-5" />
                    </button>
                    <div className="h-px bg-custom-secondary" />
                    <button
                        type="button"
                        onClick={handleZoomOut}
                        className="p-2 hover:bg-custom-hover transition-colors text-custom-primary"
                        aria-label={t("trackOrder.zoomOut")}
                    >
                        <HiChevronDown className="w-5 h-5" />
                    </button>
                </div>

                {/* Notification Box - Bottom Left */}
                <div
                    className={cn(
                        "absolute bottom-4 left-4 bg-custom-card/95 backdrop-blur-sm rounded-lg shadow-lg border border-blue-200 p-3 max-w-xs",
                        isRTL && "right-4 left-auto"
                    )}
                    style={{ zIndex: 1000 }}
                >
                    <div className="flex items-start gap-2">
                        <div
                            className="w-2 h-2 rounded-full shrink-0 mt-1.5"
                            style={{ backgroundColor: "#3b82f6" }}
                        />
                        <p className="text-xs text-custom-secondary">
                            {t("trackOrder.notificationMessage")}
                        </p>
                    </div>
                </div>
            </div>

            <style>{`
 .custom-marker {
 background: transparent;
 border: none;
 }
 .custom-popup .leaflet-popup-content-wrapper {
 background-color: var(--color-bg-primary);
 border: 1px solid var(--color-border-secondary);
 border-radius: 0.5rem;
 }
 .custom-popup .leaflet-popup-content {
 margin: 0;
 color: var(--color-text-primary);
 }
 .leaflet-container {
 background-color: var(--color-bg-tertiary);
 }
 `}</style>
        </div>
    );
}
