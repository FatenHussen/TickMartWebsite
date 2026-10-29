import { useLayoutEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import {
    isCatalogPath,
    isResumeLocked,
    visibleProductId,
    writeShoppingResume,
} from "@/shared/lib/shoppingResume";

/**
 * Remember the catalog page, scroll offset, and product in view.
 * Product-details and cart routes are ignored so "continue shopping" can
 * return to the list instead of restarting it.
 */
export function useTrackShoppingPlace() {
    const { pathname, search } = useLocation();
    const productRef = useRef<number | null>(null);

    // Layout effect so this cleanup saves the scroll position before
    // useScrollToTop resets the window on the next page.
    useLayoutEffect(() => {
        if (!isCatalogPath(pathname)) return;
        const path = pathname + search;

        const remember = (scrollY: number, productId: number | null) => {
            if (isResumeLocked()) return;
            if (productId != null) productRef.current = productId;
            writeShoppingResume({
                path,
                scrollY,
                productId: productId ?? productRef.current,
            });
        };

        if (!isResumeLocked()) {
            const seededId = visibleProductId();
            if (seededId != null) productRef.current = seededId;
            remember(window.scrollY, productRef.current);
        }

        let frame = 0;
        const onScroll = () => {
            if (frame) return;
            frame = requestAnimationFrame(() => {
                frame = 0;
                remember(window.scrollY, visibleProductId());
            });
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", onScroll);
            if (frame) cancelAnimationFrame(frame);
            remember(window.scrollY, productRef.current);
        };
    }, [pathname, search]);
}
