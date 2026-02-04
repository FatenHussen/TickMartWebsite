import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { HiSearch } from "react-icons/hi";
import { cn } from "@/shared/lib/utils";
import OrderCard from "@/features/cart/components/OrderCard";
import { mockOrders } from "@/features/cart/data/mockData";
import type { OrderStatus } from "@/features/cart/types";

export default function MyOrders() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<OrderStatus | "all">("all");
  const [sortBy, setSortBy] = useState("newest");

  const filteredOrders = useMemo(() => {
    let orders = mockOrders;

    // Filter by status
    if (activeFilter !== "all") {
      orders = orders.filter((order) => order.status === activeFilter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      orders = orders.filter(
        (order) =>
          order.orderNumber.toLowerCase().includes(query) ||
          order.items.some(
            (item) =>
              item.name.toLowerCase().includes(query) ||
              item.store.toLowerCase().includes(query)
          )
      );
    }

    // Sort orders
    if (sortBy === "newest") {
      orders = [...orders].sort((a, b) => {
        return b.id > a.id ? 1 : -1;
      });
    } else if (sortBy === "oldest") {
      orders = [...orders].sort((a, b) => {
        return a.id > b.id ? 1 : -1;
      });
    }

    return orders;
  }, [activeFilter, searchQuery, sortBy]);

  const handleViewDetails = (orderId: number | string) => {
    // TODO: Navigate to order details
    console.log("View details:", orderId);
  };

  const handleTrackOrder = (orderId: number | string) => {
    // TODO: Navigate to track order
    console.log("Track order:", orderId);
  };

  const handleReorder = (orderId: number | string) => {
    // TODO: Reorder logic
    console.log("Reorder:", orderId);
  };

  const handleAddComplaint = (orderId: number | string) => {
    // TODO: Add complaint logic
    console.log("Add complaint:", orderId);
  };

  const handleCancelOrder = (orderId: number | string) => {
    // TODO: Cancel order logic
    console.log("Cancel order:", orderId);
  };

  const filterButtons: { value: OrderStatus | "all"; label: string }[] = [
    { value: "all", label: t("orders.all") },
    { value: "pending", label: t("orders.pending") },
    { value: "preparing", label: t("orders.preparing") },
    { value: "out_for_delivery", label: t("orders.out_for_delivery") },
    { value: "delivered", label: t("orders.delivered") },
    { value: "cancelled", label: t("orders.cancelled") },
  ];

  const sortOptions = [
    { value: "newest", label: t("orders.newest") },
    { value: "oldest", label: t("orders.oldest") },
    { value: "amount_high", label: t("orders.amountHighToLow") },
    { value: "amount_low", label: t("orders.amountLowToHigh") },
  ];

  return (
    <div className="space-y-6" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary mb-2">
          {t("orders.myOrders")}
        </h1>
        <p className="text-text-secondary text-sm">
          {t("orders.myOrdersDescription")}
        </p>
      </div>

      {/* Search Bar and Filters */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        {/* Search Bar */}
        <div className="flex-1">
          <div className="relative">
            <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-secondary" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("orders.searchPlaceholder")}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* Sort Dropdown */}
        <div className="lg:w-auto">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {t("orders.sortBy")}: {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filterButtons.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setActiveFilter(filter.value)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all",
              activeFilter === filter.value
                ? "bg-primary text-white"
                : "bg-white text-text-secondary border border-gray-200 hover:border-primary"
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Order Cards */}
      {filteredOrders.length === 0 ? (
        <div className="py-14 text-center text-text-secondary">
          {t("orders.noOrdersFound")}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              orderNumber={order.orderNumber}
              status={order.status}
              dateTime={order.dateTime}
              items={order.items}
              additionalInfo={order.additionalInfo}
              deliveryAddress={order.deliveryAddress}
              total={order.total}
              paymentMethod={order.paymentMethod}
              refundStatus={order.refundStatus}
              onViewDetails={
                order.actions.viewDetails
                  ? () => handleViewDetails(order.id)
                  : undefined
              }
              onTrackOrder={
                order.actions.trackOrder
                  ? () => handleTrackOrder(order.id)
                  : undefined
              }
              onReorder={
                order.actions.reorder
                  ? () => handleReorder(order.id)
                  : undefined
              }
              onAddComplaint={
                order.actions.addComplaint
                  ? () => handleAddComplaint(order.id)
                  : undefined
              }
              onCancelOrder={
                order.status === "pending" || order.status === "preparing"
                  ? () => handleCancelOrder(order.id)
                  : undefined
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
