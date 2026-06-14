# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## 🔒 기획·UI 작업 절대 원칙 (CRITICAL)

**모든 신규 기획서·UI 설계·화면 mockup 작업은 `design-system/` 폴더의 공식 ERUT Design System을 단일 진실 공급원(SSOT)으로 삼아야 한다.**
이 디자인 시스템은 Claude Design(claude.ai/design)으로 제작·검증된 **공식 브랜드 자산**이며, Figma 원본(`ERUT.fig`)에서 정확히 추출한 토큰을 포함한다.

### 📂 SSOT — `design-system/` 폴더 구조

```
design-system/
├── README.md                                  ← 브랜드 전문(全文): VISUAL FOUNDATIONS · CONTENT FUNDAMENTALS
├── project/
│   ├── README.md                              ← 제품 컨텍스트·서피스·서브스티튜션
│   ├── SKILL.md                               ← 빠른 do/don't 규칙
│   ├── colors_and_type.css                    ← 토큰의 유일한 출처 (CSS 변수)
│   ├── fonts/                                 ← NanumSquare OTF 4종 (acR·acB·R·B)
│   ├── assets/
│   │   ├── logo/                              ← ERUT 워드마크·모노그램 SVG
│   │   ├── app-icon/                          ← 앱 런처 아이콘 SVG 파츠
│   │   └── icons/                             ← UI 아이콘 (chevron, setting, …)
│   ├── preview/                               ← 디자인 시스템 카드 (700×N each)
│   └── ui_kits/erut-windows/                  ← 유일한 제품 서피스 (Windows 1920×1080)
│       ├── README.md                          ← 컴포넌트 contract
│       ├── index.html                         ← 인터랙티브 클릭스루
│       ├── kit.css                            ← 모든 erut-* 클래스 정의
│       ├── Chrome.jsx                         ← TitleBar·MenuBar·Toolbar·StatusBar·StatusPill
│       ├── Controls.jsx                       ← Button·Field·Select·Checkbox·Card·ContextMenu·Badge
│       ├── Screens.jsx                        ← ModePicker·EquipmentConnect·ConnectFailed
│       └── Icons.jsx                          ← 17개 24×24 line icons
└── chats/                                     ← 디자인 의도 대화록 (의사결정 컨텍스트)
```

### 파일 역할 분류

| 분류 | 파일/폴더 | 활용 방식 |
|------|-----------|----------|
| **🟢 SSOT (디자인)** | `design-system/` | 디자인 토큰·컴포넌트·타이포·아이콘·자산의 **유일한 출처**. 신규 UI 작업은 반드시 이 폴더의 규칙을 따른다. |
| **🟢 SSOT 핵심 파일** | `design-system/project/colors_and_type.css` | 모든 CSS 변수(색·타입·간격)의 정의 — 산출물에서 `@import` 또는 `<link>` 로 직접 참조 |
| **🟢 SSOT 핵심 파일** | `design-system/project/ui_kits/erut-windows/kit.css` | 모든 `.erut-*` 컴포넌트 클래스 정의 — 직접 재사용 |
| **🟢 SSOT 가이드** | `design-system/README.md` · `design-system/project/README.md` · `design-system/project/SKILL.md` | VISUAL/CONTENT FUNDAMENTALS·do/don't 규칙. 디자인 결정 시 먼저 참조 |
| **🟡 참고 자료 (서비스 흐름)** | `ERUT_UI_Design_Draft_v6.html` | 화면 ID 체계 `[0]~[7]` 및 서비스 흐름의 **레거시 참조용**. **시각 디자인은 이 파일에서 가져오지 않음** (다크 테마는 폐기, 새 라이트 테마 사용) |
| **🟡 참고 자료 (도메인)** | `ERUT Robot C-SCAN System 기획서_v2.pdf` | 기능 요구사항·DB 스키마·BLService 인터페이스 등 **도메인 지식 추출용** |
| **🟡 참고 자료** | `ERUT Senser Server 설계서_v0.1.pptx` | 센서 서버 통신 사양·프로토콜 |
| **🟡 참고 자료** | `한국_비파괴_초음파_검사_업무_프로세스.pdf` | NDT 표준·KS B 0817·ASNT Level |
| **🟡 참고 자료** | `경쟁사 참고.docx`, `산업용 AI, 로봇 회사 공통 강조 특징 분석.pdf` | 경쟁사 분석·포지셔닝 |
| **🟡 참고 자료** | `이로운솔루션_ERUT_IR 자료_*.pdf` | 차별점·로드맵 |
| **🔵 산출물 (Output)** | `ERUT_*.html` 신규 생성 파일 | 본 지침 적용 결과. SSOT 위반 시 재작성 대상 |

### ⚠ v6.html 사용 시 주의 (중요)

이전 작업에서 `ERUT_UI_Design_Draft_v6.html`을 SSOT로 사용했으나, **공식 디자인 시스템이 도입되면서 v6.html은 강등됨**:

- ✅ **여전히 유효**: 화면 ID 체계(`[0]~[7]`), 서비스 흐름(`로그인 → 메인 → 장비 상세 → Gate 설정`), 8화면 인벤토리 명명
- ❌ **사용 금지**: v6의 다크 테마 색상(`#1a1a2e`, `#0f9b8e`, `#00d4aa`), `Segoe UI` 폰트, 라운드 코너, 슬라이드 형식의 좌측 그라데이션 바, macOS 신호등 등 모든 **시각적 표현**
- 기존 산출물 (`ERUT_*.html` 등)은 다음 작업 시 점진적으로 새 시스템으로 마이그레이션

### 참고 자료 활용 규칙

**참고 자료에서 가져올 수 있는 것 (✅ 허용)**:
- 도메인 지식 (NDT 표준, UT 보드 사양, 좌표계, DB 컬럼명)
- 기능 요구사항 (실시간 모니터링 PRF, 안전 임계값, 결함 분류)
- 비즈니스 메시지 (IR 차별점, 시장 포지셔닝, 산업별 시나리오)
- 화면 ID 체계 (`[0]~[7]` from v6.html) 및 서비스 흐름 구조

**참고 자료에서 가져오면 안 되는 것 (❌ 금지)**:
- 시각 디자인 (색·폰트·radius·layout — 모두 `design-system/`에서만)
- 컴포넌트 디자인 (자체 `.panel`·`.btn` 디자인 금지 — `.erut-*` 재사용)
- 라운드 코너 (브리프 명시: "각진 형태의 디자인으로" — radius 0)
- 이모지 (UI 내 일체 사용 금지 — `design-system/project/README.md` 명시)

