"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { ChevronDown } from "lucide-react"

const sortOptions = [
  { value: "newest", label: "جدیدترین" },
  { value: "price-asc", label: "قیمت: کم به زیاد" },
  { value: "price-desc", label: "قیمت: زیاد به کم" },
  { value: "name", label: "نام: الف تا ی" },
]

interface SortDropdownProps {
  currentSort: string
}

export function SortDropdown({ currentSort }: SortDropdownProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value
    const params = new URLSearchParams(searchParams.toString())
    if (value === "newest") {
      params.delete("sort")
    } else {
      params.set("sort", value)
    }
    params.delete("page")
    const query = params.toString()
    router.push(query ? `/shop?${query}` : "/shop")
  }

  return (
    <div className="relative font-[family-name:var(--font-vazir)]">
      <select
        value={currentSort}
        onChange={handleChange}
        aria-label="مرتب‌سازی محصولات"
        className="appearance-none rounded-md border border-neutral-200 bg-white py-2 pl-3 pr-8 text-sm text-neutral-700 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
    </div>
  )
}
