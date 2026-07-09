import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { siteConfig } from "@/lib/config"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * فرمت‌سازی قیمت به صورت تومان با جداکننده هزارگان
 * مثال: ۳۸۰,۰۰۰ تومان
 * 
 * توجه: قیمت‌ها در دیتابیس به صورت تومان ذخیره شده‌اند
 */
export function formatPrice(
  priceInCents: number,
  currency?: string
): string {
  // فقط فرمت‌سازی عدد با جداکننده هزارگان و بدون اعشار
  const formatted = new Intl.NumberFormat("fa-IR", {
    useGrouping: true,
    maximumFractionDigits: 0,
  }).format(priceInCents)

  // اضافه کردن پسوند "تومان"
  return `${formatted} تومان`
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date))
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length) + "..."
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}
