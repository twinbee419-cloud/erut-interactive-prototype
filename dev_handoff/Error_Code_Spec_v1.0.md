# ERUT 에러 코드 체계 v2.0 (v17.0 정합)

> 작성: 2026-06-09 (v1.0) → 2026-06-11 (v2.0)
> 적용 화면: [2] 장비 상세 → 진단/로그 모달 → **측정 에러 / 통신 로그** 탭
> 관련 사양: `PRF_Auto_Calculation_Spec_v1.0.md`
> 파일명은 호환성 유지 위해 `_v1.0.md` 유지. 본문은 v2.0 기준.

## v2.0 변경 요약 (2026-06-11, 메인 기획 v17.0 정합)

- 카테고리 재구성: E4xx 네트워크 폐기 → **통신 3구간 분리** (E5xx 탐촉자↔MC / E6xx MC↔미니PC / E7xx 미니PC↔서버 MQTT)
- 구 E5xx 워크플로우 → **E8xx로 이동** (E5xx 통신과 충돌 방지)
- 로그 데이터 구조 변경: `resolved`/`resolvedAt`/`message`/`detail`/`recommendation` 폐기 (이벤트 기반 → 수치 기반 raw data). `amp`/`tof`/`thickness`/`latency`/`packetLoss`/`dataRate` 추가
- UI 표시: 인라인 펼침 + '상세 →' 버튼 폐기 → 단순 시계열 테이블만
- '비고' 컬럼 폐기 (코드만 표시. 설명은 본 spec 참조)
- 명칭 정합: '센서' → '탐촉자' (v15.3 정합)

---

## 1. 분류 체계 (v2.0)

| 범위 | 카테고리 | 설명 | 진단/로그 탭 |
|---|---|---|---|
| **E001~E099** | 하드웨어 (MC보드) | 펄서·리시버·ADC·온도·전원 등 보드 자체 이상 | 하드웨어 진단 |
| **E100~E199** | 측정 (Acquisition) | 데이터 수집 중 발생하는 신호 품질·범위·동기화 문제 | 측정 에러 |
| **E200~E299** | 채널 / 탐촉자 | 개별 채널의 부착·교정·응답 이상 | 측정 에러 |
| **E300~E399** | 저장 (Storage) | 자동 저장·디스크 I/O·DB·파일 시스템 이상 | 측정 에러 |
| ~~E400~E499~~ | ~~네트워크~~ | **v2.0에서 폐기** (3구간으로 분리) | — |
| **E500~E599** | 통신: 탐촉자 ↔ MC | A-scan raw 수신 · ADC sync · 채널 응답 timeout | 통신 로그 |
| **E600~E699** | 통신: MC ↔ 미니 PC | LAN 연결 · TCP 패킷 손실 · 미니 PC 처리 지연 | 통신 로그 |
| **E700~E799** | 통신: 미니 PC ↔ 서버 MQTT | MQTT 브로커 연결 · 발행 지연 · IP 변경 | 통신 로그 |
| **E800~E899** | 사용자 워크플로우 | 교정 미통과 측정 시도·권한 부족 등 운영 정책 위반 (구 E5xx 이동) | 측정 에러 |
| **E900~E999** | 예외 / 알 수 없음 | 위 분류에 해당하지 않는 예외 | 측정 에러 |

---

## 2. 심각도 정책

| 심각도 | 의미 | UI 표시 | 측정 영향 |
|---|---|---|---|
| **Critical** | 즉시 조치 필요. 데이터 신뢰성 손상 가능 | `--system-error` badge | 측정 자동 일시정지 + 다이얼로그 |
| **Warning** | 경고. 측정은 계속되나 검토 필요 | `--system-caution` badge | 측정 계속 + 로그 기록 |
| **Info** | 정보성. 정상 동작 중 참고 | `--system-info` badge | 영향 없음 |

> 같은 코드라도 발생 빈도·맥락에 따라 심각도가 상승할 수 있다(예: E101 1회 = Warning, 5회 연속 = Critical).

