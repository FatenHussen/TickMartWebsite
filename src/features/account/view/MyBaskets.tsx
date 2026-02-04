import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import BasketFilters from "../components/BasketFilters";
import BasketCard from "../components/BasketCard";
import DeleteBasketPopup from "../components/DeleteBasketPopup";
import { mockBaskets } from "../data/mockData";
import type { Basket, BasketFilter } from "../types";

export default function MyBaskets() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<BasketFilter>("all");
  const [sortBy, setSortBy] = useState("next_delivery");
  const [deletePopupOpen, setDeletePopupOpen] = useState(false);
  const [basketToDelete, setBasketToDelete] = useState<Basket | null>(null);

  const filteredBaskets = useMemo(() => {
    let baskets = [...mockBaskets];

    // Filter by status/category
    if (activeFilter !== "all") {
      if (
        activeFilter === "active" ||
        activeFilter === "paused" ||
        activeFilter === "expired"
      ) {
        baskets = baskets.filter((basket) => basket.status === activeFilter);
      } else if (
        activeFilter === "scheduled" ||
        activeFilter === "occasion" ||
        activeFilter === "suggested"
      ) {
        baskets = baskets.filter((basket) => basket.category === activeFilter);
      }
    }

    // Sort baskets
    switch (sortBy) {
      case "name":
        baskets.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "created":
        baskets.sort((a, b) => (b.id > a.id ? 1 : -1));
        break;
      case "price":
        baskets.sort((a, b) => {
          const priceA = parseFloat(a.price.replace(/[^0-9.]/g, ""));
          const priceB = parseFloat(b.price.replace(/[^0-9.]/g, ""));
          return priceB - priceA;
        });
        break;
      default:
        // next_delivery - keep original order
        break;
    }

    return baskets;
  }, [activeFilter, sortBy]);

  // Separate active and paused baskets
  const activeBaskets = filteredBaskets.filter((b) => b.status === "active");
  const pausedBaskets = filteredBaskets.filter((b) => b.status === "paused");

  const handleViewDetails = (basketId: number | string) => {
    console.log("View basket details:", basketId);
  };

  const handleEditItems = (basketId: number | string) => {
    console.log("Edit basket items:", basketId);
  };

  const handleEditSchedule = (basketId: number | string) => {
    console.log("Edit basket schedule:", basketId);
  };

  const handlePauseBasket = (basketId: number | string) => {
    console.log("Pause basket:", basketId);
  };

  const handleResumeBasket = (basketId: number | string) => {
    console.log("Resume basket:", basketId);
  };

  const handleReschedule = (basketId: number | string) => {
    console.log("Reschedule basket:", basketId);
  };

  const handleDeleteClick = (basket: Basket) => {
    setBasketToDelete(basket);
    setDeletePopupOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (basketToDelete) {
      console.log("Delete basket confirmed:", basketToDelete.id);
      // TODO: Call API to delete basket
    }
    setDeletePopupOpen(false);
    setBasketToDelete(null);
  };

  const handleDeleteClose = () => {
    setDeletePopupOpen(false);
    setBasketToDelete(null);
  };

  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          {t("baskets.myBaskets")}
        </h1>
        <p className="text-sm text-gray-600">
          {t("baskets.myBasketsDescription")}
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <BasketFilters
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
      </div>

      {/* Active & Upcoming Baskets */}
      {activeBaskets.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {t("baskets.activeAndUpcoming")}
          </h2>
          <div className="space-y-4">
            {activeBaskets.map((basket) => (
              <BasketCard
                key={basket.id}
                basket={basket}
                onViewDetails={() => handleViewDetails(basket.id)}
                onEditItems={() => handleEditItems(basket.id)}
                onEditSchedule={
                  basket.scheduleType === "recurring"
                    ? () => handleEditSchedule(basket.id)
                    : undefined
                }
                onReschedule={
                  basket.scheduleType === "one_time"
                    ? () => handleReschedule(basket.id)
                    : undefined
                }
                onPauseBasket={() => handlePauseBasket(basket.id)}
                onDelete={() => handleDeleteClick(basket)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Paused Baskets */}
      {pausedBaskets.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {t("baskets.pausedBaskets")}
          </h2>
          <div className="space-y-4">
            {pausedBaskets.map((basket) => (
              <BasketCard
                key={basket.id}
                basket={basket}
                onViewDetails={() => handleViewDetails(basket.id)}
                onEditItems={() => handleEditItems(basket.id)}
                onResumeBasket={() => handleResumeBasket(basket.id)}
                onDelete={() => handleDeleteClick(basket)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredBaskets.length === 0 && (
        <div className="py-14 text-center text-gray-500">
          {t("baskets.noBasketsFound")}
        </div>
      )}

      {/* Delete Basket Popup */}
      <DeleteBasketPopup
        isOpen={deletePopupOpen}
        basket={basketToDelete}
        onClose={handleDeleteClose}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
