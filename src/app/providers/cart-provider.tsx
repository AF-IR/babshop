"use client"

import { useEffect } from "react"
import { useCartStore } from "@/store/cart"

export function CartProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const load = useCartStore(s => s.load)

  useEffect(() => {
    load()
  }, [load])

  return children
}
