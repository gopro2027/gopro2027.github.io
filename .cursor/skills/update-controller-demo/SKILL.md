---
name: update-controller-demo
description: Update the embedded OAS-MAN controller demo (ControllerEmulator.tsx) in this oasman-nextjs website to match changes made in the full LVGL Wireless_Controller firmware project. Use when the user asks to sync, update, or port controller/firmware UI changes into the website's interactive controller demo or emulator.
disable-model-invocation: true
---

# Update Controller Demo from LVGL Firmware

This website has an interactive replica of the OAS-MAN touch-screen controller. This skill ports UI changes from the real LVGL firmware into that React replica.

## Source and target

| Role | Path |
|------|------|
| Firmware (source of truth) | The `ArduinoAirSuspensionController` repo, `Wireless_Controller/` dir (usually cloned alongside this repo) |
| React demo (edit this) | `oasman-nextjs/app/ControllerEmulator.tsx` |
| Demo styles | `oasman-nextjs/app/globals.css` (classes prefixed `.ctrl-`) |
| Where it renders | "Try the controller" section in `oasman-nextjs/app/page.tsx` |

The demo is a stripped-down but interactive replica: pills change local PSI, presets animate + toast, settings are display-only. It is NOT a full port — keep that scope. Default theme is Ocean Blue.

## Workflow

```
- [ ] 1. Find what changed in the firmware
- [ ] 2. Map each change to the React part (table below)
- [ ] 3. Apply edits to ControllerEmulator.tsx (and globals.css if styling)
- [ ] 4. Build to verify
```

### Step 1: Find what changed

Ask the user what changed if unclear. Otherwise inspect the firmware repo, e.g.:

```bash
# from the Wireless_Controller dir of the ArduinoAirSuspensionController repo
git log --oneline -20 -- src/ui
git diff <since>..HEAD -- src/ui
```

Always read the actual current firmware source for the area being changed; do not rely on memory.

### Step 2: Firmware → React mapping

| Firmware file | React location in `ControllerEmulator.tsx` |
|---------------|---------------------------------------------|
| `src/ui/components/Scr.cpp` (pressure labels, bg gradient) | `PressureLabels`, `.ctrl-screen` bg in globals.css |
| `src/ui/screens/ui_scrHome.cpp` (pill grid, valve bits) | `HomeTab`, `Pill`, `.ctrl-pill*` |
| `src/ui/screens/ui_scrPresets.cpp` (car, presets, save/load) | `PresetsTab`, `CarGraphic`, `PRESET_PSI`, `.ctrl-preset-btn` |
| `src/ui/screens/ui_scrSettings.cpp` (sections + options) | `SETTINGS_SECTIONS` array + `SettingRow` / `SettingSwitch` / `SettingSlider` / `SettingRadio` |
| `src/ui/components/navbar.cpp` (tabs) | `navItems` + `.ctrl-navbar` / `.ctrl-tab` |
| `src/ui/components/statusbar.cpp` | `.ctrl-statusbar` block in the root component |
| Theme colors (NVS presets) | `THEME` const at top of the file |

### Common change types

**New/changed setting option** (most common): edit the `SETTINGS_SECTIONS` array. Each section is `{ name, rows }`; each row is a typed `Row` (`header` | `value` | `switch` | `button` | `slider` | `radio` | `dropdown` | `input`). Match the firmware's exact label text and control type. Add a new `Row` type + a case in `SettingRow` only if the firmware introduces a control with no existing equivalent.

**New settings section**: add an entry to `SETTINGS_SECTIONS` in the same order as the firmware dropdown.

**Home pill / valve change**: update the `rows` definition in `HomeTab` (which corners each pill drives). The center pills drive both corners on an axle.

**Preset values / count / car shape**: update `PRESET_PSI` and/or `CarGraphic`. `lift = (3 - preset) * 6` controls ride height (preset 1 lowest, 5 tallest).

**Theme color change**: update the `THEME` object. The site accent should stay in sync with `--oasman-accent*` in globals.css (Ocean Blue).

**Pressure format change** (PSI/Bar/%): update the label rendering in `PressureLabels`.

### Step 3: Apply edits

- Keep firmware label strings verbatim (e.g. `"Compressor Frozen:"`, `"Maintain Preset"`).
- Preserve the demo's interaction model — do not wire up real BLE/hardware.
- Match colors to the firmware hex values; reuse `THEME` constants rather than hardcoding.

### Step 4: Verify

```bash
# from the oasman-nextjs dir
npm run build
```

Build must exit 0. Also confirm no linter errors in the edited files.

## Notes

- The car is an inline SVG (firmware ships `img_car.c`/`img_wheels.c` with no PNG export). If the firmware car art changes meaningfully, adjust the SVG paths in `CarGraphic`; otherwise leave it.
- Round 1.8" display variant (`src/ui_circle/`) is intentionally NOT represented in the demo. Ignore it unless the user asks to add it.
