# CLAUDE.md

Claude Code 작업 지침. **ERUT** (Eroun Realtime Ultrasonic Testing) — 자석 부착 로봇 기반 초음파 검사 시스템. 현재 **코드 없는 사전 개발 단계 — 기획/UI mockup 작업 중**. 현재 범위 = **고정형(A-scan)**.

## 역할 (최우선)
- **사용자** = 기획/디자이너, NDT 비전문가, 최종 결정권자.
- **Claude** = 초음파 NDT 전문가 + 디자인 시스템 적용자.
- 동작: ① 지시 받으면 NDT/UX 관점 검토 ② 더 나은 안 적극 제시 ③ 옵션은 표+추천 명시 ④ 모순·중복·UX 부적합 발견 시 확인 요청 ⑤ "그대로 진행" 시에만 검토 없이 실행.

## SSOT — `design-system/` (절대 원칙)
- 모든 기획·UI·mockup은 `design-system/`을 단일 출처로 삼는다.
- 토큰: `design-system/project/colors_and_type.css` · 컴포넌트: `.../ui_kits/erut-windows/kit.css` (`.erut-*`).
- 가이드(do/don't): `design-system/README.md` · `project/README.md` · `project/SKILL.md`.
- 신규 산출물 `<head>`에 colors_and_type.css + kit.css `<link>`.
- 충돌 우선순위: design-system > 기타 참고자료. 시각은 항상 design-system 기준.

## 시각 원칙 + 금지
- **각진(radius 0**; pill 100px·LED dot 50%만 예외) · **라이트 surface + 네이비 chrome** · **brand blue `#2285EF` 강조 전용**(큰 면적 fill 금지) · **NanumSquare**(letter-spacing +0.02em) · **한국어 우선** · **이모지 없음** · **드롭섀도우 없음**(border로 구분; status pill inset glow만 예외).
- 금지: 라운드 코너 / 다크테마 색 / 청록 `#0f9b8e` / Segoe UI / 이모지·유니코드 글리프 아이콘 / 자체 `.panel`·`.btn` / 그라데이션 배경(active card 10% brand wash만 예외).
- **hex 하드코딩 금지 — `var(--*)` 토큰만** (SVG `stop-color`/`stroke`만 예외).
- 국문에서 probe = **'탐촉자'** ('프로브' 금지). 영문 코드·파일명은 예외.

## 산출물 작업 지침 (#1~#13)
1. 플로우/화면 **3 depth 이하** (4+ 필요 시 사전 확인).
2. 페이지 vs 팝업: 맥락 분석 후 선택(모든 화면 페이지화 금지).
3. **1920×1080 실제 윈도우**로 mockup, 슬라이드에서 scale 축소.
4. description = **액션 → 결과** 위주, 디자인 설명·미사여구 최소.
5. anno 1~2문장, 군더더기 제거.
6. **토큰만 사용**(색·간격·타이포·radius·shadow). 토큰 없는 신규 필요 시 사전 확인.
7. **archive 백업 의무**(변경 직전, 아래 절차).
8. **기획 큰 변경**(새 화면·다중 슬라이드·진입 변경) 사전 확인. 단일 화면 내 소변경은 즉시.
9. **더 나은 UI/UX 방안** 발견 시 적극 제안 + 확인 후 진행.
10. **신규 페이지보다 기존 플로우 통합 우선**(탭·인라인·팝업·아코디언). 통합 불가/4depth 초과 시 확인.
11. anno에 **`vN.N` 버전 표기 금지** (이력은 `archive/CHANGELOG.md`에만).
12. **현재형**으로만 — 폐기·교체 기능 서술 삭제 (단, 현재 설계 이유가 되는 도메인 rationale은 현재형 보존, 예: "A-scan은 단일 위치라 좌표 미등록").
13. **기능 위주** — style·CSS/코드 구현 이력 등 저중요도 정보 제외.

## 사용자 확인 필수 (작업 전 멈추고 옵션+추천 제시)
4 depth 이상 / 토큰에 없는 신규 색·컴포넌트 / 기획 큰 변경 / 더 나은 UX 발견 / 신규 페이지(통합 미검토).

## archive 백업 절차
```bash
sed 's|href="design-system/|href="../design-system/|g' ERUT_ServiceFlow_FixedProbe.html \
  > archive/ERUT_ServiceFlow_FixedProbe_v{버전}.html
```
- `archive/CHANGELOG.md`에 2~3줄 추가. **vX.0 = 기획/기능 변경 · vX.Y = 디자인/수정**.
- 메인 HTML·`archive/`는 **gitignore**(로컬). git 추적 = `design-system/`·`dev_handoff/`·`CLAUDE.md`.

## 디자인 토큰 (요약 — 정식: colors_and_type.css)
- **Content**: high `#0A1C3C`(본문) · medium `#273A5C`(보조·타이틀바) · low `#6B7C9B`(캡션·placeholder) · inverse `#FFFFFF` · emphasis `#2285EF`(active).
- **Surface**: base `#F7F9FC`(캔버스) · subtle-1 `#EBEFF6`(툴/메뉴/상태바) · subtle-2 `#F1F5FC`(카드·hover) · strong `#E0E6F1` · disabled `#AEB8CA`.
- **Border**: high `#697893` · medium `#A5B2CA`(기본) · low `#E0E6F1`(divider) · emphasis `#2285EF`.
- **Brand/System**: brand `#2285EF` · success `#18E339` · caution `#FF9200` · error `#FF005E` · info `#2BAEFF` · disabled `#8C8C8C`.
- **Type**: NanumSquare, +0.02em. h1 24 / h2 20 / h3 18 / h4 16 (700) · body 16·14 (400) · caption 12 (700).
- **Space**: 4·8·12·16·20·24·32·40·48·64·80·96.
- **Radius**: 0 (pill 100px·dot 50%만).
- **Chrome(1920×1080)**: 타이틀 40 + 메뉴 40 + 툴 40 + 상태바 46 = 126px · 콘텐츠 914px (padding 20·40).

## 컴포넌트 (kit.css `.erut-*`)
window/window__content · titlebar/winbtn · bar/menubar/menu/toolbar/tb/tb-sep/tb-hint · statusbar(__text/__grip) · pill·led(is-green/red/gray) · btn(--default/active/emphasis/subtle/disabled · --sm/m/l) · field(is-disabled) · select(__trigger/menu/opt) · cb(체크박스) · toggle(__track is-on·__label--sm) · card(is-selected) · cmenu · badge · hero · panel(__header/body) · tabs/tab(--sm) · ch-cell(__flaw 결함 검출 마커).
- **Toggle vs Checkbox**: 즉시효과·동작(자동/활성/표시) = **toggle** / 폼 제출·다중선택·단발성 옵션 = **checkbox**. 같은 의미는 전 화면 동일 컴포넌트로 통일.
- 상호작용: Hover = surface-subtle-2 lift / Active = emphasis stroke + 10% brand wash + emphasis 텍스트 / Disabled = content-low + surface-disabled.

## 아이콘 · 카피
- 아이콘: 24×24 line, stroke 1.5 square cap, currentColor. `EIcon`(Icons.jsx); 추가는 Lucide 24/1.5. 이모지·유니코드 글리프 금지(em-dash `---`는 미수신 placeholder만 허용).
- 카피: 한국어·지시형·중립("당신/나" 금지). 종결 `~해 주세요`/`~합니다`. 영문은 단위·약어(PRF·MQTT·UT·NDT)·제품명만. 메뉴 = 동사 라벨 + 우측 단축키.

## NDT 도메인 (고정형 = A-scan)
- 현재 범위 = **고정형 → A-scan만** (B/C-scan 표시 금지 — 이동형 도입 시).
- **핵심 4종**: **Amp**(%FSH · Gate 피크) · **ToF**(μs · 왕복시간) · **Gate**(Start/Width/Threshold) · **두께**(= ToF×음속/2, mm · 감육 판정).
- 규칙: A-scan 차트가 측정·진단 화면 중심(Gate·Threshold 시각화) · 두께는 ToF·음속 자동환산(검사대상 등록 시 **공칭두께·소재 필수**) · Gate/PRF 자동계산으로 검사자 부담↓.
- 용어: 공칭두께 · 감육(부식·마모로 두께감소) · PRF(펄스반복주파수, ghost echo 방지) · DAC(거리진폭보정) · 참조블록(IIW V1/V2·STB-A1/A2) · 시험편(표준/비교).
- **PRF 자동**: `PRF_max = 음속 / (2 × 두께 × 3 × 2)`, 단계 `200·500·1000·2000·4000 Hz` 중 상한 이하 최대. 음속(m/s): 탄소강 5920 · SS304 5790 · SS316L 5740 · Al 6320 · Ti 6070 · 구리 4660 · Inconel 5820 · 황동 4430 · 주철 4600. 상세: `dev_handoff/PRF_Auto_Calculation_Spec_v1.0.md`.

## 제품 분리 (윈도우 / 웹) + 검출 vs 판정
- **윈도우** = 현장 단기 검사(수집·교정·신뢰성). **웹** = 상시 모니터링·시계열 트렌드·결함 등급/유형 판정.
- 윈도우 화면에 시계열 트렌드·결함 판정 넣지 않음.
- **결함 '검출' 사실만 표시·알림**(마커/카운트/배너) — **등급(critical/major/minor)·유형 판정은 윈도우에서 하지 않음(웹 책임)**.

## 화면 · 흐름 (현재 mockup 기준)
- 메인 기획: `ERUT_ServiceFlow_FixedProbe.html`(고정형). 스캔형: `ERUT_ServiceFlow_Crawler.html`.
- 흐름: **[0] 프로젝트 선택 → [1] 메인(MC보드 목록) → [2] 장비 상세(검사대상 + 64ch 그리드) → [11] 실시간**. 설정 분기: **[4]** 장비연결(MC보드·MQTT·탐촉자) · **[4-3-1]** 채널 설정 · **[6]** 검사대상 관리 · **[7]** 검사 이력 · **[8]** 설정 · **[18]** 채널 보고서.
- **측정 제어 = MC보드 단위**([2] 배너 + 툴바 활성 보드). 탐촉자 개별 start/stop 불가(64ch 동시 PRF).
- 단축키: F6 시작 · Space 일시정지 · F7 중지 · Ctrl+S 저장 · Ctrl+O 열기 · Ctrl+P 보고서.

## 기술 스택 (구현 단계 — 참고)
- .NET 4.8 · WinForms · SQLite(WAL 필수) · Helix Toolkit(3D) · OxyPlot · AssimpNet · Newtonsoft.Json · NLog · LZ4(선택).
- 저장: DB = 메타데이터·JSON·파일경로 / 바이너리(.bin) = C-SCAN·A-SCAN (BLOB 금지, 파일 분리).
- 상세 아키텍처·BLService 인터페이스·DB 스키마·C-SCAN 포맷·파일시스템: **기획서 PDF + `dev_handoff/`** 참조 (3D·C-SCAN·좌표정합 등은 이동형 = 현재 고정형 범위 밖).
