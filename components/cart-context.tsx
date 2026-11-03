"use client"

import * as React from "react"
import { PRODUCTS } from "@/lib/products"

type CartItem = { slug: string; qty: number }

type CartContextValue = {
  items: CartItem[]
  isOpen: boolean
  count: number
  subtotal: number
  addItem: (slug: string, qty?: number) => void
  removeItem: (slug: string) => void
  setQty: (slug: string, qty: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
}

const CartContext = React.createContext<CartContextValue | null>(null)
const STORAGE_KEY = "wickweb-cart"

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<CartItem[]>([])
  const [isOpen, setIsOpen] = React.useState(false)
  const [hydrated, setHydrated] = React.useState(false)

  // Load happens in its own render pass so the save effect below doesn't see
  // the pre-load empty array and overwrite storage before the read lands.
  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) setItems(JSON.parse(raw))
    } catch {
      // ignore corrupt/blocked storage
    }
    setHydrated(true)
  }, [])

  React.useEffect(() => {
    if (!hydrated) return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // ignore (private browsing, quota, etc.)
    }
  }, [items, hydrated])

  const addItem = React.useCallback((slug: string, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.slug === slug)
      if (existing) return prev.map((i) => (i.slug === slug ? { ...i, qty: i.qty + qty } : i))
      return [...prev, { slug, qty }]
    })
    setIsOpen(true)
  }, [])

  const removeItem = React.useCallback((slug: string) => {
    setItems((prev) => prev.filter((i) => i.slug !== slug))
  }, [])

  const setQty = React.useCallback((slug: string, qty: number) => {
    setItems((prev) => {
      if (qty <= 0) return prev.filter((i) => i.slug !== slug)
      return prev.map((i) => (i.slug === slug ? { ...i, qty } : i))
    })
  }, [])

  const clearCart = React.useCallback(() => setItems([]), [])
  const openCart = React.useCallback(() => setIsOpen(true), [])
  const closeCart = React.useCallback(() => setIsOpen(false), [])
  const toggleCart = React.useCallback(() => setIsOpen((v) => !v), [])

  const count = items.reduce((n, i) => n + i.qty, 0)
  const subtotal = items.reduce((sum, i) => {
    const p = PRODUCTS.find((p) => p.slug === i.slug)
    return sum + (p ? p.price * i.qty : 0)
  }, 0)

  const value: CartContextValue = {
    items,
    isOpen,
    count,
    subtotal,
    addItem,
    removeItem,
    setQty,
    clearCart,
    openCart,
    closeCart,
    toggleCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = React.useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}
