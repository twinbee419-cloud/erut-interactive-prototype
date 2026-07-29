# 채널 측정 보고서 출력 — 개발 사양서

## 문서 정보

| 항목 | 내용 |
|---|---|
| **버전** | 1.1 (v18.1 사용자 피드백 반영) |
| **작성일** | 2026-06-11 (1.0) / 2026-06-11 (1.1) |
| **v1.1 변경** | (1) 진입을 MC보드 정보 옆으로 이동 (단위 일관성) (2) "측정 위치(θ, Z)" 행 제거 — A-scan에 좌표 정보 없음 (3) 좌/우 chevron + 키보드 ←/→ (4) 64채널 전체 표시 + 검사 대상명 서브텍스트. 채널 배치 마법사 전면 폐기. **(5) 다중 채널 출력 시 채널별 개별 PDF + ZIP 압축으로 저장 (NDT 채널 단위 추적성)**. |
| **작성** | 기획팀 + NDT 도메인 검토 (Claude) |
| **적용 위치** | `SLIDE 17 [18] 채널 측정 보고서 출력` |
| **관련 산출물** | `ERUT_ServiceFlow_FixedProbe.html` v18.0+ |
| **장비 범위** | 고정형 (A-scan 단일 채널 측정) — 스캔형은 추후 별도 사양 |
| **선행 폐기** | `archive/ERUT_ServiceFlow_FixedProbe_v17.2.html`의 결함 판정 보고서([18] 보고서 자동 생성 — KS B 0817/ASME Sec.V 양식 + 종합 판정 + 디지털 서명) — office 후처리 보고서 요구 재발생 시 복원 |

---

## 1. 기능 개요

ERUT 사용자(NDT 검사자)가 현장에서 측정한 **단일 채널의 raw 데이터**를 **A4 1장 PDF**로 출력하는 기능. **결함 판정·종합 평가·디지털 서명은 포함하지 않는다**.

### 사용자 합의 (2026-06-11)

> 현장에서는 데이터 dump만. 결함 판정은 office 후처리에서 별도 자격(ASNT Level III)이 담당.

이 합의에 따라 v17.2 이전의 [18] 보고서 자동 생성(결함 판정 + 디지털 서명 포함)을 폐기하고, 본 사양으로 교체.

### 사용자 시나리오

1. 검사자가 [2] 장비 상세에서 채널 선택
2. 우측 채널 패널 "보고서 출력" 버튼 클릭
3. ReportExportDialog 모달 표시 — 좌측 같은 검사 대상 내 채널 다중 선택 가능, 우측 A4 미리보기
4. 출력할 채널 선택 + 옵션 확인 (적용 표준 readonly · 서명란 포함 checkbox · 방향 세로)
5. "PDF 출력 (N장)" 클릭 → 채널당 A4 1장 묶음 PDF 생성 + 저장 다이얼로그
6. 파일 저장 후 토스트로 완료 안내

### 진입 경로 (5) — v1.1 변경: 채널 패널 → MC보드 정보 옆

| # | 진입점 | 사용자 컨텍스트 | prefill |
|---|---|---|---|
| 1 | [2] **MC보드 정보 옆 '진단/로그' 왼쪽** "보고서 출력" 버튼 | MC보드 단위 (진단/로그와 동일) | 현재 선택된 채널 prefill (없으면 첫 채널) |
| 2 | [7] 검사 이력 → "선택 세션 → 채널 보고서 출력 [18]" 버튼 | 세션 단위 office | 세션 내 모든 채널 (사용자가 일부 해제) |
| 3 | 메뉴바 [파일] → "보고서 출력..." | 자유 진입 | 첫 채널만 선택됨 |
| 4 | 키보드 `Ctrl+P` | 자유 진입 (동일) | 첫 채널만 선택됨 |
| 5 | [11] 실시간 측정 중지(F7) → 자동 옵션 (선택 — v18.2+) | 측정 직후 | 측정 중이던 채널 전체 |

---

## 2. 데이터 모델 — A4 1장 구성

A4 1장당 1개 채널. 총 4개 섹션 + 헤더/푸터.

### 2-1. 헤더 (자동 채움)

```
[ERUT 로고]
초음파 측정 데이터 보고서
{프로젝트명} · {검사 대상명} · {채널 ID} · {출력 일시(YYYY-MM-DD HH:MM)}
```

