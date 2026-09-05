import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Convert Latin digits to Persian digits for display. */
export function toFa(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return "";
  const fa = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return String(value).replace(/[0-9]/g, (d) => fa[Number(d)] ?? d);
}

/** Short id generator for locally-created records. */
export function makeId(prefix: string): string {
  const rand = Math.random().toString(36).slice(2, 8);
  const time = Date.now().toString(36).slice(-4);
  return `${prefix}_${time}${rand}`;
}

/**
 * Format an ISO date to a Persian (Jalali) date string using Intl.
 * Falls back gracefully if the runtime lacks the calendar.
 */
export function faDate(iso: string | null | undefined, withTime = false): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  try {
    return new Intl.DateTimeFormat("fa-IR", {
      calendar: "persian",
      year: "numeric",
      month: "long",
      day: "numeric",
      ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
    }).format(d);
  } catch {
    return d.toISOString().slice(0, 10);
  }
}

/** Relative "X روز پیش" style label. */
export function faRelative(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso).getTime();
  if (Number.isNaN(d)) return "—";
  const diff = Date.now() - d;
  const day = 86_400_000;
  const days = Math.round(diff / day);
  if (days <= 0) return "امروز";
  if (days === 1) return "دیروز";
  if (days < 7) return `${toFa(days)} روز پیش`;
  if (days < 31) return `${toFa(Math.round(days / 7))} هفته پیش`;
  if (days < 365) return `${toFa(Math.round(days / 30))} ماه پیش`;
  return `${toFa(Math.round(days / 365))} سال پیش`;
}

/** Days until a deadline (negative = overdue). */
export function daysUntil(iso: string | null | undefined): number | null {
  if (!iso) return null;
  const d = new Date(iso).getTime();
  if (Number.isNaN(d)) return null;
  return Math.ceil((d - Date.now()) / 86_400_000);
}
