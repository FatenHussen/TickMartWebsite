# Product Variants and Default Currency — Engineering Handoff

- **Project:** Tikmool storefront
- **Date:** 2026-11-12
- **Audience:** Backend, dashboard, storefront, and QA engineers

## 1. Objective and delivery status

Prevent customers from purchasing an unintended product variant, and make the dashboard's configured currency the initial display currency for customers without an explicit preference.

| Area | Status | Next action |
| --- | --- | --- |
| Storefront variant selection and media | Implemented locally | Review and verify against the staging API |
| Storefront currency bootstrap and browser preference | Implemented locally | Verify dashboard and account-currency contracts |
| Backend and dashboard | Contract requirements documented; implementation unverified | Inspect existing behavior and implement any gaps |
| Account preference provenance | Requires contract confirmation | Resolve the distinction described in section 4.2 |
| Production release | Pending | Deploy after integration acceptance |

This handoff describes the current storefront source checkout. Backend source and production API behavior were not verified during this change. Example payloads below describe relevant contract fields; existing unrelated fields remain supported.

## 2. Required customer experience

### 2.1 Product variants

1. A product with choices opens with every required option unselected. This applies even when only one combination is available or in stock.
2. The initial gallery shows the product thumbnail followed by product images, with duplicate URLs removed.
3. Selecting one attribute, such as color, leaves other attributes, such as size, unselected.
4. Pressing **Add to Cart** before completing selection shows the selection reminder and leaves both the local cart and server cart unchanged.
5. Completing a valid combination resolves its exact shop variant. Its images, price, stock, and purchase identity are then used.
6. Changing an attribute preserves compatible explicit choices. Incompatible choices are cleared for the customer to select again.
7. Navigating to another product resets selection.
8. A simple product with one internal shop row and no attribute choices remains directly addable. Its internal variant ID is still required in purchase requests.

Arabic reminder:

> يرجى اختيار متغيرات المنتج قبل إضافته إلى السلة

English reminder:

> Please select the product options before adding it to your cart.

Products with no purchasable stock continue to show their unavailable state. A selection reminder must not imply that unavailable stock can be purchased.

### 2.2 Display currency

The implemented storefront resolves currency in this priority order:

1. An explicit browser preference chosen by the customer.
2. The authenticated account currency returned by the API.
3. The current dashboard default from the currencies API.
4. The most recently cached dashboard default when the API is unavailable.
5. USD as the final offline/bootstrap fallback.

An explicit browser preference survives reloads, later default responses, and account transitions. Currency originating only from a previous account is reset on logout or account switch.

**Required integration outcome:** an inherited account default must not silently override the dashboard default as though it were an explicit customer choice. Section 4.2 identifies the remaining contract decision.

## 3. Ownership and implementation work

| Responsibility | Backend / dashboard | Website |
| --- | --- | --- |
| Configure the default currency | Persist one active default atomically | Read `is_default` from the API |
| Remember an explicit account preference | Persist the selected `currency_id` | Save through the existing account settings endpoint |
| Remember an explicit browser preference | — | Persist the choice with an explicit-preference marker |
| Define purchasable combinations | Return stable attribute-value IDs and shop variant IDs | Track explicit choices and resolve a complete combination |
| Provide product and variant media | Return separate media and ownership metadata | Show base media initially and selected variant media afterward |
| Validate purchase requests | Validate variant identity, availability, quantity, and authoritative prices | Validate selection before local mutation or HTTP submission |
| Confirm release readiness | Verify API and dashboard behavior in staging | Run storefront tests and joint integration scenarios |

### Backend / dashboard checklist

- [ ] Confirm the currencies list is readable by guests.
- [ ] Guarantee exactly one active currency has `is_default: true` across the complete result set.
- [ ] Change the default in one transaction and invalidate affected API caches.
- [ ] Confirm account currency represents an explicit preference or provide preference provenance as described below.
- [ ] Keep product media independent from the first variant's media.
- [ ] Return consistent attribute option IDs and variant attribute-value IDs.
- [ ] Reject missing or invalid shop variant IDs without substituting a first/default variant.
- [ ] Revalidate stock, purchase limits, and prices on cart and order operations.
- [ ] Add backend regression coverage and verify the joint acceptance matrix.

### Website work already implemented