---

## 3. 핵심 코드 카탈로그 (v1.0 — 41개)

### E0xx — 하드웨어 (MC보드)

| 코드 | 심각도 | 메시지 | 권장 조치 |
|---|---|---|---|
| E001 | Critical | 펄서 출력 전압 이상 (실측 X V / 기대 Y V) | MC보드 전원 재인가 → 미해결 시 하드웨어 점검 |
| E002 | Critical | 리시버 게인 회로 이상 | MC보드 재시작 → 펌웨어 확인 |
| E003 | Critical | ADC 동기화 실패 | 케이블·커넥터 점검 |
| E004 | Warning | MC보드 온도 임계 초과 (현재 X℃ / 임계 65℃) | 환기 확인 · 측정 일시 중단 권장 |
| E005 | Warning | 펌웨어 버전 불일치 (보드 X.X.X / 권장 Y.Y.Y) | 펌웨어 업데이트 |

### E1xx — 측정 (Acquisition)

| 코드 | 심각도 | 메시지 | 권장 조치 |
|---|---|---|---|
| E101 | Critical | CH X ADC saturation (입력 신호 over-range, 5+ 패킷 연속) | Gain 감소 또는 Gate Threshold 상향 |
| E102 | Warning | CH X 신호 SNR 저하 (X dB / 임계 12 dB) | 커플런트 재도포 · Gain 조정 |
| E103 | Warning | PRF 한계 초과 ghost echo 감지 | PRF 단계 하향 또는 두께·소재 재확인 |
| E104 | Warning | Gate A 미검출 패킷 비율 X% (임계 5%) | Gate 위치·폭 재검토 |
| E105 | Info  | 측정 데이터 일시 spike (1회성 노이즈) | 1회 발생 시 무시 가능 |

### E2xx — 채널 / 탐촉자

| 코드 | 심각도 | 메시지 | 권장 조치 |
|---|---|---|---|
| E201 | Critical | CH X 응답 없음 (5+ 패킷 timeout) | 케이블·커넥터 확인 → 미부착 가능성 |
| E202 | Warning | CH X 교정 만료 (마지막 교정 X일 전, 주기 Y일 초과) | 측정 시작 전 재교정 |
| E203 | Warning | CH X 부착력 저하 감지 (커플런트 재도포 권장) | 자석 부착 확인 + 커플런트 재도포 |
| E204 | Warning | CH X 영점 drift 감지 (기준 대비 X μs) | 영점 재교정 |
| E205 | Info  | CH X SN 정보 누락 | 채널 commissioning에서 SN 입력 |

### E3xx — 저장 (Storage)

| 코드 | 심각도 | 메시지 | 권장 조치 |
|---|---|---|---|
| E301 | Warning | 자동 저장 일시 지연 (디스크 I/O X ms / 임계 8 ms) | 디스크 부하 확인 · 백그라운드 작업 중단 |
| E302 | Critical | 자동 저장 실패 (3회 재시도 후) | 데이터 폴더 권한·용량 확인 |
| E303 | Critical | 디스크 용량 부족 (남은 용량 X MB / 권장 500 MB) | 오래된 세션 삭제 · 데이터 폴더 이동 |
| E304 | Warning | SQLite WAL 파일 비대 (X MB / 임계 100 MB) | WAL checkpoint 강제 실행 |
| E305 | Critical | C-SCAN 바이너리 파일 손상 (CRC 불일치) | 백업 복구 · 세션 재실행 권장 |

### E5xx — 통신: 탐촉자 ↔ MC (v2.0 신규)

| 코드 | 심각도 | 메시지 | 권장 조치 |
|---|---|---|---|
| E501 | Critical | CH X A-scan raw 패킷 timeout (5+ 연속) | 커넥터·케이블 점검 · 탐촉자 부착 확인 |
| E502 | Warning | CH X ADC 동기화 jitter (X μs / 임계 0.5 μs) | 케이블 차폐·접지 확인 |
| E503 | Warning | 탐촉자 채널 패킷 손실률 X% (임계 0.5%) | 커넥터 접촉 확인 |
| E504 | Info  | 탐촉자 채널 데이터율 안정 (X msg/s) | 정상 동작 — 기록만 |

