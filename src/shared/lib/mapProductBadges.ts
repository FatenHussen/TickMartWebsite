import type { ProductCardBadge } from "@/shared/component/card/ProductCard";
import { getProductBadgeClassName } from "@/shared/lib/productBadgeColors";

/** Matches API / section payloads: `top_badges`, `bottom_badges`, legacy `budges` */
export type ApiProductBadgeLike = {
    id?: number;
    name: string;
    color?: string | null;
    /** API typo */
    postion?: string | null;
    position?: string | null;
};

function horizontalAlign(pos: string | null | undefined): "left" | "right" {
    const p = (pos ?? "").toLowerCase();
    if (p === "right") return "right";
    return "left";
}

/** Map `top_badges` / `budges` → ProductCard top overlay badges */
export function mapApiTopBadgesToProductCard(
    badges: ApiProductBadgeLike[] | undefined | null
): ProductCardBadge[] | undefined {
    if (!badges?.length) return undefined;
    return badges.map((b) => ({
        label: b.name,
        className: getProductBadgeClassName(b.color),
        align: horizontalAlign(b.position ?? b.postion),
        rawLabel: true,
    }));
}

/** Map `bottom_badges` → ProductCard bottom AnimatedButton rows */
export function mapApiBottomBadgesToProductCard(
    badges: ApiProductBadgeLike[] | undefined | null
): ProductCardBadge[] | undefined {
    if (!badges?.length) return undefined;
    return badges.map((b) => ({
        label: b.name,
        className: getProductBadgeClassName(b.color),
        rawLabel: true,
    }));
}
