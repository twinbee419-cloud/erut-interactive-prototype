# `20_Claude-반영` §3 재검토

> Codex · 2026-11-06 · 대상: `20_Claude-반영.md` §3의 4건. 관련 Notion 화면설계서를 새로 읽어 대조. §4와 이전 미결 제외.

**blocking 1 · should-fix 2 · nit 0**

## blocking

1. **종파 + 웨지 각도 조합의 교정 경로가 문서마다 다름** (§3-2)
   - **어디서:** Notion `[C-SET-02] DAQ-탐촉자 설정` §탐촉자 사양은 유형(종파/횡파)이 각도·웨지 유무와 별개라고 적고, §웨지 사양은 종파 선택 시에도 웨지 `공칭 굴절각` 입력을 차단하지 않음. `03_dev_handoff/Probe_Registration_Spec_v1.0.md:145-148,179`는 종파 + 웨지 각도 `>0`이면 `beamType=angle`로 파생함. 반면 Notion `[C-PRJ-05] 교정-사이드바` §③ 경사각은 **종파 채널에서 섹션 전체를 숨기고 굴절각을 0으로 확정**함.
   - **왜 문제인가:** 등록 화면에서 허용하고 저장 구조상 경사각으로 분류되는 조합이 교정 화면에서는 각도 교정을 할 수 없음. 같은 조합의 최종 굴절각이 `>0`인지 `0`인지 구현자가 결정할 수 없음.
   - **확인 질문:** 종파 + 웨지 `공칭 굴절각 >0` 조합은 등록 단계에서 허용되는가? 허용한다면 교정 ③과 최종 굴절각 저장은 어떻게 처리되는가?

## should-fix

2. **보고서의 단일 `공칭 굴절각` 출처가 각도 2필드에 연결되지 않음** (§3-2)
   - **어디서:** Notion `[C-RPT-01] 측정 보고서` §보고서 본문은 탐촉자 스펙에 `공칭 굴절각` 1값을 표시함. `03_dev_handoff/Report_Export_Spec_v1.0.md:79`는 출처를 `TB_PROBE.NominalRefractionAngle` 단일 필드로 적음. 반면 `03_dev_handoff/Probe_Registration_Spec_v1.0.md:145-148`은 탐촉자 `probeRefractionAngleDeg`와 웨지 `nominalRefractionAngleDeg`를 별도로 저장하고 `:54`는 교정 ③ 기본값의 우선순위만 정의함.
   - **왜 문제인가:** 보고서의 `공칭 굴절각`이 탐촉자 내부 각도, 웨지 각도, 교정 기본값 우선순위 중 어느 값인지 연결 규칙이 없음. 두 값이 모두 입력되면 보고서에 표시할 값을 고를 수 없음.
   - **확인 질문:** `TB_PROBE.NominalRefractionAngle`과 보고서의 `공칭 굴절각`은 새 각도 2필드 중 무엇에 대응하는가?

3. **비활성 형태 치수의 `null` 표현이 이력 타입과 다름** (§3-3)
   - **어디서:** `03_dev_handoff/Probe_Registration_Spec_v1.0.md:137-143`의 사각형 예시는 사용하지 않는 `elementDiameterMm`을 `null`로 둠. `03_dev_handoff/Result_Analysis_Storage_Spec_v1.0.md:71`의 `origin.dgs`도 같은 값을 `null`로 둠. 그러나 `03_dev_handoff/Error_Code_Spec_v1.0.md:187-190`의 `CalibrationHistoryEntry.probeSnapshot`은 `elementDiameterMm?: number`와 `elementWidthMm?: number`·`elementHeightMm?: number`로 선언해 **필드 생략은 허용하지만 `null`은 명시하지 않음**.
   - **왜 문제인가:** 탐촉자 설정·결과 분석의 비활성 치수를 그대로 복사할 때 교정 이력 타입과 값 표현이 달라짐. 필드 이름과 조건부 필수의 방향은 일치하나 `null`과 생략 중 어느 표현을 쓰는지 불명확함.
   - **확인 질문:** 비활성 형태의 치수는 세 저장 구조에서 `null`로 보관하는가, 필드를 생략하는가?

## 대조 결과 — 추가 지적 없음

- **§3-1:** Notion `[C-SET-02] DAQ-탐촉자 설정` §탐촉자 사양·§웨지 사양의 형태별 입력 칸, 종파에서 탐촉자 내부 `굴절각` 숨김, `지연재 음속` 선택 여부는 `Probe_Registration_Spec_v1.0.md` §2·§4·§5와 대응함. 웨지 미사용 시 치수 처리는 `20_Claude-반영.md` §4의 사용자 확인 대기 항목으로 제외함.
- **§3-2:** Notion `[C-PRJ-05] 교정-사이드바` §③과 `Probe_Registration_Spec_v1.0.md:54`, `Report_Export_Spec_v1.0.md:80`의 **교정 실측 굴절각 기본값 우선순위**는 일치함. `beamType` 파생식은 검토 대상인 개발 전달 사양에서 `Probe_Registration_Spec_v1.0.md:148,179`에 명시됨.
- **§3-3·4:** `elementShape`·형태별 치수 필드의 이름과 개수는 `Probe_Registration_Spec_v1.0.md:136-140`, `Error_Code_Spec_v1.0.md:185-191`, `Result_Analysis_Storage_Spec_v1.0.md:69-74`에서 대응함. 이력 `probeSnapshot`의 `frequencyMHz`·치수·`delayVelocityMps`로 Notion `[C-PRJ-05-01] 교정 이력` §감도 상세 모달 DGS 1행의 값은 읽을 수 있음.
- **§3-4:** Notion `[C-PRJ-05] 교정-사이드바` §④와 `[C-PRJ-05] 교정-파형 영역` §Gain은 DGS `[✨]`가 `Digital` Gain을 조정하면서 기준점 3종을 함께 기록한다고 일치함. `[C-PRJ-06] 결과 분석` §채널별 조정은 사후 Gain 조정만 하고 기준점은 기록하지 않는다고 구분함.
