"use client"

import { create } from "zustand"
import * as cartApi from "@/lib/cart"
import type { CartItem } from "@/types"
import {
  getGuestCart,
  saveGuestItem,
  clearGuestCart,
} from "@/lib/cart-merge"

interface CartState {
  items: CartItem[]

  isLoading: boolean
  isAdding: boolean

  isOpen: boolean

  load: () => Promise<void>

  addItem: (item: {
    productId: string
    quantity?: number

    productName?: string
    imageUrl?: string
    imageAlt?: string
    slug?: string
    price?: number
  }) => Promise<void>

  removeItem: (productId: string) => Promise<void>

  updateQuantity: (
    productId: string,
    quantity: number
  ) => Promise<void>

  clearCart: () => Promise<void>

  openCart: () => void
  closeCart: () => void
  toggleCart: () => void

  getSubtotal: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  isLoading: false,
  isAdding: false,

  isOpen: false,

  async load() {
    set({ isLoading: true })

    try {
      const serverItems = await cartApi.getCart()

      if (serverItems.length > 0) {
        set({
          items: serverItems,
          isLoading: false,
        })
        return
      }

      const guest = getGuestCart()

      const guestItems: CartItem[] = guest.map((g) => ({
        id: crypto.randomUUID(),

        productId: g.productId,

        variantId: g.productId,

        quantity: g.quantity,

        name: g.productName ?? "",

        variantName: "",

        image: {
          url: g.imageUrl ?? "",
          alt: g.imageAlt ?? "",
        },

        slug: g.slug ?? "",

        price: g.price ?? 0,

        lineTotal: (g.price ?? 0) * g.quantity,
      }))

      set({
        items: guestItems,
        isLoading: false,
      })
    } catch (err) {
      console.error(err)

      set({
        isLoading: false,
      })
    }
  },

  async addItem(item) {
    set({ isAdding: true })

    try {
      const items = await cartApi.addItem({
        productId: item.productId,
        quantity: item.quantity ?? 1,
      })

      set({
        items,
        isAdding: false,
      })
    } catch (err: any) {
      if (err.message === "NOT_AUTHENTICATED") {
        saveGuestItem({
          productId: item.productId,
          variantId: item.productId,
          quantity: item.quantity ?? 1,
          productName: item.productName,
          imageUrl: item.imageUrl,
          imageAlt: item.imageAlt,
          slug: item.slug,
          price: item.price,
        })

        await get().load()

        set({
          isAdding: false,
        })

        return
      }

      console.error(err)

      set({
        isAdding: false,
      })
    }
  },

  async removeItem(productId) {
    const items = await cartApi.removeItem(productId)

    set({
      items,
    })
  },

  async updateQuantity(productId, quantity) {
    const items = await cartApi.updateQuantity(
      productId,
      quantity
    )

    set({
      items,
    })
  },

  async clearCart() {
    await cartApi.clearCart()

    clearGuestCart()

    set({
      items: [],
    })
  },

  openCart() {
    set({
      isOpen: true,
    })
  },

  closeCart() {
    set({
      isOpen: false,
    })
  },

  toggleCart() {
    set((state) => ({
      isOpen: !state.isOpen,
    }))
  },

  getSubtotal() {
    return get().items.reduce(
      (sum, item) => sum + item.lineTotal,
      0
    )
  },

  getItemCount() {
    return get().items.reduce(
      (sum, item) => sum + item.quantity,
      0
    )
  },
}))
