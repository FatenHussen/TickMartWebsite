import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import OrderSearchBar from "../components/OrderSearchBar";
import OrderFilters from "../components/OrderFilters";
import OrderStatusTags from "../components/OrderStatusTags";
import OrderCard from "../components/OrderCard";
import { mockOrders } from "../data/mockData";
import type { OrderStatus } from "../types";

export default function MyOrders() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<OrderStatus | "all">("all");
  const [sortBy, setSortBy] = useState("Newest");

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
    if (sortBy === "Newest") {
      orders = [...orders].sort((a, b) => {
        // Sort by date (newest first) - simplified for demo
        return b.id > a.id ? 1 : -1;
      });
    }

    return orders;
  }, [activeFilter, searchQuery, sortBy]);

  // Extract status tags from orders
  const statusTags = useMemo(() => {
    return mockOrders.slice(0, 4).map((order) => ({
      orderNumber: order.orderNumber,
      status: order.status,
    }));
  }, []);

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

  const handleTagClick = (orderNumber: string) => {
    // TODO: Scroll to or highlight order
    console.log("Tag clicked:", orderNumber);
  };

  return (
    <div
      className="min-h-screen bg-custom-tertiary"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-custom-primary mb-2">
            {t("orders.myOrders")}
          </h1>
          <p className="text-sm text-custom-secondary">
            {t("orders.myOrdersDescription")}
          </p>
        </div>

        {/* Search Bar and Filters Row */}
        <div className="bg-custom-primary p-4 rounded-lg mb-4 border border-custom-secondary flex flex-col lg:flex-row gap-4 items-start lg:items-center">
          <div className="flex-1 w-full lg:w-auto min-w-0">
            <OrderSearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder={t("orders.searchPlaceholder")}
            />
          </div>
          <div className="w-full lg:w-auto shrink-0">
            <OrderFilters
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />
          </div>
        </div>

        {/* Status Tags */}
        <div className="mb-6">
          <OrderStatusTags tags={statusTags} onTagClick={handleTagClick} />
        </div>

        {/* Order Cards Grid */}
        {filteredOrders.length === 0 ? (
          <div className="py-14 text-center text-custom-secondary">
            {t("orders.noOrdersFound")}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
