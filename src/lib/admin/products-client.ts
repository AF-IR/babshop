"use client"

import { adminFetch } from "../admin-api"

//--------------------------------------------------
// لیست محصولات
//--------------------------------------------------

export async function getProducts(
  page = 1,
  pageSize = 20
) {
  return adminFetch(
    `/api/admin/products?page=${page}&pageSize=${pageSize}`
  )
}

//--------------------------------------------------
// دریافت یک محصول
//--------------------------------------------------

export async function getProduct(
  id: string
) {
  return adminFetch(
    `/api/admin/products/${id}`
  )
}

//--------------------------------------------------
// ایجاد
//--------------------------------------------------

export async function createProduct(
  product: unknown
) {
  return adminFetch(
    "/api/admin/products",
    {
      method: "POST",
      body: JSON.stringify(product),
    }
  )
}

//--------------------------------------------------
// ویرایش
//--------------------------------------------------

export async function updateProduct(
  id: string,
  product: unknown
) {
  return adminFetch(
    `/api/admin/products/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(product),
    }
  )
}

//--------------------------------------------------
// حذف
//--------------------------------------------------
export async function deleteProduct(
  id: string
) {

  return adminFetch(

    `/api/admin/products/${id}`,

    {

      method: "DELETE",

    }

  )

}
