// SHINE-MATE :: Mobile screens (Hero, Upload, Analyzing, Result, Verdict, Match)
// All screens fit a 390x844 mobile artboard.

const STAGES = ['hero','upload','analyzing','result','verdict','match'];

// ── Status bar ─────────────────────────────────────
function StatusBar({ tone='light' }) {
  const c = tone==='light' ? 'rgba(245,241,232,.92)' : 'rgba(10,10,14,.92)';
  return (
    <div style={{height:44,padding:'0 22px',display:'flex',alignItems:'center',
                 justifyContent:'space-between',color:c,fontFamily:'var(--sans)',
                 fontWeight:600,fontSize:13.5,letterSpacing:'.02em',
                 fontVariantNumeric:'tabular-nums'}}>
      <span>22:14</span>
      <div style={{display:'flex',alignItems:'center',gap:6,opacity:.95}}>
        {/* signal */}
        <svg width="17" height="11" viewBox="0 0 17 11"><g fill={c}>
          <rect x="0" y="7" width="3" height="4" rx=".5"/>
          <rect x="4.5" y="5" width="3" height="6" rx=".5"/>
          <rect x="9" y="2.5" width="3" height="8.5" rx=".5"/>
          <rect x="13.5" y="0" width="3" height="11" rx=".5"/>
        </g></svg>
        {/* battery */}
        <svg width="26" height="11" viewBox="0 0 26 11">
          <rect x=".5" y=".5" width="22" height="10" rx="2.5" fill="none" stroke={c} opacity=".5"/>
          <rect x="2" y="2" width="18" height="7" rx="1.2" fill={c}/>
          <rect x="23" y="3.5" width="2" height="4" rx=".7" fill={c} opacity=".5"/>
        </svg>
      </div>
    </div>
  );
}

// ── Hero / Landing ────────────────────────────────
function HeroScreen({ onStart }) {
  return (
    <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',
                 background:'radial-gradient(ellipse at 50% 30%, rgba(212,175,55,.18) 0%, transparent 55%), var(--ink)'}}>
      <StatusBar/>

      {/* hero ornaments — drifting particles */}
      <div style={{position:'absolute',inset:0,overflow:'hidden',pointerEvents:'none'}}>
        {Array.from({length:24}).map((_,i)=>{
          const x = (i*37)%100, y = (i*53)%100, size = .8+((i*7)%4)*.4;
          return <span key={i} style={{
            position:'absolute',left:`${x}%`,top:`${y}%`,width:size,height:size,
            borderRadius:'50%',background:'#E8C76B',
            boxShadow:'0 0 8px rgba(232,199,107,.7)',
            animation:`drift ${6+(i%5)}s ease-in-out infinite`,
            animationDelay:`${i*.2}s`,opacity:.3+((i%4)*.15)
          }}/>;
        })}
      </div>

      <div style={{flex:1,display:'flex',flexDirection:'column',justifyContent:'space-between',
                   padding:'36px 28px 40px',position:'relative'}}>
        <div>
          <div className="spec" style={{color:'var(--gold)',marginBottom:18}}>
            <span className="diamond"/>&nbsp;&nbsp;SHINE-MATE&nbsp;&nbsp;·&nbsp;&nbsp;EST. 2026
          </div>
          <div className="spec" style={{color:'var(--bone-mute)'}}>
            ALL-JAPAN AI HACKATHON · OFFICIAL ENTRY №073
          </div>
        </div>

        {/* Big serif headline */}
        <div style={{marginTop:24,marginBottom:24}}>
          <div style={{fontFamily:'var(--serif-jp)',fontSize:13,letterSpacing:'.4em',
                       color:'var(--gold-soft)',marginBottom:14,fontWeight:500}}>
            其ノ瞳ハ、未ダ磨カレザル
          </div>
          <h1 style={{fontFamily:'var(--serif-en)',fontWeight:500,color:'var(--bone)',
                      fontSize:88,lineHeight:.86,letterSpacing:'-.02em',margin:0}}>
            <em style={{fontStyle:'italic',color:'var(--gold)',fontWeight:400}}>Shine</em><br/>
            from<br/>
            <span style={{fontFamily:'var(--serif-jp)',fontSize:64,letterSpacing:'.04em'}}>内側</span>
          </h1>
          <div style={{marginTop:22,fontFamily:'var(--serif-jp)',fontSize:15,
                       lineHeight:1.85,color:'var(--bone-dim)',maxWidth:300}}>
            くすんだ日常の一枚を、<br/>
            ダイヤモンドの輝きへ。<br/>
            AIが、あなたの「未だ磨かれざる魅力」を<br/>
            発掘し、発光させます。
          </div>
        </div>

        <div>
          <button onClick={onStart} className="btn-gold" style={{width:'100%',height:56,fontSize:12}}>
            写真をアップロードして始める →
          </button>
          <div style={{marginTop:16,display:'flex',justifyContent:'space-between',
                       fontFamily:'var(--mono)',fontSize:9.5,letterSpacing:'.18em',
                       color:'var(--bone-mute)',textTransform:'uppercase'}}>
            <span>v0.9.3 · BETA</span>
            <span>POWERED BY CLAUDE</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Upload screen ────────────────────────────────
