# 결과 분석 저장 구조 사양 (v1.0)

> 대상 화면: `[C-PRJ-06]` 결과 분석
> 작성일: 2026-09-23

---

## 1. 배경

`[C-PRJ-06]`은 완료된 검사를 불러와 **Gain·Gate·DGS Curve·Offset만 사후 조정**하는 화면이다. **TCG는 교정 시 적용값을 readonly로 표시**한다(§5-6). raw A-scan은 어떤 경우에도 변경되지 않으며, C-scan은 raw에서 게이트 구간을 집계해 매번 계산하는 파생물이다.

따라서 **수정본을 저장할 때 raw를 복사해서는 안 된다.** 복사하면 검사 1건마다 대용량 바이너리가 2배가 되고, 그렇게 만든 두 벌의 내용은 항상 동일하다.

---

## 2. 저장 대상 분리

| 대상 | 저장 위치 | 개수 | 쓰기 정책 |
|---|---|---|---|
| raw A-scan | `.bin` 파일 | **1** | **write-once** · 절대 재기록 금지 |
| 교정 설정값 `origin` | DB (JSON) | 1행 | 검사 완료 시 1회 생성 후 **불변** |
| 교정 설정값 `current` | DB (JSON) | 1행 | `[저장]`마다 **덮어씀** |
| C-scan | **저장 안 함** | 0 | raw + `current` 게이트로 매번 계산 |
| 마킹 목록 `markings[]` | DB (JSON 또는 테이블) | 검사당 N행 | 추가·메모·상태 변경마다 **즉시 저장** · `origin`·`current`·`[저장]`과 독립 (§3-1) |

저장 경로 = `[C-SET-01]` 기본 설정의 `프로젝트 저장 경로`. DB에는 메타데이터·JSON·파일 경로만 두고 바이너리는 파일로 분리한다(BLOB 금지 — 프로젝트 저장 원칙).

### 2-1. raw A-scan의 진폭 기준 (★개발 확인 완료)

**raw는 수집 시점의 `Digital Gain`·`TCG`가 적용된 상태로 저장된다.** 미적용 원본을 따로 저장하지 않는다.

사후 조정은 다음 순서로 처리한다.

```
저장값  =  원신호 × 10^((Digital Gain + TCG(t)) / 20)
복원    =  저장값 ÷ 10^((적용 Digital Gain + 적용 TCG(t)) / 20)     ← origin 설정값으로 역산
표시    =  복원값 × 10^((새 Digital Gain + 새 TCG(t)) / 20)
```

> **TCG는 사후 변경하지 않으므로 `새 TCG(t)` = `적용 TCG(t)`** — 실질 조정 대상은 `Digital Gain`뿐이다. 식은 TCG 항을 남겨 둔 일반형이다.

dB 가감은 선형 연산이고 적용값이 `origin`에 남아 있으므로 **가역**이다. 그래서 "적용 상태로 저장"과 "사후 조정 가능"이 양립한다.

**예외 — 포화 구간은 비가역.** 100 %로 clip된 샘플은 잘린 정보가 없어 역산해도 복원되지 않는다. 사후 감도 조정은 **어둡게 → 밝게 방향만 신뢰 가능**하다(§5-3).

`Analog Gain`은 디지털화 이전의 수신단 증폭이며 **수신단 장비 설정 기록**이다. 표시 효과가 `Digital Gain`과 동일해 중복 컨트롤이 되므로 `[C-PRJ-06]`에서 **readonly**로 노출한다.

---

## 3. 설정값 세트 구성

채널별로 아래를 담는다.

