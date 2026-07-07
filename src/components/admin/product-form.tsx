"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function ProductForm() {

  const router = useRouter()

  const [loading,setLoading]=useState(false)

  const [form,setForm]=useState({

    title:"",

    slug:"",

    description:"",

    image:"",

    price:0,

    stock:0,

    category:"",

    published:true,

  })

  function update(

    key:string,

    value:any

  ){

    setForm({

      ...form,

      [key]:value,

    })

  }

  async function submit(){

    try{

      setLoading(true)

      const res=await fetch(

        "/api/admin/products",

        {

          method:"POST",

          headers:{

            "Content-Type":"application/json"

          },

          body:JSON.stringify(form)

        }

      )

      const json=await res.json()

      if(!res.ok){

        throw new Error(

          json.error ??

          "خطا"

        )

      }

      router.push("/admin/products")

      router.refresh()

    }

    catch(e){

      alert(

        e instanceof Error

        ?e.message

        :"خطا"

      )

    }

    finally{

      setLoading(false)

    }

  }

  return(

    <div className="space-y-5">

      <input

        className="w-full border rounded p-3"

        placeholder="عنوان"

        value={form.title}

        onChange={e=>update("title",e.target.value)}

      />

      <input

        className="w-full border rounded p-3"

        placeholder="Slug"

        value={form.slug}

        onChange={e=>update("slug",e.target.value)}

      />

      <textarea

        className="w-full border rounded p-3"

        rows={5}

        placeholder="توضیحات"

        value={form.description}

        onChange={e=>update("description",e.target.value)}

      />

      <input

        className="w-full border rounded p-3"

        placeholder="لینک تصویر"

        value={form.image}

        onChange={e=>update("image",e.target.value)}

      />

      <input

        className="w-full border rounded p-3"

        type="number"

        placeholder="قیمت"

        value={form.price}

        onChange={e=>update("price",Number(e.target.value))}

      />

      <input

        className="w-full border rounded p-3"

        type="number"

        placeholder="موجودی"

        value={form.stock}

        onChange={e=>update("stock",Number(e.target.value))}

      />

      <input

        className="w-full border rounded p-3"

        placeholder="دسته"

        value={form.category}

        onChange={e=>update("category",e.target.value)}

      />

      <label className="flex gap-3">

        <input

          type="checkbox"

          checked={form.published}

          onChange={e=>update(

            "published",

            e.target.checked

          )}

        />

        فعال

      </label>

      <button

        onClick={submit}

        disabled={loading}

        className="rounded bg-black text-white px-6 py-3"

      >

        {

          loading

          ?"درحال ثبت..."

          :"ثبت محصول"

        }

      </button>

    </div>

  )

}
