"use client"

import { useCart } from "@/components/cart-context"

export default function AddToCartButton({ slug }: { slug: string }) {
  const { addItem } = useCart()
  return (
    <button
      type="button"
      className="ssd-btn-ghost"
      onClick={(e) => {
        e.preventDefault()
        addItem(slug)
      }}
    >
      add to cart
    </button>
  )
}
