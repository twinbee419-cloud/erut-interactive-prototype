// ERUT UI Kit · Screens
// All exported to `window` so index.html can use them in any order.

const I = window.EIcon;
const { useState: $s } = React;

// =================== v8.5: Breadcrumb 통일 컴포넌트 ===================
// 사용법: <window.Breadcrumb onBack={fn} items={[{label}, {label}, {label, current:true}]} />
window.Breadcrumb = function Breadcrumb({ items, onBack, style }) {
  return (
    <div className="erut-crumb" style={style}>
      {onBack && <button className="erut-crumb__back" onClick={onBack}>← 이전으로</button>}
      <div className="erut-crumb__path">
        {(items || []).map((item, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span className="sep">›</span>}
            <span className={item.current ? "current" : "item"}>{item.label}</span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

// =================== Screen · EQUIPMENT CONNECT ===================
// Matches /page/section frame 2: hero text + 3 connection-method rows + divider.
window.EquipmentConnect = function EquipmentConnect({ onContinue }) {
  const [hover, setHover] = $s(null);
  const methods = [
    { id: "scan",   icon: <I.Search/>,     title: "네트워크 스캔으로 자동 검색", meta: "동일 서브넷의 ERUT 장비를 검색합니다. (UDP discovery)", cta: "스캔 시작" },
    { id: "manual", icon: <I.AddMachine/>, title: "수동으로 IP / Port 입력",     meta: "장비의 IP와 포트를 직접 입력하여 연결합니다.",          cta: "장비 추가" },
    { id: "load",   icon: <I.Folder/>,     title: "저장된 프로필에서 불러오기",   meta: "최근 사용한 장비 구성을 불러옵니다.",                   cta: "불러오기" },
  ];
  return (
    <div className="erut-vstack erut-center" style={{ gap: 24, padding: "32px 40px", height: "100%" }}>
      <div className="erut-hero">
        <div style={{ color: "var(--content-medium)" }}><I.AddMachine size={40}/></div>
        <h2 className="erut-hero__h">장비의 연결 상태를 확인해 주세요.</h2>
        <p className="erut-hero__sub">아래의 방법 중 선택하여 장비를 추가할 수 있습니다.</p>
      </div>
      <div style={{ width: 1200, height: 1, background: "var(--border-medium)" }}/>
      <div style={{ display: "flex", flexDirection: "column", gap: 16, width: 1200 }}>
        {methods.map((m) => (
          <div
            key={m.id}
            className={"erut-method" + (hover === m.id ? " is-hover" : "")}
            onMouseEnter={() => setHover(m.id)}
            onMouseLeave={() => setHover(null)}
            onClick={() => m.id === "scan" && onContinue && onContinue()}
          >
            <div className="erut-method__icon">{m.icon}</div>
            <div className="erut-method__body">
              <span className="erut-method__title">{m.title}</span>
              <span className="erut-method__meta">{m.meta}</span>
            </div>
            <window.Button variant={hover === m.id ? "active" : "default"} size="sm">{m.cta}</window.Button>
          </div>
        ))}
      </div>
      <div style={{ width: 1200, height: 1, background: "var(--border-medium)" }}/>
      <div style={{ font: "700 14px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)" }}>
        장비를 추가하면 상태바의 LED가 녹색으로 바뀝니다.
      </div>
    </div>
  );
};

// =================== Screen 3 · CONNECT FAILED ===================
// /page/section frame 3 (right): big icon, 2-line message, 재시도 + 장비 연결 설정.
/* ============================================================
   NEW SCREENS (2026-05-26) — Interactive Prototype Extensions
   APPEND-ONLY. Existing screens above this line untouched.
   ============================================================ */

// ----- Shared mock data -----
window.MOCK = {
  // 9 recent projects for [0] ProjectPicker
  recentProjects: [
    { id: "sk-ulsan",   name: "SK에너지 울산 #2 라인",        place: "울산 정유공장 · 김검사",        time: "오늘 14:23",  status: "진행 중", statusT: "running", targets: 12, sessions: 8,  defects: 4, defectT: "err" },
    { id: "kw-boryeong",name: "한국수자원공사 보령댐",         place: "보령 본댐 · 이검사",            time: "2일 전",      status: "완료",    statusT: "done",    targets: 6,  sessions: 12, defects: 0, defectT: "ok"  },
    { id: "doosan",     name: "두산에너빌리티 창원 본관",       place: "창원 본관 #3 라인 · 박검사",     time: "1주 전",      status: "검토",    statusT: "warn",    targets: 3,  sessions: 4,  defects: 1, defectT: "warn" },
    { id: "soil",       name: "S-Oil 온산공장",                place: "온산 RFCC 라인 · 김검사",        time: "2주 전",      status: "완료",    statusT: "done",    targets: 9,  sessions: 14, defects: 3, defectT: "err" },
    { id: "samsung",    name: "삼성E&A 평택 공장",            place: "평택 #1 압력 라인 · 이검사",     time: "3주 전",      status: "완료",    statusT: "done",    targets: 5,  sessions: 7,  defects: 0, defectT: "ok"  },
    { id: "gs",         name: "GS칼텍스 여수 #1",             place: "여수 정유 #1 라인 · 박검사",     time: "1개월 전",    status: "완료",    statusT: "done",    targets: 8,  sessions: 11, defects: 2, defectT: "warn" },
    { id: "hanwha",     name: "한화토탈에너지스 대산",          place: "대산 LNG 라인 · 김검사",         time: "1.5개월 전",  status: "완료",    statusT: "done",    targets: 10, sessions: 15, defects: 0, defectT: "ok"  },
    { id: "hyundai",    name: "현대오일뱅크 충남",            place: "서산 정유 #2 라인 · 이검사",     time: "2개월 전",    status: "검토",    statusT: "warn",    targets: 7,  sessions: 10, defects: 3, defectT: "err" },
    { id: "lotte",      name: "롯데케미칼 여수",              place: "여수 석유화학 NCC · 박검사",     time: "3개월 전",    status: "완료",    statusT: "done",    targets: 6,  sessions: 9,  defects: 1, defectT: "warn" },
  ],
  project: {
    name: "SK에너지 울산 #2 라인",
    desc: "고온 스팀 배관 정기 검사 · 검사자 김검사 · 2026-Q2",
    owner: "김검사",
    savedAt: "2026-05-22 09:42",
    autoSave: true,
  },
  // 6 inspection targets — matches ServiceFlow_Analysis SLIDE 5 (lines 1262-1380)
  // thumb: pipe | sphere | vessel | flange | dome | weld
  targets: [
    { id: "PIPE-A-204",  name: "PIPE-A-204",  desc: "탄소강 · 외경 300mm · 두께 10mm",        thumb: "pipe",   status: "warn", judge: "조건부",   judgeT: "err",  defects: 3, sessions: 8,  lastInspect: "2026-05-21 14:23" },
    { id: "TANK-B-101",  name: "TANK-B-101",  desc: "스테인레스 · 구형 · ∅ 1500mm",            thumb: "sphere", status: "ok",   judge: "합격",     judgeT: "ok",   defects: 0, sessions: 2,  lastInspect: "2026-05-15 10:42" },
    { id: "VESSEL-C-301",name: "VESSEL-C-301",desc: "압력 용기 · 다층 · 800 × 400mm",          thumb: "vessel", status: "warn", judge: "검토",     judgeT: "warn", defects: 1, sessions: 4,  lastInspect: "2026-05-10 16:05" },
    { id: "FLANGE-D-08", name: "FLANGE-D-08", desc: "플랜지 · 카본 · ∅ 200mm",                 thumb: "flange", status: "ok",   judge: "합격",     judgeT: "ok",   defects: 0, sessions: 1,  lastInspect: "2026-05-08 09:30" },
    { id: "DOME-E-12",   name: "DOME-E-12",   desc: "반구형 헤드 · ∅ 1200mm",                   thumb: "dome",   status: "warn", judge: "검토",     judgeT: "warn", defects: 2, sessions: 5,  lastInspect: "2026-04-30 11:18" },
    { id: "WELD-F-22",   name: "WELD-F-22",   desc: "용접부 · 직선 800mm",                       thumb: "weld",   status: "err",  judge: "불합격",   judgeT: "err",  defects: 5, sessions: 12, lastInspect: "2026-04-22 08:55" },
  ],
  // 3 MCuF devices — matches ServiceFlow_Analysis SLIDE 5 device panel (lines 1158-1246)
  devices: [
    { id: "MCuF-001", ip: "192.168.1.100", state: "measuring", activeCh: 32, totalCh: 64, dataRate: "2,048 msg/s", lastComm: null },
    { id: "MCuF-002", ip: "192.168.1.101", state: "idle",      activeCh: 16, totalCh: 64, dataRate: null,           lastComm: null },
    { id: "MCuF-003", ip: "192.168.1.102", state: "offline",   activeCh: null, totalCh: 64, dataRate: null,         lastComm: "10분 전" },
  ],
  // 8 fixed sensors on PIPE-A-204 (Z range 0~6000mm, θ 0~360°)
  sensors: [
    { id: "ch01", theta:   0, z:  600, state: "ok",   thickness: 9.92, amp: 24, tof: 3.35, age: "1 분 전",
      trend: [9.95, 9.94, 9.94, 9.93, 9.93, 9.92, 9.92] },
    { id: "ch02", theta: 180, z:  600, state: "ok",   thickness: 9.88, amp: 22, tof: 3.34, age: "1 분 전",
      trend: [9.90, 9.90, 9.89, 9.89, 9.88, 9.88, 9.88] },
    { id: "ch03", theta:   0, z: 1800, state: "ok",   thickness: 9.85, amp: 28, tof: 3.33, age: "1 분 전",
      trend: [9.88, 9.87, 9.87, 9.86, 9.86, 9.85, 9.85] },
    { id: "ch04", theta: 180, z: 1800, state: "ok",   thickness: 9.82, amp: 26, tof: 3.32, age: "1 분 전",
      trend: [9.85, 9.84, 9.84, 9.83, 9.83, 9.82, 9.82] },
    { id: "ch05", theta:  90, z: 3300, state: "ok",   thickness: 9.80, amp: 30, tof: 3.31, age: "1 분 전",
      trend: [9.83, 9.82, 9.82, 9.81, 9.81, 9.80, 9.80] },
    { id: "ch06", theta: 270, z: 3300, state: "ok",   thickness: 9.81, amp: 27, tof: 3.31, age: "1 분 전",
      trend: [9.84, 9.83, 9.83, 9.82, 9.82, 9.81, 9.81] },
    { id: "ch07", theta:  45, z: 4560, state: "warn", thickness: 9.78, amp: 62, tof: 3.30, age: "1 분 전",
      trend: [9.85, 9.84, 9.82, 9.81, 9.80, 9.79, 9.78] },
    { id: "ch08", theta: 180, z: 4560, state: "ok",   thickness: 9.83, amp: 25, tof: 3.32, age: "1 분 전",
      trend: [9.86, 9.85, 9.85, 9.84, 9.84, 9.83, 9.83] },
  ],
  defects: [
    { id: 1, type: "Critical", theta:  45, z: 2200, size: "Ø 12mm" },
    { id: 2, type: "Major",    theta: 170, z: 3600, size: "Ø  8mm" },
    { id: 3, type: "Minor",    theta: 110, z: 2900, size: "Ø  4mm" },
  ],
  welds: [
    { id: "W01", z: 1800 },
    { id: "W02", z: 3300 },
    { id: "W03", z: 4560 },
  ],
  sessions: [
    { id: "SES-2026-047", date: "2026-05-21 14:23", inspector: "김검사 · Lv.II",   defects: 3, judge: "조건부", judgeT: "warn" },
    { id: "SES-2026-043", date: "2026-05-18 14:21", inspector: "김검사 · Lv.II",   defects: 2, judge: "검토",   judgeT: "warn" },
    { id: "SES-2026-038", date: "2026-05-12 10:08", inspector: "이검사 · Lv.III",  defects: 0, judge: "합격",   judgeT: "ok"  },
    { id: "SES-2026-031", date: "2026-04-28 15:42", inspector: "박검사 · Lv.II",   defects: 1, judge: "검토",   judgeT: "warn" },
  ],
  // [11] 실시간 스캔 — 채널 기반 결함 (main slide 16과 매칭)
  realtimeDefects: [
    { id: 1, type: "Critical", channel: 4,  amp: 94, tof: 5.8, thickness: 17.4 },
    { id: 2, type: "Major",    channel: 7,  amp: 76, tof: 6.2, thickness: 18.6 },
    { id: 3, type: "Major",    channel: 38, amp: 63, tof: 6.5, thickness: 19.5 },
  ],
  // [4] 장비 연결 설정 — MC보드 리스트 (main slide 9 매칭)
  mcBoards: [
    { id: "MCF-2024-001", alias: "주력 장비", ip: "10.10.1.5",    port: 8080, channels: 64, freq: 5,  firmware: "v2.4.1", state: "connected", note: "영점 정상 · 지연 4 ms" },
    { id: "MCF-2024-002", alias: "보조 장비", ip: "192.168.0.45", port: 8080, channels: 32, freq: 10, firmware: "v2.3.8", state: "warn",      note: "영점 편차 CH 7 · CH 43" },
    { id: "MCF-2024-003", alias: "예비",     ip: "192.168.0.46", port: 8080, channels: 64, freq: 5,  firmware: "v2.4.1", state: "offline",   note: "연결 끊김 (10분 전)" },
  ],
  // [4-3] 탐촉자 64채널 SN — 일부 미등록 (CH 07 등)
  channelSerials: Array.from({ length: 64 }, (_, i) => {
    const num = i + 1;
    if (num === 7)  return { ch: num, sn: "", status: "empty"    };
    if (num >= 9 && num <= 12) return { ch: num, sn: "PXT-2024-" + String(num).padStart(3, "0"), status: "needsCalib" };
    if ([41, 42, 47, 48].includes(num)) return { ch: num, sn: "", status: "empty" };
    return { ch: num, sn: "PXT-2024-" + String(num).padStart(3, "0"), status: "ok" };
  }),
};

// =================== Screen · [0] PROJECT PICKER ===================
// First screen of the app.
window.ProjectPicker = function ProjectPicker({ onPick, onNew, onLoad }) {
  const [query, setQuery] = $s("");
  const projects = window.MOCK.recentProjects;
  const filtered = query
    ? projects.filter(p => p.name.includes(query) || p.place.includes(query))
    : projects;

  const statusColor = (t) =>
    t === "running" ? "var(--content-emphasis)"
    : t === "warn"  ? "var(--system-caution)"
    : "var(--content-low)";
  const statusBorder = (t) =>
    t === "running" ? "var(--border-emphasis)"
    : t === "warn"  ? "var(--system-caution)"
    : "var(--border-medium)";
  const defectColor = (t) =>
    t === "err"  ? "var(--system-error)"
    : t === "warn" ? "var(--system-caution)"
    : "var(--content-high)";

  return (
    <div className="erut-page-enter" style={{ padding: "36px 60px", height: "100%", display: "flex", flexDirection: "column", gap: 24 }}>
      {/* 컴팩트 hero + 우상단 보조 액션 */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div style={{ font: "700 24px/1.2 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-high)" }}>프로젝트를 선택해 주세요.</div>
          <div style={{ font: "400 14px/1.4 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)", marginTop: 6 }}>최근 프로젝트를 클릭하거나, 새 프로젝트를 만들 수 있습니다.</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <window.Button variant="default" size="m" onClick={onLoad}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <window.EIcon.Folder size={14}/>
              <span>파일에서 불러오기</span>
            </span>
          </window.Button>
          <window.Button variant="emphasis" size="m" onClick={onNew}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <window.EIcon.Add size={14}/>
              <span>새 프로젝트 만들기</span>
            </span>
          </window.Button>
        </div>
      </div>

      {/* 최근 프로젝트 패널 */}
      <div style={{ background: "var(--surface-base)", border: "1px solid var(--border-medium)", flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
        {/* 검색 + 헤더 */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 22px", borderBottom: "1px solid var(--border-medium)", background: "var(--surface-subtle-1)" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
            <h3 style={{ font: "700 16px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-high)", margin: 0 }}>최근 프로젝트</h3>
            <span style={{ font: "400 12px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)" }}>총 9개</span>
          </div>
          <window.Field value={query} onChange={setQuery} placeholder="프로젝트명 · 장소 검색" width={320}/>
        </div>

        {/* 카드 그리드 3×3 */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, padding: "18px 22px", flex: 1, overflow: "auto" }}>
          {filtered.map((p, idx) => {
            const featured = idx === 0;
            return (
              <div
                key={p.id}
                className="erut-target-card"
                style={{
                  minHeight: 0, padding: "14px 16px",
                  background: featured ? "linear-gradient(rgba(34,133,239,0.04),rgba(34,133,239,0.04)), var(--surface-base)" : "var(--surface-base)",
                  borderColor: featured ? "var(--border-emphasis)" : "var(--border-medium)",
                }}
                onClick={() => onPick && onPick(p.id)}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <span style={{ padding: "2px 6px", font: "700 9px/1 var(--font-kr)", letterSpacing: ".02em", color: statusColor(p.statusT), border: "1px solid " + statusBorder(p.statusT), background: "var(--surface-base)" }}>{p.status}</span>
                  <span style={{ font: "400 10px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)" }}>{p.time}</span>
                </div>
                <div style={{ font: "700 14px/1.2 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-high)" }}>{p.name}</div>
                <div style={{ font: "400 11px/1.4 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-medium)" }}>{p.place}</div>
                <div style={{ display: "flex", gap: 12, paddingTop: 10, borderTop: "1px solid var(--border-low)", font: "400 11px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)" }}>
                  <span>검사 대상 <strong style={{ fontWeight: 700, color: "var(--content-high)" }}>{p.targets}</strong></span>
                  <span>세션 <strong style={{ fontWeight: 700, color: "var(--content-high)" }}>{p.sessions}</strong></span>
                  <span>결함 <strong style={{ fontWeight: 700, color: defectColor(p.defectT) }}>{p.defects}</strong></span>
                </div>
              </div>
            );
          })}
        </div>

        {/* 더보기 footer */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "12px 22px", borderTop: "1px solid var(--border-low)", background: "var(--surface-subtle-1)" }}>
          <window.Button variant="subtle" size="sm">전체 보기 (총 24개) →</window.Button>
        </div>
      </div>
    </div>
  );
};

// =================== Modal · 새 프로젝트 만들기 ===================
window.NewProjectModal = function NewProjectModal({ onCreate, onClose }) {
  const [form, setForm] = $s({
    name: "", place: "", inspector: "",
    startDate: "2026-05-26", endDate: "",
    industry: "선택 안 함", standard: "선택 안 함",
    code: "", note: "",
  });
  const setField = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const valid = form.name && form.place && form.inspector;

  const footer = (
    <>
      <span style={{ font: "400 11px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)", marginRight: "auto" }}>
        <span style={{ color: "var(--system-error)" }}>*</span> 필수 항목
      </span>
      <window.Button variant="subtle" size="sm" onClick={onClose}>닫기</window.Button>
      <window.Button variant={valid ? "emphasis" : "disabled"} size="sm" onClick={valid ? () => onCreate(form) : undefined}>프로젝트 생성 → [1] 메인</window.Button>
    </>
  );

  const label = (txt, req) => (
    <div style={{ font: "700 11px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-medium)", marginBottom: 4 }}>
      {txt}{req && <span style={{ color: "var(--system-error)", marginLeft: 4 }}>*</span>}
    </div>
  );

  return (
    <window.Modal title="새 프로젝트 만들기" onClose={onClose} footer={footer}>
      {/* 필수 정보 */}
      <div style={{ font: "700 11px/1 var(--font-kr)", letterSpacing: "0.08em", color: "var(--content-low)", textTransform: "uppercase", paddingBottom: 6, borderBottom: "1px solid var(--border-low)" }}>필수 정보</div>
      <div>
        {label("프로젝트명", true)}
        <input className="erut-field" value={form.name} onChange={(e) => setField("name", e.target.value)} placeholder="예: 울산 #2 라인 2026 정기검사" style={{ width: "100%" }}/>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div>
          {label("검사 장소", true)}
          <input className="erut-field" value={form.place} onChange={(e) => setField("place", e.target.value)} placeholder="예: 울산 정유공장 #2 라인" style={{ width: "100%" }}/>
        </div>
        <div>
          {label("담당 검사자", true)}
          <input className="erut-field" value={form.inspector} onChange={(e) => setField("inspector", e.target.value)} placeholder="예: 김검사 (ASNT Lv.II)" style={{ width: "100%" }}/>
        </div>
      </div>

      {/* 선택 정보 */}
      <div style={{ font: "700 11px/1 var(--font-kr)", letterSpacing: "0.08em", color: "var(--content-low)", textTransform: "uppercase", paddingBottom: 6, borderBottom: "1px solid var(--border-low)" }}>선택 정보</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div>
          {label("시작 예정일")}
          <input className="erut-field" value={form.startDate} onChange={(e) => setField("startDate", e.target.value)} style={{ width: "100%" }}/>
        </div>
        <div>
          {label("종료 예정일")}
          <input className="erut-field" value={form.endDate} onChange={(e) => setField("endDate", e.target.value)} placeholder="YYYY-MM-DD" style={{ width: "100%" }}/>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div>
          {label("산업 분류")}
          <select className="erut-field" value={form.industry} onChange={(e) => setField("industry", e.target.value)} style={{ width: "100%" }}>
            <option>선택 안 함</option><option>석유화학</option><option>원전 (SMR 포함)</option><option>수소</option><option>조선</option><option>반도체</option>
          </select>
        </div>
        <div>
          {label("기본 적용 표준")}
          <select className="erut-field" value={form.standard} onChange={(e) => setField("standard", e.target.value)} style={{ width: "100%" }}>
            <option>선택 안 함</option><option>KS B 0817</option><option>ASME Sec.V</option><option>API 510</option><option>NACE MR0175</option>
          </select>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 14 }}>
        <div>
          {label("프로젝트 코드")}
          <input className="erut-field" value={form.code} onChange={(e) => setField("code", e.target.value)} placeholder="사내 관리 코드" style={{ width: "100%" }}/>
        </div>
        <div>
          {label("비고")}
          <input className="erut-field" value={form.note} onChange={(e) => setField("note", e.target.value)} placeholder="자유 입력" style={{ width: "100%" }}/>
        </div>
      </div>
    </window.Modal>
  );
};

// =================== Screen · [1] MAIN ===================
// Layout matches ServiceFlow_Analysis SLIDE 5 [1] 메인 페이지 (v2.0):
//   프로젝트 헤더(통합 패널) + Tab → 장비 연결 상태 패널(3개 mini-card) → 검사 대상 4×2 grid

// Inline SVG thumbnails for inspection targets (80×60, content-medium stroke)
function TargetThumb({ kind }) {
  const STROKE = "var(--content-medium)";
  if (kind === "pipe") return (
    <svg width="80" height="60" viewBox="0 0 80 60" fill="none">
      <ellipse cx="40" cy="10" rx="28" ry="6" stroke={STROKE} strokeWidth="1"/>
      <line x1="12" y1="10" x2="12" y2="50" stroke={STROKE} strokeWidth="1"/>
      <line x1="68" y1="10" x2="68" y2="50" stroke={STROKE} strokeWidth="1"/>
      <ellipse cx="40" cy="50" rx="28" ry="6" stroke={STROKE} strokeWidth="1"/>
      <line x1="12" y1="50" x2="12" y2="56" stroke={STROKE} strokeWidth="1" strokeDasharray="2,2"/>
      <line x1="68" y1="50" x2="68" y2="56" stroke={STROKE} strokeWidth="1" strokeDasharray="2,2"/>
    </svg>
  );
  if (kind === "sphere") return (
    <svg width="80" height="60" viewBox="0 0 80 60" fill="none">
      <circle cx="40" cy="30" r="22" stroke={STROKE} strokeWidth="1"/>
      <ellipse cx="40" cy="30" rx="22" ry="6" stroke={STROKE} strokeWidth="1"/>
    </svg>
  );
  if (kind === "vessel") return (
    <svg width="80" height="60" viewBox="0 0 80 60" fill="none">
      <rect x="14" y="8" width="52" height="44" stroke={STROKE} strokeWidth="1"/>
      <line x1="14" y1="20" x2="66" y2="20" stroke={STROKE} strokeWidth="0.5"/>
      <line x1="14" y1="32" x2="66" y2="32" stroke={STROKE} strokeWidth="0.5"/>
      <line x1="14" y1="44" x2="66" y2="44" stroke={STROKE} strokeWidth="0.5"/>
    </svg>
  );
  if (kind === "flange") return (
    <svg width="80" height="60" viewBox="0 0 80 60" fill="none">
      <rect x="20" y="12" width="40" height="40" stroke={STROKE} strokeWidth="1"/>
      <circle cx="40" cy="32" r="14" stroke={STROKE} strokeWidth="0.5"/>
    </svg>
  );
  if (kind === "dome") return (
    <svg width="80" height="60" viewBox="0 0 80 60" fill="none">
      <ellipse cx="40" cy="30" rx="32" ry="14" stroke={STROKE} strokeWidth="1"/>
      <line x1="8" y1="30" x2="72" y2="30" stroke={STROKE} strokeWidth="0.5"/>
    </svg>
  );
  if (kind === "weld") return (
    <svg width="80" height="60" viewBox="0 0 80 60" fill="none">
      <rect x="10" y="18" width="60" height="24" stroke={STROKE} strokeWidth="1"/>
      <line x1="10" y1="30" x2="70" y2="30" stroke={STROKE} strokeWidth="0.5" strokeDasharray="2,2"/>
    </svg>
  );
  return null;
}

// Tiny LED dot (matches .erut-led usage in main)
function MiniLed({ color }) {
  return (
    <span className={"erut-led " + (color === "green" ? "is-green" : "is-red")} style={{ width: 8, height: 8 }}>
      <span className="erut-led__halo"/>
      <span className="erut-led__dot"/>
    </span>
  );
}

// Mini status pill (for "연결됨" / "측정 중" / "대기" / "오프라인" / "연결 끊김")
function MiniPill({ children, tone = "neutral", ledColor }) {
  const base = { padding: "2px 8px", font: "700 11px/1 var(--font-kr)", letterSpacing: ".02em", display: "inline-flex", alignItems: "center", gap: 6 };
  const palette = {
    neutral: { color: "var(--content-low)",    border: "1px solid var(--border-medium)", background: "transparent" },
    emphasis:{ color: "var(--content-emphasis)", border: "1px solid var(--border-emphasis)", background: "linear-gradient(rgba(34,133,239,0.12),rgba(34,133,239,0.12)), var(--surface-subtle-2)" },
    error:   { color: "var(--system-error)",   border: "1px solid var(--system-error)",   background: "transparent" },
    pillLED: { color: "var(--content-high)",   border: "1px solid var(--border-medium)",  background: "var(--surface-base)" },
  };
  return (
    <span style={{ ...base, ...palette[tone] }}>
      {ledColor && <MiniLed color={ledColor}/>}
      {children}
    </span>
  );
}

window.MainScreen = function MainScreen({ onAddDevice, onOpenDevice, onChangeProject }) {
  const proj = window.MOCK.project;
  const devices = window.MOCK.devices;

  // 장비 패널 헤더 요약 카운터
  const connectedCount = devices.filter(d => d.state !== "offline").length;
  const measuringCount = devices.filter(d => d.state === "measuring").length;
  const activeChTotal  = devices.reduce((s, d) => s + (d.activeCh || 0), 0);
  const totalChTotal   = devices.reduce((s, d) => s + d.totalCh, 0);

  // 각 장비 mini-card 렌더링
  function renderDeviceCard(d) {
    const isMeasuring = d.state === "measuring";
    const isOffline   = d.state === "offline";

    // v9.11: 측정 중 카드 — hover-like 톤(surface-subtle-2 lift). brand wash + emphasis border 제거
    const cardStyle = isMeasuring
      ? { border: "1px solid var(--border-medium)", background: "var(--surface-subtle-2)", padding: "12px 14px" }
      : isOffline
        ? { border: "1px solid var(--border-medium)", background: "var(--surface-subtle-1)", padding: "12px 14px" }
        : { border: "1px solid var(--border-medium)", background: "var(--surface-base)", padding: "12px 14px" };

    return (
      <div key={d.id} style={cardStyle}>
        {/* v9.11: 상단 — 연결 상태 pill만 유지. 측정 중/대기/오프라인 badge 삭제 (좌하단 액션 버튼으로 인지) */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ font: "700 14px/1 var(--font-kr)", letterSpacing: ".02em", color: isOffline ? "var(--content-medium)" : "var(--content-high)" }}>{d.id}</div>
            <div style={{ font: "400 11px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)", marginTop: 4 }}>IP&nbsp;:&nbsp;{d.ip}</div>
          </div>
          <MiniPill tone="pillLED" ledColor={isOffline ? "red" : "green"}>{isOffline ? "연결 끊김" : "연결됨"}</MiniPill>
        </div>
        {/* 중단: 활성 채널 + 데이터율/마지막 통신 */}
        <div style={{ display: "flex", gap: 18, padding: "10px 0 8px", marginTop: 10, borderTop: "1px solid var(--border-low)" }}>
          <div>
            <div style={{ font: "400 10px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)", marginBottom: 4 }}>활성 채널</div>
            <div style={{ font: "700 16px/1 var(--font-kr)", letterSpacing: ".02em", color: isMeasuring ? "var(--content-emphasis)" : isOffline ? "var(--content-low)" : "var(--content-medium)" }}>
              {d.activeCh != null ? d.activeCh : "—"}
              <span style={{ fontSize: 11, color: "var(--content-low)", fontWeight: 400 }}>&nbsp;/&nbsp;{d.totalCh} CH</span>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ font: "400 10px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)", marginBottom: 4 }}>
              {isOffline ? "마지막 통신" : "데이터율"}
            </div>
            <div style={{ font: isOffline ? "700 12px/1 var(--font-kr)" : "700 14px/1 var(--font-kr)", letterSpacing: ".02em", color: isOffline ? "var(--system-error)" : "var(--content-medium)" }}>
              {d.dataRate || d.lastComm || "—"}
            </div>
          </div>
        </div>
        {/* 하단: 액션 버튼 */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
          {isMeasuring && (
            <button className="erut-btn erut-btn--default erut-btn--sm" style={{ background: "var(--system-error)", color: "var(--on-primary)", borderColor: "var(--system-error)", display: "inline-flex", alignItems: "center", gap: 4 }}>
              <svg viewBox="0 0 12 12" width="9" height="9" fill="currentColor"><rect x="2" y="2" width="8" height="8"/></svg>
              중지
            </button>
          )}
          {d.state === "idle" && (
            <button className="erut-btn erut-btn--emphasis erut-btn--sm" style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
              <svg viewBox="0 0 12 12" width="9" height="9" fill="currentColor"><polygon points="3,2 10,6 3,10"/></svg>
              시작
            </button>
          )}
          {isOffline && (
            <button className="erut-btn erut-btn--default erut-btn--sm">재연결</button>
          )}
          <button className="erut-btn erut-btn--subtle erut-btn--sm" onClick={onOpenDevice}>상세 →</button>
        </div>
      </div>
    );
  }

  return (
    <div className="erut-page-enter" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* v8.5 Breadcrumb */}
      <window.Breadcrumb
        onBack={onChangeProject}
        items={[
          { label: "프로젝트 (" + proj.name + ")" },
          { label: "메인", current: true },
        ]}
        style={{ margin: "20px 40px 16px" }}
      />

      {/* ▼ 프로젝트 헤더 + Tab (통합 패널) ▼ */}
      <div style={{ background: "var(--surface-subtle-1)", borderBottom: "1px solid var(--border-medium)", padding: "14px 40px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 12 }}>
          <div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
              <span style={{ font: "400 12px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)" }}>프로젝트</span>
              <span style={{ font: "700 16px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-high)" }}>{proj.name}</span>
              <button className="erut-btn erut-btn--subtle erut-btn--sm" onClick={onChangeProject}>변경 ↗</button>
            </div>
            <div style={{ font: "400 11px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)", marginTop: 6 }}>
              담당자 {proj.owner} · 마지막 저장 {proj.savedAt}{proj.autoSave ? " · 자동 저장 활성" : ""}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button className="erut-btn erut-btn--default erut-btn--sm">프로젝트 저장</button>
          </div>
        </div>
        {/* Tab */}
        <div style={{ display: "flex", gap: 0, marginTop: 8 }}>
          <button style={{ padding: "10px 24px", font: "700 14px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-emphasis)", background: "var(--surface-base)", border: "1px solid var(--border-medium)", borderBottom: "1px solid var(--surface-base)", marginBottom: -1, cursor: "pointer" }}>고정형 장비</button>
          <button style={{ padding: "10px 24px", font: "700 14px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)", background: "transparent", border: "none", cursor: "not-allowed", display: "inline-flex", alignItems: "center", gap: 6 }}>
            이동형 장비
            <span style={{ padding: "2px 6px", font: "700 10px/1 var(--font-kr)", color: "var(--content-low)", border: "1px solid var(--border-medium)", background: "var(--surface-subtle-2)" }}>준비 중</span>
          </button>
        </div>
      </div>

      {/* ▼ Tab 콘텐츠 (고정형 활성) ▼ */}
      <div style={{ padding: "20px 40px", flex: 1, overflow: "auto" }}>
        {/* ▼ 장비 연결 상태 패널 ▼ */}
        <div style={{ background: "var(--surface-base)", border: "1px solid var(--border-medium)", padding: "14px 18px", marginBottom: 20 }}>
          {/* 헤더 라인 (요약 카운터) */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
              <h3 style={{ font: "700 16px/1.2 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-high)", margin: 0 }}>연결된 장비</h3>
              <span style={{ font: "400 12px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)" }}>총 {devices.length}대 등록</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ font: "400 12px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-medium)" }}>연결 <strong style={{ fontWeight: 700, color: "var(--system-success)" }}>{connectedCount}</strong> / {devices.length}대</span>
              <span style={{ width: 1, height: 12, background: "var(--border-medium)" }}/>
              <span style={{ font: "400 12px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-medium)" }}>측정 중 <strong style={{ fontWeight: 700, color: "var(--brand-primary)" }}>{measuringCount}</strong>대</span>
              <span style={{ width: 1, height: 12, background: "var(--border-medium)" }}/>
              <span style={{ font: "400 12px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-medium)" }}>활성 채널 <strong style={{ fontWeight: 700, color: "var(--brand-primary)" }}>{activeChTotal}</strong> / {totalChTotal}</span>
              <button className="erut-btn erut-btn--default erut-btn--sm" style={{ marginLeft: 8 }} onClick={onAddDevice}>+ 장비 추가</button>
            </div>
          </div>
          {/* 3 장비 mini-card grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
            {devices.map(renderDeviceCard)}
          </div>
        </div>

        {/* v8.5: 검사 대상 그리드 삭제 — MC보드 자산 중심 모델 */}
        {/* 검사 대상은 [2] 장비 상세에서 MC보드별로 표시. MC보드 카드 "상세 →" 클릭 → [2] 진입. */}
      </div>
    </div>
  );
};

// =================== Screen · [2] DEVICE DETAIL ===================
window.DeviceDetail = function DeviceDetail({ targetId, focusChannel, onBack, onStartMeasure, onOpenGate, onAddTarget, onEditTarget }) {
  const target = window.MOCK.targets.find(t => t.id === targetId) || window.MOCK.targets[0];
  const sensorMap = Object.fromEntries(window.MOCK.sensors.map(s => [s.id, s]));
  const [selected, setSelected] = $s(focusChannel || "ch01");
  const [focusActive, setFocusActive] = $s(!!focusChannel);
  const [showAddSensor, setShowAddSensor] = $s(false);
  const [showCalibration, setShowCalibration] = $s(false);
  const [showDiagnostics, setShowDiagnostics] = $s(false);
  // v9.0 (NDT 1.7): 검사 대상 카드 선택 (결함 채널 강조용). null=no selection. 외부 targetId와 분리
  const [selectedTargetCard, setSelectedTargetCard] = $s(null);

  React.useEffect(() => {
    if (focusChannel) {
      setSelected(focusChannel);
      setFocusActive(true);
      const t = setTimeout(() => setFocusActive(false), 1300);
      return () => clearTimeout(t);
    }
  }, [focusChannel]);

  // v9.1 (NDT 1.7): 카드 외부 클릭 또는 ESC 키 시 카드 선택 해제 (셀 강조도 함께 해제)
  React.useEffect(() => {
    if (!selectedTargetCard) return;
    const handleKey = (e) => { if (e.key === "Escape") setSelectedTargetCard(null); };
    const handleClickOutside = (e) => {
      if (!e.target.closest || !e.target.closest(".target-card-v9")) setSelectedTargetCard(null);
    };
    document.addEventListener("keydown", handleKey);
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [selectedTargetCard]);

  const cur = sensorMap[selected] || window.MOCK.sensors[0];
  const isCurWarn = cur.state === "warn";

  // 32 cells (4 rows × 8 cols). First 8 map to real sensors.
  // v8.8: 64채널 다중 검사체 분산 부착 — ch01-24 PIPE-A-204 · ch25-48 TANK-B-101 · ch49-64 VESSEL-C-301
  const getTargetName = (i) => i <= 24 ? "PIPE-A-204" : i <= 48 ? "TANK-B-101" : "VESSEL-C-301";
  // v9.0 (NDT 1.7): 결함 검출 채널 (mockup) — Critical=red+breathing / Major=orange / Minor=gray
  const DEFECT_CHANNELS = { 4: "critical", 7: "major", 56: "minor" };
  const cells = [];
  for (let i = 1; i <= 64; i++) {
    const id = "ch" + String(i).padStart(2, "0");
    cells.push({ id, sensor: sensorMap[id], targetName: getTargetName(i), defectLevel: DEFECT_CHANNELS[i] || null });
  }

  // v9.0 (NDT 1.7): 검사 대상 데이터 (결함 정보 포함)
  const TARGETS = [
    { name: "PIPE-A-204",   meta: "탄소강 · 외경 300mm · 두께 10mm",     range: "ch01–24 · 24ch", defectCount: 2, topLevel: "critical" },
    { name: "TANK-B-101",   meta: "SS 304 · 구형 · ∅ 1500mm · 두께 6mm",   range: "ch25–48 · 24ch", defectCount: 0, topLevel: null },
    { name: "VESSEL-C-301", meta: "압력 용기 · 800 × 400mm · 두께 12mm",  range: "ch49–64 · 16ch", defectCount: 1, topLevel: "minor" },
  ];
  // 결함 등급별 색 매핑
  const DEFECT_COLOR = { critical: "var(--system-error)", major: "var(--system-caution)", minor: "var(--content-low)" };
  // 카드 클릭 핸들러 (같은 카드 재클릭 = 현상 유지)
  const onTargetCardClick = (name) => { if (selectedTargetCard !== name) setSelectedTargetCard(name); };

  const okCount       = window.MOCK.sensors.filter(s => s.state === "ok").length;
  const warnCount     = window.MOCK.sensors.filter(s => s.state === "warn").length;
  const errCount      = window.MOCK.sensors.filter(s => s.state === "err").length;
  const inactiveCount = 64 - window.MOCK.sensors.length;

  // v8.8: 메타 정보 stripe 7-col → 4-col 축소. Config/샘플링/펌웨어는 진단/로그 모달로 이동
  const META = [
    { label: "SN (시리얼)",   value: "MCF-2024-001" },
    { label: "IP 주소",       value: "192.168.1.100" },
    { label: "활성 채널",     value: "32 / 64 CH", emphasis: true },
    { label: "마지막 통신",   value: "실시간 (0.3s)", success: true },
  ];

  return (
    <div className="erut-page-enter" style={{ display: "grid", gridTemplateColumns: "1fr 400px", gridTemplateRows: "40px 1fr", alignContent: "start", columnGap: 20, rowGap: 20, padding: "20px 40px", height: "100%" }}>
      {/* v8.5 Breadcrumb */}
      <window.Breadcrumb
        onBack={onBack}
        items={[
          { label: "메인" },
          { label: "장비 상세 (MCuF-001)", current: true },
        ]}
        style={{ gridRow: 1, gridColumn: "1 / -1" }}
      />

      {/* ───── 좌측: MC보드 정보 + 센서 그리드 ───── */}
      <div style={{ gridRow: 2, gridColumn: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        {/* ▼ MC보드 메타 정보 패널 (main 매칭) — v8.7: fill 제거, 검사 대상 목록 통합 ▼ */}
        <div style={{ background: "transparent", border: "1px solid var(--border-medium)", padding: "12px 16px", marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
              <span style={{ font: "700 14px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-high)" }}>MCuF-001</span>
              <span className="erut-pill" style={{ padding: "2px 8px", fontSize: 11, lineHeight: 1 }}>
                <span className="erut-led is-green" style={{ width: 8, height: 8 }}><span className="erut-led__halo"/><span className="erut-led__dot"/></span>
                연결됨
              </span>
              <span className="erut-pill" style={{ padding: "2px 8px", fontSize: 11, lineHeight: 1, background: "linear-gradient(rgba(34,133,239,0.12),rgba(34,133,239,0.12)), var(--surface-subtle-2)", color: "var(--content-emphasis)", borderColor: "var(--border-emphasis)" }}>
                <span className="erut-led is-green" style={{ width: 8, height: 8 }}><span className="erut-led__halo"/><span className="erut-led__dot"/></span>
                측정 중
              </span>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="erut-btn erut-btn--default erut-btn--sm" onClick={() => setShowDiagnostics(true)}>진단 / 로그</button>
            </div>
          </div>
          {/* v8.8: 메타 정보 4-col stripe (Config/샘플링/펌웨어는 진단/로그 모달로 이동) */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, paddingTop: 10, borderTop: "1px solid var(--border-low)" }}>
            {META.map((m) => (
              <div key={m.label}>
                <div style={{ font: "400 10px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)", marginBottom: 4 }}>{m.label}</div>
                <div style={{
                  font: "700 12px/1 var(--font-kr)", letterSpacing: ".02em",
                  color: m.emphasis ? "var(--content-emphasis)" : m.success ? "var(--system-success)" : m.link ? "var(--content-emphasis)" : "var(--content-high)",
                  textDecoration: m.link ? "underline" : "none",
                  cursor: m.link ? "pointer" : "default",
                }}>{m.value}</div>
              </div>
            ))}
          </div>

          {/* v8.7: 검사 대상 목록을 MC보드 정보 컨테이너 안으로 통합 */}
          <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--border-low)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                <span style={{ font: "700 11px/1 var(--font-kr)", letterSpacing: "0.08em", color: "var(--content-low)", textTransform: "uppercase" }}>검사 대상</span>
                <span style={{ font: "400 11px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)" }}>3개 · 채널 모두 할당</span>
              </div>
              <button className="erut-btn erut-btn--default erut-btn--sm" onClick={onAddTarget}>+ 검사 대상 추가</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
              {/* v9.0 (NDT 1.7): 결함 표시 + 카드 클릭 인터랙션 */}
              {TARGETS.map(t => {
                const isSelected = selectedTargetCard === t.name;
                const isDimmed = selectedTargetCard && !isSelected;
                const hasDefect = t.defectCount > 0;
                const defectColor = hasDefect ? DEFECT_COLOR[t.topLevel] : null;
                return (
                  <div
                    key={t.name}
                    className="target-card target-card-v9"
                    title={hasDefect ? "클릭하여 결함 영역에 부착된 센서를 확인할 수 있습니다." : undefined}
                    onClick={() => onTargetCardClick(t.name)}
                    style={{
                      position: "relative",
                      cursor: "pointer",
                      opacity: isDimmed ? 0.6 : 1,
                      transition: "opacity 120ms ease",
                      borderColor: isSelected ? "var(--border-emphasis)" : (defectColor || undefined),
                      background: isSelected ? "linear-gradient(rgba(34,133,239,0.10),rgba(34,133,239,0.10)), var(--surface-subtle-2)" : undefined,
                    }}
                  >
                    {hasDefect && (
                      <span style={{
                        position: "absolute", top: 8, right: 8,
                        font: "700 10px/1 var(--font-kr)", letterSpacing: ".02em",
                        padding: "4px 8px", color: "var(--on-primary)",
                        background: defectColor,
                      }}>결함 {t.defectCount}건 검출</span>
                    )}
                    <div className="target-card__name">{t.name}</div>
                    <div className="target-card__meta">{t.meta}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 2 }}>
                      <span className="target-card__range">{t.range}</span>
                      <span style={{ font: "700 11px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--system-success)", display: "inline-flex", alignItems: "center", gap: 4 }}>
                        <span style={{ width: 6, height: 6, background: "var(--system-success)", borderRadius: "50%" }}/>측정 중
                      </span>
                    </div>
                    {/* hover 시 우하단 "편집 →" 링크 */}
                    <span className="target-card__edit-link" style={{
                      position: "absolute", bottom: 6, right: 10,
                      font: "700 10px/1 var(--font-kr)", letterSpacing: ".02em",
                      color: "var(--content-emphasis)", textDecoration: "underline",
                    }} onClick={(e) => { e.stopPropagation(); onEditTarget && onEditTarget(t.name); }}>편집 →</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* v9.9: 1행 = h3 + 우측 서브 안내 + 우측 끝 버튼 / 2행 = 카운터 좌측 정렬 */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
            <h3 style={{ font: "700 15px/1.2 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-high)", margin: 0 }}>64CH 채널 상태</h3>
            <span style={{ font: "400 12px/1.4 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)" }}>더블 클릭 → 우측 패널 A-scan 확대</span>
          </div>
          <button className="erut-btn erut-btn--emphasis erut-btn--sm" onClick={() => setShowAddSensor(true)}>+ 센서 추가</button>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-start", gap: 10, marginBottom: 8, font: "700 11px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--system-success)" }}/>정상 {okCount}</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--system-caution)" }}/>약함 {warnCount}</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--system-error)" }}/>미부착 {errCount}</span>
        </div>
        <window.ChannelGrid
          cells={cells}
          totalCh={64}
          selectedCh={selected}
          selectedTargetCard={selectedTargetCard}
          variant="device-detail"
          forceStrongAll={false}
          focusActive={focusActive}
          showTitle={false}
          showAttachCounters={false}
          onCellClick={(id) => setSelected(id)}
          onCellDoubleClick={(id) => onStartMeasure && onStartMeasure(id)}
        />

        {/* deep link 안내 박스 (셀 그리드 동작 보존) */}
        {focusChannel && (
          <div style={{ marginTop: 12, padding: "8px 12px", background: "linear-gradient(rgba(34,133,239,0.06),rgba(34,133,239,0.06)), var(--surface-base)", borderLeft: "3px solid var(--brand-primary)", font: "400 12px/1.5 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-medium)" }}>
            <strong style={{ color: "var(--brand-primary)" }}>[1-1] 대시보드 → {focusChannel} deep link 진입</strong>. 해당 채널이 자동 강조되었습니다. 우측 패널에서 신호를 검토하고 임계값 조정 시 <strong>[3] Gate 설정</strong>으로 이동하세요.
          </div>
        )}
      </div>

      {/* ───── 우측 사이드패널 (main 매칭) ───── */}
      <div className="erut-panel" style={{ gridRow: 2, gridColumn: 2, minWidth: 0 }}>
        <div className="erut-panel__header">{selected.toUpperCase().replace("CH","CH ")}</div>
        <div className="erut-panel__body" style={{ overflowY: "auto", padding: 16, display: "flex", flexDirection: "column" }}>

          {/* v8.8: 채널 메타 한 줄 이동 — 측정 통계 컨테이너 하단으로 (아래로 옮김) */}

          {/* A-SCAN 미리보기 */}
          <div style={{ marginTop: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <div style={{ font: "700 11px/1 var(--font-kr)", letterSpacing: "0.08em", color: "var(--content-low)", textTransform: "uppercase" }}>A-SCAN</div>
              <div style={{ font: "400 10px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)" }}>0 – 100 μs · Gate A · Gate B</div>
            </div>
            <div style={{ background: "var(--surface-base)", border: "1px solid var(--border-medium)", height: 200, position: "relative" }}>
              {/* Gate A (적색) */}
              <div style={{ position: "absolute", top: 0, bottom: 0, left: "18%", width: "22%", background: "var(--system-error)", opacity: 0.10, borderLeft: "2px solid var(--system-error)", borderRight: "2px solid var(--system-error)" }}/>
              <div style={{ position: "absolute", top: 4, left: "19%", font: "700 9px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--system-error)" }}>Gate A</div>
              {/* Gate B (브랜드) */}
              <div style={{ position: "absolute", top: 0, bottom: 0, left: "55%", width: "25%", background: "var(--brand-primary)", opacity: 0.10, borderLeft: "2px solid var(--brand-primary)", borderRight: "2px solid var(--brand-primary)" }}/>
              <div style={{ position: "absolute", top: 4, left: "56%", font: "700 9px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--brand-primary)" }}>Gate B</div>
              {/* Threshold 라인 */}
              <div style={{ position: "absolute", left: 0, right: 0, top: "35%", borderTop: "1px dashed var(--content-low)" }}/>
              <div style={{ position: "absolute", right: 4, top: "32%", font: "400 9px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)" }}>Threshold 50%</div>
              {/* v8.6: 정적 파형 SVG (애니메이션 제거) */}
              <svg viewBox="0 0 300 200" preserveAspectRatio="none" width="100%" height="100%" style={{ position: "absolute", top: 0, left: 0 }}>
                <line x1="0" y1="170" x2="300" y2="170" stroke="var(--border-low)" strokeWidth="1"/>
                <path
                  d={isCurWarn
                    ? "M0 170 L50 170 L60 145 L66 25 L72 180 L78 170 L155 170 L165 150 L171 60 L177 180 L183 170 L300 170"
                    : "M0 170 L50 170 L60 165 L70 20 L80 178 L90 168 L155 168 L165 140 L172 60 L180 175 L188 168 L300 168"}
                  stroke={isCurWarn ? "var(--system-caution)" : "var(--brand-primary)"}
                  strokeWidth="1.5"
                  fill="none"
                />
              </svg>
            </div>
          </div>

          {/* 측정 통계 (2×2 grid) */}
          <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 12px", padding: 12, background: "var(--surface-subtle-2)", border: "1px solid var(--border-low)" }}>
            <div>
              <div style={{ font: "400 10px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)", marginBottom: 4 }}>Gate A 피크 진폭</div>
              <div style={{ font: "700 14px/1 var(--font-kr)", letterSpacing: ".02em", color: isCurWarn ? "var(--system-error)" : "var(--content-high)" }}>
                {cur.amp}% <span style={{ fontSize: 10, color: "var(--content-low)", fontWeight: 400 }}>FSH</span>
              </div>
            </div>
            <div>
              <div style={{ font: "400 10px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)", marginBottom: 4 }}>Gate A 비행시간 (ToF)</div>
              <div style={{ font: "700 14px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-high)" }}>
                {cur.tof} <span style={{ fontSize: 10, color: "var(--content-low)", fontWeight: 400 }}>μs</span>
              </div>
            </div>
            <div>
              <div style={{ font: "400 10px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)", marginBottom: 4 }}>두께 환산</div>
              <div style={{ font: "700 14px/1 var(--font-kr)", letterSpacing: ".02em", color: isCurWarn ? "var(--system-caution)" : "var(--content-high)" }}>
                {cur.thickness.toFixed(2)} <span style={{ fontSize: 10, color: "var(--content-low)", fontWeight: 400 }}>mm</span>
              </div>
            </div>
            <div>
              <div style={{ font: "400 10px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)", marginBottom: 4 }}>DAC 대비</div>
              <div style={{ font: "700 14px/1 var(--font-kr)", letterSpacing: ".02em", color: isCurWarn ? "var(--system-caution)" : "var(--content-medium)" }}>
                {isCurWarn ? "+2 dB" : "0 dB"}
              </div>
            </div>
          </div>

          {/* v8.8: 채널 메타 한 줄 (측정 통계 컨테이너 하단으로 이동) */}
          <div style={{ font: "400 12px/1.7 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-medium)", padding: "12px 0 0", marginTop: 12, borderTop: "1px solid var(--border-low)" }}>
            주파수 5 MHz · Gain 28 dB · Pulser 200V<br/>
            영점 정상 · 마지막 측정 {cur.age}
          </div>

          {/* 액션 버튼 (사이드패널 하단) */}
          <button className="erut-btn erut-btn--default erut-btn--m" style={{ width: "100%", marginTop: 12 }} onClick={() => onOpenGate && onOpenGate(selected)}>[3] Gate 설정 →</button>
          <button className="erut-btn erut-btn--emphasis erut-btn--m" style={{ width: "100%", marginTop: 8 }} onClick={() => onStartMeasure && onStartMeasure(selected)}>[11] 실시간 전체 화면 ↗</button>
        </div>
      </div>

      {/* v8.11: "+ 센서 추가" 모달 — 메인 기획과 동일 (채널 번호 select · 교정 토글 · 3 버튼 푸터) */}
      {showAddSensor && (
        <window.Modal title="센서 채널 추가 — MCF-2024-001" onClose={() => setShowAddSensor(false)}
          footer={(
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
              <a style={{ font: "700 11px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-emphasis)", textDecoration: "underline", cursor: "pointer" }}>
                여러 채널 일괄 등록 / 관리 → [4-3] 탐촉자 설정
              </a>
              <div style={{ display: "flex", gap: 6 }}>
                <button className="erut-btn erut-btn--subtle erut-btn--sm" onClick={() => setShowAddSensor(false)}>닫기</button>
                <button className="erut-btn erut-btn--default erut-btn--sm" onClick={() => setShowAddSensor(false)}>추가만</button>
                <button className="erut-btn erut-btn--emphasis erut-btn--sm" onClick={() => { setShowAddSensor(false); setShowCalibration(true); }}>추가 + 교정</button>
              </div>
            </div>
          )}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 12, minWidth: 480 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <div style={{ font: "700 11px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-medium)", marginBottom: 4 }}>채널 번호 <span style={{ color: "var(--system-error)" }}>*</span></div>
                <select className="erut-field" style={{ width: "100%" }}>
                  <option>65 (다음 빈 슬롯 자동 할당)</option>
                  <option>16 (현재 미등록)</option>
                  <option>직접 입력...</option>
                </select>
              </div>
              <div>
                <div style={{ font: "700 11px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-medium)", marginBottom: 4 }}>Serial 번호 (SN) <span style={{ color: "var(--system-error)" }}>*</span></div>
                <input className="erut-field" placeholder="예: PXT-2024-065" style={{ width: "100%" }}/>
              </div>
            </div>
            <window.Toggle checked={true} size="sm" label="추가 직후 교정 마법사 자동 실행 (영점·음속·감도)"/>
          </div>
        </window.Modal>
      )}

      {/* v8.10: 등록 후 교정 마법사 자동 트리거 */}
      {showCalibration && <window.CalibrationWizard onClose={() => setShowCalibration(false)}/>}

      {/* v8.8: 진단 / 로그 모달 */}
      {showDiagnostics && <window.DiagnosticsModal onClose={() => setShowDiagnostics(false)}/>}
    </div>
  );
};

// =================== v8.8: 진단 / 로그 모달 (좌측 탭 메뉴 + 우측 콘텐츠) ===================
window.DiagnosticsModal = function DiagnosticsModal({ onClose }) {
  const [tab, setTab] = $s("hw"); // hw / err / conn / meas / calib
  // v8.8: 에러 로그를 2번째 위치로 이동
  const tabs = [
    { id: "hw",    label: "하드웨어 진단" },
    { id: "err",   label: "에러 로그", badge: 2 },
    { id: "conn",  label: "연결 로그" },
    { id: "meas",  label: "측정 로그" },
    { id: "calib", label: "교정 이력" },
  ];
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(10,28,60,0.55)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: 1100, maxHeight: "90vh", background: "var(--surface-base)", border: "1px solid var(--border-medium)", display: "flex", flexDirection: "column" }}>
        {/* v8.8: 헤더 — titlebar 컬러 통일 */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 18px", borderBottom: "1px solid var(--border-medium)", background: "var(--content-medium)" }}>
          <div style={{ font: "700 16px/1.2 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-inverse)" }}>진단 / 로그 — MCuF-001</div>
          <button onClick={onClose} aria-label="닫기" style={{ background: "transparent", border: "none", color: "var(--content-inverse)", cursor: "pointer", padding: 4, display: "inline-flex", alignItems: "center", justifyContent: "center" }}><window.EIcon.Close size={14}/></button>
        </div>
        {/* 본문 (좌: 탭 메뉴 / 우: 콘텐츠) */}
        <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", minHeight: 480 }}>
          {/* 좌측 탭 메뉴 */}
          <div style={{ background: "var(--surface-subtle-1)", borderRight: "1px solid var(--border-medium)", padding: "8px 0" }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%",
                padding: "10px 16px", textAlign: "left",
                font: "700 12px/1 var(--font-kr)", letterSpacing: ".02em",
                color: tab === t.id ? "var(--content-emphasis)" : "var(--content-medium)",
                background: tab === t.id ? "linear-gradient(rgba(34,133,239,0.10),rgba(34,133,239,0.10)), var(--surface-base)" : "transparent",
                border: "none", borderLeft: tab === t.id ? "3px solid var(--brand-primary)" : "3px solid transparent",
                cursor: "pointer"
              }}>
                <span>{t.label}</span>
                {t.badge && <span style={{ font: "700 10px/1 var(--font-kr)", padding: "2px 6px", background: "var(--system-error)", color: "var(--on-primary)" }}>{t.badge}</span>}
              </button>
            ))}
          </div>
          {/* 우측 콘텐츠 (탭별) */}
          <div style={{ padding: "18px 24px", overflowY: "auto" }}>
            {tab === "hw" && <DiagHardware/>}
            {tab === "err" && <DiagLogPlaceholder title="에러 로그" desc="오류 코드 · timestamp · 채널/원인 · 해결 여부 (검색·필터 가능)"/>}
            {tab === "conn" && <DiagLogPlaceholder title="연결 로그" desc="MC보드 연결/해제·timeout·IP 변경 이력 (시계열 테이블)"/>}
            {tab === "meas" && <DiagLogPlaceholder title="측정 로그" desc="세션 시작/종료·일시정지/재개·데이터 전송 오류 (시계열 테이블)"/>}
            {tab === "calib" && <DiagLogPlaceholder title="교정 이력" desc="채널별 영점·음속·감도 교정 이력 + 다음 권장 교정 시점"/>}
          </div>
        </div>
        {/* v8.8: footer — 닫기 단일 버튼 (다른 모달과 일관성) */}
        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", padding: "12px 18px", borderTop: "1px solid var(--border-medium)", background: "var(--surface-subtle-1)" }}>
          <button className="erut-btn erut-btn--default erut-btn--sm" onClick={onClose}>닫기</button>
        </div>
      </div>
    </div>
  );
};

