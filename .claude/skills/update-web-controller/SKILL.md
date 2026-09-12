---
name: update-web-controller
description: Update the real, working Web Bluetooth controller on the website (oasman-nextjs/app/controller, the /controller page) to match the latest OAS-MAN firmware — BLE commands, packet layouts and string field sizes, status bits, and config fields from the wireless controller (LVGL Wireless_Controller), the manifold (OASMan_ESP32), ESP32_SHARED_LIBS, and the Flutter app. Use whenever the user asks to update, sync, or port firmware changes into the web controller, website controller, or browser/Bluetooth controller, however they phrase it — e.g. "run the update skill", "update the web controller with the latest from the wireless controller", "port this firmware PR to the site", or changes to OTA/Wi-Fi, config, or status packets. Not for the non-functional controller demo/emulator (that is update-controller-demo).
---

# Update Web Bluetooth Controller from Firmware

This website hosts a real, working controller at the `/controller` route that talks to the OAS-MAN manifold over Web Bluetooth. Unlike the demo emulator, it is NOT a UI clone of the LVGL screen — it mirrors the BLE wire protocol and exposes the same features through standard web UI. This skill ports new firmware/protocol features into that web controller.

For the separate, non-functional UI mock, use the `update-controller-demo` skill instead (currently Cursor-only, at `.cursor/skills/update-controller-demo/SKILL.md`).

A Cursor copy of this skill lives at `.cursor/skills/update-web-controller/SKILL.md`. Keep the two in sync when the workflow changes — except invocation: the Cursor copy sets `disable-model-invocation: true`, while this copy deliberately omits it so plain-English requests find it.

## Source of truth and target

| Role | Path |
|------|------|
| Protocol contract (structs, enums, packet types) | `ArduinoAirSuspensionController/ESP32_SHARED_LIBS/src/BTOas.h` (+ `BTOas.cpp`) |
| Constants (passkey, names, wheel/solenoid indices) | `ArduinoAirSuspensionController/ESP32_SHARED_LIBS/src/user_defines.h` |
| Human-readable API reference | `ArduinoAirSuspensionController/OASMan_ESP32/BLE_API_DOCUMENTATION.md` |
| Working client cross-check (explicit byte packing) | `ArduinoAirSuspensionController/MobileApp/oasman_mobile/lib/ble_manager.dart` |
| Firmware client reference (handshake, valve loop) | `ArduinoAirSuspensionController/Wireless_Controller/src/bt/ble.cpp`, `src/utils/util.cpp` |
| Firmware UI labels/ranges (for matching wording) | `ArduinoAirSuspensionController/Wireless_Controller/src/ui/screens/ui_scrSettings.cpp` |
| Web controller (edit these) | `oasman-nextjs/app/controller/` |

The `ArduinoAirSuspensionController` repo is usually cloned alongside this repo (a sibling directory). Always read the actual current firmware source for the area being changed; do not rely on memory. For struct field offsets, the accessor bodies in `BTOas.cpp` (e.g. `ConfigValuesPacket::_compressorCrankOffset()` → `args8()[12 + 10]`) are the ground truth; the constructor only shows which fields exist.

## Web controller file map

| File | Responsibility |
|------|----------------|
| `protocol.ts` | UUIDs, `Cmd`/`StatusBit`/`ConfigFlag`/`AuthResult`/`Solenoid`/`Rf`/`Bp32` enums, 104-byte packet builders, and `parseStatus` / `parseConfig` / `parseRest` decoders. The wire protocol lives here. |
| `useOasmanBle.ts` | Connection/auth/notification state machine, status watchdog, GATT op-queue, `sendRest`/`writeValve`, init sequence after auth. Also holds zero-value literals such as `ZERO_FLAGS`. |
| `controls.tsx` | Shared themed UI primitives (Card, Button, Toggle, Row, NumberField, TextField, StatusPill, HoldButton). |
| `HomeTab.tsx` | Hold-to-air valve control (per corner / axle) + live pressure readouts. |
| `PresetsTab.tsx` | Load/save the five profiles + global air up/out. |
| `SettingsTab.tsx` | Editable config (GETCONFIGVALUES read/write), StatusCard pills, and all action-command cards (Wi-Fi/OTA, broadcast name, maintenance, RF, BP32, aux). |
| `page.tsx` | Browser-support gate, Connect panel (passkey), tab shell. |

## Workflow

