import assert from "node:assert/strict";
import { test } from "node:test";
import {
    CURRENCY_DEFAULT_KEY,
    CURRENCY_PREFERENCE_KEY,
    persistCurrencySelection,
    persistDefaultCurrency,
    readCurrencySelection,
    resetAccountCurrencySelection,
    resolveCurrencySelection,
} from "../src/shared/lib/currencyPreference.ts";

function createStorage(entries = []) {
    const values = new Map(entries);
    return {
        getItem: (key) => values.get(key) ?? null,
        setItem: (key, value) => values.set(key, value),
        removeItem: (key) => values.delete(key),
    };
}

const usdDefault = { code: "USD", symbol: "$", source: "default" };
const sypUser = { code: "SYP", symbol: "ل.س", source: "user" };

test("the old forced Syrian default cannot override the dashboard default", () => {
    const storage = createStorage([
        ["currencyDefaultsVersion", "syp-default-v2"],
        ["currency", "SYP"],
        ["currencySymbol", "ل.س"],
    ]);
    assert.deepEqual(readCurrencySelection(storage), usdDefault);
    assert.deepEqual(resolveCurrencySelection(readCurrencySelection(storage), usdDefault), usdDefault);
});

test("visitors without a preference follow dashboard changes and cache the latest default", () => {
    const storage = createStorage();
    const eurDefault = { code: "EUR", symbol: "€", source: "default" };
    persistDefaultCurrency(storage, eurDefault);
    assert.deepEqual(readCurrencySelection(storage), eurDefault);
    const updated = resolveCurrencySelection(readCurrencySelection(storage), usdDefault);
    persistDefaultCurrency(storage, updated);
    persistCurrencySelection(storage, updated);
    assert.equal(storage.getItem(CURRENCY_PREFERENCE_KEY), null);
    assert.deepEqual(readCurrencySelection(storage), usdDefault);
});

test("a user's currency survives reload and wins over later default or account responses", () => {
    const storage = createStorage();
    persistCurrencySelection(storage, sypUser);
    const restored = readCurrencySelection(storage);
    assert.deepEqual(restored, sypUser);
    assert.deepEqual(resolveCurrencySelection(restored, usdDefault), sypUser);
    assert.deepEqual(resolveCurrencySelection(restored, {
        code: "EUR", symbol: "€", source: "account",
    }), sypUser);
    persistDefaultCurrency(storage, usdDefault);
    assert.deepEqual(readCurrencySelection(storage), sypUser);
});

test("a late default response cannot replace the saved account currency", () => {
    const account = { code: "EUR", symbol: "€", source: "account" };
    assert.deepEqual(resolveCurrencySelection(usdDefault, account), account);
    assert.deepEqual(resolveCurrencySelection(account, usdDefault), account);
    assert.deepEqual(resolveCurrencySelection(account, sypUser), sypUser);
});

test("logout or account switch drops the previous account currency and resumes dashboard defaults", () => {
    const oldAccount = { code: "EUR", symbol: "€", source: "account" };
    const loggedOut = resetAccountCurrencySelection(oldAccount, usdDefault);
    assert.deepEqual(loggedOut, usdDefault);
    const nextDefault = { code: "SAR", symbol: "ر.س", source: "default" };
    assert.deepEqual(resolveCurrencySelection(loggedOut, nextDefault), nextDefault);
    const nextAccount = { code: "SYP", symbol: "ل.س", source: "account" };
    assert.deepEqual(resolveCurrencySelection(loggedOut, nextAccount), nextAccount);
    assert.deepEqual(resetAccountCurrencySelection(sypUser, usdDefault), sypUser);
});

test("malformed cache or denied storage still allows a safe default and currency switching", () => {
    const malformed = createStorage([[CURRENCY_DEFAULT_KEY, "{bad json"]]);
    assert.deepEqual(readCurrencySelection(malformed), usdDefault);
    const denied = {
        getItem() { throw new Error("Storage blocked"); },
        setItem() { throw new Error("Storage blocked"); },
        removeItem() { throw new Error("Storage blocked"); },
    };
    assert.deepEqual(readCurrencySelection(denied), usdDefault);
    assert.doesNotThrow(() => persistCurrencySelection(denied, sypUser));
    assert.doesNotThrow(() => persistDefaultCurrency(denied, usdDefault));
    assert.deepEqual(resolveCurrencySelection(usdDefault, sypUser), sypUser);
});

const SYP = { code: "SYP", symbol: "ل.س" };
const USD = { code: "USD", symbol: "$" };

test("REPORTED BUG: pick USD in settings, close site, reopen -> must stay USD", () => {
    const storage = createStorage();
    // Dashboard default is Syrian pounds.
    persistDefaultCurrency(storage, SYP);

    // User explicitly saves USD in Settings (handleSave -> setCurrency w/o flags).
    let sel = resolveCurrencySelection(
        { ...SYP, source: "default" },
        { ...USD, source: "user" },
    );
    persistCurrencySelection(storage, sel);
    assert.equal(sel.code, "USD");

    // ---- site closed & reopened ----
    let booted = readCurrencySelection(storage);
    assert.equal(booted.code, "USD", "after reload, stored selection must be USD");

    // CurrencyFromApiSync now runs on boot, in its real order:
    // 1) dashboard default arrives
    booted = resolveCurrencySelection(booted, { ...SYP, source: "default" });
    assert.equal(booted.code, "USD", "dashboard default must not override user choice");

    // 2) resetAccountCurrency() fires on auth/user change
    booted = resetAccountCurrencySelection(booted, SYP);
    assert.equal(booted.code, "USD", "account reset must not clear a user choice");

    // 3) account currency (/my-currency) arrives as fromAccount
    booted = resolveCurrencySelection(booted, { ...SYP, source: "account" });
    assert.equal(booted.code, "USD", "account value must not override user choice");
});

test("the persisted flag survives a reload where the account value is written after", () => {
    const storage = createStorage();
    persistDefaultCurrency(storage, SYP);

    // user picks USD
    persistCurrencySelection(storage, { ...USD, source: "user" });
    assert.equal(storage.getItem("currencyPreference"), "user");

    // Now the account sync writes SYP as 'account' into the SAME state and the
    // persist effect runs again. This is what happens on a live reload.
    const afterAccount = resolveCurrencySelection(
        readCurrencySelection(storage),
        { ...SYP, source: "account" },
    );
    persistCurrencySelection(storage, afterAccount);

    assert.equal(
        storage.getItem("currencyPreference"),
        "user",
        "the user flag must not be erased by a later account write",
    );
    assert.equal(readCurrencySelection(storage).code, "USD");
});
