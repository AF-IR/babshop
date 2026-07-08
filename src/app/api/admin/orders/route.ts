import { NextRequest } from "next/server"

import {
  apiSuccess,
  apiException,
} from "@/lib/admin"

import {
  getOrders,
} from "@/lib/admin/orders"

//------------------------------------------------------
// GET
//------------------------------------------------------

export async function GET(
  request: NextRequest
) {

  try {

    const { searchParams } =
      new URL(request.url)

    const page =
      Number(
        searchParams.get("page")
      ) || 1

    const pageSize =
      Number(
        searchParams.get("pageSize")
      ) || 20

    const search =
      searchParams.get("search")
      ?? undefined

    const status =
      searchParams.get("status")
      ?? undefined

    const result =
      await getOrders({

        page,

        pageSize,

        search,

        status,

      })

    return apiSuccess(result)

  }

  catch(error){

    return apiException(error)

  }

}
