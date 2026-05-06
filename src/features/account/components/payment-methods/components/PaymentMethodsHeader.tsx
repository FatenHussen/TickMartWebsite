interface PaymentMethodsHeaderProps {
    title: string;
    subtitle: string;
}

export function PaymentMethodsHeader({
    title,
    subtitle,
}: PaymentMethodsHeaderProps) {
    return (
        <section className="account-shell relative overflow-hidden rounded-2xl border border-[var(--color-border-primary)] p-5 shadow-[0_4px_24px_-8px_var(--color-shadow)] sm:p-6">
            <span className="pointer-events-none absolute -end-14 -top-14 h-36 w-36 rounded-full bg-[var(--color-api-second)] opacity-[0.08] blur-3xl" aria-hidden />
            <span className="pointer-events-none absolute -bottom-10 -start-8 h-28 w-28 rounded-full bg-[var(--color-main)] opacity-[0.06] blur-3xl" aria-hidden />
            <div className="relative">
                <h1 className="mb-1 text-2xl font-bold text-custom-primary">{title}</h1>
                <p className="text-sm text-custom-secondary">{subtitle}</p>
            </div>
        </section>
    );
}
