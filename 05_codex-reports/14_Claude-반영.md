# `13_Codex-재검토` 판정 + 결과 분석 TCG readonly 전환 + 교정 이력 감도 모달

> Claude · 2026-11-05 · 대상 = `13_Codex-재검토.md`(blocking 1 · should-fix 3) + 사용자 확정 2건
> §1 = 13번 판정 · §2~§3 = 이번 라운드 반영 · **§4 = Codex 검토 요청** · §5 = 검토 대상 아님

---

## 1. `13_Codex-재검토` 판정 — 4건 모두 유효 · 전부 반영

| | 항목 | 판정 | 반영 |
|---|---|---|---|
| **B1** | 자동 TCG의 포인트 `ToF` 생성 절차가 비어 있음 | **유효** | Notion `[C-PRJ-05]` ④ `[✨]` 아래에 **포인트 생성** 규칙 신설 — Range 안의 다중 저면 에코를 검출해 **에코 1개당 1행** · `ToF` = 각 에코 피크 위치 · `Gain` = 80%까지 필요한 dB(첫 에코 행 0 dB) · 실행마다 기존 행 전부 교체 · **두 번째 에코 미검출 시 표 변경 없음 + 인라인 에러** `다중 에코를 찾지 못했습니다. Range를 넓혀 두 번째 에코가 보이도록 해 주세요.` · `ToF` 출처를 모드별로 분리(자동 = 검출 위치 / 수동 = `[+]` 시 게이트 TOF). **에코 인정 최소 진폭·피크 판정 방식은 Notion `🛠️ 개발팀 논의 필요/수정 사항`으로 이관** |
| S2 | TCG↔DGS 왕복 시 토글 보존 여부 | 유효 | **보존** — 토글도 TCG 입력값의 일부 · 채널별 |
| S3 | `Probe_Registration_Spec` §3.2 DGS 블록이 Notion과 다름 | 유효 | **Notion 기준으로 전면 동기** — 탭 6종 → 단일 패널 · `EFF. Diameter`·`Delay Velocity` = 탐촉자 등록값 readonly 승계 · `Transfer Corr.`·`Offset` = `dB` · `[↑ Record]` 저장값 3종 명시 · §4 JSON도 같은 구조로 갱신(`delayVelocityMps`를 탐촉자 레벨로 이동 · `dgs.record` · `transferCorrDb` · `offsetsDb`) |
| S4 | `TCG 입력 방식` 저장 위치가 스키마에 없음 | 유효 | `Probe_Registration_Spec` §4 `sensitivity.tcgInputMode`(`auto`/`manual`) 추가 · `Error_Code_Spec` `CalibrationHistoryEntry`에 `sensitivityMethod` · `tcgInputMode?` 추가 |

---

## 2. 결과 분석 TCG readonly 전환 — 사용자 확정

### 확정 사항

1. **TCG 자동 산출 버튼 2개 미배치** — 일괄 감도 교정의 `[✨ TCG]` · 채널별 `TCG [✨]`
2. **TCG는 교정 시 적용한 값 n개를 readonly로 표시** — 행 추가·삭제·수동 편집 없음

### 근거 (Claude 판정 · 도메인 검토 결과)

- **TCG의 기준은 시편 기준 반사체**(`초음파_기초_원리 §1222` · `업무_프로세스` 교정 ④d)인데 결과 분석 raw에는 **모재 파형만** 있음. 같은 문서가 TCG↔DGS 전환 불가 근거로 이미 그렇게 적고 있어 **`[✨ TCG]`는 자기모순**이었음.
- 1순위 자료에서 **TCG 자동은 교정 단계 기능**이고 사후 조정은 **글로벌 dB에 한정**(`FastView §41·§455` vs `§413~419`).
- 모재 에코로 TCG를 다시 맞추면 **두산이 탐지하려는 감쇠 구간을 정상으로 평탄화**할 수 있음(`FastView §389·§392`).
- `[✨ Gain]`은 유지 — 모재 기준 80% 맞춤이 자료상 허용됨(`FastView §415`).

### 반영 문서

| 문서 | 변경 |
|---|---|
| Notion `[C-PRJ-06] 결과 분석` | 📌 · 레이아웃 · 일괄 감도 교정(`[✨ TCG]` 블록 → "TCG 자동 산출 버튼 없음" + 근거) · 채널별 TCG(readonly n개) · `[저장]`·`[↻]` 대상에서 TCG 제외 · **사후 변경 허용 범위에 "TCG 포인트 = 조정 불가" 신설** · 보고서 구분 기재 대상을 Gain으로 한정 · 전환 불가 근거 문구 "시편 다중 에코" → "시편 기준 반사체" |
| Notion `[C-RPT-02] 스캔 보고서` §9 | 동결 이유 "게이트·Gain·TCG를 사후 조정" → "게이트·Gain을 사후 조정" · 동결 7종 목록은 유지 |
| Notion `🛠️ 개발팀 논의 필요/수정 사항` | 두산 확인 항목을 "TCG readonly 확정이 두산 절차와 맞는가"로 갱신 · TCG 에코 검출 기준 신규 |
| `CLAUDE.md` | `[C-RPT-02]` 동결 이유 · `[C-PRJ-06]` 요약을 readonly로 |
| `03_dev_handoff/Result_Analysis_Storage_Spec_v1.0.md` | §1 사후 조정 범위 · §2-1 "새 TCG = 적용 TCG" 주석 · §5-4 문구 · **§5-6 TCG 포인트 변경 금지 신설** |

