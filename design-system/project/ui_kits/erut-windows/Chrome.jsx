// ERUT UI Kit — window chrome (TitleBar, MenuBar, Toolbar, StatusBar)
// All sized to a 1920-wide window. Tokens come from ../../colors_and_type.css.

const { useState } = React;
const I = window.EIcon;

// ----------- TITLE BAR ------------
window.TitleBar = function TitleBar({ title = "ERUT - Ultrasonic Monitoring System", onMin, onMax, onClose }) {
  return (
    <div className="erut-titlebar">
      <div className="erut-titlebar__brand" aria-label="ERUT logo">
        <img src="assets/logo/erut-app-icon.png" alt=""/>
      </div>
      <span className="erut-titlebar__title">{title}</span>
      <span style={{ flex: 1 }}/>
      <button className="erut-winbtn" onClick={onMin} title="Minimize">
        <I.Minimize/>
      </button>
      <button className="erut-winbtn" onClick={onMax} title="Maximize">
        <I.Maximize/>
      </button>
      <button className="erut-winbtn" onClick={onClose} title="Close">
        <I.Close/>
      </button>
    </div>
  );
};

// ----------- FILE MENU BAR ------------
window.MenuBar = function MenuBar({ items, active, onPick }) {
  return (
    <div className="erut-bar erut-menubar">
      {items.map((label) => (
        <button
          key={label}
          className={"erut-menu" + (active === label ? " is-active" : "")}
          onClick={() => onPick && onPick(label)}
        >{label}</button>
      ))}
    </div>
  );
};

// ----------- NOTIFICATION CENTER (v21.0) ------------
// 통합 알림 센터 — 교정/측정/통신/부착 알림을 종 아이콘 + 드롭다운으로 일원화.
// 심각도: error(긴급) / caution(경고) / info(정보) — 시스템 색 토큰.
// 상태바의 구 '교정 임박 N' 배지를 흡수. 드롭섀도우 미사용(디자인 원칙) — border로 구분.
window.NotificationCenter = function NotificationCenter({ notifications = [], onAction, onSettings, onMarkAllRead }) {
  const [open, setOpen] = React.useState(false);
  const SEV = {
    error:   { color: "var(--system-error)" },
    caution: { color: "var(--system-caution)" },
    info:    { color: "var(--system-info)" },
  };
  const order = { error: 0, caution: 1, info: 2 };
  const sorted = [...notifications].sort((a, b) => (order[a.severity] ?? 9) - (order[b.severity] ?? 9));
  const unread = notifications.filter(n => !n.read).length;
  return (
    <div style={{ position: "relative", display: "inline-flex" }}>
      <button onClick={() => setOpen(o => !o)} title="알림" style={{
        position: "relative", height: 40, width: 48, background: open ? "var(--surface-subtle-2)" : "transparent",
        border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center",
        color: open ? "var(--content-emphasis)" : "var(--content-medium)"
      }}>
        <window.EIcon.Bell size={20}/>
        {unread > 0 && (
          <span style={{
            position: "absolute", top: 5, right: 9, minWidth: 15, height: 15, padding: "0 3px",
            background: "var(--system-error)", color: "var(--on-primary)", borderRadius: 100,
            font: "700 9px/15px var(--font-kr)", textAlign: "center"
          }}>{unread}</span>
        )}
      </button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 998 }}/>
          <div style={{
            position: "absolute", top: 40, left: 0, width: 360, zIndex: 999,
            background: "var(--surface-base)", border: "1px solid var(--border-high)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", borderBottom: "1px solid var(--border-low)" }}>
              <span style={{ font: "700 13px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-high)" }}>알림 ({notifications.length})</span>
              <button onClick={() => onMarkAllRead && onMarkAllRead()} style={{ background: "none", border: "none", cursor: "pointer", font: "700 11px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-emphasis)" }}>모두 읽음</button>
            </div>
            <div style={{ maxHeight: 320, overflowY: "auto" }}>
              {sorted.length === 0 ? (
                <div style={{ padding: "28px 14px", textAlign: "center", font: "400 12px/1.4 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)" }}>새 알림이 없습니다.</div>
              ) : sorted.map(n => (
                <div key={n.id} style={{ display: "flex", gap: 10, padding: "10px 14px", borderBottom: "1px solid var(--border-low)", background: n.read ? "transparent" : "var(--surface-subtle-2)" }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: (SEV[n.severity] || SEV.info).color, marginTop: 5, flexShrink: 0 }}/>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                      <span style={{ font: "700 12px/1.3 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-high)" }}>{n.title}</span>
                      <span style={{ font: "400 10px/1.3 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)", flexShrink: 0 }}>{n.time}</span>
                    </div>
                    <div style={{ font: "400 11px/1.4 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)", marginTop: 2 }}>{n.detail}</div>
                    {n.actionLabel && <button onClick={() => onAction && onAction(n)} style={{ marginTop: 4, background: "none", border: "none", cursor: "pointer", padding: 0, font: "700 11px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-emphasis)" }}>{n.actionLabel} →</button>}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding: "8px 14px", borderTop: "1px solid var(--border-low)", textAlign: "right" }}>
              <button onClick={() => onSettings && onSettings()} style={{ background: "none", border: "none", cursor: "pointer", font: "700 11px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-emphasis)" }}>알림 정책 설정 →</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// ----------- TOOLBAR ------------
