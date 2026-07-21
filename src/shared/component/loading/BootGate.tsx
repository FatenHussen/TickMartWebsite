import { useRef, type ReactNode } from "react";
import { useAppSettings } from "@/features/account/hooks/useAppSettings";
import { PremiumAppLoader } from "./PremiumAppLoader";

/**
 * Global first-open gate. Shows a full-screen loader on cold start until the
 * app-settings (theme/palette) bootstrap query settles, then releases
 * permanently. Subsequent data/navigation loading is handled by per-section
 * skeletons, so this never re-shows — even when language changes refetch
 * settings (that surfaces as `isFetching`, not `isLoading`).
 */
export function BootGate({ children }: { children: ReactNode }) {
  const { isLoading } = useAppSettings();
  const hasBooted = useRef(false);

  if (!hasBooted.current && isLoading) {
    return <PremiumAppLoader minHeight="min-h-screen" />;
  }
  hasBooted.current = true;
  return <>{children}</>;
}
