/** Strip dial prefix so the value fits the address form field (UI already shows +963). */
export function profilePhoneForAddressForm(phone?: string | null): string {
    if (!phone) return "";
    const trimmed = phone.trim();
    if (!trimmed) return "";

    const digits = trimmed.replace(/\D/g, "");
    if (digits.startsWith("963") && digits.length > 9) {
        return digits.slice(3);
    }

    return trimmed.replace(/^\+/, "");
}