```json
{
  "setType": "origin",            // origin | current
  "channels": [
    {
      "channelId": "CH 02",
      "gain": { "digitalDb": 12.0, "analogDb": 20.0 },
      "selectedGate": "A",         // 채널 1 : 게이트 1
      "gate": { "startUs": 12.3, "widthUs": 5.0, "thresholdPct": 26, "mode": "Amp" },
      "tcgPoints": [ { "tofUs": 20, "gainDb": 5 } ]
    },
    {
      "channelId": "CH 03",
      "gain": { "digitalDb": 14.0, "analogDb": 20.0 },
      "selectedGate": "A",
      "gate": { "startUs": 12.3, "widthUs": 5.0, "thresholdPct": 26, "mode": "Amp" },
      "dgs": {
        "curveMm": 3.00, "offsetsDb": [ -6.0, 6.0 ],            // current에서 바뀔 수 있는 2개
        "frequencyMHz": 5.0, "elementShape": "rectangle", "elementDiameterMm": null, "elementWidthMm": 9.6, "elementHeightMm": 9.6, "delayVelocityMps": 2500,   // 승계 3종 · 탐촉자 레벨 필드명 그대로 · 진동자 = 원형 직경 / 사각형 가로·세로
        "refType": "FBH", "refSizeMm": 3.0,
        "record": { "gate": "A", "soundPathMm": 100.0, "gainDb": 32.0 },          // 기준점 3종
        "refAttenDbPerM": 0.0, "amplCorrectDb": 0.0, "testAttenDbPerM": 0.0, "transferCorrDb": 0.0
      }
    }
  ]
}
```

- **`tcgPoints`와 `dgs`는 채널의 보정 방식에 따라 둘 중 하나만 채운다** — 위 예시의 `CH 02`는 TCG 채널, `CH 03`은 DGS 채널이다. 한 채널에 둘을 함께 두지 않는다. 방식은 채널 단위로 고정되며 `current`에서 바뀌지 않는다(§5-4).
- **`current.dgs`는 `curveMm`·`offsetsDb`만 다를 수 있고 나머지 필드는 `origin.dgs`와 항상 같다**(§5-5). 승계 3종은 탐촉자 레벨 필드명 그대로(`frequencyMHz`·`elementShape`·`elementDiameterMm`·`elementWidthMm`·`elementHeightMm`·`delayVelocityMps` — `CalibrationHistoryEntry.probeSnapshot`과 동일), 나머지는 `Probe_Registration_Spec` §4 `sensitivity.dgs`와 동일.
- `dgs.offsetsDb`는 **행 순서를 그대로 보존**한다. 최대 4행이며 빈 배열이면 보조 곡선 없음.
- **`origin`에는 DGS 패널 전 항목을 함께 보관한다** — 승계 3종(`XTAL Frequency`·`EFF. Diameter`·`Delay Velocity`) · `Ref Type` · `Ref Size` · 보정값 4종 · **기준점 3종**(기준 게이트 · 기준 음로 · 기준 Gain). `[C-PRJ-06]`의 `교정 시점 값 ⓘ` 접이식이 이 값을 읽기 전용으로 표시하므로, 교정 세션 참조만으로는 부족하다.

- `SW` 게인은 화면에서 제외되었으므로 저장하지 않는다.
- **읽기 전용 교정값**(음속 · 영점(Zero/Delay) · 굴절각 · 보정 방식 TCG/DGS)은 교정 세션에서 승계하며 이 화면의 변경 대상이 아니다. 세트에는 **참조(교정 세션 ID)** 로만 둔다.
- 게이트 `Mode`는 검사 시점 설정을 그대로 사용한다(사후 변경 불가).

---

### 3-1. 마킹 목록 `markings[]` — `[C-PRJ-06]` 마킹 탭

검사에 귀속된 **별도 레코드**. 교정 설정값 세트(`origin`·`current`)에 넣지 않는다.

