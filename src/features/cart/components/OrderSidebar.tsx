import { useTranslation } from "react-i18next";
import {
    HiOutlineUser,
    HiOutlinePhone,
    HiOutlineLocationMarker,
    HiOutlineClock,
    HiOutlineCreditCard,
} from "react-icons/hi";
import {
    HiOutlineReceiptPercent,
    HiOutlineExclamationCircle,
} from "react-icons/hi2";
import type { ComponentType, ReactNode, SVGProps } from "react";

type OrderSidebarProps = {
    priceSummary: {
        numOfItems: number;
        subtotal: string;
        shipping: string;
        shippingIsFree: boolean;
        storeDiscounts: string;
        tax: string;
        couponDiscount: string;
        total: string;
    };
    delivery: {
        fullName: string;
        phoneNumber: string;
        address: string;
        eta: string;
        message?: string;
    };
    payment: {
        method: "cash_on_delivery" | "credit_card" | "paypal";
        /** Display name from API (e.g. "MTN Cash", "Cash on Delivery") */
        name: string;
        description: string;
    };
    onTrackOnMap?: () => void;
};

/** Payment can be omitted when API returns null */
export type OrderSidebarPayment = OrderSidebarProps["payment"];

export default function OrderSidebar({
    priceSummary,
    delivery,
    payment,
}: OrderSidebarProps) {
    return (
        <div className="space-y-4">
            <OrderSummaryCard priceSummary={priceSummary} />
            <DeliveryDetailsCard delivery={delivery} />
            <PaymentMethodCard payment={payment} />
        </div>
    );
}

type SidebarCardProps = {
    title: string;
    icon: ComponentType<SVGProps<SVGSVGElement>>;
    children: ReactNode;
};

function SidebarCard({ title, icon: Icon, children }: SidebarCardProps) {
    return (
        <div className="rounded-2xl bg-custom-card border border-custom-primary shadow-sm overflow-hidden transition-shadow hover:shadow-md">
            <div className="flex items-center gap-2.5 px-4 sm:px-5 py-3 sm:py-4 border-b border-custom-primary">
                <div
                    className="flex h-8 w-8 items-center justify-center rounded-lg"
                    style={{
                        background:
                            "color-mix(in srgb, var(--color-main) 12%, var(--color-bg-card))",
                        color: "var(--color-main)",
                    }}
                >
                    <Icon className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-semibold text-[color:var(--color-text)]">
                    {title}
                </h3>
            </div>
            <div className="px-4 sm:px-5 py-4">{children}</div>
        </div>
    );
}

type OrderSummaryCardProps = {
    priceSummary: OrderSidebarProps["priceSummary"];
};

function OrderSummaryCard({ priceSummary }: OrderSummaryCardProps) {
    const { t } = useTranslation();
    const hasDiscount = priceSummary.storeDiscounts.startsWith("-");
    const hasCoupon = priceSummary.couponDiscount.startsWith("-");

    return (
        <SidebarCard
            title={t("orders.orderSummary", "Order Summary")}
            icon={HiOutlineReceiptPercent}
        >
            <div className="space-y-2.5 text-sm">
                <SummaryRow
                    label={t("orders.numOfItems", "Items")}
                    value={priceSummary.numOfItems}
                />
                <SummaryRow
                    label={t("orders.subtotal", "Subtotal")}
                    value={priceSummary.subtotal}
                />
                <SummaryRow
                    label={t("orders.shipping", "Shipping")}
                    value={priceSummary.shipping}
                    accent={priceSummary.shippingIsFree ? "success" : undefined}
                />
                {hasDiscount && (
                    <SummaryRow
                        label={t("orders.storeDiscounts", "Store discounts")}
                        value={priceSummary.storeDiscounts}
                        accent="success"
                    />
                )}
                {hasCoupon && (
                    <SummaryRow
                        label={t("orders.couponDiscount", "Coupon discount")}
                        value={priceSummary.couponDiscount}
                        accent="success"
                    />
                )}
            </div>

            <div className="flex items-baseline justify-between mt-4 pt-4 border-t border-dashed border-custom-primary">
                <span className="text-sm font-semibold text-[color:var(--color-text)]">
                    {t("orders.total", "Total")}
                </span>
                <span className="text-2xl font-bold text-[color:var(--color-main)]">
                    {priceSummary.total}
                </span>
            </div>
        </SidebarCard>
    );
}

