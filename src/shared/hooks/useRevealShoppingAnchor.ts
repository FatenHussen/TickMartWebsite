import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import {
    isRestoreArmedFor,
    readShoppingResume,
    takeAnchorFetch,
} from "@/shared/lib/shoppingResume";

type AnchorItem = { id: number };

/**
 * After returning from the cart, keep loading list pages until the product
 * the shopper was looking at is actually rendered.
 */
export function useRevealShoppingAnchor({
    enabled = true,
    items,
    hasMore,
    isLoading,
    onLoadMore,
}: {
    enabled?: boolean;
    items: AnchorItem[];
    hasMore: boolean;
    isLoading: boolean;
    onLoadMore: () => void;
}) {
    const { pathname, search } = useLocation();
    const path = pathname + search;
    const loadMoreRef = useRef(onLoadMore);
    loadMoreRef.current = onLoadMore;

    useEffect(() => {
        if (!enabled || !isRestoreArmedFor(path)) return;
        const resume = readShoppingResume();
        if (!resume || resume.path !== path || resume.productId == null) return;
        if (items.some((item) => item.id === resume.productId)) return;
        if (!hasMore || isLoading) return;
        if (!takeAnchorFetch()) return;
        loadMoreRef.current();
    }, [enabled, items, hasMore, isLoading, path]);
}
