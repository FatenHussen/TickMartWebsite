import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/shared/lib/utils";
import { LogoutPopup } from "@/shared/component";
import { useLogout } from "@/features/auth/hooks/useAuth";
import {
  HiUser,
  HiLocationMarker,
  HiCreditCard,
  HiShoppingBag,
  HiShoppingCart,
  HiCube,
  HiHeart,
  HiGift,
  HiBell,
  HiStar,
  HiQuestionMarkCircle,
  HiCog,
  HiTrash,
  HiLogout,
} from "react-icons/hi";
import type { IconType } from "react-icons";

interface AccountSidebarProps {
  user?: {
    fullName: string;
    email: string;
    avatar?: string;
    isOnline?: boolean;
  };
}

const menuItems: { id: string; icon: IconType; path: string }[] = [
  { id: "profile", icon: HiUser, path: "/account/profile" },
  { id: "addresses", icon: HiLocationMarker, path: "/account/addresses" },
  { id: "paymentMethods", icon: HiCreditCard, path: "/account/payment-methods" },
  { id: "myOrders", icon: HiShoppingBag, path: "/account/orders" },
  { id: "myBaskets", icon: HiShoppingCart, path: "/account/baskets" },
  { id: "myPackages", icon: HiCube, path: "/account/packages" },
  { id: "wishlist", icon: HiHeart, path: "/account/wishlist" },
  { id: "pointsRewards", icon: HiGift, path: "/account/points-rewards" },
  { id: "notifications", icon: HiBell, path: "/account/notifications" },
  { id: "myReviews", icon: HiStar, path: "/account/reviews" },
  { id: "helpSupport", icon: HiQuestionMarkCircle, path: "/account/help-support" },
  { id: "settings", icon: HiCog, path: "/account/settings" },
];

export default function AccountSidebar({ user }: AccountSidebarProps) {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const location = useLocation();
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const logoutMutation = useLogout();

  const defaultUser = {
    fullName: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    avatar: "/images/shared/avatar-placeholder.png",
    isOnline: true,
  };

  const currentUser = user || defaultUser;

  const handleLogoutClick = () => {
    setShowLogoutPopup(true);
  };

  const handleLogoutConfirm = () => {
    logoutMutation.mutate();
  };

  const handleLogoutClose = () => {
    setShowLogoutPopup(false);
  };

  return (
    <div
      className={cn(
        "rounded-3xl overflow-hidden",
        "shadow-[0_10px_15px_rgba(0,0,0,0.1),0_4px_6px_rgba(0,0,0,0.1)]"
      )}
      style={{
        background: "linear-gradient(180deg, #2C8090 0%, #3AB8C4 50%, #4CDAF6 100%)",
      }}
    >
      {/* User Profile Header */}
      <div
        className="p-6 text-white text-center rounded-t-3xl"
        style={{
          background: "linear-gradient(180deg, #4CDAF6 0%, #2C8090 100%)",
        }}
      >
        <div className="relative inline-block mb-3">
          <div className="w-20 h-20 rounded-full overflow-hidden border-3 border-white/30 mx-auto">
            {currentUser.avatar ? (
              <img
                src={currentUser.avatar}
                alt={currentUser.fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-white/20 flex items-center justify-center">
                <HiUser className="w-10 h-10 text-white/70" />
              </div>
            )}
          </div>
          {currentUser.isOnline && (
            <span className="absolute bottom-1 right-1 w-4 h-4 bg-[#28A745] border-2 border-white rounded-full" />
          )}
        </div>
        <h3 className="font-semibold text-lg text-white">{currentUser.fullName}</h3>
        <p className="text-sm text-white/80">{currentUser.email}</p>
      </div>

      {/* Navigation Menu */}
      <nav className="py-2" style={{ background: "transparent" }}>
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <li key={item.id}>
                <NavLink
                  to={item.path}
                  className={({ isActive: active }) =>
                    cn(
                      "flex items-center gap-3 px-6 py-3 transition-all duration-200",
                      active
                        ? "text-[#212529] font-medium"
                        : "text-white",
                      isRTL && "flex-row-reverse"
                    )
                  }
                  style={({ isActive: active }) =>
                    active
                      ? {
                          background: "#FFFFFF",
                          marginLeft: isRTL ? "0" : "12px",
                          marginRight: isRTL ? "12px" : "0",
                          borderTopLeftRadius: isRTL ? "0" : "24px",
                          borderBottomLeftRadius: isRTL ? "0" : "24px",
                          borderTopRightRadius: isRTL ? "24px" : "0",
                          borderBottomRightRadius: isRTL ? "24px" : "0",
                          boxShadow:
                            isRTL
                              ? "-2px 4px 8px rgba(0, 0, 0, 0.08), -1px 2px 4px rgba(0, 0, 0, 0.06)"
                              : "2px 4px 8px rgba(0, 0, 0, 0.08), 1px 2px 4px rgba(0, 0, 0, 0.06)",
                        }
                      : {}
                  }
                >
                  <Icon
                    className={cn(
                      "w-5 h-5 shrink-0",
                      isActive ? "text-[#212529]" : "text-white"
                    )}
                  />
                  <span className="text-sm">{t(`account.menu.${item.id}`)}</span>
                </NavLink>
              </li>
            );
          })}

          {/* Delete Account - Danger Item */}
          <li className="pt-2 mt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.2)" }}>
            <button
              onClick={handleLogoutClick}
              className={cn(
                "flex items-center gap-3 px-6 py-3 transition-all duration-200 w-full",
                isRTL ? "text-right" : "text-left"
              )}
              style={{ color: "#DC3545" }}
            >
              <HiTrash className="w-5 h-5 shrink-0" style={{ color: "#DC3545" }} />
              <span className="text-sm font-medium">{t("account.menu.deleteAccount")}</span>
            </button>
          </li>
        </ul>
      </nav>

      {/* Logout Popup */}
      <LogoutPopup
        isOpen={showLogoutPopup}
        onClose={handleLogoutClose}
        onConfirm={handleLogoutConfirm}
      />
    </div>
  );
}
