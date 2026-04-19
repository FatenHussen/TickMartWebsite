import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { paths } from "@/app/routes/path/paths";
import {
    useMyBaskets,
    type MyBasketFilterType,
} from "../../../hooks/useMyBaskets";
import {
    useDeleteScheduledBasket,
    usePauseScheduledBasket,
    useResumeScheduledBasket,
} from "../../../hooks/useScheduledBaskets";
import {
    usePauseSubscription,
    useResumeSubscription,
} from "../../../hooks/useMyBasketMutations";
import type { MyBasketListItem } from "../../../types/myBasket";
import type { MyBasketSortBy } from "../constants";
import {
    getBasketCreatedRawDate,
    getBasketNextRunDate,
} from "../utils/basketDisplay";

export function useMyBasketsPageState() {
    const navigate = useNavigate();

    const [typeFilter, setTypeFilter] = useState<MyBasketFilterType>("all");
    const [sortBy, setSortBy] = useState<MyBasketSortBy>("next_delivery");
    const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
    const [basketPendingDelete, setBasketPendingDelete] =
        useState<MyBasketListItem | null>(null);

    const { data: baskets = [], isLoading, error } = useMyBaskets(typeFilter);

    const deleteScheduledBasketMutation = useDeleteScheduledBasket();
    const pauseScheduledBasketMutation = usePauseScheduledBasket();
    const resumeScheduledBasketMutation = useResumeScheduledBasket();
    const pauseSubscriptionMutation = usePauseSubscription();
    const resumeSubscriptionMutation = useResumeSubscription();

    const sortedBaskets = useMemo(() => {
        const clonedBaskets = [...baskets];

        clonedBaskets.sort((basketA, basketB) => {
            if (sortBy === "next_delivery") {
                const basketADate = getBasketNextRunDate(basketA)
                    ? new Date(getBasketNextRunDate(basketA)).getTime()
                    : 0;
                const basketBDate = getBasketNextRunDate(basketB)
                    ? new Date(getBasketNextRunDate(basketB)).getTime()
                    : 0;
                return basketADate - basketBDate;
            }

            if (sortBy === "created") {
                const basketACreatedAt = getBasketCreatedRawDate(basketA);
                const basketBCreatedAt = getBasketCreatedRawDate(basketB);
                return (
                    new Date(basketBCreatedAt).getTime() -
                    new Date(basketACreatedAt).getTime()
                );
            }

            if (sortBy === "name") {
                return basketA.name.localeCompare(basketB.name);
            }

            return 0;
        });

        return clonedBaskets;
    }, [baskets, sortBy]);

    const viewBasketDetails = (basket: MyBasketListItem) => {
        if (basket.basket_type === "user-schedule") {
            navigate(paths.account.basketDetails(basket.id));
            return;
        }

        navigate(paths.client.basketDetails(basket.id));
    };

    const editBasketItems = (basket: MyBasketListItem) => {
        viewBasketDetails(basket);
    };

    const openDeleteBasketPopup = (basket: MyBasketListItem) => {
        if (basket.basket_type !== "user-schedule") return;
        setBasketPendingDelete(basket);
        setIsDeletePopupOpen(true);
    };

    const closeDeleteBasketPopup = () => {
        setIsDeletePopupOpen(false);
        setBasketPendingDelete(null);
    };

    const confirmDeleteBasket = () => {
        if (!basketPendingDelete || basketPendingDelete.basket_type !== "user-schedule") {
            return;
        }

        deleteScheduledBasketMutation.mutate(basketPendingDelete.id, {
            onSuccess: closeDeleteBasketPopup,
        });
    };

    const toggleBasketPauseState = (basket: MyBasketListItem) => {
        const isBasketPaused = basket.is_paused ?? !basket.is_active;

        if (basket.basket_type === "user-schedule") {
            if (isBasketPaused) {
                resumeScheduledBasketMutation.mutate(basket.id);
                return;
            }
            pauseScheduledBasketMutation.mutate(basket.id);
            return;
        }

        if (basket.basket_type === "subscription") {
            if (isBasketPaused) {
                resumeSubscriptionMutation.mutate(basket.id);
                return;
            }
            pauseSubscriptionMutation.mutate(basket.id);
        }
    };

    const isPauseResumePending = (basket: MyBasketListItem) => {
        if (basket.basket_type === "user-schedule") {
            return (
                (pauseScheduledBasketMutation.isPending &&
                    pauseScheduledBasketMutation.variables === basket.id) ||
                (resumeScheduledBasketMutation.isPending &&
                    resumeScheduledBasketMutation.variables === basket.id)
            );
        }

        if (basket.basket_type === "subscription") {
            return (
                (pauseSubscriptionMutation.isPending &&
                    pauseSubscriptionMutation.variables === basket.id) ||
                (resumeSubscriptionMutation.isPending &&
                    resumeSubscriptionMutation.variables === basket.id)
            );
        }

        return false;
    };

    return {
        typeFilter,
        setTypeFilter,
        sortBy,
        setSortBy,
        isLoading,
        error,
        sortedBaskets,
        viewBasketDetails,
        editBasketItems,
        openDeleteBasketPopup,
        closeDeleteBasketPopup,
        confirmDeleteBasket,
        toggleBasketPauseState,
        isPauseResumePending,
        isDeletePopupOpen,
        basketPendingDelete,
        isDeletingBasket: deleteScheduledBasketMutation.isPending,
    };
}

