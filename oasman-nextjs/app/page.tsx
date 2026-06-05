"use client"

import { useEffect, useRef, useState } from "react"
import type { LucideIcon } from "lucide-react"
import dynamic from "next/dynamic"
import {
  Github,
  Zap,
  Brain,
  Target,
  Unlock,
  Cpu,
  Gamepad2,
  Bluetooth,
  Gauge,
  BatteryCharging,
  Wifi,
  SlidersHorizontal,
  Wrench,
  Rocket,
  BookOpen,
  Car,
  Globe,
  Leaf,
  Users,
  HeartHandshake,
  DollarSign,
  Package,
  MessageCircle,
  ChevronRight,
} from "lucide-react"
import InstagramEmbed from "./InstagramEmbed"
import PrintfulHatEmbed from "./PrintfulHatEmbed"
import ControllerEmulator from "./ControllerEmulator"

// Three.js uses browser APIs, so this must be client-only
const PCBViewer = dynamic(() => import("./PCBViewer"), {
  ssr: false,
  loading: () => (
    <div
      className="shimmer-placeholder"
      style={{
        width: "100%",
        height: "520px",
        borderRadius: "24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span
        style={{
          fontSize: "0.8125rem",
          color: "rgba(62,44,35,0.55)",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
        }}
      >
        Loading model…
      </span>
    </div>
  ),
})

/* ─── Scroll reveal hook ─── */
function useReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible")
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    )
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}

/* ─── Reusable icon badge ─── */
function IconBadge({
  icon: Icon,
  size = "md",
  solid = false,
}: {
  icon: LucideIcon
  size?: "md" | "lg"
  solid?: boolean
}) {
  return (
    <span
      className={`icon-badge icon-badge-${size}${solid ? " icon-badge-solid" : ""}`}
    >
      <Icon size={size === "lg" ? 26 : 20} strokeWidth={1.75} />
    </span>
  )
}

/* ─── Benchmark bar ─── */
function BenchBar({
  label,
  value,
  maxValue,
  accent = false,
}: {
  label: string
  value: number
  maxValue: number
  accent?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [animated, setAnimated] = useState(false)
  const pct = Math.round((value / maxValue) * 100)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimated(true)
          obs.disconnect()
        }
      },
      { threshold: 0.5 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={ref} style={{ marginBottom: "1.5rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: "0.5rem",
        }}
      >
        <span
          style={{
            fontSize: "0.9375rem",
            color: accent ? "var(--oasman-gold)" : "var(--oasman-text-secondary)",
            fontWeight: accent ? 600 : 400,
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontSize: accent ? "1.125rem" : "0.9375rem",
            color: accent ? "var(--oasman-gold)" : "var(--oasman-text-tertiary)",
            fontWeight: accent ? 700 : 500,
          }}
        >
          ${value.toLocaleString()}
        </span>
      </div>
      <div className="bench-bar-track">
        <div
          className="bench-bar-fill"
          style={{
            width: animated ? `${pct}%` : "0%",
            background: accent
              ? "linear-gradient(90deg, #d35f1c, #e76f2e)"
              : "rgba(74,48,26,0.1)",
          }}
        />
      </div>
    </div>
  )
}

