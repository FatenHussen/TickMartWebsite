import { Bell, Gift, Package, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export function getNotificationIcon(type: string | null): LucideIcon {
  const key = (type ?? "").toLowerCase();
  if (key.includes("point") || key.includes("reward") || key.includes("gift")) {
    return Gift;
  }
  if (key.includes("order") || key.includes("basket")) {
    return Package;
  }
  if (key.includes("promo") || key.includes("offer")) {
    return Sparkles;
  }
  return Bell;
}
