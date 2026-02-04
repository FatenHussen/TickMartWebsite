import { Outlet } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/shared/lib/utils";
import AccountSidebar from "../components/AccountSidebar";
import MobileAccountMenu from "../components/MobileAccountMenu";

interface AccountLayoutProps {
  user?: {
    fullName: string;
    email: string;
    avatar?: string;
    isOnline?: boolean;
  };
}

export default function AccountLayout({ user }: AccountLayoutProps) {
  const { isRTL } = useLanguage();

  return (
    <div className="page-container py-6 lg:py-10">
      {/* Mobile Menu */}
      <MobileAccountMenu user={user} />

      {/* Desktop Layout */}
      <div
        className={cn(
          "grid gap-6 lg:gap-8",
          "grid-cols-1 lg:grid-cols-[300px_1fr]",
          isRTL && "lg:grid-cols-[1fr_300px]"
        )}
      >
        {/* Sidebar - Hidden on mobile */}
        <aside
          className={cn("hidden lg:block", isRTL ? "lg:order-2" : "lg:order-1")}
        >
          <div className="sticky top-24">
            <AccountSidebar user={user} />
          </div>
        </aside>

        {/* Main Content */}
        <main className={cn(isRTL ? "lg:order-1" : "lg:order-2")}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
