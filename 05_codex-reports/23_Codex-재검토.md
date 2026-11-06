# `22_Claude-반영` §4 재검토

> Codex · 2026-11-06 · 검토 범위: §4의 5개 항목. Notion 화면설계서 33건을 새로 읽고, 관련 개발 사양과 웹 원문을 대조함. §5와 기존 미결은 제외.

**blocking 0(없음) · should-fix 2 · nit 0**

## 반영 확인

- **B1 흐름:** `[C-SET-02] DAQ-탐촉자 설정` §탐촉자 사양의 종파·경사 웨지 경고와 저장 허용 → `Probe_Registration_Spec_v1.0.md:146-149`의 `beamType=angle` → `[C-PRJ-05] 교정-사이드바` §③ 표시 → `[C-PRJ-05] 교정-파형 영역` §교정 화면의 칩 5종 → `Report_Export_Spec_v1.0.md:79-80`의 파생 공칭 굴절각으로 이어짐. 수직 빔은 ③ 숨김, 경사각 칩 제외 4종, 파생 공칭 굴절각 0으로 읽힘.
- **종파만으로 ③을 숨기는 잔여:** Notion 화면설계서 33건, `03_dev_handoff/`, `ERUT_인수인계서_Codex.md`에서 발견하지 못함. `[C-SET-02]` §탐촉자 사양의 ‘종파면 필드 숨김’은 교정 ③이 아닌 **탐촉자 내부 굴절각 입력란**을 가리킴. `22_Claude-반영.md` §3-4의 이전 보고서 2건은 요청대로 제외함.
- **웨지 사용:** `[C-SET-02]` §웨지 사양의 OFF 시 입력 숨김·검증 제외, ON·각도 0인 수직 웨지 구분과 `Probe_Registration_Spec_v1.0.md:50-55,148`의 `wedge.used=false`·나머지 값 `null`·기본값 우선순위가 이어짐. `[C-PRJ-05] 교정-사이드바` §①의 `Wedge Delay` 기본값 0과도 일치함. 경고의 발생 조건·유형 라디오 아래 위치·저장 허용은 `[C-SET-02]` §탐촉자 사양 및 `Probe_Registration_Spec_v1.0.md:181`에 적혀 있음.

## 새로 확인된 어긋남

### S1 · should-fix · 경고 표시와 ‘경고 없이’가 같은 조건에 병기됨

1. **무엇이:** 종파 + 웨지 사용 ON + 웨지 공칭 굴절각 > 0이면 경고를 표시한다고 한 직후, 일반 경사각 탐촉자를 종파로 잘못 등록하면 깊이 오차가 ‘경고 없이 발생’한다고 서술함.
2. **어디서:** Notion `[C-SET-02] DAQ-탐촉자 설정` §탐촉자 사양 > 종파 + 웨지 각도 경고.
3. **왜 문제인가:** 동일 조합에서 경고가 표시되는지에 대한 문서 내부 설명이 엇갈려, 경고 동작과 안내 문구를 함께 구현할 때 뜻이 갈림.
4. **확인 질문:** ‘경고 없이’는 이 화면에서 정의한 경고와 다른 상황을 뜻하는가? 해당 문장을 어느 조건의 설명으로 읽어야 하는가?

### S2 · should-fix · 횡파에서 종파로 전환할 때 숨겨진 내부 굴절각 처리 미정

1. **무엇이:** 횡파에서 탐촉자 내부 `굴절각`에 양수를 입력한 뒤 유형을 종파로 바꾸면 입력란은 숨겨지고 필수 검증만 제외됨. 기존 입력값을 지우거나 저장·파생 계산에서 무시한다는 전환 규칙은 확인되지 않음.
2. **어디서:** Notion `[C-SET-02] DAQ-탐촉자 설정` §탐촉자 사양·§각도 2필드 사용 구분; `03_dev_handoff/Probe_Registration_Spec_v1.0.md:45,146-149,180`.
3. **왜 문제인가:** `beamType` 식은 `probeRefractionAngleDeg > 0`도 검사함. 숨긴 값이 유지되면 웨지 OFF 또는 웨지 각도 0이어도 `angle`이 될 수 있고, 교정 ③의 표시·기본값 역시 숨겨진 값을 읽는지에 따라 달라짐. 종파용 JSON 예시는 내부 각도 `null`이나 전환 시 처리 규칙은 아님.
4. **확인 질문:** 유형을 종파로 바꾸거나 종파로 저장할 때 탐촉자 내부 굴절각의 기존 값은 `null`로 초기화하는가, 저장·`beamType` 계산에서만 제외하는가? 이전 값의 편집 복원 여부도 정해져 있는가?

## 웹 원문 재확인

접속일 **2026-11-06**. `22_Claude-반영.md` §3-3의 W1~W3 URL을 각각 직접 열어 확인함. 아래 따옴표는 원문 발췌이며, 도메인 판단이나 ASME 원문 확인을 뜻하지 않음.

| 출처 | 대조 결과 · 원문 발췌 |
|---|---|
| [W1 Evident](https://ims.evidentscientific.com/en/learn/ndt-tutorials/flaw-detection/dual-element-angle-beams) | 검색 요약의 `rather than ...` 앞부분은 본문과 일치. `...`는 본문 문장이 아니라 요약의 생략임. 이어지는 원문: “rather than shear waves. The overlapping beam footprints of the T and R sides create a natural focal zone in which sensitivity is maximized” — 이후 문장은 종파의 긴 파장이 결정립 산란을 줄인다고 이어짐. |
| [W2 ASNT](https://source.asnt.org/phased-array-ultrasonic-testing-of-stainless-steel-pipe-welds/) | §3-3의 인용문 3문장 전체가 본문과 일치. 발췌: “Angle beam or refracted longitudinal waves are, therefore, the accepted method for stainless steel weld inspections.” |
| [W3 교육 자료 PDF](https://static.inspector-training.com/uploads/2023/08/Ultrasonic-Testing-of-Austenitic-Stainless-Steel-Welds.pdf) | PDF 접근 가능. 15쪽에서 줄바꿈을 제외하면 §3-3 인용문과 일치. 발췌: “The ASME Boiler and Pressure Vessel Code, Section V, Article 4 T-451 now requires such an approach” — ASME 조항 원문은 이 검토 대상에 포함되지 않음. |