### 2-2. 섹션 1. 적용 표준 / 검사 대상 (v1.1 변경)

| 필드 | 출처 | 비고 |
|---|---|---|
| 적용 표준 | `TB_INSPECTION_ITEM.ApplicableStandard` | [6] 검사 대상 등록 시 입력. dropdown 8종 + 사용자 입력 |
| 검사 대상 | `TB_INSPECTION_ITEM.ItemName` + 형상 · 두께 · 소재 요약 | 채널 → 검사 대상 join (`TB_CHANNEL_PROBE.ItemID`) |
| 채널 ID | `TB_CHANNEL_PROBE.ChannelNumber` (예: "CH07") + 소속 MC보드 ID | A-scan은 좌표 정보를 얻을 수 없으므로 ID 기반 식별만 |

**v1.1 폐기**: ~~측정 위치 (θ, Z)~~ — A-scan은 단일 시점·단일 위치 측정이며, 그 위치를 시스템이 알 방법이 없음. 검사자가 매번 줄자로 측정해 입력하는 운영 부담 + 정확도 한계. 결함 위치 시각화(도면 매핑)는 별도 웹 서비스 책임.

### 2-3. 섹션 2. 탐촉자 스펙

| 필드 | 출처 | 비고 |
|---|---|---|
| 모델 / S/N | `TB_PROBE.ModelName` / `SerialNumber` | [4-3] 채널 등록 시 입력 |
| 주파수 | `TB_PROBE.Frequency` (MHz) | |
| 직경 / 종류 | `TB_PROBE.Diameter` (mm) + `Type` (직선/사각) | |
| Wedge 각도 | `TB_CALIBRATION.WedgeAngle` (°) | v15.3 단일 입력값. 90° = 수직 |

### 2-4. 섹션 3. 교정 이력

| 필드 | 출처 | 비고 |
|---|---|---|
| 교정일 | `TB_CALIBRATION.CalibrationDate` | 마지막 교정 |
| 교정 주기 | `TB_CALIBRATION.CycleDays` (일) | v16.0 — 채널별 override 또는 전역 기본값 |
| 교정 시험편 | `TB_CALIBRATION.ReferenceBlock` (예: "IIW V1") + `BlockType` ("표준시험편" / "비교시험편") | v15.3 분류 |
| 음속 / 영점 | `TB_CALIBRATION.SoundVelocity` (m/s) + `ZeroOffset` (μs) | v15.0 — NDT 도메인 핵심 |
| Gain / Gate | `TB_CHANNEL_CONFIG.Gain` (dB) + Gate A `Start`/`Width`/`Threshold` | |

### 2-5. 섹션 4. 측정 결과 (A-scan)

핵심 — 마지막 측정값.

| 출력 요소 | 사양 | 출처 |
|---|---|---|
| A-scan 그래프 | 시간 (x, μs) × 진폭 (y, % FSH). Gate 영역 overlay + Threshold line | `TB_MEASUREMENT.AScanRaw` (BLOB or .bin file path) |
| Amp | % FSH (Full Screen Height) | `TB_MEASUREMENT.Amplitude` |
| ToF | μs (마이크로초) | `TB_MEASUREMENT.TimeOfFlight` |
| 환산 두께 | mm. 계산: `ToF × 소재 음속 / 2 / 1000` | 파생 (저장 안 함, 출력 시 계산) |

**그래프 사양**:
- 크기: 약 130 × 360 pt (A4 1/3 영역)
- 색: `--content-high` (signal) · `--brand-primary` (Gate stroke) · `--system-caution` (Threshold)
- X축 범위: 0 ~ Gate end + 5 μs (기본 0~20 μs)
- Y축 범위: 0 ~ 100 % FSH (baseline 중앙)
- 폰트: NanumSquare 7pt

### 2-6. 푸터 (옵션 — 서명란 포함 시)

```
[검사자]                    [일자 · 시간]
__________                  __________
서명                        {YYYY-MM-DD HH:MM}
```

`includeSign === false`일 때 푸터 미출력 (페이지 활용 ↑).

---

## 3. PDF 생성 알고리즘

### 3-1. 라이브러리 선택

