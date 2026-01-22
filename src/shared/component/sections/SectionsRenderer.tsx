import { useTranslation } from "react-i18next";
import { getSliderVariant } from "../slider/registry";
import type { AppSection } from "./section.types";

type SectionsRendererProps = {
  sections: AppSection[];
};

export default function SectionsRenderer({ sections }: SectionsRendererProps) {
  const { t } = useTranslation();

  return (
    <>
      {sections.map((section) => {
        if (section.type === "slider") {
          const Variant = getSliderVariant(section.variant);
          if (!Variant) {
            console.warn(
              `[SectionsRenderer] Missing slider variant`,
              section.id,
              section.variant,
            );
            return null;
          }

          const title = section.titleKey ? t(section.titleKey) : undefined;
          const viewAllLabel = section.viewAllKey
            ? t(section.viewAllKey)
            : undefined;

          return (
            <Variant
              key={section.id}
              title={title}
              viewAllLabel={viewAllLabel}
              payload={section.payload}
              ui={section.ui}
            />
          );
        }

        // Future section types can be handled here
        return null;
      })}
    </>
  );
}
