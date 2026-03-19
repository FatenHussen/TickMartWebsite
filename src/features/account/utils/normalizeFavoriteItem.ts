import { paths } from"@/app/routes/path/paths";
import type { FavoriteItem, FavoriteType, WishlistDisplayItem } from"../types";

const PLACEHOLDER_IMAGE ="https://via.placeholder.com/400?text=No+Image";

export function inferFavoriteType(item: FavoriteItem): FavoriteType {
 if (item.type) return item.type;
 const itemAny = item as { vendor?: unknown; logo_url?: string };
 if (itemAny.vendor != null || itemAny.logo_url != null) return"shop";
 if ("name"in item &&"top_badges"in item) return"recipe";
 const itemExt = item as { next_delivery_date?: string; items_count?: number };
 if ("title"in item && (itemExt.next_delivery_date != null || (itemExt.items_count ?? 0) > 1))
 return"basket";
 return"product";
}

function getDetailPath(type: FavoriteType, id: number): string {
 switch (type) {
 case"product":
 return paths.client.productDetails(id);
 case"recipe":
 return paths.client.recipeDetails(id);
 case"basket":
 return paths.client.basketDetails(id);
 case"brand":
 return paths.client.brandDetails(id);
 case"shop":
 return paths.client.shopDetails(id);
 default:
 return"#";
 }
}

export function normalizeFavoriteItem(
 item: FavoriteItem,
 type: FavoriteType
): WishlistDisplayItem {
 const displayName = item.name ?? item.title ??"";
 const image = item.image ?? (item as { logo_url?: string }).logo_url ?? PLACEHOLDER_IMAGE;

 const priceAfterDiscount =
 item.price_after_discount ??
 item.price ??
 0;
 const originalPriceNum =
 item.original_price ?? item.price ?? 0;
 const soldCount = item.orders_count ?? item.num_sold ?? 0;

 const symbol = item.currency_symbol ??"$";

 let priceDisplay ="";
 let originalPrice: string | undefined;
 let savingsText: string | undefined;

 if (item.price_formatted && item.price_after_discount_formatted) {
 priceDisplay = item.price_after_discount_formatted;
 if (item.price && item.price_after_discount != null && item.price > item.price_after_discount) {
 originalPrice = item.price_formatted;
 const saved = item.price - item.price_after_discount;
 savingsText = `${symbol}${saved.toLocaleString()}`; // Will map to savingsAmount
 }
 } else if (item.saving != null && item.saving > 0) {
 priceDisplay = `${symbol}${Number(priceAfterDiscount).toLocaleString()}`;
 originalPrice = `${symbol}${Number(originalPriceNum).toLocaleString()}`;
 savingsText = `${symbol}${item.saving.toLocaleString()}`;
 } else if (item.discount_amount != null && item.discount_amount > 0) {
 priceDisplay = `${symbol}${Number(priceAfterDiscount).toLocaleString()}`;
 originalPrice = `${symbol}${Number(originalPriceNum).toLocaleString()}`;
 savingsText = `${symbol}${item.discount_amount.toLocaleString()}`;
 } else if (item.discount && parseFloat(item.discount) > 0) {
 const priceNum = typeof item.price ==="number"? item.price : parseFloat(String(item.price ?? 0));
 const afterNum = typeof item.price_after_discount ==="number"
 ? item.price_after_discount
 : parseFloat(String(item.price_after_discount ?? 0));
 priceDisplay = `${symbol}${Number(priceAfterDiscount).toLocaleString()}`;
 if (priceNum > afterNum) {
 originalPrice = `${symbol}${priceNum.toLocaleString()}`;
 savingsText = `${symbol}${(priceNum - afterNum).toLocaleString()}`;
 }
 } else {
 priceDisplay = `${symbol}${Number(priceAfterDiscount).toLocaleString()}`;
 }

 interface BadgeRaw {
 id: number;
 name: string;
 color: string;
 image?: string;
 }
 const itemWithVendor = item as { vendor?: { top_badges?: BadgeRaw[] } };
 const topBadgesRaw = item.top_badges ?? item.budges ?? itemWithVendor.vendor?.top_badges ?? [];
 const topBadges: { id: number; name: string; color: string; image?: string }[] =
 topBadgesRaw.map((b: BadgeRaw) => ({
 id: b.id,
 name: b.name,
 color: b.color,
 image: b.image,
 }));

 const showNew =
 item.is_new === true ||
 topBadges.some((b) => b.name.toLowerCase() ==="new"|| b.name ==="جديد");

 const itemVendor = item as { vendor?: { bottom_badges?: BadgeRaw[] } };
 const bottomBadgesRaw = item.bottom_badges ?? itemVendor.vendor?.bottom_badges ?? [];
 const bottomBadges: { id: number; name: string; color: string; image?: string }[] =
 bottomBadgesRaw.map((b: BadgeRaw) => ({
 id: b.id,
 name: b.name,
 color: b.color,
 image: b.image,
 }));

 const hasFreeDelivery =
 item.has_free_delivery === true ||
 item.delivery_price === 0 ||
 bottomBadges.some(
 (b) =>
 b.name.toLowerCase().includes("delivery") ||
 b.name.toLowerCase().includes("توصيل")
 );

 // Button / CTA from API - primary + secondary for AnimatedButton
 // Falls back to bottom_badges names when API doesn't send button (e.g. Featured, Sale)
 const itemExt = item as { action_button?: { primary?: string; secondary?: string; primary_text?: string; secondary_text?: string; label?: string; sublabel?: string } };
 const raw = item.button ?? item.cta ?? itemExt.action_button;
 let primary =
 raw?.primary ??
 (raw as { primary_text?: string })?.primary_text ??
 (raw as { label?: string })?.label;
 let secondary =
 raw?.secondary ??
 (raw as { secondary_text?: string })?.secondary_text ??
 (raw as { sublabel?: string })?.sublabel ??
 primary;

 // Use bottom_badges when no explicit button from API
 if (!primary && bottomBadges.length > 0) {
 primary = bottomBadges[0].name;
 secondary = bottomBadges.length > 1 ? bottomBadges[1].name : primary;
 }

 const button =
 primary && primary.length > 0
 ? { primary, secondary: secondary ?? primary }
 : undefined;

 return {
 id: item.id,
 name: displayName,
 category: item.category ?? item.description ?? item.desc,
 image,
 rating: item.rating ?? (item as { average_rating?: number }).average_rating,
 priceDisplay,
 originalPrice,
 savingsAmount: savingsText,
 soldCount: soldCount > 0 ? soldCount : undefined,
 showNew,
 hasFreeDelivery,
 detailPath: getDetailPath(type, item.id),
 topBadges,
 bottomBadges,
 button,
 };
}
