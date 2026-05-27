# PRF 자동 계산 기능 — 개발 사양서

## 문서 정보

| 항목 | 내용 |
|---|---|
| **버전** | 1.0 |
| **작성일** | 2026-05-26 |
| **작성** | 기획팀 + NDT 도메인 검토 (Claude) |
| **적용 위치** | `SLIDE 14 [6] 검사 대상 관리` — 측정 파라미터 섹션 |
| **관련 산출물** | `ERUT_ServiceFlow_Analysis.html` v4.6+ |
| **장비 범위** | 고정형 (A-scan 단일 채널 측정) — 이동형은 추후 별도 사양 |

---

## 1. 기능 개요

ERUT 사용자(NDT 검사자)가 `[6] 검사 대상 관리` 페이지에서 **두께**와 **소재**를 입력하면, 해당 검사 대상에 최적화된 **PRF(Pulse Repetition Frequency · 펄스 반복 주파수) 권장값을 자동으로 계산해 적용**하는 기능.

### 사용자 시나리오

1. 검사자가 신규 검사 대상 등록 시 두께(예: 10mm) · 소재(예: 탄소강) 입력
2. "자동 계산" 토글이 ON 상태 (기본값)
3. ERUT가 즉시 권장 PRF 값을 계산해 input field에 표시 (예: 2,000 Hz)
4. 계산 근거 박스에 산출 과정 표시 (음속·최대 측정 거리 등)
5. 검사자가 수동 조정이 필요하면 토글 OFF → input 활성화 → 직접 입력

### 왜 자동 계산이 필요한가?

- PRF가 너무 높으면: 이전 펄스의 반사 신호가 다음 펄스와 겹쳐 **ghost echo**(허상) 발생 → 측정 오류
- PRF가 너무 낮으면: 검사 속도 저하 + 신호 평균화 효과 감소 → 정확도 ↓
- 두께·소재에 따라 최적 범위가 다름 → **검사자가 매번 계산할 수 없음** → 자동화 필요
- 산업용 NDT 장비(Olympus EPOCH 등)의 표준 패턴

---

## 2. 계산 원리

### 2-1. 물리 원리

초음파가 시편을 통과하는 시간:

```
왕복 시간 (Time of Flight, ToF) = 2 × 시편 두께 / 소재 음속
```

다음 펄스를 쏘기 전 이 왕복이 완전히 끝나야 함:

```
PRF의 주기 (1 / PRF) > 왕복 시간 × 안전 마진
```

### 2-2. 핵심 공식

```
PRF_max = c / (2 × T_max × N_safety)
```

- `c`: 소재의 종파 음속 (m/s)
- `T_max`: 검사 대상의 최대 측정 깊이 (m) — 두께 × 안전 배수
- `N_safety`: 안전 마진 계수 (본 구현 기본값: 2.0)

---

## 3. 입력·출력 인터페이스

### 3-1. 입력

| 필드 | 타입 | 범위 | 비고 |
|---|---|---|---|
| `thickness_mm` | number | 0.5 ~ 500 | 공칭 두께 (mm). 검사 대상의 "두께" 입력값 사용 |
| `material` | string | 아래 9종 + 사용자 정의 | "소재" 드롭다운 선택값 |
| `velocity_custom_m_s` | number (선택) | 1,000 ~ 10,000 | "기타 / 직접 입력" 선택 시만 사용. 사용자가 직접 입력한 음속 (m/s) |
| `board_max_prf` | number | 1,000 ~ 100,000 | MC보드의 최대 PRF 지원 한계 (Hz). 보드 사양에서 조회 |

### 3-2. 출력

| 필드 | 타입 | 범위 | 비고 |
|---|---|---|---|
| `recommended_prf_hz` | integer | 200 ~ 10,000 | 권장 PRF (Hz). 산업 표준 단계로 매핑된 값 |
| `calculation_details` | object | — | UI의 "계산 근거" 박스 표시용. 아래 구조 참고 |

```typescript
calculation_details: {
    velocity_m_s: number,          // 5920
    max_range_mm: number,          // 30
    max_tof_us: number,            // 10.14
    theoretical_max_prf_hz: number, // 49500
    board_max_prf_hz: number,      // 10000
    applied_safety_margin: number, // 2.0
    safety_multiplier_for_range: number  // 3 (두께 × 3 = max_range)
}
```

