"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/ui/page-header"
import { Package, MapPin, Settings, Heart, LogOut } from "lucide-react"
import { useAuthGuard } from "@/hooks/use-auth-guard"
import { useAuthStore } from "@/store/auth"

const accountLinks = [
  { name: "سفارش‌ها", description: "مشاهده تاریخچه سفارش‌ها و پیگیری وضعیت ارسال", href: "/account/orders", icon: Package },
  { name: "آدرس‌ها", description: "مدیریت آدرس‌های حمل و نقل و صورتحساب", href: "/account/addresses", icon: MapPin },
  { name: "علاقه‌مندی‌ها", description: "محصولاتی که برای بعد ذخیره کرده‌اید", href: "/wishlist", icon: Heart },
  { name: "تنظیمات", description: "به‌روزرسانی پروفایل و تنظیمات کاربری", href: "/account/settings", icon: Settings },
]

export default function AccountPage() {
  const { user, isReady } = useAuthGuard()
  const logout = useAuthStore((s) => s.logout)
  const router = useRouter()

  if (!isReady) return null

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 font-[family-name:var(--font-vazir)]">
      <PageHeader title="حساب کاربری" description={`خوش آمدید، ${user?.firstName}!`}>
        <Button
          variant="outline"
          onClick={async () => {
            await logout()
            router.refresh()
            router.push("/")
          }}
        >
          <LogOut className="ml-2 h-4 w-4" />
          خروج از حساب
        </Button>
      </PageHeader>

      
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {accountLinks.map((item) => (
          <Link key={item.name} href={item.href}>
            <Card className="h-full transition-shadow hover:shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <item.icon className="h-5 w-5 text-muted-foreground" />
                  {item.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
