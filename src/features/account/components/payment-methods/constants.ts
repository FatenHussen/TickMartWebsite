/** localStorage key for the user's preferred payment method (account + checkout). */
export const PAYMENT_METHOD_STORAGE_KEY = "tikmool_payment_method_id";

/** Spotlight section layered background (must match design tokens). */
export const HOW_PAYMENTS_WORK_SPOTLIGHT_BACKGROUND = `
              radial-gradient(ellipse 88% 78% at 0% 0%, color-mix(in srgb, var(--color-main) 26%, transparent), transparent 56%),
              radial-gradient(ellipse 72% 58% at 100% 8%, color-mix(in srgb, var(--color-api-second) 38%, transparent), transparent 52%),
              radial-gradient(ellipse 48% 42% at 72% 100%, color-mix(in srgb, var(--color-api-second) 16%, transparent), transparent 58%),
              linear-gradient(168deg, var(--color-bg-card) 0%, color-mix(in srgb, var(--color-bg-card) 90%, var(--color-api-second)) 100%)
            `;
