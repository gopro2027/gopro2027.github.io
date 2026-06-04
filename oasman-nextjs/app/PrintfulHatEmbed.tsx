"use client"

import type { CSSProperties } from "react"

const PRODUCT_URL = "https://oasman.printful.me/product/oasman-corduroy-hat"
const STORE_URL = "https://oasman.printful.me"
const PRODUCT_IMAGE =
  "https://cdn.printful.me/t/quick-stores/variants/w339/152936746a0b53e415d51__825"
const PRICE = "$25.00"

const buttonPrimary: CSSProperties = {
  background: "linear-gradient(135deg, #2563EB, #60A5FA)",
  color: "#fff",
  fontWeight: 500,
  fontSize: "0.9375rem",
  paddingLeft: "1.75rem",
  paddingRight: "1.75rem",
  paddingTop: "0.75rem",
  paddingBottom: "0.75rem",
  borderRadius: "980px",
  textDecoration: "none",
  transition: "filter 200ms, transform 200ms",
  display: "inline-block",
  textAlign: "center",
}

const features = [
  "100% cotton corduroy",
  "Soft, unstructured crown",
  "Adjustable buckle",
  "One size",
]

export default function PrintfulHatEmbed() {
  return (
    <section
      id="merch"
      className="printful-hat-section"
      style={{
        position: "relative",
        paddingLeft: "1.5rem",
        paddingRight: "1.5rem",
        paddingTop: "6rem",
        paddingBottom: "6rem",
        borderTop: "1px solid rgba(255, 255, 255, 0.06)",
        background: "#0a0a0a",
      }}
    >
      <div style={{ maxWidth: "980px", marginLeft: "auto", marginRight: "auto" }}>
        <div className="printful-hat-header" style={{ textAlign: "center", marginBottom: "3rem" }}>
          <p
            style={{
              fontSize: "0.8rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: "#60A5FA",
              marginBottom: "0.75rem",
            }}
          >
            Official Merch
          </p>
          <h2
            style={{
              fontSize: "clamp(2.5rem, 6vw, 4rem)",
              fontWeight: 700,
              letterSpacing: "-0.025em",
              color: "#f5f5f7",
              marginBottom: "1rem",
            }}
          >
            OAS-Man Corduroy Hat
          </h2>
          
        </div>

        <div
          className="printful-hat-card"
          style={{
            maxWidth: "56rem",
            marginLeft: "auto",
            marginRight: "auto",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "2.5rem",
            alignItems: "center",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "20px",
            padding: "2.5rem",
            backgroundColor: "#1c1c1e",
          }}
        >
          <a
            href={PRODUCT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="printful-hat-image-link"
            style={{
              display: "block",
              borderRadius: "14px",
              overflow: "hidden",
              backgroundColor: "#f5f0eb",
            }}
          >
            <img
              src={PRODUCT_IMAGE}
              alt="OAS-Man corduroy hat"
              style={{
                width: "100%",
                height: "auto",
                display: "block",
                objectFit: "cover",
              }}
            />
          </a>

          <div className="printful-hat-details" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div>
              <p
                style={{
                  fontSize: "2.5rem",
                  fontWeight: 700,
                  color: "#60A5FA",
                  marginBottom: "0.5rem",
                  letterSpacing: "-0.02em",
                }}
              >
                {PRICE}
              </p>
              <p style={{ fontSize: "0.9375rem", color: "#a1a1a6", lineHeight: 1.6 }}>
                A hat made of corduroy that&apos;ll serve you for ages—soft, affordable, and durable.
              </p>
            </div>

            <ul style={{ display: "flex", flexDirection: "column", gap: "0.625rem", padding: 0, margin: 0, listStyle: "none" }}>
              {features.map((item) => (
                <li
                  key={item}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    fontSize: "0.9375rem",
                    color: "#f5f5f7",
                  }}
                >
                  <span
                    style={{
                      width: "0.5rem",
                      height: "0.5rem",
                      borderRadius: "9999px",
                      backgroundColor: "#60A5FA",
                      flexShrink: 0,
                    }}
                  />
                  {item}
                </li>
              ))}
            </ul>

            <div
              className="printful-hat-actions"
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "1rem",
                paddingTop: "0.5rem",
              }}
            >
              <a
                href={PRODUCT_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={buttonPrimary}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.03)"
                  e.currentTarget.style.filter = "brightness(1.1)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)"
                  e.currentTarget.style.filter = "brightness(1)"
                }}
              >
                Buy the Hat
              </a>
            </div>
          </div>
        </div>

        <p
          style={{
            textAlign: "center",
            fontSize: "0.8125rem",
            color: "#6e6e73",
            marginTop: "1.5rem",
            maxWidth: "36rem",
            marginLeft: "auto",
            marginRight: "auto",
            lineHeight: 1.6,
          }}
        >
          Checkout powered by Printful.{" "}
          <a href={STORE_URL} target="_blank" rel="noopener noreferrer" style={{ color: "#60A5FA" }}>
            Click here to view the full store
          </a>
          .
        </p>
      </div>
    </section>
  )
}
