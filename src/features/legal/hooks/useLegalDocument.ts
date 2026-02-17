import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/utils/queryKeys";
import { legalDocumentsApi } from "../api/legalDocumentsApi";

export function usePrivacyPolicy() {
  return useQuery({
    queryKey: queryKeys.legalDocuments.privacyPolicy(),
    queryFn: () => legalDocumentsApi.getPrivacyPolicy(),
    staleTime: 1000 * 60 * 10,
  });
}

export function useTermsConditions() {
  return useQuery({
    queryKey: queryKeys.legalDocuments.termsConditions(),
    queryFn: () => legalDocumentsApi.getTermsConditions(),
    staleTime: 1000 * 60 * 10,
  });
}

export function useMarketerTermsConditions() {
  return useQuery({
    queryKey: queryKeys.legalDocuments.marketerTermsConditions(),
    queryFn: () => legalDocumentsApi.getMarketerTermsConditions(),
    staleTime: 1000 * 60 * 10,
  });
}
