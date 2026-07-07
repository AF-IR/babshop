"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import {

  createProduct,

} from "@/lib/admin/products-client"

export default function ProductForm() {

  const router = useRouter()

  const [loading, setLoading] =
    useState(false)

  const [title, setTitle] =
    useState("")

  const [slug, setSlug] =
    useState("")

  const [description, setDescription] =
    useState("")

  const [image, setImage] =
    useState("")

  const [price, setPrice] =
    useState(0)

  const [stock, setStock] =
    useState(0)

  async function submit() {

    setLoading(true)

    try {

      await createProduct({

        title,

        slug,

        description,

        image,

        price,

        stock,

        published: true,

      })

      router.push("/admin/products")

    }

    finally {

      setLoading(false)

    }

  }

  return (

    <div className="space-y-5 max-w-3xl">

      <input

        className="w-full rounded border p-3"

        placeholder="عنوان"

        value={title}

        onChange={e=>setTitle(e.target.value)}

      />

      <input

        className="w-full rounded border p-3"

        placeholder="Slug"

        value={slug}

        onChange={e=>setSlug(e.target.value)}

      />

      <textarea

        className="w-full rounded border p-3"

        placeholder="توضیحات"

        value={description}

        onChange={e=>setDescription(e.target.value)}

      />

      <input

        className="w-full rounded border p-3"

        placeholder="لینک تصویر"

        value={image}

        onChange={e=>setImage(e.target.value)}

      />

      <input

        type="number"

        className="w-full rounded border p-3"

        placeholder="قیمت"

        value={price}

        onChange={e=>setPrice(Number(e.target.value))}

      />

      <input

        type="number"

        className="w-full rounded border p-3"

        placeholder="موجودی"

        value={stock}

        onChange={e=>setStock(Number(e.target.value))}

      />

      <button

        disabled={loading}

        onClick={submit}

        className="rounded bg-black px-6 py-3 text-white"

      >

        {loading

          ? "در حال ذخیره..."

          : "ثبت محصول"}

      </button>

    </div>

  )

}
