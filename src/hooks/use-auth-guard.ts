"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "./use-user"

export function useAuthGuard() {

  const router = useRouter()

  const {
    user,
    loading,
    isAuthenticated,
  } = useUser()

  const [isAdmin, setIsAdmin] =
    useState(false)

  const [checkingAdmin, setCheckingAdmin] =
    useState(true)

  useEffect(() => {

    if (loading) return

    if (!isAuthenticated) {
      router.replace("/auth/login")
      return
    }

    async function checkAdmin() {

      try {

        //------------------------------------------------
        // دریافت Session
        //------------------------------------------------

        const { supabase } =
          await import("@/lib/supabase")

        const {
          data: { session },
        } =
          await supabase.auth.getSession()

        if (!session) {
          router.replace("/auth/login")
          return
        }

        //------------------------------------------------

        const response =
          await fetch(
            "/api/admin/me",
            {
              headers: {
                Authorization:
                  `Bearer ${session.access_token}`,
              },
            }
          )

        if (!response.ok) {
          router.replace("/")
          return
        }

        setIsAdmin(true)

      } catch {

        router.replace("/")

      } finally {

        setCheckingAdmin(false)

      }

    }

    checkAdmin()

  }, [
    loading,
    isAuthenticated,
    router,
  ])

  return {

    user,

    isAuthenticated,

    isAdmin,

    isLoading:
      loading || checkingAdmin,

    isReady:
      !loading &&
      !checkingAdmin &&
      isAdmin,

  }

}
