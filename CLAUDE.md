# CLAUDE.md

Claude Code 작업 지침. **ERUT** (Eroun Realtime Ultrasonic Testing) — 자석 부착 로봇 기반 초음파 검사 시스템. 윈도우 프로그램명 = **ERUT Client**. 현재 **코드 없는 사전 개발 단계 — 기획/UI mockup 작업 중**. **프로젝트는 고정형·스캔형 통합**(유형 구분 폐지) — ERUT Client가 **고정형(A-scan) + 스캔형(C-scan) 모두** 다룸.

## 역할 (최우선)
- **사용자** = 기획/디자이너, NDT 비전문가, 최종 결정권자.
- **Claude** = 초음파 NDT 전문가 + 디자인 시스템 적용자.
- 동작: ① 지시 받으면 NDT/UX 관점 검토 ② 더 나은 안 적극 제시 ③ 옵션은 표+추천 명시 ④ 모순·중복·UX 부적합 발견 시 확인 요청 ⑤ "그대로 진행" 시에만 검토 없이 실행.
- **무조건 수긍 금지** — 검토·질문에는 근거(도메인·§·데이터모델) 있는 의견·반론 적극 제시(Figma·외부안·사용자 가설도 틀리면 플래그). 단 재확인·반복 지시는 결정으로 존중.

## 분리 문서 (SSOT 포인터)
- **디자인 규칙·토큰·컴포넌트·카피** → `02_design-system/CLAUDE.md` (디자인 SSOT = `02_design-system/`).
- **NDT 도메인 지식·1순위 근거 자료** → `01_materials/CLAUDE.md` (도메인 판단 1순위 근거 = `01_materials/*.md·*.pdf` · NDA).
- **개발 인계 기능 사양** → `03_dev_handoff/*.md` (PRF 자동계산·탐촉자 등록·알림·DAQ 자동정보·Store&Forward 등). 화면 변경 시 관련 spec 동기화.
- **화면 기획 SSOT** = Notion 화면설계서 DB(개발 인계 명세) → `/notion` 스킬로 작성·수정, Figma 프레임에서 sync.

## 저장소 구조 · 산출물 (빌드 없음)
- **폴더**: `01_materials/`(도메인 자료·로컬 NDA) · `02_design-system/`(디자인 SSOT·프로토타입) · `03_dev_handoff/`(개발 사양) · `99_legacy/`(구 기획 HTML·archive · **별도 지시 없으면 참고 안 함**).
- **프로토타입** = `02_design-system/project/ui_kits/erut-windows/` — 동작하는 React 프로토타입. **빌드 없음**: `index.html`이 CDN UMD(React 18.3.1) + Babel standalone로 `.jsx`를 브라우저에서 직접 트랜스파일. 화면 로직 = `Screens.jsx`(≈4100줄) · 창 chrome `Chrome.jsx` · 폼 컨트롤 `Controls.jsx` · 아이콘 `Icons.jsx`. 실행 = 파일을 브라우저로 열기.
- **프로토타입 편집 = 원칙적 hold** — 개발자가 Figma를 직접 보고 개발 중. **사용자 명시 지시 있을 때만** JSX 수정. 평소 기획 반영 대상 = Notion 화면설계서(`/notion`).
- **배포**: `vercel.json`이 `/` → `02_design-system/project/ui_kits/erut-windows/index.html`로 rewrite. **git push = Vercel 자동 배포**(git-tracked 변경만).
- **git 추적 vs 로컬 전용**: 추적 = `02_design-system/` · `03_dev_handoff/` · `CLAUDE.md` · `index.html` · `vercel.json`. **gitignore(로컬)** = `01_materials/`(NDA) · `99_legacy/`(구 HTML·archive) · `*.pdf/pptx/docx/fig` 등.
- 작업 완료 시 git-tracked 변경은 자동 commit+push(요청 없이도). 로컬 전용 파일은 배포 무관.