### E6xx — 통신: MC ↔ 미니 PC (v2.0 신규, 구 E4xx 일부)

| 코드 | 심각도 | 메시지 | 권장 조치 |
|---|---|---|---|
| E601 | Critical | MC ↔ 미니 PC LAN 연결 끊김 | 케이블·라우터 확인 · 재연결 시도 |
| E602 | Warning | MC ↔ 미니 PC 응답 지연 (응답 X ms / 임계 50 ms) | 네트워크 부하·미니 PC CPU 확인 |
| E603 | Warning | TCP 패킷 손실률 임계 초과 (X% / 임계 1%) | 케이블 품질·라우터 확인 |
| E604 | Warning | 미니 PC 처리 큐 적체 (depth X / 임계 1000) | 미니 PC 부하 분산 · 백그라운드 작업 중단 |
| E605 | Info  | MC IP 주소 변경 감지 (DHCP) | 자동 재연결 · 로그 기록만 |

### E7xx — 통신: 미니 PC ↔ 서버 MQTT (v2.0 신규, 구 E4xx 일부)

| 코드 | 심각도 | 메시지 | 권장 조치 |
|---|---|---|---|
| E701 | Critical | MQTT 브로커 연결 실패 | [4-2] MQTT 설정 확인 |
| E702 | Warning | MQTT 발행 지연 (X ms / 임계 100 ms) | 브로커 부하 확인 |
| E703 | Warning | MQTT QoS 1 ACK 누락 (재발행 X회) | 브로커·인터넷 회선 점검 |
| E704 | Warning | MQTT 토픽 발행 실패 (X 회) | 토픽 권한·브로커 설정 확인 |
| E705 | Info  | MQTT 자동 재연결 성공 (X초 후) | 정상 복구 — 기록만 |

### E8xx — 사용자 워크플로우 (v2.0 — 구 E5xx 이동)

| 코드 | 심각도 | 메시지 | 권장 조치 |
|---|---|---|---|
| E801 | Warning | 교정 미통과 채널로 측정 시작 시도 (CH X, Y개) | 채널 commissioning 완료 후 재시작 |
| E802 | Warning | 측정 중 채널 추가 시도 (현재 세션 종료 후 가능) | F7 측정 중지 → 채널 추가 |
| E803 | Info  | 자동 저장 주기 단축 권장 (현재 X분 → 30초) | [8] 설정 → 자동 저장에서 조정 |
| E804 | Warning | 권한 부족 (요청: ASNT Lv.II / 현재: Lv.I) | 상위 검사자에게 위임 또는 권한 요청 |

### E9xx — 예외

| 코드 | 심각도 | 메시지 | 권장 조치 |
|---|---|---|---|
| E901 | Critical | 처리되지 않은 예외 (스택 trace 첨부) | 로그 export 후 개발팀 전달 |
| E902 | Warning | 알 수 없는 응답 코드 (MC보드 → ERUT) | 펌웨어 호환성 확인 |

---

## 4. 로그 데이터 구조 (v2.0 — 수치 기반 raw data)

### 측정 에러 로그 (E1xx·E2xx·E3xx·E8xx·E9xx)

```ts
interface MeasurementErrorEntry {
  id: string;             // UUID
  timestamp: string;      // ISO 8601 + ms
  code: string;           // "E101"
  channel?: number;       // 1~64
  sessionId?: string;     // "SES-2026-047"
  // v2.0: 수치 기반 raw data — page state에서 그대로 저장
  amp?: number;           // % FSH (해당하는 경우)
  tof?: number;           // μs
  thickness?: number;     // mm
}
```

### 통신 로그 (E5xx·E6xx·E7xx)

