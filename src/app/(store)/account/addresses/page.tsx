"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/ui/page-header"
import { EmptyState } from "@/components/ui/empty-state"
import { PageLoader } from "@/components/ui/page-loader"
import { MapPin, Plus, Trash2 } from "lucide-react"
import { useAuthGuard } from "@/hooks/use-auth-guard"
import { toast } from "sonner"
import type { Address } from "@/types"
import {
  getAddresses,
  addAddress,
  removeAddress,
} from "@/lib/addresses"

export default function AddressesPage() {
  const { isReady } = useAuthGuard()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    firstName: "", lastName: "", line1: "", line2: "",
    city: "", state: "", postalCode: "", country: "US",
  })
  const [addresses, setAddresses] = useState<Address[]>([])

  
  // همه هوک‌ها قبل از return شرطی
  useEffect(() => {
    if (!isReady) return

    async function loadAddresses() {
      try {
        const data = await getAddresses()
        setAddresses(data)
      } catch (error) {
        console.error(error)
      }
    }

    loadAddresses()
  }, [isReady])

  // اسکرول به بالای صفحه بعد از رفرش (جلوگیری از رفتن به انتهای صفحه)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  // نمایش لودر تا زمانی که احراز هویت کامل نشده
  if (!isReady) {
    return <PageLoader isLoading={true} />
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()

    try {
      const newAddress = await addAddress({
        type: "shipping",
        firstName: form.firstName,
        lastName: form.lastName,
        line1: form.line1,
        line2: form.line2 || undefined,
        city: form.city,
        state: form.state,
        postalCode: form.postalCode,
        country: form.country,
        isDefault: addresses.length === 0,
      })

      setAddresses((prev) => [...prev, newAddress])

      toast.success("آدرس با موفقیت اضافه شد")

      setShowForm(false)

      setForm({
        firstName: "",
        lastName: "",
        line1: "",
        line2: "",
        city: "",
        state: "",
        postalCode: "",
        country: "US",
      })
    } catch (err) {
      console.error(err)
      toast.error("خطا در ذخیره آدرس")
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 font-[family-name:var(--font-vazir)]">
      <PageHeader title="آدرس‌های من">
        <Button onClick={() => setShowForm(!showForm)} className="bg-red-600 hover:bg-red-700 text-white">
          <Plus className="ml-2 h-4 w-4" />
          افزودن آدرس جدید
        </Button>
      </PageHeader>

      {showForm && (
        <Card className="mt-6 border-2 border-red-100 shadow-lg">
          <CardContent className="pt-6">
            <form onSubmit={handleAdd} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-neutral-700">نام</Label>
                  <Input
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    placeholder="مثال: علی"
                    className="border-neutral-300 focus:border-red-400 focus:ring-red-200"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-neutral-700">نام خانوادگی</Label>
                  <Input
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    placeholder="مثال: محمدی"
                    className="border-neutral-300 focus:border-red-400 focus:ring-red-200"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-bold text-neutral-700">آدرس</Label>
                <Input
                  name="line1"
                  value={form.line1}
                  onChange={handleChange}
                  placeholder="خیابان، پلاک، واحد"
                  className="border-neutral-300 focus:border-red-400 focus:ring-red-200"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-bold text-neutral-700">پلاک / واحد (اختیاری)</Label>
                <Input
                  name="line2"
                  value={form.line2}
                  onChange={handleChange}
                  placeholder="واحد، طبقه، شماره پلاک"
                  className="border-neutral-300 focus:border-red-400 focus:ring-red-200"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-neutral-700">شهر</Label>
                  <Input
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="تهران"
                    className="border-neutral-300 focus:border-red-400 focus:ring-red-200"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-neutral-700">استان</Label>
                  <Input
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    placeholder="تهران"
                    className="border-neutral-300 focus:border-red-400 focus:ring-red-200"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-neutral-700">کد پستی</Label>
                  <Input
                    name="postalCode"
                    value={form.postalCode}
                    onChange={handleChange}
                    placeholder="۱۲۳۴۵۶۷۸۹۰"
                    className="border-neutral-300 focus:border-red-400 focus:ring-red-200"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white px-6">
                  ذخیره آدرس
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  className="border-neutral-300 hover:bg-neutral-100"
                >
                  انصراف
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {addresses.length === 0 && !showForm && (
        <EmptyState
          icon={MapPin}
          title="هیچ آدرسی ثبت نشده"
          description="برای تسریع در فرآیند خرید، اولین آدرس خود را اضافه کنید."
        />
      )}

      {addresses.length > 0 && (
        <div className="mt-8 space-y-4">
          {addresses.map((addr) => (
            <Card key={addr.id} className="border border-neutral-200 hover:shadow-md transition-shadow">
              <CardContent className="flex items-start justify-between pt-6">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-base font-bold text-neutral-800">
                      {addr.firstName} {addr.lastName}
                    </p>
                    {addr.isDefault && (
                      <Badge className="bg-green-500 text-white text-xs px-2 py-0.5">پیش‌فرض</Badge>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-neutral-600 leading-relaxed">
                    {addr.line1}
                    {addr.line2 ? `، ${addr.line2}` : ""}
                    <br />
                    {addr.city}، {addr.state} {addr.postalCode}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={async () => {
                    try {
                      await removeAddress(addr.id)

                      setAddresses((prev) =>
                        prev.filter((a) => a.id !== addr.id)
                      )

                      toast.success("آدرس با موفقیت حذف شد")
                    } catch (err) {
                      console.error(err)
                      toast.error("خطا در حذف آدرس")
                    }
                  }}
                  aria-label="حذف آدرس"
                  className="text-neutral-400 hover:text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
