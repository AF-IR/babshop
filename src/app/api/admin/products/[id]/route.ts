import {
  apiException,
  apiError,
  apiSuccess,
  supabaseAdmin,
} from "@/lib/admin"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const {
      data,
      error,
    } = await supabaseAdmin
      .from("products")
      .select("*")
      .eq("id", id)
      .single()

    if (error) {
      return apiError("محصول پیدا نشد", 404)
    }

    return apiSuccess(data)
  } catch (error) {
    return apiException(error)
  }
}