```ts
interface CommLogEntry {
  id: string;
  timestamp: string;
  link: "probe-mc" | "mc-pc" | "pc-mqtt";  // 3구간
  code?: string;                            // 에러 시에만 (정상은 null)
  // v2.0: row 단위 raw data
  latency: number;        // ms (응답 지연)
  packetLoss: number;     // % (패킷 손실률)
  dataRate: number;       // msg/s (초당 메시지 수)
  status: "ok" | "warn" | "error";  // 통신 상태 (row 필드, page state 정합)
}
```

### 교정 이력 (별도 — 에러 로그 아님)

```ts
interface CalibrationHistoryEntry {
  id: string;
  timestamp: string;
  channel: number;
  velocity: number;       // m/s (음속)
  zero: number;           // μs (영점)
  wedgeAngle: number;     // ° (Wedge 각도)
  gain: number;           // dB
  testpiece: string;      // "IIW V1 (25mm · 탄소강)" 등
  result: "pass" | "warn" | "fail";  // 시편 확인 결과 (state 기반)
  resultDetail?: string;  // 한국어 (예: "표준 음속 -1.0%")
}
```

### v1.0 → v2.0 폐기 필드

- `category` — 새 분류 (1.섹션)로 추정 가능, 명시 불필요
- `severity` — 코드별 spec에서 정의, row에 중복 불필요
- `message`/`detail`/`recommendation` — 자유 텍스트 폐기. UI는 본 spec 참조 매핑
- `resolved`/`resolvedAt` — 이벤트 기반 해결/미해결 폐기 (수치 기반으로 전환)
- `occurredCount` — 시계열 raw data에서 GROUP BY로 추론 가능

---

## 5. 보관 정책 (v2.0 그대로 유지)

- **기본 보관 기간**: 90일 (v17.0 사용자 결정 — 유지)
- **저장 위치**: SQLite 테이블 분리 — `TB_MEASUREMENT_ERROR` / `TB_COMM_LOG` / `TB_CALIBRATION_HISTORY` (project.db) + JSON 백업 `Logs/{YYYY-MM}/{type}.jsonl`
- **수치 raw data 누적량**: 검사자당 ~3MB/월 (시계열 raw data 증가). 90일 = ~10MB
- **변경 가능**: [8] 설정 → 자동 저장 (v1.1 예정)
- **자동 삭제**: 매일 자정 cron으로 만료된 항목 정리 + WAL checkpoint

---

## 6. UI 표시 규칙 (v2.0 — 인라인 펼침 폐기)

| 위치 | 표시 방식 | 동작 |
|---|---|---|
| **상태바 교정 임박 배지** | 7일 이내 또는 만료 채널 N개 시 caution 색 표시 (v16.0+) | 클릭 시 알림 다이얼로그 |
| **[11] 실시간 Critical 배너** | Critical 발생 즉시 슬라이드 다운 알림 (v9.x — 유지 여부 검토 보류) | "보기 →" 클릭 시 진단/로그 모달 |
| **진단/로그 모달 측정 에러 탭 badge** | 측정 에러 탭 라벨 우측에 미해결 Critical 수 표시 | 현재 메인 mockup에 적용 (`badge: 2`) |
| ~~인라인 펼침 (행 클릭)~~ | **v17.0에서 폐기** — 단순 시계열 테이블만 | — |
| ~~'상세 →' 버튼~~ | **v17.0에서 폐기** | — |
| ~~해결됨/무시 버튼~~ | **v17.0에서 폐기** (이벤트 기반 → 수치 기반 전환) | — |

---

## 7. 향후 확장 (v1.1+)

- 에러 코드별 KB 링크 (사내 위키 또는 ERUT 도움말 페이지)
- 에러 발생 통계 대시보드 (ERUT 웹 서비스)
- 사용자 정의 알림 룰 (특정 코드 발생 시 메일·슬랙)
- ML 기반 에러 패턴 예측 (반복 발생 시 사전 경고)
