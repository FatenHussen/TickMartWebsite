/**
 * Commission earned on an order: total × rate% / 100.
 */
export function calculateOrderAffiliateCommission(
    orderTotal: number,
    affiliateRatePercent: number,
): number {
    return (orderTotal * affiliateRatePercent) / 100;
}
