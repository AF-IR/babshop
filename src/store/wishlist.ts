"use client"

import { create } from "zustand"
import type { Product } from "@/types"
import {
  getFavorites,
  addFavorite,
  removeFavorite,
} from "@/lib/favorites"

interface WishlistState {
  items: Product[]

  load: () => Promise<void>

  addItem: (product: Product) => Promise<void>

  removeItem: (productId: string) => Promise<void>

  hasItem: (productId: string) => boolean
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  items: [],

  load: async () => {
    try {
      const items = await getFavorites()
      set({ items })
    } catch (err) {
      console.error(err)
    }
  },

  addItem: async (product) => {
    try {
      await addFavorite(product)

      set((state) => {
        if (state.items.some((p) => p.id === product.id)) {
          return state
        }

        return {
          items: [...state.items, product],
        }
      })
    } catch (err) {
      console.error(err)
      throw err
    }
  },

  removeItem: async (productId) => {
    try {
      await removeFavorite(productId)

      set((state) => ({
        items: state.items.filter((p) => p.id !== productId),
      }))
    } catch (err) {
      console.error(err)
      throw err
    }
  },

  hasItem: (productId) => {
    return get().items.some((p) => p.id === productId)
  },
}))
