"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { User, Address } from "@/types"
import { signIn, signUp, signOut } from "@/lib/auth"

interface AuthState {
  user: User | null
  isAuthenticated: boolean

  login: (email: string, password: string) => Promise<boolean>
  register: (data: { firstName: string; lastName: string; email: string; password: string }) => Promise<boolean>
  logout: () => Promise<void>
  updateProfile: (data: Partial<Pick<User, "firstName" | "lastName" | "email">>) => void
  addAddress: (address: Omit<Address, "id">) => void
  removeAddress: (id: string) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      login: async (email, password) => {
        const { data, error } = await signIn(email, password)

        if (error || !data.user) {
          return false
        }

        const user: User = {
          id: data.user.id,
          email: data.user.email ?? "",
          firstName: data.user.user_metadata?.firstName ?? "",
          lastName: data.user.user_metadata?.lastName ?? "",
          role: "customer",
          addresses: [],
          createdAt: data.user.created_at,
          updatedAt: data.user.updated_at ?? data.user.created_at,
        }

        set({
          user,
          isAuthenticated: true,
        })

        return true
      },

      register: async (data) => {
        const { data: signUpData, error } = await signUp(
          data.email,
          data.password,
          data.firstName,
          data.lastName
        )

        if (error || !signUpData.user) {
          return false
        }

        const user: User = {
          id: signUpData.user.id,
          email: signUpData.user.email ?? "",
          firstName: data.firstName,
          lastName: data.lastName,
          role: "customer",
          addresses: [],
          createdAt: signUpData.user.created_at,
          updatedAt: signUpData.user.updated_at ?? signUpData.user.created_at,
        }

        set({
          user,
          isAuthenticated: true,
        })

        return true
      },

      logout: async () => {
        await signOut()
        set({
          user: null,
          isAuthenticated: false,
        })
      },

      updateProfile: (data) => {
        const user = get().user
        if (!user) return
        set({
          user: {
            ...user,
            ...data,
            updatedAt: new Date().toISOString(),
          },
        })
      },

      addAddress: (address) => {
        const user = get().user
        if (!user) return
        const newAddress: Address = {
          ...address,
          id: `addr-${Date.now()}`,
        }
        set({
          user: {
            ...user,
            addresses: [...user.addresses, newAddress],
          },
        })
      },

      removeAddress: (id) => {
        const user = get().user
        if (!user) return
        set({
          user: {
            ...user,
            addresses: user.addresses.filter((a) => a.id !== id),
          },
        })
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
)
