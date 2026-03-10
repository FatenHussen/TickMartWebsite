import _axios from "@/app/middleware/interceptor";
import { apiRoutes } from "@/utils/apiRoutes";
import type {
  RatingsResponse,
  RatingItem,
  RatingsPagination,
  CanRateResponse,
  MyRatingItem,
  CreateRatingPayload,
  UpdateRatingPayload,
} from "../types/ratings";

export interface GetRatingsParams {
  rateableId: number;
  rateableType: string;
  page?: number;
  perPage?: number;
}

// Backend may return data as array or { items, pagination }; normalize to this shape
function normalizeListResponse(
  raw: unknown
): { items: RatingItem[]; pagination: RatingsPagination } {
  if (Array.isArray(raw)) {
    return {
      items: raw as RatingItem[],
      pagination: {
        current_page: 1,
        last_page: 1,
        per_page: raw.length,
        total: raw.length,
      },
    };
  }
  const d = raw as { items?: RatingItem[]; pagination?: RatingsPagination };
  return {
    items: d.items ?? [],
    pagination:
      d.pagination ?? {
        current_page: 1,
        last_page: 1,
        per_page: 15,
        total: 0,
      },
  };
}

export const _RatingsApi = {
  getRatings: async (
    params: GetRatingsParams
  ): Promise<{ items: RatingItem[]; pagination: RatingsPagination }> => {
    const { rateableId, rateableType, page, perPage } = params;
    const response = await _axios.get<RatingsResponse & { data?: unknown }>(
      apiRoutes.ratings.list(rateableId, rateableType, page, perPage)
    );
    const data = response.data.data;
    const pagination = (response.data as RatingsResponse & { pagination?: RatingsPagination }).pagination;
    if (Array.isArray(data)) {
      return {
        items: data as RatingItem[],
        pagination:
          pagination ?? {
            current_page: 1,
            last_page: 1,
            per_page: data.length,
            total: data.length,
          },
      };
    }
    const normalized = normalizeListResponse(data ?? { items: [], pagination: undefined });
    if (pagination) normalized.pagination = pagination;
    return normalized;
  },

  getCanRate: async (productId: number): Promise<CanRateResponse> => {
    const response = await _axios.get<{
      status: boolean;
      message: string;
      data: CanRateResponse;
    }>(apiRoutes.ratings.canRate(productId));
    return response.data.data;
  },

  getMyRatings: async (params?: {
    type?: string;
    rateable_id?: number;
  }): Promise<MyRatingItem[]> => {
    const response = await _axios.get<{
      status: boolean;
      data: MyRatingItem[];
    }>(apiRoutes.ratings.myRatings(params?.type, params?.rateable_id));
    const data = response.data.data;
    return Array.isArray(data) ? data : [];
  },

  createRating: async (
    payload: CreateRatingPayload
  ): Promise<{ id: number; rating: number; comment: string | null; type: string; created_at: string }> => {
    const formData = new FormData();
    formData.append("type", payload.type);
    formData.append("rateable_id", String(payload.rateable_id));
    formData.append("rating", String(payload.rating));
    if (payload.comment != null && payload.comment !== "")
      formData.append("comment", payload.comment);
    if (payload.order_id != null)
      formData.append("order_id", String(payload.order_id));
    if (payload.image instanceof File) formData.append("image", payload.image);

    const response = await _axios.post<{
      status: boolean;
      message: string;
      data: { id: number; rating: number; comment: string | null; type: string; created_at: string };
    }>(apiRoutes.ratings.create, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data;
  },

  updateRating: async (
    id: number,
    payload: UpdateRatingPayload
  ): Promise<void> => {
    const formData = new FormData();
    if (payload.rating != null) formData.append("rating", String(payload.rating));
    if (payload.comment !== undefined) formData.append("comment", payload.comment ?? "");
    if (payload.image instanceof File) formData.append("image", payload.image);

    await _axios.put(apiRoutes.ratings.update(id), formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  deleteRating: async (id: number): Promise<void> => {
    await _axios.delete(apiRoutes.ratings.delete(id));
  },
};
