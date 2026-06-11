# ERUT Windows · UI Kit

A pixel-faithful, **non-production** React recreation of the ERUT Windows
program, distilled from the source Figma (`/page/Component`,
`/page/section`, `/page/components`). Intended for design mocks,
prototyping, and as a copy-source for production work.

## Surface

ERUT is **one product, one surface**: a 1920×1080 Windows desktop app
with custom-drawn chrome. There is no marketing site, no docs site, no
mobile companion in the Figma. This kit covers that one surface.

## Files

- `index.html` — interactive click-thru. Boots into the **ModePicker**
  (`검사 방식을 선택해 주세요`), advances to **EquipmentConnect**
  (`장비의 연결 상태를 확인해 주세요` with three connection methods),
  and finally **ConnectFailed** (the empty/error state with **재시도** and
  **장비 연결 설정** buttons). The title-bar, file-menu, toolbar, status-bar
  are live the whole time. The 파일 / 장비 menus open real context-menu
  dropdowns. Toolbar buttons cross-link to the matching screen.
- `Icons.jsx` — 17 monochrome 24×24 icons, `currentColor`, stroke 1.5.
  Exposes `window.EIcon`.
- `Chrome.jsx` — `TitleBar`, `MenuBar`, `Toolbar`, `StatusBar`, `StatusPill`.
- `Controls.jsx` — `Button` (default / active / emphasis / disabled, three
  sizes), `Field`, `Select`, `Checkbox`, `Toggle`, `Card`, `ContextMenu`, `Badge`.
- `Screens.jsx` — `ModePicker`, `EquipmentConnect`, `ConnectFailed`.
- `kit.css` — every visual rule for the kit. Imports `colors_and_type.css`
  via `index.html` first, then layers component CSS on top.

## Component contracts (the short version)

```jsx
<TitleBar title="ERUT - Ultrasonic Monitoring System" onMin onMax onClose />

<MenuBar items={["파일","장비","설정","도움말"]} active={"파일"} onPick={…} />

<Toolbar
  items={[
    { key:"save", label:"저장", icon:<EIcon.Save/> },
    { divider:true },
    { key:"add",  label:"장비추가", icon:<EIcon.AddMachine/> },
  ]}
  activeKey="add" onPick={…} />

<StatusBar deviceConnected mqttConnected prf="2,000 Hz" temp="23.4 °C" version="v1.4.2"/>

<Button variant="emphasis" size="l">선택</Button>      {/* default | active | emphasis | disabled */}
<Field   value={v} onChange={setV} placeholder="입력해주세요." />
<Select  value={mode} options={["고정형 장비","스캔형 장비"]} onChange={setMode} />
<Checkbox checked onChange={setOn} label="기본 형태로 저장 (다음 실행 시 자동 진입)"/>
<Toggle   checked onChange={setOn} label="Gate 범위 표시" size="m"/>  {/* size: m | sm. Use for live-effect on/off; Checkbox for form submit. */}

<ContextMenu items={[
  { label:"열기", shortcut:"Ctrl+O", onClick:… },
  { divider:true },
  { label:"종료" },
]}/>
```

## What's faithful vs. what's a placeholder

| Faithful | Placeholder |
|---|---|
| Token values (colour / type / spacing) | The "broken-plug" icon on ConnectFailed — drawn from the existing AddMachine icon + a red diagonal stroke |
| Title-bar / menu / toolbar / status-bar metrics | Real device IO (everything is local React state) |
| ModePicker layout + copy | Real network scan / MQTT |
| EquipmentConnect three connection methods | `최근 프로젝트` submenu (label only) |
| ConnectFailed empty / error state | Resize-corner — visual only |
| Button / Field / Checkbox states + hover/active treatments using overlay tokens | |
| Status pill geometry + inset glow | |

## Not covered

- The marketing pages in `/x` and `/page2` of the Figma (`이로운소프트`
  brand site, demo videos) — out of scope per the brief.
- The Android-style launcher icon in `/app-icon` — captured as SVG parts
  in `../../assets/app-icon/` but not used inside the Windows program.

## Running

Open `index.html` directly — no build step. The page scales the 1920×1080
canvas down to fit your viewport. All scripts are loaded from CDNs pinned
in the project conventions.
