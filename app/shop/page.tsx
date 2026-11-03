import { PRODUCTS } from "@/lib/products"
import ProductCard from "@/components/product-card"

export default function ShopPage() {
  return (
    <main className="ssd-page" style={{ width: "100%" }}>
      <h1 data-silk-anchor>the shop</h1>
      <p className="ssd-lede" data-silk-anchor>
        Everything is poured, glazed, or stitched in small batches. If it&apos;s listed, it exists somewhere on a shelf right now.
      </p>
      <div className="ssd-cards">
        {PRODUCTS.map((p) => (
          <ProductCard key={p.slug} slug={p.slug} category={p.category} name={p.name} blurb={p.blurb} price={p.price} image={p.image} />
        ))}
      </div>
    </main>
  )
}
