"use client"

import { create } from "zustand"
import type { CartItem, ProductImage } from "@/types"
import * as cartApi from "@/lib/cart"

interface CartState {
  items: CartItem[]
  isOpen: boolean

  load: () => Promise<void>

  addItem: (item: {
    variantId: string
    productId: string
    quantity?: number
  }) => Promise<void>

  removeItem: (variantId: string) => Promise<void>
  updateQuantity: (variantId: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>

  toggleCart: () => void
  openCart: () => void
  closeCart: () => void

  getSubtotal: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isOpen: false,

  // 🔥 مهم: فقط یک بار load
  load: async () => {
    const items = await cartApi.getCart()
    set({ items })
  },

  // 🔥 FIX اصلی: optimistic update
  addItem: async (item) => {
    const current = get().items

    // 1. optimistic UI update
    const existing = current.find(i => i.variantId === item.variantId)

    let updated: CartItem[]

    if (existing) {
      updated = current.map(i =>
        i.variantId === item.variantId
          ? {
              ...i,
              quantity: i.quantity + (item.quantity ?? 1),
              lineTotal:
                i.price * (i.quantity + (item.quantity ?? 1)),
            }
          : i
      )
    } else {
      updated = [
        ...current,
        {
          id: item.variantId,
          variantId: item.variantId,
          productId: item.productId,
          name: "",
          variantName: "",
          image: { url: "", alt: "" },
          slug: "",
          price: 0,
          quantity: item.quantity ?? 1,
          lineTotal: 0,
        },
      ]
    }

    set({ items: updated })

    // 2. sync with backend
    const serverItems = await cartApi.addItem({
      variantId: item.variantId,
      productId: item.productId,
      quantity: item.quantity,
    })

    set({ items: serverItems })
  },

  removeItem: async (variantId) => {
    const items = await cartApi.removeItem(variantId)
    set({ items })
  },

  updateQuantity: async (variantId, quantity) => {
    const items = await cartApi.updateQuantity(variantId, quantity)
    set({ items })
  },

  clearCart: async () => {
    await cartApi.clearCart()
    set({ items: [] })
  },

  toggleCart: () => set(s => ({ isOpen: !s.isOpen })),
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),

  getSubtotal: () =>
    get().items.reduce((s, i) => s + i.lineTotal, 0),

  getItemCount: () =>
    get().items.reduce((s, i) => s + i.quantity, 0),
}))
