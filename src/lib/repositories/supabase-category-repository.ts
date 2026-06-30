import { supabase } from "@/lib/supabase"
import type { Category, CategoryRepository } from "@/types"

export const supabaseCategoryRepository: CategoryRepository = {
  async list() {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("display_order", { ascending: true })

    if (error) {
      console.error(error)
      return []
    }

    return data.map(mapCategory)
  },

  async getBySlug(slug) {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("slug", slug)
      .single()

    if (error || !data) return null

    return mapCategory(data)
  },

  async getById(id) {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("id", id)
      .single()

    if (error || !data) return null

    return mapCategory(data)
  },

  async getChildren(parentId) {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("parent_id", parentId)
      .order("display_order")

    if (error) {
      console.error(error)
      return []
    }

    return data.map(mapCategory)
  },

  async getTopLevel() {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .is("parent_id", null)
      .order("display_order")

    if (error) {
      console.error(error)
      return []
    }

    return data.map(mapCategory)
  },

  async getAncestors(categoryId) {
    const all = await this.list()

    const chain: Category[] = []

    let current = all.find((c) => c.id === categoryId)

    while (current) {
      chain.unshift(current)

      current = current.parentId
        ? all.find((c) => c.id === current!.parentId)
        : undefined
    }

    return chain
  },
}

function mapCategory(row: any): Category {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description ?? "",
    image: row.image
      ? {
          url: row.image,
          alt: row.name,
        }
      : undefined,
    parentId: row.parent_id ?? undefined,
    order: row.display_order ?? 0,
  }
}
