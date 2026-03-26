import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "react-i18next";
import {
    HiHeart,
    HiShoppingBag,
    HiShoppingCart,
    HiLocationMarker,
    HiChevronDown,
    HiSearch,
    HiMenu,
    HiLogin,
    HiX,
    HiGlobe,
    HiSun,
    HiMoon,
    HiUser,
    HiCreditCard,
    HiCube,
    HiGift,
    HiBell,
    HiStar,
    HiQuestionMarkCircle,
    HiCog,
    HiTrendingUp,
} from "react-icons/hi";
import { paths } from "@/app/routes/path/paths";
import { useState, useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import { useAuthStore } from "@/store/auth";
import { useAddresses } from "@/features/account/hooks/useAddress";
import { useCheckoutStore } from "@/store/checkout";
import { useCartStore } from "@/store/cart";
import { useProfile } from "@/features/account/hooks/useProfile";
import { useTheme } from "@/context/ThemeContext";
import { NavbarSearch } from "@/features/search";

export default function Navbar() {
    const { isRTL, language, toggleLanguage } = useLanguage();
    const { theme, toggleTheme } = useTheme();
    const { t } = useTranslation();
    const location = useLocation();
    const { authenticated, user: authUser } = useAuthStore();

    // Show"Become a Marketer"only when logged in AND (not affiliate OR not approved)
    const showBecomeMarketer =
        authenticated &&
        (!authUser?.affiliate?.is_affiliate || !authUser?.affiliate?.approved);

    const isApprovedMarketer =
        authUser?.affiliate?.is_affiliate === true &&
        authUser?.affiliate?.approved === true;
    const [showLocationDropdown, setShowLocationDropdown] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showAccountDropdown, setShowAccountDropdown] = useState(false);
    const [logoError, setLogoError] = useState(false);
    const closeDropdownTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const profileButtonRef = useRef<HTMLButtonElement>(null);
    const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left?: number; right?: number } | null>(null);

    const { data: addresses = [], isLoading: addressesLoading } =
        useAddresses(authenticated);
    const { addressId, setAddressId } = useCheckoutStore();
    const items = useCartStore((s) => s.items);
    const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);
    const { data: profile } = useProfile();

    const profileInitial = useMemo(() => {
        const getName = (n: unknown): string => {
            if (n == null) return "";
            if (typeof n === "string") return n;
            if (typeof n === "object" && n !== null && ("ar" in n || "en" in n)) {
                const o = n as Record<string, string>;
                return o[language] || o.en || o.ar || "";
            }
            return "";
        };
        const name = getName(profile?.name) || authUser?.name || "";
        return name.charAt(0).toUpperCase() || "?";
    }, [profile?.name, authUser?.name, language]);

    const selectedAddress = useMemo(() => {
        if (addressId != null) {
            return addresses.find(
                (a) => a.id === addressId || a.id === Number(addressId),
            );
        }
        return addresses.find((a) => a.is_default) ?? addresses[0];
    }, [addresses, addressId]);

    const getAreaName = (area: { name?: string | { ar?: string; en?: string } } | null | undefined) => {
        if (!area?.name) return undefined;
        if (typeof area.name === "string") return area.name;
        return language?.startsWith("ar") ? (area.name.ar ?? area.name.en) : (area.name.en ?? area.name.ar);
    };

    const deliveryAddressDisplay = useMemo(() => {
        if (!selectedAddress) return null;
        const parts = [
            selectedAddress.street_name,
            selectedAddress.building_number,
            selectedAddress.floor_apartment,
            selectedAddress.nearest_landmark,
            getAreaName(selectedAddress.area),
        ].filter(Boolean);
        return parts.join(",") || selectedAddress.label;
    }, [selectedAddress, language]);

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    // Close account dropdown when clicking outside
    useEffect(() => {
        if (!showAccountDropdown) return;
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (
                target.closest("[data-account-dropdown]") ||
                target.closest("[data-account-dropdown-trigger]") ||
                target.closest("[data-account-dropdown-panel]")
            )
                return;
            setShowAccountDropdown(false);
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, [showAccountDropdown]);

    // Compute dropdown position when open (for portal - escapes overflow)
    useEffect(() => {
        if (!showAccountDropdown || !profileButtonRef.current) return;
        const updatePosition = () => {
            const btn = profileButtonRef.current;
            if (!btn) return;
            const rect = btn.getBoundingClientRect();
            setDropdownPosition({
                top: rect.bottom + 12,
                ...(isRTL
                    ? { left: rect.left, right: undefined }
                    : { left: undefined, right: window.innerWidth - rect.right }),
            });
        };
        updatePosition();
        window.addEventListener("scroll", updatePosition, true);
        window.addEventListener("resize", updatePosition);
        return () => {
            window.removeEventListener("scroll", updatePosition, true);
            window.removeEventListener("resize", updatePosition);
        };
    }, [showAccountDropdown, isRTL]);

    // Clear close timeout on unmount
    useEffect(() => () => {
        if (closeDropdownTimeoutRef.current) clearTimeout(closeDropdownTimeoutRef.current);
    }, []);

    const isActive = (path: string) => {
        if (path === "/" || path === "/home") {
            return location.pathname === "/" || location.pathname === "/home";
        }
        return location.pathname.startsWith(path);
    };

    // Main navigation items: Home, Categories (no dropdown), Brands, All shops, My baskets, Points & rewards, Help & support
    const navItems = [
        { path: paths.client.home, label: t("home.home") || "Home" },
        { path: paths.client.categories, label: t("categories.mainCategories") || "Main Categories" },
        { path: paths.client.brands, label: t("home.brands") || "Brands" },
        { path: paths.client.store, label: t("store.allShops") || "All shops" },
        { path: paths.client.baskets, label: t("account.menu.myBaskets") || "My baskets" },
        { path: paths.account.pointsRewards, label: t("account.menu.pointsRewards") || "Points & rewards" },
        { path: paths.account.helpSupport, label: t("account.menu.helpSupport") || "Help & support" },
    ];

    // Account dropdown items with icons (main sections for creative dropdown)
    const baseAccountItems = [
        { path: paths.account.profile, label: t("account.menu.profile") || "Profile", icon: HiUser },
        { path: paths.account.addresses, label: t("account.menu.addresses") || "Addresses", icon: HiLocationMarker },
        { path: paths.account.paymentMethods, label: t("account.menu.paymentMethods") || "Payment methods", icon: HiCreditCard },
        { path: paths.account.orders, label: t("account.menu.myOrders") || "My orders", icon: HiShoppingBag },
        { path: paths.account.baskets, label: t("account.menu.myBaskets") || "My baskets", icon: HiShoppingCart },
        { path: paths.account.packages, label: t("account.menu.myPackages") || "My packages", icon: HiCube },
        { path: paths.account.wishlist, label: t("account.menu.wishlist") || "Wishlist", icon: HiHeart },
        { path: paths.account.pointsRewards, label: t("account.menu.pointsRewards") || "Points & rewards", icon: HiGift },
        { path: paths.account.notifications, label: t("account.menu.notifications") || "Notifications", icon: HiBell },
        { path: paths.account.reviews, label: t("account.menu.myReviews") || "Reviews", icon: HiStar },
        { path: paths.account.helpSupport, label: t("account.menu.helpSupport") || "Help & support", icon: HiQuestionMarkCircle },
        { path: paths.account.settings, label: t("account.menu.settings") || "Settings", icon: HiCog },
    ];
    const accountItems = authenticated
        ? isApprovedMarketer
            ? [
                baseAccountItems[0],
                { path: paths.marketerDashboard, label: t("account.menu.marketerDashboard") || "Marketer Dashboard", icon: HiTrendingUp },
                ...baseAccountItems.slice(1),
            ]
            : baseAccountItems
        : [];

    return (
        <div className="bg-custom-card" dir={isRTL ? "rtl" : "ltr"}>
            {/* Top Header Section */}
            <div className="bg-custom-card border-b border-custom-primary">
                <div className="page-container overflow-x-hidden">
                    <div className="flex items-center justify-between py-3 gap-2 sm:gap-3 lg:gap-4 min-w-0">
                        {/* Logo */}
                        <Link
                            to={paths.client.home}
                            className="flex items-center gap-2 shrink-0"
                            aria-label="Tikmool Home"
                        >
                            {!logoError ? (
                                <img
                                    src="/images/shared/logo.jpg"
                                    alt="Tikmool"
                                    className="h-9 md:h-10 w-auto object-contain"
                                    onError={() => setLogoError(true)}
                                />
                            ) : (
                                <div className="w-9 h-9 md:w-10 md:h-10 bg-primary-light rounded-lg flex items-center justify-center">
                                    <span className="text-white text-lg md:text-xl font-bold">
                                        ∞
                                    </span>
                                </div>
                            )}
                        </Link>

                        {/* Delivery Address - Hidden on mobile, shown on lg+ */}
                        <div className="hidden lg:flex flex-1 min-w-0 max-w-[280px] xl:max-w-md relative">
                            {authenticated ? (
                                <button
                                    type="button"
                                    onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                                    className="flex items-center gap-2 px-4 py-2 bg-custom-card rounded-lg hover:bg-custom-light transition-colors w-full text-left"
                                >
                                    <HiLocationMarker className="text-primary-light w-5 h-5 shrink-0" />
                                    <div className="flex flex-col items-start flex-1 min-w-0">
                                        <span className="text-xs text-gray-light">
                                            {t("navbar.deliveringTo")}
                                        </span>
                                        <span className="text-sm font-medium text-custom-primary truncate w-full">
                                            {addressesLoading
                                                ? t("common.loading")
                                                : deliveryAddressDisplay ||
                                                t("navbar.addAddress") ||
                                                "Add address"}
                                        </span>
                                    </div>
                                    <HiChevronDown className="text-gray-light w-4 h-4 shrink-0" />
                                </button>
                            ) : (
                                <Link
                                    to={paths.auth.jwt.signIn}
                                    className="flex items-center gap-2 px-4 py-2 bg-custom-card rounded-lg hover:bg-custom-light transition-colors w-full text-left"
                                >
                                    <HiLocationMarker className="text-primary-light w-5 h-5 shrink-0" />
                                    <div className="flex flex-col items-start flex-1 min-w-0">
                                        <span className="text-xs text-gray-light">
                                            {t("navbar.deliveringTo")}
                                        </span>
                                        <span className="text-sm font-medium text-custom-primary truncate w-full">
                                            {t("auth.login") || "Login"}
                                        </span>
                                    </div>
                                </Link>
                            )}
                            {showLocationDropdown && authenticated && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-custom-card rounded-lg shadow-lg border border-gray-bold z-50">
                                    <div className="p-4">
                                        <Link
                                            to={paths.account.addAddress}
                                            className="block w-full mb-3 px-4 py-2 text-center bg-primary-light/10 text-primary-light rounded-lg font-medium hover:bg-primary-light/20"
                                            onClick={() => setShowLocationDropdown(false)}
                                        >
                                            {t("navbar.addNewAddress") || "Add new address"}
                                        </Link>
                                        {addresses.length === 0 ? (
                                            <p className="text-sm text-gray-light py-2">
                                                {t("navbar.noAddresses") || "No addresses yet"}
                                            </p>
                                        ) : (
                                            <div className="space-y-2 max-h-48 overflow-y-auto">
                                                {addresses.map((addr) => {
                                                    const parts = [
                                                        addr.street_name,
                                                        addr.building_number,
                                                        getAreaName(addr.area),
                                                    ].filter(Boolean);
                                                    const label = parts.join(",") || addr.label;
                                                    return (
                                                        <button
                                                            key={addr.id}
                                                            type="button"
                                                            onClick={() => {
                                                                setAddressId(addr.id);
                                                                setShowLocationDropdown(false);
                                                            }}
                                                            className={`w-full text-left px-4 py-2 rounded-lg hover:bg-blue-off ${selectedAddress?.id === addr.id
                                                                ? "bg-primary-light/10 font-medium"
                                                                : ""
                                                                }`}
                                                        >
                                                            {label}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Search Bar - Full on lg+, icon only on smaller screens */}
                        <div className="hidden lg:flex flex-1 min-w-0 max-w-md xl:max-w-2xl">
                            <NavbarSearch className="flex-1 min-w-0 w-full max-w-full" />
                        </div>

                        {/* Mobile Search Icon */}
                        <button
                            type="button"
                            className="lg:hidden p-2 hover:bg-custom-tertiary rounded-lg transition-colors shrink-0"
                            aria-label={t("home.searchProducts") || "Search"}
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <HiSearch className="w-6 h-6 text-custom-primary" />
                        </button>

                        {/* Right Icons */}
                        <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3 shrink-0">
                            {/* Wishlist - Shown when nav visible (lg+) */}
                            <Link
                                to={paths.account.wishlist}
                                className="hidden lg:block p-2 hover:bg-custom-light rounded-full transition-colors"
                                aria-label={t("account.menu.wishlist") || "Wishlist"}
                            >
                                <HiHeart className="w-6 h-6 text-primary-light" />
                            </Link>
                            {/* Orders - Shown when nav visible (lg+) */}
                            <Link
                                to={paths.account.orders}
                                className="hidden lg:block p-2 hover:bg-custom-light rounded-full transition-colors"
                                aria-label={t("account.menu.myOrders") || "My orders"}
                            >
                                <HiShoppingBag className="w-6 h-6 text-primary-light" />
                            </Link>
                            {/* Cart - Always visible */}
                            <Link
                                to={paths.client.cart}
                                className="relative p-2 hover:bg-custom-light rounded-full transition-colors"
                            >
                                <HiShoppingCart className="w-6 h-6 text-primary-light" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 bg-amber-400 text-custom-primary text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                                        {cartCount > 99 ? "99+" : cartCount}
                                    </span>
                                )}
                            </Link>
                            {/* Login - Hidden on mobile if authenticated, shown if not */}
                            {!authenticated && (
                                <Link
                                    to={paths.auth.jwt.signIn}
                                    className="hidden sm:flex items-center gap-2 px-3 lg:px-4 py-2 bg-primary-light text-white rounded-lg font-medium hover:bg-primary transition-colors text-sm lg:text-base"
                                >
                                    <HiLogin className="w-5 h-5 shrink-0" />
                                    <span className="hidden xl:inline">
                                        {t("auth.login") || "Login"}
                                    </span>
                                </Link>
                            )}
                            {/* Profile - lg+: circular avatar with creative dropdown (click + hover) */}
                            {authenticated && (
                                <div
                                    data-account-dropdown
                                    className="hidden lg:block relative"
                                    onMouseEnter={() => {
                                        if (closeDropdownTimeoutRef.current) {
                                            clearTimeout(closeDropdownTimeoutRef.current);
                                            closeDropdownTimeoutRef.current = null;
                                        }
                                        setShowAccountDropdown(true);
                                    }}
                                    onMouseLeave={() => {
                                        closeDropdownTimeoutRef.current = setTimeout(() => {
                                            setShowAccountDropdown(false);
                                            closeDropdownTimeoutRef.current = null;
                                        }, 180);
                                    }}
                                >
                                    <button
                                        ref={profileButtonRef}
                                        data-account-dropdown-trigger
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowAccountDropdown((prev) => !prev);
                                        }}
                                        className={`flex items-center rounded-full focus:outline-none focus:ring-2 focus:ring-primary-light focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all ${showAccountDropdown ? "ring-2 ring-primary-light ring-offset-2 dark:ring-offset-gray-900" : ""
                                            }`}
                                    >
                                        {/* {profile?.image?.trim() ? (
                                            <img
                                                src={profile.image}
                                                alt=""
                                                className="w-9 h-9 rounded-full object-cover border-2 border-custom-primary hover:border-primary-light transition-colors"
                                            />
                                        ) : ( */}
                                            <div className="w-9 h-9 rounded-full bg-primary-light/20 flex items-center justify-center text-primary-light font-semibold text-sm border-2 border-primary-light/30">
                                                {profileInitial}
                                            </div>
                                        {/* )} */}
                                    </button>
                                    {showAccountDropdown && dropdownPosition && createPortal(
                                        <div
                                            data-account-dropdown-panel
                                            dir={isRTL ? "rtl" : "ltr"}
                                            onMouseEnter={() => {
                                                if (closeDropdownTimeoutRef.current) {
                                                    clearTimeout(closeDropdownTimeoutRef.current);
                                                    closeDropdownTimeoutRef.current = null;
                                                }
                                                setShowAccountDropdown(true);
                                            }}
                                            onMouseLeave={() => {
                                                closeDropdownTimeoutRef.current = setTimeout(() => {
                                                    setShowAccountDropdown(false);
                                                    closeDropdownTimeoutRef.current = null;
                                                }, 180);
                                            }}
                                            className="fixed z-[9999] pt-3 transition-opacity duration-200"
                                            style={{
                                                top: dropdownPosition.top,
                                                ...(dropdownPosition.left != null
                                                    ? { left: dropdownPosition.left, right: "auto" }
                                                    : { right: dropdownPosition.right ?? 0, left: "auto" }),
                                            }}
                                        >
                                            <div className={`bg-custom-card rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15),0_0_0_1px_rgba(0,0,0,0.05)] dark:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.4)] min-w-[260px] overflow-hidden ${isRTL ? "ml-0" : "mr-0"}`}>
                                                <div className="p-2 max-h-[70vh] overflow-y-auto">
                                                    {accountItems.map((item) => {
                                                        const Icon = item.icon;
                                                        return (
                                                            <Link
                                                                key={item.path}
                                                                to={item.path}
                                                                className="flex items-center gap-3 px-4 py-3 rounded-xl text-custom-primary text-sm font-medium hover:bg-primary-light/10 hover:text-primary-light transition-colors"
                                                                onClick={() => setShowAccountDropdown(false)}
                                                            >
                                                                <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary-light/10 text-primary-light shrink-0">
                                                                    <Icon className="w-5 h-5" />
                                                                </span>
                                                                <span>{item.label}</span>
                                                            </Link>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>,
                                        document.body
                                    )}
                                </div>
                            )}
                            {/* Theme toggle - Dark/Light */}
                            <button
                                type="button"
                                onClick={toggleTheme}
                                className="hidden sm:flex p-2 rounded-lg hover:bg-custom-light transition-colors text-custom-primary"
                                aria-label={
                                    theme === "dark"
                                        ? t("navbar.lightMode") || "Light mode"
                                        : t("navbar.darkMode") || "Dark mode"
                                }
                            >
                                {theme === "dark" ? (
                                    <HiSun className="w-5 h-5 text-primary-light" />
                                ) : (
                                    <HiMoon className="w-5 h-5 text-primary-light" />
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={toggleLanguage}
                                className="hidden sm:flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-custom-light transition-colors text-custom-primary"
                                aria-label={t("navbar.language") || "Language"}
                            >
                                <HiGlobe className="w-5 h-5 text-primary-light" />
                                <span className="text-sm font-medium">
                                    {language === "en" ? "AR" : "EN"}
                                </span>
                            </button>
                            {/* Mobile Menu Button (hidden when nav bar is visible) */}
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="lg:hidden p-2 hover:bg-custom-light rounded-lg transition-colors"
                                aria-label={t("navbar.menu") || "Menu"}
                            >
                                {isMobileMenuOpen ? (
                                    <HiX className="w-6 h-6 text-custom-primary" />
                                ) : (
                                    <HiMenu className="w-6 h-6 text-custom-primary" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Bar - Main sections only (lg+), full responsive with horizontal scroll when needed */}
            <div className="hidden lg:block bg-custom-card border-b-2 border-primary-light/30">
                <div className="page-container overflow-x-hidden">
                    <div className="flex items-center justify-between py-3 gap-2 lg:gap-4 min-w-0">
                        <div className="flex items-center gap-2 xl:gap-4 2xl:gap-6 flex-nowrap overflow-x-auto min-w-0 scrollbar-custom">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`px-2 lg:px-3 py-2 rounded-lg font-medium transition-colors text-sm xl:text-base whitespace-nowrap shrink-0 ${isActive(item.path)
                                        ? "text-primary-light underline decoration-2 underline-offset-4"
                                        : "text-custom-primary hover:text-primary-light"
                                        }`}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                        {(showBecomeMarketer || isApprovedMarketer) && (
                            <div className="flex items-center gap-2 xl:gap-3 shrink-0">
                                {showBecomeMarketer && (
                                    <Link
                                        to={paths.becomeMarketer}
                                        className="px-4 lg:px-5 xl:px-6 py-2 lg:py-2.5 bg-primary-light text-white rounded-full font-medium hover:bg-primary-light/90 hover:opacity-95 transition-all text-xs lg:text-sm xl:text-base whitespace-nowrap shadow-sm"
                                    >
                                        {t("navbar.becomeMarketer")}
                                    </Link>
                                )}
                                {isApprovedMarketer && (
                                    <Link
                                        to={paths.marketerDashboard}
                                        className="px-4 lg:px-5 xl:px-6 py-2 lg:py-2.5 bg-primary-light text-white rounded-full font-medium hover:bg-primary-light/90 hover:opacity-95 transition-all text-xs lg:text-sm xl:text-base whitespace-nowrap shadow-sm"
                                    >
                                        {t("account.menu.marketerDashboard")}
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                        onClick={() => setIsMobileMenuOpen(false)}
                        aria-hidden="true"
                    />
                    {/* Menu */}
                    <div
                        className={`fixed top-0 ${isRTL ? "left-0" : "right-0"
                            } h-full w-80 max-w-[85vw] bg-custom-card z-50 lg:hidden shadow-2xl transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen
                                ? "translate-x-0"
                                : isRTL
                                    ? "-translate-x-full"
                                    : "translate-x-full"
                            }`}
                        dir={isRTL ? "rtl" : "ltr"}
                    >
                        <div className="flex flex-col h-full overflow-y-auto">
                            {/* Header */}
                            <div className="flex items-center justify-between p-4 border-b border-custom-primary">
                                <span className="text-lg font-bold text-custom-primary">
                                    {t("navbar.menu")}
                                </span>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={toggleTheme}
                                        className="p-2 rounded-lg hover:bg-custom-tertiary transition-colors text-custom-primary"
                                        aria-label={
                                            theme === "dark"
                                                ? t("navbar.lightMode") || "Light mode"
                                                : t("navbar.darkMode") || "Dark mode"
                                        }
                                    >
                                        {theme === "dark" ? (
                                            <HiSun className="w-5 h-5 text-primary-light" />
                                        ) : (
                                            <HiMoon className="w-5 h-5 text-primary-light" />
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={toggleLanguage}
                                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-custom-tertiary transition-colors text-custom-primary"
                                    >
                                        <HiGlobe className="w-5 h-5 text-primary-light" />
                                        <span className="text-sm font-medium">
                                            {language === "en" ? "AR" : "EN"}
                                        </span>
                                    </button>
                                    <button
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="p-2 hover:bg-custom-tertiary rounded-lg transition-colors"
                                    >
                                        <HiX className="w-6 h-6 text-custom-primary" />
                                    </button>
                                </div>
                            </div>

                            {/* Delivery Address - Mobile */}
                            <div className="p-4 border-b border-custom-primary">
                                {authenticated ? (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowLocationDropdown(!showLocationDropdown)
                                            }
                                            className="flex items-center gap-2 px-4 py-2 bg-blue-off rounded-lg w-full text-left"
                                        >
                                            <HiLocationMarker className="text-primary-light w-5 h-5 shrink-0" />
                                            <div className="flex flex-col items-start flex-1 min-w-0">
                                                <span className="text-xs text-gray-light">
                                                    {t("navbar.deliveringTo")}
                                                </span>
                                                <span className="text-sm font-medium text-custom-primary truncate w-full">
                                                    {addressesLoading
                                                        ? t("common.loading")
                                                        : deliveryAddressDisplay ||
                                                        t("navbar.addAddress") ||
                                                        "Add address"}
                                                </span>
                                            </div>
                                            <HiChevronDown className="text-gray-light w-4 h-4 shrink-0" />
                                        </button>
                                        {showLocationDropdown && (
                                            <div className="mt-2 bg-custom-card rounded-lg border border-gray-bold">
                                                <div className="p-4">
                                                    <Link
                                                        to={paths.account.addAddress}
                                                        className="block w-full mb-3 px-4 py-2 text-center bg-primary-light/10 text-primary-light rounded-lg font-medium hover:bg-primary-light/20"
                                                        onClick={() => setShowLocationDropdown(false)}
                                                    >
                                                        {t("navbar.addNewAddress") || "Add new address"}
                                                    </Link>
                                                    {addresses.length === 0 ? (
                                                        <p className="text-sm text-gray-light py-2">
                                                            {t("navbar.noAddresses") || "No addresses yet"}
                                                        </p>
                                                    ) : (
                                                        <div className="space-y-2 max-h-48 overflow-y-auto">
                                                            {addresses.map((addr) => {
                                                                const parts = [
                                                                    addr.street_name,
                                                                    addr.building_number,
                                                                    getAreaName(addr.area),
                                                                ].filter(Boolean);
                                                                const label = parts.join(",") || addr.label;
                                                                return (
                                                                    <button
                                                                        key={addr.id}
                                                                        type="button"
                                                                        onClick={() => {
                                                                            setAddressId(addr.id);
                                                                            setShowLocationDropdown(false);
                                                                        }}
                                                                        className={`w-full text-left px-4 py-2 rounded-lg hover:bg-blue-off ${selectedAddress?.id === addr.id
                                                                            ? "bg-primary-light/10 font-medium"
                                                                            : ""
                                                                            }`}
                                                                    >
                                                                        {label}
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <Link
                                        to={paths.auth.jwt.signIn}
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-off rounded-lg w-full text-left"
                                    >
                                        <HiLocationMarker className="text-primary-light w-5 h-5 shrink-0" />
                                        <div className="flex flex-col items-start flex-1 min-w-0">
                                            <span className="text-xs text-gray-light">
                                                {t("navbar.deliveringTo")}
                                            </span>
                                            <span className="text-sm font-medium text-custom-primary truncate w-full">
                                                {t("auth.login") || "Login"}
                                            </span>
                                        </div>
                                    </Link>
                                )}
                            </div>

                            {/* Search Bar - Mobile */}
                            <div className="p-4 border-b border-custom-primary">
                                <NavbarSearch
                                    onResultSelect={() =>
                                        setIsMobileMenuOpen(false)
                                    }
                                />
                            </div>

                            {/* Navigation Items */}
                            <div className="flex-1 overflow-y-auto py-2">
                                <div className="px-2">
                                    {navItems.map((item) => (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={`block px-4 py-3 rounded-lg font-medium transition-colors ${isActive(item.path)
                                                ? "text-primary-light bg-primary-light/10"
                                                : "text-custom-primary hover:bg-blue-off"
                                                }`}
                                        >
                                            {item.label}
                                        </Link>
                                    ))}
                                </div>

                                {/* Account Section - Mobile (creative style with icons) */}
                                {authenticated && accountItems.length > 0 && (
                                    <>
                                        <div className="px-4 py-2 mt-4 border-t border-custom-primary">
                                            <div className="text-xs font-semibold text-gray-light uppercase mb-3">
                                                {t("navbar.account")}
                                            </div>
                                            <div className="space-y-1 rounded-xl bg-primary-light/5 p-2">
                                                {accountItems.map((item) => {
                                                    const Icon = item.icon;
                                                    return (
                                                        <Link
                                                            key={item.path}
                                                            to={item.path}
                                                            onClick={() => setIsMobileMenuOpen(false)}
                                                            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive(item.path)
                                                                ? "text-primary-light bg-primary-light/10"
                                                                : "text-custom-primary hover:bg-primary-light/10"
                                                                }`}
                                                        >
                                                            <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary-light/10 text-primary-light shrink-0">
                                                                <Icon className="w-5 h-5" />
                                                            </span>
                                                            <span>{item.label}</span>
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* Become a Marketer - Mobile (only when logged in and not yet approved marketer) */}
                                {(showBecomeMarketer || isApprovedMarketer) && (
                                    <div className="px-4 py-2 mt-4 border-t border-custom-primary space-y-2">
                                        {showBecomeMarketer && (
                                            <Link
                                                to={paths.becomeMarketer}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className="block w-full px-4 py-3 bg-primary-light text-white rounded-lg font-medium hover:bg-primary transition-colors text-center"
                                            >
                                                {t("navbar.becomeMarketer")}
                                            </Link>
                                        )}
                                        {isApprovedMarketer && (
                                            <Link
                                                to={paths.marketerDashboard}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className="block w-full px-4 py-3 bg-primary-light text-white rounded-lg font-medium hover:bg-primary transition-colors text-center"
                                            >
                                                {t("account.menu.marketerDashboard")}
                                            </Link>
                                        )}
                                    </div>
                                )}

                                {/* Login - Mobile (if not authenticated) */}
                                {!authenticated && (
                                    <div className="px-4 py-2 mt-4 border-t border-custom-primary">
                                        <Link
                                            to={paths.auth.jwt.signIn}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-primary-light text-white rounded-lg font-medium hover:bg-primary transition-colors"
                                        >
                                            <HiLogin className="w-5 h-5" />
                                            <span>{t("auth.login") || "Login"}</span>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