**충돌 시 우선순위**: `design-system/` > `v6.html`(흐름·ID만) > 기타 참고 자료. 시각적 충돌 시 항상 `design-system/` 기준.

### 작업 시 필수 체크리스트 (v4.4 슬림화 — 3개)

> 디자인 토큰 사용 · 컴포넌트 재사용 · 화면 ID 체계 등은 아래 "산출물 작업 지침 #6" / "SSOT 위반 대표 사례" / "컴포넌트 클래스" 표와 중복되어 일원화. 본 체크리스트는 그 표들에 없는 항목만 남김.

1. **한국어 우선 카피**: 모든 라벨·메시지는 한국어 ("로그인", "선택해 주세요"). 단축키만 영문 (`Ctrl+S`, `F6`). 이모지·유니코드 아이콘 글리프 사용 금지 (상세는 SSOT 위반 표 참조).
2. **자산 활용 원칙**: 로고·앱 아이콘 등 **공식 식별 자산**은 `design-system/project/assets/`에서 직접 복사. mockup 내부의 작은 inline SVG (차트·다이어그램·간단한 픽토그램)는 design-system 토큰 색을 사용해 직접 작성 허용.
3. **신규 산출물 head 링크**: 새 산출물 파일 작성 시 head에 `<link rel="stylesheet" href="design-system/project/colors_and_type.css">` + `<link rel="stylesheet" href="design-system/project/ui_kits/erut-windows/kit.css">` 명시 (기존 산출물 수정 시 자동 유지).

### 신규 작업이 SSOT를 위반하는 대표 사례

| 위반 | 올바른 처리 |
|------|------------|
| 라운드 코너(`border-radius: 8px`) 적용 | `--radius-none: 0` 사용 (Pills 100px·Dots 50% 만 예외) |
| 다크 테마 색(`#1a1a2e`) 사용 | 라이트 surface (`var(--surface-base)` `#F7F9FC`) + 네이비 chrome (`var(--content-medium)` `#273A5C`) |
| `#0f9b8e` 청록 강조 | `var(--brand-primary)` `#2285EF` (강조 전용, 큰 면적 fill 금지) |
| Segoe UI 폰트 | `var(--font-kr)` = NanumSquare (한·영·숫자 모두) |
| 이모지 아이콘 (🔬 📁 ⚙️ 등) | `assets/icons/` SVG 또는 `EIcon.*` 컴포넌트 사용 |
| 자체 `.panel`·`.btn` 정의 | `.erut-panel`·`.erut-btn` 재사용 |
| 그라데이션 배경 | 단색 fill (gradient 금지, 단 active card 10% brand wash는 예외) |
| 드롭 섀도우 | 사용 금지 (status pill의 inset glow만 허용) |

### 👥 역할 정의 (최우선 — 모든 상호작용에 적용)

| 주체 | 역할 | 책임 |
|---|---|---|
| **사용자** | 기획 / 디자이너 | **NDT 도메인 지식 없음**. 제품 기획·UX·디자인 결정권자. 지시 + 검토 + 의사결정 |
| **Claude** | **초음파 NDT 분야 전문가** + 디자인 시스템 적용자 | 지시사항에 대해 **꼼꼼한 도메인 검토** 필수. **더 좋은 의견이 있다면 적극 제시**. **추천 옵션 명시**. **무조건 실행 금지 — 검토 후 진행** |

**Claude 동작 원칙**:
1. 모든 지시사항을 받으면 먼저 **NDT 도메인 관점에서 검토** (사용자가 모를 수 있는 NDT 표준·관행·물리 원리·검사자 워크플로우 등)
2. 지시대로만 진행하지 않고, **더 나은 방안이 있는지 적극적으로 탐색**
3. 옵션이 여럿일 경우 **표 형태로 비교 + 추천 옵션 명시**
4. 모순·중복·UX 부적합 발견 시 **반드시 사용자에게 알리고 결정 요청**
5. 사용자가 명시적으로 "그대로 진행"이라고 한 경우에만 검토 없이 실행

### 📋 산출물 작업 지침 (필수 — 신규 기획·디자인 작업 시 매번 적용)

| # | 지침 | 적용 방법 | 예외 처리 |
|---|------|----------|----------|
| 1 | **3 depth 원칙** | 플로우 / 화면 구조는 가급적 **3 depth 이하**로 설계 | **4 depth 이상 필요 시 작업 실행 전 반드시 사용자에게 확인** |
| 2 | **페이지 vs 팝업 판단** | 모든 화면을 페이지로 만들지 않음. 플로우·맥락 분석 후 페이지(독립 진입) / 팝업(부가 정보·즉시 액션) 선택 | — |
| 3 | **실제 윈도우 화면 디자인** | 1920×1080 실제 윈도우 크기로 mockup 작성, 슬라이드에서 축소(transform: scale)하여 표시 | — |
| 4 | **description은 액션 플로우 위주** | anno·설명 텍스트는 "**액션 → 결과 화면**" 위주로 작성. 디자인 설명·미사여구 최소화 | — |
| 5 | **description 간결성** | 한 anno당 1~2 문장. 군더더기·중복 표현 제거 | — |
| 6 | **design-system 토큰 엄격 사용** | 색·간격·타이포·radius·shadow는 `var(--*)` 토큰만 사용. **hex 하드코딩 금지** (SVG `stop-color`·`stroke` 같은 기술적 불가 케이스만 예외) | **적합한 토큰이 없어 신규 색·간격·컴포넌트가 필요한 경우 작업 실행 전 반드시 사용자에게 확인** |
| 7 | **archive 백업 의무** | 통합 산출물 변경 시 `archive/ERUT_*_vX.Y.html` 형식으로 백업 (CSS 경로 `../design-system/`로 자동 치환, 스타일 깨짐 없이 저장) | vX.0=기획, vX.Y=디자인 |
| 8 | **기획 큰 변경 시 사전 확인** | 새 화면 신설·여러 슬라이드 동시 영향·진입 흐름 변경 등 **기획이 크게 변경되는 경우 작업 실행 전 반드시 사용자에게 확인** | 단일 화면 내 컴포넌트 추가/수정 같은 작은 변경은 즉시 진행 |
| 9 | **개선 방안 적극 제안** | 지시사항보다 UI/UX·아키텍처 측면에서 더 좋은 방안이 있다면 **적극 제안하고 반드시 의견 확인 후 진행** | 제안 사항이 없을 경우 지시사항 그대로 즉시 진행 |
| 10 | **기존 플로우 내 통합 우선** | 신규 페이지 추가보다 **현재 플로우 내에서 기획(기능)을 흡수**하는 방안을 우선 고려 (탭·인라인 패널·팝업·아코디언 등) | 기존 통합이 불가능하거나 통합 시 **4 depth 초과되면 사용자 확인** 후 진행 |
| 11 | **anno 버전 표기 금지** | anno 카드(num·title·desc)에 `vN.N` 버전 표기를 **적지 않는다**. 기존 잔존분은 제거. 버전 이력은 `archive/CHANGELOG.md`에만 기록 | — |
| 12 | **기능 설명은 현재형** | 모든 기능 설명은 **현재형**으로 작성 (현재 동작만 기술). 기획 변경으로 폐기·교체된 기능의 서술은 **삭제** ("이전엔 X였으나 Y로" 식 변경 이력 금지) | 폐기 이유가 현재 설계를 이해시키는 도메인 rationale이면 현재형으로 보존 (예: "A-scan은 단일 위치라 좌표 미등록") |
| 13 | **기능 위주 작성** | 기능 중심으로 작성. **단순 style 변경·CSS/코드 구현 이력 등 중요도 낮은 정보는 적지 않는다** | — |