// 하드웨어 진단 탭 콘텐츠
function DiagHardware() {
  const cards = [
    { label: "CPU 사용률",   value: "42",  unit: "%",      status: "정상",          tone: "success" },
    { label: "메모리 사용량", value: "512", unit: "/ 2048 MB", status: "정상 (25%)", tone: "success" },
    { label: "네트워크 지연", value: "4",   unit: "ms",     status: "정상 (Wi-Fi/LAN)", tone: "success" },
    { label: "패킷 손실",     value: "0.3", unit: "%",      status: "경계 (1% 이상 경고)", tone: "caution" },
  ];
  const toneColor = (t) => t === "success" ? "var(--system-success)" : t === "caution" ? "var(--system-caution)" : "var(--system-error)";
  // v8.8: Config 파일 항목 추가 ([2] 메타 stripe에서 이동)
  const info = [
    ["시리얼 (SN)", "MCF-2024-001"],
    ["펌웨어", "v2.1.4 (2026-04-18)"],
    ["하드웨어 리비전", "REV-C"],
    ["제조일", "2024-03-12"],
    ["샘플링 속도", "32,000 /s"],
    ["최대 채널 수", "64 ch"],
    ["IP 주소", "192.168.1.100 : 8080"],
    ["MAC 주소", "B8:27:EB:1F:4C:A2"],
    ["Config 파일", "default.cfg ↗", "link"],
  ];
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 }}>
        <h3 style={{ font: "700 16px/1.2 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-high)", margin: 0 }}>하드웨어 진단</h3>
        <button className="erut-btn erut-btn--default erut-btn--sm">진단 다시 실행</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 18 }}>
        {cards.map(c => (
          <div key={c.label} style={{ background: "var(--surface-subtle-2)", border: "1px solid var(--border-medium)", borderLeft: "3px solid " + toneColor(c.tone), padding: "10px 12px" }}>
            <div style={{ font: "400 10px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)", marginBottom: 6, textTransform: "uppercase" }}>{c.label}</div>
            <div style={{ font: "700 18px/1 var(--font-kr)", color: "var(--content-high)" }}>{c.value} <span style={{ fontSize: 11, color: "var(--content-low)", fontWeight: 400 }}>{c.unit}</span></div>
            <div style={{ font: "400 10px/1.3 var(--font-kr)", color: toneColor(c.tone), marginTop: 4 }}>{c.status}</div>
          </div>
        ))}
      </div>
      <h4 style={{ font: "700 13px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-high)", margin: "0 0 10px" }}>시스템 정보</h4>
      <div style={{ border: "1px solid var(--border-low)", padding: "12px 14px", display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px 24px", font: "400 12px/1.4 var(--font-kr)", letterSpacing: ".02em" }}>
        {info.map(([k, v, type]) => (
          <div key={k} style={type === "link" ? { gridColumn: "1 / -1" } : undefined}>
            <span style={{ color: "var(--content-low)" }}>{k}</span>{" "}
            <strong style={{ fontWeight: 700, color: type === "link" ? "var(--content-emphasis)" : "var(--content-high)", textDecoration: type === "link" ? "underline" : "none", cursor: type === "link" ? "pointer" : "default" }}>{v}</strong>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 14, padding: "10px 14px", background: "linear-gradient(rgba(34,133,239,0.05),rgba(34,133,239,0.05)), var(--surface-base)", borderLeft: "3px solid var(--border-emphasis)", font: "400 11px/1.5 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-medium)" }}>
        <strong style={{ color: "var(--content-emphasis)", fontWeight: 700 }}>최신 펌웨어:</strong> v2.1.4 (현재 설치본). 업데이트 가능 시 자동 알림.
      </div>
    </>
  );
}

// 다른 탭 placeholder
function DiagLogPlaceholder({ title, desc }) {
  return (
    <>
      <h3 style={{ font: "700 16px/1.2 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-high)", margin: "0 0 8px" }}>{title}</h3>
      <p style={{ font: "400 12px/1.5 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)", margin: "0 0 16px" }}>{desc}</p>
      <div style={{ padding: "32px 16px", background: "var(--surface-subtle-2)", border: "1px dashed var(--border-medium)", textAlign: "center", font: "400 12px/1.5 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)" }}>
        (테이블 mockup 영역 — 추후 데이터 연결 시 시계열 로그 표시)
      </div>
    </>
  );
}

// =================== Screen 7 · [11] REALTIME SCAN ===================
// =================== AnimatedAscan — 실시간 A-scan 파형 (재사용 컴포넌트) ===================
// requestAnimationFrame 기반 ~30 fps 갱신. 초음파 echo packet (damped sinusoid) 합성으로 NDT 진정성 확보.
// measureState !== "measuring" 시 마지막 프레임 동결 (메인 사양 일치).
//
// Echo positions:
//   ~5–12%  : Initial pulse (main bang)
//   ~22–38% : Fault peak (Gate A 영역, fault=true 시에만)
//   ~58–75% : Backwall echo (Gate B 영역)
// + 미세 노이즈 (i·tick 기반 결정적 sin 합성)

window.AnimatedAscan = function AnimatedAscan({
  measureState = "measuring",
  fault = false,
  color = "var(--brand-primary)",
  viewBox = "0 0 800 300",
  baseline = 0.83,
  showGrid = true,
  strokeWidth = 1.8,
  style,
}) {
  const [tick, setTick] = $s(0);
  React.useEffect(() => {
    if (measureState !== "measuring") return;
    let rafId, last = performance.now();
    const loop = (t) => {
      if (t - last > 33) { setTick(p => p + 1); last = t; }
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [measureState]);

  const parts = viewBox.split(" ").map(Number);
  const w = parts[2], h = parts[3];
  const base = h * baseline;
  const grid1 = h * 0.55, grid2 = h * 0.28;
  const phase = tick * 0.18;

  // 200 sample 합성
  const N = 200;
  const pts = [];
  for (let i = 0; i < N; i++) {
    const t = i / (N - 1);
    const x = t * w;
    let y = base;
    // Initial pulse — t ≈ 0.04–0.12
    if (t >= 0.03 && t <= 0.13) {
      const u = (t - 0.08) / 0.028;
      y += Math.sin(u * 4 + phase) * h * 0.18 * Math.exp(-u * u * 1.5);
    }
    // Fault peak — t ≈ 0.22–0.38 (Gate A area)
    if (fault && t >= 0.22 && t <= 0.40) {
      const u = (t - 0.31) / 0.05;
      y += Math.sin(u * 5 + phase * 1.2) * h * 0.30 * Math.exp(-u * u);
    }
    // Backwall echo — t ≈ 0.58–0.78 (Gate B area)
    if (t >= 0.58 && t <= 0.80) {
      const u = (t - 0.68) / 0.06;
      y += Math.sin(u * 4 + phase) * h * 0.22 * Math.exp(-u * u * 1.2);
    }
    // 노이즈 (decorative, 살아있는 느낌)
    y += (Math.sin(i * 0.7 + tick * 0.13) + Math.cos(i * 1.3 + tick * 0.08)) * h * 0.008;
    pts.push(x.toFixed(1) + "," + y.toFixed(1));
  }

  return (
    <svg viewBox={viewBox} preserveAspectRatio="none" width="100%" height="100%" style={{ pointerEvents: "none", ...style }}>
      {showGrid && (
        <>
          <line x1="0" y1={base.toFixed(0)}  x2={w} y2={base.toFixed(0)}  stroke="var(--border-low)" strokeWidth="1"/>
          <line x1="0" y1={grid1.toFixed(0)} x2={w} y2={grid1.toFixed(0)} stroke="var(--border-low)" strokeWidth="0.5" strokeDasharray="2,4"/>
          <line x1="0" y1={grid2.toFixed(0)} x2={w} y2={grid2.toFixed(0)} stroke="var(--border-low)" strokeWidth="0.5" strokeDasharray="2,4"/>
        </>
      )}
      <polyline points={pts.join(" ")} fill="none" stroke={color} strokeWidth={strokeWidth}/>
    </svg>
  );
};

// =================== Screen · [4] EQUIPMENT SETTINGS ===================
// Layout matches ServiceFlow_Analysis SLIDE 9 [4] 장비 연결 설정 (v2.0).
// 좌측 사이드 메뉴 (220px) + 우측 콘텐츠 영역. 메뉴 3개:
//   - mc:    MC보드 연결 (목록 / 추가 / 편집 sub-view)
//   - mqtt:  MQTT 설정
//   - probe: 탐촉자 설정 ([4-3-1] 교정 마법사 트리거)

// ───── Calibration Wizard Modal ([4-3-1]) ─────
window.CalibrationWizard = function CalibrationWizard({ onClose }) {
  const [step, setStep] = $s(1); // 1: 영점, 2: 음속, 3: 감도
  const [refBlock, setRefBlock] = $s("IIW V1 (25 mm)");
  const [refThickness, setRefThickness] = $s(25.0);
  const [refMaterial, setRefMaterial] = $s("탄소강 (S355)");
  const [repeats, setRepeats] = $s(5);
  const [batch, setBatch] = $s(true);

  const stepInfo = {
    1: { title: "영점 (Zero / Wedge Delay)",  desc: "참조 블록(IIW V1·V2 또는 STB-A1·A2)에 탐촉자를 접촉하고 [측정 시작] 클릭. 후면 에코의 ToF를 기준으로 wedge delay 자동 계산." },
    2: { title: "음속 (Velocity)",            desc: "기준 두께(25mm)의 후면 에코 ToF로 음속 산출. 영점 완료 후 진행." },
    3: { title: "감도 (Gain)",                desc: "DAC 곡선 작성. ø1.5 SDH (Side-drilled hole) 기준 -6 dB / -12 dB 측정." },
  };

  return (
    <div className="erut-modal__backdrop" onClick={onClose} style={{ background: "rgba(10,28,60,0.15)" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: 1100, maxHeight: 760, background: "var(--surface-base)", border: "1px solid var(--border-medium)", display: "flex", flexDirection: "column" }}>
        {/* v8.8: 헤더 — titlebar 컬러 통일 */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px", borderBottom: "1px solid var(--border-medium)", background: "var(--content-medium)" }}>
          <div>
            <div style={{ font: "700 16px/1.2 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-inverse)" }}>탐촉자 교정 마법사 — CH 09 / 4</div>
            <div style={{ font: "400 11px/1 var(--font-kr)", letterSpacing: ".02em", color: "rgba(255,255,255,0.7)", marginTop: 4 }}>PXT-2024-009 · 5 MHz · 신규 등록 후 필수 교정</div>
          </div>
          <button onClick={onClose} aria-label="닫기" style={{ background: "transparent", border: "none", color: "var(--content-inverse)", cursor: "pointer", padding: 4, display: "inline-flex", alignItems: "center", justifyContent: "center" }}><window.EIcon.Close size={14}/></button>
        </div>

        {/* Stepper */}
        <div style={{ display: "flex", padding: "16px 24px", borderBottom: "1px solid var(--border-low)", gap: 0 }}>
          {[1, 2, 3].map((n, idx) => {
            const active = n === step;
            const labels = ["영점 (Zero / Wedge Delay)", "음속 (Velocity)", "감도 (Gain)"];
            return (
              <div
                key={n}
                style={{
                  flex: 1, display: "flex", alignItems: "center", gap: 10, padding: "8px 14px",
                  background: active ? "linear-gradient(rgba(34,133,239,0.10),rgba(34,133,239,0.10)), var(--surface-base)" : "var(--surface-base)",
                  border: active ? "1px solid var(--border-emphasis)" : "1px solid var(--border-medium)",
                  borderRight: idx < 2 ? "none" : (active ? "1px solid var(--border-emphasis)" : "1px solid var(--border-medium)"),
                }}
              >
                <span style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  width: 24, height: 24,
                  background: active ? "var(--brand-primary)" : "var(--surface-subtle-1)",
                  color: active ? "var(--on-primary)" : "var(--content-medium)",
                  font: "700 12px/1 var(--font-kr)",
                  border: active ? "none" : "1px solid var(--border-medium)",
                }}>{n}</span>
                <div>
                  <div style={{ font: "700 13px/1 var(--font-kr)", letterSpacing: ".02em", color: active ? "var(--content-emphasis)" : "var(--content-medium)" }}>{labels[idx]}</div>
                  <div style={{ font: "400 10px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)", marginTop: 2 }}>{active ? "진행 중" : (n < step ? "완료" : "대기")}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 본문 */}
        <div style={{ flex: 1, padding: "20px 24px", display: "grid", gridTemplateColumns: "1fr 360px", gap: 20, overflowY: "auto" }}>
          {/* 좌측: 참조 블록 + A-scan */}
          <div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ font: "700 13px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-high)", marginBottom: 6 }}>Step {step}. {stepInfo[step].title} 측정</div>
              <div style={{ font: "400 12px/1.5 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-medium)" }}>{stepInfo[step].desc}</div>
            </div>
            {/* A-scan */}
            <div style={{ background: "var(--surface-base)", border: "1px solid var(--border-medium)", height: 240, position: "relative" }}>
              <div style={{ position: "absolute", top: 8, left: 12, font: "700 11px/1 var(--font-kr)", letterSpacing: "0.08em", color: "var(--content-low)", textTransform: "uppercase" }}>A-SCAN · 참조 블록 측정</div>
              <div style={{ position: "absolute", top: 8, right: 12, font: "400 11px/1 var(--font-kr)", color: "var(--content-low)" }}>최신 프레임 · 시계열 3.2s</div>
              <div style={{ position: "absolute", top: 30, bottom: 30, left: "38%", width: 8, background: "var(--system-success)", opacity: 0.5 }}/>
              <div style={{ position: "absolute", top: 34, left: "39%", font: "700 10px/1 var(--font-kr)", color: "var(--system-success)" }}>후면 에코</div>
              {/* v8.10: 정적 파형 SVG */}
              <svg viewBox="0 0 1000 200" preserveAspectRatio="none" width="100%" height="200" style={{ position: "absolute", top: 30, left: 0, right: 0 }}>
                <line x1="0" y1="170" x2="1000" y2="170" stroke="var(--border-low)" strokeWidth="1"/>
                <line x1="0" y1="110" x2="1000" y2="110" stroke="var(--border-low)" strokeWidth="0.5" strokeDasharray="2,4"/>
                <path d="M0 170 L120 170 L140 145 L155 30 L170 180 L185 170 L380 170 L400 150 L412 50 L424 180 L436 170 L1000 170" stroke="var(--brand-primary)" strokeWidth="2" fill="none"/>
              </svg>
            </div>
            {/* 측정 결과 */}
            <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              <div style={{ padding: "10px 12px", background: "var(--surface-subtle-2)", border: "1px solid var(--border-low)" }}>
                <div style={{ font: "400 10px/1 var(--font-kr)", color: "var(--content-low)", marginBottom: 4 }}>측정 ToF</div>
                <div style={{ font: "700 16px/1 var(--font-kr)", color: "var(--content-high)" }}>16.84 <span style={{ fontSize: 11, color: "var(--content-low)", fontWeight: 400 }}>μs</span></div>
              </div>
              <div style={{ padding: "10px 12px", background: "var(--surface-subtle-2)", border: "1px solid var(--border-low)" }}>
                <div style={{ font: "400 10px/1 var(--font-kr)", color: "var(--content-low)", marginBottom: 4 }}>계산된 영점</div>
                <div style={{ font: "700 16px/1 var(--font-kr)", color: "var(--content-emphasis)" }}>2.13 <span style={{ fontSize: 11, color: "var(--content-low)", fontWeight: 400 }}>μs</span></div>
              </div>
              <div style={{ padding: "10px 12px", background: "var(--surface-subtle-2)", border: "1px solid var(--border-low)" }}>
                <div style={{ font: "400 10px/1 var(--font-kr)", color: "var(--content-low)", marginBottom: 4 }}>표준 편차</div>
                <div style={{ font: "700 16px/1 var(--font-kr)", color: "var(--system-success)" }}>± 0.04 <span style={{ fontSize: 11, color: "var(--content-low)", fontWeight: 400 }}>μs · OK</span></div>
              </div>
            </div>
          </div>

          {/* 우측: 참조 블록 설정 패널 */}
          <div>
            <div style={{ font: "700 13px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-high)", marginBottom: 12 }}>참조 블록 정보</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div>
                <div style={{ font: "700 11px/1 var(--font-kr)", color: "var(--content-medium)", marginBottom: 4 }}>블록 종류</div>
                <select className="erut-field" value={refBlock} onChange={(e) => setRefBlock(e.target.value)} style={{ width: "100%" }}>
                  <option>IIW V1 (25 mm)</option><option>IIW V2</option><option>STB-A1</option><option>STB-A2</option><option>사용자 정의</option>
                </select>
              </div>
              <div>
                <div style={{ font: "700 11px/1 var(--font-kr)", color: "var(--content-medium)", marginBottom: 4 }}>기준 두께 (mm)</div>
                <input className="erut-field" value={refThickness} onChange={(e) => setRefThickness(parseFloat(e.target.value) || 0)} style={{ width: "100%" }}/>
              </div>
              <div>
                <div style={{ font: "700 11px/1 var(--font-kr)", color: "var(--content-medium)", marginBottom: 4 }}>소재</div>
                <select className="erut-field" value={refMaterial} onChange={(e) => setRefMaterial(e.target.value)} style={{ width: "100%" }}>
                  <option>탄소강 (S355)</option><option>스테인레스 (304)</option><option>알루미늄 (6061)</option>
                </select>
              </div>
              <div>
                <div style={{ font: "700 11px/1 var(--font-kr)", color: "var(--content-medium)", marginBottom: 4 }}>반복 측정 횟수</div>
                <input className="erut-field" value={repeats} onChange={(e) => setRepeats(parseInt(e.target.value, 10) || 1)} style={{ width: "100%" }}/>
              </div>
              <div style={{ marginTop: 8 }}>
                <button className="erut-btn erut-btn--emphasis erut-btn--m" style={{ width: "100%" }}>{stepInfo[step].title.split(" ")[0]} 측정 시작</button>
              </div>
              <div style={{ marginTop: 4, font: "400 10px/1.5 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)" }}>참조 블록에 탐촉자 접촉 → 버튼 클릭 → {repeats}회 자동 측정 → 평균값 적용.</div>
            </div>
            <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid var(--border-low)" }}>
              <label className="erut-cb" style={{ cursor: "pointer" }} onClick={() => setBatch(!batch)}>
                <span className={"erut-cb__box" + (batch ? " is-on" : "")} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                  {batch && <svg viewBox="0 0 16 16" width="10" height="10" fill="none" stroke="var(--on-primary)" strokeWidth="2"><polyline points="3,8 7,12 13,4"/></svg>}
                </span>
                <span className="erut-cb__label">같은 블록·같은 소재 — 나머지 3채널 일괄 측정</span>
              </label>
            </div>
          </div>
        </div>

        {/* 푸터 */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 24px", borderTop: "1px solid var(--border-medium)", background: "var(--surface-subtle-1)" }}>
          <div style={{ font: "400 11px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)" }}>CH 09 / 4 채널 · {stepInfo[step].title.split(" ")[0]} 측정 완료 후 {step < 3 ? ["", "음속", "감도"][step] : "다음 채널"} 단계로 진행</div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className={"erut-btn erut-btn--m " + (step === 1 ? "erut-btn--disabled" : "erut-btn--subtle")} disabled={step === 1} onClick={() => setStep(s => Math.max(1, s - 1))}>이전</button>
            <button className="erut-btn erut-btn--default erut-btn--m" onClick={onClose}>건너뛰기 (CH 차단)</button>
            {step < 3 ? (
              <button className="erut-btn erut-btn--emphasis erut-btn--m" onClick={() => setStep(s => s + 1)}>다음 — {["", "음속", "감도"][step]}</button>
            ) : (
              <button className="erut-btn erut-btn--emphasis erut-btn--m" onClick={onClose}>교정 완료</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

window.EquipmentSettings = function EquipmentSettings({ initialMenu, initialSubView, onBack }) {
  // initialSubView: null | "mc-add" | "mc-edit" — 외부 진입 시 sub-view 직접 지정 가능
  // 예: [1] 메인 "+ 장비 추가" → initialSubView="mc-add"로 즉시 폼 진입
  const [menu, setMenu] = $s(initialMenu || "mc");          // "mc" | "mqtt" | "probe"
  const [subView, setSubView] = $s(initialSubView || null); // null | "mc-add" | "mc-edit"
  const [editingBoardId, setEditingBoardId] = $s(null);
  const [showCalibration, setShowCalibration] = $s(false);

  // 메뉴 변경 시 sub-view 리셋
  const switchMenu = (m) => { setSubView(null); setEditingBoardId(null); setMenu(m); };

  const menuItems = [
    { id: "mc",    label: "MC보드 연결", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="6" width="14" height="12"/><line x1="16" y1="12" x2="20" y2="12"/><line x1="18" y1="10" x2="18" y2="14"/></svg> },
    { id: "mqtt",  label: "MQTT 설정",   icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12a10 10 0 0 1 14 0"/><path d="M8.5 15a5 5 0 0 1 7 0"/><circle cx="12" cy="18" r="1" fill="currentColor"/></svg> },
    { id: "probe", label: "탐촉자 설정", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="9" width="18" height="6"/><line x1="6" y1="9" x2="6" y2="15"/><line x1="9" y1="9" x2="9" y2="15"/><line x1="12" y1="9" x2="12" y2="15"/><line x1="15" y1="9" x2="15" y2="15"/><line x1="18" y1="9" x2="18" y2="15"/></svg> },
  ];

  return (
    <div className="erut-page-enter" style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 0, padding: 0, height: "100%" }}>
      {/* ───── 좌측 사이드 메뉴 ───── */}
      <div style={{ background: "var(--surface-subtle-1)", borderRight: "1px solid var(--border-medium)", padding: "20px 0" }}>
        <div style={{ font: "700 11px/1 var(--font-kr)", letterSpacing: "0.08em", color: "var(--content-low)", textTransform: "uppercase", padding: "0 20px 14px" }}>장비 연결 설정</div>
        {menuItems.map((item) => {
          const active = menu === item.id;
          return (
            <button
              key={item.id}
              onClick={() => switchMenu(item.id)}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                width: "100%", padding: "12px 20px",
                font: "700 14px/1 var(--font-kr)", letterSpacing: ".02em",
                color: active ? "var(--content-emphasis)" : "var(--content-medium)",
                background: active ? "linear-gradient(rgba(34,133,239,0.10),rgba(34,133,239,0.10)), var(--surface-base)" : "transparent",
                border: "none",
                borderLeft: "3px solid " + (active ? "var(--brand-primary)" : "transparent"),
                cursor: "pointer", textAlign: "left",
              }}
            >
              {item.icon}
              {item.label}
            </button>
          );
        })}
      </div>

      {/* ───── 우측 콘텐츠 ───── */}
      <div style={{ padding: "20px 30px", overflowY: "auto" }}>
        {/* v8.5 Breadcrumb */}
        <window.Breadcrumb
          onBack={onBack}
          items={[
            { label: "메인" },
            { label: "설정" },
            { label: "장비 연결" },
            { label: menu === "mc" ? "MC보드 연결" : menu === "mqtt" ? "MQTT 설정" : menu === "probe" ? "탐촉자 설정" : "장비 연결 설정", current: true },
          ]}
        />
        {menu === "mc" && !subView && <MCBoardList onAdd={() => setSubView("mc-add")} onEdit={(id) => { setEditingBoardId(id); setSubView("mc-edit"); }}/>}
        {menu === "mc" && subView && <MCBoardForm mode={subView} editingId={editingBoardId} onCancel={() => setSubView(null)} onSave={() => setSubView(null)}/>}
        {menu === "mqtt" && <MQTTSettings/>}
        {menu === "probe" && <ProbeSettings onCalibrate={() => setShowCalibration(true)}/>}
      </div>

      {/* 교정 마법사 모달 */}
      {showCalibration && <window.CalibrationWizard onClose={() => setShowCalibration(false)}/>}
    </div>
  );
};

// ───── MC보드 목록 (메인 SLIDE 9) ─────
function MCBoardList({ onAdd, onEdit }) {
  const boards = window.MOCK.mcBoards;
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
        <div>
          <h2 style={{ font: "700 20px/1.2 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-high)", margin: 0 }}>MC보드 연결</h2>
          <p style={{ font: "400 13px/1.4 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)", marginTop: 4, marginBottom: 0 }}>IP 직접 입력 방식. 등록 보드 {boards.length}대 · 연결 {boards.filter(b => b.state !== "offline").length}대 · 오프라인 {boards.filter(b => b.state === "offline").length}대.</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="erut-btn erut-btn--default erut-btn--sm">설정 불러오기</button>
          <button className="erut-btn erut-btn--default erut-btn--sm">설정 저장</button>
          <button className="erut-btn erut-btn--emphasis erut-btn--sm" onClick={onAdd}>+ MC보드 추가</button>
        </div>
      </div>

      {/* v8.8: 2컬럼 레이아웃 (MQTT 설정 페이지 매칭) — 좌: MC보드 리스트 / 우: 영점 검증 요약 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {boards.map((b, idx) => {
          const isSelected = idx === 0; // 첫 카드 = 선택 시뮬레이션
          const ledClass = b.state === "offline" ? "erut-led is-red" : "erut-led is-green";
          const cardStyle = isSelected
            ? { border: "1px solid var(--border-emphasis)", background: "linear-gradient(rgba(34,133,239,0.05),rgba(34,133,239,0.05)), var(--surface-subtle-2)" }
            : b.state === "offline"
              ? { border: "1px solid var(--border-medium)", background: "var(--surface-subtle-1)" }
              : { border: "1px solid var(--border-medium)", background: "var(--surface-base)" };
          return (
            <div key={b.id} style={{ ...cardStyle, padding: "14px 18px", display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 16, alignItems: "center" }}>
              <span className={ledClass} style={{ width: 12, height: 12 }}><span className="erut-led__halo"/><span className="erut-led__dot"/></span>
              <div>
                <div style={{ font: "700 14px/1 var(--font-kr)", letterSpacing: ".02em", color: b.state === "offline" ? "var(--content-medium)" : "var(--content-high)", marginBottom: 4 }}>
                  {b.id}
                </div>
                <div style={{ font: "400 12px/1.5 var(--font-kr)", letterSpacing: ".02em", color: b.state === "offline" ? "var(--content-low)" : "var(--content-medium)" }}>
                  IP {b.ip} : {b.port} · {b.channels} ch · {b.freq} MHz · Firmware {b.firmware} ·{" "}
                  {b.state === "warn"   && <span style={{ color: "var(--system-caution)" }}>{b.note}</span>}
                  {b.state === "offline" && <span style={{ color: "var(--system-error)" }}>{b.note}</span>}
                  {b.state === "connected" && <span>{b.note}</span>}
                </div>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                {b.state === "offline" ? (
                  <>
                    <button className="erut-btn erut-btn--default erut-btn--sm">재연결</button>
                    <button className="erut-btn erut-btn--subtle erut-btn--sm" onClick={() => onEdit(b.id)}>편집</button>
                    <button className="erut-btn erut-btn--subtle erut-btn--sm" style={{ color: "var(--system-error)" }}>삭제</button>
                  </>
                ) : (
                  <>
                    <button className={"erut-btn erut-btn--sm " + (isSelected ? "erut-btn--active" : "erut-btn--default")} onClick={() => onEdit(b.id)}>편집</button>
                    <button className="erut-btn erut-btn--subtle erut-btn--sm">Config ↓</button>
                    <button className="erut-btn erut-btn--subtle erut-btn--sm">연결 해제</button>
                    <button className="erut-btn erut-btn--subtle erut-btn--sm" style={{ color: "var(--system-error)" }}>삭제</button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 영점 색검증 요약 (선택 보드) — v8.8: 2컬럼 우측으로 이동 */}
      <div style={{ background: "var(--surface-subtle-2)", border: "1px solid var(--border-medium)", padding: "16px 18px", alignSelf: "start" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div>
            <h3 style={{ font: "700 14px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-high)", margin: 0 }}>선택 보드 채널 영점 — {boards[0].id}</h3>
            <p style={{ font: "400 11px/1.4 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)", marginTop: 4, marginBottom: 0 }}>참조 블록 측정 후 색으로 일치성 검증. 황·적색 채널은 재측정 필요.</p>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button className="erut-btn erut-btn--default erut-btn--sm">전체 영점 재측정</button>
            <button className="erut-btn erut-btn--subtle erut-btn--sm">CH ID 등록</button>
          </div>
        </div>
        {/* 64ch 압축 색바 — ch 7 warn, ch 16 err, ch 43 warn */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(32, 1fr)", gap: 2, padding: "8px 0" }}>
          {Array.from({ length: 64 }).map((_, i) => {
            const ch = i + 1;
            const color = ch === 16 ? "var(--system-error)" : (ch === 7 || ch === 43) ? "var(--system-caution)" : "var(--system-success)";
            return <div key={ch} style={{ height: 14, background: color }}/>;
          })}
        </div>
        <div style={{ display: "flex", gap: 18, marginTop: 8, font: "400 11px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)" }}>
          <div><span style={{ display: "inline-block", width: 10, height: 10, background: "var(--system-success)", verticalAlign: "middle", marginRight: 4 }}/>정상 61</div>
          <div><span style={{ display: "inline-block", width: 10, height: 10, background: "var(--system-caution)", verticalAlign: "middle", marginRight: 4 }}/>편차 2 (CH 7 · 43)</div>
          <div><span style={{ display: "inline-block", width: 10, height: 10, background: "var(--system-error)", verticalAlign: "middle", marginRight: 4 }}/>오류 1 (CH 16)</div>
        </div>
      </div>
      </div>
    </>
  );
}

// ───── MC보드 추가 / 편집 폼 (메인 SLIDE 10 [4-1]) ─────
function MCBoardForm({ mode, editingId, onCancel, onSave }) {
  const isEdit = mode === "mc-edit";
  const existing = isEdit ? window.MOCK.mcBoards.find(b => b.id === editingId) : null;
  const [alias, setAlias] = $s(existing ? existing.alias : "");
  const [sn, setSN]       = $s(existing ? existing.id : "");
  const [ip, setIP]       = $s(existing ? existing.ip : "");
  const [port, setPort]   = $s(existing ? existing.port : "");
  const [timeout, setTimeoutVal] = $s(5000);
  const [autoReconnect, setAutoReconnect] = $s(true);
  const [chs, setChs]     = $s(existing ? existing.channels : 64);
  const [freq, setFreq]   = $s(existing ? existing.freq : 5);
  const [sampling, setSampling] = $s(100);

  const requiredOk = !!(alias && ip && port);

  return (
    <>
      {/* breadcrumb + 헤더 */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div>
          <div style={{ font: "400 12px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)", marginBottom: 6 }}>
            <span style={{ cursor: "pointer", color: "var(--content-emphasis)" }} onClick={onCancel}>MC보드 연결</span>
            <span style={{ margin: "0 6px" }}>›</span>
            <span style={{ color: "var(--content-medium)" }}>{isEdit ? `${existing.id} 편집` : "새 보드 추가"}</span>
          </div>
          <h2 style={{ font: "700 20px/1.2 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-high)", margin: 0 }}>{isEdit ? "MC보드 편집" : "MC보드 추가"}</h2>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="erut-btn erut-btn--default erut-btn--sm">Config 파일 업로드 ↑</button>
          <button className="erut-btn erut-btn--default erut-btn--sm">Config 파일 다운로드 ↓</button>
        </div>
      </div>

      {/* 안내 배너 */}
      <div style={{ background: "linear-gradient(rgba(34,133,239,0.06),rgba(34,133,239,0.06)), var(--surface-subtle-2)", border: "1px solid var(--border-emphasis)", padding: "10px 14px", marginBottom: 18 }}>
        <div style={{ font: "700 12px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-emphasis)", marginBottom: 4 }}>유선 LAN 직결 · 단방향 통신 (ERUT → MC보드)</div>
        <div style={{ font: "400 11px/1.5 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-medium)" }}>MC보드는 Wi-Fi를 지원하지 않습니다. 노트북과 MC보드를 LAN 케이블로 직접 연결하거나 같은 네트워크(서브넷)에 두십시오. 자동 검색은 미지원 — IP / Port 직접 입력. Config 파일 업로드로 항목 일괄 채움 가능.</div>
      </div>

      {/* 입력 폼 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 24px" }}>
        <div style={{ gridColumn: "1 / -1", font: "700 12px/1 var(--font-kr)", letterSpacing: "0.08em", color: "var(--content-low)", textTransform: "uppercase", padding: "4px 0", borderBottom: "1px solid var(--border-low)" }}>기본 정보</div>
        <div>
          <div style={{ font: "700 12px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-medium)", marginBottom: 4 }}>보드 별칭 <span style={{ color: "var(--system-error)" }}>*</span></div>
          <input className="erut-field" value={alias} onChange={(e) => setAlias(e.target.value)} placeholder="예: 주력 장비" style={{ width: "100%" }}/>
        </div>
        <div>
          <div style={{ font: "700 12px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-medium)", marginBottom: 4 }}>시리얼 번호 (SN)</div>
          <input className="erut-field" value={sn} onChange={(e) => setSN(e.target.value)} placeholder="예: MCF-2024-001" style={{ width: "100%" }}/>
        </div>

        <div style={{ gridColumn: "1 / -1", font: "700 12px/1 var(--font-kr)", letterSpacing: "0.08em", color: "var(--content-low)", textTransform: "uppercase", padding: "12px 0 4px", borderBottom: "1px solid var(--border-low)" }}>네트워크</div>
        <div>
          <div style={{ font: "700 12px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-medium)", marginBottom: 4 }}>IP 주소 <span style={{ color: "var(--system-error)" }}>*</span></div>
          <input className="erut-field" value={ip} onChange={(e) => setIP(e.target.value)} placeholder="예: 10.10.1.5" style={{ width: "100%" }}/>
        </div>
        <div>
          <div style={{ font: "700 12px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-medium)", marginBottom: 4 }}>Port <span style={{ color: "var(--system-error)" }}>*</span></div>
          <input className="erut-field" value={port} onChange={(e) => setPort(e.target.value)} placeholder="기본 8080" style={{ width: "100%" }}/>
        </div>
        <div>
          <div style={{ font: "700 12px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-medium)", marginBottom: 4 }}>통신 Timeout (ms)</div>
          <input className="erut-field" value={timeout} onChange={(e) => setTimeoutVal(e.target.value)} style={{ width: "100%" }}/>
        </div>
        <div>
          <div style={{ font: "700 12px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-medium)", marginBottom: 4 }}>자동 재연결</div>
          <div style={{ display: "flex", gap: 16, padding: "10px 0" }}>
            <window.Toggle checked={autoReconnect} onChange={setAutoReconnect} size="sm" label="활성"/>
          </div>
        </div>

        <div style={{ gridColumn: "1 / -1", font: "700 12px/1 var(--font-kr)", letterSpacing: "0.08em", color: "var(--content-low)", textTransform: "uppercase", padding: "12px 0 4px", borderBottom: "1px solid var(--border-low)" }}>보드 사양</div>
        <div>
          <div style={{ font: "700 12px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-medium)", marginBottom: 4 }}>채널 수</div>
          <input className="erut-field" value={chs} onChange={(e) => setChs(e.target.value)} style={{ width: "100%" }}/>
        </div>
        <div>
          <div style={{ font: "700 12px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-medium)", marginBottom: 4 }}>주파수 (MHz)</div>
          <input className="erut-field" value={freq} onChange={(e) => setFreq(e.target.value)} style={{ width: "100%" }}/>
        </div>
        <div>
          <div style={{ font: "700 12px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-medium)", marginBottom: 4 }}>샘플링 (MHz)</div>
          <input className="erut-field" value={sampling} onChange={(e) => setSampling(e.target.value)} style={{ width: "100%" }}/>
        </div>
        <div>
          <div style={{ font: "700 12px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-medium)", marginBottom: 4 }}>펌웨어 버전</div>
          <input className="erut-field" value={existing ? existing.firmware : "v2.4.1"} style={{ width: "100%" }} disabled/>
        </div>
      </div>

      {/* 연결 진단 */}
      <div style={{ font: "700 12px/1 var(--font-kr)", letterSpacing: "0.08em", color: "var(--content-low)", textTransform: "uppercase", padding: "16px 0 4px", borderBottom: "1px solid var(--border-low)", marginTop: 8 }}>연결 진단</div>
      <div style={{ background: "var(--surface-subtle-2)", border: "1px solid var(--border-medium)", padding: "14px 16px", marginTop: 10 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px 18px", marginBottom: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: "var(--surface-base)", border: "1px solid var(--border-low)" }}>
            <span style={{ font: "400 11px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)" }}>노트북 IP</span>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ font: "700 12px/1 'Consolas', monospace", color: "var(--content-high)" }}>192.168.1.10</span>
              <span style={{ padding: "2px 6px", font: "700 9px/1 var(--font-kr)", color: "var(--system-success)", border: "1px solid var(--system-success)" }}>같은 서브넷 ✓</span>
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: "var(--surface-base)", border: "1px solid var(--border-low)" }}>
            <span style={{ font: "400 11px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)" }}>LAN Link 상태</span>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span className="erut-led is-green" style={{ width: 8, height: 8 }}><span className="erut-led__halo"/><span className="erut-led__dot"/></span>
              <span style={{ font: "700 12px/1 var(--font-kr)", color: "var(--system-success)" }}>연결됨 · Cat6 1 Gbps</span>
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: "var(--surface-base)", border: "1px solid var(--border-low)" }}>
            <span style={{ font: "400 11px/1 var(--font-kr)", color: "var(--content-low)" }}>Ping 응답</span>
            <span style={{ font: "700 12px/1 var(--font-kr)", color: "var(--system-success)" }}>4 ms <span style={{ font: "400 10px/1 var(--font-kr)", color: "var(--content-low)" }}>· 양호</span></span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: "var(--surface-base)", border: "1px solid var(--border-low)" }}>
            <span style={{ font: "400 11px/1 var(--font-kr)", color: "var(--content-low)" }}>패킷 손실률</span>
            <span style={{ font: "700 12px/1 var(--font-kr)", color: "var(--system-success)" }}>0.0 % <span style={{ font: "400 10px/1 var(--font-kr)", color: "var(--content-low)" }}>· 1000Hz 안정</span></span>
          </div>
        </div>
        <div style={{ font: "400 10px/1.5 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)", paddingTop: 8, borderTop: "1px solid var(--border-low)" }}>
          진단은 "연결 테스트" 클릭 시 자동 실행. 노트북 IP가 MC보드와 다른 서브넷이면 경고 표시. Ping 50ms↑ 또는 패킷 손실 1%↑ 시 케이블·네트워크 점검 권장.
        </div>
      </div>

      {/* 하단 액션 */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 20, paddingTop: 16, borderTop: "1px solid var(--border-medium)" }}>
        <div style={{ font: "400 11px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)" }}><span style={{ color: "var(--system-error)" }}>*</span> 필수 항목</div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="erut-btn erut-btn--subtle erut-btn--m" onClick={onCancel}>취소</button>
          <button className="erut-btn erut-btn--default erut-btn--m">연결 테스트</button>
          <button className={"erut-btn erut-btn--m " + (requiredOk ? "erut-btn--emphasis" : "erut-btn--disabled")} disabled={!requiredOk} onClick={requiredOk ? onSave : undefined}>저장 + 연결</button>
        </div>
      </div>
    </>
  );
}

// ───── MQTT 설정 (메인 SLIDE 11 [4-2]) ─────
function MQTTSettings() {
  return (
    <div style={{ padding: "0 30px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18, marginTop: 4 }}>
        <div>
          <h2 style={{ font: "700 20px/1.2 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-high)", margin: 0 }}>MQTT 설정</h2>
          <p style={{ font: "400 13px/1.4 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)", marginTop: 4, marginBottom: 0 }}>Broker 연결 정보 + Pub/Sub 토픽 구조 + 연결 테스트</p>
        </div>
      </div>

      {/* 외부 연동 안내 배너 */}
      <div style={{ background: "linear-gradient(rgba(34,133,239,0.06),rgba(34,133,239,0.06)), var(--surface-subtle-2)", border: "1px solid var(--border-emphasis)", padding: "12px 16px", marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--content-emphasis)" strokeWidth="1.5"><path d="M5 12a10 10 0 0 1 14 0"/><path d="M8.5 15a5 5 0 0 1 7 0"/><circle cx="12" cy="18" r="1" fill="currentColor"/></svg>
        <div style={{ flex: 1 }}>
          <div style={{ font: "700 13px/1.2 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-emphasis)" }}>외부 시스템 연동 (무선 · 선택 옵션)</div>
          <div style={{ font: "400 11px/1.5 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-medium)", marginTop: 2 }}>MQTT는 검사 데이터를 디지털 트윈·관제 대시보드·TSDB 등 <strong>외부 시스템에 무선(Wi-Fi/LTE)으로 송신</strong>할 때 사용합니다. 노트북에서 단독 검사만 수행하는 경우 MQTT 연결 없이도 정상 작동합니다.</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
        {/* 좌측: Broker 연결 */}
        <div>
          <h3 style={{ font: "700 18px/1.2 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-high)", marginBottom: 16 }}>Broker 연결</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <div style={{ font: "700 13px/1 var(--font-kr)", color: "var(--content-medium)", marginBottom: 6 }}>Host</div>
              <input className="erut-field" defaultValue="rabbitmq.erut.local" style={{ width: "100%" }}/>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <div style={{ font: "700 13px/1 var(--font-kr)", color: "var(--content-medium)", marginBottom: 6 }}>Port</div>
                <input className="erut-field" defaultValue="1883" style={{ width: "100%" }}/>
              </div>
              <div>
                <div style={{ font: "700 13px/1 var(--font-kr)", color: "var(--content-medium)", marginBottom: 6 }}>Protocol</div>
                <select className="erut-field" defaultValue="MQTT v5" style={{ width: "100%" }}>
                  <option>MQTT v5</option><option>MQTT v3.1.1</option>
                </select>
              </div>
            </div>
            <div>
              <div style={{ font: "700 13px/1 var(--font-kr)", color: "var(--content-medium)", marginBottom: 6 }}>Client ID</div>
              <input className="erut-field" defaultValue="erut-client-mcf001" style={{ width: "100%" }}/>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <div style={{ font: "700 13px/1 var(--font-kr)", color: "var(--content-medium)", marginBottom: 6 }}>Username</div>
                <input className="erut-field" defaultValue="erut-publisher" style={{ width: "100%" }}/>
              </div>
              <div>
                <div style={{ font: "700 13px/1 var(--font-kr)", color: "var(--content-medium)", marginBottom: 6 }}>Password</div>
                <input className="erut-field" type="password" defaultValue="••••••••••" style={{ width: "100%" }}/>
              </div>
            </div>
            <label className="erut-cb" style={{ marginTop: 6, cursor: "pointer" }}>
              <span className="erut-cb__box is-on" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                <svg viewBox="0 0 16 16" width="10" height="10" fill="none" stroke="var(--on-primary)" strokeWidth="2"><polyline points="3,8 7,12 13,4"/></svg>
              </span>
              <span className="erut-cb__label">TLS / SSL 사용</span>
            </label>
            <window.Toggle checked={true} onChange={() => {}} label="자동 재연결 (Keep-alive 60s)"/>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
            <button className="erut-btn erut-btn--default erut-btn--m">연결 테스트</button>
            <button className="erut-btn erut-btn--emphasis erut-btn--m">저장</button>
          </div>

          <div style={{ marginTop: 20, background: "var(--surface-subtle-2)", border: "1px solid var(--border-medium)", padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}>
            <span className="erut-led is-green"><span className="erut-led__halo"/><span className="erut-led__dot"/></span>
            <div style={{ flex: 1 }}>
              <div style={{ font: "700 13px/1 var(--font-kr)", color: "var(--system-success)" }}>연결 성공</div>
              <div style={{ font: "400 12px/1.4 var(--font-kr)", color: "var(--content-low)", marginTop: 2 }}>2026-05-21 14:23:05 · Latency 8 ms · 세션 ID: erut-mcf001-a3f</div>
            </div>
          </div>
        </div>

        {/* 우측: 토픽 구조 */}
        <div>
          <h3 style={{ font: "700 18px/1.2 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-high)", marginBottom: 16 }}>토픽 구조</h3>
          <div style={{ background: "var(--surface-subtle-2)", border: "1px solid var(--border-medium)", borderLeft: "3px solid var(--brand-primary)", padding: "14px 18px", marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span className="erut-badge">Publish</span>
              <span style={{ font: "700 13px/1 var(--font-kr)", color: "var(--content-high)" }}>측정 데이터 전송</span>
            </div>
            <div style={{ font: "400 13px/1 'Consolas', monospace", color: "var(--content-emphasis)", background: "var(--surface-base)", padding: "8px 12px", border: "1px solid var(--border-low)", letterSpacing: 0 }}>erut/data/{`{SN}`}/{`{ch}`}</div>
            <div style={{ marginTop: 8, font: "400 12px/1.6 var(--font-kr)", color: "var(--content-low)" }}>
              <strong style={{ color: "var(--content-medium)" }}>{`{SN}`}</strong>: 장비 시리얼 · <strong style={{ color: "var(--content-medium)" }}>{`{ch}`}</strong>: 채널 번호 (1~64)<br/>
              QoS 1 · Retain false · 약 16 KB/sec 채널당
            </div>
          </div>
          <div style={{ background: "var(--surface-subtle-2)", border: "1px solid var(--border-medium)", borderLeft: "3px solid var(--system-info)", padding: "14px 18px", marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span className="erut-badge" style={{ background: "var(--system-info)" }}>Subscribe</span>
              <span style={{ font: "700 13px/1 var(--font-kr)", color: "var(--content-high)" }}>원격 명령 수신</span>
            </div>
            <div style={{ font: "400 13px/1 'Consolas', monospace", color: "var(--system-info)", background: "var(--surface-base)", padding: "8px 12px", border: "1px solid var(--border-low)", letterSpacing: 0 }}>erut/command/{`{SN}`}</div>
            <div style={{ marginTop: 8, font: "400 12px/1.6 var(--font-kr)", color: "var(--content-low)" }}>
              지원 명령: <strong style={{ color: "var(--content-medium)" }}>start · stop · pause · calibrate · ack</strong><br/>
              QoS 2 · 명령 검증 후 응답 ack 발송
            </div>
          </div>

          <h4 style={{ font: "700 14px/1.2 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-high)", margin: "16px 0 10px" }}>실시간 트래픽</h4>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
            <div style={{ background: "var(--surface-base)", border: "1px solid var(--border-medium)", padding: "10px 12px", textAlign: "center" }}>
              <div style={{ font: "700 22px/1 var(--font-kr)", color: "var(--brand-primary)" }}>1.2 MB/s</div>
              <div style={{ font: "700 11px/1 var(--font-kr)", color: "var(--content-low)", marginTop: 4 }}>송신 (Publish)</div>
            </div>
            <div style={{ background: "var(--surface-base)", border: "1px solid var(--border-medium)", padding: "10px 12px", textAlign: "center" }}>
              <div style={{ font: "700 22px/1 var(--font-kr)", color: "var(--system-info)" }}>240 B/s</div>
              <div style={{ font: "700 11px/1 var(--font-kr)", color: "var(--content-low)", marginTop: 4 }}>수신 (Subscribe)</div>
            </div>
            <div style={{ background: "var(--surface-base)", border: "1px solid var(--border-medium)", padding: "10px 12px", textAlign: "center" }}>
              <div style={{ font: "700 22px/1 var(--font-kr)", color: "var(--content-high)" }}>8 ms</div>
              <div style={{ font: "700 11px/1 var(--font-kr)", color: "var(--content-low)", marginTop: 4 }}>Round-trip</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ───── 탐촉자 설정 (메인 SLIDE 12 [4-3]) ─────
function ProbeSettings({ onCalibrate }) {
  const serials = window.MOCK.channelSerials;
  const registered = serials.filter(s => s.sn).length;
  const empty      = serials.filter(s => !s.sn).length;
  const needsCalib = serials.filter(s => s.status === "needsCalib");

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div>
          <h2 style={{ font: "700 20px/1.2 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-high)", margin: 0 }}>탐촉자 설정</h2>
          <p style={{ font: "400 13px/1.4 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)", marginTop: 4, marginBottom: 0 }}>대상 보드 <strong style={{ color: "var(--content-high)" }}>MCF-2024-001</strong> · 등록 <strong style={{ color: "var(--content-emphasis)" }}>{registered}</strong> / 64 ch · 미등록 {empty}ch · {needsCalib.length > 0 && <strong style={{ color: "var(--system-caution)" }}>교정 필요 {needsCalib.length}ch</strong>}</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="erut-btn erut-btn--default erut-btn--sm">대상 보드 변경 ↓</button>
          <button className="erut-btn erut-btn--default erut-btn--sm">전체 초기화</button>
          <button className="erut-btn erut-btn--emphasis erut-btn--sm">변경 사항 저장</button>
        </div>
      </div>

      {/* 교정 안내 배너 */}
      {needsCalib.length > 0 && (
        <div style={{ background: "linear-gradient(rgba(255,146,0,0.08),rgba(255,146,0,0.08)), var(--surface-subtle-2)", border: "1px solid var(--system-caution)", padding: "10px 14px", marginBottom: 14, display: "flex", alignItems: "center", gap: 12 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--system-caution)" strokeWidth="1.5"><circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="13"/><circle cx="12" cy="16" r="1" fill="currentColor"/></svg>
          <div style={{ flex: 1 }}>
            <div style={{ font: "700 12px/1.2 var(--font-kr)", color: "var(--system-caution)" }}>교정 필요 — {needsCalib.length}개 채널 ({needsCalib.map(c => "CH " + String(c.ch).padStart(2, "0")).join(" · ")})</div>
            <div style={{ font: "400 11px/1.4 var(--font-kr)", color: "var(--content-medium)", marginTop: 2 }}>신규 등록 후 영점 · 음속 · 감도 3단계 교정이 완료되지 않은 채널입니다. 측정 시작 차단됩니다.</div>
          </div>
          <button className="erut-btn erut-btn--emphasis erut-btn--sm" onClick={onCalibrate}>교정 마법사 시작 →</button>
        </div>
      )}

      {/* 일괄 등록 3종 */}
      <div style={{ background: "linear-gradient(rgba(34,133,239,0.06),rgba(34,133,239,0.06)), var(--surface-subtle-2)", border: "1px solid var(--border-emphasis)", padding: "12px 14px", marginBottom: 16 }}>
        <div style={{ font: "700 12px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-emphasis)", marginBottom: 10 }}>일괄 등록 — 64회 수동 입력 부담 제거</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
          {[
            { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--content-emphasis)" strokeWidth="1.5"><path d="M12 5v14"/><path d="M5 12l7 7 7-7"/><path d="M5 5h14"/></svg>, title: "자동 생성", desc: "시작 SN + 증분 패턴 (예: PXT-2024-001 → 064)" },
            { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--content-emphasis)" strokeWidth="1.5"><rect x="4" y="3" width="16" height="18"/><line x1="8" y1="8" x2="16" y2="8"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="8" y1="16" x2="13" y2="16"/></svg>, title: "텍스트 붙여넣기", desc: "다이얼로그에 64줄 SN 입력 → 채널 순서대로 자동 매칭" },
            { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--content-emphasis)" strokeWidth="1.5"><rect x="3" y="3" width="12" height="12"/><rect x="9" y="9" width="12" height="12"/></svg>, title: "프로필 복제", desc: "다른 보드의 탐촉자 SN 세트를 그대로 복사" },
          ].map((b) => (
            <button key={b.title} style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 4, padding: "12px 14px", background: "var(--surface-base)", border: "1px solid var(--border-medium)", cursor: "pointer", textAlign: "left" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {b.icon}
                <span style={{ font: "700 13px/1 var(--font-kr)", color: "var(--content-high)" }}>{b.title}</span>
              </div>
              <span style={{ font: "400 11px/1.4 var(--font-kr)", color: "var(--content-low)" }}>{b.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 64ch SN 그리드 */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <div style={{ font: "700 13px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-high)" }}>채널별 Serial 등록 (64 ch)</div>
          <div style={{ display: "flex", gap: 14, font: "400 11px/1 var(--font-kr)", color: "var(--content-low)" }}>
            <span><span style={{ display: "inline-block", width: 8, height: 8, background: "var(--surface-base)", border: "1px solid var(--border-medium)", verticalAlign: "middle", marginRight: 4 }}/>등록 {registered}</span>
            <span><span style={{ display: "inline-block", width: 8, height: 8, background: "var(--surface-subtle-1)", verticalAlign: "middle", marginRight: 4 }}/>미등록 {empty}</span>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 6 }}>
          {serials.map((s) => {
            const isEmpty = !s.sn;
            const needsC = s.status === "needsCalib";
            return (
              <div key={s.ch} style={{ display: "flex", flexDirection: "column", gap: 4, padding: "8px 10px", border: "1px solid " + (needsC ? "var(--system-caution)" : "var(--border-medium)"), background: isEmpty ? "var(--surface-subtle-1)" : "var(--surface-base)" }}>
                <div style={{ font: "700 10px/1 var(--font-kr)", letterSpacing: ".02em", color: isEmpty ? "var(--system-error)" : needsC ? "var(--system-caution)" : "var(--content-low)" }}>
                  CH {String(s.ch).padStart(2, "0")}{needsC && " ⚠"}
                </div>
                <input
                  className="erut-field"
                  defaultValue={s.sn}
                  placeholder={isEmpty ? "미등록" : ""}
                  style={{ width: "100%", height: 28, padding: "4px 6px", font: "400 11px/1 'Consolas', monospace", color: isEmpty ? "var(--content-low)" : "var(--content-high)" }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

// =================== Screen · [6] TARGET MANAGE ===================
// Layout matches ServiceFlow_Analysis SLIDE 14 [6] 검사 대상 관리 (v4.6).
// 좌측 검사 대상 카드 리스트 + 우측 풀 입력 폼 + PRF 자동 계산 + 표준 프리셋 라이브러리.
// 진입: [1] 메인 "+ 검사 대상 추가" 또는 카드 / [1-1] "정보 수정" / [2] 등.

// 소재별 종파 음속 (m/s) — PRF 자동 계산용 (CLAUDE.md PRF spec 기준)
window.SOUND_SPEEDS = {
  "탄소강 (S355)":    5920,
  "스테인레스 (304)": 5790,
  "스테인레스 (316L)":5740,
  "알루미늄 (6061)":  6320,
  "티타늄 (Gr.2)":    6070,
};
window.PRF_STEPS = [200, 500, 1000, 2000, 4000];

window.calcPRF = function(thicknessMm, material) {
  const v = window.SOUND_SPEEDS[material] || 5920;     // m/s
  const maxDistMm  = thicknessMm * 3;                  // 안전 배수 3
  const tofUs      = (2 * maxDistMm * 1000) / v;       // (mm → m / v) × 1e6 → μs
  const prfMaxHz   = 1e6 / (tofUs * 2);                // 시간 마진 × 2
  let chosen = window.PRF_STEPS[0];
  for (const step of window.PRF_STEPS) if (step <= prfMaxHz) chosen = step;
  return { prf: chosen, tofUs, maxDistMm, soundSpeed: v };
};

// 기본 폼값 생성 (선택된 target 기반)
// v8.5: 신규 등록용 빈 폼 (DeviceDetail "+ 검사 대상 추가" 진입 시)
function buildEmptyTargetForm() {
  return {
    name: "",
    code: "",
    shape: "",
    od: "",
    th: "",
    idim: "",
    length: "",
    allow: "",
    material: "",
    fluid: "",
    std: "",
    temp: "",
    press: "",
    note: "",
  };
}

function buildTargetForm(target) {
  if (!target) target = {};
  // MOCK.targets desc를 파싱하기 어려우니 PIPE-A-204 기본값으로 시뮬레이션
  const defaults = {
    "PIPE-A-204": { code: "SK-ULSN-PA204", shape: "배관",         od: 300,  th: 10, idim: 280, length: 6000, allow: "2.0 mm", material: "탄소강 (S355)",    fluid: "고온 스팀",       std: "KS B 0817", temp: 380, press: 4.2 },
    "TANK-B-101": { code: "SK-ULSN-TB101", shape: "탱크 (구형)",  od: 1500, th: 14, idim: 1472,length: 0,    allow: "3.0 mm", material: "스테인레스 (316L)",fluid: "가스 — 수소",    std: "ASME Sec.V", temp: 25,  press: 8.0 },
    "VESSEL-C-301": { code: "SK-ULSN-VC301", shape: "탱크 (원통형)", od: 800, th: 12, idim: 776, length: 400,  allow: "2.5 mm", material: "스테인레스 (304)", fluid: "액체 — 화학약품", std: "API 510",   temp: 120, press: 2.0 },
    "FLANGE-D-08": { code: "SK-ULSN-FD08",  shape: "플랜지",      od: 200,  th: 18, idim: 164, length: 0,    allow: "3.0 mm", material: "탄소강 (S355)",    fluid: "고온 스팀",       std: "KS B 0817",  temp: 200, press: 3.5 },
    "DOME-E-12":   { code: "SK-ULSN-DE12",  shape: "Dome 헤드",   od: 1200, th: 15, idim: 1170,length: 0,    allow: "3.0 mm", material: "탄소강 (S355)",    fluid: "액체 — 원유",    std: "API 510",   temp: 60,  press: 1.5 },
    "WELD-F-22":   { code: "SK-ULSN-WF22",  shape: "용접부",      od: 0,    th: 12, idim: 0,   length: 800,  allow: "2.0 mm", material: "탄소강 (S355)",    fluid: "고온 스팀",       std: "KS B 0817",  temp: 350, press: 4.0 },
  };
  const d = defaults[target.id] || defaults["PIPE-A-204"];
  return {
    name: target.name || "PIPE-A-204",
    code: d.code,
    shape: d.shape,
    od: d.od,
    th: d.th,
    idim: d.idim,
    length: d.length,
    allow: d.allow,
    material: d.material,
    fluid: d.fluid,
    std: d.std,
    temp: d.temp,
    press: d.press,
    note: "",
  };
}

window.TargetManage = function TargetManage({ targetId, initialMode, onBack }) {
  const targets = window.MOCK.targets;
  // v8.5: initialMode === "new" → 신규 등록 폼 진입 (selectedId null + 빈 폼)
  const isNewMode = initialMode === "new";
  const [selectedId, setSelectedId] = $s(isNewMode ? null : (targetId || (targets[0] && targets[0].id)));
  const [search, setSearch]         = $s("");
  const initialTarget = isNewMode ? null : (targets.find(t => t.id === selectedId) || targets[0]);
  const [form, setForm]             = $s(isNewMode ? buildEmptyTargetForm() : buildTargetForm(initialTarget));
  const [autoPRF, setAutoPRF]       = $s(true);
  const [prfManual, setPrfManual]   = $s(2000);
  // v8.5: 채널 배치 마법사 모달
  const [showChannelWizard, setShowChannelWizard] = $s(false);

  // 선택된 target 변경 시 form 리셋 (selectedId null = 신규 모드)
  React.useEffect(() => {
    if (!selectedId) { setForm(buildEmptyTargetForm()); return; }
    const t = targets.find(x => x.id === selectedId);
    setForm(buildTargetForm(t));
  }, [selectedId]);

  const setField = (k, v) => setForm(f => ({ ...f, [k]: v }));

  // PRF 자동 계산
  const prfCalc = window.calcPRF(parseFloat(form.th) || 10, form.material);
  const prfValue = autoPRF ? prfCalc.prf : prfManual;

  // 필수 항목 검증 (대상명·형태·두께·소재·유체)
  const requiredOk = !!(form.name && form.shape && form.th && form.material && form.fluid);

  // 좌측 리스트 검색 필터
  const filteredTargets = search
    ? targets.filter(t => t.name.includes(search) || (t.desc || "").includes(search) || (buildTargetForm(t).code || "").includes(search))
    : targets;

  // 좌측 카드 short desc 생성
  const shortDesc = (t) => {
    const d = buildTargetForm(t);
    if (d.shape === "배관")        return `탄소강 배관 · 외경 ${d.od} / 두께 ${d.th} mm · ${d.fluid}`;
    if (d.shape.startsWith("탱크"))return `${d.material.split(" ")[0]} 탱크 · ∅ ${d.od} mm · ${d.fluid.split(" — ")[1] || d.fluid}`;
    if (d.shape === "플랜지")      return `플랜지 · ∅ ${d.od} mm · ${d.material.split(" ")[0]}`;
    if (d.shape === "Dome 헤드")   return `반구형 헤드 · ∅ ${d.od} mm · ${d.fluid.split(" — ")[1] || d.fluid}`;
    if (d.shape === "용접부")      return `용접부 · 직선 ${d.length} mm · ${d.material.split(" ")[0]}`;
    return t.desc || "";
  };

  // 표준 프리셋 (메인 매칭 — 3개 카드)
  const presets = [
    { id: "p1", name: "탄소강 배관 6~12mm @ 고온 스팀", params: "5 MHz · 28 dB · Pulser 200V · PRF 2,000 Hz · DAC ON", uses: 12, last: "2026-05-19", applied: true  },
    { id: "p2", name: "탄소강 배관 표준 (범용)",         params: "5 MHz · 26 dB · Pulser 180V · PRF 2,000 Hz",          uses: 28, last: "2026-05-21", applied: false },
    { id: "p3", name: "탄소강 고압 배관 (압력 ≥ 4 MPa)", params: "2.25 MHz · 32 dB · TCG ON · PRF 1,000 Hz",            uses:  5, last: "2026-05-15", applied: false },
  ];

  const formLabel = (txt, req) => (
    <div style={{ font: "700 11px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-medium)", marginBottom: 4 }}>
      {txt}{req && <span style={{ color: "var(--system-error)", marginLeft: 4 }}>*</span>}
    </div>
  );
  const sectionHeader = (txt) => (
    <div style={{ gridColumn: "1 / -1", font: "700 12px/1 var(--font-kr)", letterSpacing: "0.08em", color: "var(--content-low)", textTransform: "uppercase", padding: "12px 0 4px", borderBottom: "1px solid var(--border-low)" }}>{txt}</div>
  );

  return (
    <div className="erut-page-enter" style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: 0, padding: 0, height: "100%" }}>
      {/* ───── 좌측: 검사 대상 카드 리스트 ───── */}
      <div style={{ background: "var(--surface-subtle-1)", borderRight: "1px solid var(--border-medium)", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border-medium)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <h3 style={{ font: "700 14px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-high)", margin: 0 }}>검사 대상</h3>
            <span style={{ font: "400 11px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)" }}>{targets.length}개</span>
          </div>
          <input
            className="erut-field"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="검색 (대상명·소재·코드)"
            style={{ width: "100%", height: 32, fontSize: 12 }}
          />
          <button
            className="erut-btn erut-btn--emphasis erut-btn--sm"
            style={{ width: "100%", marginTop: 8 }}
            onClick={() => {
              // 새 빈 폼 (mock — 새 검사 대상 신규 작성 시뮬레이션)
              setSelectedId(null);
              setForm({ name: "", code: "", shape: "배관", od: "", th: "", idim: "", length: "", allow: "", material: "탄소강 (S355)", fluid: "고온 스팀", std: "KS B 0817", temp: "", press: "", note: "" });
            }}
          >+ 새 검사 대상 추가</button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 12px" }}>
          {filteredTargets.map((t) => {
            const isSelected = t.id === selectedId;
            return (
              <div
                key={t.id}
                onClick={() => setSelectedId(t.id)}
                style={{
                  background: isSelected ? "linear-gradient(rgba(34,133,239,0.06),rgba(34,133,239,0.06)), var(--surface-base)" : "var(--surface-base)",
                  border: isSelected ? "1px solid var(--border-emphasis)" : "1px solid var(--border-medium)",
                  padding: "10px 12px",
                  marginBottom: 8,
                  cursor: "pointer",
                }}
              >
                <div style={{ font: "700 13px/1 var(--font-kr)", letterSpacing: ".02em", color: isSelected ? "var(--content-emphasis)" : "var(--content-high)", marginBottom: 4 }}>{t.name}</div>
                <div style={{ font: "400 11px/1.4 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-medium)" }}>{shortDesc(t)}</div>
              </div>
            );
          })}
          {selectedId === null && (
            <div style={{ background: "linear-gradient(rgba(34,133,239,0.06),rgba(34,133,239,0.06)), var(--surface-base)", border: "1px dashed var(--border-emphasis)", padding: "10px 12px", marginBottom: 8 }}>
              <div style={{ font: "700 13px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-emphasis)", marginBottom: 4 }}>새 검사 대상 (미저장)</div>
              <div style={{ font: "400 11px/1.4 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-medium)" }}>우측 폼에서 정보 입력 후 저장</div>
            </div>
          )}
        </div>
      </div>

      {/* ───── 우측: 상세 입력 폼 + 프리셋 ───── */}
      <div style={{ padding: "20px 30px", overflowY: "auto" }}>
        {/* v8.5 Breadcrumb */}
        <window.Breadcrumb
          onBack={onBack}
          items={[
            { label: "메인" },
            { label: "검사 대상 관리", current: true },
          ]}
        />
        {/* 헤더 */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <h2 style={{ font: "700 20px/1.2 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-high)", margin: 0 }}>
              {form.name || "(신규)"} · {selectedId ? "편집" : "신규 등록"}
            </h2>
            <p style={{ font: "400 13px/1.4 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)", marginTop: 4, marginBottom: 0 }}>기본 정보 · 형상 · 운영 환경 · 표준 프리셋</p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {selectedId && (
              <button className="erut-btn erut-btn--subtle erut-btn--sm" style={{ color: "var(--system-error)" }}>검사 대상 삭제</button>
            )}
            <button className="erut-btn erut-btn--default erut-btn--sm" onClick={onBack}>← 메인</button>
            <button
              className={"erut-btn erut-btn--sm " + (requiredOk ? "erut-btn--emphasis" : "erut-btn--disabled")}
              disabled={!requiredOk}
              title={requiredOk ? "" : "필수 항목(*) 입력 필요"}
            >
              변경 사항 저장
            </button>
          </div>
        </div>

        {/* 검사 대상 항목 입력 폼 (3열 grid) */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px 18px" }}>
          {sectionHeader("기본 정보")}
          <div>
            {formLabel("대상명", true)}
            <input className="erut-field" value={form.name} onChange={(e) => setField("name", e.target.value)} style={{ width: "100%" }}/>
          </div>
          <div>
            {formLabel("코드")}
            <input className="erut-field" value={form.code} onChange={(e) => setField("code", e.target.value)} style={{ width: "100%" }}/>
          </div>
          <div>
            <div style={{ font: "700 11px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-medium)", marginBottom: 4 }}>도면 thumbnail <span style={{ fontWeight: 400, color: "var(--content-low)" }}>+ 채널 배치</span></div>
            <div style={{ display: "flex", gap: 6 }}>
              <button className="erut-btn erut-btn--default erut-btn--sm" style={{ flex: 1 }}>파일 첨부 ↑</button>
              {/* v8.5 신규: 채널 배치 마법사 진입 버튼 */}
              <button
                className="erut-btn erut-btn--emphasis erut-btn--sm"
                style={{ flex: 1.4, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 4 }}
                title="채널 배치 마법사 열기 (v8.5 신규)"
                onClick={() => setShowChannelWizard(true)}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="3" x2="9" y2="21"/></svg>
                채널 배치 ↗
              </button>
            </div>
          </div>

          {sectionHeader("형상")}
          <div>
            {formLabel("형태", true)}
            <select className="erut-field" value={form.shape} onChange={(e) => setField("shape", e.target.value)} style={{ width: "100%" }}>
              <option>배관</option><option>탱크 (구형)</option><option>탱크 (원통형)</option><option>플랜지</option><option>용접부</option><option>Dome 헤드</option>
            </select>
          </div>
          <div>
            {formLabel("외경 (mm)")}
            <input className="erut-field" value={form.od} onChange={(e) => setField("od", e.target.value)} style={{ width: "100%" }}/>
          </div>
          <div>
            {formLabel("두께 (mm)", true)}
            <input className="erut-field" value={form.th} onChange={(e) => setField("th", e.target.value)} style={{ width: "100%" }}/>
          </div>
          <div>
            {formLabel("내경 (mm)")}
            <input className="erut-field" value={form.idim} onChange={(e) => setField("idim", e.target.value)} style={{ width: "100%" }}/>
          </div>
          <div>
            {formLabel("길이 (mm)")}
            <input className="erut-field" value={form.length} onChange={(e) => setField("length", e.target.value)} style={{ width: "100%" }}/>
          </div>
          <div>
            {formLabel("허용 감육 (mm 또는 %)")}
            <input className="erut-field" value={form.allow} onChange={(e) => setField("allow", e.target.value)} style={{ width: "100%" }}/>
          </div>

          {sectionHeader("소재 · 유체 · 운영 환경")}
          <div>
            {formLabel("소재", true)}
            <select className="erut-field" value={form.material} onChange={(e) => setField("material", e.target.value)} style={{ width: "100%" }}>
              {Object.keys(window.SOUND_SPEEDS).map(m => <option key={m}>{m}</option>)}
              <option>기타 / 직접 입력</option>
            </select>
          </div>
          <div>
            {formLabel("유체 종류", true)}
            <select className="erut-field" value={form.fluid} onChange={(e) => setField("fluid", e.target.value)} style={{ width: "100%" }}>
              <option>고온 스팀</option><option>가스 — 수소</option><option>가스 — LNG</option><option>액체 — 원유</option><option>액체 — 물</option><option>액체 — 화학약품</option><option>기타</option>
            </select>
          </div>
          <div>
            {formLabel("적용 표준")}
            <select className="erut-field" value={form.std} onChange={(e) => setField("std", e.target.value)} style={{ width: "100%" }}>
              <option>KS B 0817</option><option>ASME Sec.V</option><option>API 510</option><option>NACE MR0175</option>
            </select>
          </div>
          <div>
            {formLabel("운영 온도 (°C)")}
            <input className="erut-field" value={form.temp} onChange={(e) => setField("temp", e.target.value)} style={{ width: "100%" }}/>
          </div>
          <div>
            {formLabel("운영 압력 (MPa)")}
            <input className="erut-field" value={form.press} onChange={(e) => setField("press", e.target.value)} style={{ width: "100%" }}/>
          </div>
          <div>
            {formLabel("비고")}
            <input className="erut-field" value={form.note} onChange={(e) => setField("note", e.target.value)} placeholder="자유 입력" style={{ width: "100%" }}/>
          </div>

          {/* 측정 파라미터 (PRF 자동 계산) */}
          {sectionHeader("측정 파라미터")}
          <div style={{ gridColumn: "1 / -1", padding: "10px 14px", background: "var(--surface-subtle-2)", border: "1px solid var(--border-low)", marginBottom: 4 }}>
            <div style={{ font: "400 11px/1.5 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-medium)" }}>
              <strong style={{ color: "var(--content-emphasis)", fontWeight: 700 }}>PRF (Pulse Repetition Frequency · 펄스 반복 주파수)</strong> — 초음파를 1초에 몇 번 송신할지 결정. 검사 대상의 두께·소재에 따라 자동 계산되며, 표준 프리셋 적용 시 override됩니다.
            </div>
          </div>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
              <div style={{ font: "700 11px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-medium)" }}>PRF (Hz)</div>
              <window.Toggle checked={autoPRF} onChange={setAutoPRF} size="sm" label="자동 계산"/>
            </div>
            <input
              className="erut-field"
              value={autoPRF ? prfValue.toLocaleString() : prfManual}
              onChange={(e) => setPrfManual(parseInt(e.target.value.replace(/,/g, ""), 10) || 0)}
              disabled={autoPRF}
              style={{ width: "100%", background: autoPRF ? "var(--surface-subtle-1)" : "var(--surface-base)", color: autoPRF ? "var(--content-low)" : "var(--content-high)" }}
            />
            <div style={{ font: "400 10px/1.4 var(--font-kr)", letterSpacing: ".02em", color: autoPRF ? "var(--system-success)" : "var(--content-low)", marginTop: 4 }}>
              {autoPRF ? `자동 계산 ON — 두께 ${form.th}mm · ${form.material.split(" ")[0]} 기준 권장값 ${prfValue.toLocaleString()} Hz` : "수동 입력 모드"}
            </div>
          </div>
          <div>
            {formLabel("계산 근거 (참고)")}
            <div style={{ padding: "10px 12px", background: "var(--surface-base)", border: "1px solid var(--border-low)", font: "400 11px/1.5 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-medium)" }}>
              <div style={{ marginBottom: 4 }}>소재 음속 ({form.material.split(" ")[0]}) : <strong style={{ color: "var(--content-high)" }}>{prfCalc.soundSpeed.toLocaleString()} m/s</strong></div>
              <div style={{ marginBottom: 4 }}>최대 측정 거리 : 두께 {form.th}mm × 3 = <strong style={{ color: "var(--content-high)" }}>{prfCalc.maxDistMm} mm</strong></div>
              <div style={{ marginBottom: 4 }}>왕복 시간 (ToF) : <strong style={{ color: "var(--content-high)" }}>{prfCalc.tofUs.toFixed(2)} μs</strong></div>
              <div style={{ paddingTop: 4, borderTop: "1px solid var(--border-low)", color: "var(--system-success)", fontWeight: 700 }}>→ 권장 PRF {prfCalc.prf.toLocaleString()} Hz (산업 표준 단계)</div>
            </div>
          </div>
        </div>

        {/* 표준 프리셋 */}
        <div style={{ marginTop: 20, background: "linear-gradient(rgba(34,133,239,0.05),rgba(34,133,239,0.05)), var(--surface-subtle-2)", border: "1px solid var(--border-emphasis)", padding: "14px 18px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div>
              <div style={{ font: "700 13px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-emphasis)" }}>검사체별 표준 프리셋</div>
              <div style={{ font: "400 11px/1.4 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-medium)", marginTop: 2 }}>
                위 검사 대상 정보(소재·두께·유체)에 맞는 프리셋을 선택하면 측정 파라미터(MHz·dB·Pulser·Gate·DAC 등)가 일괄 적용됩니다. <strong style={{ color: "var(--content-emphasis)" }}>평가 표준(KS B 0817 등)은 검사 대상의 "적용 표준" 항목과 분리</strong>되어 같은 프리셋을 여러 표준에 재사용 가능.
              </div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button className="erut-btn erut-btn--default erut-btn--sm">+ 현재 설정 프리셋으로 저장</button>
              <button className="erut-btn erut-btn--subtle erut-btn--sm">프리셋 라이브러리 ↗</button>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            {presets.map((p) => (
              <div
                key={p.id}
                style={{
                  background: "var(--surface-base)",
                  border: p.applied ? "1px solid var(--border-emphasis)" : "1px solid var(--border-medium)",
                  padding: "10px 12px",
                  position: "relative",
                  cursor: "pointer",
                }}
              >
                {p.applied && (
                  <div style={{ position: "absolute", top: 8, right: 8, padding: "1px 5px", font: "700 9px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-emphasis)", border: "1px solid var(--border-emphasis)", background: "var(--surface-base)" }}>적용 중</div>
                )}
                <div style={{ font: "700 12px/1.2 var(--font-kr)", letterSpacing: ".02em", color: p.applied ? "var(--content-emphasis)" : "var(--content-high)", marginBottom: 4, paddingRight: p.applied ? 50 : 0 }}>{p.name}</div>
                <div style={{ font: "400 10px/1.4 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-medium)" }}>{p.params}</div>
                <div style={{ marginTop: 6, font: "400 10px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)" }}>사용 {p.uses}회 · 마지막 {p.last}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* v8.5: 채널 배치 마법사 모달 */}
      {showChannelWizard && (
        <window.ChannelPlacementWizard
          targetName={form.name || "(신규)"}
          onClose={() => setShowChannelWizard(false)}
        />
      )}
    </div>
  );
};

// =================== v8.5: 채널 배치 마법사 모달 (3-step Stepper) ===================
window.ChannelPlacementWizard = function ChannelPlacementWizard({ targetName, onClose }) {
  const [step, setStep] = $s(2); // 1: 검사 대상 확인 · 2: 채널 매핑 · 3: 검증+저장
  const [theta, setTheta] = $s("45");
  const [zPos, setZPos]   = $s("600");

  // 배치된 채널 위치 (간단 시각화용)
  const placedChannels = [
    { ch: 1, x: 40, y: 180 }, { ch: 2, x: 80, y: 180 }, { ch: 3, x: 120, y: 180 },
    { ch: 4, x: 160, y: 180, selected: true },
    { ch: 5, x: 200, y: 180 }, { ch: 6, x: 240, y: 180 }, { ch: 7, x: 280, y: 180 }, { ch: 8, x: 320, y: 180 },
    { ch: 9, x: 40, y: 120 }, { ch: 10, x: 80, y: 120 }, { ch: 11, x: 120, y: 120 }, { ch: 12, x: 160, y: 120 },
    { ch: 13, x: 200, y: 120 }, { ch: 14, x: 240, y: 120 }, { ch: 15, x: 280, y: 120 }, { ch: 16, x: 320, y: 120 },
    { ch: 17, x: 40, y: 60 },  { ch: 18, x: 80, y: 60 },
  ];
  const unplacedChannels = [
    { x: 120, y: 60 }, { x: 160, y: 60 }, { x: 200, y: 60 }, { x: 240, y: 60 }, { x: 280, y: 60 }, { x: 320, y: 60 },
  ];

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(10,28,60,0.55)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: 1100, maxHeight: "90vh", background: "var(--surface-base)", border: "1px solid var(--border-medium)", display: "flex", flexDirection: "column" }}>
        {/* v8.8: 헤더 — titlebar 컬러 통일 */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px", borderBottom: "1px solid var(--border-medium)", background: "var(--content-medium)" }}>
          <div>
            <div style={{ marginBottom: 4 }}>
              <span style={{ font: "700 16px/1.2 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-inverse)" }}>채널 배치 마법사 — {targetName}</span>
            </div>
            <div style={{ font: "400 11px/1.4 var(--font-kr)", letterSpacing: ".02em", color: "rgba(255,255,255,0.7)" }}>각 채널의 부착 위치(θ, Z)를 사전 등록 — NDT 표준 Probe Setup 패턴</div>
          </div>
          <button onClick={onClose} aria-label="닫기" style={{ background: "transparent", border: "none", color: "var(--content-inverse)", cursor: "pointer", padding: 4, display: "inline-flex", alignItems: "center", justifyContent: "center" }}><window.EIcon.Close size={14}/></button>
        </div>

        {/* Stepper */}
        <div className="erut-crumb erut-crumb--step" style={{ margin: "12px 24px 0", borderBottom: "1px solid var(--border-medium)" }}>
          <div className="erut-crumb__steps">
            <span className={"erut-crumb__step " + (step > 1 ? "is-done" : step === 1 ? "is-active" : "")}>
              <span className="num">{step > 1 ? <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3,8 7,12 13,4"/></svg> : "1"}</span>
              검사 대상 확인 (PIPE-A-204)
            </span>
            <span className="erut-crumb__step-sep"/>
            <span className={"erut-crumb__step " + (step > 2 ? "is-done" : step === 2 ? "is-active" : "")}>
              <span className="num">{step > 2 ? <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3,8 7,12 13,4"/></svg> : "2"}</span>
              채널 매핑 (18 / 24)
            </span>
            <span className="erut-crumb__step-sep"/>
            <span className={"erut-crumb__step " + (step === 3 ? "is-active" : "")}>
              <span className="num">3</span>
              검증 + 저장
            </span>
          </div>
        </div>

        {/* 본문 (Step 2: 채널 매핑 — 메인 mockup) */}
        <div style={{ flex: 1, padding: "16px 24px", overflowY: "auto" }}>
          <div style={{ background: "var(--surface-base)", border: "1px solid var(--border-medium)", display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 0 }}>
            {/* 좌: 2D 전개도 */}
            <div style={{ padding: "14px 18px", borderRight: "1px solid var(--border-low)", position: "relative" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
                <span style={{ font: "700 12px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-high)" }}>PIPE-A-204 · 2D 전개도</span>
                <span style={{ font: "400 10px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)" }}>θ 0–360° × Z 0–1500mm</span>
              </div>
              <svg viewBox="0 0 600 240" style={{ width: "100%", height: 220, background: "var(--surface-subtle-1)", border: "1px solid var(--border-low)" }}>
                <line x1="0" y1="60" x2="600" y2="60" stroke="var(--border-low)" strokeWidth="0.5" strokeDasharray="3,3"/>
                <line x1="0" y1="120" x2="600" y2="120" stroke="var(--border-low)" strokeWidth="0.5" strokeDasharray="3,3"/>
                <line x1="0" y1="180" x2="600" y2="180" stroke="var(--border-low)" strokeWidth="0.5" strokeDasharray="3,3"/>
                <line x1="150" y1="0" x2="150" y2="240" stroke="var(--border-low)" strokeWidth="0.5" strokeDasharray="3,3"/>
                <line x1="300" y1="0" x2="300" y2="240" stroke="var(--border-low)" strokeWidth="0.5" strokeDasharray="3,3"/>
                <line x1="450" y1="0" x2="450" y2="240" stroke="var(--border-low)" strokeWidth="0.5" strokeDasharray="3,3"/>
                <text x="6" y="14" fontSize="9" fill="var(--content-low)" fontFamily="NanumSquare" fontWeight="700">Z (mm)</text>
                <text x="566" y="234" fontSize="9" fill="var(--content-low)" fontFamily="NanumSquare" fontWeight="700">θ (°)</text>
                {/* 배치된 채널 */}
                <g fill="var(--brand-primary)" stroke="var(--surface-base)" strokeWidth="1">
                  {placedChannels.map(c => (
                    <g key={c.ch}>
                      <circle cx={c.x} cy={c.y} r="6" stroke={c.selected ? "var(--system-error)" : undefined} strokeWidth={c.selected ? "2" : undefined}/>
                      <text x={c.x} y={c.y + 15} fontSize="7" fill={c.selected ? "var(--system-error)" : "var(--content-medium)"} fontFamily="NanumSquare" fontWeight="700" textAnchor="middle">{String(c.ch).padStart(2, "0")}{c.selected && "★"}</text>
                    </g>
                  ))}
                </g>
                {/* 미배치 채널 (점선) */}
                <g fill="none" stroke="var(--content-low)" strokeWidth="1" strokeDasharray="2,2">
                  {unplacedChannels.map((c, i) => <circle key={i} cx={c.x} cy={c.y} r="5"/>)}
                </g>
              </svg>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8, font: "400 10px/1.4 var(--font-kr)", letterSpacing: ".02em" }}>
                <div style={{ display: "flex", gap: 12 }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "var(--brand-primary)" }}><span style={{ width: 8, height: 8, background: "var(--brand-primary)", borderRadius: "50%" }}/>배치됨 18</span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "var(--content-low)" }}><span style={{ width: 8, height: 8, border: "1px solid var(--content-low)", borderRadius: "50%" }}/>미배치 6</span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "var(--system-error)" }}>★ 선택</span>
                </div>
                <span style={{ fontWeight: 700, color: "var(--content-emphasis)" }}>진행 18 / 24 ch</span>
              </div>
            </div>

            {/* 우: 좌표 입력 패널 */}
            <div style={{ padding: "14px 18px" }}>
              <div style={{ font: "700 12px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-high)", marginBottom: 10 }}>선택 채널 좌표</div>
              <div style={{ background: "linear-gradient(rgba(34,133,239,0.08),rgba(34,133,239,0.08)), var(--surface-subtle-2)", border: "1px solid var(--border-emphasis)", padding: "8px 12px", marginBottom: 12 }}>
                <div style={{ font: "700 13px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-emphasis)" }}>CH 04 · PIPE-A-204</div>
                <div style={{ font: "400 10px/1.3 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)", marginTop: 2 }}>탐촉자 SN: PXT-2024-104 · 5 MHz</div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
                <div>
                  <div style={{ font: "700 10px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-medium)", marginBottom: 4 }}>θ (둘레, 도)</div>
                  <input className="erut-field" value={theta} onChange={(e) => setTheta(e.target.value)} style={{ width: "100%", height: 30, fontSize: 12 }}/>
                </div>
                <div>
                  <div style={{ font: "700 10px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-medium)", marginBottom: 4 }}>Z (길이, mm)</div>
                  <input className="erut-field" value={zPos} onChange={(e) => setZPos(e.target.value)} style={{ width: "100%", height: 30, fontSize: 12 }}/>
                </div>
              </div>
              <div style={{ background: "var(--surface-subtle-1)", border: "1px solid var(--border-low)", padding: "8px 10px", marginBottom: 12, font: "400 10px/1.4 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-medium)" }}>
                <strong style={{ fontWeight: 700 }}>기준점</strong>: θ=0° 용접선 교차점 · Z=0 바닥 플랜지
                <button className="erut-btn erut-btn--subtle erut-btn--sm" style={{ marginLeft: 6, fontSize: 9, padding: "0 5px", height: 18 }}>변경 ↗</button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <button className="erut-btn erut-btn--emphasis erut-btn--sm" style={{ width: "100%" }}>좌표 저장 + 다음 채널 →</button>
                <button className="erut-btn erut-btn--default erut-btn--sm" style={{ width: "100%" }}>일괄 배치 (가로/세로 N mm 간격)</button>
                <button className="erut-btn erut-btn--subtle erut-btn--sm" style={{ width: "100%" }}>CSV 가져오기 (기존 설치 재사용)</button>
              </div>
            </div>
          </div>

          {/* 입력 방법 안내 */}
          <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            {[
              { num: "①", title: "숫자 직접 입력", desc: "현장 줄자 측정한 (θ, Z) 좌표를 입력. 정확도 ±2mm." },
              { num: "②", title: "전개도 클릭 배치", desc: "채널 선택 후 좌측 전개도 클릭으로 빠른 배치. 정확도 ±5mm." },
              { num: "③", title: "일괄 / CSV", desc: "패턴 일괄 배치 또는 CSV import로 채널 일거에 등록." },
            ].map(m => (
              <div key={m.num} style={{ padding: "10px 14px", background: "var(--surface-base)", border: "1px solid var(--border-medium)", borderLeft: "3px solid var(--brand-primary)" }}>
                <div style={{ font: "700 11px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-emphasis)", marginBottom: 4 }}>방법 {m.num} {m.title}</div>
                <div style={{ font: "400 10px/1.4 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-medium)" }}>{m.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 하단 액션 */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 24px", borderTop: "1px solid var(--border-medium)", background: "var(--surface-subtle-1)" }}>
          <button className="erut-btn erut-btn--subtle erut-btn--sm" disabled={step === 1} onClick={() => setStep(s => Math.max(1, s - 1))}>← 이전 단계</button>
          <div style={{ font: "400 11px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)" }}>검사체별 1회 설정 → 모든 검사 세션에서 자동 적용</div>
          {step < 3 ? (
            <button className="erut-btn erut-btn--emphasis erut-btn--sm" onClick={() => setStep(s => Math.min(3, s + 1))}>다음 단계 →</button>
          ) : (
            <button className="erut-btn erut-btn--emphasis erut-btn--sm" onClick={onClose}>저장 + 닫기</button>
          )}
        </div>
      </div>
    </div>
  );
};

// =================== Screen · [3] GATE SETUP ===================
// Layout matches ServiceFlow_Analysis SLIDE 8 [3] 센서 Gate 설정 (v3.1).
// 드래그 인터랙션은 시각적 mockup (실제 드래그 핸들러 없음 — input 양방향 sync는 구현).

window.GateSetup = function GateSetup({ channel, onBack, onPrevChannel, onNextChannel }) {
  const chNum = (channel || "ch04").replace(/\D/g, "").padStart(2, "0");
  const [showGateOverlay, setShowGateOverlay] = $s(true);
  const [showHint, setShowHint] = $s(true);
  const [gateA, setGateA] = $s({ active: true, start: 2.5, width: 8.0, threshold: 80, mode: "Peak" });
  const [gateB, setGateB] = $s({ active: true, start: 14.0, width: 10.0, threshold: 60, mode: "ToF" });
  const [gateCActive, setGateCActive] = $s(false);

  // chart range: 0 ~ 50 μs, mapped to 0 ~ 100% left
  const toPct = (us) => (us / 50) * 100;
  const aLeft  = toPct(gateA.start) + "%";
  const aWidth = toPct(gateA.width) + "%";
  const bLeft  = toPct(gateB.start) + "%";
  const bWidth = toPct(gateB.width) + "%";
  // threshold mapping: 0 ~ 100% → top 32% (high) ~ 75% (low)
  const aThrTop = (75 - (gateA.threshold / 100) * 43) + "%";
  const bThrTop = (75 - (gateB.threshold / 100) * 43) + "%";

  const setA = (k, v) => setGateA(g => ({ ...g, [k]: v }));
  const setB = (k, v) => setGateB(g => ({ ...g, [k]: v }));

  // ───── Drag interaction (move · resize-l · resize-r · threshold) ─────
  // 단일 진실 공급원은 gateA/gateB state → 드래그·input 모두 같은 state 변경 → 양방향 sync 자동
  const chartRef = React.useRef(null);
  const [drag, setDrag] = $s(null);
  // drag = { gate, mode, startX, initStart, initWidth, initThreshold }

  function startDrag(gate, mode, e) {
    e.preventDefault();
    e.stopPropagation();
    const g = gate === "A" ? gateA : gateB;
    setDrag({
      gate, mode,
      startX: e.clientX,
      initStart: g.start, initWidth: g.width, initThreshold: g.threshold,
    });
  }

  React.useEffect(() => {
    if (!drag) return;
    const onMove = (e) => {
      const chart = chartRef.current;
      if (!chart) return;
      const rect = chart.getBoundingClientRect();
      const setter = drag.gate === "A" ? setGateA : setGateB;

      if (drag.mode === "threshold") {
        const yPct = ((e.clientY - rect.top) / rect.height) * 100;
        // 역변환: top = 75 - (thr/100)*43 → thr = (75 - top) / 43 * 100
        let newThr = Math.round(((75 - yPct) / 43) * 100);
        newThr = Math.max(0, Math.min(100, newThr));
        setter(g => ({ ...g, threshold: newThr }));
        return;
      }

      // horizontal 드래그: pixel delta → μs delta
      const dxUs = ((e.clientX - drag.startX) / rect.width) * 50;
      const snap = (us) => Math.round(us * 10) / 10; // 0.1 μs snap

      if (drag.mode === "move") {
        let newStart = snap(drag.initStart + dxUs);
        newStart = Math.max(0, Math.min(50 - drag.initWidth, newStart));
        setter(g => ({ ...g, start: newStart }));
      } else if (drag.mode === "resize-l") {
        // 좌측 핸들: 우측 가장자리 고정 (start+width 일정), start만 이동
        const rightEdge = drag.initStart + drag.initWidth;
        let newStart = snap(drag.initStart + dxUs);
        newStart = Math.max(0, Math.min(rightEdge - 0.5, newStart));
        const newWidth = snap(rightEdge - newStart);
        setter(g => ({ ...g, start: newStart, width: newWidth }));
      } else if (drag.mode === "resize-r") {
        // 우측 핸들: 좌측 가장자리 고정, width만 변경
        let newWidth = snap(drag.initWidth + dxUs);
        newWidth = Math.max(0.5, Math.min(50 - drag.initStart, newWidth));
        setter(g => ({ ...g, width: newWidth }));
      }
    };
    const onUp = () => setDrag(null);
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
  }, [drag]);

  // 측정값 (mock — Gate Start/Width 기반 계산)
  const aPeak = 82, aToF = (gateA.start + gateA.width / 2.5).toFixed(1), aThick = ((gateA.start + gateA.width / 2.5) * 3.0).toFixed(1);
  const bPeak = 68, bToF = (gateB.start + gateB.width / 2.0).toFixed(1), bThick = ((gateB.start + gateB.width / 2.0) * 3.0).toFixed(1);

  function GateGroup({ name, color, gate, onChange, recommend, recommendColor }) {
    return (
      <div style={{ borderLeft: "3px solid " + color, padding: "10px 12px", background: "var(--surface-base)", marginBottom: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div style={{ font: "700 13px/1 var(--font-kr)", letterSpacing: ".02em", color }}>{name}</div>
          <window.Toggle checked={gate.active} onChange={(v) => onChange("active", v)} size="sm" label="활성"/>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 10px" }}>
          <div>
            <div style={{ font: "400 10px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)", marginBottom: 3 }}>Start (μs)</div>
            <input className="erut-field" value={gate.start} onChange={(e) => onChange("start", parseFloat(e.target.value) || 0)} style={{ width: "100%", height: 30, padding: "4px 8px", fontSize: 12 }}/>
          </div>
          <div>
            <div style={{ font: "400 10px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)", marginBottom: 3 }}>Width (μs)</div>
            <input className="erut-field" value={gate.width} onChange={(e) => onChange("width", parseFloat(e.target.value) || 0)} style={{ width: "100%", height: 30, padding: "4px 8px", fontSize: 12 }}/>
          </div>
          <div>
            <div style={{ font: "400 10px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)", marginBottom: 3 }}>Threshold (%)</div>
            <input className="erut-field" value={gate.threshold} onChange={(e) => onChange("threshold", parseFloat(e.target.value) || 0)} style={{ width: "100%", height: 30, padding: "4px 8px", fontSize: 12 }}/>
          </div>
          <div>
            <div style={{ font: "400 10px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)", marginBottom: 3 }}>Mode</div>
            <select className="erut-field" value={gate.mode} onChange={(e) => onChange("mode", e.target.value)} style={{ width: "100%", height: 30, padding: "4px 8px", fontSize: 12 }}>
              <option>Peak</option><option>Edge</option><option>ToF</option>
            </select>
          </div>
        </div>
        <div style={{ marginTop: 8, font: "400 10px/1.4 var(--font-kr)", letterSpacing: ".02em", color: recommendColor }}>{recommend}</div>
      </div>
    );
  }

  return (
    <div className="erut-page-enter" style={{ display: "grid", gridTemplateColumns: "1fr 360px", gridTemplateRows: "40px 1fr", alignContent: "start", columnGap: 20, rowGap: 20, padding: "20px 40px", height: "100%" }}>
      {/* v8.5 Breadcrumb */}
      <window.Breadcrumb
        onBack={onBack}
        items={[
          { label: "메인" },
          { label: "장비 상세 (MCuF-001)" },
          { label: "Gate 설정 (CH " + chNum + ")", current: true },
        ]}
        style={{ gridRow: 1, gridColumn: "1 / -1" }}
      />

      {/* ───── 좌측: 헤더 + 드래그 안내 + A-scan 차트 + 측정값 ───── */}
      <div style={{ gridRow: 2, gridColumn: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        {/* 채널 헤더 */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div>
            <h2 style={{ font: "700 20px/1.2 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-high)", margin: 0 }}>CH {chNum} · Gate 설정</h2>
            <p style={{ font: "400 12px/1.4 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)", marginTop: 4, marginBottom: 0 }}>PXT-2024-0{chNum} · 5 MHz · Gain 28 dB</p>
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <window.Toggle checked={showGateOverlay} onChange={setShowGateOverlay} size="sm" label="Gate 범위 표시"/>
            <span style={{ width: 1, height: 18, background: "var(--border-medium)" }}/>
            <button className="erut-btn erut-btn--subtle erut-btn--sm" onClick={onPrevChannel}>← CH {String(Math.max(1, parseInt(chNum, 10) - 1)).padStart(2, "0")}</button>
            <button className="erut-btn erut-btn--subtle erut-btn--sm" onClick={onNextChannel}>CH {String(parseInt(chNum, 10) + 1).padStart(2, "0")} →</button>
          </div>
        </div>

        {/* 드래그 안내 배너 */}
        {showHint && (
          <div style={{ background: "linear-gradient(rgba(34,133,239,0.08),rgba(34,133,239,0.08)), var(--surface-subtle-2)", border: "1px solid var(--border-emphasis)", padding: "10px 14px", marginBottom: 12, display: "flex", alignItems: "center", gap: 12 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--content-emphasis)" strokeWidth="1.5"><path d="M3 11 L6 8 L6 10 L18 10 L18 8 L21 11 L18 14 L18 12 L6 12 L6 14 Z"/></svg>
            <div style={{ flex: 1 }}>
              <div style={{ font: "700 12px/1.2 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-emphasis)" }}>마우스 드래그로 Gate 범위 설정</div>
              <div style={{ font: "400 11px/1.4 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-medium)", marginTop: 2 }}>Gate 영역 가운데를 드래그하여 이동 · 양 끝을 잡아 폭 조정 · Threshold 수평선을 위/아래로 드래그하여 임계값 변경. 정밀 값은 우측 input field 사용.</div>
            </div>
            <button className="erut-btn erut-btn--subtle erut-btn--sm" onClick={() => setShowHint(false)}>안내 닫기</button>
          </div>
        )}

        {/* A-SCAN 차트 (드래그 인터랙션) */}
        <div ref={chartRef} style={{ background: "var(--surface-base)", border: "1px solid var(--border-medium)", height: 360, position: "relative", userSelect: drag ? "none" : "auto" }}>
          <div style={{ position: "absolute", top: 8, left: 12, font: "700 11px/1 var(--font-kr)", letterSpacing: "0.08em", color: "var(--content-low)", textTransform: "uppercase" }}>A-SCAN</div>
          <div style={{ position: "absolute", top: 8, right: 12, font: "400 12px/1 var(--font-kr)", color: "var(--content-low)" }}>Range 0 – 50 μs · 시간축</div>

          {/* v8.6: 정적 파형 SVG (애니메이션 제거) */}
          <svg viewBox="0 0 1000 300" preserveAspectRatio="none" width="100%" height="300" style={{ position: "absolute", top: 30, left: 0, right: 0, pointerEvents: "none" }}>
            <line x1="0" y1="250" x2="1000" y2="250" stroke="var(--border-low)" strokeWidth="1"/>
            <line x1="0" y1="170" x2="1000" y2="170" stroke="var(--border-low)" strokeWidth="0.5" strokeDasharray="2,4"/>
            <line x1="0" y1="85" x2="1000" y2="85" stroke="var(--border-low)" strokeWidth="0.5" strokeDasharray="2,4"/>
            <path d="M0 250 L175 250 L200 215 L215 30 L230 270 L245 250 L525 250 L550 220 L565 85 L580 265 L595 250 L1000 250" stroke="var(--brand-primary)" strokeWidth="2" fill="none"/>
          </svg>

          {showGateOverlay && gateA.active && (
            <>
              <div
                onMouseDown={(e) => startDrag("A", "move", e)}
                style={{ position: "absolute", top: 32, bottom: 30, left: aLeft, width: aWidth, background: "var(--system-error)", opacity: 0.12, borderLeft: "2px solid var(--system-error)", borderRight: "2px solid var(--system-error)", cursor: "move" }}
              />
              <div
                onMouseDown={(e) => startDrag("A", "resize-l", e)}
                style={{ position: "absolute", top: "calc(50% - 14px)", left: `calc(${aLeft} - 5px)`, width: 10, height: 28, background: "var(--surface-base)", border: "2px solid rgba(255, 0, 94, 0.5)", cursor: "ew-resize", zIndex: 2 }}
              />
              <div
                onMouseDown={(e) => startDrag("A", "resize-r", e)}
                style={{ position: "absolute", top: "calc(50% - 14px)", left: `calc(${aLeft} + ${aWidth} - 5px)`, width: 10, height: 28, background: "var(--surface-base)", border: "2px solid rgba(255, 0, 94, 0.5)", cursor: "ew-resize", zIndex: 2 }}
              />
              <div style={{ position: "absolute", top: 38, left: `calc(${aLeft} + 4px)`, font: "700 11px/1 var(--font-kr)", color: "var(--system-error)", pointerEvents: "none" }}>Gate A</div>
              <div style={{ position: "absolute", bottom: 38, left: `calc(${aLeft} + 4px)`, font: "400 10px/1 var(--font-kr)", color: "var(--system-error)", pointerEvents: "none" }}>{gateA.start.toFixed(1)} ~ {(gateA.start + gateA.width).toFixed(1)} μs</div>
              {/* Threshold — 12px 높이의 hit 영역, 가운데 dashed 라인 */}
              <div
                onMouseDown={(e) => startDrag("A", "threshold", e)}
                style={{ position: "absolute", left: 0, right: 0, top: `calc(${aThrTop} - 6px)`, height: 12, cursor: "ns-resize" }}
              >
                <div style={{ position: "absolute", left: 0, right: 0, top: 5, borderTop: "2px dashed var(--system-error)" }}/>
              </div>
              <div style={{ position: "absolute", right: 12, top: `calc(${aThrTop} - 14px)`, font: "700 10px/1 var(--font-kr)", color: "var(--system-error)", background: "var(--surface-base)", padding: "2px 4px", pointerEvents: "none" }}>A · {gateA.threshold}%</div>
            </>
          )}
          {showGateOverlay && gateB.active && (
            <>
              <div
                onMouseDown={(e) => startDrag("B", "move", e)}
                style={{ position: "absolute", top: 32, bottom: 30, left: bLeft, width: bWidth, background: "var(--brand-primary)", opacity: 0.12, borderLeft: "2px solid var(--brand-primary)", borderRight: "2px solid var(--brand-primary)", cursor: "move" }}
              />
              <div
                onMouseDown={(e) => startDrag("B", "resize-l", e)}
                style={{ position: "absolute", top: "calc(50% - 14px)", left: `calc(${bLeft} - 5px)`, width: 10, height: 28, background: "var(--surface-base)", border: "2px solid rgba(34, 133, 239, 0.5)", cursor: "ew-resize", zIndex: 2 }}
              />
              <div
                onMouseDown={(e) => startDrag("B", "resize-r", e)}
                style={{ position: "absolute", top: "calc(50% - 14px)", left: `calc(${bLeft} + ${bWidth} - 5px)`, width: 10, height: 28, background: "var(--surface-base)", border: "2px solid rgba(34, 133, 239, 0.5)", cursor: "ew-resize", zIndex: 2 }}
              />
              <div style={{ position: "absolute", top: 38, left: `calc(${bLeft} + 4px)`, font: "700 11px/1 var(--font-kr)", color: "var(--brand-primary)", pointerEvents: "none" }}>Gate B</div>
              <div style={{ position: "absolute", bottom: 38, left: `calc(${bLeft} + 4px)`, font: "400 10px/1 var(--font-kr)", color: "var(--brand-primary)", pointerEvents: "none" }}>{gateB.start.toFixed(1)} ~ {(gateB.start + gateB.width).toFixed(1)} μs</div>
              <div
                onMouseDown={(e) => startDrag("B", "threshold", e)}
                style={{ position: "absolute", left: 0, right: 0, top: `calc(${bThrTop} - 6px)`, height: 12, cursor: "ns-resize" }}
              >
                <div style={{ position: "absolute", left: 0, right: 0, top: 5, borderTop: "2px dashed var(--brand-primary)" }}/>
              </div>
              <div style={{ position: "absolute", right: 12, top: `calc(${bThrTop} - 14px)`, font: "700 10px/1 var(--font-kr)", color: "var(--brand-primary)", background: "var(--surface-base)", padding: "2px 4px", pointerEvents: "none" }}>B · {gateB.threshold}%</div>
            </>
          )}
        </div>

        {/* Gate 측정값 요약 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
          <div style={{ borderLeft: "3px solid var(--system-error)", background: "var(--surface-subtle-2)", padding: "10px 14px" }}>
            <div style={{ font: "700 11px/1 var(--font-kr)", letterSpacing: "0.08em", color: "var(--system-error)", textTransform: "uppercase", marginBottom: 6 }}>Gate A — {gateA.mode} Mode</div>
            <div style={{ display: "flex", gap: 18, font: "400 12px/1.4 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-medium)" }}>
              <span>피크 <strong style={{ fontWeight: 700, color: "var(--content-high)" }}>{aPeak}% FSH</strong></span>
              <span>ToF <strong style={{ fontWeight: 700, color: "var(--content-high)" }}>{aToF} μs</strong></span>
              <span>두께 <strong style={{ fontWeight: 700, color: "var(--content-high)" }}>{aThick} mm</strong></span>
            </div>
          </div>
          <div style={{ borderLeft: "3px solid var(--brand-primary)", background: "var(--surface-subtle-2)", padding: "10px 14px" }}>
            <div style={{ font: "700 11px/1 var(--font-kr)", letterSpacing: "0.08em", color: "var(--brand-primary)", textTransform: "uppercase", marginBottom: 6 }}>Gate B — {gateB.mode} Mode</div>
            <div style={{ display: "flex", gap: 18, font: "400 12px/1.4 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-medium)" }}>
              <span>피크 <strong style={{ fontWeight: 700, color: "var(--content-high)" }}>{bPeak}% FSH</strong></span>
              <span>ToF <strong style={{ fontWeight: 700, color: "var(--content-high)" }}>{bToF} μs</strong></span>
              <span>두께 <strong style={{ fontWeight: 700, color: "var(--content-high)" }}>{bThick} mm</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* ───── 우측: 정밀 input 패널 (양방향 sync) ───── */}
      <div style={{ gridRow: 2, gridColumn: 2, minWidth: 0, background: "var(--surface-subtle-1)", border: "1px solid var(--border-medium)", padding: 16, overflowY: "auto" }}>
        <div style={{ font: "700 13px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-high)", marginBottom: 4 }}>Gate 파라미터 — 정밀 설정</div>
        <div style={{ font: "400 11px/1.5 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)", marginBottom: 14 }}>차트 드래그와 양방향 sync. 권장값은 채널·탐촉자·주파수 기준 자동 계산.</div>

        <GateGroup name="Gate A" color="var(--system-error)"   gate={gateA} onChange={setA} recommend="권장 : Start 3.0 / Width 7.5 / Thr 75" recommendColor="var(--system-success)"/>
        <GateGroup name="Gate B" color="var(--brand-primary)" gate={gateB} onChange={setB} recommend="권장 : 12.5 / 11.0 / 65 (미세 차이)" recommendColor="var(--system-caution)"/>

        {/* Gate C 그룹 (비활성) */}
        <div style={{ borderLeft: "3px solid var(--border-medium)", padding: "10px 12px", background: "var(--surface-base)", marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ font: "700 13px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)" }}>Gate C</div>
            <window.Toggle checked={gateCActive} onChange={setGateCActive} size="sm" label={gateCActive ? "활성" : "비활성"}/>
          </div>
          <div style={{ marginTop: 6, font: "400 11px/1.4 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)" }}>다중 반사용. 활성화 시 차트에 표시.</div>
        </div>

        {/* 하단 액션 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingTop: 12, borderTop: "1px solid var(--border-medium)" }}>
          <button className="erut-btn erut-btn--default erut-btn--m" style={{ width: "100%" }}>권고값 일괄 적용</button>
          <button className="erut-btn erut-btn--emphasis erut-btn--m" style={{ width: "100%" }}>저장</button>
        </div>
      </div>
    </div>
  );
};

window.RealtimeScan = function RealtimeScan({ channel, state, setState, elapsed, setElapsed, onBack }) {
  // state(measureState) · elapsed는 App에서 lift up — toolbar 우측에 표시.
  // 일시정지/측정 중지/긴급 정지/측정 재개 버튼은 setState로 동일하게 상태 전환.
  // 메인 [11]의 "전체 진행률 · 81/150 라인" 진행 바는 고정형 컨텍스트(라인 스캔 없음)에 부적합하여 제외.
  const [selectedCh, setSelectedCh] = $s(4); // 64ch grid 선택 (main: CH 04)
  const [autoSwitch, setAutoSwitch] = $s(true);
  const [showAlert, setShowAlert] = $s(true);

  const defects = window.MOCK.realtimeDefects;
  const criticalDefect = defects.find(d => d.type === "Critical");

  // v9.5 (NDT 1.8): 64ch cells — ChannelGrid 통합 컴포넌트 사용. 결함 + 부착 상태 동시 표현
  const unattachedSet = new Set([22, 49]); // 미부착 2채널
  const weakSet = new Set([7, 12, 31, 38, 50, 55]); // 약함 6채널 (mock)
  const cells64 = [];
  for (let i = 1; i <= 64; i++) {
    const def = defects.find(d => d.channel === i);
    const state = unattachedSet.has(i) ? "err" : weakSet.has(i) ? "warn" : "ok";
    cells64.push({
      num: i,
      id: "ch" + String(i).padStart(2, "0"),
      sensor: { id: "ch" + String(i).padStart(2, "0"), state },
      defectLevel: def ? def.type.toLowerCase() : null, // "Critical" → "critical"
      targetName: i <= 24 ? "PIPE-A-204" : i <= 48 ? "TANK-B-101" : "VESSEL-C-301",
    });
  }

  // v8.5: 채널 부착 상태 detail (우측 패널 위젯용 — 카운터는 ChannelGrid가 자동 집계)
  const channelAttachStatus = {
    detail: [
      { ch: 22, target: "PIPE-A-204",   signal: 18, status: "미부착" },
      { ch: 49, target: "VESSEL-C-301", signal: 22, status: "미부착" },
      { ch: 31, target: "TANK-B-101",   signal: 42, status: "약함" },
    ],
  };

  return (
    <div className="erut-page-enter" style={{ padding: "20px 24px", height: "100%", display: "grid", gridTemplateColumns: "1fr 340px 320px", gridTemplateRows: "40px auto 540px", alignContent: "start", columnGap: 14, rowGap: 20 }}>
      {/* v8.5 Breadcrumb */}
      <window.Breadcrumb
        onBack={onBack}
        items={[
          { label: "메인" },
          { label: "장비 상세 (MCuF-001)" },
          { label: "실시간 스캔 · 세션 #047", current: true },
        ]}
        style={{ gridRow: 1, gridColumn: "1 / -1" }}
      />

      {/* v8.8: Critical 알림 — grid row 2, 양 컬럼 span (좌·우 분리되어 정렬됨) */}
      {showAlert && criticalDefect && (
        <div style={{ gridRow: 2, gridColumn: "1 / -1", background: "var(--surface-base)", border: "1px solid var(--system-error)", borderLeft: "4px solid var(--system-error)", padding: "12px 16px", display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ color: "var(--system-error)", flexShrink: 0 }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 2 L22 20 L2 20 Z"/>
              <line x1="12" y1="9" x2="12" y2="14"/>
              <circle cx="12" cy="17" r="0.5" fill="currentColor"/>
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ font: "700 14px/1.2 var(--font-kr)", letterSpacing: ".02em", color: "var(--system-error)" }}>Critical 결함 검출 · 진폭 {criticalDefect.amp} %</div>
            <div style={{ font: "400 12px/1.5 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-high)", marginTop: 2 }}>채널 {criticalDefect.channel} · ToF {criticalDefect.tof} μs · 두께 {criticalDefect.thickness} mm · 임계값 80 % 초과 · 자동 마킹 완료</div>
          </div>
          <button className="erut-btn erut-btn--default erut-btn--sm" onClick={() => setShowAlert(false)}>확인 후 계속</button>
          <button className="erut-btn erut-btn--subtle erut-btn--sm" onClick={() => setState("paused")}>일시정지 후 재측정</button>
        </div>
      )}

      {/* v9.7: A-scan — column 1 (1fr, 가장 큰 영역) */}
      <div style={{ gridRow: 3, gridColumn: 1, minWidth: 0, height: 540, background: "var(--surface-base)", border: "1px solid var(--border-medium)", position: "relative" }}>
        {/* v8.5: 채널명 강조 (20px content-high) */}
        <div style={{ position: "absolute", top: 8, left: 14, display: "flex", alignItems: "baseline", gap: 10 }}>
          <span style={{ font: "700 20px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-high)" }}>CH {String(selectedCh).padStart(2, "0")}</span>
          <span style={{ font: "700 11px/1 var(--font-kr)", letterSpacing: ".04em", color: "var(--content-low)", textTransform: "uppercase" }}>A-SCAN</span>
        </div>
        {/* Gate A */}
        <div style={{ position: "absolute", top: 48, bottom: 36, left: "18%", width: "22%", background: "var(--system-error)", opacity: 0.12, borderLeft: "2px solid var(--system-error)", borderRight: "2px solid var(--system-error)" }}/>
        <div style={{ position: "absolute", top: 56, left: "19%", font: "700 11px/1 var(--font-kr)", color: "var(--system-error)" }}>Gate A · 94%</div>
        {/* Gate B */}
        <div style={{ position: "absolute", top: 48, bottom: 36, left: "55%", width: "25%", background: "var(--brand-primary)", opacity: 0.12, borderLeft: "2px solid var(--brand-primary)", borderRight: "2px solid var(--brand-primary)" }}/>
        <div style={{ position: "absolute", top: 56, left: "56%", font: "700 11px/1 var(--font-kr)", color: "var(--brand-primary)" }}>Gate B · 68%</div>
        {/* Threshold */}
        <div style={{ position: "absolute", left: 0, right: 0, top: "30%", borderTop: "1px dashed var(--system-error)" }}/>
        {/* 정적 파형 SVG */}
        <svg viewBox="0 0 800 300" preserveAspectRatio="none" width="100%" height="calc(100% - 76px)" style={{ position: "absolute", top: 40, left: 0, right: 0 }}>
          <line x1="0" y1="250" x2="800" y2="250" stroke="var(--border-low)" strokeWidth="1"/>
          <line x1="0" y1="170" x2="800" y2="170" stroke="var(--border-low)" strokeWidth="0.5" strokeDasharray="2,4"/>
          <line x1="0" y1="85"  x2="800" y2="85"  stroke="var(--border-low)" strokeWidth="0.5" strokeDasharray="2,4"/>
          <path d="M0 250 L140 250 L160 215 L172 30 L184 270 L196 250 L420 250 L440 220 L452 85 L464 265 L476 250 L800 250" stroke="var(--brand-primary)" strokeWidth="2" fill="none"/>
        </svg>
        {/* 측정값 stripe (하단) */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, display: "flex", gap: 14, padding: "8px 14px", background: "var(--surface-subtle-2)", borderTop: "1px solid var(--border-low)", font: "400 11px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-medium)" }}>
          <span>Gate A 피크 <strong style={{ fontWeight: 700, color: "var(--system-error)" }}>94% FSH</strong></span>
          <span>ToF <strong style={{ fontWeight: 700, color: "var(--content-high)" }}>5.8 μs</strong></span>
          <span>두께 <strong style={{ fontWeight: 700, color: "var(--content-high)" }}>17.4 mm</strong></span>
          <span>Gate B ToF <strong style={{ fontWeight: 700, color: "var(--content-high)" }}>19.2 μs</strong></span>
          <span style={{ marginLeft: "auto" }}>샘플링 <strong style={{ fontWeight: 700, color: "var(--content-high)" }}>100 MHz</strong></span>
        </div>
      </div>

      {/* v9.7: 64CH 채널 상태 — column 3 (320px). erut-panel 헤더 적용 */}
      <div className="erut-panel" style={{ gridRow: 3, gridColumn: 3, minWidth: 0 }}>
        <div className="erut-panel__header">64CH 채널 상태</div>
        <div className="erut-panel__body" style={{ overflow: "visible", padding: 14, display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <label className="erut-toggle" style={{ flexDirection: "row-reverse" }} onClick={() => setAutoSwitch(!autoSwitch)}>
              <span className={"erut-toggle__track" + (autoSwitch ? " is-on" : "")}>
                <span className="erut-toggle__thumb"/>
              </span>
              <span className="erut-toggle__label erut-toggle__label--sm">결함 검출 시 자동 전환</span>
            </label>
          </div>
          <window.ChannelGrid
            cells={cells64}
            totalCh={64}
            selectedCh={selectedCh}
            variant="realtime"
            forceStrongAll={true}
            showTitle={false}
            onCellClick={(n) => setSelectedCh(n)}
          />
        </div>
      </div>

      {/* v9.7: 검사 대상·부착 상태·측정 제어 — column 2 (340px, 중앙) */}
      <div className="erut-panel" style={{ gridRow: 3, gridColumn: 2, minWidth: 0 }}>
        <div className="erut-panel__header">검사 대상 · 부착 상태 · 측정 제어</div>
        <div className="erut-panel__body" style={{ overflow: "visible", padding: 14 }}>

          {/* 검사 대상 정보 (현재 선택 채널의 검사체) */}
          <div style={{ font: "700 11px/1 var(--font-kr)", letterSpacing: "0.08em", color: "var(--content-low)", textTransform: "uppercase", marginBottom: 6 }}>검사 대상</div>
          <div style={{ background: "var(--surface-subtle-2)", border: "1px solid var(--border-medium)", padding: "10px 12px" }}>
            <div style={{ marginBottom: 4 }}>
              <span style={{ font: "700 13px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-high)" }}>PIPE-A-204</span>
            </div>
            <div style={{ font: "400 11px/1.4 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)", marginBottom: 8 }}>배관 · 탄소강 · ASME B31.3</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 10px", font: "400 10px/1.3 var(--font-kr)" }}>
              {[
                ["외경", "300 mm"], ["길이", "6,000 mm"],
                ["두께", "10 mm"],  ["음속", "5,920 m/s"],
                ["유체", "고온 스팀"], ["온도", "240 °C"],
                ["압력", "1.5 MPa"], ["PRF", "2,000 Hz"],
              ].map(([k, v]) => (
                <div key={k}><span style={{ color: "var(--content-low)" }}>{k}</span> <strong style={{ fontWeight: 700, color: "var(--content-high)" }}>{v}</strong></div>
              ))}
            </div>
            {/* v8.7 B-1: 현재 채널 상태 요약 (결함 있을 때 표시) */}
            <div style={{ borderTop: "1px solid var(--border-low)", marginTop: 8, paddingTop: 8, font: "700 11px/1.3 var(--font-kr)", letterSpacing: ".02em" }}>
              <span style={{ color: "var(--content-low)" }}>현재 채널 상태</span>
              <div style={{ color: "var(--system-error)", marginTop: 4 }}>⚠ Critical · Amp 94% · 두께 17.4mm</div>
            </div>
          </div>

          {/* v8.7: 선택 채널 부착 상태 (단순화 — 신호 강도 + 상태만) */}
          <div style={{ font: "700 11px/1 var(--font-kr)", letterSpacing: "0.08em", color: "var(--content-low)", textTransform: "uppercase", margin: "14px 0 6px" }}>선택 채널 부착 상태</div>
          <div style={{ background: "var(--surface-subtle-2)", border: "1px solid var(--border-medium)", padding: "10px 12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ font: "400 11px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)" }}>신호 강도</span>
              <strong style={{ font: "700 14px/1 var(--font-kr)", color: "var(--system-success)" }}>92%</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
              <span style={{ font: "400 11px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)" }}>부착 상태</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4, font: "700 12px/1 var(--font-kr)", color: "var(--system-success)" }}>
                <span style={{ width: 8, height: 8, background: "var(--system-success)", borderRadius: "50%" }}/>정상
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
              <span style={{ font: "400 11px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)" }}>커플런트</span>
              <span style={{ font: "700 11px/1 var(--font-kr)", color: "var(--content-medium)" }}>양호</span>
            </div>
          </div>

          {/* v8.7: 결함 검출 카드 삭제 — 64ch 그리드 색상 + 자동 전환 토글로 충분 */}

          {/* 측정 제어 (v8.5: 일시정지 토글 + 측정 중지 2버튼. 긴급정지 폐기) */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", margin: "14px 0 6px" }}>
            <div style={{ font: "700 11px/1 var(--font-kr)", letterSpacing: "0.08em", color: "var(--content-low)", textTransform: "uppercase" }}>측정 제어</div>
            <div style={{ font: "400 9px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)" }}>단축키 활성</div>
          </div>

          {/* 일시정지 / 측정 재개 / 측정 시작 토글 */}
          {state === "measuring" && (
            <button className="erut-btn erut-btn--default erut-btn--m" style={{ width: "100%", marginBottom: 6, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 12px" }} onClick={() => setState("paused")}>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor"><rect x="3" y="2" width="3" height="12"/><rect x="10" y="2" width="3" height="12"/></svg>
                일시정지
              </span>
              <span style={{ font: "700 9px/1 var(--font-kr)", padding: "2px 5px", border: "1px solid var(--border-medium)", color: "var(--content-low)" }}>Space</span>
            </button>
          )}
          {state === "paused" && (
            <button className="erut-btn erut-btn--emphasis erut-btn--m" style={{ width: "100%", marginBottom: 6, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 12px" }} onClick={() => setState("measuring")}>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor"><polygon points="4,2 14,8 4,14"/></svg>
                측정 재개
              </span>
              <span style={{ font: "700 9px/1 var(--font-kr)", padding: "2px 5px", border: "1px solid var(--on-primary)", color: "var(--on-primary)" }}>Space</span>
            </button>
          )}
          {state === "stopped" && (
            <button className="erut-btn erut-btn--emphasis erut-btn--m" style={{ width: "100%", marginBottom: 6, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 12px" }} onClick={() => { setState("measuring"); setElapsed(0); setShowAlert(true); }}>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor"><polygon points="4,2 14,8 4,14"/></svg>
                측정 시작
              </span>
              <span style={{ font: "700 9px/1 var(--font-kr)", padding: "2px 5px", border: "1px solid var(--on-primary)", color: "var(--on-primary)" }}>F6</span>
            </button>
          )}

          {/* 측정 중지 */}
          <button className="erut-btn erut-btn--subtle erut-btn--m" style={{ width: "100%", color: "var(--system-error)", borderColor: "var(--system-error)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 12px" }} onClick={() => setState("stopped")}>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor"><rect x="3" y="3" width="10" height="10"/></svg>
              측정 중지
            </span>
            <span style={{ font: "700 9px/1 var(--font-kr)", padding: "2px 5px", border: "1px solid var(--system-error)", color: "var(--system-error)" }}>F7</span>
          </button>
        </div>
      </div>
    </div>
  );
};
