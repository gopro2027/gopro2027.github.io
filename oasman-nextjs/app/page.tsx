"use client"

import { useEffect, useState } from "react"
import { Github } from "lucide-react"
import InstagramEmbed from "./InstagramEmbed"

export default function Home() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div style={{ backgroundColor: "#2a2219", color: "white", minHeight: "100vh", overflow: "hidden" }}>
      {/* Background with wooden grain and subtle texture */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.15,
            backgroundImage: `
              linear-gradient(90deg, 
                rgba(139, 105, 70, 0.3) 0%, 
                rgba(160, 125, 85, 0.25) 25%, 
                rgba(120, 90, 60, 0.28) 50%, 
                rgba(150, 115, 75, 0.25) 75%, 
                rgba(139, 105, 70, 0.3) 100%
              ),
              repeating-linear-gradient(
                0deg,
                rgba(255, 255, 255, 0.015) 0px,
                rgba(255, 255, 255, 0.01) 2px,
                transparent 4px,
                transparent 6px
              )
            `,
            backgroundSize: "100% 100%, 100% 20px",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.04,
            mixBlendMode: "overlay",
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noise"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4"/%3E%3C/filter%3E%3Crect width="100" height="100" fill="%23000" filter="url(%23noise)"/%3E%3C/svg%3E")',
            backgroundSize: "200px 200px",
          }}
        />
      </div>

      {/* Navigation */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          borderBottom: "1px solid rgba(188, 160, 130, 0.15)",
          backgroundColor: "rgba(42, 34, 25, 0.95)",
          backdropFilter: "blur(4px)",
        }}
      >
        <div
          style={{
            maxWidth: "80rem",
            marginLeft: "auto",
            marginRight: "auto",
            paddingLeft: "1rem",
            paddingRight: "1rem",
            paddingTop: "1rem",
            paddingBottom: "1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div
              style={{
                width: "2rem",
                height: "2rem",
                background: "linear-gradient(to bottom right, #8b6946, #bca082)",
                borderRadius: "0.125rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ color: "#2a2219", fontWeight: 900, fontSize: "0.75rem" }}>S</span>
            </div>
            <span
              style={{
                fontWeight: 900,
                fontSize: "1.125rem",
                letterSpacing: "0.05em",
                color: "#bca082",
              }}
            >
              OAS-MAN
            </span>
          </div>
          <a
            href="https://oasman.dev"
            style={{ color: "#8b6946", transition: "color 300ms" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#bca082")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#8b6946")}
          >
            <Github size={20} />
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        style={{
          position: "relative",
          paddingLeft: "1rem",
          paddingRight: "1rem",
          paddingTop: "8rem",
          paddingBottom: "8rem",
          overflow: "hidden",
        }}
      >
        <div style={{ maxWidth: "80rem", marginLeft: "auto", marginRight: "auto", position: "relative", zIndex: 10 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  backgroundColor: "rgba(188, 160, 130, 0.08)",
                  border: "1px solid rgba(188, 160, 130, 0.25)",
                  borderRadius: "9999px",
                  paddingLeft: "1rem",
                  paddingRight: "1rem",
                  paddingTop: "0.5rem",
                  paddingBottom: "0.5rem",
                  width: "fit-content",
                }}
              >
                <div
                  style={{
                    width: "0.5rem",
                    height: "0.5rem",
                    borderRadius: "9999px",
                    backgroundColor: "#8b6946",
                    animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                  }}
                />
                <span style={{ fontSize: "0.75rem", fontWeight: 900, letterSpacing: "0.1em", color: "#8b6946" }}>
                  OPEN SOURCE • DIY • AFFORDABLE
                </span>
              </div>

              <h1
                style={{
                  fontSize: "3.5rem",
                  fontWeight: 900,
                  lineHeight: 1.2,
                  letterSpacing: "-0.02em",
                  maxWidth: "56rem",
                  opacity: Math.max(0, 1 - scrollY / 500),
                  transition: "opacity 100ms",
                  color: "#f5f0eb",
                }}
              >
                <span
                  style={{
                    color: "#8b6946",
                  }}
                >
                  BUILD
                </span>
                <br />
                <span style={{ color: "#bca082" }}>YOUR OWN</span>
              </h1>

              <p style={{ fontSize: "1.25rem", color: "#9d8b7a", maxWidth: "42rem", fontWeight: 300, lineHeight: 1.6 }}>
                DIY air suspension for under <span style={{ color: "#8b6946", fontWeight: 900 }}>$500</span>. Open
                source. Fully customizable. Everything the big brands don't want you to have.
              </p>
            </div>

            {/* Hero stats */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "1rem",
                paddingTop: "2rem",
                borderTop: "1px solid rgba(188, 160, 130, 0.15)",
              }}
            >
              {[
                { value: "67%", label: "Cheaper Than Competition", color: "#8b6946" },
                { value: "100%", label: "Open Source", color: "#bca082" },
                { value: "1000%", label: "The future of air suspension", color: "#8b6946" },
              ].map((stat, i) => (
                <div
                  key={i}
                  style={{
                    padding: "1rem",
                    borderLeft: `2px solid ${stat.color}`,
                    cursor: "pointer",
                    transition: "all 300ms",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.paddingLeft = "1.5rem"
                    e.currentTarget.style.borderLeftColor = stat.color === "#8b6946" ? "#bca082" : "#8b6946"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.paddingLeft = "1rem"
                    e.currentTarget.style.borderLeftColor = stat.color
                  }}
                >
                  <div style={{ fontSize: "3rem", fontWeight: 900, color: stat.color }}>{stat.value}</div>
                  <p
                    style={{
                      fontSize: "0.75rem",
                      color: "#9d8b7a",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      fontWeight: 700,
                    }}
                  >
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <button
              onClick={() => window.open("https://oasman.dev/", "_blank")}
              style={{
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
                border: "none",
                cursor: "pointer",
                transition: "transform 300ms",
                width: "fit-content",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <Github size={16} />
              Start Building
            </button>
          </div>
        </div>
      </section>

      {/* Why OASMan Section */}
      <section
        style={{
          position: "relative",
          paddingLeft: "1rem",
          paddingRight: "1rem",
          paddingTop: "8rem",
          paddingBottom: "8rem",
          borderTop: "1px solid rgba(188, 160, 130, 0.15)",
          overflow: "hidden",
        }}
      >
        <div style={{ maxWidth: "80rem", marginLeft: "auto", marginRight: "auto", position: "relative", zIndex: 10 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "4rem" }}>
            <div>
              <h2 style={{ fontSize: "3.75rem", fontWeight: 900, letterSpacing: "-0.02em", color: "#f5f0eb" }}>
                Why OASMan Wins
              </h2>
              <p style={{ color: "#9d8b7a", fontWeight: 300, maxWidth: "42rem" }}>
                Built by enthusiasts, for enthusiasts. No corporate nonsense.
              </p>
            </div>

            <div
              style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}
            >
              {[
                {
                  name: "Airlift",
                  price: "$1500+",
                  items: ["Locked ecosystem", "Non-repairable", "Wired controller"],
                  featured: false,
                },
                {
                  name: "Airtek",
                  price: "$1000",
                  items: ["Proprietary parts only", "Limited customization", "Wired controller"],
                  featured: false,
                },
                {
                  name: "OAS-Man",
                  price: "< $499",
                  items: ["100% open source", "Fully modular and repairable", "Full bluetooth controller support"],
                  featured: true,
                },
              ].map((product, i) => (
                <div
                  key={i}
                  style={{
                    border: `2px solid ${product.featured ? "#8b6946" : "rgba(188, 160, 130, 0.15)"}`,
                    borderRadius: "0.125rem",
                    padding: "2rem",
                    position: "relative",
                    backgroundColor: product.featured ? "rgba(139, 105, 70, 0.08)" : "rgba(42, 34, 24, 0.5)",
                    opacity: product.featured ? 1 : 0.6,
                    transition: "all 300ms",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    if (!product.featured) e.currentTarget.style.opacity = "1"
                    e.currentTarget.style.transform = "scale(1.05)"
                  }}
                  onMouseLeave={(e) => {
                    if (!product.featured) e.currentTarget.style.opacity = "0.6"
                    e.currentTarget.style.transform = "scale(1)"
                  }}
                >
                  {product.featured && (
                    <div
                      style={{
                        position: "absolute",
                        top: "-1rem",
                        right: "-1rem",
                        background: "linear-gradient(to right, #8b6946, #bca082)",
                        color: "#2a2219",
                        paddingLeft: "1rem",
                        paddingRight: "1rem",
                        paddingTop: "0.25rem",
                        paddingBottom: "0.25rem",
                        borderRadius: "9999px",
                        fontSize: "0.75rem",
                        fontWeight: 900,
                        textTransform: "uppercase",
                      }}
                    >
                      Best Choice
                    </div>
                  )}
                  <h3 style={{ fontSize: "1.25rem", fontWeight: 900, marginBottom: "0.5rem", color: "#f5f0eb" }}>
                    {product.name}
                  </h3>
                  <div
                    style={{
                      fontSize: "3rem",
                      fontWeight: 900,
                      color: "#8b6946",
                    }}
                  >
                    {product.price}
                  </div>
                  <ul style={{ marginTop: "1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {product.items.map((item, j) => (
                      <li key={j} style={{ display: "flex", gap: "0.75rem", fontSize: "0.875rem" }}>
                        <span style={{ fontWeight: 900, color: product.featured ? "#8b6946" : "#9d8b7a" }}>
                          {product.featured ? "✓" : "✕"}
                        </span>
                        <span style={{ color: product.featured ? "#f5f0eb" : "#9d8b7a" }}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Controller Section */}
      <section
        style={{
          position: "relative",
          paddingLeft: "1rem",
          paddingRight: "1rem",
          paddingTop: "8rem",
          paddingBottom: "8rem",
          borderTop: "1px solid rgba(188, 160, 130, 0.15)",
          overflow: "hidden",
        }}
      >
        <div style={{ maxWidth: "80rem", marginLeft: "auto", marginRight: "auto", position: "relative", zIndex: 10 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                  
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 900,
                      letterSpacing: "0.1em",
                      color: "#8b6946",
                      textTransform: "uppercase",
                    }}
                  >
                    Unique Features
                  </span>
                </div>
                <h2
                  style={{
                    fontSize: "3rem",
                    fontWeight: 900,
                    lineHeight: 1.2,
                    letterSpacing: "-0.02em",
                    color: "#f5f0eb",
                  }}
                >
                  <span style={{ color: "#8b6946" }}>Use Gaming</span>
                  <br />
                  <span style={{ color: "#bca082" }}>Controllers</span>
                </h2>
                <p style={{ fontSize: "1.125rem", color: "#9d8b7a", fontWeight: 300 }}>
                  Your car is unique, so your controller should be too. Control your suspension with PS4, Xbox, or any gamepad. Real-time adjustments.
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                  paddingTop: "1rem",
                  borderTop: "1px solid rgba(188, 160, 130, 0.15)",
                }}
              >
                {["PS3, PS4, Xbox, Wii, Switch, etc. compatible", "Joystick Air Flow Control", "Fully Wireless"].map((feature, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      fontSize: "0.875rem",
                      cursor: "pointer",
                    }}
                  >
                    <div
                      style={{
                        width: "0.5rem",
                        height: "0.5rem",
                        borderRadius: "9999px",
                        backgroundColor: "#8b6946",
                        transition: "transform 300ms",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.5)")}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    />
                    <span
                      style={{ color: "#9d8b7a", transition: "color 300ms" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#f5f0eb")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "#9d8b7a")}
                    >
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ height: "24rem", position: "relative" }}>
              
              <InstagramEmbed />
              <img
                src="/gaming-controller-and-air-suspension-system.jpg"
                alt="Gaming Controller"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "0.125rem",
                  border: "2px solid rgba(188, 160, 130, 0.2)",
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        style={{
          position: "relative",
          paddingLeft: "1rem",
          paddingRight: "1rem",
          paddingTop: "8rem",
          paddingBottom: "8rem",
          borderTop: "1px solid rgba(188, 160, 130, 0.15)",
          overflow: "hidden",
        }}
      >
        <div style={{ maxWidth: "80rem", marginLeft: "auto", marginRight: "auto", position: "relative", zIndex: 10 }}>
          <h2
            style={{
              fontSize: "3rem",
              fontWeight: 900,
              letterSpacing: "-0.02em",
              marginBottom: "3rem",
              color: "#f5f0eb",
            }}
          >
            Endless Customization
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
            {[
              { title: "Fully Wireless", desc: "Use our dedicated touch screen controller, your phone, or any video game controller wirelessly." },
              { title: "Your Rules", desc: "Customize how you want, use the parts you want." },
              { title: "Never Locked In", desc: "Proprietary? No way. You own your system completely." },
              { title: "Affordable Repairs", desc: "Sensor breaks? $10 replacement, not $1000." },
              { title: "Future Proof", desc: "Community-driven. No company to go under." },
              { title: "Well Documented", desc: "Built by enthusiasts with guides and support." },
              { title: "Any Build Works", desc: "Restomods, street cars, track builds—all supported." },
            ].map((feature, i) => (
              <div
                key={i}
                style={{
                  border: "2px solid rgba(188, 160, 130, 0.15)",
                  borderRadius: "0.125rem",
                  padding: "1.5rem",
                  transition: "all 300ms",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#8b6946"
                  e.currentTarget.style.backgroundColor = "rgba(139, 105, 70, 0.08)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(188, 160, 130, 0.15)"
                  e.currentTarget.style.backgroundColor = "transparent"
                }}
              >
                <h3
                  style={{
                    fontWeight: 900,
                    fontSize: "1.125rem",
                    marginBottom: "1rem",
                    transition: "color 300ms",
                    color: "#f5f0eb",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#8b6946")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#f5f0eb")}
                >
                  {feature.title}
                </h3>
                <p
                  style={{ fontSize: "0.875rem", color: "#9d8b7a", transition: "color 300ms" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#f5f0eb")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#9d8b7a")}
                >
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        style={{
          position: "relative",
          paddingLeft: "1rem",
          paddingRight: "1rem",
          paddingTop: "8rem",
          paddingBottom: "8rem",
          borderTop: "1px solid rgba(188, 160, 130, 0.15)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            maxWidth: "48rem",
            marginLeft: "auto",
            marginRight: "auto",
            position: "relative",
            zIndex: 10,
            border: "2px solid #8b6946",
            borderRadius: "0.125rem",
            padding: "3rem",
            textAlign: "center",
            backgroundColor: "rgba(139, 105, 70, 0.08)",
          }}
        >
          <h2
            style={{
              fontSize: "3rem",
              fontWeight: 900,
              letterSpacing: "-0.02em",
              marginBottom: "2rem",
              color: "#f5f0eb",
            }}
          >
            Ready to Build?
          </h2>
          <p
            style={{
              fontSize: "1.125rem",
              color: "#9d8b7a",
              fontWeight: 300,
              maxWidth: "40rem",
              marginLeft: "auto",
              marginRight: "auto",
              marginBottom: "2rem",
            }}
          >
            Join the community of DIY builders who've ditched overpriced systems and embraced open-source innovation.
          </p>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              justifyContent: "center",
              paddingTop: "1rem",
            }}
          >
            <button
              onClick={() => window.open("https://github.com/gopro2027/ArduinoAirSuspensionController", "_blank")}
              style={{
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
                border: "none",
                cursor: "pointer",
                transition: "transform 300ms",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                margin: "0 auto",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <Github size={16} />
              View on GitHub
            </button>
            <button
              onClick={() => window.open("https://oasman.dev/docs", "_blank")}
              style={{
                border: "2px solid #8b6946",
                color: "#8b6946",
                fontWeight: 900,
                textTransform: "uppercase",
                fontSize: "0.875rem",
                letterSpacing: "0.05em",
                paddingLeft: "2rem",
                paddingRight: "2rem",
                paddingTop: "1rem",
                paddingBottom: "1rem",
                borderRadius: "0.125rem",
                backgroundColor: "transparent",
                cursor: "pointer",
                transition: "background-color 300ms",
                margin: "0 auto",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(139, 105, 70, 0.1)")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              Read Docs
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid rgba(188, 160, 130, 0.15)",
          backgroundColor: "rgba(42, 34, 24, 0.5)",
          paddingLeft: "1rem",
          paddingRight: "1rem",
          paddingTop: "3rem",
          paddingBottom: "3rem",
        }}
      >
        <div style={{ maxWidth: "80rem", marginLeft: "auto", marginRight: "auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "3rem",
              marginBottom: "3rem",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", width: "fit-content" }}>
                <div
                  style={{
                    width: "1.5rem",
                    height: "1.5rem",
                    background: "linear-gradient(to bottom right, #8b6946, #bca082)",
                    borderRadius: "0.125rem",
                  }}
                />
                <span style={{ fontWeight: 900, color: "#bca082" }}>OAS-MAN</span>
              </div>
              <p style={{ fontSize: "0.75rem", color: "#9d8b7a", lineHeight: 1.6 }}>
                Open source air suspension. Built by the community, for the community. Est. 2022.
              </p>
            </div>
            {[
              { title: "Project", links: [["GitHub", "https://github.com/gopro2027/ArduinoAirSuspensionController"], ["Documentation", "https://oasman.dev/docs"]] },
              { title: "Community", links: [["Discord", "https://discord.gg/pUf7FmHKpg"], ["Support", "https://www.patreon.com/c/oasman"]] },
              { title: "Links", links: [["OASMan.dev", "https://oasman.dev"], ["Software Update", "https://oasman.dev/flash"]] },
            ].map((col, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <h4
                  style={{
                    fontWeight: 900,
                    textTransform: "uppercase",
                    fontSize: "0.75rem",
                    letterSpacing: "0.1em",
                    color: "#8b6946",
                  }}
                >
                  {col.title}
                </h4>
                <ul style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {col.links.map((link, j) => (
                    <li key={j}>
                      <a
                        href={link[1] as string}
                        style={{ fontSize: "0.75rem", color: "#9d8b7a", transition: "color 300ms" }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "#8b6946")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "#9d8b7a")}
                      >
                        {link[0]}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div style={{ borderTop: "1px solid rgba(188, 160, 130, 0.15)", paddingTop: "2rem", textAlign: "center" }}>
            <p
              style={{
                fontSize: "0.75rem",
                color: "#9d8b7a",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                fontWeight: 900,
              }}
            >
              © 2025 OAS-Man. 100% open source. Community driven.
            </p>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  )
}
