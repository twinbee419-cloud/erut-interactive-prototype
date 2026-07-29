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
        <div key={it.label} className="erut-cmenu__row" onClick={it.disabled ? undefined : it.onClick} style={it.disabled ? { color: "var(--content-low)", opacity: 0.55, cursor: "default", pointerEvents: "none" } : undefined}>
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
window.Modal = function Modal({ title, children, onClose, footer, width }) {
  // v9.34: width prop으로 max-width 오버라이드 가능 (기본은 kit.css의 760px)
  const modalStyle = width ? { maxWidth: width, width: "100%" } : undefined;
  return (
    <div className="erut-modal__backdrop" onClick={onClose}>
      <div className="erut-modal" style={modalStyle} onClick={(e) => e.stopPropagation()}>
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


// ----------- CHANNEL GRID ------------
// v9.5 (NDT 1.8): [2]·[11] 셀 그리드 통일 컴포넌트.
// cells: [{ id, num, sensor?, targetName?, defect (boolean — 검출 사실, 등급 없음) }]
// variant: "device-detail" (긴 가로형, 채널명+검사대상명) | "realtime" (정사각형, 번호만)
// forceStrongAll: [11] 측정 중 — 모든 감육을 strong (true). [2]는 false (선택 카드만 strong)
// selectedTargetCard: [2] 카드 선택 컨텍스트 (forceStrongAll=false일 때만 유효)
window.ChannelGrid = function ChannelGrid({
  cells,
  totalCh,
  selectedCh,
  selectedTargetCard,      // (legacy) 단일 카드 string. selectedTargets 우선
  selectedTargets,          // v9.29 Wave D: array of target names (multi-select)
  variant = "device-detail",
  forceStrongAll = false,
  focusActive = false,
  onCellClick,
  onCellDoubleClick,
  title,
  showTitle = true,        // v9.7: 외부 erut-panel__header 사용 시 false로 — 제목 영역 제거
  showAttachCounters = true,
  showDefectLegend = true,
}) {
  // v9.29 Wave D: multi-select 정규화 — selectedTargets 우선, 없으면 legacy selectedTargetCard
  const targetSet = selectedTargets && selectedTargets.length > 0
    ? selectedTargets
    : (selectedTargetCard ? [selectedTargetCard] : []);
  const hasSelection = targetSet.length > 0;
  const isRealtime = variant === "realtime";
  const n = totalCh != null ? totalCh : cells.length;

  // 부착 상태 카운터 집계 (sensor.state 기준)
  const counts = cells.reduce((acc, c) => {
    const s = c.sensor;
    if (!s) acc.inactive += 1;
    else if (s.state === "warn") acc.weak += 1;
    else if (s.state === "err")  acc.unattached += 1;
    else acc.normal += 1;
    return acc;
  }, { normal: 0, weak: 0, unattached: 0, inactive: 0 });

  // v22.6: 감육 검출 카운트 (단일 — 등급 없음. 판정은 웹 책임)
  const detectCount = cells.filter(c => c.defect).length;

  const headerTitle = title || (n + "CH 채널 상태");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {/* v9.7: 헤더 — showTitle=true는 기존(제목+카운터 space-between) / false는 카운터만 좌측 정렬 */}
      {showTitle ? (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ font: "700 11px/1 var(--font-kr)", letterSpacing: "0.08em", color: "var(--content-low)", textTransform: "uppercase" }}>{headerTitle}</span>
          {showAttachCounters && (
            <div style={{ display: "flex", gap: 10, font: "700 11px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--system-success)" }}/>정상 {counts.normal}</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--system-caution)" }}/>약함 {counts.weak}</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--system-error)" }}/>나쁨 {counts.unattached}</span>
            </div>
          )}
        </div>
      ) : (
        showAttachCounters && (
          <div style={{ display: "flex", justifyContent: "flex-start", gap: 10, font: "700 11px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--system-success)" }}/>정상 {counts.normal}</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--system-caution)" }}/>약함 {counts.weak}</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--system-error)" }}/>나쁨 {counts.unattached}</span>
          </div>
        )
      )}

      {/* v9.33: 셀 그리드 — 64개 이하 자연 높이(스크롤 X), 64개 초과 시 60vh maxHeight + scroll */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(8, 1fr)",
        gap: isRealtime ? 3 : 6,
        maxHeight: isRealtime ? undefined : (cells.length > 64 ? "60vh" : undefined),
        overflowY: isRealtime ? undefined : (cells.length > 64 ? "auto" : "visible"),
        paddingRight: isRealtime ? 0 : (cells.length > 64 ? 4 : 0),
      }}>
        {cells.map((c) => {
          const s = c.sensor;
          const active = s != null;
          const warn = s && s.state === "warn";
          const err  = s && s.state === "err";
          const isSel = (c.id === selectedCh || c.num === selectedCh) && active;
          const isFocus = isSel && focusActive;
          const hasDefect = !!c.defect; // v22.6: 검출 사실(boolean) — 등급 없음
          // 교정 상태 — 교정 주기 초과(만료) 채널은 회색 breathe (감육과 독립)
          const needsCalibration = c.calibrationStatus === "expired";

          const clsParts = ["erut-ch-cell"];
          if (isSel) clsParts.push("is-active");
          if (isFocus) clsParts.push("is-focused");
          if (hasDefect) clsParts.push("is-defect"); // 셀 dim 제외 로직용 (시각 표시는 코너 마커)
          // v9.30: breathe — 교정 필요(red) 우선 / 그 외 신호 약함·나쁨(orange) breathe. (#21, [2] 한정)
          if (needsCalibration) clsParts.push("is-needs-calibration");
          else if (!isRealtime && (warn || err)) clsParts.push("is-signal-warn");

          // v9.10: 다른 카드의 정상 채널만 dim 0.6 (감육 채널은 유지). 카드 미선택 시 1.0
          // v9.29 Wave D: multi-select 지원 — 선택된 카드 외 정상 채널만 dim
          const isOtherCardNormal = hasSelection && c.targetName && !targetSet.includes(c.targetName) && !hasDefect;
          const cellOpacity = !active ? 0.55 : isOtherCardNormal ? 0.6 : 1;
          const cellStyle = isRealtime
            ? { aspectRatio: "1 / 1", opacity: cellOpacity, position: "relative", padding: "2px", gap: 0, justifyContent: "center", alignItems: "center" }
            : { aspectRatio: "20 / 7", opacity: cellOpacity, position: "relative", padding: "4px 8px", gap: 1, justifyContent: "center" };

          // 부착 LED dot 색
          const dotColor = !active ? "var(--surface-disabled)"
                          : err   ? "var(--system-error)"
                          : warn  ? "var(--system-caution)"
                                  : "var(--system-success)";

          return (
            <div
              key={c.id || c.num}
              className={clsParts.join(" ")}
              style={cellStyle}
              onClick={() => active && onCellClick && onCellClick(isRealtime ? c.num : (c.id || c.num))}
              onDoubleClick={() => active && onCellDoubleClick && onCellDoubleClick(isRealtime ? c.num : (c.id || c.num))}
            >
              {isRealtime ? (
                <>
                  {/* v22.6: 감육 검출 마커 — 좌상단 코너(단일·등급 없음) */}
                  {hasDefect && <span className="erut-ch-cell__flaw"/>}
                  {/* 부착 LED dot — 우상단 */}
                  <span style={{ position: "absolute", top: 2, right: 2, width: 5, height: 5, borderRadius: "50%", background: dotColor }}/>
                  {/* 채널 번호 (정사각형 셀) */}
                  <span style={{ font: "700 9px/1 var(--font-kr)", color: "var(--content-high)" }}>{c.num != null ? String(c.num).padStart(2, "0") : ""}</span>
                </>
              ) : needsCalibration ? (
                /* 재교정 필요 — 진회색 solid 셀(kit .is-needs-calibration) + 흰 텍스트 */
                <span style={{ font: "700 12px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-inverse)", width: "100%", textAlign: "center" }}>재교정 필요</span>
              ) : (
                <>
                  {/* v22.6: 감육 검출 마커 — 좌상단 코너(단일·등급 없음) */}
                  {hasDefect && <span className="erut-ch-cell__flaw"/>}
                  {/* v9.31: 위 = 채널명 + 통신 세기 LED dot / 중 = 검사 대상 (#3: Amp 4-bar 아이콘 삭제) */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span className="erut-ch-cell__val">{(c.id || ("ch" + String(c.num).padStart(2, "0"))).toUpperCase().replace("CH", "CH ")}</span>
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: dotColor, flexShrink: 0 }}/>
                  </div>
                  <span className="erut-ch-cell__id" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{active ? (c.targetName || "—") : "—"}</span>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* v9.32: 하단 범례 — '교정 필요' (breathe) + '선택됨' 인라인 (좌측 정렬) */}
      {showDefectLegend && (() => {
        const needsCalibCount = cells.filter(c => c.calibrationStatus === "expired").length;
        const signalWarnCount = cells.filter(c => c.sensor && (c.sensor.state === "warn" || c.sensor.state === "err")).length;
        return (
          <div style={{ display: "flex", gap: 14, marginTop: 4, font: "700 11px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
              <span style={{ position: "relative", width: 12, height: 12, border: "1px solid var(--border-medium)" }}><span style={{ position: "absolute", top: 0, left: 0, width: 0, height: 0, borderTop: "7px solid var(--system-error)", borderRight: "7px solid transparent" }}/></span>감육 검출 {detectCount}
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 12, height: 12, background: "rgba(255,0,94,0.30)", border: "1px solid var(--system-error)" }}/>교정 필요 {needsCalibCount}
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 12, height: 12, background: "rgba(255,146,0,0.30)", border: "1px solid var(--system-caution)" }}/>신호 약함·나쁨 {signalWarnCount}
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 12, height: 12, background: "linear-gradient(rgba(34,133,239,0.10),rgba(34,133,239,0.10)), var(--surface-subtle-2)", border: "1px solid var(--border-emphasis)" }}/>선택됨
            </span>
          </div>
        );
      })()}
    </div>
  );
};
