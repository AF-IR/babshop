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

    const page = Number(
      searchParams.get("page") ?? "1"
    )

    const limit = Number(
      searchParams.get("limit") ?? "20"
    )

    const search =
      searchParams.get("search") ?? undefined

    const category =
      searchParams.get("category") ?? undefined

    const published =
      searchParams.get("published")

    const result =
      await getProducts({

        page,

        limit,

        search,

        category,

        published:
          published === null
            ? undefined
            : published === "true",

      })

    return apiSuccess(result)

  } catch (error) {

    return apiException(error)

  }
}
