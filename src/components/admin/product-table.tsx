"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

import { deleteProduct } from "@/lib/admin/products-client"
import { AdminProduct } from "@/types/admin-product"

interface Props {
  products: AdminProduct[]
}

export default function ProductTable({
  products,
}: Props) {

  const [items, setItems] =
    useState<AdminProduct[]>(products)

  //--------------------------------------------------
  // همگام سازی با داده های جدید
  //--------------------------------------------------

  useEffect(() => {

    setItems(products)

  }, [products])

  //--------------------------------------------------
  // حذف
  //--------------------------------------------------

  async function remove(id: string) {

    const ok = window.confirm(
      "آیا از حذف این محصول مطمئن هستید؟"
    )

    if (!ok) return

    try {

      await deleteProduct(id)

      setItems(old =>
        old.filter(
          x => x.id !== id
        )
      )

      alert("محصول با موفقیت حذف شد.")

    } catch (error) {

      console.error(error)

      alert("خطا در حذف محصول.")

    }

  }

  //--------------------------------------------------

  return (

    <div className="rounded-lg border overflow-hidden">

      <table className="w-full">

        <thead className="bg-muted">

          <tr>

            <th className="p-3 text-right">
              تصویر
            </th>

            <th className="p-3 text-right">
              عنوان
            </th>

            <th className="p-3 text-right">
              قیمت
            </th>

            <th className="p-3 text-right">
              موجودی
            </th>

            <th className="p-3 text-right">
              وضعیت
            </th>

            <th className="p-3 text-right">
              عملیات
            </th>

          </tr>

        </thead>

        <tbody>

          {items.map(product => (

            <tr
              key={product.id}
              className="border-t"
            >

              <td className="p-3">

                <img
                  src={
                    product.image ??
                    "/placeholder.png"
                  }
                  className="w-14 h-14 rounded object-cover"
                />

              </td>

              <td className="p-3">

                {product.title}

              </td>

              <td className="p-3">

                {product.price.toLocaleString()}

              </td>

              <td className="p-3">

                {product.stock}

              </td>

              <td className="p-3">

                {product.published
                  ? "فعال"
                  : "غیرفعال"}

              </td>

              <td className="p-3">

                <div className="flex gap-2">

                  <Link
                    href={`/admin/products/${product.id}`}
                    className="rounded bg-blue-600 px-3 py-1 text-sm text-white"
                  >

                    ویرایش

                  </Link>

                  <button
                    onClick={() =>
                      remove(product.id)
                    }
                    className="rounded bg-red-600 px-3 py-1 text-sm text-white"
                  >

                    حذف

                  </button>

                </div>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  )

}
