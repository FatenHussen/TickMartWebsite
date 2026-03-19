import { type ClassValue, clsx } from"clsx";
import { twMerge } from"tailwind-merge";

export function cn(...inputs: ClassValue[]) {
 return twMerge(clsx(inputs));
}

/**
 * Detects whether the input value is an email or phone number.
 * Detection logic:
 * - If value contains"@"→ treat as email
 * - If value starts with"+"or contains only numbers → treat as phone
 *
 * @param value - The input value to check
 * @returns 'email' | 'phone' | null
 */
export function detectEmailOrPhone(value: string):"email"|"phone"| null {
 if (!value || value.trim().length === 0) {
 return null;
 }

 // Email: contains @ (primary indicator)
 if (value.includes("@")) {
 const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
 return emailPattern.test(value) ?"email": null;
 }

 // Phone: starts with + or contains only digits/spaces/phone chars
 const phonePattern = /^[\d\s+\-()]+$/;
 const digitCount = value.replace(/\D/g,"").length;
 if ((value.startsWith("+") || phonePattern.test(value)) && digitCount >= 6) {
 return"phone";
 }

 return null;
}
