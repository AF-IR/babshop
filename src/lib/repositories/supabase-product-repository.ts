import { supabase } from "@/lib/supabase";

function mapProduct(p: any) {
  return {
    id: p.id,
    name: p.title,
    slug: p.slug,
    description: p.description,
    body: "",
    images: [
      {
        url: p.image,
        alt: p.title,
      },
    ],
    status: "active",
    brandId: "",
    categoryIds: [],
    tags: [],
    rating: 5,
    reviewCount: 0,
    featured: true,
    createdAt: p.created_at ?? new Date().toISOString(),
    updatedAt: p.created_at ?? new Date().toISOString(),
    variants: [
      {
        id: p.id,
        productId: p.id,
        sku: "",
        name: "Default",
        price: p.price,
        currency: "IRR",
        inventory: {
          quantity: p.stock,
          trackInventory: true,
          allowBackorder: false,
        },
        options: [],
        images: [],
      },
    ],
  };
}

export const supabaseProductRepository = {
  async list() {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("published", true);

    if (error) {
      console.error(error);
      return {
        items: [],
        pagination: {
          total: 0,
          page: 1,
          limit: 12,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        },
      };
    }

    const items = data.map(mapProduct);

    return {
      items,
      pagination: {
        total: items.length,
        page: 1,
        limit: 12,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      },
    };
  },

  async getFeatured(limit = 4) {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("published", true)
      .limit(limit);

    if (error) {
      console.error(error);
      return [];
    }

    return data.map(mapProduct);
  },

  async getBySlug(slug: string) {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error || !data) return null;

    return mapProduct(data);
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) return null;

    return mapProduct(data);
  },

  async search(query: string) {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .ilike("title", `%${query}%`);

    if (error) {
      console.error(error);
      return {
        items: [],
        pagination: {
          total: 0,
          page: 1,
          limit: 12,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        },
      };
    }

    const items = data.map(mapProduct);

    return {
      items,
      pagination: {
        total: items.length,
        page: 1,
        limit: 12,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      },
    };
  },

  async getByCategory(category: string) {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("category", category);

    if (error) {
      console.error(error);
      return {
        items: [],
        pagination: {
          total: 0,
          page: 1,
          limit: 12,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        },
      };
    }

    const items = data.map(mapProduct);

    return {
      items,
      pagination: {
        total: items.length,
        page: 1,
        limit: 12,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      },
    };
  },
};
