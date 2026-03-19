import { useState, useEffect, useCallback } from "react";
import { searchApi } from "../api/searchApi";
import type { SearchResultType, SearchResultWithType } from "../types";

const DEBOUNCE_MS = 300;

export function useNavbarSearch() {
    const [query, setQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState<SearchResultType | "all">("all");
    const [results, setResults] = useState<SearchResultWithType[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query.trim());
        }, DEBOUNCE_MS);
        return () => clearTimeout(timer);
    }, [query]);

    useEffect(() => {
        if (!debouncedQuery) {
            setResults([]);
            setIsLoading(false);
            return;
        }

        let cancelled = false;
        setIsLoading(true);

        const run = async () => {
            try {
                if (typeFilter === "all") {
                    const items = await searchApi.searchAll(debouncedQuery);
                    if (!cancelled) setResults(items);
                } else {
                    const items = await searchApi.search(typeFilter, debouncedQuery);
                    if (!cancelled) {
                        setResults(
                            items.map((item) => ({ ...item, type: typeFilter }))
                        );
                    }
                }
            } catch {
                if (!cancelled) setResults([]);
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        };
        run();

        return () => {
            cancelled = true;
        };
    }, [debouncedQuery, typeFilter]);

    const hasQuery = query.trim().length > 0;

    const openDropdown = useCallback(() => setIsOpen(true), []);
    const closeDropdown = useCallback(() => setIsOpen(false), []);

    useEffect(() => {
        if (hasQuery) openDropdown();
        else closeDropdown();
    }, [hasQuery, openDropdown, closeDropdown]);
    const clearQuery = useCallback(() => {
        setQuery("");
        setResults([]);
        closeDropdown();
    }, [closeDropdown]);

    return {
        query,
        setQuery,
        typeFilter,
        setTypeFilter,
        results,
        isLoading,
        isOpen,
        openDropdown,
        closeDropdown,
        clearQuery,
        hasQuery,
    };
}
