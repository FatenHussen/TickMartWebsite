interface PaymentMethodsHeaderProps {
    title: string;
    subtitle: string;
}

export function PaymentMethodsHeader({
    title,
    subtitle,
}: PaymentMethodsHeaderProps) {
    return (
        <div className="mb-2">
            <h1 className="mb-1 text-2xl font-bold text-text-primary">{title}</h1>
            <p className="text-sm text-text-secondary">{subtitle}</p>
        </div>
    );
}
