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

  const isDark = theme === "dark";

  return (
    <div
      data-account-creative-scope
      className={cn(
        "flex min-h-0 w-full max-w-none flex-1 flex-col pb-[env(safe-area-inset-bottom,0px)] lg:h-full lg:overflow-hidden",
        isDark && "dark",
      )}
      dir={isRTL ? "rtl" : "ltr"}
      style={accountDarkScopeStyle}
    >
      {isDark && <AccountDarkCreativeStyles />}

      {/* Mobile header */}
      <div className="px-3 pt-3 pb-2 sm:px-5 sm:pt-4 sm:pb-3 lg:hidden">
        <MobileAccountMenu user={user} />
      </div>

      {/* Desktop: outer-edge sidebar + scrolling main column */}
      <div className="relative hidden min-h-0 w-full flex-1 items-stretch lg:flex">
        <aside
          className={cn(
            "relative z-20 flex h-full shrink-0 flex-col overflow-visible",
            "transition-[width] duration-300 ease-in-out motion-reduce:transition-none",
            sidebarWidth,
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
            "min-h-0 min-w-0 flex-1 overflow-y-auto",
            "bg-gradient-to-br from-[var(--color-bg-primary)] via-[color-mix(in_srgb,var(--color-api-second)_14%,var(--color-bg-primary))] to-[color-mix(in_srgb,var(--color-main)_12%,var(--color-bg-secondary))]",
            "dark:[background:#171412]",
            "py-5 sm:py-7 lg:py-10",
            "ps-4 pe-4 sm:ps-6 sm:pe-6 lg:ps-10 lg:pe-10 xl:ps-12 xl:pe-12"
          )}
        >
          <div className="mx-auto min-w-0 w-full max-w-6xl 2xl:max-w-[88rem]">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile content area */}
      <div className="flex min-h-0 flex-1 flex-col bg-gradient-to-b from-[var(--color-bg-primary)] to-[color-mix(in_srgb,var(--color-api-second)_10%,var(--color-bg-secondary))] dark:[background:#171412] px-3 py-4 sm:px-5 sm:py-5 lg:hidden">
        <div className="mx-auto min-w-0 w-full max-w-lg flex-1 sm:max-w-none">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

/**
 * Scoped dark-mode creative styles for account pages.
 * - Page H1 titles use the API "second" color (from settings).
 * - The H1's adjacent paragraph (subtitle) is forced white.
 * - Header decorative orb/gradient overlays are softened so titles read clearly.
 */
function AccountDarkCreativeStyles() {
  const css = `
    [data-account-creative-scope].dark h1 {
      color: #F3EFE8;
      letter-spacing: -0.01em;
    }
    [data-account-creative-scope].dark .account-shell {
      background: #24201C !important;
      border-color: rgba(255,255,255,0.10) !important;
      box-shadow: 0 8px 28px rgba(0,0,0,0.28) !important;
      backdrop-filter: none;
      -webkit-backdrop-filter: none;
    }
    [data-account-creative-scope].dark [aria-hidden="true"][class*="blur-3xl"],
    [data-account-creative-scope].dark .pointer-events-none[class*="blur-3xl"] {
      display: none !important;
    }
    [data-account-creative-scope].dark .package-current-plan {
      background: #2A2622 !important;
      border-color: rgba(255,159,0,0.35) !important;
    }
  `;
  return <style>{css}</style>;
}
