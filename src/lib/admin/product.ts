import { supabaseAdmin } from "@/lib/admin"
import { CreateProductInput } from "./products"

//---------------------------------------------
// دریافت یک محصول
//---------------------------------------------

export async function getProduct(id: string) {

  const { data, error } =
    await supabaseAdmin
      .from("products")
      .select("*")
      .eq("id", id)
      .single()

  if (error) throw error

  return data

}

//---------------------------------------------
// ویرایش
//---------------------------------------------

export async function updateProduct(

  id: string,

  input: CreateProductInput

) {

  const { data, error } =
    await supabaseAdmin
      .from("products")
      .update({

        title: input.title,

        slug: input.slug,

        description: input.description,

        body: input.body,

        image: input.image,

        price: input.price,

        stock: input.stock,

        category_id: input.category_id,

        brand_id: input.brand_id,

        featured: input.featured,

        published: input.published,

        weight: input.weight,

        tags: input.tags,

      })

      .eq("id", id)

      .select()

      .single()

  if (error) throw error

  return data

}

//---------------------------------------------
// حذف
//---------------------------------------------

export async function deleteProduct(

  id: string

) {

  const { error } =
    await supabaseAdmin
      .from("products")
      .delete()
      .eq("id", id)

  if (error) throw error

}