---

## 4. 계산 알고리즘 (의사코드)

```pseudo
function calculateAutoPRF(thickness_mm, material, velocity_custom_m_s, board_max_prf):

    # ── 1. 소재 음속 조회
    if material == "기타 / 직접 입력":
        velocity_m_s = velocity_custom_m_s
    else:
        velocity_m_s = MATERIAL_VELOCITY_TABLE[material]

    # ── 2. 최대 측정 거리 (안전 배수 3 적용)
    SAFETY_MULTIPLIER_FOR_RANGE = 3
    max_range_m = (thickness_mm * SAFETY_MULTIPLIER_FOR_RANGE) / 1000

    # ── 3. 최대 왕복 시간 (μs)
    max_tof_us = (2 * max_range_m) / velocity_m_s * 1_000_000

    # ── 4. 이론 PRF 최대값 (안전 마진 2배 적용)
    SAFETY_MARGIN = 2.0
    theoretical_max_prf_hz = 1_000_000 / (max_tof_us * SAFETY_MARGIN)

    # ── 5. 보드 한계 적용 (상한)
    upper_bound_hz = min(theoretical_max_prf_hz, board_max_prf)

    # ── 6. 산업 표준 단계 매핑 (상한 이하의 최대값)
    STANDARD_PRF_STEPS = [200, 500, 1000, 2000, 4000]
    recommended_prf_hz = max(
        step for step in STANDARD_PRF_STEPS
        if step <= upper_bound_hz
    )

    # ── 7. 결과 반환
    return {
        recommended_prf_hz: recommended_prf_hz,
        calculation_details: {
            velocity_m_s: velocity_m_s,
            max_range_mm: thickness_mm * SAFETY_MULTIPLIER_FOR_RANGE,
            max_tof_us: max_tof_us,
            theoretical_max_prf_hz: theoretical_max_prf_hz,
            board_max_prf_hz: board_max_prf,
            applied_safety_margin: SAFETY_MARGIN,
            safety_multiplier_for_range: SAFETY_MULTIPLIER_FOR_RANGE
        }
    }
```

### 상수 정의

| 상수 | 값 | 출처 / 근거 |
|---|---|---|
| `SAFETY_MULTIPLIER_FOR_RANGE` | **3** | 다중 반사·검출 거리 안전 보장. 두께 × 3 까지 측정 가능하도록 |
| `SAFETY_MARGIN` | **2.0** | 시간 도메인 안전 마진. ghost echo 완전 방지 |
| `STANDARD_PRF_STEPS` | **[200, 500, 1000, 2000, 4000]** | NDT 산업 표준 단계 (Olympus·GE 등 산업용 NDT 장비 기본 단계) |

---

## 5. 데이터 — 소재 음속 테이블

종파 음속 (Longitudinal Wave Velocity), 단위: m/s. ASTM E494 표준 음속 참조.

| 소재 키 | 표시 라벨 | 음속 (m/s) |
|---|---|---|
| `carbon_steel` | 탄소강 (Carbon Steel) | **5,920** |
| `ss_304` | 스테인레스강 304 | 5,790 |
| `ss_316l` | 스테인레스강 316L | 5,740 |
| `aluminum_6061` | 알루미늄 6061 | 6,320 |
| `titanium_gr2` | 티타늄 Gr.2 | 6,070 |
| `copper` | 구리 (Copper) | 4,660 |
| `inconel` | 니켈 합금 (Inconel) | 5,820 |
| `brass` | 황동 (Brass) | 4,430 |
| `cast_iron` | 주철 (Cast Iron) | 4,600 |
| `custom` | 기타 / 직접 입력 | — (사용자 입력) |

### JavaScript / C# 데이터 구조 예시

