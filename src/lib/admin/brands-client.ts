"use client"

import { adminFetch } from "../admin-api"

export async function getBrands() {
  return adminFetch("/api/admin/brands")
}
