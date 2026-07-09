"use client"

import { useEffect, useState } from "react"
import { Heart } from "lucide-react"
import { PageHeader } from "@/components/ui/page-header"
import { EmptyState } from "@/components/ui/empty-state"
import { PageLoader } from "@/components/ui/page-loader"
import { ProductCard } from "@/components/products/product-card"
import { useWishlistStore } from "@/store/wishlist"
import type { Product } from "@/types"

interface Props {
  products: Product[]
}

export default function WishlistClient({ products }: Props) {
  const wishlistItems = useWishlistStore((s) => s.items)
  const loadWishlist = useWishlistStore((s) => s.load)

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    async function init() {
      await loadWishlist()
      setMounted(true)
    }
    init()
  }, [loadWishlist])

  // اسکرول به بالای صفحه بعد از رفرش
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  if (!mounted) {
    return <PageLoader isLoading={true} />
  }

  const wishlistedProducts = products.filter((p) =>
    wishlistItems.includes(p.id)
  )

  if (wishlistedProducts.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 font-[family-name:var(--font-vazir)]">
        <PageHeader title="علاقه‌مندی‌ها" />
        <EmptyState
          icon={Heart}
          title="لیست علاقه‌مندی‌ها خالی است"
          description="محصولاتی که دوست دارید را ذخیره کنید تا بعداً به راحتی پیدا کنید."
          actionLabel="مشاهده محصولات"
          actionHref="/shop"
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-16 font-[family-name:var(--font-vazir)]">
      <PageHeader
        title="علاقه‌مندی‌ها"
        description={`${wishlistedProducts.length} محصول`}
      />

      <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
        {wishlistedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
