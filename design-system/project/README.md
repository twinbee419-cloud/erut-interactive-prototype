# ERUT Design System

Design system for **ERUT (Ultrasonic Monitoring System)** — a Windows-native
non-destructive testing (NDT) application by **이로운소프트 (Iroun Soft)**.

> 이로운소프트의 비파괴검사 소프트웨어 ERUT의 Windows 프로그램 디자인 시스템.

This repo distills the visual language, tokens, components and key screens
out of the source Figma into reusable CSS variables, JSX components, and
preview cards. It is the single source the design agent should consult when
designing _anything_ for ERUT.

---

## Sources

- **Figma** — `ERUT.fig` (mounted as a virtual filesystem during creation).
  Pages of interest:
  - `/page` — the live Windows program mock (TitleBar, Toolbar, FileMenuBar,
    StatusBar, screens) — _primary reference_
  - `/page/Component` — finished component frames + a working window mock
  - `/page/section` — full-screen flows: "검사 방식 선택", "장비 연결" etc.
  - `/page/Style-Guide` — variable tokens (color, space) and text styles
  - `/LOGO`, `/app-icon` — logo variants and the standalone app launcher icon
- **No codebase** was attached. UI was reconstructed from the Figma JSX
  pseudo-code, not screenshots, so token values are exact.

---

## Product context

ERUT is a **Windows desktop application** for **ultrasonic non-destructive
testing** of industrial equipment (pipes, vessels, etc.). It runs on a
PC connected to one or more ultrasonic sensor units (장비 — "equipment"),
optionally streaming over **MQTT**. The window chrome is custom — the app
draws its own title bar, file menu bar, toolbar and status bar.

Top-level surfaces:

| Surface | 한국어 | Role |
|---|---|---|
| Title bar | 타이틀바 | Custom navy bar with app logo + window controls |
| File menu bar | 파일 메뉴바 | "파일 / 장비 / 설정 / 도움말" dropdown root |
| Toolbar | 툴바 | Icon-only actions: 저장, 장비추가, ... |
| Content canvas | 컨텐츠 | Light cool surface, hosts UT scopes / forms |
| Status bar | 상태바 | Connection pills (장비/MQTT), PRF, Temp, version, resize grip |

Two top-level **inspection modes** the user picks on first run:
- **고정형 장비** (Fixed equipment — probe-based)
- **이동형 장비** (Mobile equipment — magnetic crawler / vacuum crawler)

---

## CONTENT FUNDAMENTALS

ERUT copy is **Korean-first, technical, and terse**. It speaks _to_ a domain
expert running an instrument — not a consumer.

- **Language:** Korean primary; English used for technical units, acronyms
  (PRF, MQTT, UT), the product wordmark, and the marketing-tier tagline
  ("ERUT - Ultrasonic Monitoring System").
- **Voice:** **Instructional, third-person, neutral.** No "you / I."
  Sentences end with `~해 주세요`, `~합니다`, `~할 수 있습니다`. Examples
  from the file:
  - _"검사 방식을 선택해 주세요."_ — "Please select an inspection mode."
  - _"선택한 형태에 맞는 메인 화면으로 이동합니다."_ — "Navigates to the
    main screen matching the selection."
  - _"장비의 연결 상태를 확인해 주세요."_ — "Please verify equipment
    connection status."
- **Tone:** Calm, declarative, never enthusiastic. No exclamation marks.
  No conversational fillers. Errors and warnings are stated as facts.
- **Casing:** Korean has no case. English follows **Title Case** for
  product/feature names (`Ultrasonic Monitoring System`) and **UPPER**
  for acronyms (MQTT, PRF, NDT).
- **Numbers / units:** ASCII, with the unit space-separated when long
  (`PRF : ---`, `Temp : ---`, `v0.0.0.0`). Em-dash placeholders (`---`)
  are used for not-yet-available values.
- **Menus & shortcuts:** verb-form labels (`열기`, `저장`, `다른이름으로 저장`,
  `종료`) followed by their Windows-style shortcut (`Ctrl+O`, `Ctrl+S`,
  `F6`, `F7`) right-aligned in `--content-low`.
- **Emoji:** **never.** The only "icon-glyphs" in the file are real SVGs.

Copy examples to imitate:
```
파일                       ←  menu root
  열기              Ctrl+O
  저장              Ctrl+S
  다른이름으로 저장   Ctrl+Shift+S
  ─────
  최근 프로젝트
  종료

장비 미연결                 ← status pill (red dot)
MQTT 미연결
PRF : ---     Temp : ---                       v0.0.0.0
```

---

## VISUAL FOUNDATIONS

- **Corner radii — none.** The brief is explicit: _radius 값을 설정하지
  않고 각진 형태의 디자인으로_. Cards, fields, buttons, dialogs, dropdowns
  are all **square**. The only rounding lives on:
  - Status-bar pills (`100px`)
  - LED-style status dots (`50%`)
  - Decorative app-launcher icon (`54px` — outside the program itself)
- **Palette mood:** cool blue-greys on a near-white canvas, navy title bar,
  **brand blue (`#2285EF`) reserved for emphasis** — selected card border,
  active toolbar icon, primary CTA. Never used as a fill across large
  surfaces.
- **Background system:** solid fills only. Window canvas is `--surface-base`
  (`#F7F9FC`). Toolbars / menus / status bars sit on `--surface-subtle-1`
  (`#EBEFF6`) with a 1px `--border-medium` stroke. No gradients, no
  textures, no images behind UI.
- **Borders:** every grouping carries a 1px stroke (`#A5B2CA`). Selected
  state swaps the stroke for `--border-emphasis` _and_ tints the fill with
  a 10% brand wash (`linear-gradient(rgba(34,133,239,0.1), …)` over the
  base subtle-2). Dividers inside a panel are 1px `#A5B2CA`.
