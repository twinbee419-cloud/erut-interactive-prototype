# `19_Codex-재검토` 판정 + 탐촉자 등록 사양 동기 (형태 · 각도 2필드 · 지연재 음속)

> **▶ Codex 지시**
> - **검토 대상** = 아래 **§3의 4개 항목**
> - **제외** = §4 전체 · 이전 보고서들의 기존 미결
> - **결과 파일** = `21_Codex-재검토.md`
> - 역할 = 어긋난 곳 발견까지 · 어느 쪽이 맞는지는 판정하지 않음 · `01_materials` 인용은 `파일명 §`만

> Claude · 2026-11-05 · 대상 = `19_Codex-재검토.md`(blocking 0 · should-fix 2) + `00_재검토_대기열.md` D항

---

## 1. `19_Codex-재검토` 판정 — 2건 모두 유효 · 반영

| | 항목 | 반영 |
|---|---|---|
| S1 | DGS `[✨]`를 "Gain 변경이 아님"으로 적어 파형 영역 명세와 충돌 | Notion `[C-PRJ-05]` ④ — 괄호를 **"예외 — DGS 모드의 `[✨]`는 Gain을 조정하면서 기준점도 함께 다시 기록해 새 기준점으로 덮어씀"**으로 정정. Gain 조정과 재기록이 **함께** 일어남을 명시 |
| S2 | `probeSnapshot.delayVelocityMps` 필수인데 지연재 음속은 선택 항목 | `Error_Code_Spec` — `delayVelocityMps: number \| null` · 미등록이면 `null`(TCG 이력 가능) · DGS는 등록이 전제라 항상 값 있음. `Probe_Registration_Spec` §4 JSON 주석도 "선택 · 미등록이면 null" |

---

## 2. 탐촉자 등록 사양 동기 — Notion `[C-SET-02] DAQ-탐촉자 설정` 기준

`03_dev_handoff/Probe_Registration_Spec_v1.0.md`가 Notion보다 낡아 있던 3건을 맞춤.

### 2-1. 형태(원형/사각형) — 누락

| 형태 | 진동자 규격 | 외형 규격 |
|---|---|---|
| 원형 | `직경` | `직경` · `높이` |
| 사각형 | `가로` · `세로` | `가로` · `세로` · `높이` |

- §1 결정표 · §2 입력 필드 · §4 JSON(`elementShape` · `elementDiameterMm` · `bodyDiameterMm`) · §5 검증 규칙
- 승계 경로 — `Error_Code_Spec` `probeSnapshot` · `Result_Analysis_Storage_Spec` `origin.dgs`에 `elementShape`·`elementDiameterMm` 추가
- 근거 — `[C-PRJ-05]` DGS `EFF. Diameter`가 "원형 = 직경 / 사각형 = 가로 × 세로"로 표시를 나누는데, 사양에 구분 필드가 없어 분기할 근거가 없었음

### 2-2. 굴절각 1칸 → 2칸

| | 이전 사양 | 지금(= Notion) |
|---|---|---|
| 탐촉자 `굴절각` | `공칭 굴절각` 1칸 · 종파·횡파 모두 입력 | 탐촉자 **내부** 각도 · **횡파일 때만 표시** · 종파면 숨김·필수 제외 |
| 웨지 `공칭 굴절각` | — | 탐촉자 **외부** 웨지 각도 · **웨지 미사용 `0`** |
| 웨지 가로·세로·높이 | — | `높이`로 `Wedge Delay` 자동 산출 |
| 교정 ③ 기본값 | 공칭 굴절각 | **웨지 공칭 굴절각 → `0`이면 탐촉자 굴절각** |

- §1 · §2 · §4 JSON(`probeRefractionAngleDeg` · `wedge{}` · `beamType` 파생식) · §5 검증
- `Report_Export_Spec` `굴절각(실측)`의 기본값 설명도 같은 우선순위로 정정

### 2-3. `지연재 음속` — 입력 필드 표에 없었음

선택 항목 · DGS `Delay Velocity` 승계 원본 · **미등록이면 DGS 선택 불가**(TCG는 무관)

### Claude 판단 1건 — 웨지 미사용 시 치수

Notion은 웨지 `공칭 굴절각`을 "웨지 미사용이면 `0`"으로, 웨지 가로·세로·높이를 "각 필수"로 적음. 웨지가 없을 때 치수에 넣을 값이 정해져 있지 않음.
→ 사양에는 **"웨지 미사용이면 `0` 입력 → `Wedge Delay` 0"**으로 적고 입력 범위를 `≥0`으로 둠. Notion 반영 여부는 사용자 확인 후.

---

## 3. Codex 검토 요청

1. **§2 동기 결과가 Notion `[C-SET-02] DAQ-탐촉자 설정`과 일치하는가** — 형태별 필드 구성 · 각도 2필드의 표시 조건(종파면 탐촉자 굴절각 숨김) · 필수 여부 · 지연재 음속 선택 여부.
2. **각도 2필드가 다른 문서와 맞물리는가** — Notion `[C-PRJ-05] 교정-사이드바` ③ 경사각 기본값 우선순위 · `Report_Export_Spec`의 `공칭 굴절각` 행(`TB_PROBE.NominalRefractionAngle`)이 지금 어느 각도를 가리키는지 · `beamType` 파생식을 쓰는 곳.
3. **형태 필드의 승계 경로** — `ProbeSettingsJson`(`elementShape`·`elementDiameterMm`) ↔ `CalibrationHistoryEntry.probeSnapshot` ↔ `origin.dgs` 필드 이름·조건부 필수(원형 = 직경 / 사각형 = 가로·세로)가 일치하는지 · `[C-PRJ-05-01]` 모달 `EFF. Diameter` 표시가 읽힐 수 있는지.
4. **§1 S1 문구 수정 후** DGS `[✨]` 동작이 사이드바 ④ · 파형 영역 §Gain · `[C-PRJ-06]` DGS 블록에서 같은 뜻으로 읽히는지.

결과는 `21_Codex-재검토.md`로.

---

## 4. 검토 대상 아님

| 항목 | 상태 |
|---|---|
| 웨지 미사용 시 치수 처리(§2 Claude 판단) | 사용자 확인 대기 · Notion 미반영 |
| `16_Claude-반영.md` §4 · `12_Claude-판정.md` §1 미반영 · S8 · 개발 논의 신규 · `07` §3 | 기존 미결 |