```javascript
const MATERIAL_VELOCITY_TABLE = {
    "carbon_steel":   { label: "탄소강 (Carbon Steel)",      velocity_m_s: 5920 },
    "ss_304":         { label: "스테인레스강 304",             velocity_m_s: 5790 },
    "ss_316l":        { label: "스테인레스강 316L",            velocity_m_s: 5740 },
    "aluminum_6061":  { label: "알루미늄 6061",                velocity_m_s: 6320 },
    "titanium_gr2":   { label: "티타늄 Gr.2",                 velocity_m_s: 6070 },
    "copper":         { label: "구리 (Copper)",              velocity_m_s: 4660 },
    "inconel":        { label: "니켈 합금 (Inconel)",         velocity_m_s: 5820 },
    "brass":          { label: "황동 (Brass)",               velocity_m_s: 4430 },
    "cast_iron":      { label: "주철 (Cast Iron)",            velocity_m_s: 4600 },
    "custom":         { label: "기타 / 직접 입력",            velocity_m_s: null }
};
```

---

## 6. UI 동작 시나리오

### 6-1. 정상 흐름

| # | 트리거 | 동작 |
|---|---|---|
| 1 | 검사 대상 신규 등록 진입 | "자동 계산" 토글 = **ON (기본값)** · PRF input = disabled · 빈 상태 |
| 2 | 두께 입력 (예: 10mm) | 즉시 재계산 — 단, 소재가 비어 있으면 "소재 선택 필요" 안내 |
| 3 | 소재 선택 (예: 탄소강) | 즉시 재계산 → PRF input에 "2,000" 표시 + 계산 근거 박스 갱신 |
| 4 | 두께 또는 소재 변경 | 즉시 재계산 (debounce 300ms 권장 — 연속 입력 시 부하 ↓) |
| 5 | "자동 계산" 토글 OFF | input enabled · 이전 값 유지 · 사용자가 자유롭게 수정 |
| 6 | "자동 계산" 토글 OFF → ON | 즉시 재계산 → 현재 두께·소재 기준 권장값으로 자동 복원 |
| 7 | 프리셋 적용 | 프리셋의 PRF 값으로 input override · 토글 자동 OFF · "프리셋 적용 중" 표시 |

### 6-2. 예외 / 경계 케이스

| 케이스 | 처리 |
|---|---|
| 두께 미입력 | 자동 계산 보류. 계산 근거 박스에 "두께 입력 필요" 안내 |
| 소재 미선택 | 자동 계산 보류. "소재 선택 필요" 안내 |
| 소재 = "기타 / 직접 입력" + 음속 미입력 | 음속 입력 필드 노출 + "음속 입력 필요" 안내 |
| 보드 최대 PRF가 200 Hz 미만 | "보드 사양 오류" — 시스템 관리자 알림 |
| 사용자 수동 입력값이 보드 최대 PRF 초과 | 경고 표시 — "보드 최대 PRF {N} Hz 초과" |
| 사용자 수동 입력값이 < 100 Hz | 경고 — "검사 효율 매우 낮음. 측정 시간 과다" |
| 자동 계산 결과가 표준 단계 중 최솟값(200 Hz)보다 작음 | 200 Hz 반환 + 안내 "두께·음속 한계로 최소 PRF 적용" |

---

## 7. 검증 규칙

### 7-1. 입력 유효성

```javascript
// 두께
thickness_mm: {
    type: number,
    min: 0.5,
    max: 500,
    required: true,
    step: 0.1
}

// 소재
material: {
    type: string,
    enum: ["carbon_steel", "ss_304", "ss_316l", "aluminum_6061",
           "titanium_gr2", "copper", "inconel", "brass", "cast_iron", "custom"],
    required: true
}

// 사용자 정의 음속 (custom 선택 시)
velocity_custom_m_s: {
    type: number,
    min: 1000,
    max: 10000,
    required_if: "material === custom"
}

// PRF 수동 입력 (토글 OFF 시)
prf_hz_manual: {
    type: integer,
    min: 100,
    max: 100000,
    step: 1
}
```

### 7-2. 출력 보장

- `recommended_prf_hz`는 항상 `STANDARD_PRF_STEPS` 배열 중 한 값
- `recommended_prf_hz <= board_max_prf`
- 계산 불가 시 `null` 반환 + 사유 로깅

---

## 8. 예시 계산 (단위 테스트용 케이스)

