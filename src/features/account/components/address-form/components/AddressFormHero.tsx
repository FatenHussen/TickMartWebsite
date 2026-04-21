import { Pencil, Plus } from "lucide-react";
import { ADDRESS_FORM_HERO_BACKDROP_STYLE } from "../constants";

type AddressFormHeroProps = {
    isEditMode: boolean;
    title: string;
    subtitle: string;
};

export function AddressFormHero({ isEditMode, title, subtitle }: AddressFormHeroProps) {
    return (
        <section className="relative overflow-hidden" aria-labelledby="address-form-title">
            <div
                className="pointer-events-none absolute inset-0"
                style={ADDRESS_FORM_HERO_BACKDROP_STYLE}
            />
            <div className="pointer-events-none absolute -right-12 top-1/2 h-48 w-48 -translate-y-1/2 rounded-full bg-[var(--color-main)] opacity-[0.11] blur-3xl" />
            <div className="pointer-events-none absolute -left-8 bottom-0 h-36 w-36 rounded-full bg-[var(--color-api-second)] opacity-[0.18] blur-3xl" />

            <div className="relative flex min-w-0 flex-col gap-4 p-6 sm:p-8 sm:flex-row sm:items-start sm:gap-5">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--color-main)] to-[var(--color-primary-dark)] shadow-md ring-2 ring-white/25 dark:ring-white/10">
                    {isEditMode ? (
                        <Pencil className="h-7 w-7 text-white" aria-hidden />
                    ) : (
                        <Plus className="h-7 w-7 text-white" aria-hidden />
                    )}
                </div>
                <div className="min-w-0 space-y-1">
                    <h1
                        id="address-form-title"
                        className="text-2xl font-bold tracking-tight text-custom-primary sm:text-3xl"
                    >
                        {title}
                    </h1>
                    <p className="max-w-xl text-sm leading-relaxed text-custom-secondary">{subtitle}</p>
                </div>
            </div>
        </section>
    );
}
