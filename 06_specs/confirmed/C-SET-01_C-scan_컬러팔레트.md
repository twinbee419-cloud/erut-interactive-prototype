# [C-SET-01] C-scan 컬러 팔레트 — 확정

- **승인일:** 2026-11-26 · 라운드 종료 2026-11-26 (Codex 왕복 3회 = 초안 검토 · 반영안 재확인 · 반영 후 재검토)
- **승인 범위:** C-scan 컬러 팔레트 전역 선택(내장 5종) · 변경 위치 = 프로그램 설정 1곳 · 범례 툴팁에 팔레트 이름·상태 색 · 결과 분석 ⓘ 범례 신설 · `진폭 5단계` 안내 문구 · 미검사·미검출 색 · 진폭→256칸 변환 규칙 · 캡처 시점 팔레트 값 저장 · 보고서 PDF 컬러바 · 프로그램 설정 미저장 이탈 팝업
- **Notion 반영:** [C-SET-01] 프로그램 설정(정본) · [C-PRJ-03] 종합 결과 · [C-PRJ-06] 결과 분석-파형 영역 · [C-RPT-02] 검사 결과 보고서 · 🛠️ 개발팀 논의 필요/수정 사항
- **로컬 반영:** `03_dev_handoff/Result_Analysis_Storage_Spec_v1.0.md` §6(`palette`) · `06_specs/Figma_수정목록.md`
- **QC 이슈:** 없음(사용자 직접 요청 · 고객 제공 OmniScan 팔레트 파일 24종 분석에서 시작)

## 1. 확정 내용
### 1-1. 팔레트
- **전역 1개** — 프로그램 전체 동일 · 탐촉자·pane별 다른 팔레트 없음(8채널을 같은 색 기준으로 비교)
- 내장 5종(화면 이름 ← 원본 파일): `진폭`(기본) ← ONDT_Amplitude · `진폭 · 어두운 배경` ← ONDT_AmplitudeDark · `진폭 5단계` ← ONDT_AmplitudeCut · `무지개` ← ONDT_ONDT · `흑백` ← ONDT_RFTOFD
- 색 값은 개발 시 원본에서 추출해 **프로그램 상수로 내장**(실행 중 외부 파일 읽기 없음) · 저장된 값이 목록에 없으면 `진폭`
- 제외: TFM 4종 · RF 계열 · Corrosion(두께) 4종 · Threshold·Sizing 등 계단형 · 11tonesofgrey(서로 다른 색 163개) · 경보·접촉 확인용 · 색 범위(min/max) 조정 · 사용자 `.pal` 가져오기

### 1-2. 변경 · 적용
- 변경 위치 = **[C-SET-01] 프로그램 설정 › 환경 설정 › `C-scan 컬러 팔레트` 드롭다운 1곳**(옵션 = 이름 + 0→100% 색띠) · 각 화면 범례에는 이름만 표시(바로가기 없음)
- 적용 대상 = [C-PRJ-02] 대시보드 3D · [C-PRJ-03] B·C·D-scan pane·3D · [C-PRJ-06] C-scan·B/D-scan·3D View·결함 기준 슬라이더 트랙
- 적용 시점 = [저장] 직후 즉시 · 수신 중에도 변경 가능
- **표시만 바뀜** — raw·측정값·결함 비율·검출·마킹 불변 · [C-PRJ-06] 수정 일시·수정 정보 갱신 없음
- 저장 범위 = 이 PC · 다른 PC에서 같은 .erut를 열면 그 PC 팔레트로 표시
- 프로그램 설정 미저장 이탈 = `공통 팝업 - 변경 내용 저장`(nav 이동 = 이동 · 문서 탭 닫기 = 닫기)

