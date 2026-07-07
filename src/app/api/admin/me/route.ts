import { NextRequest } from "next/server"

import {
  apiException,
  apiSuccess,
  requireAdmin,
} from "@/lib/admin"

export async function GET(
  request: NextRequest
) {
  try {

    const admin =
      await requireAdmin(request)

    return apiSuccess(admin)

  } catch (error) {

    return apiException(error)

  }
}
