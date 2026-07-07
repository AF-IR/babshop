"use client"
import Link from "next/link"
import { useEffect, useState } from "react"

import ProductTable from "@/components/admin/product-table"
import { AdminProduct } from "@/types/admin-product"
import { getProducts } from "@/lib/admin/products-client"

export default function ProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([])

  useEffect(() => {
    load()
  }, [])

  async function load() {
    const json = await getProducts()
    setProducts(json.data.items)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">مدیریت محصولات</h1>
      <div className="flex justify-end">
        <Link
          href="/admin/products/create"
          className="rounded bg-black px-5 py-3 text-white"
        >
          افزودن محصول
        </Link>
      </div>
      <ProductTable products={products} />
    </div>
  )
}
