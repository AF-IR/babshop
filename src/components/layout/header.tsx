"use client"

import Link from "next/link"
import { Search, ShoppingBag, User, Menu, Heart, LogOut, ChevronDown, Percent, Flame } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SearchModal } from "@/components/search/search-modal"
import { cn } from "@/lib/utils"
import { shopLinks, mobileMenuSections } from "@/lib/navigation"
import { siteConfig } from "@/lib/config"
import { useTranslations } from "next-intl"
import { useState, useEffect } from "react"
import type { Category } from "@/types"
import { useCartStore } from "@/store/cart"
import { useRouter } from "next/navigation"
import { useUser } from "@/hooks/use-user"
import { supabase } from "@/lib/supabase"

interface HeaderProps {
  categories?: Category[]
}

export function Header({ categories = [] }: HeaderProps) {
  const allCategories = categories
  const t = useTranslations("nav")
  const tCommon = useTranslations("common")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const openCart = useCartStore((s) => s.openCart)
  const getItemCount = useCartStore((s) => s.getItemCount)
  const { user, isAuthenticated } = useUser()
  const router = useRouter()

  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const itemCount = mounted ? getItemCount() : 0

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm transition-all">
        <div className="mx-auto flex max-w-[1440px] flex-col px-4 sm:px-6 lg:px-8">
          
          {/* ردیف اول: لوگو، جستجو و دکمه‌های کاربری */}
          <div className="flex h-16 items-center justify-between gap-4 md:gap-8 pt-2">
            
            {/* سمت راست: منوی موبایل و لوگو */}
            <div className="flex items-center gap-3">
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger
                  className="inline-flex items-center justify-center rounded-md p-2 text-neutral-600 hover:bg-neutral-100 lg:hidden"
                  aria-label={t("openMenu")}
                >
                  <Menu className="h-6 w-6" />
                </SheetTrigger>
                {/* محتوای منوی موبایل (مشابه کد قبلی شما) */}
                <SheetContent side="right" className="!w-full !gap-0 sm:!w-80" showCloseButton={false}>
                  {/* ... کدهای قبلی منوی موبایل شما ... */}
                </SheetContent>
              </Sheet>

              <Link href="/" className="text-2xl font-bold text-red-600 tracking-tight">
                {siteConfig.name}
              </Link>
            </div>

            {/* بخش میانی: نوار جستجوی بزرگ (فقط در دسکتاپ) */}
            <div className="hidden flex-1 lg:flex max-w-2xl">
              <button
                onClick={() => setSearchOpen(true)}
                className="flex w-full items-center rounded-xl bg-neutral-100 px-4 py-2.5 text-sm text-neutral-500 transition-colors hover:bg-neutral-200"
              >
                <Search className="ml-3 h-5 w-5 text-neutral-400" />
                <span>جستجو در میان بیش از ۱۰۰۰ کالا...</span>
              </button>
            </div>

            {/* سمت چپ: حساب کاربری و سبد خرید */}
            <div className="flex items-center gap-2">
              {mounted && isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex h-10 items-center justify-center gap-2 rounded-lg border px-3 hover:bg-neutral-50 transition-colors">
                    <User className="h-5 w-5 text-neutral-600" />
                    <ChevronDown className="h-4 w-4 text-neutral-400" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 bg-white shadow-lg rounded-xl border-neutral-100 mt-2">
                    <div className="px-3 py-2 border-b border-neutral-100">
                      <p className="text-sm font-bold text-neutral-800">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-neutral-500 mt-1 truncate">{user?.email}</p>
                    </div>
                    <div className="p-1">
                      <DropdownMenuItem onClick={() => router.push("/account")} className="cursor-pointer rounded-lg hover:bg-neutral-50">
                        پروفایل کاربری
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push("/account/orders")} className="cursor-pointer rounded-lg hover:bg-neutral-50">
                        سفارش‌های من
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push("/account/settings")} className="cursor-pointer rounded-lg hover:bg-neutral-50">
                        تنظیمات
                      </DropdownMenuItem>
                    </div>
                    <div className="border-t border-neutral-100 p-1">
                      <DropdownMenuItem
                        className="cursor-pointer text-red-600 rounded-lg hover:bg-red-50 focus:text-red-700"
                        onClick={async () => {
                          await supabase.auth.signOut()
                          router.refresh()
                          router.push("/")
                        }}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        خروج از حساب
                      </DropdownMenuItem>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  href="/auth/login"
                  className="flex h-10 items-center justify-center gap-2 rounded-lg border px-4 text-sm font-medium hover:bg-neutral-50 transition-colors"
                >
                  <User className="h-5 w-5" />
                  <span className="hidden sm:inline-block">ورود | ثبت‌نام</span>
                </Link>
              )}

              <span className="hidden sm:block h-6 w-px bg-neutral-200 mx-1"></span>

              <button
                onClick={openCart}
                className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg hover:bg-neutral-100 transition-colors"
              >
                <ShoppingBag className="h-5 w-5 text-neutral-700" />
                {itemCount > 0 && (
                  <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[11px] font-bold text-white shadow-sm border-2 border-white">
                    {itemCount > 9 ? "9+" : itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* نوار جستجو برای موبایل (زیر لوگو) */}
          <div className="flex pb-3 lg:hidden mt-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex w-full items-center rounded-lg bg-neutral-100 px-4 py-2 text-sm text-neutral-500"
            >
              <Search className="ml-2 h-4 w-4 text-neutral-400" />
              <span>جستجو...</span>
            </button>
          </div>

          {/* ردیف دوم: منوی ناوبری دسکتاپ (دسته بندی ها، شگفت انگیز و ...) */}
          <nav className="hidden lg:flex items-center gap-6 pb-3 text-[13px] font-medium text-neutral-600 mt-2">
            <div className="flex items-center gap-1.5 cursor-pointer hover:text-black hover:border-b-2 border-red-600 pb-1 transition-all">
              <Menu className="h-4 w-4" />
              <span>دسته‌بندی کالاها</span>
            </div>
            <span className="h-4 w-px bg-neutral-200"></span>
            
            <Link href="/discounts" className="flex items-center gap-1.5 hover:text-black transition-colors">
              <Percent className="h-4 w-4 text-red-500" />
              <span>شگفت‌انگیزها</span>
            </Link>
            
            <Link href="/bestsellers" className="flex items-center gap-1.5 hover:text-black transition-colors">
              <Flame className="h-4 w-4 text-orange-500" />
              <span>پرفروش‌ترین‌ها</span>
            </Link>

            {shopLinks.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="hover:text-black transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

        </div>
      </header>

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
