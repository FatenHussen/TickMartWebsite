import { useTranslation } from "react-i18next";

/** Left panel with App Everything branding, delivery illustration, and sponsored ad card. */
export default function AuthPromoPanel() {
  const { t } = useTranslation();

  return (
    <aside className="hidden lg:flex bg-cyan-50 dark:bg-gray-800 flex-col overflow-auto">
      <div className="pt-10 pb-6 px-8 md:px-12">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center text-cyan-400 dark:text-cyan-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-8 h-8"
              aria-hidden
            >
              <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z" />
            </svg>
          </div>
          <span className="text-lg font-semibold text-gray-900 dark:text-white">
            {t("auth.appEverything")}
          </span>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8 md:px-12 min-h-0 gap-6">
        <div className="w-full max-w-sm">
          <div className="bg-white dark:bg-gray-700 rounded-2xl border border-cyan-100 dark:border-cyan-800 shadow-sm overflow-hidden">
            <img
              src="https://i.ibb.co/6W58rtf/delivery-illustration.png"
              alt="Delivery"
              className="w-full h-auto aspect-square object-cover"
            />
          </div>
        </div>
      </div>

      <div className="px-8 md:px-12 pb-10 pt-4">
        <div className="bg-white dark:bg-gray-700 rounded-2xl shadow-md p-5">
          <div className="flex gap-4">
            <div className="w-16 h-16 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center overflow-hidden shrink-0">
              <span className="text-2xl">🍟</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wider">
                {t("auth.sponsored")}
              </p>
              <h3 className="text-base font-bold text-gray-900 dark:text-white mt-1.5">
                {t("auth.get30Off")}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-snug">
                {t("auth.enjoyExclusiveDeals")}
              </p>
              <button
                type="button"
                className="text-sm text-primary font-medium mt-2.5 hover:underline inline-flex items-center gap-1"
              >
                {t("auth.viewOffer")}
                <span aria-hidden>→</span>
              </button>
            </div>
          </div>
          <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-4">
            {t("auth.manageCampaigns")}
          </p>
        </div>
      </div>
    </aside>
  );
}
