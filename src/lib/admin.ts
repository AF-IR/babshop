// ======================================================
// src/lib/admin.ts
// ======================================================
export * from "./admin-auth"
import { supabaseAdmin } from "./supabase-admin"
export * from "./admin-auth"
export { supabaseAdmin }
// ======================================================
// src/lib/admin.ts
// توابع مشترک پنل مدیریت
// ======================================================


//------------------------------------------------------
// پاسخ موفق
//------------------------------------------------------

export function apiSuccess(data: unknown, status = 200) {
  return Response.json(
    {
      success: true,
      data,
    },
    { status }
  )
}

//------------------------------------------------------
// پاسخ خطا
//------------------------------------------------------

export function apiError(message: string, status = 400) {
  return Response.json(
    {
      success: false,
      error: message,
    },
    { status }
  )
}

//------------------------------------------------------
// هندل خطا
//------------------------------------------------------

export function apiException(error: unknown) {
  console.error(error)

  return Response.json(
    {
      success: false,
      error: "Internal Server Error",
      details:
        error instanceof Error
          ? error.message
          : String(error),
    },
    {
      status: 500,
    }
  )
}