```
- [ ] 1. Find what changed in the firmware/protocol (named PR/commits)
- [ ] 2. Audit protocol.ts against current BTOas.h/.cpp for older, unsynced drift
- [ ] 3. Map each change to the web controller part (table below)
- [ ] 4. Apply edits to protocol.ts first, then the consuming tab/hook
- [ ] 5. Build, then runtime-check the byte layout of anything touched
- [ ] 6. Report, flagging any breaking wire-format change
```

### Step 1: Find what changed

Ask the user what changed if unclear. Otherwise inspect the protocol/firmware from the `ArduinoAirSuspensionController` repo:

```bash
git log --oneline -20 -- ESP32_SHARED_LIBS/src/BTOas.h ESP32_SHARED_LIBS/src/BTOas.cpp
git diff <since>..HEAD -- ESP32_SHARED_LIBS/src
```

**When given a GitHub PR number:** `gh` may not be installed. Use the local clone instead:

```bash
git fetch origin
git ls-remote --heads origin
git log --oneline origin/<base>..origin/<head>
git diff --stat origin/<base>...origin/<head>
git diff origin/<base>...origin/<head> -- ESP32_SHARED_LIBS/src OASMan_ESP32/BLE_API_DOCUMENTATION.md MobileApp/oasman_mobile/lib/ble_manager.dart
```

`ls-remote` finds the PR's head branch. The base is usually `dev`, not `main` — confirm it by checking that the commit just below the PR's commits is the tip of the candidate base branch. The Dart and `BLE_API_DOCUMENTATION.md` diffs in the same PR are the quickest cross-check of the intended new byte layout.

The single most important question is whether the **wire format** changed (new command, new args byte, new status/config field, moved or resized field). If only firmware-internal behavior changed with no wire-format change, the web controller usually needs no edit.

### Step 2: Audit for older drift

Do not assume earlier firmware changes were already ported. Compare the last change to `oasman-nextjs/app/controller/protocol.ts` (`git log -1 --format=%ad`) with `git log --format="%h %ad %s" --date=short -- ESP32_SHARED_LIBS/src/BTOas.h` in the firmware repo, then check `protocol.ts` directly against current firmware:

- `Cmd` vs `enum BTOasIdentifier`
- `StatusBit` vs `enum StatusPacketBittset`
- `ConfigFlag` vs `enum ConfigFlagsBit`
- `ConfigValues` / `parseConfig` / `buildConfigWrite` vs every `ConfigValuesPacket::_*()` accessor offset in `BTOas.cpp`
- Every string-packet builder (e.g. `buildStartWeb`) vs its packet's field offsets and max lengths

Port any drift found alongside the requested change, and call it out separately in the report.

### Step 3: Firmware/protocol -> web controller mapping

| Firmware change | Web controller edit |
|-----------------|---------------------|
| New `BTOasIdentifier` command | Add to `Cmd` in `protocol.ts`; add a `buildX(...)` builder; wire a control into the relevant tab. |
| Retired command id | Replace its `Cmd` entry with a `// N retired (formerly X); do not reuse` comment, matching firmware. |
| New enum (`ConfigFlagsBit`, `StatusPacketBittset`, `SOLENOID_INDEX`, `RfCommand*`, `BP32CMD`, aux modes) | Add/extend the matching const object in `protocol.ts`. |
| New STATUSREPORT field / status bit | Extend `StatusFlags`/`StatusReport` + `parseStatus`; update `ZERO_FLAGS` in `useOasmanBle.ts`; surface it in `HomeTab` readouts or the `SettingsTab` StatusCard. |
| New / changed GETCONFIGVALUES field | Extend `ConfigValues` type, `parseConfig` (read offset), and `buildConfigWrite` (write offset); add a row to `SettingsTab`, reusing the firmware's label. |
| Retired GETCONFIGVALUES field (slot left unused) | Remove it from `ConfigValues`, `parseConfig`, and `buildConfigWrite`, leaving a `// retired` comment at the offset so `rawArgs` echoes the slot unchanged; remove its `SettingsTab` row. Firmware leaves the slot in place, so no other offsets move. |
| New command args layout, or a string field moved/resized | Update the corresponding `buildX` builder's byte offsets and max lengths. Export the limits as constants and pass them to the `TextField` `maxLength`. |
| New solenoid / valve mapping | Extend `Solenoid`; update the `FRONT`/`REAR` pill defs in `HomeTab`. |
| New preset/profile behavior | Update `PresetsTab` (AIRUPQUICK / SAVECURRENTPRESSURESTOPROFILE / PRESETREPORT). |
| Changed handshake or init sequence | Update `connect` / `onAuthSuccess` in `useOasmanBle.ts`. |
| New passkey/security behavior | Update auth handling in `useOasmanBle.ts` and the Connect panel in `page.tsx`. |

