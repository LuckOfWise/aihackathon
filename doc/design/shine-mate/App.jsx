// SHINE-MATE :: App orchestration + Desktop demo shell

const ANALYSIS_LOG = [
  '▸ Booting SHINE-MATE engine v0.9.3',
  '▸ claude-haiku-4-5 · context loaded (1024 tok)',
  '▸ Detecting face geometry…',
  '✓ Face detected · confidence 0.97',
  '▸ Generating 478-point FaceMesh',
  '✓ Topology built · 478 vertices · 956 edges',
  '▸ Locating IRIS_L · IRIS_R',
  '✓ IRIS_L ⟶ (134,172) · area 168px²',
  '✓ IRIS_R ⟶ (186,172) · area 172px²',
  '▸ Segmenting DENTITION region',
  '✓ Enamel mask · 48×20 · ΔL* +18.4',
  '▸ Computing SHINE_INDEX',
  '✓ Δ ATTRACT = +38.4 pt',
  '▸ Asking Claude for editorial verdict…',
  '✓ Verdict received · "Quiet Radiance"',
  '✦ SHINE-MATE complete. Display.'
];

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [stage, setStage] = React.useState(t.startStage || 'hero');
  const [progress, setProgress] = React.useState(0);
  const [logIdx, setLogIdx] = React.useState(0);
  const [flash, setFlash] = React.useState(false);

  // Drive analysis progress
  React.useEffect(()=>{
    if (stage !== 'analyzing') return;
    setProgress(0);
    setLogIdx(0);
    const start = performance.now();
    const dur = 8000; // ~8 seconds
    let raf;
    const tick = (now) => {
      const p = Math.min(1,(now-start)/dur);
      setProgress(p);
      const targetLog = Math.min(ANALYSIS_LOG.length, Math.floor(p*ANALYSIS_LOG.length)+1);
      setLogIdx(targetLog);
      if (p < 1) raf = requestAnimationFrame(tick);
      else {
        setTimeout(()=>setStage('result'), 700);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  },[stage]);

  // Persist current stage as tweak so reload returns to it
  React.useEffect(()=>{
    if (stage !== 'analyzing') setTweak('startStage', stage);
  },[stage]);

  // Trigger flash only when transitioning INTO 'result' from 'analyzing'.
  // Track previous stage so manually navigating back to 'result' doesn't re-trigger
  // and doesn't leave a stuck white overlay.
  const prevStageRef = React.useRef(stage);
  React.useEffect(()=>{
    if (stage === 'result' && prevStageRef.current === 'analyzing') {
      setFlash(true);
      const id = setTimeout(()=>setFlash(false), 900);
      return ()=>clearTimeout(id);
    }
    prevStageRef.current = stage;
  },[stage]);

  const goto = (s) => setStage(s);

  // Visible log slice
  const visibleLog = ANALYSIS_LOG.slice(Math.max(0,logIdx-6), logIdx);

  return (
    <>
      <DesktopShell tweaks={t} stage={stage} onJumpStage={goto}>
        <PhoneFrame>
          {/* flash on result transition (only fires once on analyzing→result) */}
          {flash && (
            <div style={{position:'absolute',inset:0,background:'#FFFFFF',
                         pointerEvents:'none',opacity:0,
                         animation:'flash .9s ease-out forwards',zIndex:99}}/>
          )}
          {stage === 'hero' && <HeroScreen onStart={()=>goto('upload')}/>}
          {stage === 'upload' && <UploadScreen onPick={()=>goto('analyzing')} onBack={()=>goto('hero')}/>}
          {stage === 'analyzing' && <AnalyzingScreen progress={progress} log={visibleLog}
                                                     onBack={()=>goto('upload')}/>}
          {stage === 'result' && <ResultScreen onContinue={()=>goto('verdict')}
                                               onBack={()=>goto('analyzing')}/>}
          {stage === 'verdict' && <VerdictScreen onContinue={()=>goto('match')}
                                                 onBack={()=>goto('result')}
                                                 intensity={t.aiIntensity}/>}
          {stage === 'match' && <MatchScreen onRestart={()=>goto('hero')}
                                             onBack={()=>goto('verdict')}/>}
        </PhoneFrame>
      </DesktopShell>

      {/* Tweaks panel */}
      <TweaksPanel title="SHINE-MATE · Tweaks">
        <TweakSection label="Demo flow"/>
        <TweakSelect label="Stage"
                     value={stage}
                     options={[
                       {value:'hero',label:'01 · Hero'},
                       {value:'upload',label:'02 · Upload'},
                       {value:'analyzing',label:'03 · Analyzing'},
                       {value:'result',label:'04 · Before / After'},
                       {value:'verdict',label:'05 · Verdict'},
                       {value:'match',label:'06 · Match preview'},
                     ]}
                     onChange={goto}/>
        <TweakButton label="↻ Replay analysis (8s)"
                     onClick={()=>{ goto('analyzing'); }}/>

        <TweakSection label="Aesthetic"/>
        <TweakRadio label="Luxury level" value={t.luxury}
                    options={['静謐','中間','大胆']}
                    onChange={(v)=>setTweak('luxury',v)}/>
        <TweakSlider label="AI viz density" value={t.aiIntensity}
                     min={20} max={100} step={5} unit="%"
                     onChange={(v)=>setTweak('aiIntensity',v)}/>
        <TweakToggle label="Particles" value={t.particles}
                     onChange={(v)=>setTweak('particles',v)}/>
        <TweakToggle label="Show desktop chrome" value={t.showChrome}
                     onChange={(v)=>setTweak('showChrome',v)}/>

        <TweakSection label="Brand"/>
        <TweakColor label="Gold" value={t.goldColor}
                    onChange={(v)=>setTweak('goldColor',v)}/>
      </TweaksPanel>
    </>
  );
}

// ── Phone frame ──────────────────────────────────
function PhoneFrame({ children }) {
  return (
    <div style={{
      position:'relative',width:390,height:844,borderRadius:54,
      background:'#000',border:'10px solid #18181C',
      boxShadow:'0 0 0 1px rgba(212,175,55,.18), 0 40px 100px rgba(0,0,0,.7), 0 0 80px rgba(212,175,55,.08)',
      overflow:'hidden',flexShrink:0
    }}>
      {/* Dynamic Island */}
      <div style={{position:'absolute',top:11,left:'50%',transform:'translateX(-50%)',
                   width:120,height:34,borderRadius:18,background:'#000',zIndex:50,
                   pointerEvents:'none'}}/>
      <div style={{position:'absolute',inset:0,borderRadius:44,overflow:'hidden'}}>
        {children}
      </div>
      {/* home indicator */}
      <div style={{position:'absolute',bottom:8,left:'50%',transform:'translateX(-50%)',
                   width:134,height:5,borderRadius:3,background:'rgba(245,241,232,.4)',zIndex:60}}/>
    </div>
  );
}

// ── Desktop shell — pretends to be a presentation/demo panel ──
function DesktopShell({ tweaks, stage, onJumpStage, children }) {
  const stages = [
    {id:'hero',label:'Hero'},
    {id:'upload',label:'Upload'},
    {id:'analyzing',label:'Analysis'},
    {id:'result',label:'Reveal'},
    {id:'verdict',label:'Verdict'},
    {id:'match',label:'Match'},
  ];
  const idx = stages.findIndex(s=>s.id===stage);

  if (!tweaks.showChrome) {
    // bare mobile-only mode
    return (
      <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',
                   background:'radial-gradient(ellipse at center,#0A0A0E 0%,#000 70%)',padding:24}}>
        {children}
      </div>
    );
  }

  return (
    <div style={{minHeight:'100vh',display:'flex',flexDirection:'column',
                 background:`
                   radial-gradient(ellipse 800px 400px at 30% 0%, rgba(212,175,55,.07) 0%, transparent 60%),
                   radial-gradient(ellipse 600px 300px at 80% 100%, rgba(0,242,255,.04) 0%, transparent 60%),
                   var(--ink)`}}>

      {/* Header bar */}
      <header style={{padding:'24px 36px',display:'flex',justifyContent:'space-between',
                      alignItems:'center',borderBottom:'.5px solid var(--line)'}}>
        <div style={{display:'flex',alignItems:'center',gap:14}}>
          <div style={{width:32,height:32,borderRadius:'50%',
                       border:'.5px solid var(--gold)',
                       display:'flex',alignItems:'center',justifyContent:'center',
                       background:'radial-gradient(circle,rgba(212,175,55,.2),transparent 70%)'}}>
            <span className="diamond" style={{width:8,height:8}}/>
          </div>
          <div>
            <div style={{fontFamily:'var(--serif-en)',fontStyle:'italic',
                         fontSize:22,fontWeight:500,color:'var(--bone)',lineHeight:1,
                         letterSpacing:'-.01em'}}>
              SHINE-MATE
            </div>
            <div className="spec" style={{marginTop:3,color:'var(--bone-mute)'}}>
              全日本 AI ハッカソン 2026 · ENTRY №073
            </div>
          </div>
        </div>

        <nav style={{display:'flex',gap:0,border:'.5px solid var(--line)',borderRadius:999,padding:3}}>
          {stages.map((s,i)=>(
            <button key={s.id} onClick={()=>onJumpStage(s.id)} style={{
              padding:'7px 14px',borderRadius:999,border:0,
              background:i===idx?'var(--bone)':'transparent',
              color:i===idx?'var(--ink)':'var(--bone-dim)',
              fontFamily:'var(--mono)',fontSize:9.5,letterSpacing:'.12em',
              textTransform:'uppercase',fontWeight:i===idx?600:400,cursor:'pointer'
            }}>
              {String(i+1).padStart(2,'0')} {s.label}
            </button>
          ))}
        </nav>

        <div style={{display:'flex',alignItems:'center',gap:18}}>
          <div className="mono" style={{fontSize:9.5,letterSpacing:'.18em',
                                        color:'var(--bone-mute)'}}>
            <span style={{display:'inline-block',width:6,height:6,borderRadius:'50%',
                          background:'var(--ai)',marginRight:8,
                          boxShadow:'0 0 8px var(--ai)',
                          animation:'pulseHalo 1.6s ease-in-out infinite'}}/>
            CLAUDE · LIVE
          </div>
        </div>
      </header>

      {/* Main split */}
      <main style={{flex:1,display:'grid',gridTemplateColumns:'1fr 460px',gap:0,
                    minHeight:0}}>

        {/* Left: phone stage */}
        <div style={{position:'relative',display:'flex',alignItems:'center',
                     justifyContent:'center',padding:'40px',overflow:'hidden'}}>
          {/* corner specs */}
          <div className="mono" style={{position:'absolute',top:24,left:36,
                                        fontSize:9,letterSpacing:'.18em',color:'var(--bone-mute)'}}>
            ⟡ STAGE / iPhone 15 Pro · 390 × 844 @ 3x
          </div>
          <div className="mono" style={{position:'absolute',top:24,right:24,
                                        fontSize:9,letterSpacing:'.18em',color:'var(--bone-mute)'}}>
            FPS 60 · 16ms · ↑0.4MB/s
          </div>
          <div className="mono" style={{position:'absolute',bottom:24,left:36,
                                        fontSize:9,letterSpacing:'.18em',color:'var(--gold)'}}>
            <span className="diamond"/>&nbsp;&nbsp;{stages[idx]?.label.toUpperCase()}
          </div>
          <div className="mono" style={{position:'absolute',bottom:24,right:24,
                                        fontSize:9,letterSpacing:'.18em',color:'var(--bone-mute)'}}>
            STEP {String(idx+1).padStart(2,'0')} / {String(stages.length).padStart(2,'0')}
          </div>

          {/* radial halo behind phone */}
          <div style={{position:'absolute',width:600,height:600,borderRadius:'50%',
                       background:'radial-gradient(circle,rgba(212,175,55,.08),transparent 60%)',
                       pointerEvents:'none',animation:'pulseHalo 6s ease-in-out infinite'}}/>

          {children}
        </div>

        {/* Right: rationale panel */}
        <aside style={{borderLeft:'.5px solid var(--line)',padding:'40px 36px',
                       overflowY:'auto',background:'rgba(245,241,232,.012)'}}>
          <RationalePanel stage={stage}/>
        </aside>
      </main>

      {/* Footer ticker */}
      <footer style={{borderTop:'.5px solid var(--line)',padding:'14px 36px',
                      display:'flex',justifyContent:'space-between',alignItems:'center',
                      fontFamily:'var(--mono)',fontSize:9.5,letterSpacing:'.18em',
                      color:'var(--bone-mute)',textTransform:'uppercase'}}>
        <span>© 2026 SHINE-MATE TEAM</span>
        <span style={{display:'flex',gap:32}}>
          <span>テーマ <span style={{color:'var(--gold)'}}>輝</span></span>
          <span>AI活用度 <span style={{color:'var(--gold)'}}>★★★★★</span></span>
          <span>実装度 <span style={{color:'var(--gold)'}}>★★★★☆</span></span>
          <span>チャレンジ <span style={{color:'var(--gold)'}}>★★★★★</span></span>
        </span>
        <span>↑↓ ← → KEYBOARD NAV</span>
      </footer>
    </div>
  );
}

