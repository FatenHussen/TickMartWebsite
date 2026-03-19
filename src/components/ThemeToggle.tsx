import { useTheme } from"@/context/ThemeContext";
import { useTranslation } from"react-i18next";

export default function ThemeToggle() {
 const { theme, toggleTheme } = useTheme();
 const { t } = useTranslation();

 return (
 <button
 onClick={toggleTheme}
 className="p-2 rounded-lg bg-custom-muted hover:bg-custom-hover transition-colors"
 aria-label={t("common.toggleTheme")}
 >
 {theme ==="dark"? (
 <span className="text-xl">☀️</span>
 ) : (
 <span className="text-xl">🌙</span>
 )}
 </button>
 );
}
