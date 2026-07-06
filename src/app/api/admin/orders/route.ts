import {
  apiException,
  apiSuccess,
  supabaseAdmin,
} from "@/lib/admin"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    const page = Number(searchParams.get("page") ?? 1)
    const limit = Number(searchParams.get("limit") ?? 20)

    const status = searchParams.get("status")
    const paymentStatus = searchParams.get("payment_status")
    const search = searchParams.get("search")

    const from = (page - 1) * limit
    const to = from + limit - 1

    let query = supabaseAdmin
      .from("orders")
      .select("*", {
        count: "exact",
      })
      .order("created_at", {
        ascending: false,
      })

    if (status) {
      query = query.eq("status", status)
    }

    if (paymentStatus) {
      query = query.eq("payment_status", paymentStatus)
    }

    if (search) {
      query = query.or(
        `order_number.ilike.%${search}%,receiver_name.ilike.%${search}%`
      )
    }

    const {
      data,
      count,
      error,
    } = await query.range(from, to)

    if (error) throw error

    return apiSuccess({
      items: data,
      pagination: {
        page,
        limit,
        total: count ?? 0,
        totalPages: Math.ceil((count ?? 0) / limit),
      },
    })
  } catch (error) {
    return apiException(error)
  }
}
