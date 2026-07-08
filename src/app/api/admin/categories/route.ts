import { NextResponse } from "next/server"

import { supabaseAdmin } from "@/lib/admin"

export async function GET() {

  const { data, error } =
    await supabaseAdmin

      .from("categories")

      .select("id,name")

      .order("name")

  if (error) {

    return NextResponse.json(
      {
        success:false,
        error:error.message
      },
      {
        status:500
      }
    )

  }

  return NextResponse.json({

    success:true,

    data

  })

}
