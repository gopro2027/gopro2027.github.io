"use client"

import { useEffect } from "react"
import dynamic from "next/dynamic"
import { ArrowUpRight } from "lucide-react"
import InstagramEmbed from "./InstagramEmbed"
import PrintfulHatEmbed from "./PrintfulHatEmbed"
import ControllerEmulator from "./ControllerEmulator"

// Three.js uses browser APIs, so this must be client-only.
const PCBViewer = dynamic(() => import("./PCBViewer"), {
  ssr: false,
  loading: () => (
    <div
      className="shimmer-placeholder"
      style={{
        width: "100%",
        height: "var(--pcb-height)",
        borderRadius: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span className="oas-mono">Loading board…</span>
    </div>
  ),
})

const DISCORD = "https://discord.gg/pUf7FmHKpg"
const PATREON = "https://www.patreon.com/c/oasman"
const INSTAGRAM = "https://www.instagram.com/oasman.co"

/* ─── Scroll reveal ─── */
function useReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal"))

    const show = (el: Element) => {
      el.classList.add("visible")
      observer.unobserve(el)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) show(entry.target)
        })
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    )
    els.forEach((el) => observer.observe(el))

    // Safety net. IntersectionObserver stops delivering while the tab is
    // backgrounded, and a deep link (/#pricing) can land mid-page before the
    // first delivery — which would strand that content at opacity 0. Sweep
    // anything already on screen that the observer has not handled. Runs late
    // enough that the normal path still gets to animate.
    const sweep = () => {
      for (const el of els) {
        if (el.classList.contains("visible")) continue
        const r = el.getBoundingClientRect()
        if (r.top < window.innerHeight && r.bottom > 0) show(el)
      }
    }
    const timer = window.setTimeout(sweep, 900)
    window.addEventListener("load", sweep)
    document.addEventListener("visibilitychange", sweep)

    return () => {
      observer.disconnect()
      window.clearTimeout(timer)
      window.removeEventListener("load", sweep)
      document.removeEventListener("visibilitychange", sweep)
    }
  }, [])
}

/* ─── Section header ─── */
function SectionHead({
  eyebrow,
  title,
  lede,
}: {
  eyebrow: string
  title: React.ReactNode
  lede?: string
}) {
  return (
    <div style={{ marginBottom: "clamp(2.5rem, 5vw, 4rem)" }}>
      <p className="oas-eyebrow reveal">{eyebrow}</p>
      <h2
        className="oas-display oas-h2 reveal reveal-delay-1"
        style={{ marginTop: "1.25rem", maxWidth: "18ch" }}
      >
        {title}
      </h2>
      {lede && (
        <p className="oas-lede reveal reveal-delay-2" style={{ marginTop: "1.25rem" }}>
          {lede}
        </p>
      )}
    </div>
  )
}

/* ─── Spec row ─── */
function Spec({ k, v }: { k: string; v: string }) {
  return (
    <div className="oas-spec">
      <span className="oas-spec-k">{k}</span>
      <span className="oas-spec-v">{v}</span>
    </div>
  )
}

/* ─── Core feature list (the Manifold section) ─── */
const FEATURES: { title: string; body: string }[] = [
  {
    title: "Industry standard four-corner control",
    body: "Every corner gets its own valve, so no body roll.",
  },
  {
    title: "No calibration",
    body: "There is no setup routine to run before your first drive, air it up and go! OASMan is accurate out of the box, but preset speed and smoothness improves as the system learns how your air system responds.",
  },
  {
    title: "Wireless updates",
    body: "New firmware goes on over Wi-Fi via the controller. Super easy regular updates.",
  },
  {
    title: "Saved presets",
    body: "Save a height once and the system hits it accurately on command.",
  },
  {
    title: "Pressure or height level sensing",
    body: "OASMan optionally supports height sensors too for exceptionally consistent height control on those highest quality builds.",
  },
  {
    title: "Compressor control",
    body: "No separate analog sensor for the compressor required.",
  },
  {
    title: "Auxillary control",
    body: "Light bar? Water drain? Nitrous purge? You can control it through the controller with OASMan's optional auxillary output.",
  },
  {
    title: "Safety",
    body: "OASMan was thoughtfully designed with safety a top priority and has many monitoring mechanisms in place to ensure a safe drive every time. OASMan also includes various safety protocols for compliance with government regulations around the world. Your's not covered? Join the discord and we'll help you get your oasman system legal.",
  },
  {
    title: "Wireless control",
    body: "Bluetooth LE out to the touch screen remote, your Android phone, Chrome web browser, gamepad, or key fob. IOS coming soon but for now you can use our web controller on IOS devices.",
  },
  {
    title: "Innovation",
    body: "OASMan has many innovative features such as our height-sensorless weight adjustment, which will make adjustments to your bags for added or subtracted weight, such as filling up the trunk with heavy cargo, without having to use level sensors.",
  },
]

