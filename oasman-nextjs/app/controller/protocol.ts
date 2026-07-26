/* ─────────────────────────────────────────────────────────────
   OAS-MAN BLE protocol (Web Bluetooth)

   Pure, framework-free encoder/decoder for the OAS-MAN manifold
   BLE protocol. Mirrors the wire format used by the Flutter app
   (lib/ble_manager.dart) and the LVGL Wireless_Controller firmware
   (ESP32_SHARED_LIBS/src/BTOas.h). All multi-byte values are
   little-endian. The base packet (BTOasPacket) is 104 bytes:

     cmd      uint16  @ byte 0
     sender   uint8   @ byte 2   (always 0)
     recipient uint8  @ byte 3   (always 0)
     args[100]        @ byte 4
   ───────────────────────────────────────────────────────────── */

export const SERVICE_UUID = "679425c8-d3b4-4491-9eb2-3e3d15b625f0"
export const REST_UUID = "f573f13f-b38e-415e-b8f0-59a6a19a4e02"
export const STATUS_UUID = "66fda100-8972-4ec7-971c-3fd30b3072ac"
export const VALVE_UUID = "e225a15a-e816-4e9d-99b7-c384f91f273b"

export const PACKET_SIZE = 104
export const ARGS_OFFSET = 4

/** Default app-layer passkey (6-digit), unless changed on the manifold. */
export const DEFAULT_PASSKEY = 202777

/** Command identifiers (BTOasIdentifier). */
export const Cmd = {
  IDLE: 0,
  STATUSREPORT: 1,
  AIRSM: 4,
  AIRUPQUICK: 7,
  BASEPROFILE: 8,
  RAISEONPRESSURESET: 11,
  REBOOT: 12,
  CALIBRATE: 13,
  STARTWEB: 14,
  ASSIGNRECEPIENT: 15,
  MESSAGE: 16,
  SAVECURRENTPRESSURESTOPROFILE: 17,
  PRESETREPORT: 18,
  GETCONFIGVALUES: 21,
  AUTHPACKET: 22,
  COMPRESSORSTATUS: 24,
  TURNOFF: 25,
  DETECTPRESSURESENSORS: 27,
  RESETAIPKT: 29,
  BP32PKT: 30,
  BROADCASTNAME: 35,
  UPDATESTATUSREQUEST: 36,
  RFCOMMAND: 37,
  AUXILLARYOUTPUTCONTROL: 38,
  CALIBRATEHEIGHTSENSORS: 39,
} as const

/** Live status flags carried in STATUSREPORT args32[3]. */
export const StatusBit = {
  COMPRESSOR_FROZEN: 0,
  COMPRESSOR_STATUS_ON: 1,
  ACC_STATUS_ON: 2,
  TIMER_STATUS_EXPIRED: 3,
  CLOCK: 4,
  EBRAKE_STATUS_ON: 5,
} as const

/** User-config flags carried in GETCONFIGVALUES configFlagsBits (args32[1]). */
export const ConfigFlag = {
  CONFIG_MAINTAIN_PRESSURE: 0,
  CONFIG_RISE_ON_START: 1,
  CONFIG_AIR_OUT_ON_SHUTOFF: 2,
  CONFIG_HEIGHT_SENSOR_MODE: 3,
  CONFIG_SAFETY_MODE: 4,
  CONFIG_AI_STATUS_ENABLED: 5,
  CONFIG_SENSORLESS_LEVELING: 6,
} as const

export const AuthResult = {
  WAITING: 0,
  SUCCESS: 1,
  FAIL: 2,
  UPDATEKEY: 3,
} as const

/** Solenoid bit indices for the valve-control characteristic. */
export const Solenoid = {
  FRONT_PASSENGER_IN: 0,
  FRONT_PASSENGER_OUT: 1,
  REAR_PASSENGER_IN: 2,
  REAR_PASSENGER_OUT: 3,
  FRONT_DRIVER_IN: 4,
  FRONT_DRIVER_OUT: 5,
  REAR_DRIVER_IN: 6,
  REAR_DRIVER_OUT: 7,
} as const

