import { useQuery } from "@tanstack/react-query";
import { _LocationApi } from "../api/location.service";
import { queryKeys } from "@/utils/queryKeys";
import type { Governorate, City, Area } from "../types";

export function useGovernorates() {
  return useQuery<Governorate[]>({
    queryKey: queryKeys.location.governorates(),
    queryFn: async () => {
      const response = await _LocationApi.getGovernorates();
      return response.data.items;
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}

export function useCities(governorateId: number | null) {
  return useQuery<City[]>({
    queryKey: queryKeys.location.cities(governorateId || undefined),
    queryFn: async () => {
      if (!governorateId) {
        return [];
      }
      const response = await _LocationApi.getCities(governorateId);
      // Handle response format: { data: { items: City[], pagination: ... } }
      if (response.data && typeof response.data === "object" && "items" in response.data) {
        return response.data.items;
      }
      // Fallback for direct array response
      if (Array.isArray(response.data)) {
        return response.data;
      }
      return [];
    },
    enabled: !!governorateId,
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}

export function useAreas(cityId: number | null) {
  return useQuery<Area[]>({
    queryKey: queryKeys.location.areas(cityId || undefined),
    queryFn: async () => {
      if (!cityId) {
        return [];
      }
      const response = await _LocationApi.getAreas(cityId);
      // Handle both response formats: { items: Area[] } or Area[]
      if (Array.isArray(response.data)) {
        return response.data;
      }
      if (
        response.data &&
        typeof response.data === "object" &&
        "items" in response.data
      ) {
        return response.data.items;
      }
      return [];
    },
    enabled: !!cityId,
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}
