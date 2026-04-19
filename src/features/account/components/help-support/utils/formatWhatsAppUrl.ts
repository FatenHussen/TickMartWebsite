export function formatWhatsAppUrl(phone: string): string {
    const digits = phone.replace(/\D/g, "");
    const withCountry = digits.startsWith("0") ? "966" + digits.slice(1) : digits;
    return `https://wa.me/${withCountry}`;
}