// 순서: 이전 / 홈 / 보고서 / 진단 / 알림 ········· 브레드크럼(우측 끝). 보고서·진단은 장비 컨텍스트에서만 활성.
window.Toolbar = function Toolbar({ items, activeKey, onPick, notificationCenter, onBack, backDisabled, breadcrumb }) {
  return (
    <div className="erut-bar erut-toolbar">
      <button className="erut-tb" title="이전으로" onClick={backDisabled ? undefined : onBack} style={backDisabled ? { opacity: 0.4, cursor: "default" } : undefined}><I.ChevronLeft/></button>
      {items.map((item) => (
        <button
          key={item.key}
          className={"erut-tb" + (activeKey === item.key ? " is-active" : "")}
          title={item.label}
          onClick={item.disabled ? undefined : () => onPick && onPick(item.key)}
          style={item.disabled ? { opacity: 0.4, cursor: "default" } : undefined}
        >{item.icon}</button>
      ))}
      {notificationCenter}
      <span style={{flex:1}}/>
      {breadcrumb}
    </div>
  );
};

// ----------- STATUS BAR ------------
// v16.0: calibrationAlert 신설 — 교정 임박/만료 채널 N개를 statusbar 우측에 노출.
// v17.1: 워딩 정리 (사용자 합의 — 각 상태 대상 명확화)
//   - 장비 연결됨 → DAQ 연결됨 (DAQ ↔ 미니 PC 커넥션)
//   - 측정 pill 신설 — DAQ 단위 start/stop 상태 (success/content-low LED)
//   - MQTT 연결됨 — 미니 PC ↔ 서버 통신 (그대로)
// 다중 DAQ 시: 분수 표시 (3/3 모두 = 단순 라벨, 일부 = N/M)
window.StatusBar = function StatusBar({
  // v17.1: device 통합 props — mcConnected/mcTotal/measuringCount 집계
  mcConnected = 0, mcTotal = 0, measuringCount = 0,
  mqttConnected = false, version = "v0.0.0.0", calibrationAlert = null,
  // store-and-forward: 서버(web) 미전송 누적 건수. 끊김=로컬 보관('송신 대기') / 재연결=따라잡기('송신 중')
  mqttPending = 0,
  // (legacy) deviceConnected — 기존 호출처 호환. true = (1, 1), false = (0, 1)
  deviceConnected,
}) {
  // legacy 호환: deviceConnected만 전달된 경우 mcTotal/mcConnected로 변환
  if (mcTotal === 0 && deviceConnected !== undefined) {
    mcTotal = 1;
    mcConnected = deviceConnected ? 1 : 0;
    measuringCount = deviceConnected ? 1 : 0;
  }
  return (
    <div className="erut-statusbar">
      {/* v22.10: 그룹 라벨 형식 — "DAQ : (연결됨) (측정 중) / MQTT : (연결됨)". 측정 중이 DAQ 단위임을 명확화. PRF·Temp 제거 */}
      <span className="erut-statusbar__text">DAQ :</span>
      <McConnectionPill connected={mcConnected} total={mcTotal}/>
      <MeasurementPill measuring={measuringCount} totalConnected={mcConnected}/>
      <span style={{ width: 1, height: 14, background: "var(--border-medium)", alignSelf: "center" }}/>
      <span className="erut-statusbar__text">MQTT :</span>
      <StatusPill connected={mqttConnected} labelOn="연결됨" labelOff="끊김"/>
      {/* store-and-forward 버퍼 상태 — 미전송 누적 시에만 노출 */}
      {mqttPending > 0 && (
        <span className="erut-statusbar__text" style={{ color: mqttConnected ? "var(--system-info)" : "var(--system-caution)" }}>
          {mqttConnected ? `송신 중 ${mqttPending}건` : `송신 대기 ${mqttPending}건`}
        </span>
      )}
      <span style={{flex:1}}/>
      {/* v21.0: 교정 임박 배지 제거 → 메뉴바 통합 알림 센터(NotificationCenter)로 흡수. calibrationAlert prop은 back-compat용으로 무시 */}
      <span className="erut-statusbar__text">{version}</span>
      <span className="erut-statusbar__grip"><I.ResizeCorner/></span>
    </div>
  );
};

