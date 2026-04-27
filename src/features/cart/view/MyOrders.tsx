import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { HiOutlineShoppingBag, HiOutlineInbox } from "react-icons/hi";
import { useLanguage } from "@/context/LanguageContext";
import OrderSearchBar from "../components/OrderSearchBar";
import OrderFilters from "../components/OrderFilters";
import OrderStatusTags from "../components/OrderStatusTags";
import OrderCard from "../components/OrderCard";
import { mockOrders } from "../data/mockData";
import type { OrderStatus } from "../types";

type OrdersStat = {
    key: OrderStatus | "all";
    labelKey: string;
    fallback: string;
    count: number;
    accent: string;
};

export default function MyOrders() {
    const { t } = useTranslation();
    const { isRTL } = useLanguage();
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState<OrderStatus | "all">("all");
    const [sortBy, setSortBy] = useState("Newest");

    const filteredOrders = useMemo(() => {
        let orders = mockOrders;

        if (activeFilter !== "all") {
            orders = orders.filter((order) => order.status === activeFilter);
        }

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            orders = orders.filter(
                (order) =>
                    order.orderNumber.toLowerCase().includes(query) ||
                    order.items.some(
                        (item) =>
                            item.name.toLowerCase().includes(query) ||
                            item.store.toLowerCase().includes(query),
                    ),
            );
        }

        if (sortBy === "Newest") {
            orders = [...orders].sort((a, b) =>
                b.id > a.id ? 1 : -1,
            );
        }

        return orders;
    }, [activeFilter, searchQuery, sortBy]);

    const statusTags = useMemo(
        () =>
            mockOrders.slice(0, 4).map((order) => ({
                orderNumber: order.orderNumber,
                status: order.status,
            })),
        [],
    );

    const stats: OrdersStat[] = useMemo(() => {
        const counts = mockOrders.reduce<Record<string, number>>(
            (acc, order) => {
                acc[order.status] = (acc[order.status] ?? 0) + 1;
                return acc;
            },
            {},
        );
        const active =
            (counts.pending ?? 0) +
            (counts.preparing ?? 0) +
            (counts.out_for_delivery ?? 0);
        return [
            {
                key: "all",
                labelKey: "orders.statTotal",
                fallback: "Total",
                count: mockOrders.length,
                accent: "var(--color-main)",
            },
            {
                key: "preparing",
                labelKey: "orders.statActive",
                fallback: "Active",
                count: active,
                accent: "var(--color-api-second)",
            },
            {
                key: "delivered",
                labelKey: "orders.statDelivered",
                fallback: "Delivered",
                count: counts.delivered ?? 0,
                accent: "var(--color-success)",
            },
            {
                key: "cancelled",
                labelKey: "orders.statCancelled",
                fallback: "Cancelled",
                count: counts.cancelled ?? 0,
                accent: "var(--color-error)",
            },
        ];
    }, []);

    const handleViewDetails = (orderId: number | string) => {
        console.log("View details:", orderId);
    };

    const handleTrackOrder = (orderId: number | string) => {
        console.log("Track order:", orderId);
    };

    const handleReorder = (orderId: number | string) => {
        console.log("Reorder:", orderId);
    };

    const handleAddComplaint = (orderId: number | string) => {
        console.log("Add complaint:", orderId);
    };

    const handleTagClick = (orderNumber: string) => {
        console.log("Tag clicked:", orderNumber);
    };

    return (
        <div
            className="min-h-screen bg-custom-tertiary"
            dir={isRTL ? "rtl" : "ltr"}
        >
            <div className="page-container py-5 sm:py-8 space-y-5 sm:space-y-6">
                {/* Header */}
                <header className="space-y-4">
                    <div>
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[color:var(--color-text)]">
                            {t("orders.myOrders")}
                        </h1>
                        <p className="mt-1 text-sm text-custom-secondary">
                            {t("orders.myOrdersDescription")}
                        </p>
                    </div>

                    {/* Quick stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                        {stats.map((stat) => {
                            const isActive = activeFilter === stat.key;
                            return (
                                <button
                                    key={stat.key}
                                    type="button"
                                    onClick={() => setActiveFilter(stat.key)}
                                    className={[
                                        "group relative overflow-hidden rounded-2xl",
                                        "p-3 sm:p-4 text-start",
                                        "border transition-all duration-200",
                                        "bg-custom-card",
                                        isActive
                                            ? "border-[color:color-mix(in_srgb,var(--color-main)_45%,transparent)] shadow-[0_4px_20px_-4px_color-mix(in_srgb,var(--color-main)_18%,transparent)]"
                                            : "border-custom-primary hover:-translate-y-0.5 hover:border-[color:color-mix(in_srgb,var(--color-main)_35%,transparent)] hover:shadow-sm",
                                    ].join(" ")}
                                >
                                    <span
                                        className="absolute inset-y-0 start-0 w-1"
                                        style={{ background: stat.accent }}
                                        aria-hidden
                                    />
                                    <div className="ps-2">
                                        <p className="text-[10px] sm:text-xs font-medium uppercase tracking-wide text-[color:var(--color-text)]/60 truncate">
                                            {t(stat.labelKey, stat.fallback)}
                                        </p>
                                        <p
                                            className="mt-1 text-xl sm:text-2xl font-bold tabular-nums"
                                            style={{ color: stat.accent }}
                                        >
                                            {stat.count}
                                        </p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </header>

                {/* Toolbar: search + filters */}
                <section
                    className="rounded-2xl bg-custom-card border border-custom-primary shadow-sm p-3 sm:p-5 space-y-3 sm:space-y-4"
                >
                    <div className="flex flex-col lg:flex-row gap-3 lg:items-center">
                        <div className="flex-1 min-w-0">
                            <OrderSearchBar
                                value={searchQuery}
                                onChange={setSearchQuery}
                                placeholder={t("orders.searchPlaceholder")}
                            />
                        </div>
                    </div>
                    <OrderFilters
                        activeFilter={activeFilter}
                        onFilterChange={setActiveFilter}
                        sortBy={sortBy}
                        onSortChange={setSortBy}
                    />
                </section>

                {/* Status quick tags */}
                {statusTags.length > 0 && (
                    <section aria-label="Recent orders">
                        <p className="text-xs font-semibold text-custom-tertiary uppercase tracking-wide mb-2">
                            {t("orders.recentOrders", "Recent orders")}
                        </p>
                        <OrderStatusTags
                            tags={statusTags}
                            onTagClick={handleTagClick}
                        />
                    </section>
                )}

                {/* Results header */}
                <div className="flex items-center justify-between">
                    <p className="text-sm text-custom-secondary">
                        <span className="font-semibold text-[color:var(--color-text)] tabular-nums">
                            {filteredOrders.length}
                        </span>{" "}
                        {t("orders.resultsCount", "results")}
                    </p>
                </div>

                {/* Orders grid / empty state */}
                {filteredOrders.length === 0 ? (
                    <EmptyState
                        title={t("orders.noOrdersFound")}
                        subtitle={t(
                            "orders.noOrdersFoundDescription",
                            "Try adjusting your search or filters.",
                        )}
                        cleared={!!searchQuery || activeFilter !== "all"}
                        onClear={() => {
                            setSearchQuery("");
                            setActiveFilter("all");
                        }}
                    />
                ) : (
                    <div className="group/grid grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
                        {filteredOrders.map((order) => (
                            <div key={order.id} className="group">
                                <OrderCard
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
                                            ? () =>
                                                  handleViewDetails(order.id)
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
                                            ? () =>
                                                  handleAddComplaint(order.id)
                                            : undefined
                                    }
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

type EmptyStateProps = {
    title: string;
    subtitle: string;
    cleared: boolean;
    onClear: () => void;
};

function EmptyState({ title, subtitle, cleared, onClear }: EmptyStateProps) {
    const { t } = useTranslation();
    return (
        <div className="rounded-2xl bg-custom-card border border-custom-primary py-14 px-6 text-center">
            <div
                className="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                style={{
                    background:
                        "color-mix(in srgb, var(--color-main) 12%, var(--color-bg-card))",
                    color: "var(--color-main)",
                }}
            >
                {cleared ? (
                    <HiOutlineInbox className="w-8 h-8" />
                ) : (
                    <HiOutlineShoppingBag className="w-8 h-8" />
                )}
            </div>
            <h3 className="text-base font-semibold text-[color:var(--color-text)] mb-1">
                {title}
            </h3>
            <p className="text-sm text-custom-secondary max-w-sm mx-auto">
                {subtitle}
            </p>
            {cleared && (
                <button
                    type="button"
                    onClick={onClear}
                    className="mt-5 inline-flex items-center px-4 py-2 rounded-full text-xs font-semibold text-custom-inverse bg-[color:var(--color-api-second)] hover:bg-[color:var(--color-api-second-hover)] transition-colors"
                >
                    {t("orders.clearFilters", "Clear filters")}
                </button>
            )}
        </div>
    );
}
