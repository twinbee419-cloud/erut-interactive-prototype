# PC 정보 등록 및 UUID 식별 — 개발 사양서

## 문서 정보

| 항목 | 내용 |
|---|---|
| **버전** | 1.0 |
| **작성일** | 2026-06-11 |
| **작성** | 기획팀 + NDT 도메인 검토 (Claude) |
| **적용 위치** | `SLIDE 18 [8] 설정 모달 — PC 정보 카테고리` (6번째). [18] 보고서 / [7] 검사 이력 / [3] 진단/로그 통신 탭 / 상태바에도 반영 |
| **관련 산출물** | `ERUT_ServiceFlow_FixedProbe.html` v19.0+ |
| **합의** | 설정 화면에 PC 별칭(alias) 입력 항목 추가. 기술적 UUID 생성·자동 메타 수집은 개발팀 담당 |

---

## 1. 기능 개요

미니 PC를 **탐촉자·MC 보드와 동일한 자산 단위**로 관리. UUID 기반 고유 식별자로 서버에 PC 정보 전송하고, alias로 사용자가 직관적으로 식별 가능.

### 왜 미니 PC 자산 관리가 필요한가? (NDT 도메인)

| # | 근거 | 영향 |
|---|---|---|
| 1 | 다중 사이트 운영 시 PC 식별 | 어떤 현장 PC가 어느 데이터를 보냈는지 추적 |
| 2 | 측정 데이터 추적성 (ASNT 표준) | 보고서에 측정 PC 명시 → 책임 소재 명확 |
| 3 | MQTT 토픽 라우팅 | `erut/{pc_uuid}/...` → 서버에서 다중 PC 동시 수신 |
| 4 | 장애 진단 | 어느 PC에서 에러 발생했는지 정확히 식별 |
| 5 | ERUT 버전 관리 | PC별 ERUT/펌웨어 버전 추적 |

### 현재 ERUT 자산 단위와의 위치

| 자산 | 식별자 | alias | 관리 위치 |
|---|---|---|---|
| 탐촉자 (Probe) | S/N (PXT-2024-001) | — | [4-3-1] 채널 commissioning |
| MC 보드 | 사용자 입력 ID (MCuF-001) | "주력 장비" | [4-1] MC보드 추가/편집 |
| **미니 PC** | UUID (자동 생성) | 사용자 입력 | **[8] PC 정보 카테고리 (v19.0 신규)** |

---

## 2. UUID 생성 사양

### 2-1. 생성 시점

| 시점 | 동작 |
|---|---|
| **첫 실행 시** | UUID v4 (랜덤) 생성 → `settings.db.TB_PC_INFO`에 저장 |
| **앱 시작 시 (2회차+)** | 기존 UUID 로드 (변경 없음) |
| **OS 재설치 시** | DB가 초기화되므로 새 UUID 생성됨 (의도된 동작) |
| **PC 교체 시** | 마찬가지로 새 UUID 생성됨 |
| **사용자 수동 재생성** | **불가** (서버 식별 무결성 보장) |

### 2-2. UUID 형식

```
RFC 4122 UUID v4 (랜덤 기반)
형식: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx (36자)
예시: a7f3c2e8-9b4d-4c1f-8e5a-2d6b9f8c1a3e
```

### 2-3. 생성 의사코드 (.NET)

```csharp
public static class PcInfoService
{
    public static PcInfo GetOrCreate()
    {
        var existing = LoadFromSettingsDb();
        if (existing != null) return RefreshAutoMeta(existing);

        var newPc = new PcInfo
        {
            Uuid = Guid.NewGuid().ToString("D"),  // v4 UUID
            Alias = $"ERUT-PC-{DateTime.Now:yyyyMMdd-HHmmss}",  // 기본 alias
            FirstRegistered = DateTime.Now,
        };
        SaveToSettingsDb(RefreshAutoMeta(newPc));
        return newPc;
    }

    private static PcInfo RefreshAutoMeta(PcInfo pc)
    {
        pc.Hostname     = Environment.MachineName;
        pc.OsVersion    = $"{RuntimeInformation.OSDescription} (Build {Environment.OSVersion.Version.Build})";
        pc.ErutVersion  = $"v{Assembly.GetExecutingAssembly().GetName().Version} · build {BuildInfo.Timestamp}";

        var ni = NetworkInterface.GetAllNetworkInterfaces()
            .FirstOrDefault(n => n.OperationalStatus == OperationalStatus.Up
                              && n.NetworkInterfaceType != NetworkInterfaceType.Loopback);
        if (ni != null)
        {
            pc.MacAddress    = string.Join(":", ni.GetPhysicalAddress().GetAddressBytes().Select(b => b.ToString("X2")));
            pc.MacInterface  = $"{ni.Name} · {ni.Description}";
            pc.IpLan = ni.GetIPProperties().UnicastAddresses
                .FirstOrDefault(a => a.Address.AddressFamily == AddressFamily.InterNetwork)?.Address.ToString();
        }
        return pc;
    }
}
```

