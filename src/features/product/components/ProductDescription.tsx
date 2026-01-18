import { useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/shared/lib/utils";

export type ProductDescriptionProps = {
  description: string;
  maxLength?: number;
  label?: string;
  className?: string;
};

export default function ProductDescription({
  description,
  maxLength = 200,
  label,
  className,
}: ProductDescriptionProps) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const defaultLabel = label || t("product.description");

  const shouldTruncate = description.length > maxLength;
  const displayText =
    isExpanded || !shouldTruncate
      ? description
      : `${description.slice(0, maxLength)}...`;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <h3 className="text-sm font-semibold text-text-primary">{defaultLabel}</h3>

      <p className="whitespace-pre-wrap text-sm leading-relaxed text-text-secondary">
        {displayText}
      </p>

      {shouldTruncate && (
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="self-start text-sm font-semibold text-primary hover:text-accent-primary-hover"
        >
          {isExpanded ? t("product.seeLess") : t("product.seeMore")}
        </button>
      )}
    </div>
  );
}
