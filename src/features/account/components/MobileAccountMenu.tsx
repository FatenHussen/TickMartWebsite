import { useState } from"react";
import { NavLink, useLocation } from"react-router-dom";
import { useTranslation } from"react-i18next";
import { useLanguage } from"@/context/LanguageContext";
import { cn } from"@/shared/lib/utils";
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
 HiTrash,
 HiChevronDown,
 HiX,
 HiTrendingUp,
} from"react-icons/hi";
import type { IconType } from"react-icons";

interface MobileAccountMenuProps {
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

export default function MobileAccountMenu({ user }: MobileAccountMenuProps) {
 const { t } = useTranslation();
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
 const { isRTL } = useLanguage();
 const location = useLocation();
 const [isOpen, setIsOpen] = useState(false);

 const defaultUser = {
 fullName:"Sarah Johnson",
 email:"sarah.johnson@email.com",
 avatar:"/images/shared/avatar-placeholder.png",
 isOnline: true,
 };

 const currentUser = user || defaultUser;

 // Find current active menu item
 const activeItem = menuItems.find((item) => location.pathname === item.path);
 const ActiveIcon = activeItem?.icon || HiUser;

 return (
 <div className="lg:hidden mb-4">
 {/* Mobile Toggle Button */}
 <button
 onClick={() => setIsOpen(!isOpen)}
 className={cn(
"w-full flex items-center justify-between p-4 rounded-2xl",
"bg-custom-card shadow-md",
"transition-all duration-200"
 )}
 style={{
 background: isOpen
 ?"linear-gradient(180deg, #4CDAF6 0%, #2C8090 100%)"
 : undefined,
 }}
 >
 <div className="flex items-center gap-3">
 {/* User Avatar */}
 <div className="relative">
 <div
 className={cn(
"w-12 h-12 rounded-full overflow-hidden",
 isOpen ?"border-2 border-custom-primary/30":"border-2 border-primary/20"
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
 isOpen ?"bg-custom-card/20 text-white/90":"bg-primary/10 text-primary"
 )}
 >
 {currentUser.fullName?.charAt(0)?.toUpperCase() ||"?"}
 </div>
 )}
 </div>
 {currentUser.isOnline && (
 <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-custom-primary rounded-full"/>
 )}
 </div>

 <div className={cn("text-start", isRTL &&"text-end")}>
 <p
 className={cn(
"font-semibold text-sm",
 isOpen ?"text-white":"text-text-primary"
 )}
 >
 {currentUser.fullName}
 </p>
 <p
 className={cn(
"text-xs flex items-center gap-1",
 isOpen ?"text-white/70":"text-text-secondary"
 )}
 >
 <ActiveIcon className="w-3 h-3"/>
 {activeItem ? t(`account.menu.${activeItem.id}`) : t("account.menu.profile")}
 </p>
 </div>
 </div>

 <HiChevronDown
 className={cn(
"w-5 h-5 transition-transform duration-200",
 isOpen ?"rotate-180 text-white":"text-text-secondary"
 )}
 />
 </button>

 {/* Mobile Dropdown Menu */}
 {isOpen && (
 <>
 {/* Backdrop */}
 <div
 className="fixed inset-0 bg-black/50 z-40"
 onClick={() => setIsOpen(false)}
 />

 {/* Menu Panel */}
 <div className="fixed inset-x-0 bottom-0 z-50 bg-custom-card rounded-t-3xl max-h-[70vh] overflow-hidden animate-slide-up">
 {/* Header */}
 <div
 className="p-4 text-white flex items-center justify-between"
 style={{
 background:"linear-gradient(180deg, #4CDAF6 0%, #2C8090 100%)",
 }}
 >
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
 {currentUser.fullName?.charAt(0)?.toUpperCase() ||"?"}
 </div>
 )}
 </div>
 <div>
 <p className="font-semibold">{currentUser.fullName}</p>
 <p className="text-sm text-white/80">{currentUser.email}</p>
 </div>
 </div>
 <button
 onClick={() => setIsOpen(false)}
 className="p-2 hover:bg-custom-card/10 rounded-full transition-colors"
 >
 <HiX className="w-5 h-5"/>
 </button>
 </div>

 {/* Menu Items */}
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
 ?"text-primary bg-primary-light/10 font-medium"
 :"text-text-primary dark:text-text-primary"
 )}
 >
 <Icon
 className={cn(
"w-5 h-5 shrink-0",
 isActive ?"text-primary":"text-gray-light"
 )}
 />
 <span>{t(`account.menu.${item.id}`)}</span>
 {isActive && (
 <span className="ml-auto w-2 h-2 bg-primary rounded-full"/>
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
 className="flex items-center gap-3 px-6 py-3.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
 >
 <HiTrash className="w-5 h-5 shrink-0"/>
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
