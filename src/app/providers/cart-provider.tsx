"use client"

import { useEffect } from "react"
import { useCartStore } from "@/store/cart"

export function CartProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const loadCart = useCartStore((s) => s.load)

  useEffect(() => {
    loadCart()
  }, [loadCart])

  return children
}
