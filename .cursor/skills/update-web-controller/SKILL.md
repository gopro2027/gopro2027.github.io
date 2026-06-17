---
name: update-web-controller
description: Update the live Web Bluetooth controller (oasman-nextjs/app/controller) so it stays in sync with new BLE protocol commands and features added to the OAS-MAN firmware (LVGL Wireless_Controller, ESP32_SHARED_LIBS, and the Flutter app). Use when the user asks to sync, update, or port firmware/protocol/BLE changes into the website's real browser-based controller.
disable-model-invocation: true
---

# Update Web Bluetooth Controller from Firmware

This website hosts a real, working controller at the `/controller` route that talks to the OAS-MAN manifold over Web Bluetooth. Unlike the demo emulator, it is NOT a UI clone of the LVGL screen — it mirrors the BLE wire protocol and exposes the same features through standard web UI. This skill ports new firmware/protocol features into that web controller.

For the separate, non-functional UI mock, use the `update-controller-demo` skill instead.

## Source of truth and target

| Role | Path |
|------|------|
| Protocol contract (structs, enums, packet types) | `ArduinoAirSuspensionController/ESP32_SHARED_LIBS/src/BTOas.h` (+ `BTOas.cpp`) |
| Constants (passkey, names, wheel/solenoid indices) | `ArduinoAirSuspensionController/ESP32_SHARED_LIBS/src/user_defines.h` |
| Human-readable API reference | `ArduinoAirSuspensionController/OASMan_ESP32/BLE_API_DOCUMENTATION.md` |
| Working client cross-check (explicit byte packing) | `ArduinoAirSuspensionController/MobileApp/oasman_mobile/lib/ble_manager.dart` |
| Firmware client reference (handshake, valve loop) | `ArduinoAirSuspensionController/Wireless_Controller/src/bt/ble.cpp`, `src/utils/util.cpp` |
| Web controller (edit these) | `oasman-nextjs/app/controller/` |

The `ArduinoAirSuspensionController` repo is usually cloned alongside this repo. Always read the actual current firmware source for the area being changed; do not rely on memory.

## Web controller file map

| File | Responsibility |
|------|----------------|
| `protocol.ts` | UUIDs, `Cmd`/`StatusBit`/`ConfigFlag`/`AuthResult`/`Solenoid`/`Rf`/`Bp32` enums, 104-byte packet builders, and `parseStatus` / `parseConfig` / `parseRest` decoders. The wire protocol lives here. |
| `useOasmanBle.ts` | Connection/auth/notification state machine, status watchdog, GATT op-queue, `sendRest`/`writeValve`, init sequence after auth. |
| `controls.tsx` | Shared themed UI primitives (Card, Button, Toggle, Row, NumberField, TextField, StatusPill, HoldButton). |
| `HomeTab.tsx` | Hold-to-air valve control (per corner / axle) + live pressure readouts. |
| `PresetsTab.tsx` | Load/save the five profiles + global air up/out. |
| `SettingsTab.tsx` | Editable config (GETCONFIGVALUES read/write) + all action-command cards. |
| `page.tsx` | Browser-support gate, Connect panel (passkey), tab shell. |

## Workflow

```
- [ ] 1. Find what changed in the firmware/protocol
- [ ] 2. Map each change to the web controller part (table below)
- [ ] 3. Apply edits to protocol.ts first, then the consuming tab/hook
- [ ] 4. Build to verify
```

### Step 1: Find what changed

Ask the user what changed if unclear. Otherwise inspect the protocol/firmware, e.g. from the `ArduinoAirSuspensionController` repo:

```bash
git log --oneline -20 -- ESP32_SHARED_LIBS/src/BTOas.h ESP32_SHARED_LIBS/src/BTOas.cpp
git diff <since>..HEAD -- ESP32_SHARED_LIBS/src
```

The single most important question is whether the **wire format** changed (new command, new args byte, new status/config field). If only firmware-internal behavior changed with no wire-format change, the web controller usually needs no edit.

