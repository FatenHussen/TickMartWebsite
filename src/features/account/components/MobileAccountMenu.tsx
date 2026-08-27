import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/shared/lib/utils";
import { useAuthStore } from "@/store/auth";
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
  Trash2,
  ChevronDown,
  X,
  TrendingUp,
} from "lucide-react";

interface MobileAccountMenuProps {
  user?: {
    fullName: string;
    email: string;
    avatar?: string;
    isOnline?: boolean;
  };
}

const BASE_MENU_ITEMS = [
  { id: "profile", icon: User, path: "/account/profile" },
  { id: "addresses", icon: MapPin, path: "/account/addresses" },
  { id: "paymentMethods", icon: CreditCard, path: "/account/payment-methods" },
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

export default function MobileAccountMenu({ user }: MobileAccountMenuProps) {
  const { t } = useTranslation();
  const { user: authUser } = useAuthStore();
  const { isRTL } = useLanguage();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isApprovedMarketer =
    authUser?.affiliate?.is_affiliate === true &&
    authUser?.affiliate?.approved === true;

  const { quickOrder } = useQuickOrderSettings();

  const baseItems = BASE_MENU_ITEMS.filter(
    (item) => item.id !== "quickOrders" || quickOrder.isEnabled,
  );

  const menuItems = isApprovedMarketer
    ? [
        baseItems[0],
        { id: "marketerDashboard", icon: TrendingUp, path: "/account/marketer-dashboard" },
        ...baseItems.slice(1),
      ]
    : baseItems;

  const currentUser = user || {
    fullName: authUser?.name ?? "User",
    email: authUser?.email ?? "",
    avatar: undefined,
    isOnline: false,
  };

  const activeItem = menuItems.find((item) => location.pathname === item.path);
  const ActiveIcon = activeItem?.icon || User;

  return (
    <div className="lg:hidden mb-4">
      {/* Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className={cn(
          "w-full min-h-[3.25rem] sm:min-h-14 flex items-center justify-between px-4 py-3 rounded-2xl",
          "shadow-md shadow-black/5 border border-[color-mix(in_srgb,var(--color-border-primary)_70%,transparent)]",
          "transition-all duration-200 active:scale-[0.99] motion-reduce:transition-none motion-reduce:active:scale-100",
          isOpen ? "bg-gradient-brand-vertical text-white" : "bg-custom-card"
        )}
      >
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="relative">
            <div
              className={cn(
                "w-12 h-12 rounded-full overflow-hidden",
                isOpen ? "border-2 border-custom-primary/30" : "border-2 border-primary/20"
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
                    "w-full h-full flex items-center justify-center font-semibold text-lg",
                    isOpen ? "bg-custom-card/20 text-white/90" : "bg-primary/10 text-primary"
                  )}
                >
                  {currentUser.fullName?.charAt(0)?.toUpperCase() || "?"}
                </div>
              )}
            </div>
            {currentUser.isOnline && (
              <span className="absolute bottom-0 right-0 w-3 h-3 border-2 border-custom-primary rounded-full" style={{ backgroundColor: "var(--color-success)" }} />
            )}
          </div>

          <div className={cn("text-start", isRTL && "text-end")}>
            <p className={cn("font-semibold text-sm", isOpen ? "text-white" : "text-text-primary")}>
              {currentUser.fullName}
            </p>
            <p className={cn("text-xs flex items-center gap-1", isOpen ? "text-white/70" : "text-text-secondary")}>
              <ActiveIcon className="w-3 h-3" />
              {activeItem ? t(`account.menu.${activeItem.id}`) : t("account.menu.profile")}
            </p>
          </div>
        </div>

        <ChevronDown
          className={cn(
            "w-5 h-5 transition-transform duration-200",
            isOpen ? "rotate-180 text-white" : "text-text-secondary"
          )}
        />
      </button>

      {/* Bottom Sheet */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div
            className={cn(
              "fixed inset-x-0 bottom-0 z-50 bg-custom-card rounded-t-3xl",
              "max-h-[min(70vh,32rem)] overflow-hidden",
              "animate-slide-up",
              "shadow-[0_-8px_40px_-12px_rgba(0,0,0,0.2)] pb-[max(0.75rem,env(safe-area-inset-bottom))]"
            )}
          >
            {/* Header */}
            <div className="p-4 text-white flex items-center justify-between bg-gradient-brand-vertical">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-custom-primary/30">
                  {currentUser.avatar ? (
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-custom-card/20 flex items-center justify-center font-semibold text-xl text-white/90">
                      {currentUser.fullName?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-semibold">{currentUser.fullName}</p>
                  {currentUser.email && (
                    <p className="text-sm text-white/80">{currentUser.email}</p>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-2.5 min-h-11 min-w-11 shrink-0 flex items-center justify-center hover:bg-custom-card/10 rounded-full transition-colors"
                aria-label={t("common.close")}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <nav className="overflow-y-auto max-h-[calc(70vh-80px)] py-2">
              <ul>
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <li key={item.id}>
                      <NavLink
                        to={item.path}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-6 py-3.5 transition-all duration-200",
                          "hover:bg-primary-light/10",
                          isActive
                            ? "text-primary bg-primary-light/10 font-medium"
                            : "text-text-primary dark:text-text-primary"
                        )}
                      >
                        <Icon
                          className={cn(
                            "w-5 h-5 shrink-0",
                            isActive ? "text-primary" : "text-gray-light"
                          )}
                        />
                        <span>{t(`account.menu.${item.id}`)}</span>
                        {isActive && (
                          <span className="ms-auto w-2 h-2 bg-primary rounded-full shrink-0" />
                        )}
                      </NavLink>
                    </li>
                  );
                })}

                {/* Delete Account */}
                <li className="border-t border-custom-primary mt-2 pt-2">
                  <NavLink
                    to="/account/delete"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-6 py-3.5 transition-all duration-200"
                    style={({ isActive }) => ({
                      color: "var(--color-error)",
                      backgroundColor: isActive ? "var(--color-status-error-bg)" : undefined,
                    })}
                  >
                    <Trash2 className="w-5 h-5 shrink-0" />
                    <span>{t("account.menu.deleteAccount")}</span>
                  </NavLink>
                </li>
              </ul>
            </nav>
          </div>
        </>
      )}
    </div>
  );
}
