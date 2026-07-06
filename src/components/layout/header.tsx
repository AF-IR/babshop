"use client"

import Link from "next/link"
import { Search, ShoppingBag, User, Menu, Heart, LogOut, ChevronDown, Percent, Flame, Gift } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SearchModal } from "@/components/search/search-modal"
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
  const t = useTranslations("nav")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
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

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.refresh()
    router.push("/")
  }

  // آیتم‌های ویژه (داخلی، بدون نیاز به import)
  const specialItems = [
    { name: "شگفت‌انگیزها", href: "/discounts", icon: <Percent className="h-4 w-4 text-red-500" /> },
    { name: "پرفروش‌ترین‌ها", href: "/bestsellers", icon: <Flame className="h-4 w-4 text-orange-500" /> },
    { name: "تخفیف‌های ویژه", href: "/specials", icon: <Gift className="h-4 w-4 text-green-500" /> },
  ]

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
        <div className="mx-auto flex max-w-[1440px] flex-col px-4 sm:px-6 lg:px-8">
          
          {/* ردیف اول: لوگو، جستجو و دکمه‌های کاربری */}
          <div className="flex h-16 items-center justify-between gap-4 md:gap-8 pt-2">
            
            {/* سمت راست: منوی موبایل و لوگو */}
            <div className="flex items-center gap-3">
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger className="inline-flex items-center justify-center rounded-md p-2 text-neutral-600 hover:bg-neutral-100 lg:hidden">
                  <Menu className="h-6 w-6" />
                </SheetTrigger>
                <SheetContent side="right" className="!w-full !gap-0 sm:!w-80 p-0" showCloseButton={false}>
                  <div className="flex h-full flex-col overflow-y-auto bg-white">
                    {/* هدر منو با لوگو و دکمه بستن */}
                    <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3">
                      <Link href="/" onClick={() => setMobileMenuOpen(false)} className="text-xl font-bold text-red-600">
                        {siteConfig.name}
                      </Link>
                      <button onClick={() => setMobileMenuOpen(false)} className="rounded-lg p-2 hover:bg-neutral-100">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    {/* بخش‌های منوی موبایل (از navigation.ts) */}
                    <div className="flex-1 overflow-y-auto px-4 py-3">
                      {mobileMenuSections.map((section, idx) => (
                        <div key={idx} className="mb-6">
                          <h3 className="mb-2 text-sm font-bold text-neutral-500">{section.title}</h3>
                          <ul className="space-y-1">
                            {section.items.map((item) => (
                              <li key={item.href}>
                                <Link
                                  href={item.href}
                                  onClick={() => setMobileMenuOpen(false)}
                                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-700 hover:bg-red-50 hover:text-red-600"
                                >
                                  {item.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}

                      {/* بخش حساب کاربری */}
                      <div className="border-t border-neutral-100 pt-4 mt-4">
                        <h3 className="mb-2 text-sm font-bold text-neutral-500">حساب کاربری</h3>
                        {mounted && isAuthenticated ? (
                          <>
                            <div className="flex items-center gap-3 rounded-lg bg-neutral-50 px-3 py-3 mb-2">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600 font-bold">
                                {user?.firstName?.[0]}{user?.lastName?.[0]}
                              </div>
                              <div>
                                <p className="text-sm font-bold text-neutral-800">{user?.firstName} {user?.lastName}</p>
                                <p className="text-xs text-neutral-500">{user?.email}</p>
                              </div>
                            </div>
                            <Link href="/account" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-red-50 hover:text-red-600">
                              <User className="h-5 w-5" /> پروفایل من
                            </Link>
                            <Link href="/account/orders" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-red-50 hover:text-red-600">
                              <span>سفارش‌های من</span>
                            </Link>
                            <button onClick={() => { setMobileMenuOpen(false); handleLogout(); }} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50">
                              <LogOut className="h-5 w-5" /> خروج
                            </button>
                          </>
                        ) : (
                          <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)} className="flex w-full items-center justify-center rounded-lg bg-red-600 px-4 py-3 text-sm font-bold text-white hover:bg-red-700">
                            ورود | ثبت‌نام
                          </Link>
                        )}
                      </div>
                    </div>

                    {/* فوتر منو با لینک‌های مفید */}
                    <div className="border-t border-neutral-100 px-4 py-3 bg-neutral-50">
                      <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-500">
                        <Link href="/policies/privacy" className="hover:text-red-600">حریم خصوصی</Link>
                        <Link href="/policies/terms" className="hover:text-red-600">قوانین</Link>
                        <Link href="/contact" className="hover:text-red-600">تماس با ما</Link>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              <Link href="/" className="text-2xl font-bold text-red-600 tracking-tight">
                {siteConfig.name}
              </Link>
            </div>

            {/* نوار جستجوی دسکتاپ */}
            <div className="hidden flex-1 max-w-2xl lg:flex">
              <button onClick={() => setSearchOpen(true)} className="flex w-full items-center rounded-full bg-neutral-100 px-5 py-2.5 text-sm text-neutral-500 hover:bg-neutral-200 transition-all">
                <Search className="ml-3 h-5 w-5 text-neutral-400" />
                <span>جستجو در میان هزاران کالا...</span>
                <kbd className="mr-auto hidden rounded border border-neutral-200 bg-white px-2 py-0.5 text-xs text-neutral-400 sm:inline-block">⌘K</kbd>
              </button>
            </div>

            {/* دکمه‌های سمت چپ */}
            <div className="flex items-center gap-2">
              <Link href="/wishlist" className="hidden sm:flex h-10 w-10 items-center justify-center rounded-full hover:bg-neutral-100">
                <Heart className="h-5 w-5 text-neutral-600" />
              </Link>

              {mounted && isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex h-10 items-center gap-2 rounded-full border border-neutral-200 px-3 hover:bg-neutral-50">
                    <User className="h-5 w-5 text-neutral-600" />
                    <ChevronDown className="h-4 w-4 text-neutral-400" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-white shadow-lg rounded-xl border-neutral-100 mt-2 p-1">
                    <div className="px-3 py-2 border-b border-neutral-100">
                      <p className="text-sm font-bold text-neutral-800">{user?.firstName} {user?.lastName}</p>
                      <p className="text-xs text-neutral-500 truncate">{user?.email}</p>
                    </div>
                    <DropdownMenuItem onClick={() => router.push("/account")} className="cursor-pointer rounded-lg hover:bg-neutral-50">
                      <User className="mr-2 h-4 w-4" /> پروفایل من
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/account/orders")} className="cursor-pointer rounded-lg hover:bg-neutral-50">
                      <span>سفارش‌های من</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 rounded-lg hover:bg-red-50">
                      <LogOut className="mr-2 h-4 w-4" /> خروج
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/auth/login" className="flex h-10 items-center gap-2 rounded-full border border-neutral-200 px-4 text-sm font-medium hover:bg-neutral-50">
                  <User className="h-5 w-5" />
                  <span className="hidden sm:inline-block">ورود | ثبت‌نام</span>
                </Link>
              )}

              <button onClick={openCart} className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-neutral-100">
                <ShoppingBag className="h-5 w-5 text-neutral-700" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white border-2 border-white">
                    {itemCount > 9 ? "9+" : itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* نوار جستجوی موبایل */}
          <div className="flex pb-3 lg:hidden mt-2">
            <button onClick={() => setSearchOpen(true)} className="flex w-full items-center rounded-full bg-neutral-100 px-4 py-2 text-sm text-neutral-500">
              <Search className="ml-2 h-4 w-4 text-neutral-400" />
              <span>جستجو...</span>
            </button>
          </div>

          {/* منوی ناوبری دسکتاپ (بدون specialLinks) */}
          <nav className="hidden lg:flex items-center gap-6 pb-3 text-sm font-medium text-neutral-600 mt-1">
            {/* دسته‌بندی کالاها */}
            <div className="group relative">
              <button className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 hover:bg-neutral-100">
                <Menu className="h-4 w-4" />
                <span>دسته‌بندی کالاها</span>
                <ChevronDown className="h-3.5 w-3.5 opacity-70" />
              </button>
              <div className="absolute right-0 top-full mt-1 w-56 rounded-xl bg-white shadow-lg border border-neutral-100 p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                {categories.length > 0 ? (
                  categories.slice(0, 10).map((cat) => (
                    <Link key={cat.id} href={`/category/${cat.slug}`} className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-neutral-700 hover:bg-red-50 hover:text-red-600">
                      {cat.name}
                    </Link>
                  ))
                ) : (
                  <div className="px-3 py-2 text-sm text-neutral-500">دسته‌بندی موجود نیست</div>
                )}
                <Link href="/shop" className="mt-1 block rounded-lg bg-neutral-100 px-3 py-2 text-center text-sm font-medium text-red-600 hover:bg-red-50">
                  مشاهده همه دسته‌ها
                </Link>
              </div>
            </div>

            <span className="h-5 w-px bg-neutral-300"></span>

            {/* آیتم‌های ویژه (داخلی) */}
            {specialItems.map((item) => (
              <Link key={item.href} href={item.href} className="flex items-center gap-1.5 hover:text-red-600 transition-colors">
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}

            <span className="h-5 w-px bg-neutral-300"></span>

            {/* لینک‌های فروشگاه (به جز خانه) */}
            {shopLinks.filter(link => link.name !== "خانه").map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-red-600 transition-colors">
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
