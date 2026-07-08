// ======================================================
// src/lib/admin/orders.ts
// Orders Repository
// ======================================================

import { supabaseAdmin } from "@/lib/admin"

export interface AdminOrderFilters {

  page?: number

  pageSize?: number

  search?: string

  status?: string

}

export async function getOrders(

  filters: AdminOrderFilters = {}

) {

  const page =
    filters.page ?? 1

  const pageSize =
    filters.pageSize ?? 20

  let query =
    supabaseAdmin

      .from("orders")

      .select("*", {

        count: "exact",

      })

  //-----------------------------------

  if (filters.status) {

    query =
      query.eq(

        "status",

        filters.status

      )

  }

  //-----------------------------------

  if (filters.search) {

    query =
      query.or(

`customer_name.ilike.%${filters.search}%,
customer_email.ilike.%${filters.search}%`

      )

  }

  //-----------------------------------

  query = query

    .order(

      "created_at",

      {

        ascending: false,

      }

    )

    .range(

      (page - 1) * pageSize,

      page * pageSize - 1

    )

  //-----------------------------------

  const {

    data,

    error,

    count,

  } = await query

  if (error)
    throw error

  return {

    items:
      data ?? [],

    total:
      count ?? 0,

    page,

    pageSize,

  }

}

//--------------------------------------------------
// یک سفارش
//--------------------------------------------------

export async function getOrder(

  id: string

) {

  const {

    data,

    error,

  } = await supabaseAdmin

    .from("orders")

    .select("*")

    .eq("id", id)

    .single()

  if (error)
    throw error

  return data

}

//--------------------------------------------------
// تغییر وضعیت
//--------------------------------------------------

export async function updateOrderStatus(

  id: string,

  status: string

) {

  const {

    data,

    error,

  } = await supabaseAdmin

    .from("orders")

    .update({

      status,

    })

    .eq("id", id)

    .select()

    .single()

  if (error)
    throw error

  return data

}
