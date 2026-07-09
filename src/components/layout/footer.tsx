"use client"

import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { siteConfig } from "@/lib/config"
import { Mail, MapPin, Phone, Send } from "lucide-react"

// آیکون‌های شبکه‌های اجتماعی با SVG ساده (مشابه فایل قبلی پروژه)
function IconTwitter({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function IconInstagram({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  )
}

function IconFacebook({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

function IconYouTube({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  )
}

function IconTikTok({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  )
}

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-8">
        {/* ===== ردیف اول: برند و توضیحات ===== */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          {/* ستون برند */}
          <div className="md:col-span-4">
            <Link href="/" className="text-2xl font-bold text-red-600 transition-colors hover:text-red-700">
              {siteConfig.name}
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-neutral-500 max-w-sm">
              {siteConfig.tagline || "بهترین‌ها را با بهترین قیمت از باب‌شاپ تهیه کنید."}
            </p>
            <div className="mt-4 flex items-center gap-3 text-sm text-neutral-500">
              <Phone className="h-4 w-4" />
              <span dir="ltr">۰۲۱-۱۲۳۴-۵۶۷۸</span>
            </div>
            <div className="mt-1 flex items-center gap-3 text-sm text-neutral-500">
              <Mail className="h-4 w-4" />
              <a href="mailto:info@babshop.ir" className="hover:text-red-600 transition-colors">
                info@babshop.ir
              </a>
            </div>
            <div className="mt-1 flex items-center gap-3 text-sm text-neutral-500">
              <MapPin className="h-4 w-4" />
              <span>تهران، خیابان ولیعصر، پلاک ۱۲۳</span>
            </div>
          </div>

          {/* ستون لینک‌های فروشگاه */}
          <div className="md:col-span-2">
            <h3 className="text-sm font-bold text-neutral-800">فروشگاه</h3>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link href="/shop" className="text-sm text-neutral-500 transition-colors hover:text-red-600">
                  همه محصولات
                </Link>
              </li>
              <li>
                <Link href="/brands" className="text-sm text-neutral-500 transition-colors hover:text-red-600">
                  برندها
                </Link>
              </li>
              <li>
                <Link href="/shop?sort=newest" className="text-sm text-neutral-500 transition-colors hover:text-red-600">
                  جدیدترین‌ها
                </Link>
              </li>
              <li>
                <Link href="/shop?sale=true" className="text-sm text-neutral-500 transition-colors hover:text-red-600">
                  تخفیف‌ها
                </Link>
              </li>
            </ul>
          </div>

          {/* ستون لینک‌های شرکت */}
          <div className="md:col-span-2">
            <h3 className="text-sm font-bold text-neutral-800">شرکت</h3>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link href="/about" className="text-sm text-neutral-500 transition-colors hover:text-red-600">
                  درباره ما
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-neutral-500 transition-colors hover:text-red-600">
                  وبلاگ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-neutral-500 transition-colors hover:text-red-600">
                  تماس با ما
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-neutral-500 transition-colors hover:text-red-600">
                  سوالات متداول
                </Link>
              </li>
            </ul>
          </div>

          {/* ستون لینک‌های قوانین و خدمات */}
          <div className="md:col-span-2">
            <h3 className="text-sm font-bold text-neutral-800">خدمات مشتریان</h3>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link href="/account/orders" className="text-sm text-neutral-500 transition-colors hover:text-red-600">
                  پیگیری سفارش
                </Link>
              </li>
              <li>
                <Link href="/policies/shipping" className="text-sm text-neutral-500 transition-colors hover:text-red-600">
                  روش‌های ارسال
                </Link>
              </li>
              <li>
                <Link href="/policies/returns" className="text-sm text-neutral-500 transition-colors hover:text-red-600">
                  بازگشت کالا
                </Link>
              </li>
              <li>
                <Link href="/policies/privacy" className="text-sm text-neutral-500 transition-colors hover:text-red-600">
                  حریم خصوصی
                </Link>
              </li>
            </ul>
          </div>

          {/* ستون خبرنامه */}
          <div className="md:col-span-2">
            <h3 className="text-sm font-bold text-neutral-800">عضویت در خبرنامه</h3>
            <p className="mt-2 text-xs text-neutral-500">
              از تخفیف‌ها و محصولات جدید با خبر شوید.
            </p>
            <form className="mt-3 flex flex-col gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="ایمیل خود را وارد کنید"
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none transition-all focus:border-red-400 focus:ring-2 focus:ring-red-100"
                required
              />
              <button
                type="submit"
                className="flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-red-700"
              >
                <Send className="h-4 w-4" />
                عضویت
              </button>
            </form>
          </div>
        </div>

        <Separator className="my-8" />

        {/* ===== ردیف پایین: شبکه‌های اجتماعی و کپی‌رایت ===== */}
        <div className="flex flex-col-reverse items-center justify-between gap-4 sm:flex-row">
          {/* کپی‌رایت */}
          <p className="text-xs text-neutral-400 text-center sm:text-right">
            &copy; {currentYear} {siteConfig.name}.  تمامی حقوق محفوظ است ارزان پلاست.
            <br className="sm:hidden" />
            <span className="hidden sm:inline"> — </span>
            طراحی شده توسط{" "}
            <a
              href="arsham.fazel@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-500 underline transition-colors hover:text-red-600"
            >
              Arsham Fazel
            </a>
          </p>

          {/* شبکه‌های اجتماعی */}
          <div className="flex items-center gap-4">
            <a href="#" className="text-neutral-400 transition-colors hover:text-red-600" aria-label="توییتر">
              <IconTwitter className="h-5 w-5" />
            </a>
            <a href="#" className="text-neutral-400 transition-colors hover:text-red-600" aria-label="اینستاگرام">
              <IconInstagram className="h-5 w-5" />
            </a>
            <a href="#" className="text-neutral-400 transition-colors hover:text-red-600" aria-label="فیسبوک">
              <IconFacebook className="h-5 w-5" />
            </a>
            <a href="#" className="text-neutral-400 transition-colors hover:text-red-600" aria-label="یوتیوب">
              <IconYouTube className="h-5 w-5" />
            </a>
            <a href="#" className="text-neutral-400 transition-colors hover:text-red-600" aria-label="تیکتاک">
              <IconTikTok className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