### 🚦 사용자 확인 필수 케이스 — 작업 실행 전 반드시 멈추고 묻는다

| 조건 | 트리거 지침 |
|---|---|
| 플로우 / 화면이 **4 depth 이상**으로 깊어지는 경우 | #1 |
| **design-system 토큰에 없는** 신규 색·간격·컴포넌트가 필요한 경우 | #6 |
| **기획이 크게 변경**되는 경우 (새 화면 신설, 여러 슬라이드 동시 영향, 진입 흐름 변경) | #8 |
| 지시사항보다 **UI/UX적으로 더 좋은 방안**을 발견한 경우 | #9 |
| **신규 페이지 추가**가 필요한데 기존 플로우 통합 가능성을 먼저 검토하지 못한 경우 | #10 |

> 이 5가지에 해당하면 **즉시 작업을 멈추고 사용자에게 옵션과 추천을 정리해서 묻는다.** 답을 받고 진행한다.

### archive 백업 절차 (변경 직전 매번 실행)

```bash
# 1. 변경 직전 — 현재 작업 파일을 archive로 복사 (CSS 경로 자동 치환)
sed 's|href="design-system/|href="../design-system/|g' \
    ERUT_ServiceFlow_FixedProbe.html \
    > archive/ERUT_ServiceFlow_FixedProbe_v{현재버전}.html

# 2. 작업 파일을 새 버전으로 수정
# 3. archive/CHANGELOG.md에 새 버전 항목 2~3줄 추가
```

- **버전 규칙**: `vX.0` 기획·기능 변경 / `vX.Y` 디자인·단순 수정 (Y는 1씩 증가)
- **원칙**: 작업 파일은 항상 최신. archive에는 **최신 직전 버전들만** 누적. archive 파일은 별도 지시 없을 시 읽지 않음
- **확인**: archive 백업본도 `http://localhost:8000/archive/ERUT_*_vX.Y.html`로 스타일 깨짐 없이 열림

---

## ERUT Design System 요약 (canonical reference)

> 정식 출처: `design-system/` · Figma 원본: `ERUT.fig` (`/page`, `/page/Component`, `/page/section`, `/page/Style-Guide`)

### 시각 정체성 한 줄 요약

> **각진(radius 0) · 라이트 surface + 네이비 chrome · 브랜드 블루 `#2285EF`는 강조 전용 · NanumSquare 폰트 · 한국어 우선 · 이모지 없음**

### 색상 토큰 (정확한 hex — `colors_and_type.css` 기준)

**Content (텍스트·아이콘)**
| 토큰 | hex | 용도 |
|------|-----|------|
| `--content-high` | `#0A1C3C` | 본문·헤딩 |
| `--content-medium` | `#273A5C` | 보조 텍스트·타이틀바 배경 |
| `--content-low` | `#6B7C9B` | 캡션·상태 메타·placeholder |
| `--content-inverse` | `#FFFFFF` | 다크 배경 위 텍스트 |
| `--content-emphasis` | `#2285EF` | active/selected 텍스트 |

**Surface (배경)**
| 토큰 | hex | 용도 |
|------|-----|------|
| `--surface-base` | `#F7F9FC` | 캔버스 / 윈도우 컨텐츠 |
| `--surface-strong` | `#E0E6F1` | 강조 surface |
| `--surface-subtle-1` | `#EBEFF6` | 툴바·메뉴·상태바 |
| `--surface-subtle-2` | `#F1F5FC` | 카드 fill·hover row |
| `--surface-disabled` | `#AEB8CA` | 비활성 |

**Border**
| 토큰 | hex | 용도 |
|------|-----|------|
| `--border-high` | `#697893` | 강한 stroke (버튼·필드) |
| `--border-medium` | `#A5B2CA` | 기본 1px box border |
| `--border-low` | `#E0E6F1` | 미세 divider |
| `--border-emphasis` | `#2285EF` | selected/active stroke |

**Brand & System**
| 토큰 | hex | 용도 |
|------|-----|------|
| `--brand-primary` | `#2285EF` | **유일한 브랜드 accent — 강조에만 사용** |
| `--on-primary` | `#FFFFFF` | brand 위 텍스트 |
| `--system-success` | `#18E339` | 연결됨 LED |
| `--system-caution` | `#FF9200` | 경고 |
| `--system-error` | `#FF005E` | 미연결 LED·에러 |
| `--system-info` | `#2BAEFF` | 정보 (brand와 구분되는 cyan) |
| `--system-disabled` | `#8C8C8C` | 비-컨텐츠 비활성 |

### 타이포그래피

```css
/* 전 시스템 단일 폰트 */
font-family: var(--font-kr);    /* = "NanumSquare", system-ui, sans-serif */
letter-spacing: 0.020em;        /* +20 tracking — 시스템 정체성의 일부 */

/* 사이즈 토큰 */
h1: 24px / 700 / line-height 1.1
h2: 20px / 700 / 1.1
h3: 18px / 700 / 1.1
h4: 16px / 700 / 1.1
body-lg: 16px / 400 (workhorse)
body-md: 14px / 400 (secondary)
body-sm / caption: 12px / 700 (캡션은 700)

/* 핵심 사용 패턴 */
hero question: 24px / 700 — "검사 방식을 선택해 주세요."
section sub:   18px / 700 / color --content-low — "선택한 형태에 맞는 메인 화면으로 이동합니다."
button label:  14px / 700
field text:    14px / 400
status meta:   12px / 700 / color --content-low — "PRF : ---"
```

### 간격 스케일 (Variables/space)

