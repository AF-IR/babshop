// src/lib/navigation.ts
import { siteConfig } from "./config"

export type NavItem = {
  name: string
  href: string
  icon?: React.ReactNode
  children?: NavItem[]
}

// لینکهای اصلی فروشگاه (برای منوی دسکتاپ و موبایل)
export const shopLinks: NavItem[] = [
  { name: "خانه", href: "/" },
  { name: "فروشگاه", href: "/shop" },
  { name: "وبلاگ", href: "/blog" },
  { name: "درباره ما", href: "/about" },
  { name: "تماس با ما", href: "/contact" },
  { name: "سوالات متداول", href: "/faq" },
]

// آیتمهای ویژه (شگفتانگیزها، پرفروشها و ...)
export const specialLinks: NavItem[] = [
  { name: "شگفت‌انگیزها", href: "/discounts" },
  { name: "پرفروش‌ترین‌ها", href: "/bestsellers" },
  { name: "تخفیف‌های ویژه", href: "/specials" },
]

// منوی موبایل (ساختار بخشبندی شده)
export const mobileMenuSections = [
  {
    title: "دسته‌بندی کالاها",
    items: shopLinks,
  },
  {
    title: "پیشنهادات ویژه",
    items: specialLinks,
  },
  {
    title: "خدمات مشتریان",
    items: [
      { name: "پیگیری سفارش", href: "/account/orders" },
      { name: "شرایط بازگشت کالا", href: "/policies/returns" },
      { name: "راهنمای خرید", href: "/faq" },
    ],
  },
]
