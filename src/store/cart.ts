"use client"

import { create } from "zustand"
import type { CartItem } from "@/types"
import * as cartApi from "@/lib/cart"
import { getUser } from "@/lib/auth"
import {
  getGuestCart,
  saveGuestItem,
  clearGuestCart,
  updateGuestQuantity,
  removeGuestItem,
} from "@/lib/cart-merge"

interface CartState {
  items: CartItem[]
  isOpen: boolean
  isLoading: boolean
  isAdding: boolean
  isUpdating: boolean
  isRemoving: boolean
  isClearing: boolean

  load(): Promise<void>
  addItem(params: {
    productId: string
    quantity?: number
    productName?: string
    imageUrl?: string
    imageAlt?: string
    slug?: string
    price?: number
  }): Promise<void>
  updateQuantity(productId: string, quantity: number): Promise<void>
  removeItem(productId: string): Promise<void>
  clearCart(): Promise<void>
  openCart(): void
  closeCart(): void
  toggleCart(): void
  getSubtotal(): number
  getItemCount(): number
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isOpen: false,
  isLoading: false,
  isAdding: false,
  isUpdating: false,
  isRemoving: false,
  isClearing: false,

  async load() {
    set({ isLoading: true })

    try {
      const {
        data: { user },
      } = await getUser()

      if (user) {
        const server = await cartApi.getCart()
        set({ items: server, isLoading: false })
        return
      }

      const guest = getGuestCart()
      const guestItems: CartItem[] = guest.map((g) => ({
        id: crypto.randomUUID(),
        variantId: g.productId,
        productId: g.productId,
        name: g.productName ?? "",
        variantName: g.variantName ?? "Default",
        image: {
          url: g.imageUrl ?? "",
          alt: g.imageAlt ?? "",
        },
        slug: g.slug ?? "",
        price: g.price ?? 0,
        quantity: g.quantity,
        lineTotal: (g.price ?? 0) * g.quantity,
      }))

      set({ items: guestItems, isLoading: false })
    } catch (e) {
      console.error("load error:", e)
      set({ isLoading: false })
    }
  },

  async addItem(item) {
    set({ isAdding: true })

    try {
      const cart = await cartApi.addItem({
        productId: item.productId,
        quantity: item.quantity,
      })

      clearGuestCart()
      set({ items: cart, isAdding: false })
    } catch (err: any) {
      if (err.message === "NOT_AUTHENTICATED") {
        saveGuestItem({
          variantId: item.productId,
          productId: item.productId,
          quantity: item.quantity ?? 1,
          productName: item.productName,
          imageUrl: item.imageUrl,
          imageAlt: item.imageAlt,
          slug: item.slug,
          price: item.price,
        })
        await get().load()
      }
      set({ isAdding: false })
    }
  },

  async updateQuantity(productId, quantity) {
    set({ isUpdating: true })

    try {
      const {
        data: { user },
      } = await getUser()

      if (!user) {
        updateGuestQuantity(productId, quantity)
        await get().load()
        return
      }

      const cart = await cartApi.updateQuantity(productId, quantity)
      set({ items: cart })
    } finally {
      set({ isUpdating: false })
    }
  },

  async removeItem(productId) {
    set({ isRemoving: true })

    try {
      const {
        data: { user },
      } = await getUser()

      if (!user) {
        removeGuestItem(productId)
        await get().load()
        return
      }

      const cart = await cartApi.removeItem(productId)
      set({ items: cart })
    } finally {
      set({ isRemoving: false })
    }
  },

  async clearCart() {
    set({ isClearing: true })

    try {
      const {
        data: { user },
      } = await getUser()

      if (!user) {
        clearGuestCart()
        set({ items: [] })
        return
      }

      await cartApi.clearCart()
      set({ items: [] })
    } finally {
      set({ isClearing: false })
    }
  },

  openCart() {
    set({ isOpen: true })
  },

  closeCart() {
    set({ isOpen: false })
  },

  toggleCart() {
    set((s) => ({ isOpen: !s.isOpen }))
  },

  getSubtotal() {
    return get().items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    )
  },

  getItemCount() {
    return get().items.reduce((sum, item) => sum + item.quantity, 0)
  },
}))