/* ─── AI learning visualization ─── */
function AILearningVisual() {
  const bars = [0.55, 0.7, 0.85, 0.95, 0.78, 0.9, 0.99]
  return (
    <div
      style={{
        background: "radial-gradient(circle at 50% 0%, #fdf8ee, #f9f1e2)",
        border: "1px solid rgba(74,48,26,0.12)",
        borderRadius: "16px",
        padding: "1.5rem",
        height: "100%",
        minHeight: "300px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1.5rem",
        }}
      >
        <span
          style={{
            fontSize: "0.8125rem",
            fontWeight: 600,
            color: "var(--oasman-text-secondary)",
          }}
        >
          System learning
        </span>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.375rem",
            fontSize: "0.75rem",
            color: "var(--oasman-gold)",
          }}
        >
          <span
            style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              background: "var(--oasman-gold)",
              animation: "pulse 2s ease-in-out infinite",
            }}
          />
          Live
        </span>
      </div>

      {/* Animated learning bars */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "flex-end",
          gap: "0.5rem",
          minHeight: "120px",
        }}
      >
        {bars.map((h, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: "100%",
              display: "flex",
              alignItems: "flex-end",
            }}
          >
            <div
              className="ai-bar"
              style={{
                height: `${h * 100}%`,
                animationDelay: `${i * 0.22}s`,
              }}
            />
          </div>
        ))}
      </div>

      {/* Accuracy readout */}
      <div
        style={{
          marginTop: "1.5rem",
          paddingTop: "1.25rem",
          borderTop: "1px solid rgba(74,48,26,0.12)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "2rem",
              fontWeight: 700,
              color: "#3e2c23",
              lineHeight: 1,
            }}
          >
            99.2%
          </div>
          <div
            style={{
              fontSize: "0.75rem",
              color: "var(--oasman-text-tertiary)",
              marginTop: "0.25rem",
            }}
          >
            Preset accuracy
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div
            style={{
              fontSize: "2rem",
              fontWeight: 700,
              color: "var(--oasman-gold)",
              lineHeight: 1,
            }}
          >
            0
          </div>
          <div
            style={{
              fontSize: "0.75rem",
              color: "var(--oasman-text-tertiary)",
              marginTop: "0.25rem",
            }}
          >
            Manual calibrations
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  useReveal()

  const [activeTab, setActiveTab] = useState(0)

  const aiTabs: {
    label: string
    title: string
    body: string
    icon: LucideIcon
  }[] = [
    {
      label: "No Calibration",
      title: "Works right out of the box.",
      body: "No initial calibration required. OAS-Man will improve preset accuracy over time as you use it.",
      icon: Zap,
    },
    {
      label: "AI Learning",
      title: "Gets better the more you use it.",
      body: "OAS-MAN automatically learns your air system's flow: your compressor, tank size, and air line layout. Every adjustment refines the next for smoother, quicker results.",
      icon: Brain,
    },
    {
      label: "Accurate Presets",
      title: "Hit your height every time.",
      body: "Dial in your ride-height presets and OAS-MAN nails them, whether you're airing out for a show or raising up to clear a driveway. OAS-Man's machine-learning presets are accurate, every time.",
      icon: Target,
    },
  ]

  return (
    <div style={{ backgroundColor: "#f5e9d8", color: "#3e2c23", minHeight: "100vh" }}>
      {/* ─── Global Nav ─── */}
      <nav className="global-nav">
        <div
          style={{
            maxWidth: "980px",
            margin: "0 auto",
            padding: "0 1.5rem",
            height: "52px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <a
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.625rem",
              textDecoration: "none",
            }}
          >
            <img
              src="/assets/oasman_logo.jpg"
              alt="OAS-MAN logo"
              width={30}
              height={30}
              style={{
                width: "30px",
                height: "30px",
                objectFit: "contain",
                borderRadius: "8px",
                mixBlendMode: "multiply",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontWeight: 700,
                fontSize: "0.9375rem",
                letterSpacing: "0.02em",
                color: "var(--oasman-text-primary)",
              }}
            >
              OAS-MAN
            </span>
          </a>
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            <a
              href="#demo"
              style={{
                fontSize: "0.8125rem",
                color: "var(--oasman-text-secondary)",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#3e2c23")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--oasman-text-secondary)")
              }
            >
              Live Demo
            </a>
            <a
              href="https://oasman.dev/docs"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: "0.8125rem",
                fontWeight: 600,
                color: "var(--oasman-gold)",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#e76f2e")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--oasman-gold)")
              }
            >
              Docs
            </a>
            <a
              href="https://github.com/gopro2027/ArduinoAirSuspensionController"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--oasman-text-secondary)", transition: "color 0.2s", display: "flex" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#3e2c23")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--oasman-text-secondary)")
              }
            >
              <Github size={18} />
            </a>
          </div>
        </div>
      </nav>

      {/* ─── Local Nav ─── */}
      <div className="local-nav">
        <div style={{ maxWidth: "980px", margin: "0 auto", padding: "0 1.5rem" }}>
          <div
            className="local-nav-links"
            style={{ display: "flex", alignItems: "stretch", gap: "0" }}
          >
            {[
              { label: "Overview", href: "#overview" },
              { label: "Features", href: "#features" },
              { label: "Specs", href: "#specs" },
              { label: "Community", href: "#community" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                style={{
                  padding: "0.875rem 1.125rem",
                  fontSize: "0.8125rem",
                  color: "var(--oasman-text-secondary)",
                  textDecoration: "none",
                  transition: "color 0.2s",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#3e2c23")}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--oasman-text-secondary)")
                }
              >
                {item.label}
              </a>
            ))}
            <a
              href="https://oasman.dev/docs"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                marginLeft: "auto",
                alignSelf: "center",
                padding: "0.4rem 1rem",
                fontSize: "0.8125rem",
                fontWeight: 500,
                color: "#fff",
                background: "linear-gradient(135deg, #d35f1c, #f1a14e)",
                borderRadius: "980px",
                textDecoration: "none",
                transition: "filter 0.2s",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(1.1)")}
              onMouseLeave={(e) => (e.currentTarget.style.filter = "brightness(1)")}
            >
              Get Started
            </a>
          </div>
        </div>
      </div>

      {/* ─── Hero ─── */}
      <section
        id="overview"
        style={{
          position: "relative",
          background: "linear-gradient(180deg, #f5e9d8 0%, #ecddc4 100%)",
          paddingTop: "5rem",
          paddingBottom: "0",
          textAlign: "center",
          overflow: "hidden",
        }}
      >
        {/* Blurred, shaded car backdrop */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "url('/assets/bluecar.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(28px) saturate(1.1)",
            transform: "scale(1.15)",
            opacity: 0.5,
            zIndex: 0,
            pointerEvents: "none",
          }}
        />
        {/* Dark shading overlay so text stays legible */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(245,233,216,0.55) 0%, rgba(245,233,216,0.42) 45%, rgba(236,221,196,0.92) 100%)",
            zIndex: 0,
            pointerEvents: "none",
          }}
        />
        <div className="hero-glow" />
        <div
          style={{
            maxWidth: "980px",
            margin: "0 auto",
            padding: "0 1.5rem",
            position: "relative",
            zIndex: 1,
          }}
        >
          <p className="apple-eyebrow reveal" style={{ marginBottom: "1rem" }}>
            Open Source · DIY · Affordable
          </p>
          <h1
            className="reveal reveal-delay-1"
            style={{
              fontSize: "clamp(3rem, 8vw, 6.5rem)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.02,
              marginBottom: "1rem",
              color: "#3e2c23",
            }}
          >
            OAS-MAN
          </h1>
          <p
            className="apple-subheadline reveal reveal-delay-2"
            style={{
              maxWidth: "560px",
              margin: "0 auto 1rem",
              fontSize: "clamp(1.375rem, 3vw, 2rem)",
              fontWeight: 400,
              lineHeight: 1.15,
              color: "#6b5444",
            }}
          >
            DIY Air Suspension,
            <br />
            For a fraction of the price.
          </p>
          <p
            className="reveal reveal-delay-3"
            style={{
              fontSize: "1.0625rem",
              color: "#6b5444",
              maxWidth: "480px",
              margin: "0 auto 2.5rem",
              lineHeight: 1.6,
            }}
          >
            DIY air suspension for under{" "}
            <span style={{ color: "var(--oasman-gold)", fontWeight: 600 }}>
              $500
            </span>
            . Open source, fully customizable, and everything the big brands
            don&apos;t want you to have.
          </p>

          <div
            className="reveal reveal-delay-4"
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap",
              marginBottom: "3.5rem",
            }}
          >
            <a
              href="https://oasman.dev/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              View Build Instructions
              <ChevronRight size={15} />
            </a>
            <a
              href="https://github.com/gopro2027/ArduinoAirSuspensionController"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              <Github size={16} />
              View on GitHub
            </a>
          </div>

          {/* PCB 3D Model */}
          <div className="reveal" style={{ maxWidth: "860px", margin: "0 auto" }}>
            <PCBViewer />
          </div>
          <p
            style={{
              fontSize: "0.8125rem",
              color: "var(--oasman-text-tertiary)",
              marginTop: "0.5rem",
              paddingBottom: "1rem",
            }}
          >
            The OAS-MAN manifold board. Scroll to explore.
          </p>
        </div>
      </section>

      {/* ─── Hero stat strip ─── */}
      <section
        style={{
          background: "#ecddc4",
          padding: "3rem 1.5rem",
          borderBottom: "1px solid rgba(74,48,26,0.1)",
        }}
      >
        <div
          className="stat-strip reveal"
          style={{
            maxWidth: "820px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1rem",
          }}
        >
          {[
            { value: "67%", label: "Cheaper than the competition" },
            { value: "100%", label: "Open source, forever" },
            { value: "<$499", label: "Total build cost" },
          ].map((stat) => (
            <div key={stat.label} className="stat-strip-item">
              <div
                style={{
                  fontSize: "clamp(2rem, 5vw, 2.75rem)",
                  fontWeight: 700,
                  color: "var(--oasman-gold)",
                  letterSpacing: "-0.02em",
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: "0.8125rem",
                  color: "var(--oasman-text-secondary)",
                  marginTop: "0.25rem",
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── "Supercharged by" ─── */}
      <section id="specs" style={{ background: "#f9f1e2", padding: "6rem 1.5rem" }}>
        <div style={{ maxWidth: "980px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <h2 className="apple-headline reveal" style={{ marginBottom: "0.75rem" }}>
              Supercharged
            </h2>
            <p
              className="apple-headline reveal reveal-delay-1"
              style={{ color: "var(--oasman-gold)" }}
            >
              Manifold &amp; Controller.
            </p>
          </div>

          <div
            className="chip-cards-grid reveal"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1.5rem",
              marginBottom: "4rem",
            }}
          >
            {/* Manifold card */}
            <div className="chip-card">
              <div
                className="section-eyebrow-row"
                style={{ marginBottom: "1.25rem" }}
              >
                <IconBadge icon={Cpu} />
                <span className="apple-eyebrow">Manifold</span>
              </div>
              <h3
                style={{
                  fontSize: "1.75rem",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  color: "#3e2c23",
                  marginBottom: "1.5rem",
                  lineHeight: 1.1,
                }}
              >
                The heart of your system.
              </h3>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: "0 0 1.5rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.625rem",
                }}
              >
                {[
                  "4-corner independent valve control",
                  "Pressure or Height sensor compatible",
                  "Compressor control",
                  "And more!",
                ].map((item) => (
                  <li
                    key={item}
                    style={{
                      fontSize: "0.9375rem",
                      color: "var(--oasman-text-secondary)",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0.5rem",
                    }}
                  >
                    <span style={{ color: "var(--oasman-gold)", flexShrink: 0 }}>·</span>
                    {item}
                  </li>
                ))}
              </ul>
              <div
                style={{
                  borderTop: "1px solid rgba(74,48,26,0.12)",
                  paddingTop: "1.25rem",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "1.25rem",
                }}
              >
                {[
                  ["No soldering required", "Pre-built"],
                  ["Corners", "4"],
                  ["Open source", "100%"],
                ].map(([k, v]) => (
                  <div key={k}>
                    <div
                      style={{
                        fontSize: "1.25rem",
                        fontWeight: 700,
                        color: "var(--oasman-gold)",
                      }}
                    >
                      {v}
                    </div>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--oasman-text-tertiary)",
                      }}
                    >
                      {k}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Controller card */}
            <div className="chip-card">
              <div
                className="section-eyebrow-row"
                style={{ marginBottom: "1.25rem" }}
              >
                <IconBadge icon={Gamepad2} />
                <span className="apple-eyebrow">Controller</span>
              </div>
              <h3
                style={{
                  fontSize: "1.75rem",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  color: "#3e2c23",
                  marginBottom: "1.5rem",
                  lineHeight: 1.1,
                }}
              >
                You choose your control.
              </h3>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: "0 0 1.5rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.625rem",
                }}
              >
                {[
                  "Android/IOS mobile apps",
                  "Dedicated touch screen remote",
                  "PS3, PS4, Xbox, Switch, Wii gamepad support",
                  "Key fob support",
                ].map((item) => (
                  <li
                    key={item}
                    style={{
                      fontSize: "0.9375rem",
                      color: "var(--oasman-text-secondary)",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0.5rem",
                    }}
                  >
                    <span style={{ color: "var(--oasman-gold)", flexShrink: 0 }}>·</span>
                    {item}
                  </li>
                ))}
              </ul>
              <div
                style={{
                  borderTop: "1px solid rgba(74,48,26,0.12)",
                  paddingTop: "1.25rem",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "1.25rem",
                }}
              >
                {[
                  ["Wireless", "BLE"],
                  ["Presets", "5"],
                  ["Gamepads supported", "10+"],
                ].map(([k, v]) => (
                  <div key={k}>
                    <div
                      style={{
                        fontSize: "1.25rem",
                        fontWeight: 700,
                        color: "var(--oasman-gold)",
                      }}
                    >
                      {v}
                    </div>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--oasman-text-tertiary)",
                      }}
                    >
                      {k}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <p
            className="reveal"
            style={{
              maxWidth: "680px",
              margin: "0 auto",
              fontSize: "1.0625rem",
              color: "var(--oasman-text-secondary)",
              lineHeight: 1.7,
              textAlign: "center",
            }}
          >
            Built by enthusiasts, for enthusiasts, with no corporate nonsense.
            OAS-MAN pairs proven open-source hardware with AI-powered presets,
            wireless control, and affordable, off-the-shelf parts. Revolutionary,
            not evolutionary.
          </p>
        </div>
      </section>

      {/* ─── Price comparison ─── */}
      <section
        style={{
          background: "#f5e9d8",
          padding: "6rem 1.5rem",
          borderTop: "1px solid rgba(74,48,26,0.1)",
        }}
      >
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>
          <p
            className="apple-eyebrow reveal"
            style={{ marginBottom: "0.75rem", textAlign: "center" }}
          >
            Choose your build
          </p>
          <h2
            className="apple-headline reveal reveal-delay-1"
            style={{ textAlign: "center", marginBottom: "0.75rem" }}
          >
            67% cheaper than
            <br />
            the competition.
          </h2>
          <p
            className="apple-body reveal reveal-delay-2"
            style={{ textAlign: "center", marginBottom: "3.5rem" }}
          >
            Why pay $1,500 for a locked, non-repairable ecosystem when you can
            build your own fully open system for a fraction of the cost?
          </p>

          <div className="reveal">
            <p
              style={{
                fontSize: "0.75rem",
                color: "var(--oasman-text-tertiary)",
                marginBottom: "1.5rem",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Total system cost
            </p>
            <BenchBar label="Competitor #1" value={1500} maxValue={1600} />
            <BenchBar label="Competitor #2" value={1000} maxValue={1600} />
            <BenchBar label="OAS-MAN" value={499} maxValue={1600} accent />
            <p
              style={{
                fontSize: "0.75rem",
                color: "var(--oasman-text-tertiary)",
                marginTop: "1rem",
                lineHeight: 1.5,
              }}
            >
              Estimated build cost varies based on parts sourced. OAS-MAN
              electronics only; air bags, compressor, and tank sold separately.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Smart Suspension / AI ─── */}
      <section
        id="features"
        style={{
          background: "#ecddc4",
          padding: "6rem 1.5rem",
          borderTop: "1px solid rgba(74,48,26,0.1)",
        }}
      >
        <div style={{ maxWidth: "980px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h2 className="apple-headline reveal" style={{ marginBottom: "0.5rem" }}>
              Smart Suspension.
            </h2>
            <p
              className="apple-headline reveal reveal-delay-1"
              style={{ color: "var(--oasman-gold)", marginBottom: "1.25rem" }}
            >
              Air, simplified.
            </p>
            <p
              className="apple-body reveal reveal-delay-2"
              style={{ maxWidth: "560px", margin: "0 auto" }}
            >
              Innovative machine-learning algorithms learn your air system&apos;s
              flow to optimize for smooth, quick, accurate presets,
              automatically.
            </p>
          </div>

          <div
            className="reveal"
            style={{
              display: "flex",
              gap: "0.5rem",
              justifyContent: "center",
              flexWrap: "wrap",
              marginBottom: "2.5rem",
            }}
          >
            {aiTabs.map((tab, i) => (
              <button
                key={tab.label}
                className={`tab-btn${activeTab === i ? " active" : ""}`}
                onClick={() => setActiveTab(i)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div
            className="ai-card reveal"
            style={{
              background: "#fdf8ee",
              border: "1px solid rgba(74,48,26,0.12)",
              borderRadius: "20px",
              padding: "2.5rem",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "2.5rem",
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ marginBottom: "1.25rem" }}>
                <IconBadge icon={aiTabs[activeTab].icon} size="lg" solid />
              </div>
              <h3
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  color: "#3e2c23",
                  marginBottom: "0.75rem",
                  lineHeight: 1.2,
                }}
              >
                {aiTabs[activeTab].title}
              </h3>
              <p
                style={{
                  fontSize: "1rem",
                  color: "var(--oasman-text-secondary)",
                  lineHeight: 1.65,
                }}
              >
                {aiTabs[activeTab].body}
              </p>
            </div>
            <AILearningVisual />
          </div>

          {/* Open source callout */}
          <div
            className="reveal"
            style={{
              marginTop: "2rem",
              background: "#fdf8ee",
              border: "1px solid rgba(231,111,46,0.22)",
              borderRadius: "20px",
              padding: "2rem 2.5rem",
              display: "flex",
              alignItems: "flex-start",
              gap: "1.5rem",
            }}
          >
            <IconBadge icon={Unlock} size="lg" solid />
            <div>
              <h4
                style={{
                  fontSize: "1.125rem",
                  fontWeight: 700,
                  color: "#3e2c23",
                  marginBottom: "0.375rem",
                }}
              >
                Open source means no black boxes.
              </h4>
              <p
                style={{
                  fontSize: "0.9375rem",
                  color: "var(--oasman-text-secondary)",
                  lineHeight: 1.6,
                }}
              >
                Every line of OAS-MAN&apos;s firmware is public. Audit it, modify
                it, improve it. No proprietary firmware that bricks when the
                company goes under.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Design / Wireless (real controller photo) ─── */}
      <section
        style={{
          background: "#f9f1e2",
          padding: "6rem 1.5rem",
          borderTop: "1px solid rgba(74,48,26,0.1)",
        }}
      >
        <div style={{ maxWidth: "980px", margin: "0 auto" }}>
          <p className="apple-eyebrow reveal" style={{ marginBottom: "0.75rem" }}>
            Design
          </p>
          <h2 className="apple-headline reveal reveal-delay-1" style={{ marginBottom: "0.5rem" }}>
            Leave the wires in the 90's
          </h2>
          <p
            className="apple-headline reveal reveal-delay-2"
            style={{ color: "var(--oasman-gold)", marginBottom: "4rem" }}
          >
            Wireless at the core
          </p>

          <div
            className="two-col-grid reveal"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "3rem",
              alignItems: "center",
              marginBottom: "4rem",
            }}
          >
            <div
              style={{
                borderRadius: "20px",
                overflow: "hidden",
                background: "#ecddc4",
                border: "1px solid rgba(74,48,26,0.1)",
              }}
            >
              <img
                src="/assets/controller_photo.png"
                alt="OAS-MAN wireless touch screen controller"
                style={{
                  width: "100%",
                  display: "block",
                  objectFit: "cover",
                }}
              />
            </div>
            <div>
              <h3
                style={{
                  fontSize: "1.75rem",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  color: "#3e2c23",
                  marginBottom: "1rem",
                  lineHeight: 1.15,
                }}
              >
                Step into the future.
              </h3>
              <p
                style={{
                  fontSize: "1rem",
                  color: "var(--oasman-text-secondary)",
                  lineHeight: 1.65,
                  marginBottom: "1.75rem",
                }}
              >
                OAS-MAN is a fully wireless system. BLE technology delivers a
                quick, responsive connection between your controller and
                manifold, making it easier to install and easier to use. Control your
                vehicle from inside or out on the dedicated touch screen remote.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {[
                  "Fully wireless BLE connection",
                  "Dedicated touch screen remote",
                  "Responsive, real-time adjustments",
                ].map((item) => (
                  <div
                    key={item}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      fontSize: "0.9375rem",
                      color: "var(--oasman-text-secondary)",
                    }}
                  >
                    <span
                      style={{
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        background: "rgba(231,111,46,0.2)",
                        border: "1px solid rgba(231,111,46,0.35)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        fontSize: "0.625rem",
                        color: "var(--oasman-gold)",
                      }}
                    >
                      ✓
                    </span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Affordable & repairable callout */}
          <div
            className="callout-grid reveal"
            style={{
              background: "#fdf8ee",
              borderRadius: "20px",
              padding: "2.5rem",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "2rem",
              alignItems: "center",
            }}
          >
            <div>
              <h3
                style={{
                  fontSize: "1.375rem",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  color: "#3e2c23",
                  marginBottom: "0.75rem",
                }}
              >
                Affordable and repairable.
              </h3>
              <p
                style={{
                  fontSize: "0.9375rem",
                  color: "var(--oasman-text-secondary)",
                  lineHeight: 1.65,
                }}
              >
                Sensor breaks? That&apos;s a $10 replacement, not a $1,000
                module. Every component is off-the-shelf, documented, and
                swappable. No company to go under, no proprietary parts.
              </p>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              {[
                { val: "$10", label: "Sensor replacement" },
                { val: "100%", label: "Modular design" },
                { val: "0", label: "Proprietary parts" },
                { val: "∞", label: "Community support" },
              ].map(({ val, label }) => (
                <div
                  key={label}
                  style={{
                    background: "#fdf8ee",
                    borderRadius: "12px",
                    padding: "1rem",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: 700,
                      color: "var(--oasman-gold)",
                      marginBottom: "0.25rem",
                    }}
                  >
                    {val}
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--oasman-text-tertiary)",
                    }}
                  >
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Interactive controller emulator ─── */}
      <section
        id="demo"
        style={{
          background: "#f5e9d8",
          padding: "6rem 1.5rem",
          borderTop: "1px solid rgba(74,48,26,0.1)",
        }}
      >
        <div style={{ maxWidth: "980px", margin: "0 auto", textAlign: "center" }}>
          <p className="apple-eyebrow reveal" style={{ marginBottom: "0.75rem" }}>
            Live demo
          </p>
          <h2 className="apple-headline reveal" style={{ marginBottom: "0.5rem" }}>
            Try the controller.
          </h2>
          <p
            className="apple-headline reveal reveal-delay-1"
            style={{ color: "var(--oasman-gold)", marginBottom: "1.25rem" }}
          >
            Right in your browser.
          </p>
          <div
            className="demo-layout reveal"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "3rem",
              alignItems: "center",
              textAlign: "left",
            }}
          >
            {/* Description — spans both cols on desktop (above), reordered on mobile */}
            <p
              className="apple-body demo-description"
              style={{
                gridColumn: "1 / -1",
                textAlign: "center",
                maxWidth: "560px",
                margin: "0 auto 0.5rem",
              }}
            >
              This is a working replica of the OAS-MAN touch screen remote. Air
              each corner up or down on Home, save and load up to five height
              presets, and browse every setting, exactly like the real firmware.
            </p>
            <div className="demo-controller" style={{ display: "flex", justifyContent: "center" }}>
              <ControllerEmulator />
            </div>
            <div className="demo-bullets">
              <h3
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  color: "#3e2c23",
                  marginBottom: "0.75rem",
                }}
              >
                Three tabs. Full control.
              </h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.25rem",
                }}
              >
                {[
                  {
                    title: "Home",
                    desc: "Hold any pill to air a corner, an axle, or the whole front/rear up or down in real time.",
                  },
                  {
                    title: "Presets",
                    desc: "Tap 1-5 to set your stance, then Save or Load. Watch the car rise and drop to each height.",
                  },
                  {
                    title: "Settings",
                    desc: "Browse all ten configuration sections, from AI learning to theme colors and Wi-Fi updates.",
                  },
                ].map((item) => (
                  <div key={item.title} style={{ display: "flex", gap: "0.75rem" }}>
                    <span
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        background: "var(--oasman-gold)",
                        marginTop: "0.5rem",
                        flexShrink: 0,
                      }}
                    />
                    <div>
                      <div
                        style={{
                          fontSize: "1rem",
                          fontWeight: 700,
                          color: "#3e2c23",
                          marginBottom: "0.2rem",
                        }}
                      >
                        {item.title}
                      </div>
                      <p
                        style={{
                          fontSize: "0.9375rem",
                          color: "var(--oasman-text-secondary)",
                          lineHeight: 1.6,
                        }}
                      >
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Gaming controllers ─── */}
      <section
        style={{
          background: "#ecddc4",
          padding: "6rem 1.5rem",
          borderTop: "1px solid rgba(74,48,26,0.1)",
        }}
      >
        <div style={{ maxWidth: "980px", margin: "0 auto" }}>
          <div
            className="two-col-grid reveal"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "4rem",
              alignItems: "center",
            }}
          >
            <div>
              <div
                className="section-eyebrow-row"
                style={{ marginBottom: "1rem" }}
              >
                <IconBadge icon={Gamepad2} />
                <span className="apple-eyebrow">Unique Features</span>
              </div>
              <h2
                style={{
                  fontSize: "clamp(2rem, 4vw, 3rem)",
                  fontWeight: 700,
                  letterSpacing: "-0.025em",
                  color: "#3e2c23",
                  marginBottom: "1rem",
                  lineHeight: 1.1,
                }}
              >
                Use gaming{" "}
                <span style={{ color: "var(--oasman-gold)" }}>controllers.</span>
              </h2>
              <p
                style={{
                  fontSize: "1rem",
                  color: "var(--oasman-text-secondary)",
                  lineHeight: 1.65,
                  marginBottom: "2rem",
                }}
              >
                Your car is unique, so your controller should be too. Control
                your suspension with a PS4, Xbox, Wii, Switch, or any compatible
                gamepad. Real-time adjustments, fully wireless.
              </p>
              <div
                style={{
                  borderTop: "1px solid rgba(74,48,26,0.12)",
                  paddingTop: "1.5rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                {[
                  "PS3, PS4, Xbox, Wii, Switch, and more",
                  "Joystick air flow control",
                ].map((item) => (
                  <div
                    key={item}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      fontSize: "0.9375rem",
                      color: "var(--oasman-text-secondary)",
                    }}
                  >
                    <span
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        background: "var(--oasman-gold)",
                        flexShrink: 0,
                      }}
                    />
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <InstagramEmbed />
            </div>
          </div>
        </div>
      </section>

      {/* ─── Endless Customization ─── */}
      <section
        style={{
          background: "#f5e9d8",
          padding: "6rem 1.5rem",
          borderTop: "1px solid rgba(74,48,26,0.1)",
        }}
      >
        <div style={{ maxWidth: "980px", margin: "0 auto" }}>
          <div style={{ marginBottom: "3rem" }}>
            <h2 className="apple-headline reveal" style={{ marginBottom: "0.5rem" }}>
              Endless customization.
            </h2>
            <p className="apple-body reveal reveal-delay-1" style={{ maxWidth: "520px" }}>
              Built for every build: restomods, street cars, and track machines.
              OAS-MAN adapts to how you drive.
            </p>
          </div>

          <div
            className="features-list-grid reveal"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "1rem",
            }}
          >
            {[
              {
                icon: Wifi,
                title: "Fully Wireless",
                desc: "Touch screen, phone, or any gaming controller, no wires needed.",
              },
              {
                icon: SlidersHorizontal,
                title: "Your Rules",
                desc: "Customize how you want, using the parts you want.",
              },
              {
                icon: Unlock,
                title: "Never Locked In",
                desc: "Proprietary? No way. You own your system completely.",
              },
              {
                icon: Wrench,
                title: "Affordable Repairs",
                desc: "Sensor breaks? $10 replacement, not $1,000.",
              },
              {
                icon: Rocket,
                title: "Future Proof",
                desc: "Community-driven development. No company to go under.",
              },
              {
                icon: BookOpen,
                title: "Well Documented",
                desc: "Built by enthusiasts, with full guides and support.",
              },
              {
                icon: Car,
                title: "Any Build Works",
                desc: "Restomods, street cars, track builds, all supported.",
              },
              {
                icon: Brain,
                title: "AI Learning",
                desc: "Self-calibrating algorithms adapt to your air system.",
              },
              {
                icon: Globe,
                title: "Open Source",
                desc: "Every line of code is public. Fork it. Improve it. Own it.",
              },
            ].map((feature) => (
              <div key={feature.title} className="feature-card">
                <div style={{ marginBottom: "1rem" }}>
                  <IconBadge icon={feature.icon} />
                </div>
                <h3
                  style={{
                    fontSize: "1.0625rem",
                    fontWeight: 700,
                    color: "#3e2c23",
                    marginBottom: "0.5rem",
                  }}
                >
                  {feature.title}
                </h3>
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--oasman-text-secondary)",
                    lineHeight: 1.55,
                  }}
                >
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Values ─── */}
      <section
        style={{
          background: "#ecddc4",
          padding: "5rem 1.5rem",
          borderTop: "1px solid rgba(74,48,26,0.1)",
        }}
      >
        <div style={{ maxWidth: "980px", margin: "0 auto" }}>
          <h2
            className="apple-headline reveal"
            style={{ textAlign: "center", marginBottom: "3rem" }}
          >
            Built for enthusiasts, not shareholders.
          </h2>
          <div
            className="grid-3"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "1.5rem",
            }}
          >
            {[
              {
                icon: Leaf,
                title: "Open source, forever.",
                desc: "We're committed to keeping OAS-MAN fully open source, forever. No paywalls, no gated firmware. Protected by GNU GPL v3",
              },
              {
                icon: Users,
                title: "Community first.",
                desc: "Discord and GitHub: the worldwide OAS-MAN community is what makes this project thrive. Everyone builds together.",
              },
              {
                icon: HeartHandshake,
                title: "Accessible by design.",
                desc: "Good air suspension shouldn't be a luxury. OAS-MAN exists to make air suspension financially accessible to everyone.",
              },
            ].map((v) => (
              <div
                key={v.title}
                className="reveal"
                style={{
                  background: "#fdf8ee",
                  border: "1px solid rgba(74,48,26,0.1)",
                  borderRadius: "18px",
                  padding: "2rem",
                }}
              >
                <div style={{ marginBottom: "1.25rem" }}>
                  <IconBadge icon={v.icon} size="lg" />
                </div>
                <h3
                  style={{
                    fontSize: "1.0625rem",
                    fontWeight: 700,
                    color: "#3e2c23",
                    marginBottom: "0.625rem",
                  }}
                >
                  {v.title}
                </h3>
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--oasman-text-secondary)",
                    lineHeight: 1.6,
                  }}
                >
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Community CTA ─── */}
      <section
        id="community"
        style={{
          background: "#f5e9d8",
          padding: "6rem 1.5rem",
          borderTop: "1px solid rgba(74,48,26,0.1)",
        }}
      >
        <div style={{ maxWidth: "620px", margin: "0 auto", textAlign: "center" }}>
          <h2 className="apple-headline reveal" style={{ marginBottom: "1rem" }}>
            Ready to build?
          </h2>
          <p className="apple-body reveal reveal-delay-1" style={{ marginBottom: "2.5rem" }}>
            Join the community of DIY builders who&apos;ve ditched overpriced
            systems and embraced open-source innovation. Everything you need is
            on GitHub.
          </p>
          <div
            className="reveal reveal-delay-2"
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <a
              href="https://oasman.dev/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              View Build Instructions
              <ChevronRight size={15} />
            </a>
            <a
              href="https://github.com/gopro2027/ArduinoAirSuspensionController"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              <Github size={16} />
              View on GitHub
            </a>
          </div>

          
        </div>
      </section>

      {/* ─── Merch ─── */}
      <PrintfulHatEmbed />

      {/* ─── Footer ─── */}
      <footer
        style={{
          background: "#f9f1e2",
          borderTop: "1px solid rgba(74,48,26,0.1)",
          padding: "3rem 1.5rem",
        }}
      >
        <div style={{ maxWidth: "980px", margin: "0 auto" }}>
          <div
            className="footer-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1.5fr 1fr 1fr 1fr",
              gap: "2rem",
              marginBottom: "2.5rem",
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "0.875rem",
                }}
              >
                <img
                  src="/assets/oasman_logo.jpg"
                  alt="OAS-MAN logo"
                  width={24}
                  height={24}
                  style={{
                    width: "24px",
                    height: "24px",
                    objectFit: "contain",
                    borderRadius: "6px",
                    mixBlendMode: "multiply",
                  }}
                />
                <span
                  style={{
                    fontWeight: 700,
                    fontSize: "0.9375rem",
                    color: "var(--oasman-gold)",
                  }}
                >
                  OAS-MAN
                </span>
              </div>
              <p
                style={{
                  fontSize: "0.8125rem",
                  color: "var(--oasman-text-tertiary)",
                  lineHeight: 1.65,
                  maxWidth: "220px",
                }}
              >
                Open source air suspension. Built by the community, for the
                community. Est. 2022.
              </p>
            </div>

            {[
              {
                title: "Project",
                links: [
                  ["GitHub", "https://github.com/gopro2027/ArduinoAirSuspensionController"],
                  ["Documentation", "https://oasman.dev/docs"],
                  ["Software Update", "https://oasman.dev/flash"],
                ],
              },
              {
                title: "Community",
                links: [
                  ["Discord", "https://discord.gg/pUf7FmHKpg"],
                  ["Patreon", "https://www.patreon.com/c/oasman"],
                  ["Instagram", "https://www.instagram.com/oasman.co"],
                ],
              },
              {
                title: "Links",
                links: [
                  ["OASMan.dev", "https://oasman.dev"],
                  ["Merch (Hat)", "#merch"],
                  ["Docs", "https://oasman.dev/docs"],
                ],
              },
            ].map((col) => (
              <div key={col.title}>
                <h4
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: "var(--oasman-text-primary)",
                    letterSpacing: "0.04em",
                    marginBottom: "0.875rem",
                  }}
                >
                  {col.title}
                </h4>
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                  }}
                >
                  {col.links.map(([label, href]) => (
                    <li key={label}>
                      <a
                        href={href}
                        target={href.startsWith("http") ? "_blank" : undefined}
                        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                        style={{
                          fontSize: "0.8125rem",
                          color: "var(--oasman-text-tertiary)",
                          textDecoration: "none",
                          transition: "color 0.2s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.color = "var(--oasman-gold)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.color = "var(--oasman-text-tertiary)")
                        }
                      >
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div
            style={{
              borderTop: "1px solid rgba(74,48,26,0.1)",
              paddingTop: "1.5rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "0.75rem",
            }}
          >
            <p style={{ fontSize: "0.75rem", color: "var(--oasman-text-tertiary)" }}>
              Copyright © 2025 OAS-Man. 100% open source. Community driven.
            </p>
            <div style={{ display: "flex", gap: "1.5rem" }}>
              {[
                ["OASMan.dev", "https://oasman.dev"],
                ["Discord", "https://discord.gg/pUf7FmHKpg"],
                ["GitHub", "https://github.com/gopro2027/ArduinoAirSuspensionController"],
              ].map(([label, href]) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--oasman-text-tertiary)",
                    textDecoration: "none",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "var(--oasman-gold)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "var(--oasman-text-tertiary)")
                  }
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* ─── Responsive overrides ─── */}
      <style>{`
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
          }
          .local-nav-links {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
          }
          .local-nav-links::-webkit-scrollbar {
            display: none;
          }
        }

        @media (max-width: 560px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
