//import { mergeGuestCart } from "@/lib/cart"
//import { useCartStore } from "@/store/cart"

export interface GuestItem {
  variantId: string
  productId: string
  quantity: number
  productName?: string
  variantName?: string
  imageUrl?: string
  imageAlt?: string
  slug?: string
  price?: number
  currency?: string
}

export function getGuestCart(): GuestItem[] {
  if (typeof window === "undefined") return []
  try {
    return JSON.parse(localStorage.getItem("guest_cart") || "[]")
  } catch {
    return []
  }
}

export function saveGuestItem(item: GuestItem) {
  if (typeof window === "undefined") return

  const current = getGuestCart()

  const exists = current.find((i) => i.variantId === item.variantId)

  let updated: GuestItem[]
  if (exists) {
    updated = current.map((i) =>
      i.variantId === item.variantId
        ? { ...i, quantity: i.quantity + (item.quantity ?? 1) }
        : i
    )
  } else {
    updated = [...current, { ...item, quantity: item.quantity ?? 1 }]
  }

  try {
    localStorage.setItem("guest_cart", JSON.stringify(updated))
  } catch (e) {
    console.error("saveGuestItem error:", e)
  }
}

export function clearGuestCart() {
  if (typeof window === "undefined") return
  try {
    localStorage.removeItem("guest_cart")
  } catch (e) {
    console.error("clearGuestCart error:", e)
  }
}

// ===== FIX: only clear guest cart on success =====
export async function mergeCartOnLogin() {
  const guest = getGuestCart()
  if (!guest.length) return

  try {
    const merged = await mergeGuestCart(guest)
    useCartStore.setState({ items: merged })
    // Clear only after successful merge
    clearGuestCart()
  } catch (err) {
    console.error("mergeCartOnLogin error:", err)
    // Do NOT clear guest cart on error
  }
}