```
--space-1 :  4px      --space-6 : 24px      --space-16: 64px
--space-2 :  8px      --space-8 : 32px      --space-20: 80px
--space-3 : 12px      --space-10: 40px      --space-24: 96px
--space-4 : 16px      --space-12: 48px
--space-5 : 20px
```

### Radius (각진 원칙)

```
--radius-none: 0        /* 카드·필드·버튼·다이얼로그·드롭다운 — 전부 */
--radius-pill: 100px    /* 상태바 status pill만 */
--radius-dot:  50%      /* LED dot만 */
```

### 레이아웃 — Windows 네이티브 1920×1080

```
Chrome 고정 높이 합 = 126px
  타이틀바  40px  (--content-medium 배경 · 가운데 정렬 타이틀 · 우측 min/max/close)
  메뉴바    40px  (--surface-subtle-1 + 1px --border-medium · "파일 / 장비 / 설정 / 도움말")
  툴바      40px  (--surface-subtle-1 · icon-only 64×40 hit targets · 우측 F6/F7 hint)
  상태바    46px  (--surface-subtle-1 + backdrop-filter blur(100px) · status pills · PRF/Temp · version)

콘텐츠 캔버스 = 914px
  --surface-base 배경 · padding 20px 40px
```

### 컴포넌트 클래스 (재사용 — `kit.css` 정의)

| 클래스 | 용도 |
|--------|------|
| `.erut-window` | 1920×1080 프레임 컨테이너 |
| `.erut-window__content` | 콘텐츠 캔버스 (40px 측면·20px 상하 패딩) |
| `.erut-titlebar` · `.erut-titlebar__title` · `.erut-winbtn` | 커스텀 타이틀바 |
| `.erut-bar` · `.erut-menubar` · `.erut-menu` · `.erut-toolbar` · `.erut-tb` · `.erut-tb-sep` · `.erut-tb-hint` | 메뉴/툴바 |
| `.erut-statusbar` · `.erut-statusbar__text` · `.erut-statusbar__grip` | 상태바 |
| `.erut-pill` · `.erut-led` (`.is-red` / `.is-green`) · `.erut-led__halo` · `.erut-led__dot` | 상태 pill + LED |
| `.erut-btn` · `.erut-btn--default` · `.erut-btn--active` · `.erut-btn--emphasis` · `.erut-btn--subtle` · `.erut-btn--disabled` · `.erut-btn--sm`/`--m`/`--l` | 버튼 (4 variants × 3 sizes) |
| `.erut-field` (`.is-disabled`) | 인풋 (height 40px) |
| `.erut-select` · `.erut-select__trigger` · `.erut-select__menu` · `.erut-select__opt` | 셀렉트 |
| `.erut-cb` · `.erut-cb__box` (`.is-on`) · `.erut-cb__label` | 체크박스 (폼 선택용 — 아래 가이드라인 참조) |
| `.erut-toggle` · `.erut-toggle__track` (`.is-on` / `.is-disabled`) · `.erut-toggle__thumb` · `.erut-toggle__label` (`.erut-toggle__label--sm`) | 토글 스위치 (동작 제어용 · v3.1 신설 — 아래 가이드라인 참조) |
| `.erut-card` (`.is-selected`) | 카드 (528×400 권장 — ModePicker 기준) |
| `.erut-cmenu` · `.erut-cmenu__row` · `.erut-cmenu__kbd` · `.erut-cmenu__sep` | 컨텍스트/드롭다운 메뉴 |
| `.erut-badge` (`.erut-badge--soft`) | 배지 |
| `.erut-hero` · `.erut-hero__h` · `.erut-hero__sub` | 화면 hero (제목 + 서브) |
| `.erut-eqrow` | 장비 row (장비 연결) |
| `.erut-panel` · `.erut-panel__header` · `.erut-panel__body` | 사이드 패널 |
| `.erut-method` · `.erut-method__icon`/`__body`/`__title`/`__meta` | 연결 방법 row (3개 옵션 표시) |

### Toggle vs Checkbox 가이드라인 (v3.2 정립)

**원칙: 동작 제어 = `.erut-toggle` / 폼 선택 = `.erut-cb`**

| 구분 | Toggle (`.erut-toggle`) | Checkbox (`.erut-cb`) |
|---|---|---|
| **사용 시점** | 즉시 효과 (라이브 ON/OFF, 페이지에 머무는 동안 즉시 결과 반영) | 폼 제출 시점 적용 (저장 버튼 누르기 전까지 임시 상태) |
| **대표 패턴** | 자동/수동, 활성/비활성, 표시/숨김, 사용 중/멈춤 등 단일 binary **동작** | 다중 선택, 옵션 묶음 중 일부 선택, 단발성 동의/확인 |
| **변경 빈도** | 높음 (사용자가 자주 전환) | 낮음 (한 번 설정하면 유지) |
| **예시 (현재 적용)** | "Gate 범위 표시" / "Gate A/B/C 활성" / "결함 검출 시 자동 전환" / "자동 재연결" | "TLS / SSL 사용" / "같은 블록·소재 일괄 측정" / 테이블 행 다중 선택 |

**판단 체크리스트** (작업 시 매번 적용):
1. 변경 결과가 **저장 버튼 없이 즉시 반영**되는가? → ✅ Toggle / ❌ Checkbox
2. 라벨이 **"자동", "활성", "표시", "켜기" 같은 동작 제어 단어**인가? → ✅ Toggle
3. **다중 선택 (multi-select)** 패턴인가? → 반드시 Checkbox (Toggle 절대 금지)
4. **모달 다이얼로그 내 단발성 옵션**인가? → Checkbox 권장
5. **보안·인증·프로토콜 선택** 같은 설정값인가? → Checkbox 권장

**일관성 원칙**: 같은 의미("자동 재연결" 등)가 여러 화면에 반복 등장하면 **모두 같은 컴포넌트**로 통일.

### 상호작용 상태

- **Hover**: 셀 배경을 `--surface-subtle-2`로 lift. stroke 동일. 텍스트 색 동일
- **Active/Selected**: `--border-emphasis` stroke + 10% brand wash overlay (`linear-gradient(rgba(34,133,239,0.1), …)`) + 텍스트 `--content-emphasis`
- **Disabled**: `--content-low` 텍스트 + `--surface-disabled` fill
- **모든 비-disabled 버튼 hover**: 10% black overlay (`--overlay-medium`) 위에 덧칠
- **Status pill**: `inset 2px 2px 4px rgba(36,80,158,0.4)` inset glow (유일한 그림자)
- **드롭섀도우**: 사용 안 함 (카드는 평평하게 — border로 구분)
- **애니메이션**: 기본 없음. 측정 중 상태에 한해 1초 cycle radial rolling indicator (instrument feel 유지)

