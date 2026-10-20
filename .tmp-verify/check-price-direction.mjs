import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { registerHooks } from "node:module";
import { dirname, extname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import i18next from "i18next";
import { I18nextProvider } from "react-i18next";
import { chromium } from "playwright";
import ts from "typescript";

// Temporary visual verification: render the real application components and CSS.
// Run only with permission to launch headless Chrome.
const fixtureDir = dirname(fileURLToPath(import.meta.url));
const workspace = resolve(fixtureDir, "..");
const sourceRoot = resolve(workspace, "src");
const sourceUrl = pathToFileURL(`${sourceRoot}/`).href;

registerHooks({
    resolve(specifier, context, nextResolve) {
        let candidate;
        if (specifier.startsWith("@/")) {
            candidate = resolve(sourceRoot, specifier.slice(2));
        } else if (specifier.startsWith(".") && context.parentURL?.startsWith(sourceUrl)) {
            candidate = fileURLToPath(new URL(specifier, context.parentURL));
        }
        if (candidate && !extname(candidate)) {
            const found = [
                `${candidate}.ts`, `${candidate}.tsx`,
                resolve(candidate, "index.ts"), resolve(candidate, "index.tsx"),
            ].find(existsSync);
            if (found) return { url: pathToFileURL(found).href, shortCircuit: true };
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

const { default: FormattedPrice } = await import("../src/shared/component/FormattedPrice.tsx");
const { default: PriceBlock } = await import("../src/shared/component/PriceBlock.tsx");
const assets = resolve(workspace, "dist/assets");
const cssFile = readdirSync(assets)
    .filter((name) => name.endsWith(".css"))
    .map((name) => resolve(assets, name))
    .sort((a, b) => statSync(b).mtimeMs - statSync(a).mtimeMs)[0];
assert.ok(cssFile, "Build the app before browser verification so current CSS is available");
const css = readFileSync(cssFile, "utf8");
const expectations = [];
const sections = [];

for (const language of ["en", "ar"]) {
    const i18n = i18next.createInstance();
    await i18n.init({
        lng: language,
        fallbackLng: language,
        resources: { [language]: { translation: {} } },
        initImmediate: false,
        interpolation: { escapeValue: false },
        react: { useSuspense: false },
    });
    const unit = language === "ar" ? "ل.س" : "SYP";
    const cases = [
        {
            key: "syp", label: "SYP card price",
            component: createElement(PriceBlock, {
                price: "ل.س 22,100", originalPrice: "ل.س 26,000",
                savings: `${language === "ar" ? "وفرت" : "You saved"} ل.س 3,900`,
            }),
            glyphs: [{ amount: "22,100", symbol: unit, prefix: false }],
            requiredText: ["26,000", "3,900"],
        },
        {
            key: "usd", label: "USD card price and preserved cents",
            component: createElement(PriceBlock, {
                price: "$11.70", originalPrice: "$13.00",
                savings: `${language === "ar" ? "وفرت" : "You saved"} $1.30`,
            }),
            glyphs: [{ amount: "11.70", symbol: "$", prefix: true }],
            requiredText: ["13.00", "1.30"],
        },
        {
            key: "syp-rounded", label: "SYP whole rounding",
            component: createElement(FormattedPrice, {
                value: "ل.س 198.90", prominent: true, className: "text-3xl",
            }),
            glyphs: [{ amount: "199", symbol: unit, prefix: false }],
        },
        {
            key: "syp-exact", label: "SYP exact amount",
            component: createElement(FormattedPrice, {
                value: "ل.س 198.90", exact: true, className: "text-3xl",
            }),
            glyphs: [{ amount: "198.90", symbol: unit, prefix: false }],
        },
        {
            key: "syp-compared", label: "SYP sale and original pair",
            component: createElement(FormattedPrice, {
                value: "ل.س 22,100", compareValue: "ل.س 26,000",
                prominent: true, className: "text-3xl",
            }),
            glyphs: [
                { amount: "22,100", symbol: unit, prefix: false },
                { amount: "26,000", symbol: unit, prefix: false },
            ],
        },
        {
            key: "usd-compared", label: "USD sale and original pair",
            component: createElement(FormattedPrice, {
                value: "$11.70", compareValue: "$13.00",
                prominent: true, className: "text-3xl",
            }),
            glyphs: [
                { amount: "11.70", symbol: "$", prefix: true },
                { amount: "13.00", symbol: "$", prefix: true },
            ],
        },
    ];
    const cards = cases.map(({ key, label, component, glyphs, requiredText = [] }) => {
        const id = `${language}-${key}`;
        expectations.push({ id, glyphs, requiredText });
        return createElement("article", {
            key: id, "data-case": id, className: "verification-card",
            dir: language === "ar" ? "rtl" : "ltr",
        }, createElement("p", { className: "case-label", dir: "ltr" }, `${language}: ${label}`), component);
    });
    sections.push(renderToStaticMarkup(createElement(I18nextProvider, { i18n },
        createElement("section", null,
            createElement("h2", null, language === "ar" ? "Arabic / RTL" : "English / LTR"),
            createElement("div", { className: "verification-grid" }, cards),
        ),
    )));
}

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Currency direction verification</title><style>${css}</style><style>
body { margin: 0; padding: 22px; background: #faf8f4; color: #171717; font-family: Arial, sans-serif; }
h1 { font-size: 23px; font-weight: bold; margin: 0 0 18px; }
h2 { font-size: 18px; font-weight: bold; margin: 22px 0 12px; }
.verification-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 14px; }
.verification-card { min-width: 0; padding: 20px 16px; border: 1px solid #e4dfd7; border-radius: 18px; background: #f4eee3; min-height: 125px; }
.case-label { font-size: 11px; color: #69635a; margin: 0 0 22px; }
</style></head><body><h1>Actual FormattedPrice and PriceBlock components</h1>${sections.join("")}</body></html>`;
writeFileSync(resolve(fixtureDir, "price-direction.html"), html);

// Explicit executable path uses installed Chrome; no browser download needed.
const browser = await chromium.launch({
    executablePath: process.env.CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe",
    headless: true,
    args: ["--disable-gpu"],
});
const reports = [];
try {
    const context = await browser.newContext({ offline: true, deviceScaleFactor: 1 });
    await context.route("**/*", (route) => route.abort());
    const page = await context.newPage();
    for (const width of [1000, 375]) {
        await page.setViewportSize({ width, height: 900 });
        await page.setContent(html, { waitUntil: "domcontentloaded" });
        const actual = await page.evaluate(() => Array.from(document.querySelectorAll("[data-case]"), (card) => {
            const glyphs = Array.from(card.querySelectorAll("span[dir='ltr']"))
                .filter((node) => node.children.length === 2
                    && Array.from(node.children).every((child) => child.tagName === "SPAN" && child.children.length === 0))
                .map((node) => {
                    const children = Array.from(node.children);
                    const amount = children.find((child) => /^\d[\d,.]*$/.test(child.textContent));
                    const symbol = children.find((child) => child !== amount);
                    const moneyRect = node.getBoundingClientRect();
                    const amountRect = amount?.getBoundingClientRect();
                    const symbolRect = symbol?.getBoundingClientRect();
                    return {
                        amount: amount?.textContent, symbol: symbol?.textContent,
                        amountLeft: amountRect?.left, amountRight: amountRect?.right,
                        symbolLeft: symbolRect?.left, symbolRight: symbolRect?.right,
                        direction: getComputedStyle(node).direction,
                        display: getComputedStyle(node).display,
                        columnGap: getComputedStyle(node).columnGap,
                        width: moneyRect.width,
                    };
                });
            return { id: card.dataset.case, text: card.textContent, glyphs };
        }));
        assert.equal(actual.length, expectations.length);
        let checkedGlyphs = 0;
        for (const expected of expectations) {
            const result = actual.find((item) => item.id === expected.id);
            assert.ok(result, `${width}px: missing ${expected.id}`);
            assert.equal(result.glyphs.length, expected.glyphs.length, `${width}px ${expected.id}: glyph count`);
            for (let i = 0; i < expected.glyphs.length; i++) {
                const wanted = expected.glyphs[i];
                const glyph = result.glyphs[i];
                const label = `${width}px ${expected.id} ${wanted.amount} ${wanted.symbol}`;
                assert.equal(glyph.amount, wanted.amount, `${label}: amount`);
                assert.equal(glyph.symbol, wanted.symbol, `${label}: currency`);
                assert.equal(glyph.direction, "ltr", `${label}: isolated direction`);
                assert.ok(["flex", "inline-flex"].includes(glyph.display), `${label}: application CSS applied`);
                const gap = wanted.prefix
                    ? glyph.amountLeft - glyph.symbolRight
                    : glyph.symbolLeft - glyph.amountRight;
                assert.ok(gap > 0.5, `${label}: expected currency ${wanted.prefix ? "before" : "after"} amount with a visible gap; got ${gap}`);
                assert.ok(glyph.width > 0, `${label}: visible price`);
                checkedGlyphs++;
            }
            for (const text of expected.requiredText) {
                assert.ok(result.text.includes(text), `${width}px ${expected.id}: missing exact amount ${text}`);
            }
        }
        const screenshot = width === 1000 ? "price-direction.png" : "price-direction-mobile.png";
        await page.screenshot({ path: resolve(fixtureDir, screenshot), fullPage: true });
        reports.push({ viewport: width, cards: actual.length, glyphs: checkedGlyphs, screenshot });
    }
    await context.close();
} finally {
    await browser.close();
}
console.log(JSON.stringify({ css: cssFile, fixture: "price-direction.html", verified: reports }, null, 2));
