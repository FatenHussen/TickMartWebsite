interface PaymentMethodsHeaderProps {
    title: string;
    subtitle: string;
}

export function PaymentMethodsHeader({
    title,
    subtitle,
}: PaymentMethodsHeaderProps) {
    return (
        <section className="account-shell rounded-2xl border border-[var(--color-border-primary)] bg-[var(--color-bg-card)] p-5 shadow-[0_2px_12px_-4px_var(--color-shadow)] sm:p-6">
            <h1 className="mb-1 text-2xl font-bold text-custom-primary">{title}</h1>
            <p className="text-sm text-custom-secondary">{subtitle}</p>
        </section>
    );
}
