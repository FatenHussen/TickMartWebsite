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
} from "react-icons/hi";
import LanguageToggle from "./LanguageToggle";
import { paths } from "@/app/routes/path/paths";
import { useState, useEffect, useMemo } from "react";
import { useAuthStore } from "@/store/auth";
import { useAddresses } from "@/features/account/hooks/useAddress";
import { useCheckoutStore } from "@/store/checkout";

export default function Navbar() {
  const { isRTL } = useLanguage();
  const { t } = useTranslation();
  const location = useLocation();
  const { authenticated } = useAuthStore();
  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);

  const { data: addresses = [], isLoading: addressesLoading } =
    useAddresses(authenticated);
  const { addressId, setAddressId } = useCheckoutStore();

  const selectedAddress = useMemo(() => {
    if (addressId != null) {
      return addresses.find(
        (a) => a.id === addressId || a.id === Number(addressId),
      );
    }
    return addresses.find((a) => a.is_default) ?? addresses[0];
  }, [addresses, addressId]);

  const deliveryAddressDisplay = useMemo(() => {
    if (!selectedAddress) return null;
    const parts = [
      selectedAddress.street_name,
      selectedAddress.building_number,
      selectedAddress.floor_apartment,
      selectedAddress.nearest_landmark,
      selectedAddress.area?.name,
    ].filter(Boolean);
    return parts.join(", ") || selectedAddress.label;
  }, [selectedAddress]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => {
    if (path === "/" || path === "/home") {
      return location.pathname === "/" || location.pathname === "/home";
    }
    return location.pathname.startsWith(path);
  };

  // Main navigation items - all routes
  const navItems = [
    { path: paths.client.home, label: t("home.home") || "Home" },
    {
      path: paths.client.categories,
      label: t("categories.mainCategories") || "Categories",
      hasDropdown: true,
    },
    {
      path: paths.client.store,
      label: t("wishlist.allStores") || "All stores",
    },
    { path: paths.client.brands, label: t("home.brands") || "Brands" },
    { path: paths.client.recipes, label: t("recipes.title") || "Recipes" },
    // { path: paths.client.products, label: t("home.products") || "Products" },
    { path: paths.client.baskets, label: t("home.baskets") || "Baskets" },
    // { path: paths.client.cart, label: t("cart.cart") || "Cart" },
    // {
    //   path: paths.client.checkout,
    //   label: t("checkout.checkoutTitle") || "Checkout",
    // },
    {
      path: paths.client.review,
      label: t("checkout.reviewConfirm") || "Review",
    },
    // { path: paths.client.orders, label: t("orders.myOrders") || "My Orders" },
    {
      path: paths.account.baskets,
      label: t("account.menu.myBaskets") || "My baskets",
    },
    // {
    //   path: paths.account.pointsRewards,
    //   label: t("account.menu.pointsRewards") || "Points & rewards",
    // },
    // {
    //   path: paths.account.helpSupport,
    //   label: t("account.menu.helpSupport") || "Help & support",
    // },
  ];

  // Account navigation items
  const accountItems = authenticated
    ? [
        {
          path: paths.account.root,
          label: t("account.menu.profile") || "Account",
        },
        {
          path: paths.account.profile,
          label: t("account.menu.profile") || "Profile",
        },
        {
          path: paths.account.addresses,
          label: t("account.menu.addresses") || "Addresses",
        },
        {
          path: paths.account.paymentMethods,
          label: t("account.menu.paymentMethods") || "Payment Methods",
        },
        {
          path: paths.account.orders,
          label: t("account.menu.myOrders") || "My Orders",
        },
        {
          path: paths.account.baskets,
          label: t("account.menu.myBaskets") || "My Baskets",
        },
        {
          path: paths.account.packages,
          label: t("account.menu.myPackages") || "Packages",
        },
        {
          path: paths.account.wishlist,
          label: t("account.menu.wishlist") || "Wishlist",
        },
        {
          path: paths.account.pointsRewards,
          label: t("account.menu.pointsRewards") || "Points & Rewards",
        },
        {
          path: paths.account.notifications,
          label: t("account.menu.notifications") || "Notifications",
        },
        {
          path: paths.account.reviews,
          label: t("account.menu.myReviews") || "Reviews",
        },
        {
          path: paths.account.helpSupport,
          label: t("account.menu.helpSupport") || "Help & Support",
        },
        {
          path: paths.account.settings,
          label: t("account.menu.settings") || "Settings",
        },
      ]
    : [];

  return (
    <div className="bg-blue-off" dir={isRTL ? "rtl" : "ltr"}>
      {/* Top Header Section */}
      <div className="bg-blue-off border-b border-primary-light/20">
        <div className="page-container">
          <div className="flex items-center justify-between py-3 gap-2 md:gap-4">
            {/* Logo */}
            <Link
              to={paths.client.home}
              className="flex items-center gap-2 shrink-0"
            >
              <div className="w-8 h-8 md:w-10 md:h-10 bg-primary-light rounded-lg flex items-center justify-center">
                <span className="text-white text-lg md:text-xl font-bold">
                  ∞
                </span>
              </div>
              <span className="text-xl md:text-2xl font-bold hidden sm:block">
                <span className="text-primary-light">Tik</span>
                <span className="text-secondary">mool</span>
              </span>
            </Link>

            {/* Delivery Address - Hidden on mobile, shown on tablet+ */}
            <div className="hidden md:flex flex-1 max-w-md relative">
              {authenticated ? (
                <button
                  type="button"
                  onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                  className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg hover:bg-gray-50 transition-colors w-full text-left"
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
                  className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg hover:bg-gray-50 transition-colors w-full text-left"
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
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-bold z-50">
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
                            addr.area?.name,
                          ].filter(Boolean);
                          const label = parts.join(", ") || addr.label;
                          return (
                            <button
                              key={addr.id}
                              type="button"
                              onClick={() => {
                                setAddressId(addr.id);
                                setShowLocationDropdown(false);
                              }}
                              className={`w-full text-left px-4 py-2 rounded-lg hover:bg-blue-off ${
                                selectedAddress?.id === addr.id
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

            {/* Search Bar - Full on desktop/tablet, icon only on mobile */}
            <div className="hidden md:flex flex-1 max-w-2xl relative">
              <div className="relative w-full">
                <HiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-light w-5 h-5" />
                <input
                  type="text"
                  placeholder={
                    t("home.searchProducts") || "Search products and stores..."
                  }
                  className="w-full pl-12 pr-12 py-2 bg-white rounded-lg border border-gray-bold focus:outline-none focus:ring-2 focus:ring-primary-light"
                />
                <button className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <HiMenu className="text-gray-light w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Mobile Search Icon */}
            <button className="md:hidden p-2 hover:bg-white rounded-lg transition-colors">
              <HiSearch className="w-6 h-6 text-custom-primary" />
            </button>

            {/* Right Icons */}
            <div className="flex items-center gap-2 md:gap-3">
              {/* Wishlist - Hidden on mobile */}
              <button className="hidden lg:block p-2 hover:bg-white rounded-lg transition-colors">
                <HiHeart className="w-6 h-6 text-custom-primary" />
              </button>
              {/* Orders - Hidden on mobile */}
              <button className="hidden lg:block p-2 hover:bg-white rounded-lg transition-colors">
                <HiShoppingBag className="w-6 h-6 text-custom-primary" />
              </button>
              {/* Cart - Always visible */}
              <Link
                to={paths.client.cart}
                className="relative p-2 hover:bg-white rounded-lg transition-colors"
              >
                <HiShoppingCart className="w-6 h-6 text-custom-primary" />
                <span className="absolute top-0 right-0 bg-secondary text-custom-primary text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  0
                </span>
              </Link>
              {/* Login - Hidden on mobile if authenticated, shown if not */}
              {!authenticated && (
                <Link
                  to={paths.auth.jwt.signIn}
                  className="hidden sm:flex items-center gap-2 px-3 md:px-4 py-2 bg-primary-light text-white rounded-lg font-medium hover:bg-primary transition-colors text-sm md:text-base"
                >
                  <HiLogin className="w-5 h-5" />
                  <span className="hidden md:inline">
                    {t("auth.login") || "Login"}
                  </span>
                </Link>
              )}
              {/* Account Dropdown - Desktop only */}
              {authenticated && (
                <div className="hidden lg:block relative">
                  <button
                    onMouseEnter={() => setShowAccountDropdown(true)}
                    onMouseLeave={() => setShowAccountDropdown(false)}
                    className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-sm font-medium text-custom-primary">
                      {t("navbar.account")}
                    </span>
                    <HiChevronDown className="text-gray-light w-4 h-4" />
                  </button>
                  {showAccountDropdown && (
                    <div
                      onMouseEnter={() => setShowAccountDropdown(true)}
                      onMouseLeave={() => setShowAccountDropdown(false)}
                      className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-bold z-50 min-w-[200px]"
                    >
                      <div className="py-2">
                        {accountItems.slice(0, 6).map((item) => (
                          <Link
                            key={item.path}
                            to={item.path}
                            className="block px-4 py-2 hover:bg-blue-off text-custom-primary text-sm"
                            onClick={() => setShowAccountDropdown(false)}
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              <LanguageToggle />
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 hover:bg-white rounded-lg transition-colors"
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

      {/* Navigation Bar - Desktop (white background like design) */}
      <div className="hidden lg:block bg-white border-b border-gray-bold">
        <div className="page-container">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-4 xl:gap-6 flex-wrap">
              {navItems.map((item) => (
                <div key={item.path} className="relative">
                  {item.hasDropdown ? (
                    <button
                      onMouseEnter={() => setShowCategoriesDropdown(true)}
                      onMouseLeave={() => setShowCategoriesDropdown(false)}
                      className={`flex items-center gap-1 px-3 py-2 rounded-lg font-medium transition-colors text-sm xl:text-base ${
                        isActive(item.path)
                          ? "text-primary-light underline decoration-2 underline-offset-4"
                          : "text-custom-primary hover:text-primary-light"
                      }`}
                    >
                      {item.label}
                      <HiChevronDown className="w-4 h-4" />
                    </button>
                  ) : (
                    <Link
                      to={item.path}
                      className={`px-3 py-2 rounded-lg font-medium transition-colors text-sm xl:text-base ${
                        isActive(item.path)
                          ? "text-primary-light underline decoration-2 underline-offset-4"
                          : "text-custom-primary hover:text-primary-light"
                      }`}
                    >
                      {item.label}
                    </Link>
                  )}
                  {item.hasDropdown && showCategoriesDropdown && (
                    <div
                      onMouseEnter={() => setShowCategoriesDropdown(true)}
                      onMouseLeave={() => setShowCategoriesDropdown(false)}
                      className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-bold z-50 min-w-[200px]"
                    >
                      <div className="py-2">
                        <Link
                          to={paths.client.categories}
                          className="block px-4 py-2 hover:bg-blue-off text-custom-primary"
                        >
                          {t("categories.allCategories") || "All Categories"}
                        </Link>
                        <Link
                          to={`${paths.client.categories}/1`}
                          className="block px-4 py-2 hover:bg-blue-off text-custom-primary"
                        >
                          {t("home.food") || "Food"}
                        </Link>
                        <Link
                          to={`${paths.client.categories}/2`}
                          className="block px-4 py-2 hover:bg-blue-off text-custom-primary"
                        >
                          {t("home.grocery") || "Grocery"}
                        </Link>
                        <Link
                          to={`${paths.client.categories}/3`}
                          className="block px-4 py-2 hover:bg-blue-off text-custom-primary"
                        >
                          {t("home.pharmacy") || "Pharmacy"}
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <Link
                to={paths.becomeVendor}
                className="px-4 xl:px-6 py-2 bg-primary-light text-white rounded-lg font-medium hover:bg-primary transition-colors text-sm xl:text-base whitespace-nowrap"
              >
                {t("navbar.becomeVendor")}
              </Link>
              <Link
                to={paths.becomeMarketer}
                className="px-4 xl:px-6 py-2 bg-primary-light text-white rounded-lg font-medium hover:bg-primary transition-colors text-sm xl:text-base whitespace-nowrap"
              >
                {t("navbar.becomeMarketer")}
              </Link>
            </div>
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
          />
          {/* Menu */}
          <div
            className={`fixed top-0 ${
              isRTL ? "left-0" : "right-0"
            } h-full w-80 max-w-[85vw] bg-white z-50 lg:hidden shadow-2xl transform transition-transform duration-300 ease-in-out ${
              isMobileMenuOpen
                ? "translate-x-0"
                : isRTL
                  ? "-translate-x-full"
                  : "translate-x-full"
            }`}
            dir={isRTL ? "rtl" : "ltr"}
          >
            <div className="flex flex-col h-full overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <span className="text-lg font-bold text-custom-primary">
                  {t("navbar.menu")}
                </span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <HiX className="w-6 h-6 text-custom-primary" />
                </button>
              </div>

              {/* Delivery Address - Mobile */}
              <div className="p-4 border-b border-gray-200">
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
                      <div className="mt-2 bg-white rounded-lg border border-gray-bold">
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
                                  addr.area?.name,
                                ].filter(Boolean);
                                const label = parts.join(", ") || addr.label;
                                return (
                                  <button
                                    key={addr.id}
                                    type="button"
                                    onClick={() => {
                                      setAddressId(addr.id);
                                      setShowLocationDropdown(false);
                                    }}
                                    className={`w-full text-left px-4 py-2 rounded-lg hover:bg-blue-off ${
                                      selectedAddress?.id === addr.id
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
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <HiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-light w-5 h-5" />
                  <input
                    type="text"
                    placeholder={
                      t("home.searchProducts") ||
                      "Search products and stores..."
                    }
                    className="w-full pl-12 pr-4 py-2 bg-blue-off rounded-lg border border-gray-bold focus:outline-none focus:ring-2 focus:ring-primary-light"
                  />
                </div>
              </div>

              {/* Navigation Items */}
              <div className="flex-1 overflow-y-auto py-2">
                <div className="px-2">
                  {navItems.map((item) => (
                    <div key={item.path}>
                      {item.hasDropdown ? (
                        <div>
                          <button
                            onClick={() =>
                              setShowCategoriesDropdown(!showCategoriesDropdown)
                            }
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg font-medium transition-colors ${
                              isActive(item.path)
                                ? "text-primary-light bg-primary-light/10"
                                : "text-custom-primary hover:bg-blue-off"
                            }`}
                          >
                            <span>{item.label}</span>
                            <HiChevronDown
                              className={`w-4 h-4 transition-transform ${
                                showCategoriesDropdown ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                          {showCategoriesDropdown && (
                            <div className="pl-4 mt-1">
                              <Link
                                to={paths.client.categories}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block px-4 py-2 rounded-lg hover:bg-blue-off text-custom-primary"
                              >
                                {t("categories.allCategories") ||
                                  "All Categories"}
                              </Link>
                              <Link
                                to={`${paths.client.categories}/1`}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block px-4 py-2 rounded-lg hover:bg-blue-off text-custom-primary"
                              >
                                {t("home.food") || "Food"}
                              </Link>
                              <Link
                                to={`${paths.client.categories}/2`}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block px-4 py-2 rounded-lg hover:bg-blue-off text-custom-primary"
                              >
                                {t("home.grocery") || "Grocery"}
                              </Link>
                              <Link
                                to={`${paths.client.categories}/3`}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block px-4 py-2 rounded-lg hover:bg-blue-off text-custom-primary"
                              >
                                {t("home.pharmacy") || "Pharmacy"}
                              </Link>
                            </div>
                          )}
                        </div>
                      ) : (
                        <Link
                          to={item.path}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
                            isActive(item.path)
                              ? "text-primary-light bg-primary-light/10"
                              : "text-custom-primary hover:bg-blue-off"
                          }`}
                        >
                          {item.label}
                        </Link>
                      )}
                    </div>
                  ))}
                </div>

                {/* Account Section - Mobile */}
                {authenticated && accountItems.length > 0 && (
                  <>
                    <div className="px-4 py-2 mt-4 border-t border-gray-200">
                      <div className="text-xs font-semibold text-gray-light uppercase mb-2">
                        {t("navbar.account")}
                      </div>
                      {accountItems.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
                            isActive(item.path)
                              ? "text-primary-light bg-primary-light/10"
                              : "text-custom-primary hover:bg-blue-off"
                          }`}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </>
                )}

                {/* Become a Vendor & Marketer - Mobile */}
                <div className="px-4 py-2 mt-4 border-t border-gray-200 space-y-2">
                  <Link
                    to={paths.becomeVendor}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full px-4 py-3 bg-primary-light text-white rounded-lg font-medium hover:bg-primary transition-colors text-center"
                  >
                    {t("navbar.becomeVendor")}
                  </Link>
                  <Link
                    to={paths.becomeMarketer}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full px-4 py-3 bg-primary-light text-white rounded-lg font-medium hover:bg-primary transition-colors text-center"
                  >
                    {t("navbar.becomeMarketer")}
                  </Link>
                </div>

                {/* Login - Mobile (if not authenticated) */}
                {!authenticated && (
                  <div className="px-4 py-2 mt-4 border-t border-gray-200">
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
