import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/shared/lib/utils";
import { LogoutPopup } from "@/shared/component";
import { useLogout } from "@/features/auth/hooks/useAuth";
import { useAuthStore } from "@/store/auth";
import { isApprovedMarketer as checkApprovedMarketer } from "@/features/marketer/utils/isApprovedMarketer";
import { useQuickOrderSettings } from "@/features/account/hooks/useQuickOrderSettings";
import {
  User,
  MapPin,
  CreditCard,
  ShoppingBag,
  ShoppingCart,
  Zap,
  Package,
  Heart,
  Gift,
  Bell,
  Star,
  HelpCircle,
  Settings,
  LogOut,
  Trash2,
  TrendingUp,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

interface AccountSidebarProps {
  user?: {
    fullName: string;
    email: string;
    avatar?: string;
    isOnline?: boolean;
  };
  isCollapsed?: boolean;
  onToggle?: (collapsed: boolean) => void;
}

const ALL_MENU_ITEMS = [
  { id: "profile", icon: User, path: "/account/profile" },
  { id: "addresses", icon: MapPin, path: "/account/addresses" },
  { id: "paymentMethods", icon: CreditCard, path: "/account/payment-methods" },
  { id: "marketerDashboard", icon: TrendingUp, path: "/account/marketer-dashboard" },
  { id: "myOrders", icon: ShoppingBag, path: "/account/orders" },
  { id: "quickOrders", icon: Zap, path: "/custom-orders" },
  { id: "myBaskets", icon: ShoppingCart, path: "/account/baskets" },
  { id: "myPackages", icon: Package, path: "/account/packages" },
  { id: "wishlist", icon: Heart, path: "/account/wishlist" },
  { id: "pointsRewards", icon: Gift, path: "/account/points-rewards" },
  { id: "notifications", icon: Bell, path: "/account/notifications" },
  { id: "myReviews", icon: Star, path: "/account/reviews" },
  { id: "helpSupport", icon: HelpCircle, path: "/account/help-support" },
  { id: "settings", icon: Settings, path: "/account/settings" },
];

const SECTION_GROUPS = [
  {
    labelKey: "sections.account",
    itemIds: ["profile", "addresses", "paymentMethods", "marketerDashboard"],
  },
  {
    labelKey: "sections.orders",
    itemIds: ["myOrders", "quickOrders", "myBaskets", "myPackages"],
  },
  {
    labelKey: "sections.activity",
    itemIds: ["wishlist", "pointsRewards", "notifications", "myReviews"],
  },
  {
    labelKey: "sections.support",
    itemIds: ["helpSupport", "settings"],
  },
];

/* ---------- Tooltip (shown when collapsed) ---------- */
function ItemTooltip({
  label,
  isRTL,
}: {
  label: string;
  isRTL: boolean;
}) {
  const side = isRTL ? "right-full mr-3" : "left-full ml-3";
  return (
    <span
      role="tooltip"
      className={cn(
        "absolute z-[100] px-3 py-1.5 text-xs font-semibold whitespace-nowrap",
        "pointer-events-none shadow-xl rounded-lg",
        "opacity-0 group-hover:opacity-100",
        "transition-all duration-150 delay-100",
        side,
        "bg-[var(--color-text-primary)] text-[var(--color-bg-card)]"
      )}
    >
      {label}
    </span>
  );
}

/* ---------- Nav Item ---------- */
function NavItem({
  item,
  isCollapsed,
  isRTL,
}: {
  item: (typeof ALL_MENU_ITEMS)[0];
  isCollapsed: boolean;
  isRTL: boolean;
}) {
  const { t } = useTranslation();
  const Icon = item.icon;
  const label = t(`account.menu.${item.id}`);

  return (
    <li className="relative">
      <NavLink
        to={item.path}
        className={({ isActive }) =>
          cn(
            "group relative flex items-center gap-3",
            "transition-all duration-200 ease-in-out text-sm font-medium rounded-xl",
            "focus-visible:outline-none",
            isCollapsed
              ? "justify-center px-0 py-3 mx-auto w-11 h-11"
              : "px-3 py-2.5",
            isRTL && !isCollapsed ? "flex-row-reverse" : "",
            !isActive && "hover:bg-[var(--color-bg-hover)]"
          )
        }
        style={({ isActive }) => ({
          backgroundColor: isActive ? "var(--color-accent-light-bg)" : undefined,
          color: isActive ? "var(--color-primary)" : "var(--color-text-secondary)",
        })}
      >
        {({ isActive }) => (
          <>
            {/* Active pill indicator */}
            {!isCollapsed && (
              <span
                className={cn(
                  "absolute top-1/2 -translate-y-1/2 w-1 h-5 rounded-full",
                  "transition-all duration-300 ease-out",
                  isRTL ? "-right-0" : "-left-0",
                  isActive ? "opacity-100 scale-y-100" : "opacity-0 scale-y-50"
                )}
                style={{ backgroundColor: "var(--color-primary)" }}
              />
            )}

            {/* Icon */}
            <span
              className={cn(
                "flex items-center justify-center shrink-0 rounded-xl transition-all duration-200",
                isCollapsed ? "w-10 h-10" : "w-5 h-5"
              )}
              style={
                isCollapsed && isActive
                  ? { backgroundColor: "var(--color-accent-light-bg)" }
                  : undefined
              }
            >
              <Icon
                style={{
                  width: isCollapsed ? 20 : 17,
                  height: isCollapsed ? 20 : 17,
                  color: isActive
                    ? "var(--color-primary)"
                    : "var(--color-text-tertiary)",
                }}
              />
            </span>

            {/* Label */}
            {!isCollapsed && (
              <span
                className={cn(
                  "flex-1 truncate leading-tight",
                  isRTL ? "text-right" : "text-left"
                )}
              >
                {label}
              </span>
            )}

            {/* Tooltip when collapsed */}
            {isCollapsed && <ItemTooltip label={label} isRTL={isRTL} />}
          </>
        )}
      </NavLink>
    </li>
  );
}

/* ---------- Destructive Action Item (Logout / Delete) ---------- */
function DestructiveItem({
  label,
  icon: Icon,
  isCollapsed,
  isRTL,
  href,
  onClick,
}: {
  label: string;
  icon: React.ElementType;
  isCollapsed: boolean;
  isRTL: boolean;
  href?: string;
  onClick?: () => void;
}) {
  const baseClass = cn(
    "group relative flex items-center gap-3 rounded-xl w-full",
    "transition-all duration-200 ease-in-out text-sm font-medium",
    "hover:bg-[var(--color-status-error-bg)]",
    isCollapsed ? "justify-center px-0 py-3 mx-auto w-11 h-11" : "px-3 py-2.5",
    isRTL && !isCollapsed ? "flex-row-reverse" : ""
  );

  const content = (
    <>
      <span
        className={cn(
          "flex items-center justify-center shrink-0 rounded-xl transition-all duration-200",
          isCollapsed ? "w-10 h-10" : "w-5 h-5"
        )}
      >
        <Icon
          style={{
            width: isCollapsed ? 20 : 17,
            height: isCollapsed ? 20 : 17,
            color: "var(--color-error)",
          }}
        />
      </span>
      {!isCollapsed && (
        <span
          className={cn(
            "flex-1 truncate",
            isRTL ? "text-right" : "text-left"
          )}
          style={{ color: "var(--color-error)" }}
        >
          {label}
        </span>
      )}
      {isCollapsed && <ItemTooltip label={label} isRTL={isRTL} />}
    </>
  );

  if (href) {
    return (
      <li className="relative">
        <NavLink
          to={href}
          title={isCollapsed ? label : undefined}
          className={({ isActive }) =>
            cn(baseClass, isActive && "bg-[var(--color-status-error-bg)]")
          }
        >
          {content}
        </NavLink>
      </li>
    );
  }

  return (
    <li className="relative">
      <button
        onClick={onClick}
        title={isCollapsed ? label : undefined}
        className={baseClass}
      >
        {content}
      </button>
    </li>
  );
}

/* ---------- Section Label ---------- */
function SectionLabel({
  labelKey,
  isCollapsed,
}: {
  labelKey: string;
  isCollapsed: boolean;
}) {
  const { t } = useTranslation();

  if (isCollapsed) {
    return (
      <li className="flex justify-center py-2">
        <span
          className="block w-4 h-px rounded-full"
          style={{ backgroundColor: "var(--color-border-primary)" }}
        />
      </li>
    );
  }

  return (
    <li className="px-3 pt-5 pb-1.5 first:pt-3">
      <span
        className="text-[10px] font-semibold tracking-[0.12em] uppercase select-none opacity-80"
        style={{ color: "var(--color-text-tertiary)" }}
      >
        {t(labelKey)}
      </span>
    </li>
  );
}

/* ---------- Main Sidebar Component ---------- */
export default function AccountSidebar({
  user,
  isCollapsed: controlledCollapsed,
  onToggle,
}: AccountSidebarProps) {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { user: authUser } = useAuthStore();
  const logoutMutation = useLogout();
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  const isControlled = controlledCollapsed !== undefined;
  const isCollapsed = isControlled ? controlledCollapsed : internalCollapsed;

  const handleToggle = () => {
    const next = !isCollapsed;
    if (!isControlled) setInternalCollapsed(next);
    onToggle?.(next);
  };

  const isApprovedMarketer = checkApprovedMarketer(authUser);

  const { quickOrder } = useQuickOrderSettings();

  const visibleIds = new Set(
    ALL_MENU_ITEMS.filter((item) => {
      if (item.id === "marketerDashboard" && !isApprovedMarketer) return false;
      if (item.id === "quickOrders" && !quickOrder.isEnabled) return false;
      return true;
    }).map((item) => item.id)
  );

  const currentUser = user ?? {
    fullName: authUser?.name ?? "",
    email: authUser?.email ?? "",
    avatar: undefined,
  };
  const initials = currentUser.fullName?.charAt(0)?.toUpperCase() ?? "?";

  /* Flush to the outer viewport edge; border + shadow face the content column. */
  const sidebarEdge = isRTL
    ? "lg:rounded-none lg:border-y-0 lg:border-s-0 lg:shadow-[-10px_0_28px_-16px_color-mix(in_srgb,var(--color-main)_22%,transparent)]"
    : "lg:rounded-none lg:border-y-0 lg:border-s-0 lg:shadow-[10px_0_28px_-16px_color-mix(in_srgb,var(--color-main)_22%,transparent)]";

  const collapseIcon = isCollapsed
    ? isRTL
      ? PanelLeftOpen
      : PanelLeftClose
    : isRTL
    ? PanelLeftClose
    : PanelLeftOpen;
  const CollapseIcon = collapseIcon;

  return (
    <div
      className={cn(
        "relative flex min-h-10 flex-col lg:h-full lg:min-h-0 lg:max-h-full",
        "overflow-visible max-lg:h-full max-lg:overflow-hidden",
        "max-lg:rounded-2xl max-lg:shadow-lg max-lg:shadow-black/5",
        sidebarEdge,
        "transition-[width] duration-300 ease-in-out motion-reduce:transition-none",
        isCollapsed ? "w-[72px]" : "w-full",
        "border border-[var(--color-border-primary)] bg-[var(--color-bg-card)]",
        "dark:border-white/[0.08]",
        "dark:bg-[#1C1916]",
      )}
    >
      {/* Colored band — avatar hangs out from below */}
      <div
        className={cn(
          "relative shrink-0 overflow-hidden",
          isCollapsed ? "h-[3.25rem]" : "h-[4.75rem]",
          isDark && "border-b border-white/10 bg-[#1C1916]",
        )}
        style={
          isDark
            ? undefined
            : {
                background:
                  "linear-gradient(135deg, var(--color-api-second) 0%, color-mix(in srgb, var(--color-api-second) 70%, var(--color-main)) 55%, var(--color-main) 100%)",
              }
        }
      >
        {!isDark && (
          <div
            className="pointer-events-none absolute inset-0 opacity-35 mix-blend-overlay"
            style={{
              backgroundImage:
                "radial-gradient(at 0% 0%, rgba(255,255,255,0.35) 0%, transparent 50%),radial-gradient(at 100% 100%, rgba(255,255,255,0.2) 0%, transparent 45%)",
            }}
          />
        )}

        {!isCollapsed && !isDark && (
          <>
            <span className="pointer-events-none absolute -top-6 -end-6 h-28 w-28 rounded-full bg-white/10 blur-[2px]" />
            <span className="pointer-events-none absolute -bottom-8 -start-8 h-20 w-20 rounded-full bg-white/10" />
          </>
        )}
      </div>

      {/* Avatar + name sit on the body; photo overlaps the band from outside */}
      <div
        className={cn(
          "relative z-10 flex shrink-0 flex-col items-center",
          isCollapsed ? "-mt-5 px-2 pb-2" : "-mt-8 px-4 pb-3",
        )}
      >
        <div className="relative">
          <div
            className={cn(
              "overflow-hidden rounded-full bg-[var(--color-bg-card)] ring-2 ring-[var(--color-bg-card)] transition-all duration-300 ease-in-out dark:bg-[#1C1916] dark:ring-[#1C1916]",
              isDark
                ? "shadow-[0_0_0_2px_#ff9f00]"
                : "shadow-[0_0_0_2px_rgba(255,255,255,0.75),0_6px_16px_-8px_rgba(15,23,42,0.45)]",
              isCollapsed ? "h-10 w-10" : "h-16 w-16",
            )}
          >
            {currentUser.avatar ? (
              <img
                src={currentUser.avatar}
                alt={currentUser.fullName}
                className="h-full w-full object-cover"
              />
            ) : (
              <div
                className={cn(
                  "flex h-full w-full items-center justify-center font-bold",
                  isDark ? "bg-cta text-white" : "bg-white text-[var(--color-main)]",
                  isCollapsed ? "text-sm" : "text-xl",
                )}
              >
                {initials}
              </div>
            )}
          </div>
          {currentUser.isOnline && (
            <span
              className="absolute bottom-0 right-0 h-3 w-3 rounded-full ring-2 ring-[var(--color-bg-card)] dark:ring-[#1C1916]"
              style={{ backgroundColor: "var(--color-success)" }}
            />
          )}
        </div>

        {!isCollapsed && (
          <div className="mt-2.5 w-full px-1 text-center">
            <p className="truncate text-sm font-bold leading-snug text-[var(--color-text-primary)] dark:text-[#F3EFE8]">
              {currentUser.fullName}
            </p>
            {currentUser.email && (
              <p className="mt-0.5 truncate text-[11px] text-[var(--color-text-tertiary)] dark:text-[#C9C2B6]">
                {currentUser.email}
              </p>
            )}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={handleToggle}
        aria-label={t(isCollapsed ? "common.expandSidebar" : "common.collapseSidebar")}
        className={cn(
          "absolute z-30 rounded-full p-1.5 max-lg:hidden",
          "top-[4.25rem]",
          isRTL ? "left-0 -translate-x-1/2" : "right-0 translate-x-1/2",
          "bg-[var(--color-bg-card)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]",
          "shadow-md ring-1 ring-black/10 transition-all duration-200 hover:scale-105 active:scale-95",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2",
          "dark:bg-[#2A2622] dark:text-[#F3EFE8] dark:ring-white/15",
        )}
      >
        <CollapseIcon className="h-3.5 w-3.5" />
      </button>

      {/* ── Nav items ── */}
      <nav className="mt-2 min-h-0 flex-1 overflow-x-visible overflow-y-auto pt-1 scrollbar-custom">
        <ul
          className={cn(
            "pb-2",
            isCollapsed ? "px-1 space-y-1" : "px-3 space-y-0.5"
          )}
        >
          {SECTION_GROUPS.map((section) => {
            const sectionItems = ALL_MENU_ITEMS.filter(
              (item) =>
                section.itemIds.includes(item.id) && visibleIds.has(item.id)
            );
            if (sectionItems.length === 0) return null;

            return (
              <li key={section.labelKey}>
                <ul>
                  <SectionLabel
                    labelKey={section.labelKey}
                    isCollapsed={isCollapsed}
                  />
                  {sectionItems.map((item) => (
                    <NavItem
                      key={item.id}
                      item={item}
                      isCollapsed={isCollapsed}
                      isRTL={isRTL}
                    />
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ── Footer: logout + delete ── */}
      <div
        className={cn(
          "shrink-0 border-t border-[var(--color-border-primary)] pb-3 pt-2 dark:border-white/10",
          isCollapsed ? "px-1 space-y-1" : "px-3 space-y-0.5"
        )}
      >
        <ul>
          <DestructiveItem
            label={t("account.menu.logout")}
            icon={LogOut}
            isCollapsed={isCollapsed}
            isRTL={isRTL}
            onClick={() => setShowLogoutPopup(true)}
          />
          <DestructiveItem
            label={t("account.menu.deleteAccount")}
            icon={Trash2}
            isCollapsed={isCollapsed}
            isRTL={isRTL}
            href="/account/delete"
          />
        </ul>
      </div>

      <LogoutPopup
        isOpen={showLogoutPopup}
        onClose={() => setShowLogoutPopup(false)}
        onConfirm={() => logoutMutation.mutate()}
      />
    </div>
  );
}