- Explicit selection state for each attribute, including incomplete combinations.
- Selection reset when the product changes.
- Derivation of missing picker axes from variant attributes, with selectable variant rows when individual axes cannot be rendered.
- Selection reminders on desktop, mobile, quick view, custom basket, and scheduled basket product-add flows.
- Thumbnail and product gallery before selection; selected variant media after selection.
- Dashboard currency bootstrap across all advertised currency-list pages.
- Explicit browser preference persistence and removal of the old forced-SYP initialization.
- Account-scoped currency queries and reset of account-derived currency on identity changes.

## 4. API contracts

Paths below are relative to the configured API base URL. The storefront route definitions are in [`src/utils/apiRoutes.ts`](src/utils/apiRoutes.ts).

### 4.1 Currency list

```http
GET /user/currencies?page=1
```

```json
{
  "status": true,
  "message": "",
  "data": {
    "items": [
      { "id": 1, "code": "USD", "name": "US Dollar", "symbol": "$", "is_default": true },
      { "id": 2, "code": "SYP", "name": "Syrian Pound", "symbol": "ل.س", "is_default": false }
    ],
    "pagination": {
      "current_page": 1,
      "last_page": 1,
      "per_page": 20,
      "total": 2
    }
  }
}
```

Contract requirements:

- `is_default` is a JSON boolean, not a string containing `"0"` or `"false"`.
- Exactly one active default exists across all pages. The default may appear on a later page.
- `pagination` may be `null` for an unpaginated response; otherwise `current_page` and `last_page` must be accurate.
- Currency IDs are stable and codes use a consistent uppercase representation.
- A dashboard change must be reflected in subsequent fresh API reads.

The current website reads all advertised pages and selects the first default it finds. It relies on the backend to enforce uniqueness and active status. Its currency-list query has a 10-minute stale time; this change does not introduce a push channel for dashboard updates to already-open sessions.

### 4.2 Account currency and explicit preference

Existing endpoints:

```http
GET /user/currencies/my-currency
Authorization: Bearer <token>
```

```http
POST /user/currencies/update-currency
Authorization: Bearer <token>
Content-Type: application/json

{ "currency_id": 2 }
```

The update endpoint must validate that the currency exists and is active, then persist the authenticated customer's explicit choice. Updating the global default must preserve explicit customer preferences.

**Contract gap to resolve before release:** the current account-currency response type contains a currency object without preference provenance. The website treats any returned account currency as a saved preference. If an account was automatically assigned SYP at registration, the website cannot determine whether the customer selected it.

Recommended contract extension, pending implementation and agreement:

```json
{
  "status": true,
  "message": "",
  "data": {
    "id": 1,
    "code": "USD",
    "name": "US Dollar",
    "symbol": "$",
    "exchange_rate": "1.000000",
    "is_default": true,
    "is_active": true,
    "preference_source": "default"
  }
}
```

- `preference_source: "user"` identifies a deliberately saved account preference.
- `preference_source: "default"` identifies a dynamically resolved dashboard default for an account without an explicit choice.
- The backend should retain an unset preference as unset and resolve it from the current default on read.
- The website must extend `MyCurrencyData` and `CurrencyFromApiSync` to apply account precedence only to `"user"` once this extension is adopted. The current implementation does not consume `preference_source`.
- Existing account data requires an evidence-based migration policy. A stored SYP value alone cannot establish whether the customer deliberately chose it.

If backend inspection confirms the existing endpoint already returns only genuine saved preferences, document that guarantee and validate it with an account that has never chosen a currency.

### 4.3 Product details and media

```http
GET /user/products/{productId}?lat={lat}&lng={lng}
Accept-Language: ar
```

Relevant response fields:

```json
{
  "status": true,
  "message": "",
  "data": {
    "id": 901,
    "thumbnail": "https://example.com/storage/products/901/thumbnail.jpg",
    "images": [
      { "id": 11, "path": "https://example.com/storage/products/901/front.jpg" }
    ],
    "attributes_map": [
      { "id": 10, "attribute": "Color", "type": "color", "values": ["Blue"], "options": [{ "id": 101, "name": "Blue", "hex": "#0000FF" }] },
      { "id": 20, "attribute": "Size", "type": "square", "values": ["M"], "options": [{ "id": 201, "name": "M" }] }
    ],
    "shop_variants": [
      {
        "id": 5001,
        "variant_id": 7001,
        "shop_id": 12,
        "quantity": 8,
        "price": 20,
        "price_after_discount": 18,
        "currency": "USD",
        "currency_symbol": "$",
        "attributes": [
          { "id": 101, "attribute": "Color", "value": "Blue", "type": "color", "hex": "#0000FF" },
          { "id": 201, "attribute": "Size", "value": "M", "type": "square" }
        ],
        "has_variant_images": true,
        "images": [{ "id": 21, "path": "https://example.com/storage/products/901/blue.jpg" }]
      }
    ]
  }
}
```

