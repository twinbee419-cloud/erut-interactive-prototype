# ERUT 에러 코드 체계 v1.0

> 작성: 2026-06-09 · 적용 화면: [2] 장비 상세 → 진단/로그 모달 → 에러 로그 탭
> 관련 사양: `Session_Autosave_Spec_v1.0.md` · `PRF_Auto_Calculation_Spec_v1.0.md`

---

## 1. 분류 체계

| 범위 | 카테고리 | 설명 |
|---|---|---|
| **E001~E099** | 하드웨어 (MC보드) | 펄서·리시버·ADC·온도·전원 등 보드 자체 이상 |
| **E100~E199** | 측정 (Acquisition) | 데이터 수집 중 발생하는 신호 품질·범위·동기화 문제 |
| **E200~E299** | 채널 / 센서 | 개별 채널의 부착·교정·응답 이상 |
| **E300~E399** | 저장 (Storage) | 자동 저장·디스크 I/O·DB·파일 시스템 이상 |
| **E400~E499** | 네트워크 / 통신 | MC보드 연결·MQTT 발행·timeout |
| **E500~E599** | 사용자 워크플로우 | 교정 미통과 측정 시도·권한 부족 등 운영 정책 위반 |
| **E900~E999** | 예외 / 알 수 없음 | 위 분류에 해당하지 않는 예외 |

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

### E2xx — 채널 / 센서

| 코드 | 심각도 | 메시지 | 권장 조치 |
|---|---|---|---|
| E201 | Critical | CH X 응답 없음 (5+ 패킷 timeout) | 케이블·커넥터 확인 → 미부착 가능성 |
| E202 | Warning | CH X 교정 만료 (마지막 교정 X일 전, 권장 180일) | 측정 시작 전 재교정 |
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

### E4xx — 네트워크 / 통신

| 코드 | 심각도 | 메시지 | 권장 조치 |
|---|---|---|---|
| E401 | Critical | MC보드 연결 끊김 | 케이블·라우터 확인 · 재연결 시도 |
| E402 | Warning | MC보드 응답 지연 (응답 X ms / 임계 200 ms) | 네트워크 부하 확인 |
| E403 | Warning | 패킷 손실률 임계 초과 (X% / 임계 1%) | 케이블 품질·라우터 확인 |
| E404 | Critical | MQTT 브로커 연결 실패 | [4-2] MQTT 설정 확인 |
| E405 | Warning | MQTT 발행 지연 (X ms / 임계 100 ms) | 브로커 부하 확인 |
| E406 | Info  | IP 주소 변경 감지 (DHCP) | 자동 재연결 · 로그 기록만 |

### E5xx — 사용자 워크플로우

| 코드 | 심각도 | 메시지 | 권장 조치 |
|---|---|---|---|
| E501 | Warning | 교정 미통과 채널로 측정 시작 시도 (CH X, Y개) | 채널 commissioning 완료 후 재시작 |
| E502 | Warning | 측정 중 채널 추가 시도 (현재 세션 종료 후 가능) | F7 측정 중지 → 채널 추가 |
| E503 | Info  | 자동 저장 주기 단축 권장 (현재 X분 → 30초) | [8] 설정 → 자동 저장에서 조정 |
| E504 | Warning | 권한 부족 (요청: ASNT Lv.II / 현재: Lv.I) | 상위 검사자에게 위임 또는 권한 요청 |

### E9xx — 예외

| 코드 | 심각도 | 메시지 | 권장 조치 |
|---|---|---|---|
| E901 | Critical | 처리되지 않은 예외 (스택 trace 첨부) | 로그 export 후 개발팀 전달 |
| E902 | Warning | 알 수 없는 응답 코드 (MC보드 → ERUT) | 펌웨어 호환성 확인 |

---

## 4. 로그 데이터 구조

```ts
interface ErrorLogEntry {
  id: string;                    // UUID
  timestamp: string;             // ISO 8601 + ms
  code: string;                  // "E101"
  category: "hw" | "acq" | "channel" | "storage" | "network" | "workflow" | "exception";
  severity: "critical" | "warning" | "info";
  channel?: number;              // 1~64 (해당하는 경우)
  sessionId?: string;            // "SES-2026-047"
  message: string;               // 한국어 요약 (테이블 메시지)
  detail: string;                // 한국어 상세 (확장 row)
  recommendation: string;        // 한국어 권장 조치
  resolved: boolean;             // 사용자 "해결됨" 표시 여부
  resolvedAt?: string;
  occurredCount: number;         // 같은 세션 내 동일 코드 발생 횟수
  context?: Record<string, any>; // 측정값·임계값 등 코드별 추가 정보
}
```

---

## 5. 보관 정책

- **기본 보관 기간**: 90일 (Critical/Warning), 30일 (Info)
- **저장 위치**: SQLite `TB_ERROR_LOG` 테이블 (project.db) + JSON 백업 `Logs/{YYYY-MM}/errors.jsonl`
- **변경 가능**: [8] 설정 → 자동 저장에서 사용자 조정 (v1.1 예정)
- **자동 삭제**: 매일 자정 cron으로 만료된 항목 정리 + WAL checkpoint

---

## 6. UI 표시 규칙

| 위치 | 표시 방식 | 동작 |
|---|---|---|
| **상태바 LED + 카운터** | 미해결 Critical 1+ → 빨간 깜박임 + 카운트 | 클릭 시 진단/로그 모달 → 에러 로그 탭 자동 열기 |
| **[11] 실시간 Critical 배너** | Critical 발생 즉시 슬라이드 다운 알림 | "보기 →" 클릭 시 같은 동작 |
| **진단/로그 모달 에러 탭 badge** | 에러 로그 탭 라벨 우측에 미해결 Critical 수 표시 | 현재 메인 mockup에 이미 적용 (`badge: 2`) |
| **에러 코드 검색 (Cmd+E)** | 코드 직접 입력 → 해당 에러 위치로 점프 | 추후 (v1.1) |

---

## 7. 향후 확장 (v1.1+)

- 에러 코드별 KB 링크 (사내 위키 또는 ERUT 도움말 페이지)
- 에러 발생 통계 대시보드 (ERUT 웹 서비스)
- 사용자 정의 알림 룰 (특정 코드 발생 시 메일·슬랙)
- ML 기반 에러 패턴 예측 (반복 발생 시 사전 경고)
