"use client"

import { create } from "zustand"

export type ShippingMethod =
  | "post"
  | "tipax"

export interface CheckoutAddress {
  id: string
  type: string
  firstName: string
  lastName: string
  line1: string
  line2?: string
  city: string
  state: string
  postalCode: string
  country: string
  phone?: string
  isDefault?: boolean
}

interface CheckoutStore {
  selectedAddress: CheckoutAddress | null
  shippingMethod: ShippingMethod | null
  shippingPrice: number
  paymentMethod: string | null
  notes: string
  currentStep: number

  setCurrentStep(step: number): void
  setAddress(address: CheckoutAddress): void
  setShipping(method: ShippingMethod, price: number): void
  setPayment(method: string): void
  setNotes(notes: string): void
  reset(): void
}

export const useCheckoutStore = create<CheckoutStore>((set) => ({
  selectedAddress: null,
  shippingMethod: null,
  shippingPrice: 0,
  paymentMethod: null,
  notes: "",
  currentStep: 1,

  setCurrentStep(step) {
    set({ currentStep: step })
  },

  setAddress(address) {
    set({ selectedAddress: address })
  },

  setShipping(method, price) {
    set({ shippingMethod: method, shippingPrice: price })
  },

  setPayment(method) {
    set({ paymentMethod: method })
  },

  setNotes(notes) {
    set({ notes })
  },

  reset() {
    set({
      selectedAddress: null,
      shippingMethod: null,
      shippingPrice: 0,
      paymentMethod: null,
      notes: "",
      currentStep: 1,
    })
  },
}))
