import { useTranslation } from "react-i18next";
import { cn } from "@/shared/lib/utils";
import type { NotificationFilterTab } from "../types";
import type { NotificationFilterTabConfig } from "../utils/buildFilterTabs";

interface NotificationFilterTabsProps {
  tabs: NotificationFilterTabConfig[];
  activeTab: NotificationFilterTab;
  onTabChange: (tab: NotificationFilterTab) => void;
}

export function NotificationFilterTabs({
  tabs,
  activeTab,
  onTabChange,
}: NotificationFilterTabsProps) {
  const { t } = useTranslation();
  return (
    <div
      className={cn(
        "account-shell flex flex-wrap items-center gap-2 rounded-2xl border border-[var(--color-border-primary)] bg-[var(--color-bg-card)] p-1.5 shadow-[0_2px_12px_-4px_var(--color-shadow)] backdrop-blur-sm",
      )}
      role="tablist"
      aria-label={t("account.notificationsPage.filterAriaLabel")}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.value;
        const showCount = tab.count != null && tab.count > 0;

        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onTabChange(tab.value)}
            className={cn(
              "flex min-h-[40px] items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-medium transition-all sm:px-4",
              isActive
                ? "bg-primary text-white shadow-sm"
                : "text-custom-secondary hover:bg-custom-light/90 dark:hover:bg-bg-hover/70",
            )}
          >
            {tab.label}
            {showCount && (
              <span
                className={cn(
                  "min-w-[22px] rounded-full px-1.5 py-0.5 text-center text-[11px] font-semibold tabular-nums",
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-custom-tertiary text-custom-secondary",
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
