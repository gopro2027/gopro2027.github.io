"use client"

import { useEffect, useRef, useState } from "react"
import {
  Home as HomeIcon,
  LayoutGrid,
  Settings as SettingsIcon,
  BatteryFull,
} from "lucide-react"

/* ─────────────────────────────────────────────────────────────
   OAS-MAN controller emulator
   A stripped-down, interactive React replica of the LVGL firmware
   UI (Wireless_Controller/src/ui). Three tabs: Home, Presets,
   Settings. Default theme = Ocean Blue.
   ───────────────────────────────────────────────────────────── */

const THEME = {
  light: "#60A5FA",
  medium: "#3B82F6",
  dark: "#2563EB",
  greyVeryDark: "#121212",
  greyDark: "#1F1F1F",
}

const BAG_MAX = 120
const FLASH_UP = "#90EE90"
const FLASH_DOWN = "#F08080"

type Corner = "fd" | "fp" | "rd" | "rp"
type Pressures = { fd: number; fp: number; rd: number; rp: number; tank: number }
type Tab = "home" | "presets" | "settings"

// fd, fp, rd, rp for presets 1-5 (1 = air out, 5 = tallest)
const PRESET_PSI: Record<number, [number, number, number, number]> = {
  1: [0, 0, 0, 0],
  2: [25, 25, 28, 28],
  3: [48, 48, 52, 52],
  4: [65, 65, 70, 70],
  5: [85, 85, 92, 92],
}

const clamp = (v: number) => Math.max(0, Math.min(BAG_MAX, v))

/* ─── Pill button (hold to air up / down) ─── */
function Pill({
  onAdjust,
}: {
  onAdjust: (delta: number) => void
}) {
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)

  const stop = () => {
    if (timer.current) {
      clearInterval(timer.current)
      timer.current = null
    }
  }
  const start = (delta: number) => {
    onAdjust(delta)
    stop()
    timer.current = setInterval(() => onAdjust(delta), 110)
  }

  useEffect(() => stop, [])

  return (
    <div className="ctrl-pill">
      <button
        type="button"
        className="ctrl-pill-half"
        aria-label="Air up"
        onPointerDown={(e) => {
          e.preventDefault()
          start(2)
        }}
        onPointerUp={stop}
        onPointerLeave={stop}
        onPointerCancel={stop}
      >
        <svg viewBox="0 0 24 12" width="60%" height="12">
          <polyline
            points="4,8 12,3 20,8"
            fill="none"
            stroke={THEME.light}
            strokeWidth="2.4"
            strokeLinecap="square"
          />
        </svg>
      </button>
      <div className="ctrl-pill-divider" />
      <button
        type="button"
        className="ctrl-pill-half"
        aria-label="Air down"
        onPointerDown={(e) => {
          e.preventDefault()
          start(-2)
        }}
        onPointerUp={stop}
        onPointerLeave={stop}
        onPointerCancel={stop}
      >
        <svg viewBox="0 0 24 12" width="60%" height="12">
          <polyline
            points="4,4 12,9 20,4"
            fill="none"
            stroke={THEME.light}
            strokeWidth="2.4"
            strokeLinecap="square"
          />
        </svg>
      </button>
    </div>
  )
}

/* ─── Pressure readouts overlay (shared by Home + Presets) ─── */
function PressureLabels({
  p,
  flash,
}: {
  p: Pressures
  flash: Partial<Record<Corner, "up" | "down">>
}) {
  const color = (c: Corner) =>
    flash[c] === "up" ? FLASH_UP : flash[c] === "down" ? FLASH_DOWN : "#FFFFFF"

  const lbl = (
    text: string,
    style: React.CSSProperties,
    col: string
  ) => (
    <div
      style={{
        position: "absolute",
        fontSize: "0.72rem",
        fontWeight: 600,
        color: col,
        transition: "color 0.45s ease",
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {text}
    </div>
  )

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 5,
      }}
    >
      {/* tank - top center */}
      {lbl(`${p.tank} PSI`, { top: "3%", left: "50%", transform: "translateX(-50%)" }, "#FFFFFF")}
      {/* front driver - top left */}
      {lbl(`${p.fd} PSI`, { top: "3%", left: "8%" }, color("fd"))}
      {/* rear driver - below left */}
      {lbl(`${p.rd} PSI`, { top: "11%", left: "8%" }, color("rd"))}
      {/* front passenger - top right */}
      {lbl(`${p.fp} PSI`, { top: "3%", right: "8%" }, color("fp"))}
      {/* rear passenger - below right */}
      {lbl(`${p.rp} PSI`, { top: "11%", right: "8%" }, color("rp"))}
    </div>
  )
}