type DeliveryDetailsCardProps = {
    delivery: OrderSidebarProps["delivery"];
};

function DeliveryDetailsCard({ delivery }: DeliveryDetailsCardProps) {
    const { t } = useTranslation();
    return (
        <SidebarCard
            title={t("orders.deliveryDetails", "Delivery Details")}
            icon={HiOutlineLocationMarker}
        >
            <div className="space-y-3 text-sm">
                <DetailRow
                    icon={HiOutlineUser}
                    label={t("orders.fullName", "Full Name")}
                    value={delivery.fullName}
                />
                <DetailRow
                    icon={HiOutlinePhone}
                    label={t("orders.phoneNumber", "Phone")}
                    value={delivery.phoneNumber}
                />
                <DetailRow
                    icon={HiOutlineLocationMarker}
                    label={t("orders.address", "Address")}
                    value={delivery.address}
                    multiline
                />
                <DetailRow
                    icon={HiOutlineClock}
                    label={t("orders.eta", "ETA")}
                    value={delivery.eta}
                />
            </div>

            {delivery.message && (
                <div
                    className="mt-4 flex items-start gap-2 p-3 rounded-xl text-xs"
                    style={{
                        backgroundColor: "var(--color-ui-amber-50)",
                        border: "1px solid var(--color-ui-amber-200)",
                        color: "var(--color-ui-amber-900)",
                    }}
                >
                    <HiOutlineExclamationCircle
                        className="w-4 h-4 shrink-0 mt-0.5"
                        style={{ color: "var(--color-ui-amber-400)" }}
                    />
                    <span className="leading-relaxed">{delivery.message}</span>
                </div>
            )}
        </SidebarCard>
    );
}

type PaymentMethodCardProps = {
    payment: OrderSidebarProps["payment"];
};

function PaymentMethodCard({ payment }: PaymentMethodCardProps) {
    const { t } = useTranslation();
    return (
        <SidebarCard
            title={t("orders.paymentMethod", "Payment Method")}
            icon={HiOutlineCreditCard}
        >
            <div className="flex items-center gap-3">
                <div
                    className="w-12 h-12 shrink-0 rounded-xl flex items-center justify-center text-custom-inverse"
                    style={{
                        background:
                            "linear-gradient(135deg, var(--color-main) 0%, var(--color-api-second) 100%)",
                        boxShadow:
                            "0 4px 12px -4px color-mix(in srgb, var(--color-main) 40%, transparent)",
                    }}
                >
                    <HiOutlineCreditCard className="w-6 h-6" />
                </div>
                <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[color:var(--color-text)] truncate">
                        {payment.name}
                    </p>
                    <p className="text-xs text-custom-tertiary leading-snug">
                        {payment.description}
                    </p>
                </div>
            </div>
        </SidebarCard>
    );
}

type SummaryRowProps = {
    label: string;
    value: string | number;
    accent?: "success" | "danger";
};

function SummaryRow({ label, value, accent }: SummaryRowProps) {
    const colorVar =
        accent === "success"
            ? "var(--color-success)"
            : accent === "danger"
              ? "var(--color-error)"
              : undefined;

    return (
        <div className="flex items-center justify-between gap-3">
            <span className="text-custom-secondary">{label}</span>
            <span
                className="font-semibold text-[color:var(--color-text)] tabular-nums"
                style={colorVar ? { color: colorVar } : undefined}
            >
                {value}
            </span>
        </div>
    );
}

type DetailRowProps = {
    icon: ComponentType<SVGProps<SVGSVGElement>>;
    label: string;
    value: string;
    multiline?: boolean;
};

function DetailRow({
    icon: Icon,
    label,
    value,
    multiline = false,
}: DetailRowProps) {
    return (
        <div className="flex items-start gap-3">
            <Icon className="w-4 h-4 mt-0.5 shrink-0 text-custom-tertiary" />
            <div className="min-w-0 flex-1">
                <div className="text-[11px] uppercase tracking-wide text-custom-tertiary font-medium">
                    {label}
                </div>
                <div
                    className={`text-sm font-medium text-[color:var(--color-text)] ${
                        multiline ? "leading-snug" : "truncate"
                    }`}
                >
                    {value}
                </div>
            </div>
        </div>
    );
}
