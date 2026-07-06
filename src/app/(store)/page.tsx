import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { createClient } from '@supabase/supabase-js'
import { siteConfig } from "@/lib/config"
import { FeaturedProductsCarousel } from "@/components/products/featured-products-carousel" // ← import جدید
import { NewsletterForm } from "@/components/layout/newsletter-form"
import { PLACEHOLDER_IMAGE } from "@/lib/constants"
import { productRepository, categoryRepository } from "@/lib/repositories"
import { BannerSlider } from "@/components/layout/banner-slider"

// اتصال به سوپابیس برای دریافت بنرها
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const metadata: Metadata = {
  title: "فروشگاه باب‌شاپ | خرید آنلاین",
  description: "بهترین محصولات را با بهترین قیمت از باب‌شاپ تهیه کنید.",
  alternates: { canonical: "/" },
}

export default async function HomePage() {
  const categories = await categoryRepository.list()
  const featuredProducts = await productRepository.getFeatured(8) // ← تعداد را به ۸ افزایش دادم تا کاروسل پرتر شود
  
  // دریافت بنرهای فعال از سوپابیس
  const { data: banners } = await supabase
    .from('banners')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  return (
    <div className="flex flex-col">
      {/* اسلایدر متحرک بنرها */}
      <BannerSlider banners={banners || []} />

      {/* Categories */}
      <section className="mx-auto w-full max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">
            دسته‌بندی‌های فروشگاه
          </h2>
          <Link
            href="/shop"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            مشاهده همه
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {categories.map((category) => (
            <Link key={category.id} href={`/${category.slug}`} className="group">
              <div className="relative aspect-square overflow-hidden rounded-lg bg-neutral-100">
                <Image
                  src={category.image?.url ?? PLACEHOLDER_IMAGE}
                  alt={category.image?.alt ?? category.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 16vw"
                />
              </div>
              <div className="mt-3 text-center">
                <h3 className="text-sm font-medium group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products - حالا به صورت کاروسل */}
      <section className="mx-auto w-full max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8 bg-neutral-50 rounded-3xl mb-16">
        <FeaturedProductsCarousel 
          products={featuredProducts} 
          title="محصولات ویژه" 
          viewAllLink="/shop" 
        />
      </section>

      {/* Newsletter CTA */}
      <section className="bg-neutral-900 text-white py-16">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            عضویت در خبرنامه باب‌شاپ
          </h2>
          <p className="mt-4 text-neutral-400 mb-8">
            برای اطلاع از آخرین تخفیف‌ها و محصولات جدید، ایمیل خود را وارد کنید.
          </p>
          <NewsletterForm />
        </div>
      </section>
    </div>
  )
}
