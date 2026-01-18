import { useQuery } from "@tanstack/react-query";
import { _LocationApi } from "../api/location.service";
import { QueryConfig } from "@/utils/queryKeys";
import type { Governorate, City } from "../types";

export function useGovernorates() {
  const { key } = QueryConfig.GOVERNORATES;

  return useQuery<Governorate[]>({
    queryKey: [key],
    queryFn: async () => {
      const response = await _LocationApi.getGovernorates();
      return response.data.items;
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours (formerly cacheTime)
  });
}

export function useCities(governorateId: number | null) {
  const { key } = QueryConfig.CITIES;

  return useQuery<City[]>({
    queryKey: [key, governorateId],
    queryFn: async () => {
      if (!governorateId) {
        return [];
      }
      const response = await _LocationApi.getCities(governorateId);
      // The API returns a single city object with governorate info
      // We need to adapt this to return an array
      if (response.data) {
        return [response.data];
      }
      return [];
    },
    enabled: !!governorateId, // Only fetch when governorateId is provided
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}
