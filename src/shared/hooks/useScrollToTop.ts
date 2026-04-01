import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Scrolls the window to the top whenever the route changes (pathname or query).
 * Call once in a component that stays mounted for all routes (e.g. root layout).
 */
export function useScrollToTop() {
    const { pathname, search } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname, search]);
}
