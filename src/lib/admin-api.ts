"use client"

import { supabase } from "@/lib/supabase"

async function getToken() {

  const {
    data: { session },
  } = await supabase.auth.getSession()

  return session?.access_token ?? ""
}

export async function adminFetch(

  url: string,

  options: RequestInit = {}

) {

  const token = await getToken()

  const headers = new Headers(options.headers)

  headers.set(
    "Authorization",
    `Bearer ${token}`
  )

  if (
    !headers.has("Content-Type")
  ) {

    headers.set(
      "Content-Type",
      "application/json"
    )

  }

  const response = await fetch(url, {

    ...options,

    headers,

  })

  const json = await response.json()

  if (!response.ok) {

    throw new Error(

      json.error ??

      "Admin API Error"

    )

  }

  return json
}
