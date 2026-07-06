"use client"

import { useRef, useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { PLACEHOLDER_IMAGE } from "@/lib/constants"
import type { Product } from "@/types"

interface FeaturedProductsCarouselProps {
  products: Product[]
  title?: string
  viewAllLink?: string
}

export function FeaturedProductsCarousel({
  products,
  title = "محصولات ویژه",
  viewAllLink = "/shop",
}: FeaturedProductsCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  const checkScroll = () => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 0)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1)
  }

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    checkScroll()
    const observer = new ResizeObserver(checkScroll)
    observer.observe(el)
    el.addEventListener("scroll", checkScroll)
    return () => {
      observer.disconnect()
      el.removeEventListener("scroll", checkScroll)
    }
  }, [products])

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current
    if (!el) return
    const cardWidth = el.querySelector<HTMLElement>(".product-card")?.offsetWidth || 200
    const gap = 16
    const scrollAmount = cardWidth + gap
    el.scrollBy({
      left: dir === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    })
  }

  // Drag to scroll (mouse)
  const handleMouseDown = (e: React.MouseEvent) => {
    const el = scrollRef.current
    if (!el) return
    setIsDragging(true)
    setStartX(e.pageX - el.offsetLeft)
    setScrollLeft(el.scrollLeft)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    const el = scrollRef.current
    if (!el) return
    e.preventDefault()
    const x = e.pageX - el.offsetLeft
    const walk = (x - startX) * 1.5
    el.scrollLeft = scrollLeft - walk
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  if (!products || products.length === 0) {
    return null
  }

  // تابع کمکی برای دریافت اولین تصویر محصول
  const getProductImage = (product: Product) => {
    const p = product as any
    // اگر product.images آرایه است و اولین عنصر را دارد
    if (p.images && p.images.length > 0) {
      return {
        url: p.images[0].url ?? PLACEHOLDER_IMAGE,
        alt: p.images[0].alt ?? product.name,
      }
    }
    // اگر product.image به صورت تکی وجود دارد
    if (p.image) {
      return {
        url: p.image.url ?? PLACEHOLDER_IMAGE,
        alt: p.image.alt ?? product.name,
      }
    }
    return { url: PLACEHOLDER_IMAGE, alt: product.name }
  }

  // دریافت قیمت محصول (با fallback)
  const getProductPrice = (product: Product) => {
    const p = product as any
    // اولویت با price
    if (p.price !== undefined && p.price !== null) return p.price
    // اگر قیمت در variants باشد
    if (p.variants && p.variants.length > 0 && p.variants[0].price !== undefined) {
      return p.variants[0].price
    }
    return 0
  }

  const getComparePrice = (product: Product) => {
    const p = product as any
    if (p.compareAtPrice !== undefined && p.compareAtPrice !== null) return p.compareAtPrice
    if (p.compare_at_price !== undefined && p.compare_at_price !== null) return p.compare_at_price
    return null
  }

  return (
    <div className="relative">
      {/* هدر */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        <Link
          href={viewAllLink}
          className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          مشاهده همه
        </Link>
      </div>

      {/* کاروسل */}
      <div className="relative group">
        {/* دکمه چپ */}
        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 border border-neutral-200 transition-all -translate-x-4 opacity-0 group-hover:opacity-100 focus:opacity-100"
            aria-label="اسکرول به چپ"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        )}

        {/* دکمه راست */}
        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 border border-neutral-200 transition-all translate-x-4 opacity-0 group-hover:opacity-100 focus:opacity-100"
            aria-label="اسکرول به راست"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}

        {/* محتوای اسکرول افقی */}
        <div
          ref={scrollRef}
          className={cn(
            "flex gap-4 overflow-x-auto scroll-smooth pb-4",
            "scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']",
            isDragging && "cursor-grabbing select-none"
          )}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {products.map((product) => {
            const img = getProductImage(product)
            const price = getProductPrice(product)
            const comparePrice = getComparePrice(product)
            return (
              <Link
                key={product.id}
                href={`/${product.slug}`}
                className="product-card group relative min-w-[160px] max-w-[200px] flex-1 shrink-0 rounded-xl bg-white border border-neutral-100 hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                <div className="relative aspect-square bg-neutral-100">
                  <Image
                    src={img.url}
                    alt={img.alt}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 40vw, 200px"
                  />
                  {comparePrice && (
                    <span className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      تخفیف
                    </span>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-base font-bold text-red-600">
                      {price.toLocaleString()} تومان
                    </span>
                    {comparePrice && (
                      <span className="text-xs text-neutral-400 line-through">
                        {comparePrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