- **Shadows:** almost never used as drop shadows. The only shadow pattern
  in the file is an **inset glow** on status pills:
  `inset 2px 2px 4px rgba(36,80,158,0.4)`. Cards do _not_ float — they sit
  flat on the canvas, separated by borders.
- **Type:** **NanumSquare** is the _only_ font family — Korean, English,
  and numerals all use it. Bold (700) carries headings and labels; Regular
  (400) handles body and field text. Sizes 16 / 14 / 12 dominate, with
  18 for screen titles and 24 for hero questions. Tracking is a consistent
  **+0.020em** across most text — it is part of the look.
- **Iconography:** monochrome 24×24 line icons, ~1.5px stroke, square ends,
  no flourishes. Color follows the text color of the surface they sit in
  (use `currentColor`). Toolbar icons get a 64×40 hit target with 20px
  side-padding.
- **Status indicators:** circular LED-style — a hard center dot over a
  larger soft radial-gradient halo of the same hue at ~26% alpha. Red
  (`#FF005E`) = disconnected, Green (`#18E339`) = connected.
- **Hover state:** lift the cell background to `--surface-subtle-2` and
  keep the same stroke. Text color is unchanged.
- **Press / active state:** tint the cell with the 10% brand wash + swap
  border to `--border-emphasis`. Text inside an "emphasis" button turns
  `--content-emphasis` (`#2285EF`).
- **Disabled state:** content drops to `--content-low` (`#6B7C9B`) and
  fills drop to `--surface-disabled` (`#AEB8CA`). System-disabled grey
  `#8C8C8C` is the alternative for non-content elements.
- **Layout rules:** Windows-native 1920×1080 canvas. **Fixed chrome
  heights:** title bar = 40px, menu bar = 40px, toolbar = 40px, status
  bar = 46px → 126px of chrome, 914px of content. Side padding inside
  the content canvas is 40px; vertical 20px. Spacing scale is the
  Variables/space set: **4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96**.
- **Transparency & blur:** the status bar is the only element with
  `backdrop-filter: blur(100px)`; everywhere else is opaque. Overlay
  tints are 10% black or 10% white.
- **Animation:** none in the source file. UT scope visualisation suggests
  a 1-second-cycle radial "rolling" indicator (a small animated PNG in
  `page/Component/assets`) as the busy state; no easing curves or page
  transitions are specified. Treat motion as **functional only** — match
  the calm instrument feel.

---

## ICONOGRAPHY

- **Style:** 24×24 monochrome line icons, **single stroke ~1.5px**,
  rounded-not / open-not — square stroke ends. Stroke colour follows the
  enclosing surface (`currentColor`). No filled or two-tone icons.
- **In the source file:** the app ships its own icon set drawn directly
  in Figma (FileMenu, Toolbar, StatusBar use `IconSave`, `IconAddMachine`,
  `IconMaximize`, `IconClose`, `IconMinimize`, `IconResizeCorner`,
  `IconChevronDown`, `IconSetting`, `IconCalender`, `IconBolt`, `IconMove`).
  The text style metadata also references **`xeicon`** — a Korean icon
  font that appears in earlier marketing pages (`/x`). The Windows program
  itself does **not** rely on it.
- **In this design system:** we copied the original SVGs we could resolve
  cleanly out of the Figma into `assets/icons/` and `assets/app-icon/`.
  For everything else, the recommended substitute is **Lucide**
  (https://lucide.dev) at 24px, stroke-width 1.5 — same weight, same
  square caps, matches the existing set visually. _Flag whenever Lucide
  is used._
- **Emoji:** never used in product UI. Do not introduce.
- **Unicode glyphs as icons:** only the em-dash `---` placeholder for
  not-yet-available metric values is in the existing copy.

---

## Repo index

```
README.md                  ← this file
SKILL.md                   ← Agent-skill manifest
colors_and_type.css        ← single source of truth: tokens + roles

assets/
  logo/                    ← ERUT wordmark + monogram (SVG, currentColor)
  app-icon/                ← Tools/NDT launcher icon parts
  icons/                   ← extracted UI icons (chevron, setting, maximize…)

fonts/                     ← (none bundled — see SUBSTITUTIONS below)

preview/                   ← Design-system tab cards (~700×N each)
  *.html

ui_kits/
  erut-windows/            ← Windows-app UI kit (the ONLY product surface)
    README.md
    index.html             ← interactive click-thru: mode picker → main
    *.jsx                  ← TitleBar, Toolbar, StatusBar, FileMenu,
                             ModePicker, EquipmentConnect, Button, Field…
```

---

## SUBSTITUTIONS — please confirm

| Family in Figma | Source in this kit | Notes |
|---|---|---|
| **NanumSquare** | `fonts/NanumSquareOTF_acB.otf`, `fonts/NanumSquareOTF_acR.otf`, `fonts/NanumSquareR.otf`, `fonts/NanumSquareB.otf` | **Brand-supplied OTF.** Wired up via `@font-face` (Regular = 400, Bold = 700). The `acR/acB` extended-coverage faces are listed first; the plain `R/B` files act as fallback. |

NanumSquare is the **sole** font in the system — Korean, English and
numerals all use it. The earlier Pretendard / Inter / Roboto references
that appeared in the source Figma have been collapsed into a single
family per the brand direction.

Icons that aren't in the Figma JSX as standalone SVGs are substituted
with **Lucide** at stroke-width 1.5 — please confirm or swap for the
real assets.

Icons that aren't in the Figma JSX as standalone SVGs are substituted
with **Lucide** at stroke-width 1.5 — please confirm or swap for the
real assets.