Contract requirements:

- Cart identity is `shop_variants[].id`. `variant_id` and `product.id` are distinct identifiers and cannot replace it.
- `attributes_map[].options[].id` matches `shop_variants[].attributes[].id`. Renaming a label must preserve its ID.
- Image objects use `path`; the storefront expects usable URLs and preserves absolute URLs as returned.
- `has_variant_images: true` indicates variant-owned media. `false` indicates inherited product media. Send the flag explicitly; the website retains legacy support for omitted flags.
- A variant without usable own images falls back to product media.
- A row with `id: null`, `shop_id: null`, or nonpositive/null stock is display-only or unavailable.
- Product-level quantity is not a substitute for selected-variant stock.
- Product-level images must remain the product gallery even when variant-specific photos exist.

### 4.4 Cart and order validation

The existing cart-item write sends one item per request:

```http
POST /user/cart/items
Authorization: Bearer <token>
Content-Type: application/json

{
  "shop_product_variant_id": 5001,
  "quantity": 2
}
```

Backend validation must:

1. Require a valid `shop_product_variant_id` and a positive integer quantity.
2. Resolve the exact shop offer and validate its active/sellable state and customer availability.
3. Enforce current stock and purchase limits against the resulting line quantity.
4. Calculate prices, discounts, and totals from authoritative server data.
5. Return a structured validation error for missing identity or invalid selection; never infer the first variant from the product.
6. Apply equivalent validation to order preview, order creation, and basket product-add operations. Checkout must revalidate inventory even if an earlier cart write succeeded.

Use the backend's established validation-error envelope. A missing/invalid variant is expected to produce a validation response, typically HTTP 422; confirm the existing contract during integration.

Guest cart lines are currently kept locally and synchronized after login through best-effort item writes. This implementation does not establish server-acknowledged cart persistence or transactional synchronization. The selection guard runs before local cart mutation, which is the relevant guarantee for this change.

Current transport boundary: cart quantity changes, removal, and clearing remain local. `GET /user/cart` supplies checkout metadata rather than hydrating storefront cart lines. Best-effort item writes carry variant, quantity, and optional note; extras are sent through order preview and creation. Complete server-cart reconciliation requires a separate implementation task.

### 4.5 Monetary values

- Prefer API-provided `price_currencies`, `price_after_discount_currencies`, and corresponding formatted values for display.
- Amount and currency must agree. Changing a symbol alone does not convert an amount.
- The website performs no local foreign-exchange calculation for product prices.
- Keep existing base-price semantics for purchase calculations; order preview and creation remain server authoritative.
- Confirm both USD and SYP display values against staging responses. The frontend fixtures do not validate real exchange rates.

## 5. Joint acceptance matrix

| ID | Scenario | Expected result |
| --- | --- | --- |
| V-01 | Open a product with color and size | Both axes unselected; base thumbnail and gallery visible |
| V-02 | Press Add before making a choice | Reminder appears; no cart mutation or cart write |
| V-03 | Select only color, then press Add | Size stays unselected; reminder appears; no item added |
| V-04 | Complete a valid combination and add | Exact selected shop variant ID, image, and quantity are used |
| V-05 | Product has one stocked combination | Explicit choice remains required |
| V-06 | Switch to a color incompatible with the selected size | Size clears; no replacement size is chosen automatically |
| V-07 | Switch to a compatible color | Previously chosen size is retained |
| V-08 | Open a simple product without attribute choices | Its internal shop row is usable without an extra picker step |
| V-09 | Selected row has zero/null stock or null purchase identity | Purchase is blocked |
| V-10 | Navigate to another product | Previous choices are cleared |
| V-11 | API omits the attribute map but returns variant attributes | Available attributes are derived; no initial selection |
| V-12 | Exercise quick view and both basket product-add dialogs | Same explicit-choice rule applies |
| C-01 | Clean guest browser; dashboard default USD | Initial display uses USD |
| C-02 | Browser contains old unmarked SYP storage | Current dashboard default takes precedence |
| C-03 | Customer selects SYP, then reloads | Explicit SYP preference remains |
| C-04 | Default changes while customer has an explicit preference | Customer preference remains |
| C-05 | Account has never chosen a currency | Current dashboard default is used; verify account provenance |
| C-06 | Account has a genuine saved preference | Saved account preference applies unless an explicit browser choice exists |
| C-07 | Logout or switch accounts | Previous account-derived currency is cleared; explicit browser preference remains |
| C-08 | Default currency appears on a later API page | Default is still found |
| C-09 | API is unavailable | Explicit preference or cached default remains usable; USD is the final fallback |
| C-10 | Inspect displayed USD and SYP prices | Symbols and amounts match API money data |

