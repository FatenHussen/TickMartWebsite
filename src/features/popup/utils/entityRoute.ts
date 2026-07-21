import { paths } from "@/app/routes/path/paths";
import type { PopupEntityType } from "../types";

/**
 * Maps a polymorphic entity type + id to its in-app detail route.
 *
 * All shop-like entities (shop, restaurant, service provider, vendor service)
 * resolve to `/shop_details/{id}` — they're all backed by the `shops` model.
 */
export function entityTypeToPath(
    entityType: PopupEntityType,
    id: number | string
): string {
    switch (entityType) {
        case "product":
            return paths.client.productDetails(id);
        case "recipe":
            return paths.client.recipeDetails(id);
        case "basket":
            return paths.client.basketDetails(id);
        case "shop":
        case "restaurant":
        case "service_provider":
        case "shop_vendor_service":
            return paths.client.shopDetails(id);
        default:
            return paths.client.shopDetails(id);
    }
}
