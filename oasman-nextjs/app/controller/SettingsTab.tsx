"use client"

import type React from "react"
import { useEffect, useState } from "react"
import {
  Button,
  Card,
  NumberField,
  Row,
  StatusPill,
  TextField,
  THEME,
  Toggle,
} from "./controls"
import {
  Bp32,
  buildAux,
  buildBp32,
  buildBroadcastName,
  buildCompressor,
  buildConfigWrite,
  buildRf,
  buildSimple,
  buildStartWeb,
  Cmd,
  Rf,
  type ConfigValues,
} from "./protocol"
import type { OasmanBle } from "./useOasmanBle"

/* Settings tab: full-parity, editable manifold configuration + action commands. */

const TIME_UNITS = ["Seconds", "Minutes", "Hours", "Days"]
const INVERT_WHEELS = ["Front Pass.", "Rear Pass.", "Front Driver", "Rear Driver"]

export default function SettingsTab({
  ble,
  disabled,
}: {
  ble: OasmanBle
  disabled: boolean
}) {
  const [draft, setDraft] = useState<ConfigValues | null>(ble.config)
  const [dirty, setDirty] = useState(false)

  // Re-seed the editable draft whenever a fresh config arrives from the manifold.
  useEffect(() => {
    if (ble.config) {
      setDraft(ble.config)
      setDirty(false)
    }
  }, [ble.config])

  const patch = (p: Partial<ConfigValues>) => {
    setDraft((prev) => (prev ? { ...prev, ...p } : prev))
    setDirty(true)
  }

  const saveConfig = async () => {
    if (!draft) return
    await ble.sendRest(buildConfigWrite(draft))
    await ble.refreshConfig()
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
      <StatusCard ble={ble} disabled={disabled} />

      {!draft ? (
        <Card>
          <p style={{ color: THEME.textDim, fontSize: "0.85rem", margin: 0 }}>
            {ble.state === "connected"
              ? "Reading configuration from manifold…"
              : "Connect to load configuration."}
          </p>
        </Card>
      ) : (
        <>
          <Card title="Basic settings">
            <ToggleRow
              label="Maintain Preset Pressure"
              on={draft.maintainPressure}
              onChange={(v) => patch({ maintainPressure: v })}
              disabled={disabled}
            />
            <ToggleRow
              label="Rise on start"
              on={draft.riseOnStart}
              onChange={(v) => patch({ riseOnStart: v })}
              disabled={disabled}
            />
            <ToggleRow
              label="Air out on shutdown"
              on={draft.airOutOnShutoff}
              onChange={(v) => patch({ airOutOnShutoff: v })}
              disabled={disabled}
            />
            <ToggleRow
              label="Safety Mode"
              on={draft.safetyMode}
              onChange={(v) => patch({ safetyMode: v })}
              disabled={disabled}
            />
            <ToggleRow
              label="AI / ML Enabled"
              on={draft.aiEnabled}
              onChange={(v) => patch({ aiEnabled: v })}
              disabled={disabled}
            />
          </Card>

          <Card title="Levelling mode">
            <Row label="Sensor type">
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <Button
                  variant={draft.heightSensorMode ? "ghost" : "primary"}
                  disabled={disabled}
                  onClick={() => patch({ heightSensorMode: false })}
                >
                  Pressure Sensor
                </Button>
                <Button
                  variant={draft.heightSensorMode ? "primary" : "ghost"}
                  disabled={disabled}
                  onClick={() => patch({ heightSensorMode: true })}
                >
                  Level Sensor
                </Button>
              </div>
            </Row>
            {INVERT_WHEELS.map((label, i) => (
              <ToggleRow
                key={label}
                label={`Invert ${label}`}
                on={(draft.heightSensorInvertBits & (1 << i)) !== 0}
                onChange={(v) =>
                  patch({
                    heightSensorInvertBits: v
                      ? draft.heightSensorInvertBits | (1 << i)
                      : draft.heightSensorInvertBits & ~(1 << i),
                  })
                }
                disabled={disabled}
              />
            ))}
          </Card>

          <Card title="Pressure / compressor config">
            <NumberRow
              label="Compressor On PSI"
              value={draft.compressorOnPSI}
              onChange={(v) => patch({ compressorOnPSI: v })}
              min={0}
              max={255}
              disabled={disabled}
            />
            <NumberRow
              label="Compressor Off PSI"
              value={draft.compressorOffPSI}
              onChange={(v) => patch({ compressorOffPSI: v })}
              min={0}
              max={255}
              disabled={disabled}
            />
            <NumberRow
              label="Bag Max PSI"
              value={draft.bagMaxPressure}
              onChange={(v) => patch({ bagMaxPressure: v })}
              min={1}
              max={255}
              disabled={disabled}
            />
            <NumberRow
              label="Pressure Sensor Rating PSI"
              value={draft.pressureSensorMax}
              onChange={(v) => patch({ pressureSensorMax: v })}
              min={1}
              max={65535}
              disabled={disabled}
            />
            <NumberRow
              label="Bag Volume %"
              value={draft.bagVolumePercentage}
              onChange={(v) => patch({ bagVolumePercentage: v })}
              min={10}
              max={600}
              disabled={disabled}
            />
            <NumberRow
              label="Shutoff Time (minutes)"
              value={draft.systemShutoffTimeM}
              onChange={(v) => patch({ systemShutoffTimeM: v })}
              min={0}
              max={1440}
              disabled={disabled}
            />
          </Card>

          <Card title="Auxiliary output">
            <ToggleRow
              label="Timed pulse on startup"
              on={draft.auxStartupTimed}
              onChange={(v) => patch({ auxStartupTimed: v })}
              disabled={disabled}
            />
            <ToggleRow
              label="Timed pulse on shutdown"
              on={draft.auxShutdownTimed}
              onChange={(v) => patch({ auxShutdownTimed: v })}
              disabled={disabled}
            />
            <Row label="Duration unit">
              <select
                disabled={disabled}
                value={draft.auxTimeUnit}
                onChange={(e) => patch({ auxTimeUnit: Number(e.target.value) })}
                style={selectStyle}
              >
                {TIME_UNITS.map((u, i) => (
                  <option key={u} value={i}>
                    {u}
                  </option>
                ))}
              </select>
            </Row>
            <NumberRow
              label="Pulse duration"
              value={draft.auxPulseDuration}
              onChange={(v) => patch({ auxPulseDuration: v })}
              min={0}
              max={255}
              disabled={disabled}
            />
            <NumberRow
              label="Interval (cycles)"
              value={draft.auxIntervalCycles}
              onChange={(v) => patch({ auxIntervalCycles: v })}
              min={0}
              max={255}
              disabled={disabled}
            />
            <div style={{ display: "flex", gap: "0.6rem", marginTop: "0.6rem" }}>
              <Button disabled={disabled} onClick={() => ble.sendRest(buildAux(true))}>
                Aux output ON
              </Button>
              <Button
                variant="ghost"
                disabled={disabled}
                onClick={() => ble.sendRest(buildAux(false))}
              >
                Aux output OFF
              </Button>
            </div>
          </Card>

          <div
            style={{
              position: "sticky",
              bottom: 0,
              display: "flex",
              gap: "0.6rem",
              padding: "0.4rem 0",
              background: `linear-gradient(to top, ${THEME.bg} 70%, transparent)`,
            }}
          >
            <Button
              disabled={disabled || !dirty}
              onClick={saveConfig}
              style={{ flex: 1 }}
            >
              {dirty ? "Save configuration" : "Configuration saved"}
            </Button>
            <Button
              variant="ghost"
              disabled={disabled}
              onClick={() => ble.refreshConfig()}
            >
              Reload
            </Button>
          </div>
        </>
      )}

      <CompressorCard ble={ble} disabled={disabled} />
      <RfFobCard ble={ble} disabled={disabled} />
      <GameControllerCard ble={ble} disabled={disabled} />
      <BroadcastCard ble={ble} disabled={disabled} />
      <WifiCard ble={ble} disabled={disabled} />
      <MaintenanceCard ble={ble} disabled={disabled} />
    </div>
  )
}

