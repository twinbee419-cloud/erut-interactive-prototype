// ERUT UI Kit — interactive form atoms: Button, Field, Select, Checkbox,
// Card (square), ContextMenu.

const { useState: _u } = React;

// ----------- BUTTON ------------
// variants: default | active | emphasis | disabled
// sizes:    m (160×45) | l (315×45) | sm (auto, 32)
window.Button = function Button({ variant = "default", size = "m", children, onClick, ...rest }) {
  return (
    <button
      className={"erut-btn erut-btn--" + variant + " erut-btn--" + size}
      onClick={variant === "disabled" ? undefined : onClick}
      disabled={variant === "disabled"}
      {...rest}
    >{children}</button>
  );
};

// ----------- FIELD ------------
window.Field = function Field({ value, onChange, placeholder = "입력해주세요.", disabled, width = 200 }) {
  return (
    <input
      className={"erut-field" + (disabled ? " is-disabled" : "")}
      style={{ width }}
      value={value || ""}
      onChange={(e) => onChange && onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
    />
  );
};

// ----------- SELECT ------------
window.Select = function Select({ value, options, onChange, width = 200, placeholder = "선택해주세요." }) {
  const [open, setOpen] = _u(false);
  return (
    <div className="erut-select" style={{ width, position: "relative" }}>
      <button className={"erut-select__trigger" + (open ? " is-open" : "")} onClick={() => setOpen(o => !o)}>
        <span style={{color: value ? "var(--content-high)" : "var(--content-low)"}}>{value || placeholder}</span>
        <window.EIcon.ChevronDown/>
      </button>
      {open && (
        <div className="erut-select__menu">
          {options.map((o) => (
            <button key={o} className="erut-select__opt" onClick={() => { onChange(o); setOpen(false); }}>
              {o}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ----------- CHECKBOX ------------
window.Checkbox = function Checkbox({ checked, onChange, label }) {
  return (
    <label className="erut-cb">
      <span className={"erut-cb__box" + (checked ? " is-on" : "")} onClick={() => onChange(!checked)}>
        {checked && (
          <svg viewBox="0 0 16 16" width="10" height="10" fill="none" stroke="#FFFFFF" strokeWidth="2">
            <polyline points="3,8 7,12 13,4"/>
          </svg>
        )}
      </span>
      {label && <span className="erut-cb__label">{label}</span>}
    </label>
  );
};

// ----------- TOGGLE SWITCH ------------
// On/Off binary control. Use when the state changes immediately on click
// (display layers, live filters, autorun). For form submission use Checkbox.
window.Toggle = function Toggle({ checked, onChange, label, size = "m", disabled }) {
  const trackCls = "erut-toggle__track"
    + (checked ? " is-on" : "")
    + (disabled ? " is-disabled" : "");
  const labelCls = "erut-toggle__label" + (size === "sm" ? " erut-toggle__label--sm" : "");
  return (
    <label className="erut-toggle" onClick={() => !disabled && onChange && onChange(!checked)}>
      <span className={trackCls}>
        <span className="erut-toggle__thumb"/>
      </span>
      {label && <span className={labelCls}>{label}</span>}
    </label>
  );
};

// ----------- CARD (always square, optional selected state) ------------
window.Card = function Card({ selected, children, onClick, style }) {
  return (
    <div className={"erut-card" + (selected ? " is-selected" : "")} onClick={onClick} style={style}>
      {children}
    </div>
  );
};

// ----------- CONTEXT MENU ------------
window.ContextMenu = function ContextMenu({ items, width = 300, style }) {
  return (
    <div className="erut-cmenu" style={{ width, ...style }}>
      {items.map((it, i) => it.divider ? (
        <div key={"d"+i} className="erut-cmenu__sep"/>
      ) : (
        <div key={it.label} className="erut-cmenu__row" onClick={it.onClick}>
          <span>{it.label}</span>
          {it.shortcut && <span className="erut-cmenu__kbd">{it.shortcut}</span>}
        </div>
      ))}
    </div>
  );
};

// ----------- BADGE ----------------
window.Badge = function Badge({ children, tone = "emphasis" }) {
  return <span className={"erut-badge erut-badge--" + tone}>{children}</span>;
};

// ----------- MODAL DIALOG ----------------
// 2026-05-26 added for interactive prototype.
// v8.10: 헤더 X 닫기 버튼 표준화 — 모든 Modal에 동일한 SVG X 아이콘 적용
window.Modal = function Modal({ title, children, onClose, footer }) {
  return (
    <div className="erut-modal__backdrop" onClick={onClose}>
      <div className="erut-modal" onClick={(e) => e.stopPropagation()}>
        <div className="erut-modal__header" style={{ justifyContent: "space-between" }}>
          <span>{title}</span>
          <button onClick={onClose} aria-label="닫기" style={{ background: "transparent", border: "none", color: "var(--content-inverse)", cursor: "pointer", padding: 4, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
            <window.EIcon.Close size={14}/>
          </button>
        </div>
        <div className="erut-modal__body">{children}</div>
        {footer && <div className="erut-modal__footer">{footer}</div>}
      </div>
    </div>
  );
};

// ----------- SPARKLINE ----------------
// values: [number], width/height: px. Renders a polyline + last-point dot.
window.Sparkline = function Sparkline({ values, color = "var(--system-caution)", width = 160, height = 22 }) {
  if (!values || values.length < 2) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * (width - 4) + 2;
    const y = height - 2 - ((v - min) / span) * (height - 4);
    return x.toFixed(1) + "," + y.toFixed(1);
  }).join(" ");
  const last = values[values.length - 1];
  const lx = width - 2;
  const ly = height - 2 - ((last - min) / span) * (height - 4);
  return (
    <svg className="erut-sparkline" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round"/>
      <circle cx={lx} cy={ly} r="2" fill={color}/>
    </svg>
  );
};

// ----------- TOOLTIP ----------------
// Floating positional tooltip (absolute inside relative container).
window.Tooltip = function Tooltip({ x, y, title, rows, sparkValues, hint, warn }) {
  return (
    <div className="erut-tooltip" style={{ left: x, top: y }}>
      <div className="erut-tooltip__title">
        <span>{title}</span>
        {warn && <span className="warn">⚠ {warn}</span>}
      </div>
      {rows.map((r, i) => (
        <div key={i} className="erut-tooltip__row">
          <span className="label">{r.label}</span>
          <span className={"value" + (r.warn ? " warn" : "")}>{r.value}</span>
        </div>
      ))}
      {sparkValues && (
        <>
          <div className="erut-tooltip__sparklabel">7일 두께 트렌드</div>
          <window.Sparkline values={sparkValues} width={200} height={22}/>
        </>
      )}
      {hint && <div className="erut-tooltip__hint">{hint}</div>}
    </div>
  );
};
