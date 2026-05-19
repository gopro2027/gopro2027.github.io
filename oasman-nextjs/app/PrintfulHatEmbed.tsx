"use client"

import type { CSSProperties } from "react"

const PRODUCT_URL = "https://oasman.printful.me/product/oasman-corduroy-hat"
const STORE_URL = "https://oasman.printful.me"
const PRODUCT_IMAGE =
  "https://cdn.printful.me/t/quick-stores/variants/w339/152936746a0b53e415d51__825"
const PRICE = "$25.00"

const buttonPrimary: CSSProperties = {
  background: "linear-gradient(to right, #8b6946, #bca082)",
  color: "#2a2219",
  fontWeight: 900,
  textTransform: "uppercase",
  fontSize: "0.875rem",
  letterSpacing: "0.05em",
  paddingLeft: "2rem",
  paddingRight: "2rem",
  paddingTop: "1rem",
  paddingBottom: "1rem",
  borderRadius: "0.125rem",
  textDecoration: "none",
  transition: "transform 300ms",
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
        paddingLeft: "1rem",
        paddingRight: "1rem",
        paddingTop: "8rem",
        paddingBottom: "8rem",
        borderTop: "1px solid rgba(188, 160, 130, 0.15)",
      }}
    >
      <div style={{ maxWidth: "80rem", marginLeft: "auto", marginRight: "auto" }}>
        <div className="printful-hat-header" style={{ textAlign: "center", marginBottom: "3rem" }}>
          <p
            style={{
              fontSize: "0.75rem",
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              color: "#8b6946",
              marginBottom: "1rem",
            }}
          >
            Official Merch
          </p>
          <h2
            style={{
              fontSize: "3rem",
              fontWeight: 900,
              letterSpacing: "-0.02em",
              color: "#f5f0eb",
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
            gap: "2rem",
            alignItems: "center",
            border: "2px solid rgba(188, 160, 130, 0.25)",
            borderRadius: "0.125rem",
            padding: "2rem",
            backgroundColor: "rgba(42, 34, 24, 0.6)",
          }}
        >
          <a
            href={PRODUCT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="printful-hat-image-link"
            style={{
              display: "block",
              borderRadius: "0.125rem",
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
                  fontWeight: 900,
                  color: "#8b6946",
                  marginBottom: "0.5rem",
                }}
              >
                {PRICE}
              </p>
              <p style={{ fontSize: "0.875rem", color: "#9d8b7a", lineHeight: 1.6 }}>
                A hat made of corduroy that&apos;ll serve you for ages—soft, affordable, and durable.
              </p>
            </div>

            <ul style={{ display: "flex", flexDirection: "column", gap: "0.5rem", padding: 0, margin: 0, listStyle: "none" }}>
              {features.map((item) => (
                <li
                  key={item}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    fontSize: "0.875rem",
                    color: "#f5f0eb",
                  }}
                >
                  <span
                    style={{
                      width: "0.5rem",
                      height: "0.5rem",
                      borderRadius: "9999px",
                      backgroundColor: "#8b6946",
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
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                Buy the Hat
              </a>
            </div>
          </div>
        </div>

        <p
          style={{
            textAlign: "center",
            fontSize: "0.75rem",
            color: "#9d8b7a",
            marginTop: "1.5rem",
            maxWidth: "36rem",
            marginLeft: "auto",
            marginRight: "auto",
            lineHeight: 1.6,
          }}
        >
          Checkout powered by Printful.{" "}
          <a href={STORE_URL} target="_blank" rel="noopener noreferrer" style={{ color: "#8b6946" }}>
            Click here to view the full store
          </a>
          .
        </p>
      </div>
    </section>
  )
}
