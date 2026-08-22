import { useEffect, useRef, useState, type ReactNode } from "react";
import { useAppSettings } from "@/features/account/hooks/useAppSettings";
import { PremiumAppLoader } from "./PremiumAppLoader";

/** Never block the shell longer than this — a dead proxy looks like a white page. */
const BOOT_TIMEOUT_MS = 12_000;

/**
 * Global first-open gate. Shows a full-screen loader on cold start until the
 * app-settings (theme/palette) bootstrap query settles, then releases
 * permanently. Subsequent data/navigation loading is handled by per-section
 * skeletons, so this never re-shows — even when language changes refetch
 * settings (that surfaces as `isFetching`, not `isLoading`).
 */
export function BootGate({ children }: { children: ReactNode }) {
  const { isLoading, isFetched } = useAppSettings();
  const hasBooted = useRef(false);
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setTimedOut(true), BOOT_TIMEOUT_MS);
    return () => window.clearTimeout(timer);
  }, []);

  const waitingOnBootstrap = isLoading && !isFetched && !timedOut;

  if (!hasBooted.current && waitingOnBootstrap) {
    return <PremiumAppLoader minHeight="min-h-screen" />;
  }
  hasBooted.current = true;
  return <>{children}</>;
}
