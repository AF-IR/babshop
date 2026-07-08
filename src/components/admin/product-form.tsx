"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { createProduct } from "@/lib/admin/products-client"
import { getCategories } from "@/lib/admin/categories-client"
import { getBrands } from "@/lib/admin/brands-client"

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

  const [body, setBody] =
    useState("")

  const [image, setImage] =
    useState("")

  const [price, setPrice] =
    useState(0)

  const [stock, setStock] =
    useState(0)

  const [weight, setWeight] =
    useState(0)

  const [categoryId, setCategoryId] =
    useState("")

  const [brandId, setBrandId] =
    useState("")

  const [featured, setFeatured] =
    useState(false)

  const [published, setPublished] =
    useState(true)

  const [tags, setTags] =
    useState("")

  const [categories, setCategories] =
    useState<any[]>([])

  const [brands, setBrands] =
    useState<any[]>([])

  useEffect(() => {

    loadLists()

  }, [])

  async function loadLists() {

    try {

      const categoriesResult =
        await getCategories()

      setCategories(
        categoriesResult.data ?? []
      )

      const brandsResult =
        await getBrands()

      setBrands(
        brandsResult.data ?? []
      )

    } catch (error) {

      console.error(error)

    }

  }

  async function submit() {

    setLoading(true)

    try {

      await createProduct({

        title,

        slug,

        description,

        body,

        image,

        price,

        stock,

        weight,

        category_id:
          categoryId || null,

        brand_id:
          brandId || null,

        featured,

        published,

        tags:
          tags
            .split(",")
            .map(x => x.trim())
            .filter(Boolean),

      })

      router.push(
        "/admin/products"
      )

    } finally {

      setLoading(false)

    }

  }

  return (

    <div className="space-y-5 max-w-3xl">

      <input
        className="w-full rounded border p-3"
        placeholder="عنوان محصول"
        value={title}
        onChange={e =>
          setTitle(e.target.value)
        }
      />

      <input
        className="w-full rounded border p-3"
        placeholder="Slug"
        value={slug}
        onChange={e =>
          setSlug(e.target.value)
        }
      />

      <textarea
        className="w-full rounded border p-3"
        placeholder="توضیح کوتاه"
        value={description}
        onChange={e =>
          setDescription(e.target.value)
        }
      />

      <textarea
        className="w-full rounded border p-3 min-h-40"
        placeholder="توضیحات کامل محصول"
        value={body}
        onChange={e =>
          setBody(e.target.value)
        }
      />

      <input
        className="w-full rounded border p-3"
        placeholder="لینک تصویر"
        value={image}
        onChange={e =>
          setImage(e.target.value)
        }
      />

      <input
        type="number"
        className="w-full rounded border p-3"
        placeholder="قیمت"
        value={price}
        onChange={e =>
          setPrice(
            Number(e.target.value)
          )
        }
      />

      <input
        type="number"
        className="w-full rounded border p-3"
        placeholder="موجودی انبار"
        value={stock}
        onChange={e =>
          setStock(
            Number(e.target.value)
          )
        }
      />

      <input
        type="number"
        className="w-full rounded border p-3"
        placeholder="وزن (گرم)"
        value={weight}
        onChange={e =>
          setWeight(
            Number(e.target.value)
          )
        }
      />

      <select
        className="w-full rounded border p-3"
        value={categoryId}
        onChange={e =>
          setCategoryId(
            e.target.value
          )
        }
      >
        <option value="">
          انتخاب دسته بندی
        </option>

        {categories.map(category => (

          <option
            key={category.id}
            value={category.id}
          >
            {category.name}
          </option>

        ))}
      </select>

      <select
        className="w-full rounded border p-3"
        value={brandId}
        onChange={e =>
          setBrandId(
            e.target.value
          )
        }
      >
        <option value="">
          انتخاب برند
        </option>

        {brands.map(brand => (

          <option
            key={brand.id}
            value={brand.id}
          >
            {brand.name}
          </option>

        ))}
      </select>

      <input
        className="w-full rounded border p-3"
        placeholder="تگ ها (با کاما جدا شوند)"
        value={tags}
        onChange={e =>
          setTags(e.target.value)
        }
      />

      <label className="flex items-center gap-2">

        <input
          type="checkbox"
          checked={featured}
          onChange={e =>
            setFeatured(
              e.target.checked
            )
          }
        />

        محصول ویژه

      </label>

      <label className="flex items-center gap-2">

        <input
          type="checkbox"
          checked={published}
          onChange={e =>
            setPublished(
              e.target.checked
            )
          }
        />

        منتشر شود

      </label>

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
