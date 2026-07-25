"use client"

import { useState } from "react"
import {
  Bluetooth,
  BluetoothConnected,
  BluetoothSearching,
  Home as HomeIcon,
  LayoutGrid,
  Settings as SettingsIcon,
  TriangleAlert,
} from "lucide-react"
import { Button, THEME } from "./controls"
import { DEFAULT_PASSKEY } from "./protocol"
import { useOasmanBle } from "./useOasmanBle"
import HomeTab from "./HomeTab"
import PresetsTab from "./PresetsTab"
import SettingsTab from "./SettingsTab"

type Tab = "home" | "presets" | "settings"

export default function ControllerPage() {
  const ble = useOasmanBle()
  const [tab, setTab] = useState<Tab>("home")
  const [passkey, setPasskey] = useState(String(DEFAULT_PASSKEY))

  const connected = ble.state === "connected"
  const busy = ble.state === "connecting" || ble.state === "authenticating"
  const controlsDisabled = !connected

  const navItems: { id: Tab; label: string; icon: typeof HomeIcon }[] = [
    { id: "home", label: "Home", icon: HomeIcon },
    { id: "presets", label: "Presets", icon: LayoutGrid },
    { id: "settings", label: "Settings", icon: SettingsIcon },
  ]

  return (
    <main
      style={{
        minHeight: "100vh",
        background: THEME.bg,
        color: THEME.text,
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        padding: "1.5rem 1rem 4rem",
      }}
    >
      <div style={{ maxWidth: "760px", margin: "0 auto" }}>
        <header style={{ marginBottom: "1.25rem" }}>
          <h1
            style={{
              fontSize: "1.6rem",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              margin: "0 0 0.25rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <Bluetooth size={24} color={THEME.accent} />
            OAS-MAN Web Controller
          </h1>
          <p style={{ margin: 0, color: THEME.textDim, fontSize: "0.85rem" }}>
            Connect to your manifold over Bluetooth and control it right from your
            browser.
          </p>
        </header>

        {!ble.supported ? (
          <UnsupportedNotice />
        ) : (
          <>
            <ConnectPanel
              ble={ble}
              passkey={passkey}
              setPasskey={setPasskey}
              busy={busy}
              connected={connected}
            />

            {ble.error && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  background: "rgba(240,128,128,0.12)",
                  border: `1px solid ${THEME.bad}`,
                  borderRadius: "10px",
                  padding: "0.6rem 0.8rem",
                  color: THEME.bad,
                  fontSize: "0.82rem",
                  marginBottom: "1rem",
                }}
              >
                <TriangleAlert size={16} />
                {ble.error}
              </div>
            )}

            {/* Tab bar */}
            <div
              style={{
                display: "flex",
                gap: "0.4rem",
                marginBottom: "1.1rem",
                opacity: controlsDisabled ? 0.55 : 1,
              }}
            >
              {navItems.map((item) => {
                const active = tab === item.id
                const Icon = item.icon
                return (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setTab(item.id)}
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.4rem",
                      padding: "0.6rem 0",
                      borderRadius: "10px",
                      background: active ? THEME.panel : "transparent",
                      border: `1px solid ${active ? THEME.accent : THEME.border}`,
                      color: active ? THEME.accent : THEME.textDim,
                      fontSize: "0.82rem",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    <Icon size={16} />
                    {item.label}
                  </button>
                )
              })}
            </div>

            <div style={{ position: "relative" }}>
              {tab === "home" && <HomeTab ble={ble} disabled={controlsDisabled} />}
              {tab === "presets" && (
                <PresetsTab ble={ble} disabled={controlsDisabled} />
              )}
              {tab === "settings" && (
                <SettingsTab ble={ble} disabled={controlsDisabled} />
              )}
            </div>
          </>
        )}
      </div>
    </main>
  )
}

