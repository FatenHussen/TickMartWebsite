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
} from "react-icons/hi";
import LanguageToggle from "./LanguageToggle";
import { paths } from "@/app/routes/path/paths";
import { useState } from "react";
import { useAuthStore } from "@/store/auth";

export default function Navbar() {
  const { isRTL } = useLanguage();
  const { t } = useTranslation();
  const location = useLocation();
  const { authenticated } = useAuthStore();
  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState("123 Main Street, Downtown");

  const isActive = (path: string) => {
    if (path === "/" || path === "/home") {
      return location.pathname === "/" || location.pathname === "/home";
    }
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { path: paths.client.home, label: t("home.home") || "Home" },
    {
      path: paths.client.categories,
      label: t("categories.mainCategories") || "Categories",
      hasDropdown: true
    },
    { path: paths.client.cart, label: t("cart.cart") || "Cart" },
    { path: paths.client.orders, label: t("orders.myOrders") || "My Orders" },
    { path: paths.client.store, label: t("store.store") || "Store" },
  ];

  return (
    <div className="bg-blue-off" dir={isRTL ? "rtl" : "ltr"}>
      {/* Top Header Section */}
      <div className="bg-blue-off border-b border-primary-light/20">
        <div className="page-container">
          <div className="flex items-center justify-between py-3 gap-4">
            {/* Logo */}
            <Link to={paths.client.home} className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary-light rounded-lg flex items-center justify-center">
                <span className="text-white text-xl font-bold">∞</span>
              </div>
              <span className="text-2xl font-bold">
                <span className="text-primary-light">Tik</span>
                <span className="text-secondary">mool</span>
              </span>
            </Link>

            {/* Delivery Address */}
            <div className="flex-1 max-w-md relative">
              <button
                onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg hover:bg-gray-50 transition-colors w-full"
              >
                <HiLocationMarker className="text-primary-light w-5 h-5" />
                <div className="flex flex-col items-start flex-1">
                  <span className="text-xs text-gray-light">Delivering to</span>
                  <span className="text-sm font-medium text-custom-primary">{deliveryAddress}</span>
                </div>
                <HiChevronDown className="text-gray-light w-4 h-4" />
              </button>
              {showLocationDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-bold z-50">
                  <div className="p-4">
                    <input
                      type="text"
                      placeholder="Search for address..."
                      className="w-full px-4 py-2 border border-gray-bold rounded-lg mb-2"
                    />
                    <div className="space-y-2">
                      <button
                        onClick={() => {
                          setDeliveryAddress("123 Main Street, Downtown");
                          setShowLocationDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-blue-off rounded-lg"
                      >
                        123 Main Street, Downtown
                      </button>
                      <button
                        onClick={() => {
                          setDeliveryAddress("456 Park Avenue, Uptown");
                          setShowLocationDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-blue-off rounded-lg"
                      >
                        456 Park Avenue, Uptown
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl relative">
              <div className="relative">
                <HiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-light w-5 h-5" />
                <input
                  type="text"
                  placeholder={t("home.searchProducts") || "Search products and stores..."}
                  className="w-full pl-12 pr-12 py-2 bg-white rounded-lg border border-gray-bold focus:outline-none focus:ring-2 focus:ring-primary-light"
                />
                <button className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <HiMenu className="text-gray-light w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-white rounded-lg transition-colors">
                <HiHeart className="w-6 h-6 text-custom-primary" />
              </button>
              <button className="p-2 hover:bg-white rounded-lg transition-colors">
                <HiShoppingBag className="w-6 h-6 text-custom-primary" />
              </button>
              <Link
                to={paths.client.cart}
                className="relative p-2 hover:bg-white rounded-lg transition-colors"
              >
                <HiShoppingCart className="w-6 h-6 text-custom-primary" />
                <span className="absolute top-0 right-0 bg-secondary text-custom-primary text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  0
                </span>
              </Link>
              {!authenticated && (
                <Link
                  to={paths.auth.jwt.signIn}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-light text-white rounded-lg font-medium hover:bg-primary transition-colors"
                >
                  <HiLogin className="w-5 h-5" />
                  <span>{t("auth.login") || "Login"}</span>
                </Link>
              )}
              <LanguageToggle />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="bg-primary-light/10">
        <div className="page-container">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-6">
              {navItems.map((item) => (
                <div key={item.path} className="relative">
                  {item.hasDropdown ? (
                    <button
                      onMouseEnter={() => setShowCategoriesDropdown(true)}
                      onMouseLeave={() => setShowCategoriesDropdown(false)}
                      className={`flex items-center gap-1 px-3 py-2 rounded-lg font-medium transition-colors ${
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
                      className={`px-3 py-2 rounded-lg font-medium transition-colors ${
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
            <Link
              to="/become-vendor"
              className="px-6 py-2 bg-primary-light text-white rounded-lg font-medium hover:bg-primary transition-colors"
            >
              Become a vendor
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
