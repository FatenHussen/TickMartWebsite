import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import ScheduleCatalogCard from "../components/ScheduleCatalogCard";
import ScheduleCatalogSkeleton from "../components/ScheduleCatalogSkeleton";
import { useScheduleCatalog } from "../hooks/useScheduleCatalog";

export default function SchedulesCatalog() {
    const { t } = useTranslation();
    const { isRTL } = useLanguage();
    const { items, isLoading, isError, refetch } = useScheduleCatalog();

    return (
        <div
            className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#FFFDFB] via-[#F7F4F0] to-[#F1EEE9] dark:bg-zinc-950"
            dir={isRTL ? "rtl" : "ltr"}
        >
            <div
                className="animate-schedules-orb pointer-events-none absolute -start-16 top-16 h-56 w-56 rounded-full bg-[#F3E6D4]/50 blur-3xl dark:bg-white/5"
                aria-hidden
            />
            <div
                className="animate-schedules-orb pointer-events-none absolute -end-10 top-72 h-64 w-64 rounded-full bg-[#EDE8E1]/70 blur-3xl [animation-delay:2s] dark:bg-white/5"
                aria-hidden
            />

            <div className="page-container relative py-8 sm:py-12">
                <section className="schedules-hero animate-schedules-header mb-11 rounded-[1.85rem] px-5 py-9 text-center sm:mb-14 sm:px-12 sm:py-12">
                    <div className="relative mb-4 flex items-center justify-center gap-1.5" aria-hidden>
                        <span className="schedules-beat-dot" />
                        <span className="schedules-beat-dot" />
                        <span className="schedules-beat-dot" />
                    </div>
                    {!isLoading && items.length > 0 ? (
                        <p className="text-[12px] font-semibold text-stone-500 dark:text-zinc-400">
                            {t("customBasket.rhythmsAvailable", {
                                total: items.length,
                                count: items.length,
                            })}
                        </p>
                    ) : null}
                    <h1 className="relative mt-3 text-[1.95rem] font-semibold tracking-[-0.045em] text-zinc-900 dark:text-white sm:text-[2.75rem] sm:leading-[1.08]">
                        {t("customBasket.title")}
                    </h1>
                    <p className="relative mx-auto mt-3.5 max-w-2xl text-[0.98rem] leading-[1.75] text-stone-500 dark:text-zinc-400 sm:text-[1.08rem]">
                        {t("customBasket.subtitle")}
                    </p>
                </section>

                {isLoading ? (
                    <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <ScheduleCatalogSkeleton key={i} />
                        ))}
                    </div>
                ) : isError ? (
                    <div className="flex flex-col items-center justify-center gap-4 rounded-[1.85rem] border border-stone-200 bg-white py-16 text-center dark:border-white/12 dark:bg-zinc-900">
                        <p className="text-zinc-800 dark:text-white">
                            {t("customBasket.failedToLoad")}
                        </p>
                        <button
                            type="button"
                            onClick={() => refetch()}
                            className="inline-flex h-10 items-center rounded-full bg-zinc-900 px-5 text-sm font-semibold text-white hover:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                        >
                            {t("customBasket.retry")}
                        </button>
                    </div>
                ) : items.length === 0 ? (
                    <div className="flex min-h-48 items-center justify-center rounded-[1.85rem] border border-stone-200 bg-white py-16 text-center dark:border-white/12 dark:bg-zinc-900">
                        <p className="max-w-sm text-stone-500">
                            {t("customBasket.noSchedules")}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
                        {items.map((schedule, index) => (
                            <ScheduleCatalogCard
                                key={schedule.id}
                                schedule={schedule}
                                index={index}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
