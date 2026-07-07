"use client"

import { useMemo } from "react"

import { useUser } from "./use-user"

import { AdminApiClient } from "@/lib/admin/api-client"

export function useAdminApi() {

  const {
    accessToken,
  } = useUser()

  return useMemo(() => {

    if (!accessToken) {
      return null
    }

    return new AdminApiClient({
      accessToken,
    })

  }, [accessToken])

}
