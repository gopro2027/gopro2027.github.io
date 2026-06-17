"use client"

import { useCallback, useRef } from "react"
import { HoldButton, StatusPill, THEME } from "./controls"
import { Solenoid } from "./protocol"
import type { OasmanBle } from "./useOasmanBle"

/* Home tab: hold-to-air valve control for each corner / axle, plus live readouts. */

const S = Solenoid

interface PillDef {
  label: string
  up: number[]
  down: number[]
}

const FRONT: PillDef[] = [
  { label: "Front Driver", up: [S.FRONT_DRIVER_IN], down: [S.FRONT_DRIVER_OUT] },
  {
    label: "Front Axle",
    up: [S.FRONT_DRIVER_IN, S.FRONT_PASSENGER_IN],
    down: [S.FRONT_DRIVER_OUT, S.FRONT_PASSENGER_OUT],
  },
  { label: "Front Pass.", up: [S.FRONT_PASSENGER_IN], down: [S.FRONT_PASSENGER_OUT] },
]

const REAR: PillDef[] = [
  { label: "Rear Driver", up: [S.REAR_DRIVER_IN], down: [S.REAR_DRIVER_OUT] },
  {
    label: "Rear Axle",
    up: [S.REAR_DRIVER_IN, S.REAR_PASSENGER_IN],
    down: [S.REAR_DRIVER_OUT, S.REAR_PASSENGER_OUT],
  },
  { label: "Rear Pass.", up: [S.REAR_PASSENGER_IN], down: [S.REAR_PASSENGER_OUT] },
]

export default function HomeTab({
  ble,
  disabled,
}: {
  ble: OasmanBle
  disabled: boolean
}) {
  const maskRef = useRef(0)
  const { writeValve } = ble

  const apply = useCallback(
    (bits: number[], on: boolean) => {
      let mask = maskRef.current
      for (const b of bits) {
        if (on) mask |= 1 << b
        else mask &= ~(1 << b)
      }
      maskRef.current = mask
      void writeValve(mask)
    },
    [writeValve]
  )

  const { fd, fp, rd, rp, tank } = ble.pressures

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(5.5rem, 1fr))",
          gap: "0.6rem",
        }}
      >
        <StatusPill label="Tank" value={`${tank} PSI`} tone="warn" />
        <StatusPill label="Front Driver" value={`${fd} PSI`} />
        <StatusPill label="Front Pass." value={`${fp} PSI`} />
        <StatusPill label="Rear Driver" value={`${rd} PSI`} />
        <StatusPill label="Rear Pass." value={`${rp} PSI`} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
        {[FRONT, REAR].map((row, i) => (
          <div
            key={i}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "0.6rem",
            }}
          >
            {row.map((pill) => (
              <Pill key={pill.label} pill={pill} apply={apply} disabled={disabled} />
            ))}
          </div>
        ))}
      </div>

      <p style={{ fontSize: "0.72rem", color: THEME.textDim, margin: 0, textAlign: "center" }}>
        Press and hold to air a corner or axle up (open inlet) or down (open exhaust).
        Release to close all valves.
      </p>
    </div>
  )
}

function Pill({
  pill,
  apply,
  disabled,
}: {
  pill: PillDef
  apply: (bits: number[], on: boolean) => void
  disabled: boolean
}) {
  return (
    <div
      style={{
        background: THEME.panelAlt,
        border: `1px solid ${THEME.border}`,
        borderRadius: "12px",
        padding: "0.7rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
      }}
    >
      <span
        style={{
          fontSize: "0.72rem",
          fontWeight: 600,
          color: THEME.textDim,
          textAlign: "center",
        }}
      >
        {pill.label}
      </span>
      <HoldButton
        disabled={disabled}
        onPress={() => apply(pill.up, true)}
        onRelease={() => apply(pill.up, false)}
        style={{ height: "44px", fontSize: "1.1rem" }}
      >
        ▲
      </HoldButton>
      <HoldButton
        disabled={disabled}
        onPress={() => apply(pill.down, true)}
        onRelease={() => apply(pill.down, false)}
        style={{ height: "44px", fontSize: "1.1rem" }}
      >
        ▼
      </HoldButton>
    </div>
  )
}