---

## 3. DB 스키마

### 3-1. `settings.db` (전역 설정 DB)에 신규 테이블

```sql
CREATE TABLE TB_PC_INFO (
    PcId INTEGER PRIMARY KEY,                     -- 항상 1 (single row)
    Uuid TEXT NOT NULL UNIQUE,                    -- RFC 4122 UUID v4
    Alias TEXT NOT NULL,                          -- 사용자 입력 (변경 가능)
    Hostname TEXT,                                -- Environment.MachineName
    OsVersion TEXT,                               -- RuntimeInformation.OSDescription
    ErutVersion TEXT,                             -- 앱 자체
    IpLan TEXT,                                   -- LAN IPv4
    MacAddress TEXT,                              -- MAC (선택 — 보안 옵션)
    MacInterface TEXT,                            -- 인터페이스명·설명
    ShowAliasInStatusBar INTEGER DEFAULT 0,       -- 상태바 표시 (0=OFF, 1=ON)
    FirstRegistered TEXT NOT NULL,                -- ISO-8601 timestamp
    UpdatedAt TEXT NOT NULL                       -- 마지막 자동 메타 갱신
);
```

### 3-2. 검사 세션 — 측정 PC UUID 컬럼 추가

`TB_SCAN_SESSION`에 컬럼 추가 (CLAUDE.md schema):

```sql
ALTER TABLE TB_SCAN_SESSION ADD COLUMN PcUuid TEXT;
ALTER TABLE TB_SCAN_SESSION ADD COLUMN PcAlias TEXT;
-- PcAlias는 alias 변경 후에도 보고서·이력 시점의 alias 보존을 위해 함께 기록
```

마이그레이션: 기존 row의 `PcUuid`와 `PcAlias`는 NULL → 보고서·이력에 "—"로 표시.

---

## 4. 표시 위치 매핑

### 4-1. [8] 설정 모달 PC 정보 카테고리

| 필드 | 입력 / 표시 | 변경 가능 |
|---|---|---|
| PC 별칭 (alias) | 사용자 입력 | ✅ 언제든 |
| UUID | 시스템 자동 | ❌ readonly (복사 가능) |
| 상태바에 alias 표시 | 토글 (기본 OFF) | ✅ |
| 호스트명 / OS / ERUT 버전 / IP / MAC / 최초 등록일 | 자동 수집 (앱 시작 시 갱신) | ❌ readonly |

### 4-2. 상태바 alias 표시 옵션

- 기본 OFF
- ON 시 상태바 우측 (version 라벨 옆)에 `PC: {alias}` 표시
- 다중 PC 환경에서 즉시 식별

### 4-3. [18] 채널 측정 보고서 — A4 헤더에 측정 PC 행

섹션 1 "적용 표준 / 검사 대상" 마지막 행:

```
| 측정 PC | 현장 검사 PC #1 (a7f3c2e8…) |
```

- `{alias} ({uuid 앞 8자}…)` 형식
- 세션이 저장된 시점의 alias 사용 (현재 alias 변경 후에도 보고서엔 측정 시점 alias 유지)

### 4-4. [7] 검사 이력 — 측정 PC 컬럼

테이블 9 → 10 컬럼. 검사자 다음에 PC 컬럼.

| 컬럼 | 폭 |
|---|---|
| (체크박스) | 50px |
| 세션 ID | 130px |
| 검사 대상 | 1fr |
| 검사자 | 1fr |
| **측정 PC** (v19.0) | 140px |
| 시작 시각 | 1fr |
| 결함 | 80px |
| 크기 | 100px |
| 상태 | 130px |
| (선택 버튼) | 100px |

### 4-5. [3] 진단/로그 통신 로그 — PC 컬럼

테이블 6 → 7 컬럼. 시각 다음에 PC 컬럼.

| 컬럼 | 폭 |
|---|---|
| 시각 | 150px |
| **PC** (v19.0) | 140px |
| 구간 | 170px |
| 지연 (ms) | 100px |
| 패킷 손실 (%) | 110px |
| 데이터율 (msg/s) | 140px |
| 상태 | (1fr) |

- 셀 hover 시 tooltip으로 UUID 표시

---

## 5. MQTT 토픽 구조 (v19.0 변경)

### 5-1. 기존 → 변경

