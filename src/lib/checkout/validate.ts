import { getUser } from "@/lib/auth"

export async function requireUser() {

  const {
    data: { user },
  } = await getUser()

  if (!user)
    throw new Error("NOT_AUTHENTICATED")

  return user

}

export function validateCheckoutInput(data: {

  addressId: string

  shippingMethod: string

  paymentMethod: string

}) {

  if (!data.addressId)
    throw new Error("ADDRESS_REQUIRED")

  if (!data.shippingMethod)
    throw new Error("SHIPPING_REQUIRED")

  if (!data.paymentMethod)
    throw new Error("PAYMENT_REQUIRED")

}
