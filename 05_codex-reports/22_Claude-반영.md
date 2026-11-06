# `21_Codex-재검토` 판정 + 웨지 사용 체크박스 + 종파 · 경사 웨지(굴절 종파 TRL) 허용

> **▶ Codex 지시**
> - **검토 대상** = 아래 **§4의 5개 항목** (§4-5는 **웹 원문 재확인** — URL을 직접 열어 확인)
> - **제외** = §5 전체 · 이전 보고서들의 기존 미결
> - **결과 파일** = `23_Codex-재검토.md`
> - 역할 = 어긋난 곳 발견까지 · 어느 쪽이 맞는지는 판정하지 않음 · `01_materials` 인용은 `파일명 §`만

> Claude · 2026-11-06 · 대상 = `21_Codex-재검토.md`(blocking 1 · should-fix 2) + 사용자 확정 2건

---

## 1. `21_Codex-재검토` 판정 — 3건 모두 유효 · 전부 반영

| | 항목 | 판정 | 반영 |
|---|---|---|---|
| **B1** | 종파 + 웨지 각도 조합이 등록에서는 허용·경사각 분류, 교정 ③에서는 섹션 숨김·굴절각 0 | **유효** | **허용 + 경고**로 결정(§3). 교정 ③ 숨김 조건을 유형 기준 → **수직 빔 채널**(기본값 우선순위의 결과가 `0`인 채널) 기준으로 바꿔 등록·저장·교정이 같은 조합을 같은 뜻으로 읽게 함 |
| S2 | 보고서 `공칭 굴절각` 1값이 각도 2필드 중 무엇인지 불명 | 유효 | `Report_Export_Spec` — `공칭 굴절각` = **파생값**(교정 ③ 기본값과 같은 규칙) · `굴절각(실측)` 기본값 = 위 공칭 굴절각 (커밋 `f6cf54b`) |
| S3 | 비활성 형태 치수가 `null` / 필드 생략으로 갈림 | 유효 | 세 저장 구조 모두 **`null`로 통일** — `Error_Code_Spec` `probeSnapshot`을 `number \| null`로 (커밋 `f6cf54b`) |

---

## 2. 웨지 사용 체크박스 — 사용자 확정 (`20` §2 Claude 판단 대체)

사용자 지적 — **수직 웨지는 각도가 0이어도 치수가 있음.** 각도 `0`만으로는 "수직 웨지"와 "웨지 없음"을 구분할 수 없어 사용 여부를 따로 받음.

| `웨지 사용` | 웨지 항목 | `Wedge Delay` |
|---|---|---|
| **ON**(기본) | `공칭 굴절각`(수직 웨지 = `0`) · 가로·세로·높이 **필수 · > 0** | 높이로 자동 산출 |
| OFF | 전부 숨김 · 저장값 `null` | `0` |

- 교정 ③ 기본값 우선순위 = **`웨지 사용` ON이고 웨지 각도 > 0 → 웨지 값 / 아니면 탐촉자 굴절각 / 그것도 없으면 `0`**
- 반영 = Notion `[C-SET-02] DAQ-탐촉자 설정` · `[C-PRJ-05] 교정-사이드바` ①·③ · `Probe_Registration_Spec` §2·§4(`wedge.used`)·§5 (커밋 `f6cf54b`)
- `20` §2의 "웨지 미사용이면 치수 `0` 입력 · 범위 `≥0`" 안은 **폐기**

---

## 3. 종파 + 경사 웨지 — 허용 + 경고 (B1 결정)

### 3-1. 도메인 판정 (Claude)

현장에서 "종파 탐촉자 + 경사 웨지"라고 부르는 조합은 두 가지임.

| | 구성 | 모재 안 파형 | ERUT `유형` |
|---|---|---|---|
| ① 일반 경사각 탐촉자 (대다수) | 종파 진동자 + 제1 임계각 이상 웨지 | **횡파** | **횡파** — 종파로 등록하면 깊이를 V_L로 환산해 **약 1.8배 오차** |
| ② 굴절 종파(TRL/RL) | 제1 임계각 미만 웨지 | **굴절 종파**(횡파도 함께 생김) | **종파** + 웨지 각도 > 0 |

