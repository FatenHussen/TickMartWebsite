import type { AffiliateInfo, User } from "@/store/auth";
import { useAuthStore } from "@/store/auth";

/**
 * Approved marketer = both flags true (admin upgrade + approval).
 * Do not infer from route, page title, or zeroed dashboard stats.
 */
export function isApprovedMarketer(
    user: Pick<User, "affiliate"> | null | undefined,
): boolean {
    const affiliate = user?.affiliate;
    return affiliate?.is_affiliate === true && affiliate?.approved === true;
}

export function isAffiliateNotAuthorizedError(error: unknown): boolean {
    const status = (error as { response?: { status?: number } })?.response
        ?.status;
    return status === 403;
}

/** Clear local approval so UI falls back to "Become a marketer". */
export function demoteLocalAffiliateApproval(): void {
    const { user, setUser } = useAuthStore.getState();
    if (!user?.affiliate) {
        if (user) {
            setUser({
                ...user,
                affiliate: {
                    is_affiliate: false,
                    approved: false,
                    affiliate_id: null,
                    coupon_id: null,
                    rate: null,
                },
            });
        }
        return;
    }

    setUser({
        ...user,
        affiliate: {
            ...user.affiliate,
            approved: false,
            affiliate_id: null,
        },
    });
}

export type { AffiliateInfo };
