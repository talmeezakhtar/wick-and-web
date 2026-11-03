"use client"

import * as React from "react"
import Link from "next/link"
import { useCart } from "@/components/cart-context"
import { getProduct } from "@/lib/products"

function fakeOrderId() {
  return "WW-" + Math.random().toString(36).slice(2, 7).toUpperCase()
}

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart()
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [order, setOrder] = React.useState<string | null>(null)

  const placeOrder = (e: React.FormEvent) => {
    e.preventDefault()
    const id = fakeOrderId()
    setOrder(id)
    clearCart()
  }

  if (order) {
    return (
      <main className="ssd-page" style={{ width: "100%" }}>
        <div className="ssd-confirm" data-silk-anchor>
          <h1>order confirmed</h1>
          <span className="ssd-order-id">#{order}</span>
          <p className="ssd-lede" style={{ marginBottom: 24 }}>
            Thanks{name ? `, ${name}` : ""} — this is a portfolio demo, so no payment was taken and nothing will actually ship. In a real store this is where the confirmation email would go{email ? ` (to ${email})` : ""}.
          </p>
          <Link href="/shop" className="ssd-btn-ghost">
            back to the shop
          </Link>
        </div>
      </main>
    )
  }

  if (items.length === 0) {
    return (
      <main className="ssd-page" style={{ width: "100%" }}>
        <h1 data-silk-anchor>checkout</h1>
        <p className="ssd-lede" data-silk-anchor>
          Your cart is empty. <Link href="/shop" style={{ textDecoration: "underline" }}>Go find something.</Link>
        </p>
      </main>
    )
  }

  return (
    <main className="ssd-page" style={{ width: "100%" }}>
      <h1 data-silk-anchor>checkout</h1>
      <p className="ssd-lede" data-silk-anchor>
        A demo checkout — no card details, no real charge.
      </p>
      <div className="ssd-checkout">
        <form className="ssd-form" onSubmit={placeOrder} data-silk-anchor>
          <div className="ssd-field">
            <label htmlFor="co-name">name</label>
            <input id="co-name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
          </div>
          <div className="ssd-field">
            <label htmlFor="co-email">email</label>
            <input id="co-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          <button type="submit" className="ssd-btn">
            place order (demo)
          </button>
        </form>

        <div className="ssd-order-summary" data-silk-anchor>
          {items.map((item) => {
            const p = getProduct(item.slug)
            if (!p) return null
            return (
              <div key={item.slug} className="ssd-order-line">
                <span>{p.name} × {item.qty}</span>
                <span>${p.price * item.qty}</span>
              </div>
            )
          })}
          <div className="ssd-order-total">
            <span>total</span>
            <span>${subtotal}</span>
          </div>
        </div>
      </div>
    </main>
  )
}
