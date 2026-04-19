import i18n from "@/i18n/config";

export function formatComplaintDate(createdAt: string): string {
    try {
        const d = new Date(createdAt);
        const locale = i18n.language === "ar" ? "ar" : "en-GB";
        return d.toLocaleDateString(locale, {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    } catch {
        return createdAt;
    }
}
