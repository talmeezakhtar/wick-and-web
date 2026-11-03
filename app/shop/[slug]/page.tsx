import Link from "next/link"
import { notFound } from "next/navigation"
import { getProduct, PRODUCTS } from "@/lib/products"
import AddToCart from "@/components/add-to-cart"

// Product slugs are fully known at build time (generateStaticParams below),
// so block on them instead of requiring a Suspense boundary for the instant shell.
export const instant = false

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = getProduct(slug)
  if (!product) return {}
  return {
    title: `${product.name} — wick & web`,
    description: product.blurb,
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = getProduct(slug)
  if (!product) notFound()

  return (
    <main className="ssd-page" style={{ width: "100%" }}>
      <Link href="/shop" className="ssd-crumb" data-silk-anchor>
        ← back to the shop
      </Link>
      <div className="ssd-product">
        <img className="ssd-product-photo" src={product.image} alt={product.name} width={600} height={600} data-silk-anchor />
        <div data-silk-anchor>
          <span className="ssd-product-k">{product.category}</span>
          <h1>{product.name}</h1>
          <p className="ssd-product-price">${product.price}</p>
          <p className="ssd-product-desc">{product.description}</p>
          <AddToCart slug={product.slug} />
        </div>
      </div>
    </main>
  )
}
