import type {
  Product,
  ProductRepository,
  ProductFilters,
  SortOption,
  PaginationParams,
  PaginatedResult,
} from "@/types";

import { supabase } from "@/lib/supabase";

function mapProduct(p: any): Product {
  return {
    id: p.id,
    name: p.title,
    slug: p.slug,
    description: p.description ?? "",
    body: "",
    images: [
      {
        url: p.image ?? "",
        alt: p.title,
      },
    ],
    status: "active",
    brandId: "",
    categoryIds: p.category ? [p.category] : [],
    tags: [],
    rating: 5,
    reviewCount: 0,
    featured: false,
    createdAt: p.created_at,
    updatedAt: p.created_at,

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

        images: [
          {
            url: p.image ?? "",
            alt: p.title,
          },
        ],
      },
    ],
  };
}

export const supabaseProductRepository: ProductRepository = {
  async list(filters, sort, pagination) {
    let query = supabase
      .from("products")
      .select("*", { count: "exact" })
      .eq("published", true);

    if (filters?.search) {
      query = query.ilike("title", `%${filters.search}%`);
    }

    if (filters?.category) {
      query = query.eq("category", filters.category);
    }

    if (sort?.field === "price") {
      query = query.order("price", {
        ascending: sort.order === "asc",
      });
    } else if (sort?.field === "createdAt") {
      query = query.order("created_at", {
        ascending: sort.order === "asc",
      });
    } else {
      query = query.order("title");
    }

    const page = pagination?.page ?? 1;
    const limit = pagination?.limit ?? 12;

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      console.error(error);

      return {
        items: [],
        pagination: {
          total: 0,
          page,
          limit,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        },
      };
    }

    return {
      items: (data ?? []).map(mapProduct),

      pagination: {
        total: count ?? 0,
        page,
        limit,
        totalPages: Math.ceil((count ?? 0) / limit),
        hasNext: page * limit < (count ?? 0),
        hasPrev: page > 1,
      },
    };
  },

  async getBySlug(slug) {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .single();

    if (error || !data) return null;

    return mapProduct(data);
  },

  async getById(id) {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) return null;

    return mapProduct(data);
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

    return (data ?? []).map(mapProduct);
  },

  async getByCategory(categorySlug, pagination) {
    const page = pagination?.page ?? 1;
    const limit = pagination?.limit ?? 12;

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from("products")
      .select("*", { count: "exact" })
      .eq("published", true)
      .eq("category", categorySlug)
      .range(from, to);

    if (error) {
      console.error(error);

      return {
        items: [],
        pagination: {
          total: 0,
          page,
          limit,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        },
      };
    }

    return {
      items: (data ?? []).map(mapProduct),

      pagination: {
        total: count ?? 0,
        page,
        limit,
        totalPages: Math.ceil((count ?? 0) / limit),
        hasNext: page * limit < (count ?? 0),
        hasPrev: page > 1,
      },
    };
  },

  async search(queryText, pagination) {
    return this.list(
      {
        search: queryText,
      },
      undefined,
      pagination
    );
  },
};
