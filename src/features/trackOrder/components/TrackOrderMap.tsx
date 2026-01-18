import { useEffect, useRef } from "react";
import { HiChevronUp, HiChevronDown, HiLocationMarker } from "react-icons/hi";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/shared/lib/utils";
import L from "leaflet";
import type { TrackOrderData } from "../types";

type TrackOrderMapProps = {
  order: TrackOrderData;
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
      ? `<svg width="32" height="32" viewBox="0 0 24 24" fill="${color}" xmlns="http://www.w3.org/2000/svg">
        <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
      </svg>`
      : `<svg width="32" height="32" viewBox="0 0 24 24" fill="${color}" xmlns="http://www.w3.org/2000/svg">
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

export default function TrackOrderMap({ order }: TrackOrderMapProps) {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Calculate center point between driver and destination
    const centerLat = (order.driver.location.lat + order.destination.lat) / 2;
    const centerLng = (order.driver.location.lng + order.destination.lng) / 2;

    // Initialize map
    const map = L.map(mapRef.current, {
      center: [centerLat, centerLng],
      zoom: 14,
      zoomControl: false, // We'll add custom zoom controls
    });

    // Add tile layer (OpenStreetMap)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    // Create custom icons
    const driverIcon = createCustomIcon("#eab308", "car"); // Yellow for driver
    const destinationIcon = createCustomIcon("#2563eb", "location"); // Blue for destination

    // Add driver marker
    const driverMarker = L.marker(
      [order.driver.location.lat, order.driver.location.lng],
      { icon: driverIcon }
    )
      .addTo(map)
      .bindPopup(
        `<div class="p-2">
          <div class="font-semibold text-custom-primary">${
            order.driver.name
          }</div>
          <div class="text-sm text-custom-secondary">${t("trackOrder.eta")}: ${
          order.driver.eta
        }</div>
        </div>`,
        { className: "custom-popup" }
      );

    // Add destination marker
    const destinationMarker = L.marker(
      [order.destination.lat, order.destination.lng],
      { icon: destinationIcon }
    )
      .addTo(map)
      .bindPopup(
        `<div class="p-2">
          <div class="font-semibold text-custom-primary">${t(
            "trackOrder.destination"
          )}</div>
          <div class="text-sm text-custom-secondary">${
            order.destination.address
          }</div>
        </div>`,
        { className: "custom-popup" }
      );

    // Add route polyline (simplified - in production, use routing service)
    L.polyline(
      [
        [order.driver.location.lat, order.driver.location.lng],
        [order.destination.lat, order.destination.lng],
      ],
      {
        color: "var(--color-accent-primary)",
        weight: 4,
        opacity: 0.7,
        dashArray: "10, 10",
      }
    ).addTo(map);

    // Fit map to show both markers
    const group = new L.FeatureGroup([driverMarker, destinationMarker]);
    map.fitBounds(group.getBounds().pad(0.1));

    // Store references
    mapInstanceRef.current = map;
    markersRef.current = [driverMarker, destinationMarker];

    // Cleanup
    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markersRef.current = [];
    };
  }, [order, t]);

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
      {/* Header */}
      <div className="p-4 border-b border-custom-secondary">
        <h2 className="text-lg font-bold text-custom-primary mb-3">
          {t("trackOrder.title")}
        </h2>

        {/* Order Status Bar */}
        <div className="bg-custom-secondary rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-custom-primary">
              {t("orders.order")} #{order.orderNumber}
            </span>
            <span
              className="text-xs font-semibold px-2 py-1 rounded"
              style={{
                backgroundColor: "rgba(249, 115, 22, 0.1)",
                color: "#f97316",
              }}
            >
              {t(`orders.${order.status}`)}
            </span>
          </div>
          <div className="text-xs text-custom-secondary">
            {t("trackOrder.etaLabel")}: {order.eta}
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative" style={{ height: "600px", minHeight: "400px" }}>
        {/* Leaflet Map */}
        <div ref={mapRef} className="w-full h-full" />

        {/* Custom Zoom Controls */}
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

        {/* Notification Box */}
        <div
          className={cn(
            "absolute bottom-4 left-4 bg-custom-primary rounded-lg shadow-lg border border-custom-secondary p-3 max-w-xs",
            isRTL && "right-4 left-auto"
          )}
          style={{ zIndex: 1000 }}
        >
          <div className="flex items-start gap-2">
            <HiLocationMarker className="w-4 h-4 text-custom-accent shrink-0 mt-0.5" />
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
