import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes with conflict resolution. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a 0–1 confidence score as a percentage string. */
export function formatConfidence(score: number): string {
  return `${Math.round(score * 100)}%`;
}

/** Seconds elapsed between two timestamps (for the <10s diagnosis KPI). */
export function secondsBetween(start: number, end: number): number {
  return Math.round((end - start) / 1000);
}
