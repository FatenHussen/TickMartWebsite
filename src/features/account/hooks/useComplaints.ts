import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/utils/queryKeys";
import {
  complaintsApi,
  type ComplaintsListParams,
} from "../api/complaintsApi";

export function useComplaints(params?: ComplaintsListParams) {
  return useQuery({
    queryKey: queryKeys.complaints.list(params),
    queryFn: () => complaintsApi.getComplaints(params),
  });
}

export function useComplaintOrders() {
  return useQuery({
    queryKey: queryKeys.complaints.orders(),
    queryFn: () => complaintsApi.getComplaintOrders(),
  });
}

export function useCreateComplaint() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => complaintsApi.createComplaint(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.complaints.all() });
    },
  });
}
