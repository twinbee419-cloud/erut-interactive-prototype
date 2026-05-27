// ERUT UI Kit — window chrome (TitleBar, MenuBar, Toolbar, StatusBar)
// All sized to a 1920-wide window. Tokens come from ../../colors_and_type.css.

const { useState } = React;
const I = window.EIcon;

// ----------- TITLE BAR ------------
window.TitleBar = function TitleBar({ title = "ERUT - Ultrasonic Monitoring System", onMin, onMax, onClose }) {
  return (
    <div className="erut-titlebar">
      <div className="erut-titlebar__brand" aria-label="ERUT logo">
        <img src="../../assets/logo/erut-app-icon.png" alt=""/>
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
window.StatusBar = function StatusBar({ deviceConnected = false, mqttConnected = false, prf = "---", temp = "---", version = "v0.0.0.0" }) {
  return (
    <div className="erut-statusbar">
      <StatusPill connected={deviceConnected} labelOn="장비 연결됨" labelOff="장비 미연결"/>
      <StatusPill connected={mqttConnected} labelOn="MQTT 연결됨" labelOff="MQTT 미연결"/>
      <span className="erut-statusbar__text">PRF : {prf}</span>
      <span className="erut-statusbar__text">Temp : {temp}</span>
      <span style={{flex:1}}/>
      <span className="erut-statusbar__text">{version}</span>
      <span className="erut-statusbar__grip"><I.ResizeCorner/></span>
    </div>
  );
};

// ----------- STATUS PILL ------------
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
