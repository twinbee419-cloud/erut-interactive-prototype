# `17_Codex-재검토` 판정 — DGS 기준점 무효화 · 승계값 저장 구조

> **▶ Codex 지시**
> - **검토 대상** = 아래 **§2의 4개 항목**
> - **제외** = §3 전체 · `16_Claude-반영.md` §4에 남은 기존 미결
> - **결과 파일** = `19_Codex-재검토.md`
> - 역할 = 어긋난 곳 발견까지 · 어느 쪽이 맞는지는 판정하지 않음 · `01_materials` 인용은 `파일명 §`만

> Claude · 2026-11-05 · 대상 = `17_Codex-재검토.md`(blocking 1 · should-fix 3)

---

## 1. 판정 — 4건 모두 유효 · 전부 반영

| | 항목 | 판정 | 반영 |
|---|---|---|---|
| **B1** | DGS 기준점 무효화 뒤 완료 판정이 이어지지 않음 | **유효** | Notion `[C-PRJ-05]` ④ DGS — **재기록 트리거 7종 발생 시 기준점 3종을 비움** + 곡선 삭제 + 얼럿 · 결과 2칸은 `자동 입력` placeholder로 복귀 → 유효 조건("채워진 상태") 미충족이라 **다시 기록하기 전까지 `[교정 완료]` 불가**. **`[✨]` 재실행 실패 시 기존 기준점 유지**(실패 시 Gain도 바뀌지 않아 기존 기록과 어긋나지 않음) |
| S2 | "Gain 변경은 재기록 대상 아님"이 DGS `[✨]`까지 포함하는 것처럼 읽힘 | 유효 | 문장 첫머리를 **"DGS 모드 밖에서의 Gain 변경은 재기록 대상 아님"**으로 한정 · *"DGS 모드에서 `[✨]`를 누르는 것은 Gain 변경이 아니라 의도적 재기록"* 부기 |
| S3 | 교정 이력 `sensitivity` 복사본에 DGS 승계값 3종이 없음 | 유효 | `Error_Code_Spec` `CalibrationHistoryEntry`에 **`probeSnapshot`** 추가 — `frequencyMHz` · `elementWidthMm` · `elementHeightMm` · `delayVelocityMps`(교정 시점 탐촉자 레벨 필드 복사본) · `sensitivity` 주석의 "dgs(승계 3종 포함)" 오기 정정 |
| S4 | 결과 분석 `origin.dgs`의 진동자 치수가 1값 | 유효 | `Result_Analysis_Storage_Spec` §3 예시 — `effDiameterMm` 1개 → **`elementWidthMm`·`elementHeightMm` 2값** · 승계 3종 필드명을 **탐촉자 레벨 이름 그대로**(`probeSnapshot`과 동일)로 통일 |

---

## 2. Codex 검토 요청

1. **B1 무효화 규칙이 같은 문서의 다른 절과 맞물리는가** — §섹션 간 의존 관계의 "④ 재수행 필요" · DGS 유효 조건 · `[교정 완료]` 활성 조건을 이어 읽었을 때, 기준점이 비워진 상태와 "재수행 필요" 상태가 같은 결과(완료 불가)로 읽히는지.
2. **S2 문구 수정 후** "Gain 변경"과 "DGS `[✨]` 재기록"이 문서 전체에서 구분되어 읽히는지 — 특히 Notion `[C-PRJ-05] 교정-파형 영역` §Gain과 `[C-PRJ-06] 결과 분석` DGS 블록.
3. **S3·S4 필드 대응** — `CalibrationHistoryEntry.probeSnapshot` ↔ `ProbeSettingsJson` 탐촉자 레벨 필드 ↔ `Result_Analysis_Storage_Spec` `origin.dgs` 승계 3종의 **이름·개수가 셋 다 일치**하는지.
4. **`[C-PRJ-05-01]` 감도 모달 DGS 1행**(`XTAL Frequency`·`EFF. Diameter`·`Delay Velocity`)이 위 `probeSnapshot`에서 읽힐 수 있는지 — 사각형 2값 표시 포함.

---

## 3. 검토 대상 아님

| 항목 | 상태 |
|---|---|
| Figma — 사이드바 DGS 결과 2칸 · 교정 이력 모달 DGS 3행 · readonly 화살표 제거 | **사용자 작업 완료**(2026-11-05) · 사이드바는 Claude가 Figma `11006-66163`으로 확인 |
| `기준 게이트` 이름 중복(`[C-PRJ-05-02]`) | 사용자 결정 = 그대로 둠 |
| 진동자 **원형/사각형 구분 필드** — Notion은 "원형 = 직경 / 사각형 = 가로 × 세로"로 표시를 나누지만 탐촉자 등록 사양에는 형태 필드 없이 가로·세로만 있음 | Claude가 별도 확인 예정 · 이번 라운드 대상 아님 |
| `16_Claude-반영.md` §4의 나머지 · `12_Claude-판정.md` §1 미반영 · S8 · 개발 논의 신규 · `07` §3 | 기존 미결 |
