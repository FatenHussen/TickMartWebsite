import { useQuery } from "@tanstack/react-query";
import { _MyBasketsApi } from "../api/myBasketsApi";
import { queryKeys } from "@/utils/queryKeys";

export type MyBasketFilterType =
  | "all"
  | "subscription"
  | "custom"
  | "user-schedule";

export function useMyBaskets(type?: MyBasketFilterType) {
  const apiType =
    type && type !== "all" ? type : undefined;

  return useQuery({
    queryKey: queryKeys.myBaskets.list(apiType),
    queryFn: () => _MyBasketsApi.getMyBaskets(apiType),
    select: (response) => response.data,
  });
}