### Step 2: Firmware/protocol -> web controller mapping

| Firmware change | Web controller edit |
|-----------------|---------------------|
| New `BTOasIdentifier` command | Add to `Cmd` in `protocol.ts`; add a `buildX(...)` builder; wire a control into the relevant tab. |
| New enum (`ConfigFlagsBit`, `StatusPacketBittset`, `SOLENOID_INDEX`, `RfCommand*`, `BP32CMD`, aux modes) | Add/extend the matching const object in `protocol.ts`. |
| New STATUSREPORT field | Extend `StatusReport` type + `parseStatus`; surface it in `HomeTab` readouts or `SettingsTab` StatusCard. |
| New / changed GETCONFIGVALUES field | Extend `ConfigValues` type, `parseConfig` (read offset), and `buildConfigWrite` (write offset); add a row to `SettingsTab`. |
| New command args layout | Update the corresponding `buildX` builder's byte offsets. |
| New solenoid / valve mapping | Extend `Solenoid`; update the `FRONT`/`REAR` pill defs in `HomeTab`. |
| New preset/profile behavior | Update `PresetsTab` (AIRUPQUICK / SAVECURRENTPRESSURESTOPROFILE / PRESETREPORT). |
| Changed handshake or init sequence | Update `connect` / `onAuthSuccess` in `useOasmanBle.ts`. |
| New passkey/security behavior | Update auth handling in `useOasmanBle.ts` and the Connect panel in `page.tsx`. |

### Protocol invariants (do not break)

- `BTOasPacket` is **104 bytes**, **little-endian**: `cmd` u16 @0, `sender` @2, `recipient` @3, `args[100]` @4. The `a(n)` helper in `protocol.ts` maps an args-relative offset to the absolute packet offset; typed views are `args8[n]`->4+n, `args16[n]`->4+2n, `args32[n]`->4+4n.
- The byte map in `parseConfig` (read) and `buildConfigWrite` (write) MUST stay mirror-images of each other and match `BTOas.h` / `BLE_API_DOCUMENTATION.md`. `buildConfigWrite` echoes the last-read `rawArgs` and sets `setValues` (args8[15]) = 1.
- Valve control is a separate 4-byte LE u32 bitmask to the VALVECONTROL characteristic (not a `BTOasPacket`).
- Auth must be sent within ~5s of connecting; the manifold streams STATUS only to authenticated clients. Keep the 5s status watchdog.
- All GATT writes go through the serialized `enqueue` op-queue (Web Bluetooth rejects concurrent operations).

### Step 3: Apply edits

- Edit `protocol.ts` first (enum + builder/parser), then the consuming tab/hook.
- Keep label strings consistent with firmware/app wording where it helps users.
- Use existing `controls.tsx` primitives rather than new bespoke styling.
- Confirm 0-based vs 1-based: profiles/presets are 0-based on the wire, shown 1-based in the UI.
- Do NOT touch the demo mock `ControllerEmulator.tsx` or `globals.css` `.ctrl-*` classes — those belong to the `update-controller-demo` skill.

### Step 4: Verify

```bash
# from the oasman-nextjs dir
npm run build
```

Build must exit 0 and prerender the `/controller` route. Also confirm no linter errors in edited files. End-to-end BLE behavior can only be confirmed against real hardware in Chrome/Edge over HTTPS.

## Notes

- Web Bluetooth is Chromium-only (desktop Chrome/Edge/Opera, Android Chrome) and requires HTTPS + a user gesture. Keep the support gate in `page.tsx`.
- If the TS lib rejects a `Uint8Array` passed to `writeValueWithResponse`, cast it `as BufferSource` (generic `Uint8Array<ArrayBufferLike>` vs `ArrayBuffer` mismatch).
- The Flutter `ble_manager.dart` is the best cross-check for exact byte offsets when porting a new command, since it also packs bytes explicitly.
