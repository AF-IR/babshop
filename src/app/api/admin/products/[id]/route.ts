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
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const body = await request.json()

    const {
      data,
      error,
    } = await supabaseAdmin
      .from("products")
      .update(body)
      .eq("id", id)
      .select()
      .single()

    if (error) throw error

    return apiSuccess(data)
  } catch (error) {
    return apiException(error)
  }
}
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const { error } = await supabaseAdmin
      .from("products")
      .delete()
      .eq("id", id)

    if (error) throw error

    return apiSuccess({
      deleted: true,
    })
  } catch (error) {
    return apiException(error)
  }
}
