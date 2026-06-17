// ERUT UI Kit · Screens
// All exported to `window` so index.html can use them in any order.

const I = window.EIcon;
const { useState: $s } = React;

// =================== v8.5: Breadcrumb 통일 컴포넌트 ===================
// 사용법: <window.Breadcrumb items={[{ label }, { label, current: true }]} /> (toolbar 우측)
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
    { id: "sk-ulsan",   name: "SK에너지 울산 #2 라인",        place: "울산 정유공장 #2 라인",     startDate: "2026-06-16", note: "RFCC 배관 정기검사 · 감육 집중 구간",  time: "오늘 14:23",  status: "진행 중", statusT: "running", targets: 12, sessions: 8,  defects: 4, defectT: "err" },
    { id: "kw-boryeong",name: "한국수자원공사 보령댐",         place: "보령 본댐",                 startDate: "2026-06-14", note: "수문 게이트 강판 감육 점검",          time: "2일 전",      status: "완료",    statusT: "done",    targets: 6,  sessions: 12, defects: 0, defectT: "ok"  },
    { id: "doosan",     name: "두산에너빌리티 창원 본관",       place: "창원 본관 #3 라인",         startDate: "2026-06-09", note: "터빈 케이싱 배관",                    time: "1주 전",      status: "검토",    statusT: "warn",    targets: 3,  sessions: 4,  defects: 1, defectT: "warn" },
    { id: "soil",       name: "S-Oil 온산공장",                place: "온산 RFCC 라인",            startDate: "2026-06-02", note: "정유 라인 정기검사",                  time: "2주 전",      status: "완료",    statusT: "done",    targets: 9,  sessions: 14, defects: 3, defectT: "err" },
    { id: "samsung",    name: "삼성E&A 평택 공장",            place: "평택 #1 압력 라인",         startDate: "2026-05-26", note: "압력용기 신규 도입 초기 검사",        time: "3주 전",      status: "완료",    statusT: "done",    targets: 5,  sessions: 7,  defects: 0, defectT: "ok"  },
    { id: "gs",         name: "GS칼텍스 여수 #1",             place: "여수 정유 #1 라인",         startDate: "2026-05-16", note: "",                                    time: "1개월 전",    status: "완료",    statusT: "done",    targets: 8,  sessions: 11, defects: 2, defectT: "warn" },
    { id: "hanwha",     name: "한화토탈에너지스 대산",          place: "대산 LNG 라인",             startDate: "2026-05-01", note: "LNG 저온 배관",                       time: "1.5개월 전",  status: "완료",    statusT: "done",    targets: 10, sessions: 15, defects: 0, defectT: "ok"  },
    { id: "hyundai",    name: "현대오일뱅크 충남",            place: "서산 정유 #2 라인",         startDate: "2026-04-16", note: "감육 의심 구간 재검",                 time: "2개월 전",    status: "검토",    statusT: "warn",    targets: 7,  sessions: 10, defects: 3, defectT: "err" },
    { id: "lotte",      name: "롯데케미칼 여수",              place: "여수 석유화학 NCC",         startDate: "2026-03-16", note: "NCC 정기검사",                        time: "3개월 전",    status: "완료",    statusT: "done",    targets: 6,  sessions: 9,  defects: 1, defectT: "warn" },
  ],
  project: {
    name: "SK에너지 울산 #2 라인",
    desc: "고온 스팀 배관 정기 검사 · 검사자 김검사 · 2026-Q2",
    owner: "김검사",
    startDate: "2026-06-16",
    note: "RFCC 배관 정기검사 · 감육 집중 구간",
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
    { id: "MCuF-001", ip: "192.168.1.100", state: "measuring", activeCh: 64, totalCh: 64, dataSent: "1.2 GB", lastSent: "2026-06-16 13:00" },
    { id: "MCuF-002", ip: "192.168.1.101", state: "idle",      activeCh: 16, totalCh: 64, dataSent: "—",      lastSent: "—" },
    { id: "MCuF-003", ip: "192.168.1.102", state: "offline",   activeCh: null, totalCh: 64, dataSent: "320 MB", lastSent: "2026-06-16 12:50" },
  ],
  // 8 fixed sensors on PIPE-A-204 (Z range 0~6000mm, θ 0~360°)
  sensors: [
    { id: "ch01", state: "ok",   thickness: 9.92, amp: 24, tof: 3.35, age: "1 분 전",
      trend: [9.95, 9.94, 9.94, 9.93, 9.93, 9.92, 9.92] },
    { id: "ch02", state: "ok",   thickness: 9.88, amp: 22, tof: 3.34, age: "1 분 전",
      trend: [9.90, 9.90, 9.89, 9.89, 9.88, 9.88, 9.88] },
    { id: "ch03", state: "ok",   thickness: 9.85, amp: 28, tof: 3.33, age: "1 분 전",
      trend: [9.88, 9.87, 9.87, 9.86, 9.86, 9.85, 9.85] },
    { id: "ch04", state: "ok",   thickness: 7.80, amp: 92, tof: 2.64, age: "1 분 전",
      trend: [8.4, 8.2, 8.1, 8.0, 7.9, 7.85, 7.80] },
    { id: "ch05", state: "ok",   thickness: 9.80, amp: 30, tof: 3.31, age: "1 분 전",
      trend: [9.83, 9.82, 9.82, 9.81, 9.81, 9.80, 9.80] },
    { id: "ch06", state: "ok",   thickness: 9.81, amp: 27, tof: 3.31, age: "1 분 전",
      trend: [9.84, 9.83, 9.83, 9.82, 9.82, 9.81, 9.81] },
    { id: "ch07", state: "ok",   thickness: 9.78, amp: 62, tof: 3.30, age: "1 분 전",
      trend: [9.85, 9.84, 9.82, 9.81, 9.80, 9.79, 9.78] },
    { id: "ch08", state: "ok",   thickness: 9.83, amp: 25, tof: 3.32, age: "1 분 전",
      trend: [9.86, 9.85, 9.85, 9.84, 9.84, 9.83, 9.83] },
    // v9.14: ch09~ch24 부착 정상 활성화 추가 (CH 24까지 모두 정상 연결)
    { id: "ch09", state: "ok", thickness: 9.91, amp: 23, tof: 3.34, age: "1 분 전", trend: [9.93, 9.93, 9.92, 9.92, 9.91, 9.91, 9.91] },
    { id: "ch10", state: "ok", thickness: 9.90, amp: 24, tof: 3.34, age: "1 분 전", trend: [9.92, 9.91, 9.91, 9.91, 9.90, 9.90, 9.90] },
    { id: "ch11", state: "ok", thickness: 9.87, amp: 25, tof: 3.33, age: "1 분 전", trend: [9.89, 9.88, 9.88, 9.88, 9.87, 9.87, 9.87] },
    { id: "ch12", state: "ok", thickness: 9.84, amp: 56, tof: 3.32, age: "1 분 전", trend: [9.88, 9.87, 9.86, 9.85, 9.85, 9.84, 9.84] },
    { id: "ch13", state: "ok", thickness: 9.82, amp: 26, tof: 3.31, age: "1 분 전", trend: [9.84, 9.83, 9.83, 9.83, 9.82, 9.82, 9.82] },
    { id: "ch14", state: "ok", thickness: 9.81, amp: 27, tof: 3.31, age: "1 분 전", trend: [9.84, 9.83, 9.82, 9.82, 9.81, 9.81, 9.81] },
    { id: "ch15", state: "ok", thickness: 9.83, amp: 28, tof: 3.32, age: "1 분 전", trend: [9.85, 9.84, 9.84, 9.83, 9.83, 9.83, 9.83] },
    { id: "ch16", state: "err", thickness: 9.80, amp: 24, tof: 3.31, age: "1 분 전", trend: [9.82, 9.82, 9.81, 9.81, 9.81, 9.80, 9.80] },
    { id: "ch17", state: "ok", thickness: 9.79, amp: 26, tof: 3.30, age: "1 분 전", trend: [9.82, 9.81, 9.81, 9.80, 9.80, 9.79, 9.79] },
    { id: "ch18", state: "ok", thickness: 9.76, amp: 48, tof: 3.29, age: "1 분 전", trend: [9.81, 9.80, 9.79, 9.78, 9.77, 9.77, 9.76] },
    { id: "ch19", state: "ok", thickness: 9.82, amp: 29, tof: 3.32, age: "1 분 전", trend: [9.84, 9.84, 9.83, 9.83, 9.82, 9.82, 9.82] },
    { id: "ch20", state: "ok", thickness: 9.84, amp: 25, tof: 3.32, age: "1 분 전", trend: [9.86, 9.85, 9.85, 9.85, 9.84, 9.84, 9.84] },
    { id: "ch21", state: "ok", thickness: 9.87, amp: 23, tof: 3.33, age: "1 분 전", trend: [9.89, 9.88, 9.88, 9.88, 9.87, 9.87, 9.87] },
    { id: "ch22", state: "err", thickness: 9.85, amp: 27, tof: 3.32, age: "1 분 전", trend: [9.87, 9.86, 9.86, 9.86, 9.85, 9.85, 9.85] },
    { id: "ch23", state: "ok", thickness: 9.83, amp: 24, tof: 3.32, age: "1 분 전", trend: [9.85, 9.85, 9.84, 9.84, 9.83, 9.83, 9.83] },
    { id: "ch24", state: "ok", thickness: 9.86, amp: 26, tof: 3.33, age: "1 분 전", trend: [9.88, 9.87, 9.87, 9.87, 9.86, 9.86, 9.86] },
    // v9.15: TANK-B-101 (ch25-48) — 20 ok + 4 warn (ch28·31·38·45)
    { id: "ch25", state: "ok",   thickness: 5.94, amp: 22, tof: 2.01, age: "1 분 전", trend: [5.96, 5.95, 5.95, 5.95, 5.94, 5.94, 5.94] },
    { id: "ch26", state: "ok",   thickness: 5.92, amp: 24, tof: 2.00, age: "1 분 전", trend: [5.94, 5.94, 5.93, 5.93, 5.92, 5.92, 5.92] },
    { id: "ch27", state: "ok",   thickness: 5.93, amp: 23, tof: 2.01, age: "1 분 전", trend: [5.95, 5.94, 5.94, 5.93, 5.93, 5.93, 5.93] },
    { id: "ch28", state: "ok", thickness: 5.88, amp: 38, tof: 1.99, age: "1 분 전", trend: [5.92, 5.91, 5.90, 5.89, 5.89, 5.88, 5.88] },
    { id: "ch29", state: "ok",   thickness: 5.93, amp: 22, tof: 2.01, age: "1 분 전", trend: [5.95, 5.94, 5.94, 5.94, 5.93, 5.93, 5.93] },
    { id: "ch30", state: "ok",   thickness: 5.94, amp: 24, tof: 2.01, age: "1 분 전", trend: [5.96, 5.95, 5.95, 5.95, 5.94, 5.94, 5.94] },
    { id: "ch31", state: "ok", thickness: 5.85, amp: 42, tof: 1.98, age: "1 분 전", trend: [5.89, 5.88, 5.87, 5.86, 5.86, 5.85, 5.85] },
    { id: "ch32", state: "ok",   thickness: 5.91, amp: 23, tof: 2.00, age: "1 분 전", trend: [5.93, 5.92, 5.92, 5.92, 5.91, 5.91, 5.91] },
    { id: "ch33", state: "ok",   thickness: 5.93, amp: 21, tof: 2.01, age: "1 분 전", trend: [5.95, 5.94, 5.94, 5.94, 5.93, 5.93, 5.93] },
    { id: "ch34", state: "ok",   thickness: 5.90, amp: 24, tof: 2.00, age: "1 분 전", trend: [5.92, 5.91, 5.91, 5.91, 5.90, 5.90, 5.90] },
    { id: "ch35", state: "ok",   thickness: 5.92, amp: 22, tof: 2.00, age: "1 분 전", trend: [5.94, 5.93, 5.93, 5.93, 5.92, 5.92, 5.92] },
    { id: "ch36", state: "ok",   thickness: 5.93, amp: 23, tof: 2.01, age: "1 분 전", trend: [5.95, 5.94, 5.94, 5.94, 5.93, 5.93, 5.93] },
    { id: "ch37", state: "ok",   thickness: 5.94, amp: 24, tof: 2.01, age: "1 분 전", trend: [5.96, 5.95, 5.95, 5.95, 5.94, 5.94, 5.94] },
    { id: "ch38", state: "ok", thickness: 5.82, amp: 45, tof: 1.97, age: "1 분 전", trend: [5.86, 5.85, 5.84, 5.83, 5.83, 5.82, 5.82] },
    { id: "ch39", state: "ok",   thickness: 5.91, amp: 22, tof: 2.00, age: "1 분 전", trend: [5.93, 5.92, 5.92, 5.92, 5.91, 5.91, 5.91] },
    { id: "ch40", state: "ok",   thickness: 5.92, amp: 23, tof: 2.00, age: "1 분 전", trend: [5.94, 5.93, 5.93, 5.93, 5.92, 5.92, 5.92] },
    { id: "ch41", state: "ok",   thickness: 5.93, amp: 21, tof: 2.01, age: "1 분 전", trend: [5.95, 5.94, 5.94, 5.94, 5.93, 5.93, 5.93] },
    { id: "ch42", state: "ok",   thickness: 5.93, amp: 22, tof: 2.01, age: "1 분 전", trend: [5.95, 5.94, 5.94, 5.94, 5.93, 5.93, 5.93] },
    { id: "ch43", state: "ok",   thickness: 5.94, amp: 24, tof: 2.01, age: "1 분 전", trend: [5.96, 5.95, 5.95, 5.95, 5.94, 5.94, 5.94] },
    { id: "ch44", state: "ok",   thickness: 5.92, amp: 23, tof: 2.00, age: "1 분 전", trend: [5.94, 5.93, 5.93, 5.93, 5.92, 5.92, 5.92] },
    { id: "ch45", state: "ok", thickness: 5.84, amp: 40, tof: 1.97, age: "1 분 전", trend: [5.88, 5.87, 5.86, 5.85, 5.85, 5.84, 5.84] },
    { id: "ch46", state: "ok",   thickness: 5.91, amp: 22, tof: 2.00, age: "1 분 전", trend: [5.93, 5.92, 5.92, 5.92, 5.91, 5.91, 5.91] },
    { id: "ch47", state: "ok",   thickness: 5.93, amp: 24, tof: 2.01, age: "1 분 전", trend: [5.95, 5.94, 5.94, 5.94, 5.93, 5.93, 5.93] },
    { id: "ch48", state: "ok",   thickness: 5.92, amp: 23, tof: 2.00, age: "1 분 전", trend: [5.94, 5.93, 5.93, 5.93, 5.92, 5.92, 5.92] },
    // v9.15: VESSEL-C-301 (ch49-64) — 12 ok + 2 warn (ch50·55) + 2 err (ch49·62)
    { id: "ch49", state: "warn",  thickness: 0,    amp: 0,  tof: 0,    age: "—",      trend: [11.95, 11.94, 11.93, 0, 0, 0, 0] },
    { id: "ch50", state: "warn", thickness: 11.78,amp: 48, tof: 3.98, age: "1 분 전", trend: [11.85, 11.84, 11.82, 11.81, 11.80, 11.79, 11.78] },
    { id: "ch51", state: "ok",   thickness: 11.92,amp: 26, tof: 4.02, age: "1 분 전", trend: [11.94, 11.93, 11.93, 11.92, 11.92, 11.92, 11.92] },
    { id: "ch52", state: "ok",   thickness: 11.91,amp: 24, tof: 4.02, age: "1 분 전", trend: [11.93, 11.92, 11.92, 11.92, 11.91, 11.91, 11.91] },
    { id: "ch53", state: "warn",   thickness: 11.93,amp: 25, tof: 4.03, age: "1 분 전", trend: [11.95, 11.94, 11.94, 11.93, 11.93, 11.93, 11.93] },
    { id: "ch54", state: "ok",   thickness: 11.90,amp: 27, tof: 4.01, age: "1 분 전", trend: [11.92, 11.91, 11.91, 11.91, 11.90, 11.90, 11.90] },
    { id: "ch55", state: "warn", thickness: 11.75,amp: 50, tof: 3.97, age: "1 분 전", trend: [11.82, 11.80, 11.79, 11.78, 11.77, 11.76, 11.75] },
    { id: "ch56", state: "ok",   thickness: 11.92,amp: 24, tof: 4.02, age: "1 분 전", trend: [11.94, 11.93, 11.93, 11.93, 11.92, 11.92, 11.92] },
    { id: "ch57", state: "ok",   thickness: 11.93,amp: 26, tof: 4.03, age: "1 분 전", trend: [11.95, 11.94, 11.94, 11.93, 11.93, 11.93, 11.93] },
    { id: "ch58", state: "warn",   thickness: 11.91,amp: 23, tof: 4.02, age: "1 분 전", trend: [11.93, 11.92, 11.92, 11.92, 11.91, 11.91, 11.91] },
    { id: "ch59", state: "ok",   thickness: 11.90,amp: 25, tof: 4.01, age: "1 분 전", trend: [11.92, 11.91, 11.91, 11.91, 11.90, 11.90, 11.90] },
    { id: "ch60", state: "ok",   thickness: 11.92,amp: 24, tof: 4.02, age: "1 분 전", trend: [11.94, 11.93, 11.93, 11.93, 11.92, 11.92, 11.92] },
    { id: "ch61", state: "warn",   thickness: 11.93,amp: 27, tof: 4.03, age: "1 분 전", trend: [11.95, 11.94, 11.94, 11.93, 11.93, 11.93, 11.93] },
    { id: "ch62", state: "ok",  thickness: 0,    amp: 0,  tof: 0,    age: "—",      trend: [11.92, 11.91, 11.90, 0, 0, 0, 0] },
    { id: "ch63", state: "ok",   thickness: 11.91,amp: 23, tof: 4.02, age: "1 분 전", trend: [11.93, 11.92, 11.92, 11.92, 11.91, 11.91, 11.91] },
    { id: "ch64", state: "ok",   thickness: 11.92,amp: 25, tof: 4.02, age: "1 분 전", trend: [11.94, 11.93, 11.93, 11.93, 11.92, 11.92, 11.92] },
  ],
  defects: [
    { id: 1, type: "Critical", size: "Ø 12mm" },
    { id: 2, type: "Major",    size: "Ø  8mm" },
    { id: 3, type: "Minor",    size: "Ø  4mm" },
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
  // 감육 검출 채널 — 측정두께 ≤ 공칭−허용감육. amp = 신호 세기(ampState: ok 51-100 / warn 6-50 / bad 1-5). 등급 판정은 웹.
  realtimeDefects: [
    { id: 1, channel: 4,  amp: 92, tof: 2.64, thickness: 7.8, nominal: 10, thinMm: 2.2, thinPct: 22.0, ampState: "ok"   },
    { id: 2, channel: 7,  amp: 78, tof: 2.70, thickness: 8.0, nominal: 10, thinMm: 2.0, thinPct: 20.0, ampState: "ok"   },
    { id: 3, channel: 38, amp: 41, tof: 2.85, thickness: 8.4, nominal: 10, thinMm: 1.6, thinPct: 16.0, ampState: "warn" },
  ],
  // [4] 장비 연결 설정 — MC보드 리스트 (main slide 9 매칭)
  mcBoards: [
    { id: "MCF-2024-001", alias: "주력 장비", ip: "10.10.1.5",    port: 8080, channels: 64, freq: 5,  firmware: "v2.4.1", state: "connected", note: "지연 4 ms · 정상" },
    { id: "MCF-2024-002", alias: "보조 장비", ip: "192.168.0.45", port: 8080, channels: 32, freq: 10, firmware: "v2.3.8", state: "warn",      note: "응답 지연 28 ms (높음)" },
    { id: "MCF-2024-003", alias: "예비",     ip: "192.168.0.46", port: 8080, channels: 64, freq: 5,  firmware: "v2.4.1", state: "offline",   note: "연결 끊김 (10분 전)" },
  ],
  // v12.0: 교정 필요 채널 (uncalibrated: 신규 추가 후 미진행 + expired: 주기 초과 만료) — DeviceDetail breathe 셀과 동일 소스
  uncalibratedChannels: ["ch20", "ch33"],
  expiredChannels:      ["ch04", "ch09", "ch12"],
  // v13.0: 마지막 교정일 — 재교정 마법사 좌측 채널 카드에 표시. uncalibrated 채널은 null
  lastCalibrationDate: {
    ch04: "2025-11-20",  // 191일 전 (오늘 2026-06-10 기준 — 가장 오래됨)
    ch09: "2025-11-25",  // 186일 전
    ch12: "2025-12-10",  // 171일 전
    ch20: null,          // 미교정 (신규 추가 후 미진행)
    ch33: null,          // 미교정
  },
  // v16.0: 채널별 교정 주기 override — undefined 채널은 전역 기본값(calibrationPolicy.defaultCycleDays) 사용
  channelCycleDays: {
    ch04: 90,  // 주기 90일 (절차서 override) — 가장 짧음
    // 나머지 채널은 전역 기본 180일 따름
  },
  // v21.0: 통합 알림 센터 — 교정/측정/통신/부착 알림 단일 소스. 메뉴바 NotificationCenter가 참조.
  // severity: error(긴급·측정 차단급) / caution(경고) / info(정보). type: defect/calib/measure/comm/attach
  // v22.6: defect = 결함 '검출' 사실 알림 (검사자 인지). 등급·유형 판정은 웹 책임.
  notifications: [
    { id: "n0", severity: "error", type: "defect",  title: "CH 04 감육 검출",  detail: "측정 두께 7.8mm · 감육률 22.0% (허용 감육 2.0mm 초과) · 검출 시점 자동 기록", actionLabel: "채널 보기", time: "방금" },
    { id: "n1", severity: "error",   type: "calib",   title: "CH 04 교정 만료",       detail: "교정 주기 초과 · F6 측정 시작 차단됨", actionLabel: "재교정",   time: "1분 전" },
    { id: "n2", severity: "error",   type: "measure", title: "CH 12 채널 미연결",     detail: "측정 중 신호 손실 (E120)",            actionLabel: "채널 보기", time: "2분 전" },
    { id: "n3", severity: "caution", type: "calib",   title: "CH 09 교정 임박 (D-1)", detail: "1일 후 교정 주기 만료",               actionLabel: "재교정",   time: "10분 전" },
    { id: "n4", severity: "caution", type: "attach",  title: "CH 50 부착력 약함",     detail: "신호 세기 저하 · 부착 상태 점검 권장", actionLabel: "채널 보기", time: "15분 전" },
    { id: "n5", severity: "info",    type: "comm",    title: "MQTT 재연결됨",          detail: "서버 통신 복구 (10.10.1.20)",         time: "1시간 전", read: true },
  ],
  // v16.0: 교정 정책 (전역 설정) — [8] 설정 모달에서 변경. 알림 다이얼로그·상태바 배지가 이 값을 참조
  calibrationPolicy: {
    defaultCycleDays:    180,    // 전역 기본 교정 주기 (일). 채널별 override가 없으면 이 값 사용
    alert7DaysBefore:    true,   // D-7 알림 시점
    alert1DayBefore:     true,   // D-1 알림 시점
    alertOnDueDay:       true,   // D-0 (당일) 알림 시점
    startupAlertDialog:  true,   // 앱 시작 시 알림 다이얼로그 표시
    statusBarBadge:      true,   // 상태바 "교정 임박 N" 배지 표시
  },
  // v16.0: 알림 발생 이력 — 채널×시점별 중복 표시 방지. 키: `${chId}_${marker}` (marker: "d7" / "d1" / "d0")
  // mockup 차원에선 빈 객체 (실제 백엔드 연동 시 마지막 표시 timestamp 저장)
  calibrationAlertHistory: {},
  // v16.0: 알림 다이얼로그 mockup 표시용 — 만료 임박 채널 (실제: 매일 자정 + 앱 시작 시 daysUntilExpiry 계산)
  imminentChannels: [
    { id: "CH 18", daysRemaining:  7, lastDate: "2026-05-04", cycleDays:  45 },  // 채널별 45일 주기 가정
    { id: "CH 45", daysRemaining:  1, lastDate: "2025-12-12", cycleDays: 182 },
    { id: "CH 52", daysRemaining:  0, lastDate: "2025-12-13", cycleDays: 180 },  // 전역 기본
  ],
  // v19.0: 미니 PC 자산 정보 — alias + UUID + 자동 수집 메타. [8] PC 정보 카테고리 / [18] 보고서 / [7] 이력 / [3] 통신 로그 / 상태바 옵션
  pcInfo: {
    alias: "현장 검사 PC #1",                              // 사용자 입력 (변경 가능)
    uuid: "a7f3c2e8-9b4d-4c1f-8e5a-2d6b9f8c1a3e",          // 첫 실행 1회 자동 생성 (readonly)
    hostname: "DESKTOP-ERUT-001",                          // Environment.MachineName
    os: "Windows 11 Pro · 23H2 (Build 22631.3593)",        // Environment.OSVersion
    erutVersion: "v1.4.2 · build 20260520.1138",           // 앱 자체
    ipLan: "192.168.1.50",                                 // NetworkInterface
    macAddress: "A4:5E:60:3F:7C:91",                       // NetworkInterface
    macInterface: "eth0 · realtek",                        // 인터페이스명
    firstRegistered: "2026-04-22 09:18",                   // 첫 실행 timestamp
    showAliasInStatusBar: false,                           // 상태바 alias 표시 옵션 (기본 OFF)
  },
  // v19.0: 검사 이력 세션별 측정 PC alias (다중 PC 운영 시 추적성)
  sessionPcAlias: {
    "SES-2026-047": "현장 검사 PC #1",
    "SES-2026-046": "현장 검사 PC #2",
    "SES-2026-045": "현장 검사 PC #1",
    "SES-2026-044": "현장 검사 PC #2",
    "SES-2026-043": "현장 검사 PC #1",
    "SES-2026-042": "Office PC",
  },
  // v18.0: 검사 대상별 적용 표준 (보고서 출력 시 자동 반영). [6] 검사 대상 등록 시 입력
  targetStandards: {
    "PIPE-A-204":  "KS B 0817",       // 펄스반사식 초음파 탐상 시험 방법 통칙
    "TANK-B-101":  "KS B 0817",
    "VESSEL-C-301":"KS B 0894",       // 강용접부 초음파 탐상 시험 방법
    "FLANGE-D-08": "KS B 0817",
    "DOME-E-12":   "KS B 0817",
    "WELD-F-22":   "ASME Sec. V Art.5", // 미국 ASME Section V
  },
};
// 공통 접근자 — DeviceDetail / index.html F6 차단 다이얼로그 / DiagCalibHistory 모두 이걸 참조
window.MOCK.needsCalibrationChannels = [...window.MOCK.uncalibratedChannels, ...window.MOCK.expiredChannels];

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
                {/* v22.0: 프로젝트 상태 태그(진행중/완료/검토) 삭제 — 최근 시각·카운트로 충분, 검토는 웹 책임과 충돌 */}
                <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "flex-start" }}>
                  <span style={{ font: "400 10px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)" }}>생성일 {p.startDate}</span>
                </div>
                <div style={{ font: "700 14px/1.2 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-high)" }}>{p.name}</div>
                <div style={{ font: "400 11px/1.4 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-medium)" }}>{p.place}</div>
                {p.note && <div style={{ font: "400 11px/1.4 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.note}</div>}
                <div style={{ display: "flex", gap: 12, paddingTop: 10, borderTop: "1px solid var(--border-low)", font: "400 11px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)" }}>
                  <span>검사 대상 <strong style={{ fontWeight: 700, color: "var(--content-high)" }}>{p.targets}</strong></span>
                  <span>세션 <strong style={{ fontWeight: 700, color: "var(--content-high)" }}>{p.sessions}</strong></span>
                  <span>감육 검출 <strong style={{ fontWeight: 700, color: "var(--content-high)" }}>{p.defects}</strong></span>
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
  // 생성일·프로젝트 코드는 생성 시점에 자동 부여 (입력 불가). 담당 검사자·산업·표준은 웹에서 관리.
  const autoStartDate = "2026-06-16";        // 생성 버튼 클릭 시점 자동 기록
  const autoCode = "a3f29c1e-7b84-4d2f-9e10-5c8b1f2a6d04"; // UUID 자동 부여 (수정 불가)
  const [form, setForm] = $s({ name: "", place: "", note: "" });
  const setField = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const valid = form.name && form.place;

  const footer = (
    <>
      <span style={{ font: "400 11px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)", marginRight: "auto" }}>
        <span style={{ color: "var(--system-error)" }}>*</span> 필수 항목
      </span>
      <window.Button variant="subtle" size="sm" onClick={onClose}>닫기</window.Button>
      <window.Button variant={valid ? "emphasis" : "disabled"} size="sm" onClick={valid ? () => onCreate({ ...form, startDate: autoStartDate, code: autoCode }) : undefined}>프로젝트 생성 → [1] 메인</window.Button>
    </>
  );

  const label = (txt, req) => (
    <div style={{ font: "700 11px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-medium)", marginBottom: 4 }}>
      {txt}{req && <span style={{ color: "var(--system-error)", marginLeft: 4 }}>*</span>}
    </div>
  );
  const hint = (txt) => (
    <div style={{ font: "400 10px/1.3 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)", marginTop: 4 }}>{txt}</div>
  );

  return (
    <window.Modal title="새 프로젝트 만들기" onClose={onClose} footer={footer}>
      {/* 필수 정보 */}
      <div style={{ font: "700 11px/1 var(--font-kr)", letterSpacing: "0.08em", color: "var(--content-low)", textTransform: "uppercase", paddingBottom: 6, borderBottom: "1px solid var(--border-low)" }}>필수 정보</div>
      <div>
        {label("프로젝트명", true)}
        <input className="erut-field" value={form.name} onChange={(e) => setField("name", e.target.value)} placeholder="예: 울산 #2 라인 2026 정기검사" style={{ width: "100%" }}/>
      </div>
      <div>
        {label("검사 장소", true)}
        <input className="erut-field" value={form.place} onChange={(e) => setField("place", e.target.value)} placeholder="예: 울산 정유공장 #2 라인" style={{ width: "100%" }}/>
      </div>

      {/* 자동 부여 정보 */}
      <div style={{ font: "700 11px/1 var(--font-kr)", letterSpacing: "0.08em", color: "var(--content-low)", textTransform: "uppercase", paddingBottom: 6, borderBottom: "1px solid var(--border-low)" }}>자동 부여</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 14 }}>
        <div>
          {label("생성일")}
          <input className="erut-field is-disabled" value={autoStartDate} readOnly tabIndex={-1} style={{ width: "100%" }}/>
          {hint("생성 시점 자동 기록")}
        </div>
        <div>
          {label("프로젝트 코드")}
          <input className="erut-field is-disabled" value={autoCode} readOnly tabIndex={-1} style={{ width: "100%" }}/>
          {hint("UUID 자동 부여 · 수정 불가")}
        </div>
      </div>

      {/* 비고 */}
      <div>
        {label("비고")}
        <textarea className="erut-field" value={form.note} onChange={(e) => setField("note", e.target.value)} placeholder="자유 입력" rows={4} style={{ width: "100%", resize: "vertical", minHeight: 88, font: "400 14px/1.5 var(--font-kr)", letterSpacing: ".02em" }}/>
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

window.MainScreen = function MainScreen({ boardStates, onBoardControl, onAddDevice, onOpenDevice }) {
  const proj = window.MOCK.project;
  const devices = window.MOCK.devices;
  // v22.1: 보드별 측정 상태 (공유 state) — 없으면 MOCK 기본값
  const stOf = (d) => (boardStates && boardStates[d.id]) || d.state;

  // 장비 패널 헤더 요약 카운터
  const connectedCount = devices.filter(d => stOf(d) !== "offline").length;
  const measuringCount = devices.filter(d => stOf(d) === "measuring").length;
  const activeChTotal  = devices.reduce((s, d) => s + (d.activeCh || 0), 0);
  const totalChTotal   = devices.reduce((s, d) => s + d.totalCh, 0);

  // 각 장비 mini-card 렌더링
  function renderDeviceCard(d) {
    const st = stOf(d);
    const isMeasuring = st === "measuring";
    const isOffline   = st === "offline";

    // 상태 클래스로 분기 (measuring / offline / idle) — 일시정지 폐기
    const cardCls = "erut-device-card" + (isMeasuring ? " is-measuring" : isOffline ? " is-offline" : "");

    return (
      <div key={d.id} className={cardCls}>
        {/* v9.11: 상단 — 연결 상태 pill만 유지. 측정 중/대기/오프라인 badge 삭제 (좌하단 액션 버튼으로 인지) */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ font: "700 14px/1 var(--font-kr)", letterSpacing: ".02em", color: isOffline ? "var(--content-medium)" : "var(--content-high)" }}>{d.id}</div>
            <div style={{ font: "400 11px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)", marginTop: 4 }}>IP&nbsp;:&nbsp;{d.ip}</div>
          </div>
          <MiniPill tone="pillLED" ledColor={isOffline ? "red" : "green"}>{isOffline ? "연결 끊김" : "연결됨"}</MiniPill>
        </div>
        {/* 중단: 활성 채널 + 데이터 송신량 + 마지막 데이터 송신일시 */}
        <div style={{ display: "flex", gap: 18, padding: "10px 0 8px", marginTop: 10, borderTop: "1px solid var(--border-low)" }}>
          <div>
            <div style={{ font: "400 10px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)", marginBottom: 4 }}>활성 채널</div>
            <div style={{ font: "700 16px/1 var(--font-kr)", letterSpacing: ".02em", color: isMeasuring ? "var(--content-emphasis)" : isOffline ? "var(--content-low)" : "var(--content-medium)" }}>
              {d.activeCh != null ? d.activeCh : "—"}
              <span style={{ fontSize: 11, color: "var(--content-low)", fontWeight: 400 }}>&nbsp;/&nbsp;{d.totalCh} CH</span>
            </div>
          </div>
          <div>
            <div style={{ font: "400 10px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)", marginBottom: 4 }}>데이터 송신량</div>
            <div style={{ font: "700 14px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-medium)" }}>{d.dataSent || "—"}</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ font: "400 10px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)", marginBottom: 4 }}>마지막 데이터 송신일시</div>
            <div style={{ font: "700 12px/1 var(--font-kr)", letterSpacing: ".02em", color: isOffline ? "var(--system-error)" : "var(--content-medium)" }}>{d.lastSent || "—"}</div>
          </div>
        </div>
        {/* 하단: 액션 버튼 */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
          {isMeasuring && (
            /* 측정 중 = 중지만 (시작/중지 — 일시정지 폐기) */
            <div style={{ display: "flex", gap: 6 }}>
              <button className="erut-btn erut-btn--default erut-btn--sm" style={{ background: "var(--system-error)", color: "var(--on-primary)", borderColor: "var(--system-error)", display: "inline-flex", alignItems: "center", gap: 4 }} title="측정 중지 (F7)" onClick={() => onBoardControl && onBoardControl(d.id, "stop")}>
                <svg viewBox="0 0 12 12" width="9" height="9" fill="currentColor"><rect x="2" y="2" width="8" height="8"/></svg>
                측정 중지
              </button>
            </div>
          )}
          {st === "idle" && (
            <button className="erut-btn erut-btn--emphasis erut-btn--sm" style={{ display: "inline-flex", alignItems: "center", gap: 4 }} onClick={() => onBoardControl && onBoardControl(d.id, "start")}>
              <svg viewBox="0 0 12 12" width="9" height="9" fill="currentColor"><polygon points="3,2 10,6 3,10"/></svg>
              측정 시작
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

      {/* ▼ 프로젝트 헤더 + Tab (통합 패널) ▼ */}
      <div style={{ background: "var(--surface-subtle-1)", borderBottom: "1px solid var(--border-medium)", padding: "14px 40px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 12 }}>
          <div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
              <span style={{ font: "400 12px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)" }}>프로젝트</span>
              <span style={{ font: "700 16px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-high)" }}>{proj.name}</span>
            </div>
            <div style={{ font: "400 11px/1.5 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)", marginTop: 6 }}>
              생성일 {proj.startDate}{proj.note ? ` · ${proj.note}` : ""}
            </div>
          </div>
          {/* 장비 요약 카운터 (프로젝트명과 동일 크기) — 패널 헤더에서 이동 */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ font: "400 16px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-medium)" }}>연결 <strong style={{ fontWeight: 700, color: "var(--system-success)" }}>{connectedCount}</strong> / {devices.length}</span>
            <span style={{ width: 1, height: 14, background: "var(--border-medium)" }}/>
            <span style={{ font: "400 16px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-medium)" }}>측정 중 <strong style={{ fontWeight: 700, color: "var(--brand-primary)" }}>{measuringCount}</strong></span>
            <span style={{ width: 1, height: 14, background: "var(--border-medium)" }}/>
            <span style={{ font: "400 16px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-medium)" }}>활성 채널 <strong style={{ fontWeight: 700, color: "var(--brand-primary)" }}>{activeChTotal}</strong> / {totalChTotal}</span>
          </div>
        </div>
        {/* Tab */}
        <div style={{ display: "flex", gap: 0, marginTop: 8 }}>
          <button style={{ padding: "10px 24px", font: "700 14px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-emphasis)", background: "var(--surface-base)", border: "1px solid var(--border-medium)", borderBottom: "1px solid var(--surface-base)", marginBottom: -1, cursor: "pointer" }}>고정형 장비</button>
          <button style={{ padding: "10px 24px", font: "700 14px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)", background: "transparent", border: "none", cursor: "not-allowed", display: "inline-flex", alignItems: "center", gap: 6 }}>
            스캔형 장비
            <span style={{ padding: "2px 6px", font: "700 10px/1 var(--font-kr)", color: "var(--content-low)", border: "1px solid var(--border-medium)", background: "var(--surface-subtle-2)" }}>준비 중</span>
          </button>
        </div>
      </div>

      {/* ▼ Tab 콘텐츠 (고정형 활성) ▼ */}
      <div style={{ padding: "20px 40px", flex: 1, overflow: "auto" }}>
        {/* ▼ 장비 연결 상태 패널 ▼ */}
        <div style={{ background: "var(--surface-base)", border: "1px solid var(--border-medium)", padding: "14px 18px", marginBottom: 20 }}>
          {/* 헤더 라인 — 요약 카운터는 상단 프로젝트 정보로 이동(#6) */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
              <h3 style={{ font: "700 16px/1.2 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-high)", margin: 0 }}>등록된 장비</h3>
              <span style={{ font: "400 12px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)" }}>총 {devices.length}대 등록</span>
            </div>
            <button className="erut-btn erut-btn--default erut-btn--sm" onClick={onAddDevice}>+ 장비 추가</button>
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
window.DeviceDetail = function DeviceDetail({ boardStates, onBoardControl, targetId, focusChannel, onBack, onStartMeasure, onEditChannel, onAddTarget, onEditTarget, onAddSensor, onOpenReport, onBatchRecal }) {
  // v14.0: onOpenGate → onEditChannel — Gate/교정 분리 폐기, commission(edit 모드) 단일 진입점
  // v18.0: onOpenReport 신규 — 우측 채널 패널 "보고서 출력" 버튼 → ReportExportDialog 모달
  // v22.1: 배너 측정 제어 인터랙션 — 이 화면의 MC보드(mockup: MCuF-001) 상태를 공유 boardStates에서 도출
  const boardId = "MCuF-001";
  const bSt = (boardStates && boardStates[boardId]) || "measuring";
  const target = window.MOCK.targets.find(t => t.id === targetId) || window.MOCK.targets[0];
  const sensorMap = Object.fromEntries(window.MOCK.sensors.map(s => [s.id, s]));
  const [selected, setSelected] = $s(focusChannel || "ch01");
  const [focusActive, setFocusActive] = $s(!!focusChannel);
  // v9.35: showAddSensor 폐기 → 풀스크린 ChannelCommissioning 페이지로 라우팅
  // v14.0: 단일 채널 교정/Gate 진입 → commission(edit 모드)으로 라우팅. 일괄 재교정만 모달 유지.
  // #2: 일괄 재교정 → [4-3-1] recal 모드 라우팅(onBatchRecal). 구 CalibrationWizard 모달 폐기.
  // v9.29 Wave D: 검사 대상 multi-select (array of names). 재클릭 = 토글 해제
  const [selectedTargetSet, setSelectedTargetSet] = $s([]);

  React.useEffect(() => {
    if (focusChannel) {
      setSelected(focusChannel);
      setFocusActive(true);
      const t = setTimeout(() => setFocusActive(false), 1300);
      return () => clearTimeout(t);
    }
  }, [focusChannel]);

  // v9.29 Wave D: 카드 외부 클릭 또는 ESC 시 전체 해제 (multi-select 모두 클리어)
  React.useEffect(() => {
    if (selectedTargetSet.length === 0) return;
    const handleKey = (e) => { if (e.key === "Escape") setSelectedTargetSet([]); };
    const handleClickOutside = (e) => {
      if (!e.target.closest || !e.target.closest(".target-card-v9")) setSelectedTargetSet([]);
    };
    document.addEventListener("keydown", handleKey);
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [selectedTargetSet]);

  const cur = sensorMap[selected] || window.MOCK.sensors[0];
  const isCurWarn = cur.state === "warn";

  // 32 cells (4 rows × 8 cols). First 8 map to real sensors.
  // v8.8: 64채널 다중 검사체 분산 부착 — ch01-24 PIPE-A-204 · ch25-48 TANK-B-101 · ch49-64 VESSEL-C-301
  const getTargetName = (i) => i <= 24 ? "PIPE-A-204" : i <= 48 ? "TANK-B-101" : "VESSEL-C-301";
  // v9.17/v22.6: 감육 검출 채널 — PIPE 4건 + VESSEL 2건 (검출 사실만, 등급 없음 — 판정은 웹)
  const DEFECT_CHANNELS = [4, 7, 12, 18, 51, 56];
  // v9.30: 교정 상태 — 미교정(신규 추가 후 미진행) + 만료(주기 초과) 채널은 major 컬러 breathe
  // v12.0: window.MOCK으로 통합 — F6 차단 다이얼로그·일괄 재교정과 동일 소스
  const UNCALIBRATED_CHANNELS = window.MOCK.uncalibratedChannels;
  const EXPIRED_CHANNELS = window.MOCK.expiredChannels;
  const cells = [];
  for (let i = 1; i <= 64; i++) {
    const id = "ch" + String(i).padStart(2, "0");
    const calibrationStatus = UNCALIBRATED_CHANNELS.includes(id)
      ? "uncalibrated"
      : EXPIRED_CHANNELS.includes(id) ? "expired" : "ok";
    cells.push({ id, sensor: sensorMap[id], targetName: getTargetName(i), defect: DEFECT_CHANNELS.includes(i), calibrationStatus });
  }

  // v9.14: 검사 대상 — PIPE-A-204에 결함 4건, 나머지 정상 (CH 25~64 비활성화)
  const TARGETS = [
    { name: "PIPE-A-204",   meta: "탄소강 · 외경 300mm · 두께 10mm",     range: "ch01–24 · 24ch", defectCount: 4 },
    { name: "TANK-B-101",   meta: "SS 304 · 구형 · ∅ 1500mm · 두께 6mm",   range: "ch25–48 · 24ch", defectCount: 0 },
    { name: "VESSEL-C-301", meta: "압력 용기 · 800 × 400mm · 두께 12mm",  range: "ch49–64 · 16ch", defectCount: 2 },
  ];
  // v9.29 Wave D: 카드 클릭 토글 — multi-select. 재클릭 = 해제
  const onTargetCardClick = (name) => {
    setSelectedTargetSet(prev => prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]);
  };

  const okCount       = window.MOCK.sensors.filter(s => s.state === "ok").length;
  const warnCount     = window.MOCK.sensors.filter(s => s.state === "warn").length;
  const errCount      = window.MOCK.sensors.filter(s => s.state === "err").length;
  const inactiveCount = 64 - window.MOCK.sensors.length;

  // v8.8: 메타 정보 stripe 7-col → 4-col 축소. Config/샘플링/펌웨어는 진단/로그 모달로 이동
  const META = [
    { label: "SN (시리얼)",   value: "MCF-2024-001" },
    { label: "IP 주소",       value: "192.168.1.100" },
    { label: "활성 채널",     value: "64 / 64 CH", emphasis: true },
    { label: "마지막 데이터 송신일시", value: "2026-06-16 13:00", success: true },
  ];

  return (
    // v9.30: MC보드 정보 full-width 배너(row 2) + 검사 대상/64ch/우측 패널 동일 행(row 3)
    <div className="erut-page-enter" style={{ display: "grid", gridTemplateColumns: "260px 1fr 400px", gridTemplateRows: "0px auto 1fr", alignContent: "start", columnGap: 16, rowGap: 16, padding: "20px 24px 20px 0", height: "100%" }}>

      {/* ───── v9.30: 좌측 검사 대상 세로 리스트 — row 3 col 1 (MC보드 배너 아래) ───── */}
      <div style={{ gridRow: 3, gridColumn: 1, background: "var(--surface-subtle-1)", borderRight: "1px solid var(--border-medium)", display: "flex", flexDirection: "column", minHeight: 0 }}>
        <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border-medium)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
            <h3 style={{ font: "700 14px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-high)", margin: 0 }}>검사 대상</h3>
            <span style={{ font: "400 11px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)" }}>{TARGETS.length}개</span>
          </div>
          <p style={{ font: "400 11px/1.4 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)", margin: "4px 0 0" }}>카드 클릭으로 다중 선택 가능</p>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 12px" }}>
          {TARGETS.map(t => {
            const isSelected = selectedTargetSet.includes(t.name);
            const isDimmed = selectedTargetSet.length > 0 && !isSelected;
            // v9.31: 결함 표시 border 삭제 — 결함 표시는 웹에서 처리 예정
            // v15.1: '측정 중' → 활성 채널 신호 상태 집계 (우선순위: 나쁨 > 약함 > 정상). 활성 채널 0개면 표시 hide.
            const targetActiveCells = cells.filter(c => c.targetName === t.name && c.sensor);
            const sigCounts = targetActiveCells.reduce((acc, c) => { acc[c.sensor.state] = (acc[c.sensor.state] || 0) + 1; return acc; }, {});
            const sigStatus = targetActiveCells.length === 0 ? null
              : (sigCounts.err > 0)  ? "err"
              : (sigCounts.warn > 0) ? "warn"
              : "ok";
            const sigLabel = sigStatus === "err" ? "나쁨" : sigStatus === "warn" ? "약함" : "정상";
            const sigColor = sigStatus === "err" ? "var(--system-error)" : sigStatus === "warn" ? "var(--system-caution)" : "var(--system-success)";
            return (
              <div
                key={t.name}
                className="target-card target-card-v9"
                onClick={() => onTargetCardClick(t.name)}
                style={{
                  position: "relative",
                  background: isSelected ? "linear-gradient(rgba(34,133,239,0.10),rgba(34,133,239,0.10)), var(--surface-base)" : "var(--surface-base)",
                  border: isSelected ? "1px solid var(--border-emphasis)" : "1px solid var(--border-medium)",
                  padding: "10px 12px",
                  marginBottom: 8,
                  opacity: isDimmed ? 0.6 : 1,
                  cursor: "pointer",
                  transition: "opacity 120ms ease",
                }}
              >
                {/* v9.30: 결함 N건 태그 제거 — 카드 border 색상으로 결함 등급 표시 유지 */}
                <div className="target-card__name" style={{ color: isSelected ? "var(--content-emphasis)" : "var(--content-high)" }}>{t.name}</div>
                <div className="target-card__meta" style={{ marginTop: 4 }}>{t.meta}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
                  <span className="target-card__range">{t.range}</span>
                  {sigStatus && (
                    <span style={{ font: "700 11px/1 var(--font-kr)", letterSpacing: ".02em", color: sigColor, display: "inline-flex", alignItems: "center", gap: 4 }}>
                      <span style={{ width: 6, height: 6, background: sigColor, borderRadius: "50%" }}/>{sigLabel}
                    </span>
                  )}
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

      {/* ───── v9.30: MC보드 정보 — row 2 cols 1-3 (full-width 배너) ───── */}
      <div style={{ gridRow: 2, gridColumn: "1 / -1", background: "transparent", border: "1px solid var(--border-medium)", padding: "12px 16px", marginLeft: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
            <span style={{ font: "700 14px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-high)" }}>MCuF-001</span>
            <span className="erut-pill" style={{ padding: "2px 8px", fontSize: 11, lineHeight: 1 }}>
              <span className="erut-led is-green" style={{ width: 8, height: 8 }}><span className="erut-led__halo"/><span className="erut-led__dot"/></span>
              연결됨
            </span>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {/* MC보드 단위 측정 제어 — idle=측정 시작 / measuring=측정 중지 (일시정지 폐기) */}
            {bSt === "idle" ? (
              <button className="erut-btn erut-btn--emphasis erut-btn--sm" style={{ display: "inline-flex", alignItems: "center", gap: 4 }} title="측정 시작 (F6)" onClick={() => onBoardControl && onBoardControl(boardId, "start")}>
                <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor"><polygon points="4,2 14,8 4,14"/></svg>측정 시작
              </button>
            ) : (
              <button className="erut-btn erut-btn--subtle erut-btn--sm" style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "var(--system-error)", borderColor: "var(--system-error)" }} title="측정 중지 (F7)" onClick={() => onBoardControl && onBoardControl(boardId, "stop")}>
                <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor"><rect x="3" y="3" width="10" height="10"/></svg>측정 중지
              </button>
            )}
            {/* 보고서 출력·진단/로그 → toolbar로 이동 (전역 컨텍스트 액션) */}
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
      </div>

      {/* ───── v9.30: 중앙 64ch 그리드 — row 3 col 2 ───── */}
      <div style={{ gridRow: 3, gridColumn: 2, minWidth: 0, display: "flex", flexDirection: "column" }}>
        {/* v9.9: 1행 = h3 + 우측 서브 안내 + 우측 끝 버튼 / 2행 = 카운터 좌측 정렬 */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
            <h3 style={{ font: "700 15px/1.2 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-high)", margin: 0 }}>64CH 채널 상태</h3>
            <span style={{ font: "400 12px/1.4 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)" }}>더블 클릭 → 우측 패널 A-scan 확대</span>
          </div>
          {/* v12.0: '+ 탐촉자 추가' 좌측 — 교정 필요 채널 일괄 재교정 진입 (N > 0 시에만 노출) */}
          <div style={{ display: "flex", gap: 8 }}>
            {(() => {
              const needsCalibChannels = cells.filter(c => c.calibrationStatus === "uncalibrated" || c.calibrationStatus === "expired");
              if (needsCalibChannels.length === 0) return null;
              return (
                <button
                  className="erut-btn erut-btn--default erut-btn--sm"
                  style={{ color: "var(--system-caution)", borderColor: "var(--system-caution)" }}
                  onClick={() => onBatchRecal && onBatchRecal(needsCalibChannels)}
                  title={`교정 주기 초과 또는 미진행 ${needsCalibChannels.length}채널 일괄 재교정`}
                >
                  일괄 재교정
                </button>
              );
            })()}
            <button className="erut-btn erut-btn--emphasis erut-btn--sm" onClick={() => onAddSensor && onAddSensor()}>+ 탐촉자 추가</button>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-start", gap: 10, marginBottom: 8, font: "700 11px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--system-success)" }}/>정상 {okCount}</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--system-caution)" }}/>약함 {warnCount}</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--system-error)" }}/>나쁨 {errCount}</span>
        </div>
        <window.ChannelGrid
          cells={cells}
          totalCh={64}
          selectedCh={selected}
          selectedTargets={selectedTargetSet}
          variant="device-detail"
          forceStrongAll={false}
          focusActive={focusActive}
          showTitle={false}
          showAttachCounters={false}
          onCellClick={(id) => setSelected(id)}
          onCellDoubleClick={(id) => onStartMeasure && onStartMeasure(id)}
        />

        {/* v9.16: [1-1] 대시보드 deep link 안내 배너 삭제 — v7.0에서 [1-1] 폐기로 메시지 obsolete */}
      </div>

      {/* v9.30: 우측 사이드패널 — row 3 col 3 */}
      <div className="erut-panel" style={{ gridRow: 3, gridColumn: 3, minWidth: 0 }}>
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

          {/* 측정 통계 (감육 모델: ToF→두께·감육률 / 상태=Amp 신뢰도) */}
          {(() => {
            const nominal = 10;                              // 공칭 두께 (PIPE-A)
            const thinMm = Math.max(0, nominal - cur.thickness);
            const thinPct = (thinMm / nominal * 100).toFixed(1);
            const isBad = cur.state === "err";               // Amp 나쁨(1-5%) → 측정 불가
            const isWeak = cur.state === "warn";             // Amp 약함(6-50%) → 신뢰도 낮음
            const detected = !isBad && thinMm >= 2.0;        // 허용 감육 2.0mm 초과
            const lbl = { font: "400 10px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)", marginBottom: 4 };
            const val = { font: "700 14px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-high)" };
            const unit = { fontSize: 10, color: "var(--content-low)", fontWeight: 400 };
            const relColor = isBad ? "var(--system-error)" : isWeak ? "var(--system-caution)" : "var(--system-success)";
            const relText = isBad ? "나쁨 (미부착)" : isWeak ? "약함 (점검 요망)" : "정상";
            return (
              <>
                <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 12px", padding: 12, background: "var(--surface-subtle-2)", border: "1px solid var(--border-low)" }}>
                  <div><div style={lbl}>측정 두께</div><div style={val}>{isBad ? "—" : cur.thickness.toFixed(2)} <span style={unit}>mm / 공칭 10</span></div></div>
                  <div><div style={lbl}>감육률 <span style={{ color: "var(--content-low)" }}>(감육량 {isBad ? "—" : thinMm.toFixed(1) + "mm"})</span></div><div style={{ ...val, color: "var(--system-error)" }}>{isBad ? "—" : thinPct + " %" + (isWeak ? " ⚠" : "")}</div></div>
                  <div><div style={lbl}>ToF</div><div style={val}>{cur.tof} <span style={unit}>μs</span></div></div>
                  <div><div style={lbl}>신호 세기 <span style={{ color: "var(--content-low)" }}>(Amp)</span></div><div style={{ ...val, color: relColor, display: "inline-flex", alignItems: "center", gap: 5 }}><span style={{ width: 8, height: 8, background: relColor, borderRadius: "50%" }}/>{relText}</div></div>
                </div>
                {detected && (
                  <div style={{ marginTop: 8, font: "700 12px/1.3 var(--font-kr)", letterSpacing: ".02em", color: "var(--system-error)" }}>⚠ 감육 검출 · 허용 감육 2.0 mm 초과</div>
                )}
              </>
            );
          })()}

          {/* v8.8: 채널 메타 한 줄 (측정 통계 컨테이너 하단으로 이동) */}
          <div style={{ font: "400 12px/1.7 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-medium)", padding: "12px 0 0", marginTop: 12, borderTop: "1px solid var(--border-low)" }}>
            주파수 5 MHz · Pulser 200V<br/>
            {/* #7: Gain 3종 표시 — [4-3-1]에서 설정한 소프트웨어/디지털/아날로그 */}
            Gain SW 12 · Digital 8 · Analog 8 dB<br/>
            영점 정상 · 마지막 측정 {cur.age}
          </div>

          {/* 액션 버튼 (사이드패널 하단) — v14.0: 교정/Gate 통합 → 'Gain·Gate·교정 통합 편집' 단일 진입점 */}
          {(() => {
            const selectedCell = cells.find(c => c.id === selected);
            const needsCalib = selectedCell && (selectedCell.calibrationStatus === "uncalibrated" || selectedCell.calibrationStatus === "expired");
            return (
              <button
                className={"erut-btn " + (needsCalib ? "erut-btn--emphasis" : "erut-btn--default") + " erut-btn--m"}
                style={{ width: "100%", marginTop: 12, ...(needsCalib ? { background: "var(--system-caution)", borderColor: "var(--system-caution)" } : {}) }}
                onClick={() => onEditChannel && onEditChannel(selected)}
                title={needsCalib ? "이 채널 교정 필요 — 편집 화면에서 교정·Gate 통합 처리" : "Gain·교정·Gate 통합 편집"}
              >
                {needsCalib ? "교정 필요 — 이 채널 설정 편집" : "이 채널 설정 편집"}
              </button>
            );
          })()}
          {/* v18.1: 보고서 출력 버튼은 MC보드 정보 옆 '진단/로그' 왼쪽으로 이동 (단위 일관성) */}
          <button className="erut-btn erut-btn--emphasis erut-btn--m" style={{ width: "100%", marginTop: 8 }} onClick={() => onStartMeasure && onStartMeasure(selected)}>A-scan 스캔 상세보기 ↗</button>
        </div>
      </div>

      {/* v9.35 Wave E+F: 탐촉자 추가 + 교정을 한 화면으로 통합 → 풀스크린 [4-3-1] ChannelCommissioning 페이지로 라우팅 */}

      {/* #2: 일괄 재교정은 [4-3-1] recal 모드로 라우팅(onBatchRecal) — DeviceDetail 내 모달 폐기 */}

      {/* 진단/로그 모달은 App(toolbar)에서 전역 렌더 */}
    </div>
  );
};

// =================== v9.35 Wave E+F: 채널 Commissioning 풀스크린 페이지 ===================
// 옵션 C — 채널 추가 + 교정(음속/영점/Gain/PRF/DAC) + Gate를 한 화면에 통합. (v20.1: 교정 검증 섹션 제거)
// 좌측 320px sticky: 채널 정보 + 진행 체크리스트. 우측 메인: A-scan + 4 sections.
window.ChannelCommissioning = function ChannelCommissioning({ deviceName, targets, onBack, onAddOnly, onAddAndStart, mode = "new", prefilledChannel, onSave, onSaveAndMeasure, onRemove, recalChannels = [] }) {
  // mode: "new"(신규 추가) / "edit"(운영 중 채널 편집) / "recal"(#2 일괄 재교정 — [4-3-2] CalibrationWizard 대체)
  const isEdit = mode === "edit";
  const isRecal = mode === "recal";
  const pre = prefilledChannel || {};
  // #2 recal: 재교정 대상 채널 목록 + 현재 선택 채널
  const [selectedRecal, setSelectedRecal] = $s((recalChannels[0] && (recalChannels[0].id || recalChannels[0])) || null);
  // #1: A-scan 하단 탭 — 교정 측정 / Gain·Gate 설정
  const [calibTab, setCalibTab] = $s("calib");

  // ───── 채널 정보 state — edit 모드 시 prefilledChannel로 초기화 ─────
  const [channel, setChannel] = $s(pre.channel || "");
  const [serial, setSerial]   = $s(pre.serial || "");
  const [target, setTarget]   = $s(pre.target || "");
  const [productName, setProductName] = $s(pre.productName || ""); // #11: 탐촉자 제품명/모델명
  const [loadFrom, setLoadFrom] = $s("");                          // #19: 기존 채널 설정 불러오기 (선택 후 리셋)
  // v20.0: 검사체 재질 — 검사 대상 등록 재질 자동 반영. 선택 시 음속·권장 PRF prefill (window.SOUND_SPEEDS / calcPRF 재사용)
  const [material, setMaterial] = $s(pre.material || Object.keys(window.SOUND_SPEEDS)[0]);
  // v20.0: 탐촉자 종류 프리셋 폐기 → 탐촉자 주파수·진동자 개별 수동 입력 (시리얼 자동 인식 X)
  const [freqMHz, setFreqMHz]   = $s(pre.freqMHz != null ? pre.freqMHz : 5);
  const [elementMm, setElementMm] = $s(pre.elementMm != null ? pre.elementMm : 10);
  const [elementShape, setElementShape] = $s(pre.elementShape || "원형");
  // v15.3: Wedge 각도 — 사용자 입력 각도 (90° = 수직 / 90° 미만 = 경사각). 측정값(wedge state)과 별개
  const [wedgeAngle, setWedgeAngle] = $s(pre.wedgeAngle != null ? pre.wedgeAngle : 90);
  // v16.0: 교정 주기 (일) — 전역 기본값 적용 vs 채널별 override.
  // useGlobalCycle = true → [8] 설정의 기본 주기(default 180) 따름 / false → channelCycleDays 직접 입력
  const globalCycle = (window.MOCK && window.MOCK.calibrationPolicy && window.MOCK.calibrationPolicy.defaultCycleDays) || 180;
  const [useGlobalCycle, setUseGlobalCycle] = $s(pre.useGlobalCycle !== false);
  const [channelCycleDays, setChannelCycleDays] = $s(pre.channelCycleDays != null ? pre.channelCycleDays : globalCycle);
  const effectiveCycle = useGlobalCycle ? globalCycle : channelCycleDays;

  // ───── 교정 측정 state — edit 모드 시 기존 교정값 prefill ─────
  const [wedge, setWedge]     = $s(pre.wedge    || { value: null, unit: "°" });
  const [velocity, setVel]    = $s(pre.velocity || { value: null, unit: "m/s" });
  const [zero, setZero]       = $s(pre.zero     || { value: null, unit: "μs" });
  // #6: Gain 3종(소프트웨어·디지털·아날로그) 개별 값 + −1/+1 / #16: LogScale 표시 스케일(−80~80 dB)
  const [gainSw, setGainSw]           = $s(pre.gainSw != null ? pre.gainSw : 12);
  const [gainDigital, setGainDigital] = $s(pre.gainDigital != null ? pre.gainDigital : 8);
  const [gainAnalog, setGainAnalog]   = $s(pre.gainAnalog != null ? pre.gainAnalog : 8);
  const [logScale, setLogScale]       = $s(pre.logScale || false);
  const [logScaleVal, setLogScaleVal] = $s(pre.logScaleVal != null ? pre.logScaleVal : 0);
  const adjGain = (setter) => (delta) => setter(v => Math.max(0, Math.min(80, v + delta)));
  // #17: PRF — 재질 기준 권장값 prefill, 항상 수정 가능 (상속 토글 폐지)
  const [prf, setPrf] = $s(pre.prf != null ? pre.prf : null);
  // Pulser 전압(V) — 탐촉자 여기 전압. 펄서-리시버 파라미터(PRF와 함께). [2] 표시값의 설정처.
  const [pulser, setPulser] = $s(pre.pulser != null ? pre.pulser : 200);
  // #18: TCG (시간 보정 이득) — DAC 선도 대체. 후면 에코 진폭 균일화(64ch 자동 두께 모니터링 적합)
  const [tcgOn, setTcgOn]       = $s(pre.tcgOn || false);
  const [tcgPoints, setTcgPoints] = $s(pre.tcgPoints != null ? pre.tcgPoints : 0);

  // v15.0: 교정 시험편 — 영점·음속 측정의 기준 시편. 표준시험편 선택 시 두께 자동 prefill.
  // v15.3: optgroup 분류 — 표준시험편(국제 코드 공인) / 비교시험편(자체 제작 · 검사체 동일 재질 + 인공 결함)
  // 식: 음속(m/s) = 2 × 두께(mm) × 1000 / ToF(μs) — 왕복 시간 보정
  const STANDARD_BLOCKS = {
    "iiw-v1": { label: "IIW V1 · ISO 2400 · 25 mm 탄소강",   thickness: 25.0, category: "standard" },
    "iiw-v2": { label: "IIW V2 · ISO 7963 · 12.5 mm 탄소강", thickness: 12.5, category: "standard" },
    "stb-a1": { label: "STB-A1 · JIS Z 2345 · 25 mm 탄소강",   thickness: 25.0, category: "standard" },
    "stb-a2": { label: "STB-A2 · JIS Z 2345 · 12.5 mm 탄소강", thickness: 12.5, category: "standard" },
    "custom": { label: "사용자 정의 (검사체 동일 재질 · 인공 결함)", thickness: null, category: "custom" },
  };
  const VEL_STANDARDS = { "탄소강": 5920, "SS 304": 5790, "SS 316L": 5740, "알루미늄": 6320, "티타늄": 6070, "구리": 4660, "Inconel": 5820, "황동": 4430, "주철": 4600 };
  const [refBlock, setRefBlockRaw] = $s(pre.refBlock || "iiw-v1");
  const [refThickness, setRefThickness] = $s(pre.refThickness != null ? pre.refThickness : 25.0);
  // 표준 블록 선택 시 두께 자동 채움 (사용자 정의 선택 시 유지)
  const setRefBlock = (key) => {
    setRefBlockRaw(key);
    const t = STANDARD_BLOCKS[key]?.thickness;
    if (t != null) setRefThickness(t);
  };
  // v20.1: 교정 시험편 종류 탭 — 표준시험편(standard) / 비교시험편(custom). 절차서상 둘 중 하나 선택 (두산 사례 = 비교시험편 단독)
  const [refKind, setRefKind] = $s(STANDARD_BLOCKS[pre.refBlock]?.category || "standard");
  const setRefKindTab = (kind) => {
    setRefKind(kind);
    if (kind === "standard") { if (STANDARD_BLOCKS[refBlock]?.category !== "standard") setRefBlock("iiw-v1"); }
    else { setRefBlockRaw("custom"); setRefThickness(pre.nominalThk != null ? pre.nominalThk : 10); }  // #13: 비교시험편 두께 = 검사체 공칭 두께(고정)
  };
  const canMeasureWithRef = refThickness > 0;
  // 측정값 → 가장 가까운 표준 음속과 비교
  const velHint = (() => {
    if (velocity.value == null) return null;
    const closest = Object.entries(VEL_STANDARDS)
      .map(([name, std]) => ({ name, std, pct: Math.abs((velocity.value - std) / std) * 100 }))
      .sort((a, b) => a.pct - b.pct)[0];
    if (closest.pct <= 1) return { tone: "var(--system-success)", text: `✓ ${closest.name} 표준 (${closest.std} m/s ±1%)` };
    if (closest.pct <= 3) return { tone: "var(--system-info)", text: `~ ${closest.name} 근사 (${closest.std} m/s ±${closest.pct.toFixed(1)}%)` };
    return { tone: "var(--system-caution)", text: `⚠ 표준 음속과 ±3% 초과 — 블록 재확인 권장` };
  })();

  // ───── Gate state — edit 모드 시 기존 Gate 값 prefill ─────
  const [gateA, setGateA] = $s(pre.gateA || { active: false, start: 0, width: 0, threshold: 50, mode: "Peak" });
  const [gateB, setGateB] = $s(pre.gateB || { active: false, start: 0, width: 0, threshold: 50, mode: "ToF" });
  const setA = (k, v) => setGateA(g => ({ ...g, [k]: v }));
  const setB = (k, v) => setGateB(g => ({ ...g, [k]: v }));

  // v20.1: 검사체 공칭 두께 — 채널 정보로 승격 (PRF 입력). 구 교정 검증 섹션의 nominal을 대체. 실제론 검사 대상 등록 두께 자동 반영
  const [nominalThk, setNominalThk] = $s(pre.nominalThk != null ? pre.nominalThk : 10);

  // v20.0: 재질 선택 → 표준 종파 음속 prefill (측정으로 정밀화 가능). 경사각 채널은 횡파 음속 별도 측정
  // v20.0: PRF 자동 산출 — 공칭 두께 × 재질 (window.calcPRF). 자동 OFF 시 수동값 사용
  const prfCalc  = window.calcPRF(nominalThk || 10, material);
  const prfValue = prf != null ? prf : prfCalc.prf;   // #17: 재질 기준 권장값 default, 수정 시 prf state 사용

  // 차트 범위 0~50μs → 0~100% width
  const toPct = (us) => Math.max(0, Math.min(100, (us / 50) * 100));
  const aOn = gateA.active && gateA.width > 0;
  const bOn = gateB.active && gateB.width > 0;

  // v16.1: A-scan Gate 드래그 인터랙션 — 폐기된 [3] GateSetup의 로직 이식.
  // 차트 영역 내 move / resize-l / resize-r / threshold 4 모드. 양방향 sync (드래그 ↔ input field).
  const chartRef = React.useRef(null);
  const [drag, setDrag] = $s(null);
  // drag = { gate, mode, startX, initStart, initWidth, initThreshold }
  function startDrag(gate, mode, e) {
    e.preventDefault();
    e.stopPropagation();
    const g = gate === "A" ? gateA : gateB;
    setDrag({ gate, mode, startX: e.clientX, initStart: g.start, initWidth: g.width, initThreshold: g.threshold });
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
      const dxUs = ((e.clientX - drag.startX) / rect.width) * 50;
      const snap = (us) => Math.round(us * 10) / 10; // 0.1 μs snap
      if (drag.mode === "move") {
        let newStart = snap(drag.initStart + dxUs);
        newStart = Math.max(0, Math.min(50 - drag.initWidth, newStart));
        setter(g => ({ ...g, start: newStart }));
      } else if (drag.mode === "resize-l") {
        const rightEdge = drag.initStart + drag.initWidth;
        let newStart = snap(drag.initStart + dxUs);
        newStart = Math.max(0, Math.min(rightEdge - 0.5, newStart));
        const newWidth = snap(rightEdge - newStart);
        setter(g => ({ ...g, start: newStart, width: newWidth }));
      } else if (drag.mode === "resize-r") {
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
  // threshold 라인 top 위치 (% 단위) — 양 Gate에서 재사용
  const aThrTop = (75 - (gateA.threshold / 100) * 43) + "%";
  const bThrTop = (75 - (gateB.threshold / 100) * 43) + "%";

  // ───── 진행 체크리스트 (자동 계산) ─────
  // v16.1: Wedge 측정 항목 제거 — Wedge 각도는 측정 불가, 좌측 채널 정보 input(wedgeAngle)으로 처리
  // #12: 순서 — 채널 정보 / Gain / Gate A / Gate B / 영점 / 음속
  const checklist = [
    { key: "info",   label: "채널 정보 입력",  done: !!(productName && serial && target) },
    { key: "gain",   label: "Gain 설정",        done: gainSw != null },
    { key: "gateA",  label: "Gate A 설정",      done: aOn },
    { key: "gateB",  label: "Gate B 설정",      done: bOn },
    { key: "zero",   label: "영점 측정",        done: zero.value != null },
    { key: "vel",    label: "음속 측정",        done: velocity.value != null },
  ];
  const requiredDone = checklist.filter(c => !c.optional).every(c => c.done);
  const canAddOnly  = !!(productName && channel && serial && target);
  const canAddStart = requiredDone;

  // ───── mock 측정 동작 ─────
  // v15.0: 음속·영점은 참조 블록 두께 기반 계산. 두께 미입력 시 disabled.
  // 식: 음속(m/s) = 2 × 두께(mm) × 1000 / ToF(μs)
  const measureWedge = () => setWedge({ value: 27, unit: "°" });
  const measureVel   = () => {
    if (!canMeasureWithRef) return;
    // mock ToF — 탄소강 음속(5920) 기준 두께/ToF 환산 + ±0.5% 잡음 추가
    const tofIdeal = (2 * refThickness * 1000) / 5920;
    const tof = tofIdeal * (1 + (Math.random() - 0.5) * 0.01);
    const vel = Math.round((2 * refThickness * 1000) / tof);
    setVel({ value: vel, unit: "m/s" });
  };
  const measureZero  = () => {
    if (!canMeasureWithRef) return;
    setZero({ value: 2.13, unit: "μs" });
  };
  // 교정 cell 컴포넌트 — 음속·영점 측정용 (Gain은 #14로 별도 Gain 설정 섹션으로 분리)
  function CalibCell({ label, state, onMeasure, disabled, hint }) {
    const filled = state.value != null;
    return (
      <div style={{ background: "var(--surface-base)", border: "1px solid var(--border-medium)", padding: "10px 12px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
          <span style={{ font: "700 11px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-medium)" }}>{label}</span>
          {filled && <span style={{ font: "700 10px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--system-success)" }}>✓ 완료</span>}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ flex: 1, font: "700 18px/1 var(--font-kr)", letterSpacing: ".02em", color: filled ? "var(--content-high)" : "var(--content-low)" }}>
            {filled ? `${state.value} ${state.unit}` : `--- ${state.unit}`}
          </div>
          <button
            className={"erut-btn erut-btn--sm " + (disabled ? "erut-btn--disabled" : "erut-btn--default")}
            disabled={disabled}
            onClick={onMeasure}
            title={disabled ? "교정 시험편 두께를 먼저 입력하세요" : undefined}
          >
            {filled ? "재측정" : "측정"}
          </button>
        </div>
        {hint && (
          <div style={{ marginTop: 6, font: "700 10px/1.3 var(--font-kr)", letterSpacing: ".02em", color: hint.tone }}>
            {hint.text}
          </div>
        )}
        {disabled && !filled && (
          <div style={{ marginTop: 6, font: "400 10px/1.3 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)" }}>
            ◯ 교정 시험편 두께 입력 필요
          </div>
        )}
      </div>
    );
  }
  // #6: Gain 1행 (라벨 + 값 input + −1/+1)
  function GainRow({ label, value, setter }) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ width: 64, font: "700 11px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-medium)" }}>{label}</span>
        <input className="erut-field" type="number" min="0" max="80" step="1" value={value} onChange={(e) => setter(Math.max(0, Math.min(80, parseInt(e.target.value, 10) || 0)))} style={{ flex: 1, minWidth: 0, height: 30, padding: "4px 8px", fontSize: 12 }}/>
        <span style={{ font: "400 10px/1 var(--font-kr)", color: "var(--content-low)" }}>dB</span>
        <button className="erut-btn erut-btn--default erut-btn--sm" style={{ minWidth: 28, padding: "4px 8px" }} onClick={() => adjGain(setter)(-1)}>−1</button>
        <button className="erut-btn erut-btn--default erut-btn--sm" style={{ minWidth: 28, padding: "4px 8px" }} onClick={() => adjGain(setter)(+1)}>+1</button>
      </div>
    );
  }

  // Gate 입력 그룹
  function GateInputs({ name, color, gate, onChange }) {
    return (
      <div style={{ borderLeft: "3px solid " + color, padding: "10px 14px", background: "var(--surface-base)", border: "1px solid var(--border-low)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div style={{ font: "700 13px/1 var(--font-kr)", letterSpacing: ".02em", color }}>{name}</div>
          <label className="erut-toggle" onClick={() => onChange("active", !gate.active)} style={{ cursor: "pointer" }}>
            <span className={"erut-toggle__track" + (gate.active ? " is-on" : "")}>
              <span className="erut-toggle__thumb"/>
            </span>
            <span className="erut-toggle__label erut-toggle__label--sm">활성</span>
          </label>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "6px 8px" }}>
          <div>
            <div style={{ font: "400 10px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)", marginBottom: 3 }}>Start (μs)</div>
            <input className="erut-field" type="number" step="0.1" value={gate.start} onChange={(e) => onChange("start", parseFloat(e.target.value) || 0)} style={{ width: "100%", height: 30, padding: "4px 8px", fontSize: 12 }}/>
          </div>
          <div>
            <div style={{ font: "400 10px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)", marginBottom: 3 }}>Width (μs)</div>
            <input className="erut-field" type="number" step="0.1" value={gate.width} onChange={(e) => onChange("width", parseFloat(e.target.value) || 0)} style={{ width: "100%", height: 30, padding: "4px 8px", fontSize: 12 }}/>
          </div>
          <div>
            <div style={{ font: "400 10px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)", marginBottom: 3 }}>Threshold (%)</div>
            <input className="erut-field" type="number" value={gate.threshold} onChange={(e) => onChange("threshold", parseFloat(e.target.value) || 0)} style={{ width: "100%", height: 30, padding: "4px 8px", fontSize: 12 }}/>
          </div>
          <div>
            <div style={{ font: "400 10px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)", marginBottom: 3 }}>Mode</div>
            <select className="erut-field" value={gate.mode} onChange={(e) => onChange("mode", e.target.value)} style={{ width: "100%", height: 30, padding: "4px 8px", fontSize: 12 }}>
              <option>Peak</option><option>Edge</option><option>ToF</option>
            </select>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="erut-page-enter" style={{
      display: "grid",
      gridTemplateColumns: "320px 1fr",
      gridTemplateRows: "0px 1fr 64px",
      height: "100%",
      padding: "20px 24px 0",
      columnGap: 20,
      rowGap: 14,
    }}>

      {/* ───── 좌측 sticky 패널 (320px) — v14.0: 모드별 분기 ───── */}
      <div style={{ gridRow: 2, gridColumn: 1, background: "var(--surface-subtle-1)", border: "1px solid var(--border-medium)", display: "flex", flexDirection: "column", overflowY: "auto", minHeight: 0 }}>
        {/* #2: 채널 번호 — 좌측 패널 최상단 (전 모드 공통). new=선택 / edit·recal=현재 채널 readonly */}
        <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border-low)" }}>
          <div style={{ font: "400 10px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-medium)", marginBottom: 3 }}>채널 번호 {mode === "new" && <span style={{ color: "var(--system-error)" }}>*</span>}</div>
          {mode === "new" ? (
            <select className="erut-field" value={channel} onChange={(e) => setChannel(e.target.value)} style={{ width: "100%", height: 30, padding: "4px 8px", fontSize: 12 }}>
              <option value="">선택하세요</option>
              <option value="65">65 (다음 빈 슬롯)</option>
              <option value="16">16 (현재 미등록)</option>
              <option value="manual">직접 입력...</option>
            </select>
          ) : (
            <input className="erut-field is-disabled" value={"CH " + String((isRecal ? selectedRecal : (pre.channel || channel)) || "").replace(/\D/g, "").padStart(2, "0")} readOnly tabIndex={-1} style={{ width: "100%", height: 30, padding: "4px 8px", fontSize: 12 }}/>
          )}
        </div>
        {isRecal ? (
          // ─── RECAL 모드(#2 일괄 재교정): 재교정 대상 채널 카드 + 진행 체크리스트 ───
          <>
            <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border-low)" }}>
              <div style={{ font: "700 11px/1 var(--font-kr)", letterSpacing: "0.08em", color: "var(--content-low)", textTransform: "uppercase", marginBottom: 10 }}>재교정 대상 채널 <span style={{ color: "var(--system-caution)" }}>{recalChannels.length}</span></div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {recalChannels.map((rc) => {
                  const id = (rc && (rc.id || rc)) || "";
                  const num = String(id).replace(/\D/g, "").padStart(2, "0");
                  const tname = (rc && rc.targetName) || "—";
                  const status = (rc && rc.calibrationStatus) || "expired";
                  const dates = (window.MOCK && window.MOCK.lastCalibrationDate) || {};
                  const last = dates["ch" + num] || dates[id];
                  const sel = selectedRecal === id;
                  const statusLabel = status === "uncalibrated" ? "미교정" : "주기 초과";
                  return (
                    <div key={id} onClick={() => setSelectedRecal(id)} style={{
                      padding: "8px 10px", cursor: "pointer",
                      background: sel ? "linear-gradient(rgba(34,133,239,0.10),rgba(34,133,239,0.10)), var(--surface-base)" : "var(--surface-base)",
                      border: sel ? "1px solid var(--border-emphasis)" : "1px solid var(--border-medium)",
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                        <span style={{ font: "700 12px/1 var(--font-kr)", letterSpacing: ".02em", color: sel ? "var(--content-emphasis)" : "var(--content-high)" }}>CH {num}</span>
                        <span style={{ font: "700 10px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--system-caution)" }}>{statusLabel}</span>
                      </div>
                      <div style={{ font: "400 10px/1.4 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)", marginTop: 3 }}>{tname} · 마지막 교정 {last || "—"}</div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div style={{ padding: "14px 16px" }}>
              <div style={{ font: "700 11px/1 var(--font-kr)", letterSpacing: "0.08em", color: "var(--content-low)", textTransform: "uppercase", marginBottom: 10 }}>진행 체크리스트 <span style={{ color: "var(--content-low)", fontWeight: 400 }}>(CH {String(selectedRecal || "").replace(/\D/g, "").padStart(2, "0")})</span></div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {checklist.filter(c => c.key !== "info").map(c => (
                  <div key={c.key} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0" }}>
                    <span style={{ width: 14, height: 14, borderRadius: "50%", border: c.done ? "none" : "1.5px solid var(--border-medium)", background: c.done ? "var(--system-success)" : "transparent", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {c.done && <svg width="9" height="9" viewBox="0 0 9 9"><path d="M1.5 4.5 L3.5 6.5 L7.5 2" stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                    </span>
                    <span style={{ font: c.done ? "700 12px/1.3 var(--font-kr)" : "400 12px/1.3 var(--font-kr)", letterSpacing: ".02em", color: c.done ? "var(--content-high)" : "var(--content-medium)" }}>{c.label}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 12, paddingTop: 10, borderTop: "1px solid var(--border-low)", font: "400 10px/1.4 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)" }}>◯ 채널 카드를 선택해 우측에서 재교정 → 모든 대상 완료 후 '재교정 완료'.</div>
            </div>
          </>
        ) : isEdit ? (
          // ─── EDIT 모드: 채널 정보(편집 가능) + 마지막 교정일 + 액션 카드 ───  (#1: 좌측 패널 항목 편집 가능)
          <>
            <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border-low)" }}>
              <div style={{ font: "700 11px/1 var(--font-kr)", letterSpacing: "0.08em", color: "var(--content-low)", textTransform: "uppercase", marginBottom: 10 }}>채널 정보</div>
              {/* add 모드와 동일 필드·순서 (채널번호·주파수는 A-scan 하단 공통) */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div>
                  <div style={{ font: "400 10px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-medium)", marginBottom: 3 }}>제품명</div>
                  <input className="erut-field" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="예: Olympus A430S-SB" style={{ width: "100%", height: 30, padding: "4px 8px", fontSize: 12 }}/>
                </div>
                <div>
                  <div style={{ font: "400 10px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-medium)", marginBottom: 3 }}>Serial 번호 (SN)</div>
                  <input className="erut-field" value={serial} onChange={(e) => setSerial(e.target.value)} style={{ width: "100%", height: 30, padding: "4px 8px", fontSize: 12 }}/>
                </div>
                <div>
                  <div style={{ font: "400 10px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-medium)", marginBottom: 3 }}>검사 대상</div>
                  <select className="erut-field" value={target} onChange={(e) => setTarget(e.target.value)} style={{ width: "100%", height: 30, padding: "4px 8px", fontSize: 12 }}>
                    {(targets || []).map(t => <option key={t.name} value={t.name}>{t.name}</option>)}
                  </select>
                </div>
                <div>
                  <div style={{ font: "400 10px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-medium)", marginBottom: 3 }}>검사체 재질 <span style={{ color: "var(--content-low)" }}>(검사 대상 상속)</span></div>
                  <input className="erut-field is-disabled" value={material} readOnly disabled style={{ width: "100%", height: 30, padding: "4px 8px", fontSize: 12 }}/>
                </div>
                <div>
                  <div style={{ font: "400 10px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-medium)", marginBottom: 3 }}>검사체 공칭 두께 (mm) <span style={{ color: "var(--content-low)" }}>(검사 대상 상속)</span></div>
                  <input className="erut-field is-disabled" type="number" value={nominalThk} readOnly disabled style={{ width: "100%", height: 30, padding: "4px 8px", fontSize: 12 }}/>
                </div>
                <div>
                  <div style={{ font: "400 10px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-medium)", marginBottom: 3 }}>Wedge 각도 (°)</div>
                  <input className="erut-field" type="number" min="0" max="90" step="0.1" value={wedgeAngle} onChange={(e) => setWedgeAngle(parseFloat(e.target.value) || 0)} style={{ width: "100%", height: 30, padding: "4px 8px", fontSize: 12 }}/>
                </div>
                <div>
                  <div style={{ font: "400 10px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-medium)", marginBottom: 3 }}>교정 주기 (일)</div>
                  <label onClick={() => setUseGlobalCycle(v => !v)} style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", font: "400 11px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-high)", marginBottom: 6 }}>
                    <span className="erut-cb"><span className={"erut-cb__box" + (useGlobalCycle ? " is-on" : "")}></span></span>
                    기본값 적용 ({globalCycle}일)
                  </label>
                  <input className={"erut-field" + (useGlobalCycle ? " is-disabled" : "")} type="number" min="1" step="1" value={useGlobalCycle ? globalCycle : channelCycleDays} onChange={(e) => setChannelCycleDays(parseInt(e.target.value, 10) || 0)} disabled={useGlobalCycle} style={{ width: "100%", height: 30, padding: "4px 8px", fontSize: 12 }}/>
                </div>
              </div>
            </div>
            {/* 마지막 교정 / 만료 상태 */}
            <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border-low)" }}>
              <div style={{ font: "700 11px/1 var(--font-kr)", letterSpacing: "0.08em", color: "var(--content-low)", textTransform: "uppercase", marginBottom: 10 }}>교정 상태</div>
              {(() => {
                const dates = (window.MOCK && window.MOCK.lastCalibrationDate) || {};
                const chId = "ch" + String(pre.channel || "").padStart(2, "0");
                const lastDate = dates[chId];
                const today = new Date("2026-06-10");
                const daysAgo = lastDate ? Math.floor((today - new Date(lastDate)) / 86400000) : null;
                // v16.0: 채널별 주기 (override) 우선, 없으면 전역 기본값
                const cycle = effectiveCycle;
                const expired = daysAgo != null && daysAgo > cycle;
                const tone = lastDate == null ? "var(--system-error)" : expired ? "var(--system-caution)" : "var(--system-success)";
                return (
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, font: "400 12px/1.5 var(--font-kr)", letterSpacing: ".02em" }}>
                    <div><span style={{ color: "var(--content-low)" }}>마지막 교정</span> <strong style={{ color: "var(--content-high)", fontWeight: 700 }}>{lastDate || "— (미교정)"}</strong></div>
                    {daysAgo != null && <div><span style={{ color: "var(--content-low)" }}>경과</span> <strong style={{ color: tone, fontWeight: 700 }}>{daysAgo}일 전</strong></div>}
                    {daysAgo != null && (
                      <div><span style={{ color: "var(--content-low)" }}>만료까지</span> <strong style={{ color: tone, fontWeight: 700 }}>{expired ? `주기 ${daysAgo - cycle}일 초과` : `${cycle - daysAgo}일 남음`}</strong></div>
                    )}
                    {lastDate == null && <div style={{ color: "var(--system-error)", fontWeight: 700 }}>미교정 — 교정 후 측정 가능</div>}
                  </div>
                );
              })()}
            </div>
            {/* 액션 */}
            <div style={{ padding: "14px 16px" }}>
              <div style={{ font: "700 11px/1 var(--font-kr)", letterSpacing: "0.08em", color: "var(--content-low)", textTransform: "uppercase", marginBottom: 10 }}>액션</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <button className="erut-btn erut-btn--default erut-btn--sm" style={{ width: "100%" }} onClick={() => { setWedge({ value: null, unit: "°" }); setVel({ value: null, unit: "m/s" }); setZero({ value: null, unit: "μs" }); }}>교정값 초기화</button>
                <button className="erut-btn erut-btn--default erut-btn--sm" style={{ width: "100%" }} onClick={() => { setGateA(g => ({ ...g, active: false, start: 0, width: 0 })); setGateB(g => ({ ...g, active: false, start: 0, width: 0 })); }}>Gate 초기화</button>
                {onRemove && <button className="erut-btn erut-btn--subtle erut-btn--sm" style={{ width: "100%", color: "var(--system-error)", borderColor: "var(--system-error)" }} onClick={onRemove}>채널 제거</button>}
              </div>
            </div>
          </>
        ) : (
          // ─── NEW 모드: 기존 채널 정보 입력 + 진행 체크리스트 ───
          <>
            <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border-low)" }}>
              <div style={{ font: "700 11px/1 var(--font-kr)", letterSpacing: "0.08em", color: "var(--content-low)", textTransform: "uppercase", marginBottom: 10 }}>채널 정보</div>
              {/* #19: 기존 채널 설정 불러오기 — 선택 시 설정 복사 후 '선택하기'로 리셋 */}
              <div style={{ marginBottom: 10 }}>
                <div style={{ font: "400 10px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-medium)", marginBottom: 3 }}>기존 채널 설정 불러오기</div>
                <select className="erut-field" value={loadFrom} onChange={(e) => { /* mockup: 선택 채널 설정을 폼으로 복사 후 셀렉트 리셋 */ setLoadFrom(""); }} style={{ width: "100%", height: 30, padding: "4px 8px", fontSize: 12 }}>
                  <option value="">선택하기</option>
                  <option value="ch01">CH 01 · PIPE-A-204</option>
                  <option value="ch02">CH 02 · PIPE-A-204</option>
                  <option value="ch25">CH 25 · TANK-B-101</option>
                </select>
                <div style={{ font: "400 9px/1.4 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)", marginTop: 3 }}>선택한 채널의 설정을 현재 폼으로 복사합니다. 복사 후 다시 '선택하기'로 돌아갑니다.</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {/* #11: 제품명 — 탐촉자 제품/모델명 (구 채널 번호 자리) */}
                <div>
                  <div style={{ font: "400 10px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-medium)", marginBottom: 3 }}>제품명 <span style={{ color: "var(--system-error)" }}>*</span></div>
                  <input className="erut-field" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="예: Olympus A430S-SB" style={{ width: "100%", height: 30, padding: "4px 8px", fontSize: 12 }}/>
                </div>
                <div>
                  <div style={{ font: "400 10px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-medium)", marginBottom: 3 }}>Serial 번호 (SN) <span style={{ color: "var(--system-error)" }}>*</span></div>
                  <input className="erut-field" value={serial} onChange={(e) => setSerial(e.target.value)} placeholder="예: PXT-2024-065" style={{ width: "100%", height: 30, padding: "4px 8px", fontSize: 12 }}/>
                </div>
                <div>
                  <div style={{ font: "400 10px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-medium)", marginBottom: 3 }}>검사 대상 <span style={{ color: "var(--system-error)" }}>*</span></div>
                  <select className="erut-field" value={target} onChange={(e) => setTarget(e.target.value)} style={{ width: "100%", height: 30, padding: "4px 8px", fontSize: 12 }}>
                    <option value="">선택하세요</option>
                    {(targets || []).map(t => <option key={t.name} value={t.name}>{t.name}</option>)}
                  </select>
                </div>
                {/* v22.7: 검사체 재질 — 검사 대상([6])에서 상속(readonly). 음속·권장 PRF 산출 기준. SSOT=[6] */}
                <div>
                  <div style={{ font: "400 10px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-medium)", marginBottom: 3 }}>검사체 재질 <span style={{ color: "var(--content-low)" }}>(검사 대상 상속)</span></div>
                  <input className="erut-field is-disabled" value={material} readOnly disabled style={{ width: "100%", height: 30, padding: "4px 8px", fontSize: 12 }}/>
                  <div style={{ font: "400 9px/1.4 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)", marginTop: 3 }}>검사 대상([6])에서 상속 — 변경은 [6]에서. 음속·권장 PRF 산출 기준.</div>
                </div>
                {/* v22.7: 검사체 공칭 두께 — 검사 대상([6])에서 상속(readonly). PRF 산출 입력 */}
                <div>
                  <div style={{ font: "400 10px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-medium)", marginBottom: 3 }}>검사체 공칭 두께 (mm) <span style={{ color: "var(--content-low)" }}>(검사 대상 상속)</span></div>
                  <input className="erut-field is-disabled" type="number" value={nominalThk} readOnly disabled style={{ width: "100%", height: 30, padding: "4px 8px", fontSize: 12 }}/>
                  <div style={{ font: "400 9px/1.4 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)", marginTop: 3 }}>검사 대상([6])에서 상속. 재질과 함께 권장 PRF 산출 기준.</div>
                </div>
                {/* v15.3: Wedge 각도 — 수직(90°) 기본값. 90° 미만은 경사각 */}
                <div>
                  <div style={{ font: "400 10px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-medium)", marginBottom: 3 }}>Wedge 각도 (°) <span style={{ color: "var(--system-error)" }}>*</span></div>
                  <input className="erut-field" type="number" min="0" max="90" step="0.1" value={wedgeAngle} onChange={(e) => setWedgeAngle(parseFloat(e.target.value) || 0)} style={{ width: "100%", height: 30, padding: "4px 8px", fontSize: 12 }}/>
                  <div style={{ font: "400 9px/1.4 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)", marginTop: 3 }}>수직 = 90° (두께 측정) / 경사각 = 90° 미만 (용접부·결함 탐지, 예: 70° · 60° · 45°)</div>
                </div>
                {/* v16.0: 교정 주기 — 전역 기본값(180일) 또는 채널별 override */}
                <div>
                  <div style={{ font: "400 10px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-medium)", marginBottom: 3 }}>교정 주기 (일)</div>
                  <label onClick={() => setUseGlobalCycle(v => !v)} style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", font: "400 11px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-high)", marginBottom: 6 }}>
                    <span className="erut-cb"><span className={"erut-cb__box" + (useGlobalCycle ? " is-on" : "")}></span></span>
                    기본값 적용 ({globalCycle}일)
                  </label>
                  <input className={"erut-field" + (useGlobalCycle ? " is-disabled" : "")} type="number" min="1" step="1" value={useGlobalCycle ? globalCycle : channelCycleDays} onChange={(e) => setChannelCycleDays(parseInt(e.target.value, 10) || 0)} disabled={useGlobalCycle} style={{ width: "100%", height: 30, padding: "4px 8px", fontSize: 12 }}/>
                  <div style={{ font: "400 9px/1.4 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)", marginTop: 3 }}>체크 해제 시 채널별 직접 입력. 기본값은 [8] 설정 → 교정 정책에서 변경. 절차서·검사체 환경에 따라 가변 (예: 90일·365일).</div>
                </div>
              </div>
            </div>

            {/* 진행 체크리스트 — new 모드 전용 */}
            <div style={{ padding: "14px 16px" }}>
              <div style={{ font: "700 11px/1 var(--font-kr)", letterSpacing: "0.08em", color: "var(--content-low)", textTransform: "uppercase", marginBottom: 10 }}>진행 체크리스트</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {checklist.map(c => (
                  <div key={c.key} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0" }}>
                    <span style={{
                      width: 14, height: 14, borderRadius: "50%",
                      border: c.done ? "none" : "1.5px solid var(--border-medium)",
                      background: c.done ? "var(--system-success)" : "transparent",
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}>
                      {c.done && (
                        <svg width="9" height="9" viewBox="0 0 9 9"><path d="M1.5 4.5 L3.5 6.5 L7.5 2" stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      )}
                    </span>
                    <span style={{ font: c.done ? "700 12px/1.3 var(--font-kr)" : "400 12px/1.3 var(--font-kr)", letterSpacing: ".02em", color: c.done ? "var(--content-high)" : "var(--content-medium)" }}>
                      {c.label}
                      {c.optional && <span style={{ color: "var(--content-low)", fontWeight: 400, fontSize: 10, marginLeft: 4 }}>(선택)</span>}
                    </span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 12, paddingTop: 10, borderTop: "1px solid var(--border-low)", font: "400 10px/1.4 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)" }}>
                ◯ 필수 항목을 모두 완료하면 "추가 + 측정 시작" 버튼이 활성화됩니다.
              </div>
            </div>
          </>
        )}
      </div>

      {/* ───── 우측 메인 영역 ───── */}
      <div style={{ gridRow: 2, gridColumn: 2, display: "flex", flexDirection: "column", gap: 14, overflowY: "auto", minHeight: 0, paddingRight: 4 }}>
        {/* A-scan 미리보기 */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
            <span style={{ font: "700 11px/1 var(--font-kr)", letterSpacing: "0.08em", color: "var(--content-low)", textTransform: "uppercase" }}>A-SCAN 미리보기</span>
            <span style={{ font: "400 10px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)" }}>0 – 50 μs · Gate / 교정값 실시간 반영</span>
          </div>
          {/* v16.1: chartRef + 드래그 인터랙션. SVG는 pointerEvents:'none' (배경), Gate overlay·핸들·threshold 라인은 mouseDown */}
          <div ref={chartRef} style={{ background: "var(--surface-base)", border: "1px solid var(--border-medium)", height: 320, position: "relative", userSelect: drag ? "none" : "auto" }}>
            <svg viewBox="0 0 800 320" preserveAspectRatio="none" width="100%" height="100%" style={{ position: "absolute", top: 0, left: 0, zIndex: 1, pointerEvents: "none" }}>
              <line x1="0" y1="262" x2="800" y2="262" stroke="var(--border-low)" strokeWidth="1"/>
              <path d="M0 262 L120 262 L140 232 L156 40 L172 280 L188 262 L380 262 L400 228 L416 90 L432 274 L448 262 L800 262" stroke="var(--brand-primary)" strokeWidth="1.5" fill="none"/>
            </svg>
            {aOn && (
              <>
                {/* Gate A 영역 (move) */}
                <div onMouseDown={(e) => startDrag("A", "move", e)}
                     style={{ position: "absolute", top: 0, bottom: 0, left: toPct(gateA.start) + "%", width: toPct(gateA.width) + "%", background: "var(--system-error)", opacity: 0.12, borderLeft: "2px solid var(--system-error)", borderRight: "2px solid var(--system-error)", zIndex: 2, cursor: "move" }}/>
                {/* 좌측 resize 핸들 */}
                <div onMouseDown={(e) => startDrag("A", "resize-l", e)}
                     style={{ position: "absolute", top: "calc(50% - 14px)", left: `calc(${toPct(gateA.start)}% - 5px)`, width: 10, height: 28, background: "var(--surface-base)", border: "2px solid rgba(255, 0, 94, 0.5)", cursor: "ew-resize", zIndex: 4 }}/>
                {/* 우측 resize 핸들 */}
                <div onMouseDown={(e) => startDrag("A", "resize-r", e)}
                     style={{ position: "absolute", top: "calc(50% - 14px)", left: `calc(${toPct(gateA.start) + toPct(gateA.width)}% - 5px)`, width: 10, height: 28, background: "var(--surface-base)", border: "2px solid rgba(255, 0, 94, 0.5)", cursor: "ew-resize", zIndex: 4 }}/>
                <div style={{ position: "absolute", top: 4, left: `calc(${toPct(gateA.start)}% + 4px)`, font: "700 10px/1 var(--font-kr)", color: "var(--system-error)", zIndex: 3, pointerEvents: "none" }}>Gate A</div>
                {/* Threshold (drag-able 12px hit 영역, 가운데 dashed) */}
                <div onMouseDown={(e) => startDrag("A", "threshold", e)}
                     style={{ position: "absolute", left: 0, right: 0, top: `calc(${aThrTop} - 6px)`, height: 12, cursor: "ns-resize", zIndex: 3 }}>
                  <div style={{ position: "absolute", left: 0, right: 0, top: 5, borderTop: "2px dashed var(--system-error)" }}/>
                </div>
                <div style={{ position: "absolute", right: 12, top: `calc(${aThrTop} - 14px)`, font: "700 10px/1 var(--font-kr)", color: "var(--system-error)", background: "var(--surface-base)", padding: "2px 4px", pointerEvents: "none", zIndex: 3 }}>A · {gateA.threshold}%</div>
              </>
            )}
            {bOn && (
              <>
                <div onMouseDown={(e) => startDrag("B", "move", e)}
                     style={{ position: "absolute", top: 0, bottom: 0, left: toPct(gateB.start) + "%", width: toPct(gateB.width) + "%", background: "var(--brand-primary)", opacity: 0.12, borderLeft: "2px solid var(--brand-primary)", borderRight: "2px solid var(--brand-primary)", zIndex: 2, cursor: "move" }}/>
                <div onMouseDown={(e) => startDrag("B", "resize-l", e)}
                     style={{ position: "absolute", top: "calc(50% - 14px)", left: `calc(${toPct(gateB.start)}% - 5px)`, width: 10, height: 28, background: "var(--surface-base)", border: "2px solid rgba(34, 133, 239, 0.5)", cursor: "ew-resize", zIndex: 4 }}/>
                <div onMouseDown={(e) => startDrag("B", "resize-r", e)}
                     style={{ position: "absolute", top: "calc(50% - 14px)", left: `calc(${toPct(gateB.start) + toPct(gateB.width)}% - 5px)`, width: 10, height: 28, background: "var(--surface-base)", border: "2px solid rgba(34, 133, 239, 0.5)", cursor: "ew-resize", zIndex: 4 }}/>
                <div style={{ position: "absolute", top: 4, left: `calc(${toPct(gateB.start)}% + 4px)`, font: "700 10px/1 var(--font-kr)", color: "var(--brand-primary)", zIndex: 3, pointerEvents: "none" }}>Gate B</div>
                <div onMouseDown={(e) => startDrag("B", "threshold", e)}
                     style={{ position: "absolute", left: 0, right: 0, top: `calc(${bThrTop} - 6px)`, height: 12, cursor: "ns-resize", zIndex: 3 }}>
                  <div style={{ position: "absolute", left: 0, right: 0, top: 5, borderTop: "2px dashed var(--brand-primary)" }}/>
                </div>
                <div style={{ position: "absolute", right: 12, top: `calc(${bThrTop} - 14px)`, font: "700 10px/1 var(--font-kr)", color: "var(--brand-primary)", background: "var(--surface-base)", padding: "2px 4px", pointerEvents: "none", zIndex: 3 }}>B · {gateB.threshold}%</div>
              </>
            )}
            {!aOn && !bOn && (
              <div style={{ position: "absolute", top: 14, right: 14, font: "400 11px/1.4 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)", textAlign: "right", zIndex: 3 }}>
                Gate를 활성화하고<br/>마우스로 영역·핸들·Threshold를 드래그하세요.<br/>정밀 값은 우측 input field 사용.
              </div>
            )}
          </div>
          {/* 탐촉자 주파수 — A-scan 하단 (채널 번호는 #2로 좌측 최상단 이동) */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 8 }}>
            <div>
              <div style={{ font: "400 10px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-medium)", marginBottom: 3 }}>탐촉자 주파수 (MHz) {mode === "new" && <span style={{ color: "var(--system-error)" }}>*</span>}</div>
              <input className="erut-field" type="number" min="0.5" max="20" step="0.25" value={freqMHz} onChange={(e) => setFreqMHz(parseFloat(e.target.value) || 0)} style={{ width: "100%", height: 30, padding: "4px 8px", fontSize: 12 }}/>
            </div>
          </div>
        </div>

        {/* #1: A-scan 하단 탭 — 교정 측정 / Gain·Gate 설정 */}
        <div className="erut-tabs" style={{ marginBottom: 4 }}>
          <button className={"erut-tab" + (calibTab === "calib" ? " is-active" : "")} onClick={() => setCalibTab("calib")}>교정 측정</button>
          <button className={"erut-tab" + (calibTab === "gaingate" ? " is-active" : "")} onClick={() => setCalibTab("gaingate")}>Gain 설정 + Gate 설정</button>
        </div>
        {calibTab === "calib" && (
          <div>
            <div style={{ font: "700 11px/1 var(--font-kr)", letterSpacing: "0.08em", color: "var(--content-low)", textTransform: "uppercase", marginBottom: 8 }}>교정 측정</div>
            {/* v15.0 교정 시험편 — 영점·음속 측정의 기준 시편 */}
            <div style={{ background: "var(--surface-base)", border: "1px solid var(--border-emphasis)", padding: "10px 12px", marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
                <span style={{ font: "700 11px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-emphasis)" }}>교정 시험편</span>
                <span style={{ font: "400 10px/1.3 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)" }}>영점·음속 기준 시편 (절차서 규정 준수)</span>
              </div>
              {/* v20.1: 표준시험편 / 비교시험편 = 작은 탭으로 모드 구분 (.erut-tab--sm 재사용) */}
              <div className="erut-tabs" style={{ marginBottom: 8 }}>
                <button className={"erut-tab erut-tab--sm" + (refKind === "standard" ? " is-active" : "")} onClick={() => setRefKindTab("standard")}>표준시험편</button>
                <button className={"erut-tab erut-tab--sm" + (refKind === "custom" ? " is-active" : "")} onClick={() => setRefKindTab("custom")}>비교시험편</button>
              </div>
              {refKind === "standard" ? (
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 8 }}>
                  <div>
                    <div style={{ font: "400 10px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)", marginBottom: 3 }}>시험편 종류 <span style={{ color: "var(--content-low)" }}>(공인 코드)</span></div>
                    <select className="erut-field" value={refBlock} onChange={(e) => setRefBlock(e.target.value)} style={{ width: "100%", height: 30, padding: "4px 8px", fontSize: 12 }}>
                      {Object.entries(STANDARD_BLOCKS).filter(([, v]) => v.category === "standard").map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <div style={{ font: "400 10px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)", marginBottom: 3 }}>두께 (mm) <span style={{ color: "var(--system-error)" }}>*</span></div>
                    <input className="erut-field" type="number" step="0.1" value={refThickness} onChange={(e) => setRefThickness(parseFloat(e.target.value) || 0)} style={{ width: "100%", height: 30, padding: "4px 8px", fontSize: 12 }}/>
                  </div>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 8 }}>
                  <div>
                    <div style={{ font: "400 10px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)", marginBottom: 3 }}>재질 <span style={{ color: "var(--content-low)" }}>(검사체 동일)</span></div>
                    <input className="erut-field is-disabled" value={material} disabled style={{ width: "100%", height: 30, padding: "4px 8px", fontSize: 12 }}/>
                  </div>
                  <div>
                    <div style={{ font: "400 10px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)", marginBottom: 3 }}>두께 (mm) <span style={{ color: "var(--content-low)" }}>(검사체 동일)</span></div>
                    <input className="erut-field is-disabled" type="number" value={nominalThk} readOnly disabled style={{ width: "100%", height: 30, padding: "4px 8px", fontSize: 12 }}/>
                  </div>
                </div>
              )}
              <div style={{ marginTop: 6, font: "400 10px/1.4 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)" }}>
                음속 = 2 × 두께(mm) × 1000 / ToF(μs). {refKind === "standard" ? "표준시험편 선택 시 두께 자동 채움(수정 가능)." : "비교시험편 = 검사체 동일 재질·두께 + 인공 결함. 두께는 검사체와 동일(고정)."}
              </div>
            </div>
            {/* 음속·영점 (Gain은 #14로 우측 Gate 위 'Gain 설정' 섹션으로 분리) */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <CalibCell label="음속"         state={velocity} onMeasure={measureVel}  disabled={!canMeasureWithRef} hint={velHint}/>
              <CalibCell label="영점 (Zero)"  state={zero}     onMeasure={measureZero} disabled={!canMeasureWithRef}/>
            </div>
            {/* #17 PRF + Pulser 전압 + #18 TCG (DAC 대체) */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 10 }}>
              <div style={{ background: "var(--surface-base)", border: "1px solid var(--border-medium)", padding: "10px 12px" }}>
                <div style={{ font: "700 11px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-medium)", marginBottom: 6 }}>PRF <span style={{ fontWeight: 400, color: "var(--content-low)" }}>(Hz)</span></div>
                <input className="erut-field" type="number" min="1" step="1" value={prfValue} onChange={(e) => setPrf(parseInt(e.target.value, 10) || 0)} style={{ width: "100%", height: 34, padding: "4px 8px", fontSize: 15, fontWeight: 700 }}/>
                <div style={{ marginTop: 6, font: "400 10px/1.3 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)" }}>
                  재질·공칭두께 기준 권장 {prfCalc.prf.toLocaleString()} Hz ({material.split(" ")[0]} · {nominalThk}mm) — 기본 입력, 언제든 수정 가능.
                </div>
              </div>
              {/* Pulser 전압 — 탐촉자 여기 전압. [2] 채널 메타 'Pulser N V' 표시의 설정처 */}
              <div style={{ background: "var(--surface-base)", border: "1px solid var(--border-medium)", padding: "10px 12px" }}>
                <div style={{ font: "700 11px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-medium)", marginBottom: 6 }}>Pulser 전압 <span style={{ fontWeight: 400, color: "var(--content-low)" }}>(V)</span></div>
                <select className="erut-field" value={pulser} onChange={(e) => setPulser(parseInt(e.target.value, 10))} style={{ width: "100%", height: 34, padding: "4px 8px", fontSize: 15, fontWeight: 700 }}>
                  <option value="100">100 V</option><option value="150">150 V</option><option value="200">200 V</option><option value="300">300 V</option><option value="400">400 V</option>
                </select>
                <div style={{ marginTop: 6, font: "400 10px/1.3 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)" }}>탐촉자 여기 전압 — 높을수록 침투↑·분해능↓.</div>
              </div>
              <div style={{ background: "var(--surface-base)", border: "1px solid var(--border-medium)", padding: "10px 12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ font: "700 11px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-medium)" }}>TCG <span style={{ fontWeight: 400, color: "var(--content-low)" }}>(시간 보정 이득)</span></span>
                  <window.Toggle checked={tcgOn} onChange={setTcgOn} size="sm" label="사용"/>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ flex: 1, font: "700 13px/1.2 var(--font-kr)", letterSpacing: ".02em", color: tcgPoints > 0 ? "var(--content-high)" : "var(--content-low)" }}>
                    {tcgPoints > 0 ? `기준점 ${tcgPoints}개 (시간·dB)` : "미설정 — 기준점 0"}
                  </div>
                  <button className={"erut-btn erut-btn--default erut-btn--sm" + (tcgOn ? "" : " erut-btn--disabled")} disabled={!tcgOn} onClick={() => setTcgPoints(n => n + 1)}>기준점 추가</button>
                </div>
                <div style={{ marginTop: 6, font: "400 10px/1.3 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)" }}>시간대별 Gain 보정으로 후면 에코 진폭 균일화 — 두께 범위 전반 일관된 Amp 기준.</div>
              </div>
            </div>
          </div>

        )}
        {calibTab === "gaingate" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {/* #6/#16: Gain 설정 — 소프트웨어·디지털·아날로그 개별 값(input+−1/+1) + LogScale 표시 스케일 */}
            <div>
            <div style={{ font: "700 11px/1 var(--font-kr)", letterSpacing: "0.08em", color: "var(--content-low)", textTransform: "uppercase", marginBottom: 8 }}>Gain 설정</div>
            <div style={{ background: "var(--surface-base)", border: "1px solid var(--border-medium)", padding: "10px 12px", marginBottom: 14, display: "flex", flexDirection: "column", gap: 8 }}>
              <GainRow label="SW" value={gainSw} setter={setGainSw}/>
              <GainRow label="Digital" value={gainDigital} setter={setGainDigital}/>
              <GainRow label="Analog" value={gainAnalog} setter={setGainAnalog}/>
              <div style={{ display: "flex", alignItems: "center", gap: 10, paddingTop: 8, borderTop: "1px solid var(--border-low)" }}>
                <label onClick={() => setLogScale(v => !v)} style={{ display: "inline-flex", alignItems: "center", gap: 6, cursor: "pointer", font: "400 11px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-high)", flexShrink: 0 }}>
                  <span className="erut-cb"><span className={"erut-cb__box" + (logScale ? " is-on" : "")}></span></span>
                  LogScale
                </label>
                <span style={{ font: "400 10px/1 var(--font-kr)", color: "var(--content-low)" }}>−80</span>
                <input type="range" min="-80" max="80" step="1" value={logScaleVal} onChange={(e) => setLogScaleVal(parseInt(e.target.value, 10))} style={{ flex: 1, minWidth: 0, accentColor: "var(--brand-primary)" }}/>
                <span style={{ font: "400 10px/1 var(--font-kr)", color: "var(--content-low)" }}>80</span>
              </div>
            </div>
            </div>
            {/* Gate 설정 (Gate A / Gate B stack) — 우측 열 */}
            <div>
            <div style={{ font: "700 11px/1 var(--font-kr)", letterSpacing: "0.08em", color: "var(--content-low)", textTransform: "uppercase", marginBottom: 8 }}>Gate 설정</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <GateInputs name="Gate A — 1차 반사" color="var(--system-error)" gate={gateA} onChange={setA}/>
              <GateInputs name="Gate B — 2차 반사 / 두께 측정" color="var(--brand-primary)" gate={gateB} onChange={setB}/>
            </div>
          </div>
        </div>
        )}
        {/* v20.1: 하단 '교정 검증'(구 시편 확인) 제거 — 64ch 고정 구조에서 채널별 검증 비현실 + 탱크 벽 검증은 감육과 혼동. 음속 velHint + 교정 시험편이 정확도 anchor. 공칭 두께는 채널 정보로 승격(PRF 입력) */}
      </div>

      {/* ───── 하단 sticky 액션 바 — v14.0 모드별 분기 ───── */}
      <div style={{ gridRow: 3, gridColumn: "1 / -1", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 24px", borderTop: "1px solid var(--border-medium)", background: "var(--surface-subtle-1)" }}>
        {/* #19: '적용 범위' 폐지 — 설정 불러오기는 좌측 패널 최상단 셀렉트로 이동 */}
        {isRecal
          ? <span style={{ font: "700 11px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-medium)" }}>일괄 재교정 진행 — 대상 <span style={{ color: "var(--system-caution)" }}>{recalChannels.length}</span>채널</span>
          : <span/>}
        <div style={{ display: "flex", gap: 8 }}>
          <button className="erut-btn erut-btn--subtle erut-btn--sm" onClick={onBack}>취소</button>
          {isRecal ? (
            /* #2 recal: 재교정 완료 */
            <button className="erut-btn erut-btn--emphasis erut-btn--sm" onClick={onBack}>재교정 완료</button>
          ) : isEdit ? (
            <>
              <button className="erut-btn erut-btn--default erut-btn--sm" onClick={onSave}>저장</button>
              <button className="erut-btn erut-btn--emphasis erut-btn--sm" onClick={onSaveAndMeasure}>저장 + 측정 시작</button>
            </>
          ) : (
            /* #15: '임시 저장'·'추가만' 삭제, '추가 + 측정 시작'→'추가' */
            <button className={"erut-btn erut-btn--emphasis erut-btn--sm" + (canAddOnly ? "" : " erut-btn--disabled")} disabled={!canAddOnly} onClick={onAddOnly}>추가</button>
          )}
        </div>
      </div>
    </div>
  );
};

// =================== v8.8: 진단 / 로그 모달 (좌측 탭 메뉴 + 우측 콘텐츠) ===================
// v17.0: 5탭 → 4탭. 하드웨어 진단(유지) + 통신(신규) + 교정 이력(유지) + 측정 에러(에러+측정 통합).
//        이벤트 기반 → 수치 기반 raw data 전환. 인라인 펼침 + '상세 →' 버튼 폐기.
// projectScope: [1] 메인에서 진입 시 true — 하드웨어 진단(보드 개별) 제외, 등록된 전체 MC보드 로그 통합 표시.
window.DiagnosticsModal = function DiagnosticsModal({ onClose, projectScope = false }) {
  const allTabs = [
    { id: "hw",    label: "하드웨어 진단" },
    { id: "comm",  label: "통신 로그" },
    { id: "calib", label: "교정 이력" },
    { id: "err",   label: "측정 로그" },
  ];
  const tabs = projectScope ? allTabs.filter(t => t.id !== "hw") : allTabs;
  const [tab, setTab] = $s(projectScope ? "comm" : "hw"); // hw / comm / calib / err
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(10,28,60,0.55)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: 1100, maxHeight: "90vh", background: "var(--surface-base)", border: "1px solid var(--border-medium)", display: "flex", flexDirection: "column" }}>
        {/* v8.8: 헤더 — titlebar 컬러 통일 */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 18px", borderBottom: "1px solid var(--border-medium)", background: "var(--content-medium)" }}>
          <div style={{ font: "700 16px/1.2 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-inverse)" }}>{projectScope ? "진단 / 로그 — 등록된 전체 MC보드" : "진단 / 로그 — MCuF-001"}</div>
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
            {tab === "hw"    && <DiagHardware/>}
            {tab === "comm"  && <DiagCommLog projectScope={projectScope}/>}
            {tab === "calib" && <DiagCalibHistory projectScope={projectScope}/>}
            {tab === "err"   && <DiagMeasErrorLog projectScope={projectScope}/>}
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
// v9.18 (NDT 1.4): 교정 이력 탭 강화 — 채널별 마지막 교정 + 경과일
function DiagCalibHistory({ projectScope = false }) {
  // mock 데이터 — 실제는 sensor.lastCalibration 기준. board: [1] 진입 시 MC보드 식별.
  const rows = [
    { ch: "CH 04", board: "MCuF-001", date: "2025-11-20", days: 191, status: "경과" },
    { ch: "CH 07", board: "MCuF-001", date: "2026-02-10", days: 108, status: "정상" },
    { ch: "CH 09", board: "MCuF-002", date: "2025-11-15", days: 196, status: "경과" },
    { ch: "CH 12", board: "MCuF-002", date: "2025-11-25", days: 186, status: "경과" },
    { ch: "CH 18", board: "MCuF-003", date: "2026-03-05", days: 85,  status: "정상" },
    { ch: "CH 22", board: "MCuF-003", date: "2026-04-12", days: 47,  status: "정상" },
  ];
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
        <h3 style={{ font: "700 16px/1.2 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-high)", margin: 0 }}>교정 이력</h3>
        <button className="erut-btn erut-btn--default erut-btn--sm">CSV 내보내기 ↓</button>
      </div>
      <div style={{ font: "400 11px/1.4 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)", marginBottom: 12 }}>교정 주기 초과 시 측정 신뢰성 의심 — 재교정 권장 (주기는 [8] 설정 → 교정 정책에서 지정)</div>
      <table style={{ width: "100%", borderCollapse: "collapse", font: "400 12px/1.4 var(--font-kr)" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid var(--border-medium)", textAlign: "left", color: "var(--content-low)", fontWeight: 700 }}>
            <th style={{ padding: "8px 6px" }}>채널</th>
            {projectScope && <th style={{ padding: "8px 6px" }}>MC보드</th>}
            <th style={{ padding: "8px 6px" }}>마지막 교정일</th>
            <th style={{ padding: "8px 6px" }}>경과일</th>
            <th style={{ padding: "8px 6px" }}>상태</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.ch} style={{ borderBottom: "1px solid var(--border-low)" }}>
              <td style={{ padding: "8px 6px", fontWeight: 700, color: "var(--content-high)" }}>{r.ch}</td>
              {projectScope && <td style={{ padding: "8px 6px", fontWeight: 700, color: "var(--content-high)" }}>{r.board}</td>}
              <td style={{ padding: "8px 6px", color: "var(--content-medium)" }}>{r.date}</td>
              <td style={{ padding: "8px 6px", color: r.days > 180 ? "var(--system-caution)" : "var(--content-medium)", fontWeight: r.days > 180 ? 700 : 400 }}>{r.days}일</td>
              <td style={{ padding: "8px 6px", color: r.days > 180 ? "var(--system-caution)" : "var(--system-success)", fontWeight: 700 }}>{r.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: 12, padding: "8px 12px", background: "var(--surface-subtle-2)", borderLeft: "3px solid var(--content-low)", font: "400 11px/1.4 var(--font-kr)", color: "var(--content-medium)" }}>
        측정 시작(F6) 시 6개월 경과 채널이 있으면 자동 안내 다이얼로그가 표시됩니다. 정기 추적·만료 알림은 ERUT 웹 서비스(상시 모니터링)에서 제공됩니다.
      </div>
    </>
  );
}

// v12.0: F6 측정 시작 차단 다이얼로그 — 미교정/만료 채널 존재 시 noop measurement 방지
// 기본 액션: 일괄 재교정 (NDT 안전 보증 default). "그대로 측정 시작"은 명시 선택 시에만.
window.CalibrationStartDialog = function CalibrationStartDialog({ uncalibratedIds, expiredIds, onRecalibrateAll, onContinueAnyway, onClose }) {
  const total = (uncalibratedIds?.length || 0) + (expiredIds?.length || 0);
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(10,28,60,0.55)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: 560, background: "var(--surface-base)", border: "1px solid var(--border-medium)", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 18px", borderBottom: "1px solid var(--border-medium)", background: "var(--system-caution)" }}>
          <div style={{ font: "700 16px/1.2 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-inverse)" }}>측정 시작 — 교정 확인 필요</div>
          <button onClick={onClose} aria-label="닫기" style={{ background: "transparent", border: "none", color: "var(--content-inverse)", cursor: "pointer", padding: 4, display: "inline-flex", alignItems: "center", justifyContent: "center" }}><window.EIcon.Close size={14}/></button>
        </div>
        <div style={{ padding: "18px 22px", display: "flex", flexDirection: "column", gap: 14 }}>
          <p style={{ font: "400 13px/1.6 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-high)", margin: 0 }}>
            <strong style={{ fontWeight: 700, color: "var(--system-caution)" }}>{total}개</strong> 채널이 교정되지 않았거나 교정 주기를 초과했습니다.<br/>
            교정되지 않은 채널의 측정 데이터는 <strong style={{ fontWeight: 700, color: "var(--content-high)" }}>신뢰성을 보장할 수 없습니다</strong>.
          </p>
          <div style={{ background: "var(--surface-subtle-2)", border: "1px solid var(--border-low)", padding: "10px 12px", display: "flex", flexDirection: "column", gap: 6, font: "400 12px/1.5 var(--font-kr)", letterSpacing: ".02em" }}>
            {uncalibratedIds?.length > 0 && (
              <div>
                <span style={{ color: "var(--content-low)" }}>미교정 (신규 추가 후 미진행)</span>{" "}
                <strong style={{ color: "var(--content-high)" }}>{uncalibratedIds.length}개</strong>
                <span style={{ color: "var(--content-medium)", marginLeft: 8 }}>· {uncalibratedIds.map(c => c.toUpperCase().replace("CH", "CH ")).join(" · ")}</span>
              </div>
            )}
            {expiredIds?.length > 0 && (
              <div>
                <span style={{ color: "var(--content-low)" }}>교정 주기 초과</span>{" "}
                <strong style={{ color: "var(--content-high)" }}>{expiredIds.length}개</strong>
                <span style={{ color: "var(--content-medium)", marginLeft: 8 }}>· {expiredIds.map(c => c.toUpperCase().replace("CH", "CH ")).join(" · ")}</span>
              </div>
            )}
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 18px", borderTop: "1px solid var(--border-medium)", background: "var(--surface-subtle-1)" }}>
          <button className="erut-btn erut-btn--subtle erut-btn--sm" onClick={onClose}>취소</button>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="erut-btn erut-btn--subtle erut-btn--sm" onClick={onContinueAnyway}>그대로 측정 시작</button>
            <button className="erut-btn erut-btn--emphasis erut-btn--sm" onClick={onRecalibrateAll} autoFocus>일괄 재교정 ({total}ch)</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// v16.0: 교정 만료 임박 알림 다이얼로그 — 앱 시작 시 자동 표시 + 상태바 배지 클릭 시 표시.
// 각 알림 시점(D-7·D-1·D-0)에 채널당 1회 표시 (중복 방지). 만료된 채널은 F6 차단 다이얼로그가 별도 담당.
// props: channels[{ id, daysRemaining, lastDate, cycleDays }], onRecalibrateAll, onOpenSettings, onClose
window.CalibrationExpiryAlertDialog = function CalibrationExpiryAlertDialog({ channels, onRecalibrateAll, onOpenSettings, onClose }) {
  const count = channels?.length || 0;
  if (count === 0) return null;
  const fmtRemain = (d) => d <= 0 ? "당일 (D-Day)" : `${d}일 남음`;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(10,28,60,0.55)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: 620, background: "var(--surface-base)", border: "1px solid var(--border-medium)", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 18px", borderBottom: "1px solid var(--border-medium)", background: "var(--system-caution)" }}>
          <div style={{ font: "700 16px/1.2 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-inverse)" }}>탐촉자 교정 — 임박 알림</div>
          <button onClick={onClose} aria-label="닫기" style={{ background: "transparent", border: "none", color: "var(--content-inverse)", cursor: "pointer", padding: 4, display: "inline-flex", alignItems: "center", justifyContent: "center" }}><window.EIcon.Close size={14}/></button>
        </div>
        <div style={{ padding: "18px 22px", display: "flex", flexDirection: "column", gap: 12 }}>
          <p style={{ font: "400 13px/1.6 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-high)", margin: 0 }}>
            <strong style={{ fontWeight: 700, color: "var(--system-caution)" }}>{count}개</strong> 채널의 교정 주기 만료가 임박했습니다.<br/>
            측정 신뢰성 유지를 위해 만료 전 재교정을 권장합니다.
          </p>
          <div style={{ background: "var(--surface-subtle-2)", border: "1px solid var(--border-low)", padding: "10px 12px", display: "flex", flexDirection: "column", gap: 6, font: "400 12px/1.5 var(--font-kr)", letterSpacing: ".02em" }}>
            <div style={{ display: "grid", gridTemplateColumns: "60px 1fr auto", gap: 8, alignItems: "center", paddingBottom: 6, borderBottom: "1px solid var(--border-low)", font: "700 11px/1 var(--font-kr)", color: "var(--content-low)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              <span>채널</span>
              <span>마지막 교정 / 주기</span>
              <span>만료까지</span>
            </div>
            {channels.map(c => (
              <div key={c.id} style={{ display: "grid", gridTemplateColumns: "60px 1fr auto", gap: 8, alignItems: "center" }}>
                <span style={{ color: "var(--content-high)", fontWeight: 700 }}>{c.id}</span>
                <span style={{ color: "var(--content-medium)" }}>{c.lastDate} · 주기 {c.cycleDays}일</span>
                <strong style={{ color: "var(--system-caution)", fontWeight: 700 }}>{fmtRemain(c.daysRemaining)}</strong>
              </div>
            ))}
          </div>
          <div style={{ font: "400 10px/1.4 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)" }}>
            알림 시점은 <strong style={{ color: "var(--content-high)" }}>[8] 설정 모달 → 교정 정책</strong>에서 변경할 수 있습니다 (7일 전·1일 전·당일 다중 선택).
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 18px", borderTop: "1px solid var(--border-medium)", background: "var(--surface-subtle-1)" }}>
          <button className="erut-btn erut-btn--subtle erut-btn--sm" onClick={onClose}>나중에 확인</button>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="erut-btn erut-btn--default erut-btn--sm" onClick={onOpenSettings}>교정 정책 설정 →</button>
            <button className="erut-btn erut-btn--emphasis erut-btn--sm" onClick={onRecalibrateAll} autoFocus>일괄 재교정 ({count}ch)</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// v17.0: 진단/로그 모달 공통 — 필터바 + 시계열 테이블 + CSV export
// 3개 탭(통신·교정 이력·측정 에러)이 columns/rows/filters props만 다르게 재사용.
// v17.0: 인라인 펼침 + '상세 →' 버튼 폐기. 수치 기반 raw data만 표시.
// 에러 코드 체계 상세: dev_handoff/Error_Code_Spec_v1.0.md (v2.0 정합)
function DiagLogFilterBar({ period, setPeriod, kind, setKind, kindOptions, search, setSearch, searchPlaceholder }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "160px 200px 1fr", gap: 8, marginBottom: 10 }}>
      <select className="erut-field" value={period} onChange={(e) => setPeriod(e.target.value)} style={{ width: "100%" }}>
        <option value="today">오늘</option><option value="7d">최근 7일</option><option value="30d">최근 30일</option><option value="custom">사용자 정의...</option>
      </select>
      <select className="erut-field" value={kind} onChange={(e) => setKind(e.target.value)} style={{ width: "100%" }}>
        {kindOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <input className="erut-field" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={searchPlaceholder} style={{ width: "100%" }}/>
    </div>
  );
}

// v17.0: 인라인 펼침 제거 → 단순 시계열 테이블만
function DiagLogTable({ columns, rows, getKey }) {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse", font: "400 12px/1.4 var(--font-kr)" }}>
      <thead>
        <tr style={{ borderTop: "1px solid var(--border-medium)", borderBottom: "1px solid var(--border-medium)", textAlign: "left", color: "var(--content-low)", fontWeight: 700 }}>
          {columns.map(c => (
            <th key={c.key} style={{ padding: "8px 6px", width: c.width, textAlign: c.align || "left" }}>{c.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => {
          const key = getKey ? getKey(r) : i;
          return (
            <tr key={key} style={{ borderBottom: "1px solid var(--border-low)" }}>
              {columns.map(c => (
                <td key={c.key} style={{ padding: "8px 6px", textAlign: c.align || "left", ...(c.cellStyle || {}) }}>
                  {c.render ? c.render(r) : r[c.key]}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

// ─────────────────────── 탭 #1: 통신 로그 (v17.0 신규 — 3구간 통합) ───────────────────────
function DiagCommLog({ projectScope = false }) {
  const [period, setPeriod] = $s("7d");
  const [kind, setKind] = $s("all");
  const [search, setSearch] = $s("");

  // mock — Error_Code_Spec_v2.0 카탈로그 정합 (E5xx/E6xx/E7xx). board: [1] 진입 시 어느 MC보드 로그인지 식별.
  const allRows = [
    { id: 1, ts: "06-09 10:42:18.412", board: "MCuF-001", link: "probe-mc", latency: 3.2,  packetLoss: 0.0,  dataRate: 2048, status: "ok" },
    { id: 2, ts: "06-09 10:42:18.456", board: "MCuF-001", link: "mc-pc",    latency: 12,   packetLoss: 0.2,  dataRate: 2043, status: "ok" },
    { id: 3, ts: "06-09 10:42:18.789", board: "MCuF-002", link: "pc-mqtt",  latency: 38,   packetLoss: 0.0,  dataRate: 2048, status: "ok" },
    { id: 4, ts: "06-08 14:12:03.220", board: "MCuF-002", link: "mc-pc",    latency: 5200, packetLoss: 12.4, dataRate: 1792, status: "warn" },
    { id: 5, ts: "06-08 09:32:11.052", board: "MCuF-003", link: "pc-mqtt",  latency: null, packetLoss: 100,  dataRate: 0,    status: "error" },
  ];

  const linkLabel = (l) => l === "probe-mc" ? "탐촉자 ↔ MC" : l === "mc-pc" ? "MC ↔ 미니 PC" : "미니 PC ↔ 서버 MQTT";
  const statusColor = (s) => s === "ok" ? "var(--system-success)" : s === "warn" ? "var(--system-caution)" : "var(--system-error)";
  const statusLabel = (s) => s === "ok" ? "정상" : s === "warn" ? "Timeout · 재연결" : "연결 끊김";

  const filtered = allRows.filter(r => {
    if (kind !== "all" && r.link !== kind) return false;
    if (search && !(r.ts + " " + linkLabel(r.link)).toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const numCol = (key, label, width) => ({ key, label, width, align: "right", render: (r) => {
    const v = r[key];
    if (v == null || v === "—") return <span style={{ color: "var(--system-error)", fontVariantNumeric: "tabular-nums", fontWeight: 700 }}>—</span>;
    const isWarn = (key === "latency" && v > 1000) || (key === "packetLoss" && v > 1);
    const isErr = r.status === "error";
    return <span style={{ color: isErr ? "var(--system-error)" : isWarn ? "var(--system-caution)" : "var(--content-medium)", fontVariantNumeric: "tabular-nums", fontWeight: (isWarn || isErr) ? 700 : 400 }}>{typeof v === "number" ? v.toLocaleString() : v}</span>;
  }});

  const columns = [
    { key: "ts", label: "시각", width: 150, cellStyle: { color: "var(--content-medium)", fontVariantNumeric: "tabular-nums" } },
    ...(projectScope ? [{ key: "board", label: "MC보드", width: 110, render: (r) => <span style={{ color: "var(--content-high)", fontWeight: 700 }}>{r.board}</span> }] : []),
    { key: "link", label: "구간", width: 170, render: (r) => <span style={{ color: "var(--content-high)", fontWeight: 700 }}>{linkLabel(r.link)}</span> },
    numCol("latency", "지연 (ms)", 100),
    numCol("packetLoss", "패킷 손실 (%)", 110),
    numCol("dataRate", "데이터율 (msg/s)", 140),
    { key: "status", label: "상태", render: (r) => <span style={{ color: statusColor(r.status), fontWeight: 700 }}>{statusLabel(r.status)}</span> },
  ];

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
        <h3 style={{ font: "700 16px/1.2 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-high)", margin: 0 }}>통신 로그 <span style={{ font: "400 11px/1 var(--font-kr)", color: "var(--content-low)" }}>({filtered.length}건)</span></h3>
        <button className="erut-btn erut-btn--default erut-btn--sm">CSV 내보내기 ↓</button>
      </div>
      <DiagLogFilterBar
        period={period} setPeriod={setPeriod}
        kind={kind} setKind={setKind}
        kindOptions={[
          { value: "all", label: "전체 구간" },
          { value: "probe-mc", label: "탐촉자 ↔ MC" },
          { value: "mc-pc", label: "MC ↔ 미니 PC" },
          { value: "pc-mqtt", label: "미니 PC ↔ 서버 MQTT" },
        ]}
        search={search} setSearch={setSearch}
        searchPlaceholder="구간·채널·코드로 검색"
      />
      <DiagLogTable columns={columns} rows={filtered} getKey={(r) => r.id}/>
    </>
  );
}

// ─────────────────────── 탭: 측정 로그 (시각·채널·Amp·ToF·두께 raw) ───────────────────────
// 측정값 raw 로그. 측정 에러(E1xx)는 알림 센터로 전달 — 본 탭은 에러 코드 열 없음.
function DiagMeasErrorLog({ projectScope = false }) {
  const [period, setPeriod] = $s("7d");
  const [kind, setKind] = $s("all");
  const [search, setSearch] = $s("");

  // mock — Error_Code_Spec_v2.0 (E1xx 측정). board: [1] 진입 시 MC보드 식별.
  const allRows = [
    { id: 1, ts: "06-09 10:42:18.412", board: "MCuF-001", channel: 22, amp: 98.4, tof: 3.32, thickness: 9.84, code: "E101", codeMsg: "ADC saturation", ampTone: "error" },
    { id: 2, ts: "06-09 10:15:02.108", board: "MCuF-002", channel: 49, amp: 8.2,  tof: null, thickness: null, code: "E115", codeMsg: "신호 검출 실패 (부착력 저하)", ampTone: "caution" },
    { id: 3, ts: "06-09 09:58:31.022", board: "MCuF-002", channel: 62, amp: 0.0,  tof: null, thickness: null, code: "E120", codeMsg: "채널 미연결", ampTone: "error" },
    { id: 4, ts: "06-08 17:21:09.654", board: "MCuF-003", channel: 4,  amp: 94.0, tof: 2.64, thickness: 7.8, code: "E108", codeMsg: "Amp Threshold 초과 (Critical)", ampTone: "caution" },
  ];

  const filtered = allRows.filter(r => {
    if (kind !== "all") {
      const range = kind === "1-24" ? [1, 24] : kind === "25-48" ? [25, 48] : kind === "49-64" ? [49, 64] : null;
      if (range && (r.channel < range[0] || r.channel > range[1])) return false;
    }
    if (search && !(("CH " + r.channel)).toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const numCell = (v, tone, suf) => {
    if (v == null) return <span style={{ color: "var(--system-error)", fontVariantNumeric: "tabular-nums", fontWeight: 700 }}>—</span>;
    const color = tone === "error" ? "var(--system-error)" : tone === "caution" ? "var(--system-caution)" : "var(--content-medium)";
    return <span style={{ color, fontVariantNumeric: "tabular-nums", fontWeight: tone ? 700 : 400 }}>{v}{suf || ""}</span>;
  };

  const columns = [
    { key: "ts", label: "시각", width: 150, cellStyle: { color: "var(--content-medium)", fontVariantNumeric: "tabular-nums" } },
    ...(projectScope ? [{ key: "board", label: "MC보드", width: 110, render: (r) => <span style={{ color: "var(--content-high)", fontWeight: 700 }}>{r.board}</span> }] : []),
    { key: "channel", label: "채널", width: 80, render: (r) => <span style={{ color: "var(--content-high)", fontWeight: 700 }}>CH {String(r.channel).padStart(2, "0")}</span> },
    { key: "amp", label: "Amp (% FSH)", width: 110, align: "right", render: (r) => numCell(r.amp, r.ampTone) },
    { key: "tof", label: "ToF (μs)", width: 100, align: "right", render: (r) => numCell(r.tof, r.tof == null ? "error" : null) },
    { key: "thickness", label: "두께 (mm)", width: 100, align: "right", render: (r) => numCell(r.thickness, r.thickness == null ? "error" : null) },
  ];

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
        <h3 style={{ font: "700 16px/1.2 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-high)", margin: 0 }}>측정 로그 <span style={{ font: "400 11px/1 var(--font-kr)", color: "var(--content-low)" }}>({filtered.length}건)</span></h3>
        <button className="erut-btn erut-btn--default erut-btn--sm">CSV 내보내기 ↓</button>
      </div>
      <DiagLogFilterBar
        period={period} setPeriod={setPeriod}
        kind={kind} setKind={setKind}
        kindOptions={[
          { value: "all", label: "전체 채널" },
          { value: "1-24", label: "CH 01–24" },
          { value: "25-48", label: "CH 25–48" },
          { value: "49-64", label: "CH 49–64" },
        ]}
        search={search} setSearch={setSearch}
        searchPlaceholder="채널·에러 코드로 검색"
      />
      <DiagLogTable columns={columns} rows={filtered} getKey={(r) => r.id}/>
    </>
  );
}

// =================== Modal · [8] 환경 설정 (v10.0 신규 — 메뉴바 [설정] + 툴바 gear 공통 진입) ===================
window.SettingsModal = function SettingsModal({ onClose }) {
  // v19.0: 'pc' 카테고리 신설 — 신설 강조로 기본 활성. v27: 자동 저장 카테고리 삭제(passive 기능화).
  const [cat, setCat] = $s("general"); // general / pc (단축키·보고서 기본값·교정 정책 탭 삭제)
  const cats = [
    { id: "general",     label: "일반" },
    { id: "pc",          label: "PC 정보" },
  ];
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(10,28,60,0.55)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: 1100, maxHeight: "90vh", background: "var(--surface-base)", border: "1px solid var(--border-medium)", display: "flex", flexDirection: "column" }}>
        {/* 헤더 (titlebar 컬러 통일) */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 18px", borderBottom: "1px solid var(--border-medium)", background: "var(--content-medium)" }}>
          <div style={{ font: "700 16px/1.2 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-inverse)" }}>설정</div>
          <button onClick={onClose} aria-label="닫기" style={{ background: "transparent", border: "none", color: "var(--content-inverse)", cursor: "pointer", padding: 4, display: "inline-flex", alignItems: "center", justifyContent: "center" }}><window.EIcon.Close size={14}/></button>
        </div>
        {/* 본문 (좌: 카테고리 사이드바 / 우: 콘텐츠) */}
        <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", minHeight: 480 }}>
          <div style={{ background: "var(--surface-subtle-1)", borderRight: "1px solid var(--border-medium)", padding: "8px 0" }}>
            {cats.map(c => (
              <button key={c.id} onClick={() => setCat(c.id)} style={{
                display: "flex", alignItems: "center", width: "100%",
                padding: "10px 16px", textAlign: "left",
                font: "700 12px/1 var(--font-kr)", letterSpacing: ".02em",
                color: cat === c.id ? "var(--content-emphasis)" : "var(--content-medium)",
                background: cat === c.id ? "linear-gradient(rgba(34,133,239,0.10),rgba(34,133,239,0.10)), var(--surface-base)" : "transparent",
                border: "none", borderLeft: cat === c.id ? "3px solid var(--brand-primary)" : "3px solid transparent",
                cursor: "pointer"
              }}>
                {c.label}
              </button>
            ))}
          </div>
          <div style={{ padding: "18px 24px", overflowY: "auto" }}>
            {cat === "general"     && <SettingsGeneral/>}
            {cat === "pc"          && <SettingsPcInfo/>}
          </div>
        </div>
        {/* 푸터 — 좌측: 초기화 / 우측: 취소·적용 */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 18px", borderTop: "1px solid var(--border-medium)", background: "var(--surface-subtle-1)" }}>
          <button className="erut-btn erut-btn--subtle erut-btn--sm" onClick={onClose}>기본값으로 초기화</button>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="erut-btn erut-btn--default erut-btn--sm" onClick={onClose}>취소</button>
            <button className="erut-btn erut-btn--emphasis erut-btn--sm" onClick={onClose}>적용</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// =================== v18.0 보고서 출력 다이얼로그 (채널 측정 보고서 — 현장 데이터 dump) ===================
// 합의: 감육 등급 판정 미포함. 채널별 A4 1장. 탐촉자 스펙 + 교정 이력 + A-scan + 적용 표준.
// 진입: [2] DeviceDetail MC보드 정보 옆 "보고서 출력" 버튼 (v18.1) / 메뉴바 [파일] → "보고서 출력..." / Ctrl+P
// v18.1: 채널 → 검사 대상 매핑 helper, 64채널 전체 표시, 검사 대상명 서브텍스트, 좌/우 chevron + 키보드 ←/→
window.getChannelTarget = function getChannelTarget(chId) {
  // MC보드 64채널의 검사 대상 매핑 — mockup용. 실제론 TB_CHANNEL_PROBE.ItemID로 join
  const n = parseInt(chId.replace("ch", ""), 10);
  if (n >= 1  && n <= 24) return "PIPE-A-204";
  if (n >= 25 && n <= 48) return "TANK-B-101";
  if (n >= 49 && n <= 64) return "VESSEL-C-301";
  return null;
};

window.ReportExportDialog = function ReportExportDialog({ deviceId, initialChannel, onClose, onExport }) {
  const device = (window.MOCK.devices || []).find(d => d.id === deviceId) || (window.MOCK.devices && window.MOCK.devices[0]) || { id: "MCuF-001", totalCh: 64 };
  // v18.1: MC보드 단위 진입 — 64채널 전체 표시 (검사 대상별 그룹)
  const allChannels = window.MOCK.sensors;
  const [selected, setSelected] = $s(initialChannel ? [initialChannel] : (allChannels[0] ? [allChannels[0].id] : []));
  const [previewCh, setPreviewCh] = $s(initialChannel || (allChannels[0] && allChannels[0].id));
  const [includeSign, setIncludeSign] = $s(true);

  const toggleCh = (chId) => {
    setSelected(selected.includes(chId) ? selected.filter(c => c !== chId) : [...selected, chId]);
    setPreviewCh(chId);
  };
  const allSelected = selected.length === allChannels.length;
  const selectAll = () => setSelected(allSelected ? [] : allChannels.map(c => c.id));

  const previewSensor = allChannels.find(s => s.id === previewCh) || allChannels[0];
  const previewTargetId = previewSensor ? window.getChannelTarget(previewSensor.id) : null;
  const previewTarget = previewTargetId && window.MOCK.targets.find(t => t.id === previewTargetId);
  const previewStandard = previewTargetId && window.MOCK.targetStandards
    ? (window.MOCK.targetStandards[previewTargetId] || "표준 미지정")
    : "표준 미지정";

  // v18.1: 미리보기 chevron — 선택된 채널들 사이만 이동
  const previewIdx = selected.indexOf(previewCh);
  const goPrev = () => {
    if (selected.length === 0) return;
    const i = previewIdx <= 0 ? selected.length - 1 : previewIdx - 1;
    setPreviewCh(selected[i]);
  };
  const goNext = () => {
    if (selected.length === 0) return;
    const i = previewIdx >= selected.length - 1 ? 0 : previewIdx + 1;
    setPreviewCh(selected[i]);
  };
  React.useEffect(() => {
    const handler = (e) => {
      if (e.key === "ArrowLeft")  { e.preventDefault(); goPrev(); }
      if (e.key === "ArrowRight") { e.preventDefault(); goNext(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selected, previewCh]);

  const footer = (
    <>
      <button className="erut-btn erut-btn--default erut-btn--m" onClick={onClose}>취소</button>
      <button
        className="erut-btn erut-btn--emphasis erut-btn--m"
        disabled={selected.length === 0}
        onClick={() => onExport && onExport({ deviceId: device.id, channels: selected, includeSign })}
      >PDF 출력 ({selected.length} 장)</button>
    </>
  );

  return (
    <window.Modal title={`보고서 출력 — ${device.id} (${allChannels.length} ch)`} onClose={onClose} footer={footer} width={1200}>
      {/* v18.2: minHeight 580 → 640 — A4 미리보기(width 420 → height 594) + 헤더(~28) 한 페이지 표시 */}
      <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: 20, minHeight: 640 }}>
        {/* 좌측 — 채널 선택 + 옵션 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14, minHeight: 0 }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <div style={{ font: "700 12px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-medium)" }}>출력 채널 선택 ({selected.length} / {allChannels.length})</div>
              <button onClick={selectAll} style={{ font: "700 11px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--brand-primary)", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                {allSelected ? "전체 해제" : "전체 선택"}
              </button>
            </div>
            <div style={{ border: "1px solid var(--border-medium)", background: "var(--surface-base)", maxHeight: 360, overflow: "auto" }}>
              {allChannels.map(s => {
                const isOn = selected.includes(s.id);
                const isPreview = s.id === previewCh;
                const chTarget = window.getChannelTarget(s.id);
                return (
                  <div
                    key={s.id}
                    onClick={() => toggleCh(s.id)}
                    style={{
                      display: "flex", alignItems: "center", gap: 8,
                      padding: "8px 12px",
                      borderBottom: "1px solid var(--border-low)",
                      background: isPreview ? "linear-gradient(rgba(34,133,239,0.08),rgba(34,133,239,0.08)), var(--surface-base)" : "var(--surface-base)",
                      cursor: "pointer",
                    }}
                  >
                    <span className={"erut-cb__box" + (isOn ? " is-on" : "")}/>
                    <span style={{ font: "700 12px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-high)" }}>{s.id.toUpperCase()}</span>
                    <span style={{ font: "400 11px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)", marginLeft: "auto" }}>{chTarget || "—"}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 옵션 */}
          <div>
            <div style={{ font: "700 12px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-medium)", marginBottom: 6 }}>출력 옵션</div>
            <div style={{ border: "1px solid var(--border-medium)", background: "var(--surface-base)", padding: "12px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ font: "400 12px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-high)" }}>적용 표준</span>
                <span style={{ font: "700 12px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-emphasis)" }}>채널별 다름</span>
              </div>
              <div style={{ font: "400 10px/1.4 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)" }}>* 각 채널의 검사 대상에 등록된 표준이 자동 반영. [6] 검사 대상 편집에서 변경.</div>
              <div style={{ height: 1, background: "var(--border-low)" }}/>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }} onClick={() => setIncludeSign(!includeSign)}>
                <span className={"erut-cb__box" + (includeSign ? " is-on" : "")}/>
                <span style={{ font: "400 12px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-high)" }}>서명란 포함</span>
              </label>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ font: "400 12px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-high)" }}>방향</span>
                <span style={{ font: "700 12px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)" }}>세로 (A4)</span>
              </div>
            </div>
          </div>
        </div>

        {/* 우측 — A4 미리보기 + v18.1 좌/우 chevron */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, minHeight: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ font: "700 12px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-medium)" }}>미리보기 — {previewSensor && previewSensor.id.toUpperCase()}</div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <button onClick={goPrev} disabled={selected.length < 2} title="이전 채널 (←)" style={{ background: "none", border: "1px solid var(--border-medium)", padding: "4px 6px", cursor: selected.length < 2 ? "default" : "pointer", display: "inline-flex", alignItems: "center", color: "var(--content-medium)", opacity: selected.length < 2 ? 0.4 : 1 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="15 18 9 12 15 6"/></svg>
              </button>
              <span style={{ font: "700 11px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-medium)" }}>{previewIdx >= 0 ? previewIdx + 1 : 0} / {selected.length || 0}</span>
              <button onClick={goNext} disabled={selected.length < 2} title="다음 채널 (→)" style={{ background: "none", border: "1px solid var(--border-medium)", padding: "4px 6px", cursor: selected.length < 2 ? "default" : "pointer", display: "inline-flex", alignItems: "center", color: "var(--content-medium)", opacity: selected.length < 2 ? 0.4 : 1 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </div>
          </div>
          <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "flex-start", overflow: "auto" }}>
            <div style={{ width: 420 }}>
              <ReportA4Preview target={previewTarget} sensor={previewSensor} standard={previewStandard} includeSign={includeSign} deviceId={device.id}/>
            </div>
          </div>
        </div>
      </div>
    </window.Modal>
  );
};

// A4 미리보기 단일 페이지 — 채널 측정 보고서 (v18.0 / v18.1: 측정 위치 행 → 채널 ID 행)
function ReportA4Preview({ target, sensor, standard, includeSign, deviceId }) {
  if (!sensor) return null;
  const today = new Date().toISOString().slice(0, 10);
  const lastCal = (window.MOCK.lastCalibrationDate && window.MOCK.lastCalibrationDate[sensor.id]) || "—";
  const cycleDays = (window.MOCK.channelCycleDays && window.MOCK.channelCycleDays[sensor.id])
    || (window.MOCK.calibrationPolicy && window.MOCK.calibrationPolicy.defaultCycleDays) || 180;
  const targetLabel = target ? `${target.name} · ${target.desc}` : "검사 대상 미지정";
  return (
    <div className="erut-report-a4">
      <div className="erut-report-a4__header">
        <div className="erut-report-a4__title">초음파 측정 데이터 보고서</div>
        <div className="erut-report-a4__subtitle">
          {target ? target.name : "—"} · {sensor.id.toUpperCase()} · {today}
        </div>
      </div>
      <div className="erut-report-a4__section">
        <div className="erut-report-a4__section-title">1. 적용 표준 / 검사 대상</div>
        {/* v19.0: 측정 PC 행 추가 (ASNT 추적성) */}
        <table className="erut-report-a4__table">
          <tbody>
            <tr><td>적용 표준</td><td>{standard}</td></tr>
            <tr><td>검사 대상</td><td>{targetLabel}</td></tr>
            <tr><td>채널 ID</td><td>{sensor.id.toUpperCase()} ({deviceId || "MCuF-001"})</td></tr>
            <tr><td>측정 PC</td><td>{(window.MOCK.pcInfo && window.MOCK.pcInfo.alias) || "—"} ({(window.MOCK.pcInfo && window.MOCK.pcInfo.uuid || "").slice(0, 8) + "…"})</td></tr>
          </tbody>
        </table>
      </div>
      <div className="erut-report-a4__section">
        <div className="erut-report-a4__section-title">2. 탐촉자 스펙</div>
        <table className="erut-report-a4__table">
          <tbody>
            <tr><td>모델 / S/N</td><td>PXT-2024-{sensor.id.replace("ch","").padStart(3,"0")}</td></tr>
            <tr><td>주파수</td><td>5 MHz</td></tr>
            <tr><td>직경 / 종류</td><td>10 mm · 직선</td></tr>
            <tr><td>Wedge 각도</td><td>90° (수직)</td></tr>
          </tbody>
        </table>
      </div>
      <div className="erut-report-a4__section">
        <div className="erut-report-a4__section-title">3. 교정 이력</div>
        <table className="erut-report-a4__table">
          <tbody>
            <tr><td>교정일</td><td>{lastCal}</td></tr>
            <tr><td>교정 주기</td><td>{cycleDays} 일</td></tr>
            <tr><td>교정 시험편</td><td>IIW V1 (표준시험편)</td></tr>
            <tr><td>음속 / 영점</td><td>5,920 m/s · 0.42 μs</td></tr>
            <tr><td>Gain / Gate</td><td>28 dB · A 2.5~10.5 μs / 80 %</td></tr>
          </tbody>
        </table>
      </div>
      <div className="erut-report-a4__section">
        <div className="erut-report-a4__section-title">4. 측정 결과 (A-scan)</div>
        <div className="erut-report-a4__ascan">
          <ReportAscanThumb sensor={sensor}/>
        </div>
        <table className="erut-report-a4__table" style={{ marginTop: 6 }}>
          <tbody>
            <tr>
              <td>Amp</td><td>{sensor.amp} % FSH</td>
            </tr>
            <tr>
              <td>ToF</td><td>{sensor.tof} μs</td>
            </tr>
            <tr>
              <td>환산 두께</td><td>{sensor.thickness} mm</td>
            </tr>
          </tbody>
        </table>
      </div>
      {includeSign && (
        <div className="erut-report-a4__footer">
          <div>
            <div style={{ color: "var(--content-low)", marginBottom: 2 }}>검사자</div>
            <div className="erut-report-a4__sign">서명</div>
          </div>
          <div>
            <div style={{ color: "var(--content-low)", marginBottom: 2 }}>일자 · 시간</div>
            <div className="erut-report-a4__sign">{today}</div>
          </div>
        </div>
      )}
    </div>
  );
}

// A-scan 작은 미리보기 (Gate overlay 포함)
function ReportAscanThumb({ sensor }) {
  // 단순 시뮬: 메인 펄스 + Gate 위치의 echo
  const w = 360, h = 110;
  const noise = Array.from({ length: 80 }, (_, i) => {
    const x = (i / 79) * w;
    const baseline = h - 18;
    // main pulse spike at x=20
    if (i < 6) return [x, baseline - Math.exp(-i * 0.5) * 50 * (i % 2 === 0 ? 1 : -1)];
    // Gate echo around 30~50% — amp 기반
    const gateCenter = 35;
    if (i > gateCenter - 4 && i < gateCenter + 4) {
      const offset = i - gateCenter;
      return [x, baseline - Math.exp(-offset * offset * 0.3) * (sensor.amp || 24) * 0.8 * (offset % 2 === 0 ? 1 : -1)];
    }
    return [x, baseline + (Math.sin(i * 0.7) * 2)];
  });
  const path = noise.map(([x, y], i) => (i === 0 ? "M" : "L") + x.toFixed(1) + "," + y.toFixed(1)).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height="100%" preserveAspectRatio="none">
      {/* Gate 영역 (A) */}
      <rect x={w * 0.35} y={6} width={w * 0.15} height={h - 14} fill="rgba(34,133,239,0.08)" stroke="var(--brand-primary)" strokeWidth="0.5" strokeDasharray="2,2"/>
      {/* Threshold line */}
      <line x1={w * 0.35} y1={h * 0.5} x2={w * 0.5} y2={h * 0.5} stroke="var(--system-caution)" strokeWidth="0.8" strokeDasharray="3,2"/>
      {/* baseline */}
      <line x1="0" y1={h - 18} x2={w} y2={h - 18} stroke="var(--border-low)" strokeWidth="0.5"/>
      {/* signal */}
      <path d={path} fill="none" stroke="var(--content-high)" strokeWidth="1"/>
      {/* axis labels */}
      <text x="2" y={h - 4} fill="var(--content-low)" fontSize="7" fontFamily="var(--font-kr)">0 μs</text>
      <text x={w - 28} y={h - 4} fill="var(--content-low)" fontSize="7" fontFamily="var(--font-kr)">20 μs</text>
      <text x={w * 0.37} y="14" fill="var(--brand-primary)" fontSize="7" fontFamily="var(--font-kr)" fontWeight="700">Gate A</text>
    </svg>
  );
}

function SettingsRow({ label, hint, children }) {
  return (
    <>
      <div style={{ font: "700 12px/1.2 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-medium)", paddingTop: 8 }}>{label}</div>
      <div>
        {children}
        {hint && <div style={{ font: "400 10px/1.3 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)", marginTop: 4 }}>{hint}</div>}
      </div>
    </>
  );
}

function SettingsSectionHeader({ title, desc }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <h3 style={{ font: "700 16px/1.2 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-high)", margin: "0 0 4px" }}>{title}</h3>
      <p style={{ font: "400 11px/1.4 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)", margin: 0 }}>{desc}</p>
    </div>
  );
}

function SettingsGeneral() {
  const [sendCycle, setSendCycle] = $s(30);
  return (
    <>
      <SettingsSectionHeader title="일반" desc="앱의 기본 동작과 표시 방식을 설정합니다."/>
      <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: "16px 24px", alignItems: "start" }}>
        <SettingsRow label="테마" hint="v1.0은 라이트만 지원. 다크 테마는 v2.0 예정.">
          <select className="erut-field" defaultValue="light" style={{ width: 240 }}>
            <option value="light">라이트 (기본)</option>
          </select>
        </SettingsRow>
        <SettingsRow label="언어" hint="영문은 v1.0 Beta. 단위 변환(mm ↔ inch)은 v2.0 예정.">
          <select className="erut-field" defaultValue="ko" style={{ width: 240 }}>
            <option value="ko">한국어</option>
            <option value="en">English (Beta)</option>
          </select>
        </SettingsRow>
        <SettingsRow label="데이터 송신 주기" hint="MC보드가 측정 데이터를 서버로 전송하는 간격. 감육은 장기 진행이라 짧을 필요 없음. 측정 주파수(PRF)와는 별개.">
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input className="erut-field" type="number" min="1" step="1" value={sendCycle} onChange={(e) => setSendCycle(parseInt(e.target.value, 10) || 0)} style={{ width: 120 }}/>
            <span style={{ font: "700 12px/1 var(--font-kr)", color: "var(--content-medium)" }}>분</span>
          </div>
        </SettingsRow>
        {/* #7: 보고서 저장 경로 — [18] 채널 측정 보고서(PDF) 기본 저장 위치 */}
        <SettingsRow label="보고서 저장 경로" hint="[18] 채널 측정 보고서(PDF)가 저장되는 기본 위치.">
          <div style={{ display: "flex", gap: 8 }}>
            <input className="erut-field" defaultValue="C:\\ERUT_Reports" style={{ flex: 1 }}/>
            <button className="erut-btn erut-btn--default erut-btn--sm">변경...</button>
          </div>
        </SettingsRow>
      </div>
    </>
  );
}

// v19.0: PC 정보 카테고리 — 미니 PC 자산 관리 (alias 입력 + UUID readonly + 자동 메타 + 상태바 표시 옵션)
function SettingsPcInfo() {
  const pc = (window.MOCK && window.MOCK.pcInfo) || {};
  const [alias, setAlias] = $s(pc.alias || "");
  const copyUuid = () => {
    if (navigator.clipboard && pc.uuid) navigator.clipboard.writeText(pc.uuid);
  };
  return (
    <>
      <SettingsSectionHeader title="PC 정보" desc="미니 PC를 탐촉자·MC 보드와 동일하게 자산 관리. 사용자는 별칭(alias)만 입력, UUID와 자동 메타는 시스템이 수집. 다중 PC 운영·MQTT 라우팅·보고서 추적성·장애 진단의 기반."/>
      <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: "16px 24px", alignItems: "start" }}>
        <SettingsRow label="PC 별칭 (alias)" hint="언제든 변경 가능. 보고서·진단 로그에 자동 반영. 한글 가능.">
          <input className="erut-field" value={alias} onChange={(e) => setAlias(e.target.value)} style={{ width: 320 }}/>
        </SettingsRow>

        <SettingsRow label="PC 고유키" hint="첫 실행 시 1회 자동 생성. OS 재설치 / PC 교체 시 새로 생성됨. 사용자 수정 불가 (서버 식별자).">
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <input className="erut-field" value={pc.uuid || ""} readOnly style={{ width: 340, fontFamily: "'Consolas', monospace", fontSize: 11, background: "var(--surface-subtle-1)", color: "var(--content-medium)" }}/>
            <button className="erut-btn erut-btn--default erut-btn--sm" onClick={copyUuid} title="PC 고유키 복사" style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="9" y="9" width="13" height="13" rx="1"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              복사
            </button>
          </div>
        </SettingsRow>

        <SettingsRow label="자동 수집 메타" hint="앱 시작 시마다 자동 갱신. 사용자 수정 불가. 보안 위험 시 MAC 주소 항목은 [숨김] 가능.">
          <div style={{ background: "var(--surface-subtle-1)", border: "1px solid var(--border-low)", padding: "12px 14px", display: "grid", gridTemplateColumns: "120px 1fr", gap: "6px 12px", font: "400 11px/1.4 var(--font-kr)", letterSpacing: ".02em" }}>
            <div style={{ color: "var(--content-low)", fontWeight: 700 }}>호스트명</div>     <div style={{ color: "var(--content-high)" }}>{pc.hostname || "—"}</div>
            <div style={{ color: "var(--content-low)", fontWeight: 700 }}>OS</div>          <div style={{ color: "var(--content-high)" }}>{pc.os || "—"}</div>
            <div style={{ color: "var(--content-low)", fontWeight: 700 }}>ERUT 버전</div>   <div style={{ color: "var(--content-high)" }}>{pc.erutVersion || "—"}</div>
            <div style={{ color: "var(--content-low)", fontWeight: 700 }}>IP 주소 (LAN)</div><div style={{ color: "var(--content-high)" }}>{pc.ipLan || "—"}</div>
            <div style={{ color: "var(--content-low)", fontWeight: 700 }}>MAC 주소</div>    <div style={{ color: "var(--content-high)", fontFamily: "'Consolas', monospace" }}>{pc.macAddress || "—"} <span style={{ color: "var(--content-low)", fontWeight: 400, marginLeft: 6 }}>({pc.macInterface || "—"})</span></div>
            <div style={{ color: "var(--content-low)", fontWeight: 700 }}>최초 등록일</div>  <div style={{ color: "var(--content-high)" }}>{pc.firstRegistered || "—"}</div>
          </div>
        </SettingsRow>
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
//   - mc:    MC보드 설정 (목록 / 추가 / 편집 sub-view)
//   - mqtt:  MQTT 설정
//   - probe: 탐촉자 설정 ([4-3-1] 교정 마법사 트리거)

// ───── Calibration Wizard Modal ─────
// v9.18 (NDT 1.4): mode "new" (신규 등록) / "recalibration" (재교정 — 다채널 일괄)
// v14.0: mode="new" 단일 채널 wizard는 사용 폐기 (commission edit 모드로 통합). mode="recalibration"만 활성. new 분기는 향후 정리 wave에서 제거.
window.CalibrationWizard = function CalibrationWizard({ onClose, mode = "recalibration", channelList = [], onComplete }) {
  const isRecal = mode === "recalibration";
  // v13.0: 재교정 모드 — 채널 정렬 (미교정 먼저 → 만료 경과일 내림차순). new 모드는 단일.
  const sortedChannels = isRecal ? (() => {
    const dates = (window.MOCK && window.MOCK.lastCalibrationDate) || {};
    const today = new Date("2026-06-10");
    const daysAgo = (id) => {
      const d = dates[id];
      if (!d) return Infinity; // 미교정 = 최우선
      return Math.floor((today - new Date(d)) / 86400000);
    };
    return [...channelList].sort((a, b) => daysAgo(b) - daysAgo(a));
  })() : channelList;

  // v13.1: 채널별 state 분리 — step·completed + 우측 참조 블록 정보(refBlock/refThickness/refMaterial/repeats/batch) + dirty 플래그
  // dirty: 우측 입력이 한 번이라도 변경되었는지 (변경 시 카드 상태 '진행중'으로 자동 전환)
  const DEFAULT_CH_STATE = {
    step: 1,
    completed: [false, false, false],
    refBlock: "IIW V1 (25 mm)",
    refThickness: 25.0,
    refMaterial: "탄소강 (S355)",
    repeats: 5,
    batch: true,
    dirty: false,
  };
  const initialChStates = isRecal
    ? Object.fromEntries(sortedChannels.map(id => [id, { ...DEFAULT_CH_STATE }]))
    : { CH09: { ...DEFAULT_CH_STATE } };
  const [chStates, setChStates] = $s(initialChStates);
  const [focusCh, setFocusCh] = $s(isRecal ? sortedChannels[0] : "CH09");
  const focusState = chStates[focusCh] || DEFAULT_CH_STATE;
  const step = focusState.step;
  // 채널별 state 갱신 헬퍼 — 우측 입력 변경 시 자동으로 dirty=true
  const updateFocusChState = (patch, markDirty = false) =>
    setChStates(s => ({ ...s, [focusCh]: { ...s[focusCh], ...patch, ...(markDirty ? { dirty: true } : {}) } }));
  const setStep = (n) => updateFocusChState({ step: typeof n === "function" ? n(focusState.step) : n });
  const markStepComplete = (stepN) => setChStates(s => {
    const c = [...s[focusCh].completed];
    c[stepN - 1] = true;
    return { ...s, [focusCh]: { ...s[focusCh], completed: c } };
  });
  const isChannelCompleted = (id) => (chStates[id]?.completed || []).every(Boolean);
  // v13.1: '진행중' = step 진행 / 단계 완료 / 우측 입력 변경 중 하나라도 발생
  const isChannelStarted   = (id) => (chStates[id]?.completed || []).some(Boolean) || (chStates[id]?.step || 1) > 1 || !!chStates[id]?.dirty;

  // 우측 입력 값 — focusState에서 derive
  const refBlock     = focusState.refBlock;
  const refThickness = focusState.refThickness;
  const refMaterial  = focusState.refMaterial;
  const repeats      = focusState.repeats;
  const batch        = focusState.batch;
  const setRefBlock     = (v) => updateFocusChState({ refBlock: v }, true);
  const setRefThickness = (v) => updateFocusChState({ refThickness: v }, true);
  const setRefMaterial  = (v) => updateFocusChState({ refMaterial: v }, true);
  const setRepeats      = (v) => updateFocusChState({ repeats: v }, true);
  const setBatch        = (v) => updateFocusChState({ batch: v }, true);
  // v13.0: 부분 완료 confirm 다이얼로그
  const [showPartialConfirm, setShowPartialConfirm] = $s(false);

  const totalCh = isRecal ? sortedChannels.length : 1;
  const completedCount = isRecal ? sortedChannels.filter(isChannelCompleted).length : 0;
  const currentCh = focusCh;

  const stepInfo = {
    1: { title: "영점 (Zero / Wedge Delay)",  desc: "교정 시험편(표준시험편 IIW V1·V2 / STB-A1·A2 또는 비교시험편)에 탐촉자를 접촉하고 [측정 시작] 클릭. 후면 에코의 ToF를 기준으로 wedge delay 자동 계산." },
    2: { title: "음속 (Velocity)",            desc: "기준 두께(25mm)의 후면 에코 ToF로 음속 산출. 영점 완료 후 진행." },
    3: { title: "감도 (Gain)",                desc: "DAC 곡선 작성. ø1.5 SDH (Side-drilled hole) 기준 -6 dB / -12 dB 측정." },
  };

  return (
    <div className="erut-modal__backdrop" onClick={onClose} style={{ background: "rgba(10,28,60,0.15)" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: 1100, maxHeight: 760, background: "var(--surface-base)", border: "1px solid var(--border-medium)", display: "flex", flexDirection: "column" }}>
        {/* v8.8: 헤더 — titlebar 컬러 통일. v13.0: 재교정 헤더에 'N/M 완료' 카운터 */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px", borderBottom: "1px solid var(--border-medium)", background: "var(--content-medium)" }}>
          <div>
            <div style={{ font: "700 16px/1.2 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-inverse)" }}>
              {isRecal ? `정기 재교정 — ${completedCount}/${totalCh} 완료` : "탐촉자 교정 마법사 — CH 09 / 4"}
            </div>
            <div style={{ font: "400 11px/1 var(--font-kr)", letterSpacing: ".02em", color: "rgba(255,255,255,0.7)", marginTop: 4 }}>
              {isRecal ? `현재 작업 중 — ${currentCh.toUpperCase().replace("CH","CH ")} · 좌측 카드 클릭으로 자유 이동 가능` : "PXT-2024-009 · 5 MHz · 신규 등록 후 필수 교정"}
            </div>
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

        {/* 본문 — v13.0 recalibration: 3 col (220px 채널 카드 + 1fr A-scan + 320px 참조 블록) / new: 기존 2 col */}
        <div style={{ flex: 1, padding: "20px 24px", display: "grid", gridTemplateColumns: isRecal ? "220px 1fr 320px" : "1fr 360px", gap: 20, overflowY: "auto" }}>

          {/* v13.0: 재교정 모드 좌측 사이드바 — 채널 카드 리스트 (점프 가능, 마지막 교정일 표시) */}
          {isRecal && (() => {
            const dates = (window.MOCK && window.MOCK.lastCalibrationDate) || {};
            const today = new Date("2026-06-10");
            const daysAgo = (id) => {
              const d = dates[id];
              if (!d) return null;
              return Math.floor((today - new Date(d)) / 86400000);
            };
            const stepIcons = (completed, currentStep) => {
              const names = ["영점", "음속", "감도"];
              return names.map((n, i) => {
                const done = completed[i];
                const cur = currentStep === i + 1;
                return (
                  <span key={n} style={{ color: done ? "var(--system-success)" : cur ? "var(--content-emphasis)" : "var(--content-low)" }}>
                    {n} {done ? "✓" : cur ? "▸" : "–"}
                  </span>
                );
              });
            };
            return (
              <div style={{ display: "flex", flexDirection: "column", gap: 8, overflowY: "auto", minHeight: 0 }}>
                <div style={{ font: "700 11px/1 var(--font-kr)", letterSpacing: "0.08em", color: "var(--content-low)", textTransform: "uppercase", padding: "0 2px 6px", borderBottom: "1px solid var(--border-low)" }}>교정 대상 {totalCh}채널</div>
                {sortedChannels.map(id => {
                  const st = chStates[id] || { step: 1, completed: [false, false, false] };
                  const done = isChannelCompleted(id);
                  const started = isChannelStarted(id);
                  const isFocus = id === focusCh;
                  const da = daysAgo(id);
                  // 상태 분기
                  let badgeLabel, badgeBg, borderColor;
                  if (done) { badgeLabel = "완료"; badgeBg = "var(--system-success)"; borderColor = "var(--system-success)"; }
                  else if (started) { badgeLabel = "진행중"; badgeBg = "var(--brand-primary)"; borderColor = "var(--border-emphasis)"; }
                  else { badgeLabel = "대기"; badgeBg = "var(--surface-disabled)"; borderColor = "var(--border-medium)"; }
                  return (
                    <div
                      key={id}
                      onClick={() => setFocusCh(id)}
                      style={{
                        background: isFocus ? "linear-gradient(rgba(34,133,239,0.10),rgba(34,133,239,0.10)), var(--surface-base)" : "var(--surface-base)",
                        border: "1px solid " + borderColor,
                        borderLeft: isFocus ? "3px solid var(--brand-primary)" : "1px solid " + borderColor,
                        padding: "8px 10px",
                        cursor: "pointer",
                        transition: "background 120ms ease",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                        <span style={{ font: "700 13px/1 var(--font-kr)", letterSpacing: ".02em", color: isFocus ? "var(--content-emphasis)" : "var(--content-high)" }}>
                          {id.toUpperCase().replace("CH", "CH ")}
                        </span>
                        <span style={{ font: "700 9px/1 var(--font-kr)", padding: "2px 6px", background: badgeBg, color: "var(--on-primary)" }}>{badgeLabel}</span>
                      </div>
                      <div style={{ font: "400 10px/1.3 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)", marginBottom: 4 }}>
                        {da === null ? "마지막 교정 — 없음" : `마지막 교정 ${da}일 전`}
                      </div>
                      <div style={{ display: "flex", gap: 6, font: "400 10px/1 var(--font-kr)", letterSpacing: ".02em" }}>
                        {stepIcons(st.completed, st.step)}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}

          {/* 좌측(new 모드) / 중앙(recal): 참조 블록 + A-scan */}
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
                  <option>IIW V1 · ISO 2400 · 25 mm</option><option>IIW V2 · ISO 7963</option><option>STB-A1 · JIS Z 2345</option><option>STB-A2 · JIS Z 2345</option><option>사용자 정의 (비교시험편)</option>
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

        {/* 푸터 — v13.0 recalibration: 다음 step/다음 채널/전체 완료 로직 + 부분 완료 confirm */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 24px", borderTop: "1px solid var(--border-medium)", background: "var(--surface-subtle-1)" }}>
          <div style={{ font: "400 11px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)" }}>
            {isRecal
              ? `${currentCh.toUpperCase().replace("CH","CH ")} · ${stepInfo[step].title.split(" ")[0]} 진행 중`
              : `CH 09 / 4 채널 · ${stepInfo[step].title.split(" ")[0]} 측정 완료 후 ${step < 3 ? ["", "음속", "감도"][step] : "다음 채널"} 단계로 진행`}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className={"erut-btn erut-btn--m " + (step === 1 ? "erut-btn--disabled" : "erut-btn--subtle")} disabled={step === 1} onClick={() => setStep(s => Math.max(1, s - 1))}>이전</button>
            <button className="erut-btn erut-btn--default erut-btn--m" onClick={onClose}>{isRecal ? "취소" : "건너뛰기 (CH 차단)"}</button>
            {isRecal ? (() => {
              // 재교정 모드 — 다음 step / 채널 완료 후 다음 미완료 채널 / 전체 완료
              const allCompleted = completedCount === totalCh;
              if (step < 3) {
                return (
                  <button className="erut-btn erut-btn--emphasis erut-btn--m" onClick={() => { markStepComplete(step); setStep(s => s + 1); }}>
                    다음 — {["", "음속", "감도"][step]}
                  </button>
                );
              }
              // step === 3: 채널 완료 또는 전체 완료
              // 다음 미완료 채널 찾기 (현재 focus 다음부터, 없으면 처음부터)
              const startIdx = sortedChannels.indexOf(focusCh);
              const nextIncomplete = sortedChannels.find((id, i) => i > startIdx && !isChannelCompleted(id))
                                  || sortedChannels.find((id) => id !== focusCh && !isChannelCompleted(id));
              if (nextIncomplete) {
                return (
                  <button className="erut-btn erut-btn--emphasis erut-btn--m" onClick={() => { markStepComplete(3); setFocusCh(nextIncomplete); }}>
                    이 채널 완료 → {nextIncomplete.toUpperCase().replace("CH","CH ")}
                  </button>
                );
              }
              return (
                <button className="erut-btn erut-btn--emphasis erut-btn--m" onClick={() => { markStepComplete(3); if (onComplete) onComplete(); onClose(); }}>
                  전체 재교정 완료 → 측정 시작
                </button>
              );
            })() : step < 3 ? (
              <button className="erut-btn erut-btn--emphasis erut-btn--m" onClick={() => setStep(s => s + 1)}>다음 — {["", "음속", "감도"][step]}</button>
            ) : (
              <button className="erut-btn erut-btn--emphasis erut-btn--m" onClick={() => { if (onComplete) onComplete(); onClose(); }}>교정 완료</button>
            )}
            {/* v13.0: 재교정 — 1개 이상 완료 시 '전체 완료' 별도 버튼. 부분 완료 시 confirm */}
            {isRecal && completedCount >= 1 && completedCount < totalCh && (
              <button
                className="erut-btn erut-btn--default erut-btn--m"
                style={{ color: "var(--system-caution)", borderColor: "var(--system-caution)" }}
                onClick={() => setShowPartialConfirm(true)}
                title={`${completedCount}/${totalCh} 완료 — 나머지 미완료 채널이 있습니다`}
              >
                전체 완료 ({completedCount}/{totalCh})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* v13.0: 부분 완료 confirm 다이얼로그 */}
      {showPartialConfirm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(10,28,60,0.55)", zIndex: 10000, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }} onClick={(e) => { e.stopPropagation(); setShowPartialConfirm(false); }}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: 460, background: "var(--surface-base)", border: "1px solid var(--border-medium)", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 18px", borderBottom: "1px solid var(--border-medium)", background: "var(--system-caution)" }}>
              <div style={{ font: "700 15px/1.2 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-inverse)" }}>교정 미완료 채널 확인</div>
              <button onClick={() => setShowPartialConfirm(false)} aria-label="닫기" style={{ background: "transparent", border: "none", color: "var(--content-inverse)", cursor: "pointer", padding: 4, display: "inline-flex", alignItems: "center", justifyContent: "center" }}><window.EIcon.Close size={14}/></button>
            </div>
            <div style={{ padding: "18px 22px", font: "400 13px/1.6 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-high)" }}>
              교정이 완료되지 않은 탐촉자가 있습니다.<br/>
              계속 진행하시겠습니까?
              <div style={{ marginTop: 10, font: "400 11px/1.4 var(--font-kr)", color: "var(--content-low)" }}>
                미완료 채널 {totalCh - completedCount}개 · 완료 {completedCount}/{totalCh}
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, padding: "12px 18px", borderTop: "1px solid var(--border-medium)", background: "var(--surface-subtle-1)" }}>
              <button className="erut-btn erut-btn--subtle erut-btn--sm" onClick={() => setShowPartialConfirm(false)}>닫기</button>
              <button className="erut-btn erut-btn--emphasis erut-btn--sm" onClick={() => { setShowPartialConfirm(false); if (onComplete) onComplete(); onClose(); }}>확인</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

window.EquipmentSettings = function EquipmentSettings({ initialMenu, initialSubView, onBack }) {
  // initialSubView: null | "mc-add" | "mc-edit" — 외부 진입 시 sub-view 직접 지정 가능
  // 예: [1] 메인 "+ 장비 추가" → initialSubView="mc-add"로 즉시 폼 진입
  const [menu, setMenu] = $s(initialMenu || "mc");          // "mc" | "mqtt" | "probe"
  const [subView, setSubView] = $s(initialSubView || null); // null | "mc-add" | "mc-edit"
  const [editingBoardId, setEditingBoardId] = $s(null);

  // 메뉴 변경 시 sub-view 리셋
  const switchMenu = (m) => { setSubView(null); setEditingBoardId(null); setMenu(m); };

  const menuItems = [
    { id: "mc",    label: "MC보드 설정", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="6" width="14" height="12"/><line x1="16" y1="12" x2="20" y2="12"/><line x1="18" y1="10" x2="18" y2="14"/></svg> },
    { id: "mqtt",  label: "MQTT 설정",   icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12a10 10 0 0 1 14 0"/><path d="M8.5 15a5 5 0 0 1 7 0"/><circle cx="12" cy="18" r="1" fill="currentColor"/></svg> },
  ];
  // #2: '탐촉자 설정' 메뉴 폐기 — 탐촉자 등록은 [2] +탐촉자 추가 → [4-3-1] ChannelCommissioning (적용 범위로 일괄)

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
        {menu === "mc" && !subView && <MCBoardList onAdd={() => setSubView("mc-add")} onEdit={(id) => { setEditingBoardId(id); setSubView("mc-edit"); }}/>}
        {menu === "mc" && subView && <MCBoardForm mode={subView} editingId={editingBoardId} onCancel={() => setSubView(null)} onSave={() => setSubView(null)}/>}
        {menu === "mqtt" && <MQTTSettings/>}
      </div>
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
          <h2 style={{ font: "700 20px/1.2 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-high)", margin: 0 }}>MC보드 설정</h2>
          <p style={{ font: "400 13px/1.4 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)", marginTop: 4, marginBottom: 0 }}>IP 직접 입력 방식. 등록 보드 {boards.length}대 · 연결 {boards.filter(b => b.state !== "offline").length}대 · 오프라인 {boards.filter(b => b.state === "offline").length}대.</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="erut-btn erut-btn--default erut-btn--sm">설정 불러오기</button>
          <button className="erut-btn erut-btn--default erut-btn--sm">설정 저장</button>
          <button className="erut-btn erut-btn--emphasis erut-btn--sm" onClick={onAdd}>+ MC보드 추가</button>
        </div>
      </div>

      {/* v8.8: 2컬럼 레이아웃 (MQTT 설정 페이지 매칭) — 좌: MC보드 리스트 / 우: 영점 검증 요약 */}
      <div style={{ display: "block" }}>
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
  // v9.26: add 모드에서는 통신/채널 수/주파수/샘플링 입력 필드 비움 (default 값 prefill 제거)
  const [timeout, setTimeoutVal] = $s(isEdit ? 5000 : "");
  const [autoReconnect, setAutoReconnect] = $s(true);
  const [chs, setChs]     = $s(existing ? existing.channels : "");
  const [freq, setFreq]   = $s(existing ? existing.freq : "");
  const [sampling, setSampling] = $s(isEdit ? 100 : "");

  const requiredOk = !!(alias && ip && port);

  return (
    <>
      {/* breadcrumb + 헤더 */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div>
          <div style={{ font: "400 12px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)", marginBottom: 6 }}>
            <span style={{ cursor: "pointer", color: "var(--content-emphasis)" }} onClick={onCancel}>MC보드 설정</span>
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
          <input className="erut-field" value={timeout} onChange={(e) => setTimeoutVal(e.target.value)} placeholder="예: 5000" style={{ width: "100%" }}/>
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
          <input className="erut-field" value={chs} onChange={(e) => setChs(e.target.value)} placeholder="예: 64" style={{ width: "100%" }}/>
        </div>
        <div>
          <div style={{ font: "700 12px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-medium)", marginBottom: 4 }}>주파수 (MHz)</div>
          <input className="erut-field" value={freq} onChange={(e) => setFreq(e.target.value)} placeholder="예: 5" style={{ width: "100%" }}/>
        </div>
        <div>
          <div style={{ font: "700 12px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-medium)", marginBottom: 4 }}>샘플링 (MHz)</div>
          <input className="erut-field" value={sampling} onChange={(e) => setSampling(e.target.value)} placeholder="예: 100" style={{ width: "100%" }}/>
        </div>
        <div>
          <div style={{ font: "700 12px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-medium)", marginBottom: 4 }}>펌웨어 버전</div>
          {/* v9.26: add 모드 — 펌웨어 버전 비움. 연결 후 자동 표시 */}
          <input className="erut-field" value={existing ? existing.firmware : ""} placeholder={isEdit ? "" : "연결 후 자동 감지"} style={{ width: "100%" }} disabled/>
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
    code: "f0e9d8c7-1a2b-4c3d-8e5f-6a7b8c9d0e1f",
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
    "PIPE-A-204": { code: "7c4a8d09-ca37-4f1e-9b21-3e0a1f2c5d10", shape: "배관",         od: 300,  th: 10, idim: 280, length: 6000, allow: "2.0", material: "탄소강 (S355)",    fluid: "고온 스팀",       std: "KS B 0817", temp: 380, press: 4.2 },
    "TANK-B-101": { code: "b2f1e6a3-8d54-42c7-a019-6c3b7e8f1a22", shape: "탱크 (구형)",  od: 1500, th: 14, idim: 1472,length: 0,    allow: "3.0", material: "스테인레스 (316L)",fluid: "가스 — 수소",    std: "ASME Sec.V", temp: 25,  press: 8.0 },
    "VESSEL-C-301": { code: "3e9c1d72-5a4b-4e88-bf30-12d7a6c9e433", shape: "탱크 (원통형)", od: 800, th: 12, idim: 776, length: 400,  allow: "2.5", material: "스테인레스 (304)", fluid: "액체 — 화학약품", std: "API 510",   temp: 120, press: 2.0 },
    "FLANGE-D-08": { code: "a1d8f4b6-2c39-4a7e-8e51-9f0b3c2d6e44",  shape: "플랜지",      od: 200,  th: 18, idim: 164, length: 0,    allow: "3.0", material: "탄소강 (S355)",    fluid: "고온 스팀",       std: "KS B 0817",  temp: 200, press: 3.5 },
    "DOME-E-12":   { code: "5f2b9c81-7e46-43d2-91a8-0a4e7b1c8d55",  shape: "Dome 헤드",   od: 1200, th: 15, idim: 1170,length: 0,    allow: "3.0", material: "탄소강 (S355)",    fluid: "액체 — 원유",    std: "API 510",   temp: 60,  press: 1.5 },
    "WELD-F-22":   { code: "9d3e7a14-6b28-4c9f-83b7-2e1f5a0d9c66",  shape: "용접부",      od: 0,    th: 12, idim: 0,   length: 800,  allow: "2.0", material: "탄소강 (S355)",    fluid: "고온 스팀",       std: "KS B 0817",  temp: 350, press: 4.0 },
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
  // v18.1: 채널 배치 마법사 폐기 (A-scan은 좌표 정보 없음)
  // v9.27 Wave B (#6): 프리셋 모달 + 저장 confirm 모달
  const [showPresetModal, setShowPresetModal] = $s(false);
  const [showSaveConfirm, setShowSaveConfirm] = $s(false);
  const [isFromPreset, setIsFromPreset] = $s(false);
  const [saveAsPreset, setSaveAsPreset] = $s(false);
  const [selectedPresetId, setSelectedPresetId] = $s(null);
  const [presetSearch, setPresetSearch] = $s("");   // 프리셋 모달 검색/필터
  const [presetName, setPresetName]     = $s("");   // 프리셋으로 저장 시 프리셋명 (프리셋 코드 없음)
  // v9.27 Wave B fix: '+새 검사 대상 추가' 클릭 시 입력 초기화 confirm
  const [showResetConfirm, setShowResetConfirm] = $s(false);

  // 선택된 target 변경 시 form 리셋 (selectedId null = 신규 모드)
  React.useEffect(() => {
    // v9.27 Wave B fix #1: selectedId 변경 시 isFromPreset 리셋 — 신규 작성 시 '프리셋으로 저장' 체크박스 정상 표시
    setIsFromPreset(false);
    if (!selectedId) { setForm(buildEmptyTargetForm()); return; }
    const t = targets.find(x => x.id === selectedId);
    setForm(buildTargetForm(t));
  }, [selectedId]);

  const setField = (k, v) => setForm(f => ({ ...f, [k]: v }));

  // PRF 자동 계산
  const prfCalc = window.calcPRF(parseFloat(form.th) || 10, form.material);
  const prfValue = autoPRF ? prfCalc.prf : prfManual;

  // 필수 항목 검증 (대상명·MC보드·형태·두께·소재·유체)
  const mcBoard = form.mcBoard || "MCuF-001";   // 검사 대상이 속한 MC보드 (기본값 첫 보드)
  const requiredOk = !!(form.name && mcBoard && form.shape && form.th && form.material && form.fluid);

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

  // v9.27 Wave B fix: 프리셋 데이터에 실제 form 매핑 추가 — '불러오기' 시 input field 자동 적용
  const presets = [
    { id: "p1", name: "탄소강 배관 6~12mm @ 고온 스팀", params: "5 MHz · 28 dB · Pulser 200V · PRF 2,000 Hz · DAC ON", uses: 12, last: "2026-05-19", applied: true,
      data: { shape: "배관", th: "10", od: "300", material: "탄소강 (S355)", fluid: "고온 스팀", std: "KS B 0817", temp: "380", press: "4.2", allow: "2.0" } },
    { id: "p2", name: "탄소강 배관 표준 (범용)",         params: "5 MHz · 26 dB · Pulser 180V · PRF 2,000 Hz",          uses: 28, last: "2026-05-21", applied: false,
      data: { shape: "배관", th: "8",  od: "200", material: "탄소강 (S355)", fluid: "액체 — 물",   std: "KS B 0817", temp: "25",  press: "1.0", allow: "1.5" } },
    { id: "p3", name: "탄소강 고압 배관 (압력 ≥ 4 MPa)", params: "2.25 MHz · 32 dB · TCG ON · PRF 1,000 Hz",            uses:  5, last: "2026-05-15", applied: false,
      data: { shape: "배관", th: "14", od: "400", material: "탄소강 (S355)", fluid: "고온 스팀", std: "ASME Sec.V", temp: "350", press: "5.5", allow: "3.0" } },
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
              // v9.27 Wave B fix #2: 입력된 데이터(또는 프리셋)가 있으면 confirm. 없으면 즉시 초기화
              const isDirty = isFromPreset || Object.values(form).some(v => v !== "" && v != null);
              if (isDirty) {
                setShowResetConfirm(true);
              } else {
                setSelectedId(null);
                setForm(buildEmptyTargetForm());
              }
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
            <button className="erut-btn erut-btn--default erut-btn--sm" onClick={() => setShowPresetModal(true)}>프리셋</button>
            <button
              className={"erut-btn erut-btn--sm " + (requiredOk ? "erut-btn--emphasis" : "erut-btn--disabled")}
              disabled={!requiredOk}
              title={requiredOk ? "" : "필수 항목(*) 입력 필요"}
              onClick={requiredOk ? () => setShowSaveConfirm(true) : undefined}
            >
              저장
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
            {formLabel("MC보드", true)}
            <select className="erut-field" value={mcBoard} onChange={(e) => setField("mcBoard", e.target.value)} style={{ width: "100%" }}>
              {window.MOCK.devices.map(d => <option key={d.id}>{d.id}</option>)}
            </select>
          </div>
          <div>
            {formLabel("코드")}
            <input className="erut-field is-disabled" value={form.code} readOnly tabIndex={-1} style={{ width: "100%" }}/>
            <div style={{ font: "400 9px/1.4 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)", marginTop: 3 }}>UUID 자동 부여 · 수정 불가</div>
          </div>
          {/* v18.1: 채널 배치 마법사 폐기 — A-scan은 좌표 정보 없음. 도면 thumbnail만 유지 */}
          <div>
            <div style={{ font: "700 11px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-medium)", marginBottom: 4 }}>도면 thumbnail</div>
            <button className="erut-btn erut-btn--default erut-btn--sm" style={{ width: "100%" }}>파일 첨부 ↑</button>
          </div>

          {sectionHeader("형상")}
          <div>
            {formLabel("형태", true)}
            <select className="erut-field" value={form.shape} onChange={(e) => setField("shape", e.target.value)} style={{ width: "100%" }}>
              <option value="">선택하세요</option>
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
            {formLabel("허용 감육")}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input className="erut-field" type="number" min="0" step="0.1" value={form.allow} onChange={(e) => setField("allow", e.target.value)} style={{ flex: 1, minWidth: 0 }}/>
              <span style={{ font: "700 12px/1 var(--font-kr)", color: "var(--content-medium)" }}>mm</span>
            </div>
          </div>

          {sectionHeader("소재 · 유체 · 운영 환경")}
          <div>
            {formLabel("소재", true)}
            <select className="erut-field" value={form.material} onChange={(e) => setField("material", e.target.value)} style={{ width: "100%" }}>
              <option value="">선택하세요</option>
              {Object.keys(window.SOUND_SPEEDS).map(m => <option key={m}>{m}</option>)}
              <option>기타 / 직접 입력</option>
            </select>
          </div>
          <div>
            {formLabel("유체 종류", true)}
            <select className="erut-field" value={form.fluid} onChange={(e) => setField("fluid", e.target.value)} style={{ width: "100%" }}>
              <option value="">선택하세요</option>
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

        {/* v9.27 Wave B: 표준 프리셋 영역을 페이지에서 제거 → 모달로 이동 (상단 '프리셋' 버튼 클릭 시 표시) */}
      </div>

      {/* v18.1: 채널 배치 마법사 모달 폐기 */}

      {/* v9.27 Wave B: 프리셋 선택 모달 */}
      {showPresetModal && (
        <window.Modal
          title="검사체별 표준 프리셋"
          onClose={() => { setShowPresetModal(false); setSelectedPresetId(null); }}
          footer={(
            <>
              <window.Button variant="subtle" size="sm" onClick={() => { setShowPresetModal(false); setSelectedPresetId(null); }}>닫기</window.Button>
              <window.Button
                variant={selectedPresetId ? "emphasis" : "disabled"}
                size="sm"
                onClick={selectedPresetId ? () => {
                  // v9.27 Wave B fix: 선택된 프리셋의 data 필드를 form에 적용
                  const preset = presets.find(p => p.id === selectedPresetId);
                  if (preset && preset.data) {
                    setForm(f => ({ ...f, ...preset.data }));
                  }
                  setIsFromPreset(true);
                  setShowPresetModal(false);
                  setSelectedPresetId(null);
                } : undefined}
              >불러오기</window.Button>
            </>
          )}
        >
          <div style={{ font: "400 12px/1.5 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-medium)" }}>
            검사 대상 정보(소재·두께·유체)에 맞는 프리셋을 선택하면 측정 파라미터(MHz·dB·Pulser·Gate·DAC 등)가 일괄 적용됩니다.
          </div>
          {/* #23: 프리셋 검색/필터 — 개수 증가 시 탐색 용이 */}
          <input className="erut-field" value={presetSearch} onChange={(e) => setPresetSearch(e.target.value)} placeholder="프리셋명 · 파라미터 검색" style={{ width: "100%" }}/>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            {presets.filter(p => !presetSearch || p.name.includes(presetSearch) || p.params.includes(presetSearch)).map((p) => {
              const isSel = selectedPresetId === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedPresetId(p.id)}
                  style={{
                    background: isSel ? "linear-gradient(rgba(34,133,239,0.10),rgba(34,133,239,0.10)), var(--surface-base)" : "var(--surface-base)",
                    border: isSel ? "1px solid var(--border-emphasis)" : "1px solid var(--border-medium)",
                    padding: "10px 12px",
                    position: "relative",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ font: "700 12px/1.2 var(--font-kr)", letterSpacing: ".02em", color: isSel ? "var(--content-emphasis)" : "var(--content-high)", marginBottom: 4 }}>{p.name}</div>
                  <div style={{ font: "400 10px/1.4 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-medium)" }}>{p.params}</div>
                  <div style={{ marginTop: 6, font: "400 10px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)" }}>사용 {p.uses}회 · 마지막 {p.last}</div>
                </div>
              );
            })}
          </div>
        </window.Modal>
      )}

      {/* v9.27 Wave B fix #2: 입력 초기화 confirm 모달 */}
      {showResetConfirm && (
        <window.Modal
          title="입력 초기화"
          onClose={() => setShowResetConfirm(false)}
          footer={(
            <>
              <window.Button variant="subtle" size="sm" onClick={() => setShowResetConfirm(false)}>닫기</window.Button>
              <window.Button variant="emphasis" size="sm" onClick={() => {
                // 폼 초기화 + 프리셋 상태 리셋
                setSelectedId(null);
                setForm(buildEmptyTargetForm());
                setIsFromPreset(false);
                setShowResetConfirm(false);
              }}>확인</window.Button>
            </>
          )}
        >
          <div style={{ font: "400 13px/1.5 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-medium)" }}>
            입력한 정보가 초기화됩니다. 진행하시겠습니까?
          </div>
        </window.Modal>
      )}

      {/* v9.27 Wave B: 저장 confirm 모달 — 컨텍스트별 동적 문구. 프리셋에서 불러온 경우 체크박스 미표시 */}
      {showSaveConfirm && (
        <window.Modal
          title="저장 확인"
          onClose={() => setShowSaveConfirm(false)}
          footer={(
            <>
              <window.Button variant="subtle" size="sm" onClick={() => setShowSaveConfirm(false)}>닫기</window.Button>
              <window.Button variant="emphasis" size="sm" onClick={() => {
                // mockup — 실제 저장 로직은 백엔드. 모달 닫기 + 상태 초기화
                setShowSaveConfirm(false);
                setIsFromPreset(false);
                setSaveAsPreset(false);
              }}>저장</window.Button>
            </>
          )}
        >
          <div style={{ font: "400 13px/1.5 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-medium)" }}>
            {selectedId
              ? "변경 사항을 저장하시겠습니까?"
              : "검사 대상을 추가하시겠습니까?"}
          </div>
          {!isFromPreset && (
            <div>
              {/* #1: '프리셋으로 저장' 체크 시 프리셋명 입력 필드 표시 (프리셋 코드 없음) */}
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                <span
                  className={"erut-cb__box" + (saveAsPreset ? " is-on" : "")}
                  onClick={() => setSaveAsPreset(s => !s)}
                  style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                >
                  {saveAsPreset && <svg viewBox="0 0 16 16" width="10" height="10" fill="none" stroke="#FFFFFF" strokeWidth="2"><polyline points="3,8 7,12 13,4"/></svg>}
                </span>
                <span style={{ font: "400 12px/1.2 var(--font-kr)", color: "var(--content-medium)" }}>프리셋으로 저장</span>
              </label>
              {saveAsPreset && (
                <div style={{ marginTop: 10 }}>
                  <div style={{ font: "700 11px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-medium)", marginBottom: 4 }}>프리셋명 <span style={{ color: "var(--system-error)" }}>*</span></div>
                  <input className="erut-field" value={presetName} onChange={(e) => setPresetName(e.target.value)} placeholder="예: 탄소강 배관 6~12mm @ 고온 스팀" style={{ width: "100%" }}/>
                  <div style={{ marginTop: 6, font: "400 11px/1.4 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)" }}>
                    프리셋에는 형상 · 소재 · 유체 · 운영 환경 · 측정 파라미터만 저장됩니다 (기본 정보 제외).
                  </div>
                </div>
              )}
            </div>
          )}
        </window.Modal>
      )}
    </div>
  );
};


// =================== Screen · [3] GATE SETUP ===================
// Layout matches ServiceFlow_FixedProbe SLIDE 8 [3] 탐촉자 Gate 설정 (v3.1).
// 드래그 인터랙션은 시각적 mockup (실제 드래그 핸들러 없음 — input 양방향 sync는 구현).

// v14.0 DEPRECATED: [3] Gate 설정 화면은 [4-3-1] ChannelCommissioning(edit 모드)에 통합됨.
// 본 컴포넌트는 라우팅에서 더 이상 사용되지 않으며, 다음 정리 wave에서 드래그 인터랙션을 commission으로 이식 후 제거 예정.

window.RealtimeScan = function RealtimeScan({ channel, state, setState, elapsed, setElapsed, onBack, onStop }) {
  // state(measureState) · elapsed는 App에서 lift up — toolbar 우측에 표시. 측정 제어(시작/중지)는 [2] 배너 (일시정지 폐기).
  // 메인 [11]의 "전체 진행률 · 81/150 라인" 진행 바는 고정형 컨텍스트(라인 스캔 없음)에 부적합하여 제외.
  const [selectedCh, setSelectedCh] = $s(4); // 64ch grid 선택 (main: CH 04)
  const [showAlert, setShowAlert] = $s(true);
  // v9.18 (NDT 1.4): 세션 시작 시 교정 확인 다이얼로그
  const [showCalibCheck, setShowCalibCheck] = $s(false);
  const [showRecalibration, setShowRecalibration] = $s(false);
  // v9.18 (NDT 1.9): 결함 검증 재측정 — 추후 삭제 가능성
  // v22.0: showVerification 제거 (검증 재측정 폐기)
  // mock — 교정 주기 초과 채널 (v16.0: 채널별 주기 override / 전역 기본값 모두 반영. 실제 백엔드 연동 시 sensor.lastCalibration + channel.calibrationCycle 기준)
  const expiredChannels = ["ch04", "ch09", "ch12"];

  // 측정 시작(F6) 트리거 — 교정 만료 채널 있으면 1.4 다이얼로그 우선

  const defects = window.MOCK.realtimeDefects;
  // v22.6: 검출된 결함(첫 건) — 등급 무관. 검출 사실 알림용 (판정은 웹)
  const criticalDefect = defects[0];

  // v9.15: 64ch cells — MOCK.sensors 기반 (두 화면 데이터 단일 진실 공급원)
  const sensorMap64 = Object.fromEntries(window.MOCK.sensors.map(s => [s.id, s]));
  // v9.30: [2]와 동일한 교정 상태 mock (단일 진실 공급원 유지)
  const UNCALIBRATED_CHANNELS_64 = ["ch20", "ch33"];
  const EXPIRED_CHANNELS_64 = ["ch04", "ch09", "ch12"];
  const cells64 = [];
  for (let i = 1; i <= 64; i++) {
    const def = defects.find(d => d.channel === i);
    const id = "ch" + String(i).padStart(2, "0");
    const sensor = sensorMap64[id];
    const calibrationStatus = UNCALIBRATED_CHANNELS_64.includes(id)
      ? "uncalibrated"
      : EXPIRED_CHANNELS_64.includes(id) ? "expired" : "ok";
    cells64.push({
      num: i,
      id,
      sensor: sensor || { id, state: "ok" }, // sensors에 없으면 default ok
      defect: !!def, // v22.6: 검출 사실(boolean) — 등급 없음
      targetName: i <= 24 ? "PIPE-A-204" : i <= 48 ? "TANK-B-101" : "VESSEL-C-301",
      calibrationStatus,
    });
  }

  return (
    <div className="erut-page-enter" style={{ padding: "20px 24px", height: "100%", display: "grid", gridTemplateColumns: "1fr 340px 320px", gridTemplateRows: "0px auto 540px", alignContent: "start", columnGap: 14, rowGap: 20 }}>

      {/* 감육 검출 배너 — caution(orange)로 통일 (검출=확인 요망, red는 측정 차단 전용) */}
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
            <div style={{ font: "700 14px/1.2 var(--font-kr)", letterSpacing: ".02em", color: "var(--system-error)" }}>감육 검출 · 감육률 {criticalDefect.thinPct} %</div>
            <div style={{ font: "400 12px/1.5 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-high)", marginTop: 2 }}>채널 {criticalDefect.channel} · 측정 두께 {criticalDefect.thickness} mm · 감육량 {criticalDefect.thinMm} mm · 허용 감육 2.0 mm 초과 · 신호 세기 {criticalDefect.amp} %FSH · 정상 · 세션 데이터에 검출 시점 자동 기록</div>
          </div>
          {/* v22.0: '검증 재측정' 삭제 — 고정 연속 모니터링은 채널별 on-demand 재측정 불가(보드 단위 연속 PRF). 확인만. */}
          <button className="erut-btn erut-btn--default erut-btn--sm" onClick={() => setShowAlert(false)}>확인 후 계속</button>
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
          <span>Amp <strong style={{ fontWeight: 700, color: "var(--content-high)" }}>92% FSH</strong></span>
          <span>ToF <strong style={{ fontWeight: 700, color: "var(--content-high)" }}>2.64 μs</strong></span>
          <span>측정 두께 <strong style={{ fontWeight: 700, color: "var(--content-high)" }}>7.8 mm</strong></span>
          <span>감육률 <strong style={{ fontWeight: 700, color: "var(--system-error)" }}>22.0 %</strong></span>
          <span style={{ marginLeft: "auto" }}>샘플링 <strong style={{ fontWeight: 700, color: "var(--content-high)" }}>100 MHz</strong></span>
        </div>
      </div>

      {/* v9.7: 64CH 채널 상태 — column 3 (320px). erut-panel 헤더 적용 */}
      <div className="erut-panel" style={{ gridRow: 3, gridColumn: 3, minWidth: 0 }}>
        <div className="erut-panel__header">64CH 채널 상태</div>
        <div className="erut-panel__body" style={{ overflow: "visible", padding: 14, display: "flex", flexDirection: "column", gap: 8 }}>
          {/* v22.0: '감육 검출 시 자동 전환' 토글 삭제 — A-scan 자동 점프는 검사자 혼란, 감육 등급 판정은 웹 */}
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

      {/* v9.7: 검사 대상·부착 상태 — column 2 (340px, 중앙) · v22.0: 측정 제어 제거(보드 단위 → [2] 배너) */}
      <div className="erut-panel" style={{ gridRow: 3, gridColumn: 2, minWidth: 0 }}>
        <div className="erut-panel__header">감육 측정 · 검사 대상</div>
        <div className="erut-panel__body" style={{ overflow: "visible", padding: 14 }}>

          {/* 감육 측정 카드 (선택 채널 — ToF→두께·감육률 + 신호 세기 통합) */}
          <div style={{ font: "700 11px/1 var(--font-kr)", letterSpacing: "0.08em", color: "var(--content-low)", textTransform: "uppercase", marginBottom: 6 }}>감육 측정 (CH 04)</div>
          <div style={{ background: "var(--surface-subtle-2)", border: "1px solid var(--border-medium)", padding: "10px 12px" }}>
            {/* 감육률 강조 (hero — 핵심 KPI) */}
            <div style={{ font: "700 10px/1 var(--font-kr)", letterSpacing: "0.08em", color: "var(--content-low)", textTransform: "uppercase", marginBottom: 2 }}>감육률</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 8 }}>
              <span style={{ font: "700 30px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--system-error)" }}>22.0<span style={{ fontSize: 15, marginLeft: 2 }}>%</span></span>
              <span style={{ font: "400 11px/1.3 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)" }}>감육량 2.2 mm</span>
            </div>
            <div style={{ marginBottom: 8, font: "700 11px/1.3 var(--font-kr)", letterSpacing: ".02em", color: "var(--system-error)" }}>⚠ 감육 검출 · 허용 감육 2.0 mm 초과</div>
            {/* 보조 측정값 */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 10px", font: "400 10px/1.3 var(--font-kr)", borderTop: "1px solid var(--border-low)", paddingTop: 6 }}>
              <div><span style={{ color: "var(--content-low)" }}>측정 두께</span> <strong style={{ fontWeight: 700, color: "var(--content-high)" }}>7.8 mm <span style={{ color: "var(--content-low)", fontWeight: 400 }}>/ 공칭 10</span></strong></div>
              <div><span style={{ color: "var(--content-low)" }}>ToF</span> <strong style={{ fontWeight: 700, color: "var(--content-high)" }}>2.64 μs</strong></div>
            </div>
            {/* 신호 세기 (Amp) — 감육 측정 카드에 통합 (세기 1회) */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 10px", font: "400 10px/1.3 var(--font-kr)", borderTop: "1px solid var(--border-low)", marginTop: 6, paddingTop: 6 }}>
              <div><span style={{ color: "var(--content-low)" }}>신호 세기</span> <strong style={{ fontWeight: 700, color: "var(--content-high)" }}>92 %FSH</strong></div>
              <div><span style={{ color: "var(--content-low)" }}>상태</span> <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontWeight: 700, color: "var(--system-success)" }}><span style={{ width: 7, height: 7, background: "var(--system-success)", borderRadius: "50%" }}/>정상</span></div>
              <div><span style={{ color: "var(--content-low)" }}>커플런트</span> <strong style={{ fontWeight: 700, color: "var(--content-medium)" }}>양호</strong></div>
            </div>
          </div>

          {/* 검사 대상 카드 (현재 선택 채널의 검사체) */}
          <div style={{ font: "700 11px/1 var(--font-kr)", letterSpacing: "0.08em", color: "var(--content-low)", textTransform: "uppercase", margin: "14px 0 6px" }}>검사 대상</div>
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
          </div>

          {/* 측정 제어 제거 — 측정은 MC보드 단위 ([2] DeviceDetail 배너 + 툴바) */}
        </div>
      </div>

      {/* v9.18 (NDT 1.4): 세션 시작 시 교정 확인 다이얼로그 */}
      {showCalibCheck && (
        <window.Modal
          title="측정 시작 전 교정 상태 확인"
          onClose={() => setShowCalibCheck(false)}
          footer={(
            <>
              <window.Button variant="subtle" size="sm" onClick={() => setShowCalibCheck(false)}>취소</window.Button>
              <window.Button variant="default" size="sm" onClick={() => { setShowCalibCheck(false); setState("measuring"); setElapsed(0); setShowAlert(true); }}>그대로 측정</window.Button>
              <window.Button variant="emphasis" size="sm" onClick={() => { setShowCalibCheck(false); setShowRecalibration(true); }}>재교정 후 측정</window.Button>
            </>
          )}
        >
          <div style={{ padding: "10px 12px", background: "var(--surface-subtle-2)", border: "1px solid var(--border-low)", borderLeft: "3px solid var(--system-caution)" }}>
            <div style={{ font: "700 13px/1.2 var(--font-kr)", color: "var(--system-caution)" }}>{expiredChannels.length}채널 교정 6개월 경과</div>
            <div style={{ font: "400 11px/1.4 var(--font-kr)", color: "var(--content-medium)", marginTop: 4 }}>
              {expiredChannels.map(c => c.toUpperCase()).join(", ")}
            </div>
          </div>
          <div style={{ font: "400 12px/1.5 var(--font-kr)", color: "var(--content-medium)" }}>
            ASNT SNT-TC-1A 표준에 따르면 6개월 이상 경과된 교정은 측정 신뢰성에 영향을 줄 수 있습니다. 정확한 측정을 위해 재교정을 권장합니다.
          </div>
        </window.Modal>
      )}

      {/* v9.18 (NDT 1.4): 재교정 모드 마법사 — CalibrationWizard 재사용 (옵션 A) */}
      {showRecalibration && (
        <window.CalibrationWizard
          mode="recalibration"
          channelList={expiredChannels}
          onClose={() => setShowRecalibration(false)}
          onComplete={() => { setState("measuring"); setElapsed(0); setShowAlert(true); }}
        />
      )}

      {/* v22.0: 결함 검증 재측정 다이얼로그 제거 — 고정 연속 모니터링은 채널별 재측정 불가 */}
    </div>
  );
};

// =================== Screen · [18] REPORT GENERATOR (v9.24 신규) ===================
// 메인 HTML SLIDE 17 [18] 보고서 자동 생성 페이지 구현
// 진입: 메뉴바 [파일] > 보고서 출력 (Ctrl+P) — index.html
// v18.0 DEPRECATED: 감육 보고서 폐기 — 현장 데이터 dump (window.ReportExportDialog)로 전환.
// 코드는 archive/ERUT_ServiceFlow_FixedProbe_v17.2.html에 보존. office 후처리 보고서 요구 재발생 시 복원.
// 현재는 라우팅에서 빠져있어 실제 표시되지 않음 (index.html screen === "report" 제거됨).

