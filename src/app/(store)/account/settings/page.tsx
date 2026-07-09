"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/ui/page-header"
import { PageLoader } from "@/components/ui/page-loader"
import { useAuthGuard } from "@/hooks/use-auth-guard"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function SettingsPage() {
  const { user, isReady } = useAuthGuard()
  const router = useRouter()

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName)
      setLastName(user.lastName)
      setEmail(user.email)
    }
  }, [user])

  // اسکرول به بالای صفحه بعد از رفرش
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  // نمایش لودر تا زمانی که احراز هویت کامل نشده
  if (!isReady) {
    return <PageLoader isLoading={true} />
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()

    const { error } = await supabase.auth.updateUser({
      email,
      data: {
        firstName,
        lastName,
      },
    })

    if (error) {
      toast.error(error.message)
      return
    }

    toast.success("پروفایل با موفقیت به‌روزرسانی شد")
    router.refresh()
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      toast.error("رمز عبور جدید با تکرار آن مطابقت ندارد")
      return
    }

    if (newPassword.length < 6) {
      toast.error("رمز عبور باید حداقل ۶ کاراکتر باشد")
      return
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (error) {
      toast.error(error.message)
      return
    }

    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")

    toast.success("رمز عبور با موفقیت تغییر کرد")
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 font-[family-name:var(--font-vazir)]">
      <PageHeader title="تنظیمات حساب کاربری" />

      <Card className="mt-8 border border-neutral-200 hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-neutral-800">اطلاعات پروفایل</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-bold text-neutral-700">نام</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="border-neutral-300 focus:border-red-400 focus:ring-red-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-bold text-neutral-700">نام خانوادگی</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="border-neutral-300 focus:border-red-400 focus:ring-red-200"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-bold text-neutral-700">ایمیل</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-neutral-300 focus:border-red-400 focus:ring-red-200"
              />
            </div>
            <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white">
              ذخیره تغییرات
            </Button>
          </form>
        </CardContent>
      </Card>

      <Separator className="my-8" />

      <Card className="border border-neutral-200 hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-neutral-800">تغییر رمز عبور</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword" className="text-sm font-bold text-neutral-700">رمز عبور فعلی</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="border-neutral-300 focus:border-red-400 focus:ring-red-200"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-sm font-bold text-neutral-700">رمز عبور جدید</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="border-neutral-300 focus:border-red-400 focus:ring-red-200"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-bold text-neutral-700">تکرار رمز عبور جدید</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="border-neutral-300 focus:border-red-400 focus:ring-red-200"
              />
            </div>
            <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white">
              تغییر رمز عبور
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
