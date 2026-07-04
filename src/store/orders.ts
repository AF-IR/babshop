"use client"

import { create } from "zustand"
import type { OrderStatus, PaymentStatus, ProductImage } from "@/types"

export interface OrderItem {
  product_id: string
  quantity: number
  unit_price: number
  total_price: number
  product_title: string
  product_image?: ProductImage
}

export interface OrderData {
  id: string
  order_number: string
  status: OrderStatus
  payment_status: PaymentStatus
  total: number
  created_at: string
  items?: OrderItem[]
}

interface OrdersStore {
  orders: OrderData[]
  setOrders: (orders: OrderData[]) => void
  addOrder: (order: OrderData) => void
  clearOrders: () => void
}

export const useOrdersStore = create<OrdersStore>((set) => ({
  orders: [],
  setOrders: (orders) => set({ orders }),
  addOrder: (order) =>
    set((state) => ({
      orders: [order, ...state.orders],
    })),
  clearOrders: () => set({ orders: [] }),
}))
