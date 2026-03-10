import ThemeToggle from "@/components/ThemeToggle";
import LanguageToggle from "@/components/LanguageToggle";

export default function AuthHeader() {
  return (
    <header className="fixed top-0  right-0 w-full shrink-0 h-12 md:h-14 flex items-center justify-center">

      <div className="absolute end-4 flex gap-2">
        <LanguageToggle />
        <ThemeToggle />
      </div>
    </header>
  );
}
