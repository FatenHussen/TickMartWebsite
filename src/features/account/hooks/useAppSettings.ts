import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/utils/queryKeys";
import { settingsApi } from "../api/settingsApi";

export function useAppSettings(enabled = true) {
  return useQuery({
    queryKey: queryKeys.appSettings.get(),
    enabled,
    queryFn: () => settingsApi.getSettings(),
    staleTime: 1000 * 60 * 10,
  });
}
