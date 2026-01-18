import { useQuery } from "@tanstack/react-query";
import { _LocationApi } from "../api/location.service";
import { QueryConfig } from "@/utils/queryKeys";

export function useGovernorates() {
  const { key } = QueryConfig.GOVERNORATES;

  return useQuery({
    queryKey: [key],
    queryFn: async () => {
      const response = await _LocationApi.getGovernorates();
      return response.data;
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours (formerly cacheTime)
  });
}

export function useCities(governorateId: number | null) {
  const { key } = QueryConfig.CITIES;

  return useQuery({
    queryKey: [key, governorateId],
    queryFn: async () => {
      if (!governorateId) {
        return [];
      }
      const response = await _LocationApi.getCities(governorateId);
      return response.data;
    },
    enabled: !!governorateId, // Only fetch when governorateId is provided
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}
