"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"

/* Shared theme + small UI primitives for the web controller. */

export const THEME = {
  accent: "#4db8e2",
  accentDark: "#1c84b3",
  bg: "#0d1117",
  panel: "#161b22",
  panelAlt: "#1f262e",
  border: "#2a313a",
  text: "#e6e9ef",
  textDim: "#9aa3b2",
  good: "#4ADE80",
  warn: "#F0B429",
  bad: "#F08080",
}

export function Card({
  title,
  children,
  style,
}: {
  title?: string
  children: React.ReactNode
  style?: React.CSSProperties
}) {
  return (
    <div
      style={{
        background: THEME.panel,
        border: `1px solid ${THEME.border}`,
        borderRadius: "14px",
        padding: "1.1rem 1.2rem",
        ...style,
      }}
    >
      {title && (
        <h3
          style={{
            margin: "0 0 0.85rem",
            fontSize: "0.95rem",
            fontWeight: 700,
            color: THEME.text,
            letterSpacing: "-0.01em",
          }}
        >
          {title}
        </h3>
      )}
      {children}
    </div>
  )
}

export function Button({
  children,
  onClick,
  variant = "primary",
  disabled,
  style,
}: {
  children: React.ReactNode
  onClick?: () => void
  variant?: "primary" | "ghost" | "danger"
  disabled?: boolean
  style?: React.CSSProperties
}) {
  const palette =
    variant === "primary"
      ? { bg: THEME.accent, border: THEME.accentDark, color: "#06222f" }
      : variant === "danger"
      ? { bg: "transparent", border: THEME.bad, color: THEME.bad }
      : { bg: THEME.panelAlt, border: THEME.border, color: THEME.text }
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: "0.5rem 0.9rem",
        borderRadius: "9px",
        background: palette.bg,
        border: `1px solid ${palette.border}`,
        color: palette.color,
        fontSize: "0.8rem",
        fontWeight: 600,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.45 : 1,
        transition: "filter 0.15s ease, opacity 0.15s ease",
        ...style,
      }}
    >
      {children}
    </button>
  )
}

export function Toggle({
  on,
  onChange,
  disabled,
}: {
  on: boolean
  onChange: (v: boolean) => void
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      aria-pressed={on}
      disabled={disabled}
      onClick={() => onChange(!on)}
      style={{
        position: "relative",
        width: "44px",
        height: "24px",
        borderRadius: "999px",
        border: "none",
        background: on ? THEME.accent : "#39414c",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        flexShrink: 0,
        transition: "background 0.2s ease",
      }}
    >
      <span
        style={{
          position: "absolute",
          top: "2px",
          left: on ? "22px" : "2px",
          width: "20px",
          height: "20px",
          borderRadius: "50%",
          background: "#fff",
          transition: "left 0.2s ease",
        }}
      />
    </button>
  )
}

export function Row({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1rem",
        padding: "0.5rem 0",
        borderBottom: `1px solid rgba(255,255,255,0.05)`,
      }}
    >
      <span style={{ fontSize: "0.82rem", color: THEME.text }}>{label}</span>
      {children}
    </div>
  )
}

export function NumberField({
  value,
  onChange,
  min,
  max,
  disabled,
  width = "5.5rem",
}: {
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
  disabled?: boolean
  width?: string
}) {
  return (
    <input
      type="number"
      value={Number.isFinite(value) ? value : 0}
      min={min}
      max={max}
      disabled={disabled}
      onChange={(e) => onChange(Number(e.target.value))}
      style={{
        width,
        background: "#0c1014",
        border: `1px solid ${THEME.border}`,
        borderRadius: "7px",
        color: THEME.text,
        fontSize: "0.8rem",
        padding: "0.35rem 0.5rem",
        textAlign: "right",
      }}
    />
  )
}

