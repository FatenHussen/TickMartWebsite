import { useState } from"react";
import { NavLink, useLocation } from"react-router-dom";
import { useTranslation } from"react-i18next";
import { useLanguage } from"@/context/LanguageContext";
import { useTheme } from"@/context/ThemeContext";
import { cn } from"@/shared/lib/utils";
import { LogoutPopup } from"@/shared/component";
import { useLogout } from"@/features/auth/hooks/useAuth";
import { useAuthStore } from"@/store/auth";
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
 HiLogout,
 HiTrendingUp,
} from"react-icons/hi";
import type { IconType } from"react-icons";

interface AccountSidebarProps {
 user?: {
 fullName: string;
 email: string;
 avatar?: string;
 isOnline?: boolean;
 };
}

const baseMenuItems: { id: string; icon: IconType; path: string }[] = [
 { id:"profile", icon: HiUser, path:"/account/profile"},
 { id:"addresses", icon: HiLocationMarker, path:"/account/addresses"},
 { id:"paymentMethods", icon: HiCreditCard, path:"/account/payment-methods"},
 { id:"myOrders", icon: HiShoppingBag, path:"/account/orders"},
 { id:"myBaskets", icon: HiShoppingCart, path:"/account/baskets"},
 { id:"myPackages", icon: HiCube, path:"/account/packages"},
 { id:"wishlist", icon: HiHeart, path:"/account/wishlist"},
 { id:"pointsRewards", icon: HiGift, path:"/account/points-rewards"},
 { id:"notifications", icon: HiBell, path:"/account/notifications"},
 { id:"myReviews", icon: HiStar, path:"/account/reviews"},
 { id:"helpSupport", icon: HiQuestionMarkCircle, path:"/account/help-support"},
 { id:"settings", icon: HiCog, path:"/account/settings"},
];

export default function AccountSidebar({ user }: AccountSidebarProps) {
 const { t } = useTranslation();
 const { isRTL } = useLanguage();
 const { theme } = useTheme();
 const isDark = theme ==="dark";
 const location = useLocation();
 const [showLogoutPopup, setShowLogoutPopup] = useState(false);
 const logoutMutation = useLogout();
 const { user: authUser } = useAuthStore();

 const isApprovedMarketer =
 authUser?.affiliate?.is_affiliate === true &&
 authUser?.affiliate?.approved === true;

 const menuItems = isApprovedMarketer
 ? [
 ...baseMenuItems.slice(0, 1),
 { id:"marketerDashboard", icon: HiTrendingUp, path:"/account/marketer-dashboard"},
 ...baseMenuItems.slice(1),
 ]
 : baseMenuItems;

 const currentUser = user ?? {
 fullName: authUser?.name ?? "",
 email: authUser?.email ?? "",
 avatar: undefined,
 };

 const handleLogoutClick = () => {
 setShowLogoutPopup(true);
 };

 const handleLogoutConfirm = () => {
 logoutMutation.mutate();
 };

 const handleLogoutClose = () => {
 setShowLogoutPopup(false);
 };

 const sidebarGradient = isDark
 ?"linear-gradient(180deg, #1e3a5f 0%, #1e293b 50%, #0f172a 100%)"
 :"linear-gradient(180deg, #2C8090 0%, #3AB8C4 50%, #4CDAF6 100%)";
 const headerGradient = isDark
 ?"linear-gradient(180deg, #1e3a5f 0%, #0f172a 100%)"
 :"linear-gradient(180deg, #4CDAF6 0%, #2C8090 100%)";

 return (
 <div
 className={cn(
"rounded-3xl overflow-hidden",
"shadow-[0_10px_15px_rgba(0,0,0,0.1),0_4px_6px_rgba(0,0,0,0.1)]",
 isDark &&"shadow-[0_10px_15px_rgba(0,0,0,0.3),0_4px_6px_rgba(0,0,0,0.2)]"
 )}
 style={{ background: sidebarGradient }}
 >
 {/* User Profile Header */}
 <div
 className="p-6 text-white text-center rounded-t-3xl"
 style={{ background: headerGradient }}
 >
 <div className="relative inline-block mb-3">
 <div className="w-20 h-20 rounded-full overflow-hidden border-3 border-custom-primary/30 mx-auto">
 {currentUser.avatar ? (
 <img
 src={currentUser.avatar}
 alt={currentUser.fullName}
 className="w-full h-full object-cover"
 />
 ) : (
 <div className="w-full h-full bg-custom-card/20 flex items-center justify-center font-semibold text-2xl text-white/90">
 {currentUser.fullName?.charAt(0)?.toUpperCase() ||"?"}
 </div>
 )}
 </div>
 {currentUser.isOnline && (
 <span className="absolute bottom-1 right-1 w-4 h-4 bg-[#28A745] border-2 border-custom-primary rounded-full"/>
 )}
 </div>
 <h3 className="font-semibold text-lg text-white">{currentUser.fullName}</h3>
 <p className="text-sm text-white/80">{currentUser.email}</p>
 </div>

 {/* Navigation Menu */}
 <nav className="py-2"style={{ background:"transparent"}}>
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
 ?"bg-custom-primary text-custom-primary font-medium shadow-md"
 :"text-white",
 active && !isRTL &&"ml-3 rounded-l-3xl",
 active && isRTL &&"mr-3 rounded-r-3xl",
 isRTL &&"flex-row-reverse"
 )
 }
 >
 <Icon
 className={cn(
"w-5 h-5 shrink-0",
 isActive ?"text-custom-primary":"text-white"
 )}
 />
 <span className="text-sm">{t(`account.menu.${item.id}`)}</span>
 </NavLink>
 </li>
 );
 })}

 {/* Logout */}
 <li className="pt-2 mt-2"style={{ borderTop:"1px solid rgba(255,255,255,0.2)"}}>
 <button
 onClick={handleLogoutClick}
 className={cn(
"flex items-center gap-3 px-6 py-3 transition-all duration-200 w-full",
 isRTL ?"text-right":"text-left"
 )}
 style={{ color:"#DC3545"}}
 >
 <HiLogout className="w-5 h-5 shrink-0"style={{ color:"#DC3545"}} />
 <span className="text-sm font-medium">{t("account.menu.logout")}</span>
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
