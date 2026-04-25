// SHINE-MATE :: Face placeholder SVG component (人型シルエット）
// 顔写真の代わりに使うプレースホルダー。瞳と歯の位置に座標マーカーが出せるよう
// 各パーツに data-attributes を付与してある。

function FacePlaceholder({ glow = false, dim = false, showLabel = true, style }) {
  return (
    <svg viewBox="0 0 320 400" preserveAspectRatio="xMidYMid slice"
         xmlns="http://www.w3.org/2000/svg"
         style={{ display:'block', width:'100%', height:'100%', ...style }}>
      <defs>
        <linearGradient id="bg-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1A1A22"/>
          <stop offset="100%" stopColor="#0A0A0E"/>
        </linearGradient>
        <pattern id="stripe" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="6" stroke="rgba(245,241,232,.04)" strokeWidth="1"/>
        </pattern>
        <radialGradient id="shine-eye-l" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1"/>
          <stop offset="40%" stopColor="#E8C76B" stopOpacity=".8"/>
          <stop offset="100%" stopColor="#D4AF37" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="shine-tooth" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity=".95"/>
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0"/>
        </radialGradient>
        <filter id="soft-glow">
          <feGaussianBlur stdDeviation="3"/>
          <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Background */}
      <rect width="320" height="400" fill="url(#bg-grad)"/>
      <rect width="320" height="400" fill="url(#stripe)"/>

      {/* Subject silhouette (head + shoulders) */}
      <g opacity={dim ? 0.55 : 0.85}>
        {/* shoulders */}
        <path d="M 30 400 C 50 320, 100 290, 160 290 C 220 290, 270 320, 290 400 Z"
              fill={dim ? "#1F1F26" : "#26262E"}/>
        {/* neck */}
        <rect x="138" y="240" width="44" height="60" fill={dim ? "#23232A" : "#2A2A32"}/>
        {/* head */}
        <ellipse cx="160" cy="170" rx="78" ry="92" fill={dim ? "#262630" : "#2E2E38"}/>
        {/* hair top */}
        <path d="M 90 140 C 95 80, 130 65, 160 65 C 195 65, 228 80, 232 142 C 220 110, 195 100, 160 100 C 125 100, 100 110, 90 140 Z"
              fill={dim ? "#15151B" : "#1B1B22"}/>
      </g>

      {/* Subtle face features (placeholder, not photoreal) */}
      <g opacity={dim ? 0.35 : 0.6}>
        {/* brows */}
        <path d="M 120 152 Q 134 146, 148 152" stroke="#0A0A0E" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <path d="M 172 152 Q 186 146, 200 152" stroke="#0A0A0E" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        {/* nose hint */}
        <path d="M 160 168 L 156 200 L 164 200 Z" fill="rgba(0,0,0,.18)"/>
        {/* mouth (closed/smile) */}
        <path d="M 138 222 Q 160 238, 182 222" stroke="rgba(0,0,0,.55)" strokeWidth="2" fill="none" strokeLinecap="round"/>
      </g>

      {/* EYES — primary AI target */}
      <g data-anatomy="eyes">
        {/* left eye socket */}
        <ellipse cx="134" cy="172" rx="14" ry="6" fill="#E8DFD0" opacity={dim ? 0.5 : 0.85}/>
        <circle cx="134" cy="172" r="5.5" fill={dim ? "#3A3025" : "#5A4625"}/>
        <circle cx="134" cy="172" r="2.8" fill="#0A0A0E"/>
        {glow && (
          <>
            <circle cx="132.5" cy="170.5" r="1.4" fill="#FFFFFF"/>
            <circle cx="134" cy="172" r="9" fill="url(#shine-eye-l)" filter="url(#soft-glow)"/>
          </>
        )}
        {/* right eye */}
        <ellipse cx="186" cy="172" rx="14" ry="6" fill="#E8DFD0" opacity={dim ? 0.5 : 0.85}/>
        <circle cx="186" cy="172" r="5.5" fill={dim ? "#3A3025" : "#5A4625"}/>
        <circle cx="186" cy="172" r="2.8" fill="#0A0A0E"/>
        {glow && (
          <>
            <circle cx="184.5" cy="170.5" r="1.4" fill="#FFFFFF"/>
            <circle cx="186" cy="172" r="9" fill="url(#shine-eye-l)" filter="url(#soft-glow)"/>
          </>
        )}
      </g>

      {/* TEETH — secondary AI target (shown on glow only, as smile) */}
      {glow && (
        <g data-anatomy="teeth">
          <path d="M 142 222 Q 160 240, 178 222 L 174 228 Q 160 236, 146 228 Z"
                fill="#FFFFFF" opacity=".95"/>
          {[148,154,160,166,172].map((x,i)=>(
            <line key={i} x1={x} y1="223" x2={x} y2="231" stroke="rgba(0,0,0,.18)" strokeWidth=".5"/>
          ))}
          <ellipse cx="160" cy="226" rx="20" ry="3" fill="url(#shine-tooth)"/>
        </g>
      )}

      {/* Placeholder caption (top-left, monospace) */}
      {showLabel && (
        <g>
          <rect x="12" y="12" width="116" height="22" fill="rgba(0,0,0,.55)" rx="2"/>
          <text x="20" y="27" fontFamily="ui-monospace, monospace" fontSize="9"
                letterSpacing=".15em" fill={glow ? "#D4AF37" : "rgba(245,241,232,.6)"}>
            {glow ? '★ AFTER · SHINE' : '◯ BEFORE · DRAFT'}
          </text>
        </g>
      )}
      {showLabel && (
        <text x="20" y="386" fontFamily="ui-monospace, monospace" fontSize="8"
              letterSpacing=".15em" fill="rgba(245,241,232,.4)">
          {'PORTRAIT_PLACEHOLDER · 1080×1350'}
        </text>
      )}
    </svg>
  );
}

window.FacePlaceholder = FacePlaceholder;