| 옵션 | 추천도 | 비고 |
|---|---|---|
| **PdfSharp** (.NET) | ★★★ | Windows Forms 표준. 한글 폰트 임베드 가능. MIT 라이선스 |
| QuestPDF | ★★ | 모던 fluent API. Community 라이선스 무료 (수익 < $1M USD/년) |
| iTextSharp | ★ | AGPL — 상업용 라이선스 필요. 권장하지 않음 |

**결정**: PdfSharp + MigraDoc (PdfSharp의 layout helper). 한글 폰트는 NanumSquare를 PDF에 임베드 (라이선스 ✓).

### 3-2. 출력 방식 — 채널 수에 따라 분기 (v1.1)

**원칙 — 채널 1개 = PDF 파일 1개**. 다중 채널은 개별 PDF + ZIP 압축으로 저장 (단일 PDF 묶음 방식 폐기).

| 선택 채널 수 | 출력 형식 | 비고 |
|---|---|---|
| **1 채널** | 단일 PDF 파일 | 그대로 저장 다이얼로그 |
| **2 채널 이상** | **개별 PDF N개 → ZIP 압축 1개** | 채널별 분리 보관·공유·일부 재출력 용이. NDT 채널 단위 추적성 ↑ |

**ZIP 라이브러리**: `System.IO.Compression.ZipArchive` (.NET 표준, 추가 의존성 없음).

### 3-3. 페이지 생성 의사코드 (v1.1 — 채널별 분리 + ZIP 압축)

```csharp
public byte[] GenerateChannelReport(
    Guid projectId, Guid itemId, List<string> channelIds,
    bool includeSign)
{
    // 단일 채널 — PDF 1개 그대로 반환
    if (channelIds.Count == 1)
    {
        return GenerateSinglePdf(projectId, itemId, channelIds[0], includeSign);
    }

    // 다중 채널 — 채널별 PDF 생성 후 ZIP 묶음
    using var zipStream = new MemoryStream();
    using (var zip = new ZipArchive(zipStream, ZipArchiveMode.Create, leaveOpen: true))
    {
        foreach (var chId in channelIds)
        {
            var pdfBytes = GenerateSinglePdf(projectId, itemId, chId, includeSign);
            var fileName = BuildSinglePdfFileName(projectId, itemId, chId);
            var entry = zip.CreateEntry(fileName, CompressionLevel.Optimal);
            using var entryStream = entry.Open();
            entryStream.Write(pdfBytes, 0, pdfBytes.Length);
        }
    }
    return zipStream.ToArray();
}

private byte[] GenerateSinglePdf(Guid projectId, Guid itemId, string chId, bool includeSign)
{
    var doc = new PdfDocument();
    var page = doc.AddPage();
    page.Size = PdfSharp.PageSize.A4;
    page.Orientation = PdfSharp.PageOrientation.Portrait;

    var gfx = XGraphics.FromPdfPage(page);
    DrawHeader(gfx, projectId, itemId, chId);
    DrawSection1_Standard(gfx, itemId, chId);
    DrawSection2_Probe(gfx, chId);
    DrawSection3_Calibration(gfx, chId);
    DrawSection4_Ascan(gfx, chId);  // ★ AScanRaw 디시리얼라이즈 후 path 그리기
    if (includeSign) DrawFooter_Sign(gfx);

    using var ms = new MemoryStream();
    doc.Save(ms);
    return ms.ToArray();
}
```

### 3-4. A-scan 렌더링

A-scan 데이터(`double[] AScanRaw`)를 PdfSharp `XGraphics.DrawLines`로 polyline 그림.

```csharp
void DrawSection4_Ascan(XGraphics gfx, string chId)
{
    var ms = LoadLastMeasurement(chId);  // TB_MEASUREMENT 최신 row
    var raw = LoadAScanRaw(ms.RawFilePath);  // .bin or BLOB

    // 좌표 변환: μs → pt
    var gateAStart = ms.GateAStart;  // μs
    var gateAWidth = ms.GateAWidth;
    var threshold  = ms.GateAThreshold; // % FSH

    var rect = new XRect(60, 480, 360, 130);  // A-scan 영역
    DrawGateOverlay(gfx, rect, gateAStart, gateAWidth, threshold);
    DrawSignalPath(gfx, rect, raw, 0, 20);  // 0~20μs window
    DrawAxisLabels(gfx, rect);
}
```

### 3-5. 한글 폰트 임베드

