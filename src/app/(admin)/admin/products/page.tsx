"use client"

import { useEffect, useState } from "react"

import ProductTable
from "@/components/admin/product-table"

import { AdminProduct }
from "@/types/admin-product"

export default function ProductsPage() {

  const [

    products,

    setProducts,

  ] = useState<AdminProduct[]>([])

  useEffect(() => {

    load()

  }, [])

  async function load() {

    const res =
      await fetch(
        "/api/admin/products"
      )

    const json =
      await res.json()

    setProducts(
      json.data.items
    )

  }

  return (

    <div className="space-y-6">

      <h1 className="text-3xl font-bold">

        مدیریت محصولات

      </h1>

      <ProductTable

        products={products}

      />

    </div>

  )

}
