# `[C-PRJ-05] 교정-사이드바` §④ 재검토

> Codex · 2026-11-05 · 범위: `12_Claude-판정.md` §3의 4항목. Notion `[C-PRJ-05] 교정-사이드바`와 `[C-PRJ-05] 교정-파형 영역`을 새로 읽고 `03_dev_handoff`와 대조함. §4 반영 대기, 기존 미결은 제외. 어느 쪽이 맞는지는 판정하지 않음.

**blocking 1 · should-fix 3 · nit 0.**

## blocking

1. **자동 TCG의 포인트 `ToF` 생성 절차가 비어 있음.** ① 사이드바는 자동 모드에서 `[✨]`만 표를 쓰고 표는 readonly이며, 2·3·N번째 에코의 Gain을 산출한다고 함. 동시에 각 포인트 `ToF`는 게이트 ToF에서 자동 입력한다고 함. 파형 영역은 선택 게이트 1개의 검출 ToF를 설명하지만, 여러 에코의 위치를 찾거나 각 에코를 포인트 행에 연결하는 절차는 없음. ② Notion `[C-PRJ-05] 교정-사이드바` §④ 감도 보정·TCG, `[C-PRJ-05] 교정-파형 영역` §하단 인라인 바—Gain·§Gate 상세 설정·§사이드바 단계별 파형 조작 대응; `03_dev_handoff/Probe_Registration_Spec_v1.0.md:75-85`. ③ 자동 모드에서는 사용자가 행·ToF를 직접 만들 수 없어, 구현자가 포인트 수와 각 `ToF`의 출처를 정해야 함. **확인 질문:** `[✨]`가 다중 에코를 검출해 행과 `ToF`를 함께 생성하는가, 아니면 미리 지정된 게이트·행을 입력으로 쓰는가? 각 에코와 게이트의 연결·검출 실패 처리는 무엇인가?

## should-fix

2. **TCG↔DGS 왕복 시 `자동/수동` 토글 선택값의 보존 여부가 명시되지 않음.** ① 각 보정 방식의 *입력값*은 채널별 보존되고, 자동·수동은 표 하나를 공유하며 전환 시 표 값이 유지됨. 그러나 TCG를 떠났다가 돌아올 때 토글 자체가 직전 선택인지 기본 `자동`으로 돌아가는지는 없음. ② Notion `[C-PRJ-05] 교정-사이드바` §④ 감도 보정—보정 방식·TCG 입력 방식; `03_dev_handoff/Probe_Registration_Spec_v1.0.md:71-82`. ③ 토글 상태에 따라 `[✨]` 노출·표 편집 가능 여부와 `[교정 완료]` 시 이력에 남길 값이 달라짐. **확인 질문:** 채널별 TCG 입력 방식 토글도 TCG↔DGS 왕복 동안 보존하는가? 현재 두 보존 규칙의 대상 구분 자체에는 모순이 발견되지 않음.

3. **`Probe_Registration_Spec` §3.2의 DGS 블록이 Notion §④와 다른 상태임.** ① 개발 전달 사양은 DGS를 *탭 6종*으로 적고 `EFF. Diameter`의 입력·승계 원본을 미확정, `Delay Velocity`를 직접 입력으로 둠. Notion은 *단일 패널*과 두 값의 탐촉자 등록값 readonly 승계를 적음. `Transfer Corr.`와 `Offset` 단위도 전달 사양은 `dB/m`, Notion은 `dB`임. ② `03_dev_handoff/Probe_Registration_Spec_v1.0.md:89-108`, Notion `[C-PRJ-05] 교정-사이드바` §④ 감도 보정—DGS. ③ 같은 §3.2에서 TCG 신규 내용은 맞춰졌지만 DGS 구현자는 서로 다른 입력 구조·출처·단위를 받음. **확인 질문:** 이 DGS 구간을 최신 Notion 기준과 대조해 어느 항목까지 개발 전달 사양에 반영할 것인가? `Offset` 단위의 기존 개발 확인 질문은 다시 제기하지 않음.

4. **`TCG 입력 방식` 기록 위치가 명시된 저장 구조에 연결되지 않음.** ① Notion과 전달 사양은 `[교정 완료]` 시 `자동/수동`을 교정 이력에 기록한다고 함. 그러나 `ProbeSettingsJson.sensitivity` 예시와 `CalibrationHistoryEntry`에는 대응 필드가 없고, `Result_Analysis_Storage_Spec`의 `origin/current`는 교정 세션 ID를 참조함. ② Notion `[C-PRJ-05] 교정-사이드바` §④ 감도 보정·§교정 이력; `03_dev_handoff/Probe_Registration_Spec_v1.0.md:82,115-149`; `03_dev_handoff/Error_Code_Spec_v1.0.md:171-190,201`; `03_dev_handoff/Result_Analysis_Storage_Spec_v1.0.md:47-79`. ③ 명시된 구조만으로는 이력 조회 시 모드를 어디서 읽을지 확인할 수 없음. 이는 실제 DB에 필드가 없다는 단정은 아님. **확인 질문:** `TCG 입력 방식`의 영속 저장 위치와 필드명은 무엇이며, 교정 이력 레코드와 교정 세션 참조 중 어디에 연결되는가? `[C-PRJ-05-01]` 모달 표시 누락은 `12_Claude-판정.md` §4의 알려진 반영 대기라 제외함.

## 지정 항목 확인

- 자동·수동은 **입력 방식**, TCG·DGS는 **보정 방식**으로 구별돼 서술됨. 표 공유와 방식별 입력값 보존 사이에 직접 모순은 없음(Notion `[C-PRJ-05] 교정-사이드바` §④; `Probe_Registration_Spec_v1.0.md:71-82`).
- §3.2의 TCG 토글 기본값, 표 readonly/편집, 모드 전환 시 값 유지, 재실행 덮어쓰기, 목표 FSH 80%는 Notion과 일치함(Notion `[C-PRJ-05] 교정-사이드바` §④ / `03_dev_handoff/Probe_Registration_Spec_v1.0.md:74-85`). `[✨]`의 화면 위치는 Notion에만 명시돼 있음.
