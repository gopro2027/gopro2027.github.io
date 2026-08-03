"use client"

import { useEffect, useState } from "react"
import {
  Bluetooth,
  BluetoothConnected,
  BluetoothSearching,
  Home as HomeIcon,
  KeyRound,
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

const PASSKEY_STORAGE_KEY = "oasman-controller-passkey"

function readStoredPasskey(): string | null {
  try {
    const saved = localStorage.getItem(PASSKEY_STORAGE_KEY)
    return saved && /^\d+$/.test(saved) ? saved : null
  } catch {
    return null
  }
}

function writeStoredPasskey(value: string) {
  try {
    localStorage.setItem(PASSKEY_STORAGE_KEY, value)
  } catch {
    // ignore quota / private-mode failures
  }
}

export default function ControllerPage() {
  const ble = useOasmanBle()
  const [tab, setTab] = useState<Tab>("home")
  const [passkey, setPasskeyState] = useState(String(DEFAULT_PASSKEY))

  useEffect(() => {
    const saved = readStoredPasskey()
    if (saved) setPasskeyState(saved)
  }, [])

  const setPasskey = (value: string) => {
    setPasskeyState(value)
    writeStoredPasskey(value)
  }

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
  const [focused, setFocused] = useState(false)

  const stateLabel =
    ble.state === "connecting"
      ? "Connecting…"
      : ble.state === "authenticating"
      ? "Authenticating…"
      : connected
      ? `Connected to ${ble.deviceName}`
      : "Not connected"

  const hint =
    ble.state === "connecting"
      ? "Pick your manifold in the browser's Bluetooth prompt."
      : ble.state === "authenticating"
      ? "Checking your passkey with the manifold…"
      : connected
      ? "Live status is streaming. Controls below are unlocked."
      : "Enter your manifold passkey, then connect."

  const Icon = connected
    ? BluetoothConnected
    : busy
    ? BluetoothSearching
    : Bluetooth

  const statusColor = connected ? THEME.good : busy ? THEME.warn : THEME.textDim
  const canConnect = !busy && passkey.length > 0

  return (
    <div
      style={{
        background: THEME.panel,
        border: `1px solid ${THEME.border}`,
        borderRadius: "14px",
        padding: "1rem 1.1rem",
        marginBottom: "1rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <span
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            width: "2.4rem",
            height: "2.4rem",
            borderRadius: "12px",
            background: `${statusColor}1f`,
            border: `1px solid ${statusColor}40`,
          }}
        >
          <Icon size={20} color={statusColor} />
        </span>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: "0.9rem",
              fontWeight: 700,
              letterSpacing: "-0.01em",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {stateLabel}
          </div>
          <div style={{ fontSize: "0.75rem", color: THEME.textDim }}>{hint}</div>
        </div>

        {connected && (
          <Button variant="danger" onClick={ble.disconnect}>
            Disconnect
          </Button>
        )}
      </div>

      {!connected && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            marginTop: "0.9rem",
            paddingTop: "0.9rem",
            borderTop: `1px solid ${THEME.border}`,
          }}
        >
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.55rem",
              flex: "1 1 auto",
              minWidth: 0,
              maxWidth: "17rem",
              height: "2.5rem",
              padding: "0 0.75rem",
              background: "#0c1014",
              border: `1px solid ${focused ? THEME.accent : THEME.border}`,
              boxShadow: focused ? `0 0 0 3px ${THEME.accent}26` : "none",
              borderRadius: "10px",
              opacity: busy ? 0.55 : 1,
              cursor: busy ? "not-allowed" : "text",
              transition: "border-color 0.15s ease, box-shadow 0.15s ease",
            }}
          >
            <KeyRound size={15} color={focused ? THEME.accent : THEME.textDim} />
            <span
              style={{
                fontSize: "0.62rem",
                fontWeight: 600,
                color: THEME.textDim,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                paddingRight: "0.55rem",
                borderRight: `1px solid ${THEME.border}`,
              }}
            >
              Passkey
            </span>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="off"
              value={passkey}
              onChange={(e) => setPasskey(e.target.value.replace(/[^0-9]/g, ""))}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && canConnect) ble.connect(Number(passkey))
              }}
              maxLength={6}
              disabled={busy}
              placeholder="000000"
              style={{
                flex: 1,
                minWidth: 0,
                background: "transparent",
                border: "none",
                outline: "none",
                color: THEME.text,
                fontSize: "0.95rem",
                fontWeight: 600,
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                letterSpacing: "0.16em",
                padding: 0,
              }}
            />
          </label>
          <Button
            disabled={!canConnect}
            onClick={() => ble.connect(Number(passkey))}
            style={{ height: "2.5rem", padding: "0 1.25rem" }}
          >
            {busy ? "Working…" : "Connect"}
          </Button>
        </div>
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
