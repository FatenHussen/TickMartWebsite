export interface QuickActionItem {
    id: number;
    title: string;
    page_id: number;
    page_slug: string;
    page_title: string;
    icon: string;
    order: number;
}

export interface QuickActionsApiResponse {
    status: boolean;
    message: string;
    data: QuickActionItem[];
}
