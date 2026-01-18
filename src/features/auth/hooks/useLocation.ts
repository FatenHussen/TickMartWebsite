import { useQuery } from "@tanstack/react-query";
import { _LocationApi } from "../api/location.service";
import { queryKeys } from "@/utils/queryKeys";
import type { Governorate, City } from "../types";

export function useGovernorates() {
  return useQuery<Governorate[]>({
    queryKey: [queryKeys.location.governorates],
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
    queryKey: [queryKeys.location.cities, governorateId],
    queryFn: async () => {
      if (!governorateId) {
        return [];
      }
      const response = await _LocationApi.getCities(governorateId);
      if (response.data) {
        return [response.data];
      }
      return [];
    },
    enabled: !!governorateId,
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}
