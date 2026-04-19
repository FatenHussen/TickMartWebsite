import type { IconType } from "react-icons";

export type RewardCategory = "discount" | "delivery" | "gift";

export type RewardItem = {
    id: string;
    category: RewardCategory;
    icon: IconType;
    title: string;
    description?: string;
    detailLabel?: string;
    /** Minimum points needed to redeem this item (used for affordability). */
    cost: number;
    /** Pretty-printed cost (e.g. "100–500 pts" or "200 pts"). */
    costLabel: string;
    /** What the user receives in plain language. */
    rewardLabel: string;
    actionLabel: string;
    isPending: boolean;
    isAvailable: boolean;
    onAction?: () => void;
};
