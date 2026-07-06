import {
  apiException,
  apiSuccess,
} from "@/lib/admin"

import { verifyAdmin } from "@/lib/admin"

import { getOrders } from "@/lib/admin/orders"

export async function GET(request: Request) {
  try {

    await verifyAdmin()

    const { searchParams } =
      new URL(request.url)

    const page =
      Number(searchParams.get("page") ?? 1)

    const pageSize =
      Number(searchParams.get("pageSize") ?? 20)

    const status =
      searchParams.get("status") ?? undefined

    const paymentStatus =
      searchParams.get("paymentStatus") ?? undefined

    const search =
      searchParams.get("search") ?? undefined

    const orders =
      await getOrders({
        page,
        pageSize,
        status,
        paymentStatus,
        search,
      })

    return apiSuccess(orders)

  } catch (error) {
    return apiException(error)
  }
}