### 1-3. 색 지정
- 진폭 0~100% FSH → 256칸 = 진폭 % × 255 ÷ 100 반올림(.5는 올림 · 30% → 77) · 100% 초과 = 255 · 모든 렌더 공통
- **미검사**(스캔하지 않은 영역) = 팔레트와 무관하게 `#DFE4ED`(`--surface-disabled`) + 사선 빗금 · 2D·3D·보고서 공통
- **미검출**(게이트 구간에 게이트 Threshold를 넘은 신호 없음 · TCG·DGS 공통 · 기록 기준 초과 필터와 별개) = 진폭 `#FFFFFF` · 어두운 배경 `#C0C0C0` · 5단계 `#FFFFFF` · 무지개 `#FFFFFF` · **흑백 `#000000`**(원본 `#FFFFFF`는 흑백 100% 색과 같아 대체)
- 범위 고정 0~100% FSH

### 1-4. 범례 · 안내
- [C-PRJ-03] pane ⓘ 툴팁 = 팔레트 이름 + 가로 컬러바(`0%`/`100%`) + 상태 색 2개 + 안내 문구
- [C-PRJ-06] C-scan `2D | 3D` 세그먼트 오른쪽 ⓘ 신설(같은 구성)
- `진폭 5단계` 안내 = 드롭다운 옵션 캡션 `색 구간은 보기 편의를 위한 것이며 검출 기준과 관계없습니다.` + 툴팁 1줄 `…검출 기준(게이트 Threshold)과 관계없습니다.` (팝업·배너 없음)

### 1-5. 캡처 · 보고서
- 캡처 이미지는 현행대로 범례 제외 · **캡처마다 팔레트를 값으로 저장**(이름 + 256색 + 미검사·미검출 색 · 동결 7종과 별개 · 교정값 아님)
- 캡처 이미지(카드 썸네일·모달 블록 1·PDF) = 저장된 팔레트로 표시 · 이후 변경과 무관하게 불변 · 3D 위치도 저장된 팔레트 사용(고정 이미지 여부는 개발 확인)
- 보고서 PDF = 캡처 옆에 세로 컬러바(0·20·40·60·80·100 %FSH) + 팔레트 이름 + 미검사·미검출 색

## 2. 근거
### 2-1. 내부(1순위 · `ndt-domain-review` 2026-11-26)
- `상용 소프트웨어(FastView) 기능 정리본.md` L380(LUT 일괄 적용) · L419(색별 신호 세기 수치화·법적 코드) · L99~100·L342(256단계 이미지에서 진폭 역추출) · L389·L429(두산 = 신호 급감이 결함 · 감도 저하 구간 명확 표시) · L39(80% 기준 = dB 조정) · L379(TOF 저장 '논의')
- `20261118_19_시연_요약.md` §5 L84 · 부록 L234 — Olympus 팔레트 기본값 + 추가 선택 · 흑백 · 고령 사용자 [주장]
- `한국_비파괴_초음파_검사_업무_프로세스.pdf` §4-2-1 — 보고서 필수 항목에 팔레트 없음 → 보고서 기재는 **우리 판단**

### 2-2. 외부 — OmniScan MXU Software User's Manual, Software Version 4.4, DMTA-20072-01EN [Q1000010] Rev. C, January 2017
- URL: https://endotest.dk/produkt/omniscan-sx/?attachment_id=3800&download_file=yyqcx84k3uvtl (접속 2026-11-26 · 대리점 사본 · Codex 원문 재확인 2회 일치)

| 위치 | 표제(원문) | 원문 그대로 |
|---|---|---|
| §7.5 p.190 | — | "The color palettes of the OmniScan instrument (.pal files) provide 256 colors, and the definition for the following three special colors: no-data, no-detection, and no-synchro." |
| §7.5 p.190 | No-data | "A zone which is not inspected." |
| §7.5 p.190 | No-detection | "An inspected zone with no signal has crossed gate A." |
| §7.5 p.190 | No-synchro | "An inspected zone with no signal has crossed gate I; therefore, there is no detection." |
| §7.5 p.190 | — | "The fourth and last component is an RGB-reserved field that is not used with the Microsoft Windows CE operating system, although it is essential for proper color palette file usage. The number 0 (zero) must always be used as the fourth component." |
| §7.5.1 p.192 | — | "The following is an example that defines the “no-data” to black, the “no-detection” to white, and the “no-synchro” to grey:" |
| §7.5.2 p.193 | — | "Always include three special colors." |
| §7.5.2 p.193 | — | "Always include the 256 colors of the palette." |
| §7.5.2 p.193 | — | "The order of the special colors is “no-data,” “no-detection,” and “no-synchro.”" |
| §8.7.1.2 p.300 | — | "A saturated gate means that the signal amplitude of at least one focal law element, or the sum of all elements in a beam (the focal law itself), exceeds 200 % within gate A range. If gate A on the A-scan blinks, it means that the saturation is on the current law." |

