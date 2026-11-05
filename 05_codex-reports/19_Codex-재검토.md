# `18_Claude-반영` §2 재검토

> Codex · 2026-11-05 · 대상: `18_Claude-반영.md` §2의 4건. 관련 Notion 문서를 새로 읽어 대조. §3과 기존 미결 제외.

**blocking 없음 · should-fix 2 · nit 0**

## should-fix

1. **DGS `[✨]`를 ‘Gain 변경이 아님’으로 적은 문장이 파형 명세와 다름** (§2-2)
   - **어디서:** Notion `[C-PRJ-05] 교정-사이드바` §④ DGS의 ‘DGS 모드 밖에서의 Gain 변경은 재기록 대상 아님’은 괄호 안에서 *DGS 모드 `[✨]`는 Gain 변경이 아니라 의도적 재기록*이라고 설명. Notion `[C-PRJ-05] 교정-파형 영역` §하단 인라인 바–Gain은 같은 `[✨]`가 `Digital` Gain을 자동 조정하면서 기준점 3종을 기록한다고 설명.
   - **왜 문제인가:** 한쪽은 Gain 변경이 아니라고 하고 다른 쪽은 Gain 값 변경을 명시함. DGS `[✨]`의 **Gain 조정과 기준점 재기록이 함께 일어나는지** 문장만으로는 일치하지 않음.
   - **확인 질문:** §④의 괄호 문장에서 DGS `[✨]`와 일반 Gain 변경의 차이를 어떤 범위로 표현할 것인가?

2. **교정 이력의 `probeSnapshot.delayVelocityMps` 필수 여부가 TCG 경로와 맞지 않음** (§2-3·4)
   - **어디서:** `03_dev_handoff/Error_Code_Spec_v1.0.md:185-190`은 모든 `CalibrationHistoryEntry`에 `probeSnapshot`과 숫자형 `delayVelocityMps`를 필수로 둠. Notion `[C-SET-02] DAQ-탐촉자 설정` §탐촉자 등록은 `지연재 음속`을 **선택** 항목으로 둠. Notion `[C-PRJ-05] 교정-사이드바` §④는 이 값이 없을 때 **DGS 라디오만** 비활성으로 두며 TCG는 기본 선택값임.
   - **왜 문제인가:** 지연재 음속이 없는 탐촉자로 TCG 교정을 완료하면 이력은 생성돼야 하지만, 현재 `CalibrationHistoryEntry`의 필수 숫자 필드를 채울 값이 없음. 필드 이름·개수는 세 스키마에서 일치하나 이 경로의 값 존재 조건이 다름.
   - **확인 질문:** TCG 이력에서 미등록 `delayVelocityMps`를 어떻게 표현하거나, `probeSnapshot`의 필수 조건을 어떻게 분기하는가?

## 대조 결과 — 추가 지적 없음

- **§2-1:** Notion `[C-PRJ-05] 교정-사이드바` §④의 재기록 트리거 7종은 기준점 3종 비움·곡선 삭제·`[교정 완료]` 불가로 이어짐. 같은 문서 §섹션 간 의존 관계의 ‘④ 재수행 필요’와 완료 상태에서 다른 결과를 요구하는 문장은 확인되지 않음. `[✨]` 재실행 실패 시 기존 기준점 유지도 §④에 명시됨.
- **§2-2:** Notion `[C-PRJ-06] 결과 분석` §채널별 조정의 DGS Gain `[✨]`는 `Digital`만 바꾸고 기준점은 기록하지 않는다고 명시함. 교정 화면의 기록 동작과 화면별 범위가 구분됨.
- **§2-3·4:** `Probe_Registration_Spec_v1.0.md:127-129,137`의 탐촉자 레벨 4개 숫자 필드 이름은 `Error_Code_Spec_v1.0.md:185-190`의 `probeSnapshot` 및 `Result_Analysis_Storage_Spec_v1.0.md:69-74`의 `origin.dgs`와 일치함. `frequencyMHz`는 모달 `XTAL Frequency`, `elementWidthMm`·`elementHeightMm`는 `EFF. Diameter`의 가로·세로, `delayVelocityMps`는 `Delay Velocity`에 대응함(Notion `[C-PRJ-05-01] 교정 이력` §감도 상세 모달). 원형/사각형 구분 필드 문제는 `18_Claude-반영.md` §3의 제외 대상이므로 판단하지 않음.
