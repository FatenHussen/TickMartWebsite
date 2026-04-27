import type { ShopDetailsData } from"../types/shop";
import type { StoreMeta } from"../data/mockData";

function getLocalizedValue(value: unknown): string {
 if (typeof value === "string") return value;
 if (!value || typeof value !== "object") return "";

 const localized = value as { en?: string | null; ar?: string | null };
 return localized.en || localized.ar || "";
}

function humanizePaymentMethod(method: string): string {
 return method
 .split("_")
 .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
 .join(" ");
}

export function convertShopDataToStoreMeta(shop: ShopDetailsData): StoreMeta {
 // Convert working hours to schedule string
 const scheduleParts: string[] = [];
 const days = [
"monday",
"tuesday",
"wednesday",
"thursday",
"friday",
"saturday",
"sunday",
 ];

 for (const day of days) {
 const hours = shop.working_hours[day];
 if (hours) {
 if (hours.closed) {
 scheduleParts.push(
 `${day.charAt(0).toUpperCase() + day.slice(1)}: Closed`
 );
 } else if (hours.open && hours.close) {
 scheduleParts.push(
 `${day.charAt(0).toUpperCase() + day.slice(1)}: ${hours.open} - ${
 hours.close
 }`
 );
 }
 }
 }

 const schedule =
 scheduleParts.length > 0 ? scheduleParts.join(",") :"Not specified";

 // Convert services to badges
 const services = (shop.services || [])
 .map((service) => getLocalizedValue(service?.name))
 .filter(Boolean)
 .map((label) => ({
 label,
 variant:"outline"as const,
 }));

 // Create tags based on shop status
 const tags = [
 shop.is_open_now
 ? { label:"Open", variant:"success"as const }
 : { label:"Closed", variant:"outline"as const },
 { label:"Ready for orders", variant:"primary"as const },
 ];

 // Create perks
 const perks = [
 shop.is_recommended
 ? { label:"Recommended by Tikmool", variant:"primary"as const }
 : null,
 shop.is_active
 ? { label:"Verified store", variant:"primary"as const }
 : null,
 shop.is_open_now
 ? { label:"Accepting orders", variant:"success"as const }
 : null,
 ].filter(Boolean) as Array<{
 label: string;
 variant:"success"|"primary"|"outline"|"warning";
 }>;

 return {
 name: shop.name,
 category: shop.area ||"Store",
 rating: shop.average_rating,
    ratingsCount: shop.ratings_count,
    description: shop.description,
 city: shop.address.split("-")[0] || shop.address,
 address: shop.address,
 phone: shop.phone,
 mobile: shop.mobile,
 email: shop.email,
 schedule,
    workingHours: shop.working_hours,
 status: shop.is_open_now ?"open":"closed",
 tags,
 services,
 perks,
    paymentMethods: shop.payment_methods?.map(humanizePaymentMethod) ?? [],
    pricingTier: shop.pricing_tier ?? null,
    isRecommended: shop.is_recommended ?? false,
    isActive: shop.is_active,
    isServiceProvider: shop.is_service_provider ?? false,
    isRestaurant: shop.is_restaurant ?? false,
 heroImage:
 shop.cover_image ||
 shop.cover_images_urls?.[0] ||
 null,
 logo: shop.logo_url || null,
    isFavorite: shop.is_favorite ?? false,
 };
}
