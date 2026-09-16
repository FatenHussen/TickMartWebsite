/** ISO-2 → E.164 prefix when the countries API returns `SY` instead of `+963`. */
const ISO_TO_DIAL: Record<string, string> = {
    SY: "+963",
    LB: "+961",
    JO: "+962",
    IQ: "+964",
    SA: "+966",
    AE: "+971",
    KW: "+965",
    QA: "+974",
    BH: "+973",
    OM: "+968",
    EG: "+20",
    TR: "+90",
};

type CountryLike = {
    id?: number;
    name?: string;
    code?: string | null;
    phone_code?: string | null;
    dial_code?: string | null;
};

export const SYRIA_FALLBACK: CountryLike & { id: number; name: string; code: string } = {
    id: -963,
    name: "Syria",
    code: "+963",
};

/** Dial prefix for a country row (`+963`), never a bare ISO code like `SY`. */
export function getCountryDialCode(country: CountryLike | null | undefined): string {
    if (!country) return "";
    const raw = (country.phone_code || country.dial_code || country.code || "").trim();
    if (!raw) return "";
    if (raw.startsWith("+")) return raw;
    if (/^\d+$/.test(raw)) return `+${raw}`;
    const mapped = ISO_TO_DIAL[raw.toUpperCase()];
    if (mapped) return mapped;
    return `+${raw.replace(/^\+/, "")}`;
}

export function findSyriaCountry<T extends CountryLike>(countries: T[]): T | undefined {
    return countries.find((c) => {
        const dial = getCountryDialCode(c);
        const name = (c.name ?? "").toLowerCase();
        return (
            dial === "+963" ||
            c.code === "SY" ||
            c.code === "+963" ||
            name.includes("syria") ||
            (c.name ?? "").includes("سوريا")
        );
    });
}

/**
 * `0935931471` or `935931471` + `+963` → `963935931471`
 */
export function toInternationalPhone(dialCode: string, localPhone: string): string {
    let local = localPhone.replace(/\D/g, "");
    const country = dialCode.replace(/\D/g, "") || "963";
    if (local.startsWith("0")) local = local.slice(1);
    if (local.startsWith(country)) return local;
    return country + local;
}

/** Formats the backend may have stored for the same Syrian mobile. */
export function phoneLoginVariants(input: string, dialCode = "+963"): string[] {
    const digits = input.replace(/\D/g, "");
    const country = dialCode.replace(/\D/g, "") || "963";
    let national = digits;
    if (national.startsWith(country)) national = national.slice(country.length);
    if (national.startsWith("0")) national = national.slice(1);
    if (!national) return digits ? [digits] : [];

    const withZero = `0${national}`;
    const intl = `${country}${national}`;
    return [...new Set([intl, `+${intl}`, withZero, national, digits])];
}
