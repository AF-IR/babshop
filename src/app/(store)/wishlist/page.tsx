import WishlistClient from "@/components/wishlist/wishlist-client"
import { productRepository } from "@/lib/repositories"

export default async function WishlistPage() {
  const { items } = await productRepository.list({}, undefined, {
    page: 1,
    limit: 1000,
  })

  return <WishlistClient products={items} />
}
