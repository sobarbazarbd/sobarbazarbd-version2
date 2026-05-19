import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBDT(amount: number | string | null | undefined) {
  const n = Number(amount || 0);
  return `৳${n.toLocaleString("en-BD", { maximumFractionDigits: 0 })}`;
}

export function discountPercent(regular?: number | string, selling?: number | string) {
  const r = Number(regular || 0);
  const s = Number(selling || 0);
  if (r <= 0 || s <= 0 || s >= r) return 0;
  return Math.round(((r - s) / r) * 100);
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
