import { useLayoutEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    armShoppingRestore,
    finishShoppingRestore,
    readShoppingResume,
    restoreShoppingView,
} from "@/shared/lib/shoppingResume";

/**
 * Scrolls to the top on ordinary route changes.
 * "Continue shopping" passes `restoreShoppingScroll` so the previous catalog
 * position is restored instead.
 */
export function useScrollToTop() {
    const location = useLocation();
    const navigate = useNavigate();
    const here = `${location.pathname}${location.search}`;
    const shouldRestore = Boolean(
        (location.state as { restoreShoppingScroll?: boolean } | null)?.restoreShoppingScroll,
    );

    const skipTopReset = useRef(false);

    useLayoutEffect(() => {
        if (shouldRestore) {
            skipTopReset.current = true;
            armShoppingRestore(here);
            const resume = readShoppingResume();
            if (resume && resume.path === here) {
                restoreShoppingView(resume);
            } else {
                finishShoppingRestore();
                window.scrollTo(0, 0);
            }
            navigate(
                { pathname: location.pathname, search: location.search, hash: location.hash },
                { replace: true, state: null },
            );
            return;
        }

        if (skipTopReset.current) {
            skipTopReset.current = false;
            return;
        }

        finishShoppingRestore();
        window.scrollTo(0, 0);
    }, [here, shouldRestore, navigate, location.pathname, location.search, location.hash]);
}
