import { useTranslation } from "react-i18next";
import { Bell } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { ENABLE_PUSH_BUTTON_CLASSES } from "../constants";

interface PushSettingsPanelProps {
  permission: NotificationPermission | null;
  fcmSupported: boolean | null;
  isRequestingToken: boolean;
  onEnablePush: () => void;
}

export function PushSettingsPanel({
  permission,
  fcmSupported,
  isRequestingToken,
  onEnablePush,
}: PushSettingsPanelProps) {
  const { t } = useTranslation();

  const showNotSupported = fcmSupported === false;
  const showDenied = permission === "denied";
  const showGranted = permission === "granted";
  const showEnableButton =
    permission !== "granted" && permission !== "denied" && fcmSupported !== false;

  const enableButtonLabel = isRequestingToken
    ? t("common.loading", "Loading...")
    : t("account.notificationsPage.enableNotifications");

  return (
    <div
      className={cn(
        "account-shell relative overflow-hidden rounded-2xl border border-[var(--color-border-primary)] p-5",
        "bg-[linear-gradient(145deg,color-mix(in_srgb,var(--color-bg-card)_94%,var(--color-api-second))_0%,var(--color-bg-card)_100%)]",
        "shadow-[0_4px_24px_-8px_var(--color-shadow)]",
      )}
    >
      <div
        className="pointer-events-none absolute -end-16 -top-20 h-40 w-40 rounded-full bg-[var(--color-api-second)] opacity-[0.1] blur-3xl"
        aria-hidden
      />
      <div className="relative flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[color-mix(in_srgb,var(--color-api-second)_22%,var(--color-bg-card))] text-[var(--color-api-second)] shadow-sm">
          <Bell className="h-5 w-5" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="mb-1 text-sm font-semibold text-custom-primary">
            {t("account.notificationsPage.pushSettings")}
          </h3>
          <p className="mb-3 text-xs leading-relaxed text-custom-secondary">
            {t("account.notificationsPage.enablePushDesc")}
          </p>

          {showNotSupported && (
            <p className="text-xs text-warning dark:text-warning">
              {t("account.notificationsPage.notSupported")}
            </p>
          )}

          {showDenied && (
            <p className="text-xs text-error">{t("account.notificationsPage.denied")}</p>
          )}

          {showGranted && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-success" />
              <span className="text-xs font-medium text-success">
                {t("account.notificationsPage.tokenReady")}
              </span>
            </div>
          )}

          {showEnableButton && (
            <button
              type="button"
              onClick={onEnablePush}
              disabled={isRequestingToken}
              className={ENABLE_PUSH_BUTTON_CLASSES}
            >
              {enableButtonLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
