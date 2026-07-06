// src/i18n/config.ts
export const defaultLocale = "fa" as const  // ← تغییر از "en" به "fa"
export const locales = ["en", "es", "fa"] as const  // ← اضافه کردن "fa"
export type Locale = (typeof locales)[number]
