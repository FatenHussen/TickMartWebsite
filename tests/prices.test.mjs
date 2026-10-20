import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { registerHooks } from "node:module";
import { extname, resolve } from "node:path";
import { test } from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import i18next from "i18next";
import { I18nextProvider } from "react-i18next";
import ts from "typescript";

const sourceRoot = fileURLToPath(new URL("../src/", import.meta.url));

// Run the app's real modules with Node's test runner, without a separate build.
// Node strips .ts types natively; only JSX needs the installed TS compiler.
registerHooks({
    resolve(specifier, context, nextResolve) {
        let candidate;
        if (specifier.startsWith("@/")) {
            candidate = resolve(sourceRoot, specifier.slice(2));
        } else if (
            specifier.startsWith(".") &&
            context.parentURL?.startsWith(pathToFileURL(sourceRoot).href)
        ) {
            candidate = fileURLToPath(new URL(specifier, context.parentURL));
        }
        if (candidate && !extname(candidate)) {
            const resolved = [
                `${candidate}.ts`,
                `${candidate}.tsx`,
                resolve(candidate, "index.ts"),
                resolve(candidate, "index.tsx"),
            ].find(existsSync);
            if (resolved) {
                return { url: pathToFileURL(resolved).href, shortCircuit: true };
            }
        }
        return nextResolve(specifier, context);
    },
    load(url, context, nextLoad) {
        if (url.endsWith(".tsx")) {
            const result = ts.transpileModule(readFileSync(new URL(url), "utf8"), {
                compilerOptions: {
                    target: ts.ScriptTarget.ES2022,
                    module: ts.ModuleKind.ESNext,
                    jsx: ts.JsxEmit.ReactJSX,
                },
                fileName: fileURLToPath(url),
            });
            return { format: "module", source: result.outputText, shortCircuit: true };
        }
        return nextLoad(url, context);
    },
});

const {
    formatDualCurrencies,
    formatMoneyAmount,
    parsePriceParts,
    pickCurrencyFormatted,
    presentMoney,
    resolveDisplayListPrice,
    resolveDisplaySalePrice,
    resolveListingCardPrices,
    roundFormattedMoneyText,
    toLatinNumberText,
} = await import("../src/shared/lib/formatApiPrice.ts");
const { default: FormattedPrice } = await import("../src/shared/component/FormattedPrice.tsx");
const { CurrencyProvider, useCurrency } = await import("../src/context/CurrencyContext.tsx");

function assertMoney(actual, amount, currency) {
    const parts = parsePriceParts(actual);
    assert.equal(parts.kind, "parts", `Expected labelled money, received ${JSON.stringify(actual)}`);
    assert.equal(parts.amount, amount);
    if (currency === "SYP") assert.match(parts.symbol, /^(?:SYP|ل\.س)$/);
    else assert.equal(parts.symbol, currency === "USD" ? "$" : currency);
}

function visibleText(markup) {
    return toLatinNumberText(markup.replace(/<[^>]*>/g, ""));
}

const languages = new Map();
for (const language of ["ar", "en"]) {
    const instance = i18next.createInstance();
    await instance.init({
        lng: language,
        fallbackLng: language,
        resources: { [language]: { translation: {} } },
        initImmediate: false,
        interpolation: { escapeValue: false },
        react: { useSuspense: false },
    });
    languages.set(language, instance);
}

function renderInSyrianCurrency(element, language = "ar") {
    return visibleText(renderToStaticMarkup(
        createElement(I18nextProvider, { i18n: languages.get(language) },
            createElement(CurrencyProvider, null, element),
        ),
    ));
}

test("numeric dollar prices retain cents; only Syrian prices use whole rounding", () => {
    assert.equal(formatMoneyAmount(11.7), "11.7");
    assert.equal(formatMoneyAmount(11.7, "USD"), "11.7");
    assert.equal(formatMoneyAmount(198.9, "SYP"), "199");
    assert.equal(formatMoneyAmount(35.1, "SYP"), "35");
    assert.equal(formatMoneyAmount(35.5, "SYR"), "36");
    assert.equal(formatMoneyAmount(11.7, "EUR"), "11.7");
    assert.equal(formatMoneyAmount(0.45, "USD"), "0.45");
    assert.equal(formatMoneyAmount(0.45, "SYP"), "0.45");
});

