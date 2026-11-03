export type Product = {
  slug: string
  category: string
  name: string
  price: number
  blurb: string
  description: string
  image: string
}

export const PRODUCTS: Product[] = [
  {
    slug: "amber-hour",
    category: "candle",
    name: "the tin",
    price: 24,
    blurb: "Soy wax in a reusable tin, four scents, lid doubles as a coaster.",
    description:
      "Hand-poured soy wax in a stackable tin instead of glass — cotton wick, burns clean for about four hours a sitting. Comes in spicy, milky way, spring green, or iconic floral; we rotate which one ships depending on the batch. Keep the tin after — it's just as good for loose change as it was for wax.",
    image: "/candle-tin-collection.webp",
  },
  {
    slug: "slow-morning",
    category: "mug",
    name: "daily grind",
    price: 18,
    blurb: "Stoneware, Spidey Blend roast etched right into the glaze.",
    description:
      "Wheel-thrown stoneware, two faces: a web etched around a hand-drawn monogram, or the full mask glazed red with cut-out eyes. Holds twelve ounces and heat longer than you'd expect. Wick & Web Co., Daily Grind — Spidey Blend.",
    image: "/mug-daily-grind.webp",
  },
  {
    slug: "web-stitched-tee",
    category: "tee",
    name: "spider style tee",
    price: 32,
    blurb: "Vintage-wash cotton, spiders and webs across the chest since '96.",
    description:
      "Heavyweight cotton, sun-faded print of spiders and webs with \"Spider Style — Since 1996\" across the chest. It still says Web & Wick Company on this run, an old lockup from before we flipped the name — we liked it too much to toss the screen. Runs true to size, softens with every wash.",
    image: "/tee-spider-style.webp",
  },
]

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug)
}
