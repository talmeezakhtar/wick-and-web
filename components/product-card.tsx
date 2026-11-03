import Link from "next/link"
import AddToCartButton from "@/components/add-to-cart-button"

export default function ProductCard({
  slug,
  category,
  name,
  blurb,
  price,
  image,
}: {
  slug: string
  category: string
  name: string
  blurb: string
  price: number
  image: string
}) {
  return (
    <article className="ssd-card" data-silk-anchor>
      <Link href={`/shop/${slug}`}>
        <img src={image} alt={name} width={400} height={400} loading="lazy" />
        <span className="ssd-card-k">{category}</span>
        <h4>{name}</h4>
        <p>{blurb}</p>
      </Link>
      <div className="ssd-qty-row" style={{ marginTop: 14, marginBottom: 0 }}>
        <span className="ssd-card-price">${price}</span>
        <AddToCartButton slug={slug} />
      </div>
    </article>
  )
}
