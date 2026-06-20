import { useQuery } from"@tanstack/react-query";
import { queryKeys } from"@/utils/queryKeys";
import { _SectionsApi } from"../api/sections.service";
import type { SectionsFilters } from"../api/sections.service";
import type { Section } from"../types";

export function useSections(pageSlug: string, filters?: SectionsFilters) {
 return useQuery({
 queryKey: queryKeys.sections.list(pageSlug, filters),
 queryFn: () => _SectionsApi.getSections(pageSlug, filters),
 select: (response) => response.data,
 });
}

export function useSectionsByPosition(
 pageSlug: string,
 filters?: SectionsFilters,
) {
 const query = useSections(pageSlug, filters);

 const sortByOrder = (a: Section, b: Section) => a.order - b.order;

 const beforeSections =
 query.data
 ?.filter((section) => section.position ==="before")
 .sort(sortByOrder) ?? [];

 const afterSections =
 query.data
 ?.filter((section) => section.position ==="after")
 .sort(sortByOrder) ?? [];

 return {
 ...query,
 beforeSections,
 afterSections,
 };
}
