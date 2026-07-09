import { Truck, RotateCcw, Shield } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import { siteConfig } from "@/lib/config"

export function TrustSignals() {
  return (
    <div className="space-y-3 font-[family-name:var(--font-vazir)]">
      <div className="flex items-center gap-3 text-sm">
        <Truck className="h-4 w-4 text-green-600" />
        <span className="text-neutral-700">
          ارسال رایگان برای سفارش‌های بالای {formatPrice(siteConfig.freeShippingThreshold)}
        </span>
      </div>
      <div className="flex items-center gap-3 text-sm">
        <RotateCcw className="h-4 w-4 text-green-600" />
        <span className="text-neutral-700">بازگشت کالا تا ۳۰ روز بدون دردسر</span>
      </div>
      <div className="flex items-center gap-3 text-sm">
        <Shield className="h-4 w-4 text-green-600" />
        <span className="text-neutral-700">پرداخت امن</span>
      </div>
    </div>
  )
}
