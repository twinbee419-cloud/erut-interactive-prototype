# 통합 알림 시스템 사양 (v1.0)

> 대상: 전 화면 공통 chrome (메뉴바 우측 알림 센터)
> 기획 버전: ERUT_ServiceFlow_FixedProbe.html v21.0
> 작성일: 2026-06-12
> 컴포넌트: `window.NotificationCenter` (Chrome.jsx) · `window.EIcon.Bell` (Icons.jsx)

---

## 1. 배경 / 결정

흩어진 알림(상태바 교정 배지 · [11] 측정 Critical 배너 · 진단 로그)을 **메뉴바 우측 종 아이콘 1곳**으로 통합. 보류 항목 ④(교정 임박 배지 위치)·⑤(측정 에러 능동 알림) 해소, ①(부착 이상) 부분 통합.

**사용자 결정 (4건)**
- 알림 센터 위치: **메뉴바 우측 종 아이콘**.
- 포괄 범위: **전체** (교정 + 측정 + 통신 + 부착).
- 긴급 측정 에러: **[11] 실시간 Critical 배너 유지 + 알림 센터 기록 병행**.
- 상태바 '교정 임박 N' 배지: **종으로 흡수·제거**.

---

## 2. 심각도 (severity) — 3단계

| 단계 | 토큰 | dot 색 | 정의 | 능동 전달 |
|---|---|---|---|---|
| **긴급** error | `--system-error` | 빨강 | 측정 차단급 — 만료 미교정·측정 데이터 손상·채널 미연결 | 모달/배너로 강제 인지 ([11] 배너, F6 차단 다이얼로그) + 센터 |
| **경고** caution | `--system-caution` | 주황 | 교정 임박(D-7/D-1/D-0)·부착력 약함·신호 약함 | (향후) toast + 센터 + 종 배지 |
| **정보** info | `--system-info` | 청록 | 통신 복구 등 FYI | 센터 기록 + 종 배지 |

> 정렬: 긴급 → 경고 → 정보. 미읽음 행은 `--surface-subtle-2` fill.

---

## 3. 알림 분류 (type) — 포괄 범위

| type | 소스 | 예시 |
|---|---|---|
| `calib` | 교정 주기 엔진 (D-7/D-1/D-0/만료/미교정) | "CH 04 교정 만료 · 측정 차단" |
| `measure` | 측정 에러 (E1xx) | "CH 12 채널 미연결 (E120)" |
| `comm` | MC↔미니PC / 미니PC↔서버 MQTT | "MQTT 재연결됨" |
| `attach` | 부착 상태 (약함/미부착) | "CH 22 부착력 약함" |

---

## 4. 데이터 모델 (`MOCK.notifications` → 실제 알림 큐)

```json
{
  "id": "n1",
  "severity": "error",        // error | caution | info
  "type": "calib",            // calib | measure | comm | attach
  "channel": 4,                // 관련 채널 (옵션)
  "title": "CH 04 교정 만료",
  "detail": "교정 주기 초과 · F6 측정 시작 차단됨",
  "actionLabel": "재교정",     // 옵션 — 있으면 액션 링크 표시
  "time": "방금",              // 표시용 상대시각 (실제: timestamp)
  "read": false
}
```

- 종 배지 카운트 = `notifications.filter(n => !n.read).length`.
- 액션 라우팅: `calib` → CalibrationExpiryAlertDialog/재교정 마법사 / `measure`·`attach` → 해당 채널 [2] 포커스 / `comm` → 진단·로그.

---

## 5. UI 구조 (NotificationCenter)

- **종 버튼** (메뉴바 우측, 48×40): `EIcon.Bell` + 미읽음 배지(error 색, pill). 열림 시 배경 `--surface-subtle-2` + emphasis 색.
- **드롭다운** (360px, 종 아래 우측 정렬): 헤더(알림 N · 모두 읽음) + 목록(maxHeight 320 스크롤) + 푸터(알림 정책 설정 →).
- **목록 행**: 심각도 dot + 제목 + 상대시각 + 상세 + 액션 링크.
- **드롭섀도우 미사용** (디자인 원칙) — `--border-high` border로 구분.
- 바깥 클릭 시 닫힘 (overlay).

---

## 6. 기존 요소와의 관계

| 기존 | v21.0 처리 |
|---|---|
| 상태바 '교정 임박 N' 배지 (v16.0) | **제거** → 종으로 흡수. StatusBar.calibrationAlert prop은 back-compat 무시. |
| CalibrationExpiryAlertDialog (v16.0) | **유지** — 종의 '재교정' 액션/앱 시작 시 진입으로 재사용. |
| [11] 측정 Critical 배너 (v8.8) | **유지** — in-context 즉시 인지 + 센터에도 기록. |
| 진단/로그 측정 에러 탭 (v17.0) | **유지** — 사후 상세 조회. 센터는 능동 알림. |
| [8] 설정 '상태바 알림 배지' 토글 | **'교정 알림 종 배지'로 의미 전환**. |

---

## 7. 미해결 / 후속 (v21.1+)

- **toast 시스템 확장**: 경고(caution) 능동 전달용. tone(error/caution/success/info) + 아이콘 + 큐. (현재 index.html toast는 단순 텍스트)
- 알림 보존/이력: 읽은 알림 보관 기간, 진단·로그와의 경계.
- 알림 소리 세분화 (긴급만 / 전체 / 음소거) — 현재 '측정 알림음' 단일 토글.
- 부착 이상(①) 집계 로직 — 64ch 부착 상태 → attach 알림 생성 규칙.
