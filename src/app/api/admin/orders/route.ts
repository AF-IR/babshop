import { NextRequest } from "next/server"

import {
  apiException,
  apiSuccess,
  requireAdmin,
} from "@/lib/admin"

import { getOrders } from "@/lib/admin/orders"

export async function GET(request: NextRequest) {
  try {
    //--------------------------------------------------
    // احراز هویت ادمین
    //--------------------------------------------------

    await requireAdmin(request)

    //--------------------------------------------------
    // پارامترها
    //--------------------------------------------------

    const { searchParams } = new URL(request.url)

    const page = Number(searchParams.get("page") ?? "1")

    const limit = Number(searchParams.get("limit") ?? "20")

    const search = searchParams.get("search") ?? ""

    const status = searchParams.get("status") ?? ""

    //--------------------------------------------------

    const result = await getOrders({
      page,
      limit,
      search,
      status,
    })

    return apiSuccess(result)
  } catch (error) {
    return apiException(error)
  }
}
