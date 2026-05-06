import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { PremiumInlineLoader } from "@/shared/component/loading";
import DeleteBasketPopup from "../components/DeleteBasketPopup";
import MyBasketCard from "../components/my-baskets/components/MyBasketCard";
import MyBasketsHeader from "../components/my-baskets/components/MyBasketsHeader";
import MyBasketsSortControls from "../components/my-baskets/components/MyBasketsSortControls";
import MyBasketsTypeFilters from "../components/my-baskets/components/MyBasketsTypeFilters";
import { useMyBasketsPageState } from "../components/my-baskets/hooks/useMyBasketsPageState";

export default function MyBaskets() {
    const { t } = useTranslation();
    const { isRTL } = useLanguage();
    const {
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
        isDeletingBasket,
    } = useMyBasketsPageState();

    // Loading state
    if (isLoading) {
        return (
            <div dir={isRTL ? "rtl" : "ltr"}>
                <MyBasketsHeader />
                <div className="flex items-center justify-center py-14">
                    <PremiumInlineLoader size="sm" />
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div dir={isRTL ? "rtl" : "ltr"}>
                <MyBasketsHeader showDescription={false} />
                <div className="py-14 text-center text-[var(--color-ui-red-500)] dark:text-[color-mix(in_srgb,var(--color-error)_85%,#fca5a5)]">
                    {t("baskets.failedToLoad")}
                </div>
            </div>
        );
    }

    return (
        <div dir={isRTL ? "rtl" : "ltr"}>
            <MyBasketsHeader />
            <MyBasketsTypeFilters
                selectedFilter={typeFilter}
                onSelectFilter={setTypeFilter}
            />
            <MyBasketsSortControls
                selectedSortBy={sortBy}
                onSortChange={setSortBy}
            />

            {sortedBaskets.length > 0 ? (
                <div className="space-y-4">
                    {sortedBaskets.map((basket) => (
                        <MyBasketCard
                            key={`${basket.basket_type}-${basket.id}`}
                            basket={basket}
                            onViewDetails={viewBasketDetails}
                            onEditItems={editBasketItems}
                            onPauseResume={toggleBasketPauseState}
                            onDelete={openDeleteBasketPopup}
                            isPauseResumePending={isPauseResumePending(basket)}
                        />
                    ))}
                </div>
            ) : (
                <div className="py-14 text-center text-custom-secondary dark:text-[#A1A1AA]">
                    {t("baskets.noBasketsFound")}
                </div>
            )}

            {basketPendingDelete &&
            basketPendingDelete.basket_type === "user-schedule" ? (
                <DeleteBasketPopup
                    isOpen={isDeletePopupOpen}
                    basketName={basketPendingDelete.name}
                    nextRunDate={
                        "next_run_date" in basketPendingDelete
                            ? basketPendingDelete.next_run_date
                            : ""
                    }
                    isDeleting={isDeletingBasket}
                    onClose={closeDeleteBasketPopup}
                    onConfirm={confirmDeleteBasket}
                />
            ) : null}
        </div>
    );
}
