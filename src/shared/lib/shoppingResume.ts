const STORAGE_KEY = "tikmool.shoppingResume";
const MAX_ANCHOR_FETCHES = 40;

export type ShoppingResume = {
    path: string;
    scrollY: number;
    productId: number | null;
};

const CATALOG_PREFIXES = [
    "/categories",
    "/shops",
    "/shop_details",
    "/brands",
    "/brand",
    "/baskets",
    "/basket",
    "/recipes",
    "/recipe",
    "/pages",
    "/schedules",
];

let locked = false;
let armedPath: string | null = null;
let anchorFetches = 0;
let restoreToken = 0;

/** Product grids worth returning to. Product details stay out so the list position is kept. */
export function isCatalogPath(pathname: string): boolean {
    if (pathname === "/" || pathname === "/home") return true;
    if (pathname === "/products" || pathname.startsWith("/products/")) return true;
    return CATALOG_PREFIXES.some(
        (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
    );
}

export function readShoppingResume(): ShoppingResume | null {
    try {
        const raw = sessionStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw) as Partial<ShoppingResume>;
        if (!parsed.path || typeof parsed.path !== "string") return null;
        const pathname = parsed.path.split(/[?#]/)[0] ?? "";
        if (!isCatalogPath(pathname)) return null;
        return {
            path: parsed.path,
            scrollY:
                typeof parsed.scrollY === "number" && parsed.scrollY > 0
                    ? parsed.scrollY
                    : 0,
            productId: typeof parsed.productId === "number" ? parsed.productId : null,
        };
    } catch {
        return null;
    }
}

export function writeShoppingResume(resume: ShoppingResume) {
    if (locked) return;
    try {
        const prev = readShoppingResume();
        const productId =
            resume.productId ??
            (prev && prev.path === resume.path ? prev.productId : null);
        const next: ShoppingResume = {
            path: resume.path,
            scrollY: Math.max(0, resume.scrollY),
            productId,
        };
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
        /* private mode / quota */
    }
}

export function continueShoppingPath(fallback: string): string {
    return readShoppingResume()?.path || fallback;
}

export function isResumeLocked() {
    return locked;
}

export function armShoppingRestore(path: string) {
    const resume = readShoppingResume();
    if (!resume || resume.path !== path) {
        armedPath = null;
        return;
    }
    armedPath = path;
    locked = true;
    anchorFetches = 0;
}

export function isRestoreArmedFor(path: string) {
    return armedPath === path;
}

export function takeAnchorFetch(): boolean {
    if (anchorFetches >= MAX_ANCHOR_FETCHES) return false;
    anchorFetches += 1;
    return true;
}

export function finishShoppingRestore() {
    restoreToken += 1;
    armedPath = null;
    locked = false;
}

/** Product card closest to the middle of the viewport. */
export function visibleProductId(): number | null {
    const cards = document.querySelectorAll<HTMLElement>("[data-product-id]");
    const mid = window.innerHeight / 2;
    let bestId: number | null = null;
    let bestDist = Infinity;
    cards.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.bottom < 80 || rect.top > window.innerHeight - 80) return;
        const id = Number(el.dataset.productId);
        if (!Number.isFinite(id)) return;
        const dist = Math.abs(rect.top + rect.height / 2 - mid);
        if (dist < bestDist) {
            bestDist = dist;
            bestId = id;
        }
    });
    return bestId;
}

function closestAnchor(productId: number, scrollY: number): HTMLElement | null {
    const selector = `[data-product-id="${CSS.escape(String(productId))}"]`;
    const nodes = document.querySelectorAll<HTMLElement>(selector);
    let best: HTMLElement | null = null;
    let bestDist = Infinity;
    nodes.forEach((el) => {
        const top = el.getBoundingClientRect().top + window.scrollY;
        const dist = Math.abs(top - scrollY);
        if (dist < bestDist) {
            bestDist = dist;
            best = el;
        }
    });
    return best;
}

/** Put the window back on the saved product once the list is tall enough to reach it. */
export function restoreShoppingView(resume: ShoppingResume) {
    const token = ++restoreToken;
    const started = performance.now();
    const target = Math.max(0, resume.scrollY);

    const tick = () => {
        if (token !== restoreToken) return;
        const max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
        const canReach = target <= 0 || max >= target - 24;
        const timedOut = performance.now() - started > 12000;

        const el =
            resume.productId != null ? closestAnchor(resume.productId, target) : null;
        if (el) {
            const top = el.getBoundingClientRect().top + window.scrollY;
            // A copy of the card higher on the page (a slider) is not the row
            // the shopper was on. Keep loading until the lower card exists.
            const farAboveTarget = top + el.offsetHeight < target - window.innerHeight;
            if (!farAboveTarget || timedOut) {
                el.scrollIntoView({ block: "center" });
                finishShoppingRestore();
                return;
            }
        }

        if (resume.productId == null && (canReach || timedOut)) {
            window.scrollTo(0, Math.min(target, max));
            finishShoppingRestore();
            return;
        }

        if (timedOut) {
            window.scrollTo(0, Math.min(target, max));
            finishShoppingRestore();
            return;
        }

        if (canReach) window.scrollTo(0, Math.min(target, max));
        requestAnimationFrame(tick);
        return;
    };

    tick();
}
