import type { ShopDetailsData } from"../types/shop";
import type { StoreMeta } from"../data/mockData";

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
 const services = (shop.services || []).map((service: unknown) => ({
 label: typeof service ==="string"? service :"Service",
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
 city: shop.address.split("-")[0] || shop.address,
 address: shop.address,
 phone: shop.phone,
 mobile: shop.mobile,
 email: shop.email,
 schedule,
 status: shop.is_open_now ?"open":"closed",
 tags,
 services,
 perks,
 heroImage:
 shop.cover_images_urls?.[0] ||
"https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1600&q=80",
 logo:
 shop.logo_url ||
"https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=200&q=60",
 };
}