function ConnectPanel({
  ble,
  passkey,
  setPasskey,
  busy,
  connected,
}: {
  ble: ReturnType<typeof useOasmanBle>
  passkey: string
  setPasskey: (v: string) => void
  busy: boolean
  connected: boolean
}) {
  const stateLabel =
    ble.state === "connecting"
      ? "Connecting…"
      : ble.state === "authenticating"
      ? "Authenticating…"
      : connected
      ? `Connected to ${ble.deviceName}`
      : "Not connected"

  const Icon = connected
    ? BluetoothConnected
    : busy
    ? BluetoothSearching
    : Bluetooth

  return (
    <div
      style={{
        background: THEME.panel,
        border: `1px solid ${THEME.border}`,
        borderRadius: "14px",
        padding: "1rem 1.1rem",
        marginBottom: "1rem",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: "0.8rem",
      }}
    >
      <Icon
        size={22}
        color={connected ? THEME.good : busy ? THEME.warn : THEME.textDim}
      />

      {!connected ? (
        <>
          <label
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.2rem",
              fontSize: "0.68rem",
              color: THEME.textDim,
            }}
          >
            Passkey
            <input
              type="text"
              inputMode="numeric"
              value={passkey}
              onChange={(e) => setPasskey(e.target.value.replace(/[^0-9]/g, ""))}
              maxLength={6}
              disabled={busy}
              style={{
                width: "5rem",
                background: "#0c1014",
                border: `1px solid ${THEME.border}`,
                borderRadius: "7px",
                color: THEME.text,
                fontSize: "0.85rem",
                padding: "0.4rem 0.5rem",
                letterSpacing: "0.1em",
              }}
            />
          </label>
          <Button
            disabled={busy || passkey.length === 0}
            onClick={() => ble.connect(Number(passkey))}
          >
            {busy ? "Working…" : "Connect"}
          </Button>
        </>
      ) : (
        <Button variant="danger" onClick={ble.disconnect}>
          Disconnect
        </Button>
      )}
    </div>
  )
}

function UnsupportedNotice() {
  return (
    <div
      style={{
        background: THEME.panel,
        border: `1px solid ${THEME.border}`,
        borderRadius: "14px",
        padding: "1.5rem",
        textAlign: "center",
      }}
    >
      <TriangleAlert size={28} color={THEME.warn} style={{ marginBottom: "0.6rem" }} />
      <h2 style={{ fontSize: "1.05rem", fontWeight: 700, margin: "0 0 0.4rem" }}>
        Web Bluetooth isn&apos;t available here
      </h2>
      <p
        style={{
          color: THEME.textDim,
          fontSize: "0.85rem",
          maxWidth: "28rem",
          margin: "0 auto",
          lineHeight: 1.55,
        }}
      >
        This controller uses the Web Bluetooth API, which works in Chrome, Edge, and
        Opera on desktop, and Chrome on Android. It
        is not supported by Safari or Firefox or most browsers on iOS.
      </p>

      <div
        style={{
          maxWidth: "28rem",
          margin: "1rem auto 0",
          padding: "0.8rem 1rem",
          background: THEME.panelAlt,
          border: `1px solid ${THEME.border}`,
          borderRadius: "10px",
          textAlign: "left",
        }}
      >
        <p
          style={{
            color: THEME.text,
            fontSize: "0.82rem",
            fontWeight: 600,
            margin: "0 0 0.35rem",
          }}
        >
          On iPhone or iPad?
        </p>
        <p
          style={{
            color: THEME.textDim,
            fontSize: "0.82rem",
            lineHeight: 1.55,
            margin: 0,
          }}
        >
          Install a Web Bluetooth&ndash;capable browser such as{" "}
          <a
            href="https://apps.apple.com/app/bluefy-web-ble-browser/id1492822055"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: THEME.accent, fontWeight: 600 }}
          >
            Bluefy
          </a>{" "}
          or{" "}
          <a
            href="https://apps.apple.com/app/webble/id1193531073"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: THEME.accent, fontWeight: 600 }}
          >
            WebBLE
          </a>
          , then open this page inside that app to connect to your manifold.
        </p>
      </div>
    </div>
  )
}
