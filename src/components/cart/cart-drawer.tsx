"use client"

import Link from "next/link"
import { ShoppingBag, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { CartItem } from "./cart-item"
import { CartSummary } from "./cart-summary"
import { useCartStore } from "@/store/cart"
import { formatPrice } from "@/lib/utils"

export function CartDrawer() {
  const items = useCartStore((s) => s.items)
  const isOpen = useCartStore((s) => s.isOpen)
  const closeCart = useCartStore((s) => s.closeCart)
  const getSubtotal = useCartStore((s) => s.getSubtotal)

  const subtotal = getSubtotal()

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent side="right" className="flex !w-full flex-col !gap-0 sm:!w-3/4 sm:max-w-md p-0" showCloseButton={false}>
        <SheetHeader className="px-4 pt-4">
          <div className="flex items-center justify-between">
            <button
              onClick={closeCart}
              className="text-sm text-muted-foreground hover:text-foreground sm:hidden"
            >
              &larr; بازگشت
            </button>
            <button
              onClick={closeCart}
              className="hidden rounded-md p-1 text-muted-foreground hover:text-foreground sm:block sm:ml-auto"
              aria-label="بستن سبد خرید"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <SheetTitle className="mt-2 text-2xl font-bold tracking-tight text-neutral-800">
            سبد خرید ({items.length} {items.length === 1 ? "کالا" : "کالا"})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center text-center px-4">
            <ShoppingBag className="h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-sm font-medium text-neutral-700">سبد خرید شما خالی است</p>
            <p className="mt-1 text-xs text-muted-foreground">
              برای شروع، کالاها را اضافه کنید
            </p>
            <Button className="mt-6 bg-green-600 hover:bg-green-700 text-white" onClick={closeCart} asChild>
              <Link href="/shop">ادامه خرید</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-4">
              <div className="divide-y">
                {items.map((item) => (
                  <CartItem key={item.variantId} item={item} />
                ))}
              </div>
            </div>

            <SheetFooter className="!mt-0 shrink-0 border-t !px-4 !pt-4 !pb-8 bg-neutral-50">
              <div className="w-full space-y-3">
                <div className="flex justify-between text-sm font-medium text-neutral-700">
                  <span>جمع کل</span>
                  <span className="font-bold text-green-700">{formatPrice(subtotal)}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  هزینه ارسال و مالیات در مرحله تسویه حساب محاسبه می‌شود.
                </p>
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white" size="lg" asChild onClick={closeCart}>
                  <Link href="/checkout">تسویه حساب</Link>
                </Button>
                <button
                  className="mb-4 w-full py-2 text-center text-sm text-muted-foreground underline hover:text-foreground sm:mb-0 sm:hidden"
                  onClick={closeCart}
                >
                  ادامه خرید
                </button>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