## 산출물 작업 지침
1. 플로우/화면 **3 depth 이하** (4+ 필요 시 사전 확인).
2. 페이지 vs 팝업: 맥락 분석 후 선택(모든 화면 페이지화 금지).
3. **1920×1080 기준** 실제 윈도우로 설계.
4. 화면설계서 description = **액션 → 결과** 위주, 디자인 설명·미사여구 최소.
5. anno 1~2문장, 군더더기 제거 · **`vN.N` 버전 표기 금지** · **현재형만**(폐기·교체 기능 서술 삭제 · 단 현재 설계 이유가 되는 도메인 rationale은 보존) · **기능 위주**(style·코드 구현 이력 제외).
6. **디자인 = 토큰·기존 `.erut-*` 컴포넌트만**. 없는 신규 필요 시 사전 확인 → `02_design-system/CLAUDE.md`.
7. **기획 큰 변경**(새 화면·다중 화면·진입 변경) 사전 확인. 단일 화면 내 소변경은 즉시.
8. **더 나은 UI/UX 방안** 발견 시 적극 제안 + 확인 후 진행.
9. **신규 페이지보다 기존 플로우 통합 우선**(탭·인라인·팝업·아코디언). 통합 불가/4depth 초과 시 확인.

## 사용자 확인 필수 (작업 전 멈추고 옵션+추천 제시)
4 depth 이상 / 토큰에 없는 신규 색·컴포넌트 / 기획 큰 변경 / 더 나은 UX 발견 / 신규 페이지(통합 미검토) / 프로토타입 JSX 수정(명시 지시 없을 때).

## 제품 분리 (윈도우 / 웹) + 검출 vs 판정
- **윈도우** = 현장 단기 검사(수집·교정·신뢰성). **웹** = 상시 모니터링·시계열 트렌드·결함 등급/유형 판정.
- 윈도우 화면에 시계열 트렌드·결함 판정 넣지 않음.
- **결함 '검출' 사실만 표시·알림**(마커/카운트/배너) — **등급(critical/major/minor)·유형 판정은 윈도우에서 하지 않음(웹 책임)**.

## 용어
- 국문 probe = **'탐촉자'** ('프로브' 금지 · 영문 코드·파일명 예외). (도메인 용어 전체 → `01_materials/CLAUDE.md`.)
- 'MC보드' → **'DAQ'** (표시 텍스트 = DAQ / 장비 ID·OEM 모델·JS 식별자는 유지).

## 화면 · 흐름 (화면설계서 = Notion DB SSOT)
- 화면ID = **`C-` 접두**(ERUT Client) + PRJ/RES/SET/CAL/RPT. 예 `[C-SET-04]`. `[공통] 메뉴바/상태바`만 C- 없이.
- 흐름: **[C-PRJ-01] 시작 → [C-PRJ-02] DAQ 장비 목록 → [C-RES-02] DAQ 결과 화면(측정)**. 종합 = [C-RES-01].
- 설정(메뉴바 '설정' · 좌 트리/nav): **[C-SET-01]** DAQ 장비 설정(계층 트리 — DAQ/탐촉자/홀더(+장착 탐촉자)/I/O 장비/Bridge PC) · **[C-SET-02]** 모재 관리 · **[C-SET-03]** 모재 프리셋 관리 · **[C-SET-04]** 검사 시작 준비(맵핑) · **[C-SET-05]** 기본 설정 · **[C-SET-06]** 모니터링 서버 설정.
- 교정 = **[C-CAL-01]** 탐촉자 설정(+01-01 재교정). 보고서 = **[C-RPT-01]** 측정 · **[C-RPT-02]** 스캔. 알림 NTF-01 · 로그 LOG-01.
- **측정 제어 = DAQ 단위**(탐촉자 개별 start/stop 불가 · 동시 PRF). 단축키: **F6 시작 · F7 중지** · Ctrl+S 저장 · Ctrl+O 열기 · Ctrl+P 보고서. 일시정지 폐지. 상태바 우측 = F6/F7 상시 표시.

## 기술 스택 (구현 단계 — 참고)
- .NET 4.8 · WinForms · SQLite(WAL 필수) · Helix Toolkit(3D) · OxyPlot · AssimpNet · Newtonsoft.Json · NLog · LZ4(선택).
- 저장: DB = 메타데이터·JSON·파일경로 / 바이너리(.bin) = C-SCAN·A-SCAN (BLOB 금지, 파일 분리).
- 상세 아키텍처·BLService·DB 스키마·C-SCAN 포맷: **기획서 + `03_dev_handoff/`** 참조.
