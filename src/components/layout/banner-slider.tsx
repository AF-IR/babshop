"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function BannerSlider({ banners }: { banners: any[] }) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!banners || banners.length === 0) return
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === banners.length - 1 ? 0 : prev + 1))
    }, 5000) // هر ۵ ثانیه تصویر عوض می‌شود
    return () => clearInterval(timer)
  }, [banners])

  if (!banners || banners.length === 0) return null

  return (
    <div className="relative h-[400px] w-full overflow-hidden sm:h-[500px] lg:h-[650px]">
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <Image
            src={banner.image_url}
            alt={banner.title || "بنر فروشگاه"}
            fill
            priority={index === 0} // فقط تصویر اول سریع لود می‌شود تا سرعت سایت افت نکند
            className="object-cover"
          />
          {/* روکش تاریک برای خوانایی بهتر */}
          <div className="absolute inset-0 bg-black/20" />
          
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4 text-center">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl drop-shadow-lg mb-6">
              {banner.title}
            </h2>
            <Button size="lg" asChild className="bg-white text-black hover:bg-neutral-200">
              <Link href={banner.link_url || "/shop"}>
                مشاهده و خرید
              </Link>
            </Button>
          </div>
        </div>
      ))}

      {/* دکمه‌های چپ و راست */}
      <button
        onClick={() => setCurrent((prev) => (prev === 0 ? banners.length - 1 : prev - 1))}
        className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/30 p-2 text-white backdrop-blur-sm hover:bg-white/50 transition"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={() => setCurrent((prev) => (prev === banners.length - 1 ? 0 : prev + 1))}
        className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/30 p-2 text-white backdrop-blur-sm hover:bg-white/50 transition"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* نقطه‌های پایین اسلایدر */}
      <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-3 w-3 rounded-full transition-all ${
              index === current ? "bg-white scale-125" : "bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </div>
  )
}
