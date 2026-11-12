import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { registerHooks } from "node:module";
import { extname, resolve } from "node:path";
import { test } from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

const sourceRoot = fileURLToPath(new URL("../src/", import.meta.url));
registerHooks({
    resolve(specifier, context, nextResolve) {
        let candidate;
        if (specifier.startsWith("@/")) candidate = resolve(sourceRoot, specifier.slice(2));
        else if (specifier.startsWith(".") && context.parentURL?.startsWith(pathToFileURL(sourceRoot).href)) {
            candidate = fileURLToPath(new URL(specifier, context.parentURL));
        }
        if (candidate && !extname(candidate) && existsSync(`${candidate}.ts`)) {
            return { url: pathToFileURL(`${candidate}.ts`).href, shortCircuit: true };
        }
        return nextResolve(specifier, context);
    },
});

const { useVariantSelector } = await import("../src/features/product/hooks/useVariantSelector.ts");
const { requiresVariantSelection, isPurchasableVariant } = await import("../src/features/product/types/productDetails.ts");
const { gallerySrcsForSelection } = await import("../src/features/product/lib/productMedia.ts");

const color = { id: 10, attribute: "Color", type: "color", values: ["Blue", "Black"], options: [
    { id: 101, name: "Blue", hex: "#0000ff" },
    { id: 102, name: "Black", hex: "#000000" },
] };
const size = { id: 11, attribute: "Size", type: "square", values: ["S", "L"], options: [
    { id: 201, name: "S" },
    { id: 202, name: "L" },
] };
function variant(id, attributes = []) {
    return { id, variant_id: id, shop_id: 1, price: 20, price_after_discount: 18, quantity: 4, attributes,
        has_variant_images: true, images: [{ path: `https://example.test/variant-${id}.jpg` }] };
}
const blueSmall = variant(1, [
    { id: 101, attribute: "Color", value: "Blue", type: "color", hex: "#0000ff" },
    { id: 201, attribute: "Size", value: "S", type: "square" },
]);
const blackLarge = variant(2, [
    { id: 102, attribute: "Color", value: "Black", type: "color", hex: "#000000" },
    { id: 202, attribute: "Size", value: "L", type: "square" },
]);
const media = { thumbnail: "https://example.test/thumbnail.jpg", images: [
    { path: "https://example.test/product-1.jpg" },
    { id: null, path: "https://example.test/thumbnail.jpg" },
    { path: "https://example.test/product-2.jpg" },
] };
function initialSelection(overrides = {}) {
    let result;
    function Probe() {
        result = useVariantSelector({ productId: 1, attributesMap: [color, size], shopVariants: [blueSmall, blackLarge],
            defaultImages: media.images, thumbnail: media.thumbnail, basePrice: 15, basePriceAfterDiscount: 14, ...overrides });
        return createElement("span");
    }
    renderToStaticMarkup(createElement(Probe));
    return result;
}

test("a product with options starts without a selected variant or selected attributes", () => {
    const result = initialSelection();
    assert.equal(result.selectedVariant, null);
    assert.equal(result.selectedShopVariantId, null);
    assert.equal(result.isVariantSelected, false);
    assert.equal(result.requiresSelection, true);
    assert.deepEqual(result.selectedAttributes, {});
    assert.deepEqual(result.selectedIds, []);
    assert.ok(result.availableAttributes.every((attribute) => attribute.selectedId === null));
    assert.equal(result.currentPrice, 15);
    assert.equal(result.currentPriceAfterDiscount, 14);
    assert.equal(result.currentQuantity, null);
    assert.deepEqual(result.currentImages, [media.thumbnail, media.images[0].path, media.images[2].path]);
});

test("a single stocked combination still needs an explicit choice", () => {
    const result = initialSelection({ shopVariants: [blueSmall] });
    assert.equal(result.selectedVariant, null);
    assert.equal(result.requiresSelection, true);
    assert.deepEqual(result.availableAttributes.map((attribute) => attribute.selectedId), [null, null]);
});

test("variant attributes missing from attributes_map become unselected picker axes", () => {
    const result = initialSelection({ attributesMap: [] });
    assert.equal(result.selectedVariant, null);
    assert.equal(result.requiresSelection, true);
    assert.deepEqual(result.availableAttributes.map((attribute) => attribute.attribute), ["Color", "Size"]);
    assert.deepEqual(result.availableAttributes.map((attribute) => attribute.options.map((option) => option.id)), [[101, 102], [201, 202]]);
});

test("a simple product automatically resolves its internal cart row", () => {
    const simple = variant(3);
    const result = initialSelection({ attributesMap: [], shopVariants: [simple] });
    assert.equal(result.requiresSelection, false);
    assert.equal(result.selectedVariant.id, 3);
    assert.equal(isPurchasableVariant(result.selectedVariant), true);
});

test("multiple unnamed rows also require an explicit row selection", () => {
    const result = initialSelection({ attributesMap: [], shopVariants: [variant(3), variant(4)] });
    assert.equal(result.requiresSelection, true);
    assert.equal(result.selectedVariant, null);
});

test("selection policy does not depend on which variant is in stock", () => {
    assert.equal(requiresVariantSelection([blueSmall, { ...blackLarge, quantity: 0 }]), true);
    assert.equal(requiresVariantSelection([blueSmall]), true);
    assert.equal(requiresVariantSelection([variant(3)], [color]), true);
    assert.equal(requiresVariantSelection([variant(3)]), false);
    assert.equal(requiresVariantSelection([]), false);
});

test("initial product gallery includes thumbnail first and removes duplicate URLs", () => {
    assert.deepEqual(gallerySrcsForSelection(null, media), [media.thumbnail, media.images[0].path, media.images[2].path]);
});

test("a selected variant shows its own images and inherited variants keep the full product gallery", () => {
    assert.deepEqual(gallerySrcsForSelection(blueSmall, media), [blueSmall.images[0].path]);
    assert.deepEqual(gallerySrcsForSelection({ ...blueSmall, has_variant_images: false }, media),
        [media.thumbnail, media.images[0].path, media.images[2].path]);
    assert.deepEqual(gallerySrcsForSelection({ ...blueSmall, images: [] }, media),
        [media.thumbnail, media.images[0].path, media.images[2].path]);
});
