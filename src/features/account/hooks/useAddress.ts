import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { _AddressApi } from "../api/address.service";
import { queryKeys } from "@/utils/queryKeys";
import { paths } from "@/app/routes/path/paths";
import type {
  CreateAddressPayload,
  UpdateAddressPayload,
  Address,
} from "../types";

export function useAddresses(enabled = true) {
  return useQuery<Address[]>({
    queryKey: queryKeys.addresses.list(),
    enabled,
    queryFn: async () => {
      const response = await _AddressApi.getAddresses();
      return response.data.items;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });
}

export function useCreateAddress() {
  const qc = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: CreateAddressPayload) =>
      _AddressApi.createAddress(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.addresses.list() });
      navigate(paths.account.addresses);
    },
    onError: (err) => {
      console.error("[createAddress] error:", err);
    },
  });
}

export function useUpdateAddress() {
  const qc = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number | string;
      payload: UpdateAddressPayload;
    }) => _AddressApi.updateAddress(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.addresses.list() });
      navigate(paths.account.addresses);
    },
    onError: (err) => {
      console.error("[updateAddress] error:", err);
    },
  });
}