Run applicable scenarios on desktop and mobile. Backend integration checks must use real staging responses and deliberate invalid requests, including direct requests that bypass the website.

## 6. Verification already completed

| Check | Result | Evidence boundary |
| --- | --- | --- |
| `npm.cmd test` | 28 tests passed | Automated frontend price, currency-policy, variant-initialization, and media regressions |
| `npm.cmd run build` | Passed | TypeScript and production bundling; existing bundle-size/import warnings remain |
| Browser: variant hook transitions | Passed | Initial, partial, complete, compatible/incompatible changes, product reset, and simple-product behavior |
| Browser: desktop/mobile product pages | Passed | Incomplete selection showed the reminder; completed selection added the correct ID and image |
| Browser: currency bootstrap and account transitions | Passed | Legacy storage, explicit choice, reload, default refetch, logout, and account switch |

Browser checks used intercepted local fixtures and made no remote writes. These results do not verify backend validation, production schema compatibility, dashboard persistence, actual exchange rates, or deployment. Quick-view and basket dialogs have code changes; their full integration scenarios remain in V-12.

## 7. Implementation references

| Concern | Files |
| --- | --- |
| Explicit attribute state and compatibility | [`useVariantSelector.ts`](src/features/product/hooks/useVariantSelector.ts), [`findShopVariant.ts`](src/features/product/lib/findShopVariant.ts) |
| Variant identity, purchase eligibility, and selection requirement | [`productDetails.ts`](src/features/product/types/productDetails.ts) |
| Product/variant media resolution | [`productMedia.ts`](src/features/product/lib/productMedia.ts) |
| Product page, quick view, desktop/mobile Add | [`ProductDetails.tsx`](src/features/product/view/ProductDetails.tsx) |
| Custom and scheduled basket dialogs | [`AddToCustomBasketPopup.tsx`](src/features/customBasket/components/AddToCustomBasketPopup.tsx), [`AddProductModal.tsx`](src/features/account/components/AddProductModal.tsx) |
| Currency state, persistence, and account reset | [`CurrencyContext.tsx`](src/context/CurrencyContext.tsx), [`currencyPreference.ts`](src/shared/lib/currencyPreference.ts) |
| Currency API bootstrap and queries | [`CurrencyFromApiSync.tsx`](src/features/account/components/CurrencyFromApiSync.tsx), [`useCurrencies.ts`](src/features/account/hooks/useCurrencies.ts), [`currency.service.ts`](src/features/account/api/currency.service.ts) |
| Account preference save | [`Settings.tsx`](src/features/account/view/Settings.tsx) |
| Startup gate | [`App.tsx`](src/App.tsx), [`BootGate.tsx`](src/shared/component/loading/BootGate.tsx) |
| Existing cart transport | [`cartApi.ts`](src/features/cart/api/cartApi.ts) |
| Regression tests | [`product-variants.test.mjs`](tests/product-variants.test.mjs), [`currency.test.mjs`](tests/currency.test.mjs), [`prices.test.mjs`](tests/prices.test.mjs) |

## 8. Release sequence and completion criteria

1. Backend engineer inspects the existing currency/default/account behavior and purchase validators, then closes the backend checklist.
2. Backend and website engineers settle account preference provenance. If the proposed extension is required, implement both sides before declaring C-05 complete.
3. Deploy compatible backend changes to staging, then point the storefront preview at the same staging environment used by the dashboard.
4. Verify real product and currency payloads, execute the acceptance matrix, and retain representative requests/responses with sensitive data removed.
5. Run `npm.cmd test` and `npm.cmd run build` on the final website revision.
6. Deploy the compatible backend release before the website release, then smoke-test a fresh browser, an existing browser with legacy SYP storage, and authenticated accounts with and without a saved preference.

Completion requires passing the joint acceptance criteria, confirming the account-default distinction, and verifying the deployed behavior. The current local implementation and fixture checks are ready for review; production release remains pending.
