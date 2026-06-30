"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "./use-user"

export function useAuthGuard() {
  const router = useRouter()
  const { user, loading, isAuthenticated } = useUser()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/auth/login")
    }
  }, [loading, isAuthenticated, router])

  return {
    user,
    isAuthenticated,
    isLoading: loading,
    isReady: !loading && isAuthenticated,
  }
}
