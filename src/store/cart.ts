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
    name: string
    variantName: string
    image: ProductImage
    slug: string
    price: number
    quantity?: number
  }) => Promise<void>

  removeItem: (variantId: string) => Promise<void>

  updateQuantity: (
    variantId: string,
    quantity: number
  ) => Promise<void>

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

  load: async () => {
    const items = await cartApi.getCart()
    set({ items })
  },

  addItem: async (item) => {
    const { variantId, productId, quantity } = item
    await cartApi.addItem({ variantId, productId, quantity })
    const items = await cartApi.getCart()
    set({ items })
  },

  removeItem: async (variantId) => {
    await cartApi.removeItem(variantId)
    const items = await cartApi.getCart()
    set({ items })
  },

  updateQuantity: async (variantId, quantity) => {
    await cartApi.updateQuantity(variantId, quantity)
    const items = await cartApi.getCart()
    set({ items })
  },

  clearCart: async () => {
    await cartApi.clearCart()
    set({ items: [] })
  },

  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),

  getSubtotal: () => {
    const { items } = get()
    return items.reduce((sum, item) => sum + item.lineTotal, 0)
  },

  getItemCount: () => {
    const { items } = get()
    return items.reduce((sum, item) => sum + item.quantity, 0)
  },
}))
