import type { CategoryRepository } from "@/types";
import { supabase } from "@/lib/supabase";

function mapCategory(c: any) {
  return {
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description ?? "",
    image: c.image
      ? {
          url: c.image,
          alt: c.name,
        }
      : undefined,
    parentId: c.parent_id ?? undefined,
    order: c.display_order ?? 0,
  };
}

export const supabaseCategoryRepository: CategoryRepository = {
  async list() {
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("display_order");

    return (data ?? []).map(mapCategory);
  },

  async getBySlug(slug) {
    const { data } = await supabase
      .from("categories")
      .select("*")
      .eq("slug", slug)
      .single();

    return data ? mapCategory(data) : null;
  },

  async getById(id) {
    const { data } = await supabase
      .from("categories")
      .select("*")
      .eq("id", id)
      .single();

    return data ? mapCategory(data) : null;
  },
};
