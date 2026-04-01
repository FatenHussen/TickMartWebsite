import { Link } from "react-router-dom";
import { HiOutlineClock } from "react-icons/hi";
import { FaStar } from "react-icons/fa";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/shared/lib/utils";
import Button from "@/shared/ui/Button";
// import ReviewPointsSummary from "./ReviewPointsSummary";
import PeanutButton from "./PeanutButton";
import type { ReviewOrderSummary } from "../types";

type ReviewDeliveryDetailsSidebarProps = {
    summary: ReviewOrderSummary;
    onConfirmOrder: () => void;
    isLoading?: boolean;
};

export default function ReviewDeliveryDetailsSidebar({
    summary,
    onConfirmOrder,
    isLoading = false,
}: ReviewDeliveryDetailsSidebarProps) {
    const { isRTL } = useLanguage();

    return (
        <div className="sticky top-4" dir={isRTL ? "rtl" : "ltr"}>
            <div className="overflow-visible rounded-[24px] border border-[#F5F1B8] bg-[linear-gradient(180deg,#FBFBE4_0%,#FFFAB6_100%)] px-6 pb-8 pt-0 shadow-[0_0_22px_rgba(255,231,94,0.22)]">
                <div className="relative h-[38px]">
                    <div className="absolute left-1/2 top-0 z-10 w-[min(100%,200px)] -translate-x-1/2 -translate-y-1/2">
                        <PeanutButton className="mx-auto min-h-[56px] max-w-[174px]">
                            <h2 className="whitespace-nowrap text-[17px] font-black leading-none text-black">
                                Delivery Details
                            </h2>
                        </PeanutButton>
                    </div>
                </div>

                <div className="space-y-6 pt-5">
                    <div className="space-y-5">
                        <SummaryRow label="Num of Items" value={summary.numOfItems} />
                        <SummaryRow label="Subtotal" value={summary.subtotal} />
                        <SummaryRow label="Shipping" value={summary.shipping} color="green" />
                        <SummaryRow label="Discounts" value={summary.discounts} color="green" />
                        <SummaryRow label="Tax" value={summary.tax} color="green" />
                        <SummaryRow
                            label="Coupon discount"
                            value={summary.couponDiscount}
                            color={summary.couponDiscount.trim().startsWith("-") ? "green" : "muted"}
                        />
                        {summary.subscriptionDiscount != null && (
                            <SummaryRow
                                label="Subscription discount"
                                value={summary.subscriptionDiscount}
                                color="green"
                            />
                        )}
                        {summary.promotionDiscount != null && (
                            <SummaryRow
                                label="Promotion discount"
                                value={summary.promotionDiscount}
                                color="green"
                            />
                        )}
                        <SummaryRow
                            label={`Points redeemed (${summary.pointsRedeemed} pts)`}
                            value={`- ${summary.pointsValue}`}
                            color="green"
                            labelClassName="text-[15px]"
                        />
                    </div>

                    <div className="border-t border-[#E8D748] pt-6">
                        <div className="flex items-center justify-between gap-4">
                            <span className="text-[18px] font-bold leading-none text-[#1F2937]">
                                Total to pay
                            </span>
                            <span className="text-[24px] font-bold leading-none text-[#1DB5E8]">
                                {summary.total}
                            </span>
                        </div>
                    </div>

                    <div className="rounded-[14px] bg-[#EEF1F2] px-4 py-3">
                        <div className="flex items-center gap-2 text-[13px] font-medium text-[#6B7280]">
                            <HiOutlineClock className="h-4 w-4 shrink-0 text-[#617BFF]" />
                            <span>Estimated delivery: {summary.estimatedDelivery}</span>
                        </div>
                        <div className="mt-2 flex items-center gap-2 text-[14px] font-medium text-[#27AE60]">
                            <FaStar className="h-4 w-4 shrink-0 text-[#27AE60]" />
                            <span>You'll earn {summary.pointsEarned} points</span>
                        </div>
                    </div>

                    <div className="space-y-4 pt-1">
                        <Button
                            type="button"
                            variant="primary"
                            size="lg"
                            fullWidth
                            disabled={isLoading}
                            onClick={onConfirmOrder}
                            className="min-h-[58px] rounded-[18px] border-0 px-6 py-4 text-[17px] font-semibold text-white shadow-[0_10px_24px_rgba(44,128,144,0.25)]"
                            style={{
                                background:
                                    "linear-gradient(180deg, #4CDAF6 0%, #2C8090 100%)",
                            }}
                        >
                            Confirm Order
                        </Button>

                        <Link
                            to="/cart/checkout"
                            className="block text-center text-[17px] font-medium text-[#1F1F1F] underline underline-offset-2"
                        >
                            Back to checkout
                        </Link>
                    </div>
                </div>
            </div>

            <div className="pt-4">
                {/* <ReviewPointsSummary
                    pointsBefore={summary.pointsBefore}
                    pointsUsed={summary.pointsRedeemed}
                    pointsEarned={summary.pointsEarned}
                    pointsNewBalance={summary.pointsNewBalance}
                    pointsSavings={summary.pointsSavings}
                /> */}
            </div>
        </div>
    );
}

type SummaryRowProps = {
    label: string;
    value: string | number;
    color?: "green" | "default" | "muted";
    labelClassName?: string;
};

function SummaryRow({
    label,
    value,
    color = "default",
    labelClassName,
}: SummaryRowProps) {
    return (
        <div className="flex items-center justify-between gap-4">
            <span
                className={cn(
                    "text-[16px] font-normal leading-none text-[#2F2F2F]",
                    labelClassName,
                )}
            >
                {label}
            </span>
            <span
                className={cn(
                    "text-right text-[16px] font-medium leading-none",
                    color === "green" && "text-[#27AE60]",
                    color === "muted" && "text-[#9CA3AF]",
                    color === "default" && "text-[#2F2F2F]",
                )}
            >
                {value}
            </span>
        </div>
    );
}