### Protocol invariants (do not break)

- `BTOasPacket` is **104 bytes**, **little-endian**: `cmd` u16 @0, `sender` @2, `recipient` @3, `args[100]` @4. The `a(n)` helper in `protocol.ts` maps an args-relative offset to the absolute packet offset; typed views are `args8[n]`->4+n, `args16[n]`->4+2n, `args32[n]`->4+4n.
- The byte map in `parseConfig` (read) and `buildConfigWrite` (write) MUST stay mirror-images of each other and match `BTOas.h` / `BTOas.cpp` / `BLE_API_DOCUMENTATION.md`. `buildConfigWrite` echoes the last-read `rawArgs` and sets `setValues` (args8[15]) = 1.
- String fields rely on the zero-filled packet for NUL termination: write at most `fieldSize - 1` bytes so the last byte of each field stays 0.
- Valve control is a separate 4-byte LE u32 bitmask to the VALVECONTROL characteristic (not a `BTOasPacket`).
- Auth must be sent within ~5s of connecting; the manifold streams STATUS only to authenticated clients. Keep the 5s status watchdog.
- All GATT writes go through the serialized `enqueue` op-queue (Web Bluetooth rejects concurrent operations).
- Keep `protocol.ts` free of imports and TypeScript `enum`s (use `as const` objects) so it can run directly under Node's type stripping for the Step 5 check.

### Step 4: Apply edits

- Edit `protocol.ts` first (enum + builder/parser), then the consuming tab/hook.
- After changing an interface, grep for object literals typed with it (e.g. `ZERO_FLAGS: StatusFlags`) — they need the new field too.
- Keep label strings consistent with firmware/app wording where it helps users.
- Use existing `controls.tsx` primitives rather than new bespoke styling.
- Confirm 0-based vs 1-based: profiles/presets are 0-based on the wire, shown 1-based in the UI.
- Do NOT touch the demo mock `ControllerEmulator.tsx` or `globals.css` `.ctrl-*` classes — those belong to the `update-controller-demo` skill.

### Step 5: Verify

```bash
npm run build
```

Run it from the `oasman-nextjs` dir. Build must exit 0 and prerender the `/controller` route. Also confirm no linter errors in edited files.

Then check the real byte layout of every builder/parser you touched, rather than trusting offset arithmetic. Node 22+ can run `protocol.ts` directly. Write a throwaway `.mjs` script **outside the repo** (e.g. the session scratchpad), import `protocol.ts` by absolute `file:///` URL (a relative import resolves against the script's own directory), and assert offsets, truncation at max length, NUL terminators, and that config round-trips leave retired slots untouched. For example:

```js
import { buildStartWeb } from "file:///<abs-path-to>/oasman-nextjs/app/controller/protocol.ts"
const p = buildStartWeb("A".repeat(40), "B".repeat(80), true)
console.log(p.length, p[0], p[4 + 32], p[4 + 97], p[4 + 98]) // expect: 104 14 0 0 1
```

```bash
node --experimental-strip-types <scratchpad>/check.mjs
```

The "Reparsing as ES module" warning is harmless. End-to-end BLE behavior can only be confirmed against real hardware in Chrome/Edge over HTTPS — say so in the report.

### Step 6: Report

- List the requested change and any Step 2 drift separately.
- If the wire format changed incompatibly (moved/resized fields, retired commands), warn that the live site will only work with manifolds on matching firmware, and note whether that firmware change is merged/released yet so the user can time the website deploy.

## Notes

- Web Bluetooth is Chromium-only (desktop Chrome/Edge/Opera, Android Chrome) and requires HTTPS + a user gesture. Keep the support gate in `page.tsx`.
- If the TS lib rejects a `Uint8Array` passed to `writeValueWithResponse`, cast it `as BufferSource` (generic `Uint8Array<ArrayBufferLike>` vs `ArrayBuffer` mismatch).
- The Flutter `ble_manager.dart` is the best cross-check for exact byte offsets when porting a new command, since it also packs bytes explicitly.
- `TextField` `maxLength` counts UTF-16 code units, not bytes; the builders truncate by encoded bytes, so multi-byte input is still safe on the wire.
