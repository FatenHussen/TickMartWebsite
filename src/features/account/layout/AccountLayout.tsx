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
        "flex min-h-0 w-full max-w-none flex-1 flex-col pb-[env(safe-area-inset-bottom,0px)]",
        isDark && "dark",
      )}
      style={accountDarkScopeStyle}
    >
      {isDark && <AccountDarkCreativeStyles />}

      {/* Mobile header */}
      <div className="px-3 pt-3 pb-2 sm:px-5 sm:pt-4 sm:pb-3 lg:hidden">
        <MobileAccountMenu user={user} />
      </div>

      {/* Desktop: sticky collapsible sidebar + main content */}
      <div
        className={cn(
          "relative hidden min-h-0 w-full flex-1 items-stretch lg:flex",
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
            "min-h-full min-w-0 flex-1",
            "bg-gradient-to-br from-[var(--color-bg-primary)] via-[color-mix(in_srgb,var(--color-api-second)_14%,var(--color-bg-primary))] to-[color-mix(in_srgb,var(--color-main)_12%,var(--color-bg-secondary))]",
            "dark:[background:#050505]",
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
      <div className="flex min-h-0 flex-1 flex-col bg-gradient-to-b from-[var(--color-bg-primary)] to-[color-mix(in_srgb,var(--color-api-second)_10%,var(--color-bg-secondary))] dark:[background:#050505] px-3 py-4 sm:px-5 sm:py-5 lg:hidden">
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
    /* H1: soft gradient using API second color — elegant, not neon */
    [data-account-creative-scope].dark h1 {
      background: linear-gradient(
        105deg,
        color-mix(in srgb, var(--color-api-second) 90%, #ffffff) 0%,
        color-mix(in srgb, var(--color-api-second) 55%, #ffffff) 100%
      );
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      letter-spacing: -0.01em;
    }
    /* Subtitle paragraph directly after H1 stays crisp white */
    [data-account-creative-scope].dark h1 + p,
    [data-account-creative-scope].dark h1 ~ p:first-of-type,
    [data-account-creative-scope].dark header > p,
    [data-account-creative-scope].dark header h1 + p {
      color: #ffffff !important;
      opacity: 0.85;
    }
    /* Cards: translucent dark surface, hair-line border, rich depth shadow */
    [data-account-creative-scope].dark .account-shell {
      background: rgba(16,17,20,0.78) !important;
      border-color: rgba(255,255,255,0.06) !important;
      box-shadow: 0 8px 40px rgba(0,0,0,0.45), 0 1px 0 rgba(255,255,255,0.04) inset !important;
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
    }
    /* Kill decorative orbs — keep them as barely-there whispers */
    [data-account-creative-scope].dark [aria-hidden="true"][class*="blur-3xl"],
    [data-account-creative-scope].dark .pointer-events-none[class*="blur-3xl"] {
      opacity: 0.06 !important;
    }
    /* Section top accent strip — keep but dim it */
    [data-account-creative-scope].dark .account-shell > div:first-child[aria-hidden] {
      opacity: 0.45;
    }
    /* Package current-plan card: fix white-mixing gradient → dark-compatible */
    [data-account-creative-scope].dark .package-current-plan {
      background: linear-gradient(145deg,
        color-mix(in srgb, var(--color-main) 18%, #101114) 0%,
        color-mix(in srgb, var(--color-main) 10%, #0d0d10) 52%,
        color-mix(in srgb, var(--color-main) 15%, #0a0a0c) 100%
      ) !important;
      border-color: color-mix(in srgb, var(--color-main) 28%, transparent) !important;
      box-shadow: 0 8px 32px -8px color-mix(in srgb, var(--color-main) 18%, transparent),
                  0 1px 0 rgba(255,255,255,0.05) inset !important;
    }
  `;
  return <style>{css}</style>;
}
