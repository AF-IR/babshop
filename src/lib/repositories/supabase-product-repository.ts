import { supabase } from "@/lib/supabase";

export const supabaseProductRepository = {
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

    return data.map((p) => ({
      id: p.id,
      name: p.title,
      slug: p.slug,
      description: p.description,
      body: p.body ?? "",
      images: [
        {
          url: p.image,
          alt: p.title,
        },
      ],
      status: "active",
      brandId: "",
      categoryIds: [],
      tags: p.tags ?? [],
      rating: Number(p.rating ?? 5),
      reviewCount: p.review_count ?? 0,
      featured: p.featured ?? false,
      createdAt: p.created_at2 ?? new Date().toISOString(),
      updatedAt: p.updated_at ?? new Date().toISOString(),
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
    }));
  },
};