### 아이콘 시스템

- 24×24 monochrome line, **stroke 1.5px, square caps**, `currentColor`
- 자체 제공 17개: `Save · AddMachine · Setting · ChevronDown · Maximize · Minimize · Close · Bolt · Move · Add · Calendar · Search · ResizeCorner · Wifi · Folder · Play · Pause` (`design-system/project/ui_kits/erut-windows/Icons.jsx`)
- 추가 필요 시 **Lucide** (lucide.dev) 24px / stroke-width 1.5 — 매번 substitution 명시
- **이모지·유니코드 아이콘 글리프 사용 절대 금지**. 단 em-dash `---`는 미수신 metric placeholder로 허용

### 카피 톤 (Content Fundamentals)

- 한국어 우선·기술적·간결, 도메인 전문가 대상
- 어조: **지시형·3인칭·중립**. "당신/나" 안 씀
- 종결: `~해 주세요`, `~합니다`, `~할 수 있습니다`
- 예시: "검사 방식을 선택해 주세요." / "장비의 연결 상태를 확인해 주세요." / "선택한 형태에 맞는 메인 화면으로 이동합니다."
- 영문은 단위·약어(PRF·MQTT·UT·NDT)·제품명·태그라인에만 사용
- 메뉴 항목: 동사형 라벨 + 우측 정렬 단축키 (`열기  Ctrl+O`, `저장  Ctrl+S`)
- 숫자/단위: ASCII, 긴 단위는 space-separated (`PRF : ---`, `v0.0.0.0`)

### 화면 인벤토리 (v6.html에서 승계)

| 화면 ID | 화면명 | 디자인 시스템 매핑 |
|---------|--------|------------------|
| `[0]` | 로그인 | (커스텀 — 모드 선택 전 단계) |
| 신규 | 검사 방식 선택 (ModePicker) | `Screens.jsx` ModePicker — 고정형/이동형 카드 2개 + 체크박스 + "다음" |
| `[1]` | 메인 화면 | (제품 메인 — 검사 모드별로 분기) |
| `[2]` | 장비 상세 | 미정 (Design System에는 미포함) |
| `[3]` | 센서 Gate 설정 | 미정 |
| `[4]` | 장비 연결 설정 | `Screens.jsx` EquipmentConnect (3개 방법: 자동 검색·수동 IP·프로필 불러오기) + ConnectFailed 빈 상태 |
| `[5]` | MQTT 설정 | 미정 |
| `[6]` | 측정 설정 | 미정 |
| `[7]` | 데이터 관리 | 미정 |

> 신규 화면 설계 시: 디자인 시스템에 명시된 화면(`ModePicker`·`EquipmentConnect`·`ConnectFailed`)은 그대로 사용. 그 외 화면([2][3][5][6][7])은 동일한 토큰·컴포넌트·레이아웃 규칙으로 새로 디자인하되, v6의 흐름·ID는 유지.

### 정규 서비스 흐름

```
[0] 로그인 → 검사 방식 선택(ModePicker) → 장비 연결(EquipmentConnect)
                                          → 연결 실패 시 ConnectFailed
                                          → 성공 시 [1] 메인
[1] 메인 → [2] 장비 상세 → [3] Gate 설정 (센서 더블클릭 진입)
상단 메뉴: 파일 / 장비 / 설정 / 도움말 — 각각 [7]/[4]/[5][6]/도움말
단축키: F6 측정 시작 · F7 중지 · Ctrl+S 저장 · Ctrl+O 열기
```

### 작업 흐름 (신규 기획/UI 작업 시)

```
1. design-system/project/SKILL.md 및 README.md 의 do/don't 확인
2. 관련 화면이 ui_kits/erut-windows/Screens.jsx 에 이미 있는지 확인
   ├─ 있음 → 그대로 사용 (수정 시 디자인 시스템 원본도 함께 변경 권장)
   └─ 없음 → 동일한 토큰·.erut-* 클래스로 새 화면 작성
3. HTML 산출물 head 에 colors_and_type.css 및 kit.css 링크
4. 자산은 design-system/project/assets/ 에서 직접 참조 (재드로잉 금지)
5. v6.html 의 화면 ID·흐름 규약은 유지하되, 시각 표현은 새 시스템만 사용
6. 한국어 카피·이모지 없음·각진 코너·라이트 surface 4대 원칙 검증
```

---

## 프로젝트 개요

**ERUT (Eroun Realtime Ultrasonic Testing)** — 자석 부착 로봇을 이용한 수조탱크 초음파 C-SCAN 데이터 수집 및 디지털 트윈 기반 실시간 시각화 시스템.

현재 이 저장소는 코드가 없고 기획/설계 문서만 있는 **사전 개발 단계**입니다.

---

## 🔬 NDT 도메인 핵심 지식 — 기획·UI 작업 시 필수

### 고정형 장비의 A-scan 핵심 데이터 4종

고정형(현재 기획 범위)은 **A-scan만 수집** 가능 (B/C-scan은 이동형 기획 시 도입). 따라서 모든 기획·UI는 다음 4개 데이터를 중심으로 설계해야 한다.

| 데이터 | 의미 | 단위 | 산출 방식 |
|---|---|---|---|
| **Amp** (Amplitude · 진폭) | 결함 신호 강도 — 결함 크기 추정의 핵심 | % FSH (Full Screen Height) | Gate 내 신호 피크값 |
| **ToF** (Time of Flight · 비행시간) | 신호 송신 → 수신까지 왕복 시간 — 두께 환산의 기반 | μs (마이크로초) | Gate 내 신호 모서리/피크 시간 |
| **Gate** | 측정 범위 시간 창 (Start · Width · Threshold) | μs / % | [3] Gate 설정에서 정의 |
| **두께** (Thickness) | 검사 대상의 실제 두께 (감육 판정의 핵심) | mm | ToF × 소재 음속 / 2 |

### 기획·UI 설계 시 적용 규칙

1. **A-scan 차트는 모든 측정·진단 화면의 중심**: 차트 위에 Gate 영역·Threshold 라인 시각화 필수
2. **두께 측정값**은 ToF·소재 음속에서 자동 환산 → 검사 대상 등록 시 **공칭 두께·소재가 필수 입력**
3. **결함 판정**은 Amp 기준 (Critical/Major/Minor 임계값 표준별 상이)
4. **Gate 권장값**은 두께·소재·표준에 따라 자동 계산 가능 → 검사자 부담 경감 패턴
5. **모든 UI 컴포넌트**는 위 4종 데이터를 가시화하거나 영향을 주는 방식으로 설계

### 도메인 용어 (혼동 금지)