/** RF key-fob command constants (RFCOMMAND). */
export const Rf = {
  COMMAND_CHIP_CMD: 1,
  COMMAND_BUTTON_ASSIGN: 2,
  CMD_DELETE: 1,
  CMD_LEARN_MOMENTARY: 2,
  CMD_LEARN_TOGGLE: 3,
  CMD_LEARN_RADIOBUTTON: 4,
  BUTTON_A: 1,
  BUTTON_B: 2,
  BUTTON_C: 3,
  BUTTON_D: 4,
} as const

/** Bluepad32 gamepad commands (BP32PKT). */
export const Bp32 = {
  ENABLE_NEW_CONN: 0,
  FORGET_DEVICES: 1,
  DISCONNECT_DEVICES: 2,
} as const

/** Aux output mode (single enum value in AuxillaryOutputModePayload.mode). */
export const AuxMode = {
  NONE: 0,
  STARTUP_TIMED: 1,
  SHUTDOWN_TIMED: 2,
} as const

/** Aux output time unit (AuxillaryOutputModeTimeUnit). */
export const AuxTimeUnit = {
  DECISECONDS: 0,
  SECONDS: 1,
  MINUTES: 2,
  HOURS: 3,
} as const

/** Which per-wheel height calibration point CALIBRATEHEIGHTSENSORS captures. */
export const HeightCalibration = {
  MIN: 0,
  MAX: 1,
  MIN_RIDE_HEIGHT: 2,
} as const

/* ─── Types ─── */

export interface Pressures {
  fp: number
  rp: number
  fd: number
  rd: number
  tank: number
}

export interface StatusFlags {
  compressorFrozen: boolean
  compressorOn: boolean
  accOn: boolean
  timerExpired: boolean
  clock: boolean
  ebrakeOn: boolean
}

export interface StatusReport {
  pressures: Pressures
  aiPercent: number
  aiReady: number
  flags: StatusFlags
}

export interface PresetReport {
  /** 0-based profile index. */
  index: number
  fp: number
  rp: number
  fd: number
  rd: number
}

export interface ConfigValues {
  systemShutoffTimeM: number
  configFlagsBits: number
  maintainPressure: boolean
  riseOnStart: boolean
  airOutOnShutoff: boolean
  heightSensorMode: boolean
  safetyMode: boolean
  aiEnabled: boolean
  sensorlessLeveling: boolean
  pressureSensorMax: number
  bagVolumePercentage: number
  bagMaxPressure: number
  compressorOnPSI: number
  compressorOffPSI: number
  rfButtonA: number
  rfButtonB: number
  rfButtonC: number
  rfButtonD: number
  /** If current pressure is below this (PSI), stretch the bag first on air-up. */
  bagStretchBelowPressure: number
  /** Pressure (PSI) to inflate to first to unroll/stretch the bag. 0 = disabled. */
  bagStretchPressure: number
  auxMode: number
  auxTimeUnit: number
  auxPulseDuration: number
  auxIntervalCycles: number
  /** Raw 100-byte args from the manifold, echoed back on save. */
  rawArgs: number[]
}

export type RestNotification =
  | { kind: "auth"; result: number }
  | { kind: "preset"; preset: PresetReport }
  | { kind: "config"; config: ConfigValues }
  | { kind: "updateStatus"; status: string }
  | { kind: "unknown"; cmd: number }

/* ─── Builders ─── */

function newPacket(cmd: number): { bytes: Uint8Array; view: DataView } {
  const bytes = new Uint8Array(PACKET_SIZE)
  const view = new DataView(bytes.buffer)
  view.setUint16(0, cmd, true)
  return { bytes, view }
}

/** offset within args[] (0-based) → absolute byte offset in the packet. */
const a = (argOffset: number) => ARGS_OFFSET + argOffset

/** No-argument command (AIRUP, AIROUT, REBOOT, TURNOFF, etc.). */
export function buildSimple(cmd: number): Uint8Array {
  return newPacket(cmd).bytes
}

export function buildAuth(passkey: number): Uint8Array {
  const { bytes, view } = newPacket(Cmd.AUTHPACKET)
  view.setUint32(a(0), passkey >>> 0, true)
  view.setUint32(a(4), AuthResult.WAITING, true)
  return bytes
}

