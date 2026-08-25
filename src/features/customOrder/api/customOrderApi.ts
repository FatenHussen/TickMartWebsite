import _axios from "@/app/middleware/interceptor";
import { apiRoutes } from "@/utils/apiRoutes";
import type {
  CreateCustomOrderPayload,
  CustomOrderListMeta,
  CustomOrderListParams,
  CustomOrderRequest,
} from "../types";

type ApiEnvelope<T> = {
  status?: boolean;
  success?: boolean;
  message?: string;
  data: T;
};

function unwrapList(
  raw: unknown
): { items: CustomOrderRequest[]; meta?: CustomOrderListMeta } {
  const envelope = raw as ApiEnvelope<
    CustomOrderRequest[] | { items: CustomOrderRequest[]; pagination?: CustomOrderListMeta; meta?: CustomOrderListMeta }
  >;
  const data = envelope?.data;

  if (Array.isArray(data)) {
    return { items: data };
  }

  if (data && typeof data === "object" && Array.isArray((data as { items?: CustomOrderRequest[] }).items)) {
    const wrapped = data as {
      items: CustomOrderRequest[];
      pagination?: CustomOrderListMeta;
      meta?: CustomOrderListMeta;
    };
    return { items: wrapped.items, meta: wrapped.pagination ?? wrapped.meta };
  }

  return { items: [] };
}

export function buildCustomOrderFormData(payload: CreateCustomOrderPayload): FormData {
  const form = new FormData();
  form.append("description", payload.description);
  form.append("address_id", String(payload.address_id));

  if (payload.payment_method_id != null && payload.payment_method_id !== "") {
    form.append("payment_method_id", String(payload.payment_method_id));
  }

  if (payload.expected_at) {
    form.append("expected_at", payload.expected_at);
  }

  (payload.images ?? []).forEach((file) => {
    form.append("images[]", file);
  });

  return form;
}

export const customOrderApi = {
  list: async (
    params?: CustomOrderListParams
  ): Promise<{ items: CustomOrderRequest[]; meta?: CustomOrderListMeta }> => {
    const res = await _axios.get(apiRoutes.customOrderRequests.list(params));
    return unwrapList(res.data);
  },

  details: async (id: number | string): Promise<CustomOrderRequest> => {
    const res = await _axios.get<ApiEnvelope<CustomOrderRequest>>(
      apiRoutes.customOrderRequests.details(id)
    );
    return res.data.data;
  },

  create: async (
    payload: CreateCustomOrderPayload
  ): Promise<{ data: CustomOrderRequest; message?: string }> => {
    const formData = buildCustomOrderFormData(payload);
    const res = await _axios.post<ApiEnvelope<CustomOrderRequest>>(
      apiRoutes.customOrderRequests.create,
      formData
    );
    return { data: res.data.data, message: res.data.message };
  },

  approve: async (
    id: number | string
  ): Promise<{ data: CustomOrderRequest; message?: string }> => {
    const res = await _axios.post<ApiEnvelope<CustomOrderRequest>>(
      apiRoutes.customOrderRequests.approve(id)
    );
    return { data: res.data.data, message: res.data.message };
  },

  cancel: async (
    id: number | string
  ): Promise<{ data: CustomOrderRequest; message?: string }> => {
    const res = await _axios.post<ApiEnvelope<CustomOrderRequest>>(
      apiRoutes.customOrderRequests.cancel(id)
    );
    return { data: res.data.data, message: res.data.message };
  },
};
