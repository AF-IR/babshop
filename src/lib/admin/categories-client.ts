"use client"

import { adminFetch } from "../admin-api"

export async function getCategories() {
  return adminFetch("/api/admin/categories")
}
