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

// ----------- VERIFICATION DIALOG (NDT 1.9 결함 검증 재측정) ------------
// v9.18 — 추후 삭제 가능성 명시 (검사자 자율 판단 모드 전환 시 비활성화).
// 모듈 분리: [11] 결함 검출 핸들러에서 단일 호출. 제거 시 이 컴포넌트 + 호출부 한 곳만.
// 사양 근거: ASME V Article 4 T-433, ISO 17640 §11.2 — 결함 검출 시 검증 재측정 권장
// ERUT 고정형 특화: 위치 분리 불가 → 동일 위치 N회(5회) 반복 측정 + 분산 분석
window.VerificationDialog = function VerificationDialog({ channel, defectLevel, initialAmp, onClose, onConfirm, onRecalibrate }) {
  const [phase, setPhase] = _u("prompt"); // prompt | measuring | result
  const [results, setResults] = _u([]);

  const levelLabel = { critical: "Critical", major: "Major", minor: "Minor" }[defectLevel] || "결함";
  const levelColor = { critical: "var(--system-error)", major: "var(--system-caution)", minor: "var(--content-low)" }[defectLevel];

  // 5회 측정 시뮬레이션 (mock — 실제 백엔드 연동 시 교체)
  const startMeasure = () => {
    setPhase("measuring");
    setResults([]);
    const base = initialAmp || 90;
    const samples = [];
    const tick = (i) => {
      if (i >= 5) {
        const mean = samples.reduce((a, b) => a + b, 0) / samples.length;
        const sigma = Math.sqrt(samples.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / samples.length);
        setResults(samples);
        setPhase("result");
        return;
      }
      // 실제는 측정값. mock: base ± 2% 노이즈
      const v = base + (Math.random() - 0.5) * 4;
      samples.push(Math.round(v * 10) / 10);
      setResults([...samples]);
      setTimeout(() => tick(i + 1), 500);
    };
    tick(0);
  };

  const mean = results.length > 0 ? results.reduce((a, b) => a + b, 0) / results.length : 0;
  const sigma = results.length > 1 ? Math.sqrt(results.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / results.length) : 0;
  const sigmaPct = mean > 0 ? (sigma / mean) * 100 : 0;
  const isReliable = phase === "result" && sigmaPct < 5;

  return (
    <div className="erut-modal__backdrop" onClick={phase !== "measuring" ? onClose : undefined}>
      <div className="erut-modal" onClick={(e) => e.stopPropagation()} style={{ minWidth: 480, maxWidth: 540 }}>
        <div className="erut-modal__header" style={{ justifyContent: "space-between" }}>
          <span>결함 검증 재측정 — CH {String(channel).padStart(2, "0")}</span>
          {phase !== "measuring" && (
            <button onClick={onClose} aria-label="닫기" style={{ background: "transparent", border: "none", color: "var(--content-inverse)", cursor: "pointer", padding: 4, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
              <window.EIcon.Close size={14}/>
            </button>
          )}
        </div>
        <div className="erut-modal__body">
          {/* 결함 정보 */}
          <div style={{ padding: "10px 12px", background: "var(--surface-subtle-2)", border: "1px solid var(--border-low)", borderLeft: `3px solid ${levelColor}` }}>
            <div style={{ font: "700 13px/1.2 var(--font-kr)", letterSpacing: ".02em", color: levelColor }}>{levelLabel} 결함 검출</div>
            <div style={{ font: "400 11px/1.4 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-medium)", marginTop: 4 }}>
              CH {String(channel).padStart(2, "0")} · 초기 Amp <strong>{initialAmp}%</strong> · 임계값 80% 초과
            </div>
          </div>

          {phase === "prompt" && (
            <>
              <div style={{ font: "400 12px/1.5 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-medium)" }}>
                ASME V Article 4 T-433 표준에 따라 **검증 재측정**을 권장합니다. 동일 위치에서 <strong>5회 반복 측정</strong> 후 분산 분석으로 노이즈/오작동 여부를 확인합니다.
              </div>
            </>
          )}

          {phase === "measuring" && (
            <div style={{ padding: "16px 12px", textAlign: "center" }}>
              <div style={{ font: "700 14px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-emphasis)", marginBottom: 12 }}>측정 중... ({results.length} / 5)</div>
              <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
                {[0,1,2,3,4].map(i => (
                  <div key={i} style={{ width: 60, padding: "8px 4px", border: "1px solid var(--border-medium)", background: results[i] != null ? "var(--surface-subtle-2)" : "var(--surface-base)", font: "700 12px/1 var(--font-kr)", color: results[i] != null ? "var(--content-high)" : "var(--content-low)" }}>
                    {results[i] != null ? `${results[i]}%` : "—"}
                  </div>
                ))}
              </div>
            </div>
          )}

          {phase === "result" && (
            <div>
              <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 12 }}>
                {results.map((v, i) => (
                  <div key={i} style={{ width: 60, padding: "8px 4px", border: "1px solid var(--border-medium)", background: "var(--surface-subtle-2)", font: "700 12px/1 var(--font-kr)", color: "var(--content-high)", textAlign: "center" }}>{v}%</div>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, padding: "10px 12px", background: "var(--surface-subtle-1)", border: "1px solid var(--border-low)" }}>
                <div><div style={{ font: "400 10px/1 var(--font-kr)", color: "var(--content-low)" }}>평균 (Mean)</div><div style={{ font: "700 14px/1.2 var(--font-kr)", color: "var(--content-high)", marginTop: 4 }}>{mean.toFixed(1)}%</div></div>
                <div><div style={{ font: "400 10px/1 var(--font-kr)", color: "var(--content-low)" }}>표준편차 (σ)</div><div style={{ font: "700 14px/1.2 var(--font-kr)", color: "var(--content-high)", marginTop: 4 }}>{sigma.toFixed(2)}%</div></div>
                <div><div style={{ font: "400 10px/1 var(--font-kr)", color: "var(--content-low)" }}>변동 계수</div><div style={{ font: "700 14px/1.2 var(--font-kr)", color: "var(--content-high)", marginTop: 4 }}>{sigmaPct.toFixed(2)}%</div></div>
              </div>
              <div style={{ marginTop: 10, padding: "10px 12px", borderLeft: `3px solid ${isReliable ? "var(--system-success)" : "var(--system-caution)"}`, background: "var(--surface-base)" }}>
                <div style={{ font: "700 13px/1.2 var(--font-kr)", color: isReliable ? "var(--system-success)" : "var(--system-caution)" }}>
                  {isReliable ? "✓ 진짜 결함 — 신뢰 가능" : "⚠ 노이즈 의심 — 재교정 권장"}
                </div>
                <div style={{ font: "400 11px/1.4 var(--font-kr)", color: "var(--content-medium)", marginTop: 4 }}>
                  {isReliable ? "변동 계수 < 5% — 측정 시스템 안정. 결함을 보고서에 반영." : "변동 계수 ≥ 5% — 측정 시스템 drift 가능성. 탐촉자 재교정 후 재측정 권장."}
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="erut-modal__footer">
          {phase === "prompt" && (
            <>
              <window.Button variant="subtle" size="sm" onClick={onClose}>그대로 보고</window.Button>
              <window.Button variant="emphasis" size="sm" onClick={startMeasure}>검증 재측정 시작 (5회)</window.Button>
            </>
          )}
          {phase === "measuring" && (
            <span style={{ font: "400 11px/1 var(--font-kr)", color: "var(--content-low)" }}>측정 진행 중 — 잠시 대기</span>
          )}
          {phase === "result" && (
            <>
              <window.Button variant="subtle" size="sm" onClick={onClose}>닫기</window.Button>
              {!isReliable && <window.Button variant="default" size="sm" onClick={onRecalibrate}>재교정 진행</window.Button>}
              {isReliable && <window.Button variant="emphasis" size="sm" onClick={() => { onConfirm && onConfirm({ mean, sigma, sigmaPct }); onClose(); }}>결함 확정 보고</window.Button>}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// ----------- CHANNEL GRID ------------
// v9.5 (NDT 1.8): [2]·[11] 셀 그리드 통일 컴포넌트.
// cells: [{ id, num, sensor?, targetName?, defectLevel }]
// variant: "device-detail" (긴 가로형, 채널명+검사대상명) | "realtime" (정사각형, 번호만)
// forceStrongAll: [11] 측정 중 — 모든 결함을 strong (true). [2]는 false (선택 카드만 strong)
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

  // 결함 등급 카운터
  const defectCounts = cells.reduce((acc, c) => {
    if (c.defectLevel === "critical") acc.critical += 1;
    else if (c.defectLevel === "major") acc.major += 1;
    else if (c.defectLevel === "minor") acc.minor += 1;
    return acc;
  }, { critical: 0, major: 0, minor: 0 });

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
          const hasDefect = c.defectLevel != null;
          // [11]은 모든 결함 strong / [2]는 선택 카드의 결함만 strong
          // v9.29 Wave D: multi-select 지원 — targetSet 안의 카드 결함은 strong
          const isStrong = hasDefect && (forceStrongAll || (hasSelection && targetSet.includes(c.targetName)));
          // v9.30: 교정 상태 — 미교정/만료 채널은 major 컬러 breathe (결함과 독립)
          const needsCalibration = c.calibrationStatus === "uncalibrated" || c.calibrationStatus === "expired";

          const clsParts = ["erut-ch-cell"];
          if (isSel) clsParts.push("is-active");
          if (isFocus) clsParts.push("is-focused");
          if (hasDefect) {
            clsParts.push("is-defect-" + c.defectLevel);
            if (isStrong) clsParts.push("is-strong");
          }
          // v9.30: breathe 애니메이션은 결함 → 교정 상태로 이전
          if (needsCalibration) clsParts.push("is-needs-calibration");

          // v9.10: 다른 카드의 정상 채널만 dim 0.6 (결함 채널은 유지). 카드 미선택 시 1.0
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
                  {/* 부착 LED dot — 우상단 */}
                  <span style={{ position: "absolute", top: 2, right: 2, width: 5, height: 5, borderRadius: "50%", background: dotColor }}/>
                  {/* 채널 번호 (정사각형 셀) */}
                  <span style={{ font: "700 9px/1 var(--font-kr)", color: "var(--content-high)" }}>{c.num != null ? String(c.num).padStart(2, "0") : ""}</span>
                </>
              ) : (
                <>
                  {/* v9.31: 위 = 채널명 + 통신 세기 LED dot / 중 = 검사 대상 / 우하단 = Amp 4-bar 아이콘 */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span className="erut-ch-cell__val">{(c.id || ("ch" + String(c.num).padStart(2, "0"))).toUpperCase().replace("CH", "CH ")}</span>
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: dotColor, flexShrink: 0 }}/>
                  </div>
                  <span className="erut-ch-cell__id" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", paddingRight: 20 }}>{active ? (c.targetName || "—") : "—"}</span>
                  {/* 신호 세기 (Amp) — 셀룰러 4-bar 아이콘 (우하단). 0/20/40/60/80 임계로 0~4개 활성 */}
                  {active && s && s.amp != null && (() => {
                    const amp = s.amp;
                    const filled = amp >= 80 ? 4 : amp >= 60 ? 3 : amp >= 40 ? 2 : amp >= 20 ? 1 : 0;
                    const bars = [{ x: 0, h: 3 }, { x: 4, h: 5 }, { x: 8, h: 7 }, { x: 12, h: 9 }];
                    return (
                      <svg width="14" height="9" viewBox="0 0 14 9" style={{ position: "absolute", right: 6, bottom: 4 }} aria-label={`Amp ${amp}%`}>
                        {bars.map((b, i) => (
                          <rect key={i} x={b.x} y={9 - b.h} width="2" height={b.h} fill={i < filled ? "var(--content-high)" : "var(--border-medium)"}/>
                        ))}
                      </svg>
                    );
                  })()}
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* v9.32: 하단 범례 — '교정 필요' (breathe) + '선택됨' 인라인 (좌측 정렬) */}
      {showDefectLegend && (() => {
        const needsCalibCount = cells.filter(c => c.calibrationStatus === "uncalibrated" || c.calibrationStatus === "expired").length;
        return (
          <div style={{ display: "flex", gap: 14, marginTop: 4, font: "700 11px/1 var(--font-kr)", letterSpacing: ".02em", color: "var(--content-low)" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 12, height: 12, background: "rgba(107,124,155,0.32)", border: "1px solid var(--content-low)" }}/>교정 필요 {needsCalibCount}
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
