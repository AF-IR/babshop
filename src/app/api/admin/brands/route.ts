import { apiException, apiSuccess } from "@/lib/admin"
import { supabaseAdmin } from "@/lib/admin"

export async function GET() {
  try {

    const { data, error } =
      await supabaseAdmin
        .from("brands")
        .select("id,name")
        .order("name")

    if (error) throw error

    return apiSuccess(data)

  } catch (e) {

    return apiException(e)

  }
}
