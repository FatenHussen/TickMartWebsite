import assert from "node:assert/strict";
import { test } from "node:test";
import { mergeServerCartItems } from "../src/features/cart/lib/mergeServerCartItems.ts";
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
