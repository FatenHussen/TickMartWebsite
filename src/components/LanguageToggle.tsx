import { useLanguage } from "@/context/LanguageContext";
import Button from "@/shared/ui/Button";

export default function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="min-w-[60px]"
    >
      {language === "en" ? "العربية" : "English"}
    </Button>
  );
}