export function TextField({
  value,
  onChange,
  placeholder,
  maxLength,
  disabled,
  width = "10rem",
  type = "text",
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  maxLength?: number
  disabled?: boolean
  width?: string
  type?: string
}) {
  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      maxLength={maxLength}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width,
        background: "#0c1014",
        border: `1px solid ${THEME.border}`,
        borderRadius: "7px",
        color: THEME.text,
        fontSize: "0.8rem",
        padding: "0.35rem 0.5rem",
      }}
    />
  )
}

export function StatusPill({
  label,
  value,
  tone = "neutral",
}: {
  label: string
  value: string
  tone?: "neutral" | "good" | "bad" | "warn"
}) {
  const color =
    tone === "good"
      ? THEME.good
      : tone === "bad"
      ? THEME.bad
      : tone === "warn"
      ? THEME.warn
      : THEME.accent
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.15rem",
        background: THEME.panelAlt,
        border: `1px solid ${THEME.border}`,
        borderRadius: "10px",
        padding: "0.55rem 0.7rem",
        minWidth: "5.5rem",
      }}
    >
      <span style={{ fontSize: "0.62rem", color: THEME.textDim, textTransform: "uppercase", letterSpacing: "0.04em" }}>
        {label}
      </span>
      <span style={{ fontSize: "0.95rem", fontWeight: 700, color }}>{value}</span>
    </div>
  )
}

/**
 * Fixed-orientation pressure readout grid:
 *
 *   LF  TANK  RF
 *   LR        RR
 *
 * Pass already-formatted strings. `tank` is optional (center top cell is
 * blank when omitted, e.g. for preset pressures).
 */
export function PressureGrid({
  lf,
  rf,
  lr,
  rr,
  tank,
}: {
  lf: string
  rf: string
  lr: string
  rr: string
  tank?: string
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "0.6rem",
      }}
    >
      <StatusPill label="LF" value={lf} />
      {tank !== undefined ? (
        <StatusPill label="Tank" value={tank} tone="warn" />
      ) : (
        <div />
      )}
      <StatusPill label="RF" value={rf} />
      <StatusPill label="LR" value={lr} />
      <div />
      <StatusPill label="RR" value={rr} />
    </div>
  )
}

/**
 * Press-and-hold button. Fires onPress when held, onRelease when released
 * or the pointer leaves. Used for valve air up/down.
 */
export function HoldButton({
  children,
  onPress,
  onRelease,
  disabled,
  style,
}: {
  children: React.ReactNode
  onPress: () => void
  onRelease: () => void
  disabled?: boolean
  style?: React.CSSProperties
}) {
  const [held, setHeld] = useState(false)
  const heldRef = useRef(false)

  const press = (e: React.PointerEvent) => {
    if (disabled) return
    e.preventDefault()
    if (heldRef.current) return
    heldRef.current = true
    setHeld(true)
    onPress()
  }
  const release = () => {
    if (!heldRef.current) return
    heldRef.current = false
    setHeld(false)
    onRelease()
  }

  useEffect(() => {
    return () => {
      if (heldRef.current) {
        heldRef.current = false
        onRelease()
      }
    }
  }, [onRelease])

  return (
    <button
      type="button"
      disabled={disabled}
      onPointerDown={press}
      onPointerUp={release}
      onPointerLeave={release}
      onPointerCancel={release}
      onDragStart={(e) => e.preventDefault()}
      // Prevent the browser from selecting ▲/▼ (or label) text while holding.
      onSelect={(e) => e.preventDefault()}
      style={{
        background: held ? THEME.accent : THEME.panelAlt,
        border: `1px solid ${held ? THEME.accent : THEME.border}`,
        color: held ? "#06222f" : THEME.text,
        borderRadius: "10px",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.45 : 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        userSelect: "none",
        WebkitUserSelect: "none",
        MozUserSelect: "none",
        msUserSelect: "none",
        WebkitTouchCallout: "none",
        WebkitTapHighlightColor: "transparent",
        touchAction: "none",
        transition: "background 0.1s ease, border-color 0.1s ease",
        ...style,
      }}
    >
      {children}
    </button>
  )
