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