test("formatted dollars keep API cents, including trailing zeroes", () => {
    assert.equal(roundFormattedMoneyText("$11.70"), "$11.70");
    assert.equal(roundFormattedMoneyText("11.70 USD"), "11.70 USD");
    assert.equal(roundFormattedMoneyText("ل.س 198.90"), "ل.س 199");
    assert.equal(roundFormattedMoneyText("35.10 SYP"), "35 SYP");
    assert.equal(roundFormattedMoneyText("198.90", "SYP"), "199");
    assert.equal(roundFormattedMoneyText("198.90"), "198.90");
});

test("explicit currency wins over a selected Syrian currency", () => {
    for (const price of ["$11.70", "$ 11.70", "11.70 USD", "€11.70", "¥11.70", "₹11.70", "₺11.70", "₩11.70", "11.70 ر.س"]) {
        assert.equal(roundFormattedMoneyText(price, "SYP"), price);
    }
    assert.equal(roundFormattedMoneyText("ل.س 198.90", "USD"), "ل.س 199");
    assert.equal(
        roundFormattedMoneyText("$11.70 / ل.س 198.90", "SYP"),
        "$11.70 / ل.س 199",
    );
});

test("Arabic price digits are normalized before applying Syrian rounding", () => {
    assert.equal(roundFormattedMoneyText("ل.س ١٩٨٫٩٠"), "ل.س 199");
    assert.equal(roundFormattedMoneyText("ل.س ٣٥٫١٠"), "ل.س 35");
    assertMoney(presentMoney("ل.س ١٩٨٫٩٠", "ar"), "199", "SYP");
    assertMoney(presentMoney("$11.70", "ar"), "11.70", "USD");
});

test("currency maps use the actual entry's currency and label amount-only prices", () => {
    const amounts = {
        USD: { amount: 11.7 },
        SYP: { amount: 198.9 },
    };
    assertMoney(pickCurrencyFormatted(amounts, "USD"), "11.7", "USD");
    assertMoney(pickCurrencyFormatted(amounts, "SYP"), "199", "SYP");
    assertMoney(pickCurrencyFormatted({ SYR: { amount: 198.9 } }, "SYP"), "199", "SYP");
    assert.equal(
        pickCurrencyFormatted({ USD: { formatted: "$11.70" } }, "SYP"),
        "$11.70",
    );
    assertMoney(pickCurrencyFormatted({ USD: { amount: 11.7 } }, "SYP"), "11.7", "USD");
});

test("dual currency output preserves dollars and rounds only Syrian pounds", () => {
    assert.equal(formatDualCurrencies({
        USD: { formatted: "$11.70" },
        SYP: { formatted: "ل.س 198.90" },
    }), "$11.70 / ل.س 199");
});

test("sale and list prices preserve USD cents in formatted and numeric fallbacks", () => {
    const formatted = {
        price: 13,
        price_after_discount: 11.7,
        price_formatted: "$13.00",
        price_after_discount_formatted: "$11.70",
        currency_symbol: "$",
    };
    assert.equal(resolveDisplaySalePrice(formatted, "USD"), "$11.70");
    assert.equal(resolveDisplayListPrice(formatted, "USD"), "$13.00");
    assertMoney(resolveDisplaySalePrice({ price: 11.7, currency_symbol: "$" }, "USD"), "11.7", "USD");
    assertMoney(resolveDisplaySalePrice({ price: 198.9, currency_symbol: "ل.س" }, "SYP"), "199", "SYP");
    assertMoney(resolveDisplaySalePrice({ price: 11.7, currency: "USD" }, "SYP"), "11.7", "USD");
    assertMoney(resolveDisplaySalePrice({ price: 11.7, currency: "USD", currency_symbol: "ل.س" }, "SYP"), "11.7", "USD");
    assert.equal(resolveDisplaySalePrice({ price_currencies: {
        USD: { formatted: "$11.70", amount: 11.7 },
    } }, "SYP"), "$11.70");
});

