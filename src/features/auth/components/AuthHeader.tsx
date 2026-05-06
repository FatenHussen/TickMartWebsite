import ThemeToggle from"@/components/ThemeToggle";
import LanguageToggle from"@/components/LanguageToggle";
import { useTheme } from"@/context/ThemeContext";
import { cn } from"@/shared/lib/utils";

export default function AuthHeader() {
 const { theme } = useTheme();

 return (
 <header
 className={cn(
 "fixed end-0 top-0 z-50 flex h-12 w-full shrink-0 items-center justify-center border-b md:h-14",
 theme ==="dark"
 ?"border-[rgba(255,255,255,0.06)] bg-[rgba(8,8,10,0.72)] backdrop-blur-xl"
 :"border-custom-primary bg-[var(--color-bg-card)]/90 backdrop-blur-md"
 )}
 >

 <div className="absolute end-4 flex gap-2">
 <LanguageToggle />
 <ThemeToggle />
 </div>
 </header>
 );
}
