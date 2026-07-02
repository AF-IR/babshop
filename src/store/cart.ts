"use client"

import { create } from "zustand"
import { v4 as uuidv4 } from "uuid"
import type { CartItem } from "@/types"
import * as cartApi from "@/lib/cart"
import {
  getGuestCart,
  saveGuestItem as saveGuest,
  clearGuestCart,
} from "@/lib/cart-merge"

// Extended CartItem with optional currency
export interface ExtendedCartItem extends CartItem {
  currency?: string
}

interface CartState {
  items: ExtendedCartItem[]
  isOpen: boolean
  isAdding: boolean
  isRemoving: boolean
  isUpdating: boolean
  isClearing: boolean
  isLoading: boolean
  _requestId: number

  load: () => Promise<void>

  addItem: (item: {
    variantId: string
    productId: string
    quantity?: number
    productName?: string
    variantName?: string
    imageUrl?: string
    imageAlt?: string
    slug?: string
    price?: number
    currency?: string
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
  isAdding: false,
  isRemoving: false,
  isUpdating: false,
  isClearing: false,
  isLoading: false,
  _requestId: 0,

  load: async () => {
    set({ isLoading: true })
    try {
      const items = await cartApi.getCart()
      if (!items || items.length === 0) {
        const guest = getGuestCart()
        if (guest.length > 0) {
          const guestItems: ExtendedCartItem[] = guest.map((g) => ({
            id: uuidv4(),
            variantId: g.variantId,
            productId: g.productId,
            quantity: g.quantity,
            name: g.productName || "",
            variantName: g.variantName || "",
            image: { url: g.imageUrl || "", alt: g.imageAlt || "" },
            slug: g.slug || "",
            price: g.price || 0,
            lineTotal: (g.price || 0) * g.quantity,
            currency: g.currency || "USD",
          }))
          set({ items: guestItems, isLoading: false })
          return
        }
      }
      set({ items: items ?? [], isLoading: false })
    } catch (err) {
      console.error("cart load error:", err)
      // FIX: do NOT reset items, keep existing state
      set({ isLoading: false })
    }
  },

  addItem: async (item) => {
    const currentRequestId = get()._requestId + 1
    set({ _requestId: currentRequestId, isAdding: true })

    const currentItems = get().items
    const existingIndex = currentItems.findIndex(
      (i) => i.variantId === item.variantId
    )

    const optimisticItem: ExtendedCartItem = {
      id: uuidv4(),
      variantId: item.variantId,
      productId: item.productId,
      quantity: item.quantity ?? 1,
      name: item.productName || "",
      variantName: item.variantName || "",
      image: { url: item.imageUrl || "", alt: item.imageAlt || "" },
      slug: item.slug || "",
      price: item.price || 0,
      lineTotal: (item.price || 0) * (item.quantity ?? 1),
      currency: item.currency || "USD",
    }

    let newItems: ExtendedCartItem[]
    if (existingIndex >= 0) {
      newItems = currentItems.map((i, idx) =>
        idx === existingIndex
          ? {
              ...i,
              quantity: i.quantity + (item.quantity ?? 1),
              lineTotal: i.price * (i.quantity + (item.quantity ?? 1)),
            }
          : i
      )
    } else {
      newItems = [...currentItems, optimisticItem]
    }

    set({ items: newItems })

    try {
      const serverItems = await cartApi.addItem({
        variantId: item.variantId,
        productId: item.productId,
        quantity: item.quantity ?? 1,
      })

      // Only update if this request is still the latest
      if (get()._requestId === currentRequestId) {
        set({
          items: serverItems?.length ? serverItems : currentItems,
          isAdding: false,
        })
      } else {
        set({ isAdding: false })
      }
    } catch (err: any) {
      if (err?.message === "NOT_AUTHENTICATED") {
        saveGuest({
          variantId: item.variantId,
          productId: item.productId,
          quantity: item.quantity ?? 1,
          productName: item.productName,
          variantName: item.variantName,
          imageUrl: item.imageUrl,
          imageAlt: item.imageAlt,
          slug: item.slug,
          price: item.price,
          currency: item.currency,
        })
        set({ isAdding: false })
        throw err // Let component handle toast
      }

      // Rollback only if this request is still the latest
      if (get()._requestId === currentRequestId) {
        set({ items: currentItems, isAdding: false })
      } else {
        set({ isAdding: false })
      }
      console.error("addItem error:", err)
      throw err
    }
  },

  removeItem: async (variantId) => {
    const currentRequestId = get()._requestId + 1
    set({ _requestId: currentRequestId, isRemoving: true })

    const currentItems = get().items
    // Optimistic: remove from UI
    set({ items: currentItems.filter((i) => i.variantId !== variantId) })

    try {
      const serverItems = await cartApi.removeItem(variantId)
      if (get()._requestId === currentRequestId) {
        set({
          items: serverItems?.length ? serverItems : currentItems,
          isRemoving: false,
        })
      } else {
        set({ isRemoving: false })
      }
    } catch (err) {
      // Rollback only this item
      if (get()._requestId === currentRequestId) {
        set({ items: currentItems, isRemoving: false })
      } else {
        set({ isRemoving: false })
      }
      console.error("removeItem error:", err)
      throw err
    }
  },

  updateQuantity: async (variantId, quantity) => {
    const currentRequestId = get()._requestId + 1
    set({ _requestId: currentRequestId, isUpdating: true })

    const currentItems = get().items
    // Optimistic: update quantity locally
    const updatedItems = currentItems.map((i) =>
      i.variantId === variantId
        ? { ...i, quantity, lineTotal: i.price * quantity }
        : i
    )
    set({ items: updatedItems })

    try {
      const serverItems = await cartApi.updateQuantity(variantId, quantity)
      if (get()._requestId === currentRequestId) {
        set({
          items: serverItems?.length ? serverItems : currentItems,
          isUpdating: false,
        })
      } else {
        set({ isUpdating: false })
      }
    } catch (err) {
      if (get()._requestId === currentRequestId) {
        set({ items: currentItems, isUpdating: false })
      } else {
        set({ isUpdating: false })
      }
      console.error("updateQuantity error:", err)
      throw err
    }
  },

  clearCart: async () => {
    const currentRequestId = get()._requestId + 1
    set({ _requestId: currentRequestId, isClearing: true })

    const currentItems = get().items
    set({ items: [] }) // Optimistic

    try {
      await cartApi.clearCart()
      if (get()._requestId === currentRequestId) {
        set({ items: [], isClearing: false })
      } else {
        set({ isClearing: false })
      }
    } catch (err) {
      if (get()._requestId === currentRequestId) {
        set({ items: currentItems, isClearing: false })
      } else {
        set({ isClearing: false })
      }
      console.error("clearCart error:", err)
      throw err
    }
  },

  toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),

  getSubtotal: () =>
    get().items.reduce((s, i) => s + i.lineTotal, 0),

  getItemCount: () =>
    get().items.reduce((s, i) => s + i.quantity, 0),
}))
