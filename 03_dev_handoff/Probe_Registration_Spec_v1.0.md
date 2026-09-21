# 탐촉자 등록 항목 & 감도 보정(TCG/DGS) 사양 (v1.0)

> 대상 화면: [4-3-1] 채널 설정 (`window.ChannelCommissioning`) · 메인 SLIDE 13
> 기획 버전: ERUT_ServiceFlow_FixedProbe.html v20.0
> 작성일: 2026-06-12

---

## 1. 배경 / 결정

탐촉자 등록 시 **수직형·경사각형 구분은 시리얼 넘버 자동 인식이 아닌 수동 입력**으로 처리한다.
탐촉자 주파수·진동자 크기·경사 각도, 검사체 재질·PRF·감도 보정 방식은 **교정 시 함께 설정**한다.

사용자(기획) 확정 사항:

| 항목 | 결정 |
|---|---|
| 수직/경사각 구분 | **공칭 굴절각 수동 입력** — 표면 **법선 기준** (0° = 수직 / 0° 초과 = 경사각). 시리얼 자동 인식 X |
| 파형 유형 | **종파 / 횡파 별도 선택** — 각도와 독립. 굴절각·깊이 환산에 쓸 음속(V_L / V_S) 결정 · 공칭 굴절각 기본값만 결정(종파 0 / 횡파 45) |
| 탐촉자 주파수 | 개별 수동 입력 필드 (MHz) |
| 진동자 크기·형식 | 개별 수동 입력 (크기 mm + 형식 원형/사각) |
| 검사체 재질 | 필드 추가 + 음속·권장 PRF 자동 prefill |
| RFP(반응 속도) | = **PRF**(펄스 반복 주파수). 교정 화면에 표시/조정 |
| 감도 보정 방식 | **TCG**(기본) / **DGS** 라디오 택1. DAC는 폐기. 교정 메타 + Amp 진폭보정 기준으로만 저장 |
| 경사각 표준 절차(입사점 BIP·실제 굴절각 검증) | **이번 범위 제외** — 공칭 굴절각 입력만 유지 |

---

## 2. 채널 정보 입력 필드 (좌측 패널)

| 필드 | 타입 | 필수 | 비고 |
|---|---|:--:|---|
| 채널 번호 | select/입력 | ✔ | 기존 |
| Serial 번호 (SN) | text | ✔ | 기존. **종류 식별에는 사용하지 않음** (수동 입력으로 대체) |
| 검사 대상 | select | ✔ | 기존 |
| **검사체 재질** | select | ✔ | 신규. 검사 대상 등록 재질 자동 반영. **옵션 라벨은 재질명만** (음속 숫자 미표기 — [6]과 동일). 선택 시 표준 음속·권장 PRF prefill |

> **도메인 주의 — 음속은 두께가 아니라 재질로 결정**: 음속은 재질 고유 물성(밀도·탄성계수)으로 결정되는 상수다. 두께는 음속이 아니라 ToF·PRF·Gate에 영향을 준다. 재질 select가 주는 음속은 **표준(참조)값**이며, 실제값은 참조 시험편으로 실측해 보정한다(`음속 = 2×시험편두께×1000/ToF`). 따라서 select 옵션에 음속 숫자를 박지 않고 재질명만 표시하며, 표준 음속은 '음속 측정' 셀에 prefill로 노출한다. 음속은 온도·grade·압연방향에 따라 ±1~3% 변동 가능.
| **탐촉자 주파수 (MHz)** | number (0.5–20, step 0.25) | ✔ | 신규. 기존 '탐촉자 종류' 프리셋 분해 |
| **진동자 크기 (mm)** | number (1–50, step 0.5) | ✔ | 신규. 원형=직경 / 사각=변 길이 |
| **진동자 형식** | select (원형/사각) | – | 신규 |
| 파형 유형 | radio (종파/횡파) | ✔ | 기본 종파 |
| 공칭 굴절각 (°) | number (0–89, step 0.1) | ✔ | 법선 기준 · 0°=수직. 기본값 종파 `0` / 횡파 `45` · **두 유형 모두 수정 가능**(종파도 지연재·경사 굴절 사용). 탐촉자 표기값(0·45·60·70) 그대로 입력 |