- ②는 조대립 재질(원전 주조강 · 오스테나이트 스테인리스강 용접부)에서 횡파가 결정립 산란으로 투과되지 않을 때 씀 — **1순위 자료에 근거 없음 · 웹 근거 §3-3**
- 두산은 원자력 · 오스테나이트 · ASME 적용이라 ②가 해당될 수 있음 → **막지 않고 ①과 헷갈리지 않게 안내**
- 이전 근거 문구 *"각도가 생기는 순간 횡파이므로 성립 안 함"*은 ②에서 틀려 정정

### 3-2. 반영

| 문서 | 변경 |
|---|---|
| Notion `[C-SET-02] DAQ-탐촉자 설정` | 유형 = **모재 안에서 진행하는 파형** 기준 · **종파 + `웨지 사용` ON + 웨지 각도 > 0 → orange 경고 · 저장 허용** — `굴절 종파(TRL) 탐촉자인 경우에만 종파를 선택하세요. 일반 경사각 탐촉자는 모재 안에서 횡파가 되므로 횡파를 선택해야 합니다.` · pink 1.8배 오차 경고 |
| Notion `[C-PRJ-05] 교정-사이드바` ③ | 숨김 조건 = **"수직 빔 채널은 이 섹션 전체 숨김 — 기본값 우선순위의 결과가 `0`인 채널"** · 입사각 역산 검증 = 횡파 제1~제2 임계각 밖 / **종파 제1 임계각(27.5°) 이상**이면 경고 · 의존 관계 문구 "③이 숨겨진 수직 빔 채널" |
| Notion `[C-PRJ-05] 교정-파형 영역` 칩 | "수직 빔 채널은 경사각 칩 제외 4종 · 종파여도 웨지 각도가 있으면 5종" |
| Notion `🛠️ 개발팀 논의 필요/수정 사항` | 신규 **"탐촉자 구성 — 두산 확인"** — 오스테나이트 부위에 TRL 탐촉자를 쓰는가 |
| `Probe_Registration_Spec` | §1 파형 유형 행(모재 기준 · 일반 경사각 = 횡파) · §5 **"종파 + 웨지 각도" 경고 행** 신설 |
| `ERUT_인수인계서_Codex.md` | 교정 5단계 ③ 숨김 조건을 수직 빔 기준으로 |

### 3-3. 웹 근거 (도메인 · 접속일 2026-11-06)

⚠ 아래 인용은 **검색 결과 요약 문구**를 그대로 옮긴 것임. 페이지 본문을 직접 열어 대조하지 않음 → **§4-5에서 Codex가 원문 확인**.

| # | 출처 | 원문 그대로 |
|---|---|---|
| W1 | Evident, *9.4 Dual Element Angle Beams (TRL Testing)* — https://ims.evidentscientific.com/en/learn/ndt-tutorials/flaw-detection/dual-element-angle-beams | "Welds in coarse grain cast steel as found in nuclear pressure vessels and similar fabrications are often difficult to inspect with conventional shear wave angle beam probes due to the high level of grain scatter noise they generate. TRL probes (Transmit-Receive-Longitudinal), as the name indicates, use separate transmit and receive elements and generate refracted longitudinal waves rather than ..." |
| W2 | ASNT, *Phased Array Ultrasonic Testing Of Stainless Steel Pipe Welds* — https://source.asnt.org/phased-array-ultrasonic-testing-of-stainless-steel-pipe-welds/ | "The effect is more telling for shear waves, which, in many cases, have almost no ability to penetrate the weld volume. Longitudinal waves are affected to a lesser degree by anisotropy and can be applied for such tests. Angle beam or refracted longitudinal waves are, therefore, the accepted method for stainless steel weld inspections." |
| W3 | *Ultrasonic Testing of Austenitic Stainless-Steel Welds* (PDF) — https://static.inspector-training.com/uploads/2023/08/Ultrasonic-Testing-of-Austenitic-Stainless-Steel-Welds.pdf | "The ASME Boiler and Pressure Vessel Code, Section V, Article 4 T-451 now requires such an approach to Ultrasonic Testing of coarse-grained materials requiring weld mock-ups and refracted longitudinal wave probes." |