function UploadScreen({ onPick, onBack }) {
  return (
    <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',
                 background:'var(--ink)'}}>
      <StatusBar/>
      <NavHeader onBack={onBack} index="01" total="03" label="UPLOAD"/>

      <div style={{padding:'12px 24px 24px',flex:1,display:'flex',flexDirection:'column'}}>
        <h2 style={{fontFamily:'var(--serif-jp)',fontSize:30,fontWeight:500,
                    color:'var(--bone)',margin:'8px 0 6px',letterSpacing:'.02em',lineHeight:1.25}}>
          原石を、<br/>差し出してください。
        </h2>
        <p style={{fontFamily:'var(--sans)',fontSize:13,lineHeight:1.7,
                   color:'var(--bone-dim)',margin:'8px 0 24px'}}>
          顔がはっきりと写った、自然光下の一枚を推奨します。<br/>
          解析時間：約 12 秒。
        </p>

        {/* Drop zone */}
        <button onClick={onPick} style={{
          flex:1,minHeight:340,border:'.5px dashed var(--line-2)',borderRadius:18,
          background:'linear-gradient(180deg,rgba(212,175,55,.04),transparent 60%)',
          display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',
          cursor:'pointer',color:'var(--bone)',position:'relative',overflow:'hidden'
        }}>
          {/* corner brackets */}
          {[{t:0,l:0},{t:0,r:0},{b:0,l:0},{b:0,r:0}].map((s,i)=>(
            <div key={i} style={{position:'absolute',width:18,height:18,
              borderColor:'var(--gold)',borderStyle:'solid',borderWidth:0,
              top:s.t===0?14:'auto',bottom:s.b===0?14:'auto',
              left:s.l===0?14:'auto',right:s.r===0?14:'auto',
              borderTopWidth:s.t===0?'.5px':0,
              borderBottomWidth:s.b===0?'.5px':0,
              borderLeftWidth:s.l===0?'.5px':0,
              borderRightWidth:s.r===0?'.5px':0,
            }}/>
          ))}
          <div style={{width:64,height:64,borderRadius:'50%',
                       border:'.5px solid var(--gold)',display:'flex',alignItems:'center',
                       justifyContent:'center',marginBottom:16,
                       background:'radial-gradient(circle,rgba(212,175,55,.15),transparent 70%)'}}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M11 2v14m0-14L5 8m6-6l6 6M3 18h16" stroke="var(--gold)" strokeWidth="1"/>
            </svg>
          </div>
          <div style={{fontFamily:'var(--serif-jp)',fontSize:16,letterSpacing:'.05em',
                       color:'var(--bone)',marginBottom:6}}>
            タップして写真を選ぶ
          </div>
          <div className="spec" style={{color:'var(--bone-mute)'}}>JPG · PNG · HEIC · ≤ 12MB</div>
        </button>

        {/* Hints row */}
        <div style={{marginTop:18,display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10}}>
          {[
            {k:'明所',v:'Bright'},
            {k:'正面',v:'Front'},
            {k:'素顔',v:'Bare'}
          ].map((h,i)=>(
            <div key={i} style={{padding:'12px 10px',borderRadius:10,
                                 border:'.5px solid var(--line)',textAlign:'center'}}>
              <div style={{fontFamily:'var(--serif-jp)',fontSize:14,color:'var(--bone)'}}>{h.k}</div>
              <div className="spec" style={{marginTop:4}}>{h.v}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Analyzing screen ─────────────────────────────
function AnalyzingScreen({ progress, log, onBack }) {
  const pct = Math.round(progress*100);
  return (
    <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',
                 background:'var(--ink)'}}>
      <StatusBar/>
      <NavHeader onBack={onBack} index="02" total="03" label="ANALYZING" hideBack/>

      <div style={{padding:'8px 20px 20px',flex:1,display:'flex',flexDirection:'column'}}>
        {/* photo + overlay */}
        <div style={{position:'relative',aspectRatio:'320/400',borderRadius:14,
                     overflow:'hidden',border:'.5px solid var(--line-2)',
                     boxShadow:'0 0 60px rgba(0,242,255,.18)'}}>
          <FacePlaceholder dim={true} showLabel={false}/>
          <AnalysisOverlay progress={progress}/>
          {/* blue tint pulse */}
          <div style={{position:'absolute',inset:0,
                       background:'radial-gradient(ellipse at center, rgba(0,242,255,.08), transparent 65%)',
                       animation:'pulseHalo 2s ease-in-out infinite',pointerEvents:'none'}}/>
        </div>

        {/* progress + headline */}
        <div style={{marginTop:18,display:'flex',justifyContent:'space-between',
                     alignItems:'baseline'}}>
          <div style={{fontFamily:'var(--serif-jp)',fontSize:20,color:'var(--bone)',letterSpacing:'.04em'}}>
            魅力を、解析中。
          </div>
          <div className="mono" style={{fontSize:24,color:'var(--ai)',
                                        textShadow:'0 0 12px rgba(0,242,255,.5)',
                                        letterSpacing:'.05em'}}>
            {String(pct).padStart(2,'0')}<span style={{fontSize:13,opacity:.7}}>%</span>
          </div>
        </div>

        {/* progress bar */}
        <div style={{marginTop:10,height:2,background:'var(--line)',position:'relative',
                     overflow:'hidden',borderRadius:2}}>
          <div style={{position:'absolute',left:0,top:0,bottom:0,width:`${pct}%`,
                       background:'linear-gradient(90deg,var(--ai),var(--gold))',
                       boxShadow:'0 0 12px rgba(0,242,255,.6)',transition:'width .15s'}}/>
        </div>

        {/* live log */}
        <div className="mono" style={{marginTop:14,padding:'12px 14px',
                                      border:'.5px solid var(--line)',borderRadius:10,
                                      background:'rgba(0,242,255,.02)',fontSize:10,
                                      lineHeight:1.7,color:'var(--bone-dim)',
                                      letterSpacing:'.04em',height:118,overflow:'hidden'}}>
          {log.map((line,i)=>(
            <div key={i} style={{
              opacity: i===log.length-1 ? 1 : .55,
              color: line.startsWith('✓') ? 'var(--gold)' : (line.startsWith('▸') ? 'var(--ai)' : 'var(--bone-dim)'),
              animation: i===log.length-1 ? 'fadeUp .35s ease-out' : 'none'
            }}>
              <span style={{color:'var(--bone-mute)',marginRight:8}}>
                [{String(Math.min(99,Math.floor(progress*60+i*2))).padStart(2,'0')}.{String((i*173)%99).padStart(2,'0')}]
              </span>
              {line}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Result (Before/After slider) ─────────────────
function ResultScreen({ onContinue, onBack }) {
  const [pos, setPos] = React.useState(60);
  const [dragging, setDragging] = React.useState(false);
  const wrapRef = React.useRef(null);

  const onMove = (clientX) => {
    if(!wrapRef.current) return;
    const r = wrapRef.current.getBoundingClientRect();
    const p = Math.max(0,Math.min(100, ((clientX-r.left)/r.width)*100));
    setPos(p);
  };
  const onDown = (e) => {
    setDragging(true);
    const cx = e.touches ? e.touches[0].clientX : e.clientX;
    onMove(cx);
    const move = (ev) => onMove(ev.touches ? ev.touches[0].clientX : ev.clientX);
    const up = () => {
      setDragging(false);
      window.removeEventListener('pointermove',move);
      window.removeEventListener('pointerup',up);
    };
    window.addEventListener('pointermove',move);
    window.addEventListener('pointerup',up);
  };

  return (
    <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',
                 background:'var(--ink)'}}>
      <StatusBar/>
      <NavHeader onBack={onBack} index="03" total="03" label="VERDICT"/>

      <div style={{padding:'8px 20px 18px',flex:1,display:'flex',flexDirection:'column'}}>
        <div className="spec" style={{color:'var(--gold)',marginBottom:6}}>
          <span className="diamond"/>&nbsp;&nbsp;SHINE INDEX&nbsp;·&nbsp;+ 38.4 PT
        </div>
        <h2 style={{fontFamily:'var(--serif-jp)',fontSize:26,fontWeight:500,
                    color:'var(--bone)',margin:'4px 0 14px',letterSpacing:'.02em',lineHeight:1.3}}>
          発光、完了。<br/>
          <span style={{fontFamily:'var(--serif-en)',fontStyle:'italic',color:'var(--gold)',fontSize:32}}>
            Behold.
          </span>
        </h2>

        {/* B/A slider */}
        <div ref={wrapRef} onPointerDown={onDown}
             style={{position:'relative',aspectRatio:'320/400',borderRadius:14,
                     overflow:'hidden',border:'.5px solid var(--line-2)',cursor:'ew-resize',
                     boxShadow:pos>50 ? '0 0 80px rgba(212,175,55,.25)' : 'none',
                     transition:'box-shadow .3s'}}>
          {/* AFTER (full) */}
          <div style={{position:'absolute',inset:0}}><FacePlaceholder glow={true} showLabel={false}/></div>
          {/* BEFORE clipped */}
          <div style={{position:'absolute',inset:0,clipPath:`inset(0 ${100-pos}% 0 0)`}}>
            <FacePlaceholder dim={true} showLabel={false}/>
          </div>
          {/* divider */}
          <div style={{position:'absolute',top:0,bottom:0,left:`${pos}%`,width:1,
                       background:'var(--gold)',
                       boxShadow:'0 0 12px rgba(212,175,55,.7)',
                       transform:'translateX(-.5px)'}}>
            {/* handle */}
            <div style={{position:'absolute',top:'50%',left:'50%',
                         transform:'translate(-50%,-50%)',
                         width:36,height:36,borderRadius:'50%',
                         background:'rgba(10,10,14,.85)',
                         border:'.5px solid var(--gold)',
                         display:'flex',alignItems:'center',justifyContent:'center',
                         backdropFilter:'blur(8px)',
                         boxShadow:'0 0 24px rgba(212,175,55,.5), 0 4px 12px rgba(0,0,0,.5)'}}>
              <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                <path d="M5 1L1 5l4 4M9 1l4 4-4 4" stroke="var(--gold)" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
            </div>
          </div>
          {/* labels */}
          <div className="mono" style={{position:'absolute',top:14,left:14,padding:'4px 8px',
                                        background:'rgba(10,10,14,.7)',borderRadius:2,
                                        fontSize:9,letterSpacing:'.18em',color:'var(--bone-dim)',
                                        opacity:pos>15?1:0,transition:'opacity .2s'}}>
            ◯ BEFORE
          </div>
          <div className="mono" style={{position:'absolute',top:14,right:14,padding:'4px 8px',
                                        background:'rgba(10,10,14,.7)',borderRadius:2,
                                        fontSize:9,letterSpacing:'.18em',color:'var(--gold)',
                                        opacity:pos<85?1:0,transition:'opacity .2s'}}>
            ★ AFTER
          </div>
          {/* shimmer particles when dragging or shine on right side */}
          {(dragging||pos>40) && (
            <div style={{position:'absolute',top:0,bottom:0,left:`${pos}%`,width:140,
                         pointerEvents:'none',transform:'translateX(-30px)'}}>
              {Array.from({length:14}).map((_,i)=>(
                <span key={i} style={{position:'absolute',
                  left:`${(i*23)%100}%`,top:`${(i*17)%100}%`,
                  width:2,height:2,borderRadius:'50%',background:'#E8C76B',
                  boxShadow:'0 0 6px #E8C76B',
                  animation:`shimmer ${1.6+(i%3)*.4}s ease-out infinite`,
                  animationDelay:`${(i%5)*.15}s`}}/>
              ))}
            </div>
          )}
        </div>

        {/* metric strip */}
        <div style={{marginTop:14,display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:1,
                     border:'.5px solid var(--line)',borderRadius:10,overflow:'hidden',
                     background:'var(--line)'}}>
          {[
            {k:'EYE LUMINANCE',v:'+12%',j:'瞳の輝き'},
            {k:'ENAMEL CHROMA',v:'+18%',j:'歯の白さ'},
            {k:'ATTRACT INDEX',v:'+38.4',j:'魅力指数'}
          ].map((m,i)=>(
            <div key={i} style={{background:'var(--ink)',padding:'12px 10px'}}>
              <div className="mono" style={{fontSize:16,color:'var(--gold)',
                                            letterSpacing:'.02em'}}>{m.v}</div>
              <div className="spec" style={{marginTop:4,fontSize:8.5}}>{m.k}</div>
              <div style={{fontFamily:'var(--serif-jp)',fontSize:11,color:'var(--bone-dim)',marginTop:2}}>
                {m.j}
              </div>
            </div>
          ))}
        </div>

        <button onClick={onContinue} className="btn-gold"
                style={{marginTop:14,width:'100%',height:50,fontSize:11}}>
          AIによる魅力鑑定書を読む →
        </button>
      </div>
    </div>
  );
}

// ── Verdict (Claude's fashion-magazine critique) ─
function VerdictScreen({ onContinue, onBack, intensity }) {
  return (
    <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',
                 background:'linear-gradient(180deg,#0E0A02 0%,var(--ink) 40%)'}}>
      <StatusBar/>
      <NavHeader onBack={onBack} index="·" total="·" label="VERDICT BY CLAUDE"/>

      <div style={{padding:'4px 20px 18px',flex:1,overflow:'auto'}}>
        {/* magazine masthead */}
        <div style={{borderTop:'.5px solid var(--gold)',borderBottom:'.5px solid var(--gold)',
                     padding:'10px 0',display:'flex',justifyContent:'space-between',
                     fontFamily:'var(--mono)',fontSize:8.5,letterSpacing:'.22em',
                     color:'var(--gold)',textTransform:'uppercase',marginBottom:18}}>
          <span>VOL. ИХ</span>
          <span>SHINE-MATE QUARTERLY</span>
          <span>26 / SS</span>
        </div>

        {/* Big editorial headline */}
        <div style={{textAlign:'center',marginBottom:18}}>
          <div style={{fontFamily:'var(--serif-en)',fontStyle:'italic',
                       fontSize:14,color:'var(--gold-soft)',letterSpacing:'.18em',
                       textTransform:'uppercase',marginBottom:6}}>
            — On the matter of —
          </div>
          <h1 style={{fontFamily:'var(--serif-en)',fontWeight:500,
                      fontSize:52,lineHeight:.92,letterSpacing:'-.02em',color:'var(--bone)',
                      margin:'0 0 4px'}}>
            <em style={{fontStyle:'italic'}}>Quiet</em><br/>
            Radiance,
          </h1>
          <div style={{fontFamily:'var(--serif-jp)',fontSize:14,letterSpacing:'.4em',
                       color:'var(--gold)',marginTop:10}}>
            静カナル、爆発。
          </div>
        </div>

        {/* Critique body — with drop cap */}
        <div style={{fontFamily:'var(--serif-jp)',fontSize:14,lineHeight:2.0,
                     color:'var(--bone)',letterSpacing:'.04em',marginBottom:18}}>
          <span style={{float:'left',fontFamily:'var(--serif-en)',fontStyle:'italic',
                        fontSize:62,lineHeight:.78,color:'var(--gold)',
                        marginRight:8,marginTop:4,fontWeight:500}}>こ</span>
          のひと、目で語る人だ。瞳の奥に小さな星が一つ、ちゃんと棲んでいる。
          歯のラインは雨上がりのような清潔さで、笑った瞬間、街全体の彩度が0.3上がる。
          <br/><br/>
          結論：<em style={{fontFamily:'var(--serif-en)',fontStyle:'italic',color:'var(--gold)'}}>
          A diamond, mid-cut.</em> 磨けば、磨くほど、化ける。
        </div>

        {/* signature card */}
        <div style={{border:'.5px solid var(--gold)',borderRadius:4,padding:'14px 16px',
                     background:'linear-gradient(180deg,rgba(212,175,55,.06),transparent)',
                     display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:18}}>
          <div>
            <div className="spec" style={{color:'var(--bone-mute)',marginBottom:2}}>SIGNED</div>
            <div style={{fontFamily:'var(--serif-en)',fontStyle:'italic',fontSize:22,
                         color:'var(--gold)',letterSpacing:'.04em'}}>Claude, c.</div>
            <div className="mono" style={{fontSize:8.5,marginTop:2,color:'var(--bone-mute)',
                                          letterSpacing:'.18em'}}>
              MODEL: claude-haiku-4-5
            </div>
          </div>
          {/* seal */}
          <div style={{width:54,height:54,borderRadius:'50%',
                       border:'.5px solid var(--gold)',display:'flex',alignItems:'center',
                       justifyContent:'center',position:'relative',
                       background:'radial-gradient(circle,rgba(212,175,55,.18),transparent 70%)'}}>
            <span style={{fontFamily:'var(--serif-en)',fontStyle:'italic',
                          fontSize:16,color:'var(--gold)'}}>SM</span>
            <div style={{position:'absolute',inset:-6,borderRadius:'50%',
                         border:'.5px dashed var(--gold)',opacity:.4,
                         animation:'rotate360 24s linear infinite'}}/>
          </div>
        </div>

        {/* Tag chips */}
        <div style={{display:'flex',flexWrap:'wrap',gap:6,marginBottom:18}}>
          {['#QuietRadiance','#MidCutDiamond','#SmilePotential','#内なる発光','#瞳力'].map(t=>(
            <span key={t} style={{fontFamily:'var(--mono)',fontSize:9.5,letterSpacing:'.1em',
                  color:'var(--gold-soft)',padding:'5px 10px',
                  border:'.5px solid var(--line-2)',borderRadius:999}}>
              {t}
            </span>
          ))}
        </div>

        <button onClick={onContinue} className="btn-gold" style={{width:'100%',height:50,fontSize:11}}>
          マッチング画面で輝かせる →
        </button>
      </div>
    </div>
  );
}

// ── Match preview ───────────────────────────────
function MatchScreen({ onRestart, onBack }) {
  return (
    <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',
                 background:'var(--ink)'}}>
      <StatusBar/>
      <NavHeader onBack={onBack} label="LIVE PREVIEW"/>

      <div style={{padding:'8px 20px 18px',flex:1,display:'flex',flexDirection:'column'}}>
        <div className="spec" style={{color:'var(--gold)',marginBottom:6}}>
          <span className="diamond"/>&nbsp;&nbsp;DEPLOYED TO YOUR DATING APP
        </div>
        <h2 style={{fontFamily:'var(--serif-jp)',fontSize:24,fontWeight:500,
                    color:'var(--bone)',margin:'4px 0 14px'}}>
          こうして、相手に届きます。
        </h2>

        {/* fake match card stack */}
        <div style={{position:'relative',flex:1,display:'flex',justifyContent:'center',
                     alignItems:'flex-start',perspective:1000}}>
          {/* back card */}
          <div style={{position:'absolute',top:8,width:'88%',height:420,borderRadius:16,
                       background:'var(--ink-3)',border:'.5px solid var(--line)',
                       transform:'translateY(12px) scale(.94)',opacity:.4}}/>
          <div style={{position:'absolute',top:4,width:'94%',height:430,borderRadius:16,
                       background:'var(--ink-2)',border:'.5px solid var(--line-2)',
                       transform:'translateY(6px) scale(.97)',opacity:.7}}/>

          {/* front card */}
          <div style={{position:'relative',width:'100%',height:440,borderRadius:18,
                       overflow:'hidden',border:'.5px solid var(--gold)',
                       boxShadow:'0 0 60px rgba(212,175,55,.3), 0 12px 40px rgba(0,0,0,.6)'}}>
            <div style={{position:'absolute',inset:0}}>
              <FacePlaceholder glow={true} showLabel={false}/>
            </div>
            {/* shimmer overlay */}
            <div style={{position:'absolute',inset:0,pointerEvents:'none',
                         background:'linear-gradient(135deg,transparent 30%,rgba(232,199,107,.15) 50%,transparent 70%)',
                         animation:'flicker 4s ease-in-out infinite'}}/>
            {/* particles */}
            {Array.from({length:18}).map((_,i)=>(
              <span key={i} style={{position:'absolute',
                left:`${(i*31)%100}%`,top:`${(i*47)%100}%`,
                width:1.5,height:1.5,borderRadius:'50%',background:'#E8C76B',
                boxShadow:'0 0 6px #E8C76B',
                animation:`shimmer ${2.4+(i%4)*.5}s ease-out infinite`,
                animationDelay:`${(i%6)*.3}s`,pointerEvents:'none'}}/>
            ))}

            {/* gradient bottom + bio */}
            <div style={{position:'absolute',left:0,right:0,bottom:0,padding:'80px 18px 18px',
                         background:'linear-gradient(180deg,transparent,rgba(5,5,7,.88) 40%,rgba(5,5,7,.96))'}}>
              <div className="mono" style={{fontSize:9,letterSpacing:'.18em',color:'var(--gold)',
                                            marginBottom:6}}>
                ⟡ SHINE-MATE VERIFIED · GRADE A
              </div>
              <div style={{display:'flex',alignItems:'baseline',gap:10,marginBottom:6}}>
                <div style={{fontFamily:'var(--serif-jp)',fontSize:24,fontWeight:500,
                             color:'var(--bone)'}}>
                  ハルカ
                </div>
                <div style={{fontFamily:'var(--serif-en)',fontStyle:'italic',
                             fontSize:18,color:'var(--bone-dim)'}}>27</div>
                <div className="mono" style={{fontSize:9.5,color:'var(--bone-mute)',
                                              letterSpacing:'.1em'}}>· 1.2km</div>
              </div>
              <div style={{fontFamily:'var(--serif-jp)',fontSize:12.5,color:'var(--bone-dim)',
                           lineHeight:1.65}}>
                目で語ります。最近、雨上がりの街が好き。
              </div>
            </div>
          </div>
        </div>

        {/* fake action row */}
        <div style={{marginTop:18,display:'flex',gap:14,justifyContent:'center'}}>
          {[
            {bg:'#16161C',c:'var(--bone-dim)',i:'✕'},
            {bg:'linear-gradient(180deg,#E8C76B,#9C7A1F)',c:'#1A1408',i:'★',big:true},
            {bg:'#16161C',c:'var(--rose)',i:'♥'}
          ].map((b,i)=>(
            <div key={i} style={{
              width:b.big?64:52,height:b.big?64:52,borderRadius:'50%',
              border:'.5px solid '+(b.big?'var(--gold)':'var(--line-2)'),
              background:b.bg,color:b.c,display:'flex',alignItems:'center',
              justifyContent:'center',fontSize:b.big?22:18,
              boxShadow:b.big?'0 0 30px rgba(212,175,55,.5)':'none'
            }}>{b.i}</div>
          ))}
        </div>

        <button onClick={onRestart} className="btn-ghost"
                style={{marginTop:14,width:'100%'}}>
          ⟲ 別の写真を試す
        </button>
      </div>
    </div>
  );
}