// ----------- STATUS PILL (legacy: MQTT 등 단순 binary 상태) ------------
function StatusPill({ connected, labelOn, labelOff }) {
  return (
    <span className="erut-pill">
      <span className={"erut-led " + (connected ? "is-green" : "is-red")}>
        <span className="erut-led__halo"/>
        <span className="erut-led__dot"/>
      </span>
      {connected ? labelOn : labelOff}
    </span>
  );
}
window.StatusPill = StatusPill;

// ----------- v17.1: DAQ 연결 Pill (분수 집계) ------------
// 3/3 모두 연결 = "DAQ 연결됨", 일부 = "DAQ 연결됨 N/M", 0/M = "DAQ 미연결"
function McConnectionPill({ connected, total }) {
  if (total === 0) return null;
  const allConn = connected === total;
  const noneConn = connected === 0;
  const label = noneConn ? "미연결" : allConn ? "연결됨" : `연결됨 ${connected}/${total}`;
  return (
    <span className="erut-pill">
      <span className={"erut-led " + (noneConn ? "is-red" : "is-green")}>
        <span className="erut-led__halo"/>
        <span className="erut-led__dot"/>
      </span>
      {label}
    </span>
  );
}
window.McConnectionPill = McConnectionPill;

// ----------- v17.1: 측정 Pill (DAQ 단위 start/stop) ------------
// 측정 중 N>0 = "측정 중 N/M" (is-green), N=0 = "정지" (is-gray).
// totalConnected: 연결된 보드 수 (offline 제외). offline 보드는 측정 분모에서 제외.
// v17.2: inline style 제거 — kit.css의 .erut-led.is-green / .is-gray 클래스 사용 (DAQ·MQTT pill과 동일 형태)
function MeasurementPill({ measuring, totalConnected }) {
  if (totalConnected === 0) return null;
  const isMeasuring = measuring > 0;
  const label = !isMeasuring ? "정지" : measuring === totalConnected ? "측정 중" : `측정 중 ${measuring}/${totalConnected}`;
  return (
    <span className="erut-pill">
      <span className={"erut-led " + (isMeasuring ? "is-green" : "is-gray")}>
        <span className="erut-led__halo"/>
        <span className="erut-led__dot"/>
      </span>
      {label}
    </span>
  );
}
window.MeasurementPill = MeasurementPill;
