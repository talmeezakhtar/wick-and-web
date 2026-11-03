"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useCart } from "@/components/cart-context"

const NAV = [
  { label: "home", href: "/" },
  { label: "shop", href: "/shop" },
  { label: "say hi", href: "/say-hi" },
]

export default function SiteHeader() {
  const pathname = usePathname()
  const { count, toggleCart } = useCart()

  return (
    <header className="ssd-nav">
      <Link className="ssd-logo" href="/" data-silk-anchor>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
          <path d="M1 1c4 0 7 1.5 9 3.5M1 1c0 4 1.5 7 3.5 9M1 1l5.5 5.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          <circle cx="6.5" cy="6.5" r="1.3" fill="currentColor" />
        </svg>
        wick &amp; web
      </Link>
      <div className="ssd-nav-right">
        <nav className="ssd-links">
          {NAV.map((n) => {
            const current = n.href === "/" ? pathname === "/" : pathname.startsWith(n.href) && n.href !== "#"
            return (
              <Link key={n.label} href={n.href} data-silk-anchor className={current ? "ssd-here" : undefined}>
                {n.label}
              </Link>
            )
          })}
        </nav>
        <button type="button" className="ssd-cart-btn" data-silk-anchor onClick={toggleCart} aria-label={`Cart, ${count} item${count === 1 ? "" : "s"}`}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h2l2.4 12.1a2 2 0 0 0 2 1.6h8.1a2 2 0 0 0 2-1.6L21 8H6" />
            <circle cx="9" cy="21" r="1.4" fill="currentColor" stroke="none" />
            <circle cx="18" cy="21" r="1.4" fill="currentColor" stroke="none" />
          </svg>
          {count > 0 && <span className="ssd-cart-badge">{count}</span>}
        </button>
      </div>
    </header>
  )
}
