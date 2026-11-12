/**
 * Reuses the symbol already stored on the cart line instead of inventing one.
 * The store has no access to CurrencyContext, and hardcoding a symbol made
 * every recalculated subtotal display the wrong currency.
 */
export function symbolOf(sample: string | undefined | null): string {
    // Take everything before the first digit: `ل.س` contains a dot, so excluding
    // `.` here truncated the Syrian symbol to `ل` on every recalculated total.
    const match = String(sample ?? "").match(/^[^\d]*/);
    return match ? match[0].trim() : "";
}

export function formatPrice(value: number, sample?: string | null): string {
    return `${symbolOf(sample)}${value.toFixed(2)}`;
}

/**
 * Unit price (`السعر الفردي`) and line total (`الإجمالي`) for a cart line.
 * Callers may pass an already-formatted `price` carrying its currency symbol;
 * otherwise the symbol is derived from it so the line total matches the unit
 * price instead of rendering a bare number such as `12.5`.
 */
export function lineMoney(
    price: string | undefined,
    priceNumeric: number | undefined,
    quantity: number,
): { price: string; subtotal: string } {
    const unit = priceNumeric ?? 0;
    const unitText = price?.trim() ? price : formatPrice(unit, price);
    return {
        price: unitText,
        subtotal: formatPrice(unit * quantity, unitText),
    };
}