- NanumSquare R/B/acR/acB 4종 (`design-system/project/fonts/`)
- PdfSharp `XFont`에 임베드: `XFont.Subset` 모드로 크기 ↓

### 3-6. 파일명 규칙 (v1.1 — ZIP 압축 반영)

**단일 채널 (PDF 1개)**:
```
{프로젝트코드}_{검사대상명}_{채널ID}_{YYYY-MM-DD}.pdf

예시: SK-ULSN_PIPE-A-204_CH07_2026-06-11.pdf
```

**다중 채널 (ZIP 1개 + 내부 PDF N개)**:
```
ZIP 파일명: {프로젝트코드}_{MC보드ID}_보고서_{N}ch_{YYYY-MM-DD}.zip
ZIP 내부 각 PDF: {검사대상명}_{채널ID}.pdf

예시:
ZIP — SK-ULSN_MCuF-001_보고서_8ch_2026-06-11.zip
  ├── PIPE-A-204_CH07.pdf
  ├── PIPE-A-204_CH08.pdf
  ├── PIPE-A-204_CH09.pdf
  ├── TANK-B-101_CH25.pdf
  ├── TANK-B-101_CH26.pdf
  ├── VESSEL-C-301_CH49.pdf
  ├── VESSEL-C-301_CH50.pdf
  └── VESSEL-C-301_CH51.pdf
```

**ZIP 사용 근거 (NDT 워크플로우 정합)**:
- 채널별 분리 보관 → 일부 채널만 재출력 / 공유 / 보관 용이
- 검사 대상별 폴더 구조와 자연스럽게 매핑
- 단일 PDF 묶음 방식보다 채널 단위 추적성 ↑
- 검사 이력 관리 시 채널별 파일 인덱싱 가능

저장 다이얼로그 기본 확장자는 채널 수에 따라 자동 변경 (`*.pdf` / `*.zip`).

---

## 4. UI 컴포넌트 매핑

### 4-1. React 컴포넌트 (프로토타입) — v1.1 변경

`window.ReportExportDialog` (Screens.jsx)

```typescript
interface ReportExportDialogProps {
  deviceId: string;                     // MC보드 ID (예: "MCuF-001") — v1.1 변경 (targetId → deviceId)
  initialChannel?: string;               // 초기 선택 채널 ID (선택)
  onClose: () => void;
  onExport: (payload: {
    deviceId: string;
    channels: string[];                 // 선택된 채널 ID 배열
    includeSign: boolean;
    // standard prop 제거 — 채널별로 다른 표준 적용 (검사 대상 join에서 동적 계산)
  }) => void;
}
```

**v1.1 추가**: `window.getChannelTarget(chId)` helper — 채널 ID → 검사 대상 ID 매핑. mockup용은 ch01~24 = PIPE-A-204, ch25~48 = TANK-B-101, ch49~64 = VESSEL-C-301. 실제는 DB join.

**v1.1 키보드 단축키 추가**: 미리보기 활성 시 `←` / `→` = 선택 채널 사이 이동.

### 4-2. CSS 클래스 (design-system/kit.css)

신규 추가 (v18.0):
- `.erut-report-a4` — A4 비율 컨테이너 (210:297 aspect ratio, 흰 배경, padding 28×32)
- `.erut-report-a4__header` · `__title` · `__subtitle`
- `.erut-report-a4__section` · `__section-title`
- `.erut-report-a4__table` (dotted border-bottom row + 78pt label column)
- `.erut-report-a4__ascan` (signal 영역)
- `.erut-report-a4__footer` · `__sign`

### 4-3. 진입 wiring (index.html)

```javascript
const [reportDialog, setReportDialog] = useState(null);
// null | { targetId: string, initialChannel: string | null }

// [2] DeviceDetail 진입
<window.DeviceDetail
  ...
  onOpenReport={(channel) =>
    setReportDialog({ targetId: selectedTarget, initialChannel: channel })}
/>

// 모달 렌더링
{reportDialog && (
  <window.ReportExportDialog
    targetId={reportDialog.targetId}
    initialChannel={reportDialog.initialChannel}
    onClose={() => setReportDialog(null)}
    onExport={(payload) => { generatePdf(payload); setReportDialog(null); }}
  />
)}
```

---

## 5. DB 스키마 추가 (v18.0)

