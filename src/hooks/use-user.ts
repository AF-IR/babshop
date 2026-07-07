"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { User } from "@/types"

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  async function loadUser() {
    const {
      data: { user: sbUser },
    } = await supabase.auth.getUser()

    if (!sbUser) {
      setUser(null)
      setLoading(false)
      return
    }

    setUser({
      id: sbUser.id,
      email: sbUser.email ?? "",
      firstName: sbUser.user_metadata?.firstName ?? "",
      lastName: sbUser.user_metadata?.lastName ?? "",
      role: "customer",
      addresses: [],
      createdAt: sbUser.created_at,
      updatedAt: sbUser.updated_at ?? sbUser.created_at,
    })

    setLoading(false)
  }

  useEffect(() => {
    loadUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      loadUser()
    })

    return () => subscription.unsubscribe()
  }, [])

  return {
    user,
    loading,
    isAuthenticated: !!user,
    accessToken:
      session?.access_token ?? null,
  }
}
