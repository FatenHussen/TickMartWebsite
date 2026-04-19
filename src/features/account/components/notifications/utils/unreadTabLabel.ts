/**
 * Tab label for "unread" reused the full `unreadCount` i18n string; strip the leading numeric count for the short tab text.
 * Preserves existing behaviour (e.g. "5 unread" → "unread").
 */
export function stripLeadingCountFromUnreadLabel(translatedWithCount: string): string {
  return translatedWithCount.replace(/\d+ /, "");
}
