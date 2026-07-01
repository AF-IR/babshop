"use client"

import { create } from "zustand"
import {
  getFavorites,
  addFavorite,
  removeFavorite,
} from "@/lib/favorites"

interface WishlistState {
  items: string[]

  load: () => Promise<void>

  addItem: (productId: string) => Promise<void>

  removeItem: (productId: string) => Promise<void>

  hasItem: (productId: string) => boolean
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  items: [],

  load: async () => {
    const ids = await getFavorites()

    set({
      items: ids,
    })
  },

  addItem: async (productId) => {
    await addFavorite(productId)

    set((state) => ({
      items: [...new Set([...state.items, productId])],
    }))
  },

  removeItem: async (productId) => {
    await removeFavorite(productId)

    set((state) => ({
      items: state.items.filter((id) => id !== productId),
    }))
  },

  hasItem: (productId) => {
    return get().items.includes(productId)
  },
}))
