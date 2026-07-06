"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function BannerSlider({ banners }: { banners: any[] }) {
  const [current, setCurrent] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [touchStart, setTouchStart] = useState(0)

  // توابع رفتن به اسلاید بعدی و قبلی
  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev === banners.length - 1 ? 0 : prev + 1))
  }, [banners.length])

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev === 0 ? banners.length - 1 : prev - 1))
  }, [banners.length])

  // تایمر چرخش خودکار (اگر موس روی بنر نباشد)
  useEffect(() => {
    if (!banners || banners.length === 0 || isHovered) return
    const timer = setInterval(nextSlide, 5000)
    return () => clearInterval(timer)
  }, [banners, isHovered, nextSlide])

  // مدیریت لمس صفحه در موبایل (Swipe)
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEnd = e.changedTouches[0].clientX
    if (touchStart - touchEnd > 50) nextSlide() // کشیدن به یک سمت
    if (touchStart - touchEnd < -50) prevSlide() // کشیدن به سمت دیگر
  }

  if (!banners || banners.length === 0) return null

  return (
    // تغییر ارتفاع برای مستطیلی شدن (کمتر شدن ارتفاع) و اضافه شدن گوشه‌های گرد (rounded-2xl)
    <div 
      className="group relative mx-auto mt-6 w-full max-w-[1380px] overflow-hidden rounded-2xl h-[200px] sm:h-[300px] lg:h-[400px] shadow-lg px-4 sm:px-6 lg:px-8"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            index === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <Image
            src={banner.image_url}
            alt={banner.title || "بنر فروشگاه"}
            fill
            priority={index === 0} // بهینه‌سازی سرعت لود تصویر اول
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 1440px"
          />
          {/* گرادیانت تیره فقط در پایین تصویر برای خوانایی متن */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          
          {/* محتوای متنی با انیمیشن ورود */}
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 sm:pb-16 text-white p-4 text-center">
            <h2 
              className="text-2xl font-bold tracking-tight sm:text-4xl lg:text-5xl drop-shadow-md mb-4 transition-all duration-700 ease-out"
              style={index === current ? { transform: 'translateY(0)', opacity: 1 } : { transform: 'translateY(20px)', opacity: 0 }}
            >
              {banner.title}
            </h2>
            <div 
              className="transition-all duration-700 delay-100 ease-out"
              style={index === current ? { transform: 'translateY(0)', opacity: 1 } : { transform: 'translateY(20px)', opacity: 0 }}
            >
              <Button size="lg" asChild className="bg-white text-black hover:bg-neutral-200">
                <Link href={banner.link_url || "/shop"}>
                  مشاهده و خرید
                </Link>
              </Button>
            </div>
          </div>
        </div>
      ))}

      {/* دکمه‌های ناوبری (فقط وقتی موس روی عکس می‌آید ظاهر می‌شوند) */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur-md opacity-0 transition-all duration-300 hover:bg-white/40 group-hover:opacity-100 md:p-3"
      >
        <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur-md opacity-0 transition-all duration-300 hover:bg-white/40 group-hover:opacity-100 md:p-3"
      >
        <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
      </button>

      {/* نشانگرهای کپسولی (Pill Dots) */}
      <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === current ? "w-8 bg-white" : "w-2 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </div>
  )
}
