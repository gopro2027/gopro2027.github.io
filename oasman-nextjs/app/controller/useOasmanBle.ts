"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import {
  AuthResult,
  buildAuth,
  buildConfigRead,
  buildPresetReport,
  buildUpdateStatusRequest,
  buildValveMask,
  parseRest,
  parseStatus,
  REST_UUID,
  SERVICE_UUID,
  STATUS_UUID,
  VALVE_UUID,
  type ConfigValues,
  type PresetReport,
  type Pressures,
  type StatusFlags,
} from "./protocol"

export type ConnState =
  | "idle"
  | "connecting"
  | "authenticating"
  | "connected"
  | "error"

const AUTH_TIMEOUT_MS = 6000
const STATUS_WATCHDOG_MS = 5000
const PRESET_COUNT = 5

const ZERO_PRESSURES: Pressures = { fp: 0, rp: 0, fd: 0, rd: 0, tank: 0 }
const ZERO_FLAGS: StatusFlags = {
  compressorFrozen: false,
  compressorOn: false,
  accOn: false,
  timerExpired: false,
  clock: false,
  ebrakeOn: false,
}

export interface OasmanBle {
  supported: boolean
  state: ConnState
  deviceName: string
  error: string | null
  pressures: Pressures
  flags: StatusFlags
  aiPercent: number
  aiReady: number
  presets: Record<number, PresetReport>
  config: ConfigValues | null
  updateStatus: string
  connect: (passkey: number) => Promise<void>
  disconnect: () => void
  sendRest: (bytes: Uint8Array) => Promise<void>
  writeValve: (mask: number) => Promise<void>
  refreshConfig: () => Promise<void>
  refreshPresets: () => Promise<void>
}