- 업계 공통 규격(ISO·ASME)·타사에서 미검사·포화 색 규정은 찾지 못함 → 제조사별 관행 · 100% 초과 = 마지막 색은 **우리 판단**

### 2-3. 고객 제공 파일 실측(Claude 파싱 · Codex 대조 일치)
- 24개 중 `<SpecialColors>` 빈 파일 5개(11levels · AmplitudeCutDark · Alarm · Detection · Indication) · AmplitudeRF = XML 아닌 `R,G,B,F` 텍스트
- `F="1"` 포함 18개(XML 17 + AmplitudeRF) — 매뉴얼은 "always be 0" → RGB만 사용
- `#DFE4ED` 색차(CIE76 ΔE): 진폭 2~3% 4.1 · 흑백 89% 5.0 · 5단계 5.6 · 무지개·어두운 배경 47 → 빗금으로 구분

## 3. 검토 요약(Codex)
| 회차 | 주요 지적 | 판정 · 처리 |
|---|---|---|
| 1 초안 | Report_Export_Spec은 A-scan 사양 · 3D 고정 여부 · 팔레트 이름만 저장 시 재현 불가 · 기본 팔레트 읽기 실패 · 미저장 이탈·PC 범위 · 변환식·미검출 정의 · F 개수 · 인용 구조 | 8건 확정 → 사양 수정 대상 변경 · 256색 값 복사 · 상수 내장 · 공통 팝업 · 변환식·정의 명시 · 18개 정정 |
| 2 반영안 | 저장 사양 참조 · 미검출 기준(Threshold vs DGS Curve) · 3D '불변' 단정 · .5 반올림 · 인용 표 | 미검출 = **게이트 Threshold**(Claude 판정 · 기록 기준과 다른 축) · 3D는 '저장 팔레트 사용'까지 · .5 올림 |
| 3 반영 후 | 저장 사양 표 '이름이 아니라' 문구 · 상수 내장이 화면 명세에 불명확 | 반영 오류로 보고 승인 내용대로 수정(사후 보고) · blocking 없음 → 라운드 종료 |
| 추가 | 대시보드 3D 적용 대상 누락(Claude 발견) | [C-SET-01] 적용 대상에 추가 · Codex 3회차에서 [C-PRJ-02]와 일치 확인 |

## 4. 미확정(개발 확인 · 정본 = Notion 🛠️ 개발팀 논의 필요/수정 사항 'C-scan 컬러 팔레트')
1. Olympus 팔레트 값 내장 배포 권한
2. 동기화 게이트(gate I) 유무 — 없으면 상태 색 2종
3. `palette` 없는 기존 캡처의 보고서 컬러바 기준
4. 100% FSH 초과 진폭 저장 여부(포화 경고 = A-scan 별건)
5. [C-RPT-02] 3D가 캡처 순간 고정 이미지인지

**별건 이관:** [C-SET-01] 모니터링 서버 설정 미저장 이탈 규칙(메모리 `project_spec_cleanup_pending`) · C-scan 보고서 PDF 출력 사양 부재(메모리 `project_scan_report_contents`) · 미검사 빗금 디자인 시스템 등록(`Figma_수정목록.md`)

## 5. 변경 이력
| 일자 | 내용 |
|---|---|
| 2026-11-26 | 최초 확정 |
