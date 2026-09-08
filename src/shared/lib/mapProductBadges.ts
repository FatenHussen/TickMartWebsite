import type { ProductCardBadge } from "@/shared/component/card/ProductCard";
import { resolveProductBadgeAppearance } from "@/shared/lib/productBadgeColors";
import i18next from "i18next";

/** Matches API / section payloads: `top_badges`, `bottom_badges`, legacy `budges` */
export type ApiProductBadgeLike = {
    id?: number;
    name: string | { ar?: string | null; en?: string | null } | null;
    color?: string | null;
    type?: string | null;
    image?: string | null;
    /** API typo */
    postion?: string | null;
    position?: string | null;
};

function horizontalAlign(pos: string | null | undefined): "left" | "right" {
    const p = (pos ?? "").toLowerCase();
    if (p === "right") return "right";
    return "left";
}

export type MapApiBadgesOptions = {
    /** Max badges to map (default: all badges) */
    max?: number;
};

function normalizeLocalizedText(
    value: ApiProductBadgeLike["name"]
): string | undefined {
    if (typeof value === "string") return value;
    if (!value || typeof value !== "object") return undefined;

    const lang = i18next.language?.toLowerCase() ?? "";
    const preferred = lang.startsWith("ar") ? value.ar : value.en;
    return preferred ?? value.en ?? value.ar ?? undefined;
}

/** Map `top_badges` / `budges` → ProductCard top overlay badges */
export function mapApiTopBadgesToProductCard(
    badges: ApiProductBadgeLike[] | undefined | null,
    options?: MapApiBadgesOptions
): ProductCardBadge[] | undefined {
    if (!badges?.length) return undefined;
    const max = options?.max !== undefined ? options.max : badges.length;
    const slice = max <= 0 ? [] : badges.slice(0, max);
    if (!slice.length) return undefined;
    return slice.map((b) => {
        const appearance = resolveProductBadgeAppearance(b.color);
        return {
            label: normalizeLocalizedText(b.name) ?? "",
            className: appearance.className,
            style: appearance.style,
            align: horizontalAlign(b.position ?? b.postion),
            rawLabel: true,
            type: b.type ?? undefined,
            image: b.image ?? undefined,
        };
    });
}

/** Map `bottom_badges` → ProductCard bottom AnimatedButton rows */
export function mapApiBottomBadgesToProductCard(
    badges: ApiProductBadgeLike[] | undefined | null,
    options?: MapApiBadgesOptions
): ProductCardBadge[] | undefined {
    if (!badges?.length) return undefined;
    const max = options?.max !== undefined ? options.max : badges.length;
    const slice = max <= 0 ? [] : badges.slice(0, max);
    if (!slice.length) return undefined;
    return slice.map((b) => {
        const appearance = resolveProductBadgeAppearance(b.color);
        return {
            label: normalizeLocalizedText(b.name) ?? "",
            className: appearance.className,
            style: appearance.style,
            rawLabel: true,
            type: b.type ?? undefined,
            image: b.image ?? undefined,
        };
    });
}
