import { NextRequest } from "next/server"

import {
  apiException,
  apiSuccess,
} from "@/lib/admin"

import {
  getProducts,
  createProduct,
} from "@/lib/admin/products"

//------------------------------------------------------
// GET
//------------------------------------------------------

export async function GET(
  request: NextRequest
) {
  try {

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

    if (publishedValue === "true") {
      published = true
    }

    if (publishedValue === "false") {
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

    console.log("Products API Result:")
    console.log(JSON.stringify(result, null, 2))

    return apiSuccess(result)

  } catch (error) {

    return apiException(error)

  }
}

//------------------------------------------------------
// POST
//------------------------------------------------------

export async function POST(
  request: NextRequest
) {
  try {

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

        description:
          body.description,

        body:
          body.body,

        image:
          body.image,

        price:
          Number(body.price),

        stock:
          Number(body.stock),

        category_id:
          body.category_id,

        brand_id:
          body.brand_id,

        featured:
          body.featured,

        published:
          body.published,

        weight:
          Number(body.weight),

        tags:
          body.tags,
      })
    return apiSuccess(product, 201)

  } catch (error) {

    return apiException(error)

  }
}
