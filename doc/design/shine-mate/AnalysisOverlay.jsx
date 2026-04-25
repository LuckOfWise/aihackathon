// SHINE-MATE :: AI Analysis Overlay
// 顔写真の上に重ねるFaceMeshワイヤーフレーム+ 瞳・歯のバウンディングボックス
// + 走査ライン + テレメトリラベル
// progress: 0..1 で解析進行度を渡す。これにより mesh/box/labels が順次出現する。

function AnalysisOverlay({ progress = 1, intensity = 1 }) {
  // FaceMesh: 顔輪郭・目・鼻・口 のキーポイントを正規化座標で定義
  // 320x400 viewBox に揃える
  const meshPoints = React.useMemo(() => [
    // jaw line (左→右)
    [88,170],[90,200],[96,228],[108,254],[124,276],[144,290],[160,294],
    [176,290],[196,276],[212,254],[224,228],[230,200],[232,170],
    // forehead/hairline
    [98,140],[120,118],[148,108],[160,106],[172,108],[200,118],[222,140],
    // brows
    [114,150],[124,144],[134,143],[144,148],
    [176,148],[186,143],[196,144],[206,150],
    // eye contours L
    [120,170],[128,166],[134,165],[140,166],[148,170],[140,176],[134,177],[128,176],
    // eye contours R
    [172,170],[180,166],[186,165],[192,166],[200,170],[192,176],[186,177],[180,176],
    // nose
    [160,170],[160,184],[160,198],[152,206],[160,212],[168,206],
    // mouth
    [138,222],[148,218],[160,220],[172,218],[182,222],[174,228],[160,232],[146,228]
  ],[]);

  // mesh edges (index pairs)
  const edges = React.useMemo(() => {
    const e = [];
    // jaw
    for(let i=0;i<12;i++) e.push([i,i+1]);
    // hairline
    for(let i=13;i<19;i++) e.push([i,i+1]);
    e.push([0,13],[12,19]);
    // brows
    e.push([20,21],[21,22],[22,23],[24,25],[25,26],[26,27]);
    // eyes L
    e.push([28,29],[29,30],[30,31],[31,32],[32,33],[33,34],[34,35],[35,28]);
    // eyes R
    e.push([36,37],[37,38],[38,39],[39,40],[40,41],[41,42],[42,43],[43,36]);
    // nose
    e.push([44,45],[45,46],[46,47],[46,49],[47,48],[48,49]);
    // mouth
    e.push([50,51],[51,52],[52,53],[53,54],[54,55],[55,56],[56,57],[57,50]);
    // triangulation hints (cross connections for "mesh" feel)
    e.push([13,20],[19,27],[20,28],[27,36],[44,30],[44,38],[46,52],[50,32],[54,40]);
    return e;
  },[]);

  const meshOpacity = Math.min(1, Math.max(0, (progress - .05) / .35));
  const boxOpacity = Math.min(1, Math.max(0, (progress - .35) / .25));
  const labelOpacity = Math.min(1, Math.max(0, (progress - .55) / .25));
  const scanY = `${(progress * 100)}%`;

  return (
    <div style={{position:'absolute',inset:0,pointerEvents:'none'}}>
      {/* SVG mesh + boxes */}
      <svg viewBox="0 0 320 400" preserveAspectRatio="xMidYMid slice"
           style={{position:'absolute',inset:0,width:'100%',height:'100%'}}>
        <defs>
          <filter id="ai-glow">
            <feGaussianBlur stdDeviation="1.2"/>
            <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* FaceMesh edges */}
        <g opacity={meshOpacity * intensity} filter="url(#ai-glow)">
          {edges.map(([a,b],i)=>{
            const p1 = meshPoints[a], p2 = meshPoints[b];
            if (!p1 || !p2) return null;
            return <line key={i} x1={p1[0]} y1={p1[1]} x2={p2[0]} y2={p2[1]}
                         stroke="#00F2FF" strokeWidth=".4" opacity=".7"/>;
          })}
        </g>
        {/* FaceMesh vertices */}
        <g opacity={meshOpacity * intensity}>
          {meshPoints.map((p,i)=>(
            <circle key={i} cx={p[0]} cy={p[1]} r=".9" fill="#00F2FF"/>
          ))}
        </g>

        {/* Bounding boxes — eyes (left + right) and teeth */}
        <g opacity={boxOpacity}>
          {/* L eye */}
          <rect x="116" y="160" width="32" height="20" fill="none"
                stroke="#D4AF37" strokeWidth=".7" strokeDasharray="3 2"/>
          {/* corners */}
          {[[116,160],[148,160],[116,180],[148,180]].map(([x,y],i)=>{
            const dx = i%2===0 ? 1 : -1, dy = i<2 ? 1 : -1;
            return <g key={i}>
              <line x1={x} y1={y} x2={x+4*dx} y2={y} stroke="#D4AF37" strokeWidth="1.2"/>
              <line x1={x} y1={y} x2={x} y2={y+4*dy} stroke="#D4AF37" strokeWidth="1.2"/>
            </g>;
          })}
          {/* R eye */}
          <rect x="168" y="160" width="32" height="20" fill="none"
                stroke="#D4AF37" strokeWidth=".7" strokeDasharray="3 2"/>
          {[[168,160],[200,160],[168,180],[200,180]].map(([x,y],i)=>{
            const dx = i%2===0 ? 1 : -1, dy = i<2 ? 1 : -1;
            return <g key={`r${i}`}>
              <line x1={x} y1={y} x2={x+4*dx} y2={y} stroke="#D4AF37" strokeWidth="1.2"/>
              <line x1={x} y1={y} x2={x} y2={y+4*dy} stroke="#D4AF37" strokeWidth="1.2"/>
            </g>;
          })}
          {/* Teeth */}
          <rect x="136" y="216" width="48" height="20" fill="none"
                stroke="#D4AF37" strokeWidth=".7" strokeDasharray="3 2"/>
          {[[136,216],[184,216],[136,236],[184,236]].map(([x,y],i)=>{
            const dx = i%2===0 ? 1 : -1, dy = i<2 ? 1 : -1;
            return <g key={`t${i}`}>
              <line x1={x} y1={y} x2={x+4*dx} y2={y} stroke="#D4AF37" strokeWidth="1.2"/>
              <line x1={x} y1={y} x2={x} y2={y+4*dy} stroke="#D4AF37" strokeWidth="1.2"/>
            </g>;
          })}
        </g>

        {/* Coordinate ticks (top + left) */}
        <g opacity={meshOpacity * .6}>
          {[40,80,120,160,200,240,280].map(x=>(
            <g key={`tx${x}`}>
              <line x1={x} y1={0} x2={x} y2={4} stroke="#00F2FF" strokeWidth=".4"/>
              <text x={x+2} y={9} fontSize="5" fontFamily="ui-monospace,monospace"
                    fill="rgba(0,242,255,.65)" letterSpacing=".1em">{x}</text>
            </g>
          ))}
          {[60,120,180,240,300,360].map(y=>(
            <g key={`ty${y}`}>
              <line x1={0} y1={y} x2={4} y2={y} stroke="#00F2FF" strokeWidth=".4"/>
              <text x={6} y={y+2.5} fontSize="5" fontFamily="ui-monospace,monospace"
                    fill="rgba(0,242,255,.65)" letterSpacing=".1em">{y}</text>
            </g>
          ))}
        </g>

        {/* Reticle/crosshair on each eye + teeth center */}
        <g opacity={boxOpacity * .8}>
          {[[132,170],[186,170],[160,226]].map(([x,y],i)=>(
            <g key={i}>
              <circle cx={x} cy={y} r="1.5" fill="#D4AF37"/>
              <circle cx={x} cy={y} r="6" fill="none" stroke="#D4AF37" strokeWidth=".4"/>
              <line x1={x-10} y1={y} x2={x-3} y2={y} stroke="#D4AF37" strokeWidth=".5"/>
              <line x1={x+3} y1={y} x2={x+10} y2={y} stroke="#D4AF37" strokeWidth=".5"/>
              <line x1={x} y1={y-10} x2={x} y2={y-3} stroke="#D4AF37" strokeWidth=".5"/>
              <line x1={x} y1={y+3} x2={x} y2={y+10} stroke="#D4AF37" strokeWidth=".5"/>
            </g>
          ))}
        </g>
      </svg>

      {/* HTML labels overlaid on the boxes */}
      <div style={{position:'absolute',inset:0,fontFamily:'var(--mono)',fontSize:9,
                   letterSpacing:'.1em',color:'#D4AF37',opacity:labelOpacity}}>
        <div style={{position:'absolute',left:'36.25%',top:'37%',
                     transform:'translateY(-100%)',whiteSpace:'nowrap'}}>
          IRIS_L · 0.94 ▲12%
        </div>
        <div style={{position:'absolute',left:'52.5%',top:'37%',
                     transform:'translateY(-100%)',whiteSpace:'nowrap'}}>
          IRIS_R · 0.96 ▲14%
        </div>
        <div style={{position:'absolute',left:'42.5%',top:'59%',
                     whiteSpace:'nowrap'}}>
          DENTITION · 0.88 ▲ENAMEL
        </div>
      </div>

      {/* AI scan line */}
      {progress < 1 && (
        <div style={{position:'absolute',left:0,right:0,top:scanY,height:1.5,
                     background:'linear-gradient(90deg,transparent,rgba(0,242,255,.95),transparent)',
                     boxShadow:'0 0 16px rgba(0,242,255,.7), 0 0 40px rgba(0,242,255,.35)',
                     transition:'top .1s linear'}}/>
      )}

      {/* corner brackets framing the canvas */}
      <div style={{position:'absolute',inset:8,pointerEvents:'none'}}>
        {[
          {top:0,left:0,b:'top left'},
          {top:0,right:0,b:'top right'},
          {bottom:0,left:0,b:'bottom left'},
          {bottom:0,right:0,b:'bottom right'},
        ].map((s,i)=>(
          <div key={i} style={{position:'absolute',width:14,height:14,
            borderColor:'#D4AF37',borderStyle:'solid',borderWidth:0,
            ...(s.top===0?{top:0,borderTopWidth:'.5px'}:{}),
            ...(s.bottom===0?{bottom:0,borderBottomWidth:'.5px'}:{}),
            ...(s.left===0?{left:0,borderLeftWidth:'.5px'}:{}),
            ...(s.right===0?{right:0,borderRightWidth:'.5px'}:{}),
            opacity:.6
          }}/>
        ))}
      </div>
    </div>
  );
}

window.AnalysisOverlay = AnalysisOverlay;
