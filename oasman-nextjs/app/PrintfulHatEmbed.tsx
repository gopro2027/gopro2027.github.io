"use client"

import type { CSSProperties } from "react"

const PRODUCT_URL = "https://oasman.printful.me/product/oasman-corduroy-hat"
const STORE_URL = "https://oasman.printful.me"
const PRODUCT_IMAGE =
  "https://cdn.printful.me/t/quick-stores/variants/w339/152936746a0b53e415d51__825"
const PRICE = "$25.00"

const buttonPrimary: CSSProperties = {
  background: "linear-gradient(135deg, #d35f1c 0%, #e76f2e 55%, #f1a14e 100%)",
  color: "#fff8ee",
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
        borderTop: "1px solid rgba(74, 48, 26, 0.1)",
        background: "#ecddc4",
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
              color: "#d35f1c",
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
              color: "#3e2c23",
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
            border: "1px solid rgba(74, 48, 26, 0.12)",
            borderRadius: "20px",
            padding: "2.5rem",
            backgroundColor: "#fdf8ee",
            boxShadow: "0 1px 3px rgba(74, 48, 26, 0.08)",
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
                  color: "#d35f1c",
                  marginBottom: "0.5rem",
                  letterSpacing: "-0.02em",
                }}
              >
                {PRICE}
              </p>
              <p style={{ fontSize: "0.9375rem", color: "#6b5444", lineHeight: 1.6 }}>
                A hat made of corduroy that&apos;ll serve you for ages: soft, affordable, and durable.
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
                    color: "#3e2c23",
                  }}
                >
                  <span
                    style={{
                      width: "0.5rem",
                      height: "0.5rem",
                      borderRadius: "9999px",
                      backgroundColor: "#e76f2e",
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
            color: "#9a8472",
            marginTop: "1.5rem",
            maxWidth: "36rem",
            marginLeft: "auto",
            marginRight: "auto",
            lineHeight: 1.6,
          }}
        >
          Checkout powered by Printful.{" "}
          <a href={STORE_URL} target="_blank" rel="noopener noreferrer" style={{ color: "#d35f1c" }}>
            Click here to view the full store
          </a>
          .
        </p>
      </div>
    </section>
  )
}
