import React from "react";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageToggle from "@/components/LanguageToggle";
import { HiCheckCircle } from "react-icons/hi";
import { HiGift } from "react-icons/hi2";

type AuthLayoutProps = {
  title: string;
  blurb?: string;
  features?: string[];
  ctaLabel?: string;
  helper?: string;
  illustration?: React.ReactNode;
  children: React.ReactNode;
};

export default function AuthLayout({
  title,
  features = [],
  ctaLabel,
  helper,
  illustration,
  children,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="relative w-full min-h-screen grid lg:grid-cols-[1fr_1fr] overflow-hidden">
        {/* Theme and Language toggles */}
        <div className="absolute top-4 right-4 z-20 flex gap-2">
          <LanguageToggle />
          <ThemeToggle />
        </div>

        {/* LEFT SIDE - Cyan/Teal gradient background */}
        <aside className="relative bg-gradient-to-br from-cyan-400 via-cyan-500 to-teal-500 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900 px-8 md:px-12 py-10 flex flex-col min-h-[400px] lg:min-h-screen overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-300 rounded-full opacity-80" />
          <div className="absolute top-20 left-24 w-4 h-4 bg-yellow-300 rounded-full opacity-60" />
          <div className="absolute top-32 right-20 w-6 h-6 bg-white rounded-full opacity-40" />
          <div className="absolute bottom-40 right-10 w-12 h-12 bg-yellow-300 rounded-full opacity-70" />

          {/* Cloud decorations */}
          <div className="absolute top-16 right-16 w-24 h-8 bg-white/30 rounded-full blur-sm" />
          <div className="absolute top-20 right-24 w-16 h-6 bg-white/20 rounded-full blur-sm" />

          {/* Illustration Area */}
          <div className="flex-1 flex items-center justify-center relative z-10">
            {illustration ? (
              <div className="w-full max-w-md">{illustration}</div>
            ) : (
              <div className="relative">
                {/* Phone mockup */}
                <div className="w-48 h-80 bg-white rounded-3xl shadow-2xl p-3 transform -rotate-6">
                  <div className="w-full h-full bg-gradient-to-b from-cyan-100 to-white rounded-2xl flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-cyan-500 rounded-xl mx-auto mb-3 flex items-center justify-center">
                        <span className="text-white text-2xl font-bold">T</span>
                      </div>
                      <span className="text-xs text-gray-500">Tikmool</span>
                    </div>
                  </div>
                </div>
                {/* Delivery scooter illustration */}
                <div className="absolute -bottom-8 -right-16 w-40 h-32 flex items-end">
                  <div className="text-6xl">🛵</div>
                </div>
                {/* Shopping bag */}
                <div className="absolute -top-4 -right-8">
                  <div className="text-4xl">🛍️</div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Content Card */}
          <div className="relative z-10 bg-white dark:bg-gray-700 rounded-2xl shadow-xl p-6 mt-8">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">{title}</h2>

            {features.length > 0 && (
              <ul className="space-y-3 mb-6">
                {features.map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <HiCheckCircle className="w-5 h-5 text-cyan-500 dark:text-cyan-400 flex-shrink-0" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            )}

            {ctaLabel && (
              <button className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-teal-500 dark:from-cyan-600 dark:to-teal-600 text-white px-5 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-shadow">
                <HiGift className="w-5 h-5" />
                <span>{ctaLabel}</span>
              </button>
            )}

            {helper && (
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 ms-1">{helper}</p>
            )}
          </div>
        </aside>

        {/* RIGHT SIDE - Auth Form */}
        <main className="bg-white dark:bg-gray-900 flex items-center justify-center px-4 md:px-8 py-8">
          <div className="w-full max-w-md">{children}</div>
        </main>
      </div>
    </div>
  );
}