// ── Rationale panel — context per stage ─────────
function RationalePanel({ stage }) {
  const content = {
    hero: {
      heading:'01 · The Stage',
      jp:'なぜ漆黒なのか',
      body:'背景を漆黒（#050507）にすることで、AIが生成する「光」が物理的に最も際立ちます。これは単なる装飾ではなく、評価軸「テーマ沿性」の視覚的証明です。',
      bullets:[
        ['THEME','「輝」 — Internal Discovery'],
        ['PALETTE','Ink × Gold × Bone'],
        ['TYPE','Cormorant × Shippori 明朝'],
      ]
    },
    upload: {
      heading:'02 · The Submission',
      jp:'原石を、預かる',
      body:'アップロード前に「自然光・正面・素顔」のヒントを示し、解析の精度期待値を整える。マッチングアプリ文脈での「自分らしさ」と整合させています。',
      bullets:[
        ['ACCEPT','jpg / png / heic'],
        ['MAX','12MB'],
        ['ETA','≈ 12s'],
      ]
    },
    analyzing: {
      heading:'03 · Inside the Engine',
      jp:'AIの思考を、見せる',
      body:'評価軸「実装度・チャレンジ精神」に直結する画面。FaceMesh、瞳・歯のバウンディングボックス、座標グリッド、走査ライン、ライブログ — AIが「いま」動いている事実を、観客に物理的に見せます。',
      bullets:[
        ['VERTICES','478 points'],
        ['DETECT','iris × 2 · dentition × 1'],
        ['COLOR','#00F2FF（AI専用色）'],
      ]
    },
    result: {
      heading:'04 · The Reveal',
      jp:'静から動へ、一瞬の発光',
      body:'Before/Afterスライダー上を金色のパーティクルが追従。スライダー位置 > 50% で外周にゴールドのハロが灯り、観客は触覚的に「磨き」を実感します。',
      bullets:[
        ['EYE LUM.','+12%'],
        ['ENAMEL','+18%'],
        ['Δ ATTRACT','+38.4 pt'],
      ]
    },
    verdict: {
      heading:'05 · The Critique',
      jp:'AIの言葉を、権威に',
      body:'Claudeが生成する魅力分析テキストを、ファッション誌の批評として大胆なタイポで提示。AI出力をただの文字列ではなく「鑑定書」として権威化し、評価軸「AI活用度」の説得力に転化します。',
      bullets:[
        ['MODEL','claude-haiku-4-5'],
        ['TONE','Editorial / Fashion'],
        ['SEAL','SM seal · rotating dashed'],
      ]
    },
    match: {
      heading:'06 · The Outcome',
      jp:'マッチングアプリへ、輝きを実装',
      body:'磨き上げた一枚が、実際のマッチングアプリのカードとしてどう輝くかを即時プレビュー。SHINE-MATE VERIFIEDバッジで権威付けし、ライフハックとしての完成体を提示します。',
      bullets:[
        ['BADGE','VERIFIED · GRADE A'],
        ['EXPECTED','+ 2.4× match rate'],
        ['DEPLOY','via DeepLink → app'],
      ]
    },
  }[stage];

  return (
    <div style={{maxWidth:380,animation:'fadeUp .4s ease-out'}} key={stage}>
      <div className="spec" style={{color:'var(--gold)',marginBottom:16}}>
        <span className="diamond"/>&nbsp;&nbsp;DESIGN RATIONALE
      </div>

      <div style={{fontFamily:'var(--serif-en)',fontStyle:'italic',
                   fontSize:36,lineHeight:1,fontWeight:500,color:'var(--bone)',
                   marginBottom:8,letterSpacing:'-.02em'}}>
        {content.heading}
      </div>
      <div style={{fontFamily:'var(--serif-jp)',fontSize:18,
                   color:'var(--gold-soft)',marginBottom:24,letterSpacing:'.06em'}}>
        — {content.jp} —
      </div>

      <div style={{fontFamily:'var(--serif-jp)',fontSize:14,lineHeight:2,
                   color:'var(--bone-dim)',letterSpacing:'.04em',marginBottom:28}}>
        {content.body}
      </div>

      <div className="hair-gold" style={{marginBottom:20}}/>

      <div style={{display:'flex',flexDirection:'column',gap:12}}>
        {content.bullets.map(([k,v],i)=>(
          <div key={i} style={{display:'flex',justifyContent:'space-between',
                               alignItems:'baseline',padding:'8px 0',
                               borderBottom:'.5px solid var(--line)'}}>
            <div className="spec">{k}</div>
            <div style={{fontFamily:'var(--serif-en)',fontStyle:'italic',
                         fontSize:15,color:'var(--bone)'}}>
              {v}
            </div>
          </div>
        ))}
      </div>

      {/* judging axes */}
      <div style={{marginTop:32,padding:18,border:'.5px solid var(--line)',borderRadius:10,
                   background:'rgba(212,175,55,.03)'}}>
        <div className="spec" style={{color:'var(--gold)',marginBottom:10}}>
          審査軸との整合性
        </div>
        {[
          ['テーマ沿性','内なる輝きの可視化'],
          ['実装度','FaceMesh + Live log'],
          ['チャレンジ精神','AI思考プロセス可視化'],
          ['AI活用度','Claude鑑定書として権威化'],
        ].map(([k,v],i)=>(
          <div key={i} style={{display:'flex',justifyContent:'space-between',
                               fontSize:11,padding:'6px 0',
                               borderTop:i===0?'none':'.5px solid var(--line)'}}>
            <span style={{fontFamily:'var(--serif-jp)',color:'var(--bone)'}}>{k}</span>
            <span style={{fontFamily:'var(--mono)',fontSize:9.5,letterSpacing:'.1em',
                          color:'var(--bone-mute)'}}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

window.App = App;