export function useOasmanBle(): OasmanBle {
  const [supported, setSupported] = useState(false)
  const [state, setState] = useState<ConnState>("idle")
  const [deviceName, setDeviceName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [pressures, setPressures] = useState<Pressures>(ZERO_PRESSURES)
  const [flags, setFlags] = useState<StatusFlags>(ZERO_FLAGS)
  const [aiPercent, setAiPercent] = useState(0)
  const [aiReady, setAiReady] = useState(0)
  const [presets, setPresets] = useState<Record<number, PresetReport>>({})
  const [config, setConfig] = useState<ConfigValues | null>(null)
  const [updateStatus, setUpdateStatus] = useState("")

  const deviceRef = useRef<BluetoothDevice | null>(null)
  const restRef = useRef<BluetoothRemoteGATTCharacteristic | null>(null)
  const statusRef = useRef<BluetoothRemoteGATTCharacteristic | null>(null)
  const valveRef = useRef<BluetoothRemoteGATTCharacteristic | null>(null)
  const authTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const watchdogRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  // Serializes GATT operations: Web Bluetooth rejects concurrent ops.
  const opChainRef = useRef<Promise<unknown>>(Promise.resolve())

  useEffect(() => {
    setSupported(
      typeof navigator !== "undefined" && !!navigator.bluetooth
    )
  }, [])

  const clearTimers = useCallback(() => {
    if (authTimerRef.current) {
      clearTimeout(authTimerRef.current)
      authTimerRef.current = null
    }
    if (watchdogRef.current) {
      clearTimeout(watchdogRef.current)
      watchdogRef.current = null
    }
  }, [])

  const enqueue = useCallback(<T,>(op: () => Promise<T>): Promise<T> => {
    const run = opChainRef.current.then(op, op)
    // Keep the chain alive even if an op rejects.
    opChainRef.current = run.then(
      () => undefined,
      () => undefined
    )
    return run
  }, [])

  const sendRest = useCallback(
    async (bytes: Uint8Array) => {
      const ch = restRef.current
      if (!ch) return
      await enqueue(() => ch.writeValueWithResponse(bytes as BufferSource))
    },
    [enqueue]
  )

  const writeValve = useCallback(
    async (mask: number) => {
      const ch = valveRef.current
      if (!ch) return
      await enqueue(() =>
        ch.writeValueWithResponse(buildValveMask(mask) as BufferSource)
      )
    },
    [enqueue]
  )

  const cleanup = useCallback(() => {
    clearTimers()
    const dev = deviceRef.current
    deviceRef.current = null
    restRef.current = null
    statusRef.current = null
    valveRef.current = null
    opChainRef.current = Promise.resolve()
    if (dev) {
      dev.removeEventListener("gattserverdisconnected", onDisconnectedRef.current!)
      try {
        dev.gatt?.disconnect()
      } catch {
        /* ignore */
      }
    }
  }, [clearTimers])

  const disconnect = useCallback(() => {
    cleanup()
    setState("idle")
    setDeviceName("")
    setPressures(ZERO_PRESSURES)
    setFlags(ZERO_FLAGS)
    setAiPercent(0)
    setAiReady(0)
  }, [cleanup])

  // Stable ref to the disconnect handler so we can add/remove the listener.
  const onDisconnectedRef = useRef<(() => void) | null>(null)
  useEffect(() => {
    onDisconnectedRef.current = () => {
      cleanup()
      setState((prev) => (prev === "error" ? prev : "idle"))
    }
  }, [cleanup])

  const armWatchdog = useCallback(() => {
    if (watchdogRef.current) clearTimeout(watchdogRef.current)
    watchdogRef.current = setTimeout(() => {
      setError("Connection lost (no status for 5s).")
      setState("error")
      cleanup()
    }, STATUS_WATCHDOG_MS)
  }, [cleanup])

  const handleStatus = useCallback(
    (ev: Event) => {
      const ch = ev.target as BluetoothRemoteGATTCharacteristic
      const value = ch.value
      if (!value) return
      const report = parseStatus(value)
      if (!report) return
      setPressures(report.pressures)
      setFlags(report.flags)
      setAiPercent(report.aiPercent)
      setAiReady(report.aiReady)
      armWatchdog()
    },
    [armWatchdog]
  )

  const refreshConfig = useCallback(async () => {
    await sendRest(buildConfigRead())
  }, [sendRest])

  const refreshPresets = useCallback(async () => {
    for (let i = 0; i < PRESET_COUNT; i++) {
      await sendRest(buildPresetReport(i))
    }
  }, [sendRest])

  const onAuthSuccess = useCallback(async () => {
    if (authTimerRef.current) {
      clearTimeout(authTimerRef.current)
      authTimerRef.current = null
    }
    setState("connected")
    setError(null)
    armWatchdog()
    await refreshConfig()
    await refreshPresets()
    await sendRest(buildUpdateStatusRequest())
  }, [armWatchdog, refreshConfig, refreshPresets, sendRest])

  const handleRest = useCallback(
    (ev: Event) => {
      const ch = ev.target as BluetoothRemoteGATTCharacteristic
      const value = ch.value
      if (!value) return
      const msg = parseRest(value)
      switch (msg.kind) {
        case "auth":
          if (msg.result === AuthResult.SUCCESS) {
            void onAuthSuccess()
          } else if (msg.result === AuthResult.FAIL) {
            setError("Authentication failed: incorrect passkey.")
            setState("error")
            cleanup()
          }
          break
        case "preset":
          setPresets((prev) => ({ ...prev, [msg.preset.index]: msg.preset }))
          break
        case "config":
          setConfig(msg.config)
          break
        case "updateStatus":
          setUpdateStatus(msg.status)
          break
        default:
          break
      }
    },
    [cleanup, onAuthSuccess]
  )

  const connect = useCallback(
    async (passkey: number) => {
      if (!navigator.bluetooth) {
        setError("Web Bluetooth is not available in this browser.")
        setState("error")
        return
      }
      setError(null)
      setState("connecting")
      try {
        const device = await navigator.bluetooth.requestDevice({
          filters: [{ services: [SERVICE_UUID] }],
        })
        deviceRef.current = device
        setDeviceName(device.name || device.id || "OAS-MAN")
        if (onDisconnectedRef.current) {
          device.addEventListener(
            "gattserverdisconnected",
            onDisconnectedRef.current
          )
        }

        const server = await device.gatt!.connect()
        const service = await server.getPrimaryService(SERVICE_UUID)
        const rest = await service.getCharacteristic(REST_UUID)
        const status = await service.getCharacteristic(STATUS_UUID)
        const valve = await service.getCharacteristic(VALVE_UUID)
        restRef.current = rest
        statusRef.current = status
        valveRef.current = valve

        rest.addEventListener("characteristicvaluechanged", handleRest)
        await enqueue(() => rest.startNotifications())
        status.addEventListener("characteristicvaluechanged", handleStatus)
        await enqueue(() => status.startNotifications())

        setState("authenticating")
        await sendRest(buildAuth(passkey))

        authTimerRef.current = setTimeout(() => {
          setError("Authentication timed out.")
          setState("error")
          cleanup()
        }, AUTH_TIMEOUT_MS)
      } catch (err) {
        // requestDevice throwing usually means the user cancelled the chooser.
        const message =
          err instanceof Error ? err.message : "Failed to connect."
        if (/cancel/i.test(message) || /User cancelled/i.test(message)) {
          setState("idle")
        } else {
          setError(message)
          setState("error")
        }
        cleanup()
      }
    },
    [cleanup, enqueue, handleRest, handleStatus, sendRest]
  )

  useEffect(() => {
    return () => {
      cleanup()
    }
  }, [cleanup])

  return {
    supported,
    state,
    deviceName,
    error,
    pressures,
    flags,
    aiPercent,
    aiReady,
    presets,
    config,
    updateStatus,
    connect,
    disconnect,
    sendRest,
    writeValve,
    refreshConfig,
    refreshPresets,
  }
}
