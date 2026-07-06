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

  const authHeader = request.headers.get("authorization")

  if (!authHeader) {
    throw new Error("Authorization header not found.")
  }

  const token = authHeader.replace("Bearer ", "")

  //--------------------------------------------------
  // بررسی کاربر
  //--------------------------------------------------

  const {
    data: { user },
    error,
  } = await supabaseAdmin.auth.getUser(token)

  if (error || !user) {
    throw new Error("Unauthorized")
  }

  //--------------------------------------------------
  // بررسی نقش ادمین
  //--------------------------------------------------

  const isAdmin =
    user.user_metadata?.role === "admin"

  if (!isAdmin) {
    throw new Error("Access denied")
  }

  //--------------------------------------------------

  return {
    id: user.id,
    email: user.email ?? "",
  }
}
