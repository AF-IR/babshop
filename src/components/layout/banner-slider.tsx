"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface Banner {
  id: string
  image_url: string
  title?: string
  subtitle?: string
  link_url?: string
}

export function BannerSlider({ banners }: { banners: Banner[] }) {
  const [current, setCurrent] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [touchStart, setTouchStart] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const dragStartRef = useRef<{ x: number; y: number } | null>(null)
  const linkRef = useRef<HTMLAnchorElement>(null)

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev === banners.length - 1 ? 0 : prev + 1))
  }, [banners.length])

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev === 0 ? banners.length - 1 : prev - 1))
  }, [banners.length])

  // تایمر چرخش خودکار
  useEffect(() => {
    if (!banners || banners.length === 0 || isHovered) return
    const timer = setInterval(nextSlide, 5000)
    return () => clearInterval(timer)
  }, [banners, isHovered, nextSlide])

  // تشخیص کلیک/درگ روی بنر
  const handleMouseDown = (e: React.MouseEvent) => {
    dragStartRef.current = { x: e.clientX, y: e.clientY }
    setIsDragging(false)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragStartRef.current) return
    const dx = e.clientX - dragStartRef.current.x
    const dy = e.clientY - dragStartRef.current.y
    if (Math.abs(dx) > 10 || Math.abs(dy) > 10) {
      setIsDragging(true)
    }
  }

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!dragStartRef.current) return
    const dx = e.clientX - dragStartRef.current.x
    const dy = e.clientY - dragStartRef.current.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    // اگر حرکت بیش از 10 پیکسل بود، کلیک محسوب نمی‌شود
    if (distance > 10) {
      setIsDragging(true)
    } else {
      setIsDragging(false)
    }
    dragStartRef.current = null
  }

  const handleClick = (e: React.MouseEvent) => {
    if (isDragging) {
      e.preventDefault()
      return
    }
    // اگر لینک وجود داشته باشد، توسط خود Link هدایت می‌شود
  }

  // مدیریت لمس موبایل
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
    const touch = e.targetTouches[0]
    dragStartRef.current = { x: touch.clientX, y: touch.clientY }
    setIsDragging(false)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!dragStartRef.current) return
    const touch = e.targetTouches[0]
    const dx = touch.clientX - dragStartRef.current.x
    const dy = touch.clientY - dragStartRef.current.y
    if (Math.abs(dx) > 10 || Math.abs(dy) > 10) {
      setIsDragging(true)
    }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEnd = e.changedTouches[0].clientX
    const diff = touchStart - touchEnd

    // اگر حرکت افقی بیشتر از 50 پیکسل بود، اسلاید عوض کن
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextSlide()
      else prevSlide()
    }

    // اگر حرکت کم بود و درگ نبود، کلیک محسوب می‌شود (لینک اجرا می‌شود)
    if (Math.abs(diff) < 10 && !isDragging) {
      // اجازه می‌دهیم لینک عمل کند
    }

    dragStartRef.current = null
    setIsDragging(false)
  }

  if (!banners || banners.length === 0) return null

  const currentBanner = banners[current]

  return (
    <div
      className="group relative mx-auto mt-6 w-full max-w-[1380px] overflow-hidden rounded-2xl shadow-lg px-4 sm:px-6 lg:px-8"
      style={{ height: "clamp(200px, 35vh, 450px)" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {banners.map((banner, index) => {
        const isActive = index === current
        return (
          <Link
            key={banner.id}
            href={banner.link_url || "/shop"}
            ref={isActive ? linkRef : undefined}
            onClick={handleClick}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            className={cn(
              "absolute inset-0 block transition-opacity duration-700 ease-in-out",
              isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            )}
            aria-label={banner.title || "بنر"}
          >
            {/* تصویر */}
            <Image
              src={banner.image_url}
              alt={banner.title || "بنر فروشگاه"}
              fill
              priority={index === 0}
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 1440px"
            />

            {/* گرادیانت ملایم برای خوانایی متن */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

            {/* محتوای متنی با انیمیشن */}
            <div
              className={cn(
                "absolute inset-0 flex flex-col items-center justify-end pb-8 sm:pb-12 lg:pb-16 px-6 text-white transition-all duration-700 ease-out",
                isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              )}
            >
              {banner.title && (
                <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-5xl drop-shadow-lg text-center max-w-3xl">
                  {banner.title}
                </h2>
              )}
              {banner.subtitle && (
                <p className="mt-2 text-sm sm:text-base lg:text-lg font-medium text-white/90 drop-shadow max-w-2xl text-center">
                  {banner.subtitle}
                </p>
              )}
              {/* یک نشانگر کوچک برای کلیک */}
              <span className="mt-4 inline-block rounded-full border border-white/40 bg-white/10 px-4 py-1.5 text-xs font-medium backdrop-blur-sm transition-all hover:bg-white/20">
                مشاهده و خرید
              </span>
            </div>
          </Link>
        )
      })}

      {/* دکمه‌های ناوبری */}
      <button
        onClick={(e) => { e.preventDefault(); prevSlide() }}
        className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white backdrop-blur-sm opacity-0 transition-all duration-300 hover:bg-black/50 group-hover:opacity-100 md:p-3"
        aria-label="اسلاید قبلی"
      >
        <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
      </button>
      <button
        onClick={(e) => { e.preventDefault(); nextSlide() }}
        className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white backdrop-blur-sm opacity-0 transition-all duration-300 hover:bg-black/50 group-hover:opacity-100 md:p-3"
        aria-label="اسلاید بعدی"
      >
        <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
      </button>

      {/* نشانگرهای کپسولی */}
      <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              index === current ? "w-8 bg-white" : "w-2 bg-white/50 hover:bg-white/80"
            )}
            aria-label={`رفتن به اسلاید ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