test("savings remain exact while Syrian sale and list prices are rounded", () => {
    const source = {
        price: 13,
        price_after_discount: 11.7,
        price_currencies: {
            USD: { formatted: "$13.00", amount: 13 },
            SYP: { formatted: "ل.س 260.80", amount: 260.8 },
        },
        price_after_discount_currencies: {
            USD: { formatted: "$11.70", amount: 11.7 },
            SYP: { formatted: "ل.س 234.72", amount: 234.72 },
        },
        amount_saved_currencies: {
            USD: { formatted: "$1.30", amount: 1.3 },
            SYP: { formatted: "ل.س 26.08", amount: 26.08 },
        },
    };
    const syrian = resolveListingCardPrices(source, "You saved", "SYP");
    assertMoney(syrian.price, "235", "SYP");
    assertMoney(syrian.originalPrice, "261", "SYP");
    assert.equal(syrian.savings, "You saved ل.س 26.08");
    const dollar = resolveListingCardPrices(source, "You saved", "USD");
    assert.equal(dollar.price, "$11.70");
    assert.equal(dollar.originalPrice, "$13.00");
    assert.equal(dollar.savings, "You saved $1.30");
    assertMoney(pickCurrencyFormatted({ SYP: { amount: 26.08 } }, "SYP", { roundWhole: false }), "26.08", "SYP");
});

for (const language of ["ar", "en"]) {
    test(`FormattedPrice renders USD cents unchanged in a Syrian context (${language})`, () => {
        const actual = renderInSyrianCurrency(createElement(FormattedPrice, { value: "$11.70" }), language);
        assert.equal(actual, language === "ar" ? "11.70$" : "$11.70");
    });

    test(`FormattedPrice rounds Syrian amounts and preserves exact savings (${language})`, () => {
        const rounded = renderInSyrianCurrency(createElement(FormattedPrice, { value: "ل.س ١٩٨٫٩٠" }), language);
        assert.equal(rounded, language === "ar" ? "199ل.س" : "SYP199");
        const exact = renderInSyrianCurrency(createElement(FormattedPrice, { value: "ل.س 198.90", exact: true }), language);
        assert.equal(exact, language === "ar" ? "198.90ل.س" : "SYP198.90");
    });
}

test("CurrencyProvider passes its Syrian currency into numeric formatting", () => {
    function NumericPrice() {
        const { formatPrice } = useCurrency();
        return createElement("span", null, formatPrice(198.9));
    }
    assertMoney(renderInSyrianCurrency(createElement(NumericPrice)), "199", "SYP");
});

test("CurrencyProvider keeps numeric dollar cents for a saved USD selection", () => {
    const previousWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
    const previousStorage = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
    const stored = new Map([
        ["currencyDefaultsVersion", "syp-default-v2"],
        ["currency", "USD"],
        ["currencySymbol", "$"],
    ]);
    Object.defineProperty(globalThis, "window", { configurable: true, value: {} });
    Object.defineProperty(globalThis, "localStorage", {
        configurable: true,
        value: { getItem: (key) => stored.get(key) ?? null },
    });
    try {
        function NumericPrice() {
            const { formatPrice } = useCurrency();
            return createElement("span", null, formatPrice(11.7));
        }
        assertMoney(renderInSyrianCurrency(createElement(NumericPrice)), "11.7", "USD");
    } finally {
        if (previousWindow) Object.defineProperty(globalThis, "window", previousWindow);
        else delete globalThis.window;
        if (previousStorage) Object.defineProperty(globalThis, "localStorage", previousStorage);
        else delete globalThis.localStorage;
    }
});