- **A-scan**: 시간(μs) × 진폭(%) 2D 파형 — 단일 채널 단일 위치
- **B-scan / C-scan**: 이동형 전용 (B = 단면, C = 전개도) — **고정형 기획에서 표시 금지**
- **공칭 두께**: 설계 두께 (예: PIPE-A-204 = 10mm) — 검사 시 측정된 두께와 비교
- **감육**: 부식·마모로 두께가 감소한 상태 → "허용 감육 임계값" = 검사 대상별 결함 판정 기준
- **PRF** (Pulse Repetition Frequency · 펄스 반복 주파수): 초음파 펄스를 1초에 몇 번 송신하는지 결정. 두께·소재에 따라 최적값 다름 (ghost echo 방지)
- **DAC** (Distance Amplitude Correction): 거리 보정 곡선 — 표준별 상이
- **참조 블록**: IIW V1·V2 / STB-A1·A2 — 탐촉자 교정용 표준 블록

### PRF 자동 계산 사양 (v4.7 정립)

검사 대상의 **두께·소재** 입력 시 ERUT가 자동으로 권장 PRF 계산.

**계산식**: `PRF_max = 음속 / (2 × 두께 × 3 × 2)` (안전 배수 3 + 시간 마진 2)
**산업 표준 단계 매핑**: `200 · 500 · 1000 · 2000 · 4000 Hz` 중 상한 이하 최대값

**소재별 종파 음속 (m/s)**: 탄소강 5,920 · SS 304 5,790 · SS 316L 5,740 · 알루미늄 6,320 · 티타늄 6,070 · 구리 4,660 · Inconel 5,820 · 황동 4,430 · 주철 4,600

**적용 위치**: SLIDE 14 [6] 검사 대상 관리 — "측정 파라미터" 섹션. "자동 계산" 토글 ON 기본값.

상세 사양(알고리즘 의사코드·테스트 케이스·UI 시나리오 등): `dev_handoff/PRF_Auto_Calculation_Spec_v1.0.md` 참조.

---

## 기술 스택

| 구분 | 기술 |
|------|------|
| 개발 환경 | .NET Framework 4.8, Visual Studio 2022 |
| UI 프레임워크 | Windows Forms |
| 데이터베이스 | SQLite 3 (WAL 모드 필수) |
| 3D 렌더링 | Helix Toolkit (WPF) — 최우선 권장 |
| 그래프 | OxyPlot.WindowsForms 또는 ZedGraph |
| 3D 파일 로드 | AssimpNet (STL/STEP/OBJ/FBX) |
| 직렬화 | Newtonsoft.Json |
| 로깅 | NLog |
| 압축 (선택) | K4os.Compression.LZ4 |

### NuGet 패키지 (`.csproj` 기준)
```xml
<PackageReference Include="System.Data.SQLite" Version="1.0.118" />
<PackageReference Include="Newtonsoft.Json" Version="13.0.3" />
<PackageReference Include="HelixToolkit.Wpf" Version="2.24.0" />
<PackageReference Include="OxyPlot.WindowsForms" Version="2.1.2" />
<PackageReference Include="AssimpNet" Version="5.0.0-beta1" />
<PackageReference Include="NLog" Version="5.2.8" />
<PackageReference Include="K4os.Compression.LZ4" Version="1.3.6" />
```

---

## 시스템 아키텍처

### 하드웨어 → 소프트웨어 흐름

```
[자석 로봇(탐측자)] ←→ [UT 보드(Pulser/Receiver)] ←→ [PC/ERUT 소프트웨어] → [MQTT → RabbitMQ]
                                                              ↕
                                                        [3D 모델 C-SCAN 실시간 시각화]
```

### BLService 레이어 (핵심 비즈니스 로직)

실시간 데이터 파이프라인:
```
로봇 컨트롤러 (위치, 1000Hz) ─┐
UT 보드 (A-SCAN Raw, PRF) ──┤→ DataAcquisitionService → ScanDataPacket
트리거 동기 신호 ─────────────┘         ↓
                                 SignalProcessingService (Gate Processor: Amp/ToF 추출)
                                         ↓
                               ProcessedDataPacket {Position, Amp, ToF, RawAScan}
                                    ↓         ↓         ↓
                              C-SCAN(Grid)  B-SCAN(Line)  A-SCAN(Point) 버퍼
                                         ↓
                              UI Rendering Layer → F_RealtimeScanView
```

### 핵심 서비스 인터페이스

```csharp
// 3D 모델 관리
public interface IModelService {
    Task<Model3D> LoadModelAsync(string filePath, ModelImportOptions options);
    TankGeometry RecognizeTankGeometry(Model3D model);   // 원통/구형 자동 인식
    Model3D OptimizeMesh(Model3D model, MeshQuality quality);
    void GenerateUVCoordinates(Model3D model, CoordinateType type);
}

// 좌표 정합 (로봇↔3D 모델 매핑)
public interface IAlignmentService {
    TransformMatrix CalculateAlignment(Point3D[] modelPoints, Point3D[] robotPoints); // 3점 정합
    AlignmentVerification VerifyAlignment(TransformMatrix transform, Point3D[] verificationPoints);
    Point3D ModelToRobot(Point3D modelPoint);
    Point3D RobotToModel(Point3D robotPoint);
    CylindricalCoord CartesianToCylindrical(Point3D point);
    Point3D CylindricalToCartesian(CylindricalCoord coord);
}

// 스캔 경로 생성
public interface IScanPathService {
    ScanRegion DefineScanRegion(Model3D model, RegionSelectionType type, object parameters);
    void SetStartPoint(Point3D startPoint);
    ScanPath GeneratePath(ScanRegion region, ScanPattern pattern, ScanParameters parameters);
    ScanPath ApplyObstacleAvoidance(ScanPath originalPath, List<Obstacle> obstacles);
}

// 실시간 시각화
public interface IRealtimeVisualizationService {
    void Initialize(Model3D model, VisualizationSettings settings);
    event EventHandler<ScanDataReceivedEventArgs> OnScanDataReceived;
    void UpdateTexture(ProcessedScanData data);     // Partial Update만 GPU 전송
    void UpdateRobotPosition(Point3D position, Quaternion orientation);
    void SetColorMap(ColorMapType type, double min, double max);
    void SetRenderMode(RenderMode mode);            // C-SCAN오버레이/히트맵/와이어프레임
    Task<Image> CaptureScreenshotAsync();
}
```

### 스캔 데이터 이벤트 구조