### 케이스 1: 탄소강 배관, 두께 10mm
| 변수 | 값 |
|---|---|
| 입력 | thickness=10mm, material=carbon_steel |
| 음속 | 5,920 m/s |
| max_range | 30mm |
| max_tof | 10.14 μs |
| 이론 PRF_max | 49,310 Hz |
| 보드 한계 (가정) | 10,000 Hz |
| 상한 | 10,000 Hz |
| **출력 PRF** | **4,000 Hz** (산업 단계 매핑) |

> 주의: 산업 관행 권장표(15mm 이하 = 2,000 Hz)와 알고리즘 결과(4,000 Hz)가 다를 수 있음.
> 두 가지 정책 중 선택 가능:
> - **(A) 알고리즘 결과 그대로** (이론 안전 마진 충족)
> - **(B) 관행 권장표를 추가 제약으로 적용** (보수적, 산업 표준 부합)
>
> **본 사양은 (A) 알고리즘 결과를 기본으로 채택**. 추후 검증 단계에서 (B) 도입 가능.

### 케이스 2: 스테인레스 압력 용기, 두께 25mm
| 변수 | 값 |
|---|---|
| 입력 | thickness=25mm, material=ss_304 |
| 음속 | 5,790 m/s |
| max_range | 75mm |
| max_tof | 25.9 μs |
| 이론 PRF_max | 19,300 Hz |
| 보드 한계 | 10,000 Hz |
| 상한 | 10,000 Hz |
| **출력 PRF** | **4,000 Hz** |

### 케이스 3: 구리 두께 30mm (음속 느림)
| 변수 | 값 |
|---|---|
| 입력 | thickness=30mm, material=copper |
| 음속 | 4,660 m/s |
| max_range | 90mm |
| max_tof | 38.6 μs |
| 이론 PRF_max | 12,950 Hz |
| 보드 한계 | 10,000 Hz |
| 상한 | 10,000 Hz |
| **출력 PRF** | **4,000 Hz** |

### 케이스 4: 매우 두꺼운 탄소강, 두께 100mm
| 변수 | 값 |
|---|---|
| 입력 | thickness=100mm, material=carbon_steel |
| 음속 | 5,920 m/s |
| max_range | 300mm |
| max_tof | 101.4 μs |
| 이론 PRF_max | 4,930 Hz |
| 보드 한계 | 10,000 Hz |
| 상한 | 4,930 Hz |
| **출력 PRF** | **4,000 Hz** |

### 케이스 5: 초후막, 두께 250mm
| 변수 | 값 |
|---|---|
| 입력 | thickness=250mm, material=carbon_steel |
| 음속 | 5,920 m/s |
| max_range | 750mm |
| max_tof | 253.4 μs |
| 이론 PRF_max | 1,972 Hz |
| 상한 | 1,972 Hz |
| **출력 PRF** | **1,000 Hz** (산업 단계 매핑 — 1972 이하 최대값) |

---

## 9. POC 단계 한계 및 향후 확장

### 본 사양의 적용 범위 (POC)
- 고정형 장비 · A-scan 단일 채널 · 일반 두께 측정
- 표준 검사 (KS B 0817 일반 항목)
- 산업 표준 5단계 PRF (200/500/1k/2k/4k)

### 향후 확장 (정밀 검사 모드)
다음은 본 알고리즘 V1.0에서 **다루지 않음** — V2.0 이상에서 검토:
- DAC / TCG 곡선 연계 (거리 보정)
- 탐촉자 주파수와의 관계 (특히 다중 반사 분석 시)
- 표준별 미세 차이 (ASME Sec.V vs KS B 0817 vs API 510)
- 다중 채널 동시 측정 시 채널 간 간섭
- 64ch+ Phased Array UT (현재는 일반 UT 가정)

→ POC 단계에서 정밀 검사는 검사자가 **수동 override**로 처리.

---

## 10. 관련 화면 / 컴포넌트

### 10-1. 영향 화면
- `SLIDE 14 [6] 검사 대상 관리` — 측정 파라미터 섹션의 PRF 항목
- `SLIDE 14 [6]` 표준 프리셋 카드 — PRF 표기 (예: "PRF 2,000 Hz")
- `상태바` 전 화면 공통 — "PRF : 2,000 Hz" 실시간 표시