/** Load a profile then air up to it (0-based profile index). */
export function buildAirupQuick(profileIndex: number): Uint8Array {
  const { bytes, view } = newPacket(Cmd.AIRUPQUICK)
  view.setInt32(a(0), profileIndex, true)
  return bytes
}

/** Save current wheel pressures to a profile (0-based profile index). */
export function buildSaveCurrent(profileIndex: number): Uint8Array {
  const { bytes, view } = newPacket(Cmd.SAVECURRENTPRESSURESTOPROFILE)
  view.setInt32(a(0), profileIndex, true)
  return bytes
}

/** Request a profile's saved pressures (0-based). Returns via REST notify. */
export function buildPresetReport(profileIndex: number): Uint8Array {
  const { bytes, view } = newPacket(Cmd.PRESETREPORT)
  // pressures (args16[0..3]) left 0; profile index lives at args16[4].
  view.setUint16(a(8), profileIndex, true)
  return bytes
}

export function buildCompressor(on: boolean): Uint8Array {
  const { bytes, view } = newPacket(Cmd.COMPRESSORSTATUS)
  view.setInt32(a(0), on ? 1 : 0, true)
  return bytes
}

export function buildAux(on: boolean): Uint8Array {
  const { bytes, view } = newPacket(Cmd.AUXILLARYOUTPUTCONTROL)
  view.setInt32(a(0), on ? 1 : 0, true)
  return bytes
}

export function buildRf(type: number, valueOne: number, valueTwo: number): Uint8Array {
  const { bytes, view } = newPacket(Cmd.RFCOMMAND)
  view.setInt32(a(0), type, true)
  view.setInt32(a(4), valueOne, true)
  view.setInt32(a(8), valueTwo, true)
  return bytes
}

export function buildBp32(command: number, value: boolean): Uint8Array {
  const { bytes, view } = newPacket(Cmd.BP32PKT)
  view.setUint16(a(0), command, true)
  view.setUint16(a(2), value ? 1 : 0, true)
  return bytes
}

/** Capture a per-wheel height calibration point (see HeightCalibration). */
export function buildCalibrateHeightSensors(type: number): Uint8Array {
  const { bytes, view } = newPacket(Cmd.CALIBRATEHEIGHTSENSORS)
  view.setInt32(a(0), type, true)
  return bytes
}

/** Read-only GETCONFIGVALUES request (setValues = 0). */
export function buildConfigRead(): Uint8Array {
  return newPacket(Cmd.GETCONFIGVALUES).bytes
}

function writeUtf8(bytes: Uint8Array, offset: number, text: string, max: number) {
  const enc = new TextEncoder().encode(text)
  for (let i = 0; i < enc.length && i < max; i++) {
    bytes[offset + i] = enc[i]
  }
}

/** OTA / Wi-Fi update: SSID in args[0..49], password in args[50..99]. */
export function buildStartWeb(ssid: string, password: string): Uint8Array {
  const { bytes } = newPacket(Cmd.STARTWEB)
  writeUtf8(bytes, a(0), ssid, 49)
  writeUtf8(bytes, a(50), password, 49)
  return bytes
}

/** Change the BLE broadcast name (max 8 chars), stored in args[0..7]. */
export function buildBroadcastName(name: string): Uint8Array {
  const { bytes } = newPacket(Cmd.BROADCASTNAME)
  writeUtf8(bytes, a(0), name, 8)
  return bytes
}

/** Firmware update-status request. Mirrors the Flutter app's "UNKNOWN" payload. */
export function buildUpdateStatusRequest(): Uint8Array {
  const { bytes } = newPacket(Cmd.UPDATESTATUSREQUEST)
  writeUtf8(bytes, a(0), "UNKNOWN", 92)
  return bytes
}

/** 4-byte little-endian valve bitmask for the valve-control characteristic. */
export function buildValveMask(mask: number): Uint8Array {
  const bytes = new Uint8Array(4)
  new DataView(bytes.buffer).setUint32(0, mask >>> 0, true)
  return bytes
}

