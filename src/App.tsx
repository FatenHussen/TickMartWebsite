import React from "react";
import { ThemeProvider } from "@/context/ThemeContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { useScrollToTop } from "@/shared/hooks/useScrollToTop";
import { useThemeFromApi } from "@/shared/hooks/useThemeFromApi";
import NotificationToast from "@/components/NotificationToast";
import useFirebaseNotifications from "@/hooks/useFirebaseNotifications";
import "@/i18n/config";

type AppProps = {
  children?: React.ReactNode;
};

/** Loads API palettes into ThemeContext (must be under ThemeProvider + QueryClient). */
function ThemeFromApiSync() {
  useThemeFromApi();
  return null;
}

export default function App({ children }: AppProps) {
  useScrollToTop();
  const {
    notification,
    dismissNotification,
    handleNotificationClick,
  } = useFirebaseNotifications();

  return (
    <LanguageProvider>
      <CurrencyProvider>
        <ThemeProvider>
          <ThemeFromApiSync />
          {children}
          <NotificationToast
            notification={notification}
            onClose={dismissNotification}
            onClick={handleNotificationClick}
          />
        </ThemeProvider>
      </CurrencyProvider>
    </LanguageProvider>
  );
}
