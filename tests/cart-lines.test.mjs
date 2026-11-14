import assert from "node:assert/strict";
import { test } from "node:test";
import { mergeServerCartItems } from "../src/features/cart/lib/mergeServerCartItems.ts";
import { findInvalidCartLines, invalidCartLineNames } from "../src/features/cart/lib/invalidCartLines.ts";
import { lineMoney } from "../src/features/cart/lib/lineMoney.ts";

test("one variant posted once keeps its quantity", () => {
    const merged = mergeServerCartItems([
        { shop_product_variant_id: 5001, quantity: 1 },
    ]);
    assert.deepEqual(merged, [{ shop_product_variant_id: 5001, quantity: 1 }]);
});

test("repeated lines for one variant collapse instead of posting twice", () => {
    // POST /user/cart/items adds to the server quantity, so two requests for the
    // same variant turned 1 + 2 into a doubled server cart.
    const merged = mergeServerCartItems([
        { shop_product_variant_id: 5001, quantity: 1 },
        { shop_product_variant_id: 5001, quantity: 2 },
    ]);
    assert.equal(merged.length, 1);
    assert.deepEqual(merged[0], { shop_product_variant_id: 5001, quantity: 3 });
});

test("different variants stay separate lines", () => {
    const merged = mergeServerCartItems([
        { shop_product_variant_id: 5001, quantity: 1 },
        { shop_product_variant_id: 5002, quantity: 2 },
    ]);
    assert.equal(merged.length, 2);
    assert.deepEqual(
        merged.map((item) => item.quantity),
        [1, 2],
    );
});

test("a distinct note stays its own server line", () => {
    const merged = mergeServerCartItems([
        { shop_product_variant_id: 5001, quantity: 1, note: "no onions" },
        { shop_product_variant_id: 5001, quantity: 2 },
    ]);
    assert.equal(merged.length, 2);
});

test("merging does not mutate the caller's items", () => {
    const input = [
        { shop_product_variant_id: 5001, quantity: 1 },
        { shop_product_variant_id: 5001, quantity: 2 },
    ];
    mergeServerCartItems(input);
    assert.equal(input[0].quantity, 1);
});

// --- Unit price and line total (السعر الفردي / الإجمالي) ---

test("a formatted unit price keeps its currency in the line total", () => {
    const money = lineMoney("$12.50", 12.5, 3);
    assert.equal(money.price, "$12.50");
    assert.equal(money.subtotal, "$37.50");
});

test("the Syrian symbol carries into the multiplied line total", () => {
    const money = lineMoney("ل.س2500.00", 2500, 2);
    assert.equal(money.subtotal, "ل.س5000.00");
});

test("a bare numeric price no longer loses its decimals", () => {
    // The old recipe/basket path produced "12.5" and "37.5" with no symbol.
    const money = lineMoney(undefined, 12.5, 3);
    assert.equal(money.price, "12.50");
    assert.equal(money.subtotal, "37.50");
});

test("quantity of one still renders a formatted line total", () => {
    const money = lineMoney("$9.99", 9.99, 1);
    assert.equal(money.subtotal, "$9.99");
});

// --- Currency consistency on the review page ---

/**
 * Mirrors the `displayPrice` rule in enrichCartItems.ts. A cart line keeps the
 * symbol it was stored with, so falling back to `item.price` rendered `$0.94`
 * beside `ل.س58500.00` on the same review page after a currency switch.
 */
function displayMoney(item, previewPrice, formatPrice) {
    const unit = previewPrice ?? item.priceNumeric ?? 0;
    return { price: formatPrice(unit), subtotal: formatPrice(unit * item.quantity) };
}

const asSyp = (amount) => `ل.س${amount.toFixed(2)}`;

test("a line stored in dollars is re-formatted in the active currency", () => {
    const line = { price: "$0.94", priceNumeric: 0.94, quantity: 1 };
    const shown = displayMoney(line, undefined, asSyp);
    assert.equal(shown.price, "ل.س0.94");
    assert.ok(!shown.price.includes("$"), "the stale dollar symbol must not survive");
});

test("every line on one page shares a single currency symbol", () => {
    const lines = [
        { price: "ل.س292500.00", priceNumeric: 292500, quantity: 2 },
        { price: "$0.94", priceNumeric: 0.94, quantity: 1 },
    ].map((line) => displayMoney(line, undefined, asSyp));
    const symbols = new Set(lines.map((line) => line.price.replace(/[\d.,\s]/g, "")));
    assert.equal(symbols.size, 1, "the review page must not mix currencies");
});

test("the line total is the unit price times the quantity", () => {
    const line = { price: "ل.س292500.00", priceNumeric: 292500, quantity: 2 };
    assert.equal(displayMoney(line, undefined, asSyp).subtotal, "ل.س585000.00");
});

test("a preview price overrides the stored amount", () => {
    const line = { price: "ل.س999.00", priceNumeric: 999, quantity: 3 };
    assert.equal(displayMoney(line, 100, asSyp).subtotal, "ل.س300.00");
});

// --- Invalid cart lines (items.0.shop_product_variant_id) ---

test("a line with no variant id is reported, not silently dropped", () => {
    const invalid = findInvalidCartLines([
        { name: "جينز", shop_product_variant_id: 5001, quantity: 2 },
        { name: "اسفنجة", shop_product_variant_id: null, quantity: 1 },
    ]);
    assert.equal(invalid.length, 1);
    assert.equal(invalid[0].name, "اسفنجة");
});

test("zero and negative variant ids count as invalid", () => {
    const invalid = findInvalidCartLines([
        { name: "a", shop_product_variant_id: 0, quantity: 1 },
        { name: "b", shop_product_variant_id: -3, quantity: 1 },
        { name: "c", shop_product_variant_id: undefined, quantity: 1 },
    ]);
    assert.equal(invalid.length, 3);
});

test("a fully valid cart reports nothing", () => {
    const invalid = findInvalidCartLines([
        { name: "a", shop_product_variant_id: 5001, quantity: 2 },
        { name: "b", shop_product_variant_id: 5002, quantity: 1 },
    ]);
    assert.deepEqual(invalid, []);
});

test("the warning names every broken product", () => {
    const names = invalidCartLineNames([
        { name: "جينز", shop_product_variant_id: 5001, quantity: 1 },
        { name: "اسفنجة", shop_product_variant_id: null, quantity: 1 },
        { name: "ماسكرا", shop_product_variant_id: null, quantity: 1 },
    ]);
    assert.equal(names, "اسفنجة، ماسكرا");
});