/**
 * Build a GETCONFIGVALUES write packet (setValues = 1). The previously read
 * rawArgs are used as a base so unmanaged bytes are echoed back unchanged.
 */
export function buildConfigWrite(c: ConfigValues): Uint8Array {
  const { bytes, view } = newPacket(Cmd.GETCONFIGVALUES)
  if (c.rawArgs && c.rawArgs.length >= 100) {
    bytes.set(c.rawArgs.slice(0, 100), ARGS_OFFSET)
    // cmd was overwritten by set(); restore it.
    view.setUint16(0, Cmd.GETCONFIGVALUES, true)
    view.setUint8(2, 0)
    view.setUint8(3, 0)
  }

  let flags = 0
  if (c.maintainPressure) flags |= 1 << ConfigFlag.CONFIG_MAINTAIN_PRESSURE
  if (c.riseOnStart) flags |= 1 << ConfigFlag.CONFIG_RISE_ON_START
  if (c.airOutOnShutoff) flags |= 1 << ConfigFlag.CONFIG_AIR_OUT_ON_SHUTOFF
  if (c.heightSensorMode) flags |= 1 << ConfigFlag.CONFIG_HEIGHT_SENSOR_MODE
  if (c.safetyMode) flags |= 1 << ConfigFlag.CONFIG_SAFETY_MODE
  if (c.aiEnabled) flags |= 1 << ConfigFlag.CONFIG_AI_STATUS_ENABLED
  if (c.sensorlessLeveling) flags |= 1 << ConfigFlag.CONFIG_SENSORLESS_LEVELING

  view.setUint32(a(0), c.systemShutoffTimeM >>> 0, true)
  view.setUint32(a(4), flags >>> 0, true)
  view.setUint16(a(8), c.pressureSensorMax & 0xffff, true)
  view.setUint16(a(10), c.bagVolumePercentage & 0xffff, true)
  view.setUint8(a(12), c.bagMaxPressure & 0xff)
  view.setUint8(a(13), c.compressorOnPSI & 0xff)
  view.setUint8(a(14), c.compressorOffPSI & 0xff)
  view.setUint8(a(15), 1) // setValues
  view.setUint8(a(16), c.rfButtonA & 0xff)
  view.setUint8(a(17), c.rfButtonB & 0xff)
  view.setUint8(a(18), c.rfButtonC & 0xff)
  view.setUint8(a(19), c.rfButtonD & 0xff)
  // Bag stretch (unroll on air-up): args8[20] trigger-below PSI, args8[21] stretch PSI.
  view.setUint8(a(20), c.bagStretchBelowPressure & 0xff)
  view.setUint8(a(21), c.bagStretchPressure & 0xff)
  // args8[22..23] reserved; left as echoed rawArgs.
  // AuxillaryOutputModePayload at args32[6]: mode / timeUnit / time / interval.
  view.setUint8(a(24), c.auxMode & 0xff)
  view.setUint8(a(25), Math.min(3, Math.max(0, c.auxTimeUnit)))
  view.setUint8(a(26), c.auxPulseDuration & 0xff)
  view.setUint8(a(27), c.auxIntervalCycles & 0xff)
  return bytes
}

/* ─── Parsers ─── */

function bit(value: number, position: number): boolean {
  return (value & (1 << position)) !== 0
}

export function parseStatus(view: DataView): StatusReport | null {
  if (view.byteLength < 20) return null
  if (view.getUint16(0, true) !== Cmd.STATUSREPORT) return null
  const flagsBits = view.getUint32(a(12), true)
  return {
    pressures: {
      fp: view.getUint16(a(0), true),
      rp: view.getUint16(a(2), true),
      fd: view.getUint16(a(4), true),
      rd: view.getUint16(a(6), true),
      tank: view.getUint16(a(8), true),
    },
    aiPercent: view.getUint8(a(10)),
    aiReady: view.getUint8(a(11)),
    flags: {
      compressorFrozen: bit(flagsBits, StatusBit.COMPRESSOR_FROZEN),
      compressorOn: bit(flagsBits, StatusBit.COMPRESSOR_STATUS_ON),
      accOn: bit(flagsBits, StatusBit.ACC_STATUS_ON),
      timerExpired: bit(flagsBits, StatusBit.TIMER_STATUS_EXPIRED),
      clock: bit(flagsBits, StatusBit.CLOCK),
      ebrakeOn: bit(flagsBits, StatusBit.EBRAKE_STATUS_ON),
    },
  }
}

