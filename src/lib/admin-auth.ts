// ======================================================
// src/lib/admin-auth.ts
// احراز هویت پنل مدیریت
// ======================================================

import { NextRequest } from "next/server"
import { supabaseAdmin } from "./supabase-admin"

export interface AdminUser {
  id: string
  email: string
}

export async function requireAdmin(
  request: NextRequest
): Promise<AdminUser> {

  //--------------------------------------------------
  // دریافت توکن
  //--------------------------------------------------

  const authHeader =
    request.headers.get("authorization")

  if (!authHeader) {
    throw new Error("Authorization header not found.")
  }

  const token =
    authHeader.replace("Bearer ", "")

  //--------------------------------------------------
  // دریافت کاربر
  //--------------------------------------------------

  const {
    data: { user },
    error,
  } =
    await supabaseAdmin.auth.getUser(token)

  if (error || !user) {
    throw new Error("Unauthorized")
  }

  //--------------------------------------------------
  // بررسی ایمیل ادمین
  //--------------------------------------------------

  const adminEmail =
    process.env.ADMIN_EMAIL

  if (!adminEmail) {
    throw new Error(
      "ADMIN_EMAIL is not configured."
    )
  }

  if (
    user.email?.toLowerCase() !==
    adminEmail.toLowerCase()
  ) {
    throw new Error("Access denied")
  }

  //--------------------------------------------------

  return {
    id: user.id,
    email: user.email ?? "",
  }
}
