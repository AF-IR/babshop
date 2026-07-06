import {
  apiException,
  apiSuccess,
  supabaseAdmin,
} from "@/lib/admin"

export async function GET(request: Request) {
  try {
    //--------------------------------------------------
    // Query Params
    //--------------------------------------------------

    const { searchParams } = new URL(request.url)

    const page = Number(searchParams.get("page") ?? 1)
    const limit = Number(searchParams.get("limit") ?? 20)
    const search = searchParams.get("search") ?? ""

    const from = (page - 1) * limit
    const to = from + limit - 1

    //--------------------------------------------------
    // Query
    //--------------------------------------------------

    let query = supabaseAdmin
      .from("products")
      .select("*", {
        count: "exact",
      })
      .order("created_at", {
        ascending: false,
      })

    if (search) {
      query = query.ilike("title", `%${search}%`)
    }

    const {
      data,
      count,
      error,
    } = await query.range(from, to)

    if (error) throw error

    //--------------------------------------------------

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