/* ─── Home tab ─── */
function HomeTab({
  pressures,
  setPressures,
  flash,
  flashCorner,
}: {
  pressures: Pressures
  setPressures: React.Dispatch<React.SetStateAction<Pressures>>
  flash: Partial<Record<Corner, "up" | "down">>
  flashCorner: (corners: Corner[], dir: "up" | "down") => void
}) {
  const adjust = (corners: Corner[], delta: number) => {
    setPressures((prev) => {
      const next = { ...prev }
      corners.forEach((c) => {
        next[c] = clamp(prev[c] + delta)
      })
      return next
    })
    flashCorner(corners, delta > 0 ? "up" : "down")
  }

  const rows: { corners: Corner[] }[][] = [
    [{ corners: ["fd"] }, { corners: ["fd", "fp"] }, { corners: ["fp"] }],
    [{ corners: ["rd"] }, { corners: ["rd", "rp"] }, { corners: ["rp"] }],
  ]

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <PressureLabels p={pressures} flash={flash} />
      <div
        style={{
          position: "absolute",
          top: "22%",
          bottom: "4%",
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-evenly",
        }}
      >
        {rows.map((row, ri) => (
          <div
            key={ri}
            style={{
              display: "flex",
              justifyContent: "space-evenly",
              alignItems: "center",
            }}
          >
            {row.map((cell, ci) => (
              <Pill
                key={ci}
                onAdjust={(delta) => adjust(cell.corners, delta)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Side-profile car (body rides up/down over fixed wheels) ─── */
function CarGraphic({ preset }: { preset: number }) {
  // preset 3 = neutral; 1 = lowest (slammed), 5 = tallest
  const lift = (3 - preset) * 6 // px in viewBox units

  return (
    <svg
      viewBox="0 0 240 100"
      width="100%"
      style={{ display: "block", maxHeight: "100%" }}
    >
      <defs>
        <linearGradient id="ctrl-car-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a2d33" />
          <stop offset="45%" stopColor="#101113" />
          <stop offset="100%" stopColor="#050506" />
        </linearGradient>
      </defs>

      {/* Wheels (fixed) */}
      {[58, 182].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy={78} r={17} fill="#0c0c0e" stroke="#3a3d44" strokeWidth="2" />
          <circle cx={cx} cy={78} r={7} fill="#1a1d22" stroke="#4a4e57" strokeWidth="1.5" />
        </g>
      ))}

      {/* Body (translates vertically with preset) */}
      <g style={{ transform: `translateY(${lift}px)`, transition: "transform 0.45s ease-in-out" }}>
        <path
          d="M 16 64
             L 34 48
             C 52 33, 88 30, 104 27
             L 126 16
             L 150 16
             C 172 18, 188 30, 206 40
             L 226 46
             L 228 64
             L 204 64
             A 18 18 0 0 0 160 64
             L 80 64
             A 18 18 0 0 0 36 64
             Z"
          fill="url(#ctrl-car-body)"
        />
        {/* windows */}
        <path
          d="M 60 47 C 74 36, 96 34, 108 31 L 124 22 L 140 22 L 138 31 L 96 33 C 80 38, 70 44, 64 49 Z"
          fill="#11151c"
          opacity="0.9"
        />
        {/* edge highlight */}
        <path
          d="M 34 48 C 52 33, 88 30, 104 27 L 126 16 L 150 16 C 172 18, 188 30, 206 40"
          fill="none"
          stroke="#7b8493"
          strokeWidth="1.2"
          opacity="0.7"
        />
      </g>
    </svg>
  )
}

/* ─── Presets tab ─── */
function PresetsTab({
  pressures,
  setPressures,
  flash,
  currentPreset,
  setCurrentPreset,
  toast,
}: {
  pressures: Pressures
  setPressures: React.Dispatch<React.SetStateAction<Pressures>>
  flash: Partial<Record<Corner, "up" | "down">>
  currentPreset: number
  setCurrentPreset: (n: number) => void
  toast: (msg: string) => void
}) {
  const load = () => {
    const [fd, fp, rd, rp] = PRESET_PSI[currentPreset]
    setPressures((prev) => ({ ...prev, fd, fp, rd, rp }))
    toast("Loaded Preset!")
  }

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <PressureLabels p={pressures} flash={flash} />

      {/* Car */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "6%",
          right: "6%",
          height: "34%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CarGraphic preset={currentPreset} />
      </div>

      {/* Save / Load */}
      <div
        style={{
          position: "absolute",
          top: "58%",
          left: "8%",
          right: "8%",
          display: "flex",
          gap: "8%",
        }}
      >
        <button
          type="button"
          onClick={() => toast("Saved Preset!")}
          style={{
            flex: 1,
            padding: "0.5rem 0",
            borderRadius: "8px",
            background: THEME.greyDark,
            border: `2px solid ${THEME.medium}`,
            color: "#CCCCCC",
            fontSize: "0.78rem",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Save
        </button>
        <button
          type="button"
          onClick={load}
          style={{
            flex: 1,
            padding: "0.5rem 0",
            borderRadius: "8px",
            background: THEME.light,
            border: "none",
            color: "#FFFFFF",
            fontSize: "0.78rem",
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: `0 0 10px ${THEME.medium}66`,
          }}
        >
          Load
        </button>
      </div>

      {/* Preset buttons 1-5 */}
      <div
        style={{
          position: "absolute",
          bottom: "5%",
          left: "4%",
          right: "4%",
          display: "flex",
          justifyContent: "space-evenly",
        }}
      >
        {[1, 2, 3, 4, 5].map((n) => {
          const active = currentPreset === n
          return (
            <button
              type="button"
              key={n}
              onClick={() => setCurrentPreset(n)}
              className="ctrl-preset-btn"
              style={{
                background: active ? THEME.light : THEME.greyDark,
                borderColor: active ? THEME.light : THEME.dark,
                color: active ? "#FFFFFF" : "#8888AA",
                boxShadow: active ? `0 0 10px ${THEME.medium}99` : "none",
              }}
            >
              {n}
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* ─── Settings controls (display-only, lightly interactive) ─── */
function SettingSwitch({ on = false }: { on?: boolean }) {
  const [v, setV] = useState(on)
  return (
    <button
      type="button"
      onClick={() => setV(!v)}
      className="ctrl-switch"
      style={{ background: v ? THEME.light : "#1F1F1F" }}
      aria-pressed={v}
    >
      <span className="ctrl-switch-knob" style={{ left: v ? "calc(100% - 16px)" : "2px" }} />
    </button>
  )
}

function SettingSlider({ value = 50, min = 0, max = 100 }: { value?: number; min?: number; max?: number }) {
  const [v, setV] = useState(value)
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", width: "55%" }}>
      <input
        type="range"
        min={min}
        max={max}
        value={v}
        onChange={(e) => setV(Number(e.target.value))}
        className="ctrl-range"
        style={{ flex: 1 }}
      />
      <span style={{ fontSize: "0.62rem", color: "#9aa3b2", minWidth: "1.6rem", textAlign: "right" }}>
        {v}
      </span>
    </div>
  )
}

function SettingRadio({ options, selected = 0 }: { options: string[]; selected?: number }) {
  const [sel, setSel] = useState(selected)
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", width: "100%" }}>
      {options.map((o, i) => (
        <button
          type="button"
          key={o}
          onClick={() => setSel(i)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "transparent",
            border: "none",
            color: "#d6dae2",
            fontSize: "0.72rem",
            cursor: "pointer",
            padding: 0,
          }}
        >
          <span
            style={{
              width: "14px",
              height: "14px",
              borderRadius: "50%",
              border: `2px solid ${sel === i ? THEME.light : "#555"}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {sel === i && (
              <span
                style={{ width: "6px", height: "6px", borderRadius: "50%", background: THEME.light }}
              />
            )}
          </span>
          {o}
        </button>
      ))}
    </div>
  )
}

type Row =
  | { type: "header"; label: string }
  | { type: "value"; label: string; value: string }
  | { type: "switch"; label: string; on?: boolean }
  | { type: "button"; label: string }
  | { type: "slider"; label: string; value?: number; min?: number; max?: number }
  | { type: "radio"; options: string[]; selected?: number }
  | { type: "dropdown"; label: string; value: string }
  | { type: "input"; label: string; placeholder?: string }

const SETTINGS_SECTIONS: { name: string; rows: Row[] }[] = [
  {
    name: "Status",
    rows: [
      { type: "value", label: "Compressor Frozen:", value: "No" },
      { type: "value", label: "ACC Status:", value: "Off" },
      { type: "value", label: "E-Brake Status:", value: "On" },
      { type: "switch", label: "Compressor Status:", on: true },
      { type: "button", label: "Reboot/Turn Off" },
    ],
  },
  {
    name: "Game Controller",
    rows: [
      { type: "button", label: "Allow New Controller" },
      { type: "button", label: "Un-pair All Controllers" },
      { type: "button", label: "Disconnect Controllers" },
    ],
  },
  {
    name: "ML/AI",
    rows: [
      { type: "value", label: "Learn Progress:", value: "75%" },
      { type: "value", label: "Trained:", value: "UF: Y  UR: Y" },
      { type: "switch", label: "Enabled:", on: true },
      { type: "button", label: "Reset Learned Data" },
    ],
  },
  {
    name: "Basic settings",
    rows: [
      { type: "switch", label: "Maintain Preset", on: true },
      { type: "switch", label: "Rise on start" },
      { type: "switch", label: "Fall on shutdown" },
      { type: "switch", label: "Safety Mode", on: true },
      { type: "header", label: "Key Fob Settings" },
      { type: "button", label: "Unlearn Fob" },
      { type: "button", label: "Learn Fob" },
      { type: "slider", label: "Button A Preset Number", value: 1, min: 1, max: 5 },
      { type: "slider", label: "Button B Preset Number", value: 2, min: 1, max: 5 },
      { type: "slider", label: "Button C Preset Number", value: 3, min: 1, max: 5 },
      { type: "slider", label: "Button D Preset Number", value: 5, min: 1, max: 5 },
    ],
  },
  {
    name: "Levelling Mode",
    rows: [
      { type: "radio", options: ["Pressure Sensor", "Level Sensor"], selected: 0 },
      { type: "switch", label: "Invert Front Left" },
      { type: "switch", label: "Invert Front Right" },
      { type: "switch", label: "Invert Rear Left" },
      { type: "switch", label: "Invert Rear Right" },
    ],
  },
  {
    name: "Auxillary Output",
    rows: [
      { type: "button", label: "Hold: Aux output on" },
      { type: "switch", label: "Aux output" },
      { type: "switch", label: "Timed pulse on startup" },
      { type: "switch", label: "Timed pulse on shutdown" },
      { type: "dropdown", label: "Duration unit:", value: "Seconds" },
      { type: "input", label: "Pulse duration", placeholder: "10" },
      { type: "input", label: "Interval (cycles)", placeholder: "1" },
    ],
  },
  {
    name: "Units",
    rows: [{ type: "radio", options: ["PSI", "Bar"], selected: 0 }],
  },
  {
    name: "Screen Settings",
    rows: [
      { type: "input", label: "Dim Screen (Minutes)", placeholder: "5" },
      { type: "slider", label: "Brightness", value: 80, min: 1, max: 100 },
      { type: "header", label: "Navigation" },
      { type: "switch", label: "Swipe Navigation" },
      { type: "header", label: "Theme Colors" },
      {
        type: "radio",
        options: ["Ocean Blue", "Plump Purple", "Forest Green", "Desert Sand"],
        selected: 0,
      },
      { type: "button", label: "Custom Color Picker" },
    ],
  },
  {
    name: "Config",
    rows: [
      { type: "slider", label: "Bag Max PSI", value: 120, min: 1, max: 256 },
      { type: "input", label: "Bluetooth Passkey (6 digits)", placeholder: "000000" },
      { type: "input", label: "Shutoff Time (Minutes)", placeholder: "30" },
      { type: "input", label: "Compressor On PSI", placeholder: "120" },
      { type: "input", label: "Compressor Off PSI", placeholder: "150" },
      { type: "input", label: "Pressure Sensor Rating PSI", placeholder: "200" },
      { type: "slider", label: "Bag Volume Percentage", value: 100, min: 10, max: 600 },
    ],
  },
  {
    name: "Wifi / Update",
    rows: [
      { type: "input", label: "SSID", placeholder: "MyNetwork" },
      { type: "input", label: "PASS", placeholder: "********" },
      { type: "button", label: "Start Software Update" },
      { type: "value", label: "Version:", value: "DEVELOPMENT" },
      { type: "value", label: "Manifold:", value: "A1:B2:C3:D4" },
      { type: "value", label: "Battery:", value: "4.05 V" },
    ],
  },
]

function SettingRow({ row }: { row: Row }) {
  if (row.type === "header") {
    return (
      <div
        style={{
          padding: "0.5rem 0 0.25rem",
          fontSize: "0.82rem",
          fontWeight: 700,
          color: "#f2f4f7",
          borderBottom: "1px solid #2a313a",
        }}
      >
        {row.label}
      </div>
    )
  }

  const base: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "0.5rem",
    padding: "0.45rem 0",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
    minHeight: "2rem",
  }
  const labelStyle: React.CSSProperties = {
    fontSize: "0.72rem",
    color: "#e6e9ef",
    fontWeight: 500,
  }

  switch (row.type) {
    case "value":
      return (
        <div style={base}>
          <span style={labelStyle}>{row.label}</span>
          <span style={{ fontSize: "0.72rem", color: THEME.light, fontWeight: 600 }}>{row.value}</span>
        </div>
      )
    case "switch":
      return (
        <div style={base}>
          <span style={labelStyle}>{row.label}</span>
          <SettingSwitch on={row.on} />
        </div>
      )
    case "button":
      return (
        <div style={base}>
          <button
            type="button"
            style={{
              width: "100%",
              padding: "0.4rem 0",
              borderRadius: "7px",
              background: THEME.light,
              border: `1px solid ${THEME.dark}`,
              color: "#FFFFFF",
              fontSize: "0.72rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {row.label}
          </button>
        </div>
      )
    case "slider":
      return (
        <div style={{ ...base, flexDirection: "column", alignItems: "stretch", gap: "0.3rem" }}>
          <span style={labelStyle}>{row.label}</span>
          <SettingSlider value={row.value} min={row.min} max={row.max} />
        </div>
      )
    case "radio":
      return (
        <div style={{ ...base, alignItems: "stretch" }}>
          <SettingRadio options={row.options} selected={row.selected} />
        </div>
      )
    case "dropdown":
      return (
        <div style={base}>
          <span style={labelStyle}>{row.label}</span>
          <span
            style={{
              fontSize: "0.7rem",
              color: "#d6dae2",
              background: "#161a1f",
              border: "1px solid #2a313a",
              borderRadius: "6px",
              padding: "0.2rem 0.5rem",
            }}
          >
            {row.value} ▾
          </span>
        </div>
      )
    case "input":
      return (
        <div style={base}>
          <span style={labelStyle}>{row.label}</span>
          <span
            style={{
              fontSize: "0.7rem",
              color: "#9aa3b2",
              background: "#101317",
              border: "1px solid #2a313a",
              borderRadius: "6px",
              padding: "0.2rem 0.5rem",
              minWidth: "5rem",
              textAlign: "right",
            }}
          >
            {row.placeholder}
          </span>
        </div>
      )
    default:
      return null
  }
}

/* ─── Settings tab ─── */
function SettingsTab() {
  const [section, setSection] = useState(0)
  const current = SETTINGS_SECTIONS[section]

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column" }}>
      {/* Section dropdown */}
      <div style={{ padding: "0.5rem 0.6rem 0.4rem" }}>
        <select
          value={section}
          onChange={(e) => setSection(Number(e.target.value))}
          style={{
            width: "100%",
            background: "#161a1f",
            border: "1px solid #2a313a",
            color: "#f2f4f7",
            fontSize: "0.82rem",
            fontWeight: 600,
            borderRadius: "8px",
            padding: "0.5rem 0.6rem",
            appearance: "none",
            cursor: "pointer",
          }}
        >
          {SETTINGS_SECTIONS.map((s, i) => (
            <option key={s.name} value={i}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {/* Scrollable option list */}
      <div
        className="ctrl-settings-list"
        style={{ flex: 1, overflowY: "auto", padding: "0 0.6rem 0.6rem" }}
      >
        {current.rows.map((row, i) => (
          <SettingRow key={i} row={row} />
        ))}
      </div>
    </div>
  )
}

/* ─── Root emulator ─── */
export default function ControllerEmulator() {
  const [tab, setTab] = useState<Tab>("presets")
  const [pressures, setPressures] = useState<Pressures>({
    fd: 48,
    fp: 48,
    rd: 52,
    rp: 52,
    tank: 150,
  })
  const [currentPreset, setCurrentPresetState] = useState(3)
  const [flash, setFlash] = useState<Partial<Record<Corner, "up" | "down">>>({})
  const [toastMsg, setToastMsg] = useState<string | null>(null)

  const flashTimers = useRef<Partial<Record<Corner, ReturnType<typeof setTimeout>>>>({})
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const flashCorner = (corners: Corner[], dir: "up" | "down") => {
    setFlash((prev) => {
      const next = { ...prev }
      corners.forEach((c) => (next[c] = dir))
      return next
    })
    corners.forEach((c) => {
      if (flashTimers.current[c]) clearTimeout(flashTimers.current[c])
      flashTimers.current[c] = setTimeout(() => {
        setFlash((prev) => {
          const next = { ...prev }
          delete next[c]
          return next
        })
      }, 450)
    })
  }

  const toast = (msg: string) => {
    setToastMsg(msg)
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToastMsg(null), 1600)
  }

  const setCurrentPreset = (n: number) => setCurrentPresetState(n)

  useEffect(() => {
    return () => {
      Object.values(flashTimers.current).forEach((t) => t && clearTimeout(t))
      if (toastTimer.current) clearTimeout(toastTimer.current)
    }
  }, [])

  const navItems: { id: Tab; label: string; icon: typeof HomeIcon }[] = [
    { id: "home", label: "Home", icon: HomeIcon },
    { id: "presets", label: "Presets", icon: LayoutGrid },
    { id: "settings", label: "Settings", icon: SettingsIcon },
  ]

  return (
    <div className="ctrl-frame">
      <div className="ctrl-screen">
        {/* Statusbar */}
        <div className="ctrl-statusbar">
          <span />
          <span className="ctrl-status-handle" />
          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
            <BatteryFull size={15} color="#4ADE80" />
            <span style={{ fontSize: "0.62rem", color: "#e0e0e0", fontWeight: 600 }}>80%</span>
          </span>
        </div>

        {/* Content */}
        <div className="ctrl-content">
          {tab === "home" && (
            <HomeTab
              pressures={pressures}
              setPressures={setPressures}
              flash={flash}
              flashCorner={flashCorner}
            />
          )}
          {tab === "presets" && (
            <PresetsTab
              pressures={pressures}
              setPressures={setPressures}
              flash={flash}
              currentPreset={currentPreset}
              setCurrentPreset={setCurrentPreset}
              toast={toast}
            />
          )}
          {tab === "settings" && <SettingsTab />}

          {/* Toast */}
          {toastMsg && (
            <div className="ctrl-toast" style={{ borderColor: THEME.light }}>
              {toastMsg}
            </div>
          )}
        </div>

        {/* Navbar */}
        <div className="ctrl-navbar">
          {navItems.map((item) => {
            const active = tab === item.id
            const Icon = item.icon
            return (
              <button
                type="button"
                key={item.id}
                className="ctrl-tab"
                onClick={() => setTab(item.id)}
                style={{ color: active ? "#FFFFFF" : "#64748B" }}
              >
                <Icon size={17} color={active ? THEME.light : "#64748B"} />
                <span style={{ fontSize: "0.55rem", fontWeight: active ? 700 : 500 }}>
                  {item.label}
                </span>
                <span
                  className="ctrl-tab-underline"
                  style={{ background: active ? THEME.light : "transparent" }}
                />
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
