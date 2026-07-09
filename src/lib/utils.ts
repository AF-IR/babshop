import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { siteConfig } from "@/lib/config"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * فرمت‌سازی قیمت به صورت تومان با جداکننده هزارگان
 * مثال: ۴۳,۲۴۰,۲۰۰ تومان
 */
export function formatPrice(
  priceInCents: number,
  currency?: string
): string {
  // تقسیم بر ۱۰۰ برای تبدیل به واحد اصلی (فرض بر این است که قیمت به سنت ذخیره شده)
  const value = priceInCents / 100

  // فرمت‌سازی با جداکننده هزارگان و بدون اعشار
  const formatted = new Intl.NumberFormat("fa-IR", {
    useGrouping: true,
    maximumFractionDigits: 0,
  }).format(value)

  // اضافه کردن پسوند "تومان" (به جای کد ارز IRT)
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
