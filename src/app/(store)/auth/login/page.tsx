"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthCardLayout } from "@/components/auth/auth-card-layout"
import { PageLoader } from "@/components/ui/page-loader"
import { toast } from "sonner"
import { loginSchema } from "@/lib/validators"
import { supabase } from "@/lib/supabase"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const result = loginSchema.safeParse({ email, password })

    if (!result.success) {
      toast.error(result.error.issues[0].message)
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false)

    if (error) {
      toast.error(error.message)
      return
    }

    toast.success("خوش آمدید!")
    router.refresh()
    router.push("/account")
  }

  if (loading) {
    return <PageLoader isLoading={true} />
  }

  return (
    <AuthCardLayout
      title="خوش آمدید"
      subtitle="برای ادامه، وارد حساب کاربری خود شوید"
      footerText="حساب کاربری ندارید؟"
      footerLinkText="ثبت‌نام"
      footerLinkHref="/auth/register"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-bold text-neutral-700">
            ایمیل
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-neutral-200 focus:border-green-400 focus:ring-green-200"
            required
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-sm font-bold text-neutral-700">
              رمز عبور
            </Label>
            <Link
              href="/auth/forgot-password"
              className="text-xs text-green-600 transition-colors hover:text-green-700 hover:underline"
            >
              رمز را فراموش کرده‌اید؟
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-neutral-200 focus:border-green-400 focus:ring-green-200"
            required
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-green-600 text-white transition-colors hover:bg-green-700"
          disabled={loading}
        >
          {loading ? "در حال ورود..." : "ورود"}
        </Button>
      </form>
    </AuthCardLayout>
  )
}
