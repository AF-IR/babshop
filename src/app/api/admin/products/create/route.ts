import { NextRequest } from "next/server"

import {
  apiException,
  apiSuccess,
  requireAdmin,
} from "@/lib/admin"

import { supabaseAdmin } from "@/lib/supabase-admin"

export async function POST(
  request: NextRequest
) {
  try {

    await requireAdmin(request)

    const body = await request.json()

    const {

      title,
      slug,
      description,
      image,
      price,
      stock,
      category,
      published,

    } = body

    //--------------------------------------------

    if (!title)
      throw new Error("Title is required.")

    if (!slug)
      throw new Error("Slug is required.")

    //--------------------------------------------

    const { data, error } =
      await supabaseAdmin

        .from("products")

        .insert({

          title,

          slug,

          description,

          image,

          price,

          stock,

          category,

          published,

        })

        .select()

        .single()

    if (error) throw error

    //--------------------------------------------

    return apiSuccess(data, 201)

  } catch (error) {

    return apiException(error)

  }
}
