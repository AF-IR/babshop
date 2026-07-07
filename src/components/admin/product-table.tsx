"use client"

import { AdminProduct } from "@/types/admin-product"

interface Props {

  products: AdminProduct[]

}

export default function ProductTable({

  products,

}: Props) {

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

          </tr>

        </thead>

        <tbody>

          {products.map(product => (

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

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  )

}
