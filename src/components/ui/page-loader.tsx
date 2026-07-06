"use client"

import { siteConfig } from "@/lib/config"

export function PageLoader({ isLoading }: { isLoading: boolean }) {
  if (!isLoading) return null

  return (
    // لایه پس‌زمینه که سایت را تار و خاکستری می‌کند
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity">
      
      // مستطیل سفید رنگ وسط صفحه
      <div className="flex flex-col items-center justify-center rounded-2xl bg-white px-10 py-8 shadow-2xl">
        
        {/* لوگو یا نام سایت شما */}
        <h2 className="mb-6 text-2xl font-bold text-red-600 tracking-tighter">
          {siteConfig.name}
        </h2>
        
        {/* انیمیشن 3 نقطه (Dots Animation) مشابه ایده دیجی‌کالا */}
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 animate-bounce rounded-full bg-red-500" style={{ animationDelay: "0ms" }}></div>
          <div className="h-3 w-3 animate-bounce rounded-full bg-red-500" style={{ animationDelay: "150ms" }}></div>
          <div className="h-3 w-3 animate-bounce rounded-full bg-red-500" style={{ animationDelay: "300ms" }}></div>
        </div>
        
        <p className="mt-4 text-sm text-neutral-500">درحال بارگذاری...</p>
      </div>
    </div>
  )
}