### 10-2. UI 컴포넌트
- `.erut-field` (input · 두께·PRF)
- `.erut-select` (소재 드롭다운)
- `.erut-toggle` (자동 계산 ON/OFF)
- 계산 근거 박스 — inline div (style: `var(--surface-base)` + `var(--border-low)`)

### 10-3. 데이터 흐름

```
[6] 검사 대상 폼
    │
    ├─ 두께 input ──┐
    ├─ 소재 select ─┼─→ calculateAutoPRF() ──→ PRF input + 계산 근거
    └─ 자동 토글 ───┘
                      ↓
                  검사 대상 모델 저장
                      ↓
              [11] 실시간 스캔 (PRF 실제 적용)
                      ↓
                  상태바 표시
```

---

## 11. 테스트 케이스 (개발팀용)

### 11-1. 단위 테스트 (calculateAutoPRF 함수)

```javascript
describe("calculateAutoPRF", () => {

    test("탄소강 10mm → 권장 PRF 반환", () => {
        const result = calculateAutoPRF(10, "carbon_steel", null, 10000);
        expect(result.recommended_prf_hz).toBeOneOf([2000, 4000]);
        expect(result.calculation_details.velocity_m_s).toBe(5920);
    });

    test("두께 0.5mm → 최댓값 4000Hz", () => {
        const result = calculateAutoPRF(0.5, "carbon_steel", null, 10000);
        expect(result.recommended_prf_hz).toBe(4000);
    });

    test("두께 250mm → 1000Hz (긴 ToF 반영)", () => {
        const result = calculateAutoPRF(250, "carbon_steel", null, 10000);
        expect(result.recommended_prf_hz).toBe(1000);
    });

    test("custom 소재 → velocity_custom_m_s 사용", () => {
        const result = calculateAutoPRF(20, "custom", 5000, 10000);
        expect(result.calculation_details.velocity_m_s).toBe(5000);
    });

    test("보드 한계가 낮으면 상한 적용", () => {
        const result = calculateAutoPRF(10, "carbon_steel", null, 800);
        expect(result.recommended_prf_hz).toBe(500);
    });
});
```

### 11-2. 통합 테스트 (UI 인터랙션)

| ID | 시나리오 | 기대 결과 |
|---|---|---|
| IT-01 | 자동 토글 ON 상태에서 두께 입력 | PRF input 자동 갱신 |
| IT-02 | 두께·소재 모두 입력 후 토글 OFF | PRF input enabled · 값 유지 |
| IT-03 | 토글 OFF → 사용자가 임의 값 입력 | 값 그대로 유지 (자동 재계산 X) |
| IT-04 | 토글 OFF → ON 전환 | 자동 재계산 + 값 복원 |
| IT-05 | 프리셋 적용 | 토글 자동 OFF + 프리셋 PRF 값 적용 |
| IT-06 | 두께를 0으로 입력 | PRF input 비움 + 안내 표시 |
| IT-07 | 소재 = custom 선택 | 음속 입력 필드 노출 |

---

## 12. 참고 자료

- **ASTM E494** — 초음파 펄스 에코법에서의 음속 측정 표준
- **KS B 0817** — 한국 산업 표준 (초음파 탐상 검사)
- **ASME Sec.V** — 미국 기계 학회 비파괴 검사 표준
- **Olympus EPOCH Series Manual** — Auto PRF 산업 표준 패턴 참고
- **AOS / TPAC UT 보드 사양서** (개발팀이 별도 확인 필요 — 보드 최대 PRF 결정)

---

## 13. 변경 이력

| 버전 | 일자 | 변경 사항 |
|---|---|---|
| 1.0 | 2026-05-26 | 최초 작성. 고정형 장비 · 산업 표준 5단계 PRF 매핑 채택 |

---

## 14. 미해결 / 사용자 확정 필요 사항

| 항목 | 사용자 확정 필요 |
|---|---|
| MC보드 최대 PRF 지원치 | AOS/TPAC 보드 사양서 확인 (가정값 10,000 Hz) |
| 정밀 검사 모드 도입 시점 | V2.0 사양 별도 작성 시점 결정 |
| 산업 단계 외 값 허용 정책 | 수동 입력 시 표준 단계만 허용 vs 자유 입력 |