export function parseConfig(view: DataView): ConfigValues {
  const flags = view.getUint32(a(4), true)
  const rawArgs: number[] = []
  for (let i = 0; i < 100 && a(i) < view.byteLength; i++) {
    rawArgs.push(view.getUint8(a(i)))
  }
  return {
    systemShutoffTimeM: view.getUint32(a(0), true),
    configFlagsBits: flags,
    maintainPressure: bit(flags, ConfigFlag.CONFIG_MAINTAIN_PRESSURE),
    riseOnStart: bit(flags, ConfigFlag.CONFIG_RISE_ON_START),
    airOutOnShutoff: bit(flags, ConfigFlag.CONFIG_AIR_OUT_ON_SHUTOFF),
    heightSensorMode: bit(flags, ConfigFlag.CONFIG_HEIGHT_SENSOR_MODE),
    safetyMode: bit(flags, ConfigFlag.CONFIG_SAFETY_MODE),
    aiEnabled: bit(flags, ConfigFlag.CONFIG_AI_STATUS_ENABLED),
    sensorlessLeveling: bit(flags, ConfigFlag.CONFIG_SENSORLESS_LEVELING),
    pressureSensorMax: view.getUint16(a(8), true),
    bagVolumePercentage: view.getUint16(a(10), true),
    bagMaxPressure: view.getUint8(a(12)),
    compressorOnPSI: view.getUint8(a(13)),
    compressorOffPSI: view.getUint8(a(14)),
    rfButtonA: view.getUint8(a(16)),
    rfButtonB: view.getUint8(a(17)),
    rfButtonC: view.getUint8(a(18)),
    rfButtonD: view.getUint8(a(19)),
    bagStretchBelowPressure: view.getUint8(a(20)),
    bagStretchPressure: view.getUint8(a(21)),
    // args8[22..23] reserved.
    auxMode: view.getUint8(a(24)),
    auxTimeUnit: Math.min(3, view.getUint8(a(25))),
    auxPulseDuration: view.getUint8(a(26)),
    auxIntervalCycles: view.getUint8(a(27)),
    rawArgs,
  }
}

function parseCString(view: DataView, start: number): string {
  const bytes: number[] = []
  for (let i = start; i < view.byteLength; i++) {
    const b = view.getUint8(i)
    if (b === 0) break
    bytes.push(b)
  }
  return new TextDecoder().decode(new Uint8Array(bytes))
}

/** Parse a REST characteristic notification into a discriminated union. */
export function parseRest(view: DataView): RestNotification {
  if (view.byteLength < 2) return { kind: "unknown", cmd: -1 }
  const cmd = view.getUint16(0, true)
  switch (cmd) {
    case Cmd.AUTHPACKET:
      return {
        kind: "auth",
        result: view.byteLength >= 12 ? view.getUint32(a(4), true) : AuthResult.WAITING,
      }
    case Cmd.PRESETREPORT:
      if (view.byteLength >= 14) {
        return {
          kind: "preset",
          preset: {
            fp: view.getUint16(a(0), true),
            rp: view.getUint16(a(2), true),
            fd: view.getUint16(a(4), true),
            rd: view.getUint16(a(6), true),
            index: view.getUint16(a(8), true),
          },
        }
      }
      return { kind: "unknown", cmd }
    case Cmd.GETCONFIGVALUES:
      if (view.byteLength >= PACKET_SIZE) {
        return { kind: "config", config: parseConfig(view) }
      }
      return { kind: "unknown", cmd }
    case Cmd.UPDATESTATUSREQUEST:
      return { kind: "updateStatus", status: parseCString(view, ARGS_OFFSET) }
    default:
      return { kind: "unknown", cmd }
  }
}
