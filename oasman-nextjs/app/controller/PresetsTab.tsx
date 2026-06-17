"use client"

import { useState } from "react"
import { Button, Card, PressureGrid, THEME } from "./controls"
import {
  buildAirupQuick,
  buildSaveCurrent,
  buildSimple,
  Cmd,
} from "./protocol"
import type { OasmanBle } from "./useOasmanBle"

/* Presets tab: load/save the five height profiles + global air up / out. */

const PRESETS = [1, 2, 3, 4, 5]

export default function PresetsTab({
  ble,
  disabled,
}: {
  ble: OasmanBle
  disabled: boolean
}) {
  const [selected, setSelected] = useState(3)
  const index0 = selected - 1
  const preset = ble.presets[index0]

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <Card title={`Preset ${selected}`}>
        <div style={{ marginBottom: "1rem" }}>
          <PressureGrid
            lf={preset ? `${preset.fd} PSI` : "—"}
            rf={preset ? `${preset.fp} PSI` : "—"}
            lr={preset ? `${preset.rd} PSI` : "—"}
            rr={preset ? `${preset.rp} PSI` : "—"}
          />
        </div>

        <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
          <Button
            disabled={disabled}
            onClick={() => ble.sendRest(buildAirupQuick(index0))}
            style={{ flex: 1, minWidth: "8rem" }}
          >
            Load (air to preset)
          </Button>
          <Button
            variant="ghost"
            disabled={disabled}
            onClick={async () => {
              await ble.sendRest(buildSaveCurrent(index0))
              await ble.refreshPresets()
            }}
            style={{ flex: 1, minWidth: "8rem" }}
          >
            Save current pressures
          </Button>
        </div>
      </Card>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "0.6rem",
        }}
      >
        {PRESETS.map((n) => {
          const active = selected === n
          return (
            <button
              type="button"
              key={n}
              onClick={() => setSelected(n)}
              style={{
                padding: "0.9rem 0",
                borderRadius: "12px",
                fontSize: "1.1rem",
                fontWeight: 700,
                cursor: "pointer",
                background: active ? THEME.accent : THEME.panelAlt,
                border: `1px solid ${active ? THEME.accent : THEME.border}`,
                color: active ? "#06222f" : THEME.textDim,
                boxShadow: active ? `0 0 14px ${THEME.accent}66` : "none",
                transition: "all 0.15s ease",
              }}
            >
              {n}
            </button>
          )
        })}
      </div>

      <Card title="Global">
        <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
          <Button
            disabled={disabled}
            onClick={() => ble.sendRest(buildSimple(Cmd.AIRUP))}
            style={{ flex: 1, minWidth: "7rem" }}
          >
            Air up all
          </Button>
          <Button
            variant="danger"
            disabled={disabled}
            onClick={() => ble.sendRest(buildSimple(Cmd.AIROUT))}
            style={{ flex: 1, minWidth: "7rem" }}
          >
            Air out all
          </Button>
        </div>
      </Card>
    </div>
  )
}
