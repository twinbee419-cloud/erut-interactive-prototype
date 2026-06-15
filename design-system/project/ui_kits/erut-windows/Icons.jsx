// ERUT UI Kit — Icons. 24×24 monochrome line, stroke 1.5, currentColor.
// Match the existing source set: save, addMachine, setting, chevronDown,
// maximize, minimize, close, bolt, calendar, add, move, search, resize.

window.EIcon = {
  Save: (p) => (
    <svg viewBox="0 0 24 24" width={p?.size ?? 20} height={p?.size ?? 20} fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
      <path d="M5 4h11l3 3v13H5z"/><path d="M8 4v6h8V4"/><rect x="8" y="13" width="8" height="6"/>
    </svg>
  ),
  AddMachine: (p) => (
    <svg viewBox="0 0 24 24" width={p?.size ?? 20} height={p?.size ?? 20} fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
      <rect x="3" y="6" width="14" height="12"/><line x1="16" y1="12" x2="20" y2="12"/><line x1="18" y1="10" x2="18" y2="14"/>
    </svg>
  ),
  Setting: (p) => (
    <svg viewBox="0 0 24 24" width={p?.size ?? 20} height={p?.size ?? 20} fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h.1a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v.1a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>
    </svg>
  ),
  ChevronDown: (p) => (
    <svg viewBox="0 0 24 24" width={p?.size ?? 16} height={p?.size ?? 16} fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
      <polyline points="6,9 12,15 18,9"/>
    </svg>
  ),
  Maximize: (p) => (
    <svg viewBox="0 0 14 14" width={p?.size ?? 14} height={p?.size ?? 14} fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
      <rect x="2.5" y="2.5" width="9" height="9"/>
    </svg>
  ),
  Minimize: (p) => (
    <svg viewBox="0 0 14 14" width={p?.size ?? 14} height={p?.size ?? 14} fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
      <line x1="2" y1="10" x2="12" y2="10"/>
    </svg>
  ),
  Close: (p) => (
    <svg viewBox="0 0 14 14" width={p?.size ?? 14} height={p?.size ?? 14} fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
      <line x1="3" y1="3" x2="11" y2="11"/><line x1="11" y1="3" x2="3" y2="11"/>
    </svg>
  ),
  Bolt: (p) => (
    <svg viewBox="0 0 24 24" width={p?.size ?? 40} height={p?.size ?? 40} fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
      <path d="M13 2 L4 14 H11 L11 22 L20 10 H13 Z"/>
    </svg>
  ),
  Move: (p) => (
    <svg viewBox="0 0 24 24" width={p?.size ?? 40} height={p?.size ?? 40} fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
      <path d="M3 11 L6 8 L6 10 L18 10 L18 8 L21 11 L18 14 L18 12 L6 12 L6 14 Z"/>
      <path d="M11 3 L8 6 L10 6 L10 18 L8 18 L11 21 L14 18 L12 18 L12 6 L14 6 Z"/>
    </svg>
  ),
  Add: (p) => (
    <svg viewBox="0 0 24 24" width={p?.size ?? 20} height={p?.size ?? 20} fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  Calendar: (p) => (
    <svg viewBox="0 0 24 24" width={p?.size ?? 20} height={p?.size ?? 20} fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
      <rect x="3" y="5" width="18" height="16"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="8" y1="3" x2="8" y2="7"/><line x1="16" y1="3" x2="16" y2="7"/>
    </svg>
  ),
  Search: (p) => (
    <svg viewBox="0 0 24 24" width={p?.size ?? 20} height={p?.size ?? 20} fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
      <circle cx="11" cy="11" r="6"/><line x1="15" y1="15" x2="20" y2="20"/>
    </svg>
  ),
  ResizeCorner: (p) => (
    <svg viewBox="0 0 16 16" width={p?.size ?? 16} height={p?.size ?? 16} fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
      <line x1="2" y1="14" x2="14" y2="2"/><line x1="7" y1="14" x2="14" y2="7"/><line x1="12" y1="14" x2="14" y2="12"/>
    </svg>
  ),
  Wifi: (p) => (
    <svg viewBox="0 0 24 24" width={p?.size ?? 20} height={p?.size ?? 20} fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
      <path d="M5 12a10 10 0 0 1 14 0"/><path d="M8.5 15a5 5 0 0 1 7 0"/><circle cx="12" cy="18" r="1" fill="currentColor"/>
    </svg>
  ),
  Folder: (p) => (
    <svg viewBox="0 0 24 24" width={p?.size ?? 20} height={p?.size ?? 20} fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
      <path d="M3 6h6l2 2h10v12H3z"/>
    </svg>
  ),
  Play: (p) => (
    <svg viewBox="0 0 24 24" width={p?.size ?? 20} height={p?.size ?? 20} fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
      <polygon points="7,5 19,12 7,19"/>
    </svg>
  ),
  Pause: (p) => (
    <svg viewBox="0 0 24 24" width={p?.size ?? 20} height={p?.size ?? 20} fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
      <rect x="6" y="5" width="4" height="14"/><rect x="14" y="5" width="4" height="14"/>
    </svg>
  ),
  // ----- Added 2026-05-26 for interactive prototype -----
  Stop: (p) => (
    <svg viewBox="0 0 24 24" width={p?.size ?? 20} height={p?.size ?? 20} fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
      <rect x="6" y="6" width="12" height="12"/>
    </svg>
  ),
  Alert: (p) => (
    <svg viewBox="0 0 24 24" width={p?.size ?? 20} height={p?.size ?? 20} fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
      <path d="M12 3 L22 20 L2 20 Z"/><line x1="12" y1="10" x2="12" y2="15"/><circle cx="12" cy="17.5" r="0.6" fill="currentColor"/>
    </svg>
  ),
  // v21.0: 알림 센터 종 아이콘
  Bell: (p) => (
    <svg viewBox="0 0 24 24" width={p?.size ?? 20} height={p?.size ?? 20} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" {...p}>
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.7 21a2 2 0 0 1-3.4 0"/>
    </svg>
  ),
  ChevronLeft: (p) => (
    <svg viewBox="0 0 24 24" width={p?.size ?? 16} height={p?.size ?? 16} fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
      <polyline points="15,6 9,12 15,18"/>
    </svg>
  ),
  Layers: (p) => (
    <svg viewBox="0 0 24 24" width={p?.size ?? 20} height={p?.size ?? 20} fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
      <polygon points="12,2 22,8 12,14 2,8"/><polyline points="2,14 12,20 22,14"/>
    </svg>
  ),
  Camera: (p) => (
    <svg viewBox="0 0 24 24" width={p?.size ?? 20} height={p?.size ?? 20} fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
      <path d="M3 8h4l2-3h6l2 3h4v11H3z"/><circle cx="12" cy="13" r="3.5"/>
    </svg>
  ),
  Home: (p) => (
    <svg viewBox="0 0 24 24" width={p?.size ?? 20} height={p?.size ?? 20} fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
      <path d="M3 11 L12 3 L21 11 V20 H14 V14 H10 V20 H3 Z"/>
    </svg>
  ),
  // 보고서 출력 (file-text)
  Report: (p) => (
    <svg viewBox="0 0 24 24" width={p?.size ?? 20} height={p?.size ?? 20} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" {...p}>
      <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
      <polyline points="14 3 14 9 20 9"/>
      <line x1="8" y1="13" x2="16" y2="13"/>
      <line x1="8" y1="17" x2="16" y2="17"/>
    </svg>
  ),
  // 진단 / 로그 (activity / pulse)
  Diag: (p) => (
    <svg viewBox="0 0 24 24" width={p?.size ?? 20} height={p?.size ?? 20} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" {...p}>
      <polyline points="3 12 7 12 10 19 14 5 17 12 21 12"/>
    </svg>
  ),
};
