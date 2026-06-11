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

// ----------- TOOLBAR ------------
window.Toolbar = function Toolbar({ items, activeKey, onPick, hint }) {
  return (
    <div className="erut-bar erut-toolbar">
      {items.map((item, i) => item.divider ? (
        <span key={"d"+i} className="erut-tb-sep"/>
      ) : (
        <button
          key={item.key}
          className={"erut-tb" + (activeKey === item.key ? " is-active" : "")}
          title={item.label}
          onClick={() => onPick && onPick(item.key)}
        >{item.icon}</button>
      ))}
      <span style={{flex:1}}/>
      {hint || <span className="erut-tb-hint">F6 측정 시작 · F7 중지</span>}
    </div>
  );
};

// ----------- STATUS BAR ------------
// v16.0: calibrationAlert 신설 — 교정 임박/만료 채널 N개를 statusbar 우측에 노출.
// v17.1: 워딩 정리 (사용자 합의 — 각 상태 대상 명확화)
//   - 장비 연결됨 → MC보드 연결됨 (MC보드 ↔ 미니 PC 커넥션)
//   - 측정 pill 신설 — MC보드 단위 start/stop 상태 (success/content-low LED)
//   - MQTT 연결됨 — 미니 PC ↔ 서버 통신 (그대로)
// 다중 MC보드 시: 분수 표시 (3/3 모두 = 단순 라벨, 일부 = N/M)
window.StatusBar = function StatusBar({
  // v17.1: device 통합 props — mcConnected/mcTotal/measuringCount 집계
  mcConnected = 0, mcTotal = 0, measuringCount = 0,
  mqttConnected = false, prf = "---", temp = "---", version = "v0.0.0.0", calibrationAlert = null,
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
      <McConnectionPill connected={mcConnected} total={mcTotal}/>
      <MeasurementPill measuring={measuringCount} totalConnected={mcConnected}/>
      <StatusPill connected={mqttConnected} labelOn="MQTT 연결됨" labelOff="MQTT 미연결"/>
      <span className="erut-statusbar__text">PRF : {prf}</span>
      <span className="erut-statusbar__text">Temp : {temp}</span>
      <span style={{flex:1}}/>
      {calibrationAlert && calibrationAlert.count > 0 && (
        <span onClick={calibrationAlert.onClick} title="클릭 — 교정 임박/만료 채널 상세 보기" style={{
          display: "inline-flex", alignItems: "center", gap: 5, cursor: "pointer",
          color: calibrationAlert.tone === "error" ? "var(--system-error)" : "var(--system-caution)",
          font: "700 12px/1 var(--font-kr)", letterSpacing: ".02em",
          padding: "0 10px", borderLeft: "1px solid var(--border-medium)"
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.7 21a2 2 0 0 1-3.4 0"/>
          </svg>
          {calibrationAlert.tone === "error" ? `교정 만료 ${calibrationAlert.count}` : `교정 임박 ${calibrationAlert.count}`}
        </span>
      )}
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

// ----------- v17.1: MC보드 연결 Pill (분수 집계) ------------
// 3/3 모두 연결 = "MC보드 연결됨", 일부 = "MC보드 연결됨 N/M", 0/M = "MC보드 미연결"
function McConnectionPill({ connected, total }) {
  if (total === 0) return null;
  const allConn = connected === total;
  const noneConn = connected === 0;
  const label = noneConn ? "MC보드 미연결" : allConn ? "MC보드 연결됨" : `MC보드 연결됨 ${connected}/${total}`;
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

// ----------- v17.1: 측정 Pill (MC보드 단위 start/stop) ------------
// 측정 중 N>0 = "측정 중 N/M" (is-green), N=0 = "정지" (is-gray).
// totalConnected: 연결된 보드 수 (offline 제외). offline 보드는 측정 분모에서 제외.
// v17.2: inline style 제거 — kit.css의 .erut-led.is-green / .is-gray 클래스 사용 (MC보드·MQTT pill과 동일 형태)
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
