import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/utils/queryKeys";
import { useLanguage } from "@/context/LanguageContext";
import { navMenuApi } from "../api/navMenuApi";
import { resolveNavMenu, type ResolvedNavMenuItem } from "../lib/resolveNavMenuItem";

/**
 * The dashboard-managed top navigation.
 *
 * `title` comes back in the language of the request, so the language is part of
 * the query key: switching it refetches under its own cache entry instead of
 * showing the previous language's titles. Between switches the menu is cached
 * for 5 minutes — it changes rarely.
 */
export function useNavMenu(): {
    items: ResolvedNavMenuItem[];
    isLoading: boolean;
} {
    const { language } = useLanguage();

    const { data, isLoading } = useQuery({
        queryKey: queryKeys.navMenu.list(language),
        queryFn: () => navMenuApi.getNavMenu(language),
        staleTime: 1000 * 60 * 5,
    });

    const items = useMemo(() => resolveNavMenu(data ?? []), [data]);

    return { items, isLoading };
}
