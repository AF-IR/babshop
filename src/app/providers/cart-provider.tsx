"use client"

import { useEffect } from "react"
import { useCartStore } from "@/store/cart"
import { useUser } from "@/store/user" // اگر نداری بعداً می‌سازیم

export function CartProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const loadCart = useCartStore((s) => s.load)
  const items = useCartStore((s) => s.items)

  const user = useUser((s) => s.user) // یا auth store شما

  // وقتی کاربر لاگین می‌کند → cart از Supabase لود شود
  useEffect(() => {
    if (user) {
      loadCart()
    }
  }, [user, loadCart])

  return children
}