- W3은 **2차 출처**(교육 자료)가 ASME 조항을 언급한 것 · ASME 원문 미확인 → 명세에 조항 번호를 쓰지 않음
- 웹 근거는 **허용 여부 판단 + 두산 확인 질문의 근거**까지만 씀 · 명세에 수치를 옮기지 않음

### 3-4. 대체되는 이전 문구 (기존 보고서 · 수정하지 않음)

| 위치 | 이전 | 지금 |
|---|---|---|
| `09_SINGLE_Claude-확정사항.md` §1-3 · §1-7 | 종파는 경사각 제외 · 종파 채널은 경사각 칩 숨김 4종 | **수직 빔 채널** 기준 |
| `10_RPT04_Claude-기획초안.md` §5 | 굴절각 — 종파 수직 탐촉자 전제라 `0` | 단일 탐촉자 측정도 **수직 빔이면 `0`** · 굴절 종파면 교정 ③ 값 |

단일 탐촉자 측정·RPT-04는 아직 Notion 미반영이라 반영 시점에 위 기준으로 씀.

---

## 4. Codex 검토 요청

1. **B1 해소 확인** — 종파 + 웨지 각도 > 0 조합이 `[C-SET-02]`(경고 · 저장 허용) → `Probe_Registration_Spec` §4 `beamType` 파생 → `[C-PRJ-05]` ③(표시) · 파형 영역 칩(5종) → `Report_Export_Spec` `공칭 굴절각`(파생값)까지 **같은 결과로 이어지는지**. 반대로 수직 빔(두 각도 모두 0 또는 웨지 OFF + 종파)에서 ③·칩·보고서가 일관되게 `0`/숨김인지.
2. **"종파면 ③ 숨김" 잔여** — Notion 전 문서 · `03_dev_handoff/*` · `ERUT_인수인계서_Codex.md`에 유형(종파)만으로 경사각을 숨기거나 굴절각 0을 확정하는 문장이 남아 있는지. **단 §3-4의 기존 보고서 2건은 제외.**
3. **웨지 사용 체크박스 연결** — `웨지 사용` OFF일 때 `[C-SET-02]` 숨김 · `wedge.used=false` · 치수 `null` · `Wedge Delay 0` · 교정 ③ 기본값 우선순위가 Notion과 사양에서 같은 조건으로 적혀 있는지. 수직 웨지(ON + 각도 0)와 OFF가 구분되어 읽히는지.
4. **경고 조건의 구현 가능성** — 경고 발생 조건(유형 · `웨지 사용` · 웨지 각도) · 표시 위치 · 저장 허용이 비지 않았는지. 탐촉자 `굴절각`(횡파 전용 필드)과 경고가 겹치는 경우가 있는지.
5. **웹 원문 재확인(§3-3 W1~W3)** — 각 URL을 직접 열어 **인용문이 본문에 그대로 있는지** 확인. 검색 요약과 본문이 다르거나, 페이지가 없거나, 접근이 막혔으면 그 사실을 보고. W1의 `...` 뒤 이어지는 문장도 함께 옮겨 줄 것.

결과는 `23_Codex-재검토.md`로.

---

## 5. 검토 대상 아님

| 항목 | 상태 |
|---|---|
| Figma — `[C-SET-02]` 웨지 사용 체크박스 · 종파 + 웨지 각도 경고 상태 | 사용자 작업 대기 · 명세 선반영 |
| 두산 확인 — TRL 탐촉자 사용 여부 | Notion 개발 논의 등록 · 회신 대기 |
| `12_Claude-판정.md` §1 미반영(B1~B4 · S5~S7 · S9) · S8 거리식 · `07` §3 · 개발 논의 기존 항목 | 기존 미결 |
