import { resolveLocalizedText } from "@/shared/lib/localizedText";
import type { LocalizedOrString, ProductCountry } from "../types/productDetails";

/**
 * Resolves API values that may be a plain string or a localized object
 * `{ ar, en }` into a renderable string. Product-typed wrapper over the shared
 * resolver, which the sections renderer uses for the same payload shape.
 */
export function resolveLocalizedOrString(
    value: LocalizedOrString | number,
    language: string
): string {
    return resolveLocalizedText(value, language);
}

/**
 * `country` is returned either as a plain string or as the full country record
 * (`{ id, name: { ar, en }, code, ... }`). Rendering the raw object crashes
 * React, so always funnel it through here.
 */
export function resolveProductCountry(
    country: ProductCountry,
    language: string
): string {
    if (country == null) return "";
    if (typeof country === "string") return country;
    return resolveLocalizedOrString(country.name, language);
}
