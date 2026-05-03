import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/shared/lib/utils";
import { useAuthStore } from "@/store/auth";
import AccountSidebar from "../components/AccountSidebar";
import MobileAccountMenu from "../components/MobileAccountMenu";
import { useAccountDarkScopeStyle } from "../hooks/useAccountDarkScopeStyle";
import { useProfile } from "../hooks/useProfile";

export default function AccountLayout() {
  const { isRTL } = useLanguage();
  const { theme } = useTheme();
  const { data: profileData } = useProfile();
  const { user: authUser } = useAuthStore();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const accountDarkScopeStyle = useAccountDarkScopeStyle();

  const user = profileData
    ? {
        fullName: profileData.name,
        email: profileData.email ?? authUser?.email ?? "",
        avatar: profileData.image || undefined,
      }
    : undefined;

  const sidebarWidth = isCollapsed
    ? "w-[72px]"
    : "w-[min(280px,28vw)] xl:w-[280px]";

  return (
    <div
      className={cn(
        "flex min-h-0 w-full max-w-none flex-1 flex-col pb-[env(safe-area-inset-bottom,0px)]",
        theme === "dark" && "dark",
      )}
      style={accountDarkScopeStyle}
    >
      {/* Mobile header */}
      <div className="px-3 pt-3 pb-2 sm:px-5 sm:pt-4 sm:pb-3 lg:hidden">
        <MobileAccountMenu user={user} />
      </div>

      {/* Desktop: sticky collapsible sidebar + main content */}
      <div
        className={cn(
          "relative hidden w-full items-start lg:flex",
          isRTL ? "flex-row-reverse" : "flex-row"
        )}
      >
        <aside
          className={cn(
            "flex shrink-0 flex-col self-start overflow-hidden",
            "lg:sticky lg:top-0 lg:z-20",
            "h-screen",
            "transition-[width] duration-300 ease-in-out motion-reduce:transition-none",
            sidebarWidth,
            "ring-1 ring-inset ring-black/[0.04] dark:ring-white/[0.06]"
          )}
        >
          <AccountSidebar
            user={user}
            isCollapsed={isCollapsed}
            onToggle={setIsCollapsed}
          />
        </aside>

        <main
          className={cn(
            "min-w-0 flex-1",
            "bg-gradient-to-br from-[var(--color-bg-primary)] via-[color-mix(in_srgb,var(--color-api-second)_14%,var(--color-bg-primary))] to-[color-mix(in_srgb,var(--color-main)_12%,var(--color-bg-secondary))]",
            "py-5 sm:py-7 lg:py-10",
            "ps-4 pe-4 sm:ps-6 sm:pe-6 lg:ps-8 lg:pe-10 xl:ps-11 xl:pe-12"
          )}
        >
          <div className="mx-auto min-w-0 w-full max-w-6xl 2xl:max-w-[88rem]">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile content area */}
      <div className="flex min-h-0 flex-1 flex-col bg-gradient-to-b from-[var(--color-bg-primary)] to-[color-mix(in_srgb,var(--color-api-second)_10%,var(--color-bg-secondary))] px-3 py-4 sm:px-5 sm:py-5 lg:hidden">
        <div className="mx-auto min-w-0 w-full max-w-lg flex-1 sm:max-w-none">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
