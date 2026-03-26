import { useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/shared/lib/utils";

export type ProductDescriptionProps = {
    description?: string;
    fullDescription?: string;
    maxLength?: number;
    label?: string;
    fullLabel?: string;
    className?: string;
};

function DescriptionBlock({
    text,
    label,
    maxLength,
}: {
    text: string;
    label: string;
    maxLength: number;
}) {
    const { t } = useTranslation();
    const [isExpanded, setIsExpanded] = useState(false);
    const shouldTruncate = text.length > maxLength;
    const displayText =
        isExpanded || !shouldTruncate
            ? text
            : `${text.slice(0, maxLength)}...`;

    return (
        <div className="flex flex-col gap-2">
            <h3 className="text-base font-bold text-text-primary">{label}</h3>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-custom-secondary">
                {displayText}
                {shouldTruncate && (
                    <button
                        type="button"
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="ml-1 text-sm font-semibold text-text-primary underline hover:text-primary-light"
                    >
                        {isExpanded
                            ? t("product.seeLess", "See Less")
                            : t("product.seeMore", "See More...")}
                    </button>
                )}
            </p>
        </div>
    );
}

export default function ProductDescription({
    description,
    fullDescription,
    maxLength = 250,
    label,
    fullLabel,
    className,
}: ProductDescriptionProps) {
    const { t } = useTranslation();
    const descLabel = label || t("product.description", "Description");
    const fullDescLabel =
        fullLabel || t("product.fullDescription", "Full Description");

    const hasDescription = description && description.trim().length > 0;
    const hasFullDescription =
        fullDescription && fullDescription.trim().length > 0;

    if (!hasDescription && !hasFullDescription) return null;

    return (
        <div className={cn("flex flex-col gap-6", className)}>
            {hasDescription && (
                <DescriptionBlock
                    text={description!}
                    label={descLabel}
                    maxLength={maxLength}
                />
            )}
            {hasFullDescription && (
                <DescriptionBlock
                    text={fullDescription!}
                    label={fullDescLabel}
                    maxLength={maxLength}
                />
            )}
        </div>
    );
}