`tcgPoints`는 저장 세트(`origin`·`current`)에 **그대로 남김** — raw 역산식에 TCG 항이 필요하므로. `current.tcgPoints`가 항상 `origin`과 같다는 불변 규칙만 추가함.

---

## 3. `[C-PRJ-05-01] 교정 이력` 감도 상세 모달 — Figma 기준 반영

| 상태 | 반영 |
|---|---|
| 공통 | Gain `Digital`·`Analog` readonly · 보정 방식 라디오 readonly · **방식에 따라 본문 교체** |
| TCG | **안내 문구** `TCG 자동 적용으로 산출된 값입니다.` — `TCG 입력 방식` = `자동`인 이력에만 표시 · 포인트 테이블 readonly |
| DGS | 1행 승계 3종 · 2행 `DGS Curve`·`Ref Type`·`Ref Size` · 3행 `기준 게이트` · `감쇠 및 보정`(접이식) — `Ref Atten`·`Ampl Corr.`·`Test Atten`·`Transfer Corr.`·`Offset N` |

삭제 — *"보정 방식이 DGS여도 같은 구성(ToF·Gain 표)으로 표시"*. DGS에는 포인트 표가 없음.

---

## 4. Codex 검토 요청

1. **`[C-PRJ-06]`에 TCG를 "조정 가능"으로 전제한 서술이 남아 있는가** — 사후 변경 허용 범위 · 저장 · `[↻]` · 일괄 감도 교정 · 채널별 조정 · 저장 구조 절을 이어 읽었을 때 TCG readonly와 어긋나는 문장.
2. **다른 문서에 "결과 분석에서 TCG를 사후 조정한다"는 전제가 남아 있는가** — Notion `[C-PRJ-02]` · `[C-PRJ-03]` · `[C-RPT-01]` · `[C-RPT-03]` · `[C-PRJ-05] 교정-파형 영역` · `ERUT_인수인계서_Codex.md` · `03_dev_handoff/*`. §2 반영 문서 외에 고칠 곳이 있는지.
3. **B1 포인트 생성 규칙이 구현 착수 가능한 수준인가** — 에코 검출 임계는 개발 논의로 넘겼으므로 그 외에 비는 조건(예: Range 밖 에코 · 첫 에코 위치 기준)이 있는지.
4. **`[C-PRJ-05-01]` 감도 모달 ↔ 저장 스키마 대조** — TCG 안내 문구 조건이 `tcgInputMode`와 연결되는가 · DGS 표시 항목이 `Probe_Registration_Spec` §4 `dgs` 구조 및 `Result_Analysis_Storage_Spec` §3 `origin` 보관 항목과 대응되는가. **단 §5의 모달 미결 3건은 제외.**
5. **`Probe_Registration_Spec` §3.2 DGS · §4 JSON ↔ Notion `[C-PRJ-05]` ④ DGS** 재대조 · `Error_Code_Spec` `CalibrationHistoryEntry`의 필드명이 Probe JSON과 맞는지.

결과는 `15_Codex-재검토.md`로.

---

## 5. 검토 대상 아님

| 항목 | 상태 |
|---|---|
| **결과 분석 채널별 `Gain [✨]`** — Figma에 추가됐으나 `[C-PRJ-06]`의 *"채널별 자동 감도 교정 버튼 없음"* 규칙과 충돌 | 사용자 결정 대기 · Notion 미반영 |
| **`[C-PRJ-05-01]` DGS 모달 미결 3건** — ① 기록값 `기준 음로`·`기록 Gain` 누락 ② 라벨 불일치(`기준 게이트`↔`기록 게이트` · `Ref Type`↔`Reference Type` · `Ampl Corr.`↔`Ampl Correct`) ③ readonly 필드의 드롭다운 화살표 | 사용자 결정 대기 |
| `12_Claude-판정.md` §1 미반영 항목(B1~B4 · S5~S7 · S9) · S8 거리식 | 순차 반영 / 사용자 지시로 보류 |
| Notion `🛠️ 개발팀 논의 필요/수정 사항` 신규 3건 | 두산·개발 확인 대기 |
| `07_SET06_Claude-반영.md` §3 진행 7건 · 보류 1건 · 인수인계서 §10 | 기존 미결 |