// ── Nav header ───────────────────────────────────
function NavHeader({ onBack, index, total, label, hideBack }) {
  return (
    <div style={{padding:'10px 20px 0',display:'flex',justifyContent:'space-between',
                 alignItems:'center'}}>
      {!hideBack ? (
        <button onClick={onBack} style={{
          width:34,height:34,borderRadius:'50%',border:'.5px solid var(--line-2)',
          background:'transparent',color:'var(--bone)',cursor:'pointer',
          display:'flex',alignItems:'center',justifyContent:'center',fontSize:14
        }}>
          <svg width="9" height="14" viewBox="0 0 9 14" fill="none">
            <path d="M8 1L1 7l7 6" stroke="currentColor" strokeWidth="1.2"/>
          </svg>
        </button>
      ) : <div style={{width:34}}/>}

      <div className="spec" style={{color:'var(--bone-mute)'}}>
        {index && total ? `${index} / ${total} · ` : ''}{label}
      </div>

      <div style={{width:34,height:34,display:'flex',alignItems:'center',justifyContent:'center'}}>
        <span className="diamond" style={{opacity:.7}}/>
      </div>
    </div>
  );
}

window.HeroScreen = HeroScreen;
window.UploadScreen = UploadScreen;
window.AnalyzingScreen = AnalyzingScreen;
window.ResultScreen = ResultScreen;
window.VerdictScreen = VerdictScreen;
window.MatchScreen = MatchScreen;
