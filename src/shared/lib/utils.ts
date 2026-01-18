import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**

 * @param value - The input value to check
 * @returns 'email' | 'phone' | null
 */
export function detectEmailOrPhone(value: string): "email" | "phone" | null {
  if (!value || value.trim().length === 0) {
    return null;
  }

  // Email pattern: contains @ and has valid email format
  const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

  // Phone pattern: contains only digits, spaces, +, -, (, ), and has at least 6 digits
  const phonePattern = /^[\d\s+\-()]+$/;
  const digitCount = value.replace(/\D/g, "").length;

  if (emailPattern.test(value)) {
    return "email";
  } else if (phonePattern.test(value) && digitCount >= 6) {
    return "phone";
  }

  return null;
}
