"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { ShoppingBag, Heart } from "lucide-react"
import { toast } from "sonner"
import { useCartStore } from "@/store/cart"
import { useWishlistStore } from "@/store/wishlist"
import { useRecentlyViewedStore } from "@/store/recently-viewed"
import { RecentlyViewed } from "@/components/products/recently-viewed"
import { StarRating } from "@/components/products/star-rating"
import { TrustSignals } from "@/components/products/trust-signals"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ProductGallery } from "@/components/products/product-gallery"
import { VariantSelector } from "@/components/products/variant-selector"
import { QuantitySelector } from "@/components/products/quantity-selector"
import { ProductGrid } from "@/components/products/product-grid"
import { formatPrice } from "@/lib/utils"
import { breadcrumbJsonLd } from "@/lib/structured-data"
import type { Product, Brand, Category } from "@/types"

interface ProductDetailViewProps {
  product: Product
  relatedProducts: Product[]
  brand: Brand | null
  categoryAncestors?: Category[]
}

export function ProductDetailView({
  product,
  relatedProducts,
  brand,
  categoryAncestors = [],
}: ProductDetailViewProps) {
  const [selectedVariantId, setSelectedVariantId] = useState(
    product.variants[0]?.id ?? ""
  )
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)

  const addToCart = useCartStore((s) => s.addItem)
  const openCart = useCartStore((s) => s.openCart)
  const isAddingStore = useCartStore((s) => s.isAdding)

  // Wishlist
  const wishlistItems = useWishlistStore((s) => s.items)
  const loadWishlist = useWishlistStore((s) => s.load)
  const addToWishlist = useWishlistStore((s) => s.addItem)
  const removeFromWishlist = useWishlistStore((s) => s.removeItem)

  const addRecentlyViewed = useRecentlyViewedStore((s) => s.addItem)

  useEffect(() => {
    loadWishlist().catch(console.error)
  }, [loadWishlist])

  const isWishlisted = wishlistItems.includes(product.id)

  useEffect(() => {
    addRecentlyViewed({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.variants[0]?.price ?? 0,
      imageUrl: product.images[0]?.url ?? "",
      imageAlt: product.images[0]?.alt ?? product.name,
    })
  }, [product, addRecentlyViewed])

  const selectedVariant = product.variants.find(
    (v) => v.id === selectedVariantId
  )

  if (selectedVariant === undefined) {
    return null
  }

  const variant = selectedVariant

  const isOnSale =
    !!variant.compareAtPrice &&
    variant.compareAtPrice > variant.price

  const inStock =
    variant.inventory.quantity > 0 ||
    variant.inventory.allowBackorder

  async function handleAddToCart() {
    if (isAdding || isAddingStore) return

    setIsAdding(true)

    try {
      await addToCart({
        productId: product.id,
        quantity,
        productName: product.name,
        imageUrl: product.images[0]?.url ?? "",
        imageAlt: product.images[0]?.alt ?? product.name,
        slug: product.slug,
        price: variant.price,
      })

      openCart()
      toast.success("به سبد خرید اضافه شد")
    } catch (err: any) {
      if (err?.message !== "NOT_AUTHENTICATED") {
        toast.error("افزودن به سبد خرید با خطا مواجه شد")
      }

      console.error(err)
    } finally {
      setIsAdding(false)
    }
  }

  async function handleToggleWishlist() {
    try {
      if (isWishlisted) {
        await removeFromWishlist(product.id)
        toast.success("از علاقه‌مندی‌ها حذف شد")
      } else {
        await addToWishlist(product.id)
        toast.success("به علاقه‌مندی‌ها اضافه شد")
      }
    } catch (err) {
      console.error(err)
      toast.error("عملیات ناموفق بود")
    }
  }

  const breadcrumbLd = breadcrumbJsonLd([
    { name: "فروشگاه", href: "/shop" },
    ...categoryAncestors.map((c) => ({ name: c.name, href: `/${c.slug}` })),
    { name: product.name, href: `/${product.slug}` },
  ])

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images.map((img) => img.url),
    sku: variant.sku,
    brand: brand ? { "@type": "Brand", name: brand.name } : undefined,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    },
    offers: {
      "@type": "Offer",
      price: Number((variant.price / 100).toFixed(2)),
      priceCurrency: variant.currency,
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  }

  const sanitizedBody = product.body ?? ""

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8 font-[family-name:var(--font-vazir)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([jsonLd, breadcrumbLd]) }}
      />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/shop" />}>فروشگاه</BreadcrumbLink>
          </BreadcrumbItem>
          {categoryAncestors.map((cat) => {
            const key = cat.id ?? cat.slug
            return (
              <div key={key} className="contents">
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink render={<Link href={`/${cat.slug}`} />}>
                    {cat.name}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </div>
            )
          })}
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mt-2 grid gap-8 lg:grid-cols-2 lg:gap-16">
        <ProductGallery images={product.images} productName={product.name} />

        <div className="flex flex-col">
          <div>
            <StarRating rating={product.rating} reviewCount={product.reviewCount} />
          </div>

          <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl text-neutral-800">
            {product.name}
          </h1>

          {brand && (
            <Link
              href={`/${brand.slug}`}
              className="mt-1 text-sm text-muted-foreground hover:text-green-600 hover:underline transition-colors"
            >
              {brand.name}
            </Link>
          )}

          <div className="mt-4 flex items-center gap-3">
            <span className="text-2xl font-bold text-green-700">
              {formatPrice(variant.price, variant.currency)}
            </span>
            {isOnSale && (
              <>
                <span className="text-lg text-muted-foreground line-through">
                  {formatPrice(
                    variant.compareAtPrice!,
                    variant.currency
                  )}
                </span>
                <Badge className="bg-green-600 text-white border-0">
                  {Math.round(
                    (1 -
                      variant.price /
                        variant.compareAtPrice!) *
                      100
                  )}
                  % تخفیف
                </Badge>
              </>
            )}
          </div>

          <p className="mt-4 text-muted-foreground">{product.description}</p>

          {product.variants.length > 1 && (
            <div className="mt-6 mb-6">
              <VariantSelector
                variants={product.variants}
                selectedVariantId={selectedVariantId}
                onSelect={setSelectedVariantId}
              />
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <div className="flex items-center gap-4">
              <QuantitySelector
                quantity={quantity}
                onQuantityChange={setQuantity}
                max={variant.inventory.quantity || 99}
              />
              <Button
                variant="outline"
                size="icon"
                aria-label={isWishlisted ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
                onClick={handleToggleWishlist}
                className="border-neutral-200 hover:border-green-500 hover:text-green-600 hover:bg-green-50"
              >
                <Heart className={`h-4 w-4 ${isWishlisted ? "fill-current text-green-600" : ""}`} />
              </Button>
            </div>
            <Button
              size="lg"
              className="w-full sm:flex-1 bg-green-600 hover:bg-green-700 text-white"
              disabled={!inStock || isAdding || isAddingStore}
              onClick={handleAddToCart}
            >
              <ShoppingBag className="ml-2 h-4 w-4" />
              {isAdding || isAddingStore
                ? "در حال افزودن..."
                : inStock
                ? "افزودن به سبد خرید"
                : "ناموجود"}
            </Button>
          </div>

          {!inStock && (
            <p className="mt-2 text-sm text-red-500">
              این کالا در حال حاضر ناموجود است.
            </p>
          )}

          <Separator className="my-6" />

          <TrustSignals />
        </div>
      </div>

      {product.body && (
        <section className="mt-16 border-t pt-12">
          <div className="mx-auto max-w-3xl">
            <div
              className="blog-body"
              dangerouslySetInnerHTML={{ __html: sanitizedBody }}
            />
          </div>
        </section>
      )}

      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-bold tracking-tight text-neutral-800">
            محصولات مشابه
          </h2>
          <div className="mt-6">
            <ProductGrid products={relatedProducts} />
          </div>
        </section>
      )}

      <RecentlyViewed excludeProductId={product.id} />
    </div>
  )
}