export default function Home() {
  useReveal()

  return (
    <div style={{ background: "var(--oas-void)", minHeight: "100vh" }}>
      {/* ═══ Nav ═══ */}
      <nav className="oas-nav">
        <div className="oas-wrap oas-nav-inner">
          <a href="/" className="oas-nav-brand">
            <img src="/assets/oasman_logo.jpg" alt="" width={26} height={26} />
            <span>OASMan</span>
          </a>

          <div className="oas-nav-links">
            <a className="oas-nav-link" href="#demo">
              Demo
            </a>
            <a className="oas-nav-link" href="#manifold">
              Features
            </a>
            <a className="oas-nav-link" href="#pricing">
              Pricing
            </a>
          </div>

          <div className="oas-nav-actions">
            <a className="oas-btn oas-btn-ghost oas-btn-sm" href="/controller">
              Open web controller
            </a>
            <a
              className="oas-btn oas-btn-ghost oas-btn-sm"
              href="https://oasman.dev/flash/"
            >
              Software updates
            </a>
          </div>
        </div>
      </nav>

      {/* ═══ Hero ═══ */}
      <header
        style={{
          position: "relative",
          paddingTop: "clamp(4rem, 9vw, 7rem)",
          paddingBottom: "clamp(3rem, 6vw, 5rem)",
        }}
      >
        <div className="oas-perfboard" aria-hidden="true" />
        <div className="oas-bloom" aria-hidden="true" />

        <div className="oas-wrap">
          <p className="oas-eyebrow oas-in oas-in-1">Open source air suspension</p>

          <h1 className="oas-wordmark" style={{ margin: "1.5rem 0 0" }}>
            OASMan
          </h1>

          {/* <p
            className="oas-lede oas-in oas-in-2"
            style={{ marginTop: "1.75rem", maxWidth: "44ch" }}
          >
            Worlds most advanced air suspension, fully open source.
          </p> */}

          <div
            className="oas-in oas-in-3"
            style={{ marginTop: "clamp(3rem, 6vw, 4.5rem)" }}
          >
            <PCBViewer />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "0.75rem",
                marginTop: "1rem",
              }}
            >
              <span className="oas-mono">Manifold board</span>
              <span className="oas-mono">Drag to spin · scroll to explore</span>
            </div>
          </div>
        </div>
      </header>

      {/* ═══ In a sentence ═══ */}
      <section aria-label="In a sentence" className="oas-quote-band">
        <div className="oas-wrap oas-quote reveal">
          <blockquote className="oas-quote-text">
            The most advanced air suspension software ever created.
          </blockquote>
          <p className="oas-eyebrow">by enthusiasts, for enthusiasts</p>
        </div>
      </section>

      {/* ═══ Live demo ═══ */}
      <section id="demo" className="oas-section" style={{ borderTop: 0 }}>
        <div className="oas-wrap">
          <SectionHead
            eyebrow="Live demo"
            title="Try oasman"
          />

          <div
            className="oas-demo-layout reveal"
            style={{
              display: "grid",
              gridTemplateColumns: "auto 1fr",
              gap: "clamp(2.5rem, 6vw, 5rem)",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", justifyContent: "center" }}>
              <ControllerEmulator />
            </div>

            <div>
              <h3 className="oas-h3">Full mock demo of the controller</h3>
              <div style={{ marginTop: "1.75rem" }}>
                {[
                  {
                    k: "Home",
                    v: "Hold a pill to air one corner, an axle, or the whole car up or down.",
                  },
                  {
                    k: "Presets",
                    v: "Tap 1–5 to pick a stance.",
                  },
                  {
                    k: "Settings",
                    v: "Every configuration section, from rise on start to wireless updates.",
                  },
                ].map((row) => (
                  <div
                    key={row.k}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "5.5rem 1fr",
                      gap: "1.25rem",
                      padding: "1rem 0",
                      borderTop: "1px solid var(--oas-rule)",
                    }}
                  >
                    <span className="oas-spec-k" style={{ color: "var(--oas-air)" }}>
                      {row.k}
                    </span>
                    <span className="oas-body">{row.v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Control ═══ */}
      <section className="oas-section">
        <div className="oas-wrap">
          <SectionHead
            eyebrow="Control"
            title="Leave the wires in the nineties."
          />

          <div
            className="oas-split reveal"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "clamp(2rem, 4vw, 3.5rem)",
              alignItems: "center",
            }}
          >
            <div className="oas-frame oas-split-media">
              <img
                src="/assets/controller_photo.png"
                alt="The OASMan wireless touch screen remote"
                style={{ width: "100%", display: "block" }}
              />
            </div>

            <div>
              <h3 className="oas-h3">The remote in your hand</h3>
              <p className="oas-body" style={{ margin: "1rem 0 1.75rem", maxWidth: "42ch" }}>
                A dedicated touch screen that pairs to the manifold wirelessly. Say goodbye to wired remotes.
              </p>
              <Spec k="Link" v="Bluetooth LE" />
              <Spec k="Response" v="Instantaneous" />
              <Spec k="Range" v="Works from outside the car" />
              <Spec k="Buttons" v="Dedicated quick air up button, and power button" />
              <Spec k="Case" v="Optional anodized billet aluminum case" />
            </div>
          </div>

          <div
            className="oas-split reveal"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "clamp(2rem, 4vw, 3.5rem)",
              alignItems: "center",
              marginTop: "clamp(3rem, 6vw, 5rem)",
            }}
          >
            <div>
              <h3 className="oas-h3">Or a gamepad</h3>
              <p className="oas-body" style={{ margin: "1rem 0 1.5rem", maxWidth: "42ch" }}>
                Pair a console controller and run the valves off the sticks. The funnest addition to air suspension!
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {["PS3/4/5", "Xbox One/Series X/S", "Switch", "Wii/Fit", " And More!"].map((pad) => (
                  <span key={pad} className="oas-chip">
                    {pad}
                  </span>
                ))}
              </div>
            </div>

            <div className="oas-frame" style={{ padding: "1rem" }}>
              <InstagramEmbed />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Manifold ═══ */}
      <section id="manifold" className="oas-section">
        <div className="oas-wrap">
          <SectionHead
            eyebrow="Features"
            title="Innovative features"
            lede="See why OASMan is is the best"
          />

          <div className="oas-features reveal">
            {FEATURES.map((f) => (
              <div key={f.title} className="oas-feature">
                <h3 className="oas-h3 oas-feature-title">{f.title}</h3>
                <p className="oas-body">{f.body}</p>
              </div>
            ))}
            <div id="open-source" className="oas-feature oas-feature-wide">
              <h3 className="oas-h3 oas-feature-title">Fully open source</h3>
              <p className="oas-body">
                Firmware, schematics, and board files are GPL v3 — nobody can
                take it closed later. Read exactly what the board does, change
                it, and flash your own. No licence server, no account, no
                subscription that can switch your car off. Standard parts with
                public datasheets, repairable not replaceable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Pricing ═══ */}
      <section id="pricing" className="oas-section">
        <div className="oas-wrap">
          <SectionHead
            eyebrow="Get one"
            title="HOW TO GET OASMAN"
          />

          <div
            className="oas-split reveal"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "clamp(1rem, 2vw, 1.5rem)",
            }}
          >
            <article
              className="oas-panel oas-panel-hover"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <p className="oas-mono" style={{ margin: 0 }}>
                Do it yourself
              </p>
              <div
                className="oas-num"
                style={{
                  fontSize: "clamp(2.5rem, 6vw, 3.75rem)",
                  color: "var(--oas-psi)",
                  margin: "1.125rem 0 1.25rem",
                }}
              >
                &lt;$500
              </div>
              <p className="oas-body" style={{ marginBottom: "1.75rem", maxWidth: "36ch" }}>
                Order the parts, assemble the boards, and flash the firmware.
                Everything you need is published.
              </p>
              <Spec k="Price" v="About $500 in parts" />
              <Spec k="You supply" v="Manifold system assembly" />
              <Spec k="Best for" v="Techy people or on a strict budget" />
              <div style={{ marginTop: "auto", paddingTop: "1.75rem" }}>
                <a
                  className="oas-btn oas-btn-ghost"
                  href="https://oasman.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View the documentation website
                </a>
              </div>
            </article>

            <article
              className="oas-panel oas-panel-hover"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <p className="oas-mono" style={{ margin: 0 }}>
                Prebuilt
              </p>
              <div
                className="oas-num"
                style={{
                  fontSize: "clamp(2.5rem, 6vw, 3.75rem)",
                  color: "var(--oas-mute)",
                  margin: "1.125rem 0 1.25rem",
                }}
              >
                TBD
              </div>
              <p className="oas-body" style={{ marginBottom: "1.75rem", maxWidth: "36ch" }}>
                Assembled, flashed, and tested before it ships. Wire it into the
                car and pair the remote.
              </p>
              <Spec k="Price" v="Not set yet" />
              <Spec k="You supply" v="Installation" />
              <Spec k="Best for" v="Most people" />
              <div style={{ marginTop: "auto", paddingTop: "1.75rem" }}>
                <a
                  className="oas-btn oas-btn-ghost"
                  href="https://oasman.co"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  See oasman.co
                  <ArrowUpRight size={14} strokeWidth={2} />
                </a>
              </div>
            </article>
          </div>

          <p
            className="oas-body"
            style={{ marginTop: "2rem", fontSize: "0.8125rem", maxWidth: "62ch" }}
          >
            The DIY figure covers the OASMan electronics and moves with where
            you source parts. Bags, compressor, and tank are separate either
            way.
          </p>
        </div>
      </section>

      {/* ═══ Merch ═══ */}
      <PrintfulHatEmbed />

      {/* ═══ Footer ═══ */}
      <footer
        style={{
          borderTop: "1px solid var(--oas-rule)",
          background: "var(--oas-deck)",
          paddingBlock: "clamp(3rem, 6vw, 4.5rem)",
        }}
      >
        <div className="oas-wrap">
          <div
            className="oas-footer-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1.6fr 1fr 1fr 1fr",
              gap: "2.5rem",
              marginBottom: "3rem",
            }}
          >
            <div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}
              >
                <img
                  src="/assets/oasman_logo.jpg"
                  alt=""
                  width={24}
                  height={24}
                  style={{ width: 24, height: 24, borderRadius: 5, objectFit: "contain" }}
                />
                <span
                  className="oas-display"
                  style={{ fontSize: "0.9375rem", lineHeight: 1 }}
                >
                  OASMan
                </span>
              </div>
              <p
                className="oas-body"
                style={{ marginTop: "1rem", fontSize: "0.8125rem", maxWidth: "26ch" }}
              >
                Open source air suspension. GPL v3, built in the open since
                2022.
              </p>
            </div>

            {[
              {
                title: "Community",
                links: [
                  ["Discord", DISCORD],
                  ["Patreon", PATREON],
                  ["Instagram", INSTAGRAM],
                ],
              },
              {
                title: "Explore",
                links: [
                  ["Manifold", "#manifold"],
                  ["Live demo", "#demo"],
                  ["Web controller", "/controller"],
                ],
              },
              {
                title: "Shop",
                links: [["Merch", "#merch"]],
              },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="oas-mono" style={{ color: "var(--oas-chalk)", margin: 0 }}>
                  {col.title}
                </h4>
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: "1.125rem 0 0",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                  }}
                >
                  {col.links.map(([label, href]) => (
                    <li key={label}>
                      <a
                        className="oas-nav-link"
                        href={href}
                        target={href.startsWith("http") ? "_blank" : undefined}
                        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
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
            className="oas-footer-bottom"
            style={{
              borderTop: "1px solid var(--oas-rule)",
              paddingTop: "1.75rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <p className="oas-mono" style={{ margin: 0 }}>
              © 2025 OASMan · Licensed GPL v3
            </p>
            <p className="oas-mono" style={{ margin: 0 }}>
              Built in the open
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
