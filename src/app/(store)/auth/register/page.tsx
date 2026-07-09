"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthCardLayout } from "@/components/auth/auth-card-layout"
import { PageLoader } from "@/components/ui/page-loader"
import { toast } from "sonner"
import { registerSchema } from "@/lib/validators"
import { supabase } from "@/lib/supabase"

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", password: "", confirmPassword: "",
  })
  const [loading, setLoading] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const validation = registerSchema.safeParse(form)
    if (!validation.success) {
      toast.error(validation.error.issues[0].message)
      return
    }
    setLoading(true)

    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          first_name: form.firstName,
          last_name: form.lastName,
        },
      },
    })

    setLoading(false)

    if (error) {
      toast.error(error.message)
      return
    }

    toast.success("حساب کاربری ساخته شد. ایمیل خود را بررسی کنید.")
    router.push("/auth/login")
  }

  if (loading) {
    return <PageLoader isLoading={true} />
  }

  return (
    <AuthCardLayout
      title="ایجاد حساب کاربری"
      subtitle="برای شروع خرید، عضو شوید"
      footerText="قبلاً حساب کاربری دارید؟"
      footerLinkText="ورود"
      footerLinkHref="/auth/login"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-sm font-bold text-neutral-700">
              نام
            </Label>
            <Input
              id="firstName"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              placeholder="علی"
              className="border-neutral-200 focus:border-green-400 focus:ring-green-200"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-sm font-bold text-neutral-700">
              نام خانوادگی
            </Label>
            <Input
              id="lastName"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              placeholder="محمدی"
              className="border-neutral-200 focus:border-green-400 focus:ring-green-200"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-bold text-neutral-700">
            ایمیل
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="example@email.com"
            value={form.email}
            onChange={handleChange}
            className="border-neutral-200 focus:border-green-400 focus:ring-green-200"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-bold text-neutral-700">
            رمز عبور
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            className="border-neutral-200 focus:border-green-400 focus:ring-green-200"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-sm font-bold text-neutral-700">
            تکرار رمز عبور
          </Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            className="border-neutral-200 focus:border-green-400 focus:ring-green-200"
            required
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-green-600 text-white transition-colors hover:bg-green-700"
          disabled={loading}
        >
          {loading ? "در حال ثبت..." : "ثبت‌نام"}
        </Button>
      </form>
    </AuthCardLayout>
  )
}
