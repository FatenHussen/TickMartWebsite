import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth";
import { queryKeys } from "@/utils/queryKeys";
import { _RatingsApi } from "@/features/product/api/ratingsApi";
import type {
    CreateRatingPayload,
    UpdateRatingPayload,
} from "@/features/product/types/ratings";

export function useCanRate(productId: number) {
    const token = useAuthStore((s) => s.token);
    return useQuery({
        queryKey: queryKeys.ratings.canRate(productId),
        queryFn: () => _RatingsApi.getCanRate(productId),
        enabled: !!token && productId > 0,
        staleTime: 1000 * 60,
    });
}

export function useMyRatings(params?: { type?: string; rateable_id?: number }) {
    const token = useAuthStore((s) => s.token);
    return useQuery({
        queryKey: queryKeys.ratings.myRatings(params?.type, params?.rateable_id),
        queryFn: () => _RatingsApi.getMyRatings(params),
        enabled: !!token,
        staleTime: 1000 * 60,
    });
}

function invalidateProductRatingSurfaces(
    queryClient: ReturnType<typeof useQueryClient>,
    productId?: number,
) {
    const tasks = [
        queryClient.invalidateQueries({ queryKey: queryKeys.ratings.all() }),
        queryClient.invalidateQueries({ queryKey: queryKeys.ratings.myRatings() }),
        queryClient.invalidateQueries({ queryKey: queryKeys.product.all() }),
        queryClient.invalidateQueries({ queryKey: ["products"] }),
        queryClient.invalidateQueries({ queryKey: queryKeys.sections.all() }),
    ];
    if (productId != null) {
        tasks.push(
            queryClient.invalidateQueries({
                queryKey: queryKeys.product.details(productId),
            }),
            queryClient.invalidateQueries({
                queryKey: queryKeys.product.ratings(productId, "product"),
            }),
            queryClient.invalidateQueries({
                queryKey: queryKeys.ratings.canRate(productId),
            }),
        );
    }
    return Promise.all(tasks);
}

export function useCreateRating() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateRatingPayload) =>
            _RatingsApi.createRating(payload),
        onSuccess: async (_, variables) => {
            if (variables.type === "product") {
                await invalidateProductRatingSurfaces(
                    queryClient,
                    variables.rateable_id,
                );
                return;
            }

            const tasks = [
                queryClient.invalidateQueries({ queryKey: queryKeys.ratings.all() }),
                queryClient.invalidateQueries({
                    queryKey: queryKeys.ratings.myRatings(),
                }),
                queryClient.invalidateQueries({
                    queryKey: queryKeys.ratings.canRate(variables.rateable_id),
                }),
            ];
            if (variables.type === "recipe") {
                tasks.push(
                    queryClient.invalidateQueries({
                        queryKey: queryKeys.recipes.details(variables.rateable_id),
                    }),
                );
            }
            if (
                variables.type === "basket" ||
                variables.type === "schedule_basket"
            ) {
                tasks.push(
                    queryClient.invalidateQueries({
                        queryKey: queryKeys.ratings.list(
                            variables.rateable_id,
                            variables.type,
                        ),
                    }),
                );
            }
            if (variables.type === "shop") {
                tasks.push(
                    queryClient.invalidateQueries({
                        queryKey: queryKeys.ratings.list(variables.rateable_id, "shop"),
                    }),
                    queryClient.invalidateQueries({
                        queryKey: queryKeys.shop.details(variables.rateable_id),
                    }),
                );
            }
            if (variables.type === "brand") {
                tasks.push(
                    queryClient.invalidateQueries({
                        queryKey: queryKeys.ratings.list(variables.rateable_id, "brand"),
                    }),
                    queryClient.invalidateQueries({
                        queryKey: queryKeys.brands.details(variables.rateable_id),
                    }),
                );
            }
            await Promise.all(tasks);
        },
    });
}

export function useUpdateRating() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            payload,
        }: {
            id: number;
            payload: UpdateRatingPayload;
        }) => _RatingsApi.updateRating(id, payload),
        onSuccess: () => invalidateProductRatingSurfaces(queryClient),
    });
}

export function useDeleteRating() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => _RatingsApi.deleteRating(id),
        onSuccess: () => invalidateProductRatingSurfaces(queryClient),
    });
}
