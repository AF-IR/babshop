//src/types/admin-product.ts
// ======================================================
// Product Types (Admin)
// ======================================================

export interface AdminProduct {

  id: string

  title: string

  slug: string

  description: string

  image: string | null

  price: number

  stock: number

  category: string | null

  published: boolean

  created_at: string

}

export interface ProductListResponse {

  items: AdminProduct[]

  total: number

  page: number

  pageSize: number

}
