"use client"

import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { siteConfig } from "@/lib/config"
import { Mail, MapPin, Phone, Send, Instagram, Twitter, Youtube, Facebook, Linkedin } from "lucide-react"

// آیکون‌های شبکه‌های اجتماعی (با استفاده از lucide-react)
const SocialIcon = ({ icon: Icon, href, label }: { icon: any; href: string; label: string }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-neutral-400 transition-all duration-300 hover:text-red-600 hover:scale-110"
    aria-label={label}
  >
    <Icon className="h-5 w-5" />
  </a>
)

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
            &copy; {currentYear} {siteConfig.name}. تمامی حقوق محفوظ است.
            <br className="sm:hidden" />
            <span className="hidden sm:inline"> — </span>
            طراحی شده توسط{" "}
            <a
              href="https://epicdesignlabs.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-500 underline transition-colors hover:text-red-600"
            >
              Epic Design Labs
            </a>
          </p>

          {/* شبکه‌های اجتماعی */}
          <div className="flex items-center gap-3">
            <SocialIcon icon={Instagram} href="#" label="اینستاگرام" />
            <SocialIcon icon={Twitter} href="#" label="توییتر" />
            <SocialIcon icon={Facebook} href="#" label="فیسبوک" />
            <SocialIcon icon={Youtube} href="#" label="یوتیوب" />
            <SocialIcon icon={Linkedin} href="#" label="لینکدین" />
          </div>
        </div>
      </div>
    </footer>
  )
}
