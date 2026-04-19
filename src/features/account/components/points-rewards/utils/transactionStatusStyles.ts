export function getTransactionStatusBadgeClass(status: string): string {
    switch (status) {
        case "earned":
            return "bg-[var(--color-ui-green-100)] text-[var(--color-ui-green-700)] dark:bg-[color-mix(in_srgb,var(--color-ui-green-900)_30%,transparent)] dark:text-[var(--color-ui-green-400)]";
        case "redeemed":
            return "bg-[var(--color-ui-red-100)] text-[var(--color-ui-red-700)] dark:bg-[color-mix(in_srgb,var(--color-ui-red-900)_30%,transparent)] dark:text-[var(--color-ui-red-400)]";
        case "expired":
            return "bg-[var(--color-ui-orange-100)] text-[var(--color-ui-orange-700)] dark:bg-[color-mix(in_srgb,var(--color-ui-orange-900)_30%,transparent)] dark:text-[var(--color-ui-orange-400)]";
        default:
            return "bg-custom-tertiary text-custom-primary";
    }
}