/* ─── Sub-cards ─── */

function StatusCard({ ble, disabled }: { ble: OasmanBle; disabled: boolean }) {
  const f = ble.flags
  return (
    <Card title="Status">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(6.5rem, 1fr))",
          gap: "0.5rem",
        }}
      >
        <StatusPill label="Compressor" value={f.compressorOn ? "On" : "Off"} tone={f.compressorOn ? "good" : "neutral"} />
        <StatusPill label="Comp. Frozen" value={f.compressorFrozen ? "Yes" : "No"} tone={f.compressorFrozen ? "bad" : "neutral"} />
        <StatusPill label="ACC / Vehicle" value={f.accOn ? "On" : "Off"} tone={f.accOn ? "good" : "neutral"} />
        <StatusPill label="E-Brake" value={f.ebrakeOn ? "On" : "Off"} tone={f.ebrakeOn ? "warn" : "neutral"} />
        <StatusPill label="Timer" value={f.timerExpired ? "Expired" : "Active"} />
        <StatusPill label="AI Learn" value={`${ble.aiPercent}%`} />
      </div>
      {disabled && (
        <p style={{ fontSize: "0.72rem", color: THEME.textDim, margin: "0.7rem 0 0" }}>
          Live values appear once connected.
        </p>
      )}
    </Card>
  )
}

