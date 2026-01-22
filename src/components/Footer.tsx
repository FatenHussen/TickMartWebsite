import { Link } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { isRTL } = useLanguage();

  const footerLinks = {
    product: [
      { label: "Landing Page", path: "/" },
      { label: "Popup Builder", path: "/popup-builder" },
      { label: "Web-design", path: "/web-design" },
      { label: "Content", path: "/content" },
      { label: "Integrations", path: "/integrations" },
    ],
    useCases: [
      { label: "Web-designers", path: "/web-designers" },
      { label: "Marketers", path: "/marketers" },
      { label: "Small Business", path: "/small-business" },
      { label: "Website Builder", path: "/website-builder" },
    ],
    resources: [
      { label: "Academy", path: "/academy" },
      { label: "Blog", path: "/blog" },
      { label: "Themes", path: "/themes" },
      { label: "Hosting", path: "/hosting" },
      { label: "Developers", path: "/developers" },
      { label: "Support", path: "/help-support" },
    ],
    company: [
      { label: "About Us", path: "/about-us" },
      { label: "Careers", path: "/careers" },
      { label: "FAQs", path: "/faqs" },
      { label: "Teams", path: "/teams" },
      { label: "Contact Us", path: "/contact-us" },
    ],
  };

  return (
    <footer
      className="bg-gradient-to-r from-secondary/20 via-secondary/10 to-primary-light/20 mt-auto"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="page-container py-12">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link to="/home" className="flex items-center gap-2">
            <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center">
              <span className="text-white text-2xl font-bold">∞</span>
            </div>
            <span className="text-3xl font-bold">
              <span className="text-primary-light">Tik</span>
              <span className="text-secondary">mool</span>
            </span>
          </Link>
        </div>

        {/* Footer Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Product Column */}
          <div>
            <h3 className="font-bold text-custom-primary mb-4">Product</h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-custom-secondary hover:text-primary-light transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Use Cases Column */}
          <div>
            <h3 className="font-bold text-custom-primary mb-4">Use Cases</h3>
            <ul className="space-y-2">
              {footerLinks.useCases.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-custom-secondary hover:text-primary-light transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h3 className="font-bold text-custom-primary mb-4">Resources</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-custom-secondary hover:text-primary-light transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="font-bold text-custom-primary mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-custom-secondary hover:text-primary-light transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Get our app Column */}
          <div>
            <h3 className="font-bold text-custom-primary mb-4">Get our app</h3>
            <div className="space-y-3">
              <a
                href="#"
                className="flex items-center gap-3 bg-black text-white px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C1.79 15.25 2.54 7.59 9.5 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.14 3.74-4.68.42 1.75-.53 3.5-1.85 4.59-1.31 1.14-2.88 1.98-1.89 4.09h-.01z" />
                </svg>
                <div className="flex flex-col items-start">
                  <span className="text-xs">Download on the</span>
                  <span className="text-sm font-semibold">App Store</span>
                </div>
              </a>
              <a
                href="#"
                className="flex items-center gap-3 bg-black text-white px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                </svg>
                <div className="flex flex-col items-start">
                  <span className="text-xs">Get it on</span>
                  <span className="text-sm font-semibold">Google Play</span>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-primary-light/30 my-8"></div>

        {/* Copyright */}
        <div className="text-center">
          <p className="text-custom-secondary">
            © 2025 Tikmool. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