```
기존: erut/{topic}                       # PC 식별자 없음
변경: erut/{pc_uuid}/{topic}             # v19.0
```

### 5-2. 권장 토픽 체계

```
# 측정 데이터
erut/{pc_uuid}/measurement/{mc_board_id}/{channel_id}

# 상태 / heartbeat
erut/{pc_uuid}/status/heartbeat
erut/{pc_uuid}/status/mc_board/{mc_board_id}

# 진단 / 에러
erut/{pc_uuid}/diagnostic/error/{error_code}

# 교정 이력
erut/{pc_uuid}/calibration/{channel_id}

# PC 정보 자체 (alias 변경 등 메타 동기화)
erut/{pc_uuid}/info
```

### 5-3. 서버 측 효과

- 다중 PC 동시 수신 (PC당 독립 토픽 트리)
- PC별 인덱싱·필터링 가능
- alias 변경은 `erut/{pc_uuid}/info` retain 메시지로 서버 동기화

---

## 6. UI 입력 검증

| 항목 | 규칙 |
|---|---|
| alias 최소 길이 | 1자 |
| alias 최대 길이 | 64자 (한글·영문·숫자·공백·일부 기호) |
| alias 금지 문자 | `/`, `\`, `<`, `>`, `"`, `'`, `|`, MQTT 와일드카드 (`+`, `#`) |
| 빈 alias 저장 | 차단. 기본 alias로 복원 |
| 중복 alias 허용? | ✅ 허용 (UUID로 구분되므로) |

---

## 7. 에러 / 엣지 케이스

| 상황 | 처리 |
|---|---|
| `settings.db`에 TB_PC_INFO 없음 (마이그레이션 전) | 자동 생성 + 신규 UUID |
| 네트워크 인터페이스 없음 (가상 환경) | IP/MAC = NULL. alias·UUID는 정상 동작 |
| MAC 주소 노출 우려 | [8] 설정 모달의 "MAC 표시" 토글로 숨김 가능 (v19.1+) |
| 클립보드 권한 없음 (브라우저 환경) | UUID 복사 버튼 클릭 시 fallback (선택 가능 textbox) |
| MQTT 토픽 변경 시 기존 서버 호환성 | 마이그레이션 기간 동안 양쪽 토픽 publish (1.4.x 호환) |

---

## 8. 테스트 케이스

### 단일 PC 시나리오

| # | 입력 | 예상 결과 |
|---|---|---|
| T1 | 첫 실행 | TB_PC_INFO에 새 UUID + 기본 alias `ERUT-PC-{date}` 자동 생성 |
| T2 | [8] PC 정보 → alias 변경 "현장 검사 PC #1" → 적용 | DB 저장 · 보고서·이력·통신 로그 모두 즉시 반영 |
| T3 | 상태바 alias 표시 토글 ON | 상태바 우측에 "PC: 현장 검사 PC #1" 노출 |
| T4 | UUID 복사 버튼 클릭 | 클립보드에 UUID 36자 복사 |

### 다중 PC 시나리오

| # | 입력 | 예상 결과 |
|---|---|---|
| T5 | 다른 PC에서 같은 alias로 측정 | UUID는 다름. [7] 이력에서 같은 alias 표시되지만 내부 식별은 UUID 기준 |
| T6 | PC A에서 alias 변경 | PC B의 표시는 변하지 않음 (PC별 독립) |

### 영속성

| # | 입력 | 예상 결과 |
|---|---|---|
| T7 | ERUT 재시작 | 같은 UUID + 같은 alias 유지. 자동 메타만 갱신 |
| T8 | OS 재설치 (`settings.db` 초기화) | 새 UUID 자동 생성. 기존 이력의 측정 PC UUID와 불일치 (의도된 동작) |

### MQTT 토픽

| # | 입력 | 예상 결과 |
|---|---|---|
| T9 | 측정 1회 발생 | `erut/{uuid}/measurement/{mc_id}/{ch_id}` topic publish |
| T10 | alias 변경 | `erut/{uuid}/info` retain 메시지 발행 |

---

## 9. 향후 확장 (v19.1+)

- **PC별 권한 관리**: PC UUID 기반 서버 인증·인가 (관리자 / 일반 / 읽기 전용)
- **PC 그룹 / 사이트 매핑**: 여러 PC를 사이트 단위로 묶음
- **MAC 주소 숨김 토글**: 보안 우려 시 표시 OFF
- **PC 자산 폐기 / 이양**: UUID 무효화 + 새 PC로 이관 마법사
- **원격 PC 모니터링**: 웹 서비스에서 등록된 PC 목록·상태 표시