```jsonc
{
  "no": 3,                         // 화면 표시 M-03 · 검사 단위 연번 · 삭제해도 재사용 안 함 (아래 nextMarkingNo)
  "rect": { "x1": 1200, "y1": 340, "x2": 1260, "y2": 395 },  // mm · 모재 전체 기준 · 정수 · 추가 시점에 복사(측정 객체 참조 아님)
  "channel": "CH 02",
  "depthMm": 18.4,                 // 마킹 채널의 선택 게이트 피크 중 영역 안 최대값 · 동률이면 더 얕은 지점 · 피크 없으면 추가 불가
  "echoPct": 86.0,                 // %FSH · 같은 지점
  "frozen": {                      // 추가 시점 그 채널의 설정값 (미저장 상태였어도 그 값)
    "gainDigitalDb": 42.0, "gainAnalogDb": 20.0,
    "gate": { "name": "Gate A", "startUs": 5.2, "widthUs": 3.0, "thresholdPct": 50 }
  },
  "memo": "",                      // 최대 100자 · 자유 입력
  "status": "pending",             // pending | running | done | failed
  "failReason": null,              // "결과 미확인"·"재실행 결과 미확인"(재시작 복구) · "재실행 실패"(done 유지 시) · 통신·로봇 오류 사유
  "rerunOfDone": false,            // running 저장 시 원래 done이었으면 true — 재시작 복구 분기용
  "sentAt": null,                  // 마지막 로봇 전송 시각 (running 저장과 함께)
  "confirmedByUser": false,        // [표시 확인됨]으로 done 전환 시 true
  "createdAt": "2026-11-06T14:02:11.000",
  "executedAt": null               // done 시점 · 재실행 시 갱신
}
```

| 규칙 | 내용 |
|---|---|
| 번호 카운터 | **검사 메타 레코드**에 `nextMarkingNo`(정수 · 초기 1) 보관 · 행 목록의 최대 번호로 계산하지 않음 |
| 추가 | **행 INSERT + `nextMarkingNo` 증가를 한 트랜잭션**으로 확정 · 실패 시 둘 다 롤백(번호 미소비) |
| 실행 | 각 행 `running` 저장 성공 후에만 로봇으로 전송 · 한 건 실패해도 다음 건 계속 |
| 완료 저장 실패 | 로봇 성공 회신 후 `done` 저장 실패 → 화면은 `done` + 경고 · 자동 재저장 |
| 실패 저장 실패 | 로봇 실패 회신 후 `failed` 저장 실패 → 화면은 `failed` + 경고 · 자동 재저장 · 다음 행 계속 |
| 재시작 복구 | 프로그램 시작 시 `running` 행 → `rerunOfDone = false`면 `failed` · `failReason = "결과 미확인"`(실제 표시 여부 불명) / `rerunOfDone = true`면 `done` 유지 · `executedAt` 유지 · `failReason = "재실행 결과 미확인"` · 둘 다 재실행 시 확인 팝업 대상 |
| 표시 확인됨 | `failed` + `"결과 미확인"` 행에서만 · `status = done` · `executedAt = sentAt` · `confirmedByUser = true` · `failReason = null` |
| `done` 재실행 실패 | `status = done`·`executedAt` 유지 · `failReason = "재실행 실패"` |
| 삭제 | `pending` · `failed`(통신·로봇 오류)만 · `done`과 `failReason = "결과 미확인"`은 삭제 불가 |
| 수정 | `memo`만 · 나머지 필드 불변 |
| 검사 삭제(`[🗑]`) | 마킹 행도 함께 삭제 |
| 판정 필드 | 유형·등급·합격 여부 **없음** — 판정은 웹 책임 |

## 4. 트리거별 처리

| 트리거 | DB | 파일 |
|---|---|---|
| 검사 완료(`[C-PRJ-03]`) | `origin` 생성 · `current` = `origin` 복제 | `.bin` 생성 |
| `[저장]` | `current` 덮어쓰기 + 수정 정보(수정자·수정 일시·수정 사유) 갱신 | 변화 없음 |
| `[↻]` 초기화 | **없음** — 화면 상태만 `origin` 값으로 되돌림 | 없음 |
| `[↻]` → `[저장]` | `current` = `origin` 값으로 덮어씀 · 수정 정보는 **갱신** | 없음 |
| `[🗑]` 삭제 | `origin`·`current`·메타·`markings[]` 삭제 | `.bin` 삭제 |
| 마킹 추가 | `markings[]` 행 INSERT + 검사 메타 `nextMarkingNo` 증가(한 트랜잭션) · `origin`·`current`·수정 정보 **변화 없음** | 없음 |
| 마킹 수정·삭제·실행·표시 확인됨 | `markings[]`만 즉시 갱신 · `origin`·`current`·수정 정보 **변화 없음** | 없음 |

