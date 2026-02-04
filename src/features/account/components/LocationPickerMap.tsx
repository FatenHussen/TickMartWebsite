import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import L from "leaflet";
import { cn } from "@/shared/lib/utils";

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

// Custom marker icon for address selection
const createAddressIcon = (color: string = "#2563eb") => {
  const iconHtml = `<svg width="32" height="32" viewBox="0 0 24 24" fill="${color}" xmlns="http://www.w3.org/2000/svg">
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

type LocationPickerMapProps = {
  lat: number;
  lng: number;
  onLocationChange: (lat: number, lng: number) => void;
  className?: string;
};

export default function LocationPickerMap({
  lat,
  lng,
  onLocationChange,
  className,
}: LocationPickerMapProps) {
  const { t } = useTranslation();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map with default location (Damascus, Syria)
    const defaultLat = lat || 33.5138;
    const defaultLng = lng || 36.2765;

    const map = L.map(mapRef.current, {
      center: [defaultLat, defaultLng],
      zoom: 13,
      zoomControl: true,
    });

    // Add tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    // Wait for map to be ready before adding marker
    map.whenReady(() => {
      // Create marker
      const addressIcon = createAddressIcon("#2563eb");
      const marker = L.marker([defaultLat, defaultLng], {
        icon: addressIcon,
        draggable: true,
      }).addTo(map);

      markerRef.current = marker;

      // Handle marker drag
      marker.on("dragend", () => {
        const position = marker.getLatLng();
        onLocationChange(position.lat, position.lng);
      });

      // Handle map click
      map.on("click", (e) => {
        const { lat, lng } = e.latlng;
        marker.setLatLng([lat, lng]);
        onLocationChange(lat, lng);
      });
    });

    mapInstanceRef.current = map;

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, []);

  // Update marker position when lat/lng changes externally
  useEffect(() => {
    if (
      markerRef.current &&
      mapInstanceRef.current &&
      mapInstanceRef.current._loaded &&
      lat !== undefined &&
      lng !== undefined
    ) {
      const newLat = lat || 33.5138;
      const newLng = lng || 36.2765;
      try {
        markerRef.current.setLatLng([newLat, newLng]);
        mapInstanceRef.current.setView([newLat, newLng], 13);
      } catch (error) {
        console.error("Error updating map position:", error);
      }
    }
  }, [lat, lng]);

  return (
    <div
      className={cn(
        "w-full h-[400px] rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700",
        className,
      )}
    >
      <div ref={mapRef} className="w-full h-full" />
      <style>{`
        .custom-marker {
          background: transparent;
          border: none;
        }
        .leaflet-popup-content-wrapper {
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
}