function CompressorCard({ ble, disabled }: { ble: OasmanBle; disabled: boolean }) {
  return (
    <Card title="Compressor override">
      <div style={{ display: "flex", gap: "0.6rem" }}>
        <Button disabled={disabled} onClick={() => ble.sendRest(buildCompressor(true))}>
          Force compressor ON
        </Button>
        <Button
          variant="ghost"
          disabled={disabled}
          onClick={() => ble.sendRest(buildCompressor(false))}
        >
          Release override
        </Button>
      </div>
    </Card>
  )
}

function RfFobCard({ ble, disabled }: { ble: OasmanBle; disabled: boolean }) {
  const buttons = [
    { name: "A", id: Rf.BUTTON_A },
    { name: "B", id: Rf.BUTTON_B },
    { name: "C", id: Rf.BUTTON_C },
    { name: "D", id: Rf.BUTTON_D },
  ]
  const [assign, setAssign] = useState<Record<number, number>>({
    [Rf.BUTTON_A]: 1,
    [Rf.BUTTON_B]: 2,
    [Rf.BUTTON_C]: 3,
    [Rf.BUTTON_D]: 5,
  })
  return (
    <Card title="RF key fob">
      <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", marginBottom: "0.8rem" }}>
        <Button
          disabled={disabled}
          onClick={() => ble.sendRest(buildRf(Rf.COMMAND_CHIP_CMD, Rf.CMD_LEARN_MOMENTARY, 0))}
        >
          Learn (momentary)
        </Button>
        <Button
          disabled={disabled}
          onClick={() => ble.sendRest(buildRf(Rf.COMMAND_CHIP_CMD, Rf.CMD_LEARN_TOGGLE, 0))}
        >
          Learn (toggle)
        </Button>
        <Button
          variant="danger"
          disabled={disabled}
          onClick={() => ble.sendRest(buildRf(Rf.COMMAND_CHIP_CMD, Rf.CMD_DELETE, 0))}
        >
          Unlearn fob
        </Button>
      </div>
      {buttons.map((b) => (
        <Row key={b.name} label={`Button ${b.name} → preset`}>
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <select
              disabled={disabled}
              value={assign[b.id]}
              onChange={(e) =>
                setAssign((prev) => ({ ...prev, [b.id]: Number(e.target.value) }))
              }
              style={selectStyle}
            >
              {[1, 2, 3, 4, 5].map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <Button
              disabled={disabled}
              onClick={() =>
                ble.sendRest(buildRf(Rf.COMMAND_BUTTON_ASSIGN, b.id, assign[b.id] - 1))
              }
            >
              Assign
            </Button>
          </div>
        </Row>
      ))}
    </Card>
  )
}

function GameControllerCard({ ble, disabled }: { ble: OasmanBle; disabled: boolean }) {
  return (
    <Card title="Game controller (Bluepad32)">
      <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
        <Button
          disabled={disabled}
          onClick={() => ble.sendRest(buildBp32(Bp32.ENABLE_NEW_CONN, true))}
        >
          Allow new controller
        </Button>
        <Button
          variant="ghost"
          disabled={disabled}
          onClick={() => ble.sendRest(buildBp32(Bp32.DISCONNECT_DEVICES, true))}
        >
          Disconnect controllers
        </Button>
        <Button
          variant="danger"
          disabled={disabled}
          onClick={() => ble.sendRest(buildBp32(Bp32.FORGET_DEVICES, true))}
        >
          Un-pair all
        </Button>
      </div>
    </Card>
  )
}

function BroadcastCard({ ble, disabled }: { ble: OasmanBle; disabled: boolean }) {
  const [name, setName] = useState("")
  return (
    <Card title="Bluetooth name">
      <Row label="Broadcast name (max 8)">
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <TextField
            value={name}
            onChange={setName}
            placeholder="OASMan"
            maxLength={8}
            disabled={disabled}
            width="8rem"
          />
          <Button
            disabled={disabled || name.length === 0}
            onClick={() => ble.sendRest(buildBroadcastName(name))}
          >
            Set
          </Button>
        </div>
      </Row>
    </Card>
  )
}

function WifiCard({ ble, disabled }: { ble: OasmanBle; disabled: boolean }) {
  const [ssid, setSsid] = useState("")
  const [pass, setPass] = useState("")
  return (
    <Card title="Wi-Fi / Software update">
      <Row label="SSID">
        <TextField value={ssid} onChange={setSsid} placeholder="MyNetwork" disabled={disabled} />
      </Row>
      <Row label="Password">
        <TextField value={pass} onChange={setPass} type="password" disabled={disabled} />
      </Row>
      <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", marginTop: "0.7rem" }}>
        <Button
          disabled={disabled || ssid.length === 0}
          onClick={() => ble.sendRest(buildStartWeb(ssid, pass))}
        >
          Start software update
        </Button>
        {ble.updateStatus && (
          <span style={{ fontSize: "0.78rem", color: THEME.accent }}>
            {ble.updateStatus}
          </span>
        )}
      </div>
    </Card>
  )
}

function MaintenanceCard({ ble, disabled }: { ble: OasmanBle; disabled: boolean }) {
  return (
    <Card title="Maintenance">
      <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
        <Button
          variant="ghost"
          disabled={disabled}
          onClick={() => ble.sendRest(buildSimple(Cmd.DETECTPRESSURESENSORS))}
        >
          Detect pressure sensors
        </Button>
        <Button
          variant="ghost"
          disabled={disabled}
          onClick={() => ble.sendRest(buildSimple(Cmd.RESETAIPKT))}
        >
          Reset learned AI data
        </Button>
        <Button
          variant="danger"
          disabled={disabled}
          onClick={() => ble.sendRest(buildSimple(Cmd.REBOOT))}
        >
          Reboot
        </Button>
        <Button
          variant="danger"
          disabled={disabled}
          onClick={() => ble.sendRest(buildSimple(Cmd.TURNOFF))}
        >
          Turn off
        </Button>
      </div>
    </Card>
  )
}

/* ─── Small row helpers ─── */

function ToggleRow({
  label,
  on,
  onChange,
  disabled,
}: {
  label: string
  on: boolean
  onChange: (v: boolean) => void
  disabled?: boolean
}) {
  return (
    <Row label={label}>
      <Toggle on={on} onChange={onChange} disabled={disabled} />
    </Row>
  )
}

function NumberRow({
  label,
  value,
  onChange,
  min,
  max,
  disabled,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
  disabled?: boolean
}) {
  return (
    <Row label={label}>
      <NumberField value={value} onChange={onChange} min={min} max={max} disabled={disabled} />
    </Row>
  )
}

const selectStyle: React.CSSProperties = {
  background: "#0c1014",
  border: `1px solid ${THEME.border}`,
  borderRadius: "7px",
  color: THEME.text,
  fontSize: "0.8rem",
  padding: "0.35rem 0.5rem",
  cursor: "pointer",
}
