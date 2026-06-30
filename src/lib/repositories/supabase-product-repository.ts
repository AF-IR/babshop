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
    body: p.body ?? "",

    images: [
      {
        url: p.image || "https://placehold.co/600x600",
        alt: p.title,
      },
    ],

    status: "active",

    brandId: p.brand ?? "",

    categoryIds: p.category_id ? [p.category_id] : [],

    tags: p.tags ?? [],

    rating: Number(p.rating ?? 5),

    reviewCount: Number(p.review_count ?? 0),

    featured: p.featured ?? false,

    createdAt: p.created_at,

    updatedAt: p.updated_at ?? p.created_at,

    variants: [
      {
        id: p.id,
        productId: p.id,
        sku: p.sku ?? "",
        name: "Default",

        price: Number(p.price),

        currency: "IRT",

        inventory: {
          quantity: Number(p.stock ?? 0),
          trackInventory: true,
          allowBackorder: false,
        },

        options: [],

        images: [
          {
            url: p.image || "https://placehold.co/600x600",
            alt: p.title,
          },
        ],
      },
    ],
  };
}

function paginate(
  items: Product[],
  total: number,
  page: number,
  limit: number
): PaginatedResult<Product> {
  return {
    items,

    pagination: {
      total,
      page,
      limit,

      totalPages: Math.ceil(total / limit),

      hasNext: page * limit < total,

      hasPrev: page > 1,
    },
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
      const { data: cat } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", filters.category)
        .single();

      if (cat) {
        query = query.eq("category_id", cat.id);
      }
    }

    if (sort?.field === "price") {
      query = query.order("price", {
        ascending: sort.order === "asc",
      });
    } else {
      query = query.order("created_at", {
        ascending: false,
      });
    }

    const page = pagination?.page ?? 1;
    const limit = pagination?.limit ?? 12;

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      console.error(error);

      return paginate([], 0, page, limit);
    }

    return paginate(
      (data ?? []).map(mapProduct),
      count ?? 0,
      page,
      limit
    );
  },

  async getBySlug(slug) {
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .single();

    return data ? mapProduct(data) : null;
  },

  async getById(id) {
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    return data ? mapProduct(data) : null;
  },

  async getFeatured(limit = 4) {
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("published", true)
      .eq("featured", true)
      .limit(limit);

    return (data ?? []).map(mapProduct);
  },

  async getByCategory(categorySlug, pagination) {
    console.log("CATEGORY SLUG =", categorySlug)
    const { data: category } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", categorySlug)
      .single();
    console.log("CATEGORY =", category)
    
    if (!category) {
      return paginate([], 0, 1, 12);
    }

    const page = pagination?.page ?? 1;
    const limit = pagination?.limit ?? 12;

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, count, error } = await supabase
      .from("products")
      .select("*", { count: "exact" })
      .eq("published", true)
      .eq("category_id", category.id)   // ✅ این خط مهمه
      .range(from, to);
    console.log("PRODUCT COUNT =", count)
    console.log(data)
    if (error) {
      console.error(error);
      return paginate([], 0, page, limit);
    }

    return paginate(
      (data ?? []).map(mapProduct),
      count ?? 0,
      page,
      limit
    );
  },  // ✅ کاما اضافه شد (تنها تغییر)

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
