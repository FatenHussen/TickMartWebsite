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
    HiUserAdd,
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
    HiTag,
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
import AffiliatePackagesPopup from "@/components/AffiliatePackagesPopup";
import { usePackages } from "@/features/account/hooks/usePackages";
import { NavMenuLink, useNavMenu } from "@/features/navigation";
import { PremiumSkeletonBlock } from "@/shared/component/loading";
import { cn } from "@/shared/lib/utils";

/** Keep in sync with `.page-container` in `index.css`. */
const HEADER_MAX = "page-container";
/** Light: white pill + brand icons. Dark: glass chip; API colour on icon + hover glow only. */
const ICON_CIRCLE =
    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/25 bg-white text-primary shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-[background-color,border-color,box-shadow,color,transform] duration-200 ease-out hover:-translate-y-0.5 hover:border-primary/45 hover:bg-primary/[0.08] hover:text-primary hover:shadow-[0_4px_12px_-4px_color-mix(in_srgb,var(--color-main)_35%,transparent)] active:translate-y-0 dark:border-white/[0.08] dark:bg-white/[0.05] dark:text-primary dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),0_6px_28px_-12px_rgba(0,0,0,0.55)] dark:backdrop-blur-md dark:hover:bg-[color-mix(in_srgb,var(--color-main)_13%,transparent)] dark:hover:shadow-[0_0_32px_-12px_color-mix(in_srgb,var(--color-main)_28%,transparent),inset_0_1px_0_0_rgba(255,255,255,0.08)]";

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
    const [packagesPopupOpen, setPackagesPopupOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    // Soft elevation cue once the page starts scrolling (transform/shadow only — no layout shift)
    useEffect(() => {
        let raf = 0;
        const onScroll = () => {
            if (raf) return;
            raf = requestAnimationFrame(() => {
                setIsScrolled(window.scrollY > 8);
                raf = 0;
            });
        };
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", onScroll);
            if (raf) cancelAnimationFrame(raf);
        };
    }, []);

    const { data: packages = [], isLoading: packagesLoading } = usePackages(authenticated);

    const { data: addresses = [], isLoading: addressesLoading } =
        useAddresses(authenticated);
    const { addressId, setAddressId } = useCheckoutStore();
    const items = useCartStore((s) => s.items);
    const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);
    const { data: profile } = useProfile();

    const profileName = useMemo(() => {
        const getName = (n: unknown): string => {
            if (n == null) return "";
            if (typeof n === "string") return n;
            if (typeof n === "object" && n !== null && ("ar" in n || "en" in n)) {
                const o = n as Record<string, string>;
                return o[language] || o.en || o.ar || "";
            }
            return "";
        };
        return getName(profile?.name) || authUser?.name || "";
    }, [profile?.name, authUser?.name, language]);

    const profileInitial = useMemo(
        () => profileName.charAt(0).toUpperCase() || "?",
        [profileName],
    );

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

    const navLinkClass = (active: boolean) =>
        cn(
            "navbar-premium-nav-link inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium whitespace-nowrap shrink-0 transition-[color,background-color,transform] duration-200 ease-out active:scale-[0.97]",
            active && "navbar-premium-nav-link--active",
            active
                ? "bg-primary/10 text-primary"
                : "text-text-secondary hover:bg-primary/[0.06] hover:text-primary",
        );

    const mobileNavLinkClass = (active: boolean) =>
        cn(
            "flex w-full items-center gap-2.5 rounded-lg px-4 py-3 text-start font-medium transition-colors",
            active
                ? "text-primary-light bg-primary-light/10"
                : "text-custom-primary hover:bg-blue-off",
        );

    // The bar's items, their order and their titles all come from the dashboard
    // (`GET /user/nav-menu`) — nothing about it is hardcoded here anymore.
    const { items: navMenuItems, isLoading: navMenuLoading } = useNavMenu();
    const navMenuPending = navMenuLoading && navMenuItems.length === 0;
    const showMarketerCta = showBecomeMarketer || isApprovedMarketer;
    /** An empty menu hides the row rather than leaving an empty bar behind. */
    const showSubNavRow = navMenuPending || navMenuItems.length > 0 || showMarketerCta;

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
    const desktopShortcutItems = [
        { path: paths.client.home, label: t("offers") || "Offers", icon: HiTag },
        { path: paths.account.baskets, label: t("account.menu.myBaskets") || "Baskets", icon: HiShoppingBag },
        { path: paths.account.wishlist, label: t("account.menu.wishlist") || "Wishlist", icon: HiHeart },
        { path: paths.account.orders, label: t("account.menu.myOrders") || "Orders", icon: HiCube },
        { path: paths.client.cart, label: t("cart.title") || "Cart", icon: HiShoppingCart, badge: cartCount },
    ];

    return (
        <div className="w-full bg-custom-card dark:bg-transparent" dir={isRTL ? "rtl" : "ltr"}>
            <header
                className={cn(
                    "navbar-elevate w-full",
                    isScrolled && "navbar-elevate--scrolled",
                )}
            >
                <div className="navbar-surface-top w-full">
                <div className={`${HEADER_MAX} overflow-x-hidden`}>
                    <div className="navbar-top-row flex min-h-[60px] min-w-0 items-center gap-3 py-3 sm:min-h-[64px] sm:gap-4 md:min-h-[72px] lg:gap-6 xl:gap-8 2xl:gap-10">
                        <div className="flex min-w-0 shrink-0 items-center gap-5 lg:gap-6 xl:gap-8">
                            <Link
                                to={paths.client.home}
                                className="flex shrink-0 items-center gap-2"
                                aria-label="Tikmart Home"
                            >
                                {!logoError ? (
                                    <img
                                        src="/images/shared/logo.png"
                                        alt="Tikmart"
                                        className="h-16 w-auto max-w-[min(480px,56vw)] object-contain sm:h-[4.5rem] md:h-24 lg:h-18 xl:h-22 md:max-w-[min(500px,92vw)]"
                                        onError={() => setLogoError(true)}
                                    />
                                ) : (
                                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-primary-light sm:h-[4.5rem] md:h-24">
                                        <span className="text-xl font-bold text-white">∞</span>
                                    </div>
                                )}
                            </Link>

                        {/* Delivery Address - Hidden on mobile, shown on lg+ */}
                        <div className="relative hidden max-w-[260px] min-w-0 shrink-0 lg:flex xl:max-w-[300px] 2xl:max-w-[320px]">
                            {authenticated ? (
                                <button
                                    type="button"
                                    onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                                    className="group flex w-full items-center gap-2.5 rounded-2xl border border-black/[0.07] bg-white px-3 py-2 text-start transition-[background-color,border-color,box-shadow,transform] duration-200 ease-out hover:-translate-y-px hover:border-primary/25 hover:bg-primary/[0.04] hover:shadow-[0_4px_14px_-8px_rgba(15,23,42,0.18)] dark:border-white/[0.08] dark:bg-white/[0.04] dark:hover:bg-[color-mix(in_srgb,var(--color-main)_10%,transparent)]"
                                >
                                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                        <HiLocationMarker className="h-[18px] w-[18px]" />
                                    </span>
                                    <div className="flex min-w-0 flex-1 flex-col items-start">
                                        <span className="text-[11px] font-medium leading-tight text-custom-secondary dark:text-[#A1A1AA]">
                                            {t("navbar.deliveringTo")}
                                        </span>
                                        <span className="w-full truncate text-sm font-semibold text-custom-primary dark:text-white">
                                            {addressesLoading
                                                ? t("common.loading")
                                                : deliveryAddressDisplay ||
                                                t("navbar.addAddress") ||
                                                "Add address"}
                                        </span>
                                    </div>
                                    <HiChevronDown className="h-4 w-4 shrink-0 text-custom-secondary transition-transform duration-200 group-hover:translate-y-px dark:text-[#71717A]" />
                                </button>
                            ) : (
                                <Link
                                    to={paths.auth.jwt.signIn}
                                    className="flex w-full items-center gap-2.5 rounded-2xl border border-black/[0.07] bg-white px-3 py-2 text-start transition-[background-color,border-color,box-shadow,transform] duration-200 ease-out hover:-translate-y-px hover:border-primary/25 hover:bg-primary/[0.04] hover:shadow-[0_4px_14px_-8px_rgba(15,23,42,0.18)] dark:border-white/[0.08] dark:bg-white/[0.04] dark:hover:bg-[color-mix(in_srgb,var(--color-main)_10%,transparent)]"
                                >
                                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                        <HiLocationMarker className="h-[18px] w-[18px]" />
                                    </span>
                                    <div className="flex min-w-0 flex-1 flex-col items-start">
                                        <span className="text-[11px] font-medium leading-tight text-custom-secondary dark:text-[#A1A1AA]">
                                            {t("navbar.deliveringTo")}
                                        </span>
                                        <span className="w-full truncate text-sm font-semibold text-custom-primary dark:text-white">
                                            {t("navbar.selectLocation") || "Select your location"}
                                        </span>
                                    </div>
                                </Link>
                            )}
                            {showLocationDropdown && authenticated && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-custom-card rounded-2xl shadow-[0_16px_50px_-12px_rgba(15,23,42,0.25)] border border-black/[0.06] z-50 dark:border-white/[0.06]">
                                    <div className="p-4">
                                        <Link
                                            to={paths.account.addAddress}
                                            className="block w-full mb-3 px-4 py-2.5 text-center bg-primary/10 text-primary rounded-xl font-semibold transition-colors hover:bg-primary/15"
                                            onClick={() => setShowLocationDropdown(false)}
                                        >
                                            {t("navbar.addNewAddress") || "Add new address"}
                                        </Link>
                                        {addresses.length === 0 ? (
                                            <p className="text-sm text-custom-secondary py-2">
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
                        </div>

                        <div className="hidden min-w-0 flex-1 items-center justify-center px-2 lg:flex xl:px-5 2xl:px-8">
                            <div className="relative min-w-0 w-full max-w-[min(820px,100%)]">
                                <NavbarSearch className="w-full" />
                            </div>
                        </div>

                        <button
                            type="button"
                            className={cn(ICON_CIRCLE, "lg:hidden shrink-0")}
                            aria-label={t("home.searchProducts") || "Search"}
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <HiSearch className="h-6 w-6" />
                        </button>

                        <div className="flex shrink-0 items-center gap-3 sm:gap-3 lg:gap-3">
                            <div className="hidden items-center gap-3 lg:flex">
                                {desktopShortcutItems.map((item) => {
                                    const Icon = item.icon;
                                    const isCart = item.path === paths.client.cart;
                                    const active = !isCart && item.path !== paths.client.home && isActive(item.path);
                                    return (
                                        <Link
                                            key={item.label}
                                            to={item.path}
                                            className={cn(
                                                ICON_CIRCLE,
                                                "relative",
                                                active && "border-primary/40 bg-primary/[0.08] text-primary",
                                            )}
                                            aria-label={item.label}
                                            aria-current={active ? "page" : undefined}
                                        >
                                            <Icon className="h-5 w-5" />
                                            {active && (
                                                <span className="absolute -bottom-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary" aria-hidden />
                                            )}
                                            {isCart && cartCount > 0 && (
                                                <span className="absolute -top-1 -right-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-white bg-primary-light px-1 text-[10px] font-bold text-white">
                                                    {cartCount > 99 ? "99+" : cartCount}
                                                </span>
                                            )}
                                        </Link>
                                    );
                                })}
                            </div>
                            <Link
                                to={paths.client.cart}
                                className={cn(ICON_CIRCLE, "relative lg:hidden")}
                            >
                                <HiShoppingCart className="h-6 w-6" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 flex min-w-[18px] items-center justify-center rounded-full bg-amber-400 px-1 text-xs font-bold text-custom-primary">
                                        {cartCount > 99 ? "99+" : cartCount}
                                    </span>
                                )}
                            </Link>
                            {!authenticated && (
                                <Link
                                    to={paths.auth.jwt.signIn}
                                    className="group hidden items-center gap-2 rounded-full border border-black/[0.08] bg-white px-4 py-2 text-sm font-semibold text-primary shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-[background-color,border-color,box-shadow,transform] duration-200 ease-out hover:-translate-y-0.5 hover:border-primary/30 hover:bg-primary/[0.06] hover:shadow-[0_4px_14px_-6px_rgba(15,23,42,0.16)] sm:flex lg:text-base dark:border-white/[0.1] dark:bg-white/[0.06] dark:text-primary dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] dark:backdrop-blur-md dark:hover:border-[color-mix(in_srgb,var(--color-main)_35%,transparent)] dark:hover:bg-[color-mix(in_srgb,var(--color-main)_14%,transparent)] dark:hover:shadow-[0_0_28px_-12px_color-mix(in_srgb,var(--color-main)_25%,transparent)]"
                                >
                                    <HiUserAdd className="h-5 w-5 shrink-0 text-[#F39C12] transition-colors duration-300 group-hover:text-[#d68910]" />
                                    <span className="hidden xl:inline">
                                        {t("common.loginRegister") || "Login"}
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
                                        className={cn(
                                            "group flex items-center gap-2 rounded-full border border-black/[0.07] bg-white py-1 pe-1.5 ps-1 transition-[background-color,border-color,box-shadow,transform] duration-200 ease-out hover:-translate-y-px hover:border-primary/25 hover:shadow-[0_4px_14px_-8px_rgba(15,23,42,0.18)] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 xl:pe-3 dark:border-white/[0.08] dark:bg-white/[0.04]",
                                            showAccountDropdown && "border-primary/30 shadow-[0_4px_14px_-8px_rgba(15,23,42,0.2)]",
                                        )}
                                    >
                                        {profile?.image?.trim() ? (
                                            <img
                                                src={profile.image}
                                                alt=""
                                                className="h-9 w-9 rounded-full border border-primary/25 object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-primary/25 bg-primary/10 text-sm font-semibold text-primary">
                                                {profileInitial}
                                            </div>
                                        )}
                                        <span className="hidden min-w-0 max-w-[130px] flex-col items-start leading-tight xl:flex">
                                            <span className="w-full truncate text-sm font-semibold text-custom-primary dark:text-white">
                                                {profileName || t("navbar.account")}
                                            </span>
                                            <span className="w-full truncate text-[11px] font-medium text-custom-secondary dark:text-[#A1A1AA]">
                                                {t("navbar.account")}
                                            </span>
                                        </span>
                                        <HiChevronDown
                                            className={cn(
                                                "hidden h-4 w-4 shrink-0 text-custom-secondary transition-transform duration-200 xl:block dark:text-[#71717A]",
                                                showAccountDropdown && "rotate-180",
                                            )}
                                            aria-hidden
                                        />
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
                                                <div className="flex items-center gap-3 border-b border-black/[0.06] px-4 py-3.5 dark:border-white/[0.06]">
                                                    {profile?.image?.trim() ? (
                                                        <img
                                                            src={profile.image}
                                                            alt=""
                                                            className="h-11 w-11 rounded-full border border-primary/25 object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-primary/25 bg-primary/10 text-base font-semibold text-primary">
                                                            {profileInitial}
                                                        </div>
                                                    )}
                                                    <div className="flex min-w-0 flex-col leading-tight">
                                                        <span className="truncate text-sm font-semibold text-custom-primary dark:text-white">
                                                            {profileName || t("navbar.account")}
                                                        </span>
                                                        {authUser?.email && (
                                                            <span className="truncate text-xs text-custom-secondary dark:text-[#A1A1AA]">
                                                                {authUser.email}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
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
                            <button
                                type="button"
                                onClick={toggleTheme}
                                className={cn(ICON_CIRCLE, "hidden sm:flex")}
                                aria-label={
                                    theme === "dark"
                                        ? t("navbar.lightMode") || "Light mode"
                                        : t("navbar.darkMode") || "Dark mode"
                                }
                            >
                                {theme === "dark" ? (
                                    <HiSun className="h-5 w-5" />
                                ) : (
                                    <HiMoon className="h-5 w-5" />
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={toggleLanguage}
                                className={cn(
                                    ICON_CIRCLE,
                                    "hidden h-auto min-h-10 w-10 flex-col justify-center gap-0.5 py-1 sm:flex",
                                )}
                                aria-label={t("navbar.language") || "Language"}
                            >
                                <HiGlobe className="h-[17px] w-[17px] shrink-0" />
                                <span className="text-[9px] font-bold leading-tight tracking-tight">
                                    {language === "en" ? "AR" : "EN"}
                                </span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className={cn(ICON_CIRCLE, "lg:hidden")}
                                aria-label={t("navbar.menu") || "Menu"}
                            >
                                {isMobileMenuOpen ? (
                                    <HiX className="h-6 w-6" />
                                ) : (
                                    <HiMenu className="h-6 w-6" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
                </div>

                {showSubNavRow && (
                <>
                <hr
                    className="navbar-divider m-0 hidden w-full border-0 border-t lg:block"
                    aria-hidden
                />

                <div className="navbar-surface-sub hidden w-full lg:block">
                <div className={`${HEADER_MAX} overflow-x-hidden`}>
                    <div className="navbar-sub-row hidden min-w-0 items-center justify-between gap-4 py-3 lg:flex">
                        <nav
                            className="navbar-main-nav scrollbar-custom flex min-w-0 flex-nowrap items-center gap-3 overflow-x-auto pb-0.5 sm:gap-4 xl:gap-6"
                            aria-label="Main"
                        >
                            {navMenuPending
                                ? Array.from({ length: 6 }).map((_, i) => (
                                    <PremiumSkeletonBlock
                                        key={i}
                                        className="h-9 w-24 shrink-0"
                                        rounded="rounded-full"
                                    />
                                ))
                                : navMenuItems.map(({ item, destination }) => (
                                    <NavMenuLink
                                        key={item.id}
                                        item={item}
                                        destination={destination}
                                        getClassName={navLinkClass}
                                        onOpenModal={() => setPackagesPopupOpen(true)}
                                    />
                                ))}
                        </nav>
                        {showMarketerCta && (
                            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                                {showBecomeMarketer && (
                                    <Link
                                        to={paths.becomeMarketer}
                                        className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-[0_6px_16px_-8px_color-mix(in_srgb,var(--color-main)_60%,transparent)] transition-[transform,box-shadow,filter] duration-200 ease-out hover:-translate-y-0.5 hover:brightness-105 hover:shadow-[0_10px_22px_-8px_color-mix(in_srgb,var(--color-main)_65%,transparent)] active:translate-y-0"
                                    >
                                        <HiStar className="h-[18px] w-[18px] shrink-0 transition-transform duration-200 group-hover:scale-110" />
                                        {t("navbar.becomeMarketer")}
                                    </Link>
                                )}
                                {isApprovedMarketer && (
                                    <Link
                                        to={paths.marketerDashboard}
                                        className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-[0_6px_16px_-8px_color-mix(in_srgb,var(--color-main)_60%,transparent)] transition-[transform,box-shadow,filter] duration-200 ease-out hover:-translate-y-0.5 hover:brightness-105 hover:shadow-[0_10px_22px_-8px_color-mix(in_srgb,var(--color-main)_65%,transparent)] active:translate-y-0"
                                    >
                                        <HiTrendingUp className="h-[18px] w-[18px] shrink-0 transition-transform duration-200 group-hover:scale-110" />
                                        {t("account.menu.marketerDashboard")}
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                </div>
                </>
                )}

                <hr
                    className="navbar-bottom-edge m-0 w-full border-0 border-b-2"
                    aria-hidden
                />
            </header>

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
                                                <span className="text-xs text-custom-secondary">
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
                                            <HiChevronDown className="text-custom-secondary w-4 h-4 shrink-0" />
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
                                                        <p className="text-sm text-custom-secondary py-2">
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
                                            <span className="text-xs text-custom-secondary">
                                                {t("navbar.deliveringTo")}
                                            </span>
                                            <span className="text-sm font-medium text-custom-primary truncate w-full">
                                                {t("common.login") || "Login"}
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
                                    {navMenuPending
                                        ? Array.from({ length: 6 }).map((_, i) => (
                                            <PremiumSkeletonBlock
                                                key={i}
                                                className="mx-2 my-1.5 h-11"
                                                rounded="rounded-lg"
                                            />
                                        ))
                                        : navMenuItems.map(({ item, destination }) => (
                                            <NavMenuLink
                                                key={item.id}
                                                item={item}
                                                destination={destination}
                                                getClassName={mobileNavLinkClass}
                                                onNavigate={() => setIsMobileMenuOpen(false)}
                                                onOpenModal={() => setPackagesPopupOpen(true)}
                                            />
                                        ))}
                                </div>

                                {/* Account Section - Mobile (creative style with icons) */}
                                {authenticated && accountItems.length > 0 && (
                                    <>
                                        <div className="px-4 py-2 mt-4 border-t border-custom-primary">
                                            <div className="text-xs font-semibold text-custom-secondary uppercase mb-3">
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
                                            className="group flex items-center justify-center gap-2 w-full px-4 py-3 bg-primary-light text-white rounded-lg font-medium hover:bg-primary transition-colors"
                                        >
                                            <HiUserAdd className="w-5 h-5 text-[#F39C12] transition-colors duration-300 group-hover:text-white" />
                                            <span>{t("common.loginRegister") || "Login"}</span>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}

            <AffiliatePackagesPopup
                isOpen={packagesPopupOpen}
                onClose={() => setPackagesPopupOpen(false)}
                packages={packages}
                isLoading={packagesLoading}
            />
        </div>
    );
}