```csharp
public class ScanDataReceivedEventArgs : EventArgs {
    public Point3D Position { get; set; }              // 로봇 위치 (직교좌표)
    public CylindricalCoord TankPosition { get; set; } // 탱크 위치 (원통좌표)
    public double[] AScanRaw { get; set; }             // Raw A-SCAN
    public double Amplitude { get; set; }              // Gate 진폭값 → C-SCAN 색상 매핑
    public double TimeOfFlight { get; set; }           // Gate ToF → 깊이/두께 매핑
    public int Channel { get; set; }
    public DateTime Timestamp { get; set; }
}
```

---

## 데이터 계층 구조

### 프로젝트 데이터 모델
```
Project (프로젝트)
└── InspectionItem (검사 대상 탱크)
    ├── 3D Model (.stp/.stl/.obj)
    ├── TankGeometry (형상, 치수, 좌표계)
    ├── TankStructures (용접선/노즐/맨홀)
    ├── AlignmentData (로봇↔모델 변환 행렬)
    └── ScanSession (스캔 세션, 복수 가능)
        ├── ScanConfig (탐측자/Gate/인코더 설정, JSON)
        ├── C-SCAN 바이너리 데이터 (.bin)
        └── Defects (결함 목록)
```

### 데이터 저장 원칙
- **SQLite DB**: 메타데이터, JSON 설정값, 파일 경로 — `PRAGMA journal_mode=WAL` 필수
- **바이너리 파일 (.bin)**: C-SCAN/A-SCAN 데이터 (대용량) — SQLite BLOB 절대 사용 금지
- **DB는 메타데이터 + 파일 경로만** 저장, 바이너리는 파일시스템에 분리 저장

---

## SQLite 데이터베이스 스키마

```sql
-- 프로젝트별 project.db (WAL 모드)
CREATE TABLE TB_PROJECT (
    ProjectID TEXT PRIMARY KEY,
    ProjectName TEXT NOT NULL,
    Description TEXT,
    CreateDate TEXT NOT NULL,
    ModifyDate TEXT,
    Status TEXT DEFAULT 'Active',
    CreatedBy TEXT
);

CREATE TABLE TB_INSPECTION_ITEM (
    ItemID TEXT PRIMARY KEY,
    ProjectID TEXT NOT NULL,
    ItemCode TEXT, ItemName TEXT NOT NULL,
    TankType TEXT,                      -- Cylindrical / Spherical / Combined
    Diameter REAL, Height REAL, Thickness REAL,
    HeadType TEXT, Material TEXT,
    Model3DPath TEXT,                   -- 3D 모델 파일 경로 (상대)
    ThumbnailPath TEXT,
    Status TEXT DEFAULT 'Pending',
    CreateDate TEXT NOT NULL, ModifyDate TEXT,
    FOREIGN KEY (ProjectID) REFERENCES TB_PROJECT(ProjectID)
);

CREATE TABLE TB_SCAN_SESSION (
    SessionID TEXT PRIMARY KEY,
    ItemID TEXT NOT NULL,
    SessionName TEXT NOT NULL,
    SessionType TEXT,                   -- FullScan / PartialScan / WeldScan
    StartTime TEXT, EndTime TEXT,
    Status TEXT DEFAULT 'Pending',
    Inspector TEXT,
    ScanAreaJson TEXT,                  -- 스캔 영역 (JSON)
    DataFolderPath TEXT,                -- ScanData/ 하위 세션 폴더 경로
    DataSize INTEGER DEFAULT 0,
    TotalPoints INTEGER DEFAULT 0,
    DefectCount INTEGER DEFAULT 0,
    Notes TEXT,
    FOREIGN KEY (ItemID) REFERENCES TB_INSPECTION_ITEM(ItemID)
);

CREATE TABLE TB_SCAN_CONFIG (
    ConfigID TEXT PRIMARY KEY,
    SessionID TEXT NOT NULL,
    ProbeSettingsJson TEXT,             -- 탐측자 파라미터 (주파수, 직경, 지연시간 등)
    GateSettingsJson TEXT,              -- Gate 설정 (Start, Width, Threshold, Mode)
    EncoderSettingsJson TEXT,           -- 로봇/인코더 연동 설정
    ScanPattern TEXT,                   -- Raster / Zigzag / Spiral
    Resolution REAL,
    ScanSpeed REAL,
    FOREIGN KEY (SessionID) REFERENCES TB_SCAN_SESSION(SessionID)
);

CREATE TABLE TB_DEFECT (
    DefectID TEXT PRIMARY KEY,
    SessionID TEXT NOT NULL,
    DefectType TEXT,
    PositionTheta REAL, PositionZ REAL, -- 원통좌표
    PositionX REAL, PositionY REAL,     -- 직교좌표
    SizeX REAL, SizeY REAL,
    Depth REAL, Amplitude REAL,
    Severity TEXT, Note TEXT,
    CreateDate TEXT NOT NULL,
    FOREIGN KEY (SessionID) REFERENCES TB_SCAN_SESSION(SessionID)
);

CREATE TABLE TB_TANK_STRUCTURE (
    StructureID TEXT PRIMARY KEY,
    ItemID TEXT NOT NULL,
    StructureType TEXT,                 -- 용접선 / 노즐 / 맨홀
    Name TEXT,
    PositionJson TEXT,
    Width REAL, Height REAL,
    InspectionPriority TEXT DEFAULT 'Optional',
    FOREIGN KEY (ItemID) REFERENCES TB_INSPECTION_ITEM(ItemID)
);

CREATE TABLE TB_ALIGNMENT_DATA (
    AlignmentID TEXT PRIMARY KEY,
    ItemID TEXT NOT NULL UNIQUE,        -- 검사대상당 1개
    TransformMatrixJson TEXT,           -- 4x4 변환 행렬
    ReferencePointsJson TEXT,
    VerificationPointsJson TEXT,
    VerificationError REAL,
    CreateDate TEXT NOT NULL,
    FOREIGN KEY (ItemID) REFERENCES TB_INSPECTION_ITEM(ItemID)
);
```

---

## C-SCAN 바이너리 파일 포맷 (.bin)

Magic Number: `"CSCA"` (4 bytes), 헤더 256 bytes 고정.

```csharp
[StructLayout(LayoutKind.Sequential, Pack = 1)]
public struct CScanFileHeader {
    [MarshalAs(UnmanagedType.ByValArray, SizeConst = 4)]
    public byte[] Magic;           // "CSCA"
    public uint Version;           // 1
    public uint DataType;          // 0=Amp, 1=ToF, 2=Raw
    public uint Channel;
    public uint Width;             // θ 방향 픽셀 수
    public uint Height;            // Z 방향 픽셀 수
    public float ResolutionX;      // mm/pixel
    public float ResolutionY;      // mm/pixel
    public float ThetaStart;       // degree
    public float ThetaEnd;
    public float ZStart;           // mm
    public float ZEnd;
    public float ValueMin;
    public float ValueMax;
    public long Timestamp;         // Unix ms
    public uint Compression;       // 0=None, 1=LZ4
    public uint DataSize;
    [MarshalAs(UnmanagedType.ByValArray, SizeConst = 184)]
    public byte[] Reserved;
}
// 데이터 배열: data[z_index * Width + theta_index] (float32, Row-major)
```