> **도메인 주의 — 공칭 굴절각 ≠ 웨지 경사면 각도**: 시중 탐촉자는 **굴절각**(모재 안 빔 각도)으로 표기되어 판매된다. 웨지 경사면의 물리 각도(입사각)는 다른 값이다 — 45° 탐촉자 입사각 ≈31° / 60° ≈40° / 70° ≈49°(초음파_기초_원리 §7.3). 입력은 굴절각으로 받고, 입사각은 Snell 법칙으로 역산한다: `sin(입사각) = V_wedge / V_material × sin(굴절각)` (V_material은 파형 유형에 맞는 V_L 또는 V_S). 표면 기준(90°=수직)은 45°에서만 두 기준 값이 일치해 60°·70° 탐촉자에서 오입력을 유발하므로 쓰지 않는다.
| 교정 주기 (일) | number + 전역기본 체크 | – | 기존 |

> 폐기: '탐촉자 종류' 프리셋 select(표준 5MHz∅10 / 고주파 10MHz∅6 / 저주파 2.25MHz∅13). 임의 조합 입력 불가 문제 해소.

---

## 3. 교정 측정 항목 (우측 패널)

기존 음속 · 영점(Zero) · Gain (1×3) 에 **PRF · 감도 보정(TCG/DGS) (1×2)** 추가.

### 3.1 PRF (자동/수동)
- `자동` 토글 ON(기본) → `calcPRF(공칭두께, 재질)` 산출값 표시(readonly)
- 산식: `PRF_max = c / (2 × T_max × N_safety × N_margin)`, 단계 매핑 `[200, 500, 1000, 2000, 4000] Hz` 중 상한 이하 최대값
- **[6] 검사 대상 관리의 PRF 자동계산과 동일 로직** (`window.calcPRF` 재사용 — 상세: `PRF_Auto_Calculation_Spec_v1.0.md`)
- `자동` OFF → 수동 입력

### 3.2 감도 보정 — TCG / DGS 택1

- **보정 방식** 라디오 (필수) — `TCG`(기본) / `DGS`. **DAC는 폐기**
- 선택에 따라 ④ 감도 보정 본문 전체가 교체된다. 두 방식의 입력 항목은 공유하지 않는다.

#### TCG
- `FSH`(%) 목표 진폭(기본 80) + `[✎ Gain]`(FSH에 맞춰 글로벌 게인 자동 조정) + `[✎ TCG]`(포인트별 보정 게인 자동 산출)
- 포인트 테이블 — `ToF`(μs) + `Gain`(dB) · `ToF`는 게이트 ToF와 연동 자동 입력(수동 수정 가능)

#### DGS — 탭 6종

> **출처 = 참고한 상용 SW 화면.** 필드 구성·라벨·단위·기본값은 그 화면을 그대로 옮긴 것이며, 각 값의 의미·산출식·검증 범위는 개발 확정 대상이다. `01_materials`(1순위 도메인 자료)에는 DGS/AVG가 용어 사전의 명칭 1줄(`거리-게인-크기 선도(독일 방식)`)만 존재하고 원리·입력 파라미터·ERS는 0건이다.

| 탭 | 필드 | 단위 | 비고 |
|---|---|---|---|
| `SETUP` | `DGS Mode` | 토글 | 기본 ON |
| | `DGS Curve` | mm | 기본 3.00 |
| `DGS PROB` | `XTAL Frequency` | MHz | **readonly** — 탐촉자 등록값(`frequencyMHz`) 승계 |
| | `EFF. Diameter` | mm | **readonly** — 탐촉자 등록의 `진동자 유효 직경`과 동일 항목 (승계 방식 개발 확정) |
| | `Delay Velocity` | m/s | 직접 입력. 기본 2500 — 1순위 자료의 아크릴(웨지) 종파 음속은 2,730 m/s로 불일치 |
| `REF ECHO` | `Reference Type` | select | 기본 `FBH`. 전체 옵션은 개발 확정 |
| | `Ref Size` | mm | 기준 반사체 치수 |
| | `Record Ref` | 토글 | 기본 OFF |
| `REF CORR` | `Ref Atten` | dB/m | — |
| | `Ampl Correct` | dB | — |
| | `Delete Ref` | 버튼 | — |
| `MAT ATTN` | `Test Atten` | dB/m | 자료의 감쇠계수 단위는 dB/cm — 환산 필요 |
| | `Transfer Corr.` | dB/m | 용어 정의만 자료에 존재(`교정 시편과 시험체 간 표면 차이 보정`) · 산출식 없음 |
| `OFFSET` | `Offset 1` ~ `Offset 4` | 토글 + dB/m | 기본 `Offset 1`만 ON · OFF 행은 입력 비활성 |