`TB_INSPECTION_ITEM`에 신규 컬럼:

```sql
ALTER TABLE TB_INSPECTION_ITEM ADD COLUMN ApplicableStandard TEXT;
-- 예시 값:
-- "KS B 0817" / "KS B 0894" / "ASME Sec. V Art.5" / "AWS D1.1" /
-- "EN ISO 17640" / "API 510" / "NACE MR0175" / "기타 — {사용자 입력}"
```

기존 row의 default 값: NULL (보고서 출력 시 "표준 미지정"으로 표시 + 검사 대상 편집으로 이동 유도).

---

## 6. 에러 처리

| 상황 | 처리 |
|---|---|
| 선택 채널 0개 | "PDF 출력" 버튼 disabled. 1개 이상 선택해 주세요 hint |
| 검사 대상에 적용 표준 미입력 | 옵션 패널에 "표준 미지정" + "검사 대상 편집 →" 링크. 출력 자체는 진행 가능 (보고서엔 "—" 표시) |
| 채널에 측정 데이터 없음 | 미선택. dimmed + tooltip "측정 이력 없음" |
| 채널 교정 미진행 | 출력은 가능. A4의 섹션 3 "교정일" 칸에 "미교정" 표시 + 경고 색 (`--system-caution`) |
| PDF 생성 실패 (디스크 full / 권한 없음) | 토스트 에러 + 로그. 부분 생성된 파일 삭제 |

---

## 7. 테스트 케이스

### 단일 채널 출력

| # | 입력 | 예상 결과 |
|---|---|---|
| T1 | [2] CH07 선택 → "보고서 출력" 클릭 | 모달 표시, CH07 선택됨 + 미리보기 |
| T2 | "PDF 출력 (1 장)" 클릭 | 1페이지 A4 PDF 생성. 파일명 `{...}_CH07_{date}.pdf` |
| T3 | 모달 옵션 "서명란 포함" 해제 후 출력 | 푸터 없는 PDF |

### 다중 채널 출력 (v1.1 — ZIP 압축)

| # | 입력 | 예상 결과 |
|---|---|---|
| T4 | CH07 → 모달에서 CH08·CH11 추가 선택 → 출력 | **ZIP 파일 1개** (`{...}_MCuF-001_보고서_3ch_{date}.zip`). 내부 3개 PDF 각각 1페이지 |
| T5 | "전체 선택" 클릭 → 64채널 선택 → 출력 | **ZIP 파일 1개** (`{...}_MCuF-001_보고서_64ch_{date}.zip`). 내부 64개 PDF, 검사 대상별 PDF 명명 |
| T5-1 | 다중 채널 출력 후 ZIP 압축 해제 | 채널별 개별 PDF 파일 N개 확인. 각 PDF는 단일 채널 형식 (1페이지) |

### 진입 경로

| # | 입력 | 예상 결과 |
|---|---|---|
| T6 | [파일] → 보고서 출력 (Ctrl+P) | 모달 표시. 첫 채널 선택 |
| T7 | [7] 검사 이력 → "선택 세션 → 채널 보고서 출력 [18]" | 모달 표시. 세션 내 채널 전체 선택 |

### 에러 케이스

| # | 입력 | 예상 결과 |
|---|---|---|
| T8 | 선택 채널 0개 | "PDF 출력" disabled |
| T9 | 검사 대상에 적용 표준 NULL | "표준 미지정" 표시 + 편집 링크. 출력 진행 가능 |
| T10 | 측정 이력 없는 채널 prefill | dimmed, 선택 불가 |

---

## 8. 향후 확장 (v18.1+)

- **CSV 동시 출력**: PDF + CSV 묶음 (CSV는 측정 시계열). dev_handoff 별도 사양.
- **F7 측정 중지 시 자동 진입**: 진입 경로 #5. 사용자가 보고서 출력 default ON 선택 가능.
- **사용자 정의 템플릿**: 회사 로고·헤더·푸터 변형. v18.1+.
- **이메일 첨부 전송**: PDF 생성 후 SMTP 전송 옵션. v18.2+.
- **office 후처리 보고서 부활** (선택 — 사용자 요구 발생 시): archive/v17.2 [18] 보고서 자동 생성 복원. 본 사양과 분리된 별도 진입 + 별도 컴포넌트.