---

## 파일 시스템 구조

```
ERUT_Data/                          ← 프로그램 루트 데이터 폴더
├── app.config
├── settings.db                     ← 전역 설정 DB (SQLite)
└── Projects/
    └── {ProjectFolderName}/
        ├── project.db              ← 프로젝트 DB (TB_PROJECT 등 7개 테이블)
        ├── Models/                 ← STL/STEP/OBJ 3D 모델 파일
        ├── Thumbnails/             ← PNG 썸네일
        ├── ScanData/
        │   └── {ItemID}/
        │       └── Session_{NNN}/
        │           ├── session_info.json   ← 세션 메타데이터
        │           ├── cscan_ch1_amp.bin
        │           ├── cscan_ch1_tof.bin
        │           ├── cscan_ch2_amp.bin
        │           ├── cscan_ch2_tof.bin
        │           ├── ascan_raw.bin       ← 선택적
        │           └── cscan_preview.png
        └── Reports/                ← PDF, DOCX 검사 리포트
```

---

## 화면 ID 체계 및 계층 구조

화면 접두사 규칙:
- `F_` = Form (독립 창)
- `G_` = Global Panel (메인 폼에 임베드되는 패널)
- `D_` = Dialog (모달 대화상자)

```
F_Main (메인)
├── G_ProjectExplorer (프로젝트 탐색기 - 트리)
│   ├── D_ProjectManager (프로젝트 CRUD)
│   └── G_InspectionItemList (검사 대상 카드/목록)
│       ├── D_InspectionItemDetail (등록/편집)
│       │   ├── D_ModelImport (3D 모델 불러오기)
│       │   ├── G_TankGeometry (탱크 형상/치수/좌표계)
│       │   └── G_TankStructures (용접선/노즐/맨홀 정의)
│       └── F_InspectionDashboard (검사 대상 대시보드)
│           ├── G_ScanSessionList → D_NewScanSession
│           ├── G_CoordinateAlignment (3점 정합)
│           ├── G_ScanStartPoint → D_PathPreview
│           └── F_RealtimeScanView (실시간 스캔 - 4분할 레이아웃)
│               ├── G_Realtime3DView (3D 텍스처 매핑)
│               ├── G_CScanUnwrap (C-SCAN 2D 전개도)
│               ├── G_RealtimeBScan (B-SCAN 단면)
│               ├── G_RealtimeAScan (A-SCAN 파형)
│               └── G_RobotStatus (로봇 상태 모니터링)
├── D_Settings
│   ├── G_ProbeSetup (탐측자 채널 설정)
│   ├── G_GateSetup (Gate 파라미터)
│   ├── G_EncoderSetup (로봇/인코더 연동)
│   ├── G_ProbeOrientation (법선 추종)
│   └── G_Couplant (커플런트 관리)
├── F_SessionComparison (세션 비교 분석)
└── D_Report (검사 보고서 생성)
```

---

## 6단계 작업 워크플로우

1. **STEP 1 – 프로젝트 설정**: 신규/기존 프로젝트, 검사 대상(탱크) 등록, 기본 정보 입력
2. **STEP 2 – 3D 모델 불러오기**: STL/STEP/OBJ 로드, 형상 자동 인식(원통/구형/복합형), 메시 최적화
3. **STEP 3 – 좌표계 정합**: 3점 정합으로 3D 모델↔로봇 좌표계 매핑, 4×4 변환 행렬 생성
4. **STEP 4 – 시작점/영역 지정**: 3D 모델 클릭으로 스캔 시작점 지정, 영역 선택, 경로 미리보기
5. **STEP 5 – 실시간 스캔**: 로봇 이동, 실시간 3D 텍스처 매핑, A/B/C-SCAN 동시 표시, 로봇 모니터링
6. **STEP 6 – 분석 검토**: C-SCAN 전개도/3D 표면 분석, 결함 마킹, 세션 비교, 리포트 생성

---

## 좌표계

| 좌표계 | 파라미터 | 용도 |
|--------|----------|------|
| 직교좌표 | X, Y, Z | 로봇 제어, 3D 렌더링 |
| 원통좌표 | θ, Z, R | 원통형 탱크 C-SCAN 표현 |
| 구면좌표 | θ, φ, R | 구형 탱크 표현 |

3D 텍스처 UV 매핑 (원통형):
- `u = θ / 360°` (0~1 정규화)
- `v = Z / TankHeight` (0~1 정규화)
- 텍스처 해상도: 3600 × 1500 (0.1°× 10mm 기준)

---

## 성능 목표 및 핵심 구현 요구사항

| 항목 | 목표값 |
|------|--------|
| 데이터 수신 | 1000 Hz (PRF) |
| 텍스처 업데이트 | 30–60 FPS |
| UI 응답성 | < 100ms |
| 메모리 (스캔 중) | < 2GB |

**필수 구현 패턴**:
- **비동기 처리 필수**: 데이터 수신/처리는 별도 스레드, UI 블로킹 금지
- **Partial Texture Update**: 변경된 영역만 GPU 전송
- **Double Buffering**: 렌더링 깜빡임 방지
- **Ring Buffer**: 실시간 데이터 메모리 효율화
- **SQLite WAL 모드**: `PRAGMA journal_mode=WAL;` 연결 시 항상 설정

---

## 로봇 안전 기능 (필수)

| 기능 | 조건 | 조치 |
|------|------|------|
| 부착력 저하 경보 | < 80% | 경고 |
| 부착력 저하 긴급정지 | < 60% | 즉시 정지 |
| 탈락 감지 | 급격한 가속도 변화 | 긴급정지 |
| 경사 한계 | 경사 > 45° | 경고 |
| 슬립 보정 | 인코더-IMU 오차 > 5mm | 위치 보정 |

---

## 지원 3D 파일 포맷

| 포맷 | 확장자 | 권장도 |
|------|--------|--------|
| STL | .stl | 최우선 (삼각 메시, 단순) |
| OBJ | .obj | 우선 (범용) |
| STEP | .step, .stp | 중간 (CAD 정밀) |
| IGES | .iges, .igs | 낮음 |
| FBX | .fbx | 낮음 |
