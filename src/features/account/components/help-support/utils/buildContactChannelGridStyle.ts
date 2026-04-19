import type { CSSProperties } from "react";

type AppColor = { main_color?: string; text_color?: string } | undefined;

/** Inline vars for contact card labels (API palette text color). */
export function buildContactChannelGridStyle(appColor: AppColor): CSSProperties | undefined {
    if (!appColor) return undefined;
    return {
        ["--contact-text" as string]: appColor.text_color ?? "var(--color-text-primary)",
    };
}
