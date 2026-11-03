"use client"

import Link from "next/link"
import { useCart } from "@/components/cart-context"
import { getProduct } from "@/lib/products"

export default function CartDrawer() {
  const { items, isOpen, subtotal, closeCart, setQty, removeItem } = useCart()

  return (
    <>
      <div className={"ssd-cart-overlay" + (isOpen ? " open" : "")} onClick={closeCart} />
      <aside className={"ssd-cart-drawer" + (isOpen ? " open" : "")} aria-hidden={!isOpen}>
        <div className="ssd-cart-head">
          <b>your cart</b>
          <button type="button" aria-label="Close cart" onClick={closeCart}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg>
          </button>
        </div>

        {items.length === 0 ? (
          <p className="ssd-cart-empty">Nothing in here yet — the spider&apos;s watching, not shopping.</p>
        ) : (
          <div className="ssd-cart-items">
            {items.map((item) => {
              const p = getProduct(item.slug)
              if (!p) return null
              return (
                <div key={item.slug} className="ssd-cart-item">
                  <img src={p.image} alt="" width={56} height={56} />
                  <div className="ssd-cart-item-info">
                    <span className="ssd-cart-item-name">{p.name}</span>
                    <span className="ssd-cart-item-price">${p.price}</span>
                    <div className="ssd-qty">
                      <button type="button" aria-label="Decrease quantity" onClick={() => setQty(item.slug, item.qty - 1)}>−</button>
                      <span>{item.qty}</span>
                      <button type="button" aria-label="Increase quantity" onClick={() => setQty(item.slug, item.qty + 1)}>+</button>
                    </div>
                  </div>
                  <button type="button" className="ssd-cart-remove" aria-label={`Remove ${p.name}`} onClick={() => removeItem(item.slug)}>
                    remove
                  </button>
                </div>
              )
            })}
          </div>
        )}

        <div className="ssd-cart-foot">
          <div className="ssd-cart-total">
            <span>subtotal</span>
            <span>${subtotal}</span>
          </div>
          <Link
            href="/checkout"
            className={"ssd-btn" + (items.length === 0 ? " disabled" : "")}
            onClick={(e) => {
              if (items.length === 0) e.preventDefault()
              else closeCart()
            }}
          >
            checkout
          </Link>
        </div>
      </aside>
    </>
  )
}