`[↻]`는 **전 채널 일괄**이며 클릭 시 확인 팝업을 띄운다. 저장하지 않고 화면을 벗어나면 `current`는 직전 상태 그대로 유지된다.

---

## 5. 불변 규칙

1. **`origin`은 write-once** — 어떤 경로로도 갱신하지 않는다. 이 규칙이 깨지면 `[↻]`가 복귀할 기준이 사라진다.
2. **중간 버전 미보관** — `current`는 항상 1행이며 n번 저장해도 누적하지 않는다.
3. **raw 불변** — 사후 조정은 설정값만 바꾼다. 수집 시 100 %로 포화된 픽셀은 raw에 이미 잘려 저장되므로 dB를 올려도 복구되지 않는다.
4. **보정 방식(TCG/DGS) 전환 금지** — `origin`의 방식을 `current`에서 바꾸지 않는다. DGS 기준 에코는 시편에 탐촉자를 대는 물리 작업이라 사후 기록이 불가능하고, TCG 포인트는 시편 기준 반사체 실측이 필요한데 raw에는 모재 파형만 있다. 방식은 **채널 단위**로 저장한다.
5. **DGS 채널의 `current` 변경 범위** — **DGS 패널 항목 중에서는** `DGS Curve`·`Offset`만 바꿀 수 있고, 나머지 DGS 패널 항목은 `origin` 값을 읽기 전용으로 노출한다.
   - **채널 공통 항목인 `Digital` Gain·Gate는 이 제한의 대상이 아니다** — DGS 채널에서도 조정 가능하다. 곡선이 **기준 Gain과의 차 Δ만큼 평행 이동**해 ERS 평가가 유지된다.
   - `Analog` Gain은 방식과 무관하게 readonly(수신단 장비 설정 기록).
6. **TCG 포인트 변경 금지** — `current.tcgPoints`는 항상 `origin.tcgPoints`와 같다. 자동 산출·수동 편집 모두 없음. TCG의 기준은 시편 기준 반사체인데 raw에는 모재 파형만 있어 사후 산출 근거가 없고, 모재 에코로 다시 맞추면 감쇠 구간이 정상으로 평탄화될 수 있다.

---

## 6. 다른 사양과의 경계

**`[C-RPT-02]` 캡처 동결값 7종은 별개 스냅샷**이다. 마킹 목록(§3-1)과도 서로 참조하지 않는다 — 캡처 이미지에 마킹 오버레이를 넣지 않는다. 캡처 레코드에 **참조가 아니라 값으로 복사**해 저장한다 — `current`가 이후 변경되어도 캡처는 불변이어야 한다. 상세는 `Report_Export_Spec` 참조.

---

## 7. 미해결 / 후속

- **수정 이력 N건 보관 여부** — 현재 1건(마지막 저장분)만 유지. 누적 시 `[이 시점으로 되돌리기]` 제공 가능하나 화면·스키마 확장 필요
- `origin`과 `current`가 동일해졌을 때 ⓘ 수정 정보 배지 표시 정책 — 화면설계서는 **유지**(되돌린 것도 수정 행위로 기록)
- 파일 보존 기간·프로젝트(.erut) 귀속 여부 — 개발팀 지정 설계에 따름

---

## 변경 이력

| 버전 | 일자 | 내용 |
|---|---|---|
| 1.0 | 2026-09-23 | 최초 작성 — raw 1벌 불변 + 설정값 2세트 구조 확정 |
| 1.0 | 2026-11-06 | §3-1 마킹 목록 `markings[]` 추가 |
