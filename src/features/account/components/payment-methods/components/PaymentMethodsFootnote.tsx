interface PaymentMethodsFootnoteProps {
    text: string;
}

export function PaymentMethodsFootnote({ text }: PaymentMethodsFootnoteProps) {
    return <p className="text-xs text-text-secondary">{text}</p>;
}
