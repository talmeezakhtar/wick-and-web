"use client"

import * as React from "react"
import { useCart } from "@/components/cart-context"

export default function AddToCart({ slug }: { slug: string }) {
  const { addItem } = useCart()
  const [qty, setQty] = React.useState(1)
  const [added, setAdded] = React.useState(false)

  const handleAdd = () => {
    addItem(slug, qty)
    setAdded(true)
    window.setTimeout(() => setAdded(false), 1800)
  }

  return (
    <div>
      <div className="ssd-qty-row">
        <div className="ssd-qty">
          <button type="button" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
          <span>{qty}</span>
          <button type="button" aria-label="Increase quantity" onClick={() => setQty((q) => q + 1)}>+</button>
        </div>
      </div>
      <button type="button" className="ssd-btn" style={{ width: 220 }} onClick={handleAdd}>
        {added ? "added ✓" : "add to cart"}
      </button>
    </div>
  )
}
