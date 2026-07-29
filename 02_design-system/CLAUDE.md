# CLAUDE.md — 디자인 시스템 (ERUT)

ERUT의 **디자인 SSOT**. 모든 기획·UI·mockup의 시각 규칙·토큰·컴포넌트 단일 출처. 루트 지침(`../CLAUDE.md`)의 디자인 관련 내용을 이 폴더로 분리한 문서.

## SSOT 원칙 (절대)
- 모든 UI·mockup은 `02_design-system/`을 단일 출처로 삼는다.
- 토큰: `02_design-system/project/colors_and_type.css` · 컴포넌트: `.../ui_kits/erut-windows/kit.css` (`.erut-*`).
- 가이드(do/don't): `02_design-system/README.md` · `project/README.md` · `project/SKILL.md`.
- 신규 산출물 `<head>`에 colors_and_type.css + kit.css `<link>`.
- 충돌 우선순위: **design-system > 기타 참고자료**. 시각은 항상 design-system 기준.

## 시각 원칙 + 금지
- **각진(radius 0**; pill 100px·LED dot 50%만 예외) · **라이트 surface + 네이비 chrome** · **brand blue `#2285EF` 강조 전용**(큰 면적 fill 금지) · **NanumSquare**(letter-spacing +0.02em) · **한국어 우선** · **이모지 없음** · **드롭섀도우 없음**(border로 구분; status pill inset glow만 예외).
- 금지: 라운드 코너 / 다크테마 색 / 청록 `#0f9b8e` / Segoe UI / 이모지·유니코드 글리프 아이콘 / 자체 `.panel`·`.btn` / 그라데이션 배경(active card 10% brand wash만 예외).
- **hex 하드코딩 금지 — `var(--*)` 토큰만** (SVG `stop-color`/`stroke`만 예외).
- **토큰만 사용**(색·간격·타이포·radius·shadow). 토큰·컴포넌트에 없는 신규 필요 시 **사전 확인**.

## 디자인 토큰 (요약 — 정식: colors_and_type.css)
- **Content**: high `#0A1C3C`(본문) · medium `#354D74`(보조·타이틀바) · low `#6B7C9B`(캡션·placeholder) · inverse `#FFFFFF` · emphasis `#2285EF`(active).
- **Surface**: base `#F7F9FC`(캔버스) · subtle-1 `#EBEFF6`(툴/메뉴/상태바) · subtle-2 `#F1F5FC`(카드·hover) · subtle-3 `#EAF8FF`(연한 brand-tint) · strong `#354D74`(네이비) · disabled `#DFE4ED`.
- **Border**: high `#697893` · medium `#A5B2CA`(기본) · low `#DADFEA`(divider) · emphasis `#2285EF`.
- **Brand/System**: brand `#2285EF` · brand-subtle `#C2E9FB` · success `#2ED218` · caution `#FF9200` · error `#F33523` · info `#2BAEFF` · disabled `#EBEFF6`.
- **Type**: NanumSquare, +0.02em. h1 24 / h2 20 / h3 18 / h4 16 (700) · body 16·14 (400) · caption 12 (700).
- **Space**: 4·8·12·16·20·24·32·40·48·64·80·96.
- **Radius**: 0 (pill 100px·dot 50%만).
- **Chrome(1920×1080)**: 타이틀 40 + 메뉴 40 + 툴 40 + 상태바 46 = 126px · 콘텐츠 914px (padding 20·40).

## 컴포넌트 (kit.css `.erut-*`)
window/window__content · titlebar/winbtn · bar/menubar/menu/toolbar/tb/tb-sep/tb-hint · statusbar(__text/__grip) · pill·led(is-green/red/gray) · btn(--default/active/emphasis/outline-emphasis/subtle/danger/disabled · --sm/m/l) · field(is-error/readonly/disabled · --area) · field-group(__label/__msg · field-wrap __unit/__clear) · select(__trigger/menu/opt) · cb(체크박스) · toggle(__track is-on·__label--sm) · card(is-selected) · cmenu · badge · hero · panel(__header/body) · sidebar(공통 좌 240·surface-base) · tabs/tab(--sm) · checklist(진행 체크리스트 __item is-done/current) · crumb(--step 수평 stepper) · tooltip · modal(__header/body/footer) · ch-cell(__flaw 결함 검출 마커) · tree(좌 계층 트리 __item/is-active/__group).
- **Toggle vs Checkbox**: 즉시효과·동작(자동/활성/표시) = **toggle** / 폼 제출·다중선택·단발성 옵션 = **checkbox**. 같은 의미는 전 화면 동일 컴포넌트로 통일.
- 상호작용: Hover = surface-subtle-2 lift / Active = emphasis stroke + 10% brand wash + emphasis 텍스트 / Disabled = content-low + surface-disabled.
- **기존 `.erut-*`·`window.*` 우선 활용.** 신규 컴포넌트/클래스/modifier + 하드코딩 hex·rgba는 **사전 확인 필수**.

## 아이콘
- 24×24 line, stroke 1.5 square cap, currentColor. `EIcon`(Icons.jsx); 추가는 Lucide 24/1.5. 이모지·유니코드 글리프 금지(em-dash `---`는 미수신 placeholder만 허용).

## 카피 (UI 텍스트)
- 한국어·지시형·중립("당신/나" 금지). 종결 `~해 주세요`/`~합니다`.
- 영문은 단위·약어(PRF·MQTT·UT·NDT)·제품명만. 메뉴 = 동사 라벨 + 우측 단축키.
- 색 변경 제안 시 사용자 인식 UX 컨벤션 고려(blue = 긍정/완료). "주의" 카테고리 내 분리는 형태/패턴 차별 우선.

## 상태어 컬러 (화면설계서·UI 공통)
- 정상·연결됨 = **green** / 약함·보통·임박·경계 = **orange** / 나쁨·연결 끊김·만료·error = **red** / readonly = **blue**.
- 감육 검출 = **red_bg** / 재교정 필요 = **gray_bg** / positive = **blue(_bg)**.

> **용어 규칙(probe='탐촉자' 등)·NDT 도메인·화면 흐름은 루트 `../CLAUDE.md` 및 `../01_materials/CLAUDE.md` 참조.**
