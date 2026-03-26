type OrderPriceSummaryProps = {
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
};

export default function OrderPriceSummary({
    priceSummary,
}: OrderPriceSummaryProps) {
    return (
        <div className="bg-custom-primary rounded-2xl border border-custom-secondary shadow-sm p-6 mb-6">
            <h3 className="text-base font-semibold text-custom-primary mb-4">
                Price Summary
            </h3>
            <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                    <span className="text-custom-secondary">Num of Items:</span>
                    <span className="font-medium text-custom-primary">
                        {priceSummary.numOfItems}
                    </span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-custom-secondary">Subtotal:</span>
                    <span className="font-medium text-custom-primary">
                        {priceSummary.subtotal}
                    </span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-custom-secondary">Shipping:</span>
                    <span
                        className={`font-medium ${priceSummary.shippingIsFree ? "" : "text-custom-primary"
                            }`}
                        style={
                            priceSummary.shippingIsFree
                                ? { color: "var(--color-green)" }
                                : undefined
                        }
                    >
                        {priceSummary.shipping}
                    </span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-custom-secondary">Store discounts:</span>
                    <span className="font-medium" style={{ color: "var(--color-green)" }}>
                        {priceSummary.storeDiscounts}
                    </span>
                </div>
                {/* <div className="flex items-center justify-between">
                    <span className="text-custom-secondary">Tax:</span>
                    <span className="font-medium" style={{ color: "var(--color-green)" }}>
                        {priceSummary.tax}
                    </span>
                </div> */}
                <div className="flex items-center justify-between">
                    <span className="text-custom-secondary">Coupon discount:</span>
                    <span className="font-medium text-custom-primary">
                        {priceSummary.couponDiscount}
                    </span>
                </div>
            </div>

            {/* Total */}
            <div
                className="flex items-center justify-between pt-4 mt-4 border-t"
                style={{ borderColor: "var(--color-accent-light)" }}
            >
                <span className="text-lg font-bold text-custom-primary">Total:</span>
                <span className="text-2xl font-bold text-custom-accent">
                    {priceSummary.total}
                </span>
            </div>
        </div>
    );
}
