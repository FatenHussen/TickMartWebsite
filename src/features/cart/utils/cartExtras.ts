import type { CartExtraLine } from "../types";

/** Normalize persisted legacy `extras: number[]` or new `{ id, quantity }[]`. */
export function normalizeCartExtras(
    extras?: number[] | CartExtraLine[] | null
): CartExtraLine[] | undefined {
    if (!extras?.length) return undefined;
    const first = extras[0];
    if (typeof first === "number") {
        return (extras as number[]).map((id) => ({ id, quantity: 1 }));
    }
    return extras as CartExtraLine[];
}

/** Cart line id suffix for distinct variant + extras combinations. */
export function extrasLineKeyFromExtras(
    extras?: number[] | CartExtraLine[] | null
): string {
    const n = normalizeCartExtras(extras);
    if (!n?.length) return "";
    return `-e-${[...n]
        .sort((a, b) => a.id - b.id)
        .map((x) => `${x.id}:${x.quantity}`)
        .join("-")}`;
}

/** Match preview order lines that share the same variant. */
export function extrasSignature(
    extras?: number[] | CartExtraLine[] | null
): string {
    const n = normalizeCartExtras(extras);
    if (!n?.length) return "";
    return [...n]
        .sort((a, b) => a.id - b.id)
        .map((x) => `${x.id}:${x.quantity}`)
        .join(",");
}
