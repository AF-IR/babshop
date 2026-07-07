import { NextRequest } from "next/server"

import {
  apiException,
  apiSuccess,
  requireAdmin,
} from "@/lib/admin"

import {
  getProducts,
} from "@/lib/admin/products"

export async function GET(
  request: NextRequest
) {
  try {

    await requireAdmin(request)

    const { searchParams } =
      new URL(request.url)

    const page =
      Number(
        searchParams.get("page")
      ) || 1

    const pageSize =
      Number(
        searchParams.get("pageSize")
      ) || 20

    const search =
      searchParams.get("search")
      ?? undefined

    const category =
      searchParams.get("category")
      ?? undefined

    const publishedValue =
      searchParams.get("published")

    let published:
      | boolean
      | undefined

    if (
      publishedValue === "true"
    ) {
      published = true
    }

    if (
      publishedValue === "false"
    ) {
      published = false
    }

    const result =
      await getProducts({

        page,

        pageSize,

        search,

        category,

        published,

      })

    return apiSuccess(result)

  } catch (error) {

    return apiException(error)

  }
}
//------------------------------------------------------
// POST
//------------------------------------------------------

import { createProduct } from "@/lib/admin/products"

export async function POST(
  request: NextRequest
) {
  try {

    await requireAdmin(request)

    const body = await request.json()

    if (!body.title) {
      throw new Error("Title is required.")
    }

    if (!body.slug) {
      throw new Error("Slug is required.")
    }

    if (
      body.price === undefined ||
      body.price === null
    ) {
      throw new Error("Price is required.")
    }

    if (
      body.stock === undefined ||
      body.stock === null
    ) {
      throw new Error("Stock is required.")
    }

    const product =
      await createProduct({
        title: body.title,
        slug: body.slug,
        description: body.description,
        image: body.image,
        price: Number(body.price),
        stock: Number(body.stock),
        category: body.category,
        published:
          body.published ?? true,
      })

    return apiSuccess(product, 201)

  } catch (error) {

    return apiException(error)

  }
}
