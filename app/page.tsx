import { PRODUCTS } from "@/lib/products"
import ProductCard from "@/components/product-card"
import RadioWidget from "@/components/radio-widget"

// Wick & Web — a cozy small-batch candle-and-merch shop, warm and dim-lit,
// with a resident spider spinning silk across the page. Every element marked
// data-silk-anchor is something the silk may stick to.

export default function Home() {
  return (
    <main style={{ width: "100%" }}>
      <section className="ssd-hero">
        <h1 className="ssd-word" aria-label="web">
          {"web".split("").map((c, i) => (
            <span key={i} data-silk-anchor>
              {c}
            </span>
          ))}
        </h1>

        <RadioWidget />

        <div className="ssd-copy">
          <h2 data-silk-anchor>
            small comforts
            <br />
            for late nights
          </h2>
          <p data-silk-anchor>Candles, mugs, and soft things — poured and stitched slow, kept close.</p>
          <p className="ssd-hint">
            <kbd>del</kbd> sweeps the webs
          </p>
        </div>

        <div className="ssd-ticket" data-silk-anchor>
          <div className="ssd-ticket-top">
            <span>HAND POURED</span>
            <span>No. 0208</span>
          </div>
          <div className="ssd-ticket-title">small comforts,
            <br />
            made slow</div>
          <div className="ssd-ticket-foot">
            <span>batch ∞</span>
            <span>scent whichever</span>
          </div>
        </div>
        <div className="ssd-note" data-silk-anchor>
          <span className="ssd-pin" />
          <b>todo</b>
          <s>restock the amber candles</s>
          <s>don&apos;t pet the spider</s>
          <span>she&apos;s union now</span>
        </div>

      </section>

      <section className="ssd-shelf">
        <h3 data-silk-anchor>new in the shop</h3>
        <div className="ssd-cards">
          {PRODUCTS.map((p) => (
            <ProductCard key={p.slug} slug={p.slug} category={p.category} name={p.name} blurb={p.blurb} price={p.price} image={p.image} />
          ))}
        </div>
      </section>
    </main>
  )
}
