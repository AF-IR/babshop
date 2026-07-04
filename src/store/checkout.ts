"use client"

import { create } from "zustand"

export type ShippingMethod =
  | "post"
  | "tipax"

interface CheckoutState {

  addressId: string | null

  shippingMethod: ShippingMethod | null

  paymentMethod: "zarinpal" | null

  notes: string

  setAddress(id: string) : void

  setShipping(method: ShippingMethod): void

  setPayment(method: "zarinpal"): void

  setNotes(notes: string): void

  reset(): void

}

export const useCheckoutStore = create<CheckoutState>((set)=>({

    addressId:null,

    shippingMethod:null,

    paymentMethod:"zarinpal",

    notes:"",

    setAddress:(id)=>set({addressId:id}),

    setShipping:(method)=>set({shippingMethod:method}),

    setPayment:(method)=>set({paymentMethod:method}),

    setNotes:(notes)=>set({notes}),

    reset:()=>set({

        addressId:null,

        shippingMethod:null,

        paymentMethod:"zarinpal",

        notes:""

    })

}))
