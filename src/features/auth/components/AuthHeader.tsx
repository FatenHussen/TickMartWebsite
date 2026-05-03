import ThemeToggle from"@/components/ThemeToggle";
import LanguageToggle from"@/components/LanguageToggle";

export default function AuthHeader() {
 return (
 <header className="fixed end-0 top-0 z-50 flex h-12 w-full shrink-0 items-center justify-center border-b border-custom-primary bg-[var(--color-bg-card)]/90 backdrop-blur-md md:h-14">

 <div className="absolute end-4 flex gap-2">
 <LanguageToggle />
 <ThemeToggle />
 </div>
 </header>
 );
}
