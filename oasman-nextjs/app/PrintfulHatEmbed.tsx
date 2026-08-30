"use client"

const PRODUCT_URL = "https://oasman.printful.me/product/oasman-corduroy-hat"
const STORE_URL = "https://oasman.printful.me"
const PRODUCT_IMAGE =
  "https://cdn.printful.me/t/quick-stores/variants/w339/152936746a0b53e415d51__825"
const PRICE = "$25.00"

const features = [
  ["Material", "100% cotton corduroy"],
  ["Crown", "Soft, unstructured"],
  ["Closure", "Adjustable buckle"],
  ["Sizing", "One size"],
]

export default function PrintfulHatEmbed() {
  return (
    <section id="merch" className="oas-section">
      <div className="oas-wrap">
        <p className="oas-eyebrow reveal">Merch</p>
        <h2
          className="oas-display oas-h2 reveal reveal-delay-1"
          style={{ marginTop: "1.25rem", marginBottom: "clamp(2.5rem, 5vw, 3.5rem)" }}
        >
          Corduroy hat
        </h2>

        <div
          className="printful-hat-card oas-split reveal"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "clamp(2rem, 4vw, 3.5rem)",
            alignItems: "center",
          }}
        >
          <a
            href={PRODUCT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="oas-frame oas-split-media"
            style={{ display: "block" }}
          >
            <img
              src={PRODUCT_IMAGE}
              alt="The OASMan corduroy hat"
              style={{ width: "100%", height: "auto", display: "block" }}
            />
          </a>

          <div>
            <div className="oas-num" style={{ fontSize: "clamp(2.25rem, 5vw, 3rem)" }}>
              {PRICE}
            </div>
            <p className="oas-body" style={{ margin: "1.25rem 0 2rem", maxWidth: "38ch" }}>
              Soft, cheap, and hard to wear out — the same brief as the rest of
              the project.
            </p>

            <div style={{ marginBottom: "2rem" }}>
              {features.map(([k, v]) => (
                <div key={k} className="oas-spec">
                  <span className="oas-spec-k">{k}</span>
                  <span className="oas-spec-v">{v}</span>
                </div>
              ))}
            </div>

            <div
              className="printful-hat-actions"
              style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}
            >
              <a
                className="oas-btn oas-btn-fill"
                href={PRODUCT_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Buy the hat
              </a>
              <a
                className="oas-btn oas-btn-ghost"
                href={STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Full store
              </a>
            </div>

            <p className="oas-mono" style={{ marginTop: "1.5rem", letterSpacing: "0.12em" }}>
              Checkout handled by Printful
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
