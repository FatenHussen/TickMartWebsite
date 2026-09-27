/**
 * This machine's default locale is ar-SY, so `n.toLocaleString()` emits
 * Arabic-Indic digits. Inside an RTL page those digits reverse (585 → 0.585).
 * Default and Arabic formatting stay on Latin digits, in an LTR isolate,
 * everywhere in the app.
 */
const nativeToLocaleString = Number.prototype.toLocaleString;

function wantsLatinDigits(locales: Intl.LocalesArgument | undefined): boolean {
    if (locales == null) return true;
    const list = Array.isArray(locales) ? locales : [locales];
    return list.some((locale) => String(locale).toLowerCase().startsWith("ar"));
}

Number.prototype.toLocaleString = function (
    locales?: Intl.LocalesArgument,
    options?: Intl.NumberFormatOptions,
): string {
    if (!wantsLatinDigits(locales)) {
        return nativeToLocaleString.call(this, locales, options);
    }
    const formatted = nativeToLocaleString.call(this, "en-US", {
        ...options,
        numberingSystem: "latn",
    });
    return `\u2066${formatted}\u2069`;
};
