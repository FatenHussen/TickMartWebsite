import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/shared/lib/utils";
import { LogoutPopup } from "@/shared/component";
import { useLogout } from "@/features/auth/hooks/useAuth";
import { useAuthStore } from "@/store/auth";
import {
  User,
  MapPin,
  CreditCard,
  ShoppingBag,
  ShoppingCart,
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
    itemIds: ["myOrders", "myBaskets", "myPackages"],
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

  const isApprovedMarketer =
    authUser?.affiliate?.is_affiliate === true &&
    authUser?.affiliate?.approved === true;

  const visibleIds = new Set(
    ALL_MENU_ITEMS.filter(
      (item) => item.id !== "marketerDashboard" || isApprovedMarketer
    ).map((item) => item.id)
  );

  const currentUser = user ?? {
    fullName: authUser?.name ?? "",
    email: authUser?.email ?? "",
    avatar: undefined,
  };
  const initials = currentUser.fullName?.charAt(0)?.toUpperCase() ?? "?";

  /* LTR: rounded left edge removed + shadow right; RTL: opposite */
  const sidebarEdge = isRTL
    ? "lg:rounded-r-none lg:border-r-0 lg:shadow-[-8px_0_32px_-12px_color-mix(in_srgb,var(--color-main)_18%,transparent)]"
    : "lg:rounded-l-none lg:border-l-0 lg:shadow-[8px_0_32px_-12px_color-mix(in_srgb,var(--color-main)_18%,transparent)]";

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
        "flex min-h-10 flex-col overflow-hidden lg:h-full lg:min-h-0 lg:max-h-full",
        "max-lg:h-full",
        "max-lg:rounded-2xl max-lg:shadow-lg max-lg:shadow-black/5",
        sidebarEdge,
        "transition-[width] duration-300 ease-in-out motion-reduce:transition-none",
        isCollapsed ? "w-[72px]" : "w-full",
        "border border-[var(--color-border-primary)] bg-[var(--color-bg-card)]",
        // Creative full-sidebar gradient in dark mode only
        "dark:border-white/[0.06]",
        "dark:bg-[linear-gradient(160deg,color-mix(in_srgb,var(--color-api-second)_7%,#0d0d10)_0%,#0a0a0c_40%,#080808_100%)]",
        "dark:shadow-[inset_-1px_0_0_rgba(255,255,255,0.04)]"
      )}
    >
      {/* ── Header ── */}
      <div
        className={cn(
          "relative shrink-0 overflow-hidden",
          !isCollapsed && "rounded-b-2xl"
        )}
        style={{
          background:
            "linear-gradient(135deg, var(--color-api-second) 0%, color-mix(in srgb, var(--color-api-second) 70%, var(--color-main)) 55%, var(--color-main) 100%)",
        }}
      >
        {/* Glassmorphism overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-35 mix-blend-overlay"
          style={{
            backgroundImage:
              "radial-gradient(at 0% 0%, rgba(255,255,255,0.35) 0%, transparent 50%),radial-gradient(at 100% 100%, rgba(255,255,255,0.2) 0%, transparent 45%)",
          }}
        />

        {/* Decorative circles (visible when expanded) */}
        {!isCollapsed && (
          <>
            <span className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/10 pointer-events-none blur-[2px]" />
            <span className="absolute -bottom-6 -left-8 w-20 h-20 rounded-full bg-white/10 pointer-events-none" />
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-24 rounded-full bg-white/[0.07] blur-3xl pointer-events-none" />
          </>
        )}

        {/* User info */}
        <div
          className={cn(
            "relative flex flex-col items-center gap-2",
            isCollapsed ? "py-5 px-2" : "pt-6 pb-4 px-4"
          )}
        >
          {/* Avatar */}
          <div className="relative">
            <div
              className={cn(
                "rounded-full overflow-hidden ring-2 ring-white/30",
                "transition-all duration-300 ease-in-out",
                isCollapsed ? "w-10 h-10" : "w-16 h-16"
              )}
            >
              {currentUser.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className={cn(
                    "w-full h-full flex items-center justify-center font-bold text-white bg-white/20",
                    isCollapsed ? "text-sm" : "text-xl"
                  )}
                >
                  {initials}
                </div>
              )}
            </div>
            {currentUser.isOnline && (
              <span
                className="absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-white"
                style={{ backgroundColor: "var(--color-success)" }}
              />
            )}
          </div>

          {/* Name + email (expanded only) */}
          {!isCollapsed && (
            <div className="text-center w-full px-1">
              <p className="font-bold text-white text-sm leading-snug truncate">
                {currentUser.fullName}
              </p>
              {currentUser.email && (
                <p className="text-white/60 text-[11px] mt-0.5 truncate">
                  {currentUser.email}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Collapse toggle button */}
        <button
          type="button"
          onClick={handleToggle}
          aria-label={t(isCollapsed ? "common.expandSidebar" : "common.collapseSidebar")}
          className={cn(
            "absolute bottom-0 translate-y-1/2 p-1.5 rounded-full z-10",
            "bg-[color-mix(in_srgb,var(--color-bg-card)_92%,white)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-card)]",
            "shadow-md ring-2 ring-white/25 transition-all duration-200 hover:scale-105 active:scale-95",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-card)]",
            isRTL ? "left-3" : "right-3"
          )}
        >
          <CollapseIcon className="w-3.5 h-3.5" />
        </button>
      </div>

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
