//export interface NavItem {
  //name: string
 // href: string
//}

//export interface NavSection {
//  label: string
//  items: NavItem[]
//}

// Single source of truth for all navigation across desktop header,
// mobile menu, and anywhere else. Edit this one file to update all menus.

///export const shopLinks: NavItem[] = [
//  { name: "Electronics", href: "/electronics" },
//  { name: "Clothing", href: "/clothing" },
//  { name: "Home & Kitchen", href: "/home-kitchen" },
//  { name: "Accessories", href: "/accessories" },
//  { name: "Food & Drink", href: "/food-drink" },
//]
//
//export const accountLinks: NavItem[] = [
  //{ name: "My Account", href: "/account" },
  //{ name: "Wishlist", href: "/wishlist" },
//  { name: "Orders", href: "/account/orders" },
//]

//export const infoLinks: NavItem[] = [
//  { name: "All Brands", href: "/brands" },
//  { name: "Blog", href: "/blog" },
//  { name: "Pages", href: "/pages" },
//  { name: "About", href: "/about" },
//  { name: "Contact", href: "/contact" },
//  { name: "FAQ", href: "/faq" },
//]

//export const mobileMenuSections: NavSection[] = [
//  { label: "Shop", items: shopLinks },
//  { label: "Account", items: accountLinks },
//  { label: "Info", items: infoLinks },
//]

//__________________________fazel____________________________//
// src/lib/navigation.ts
import { siteConfig } from "./config"

export type NavItem = {
  name: string
  href: string
  icon?: React.ReactNode
  children?: NavItem[]
}

// لینک‌های اصلی فروشگاه (فقط موارد ضروری و واقعی)
export const shopLinks: NavItem[] = [
  { name: "خانه", href: "/" },
  { name: "فروشگاه", href: "/shop" },
  { name: "وبلاگ", href: "/blog" },
  { name: "درباره ما", href: "/about" },
  { name: "تماس با ما", href: "/contact" },
  { name: "سوالات متداول", href: "/faq" },
]

// آیتم‌های ویژه (شگفت‌انگیزها، پرفروشها و ...)
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
