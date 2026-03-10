import { useQuery } from "@tanstack/react-query";
import { _LocationApi } from "../api/location.service";
import { queryKeys } from "@/utils/queryKeys";
import type { Governorate, City, Area, Country } from "../types";

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
    queryFn: async (): Promise<City[]> => {
      if (!governorateId) {
        return [];
      }
      const response = await _LocationApi.getCities(governorateId);
      // Handle response format: { data: { items: City[], pagination: ... } }
      const data = (response as { data?: unknown }).data;
      if (data && typeof data === "object" && "items" in data) {
        return (data as { items: City[] }).items;
      }
      // Fallback for direct array response
      if (Array.isArray(data)) {
        return data as City[];
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

export function useCountries() {
  return useQuery<Country[]>({
    queryKey: queryKeys.location.countries(),
    queryFn: async () => {
      const response = await _LocationApi.getCountries();
      return response.data?.items ?? [];
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}