- **스코프 한정 (중요)**: 보정값은 **교정 메타 + 수집 시점 Amp 정규화 기준**으로만 저장·사용한다.
  - 결함 **크기 판정·등급**은 **웹 서비스 책임**. 윈도우 앱은 판정하지 않음.
  - 윈도우 앱은 정규화된 Amp(또는 raw Amp + 보정 파라미터)를 MQTT로 송신, 웹이 sizing 수행.
- 교정 이력에는 보정 방식과 위 전 필드 값을 함께 기록한다.

## 4. DB 스키마 반영 (TB_SCAN_CONFIG.ProbeSettingsJson)

`ProbeSettingsJson` (채널/탐촉자별) 확장:

```json
{
  "serial": "PXT-2024-065",
  "material": "탄소강 (S355)",
  "soundSpeed": 5920,
  "frequencyMHz": 5.0,
  "elementSizeMm": 10.0,
  "elementShape": "round",        // round | square
  "waveType": "longitudinal",     // longitudinal | shear — 음속(V_L/V_S) 선택 기준 · 각도와 독립
  "nominalRefractionAngleDeg": 0.0, // 표면 법선 기준 · 0 = normal / >0 = angle beam
  "beamType": "normal",           // 파생: nominalRefractionAngleDeg==0 ? normal : angle
  "prf": { "auto": true, "value": 2000, "unit": "Hz" },
  "sensitivity": {
    "method": "tcg",                        // tcg | dgs  (dac 폐기)
    "purpose": "amplitude_normalization",   // 판정 아님 (웹 책임)
    "tcgPoints": [ { "tofUs": 20, "gainDb": 5 } ],
    "dgs": {
      "curveErsMm": 3.0,
      "mode": true,
      "effectiveDiameterMm": 9.6,       // readonly · 탐촉자 등록값에서 산출
      "delayVelocityMps": 2500,
      "refType": "FBH", "refSizeMm": 3.0, "refRecorded": false,
      "refAttenDbPerM": 0.0, "amplCorrectDb": 0.0,
      "testAttenDbPerM": 0.0, "transferCorrDbPerM": 0.0,
      "offsets": [ { "enabled": true, "valueDbPerM": 0.0 } ]
    }
  }
}
```

> 음속/영점/Gain/Gate 는 기존 `GateSettingsJson` / 교정값 구조 유지.

---

## 5. 검증 규칙

| 항목 | 규칙 |
|---|---|
| 탐촉자 주파수 | 0.5 ≤ f ≤ 20 MHz. 범위 밖 경고 |
| 진동자 크기 | 1 ≤ d ≤ 50 mm |
| 공칭 굴절각 | 0 ≤ θ < 90°. θ>0 → beamType=angle. 음속은 **파형 유형**으로 결정(각도로 추정하지 않음) |
| 입사각 역산 검증 | 아크릴→강 기준. **횡파** = 제1~제2 임계각 사이(27.5°~57.7°) / **종파** = 제1 임계각 미만(27.5° 이상이면 종파 미투과). 범위 밖 경고 |
| 재질 | `window.SOUND_SPEEDS` 5종 중 1 (탄소강 (S355) / 스테인레스 (304) / 스테인레스 (316L) / 알루미늄 (6061) / 티타늄 (Gr.2)) |
| PRF 수동 | 정수 ≥ 1 Hz. 자동 산출값 초과 시 ghost echo 경고 |
| 감도 보정 | `TCG` = 포인트 ≥ 2개 권장. `DGS` = 유효 진동자경·감쇠계수·기준 반사체 등가경 필수 |

---

## 6. 미해결 / 후속 (v20.1+)

- 경사각 채널 **횡파 음속** 자동 테이블 (현재 `SOUND_SPEEDS`는 종파만). 경사각 사용 본격화 시 도입
- 입사점(BIP) 교정 · 실제 굴절각 검증 단계 (NDT 표준 경사각 절차) — 이번 범위 제외
- `Reference Type` 전체 옵션 확정 (현재 `FBH`만 확인 · 자료에는 SDH·FBH·BW 3종이 약어로만 등재)
- `EFF. Diameter` 승계 방식 확정 — 탐촉자 등록값을 그대로 읽을지, 별도 산출식을 둘지
- 감쇠 3필드 `dB/m` ↔ 자료 기준 `dB/cm` 환산·검증 범위
- `Delay Velocity` 기본값 2500 ↔ 자료의 아크릴 2,730 m/s
- 진동자 사각형의 W×H 2-치수 입력 (현재 단일 크기)
