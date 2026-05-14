import { useState, useEffect, useRef, useCallback } from "react";

/* ─────────────────────────────────────────────
   GOOGLE SHEETS INTEGRATION
   Apps Script (doPost) deployed as Web App.
   Apps Script code used:
   function doPost(e) {
     const sheet = SpreadsheetApp
       .openById("1EOr_DlhOGe1rZqUtZ5L9neY3dlDCJQ2Ek4IEZl-6mf0")
       .getSheetByName("Sheet1");
     const data = JSON.parse(e.postData.contents);
     sheet.appendRow([new Date(), data.name, data.email,
       data.company, data.businessType, data.service, data.description]);
     return ContentService
       .createTextOutput(JSON.stringify({ success: true }))
       .setMimeType(ContentService.MimeType.JSON);
   }
─────────────────────────────────────────────── */
const SHEET_URL = "https://script.google.com/macros/s/AKfycby1KuU0RK0APXY36dLOM0h9m4I3SvvtjaLHtnoolGWWb7rkvKGf6q4b61s4Hl-vUHyJBA/exec";

/* ─────────────────────────────────────────────
   GLOBAL CSS
─────────────────────────────────────────────── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { background: #02020a; overflow-x: hidden; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: #02020a; }
  ::-webkit-scrollbar-thumb { background: #3730a3; border-radius: 2px; }

  @keyframes fadeUp { from { opacity:0; transform:translateY(32px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes spinR { to { transform: rotate(-360deg); } }
  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.95)} }
  @keyframes floatY { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
  @keyframes floatX { 0%,100%{transform:translateX(0)} 50%{transform:translateX(10px)} }
  @keyframes shimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
  @keyframes borderGlow { 0%,100%{box-shadow:0 0 8px rgba(99,102,241,.4),inset 0 0 8px rgba(99,102,241,.05)} 50%{box-shadow:0 0 24px rgba(99,102,241,.8),inset 0 0 24px rgba(99,102,241,.12)} }
  @keyframes orb1 { 0%{transform:translate(0,0) scale(1)} 33%{transform:translate(60px,-40px) scale(1.15)} 66%{transform:translate(-30px,30px) scale(.9)} 100%{transform:translate(0,0) scale(1)} }
  @keyframes orb2 { 0%{transform:translate(0,0) scale(1)} 33%{transform:translate(-50px,40px) scale(.85)} 66%{transform:translate(40px,-30px) scale(1.1)} 100%{transform:translate(0,0) scale(1)} }
  @keyframes orb3 { 0%{transform:translate(0,0)} 50%{transform:translate(30px,-50px)} 100%{transform:translate(0,0)} }
  @keyframes lineFlow { 0%{stroke-dashoffset:200} 100%{stroke-dashoffset:0} }
  @keyframes scanline { 0%{transform:translateY(-100%)} 100%{transform:translateY(100vh)} }
  @keyframes glitch1 { 0%,90%,100%{clip-path:none;transform:none} 91%{clip-path:polygon(0 10%,100% 10%,100% 22%,0 22%);transform:translateX(-4px)} 93%{clip-path:polygon(0 60%,100% 60%,100% 72%,0 72%);transform:translateX(4px)} 95%{clip-path:none;transform:none} }
  @keyframes countUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
  @keyframes gradientMove { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
  @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
  @keyframes ringPulse { 0%{transform:scale(1);opacity:.6} 100%{transform:scale(2.2);opacity:0} }
  @keyframes dataStream { 0%{transform:translateX(-100%);opacity:0} 10%{opacity:1} 90%{opacity:1} 100%{transform:translateX(200%);opacity:0} }
  @keyframes starFloat { 0%,100%{opacity:0;transform:scale(0)} 50%{opacity:1;transform:scale(1)} }

  /* Modal animations */
  @keyframes modalSlideIn { from{opacity:0;transform:translateY(40px) scale(.96)} to{opacity:1;transform:translateY(0) scale(1)} }
  @keyframes modalSlideOut { from{opacity:1;transform:translateY(0) scale(1)} to{opacity:0;transform:translateY(40px) scale(.96)} }
  @keyframes backdropIn { from{opacity:0} to{opacity:1} }
  @keyframes labelFloat { from{top:14px;font-size:14px;color:rgba(255,255,255,.4)} to{top:-10px;font-size:11px;color:#a78bfa} }
  @keyframes successPop { 0%{transform:scale(0) rotate(-20deg);opacity:0} 60%{transform:scale(1.2) rotate(5deg)} 100%{transform:scale(1) rotate(0);opacity:1} }
  @keyframes checkDraw { from{stroke-dashoffset:100} to{stroke-dashoffset:0} }
  @keyframes successGlow { 0%,100%{box-shadow:0 0 40px rgba(99,102,241,.3)} 50%{box-shadow:0 0 80px rgba(99,102,241,.7),0 0 120px rgba(167,139,250,.3)} }
  @keyframes orbRotate { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
  @keyframes orbPulse { 0%,100%{transform:scale(1);opacity:.8} 50%{transform:scale(1.15);opacity:1} }
  @keyframes orbRing { 0%{transform:scale(1);opacity:.5} 100%{transform:scale(1.8);opacity:0} }
  @keyframes chatSlideIn { from{opacity:0;transform:translateY(20px) scale(.95)} to{opacity:1;transform:translateY(0) scale(1)} }
  @keyframes msgIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
  @keyframes thinkDot { 0%,80%,100%{transform:scale(0);opacity:0} 40%{transform:scale(1);opacity:1} }
  @keyframes inputFocus { from{box-shadow:0 0 0 0 rgba(99,102,241,0)} to{box-shadow:0 0 0 2px rgba(99,102,241,.5),0 0 20px rgba(99,102,241,.2)} }

  .modal-input {
    width:100%;
    background:rgba(255,255,255,.04);
    border:1px solid rgba(255,255,255,.1);
    border-radius:12px;
    padding:14px 16px;
    color:#fff;
    font-size:14px;
    font-family:'DM Sans',sans-serif;
    outline:none;
    transition:border .25s,box-shadow .25s,background .25s;
    resize:none;
  }
  .modal-input:focus {
    border-color:rgba(99,102,241,.7);
    background:rgba(99,102,241,.06);
    box-shadow:0 0 0 2px rgba(99,102,241,.2),0 0 20px rgba(99,102,241,.1);
  }
  .modal-input::placeholder { color:rgba(255,255,255,.25); }

  .orb-launcher {
    animation: orbPulse 3s ease-in-out infinite;
  }
  .orb-launcher:hover { transform: scale(1.12) !important; }
  .orb-ring {
    animation: orbRing 2s ease-out infinite;
  }
`;

/* ─────────────────────────────────────────────
   CANVAS PARTICLE SYSTEM
─────────────────────────────────────────────── */
function ParticleCanvas({ mouseX, mouseY }) {
  const canvasRef = useRef(null);
  const particles = useRef([]);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 120; i++) {
      particles.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - .5) * .3,
        vy: (Math.random() - .5) * .3,
        r: Math.random() * 1.8 + .3,
        alpha: Math.random() * .6 + .1,
        color: Math.random() > .5 ? [99,102,241] : Math.random() > .5 ? [34,211,238] : [167,139,250],
      });
    }

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const mxRef = mouseX || canvas.width / 2, myRef = mouseY || canvas.height / 2;
      particles.current.forEach((p, i) => {
        const dx = mxRef - p.x, dy = myRef - p.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 180) { p.vx += dx * .00008; p.vy += dy * .00008; }
        p.x += p.vx; p.y += p.vy;
        p.vx *= .99; p.vy *= .99;
        if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
        ctx.fillStyle = `rgba(${p.color.join(",")},${p.alpha})`;
        ctx.fill();
        for (let j = i+1; j < particles.current.length; j++) {
          const q = particles.current[j];
          const dx2 = p.x-q.x, dy2 = p.y-q.y;
          const d2 = Math.sqrt(dx2*dx2+dy2*dy2);
          if (d2 < 100) {
            ctx.beginPath();
            ctx.moveTo(p.x,p.y); ctx.lineTo(q.x,q.y);
            ctx.strokeStyle = `rgba(99,102,241,${.15*(1-d2/100)})`;
            ctx.lineWidth = .5; ctx.stroke();
          }
        }
      });
      animRef.current = requestAnimationFrame(tick);
    };
    tick();
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={canvasRef} style={{ position:"fixed",inset:0,pointerEvents:"none",zIndex:0 }}/>;
}

/* ─────────────────────────────────────────────
   KASHA TECH LOGO
─────────────────────────────────────────────── */
function KashaLogo({ size = "nav" }) {
  const configs = {
    lg:     { iconW: 52, iconH: 52, fontSize: 36, subSize: 13, gap: 14 },
    nav:    { iconW: 34, iconH: 34, fontSize: 22, subSize: 9,  gap: 10 },
    footer: { iconW: 30, iconH: 30, fontSize: 18, subSize: 8,  gap: 9  },
  };
  const c = configs[size] || configs.nav;
  return (
    <div style={{ display:"flex", alignItems:"center", gap:c.gap, userSelect:"none" }}>
      {/* Icon mark — stylised K inside a diamond-hex hybrid */}
      <svg width={c.iconW} height={c.iconH} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="kg1" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#6366f1"/>
            <stop offset="55%" stopColor="#a78bfa"/>
            <stop offset="100%" stopColor="#22d3ee"/>
          </linearGradient>
          <linearGradient id="kg2" x1="0" y1="48" x2="48" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.3"/>
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.05"/>
          </linearGradient>
          <filter id="kglow">
            <feGaussianBlur stdDeviation="1.5" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        {/* Hexagonal background */}
        <path d="M24 3 L42 13.5 L42 34.5 L24 45 L6 34.5 L6 13.5 Z"
          fill="url(#kg2)" stroke="url(#kg1)" strokeWidth="1.5"/>
        {/* Inner subtle hex ring */}
        <path d="M24 9 L38 17 L38 31 L24 39 L10 31 L10 17 Z"
          fill="none" stroke="rgba(99,102,241,0.25)" strokeWidth="0.75"/>
        {/* K letterform */}
        <g filter="url(#kglow)">
          {/* Vertical stem */}
          <rect x="16" y="14" width="3.5" height="20" rx="1.5" fill="url(#kg1)"/>
          {/* Upper arm */}
          <path d="M19.5 24 L30 14.5" stroke="url(#kg1)" strokeWidth="3.5" strokeLinecap="round"/>
          {/* Lower arm */}
          <path d="M19.5 24 L30 33.5" stroke="url(#kg1)" strokeWidth="3.5" strokeLinecap="round"/>
        </g>
        {/* Corner accent dots */}
        <circle cx="24" cy="4.5" r="1.5" fill="#22d3ee" opacity="0.8"/>
        <circle cx="24" cy="43.5" r="1.5" fill="#6366f1" opacity="0.6"/>
      </svg>

      {/* Wordmark */}
      <div style={{ display:"flex", flexDirection:"column", lineHeight:1 }}>
        <span style={{
          fontSize: c.fontSize,
          fontWeight: 800,
          fontFamily: "'Syne', sans-serif",
          letterSpacing: 2,
          background: "linear-gradient(135deg,#6366f1 0%,#a78bfa 50%,#22d3ee 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundSize: "200% auto",
          animation: "shimmer 4s linear infinite",
        }}>KASHA</span>
        <span style={{
          fontSize: c.subSize,
          fontWeight: 600,
          fontFamily: "'DM Sans', sans-serif",
          letterSpacing: size === "lg" ? 5 : 4,
          color: "rgba(167,139,250,0.7)",
          marginTop: size === "lg" ? 2 : 1,
          textTransform: "uppercase",
        }}>TECH</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   CINEMATIC LOADER
─────────────────────────────────────────────── */
function Loader({ onDone }) {
  const [progress, setProgress] = useState(0);
  const [text, setText] = useState("");
  const [fadeOut, setFadeOut] = useState(false);
  const [displayLines, setDisplayLines] = useState([]);
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  const lines = [
    "NEURAL NETWORK INITIALIZING...",
    "AI CORES ONLINE — 847ms",
    "LOADING AUTOMATION ENGINES...",
    "CALIBRATING INFERENCE MODELS...",
    "WORKFLOW ORCHESTRATORS READY",
    "KASHA TECH SYSTEMS ONLINE.",
  ];
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);

  useEffect(() => {
    const prog = setInterval(() => setProgress(p => Math.min(p + Math.random()*4, 100)), 80);
    return () => clearInterval(prog);
  }, []);

  useEffect(() => {
    if (lineIdx >= lines.length) {
      setTimeout(() => setFadeOut(true), 800);
      setTimeout(() => onDone(), 1400);
      return;
    }
    if (charIdx < lines[lineIdx].length) {
      const t = setTimeout(() => { setText(prev => prev + lines[lineIdx][charIdx]); setCharIdx(c => c+1); }, 30);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => {
        setDisplayLines(dl => [...dl, { text: lines[lineIdx] }]);
        setText(""); setLineIdx(l => l+1); setCharIdx(0);
      }, 300);
      return () => clearTimeout(t);
    }
  }, [charIdx, lineIdx]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    const nodes = Array.from({length:18}, () => ({
      x:Math.random()*canvas.width, y:Math.random()*canvas.height,
      r:Math.random()*3+1, vx:(Math.random()-.5)*.4, vy:(Math.random()-.5)*.4,
      active:false, timer:Math.random()*80,
    }));
    const draw = () => {
      ctx.clearRect(0,0,canvas.width,canvas.height);
      nodes.forEach((n,i) => {
        n.x+=n.vx; n.y+=n.vy; n.timer++;
        if (n.timer>60){n.active=!n.active;n.timer=0;}
        if (n.x<0||n.x>canvas.width) n.vx*=-1;
        if (n.y<0||n.y>canvas.height) n.vy*=-1;
        nodes.forEach((m,j) => {
          if (j<=i) return;
          const dx=n.x-m.x,dy=n.y-m.y,d=Math.sqrt(dx*dx+dy*dy);
          if (d<200) { ctx.beginPath();ctx.moveTo(n.x,n.y);ctx.lineTo(m.x,m.y);ctx.strokeStyle=`rgba(99,102,241,${.4*(1-d/200)})`;ctx.lineWidth=n.active&&m.active?1.5:.5;ctx.stroke(); }
        });
        ctx.beginPath();ctx.arc(n.x,n.y,n.active?n.r*2.5:n.r,0,Math.PI*2);
        ctx.fillStyle=n.active?"rgba(99,102,241,.9)":"rgba(99,102,241,.3)";ctx.fill();
      });
      animRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <div style={{position:"fixed",inset:0,background:"#02020a",zIndex:9999,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",opacity:fadeOut?0:1,transition:"opacity .8s ease",overflow:"hidden"}}>
      <canvas ref={canvasRef} style={{position:"absolute",inset:0,pointerEvents:"none"}}/>
      <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at center,rgba(99,102,241,.08) 0%,transparent 70%)",pointerEvents:"none"}}/>
      <div style={{position:"relative",zIndex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:40,width:"min(540px,90vw)"}}>
        <div style={{textAlign:"center"}}>
          <KashaLogo size="lg" />
          <div style={{width:"100%",height:1,background:"linear-gradient(to right,transparent,rgba(99,102,241,.6),transparent)"}}/>
        </div>
        <div style={{width:"100%",background:"rgba(99,102,241,.04)",border:"1px solid rgba(99,102,241,.15)",borderRadius:12,padding:"24px 28px",fontFamily:"'JetBrains Mono','Courier New',monospace"}}>
          {displayLines.map((l,i) => (
            <div key={i} style={{color:"rgba(99,102,241,.6)",fontSize:12,lineHeight:2,display:"flex",gap:12,alignItems:"center"}}>
              <span style={{color:"#22d3ee"}}>✓</span>{l.text}
            </div>
          ))}
          {lineIdx < lines.length && (
            <div style={{color:"#a5b4fc",fontSize:12,lineHeight:2,display:"flex",gap:12}}>
              <span style={{color:"#6366f1",animation:"pulse 1s infinite"}}>›</span>
              {text}<span style={{display:"inline-block",width:7,height:13,background:"#6366f1",animation:"blink 1s step-end infinite",verticalAlign:"middle",marginLeft:1}}/>
            </div>
          )}
        </div>
        <div style={{width:"100%"}}>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:11,fontFamily:"'DM Sans',sans-serif",color:"rgba(255,255,255,.3)",marginBottom:8}}>
            <span>INITIALIZING SYSTEMS</span><span>{Math.round(progress)}%</span>
          </div>
          <div style={{height:2,background:"rgba(255,255,255,.06)",borderRadius:1,overflow:"hidden"}}>
            <div style={{height:"100%",background:"linear-gradient(to right,#6366f1,#22d3ee)",width:`${progress}%`,transition:"width .1s",borderRadius:1,boxShadow:"0 0 12px rgba(99,102,241,.8)"}}/>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   HOLOGRAPHIC HERO VISUAL
─────────────────────────────────────────────── */
const NODES = [
  {x:70,y:40,label:"Input Layer"},{x:180,y:20,label:"NLP Core"},{x:280,y:40,label:"Inference"},
  {x:180,y:60,label:"Memory"},{x:350,y:40,label:"Output"},
];
const EDGES = [[0,1],[1,2],[1,3],[2,4],[3,4]];

function HeroHologram({ mouseX, mouseY }) {
  const [codeLines, setCodeLines] = useState([]);
  const [activeNodes, setActiveNodes] = useState([0]);
  const CODE_SNIPPETS = [
    { color:"#7c3aed", text:"const kasha = new AI.Pipeline()" },
    { color:"#22d3ee", text:"  .connect('neural-engine')" },
    { color:"#a78bfa", text:"  .automate('workflows', { scale: true })" },
    { color:"#34d399", text:"  .deploy({ env: 'production' })" },
    { color:"#6366f1", text:"// ✓ System optimized — 847ms" },
    { color:"#f472b6", text:"const revenue = await kasha.run()" },
    { color:"#22d3ee", text:"// Output: +340% conversion" },
  ];
  useEffect(() => {
    let idx=0;
    const t = setInterval(() => {
      setCodeLines(prev => [...prev.slice(-9), CODE_SNIPPETS[idx % CODE_SNIPPETS.length]]);
      setActiveNodes(prev => {
        const next = [...prev, (prev[prev.length-1]+1) % NODES.length];
        return next.slice(-3);
      });
      idx++;
    }, 1200);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{position:"relative",width:"100%",maxWidth:540,height:460,margin:"0 auto"}}>
      <div style={{position:"absolute",inset:-20,background:"radial-gradient(ellipse at center,rgba(99,102,241,.08) 0%,transparent 70%)",filter:"blur(40px)",pointerEvents:"none"}}/>
      <div style={{position:"absolute",inset:0,borderRadius:24,border:"1px solid rgba(99,102,241,.15)",background:"rgba(5,4,20,.7)",backdropFilter:"blur(20px)",overflow:"hidden",boxShadow:"0 40px 120px rgba(0,0,0,.5),0 0 60px rgba(99,102,241,.08),inset 0 1px 0 rgba(255,255,255,.04)"}}>
        <div style={{height:45,borderBottom:"1px solid rgba(99,102,241,.12)",display:"flex",alignItems:"center",padding:"0 16px",gap:8,background:"rgba(99,102,241,.04)"}}>
          {["#ff5f57","#febc2e","#28c840"].map((c,i)=>(<div key={i} style={{width:12,height:12,borderRadius:"50%",background:c,opacity:.8}}/>))}
          <span style={{marginLeft:8,fontSize:11,color:"rgba(255,255,255,.3)",fontFamily:"'JetBrains Mono',monospace",letterSpacing:.5}}>kasha.pipeline.js</span>
          <div style={{marginLeft:"auto",display:"flex",gap:16}}>
            {["LIVE","AUTO","AI"].map(s=>(<div key={s} style={{fontSize:9,color:"#22d3ee",border:"1px solid rgba(34,211,238,.3)",borderRadius:4,padding:"2px 6px",letterSpacing:1,fontFamily:"'JetBrains Mono',monospace",background:"rgba(34,211,238,.05)"}}>{s}</div>))}
          </div>
        </div>
        <div style={{padding:"16px 20px",fontFamily:"'JetBrains Mono','Courier New',monospace",overflow:"hidden",height:"calc(60% - 45px)"}}>
          {codeLines.map((l,i)=>(
            <div key={i} style={{display:"flex",gap:16,lineHeight:"1.8",opacity:1-(codeLines.length-1-i)*.08}}>
              <span style={{color:"rgba(255,255,255,.15)",fontSize:11,minWidth:20,textAlign:"right",userSelect:"none"}}>{i+1}</span>
              <span style={{fontSize:12.5,color:l.color,letterSpacing:.3}}>{l.text}</span>
            </div>
          ))}
          {codeLines.length>0&&<span style={{display:"inline-block",width:7,height:14,background:"#6366f1",animation:"blink 1s step-end infinite",verticalAlign:"middle",marginLeft:36}}/>}
        </div>
        <div style={{position:"absolute",bottom:0,left:0,right:0,top:"64%",background:"rgba(5,4,20,.9)",border:"1px solid rgba(99,102,241,.2)",borderRadius:14,backdropFilter:"blur(20px)",padding:"14px 20px",boxShadow:"0 0 40px rgba(99,102,241,.08),inset 0 1px 0 rgba(255,255,255,.04)"}}>
          <div style={{fontSize:10,color:"rgba(99,102,241,.6)",letterSpacing:2,fontFamily:"'DM Sans',sans-serif",marginBottom:10}}>LIVE AUTOMATION GRAPH</div>
          <svg width="100%" height="80" viewBox="0 0 420 80">
            <defs><filter id="glow"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
            {EDGES.map(([a,b],i)=>{const na=NODES[a],nb=NODES[b];const active=activeNodes.includes(a)&&activeNodes.includes(b);return <line key={i} x1={na.x} y1={na.y} x2={nb.x} y2={nb.y} stroke={active?"#6366f1":"rgba(99,102,241,.2)"} strokeWidth={active?2:1} strokeDasharray={active?"6 3":"none"} style={{filter:active?"url(#glow)":"none"}}/>;} )}
            {NODES.map((n,i)=>{const active=activeNodes.includes(i);return (<g key={i} filter={active?"url(#glow)":"none"}><rect x={n.x-38} y={n.y-16} width={76} height={32} rx={6} fill={active?"rgba(99,102,241,.35)":"rgba(15,12,40,.8)"} stroke={active?"#6366f1":"rgba(99,102,241,.25)"} strokeWidth={active?2:1}/><text x={n.x} y={n.y+5} textAnchor="middle" fill={active?"#e0e7ff":"rgba(255,255,255,.45)"} fontSize={10} fontFamily="'DM Sans',sans-serif">{n.label}</text>{active&&<circle cx={n.x+35} cy={n.y-12} r={4} fill="#22d3ee"/>}</g>);})}
          </svg>
        </div>
        {[{top:"-18px",right:"60px",label:"AI Running",color:"#22d3ee",delay:"0s"},{top:"80px",left:"-20px",label:"Automation Active",color:"#a78bfa",delay:".3s"},{bottom:"90px",right:"-10px",label:"System Optimized",color:"#34d399",delay:".6s"}].map((b,i)=>(
          <div key={i} style={{position:"absolute",...(b.top&&{top:b.top}),...(b.bottom&&{bottom:b.bottom}),...(b.left&&{left:b.left}),...(b.right&&{right:b.right}),background:"rgba(5,4,20,.9)",border:`1px solid ${b.color}40`,borderRadius:100,padding:"6px 14px",display:"flex",alignItems:"center",gap:8,backdropFilter:"blur(20px)",animation:`floatY 3s ease-in-out infinite`,animationDelay:b.delay,whiteSpace:"nowrap",zIndex:10,boxShadow:`0 0 20px ${b.color}20`}}>
            <div style={{width:6,height:6,borderRadius:"50%",background:b.dot||b.color,animation:"pulse 1.5s infinite",boxShadow:`0 0 8px ${b.color}`}}/>
            <span style={{fontSize:11,color:b.color,fontFamily:"'DM Sans',sans-serif",fontWeight:500}}>{b.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   USE INTERSECTION OBSERVER
─────────────────────────────────────────────── */
function useInView(threshold=0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e])=>{if(e.isIntersecting)setInView(true);},{threshold});
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

/* ─────────────────────────────────────────────
   ANIMATED COUNTER
─────────────────────────────────────────────── */
function Counter({ val, suffix }) {
  const [count, setCount] = useState(0);
  const [ref, inView] = useInView();
  const started = useRef(false);
  useEffect(() => {
    if (!inView||started.current) return;
    started.current = true;
    const dur=2000,start=performance.now();
    const step=now=>{const p=Math.min((now-start)/dur,1);const ease=1-Math.pow(1-p,4);setCount(Math.round(ease*val));if(p<1)requestAnimationFrame(step);};
    requestAnimationFrame(step);
  }, [inView,val]);
  return <span ref={ref}>{count}{suffix}</span>;
}

/* ─────────────────────────────────────────────
   SERVICE CARD
─────────────────────────────────────────────── */
function ServiceCard({ icon, title, desc, delay=0 }) {
  const [hov, setHov] = useState(false);
  const [ref, inView] = useInView();
  return (
    <div ref={ref} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} style={{
      background:hov?"rgba(99,102,241,.08)":"rgba(255,255,255,.015)",
      border:`1px solid ${hov?"rgba(99,102,241,.5)":"rgba(255,255,255,.06)"}`,
      borderRadius:20,padding:"32px 28px",
      transform:inView?(hov?"translateY(-10px) scale(1.01)":"translateY(0)"):"translateY(30px)",
      opacity:inView?1:0,
      transition:`opacity .6s ${delay}ms, transform .5s ${delay}ms cubic-bezier(.34,1.56,.64,1), background .3s, border .3s, box-shadow .3s`,
      cursor:"default",position:"relative",overflow:"hidden",
      boxShadow:hov?"0 24px 80px rgba(99,102,241,.2),0 0 0 1px rgba(99,102,241,.1),inset 0 1px 0 rgba(255,255,255,.06)":"none",
    }}>
      {hov&&<div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at top left, rgba(99,102,241,.1) 0%,transparent 60%)",pointerEvents:"none"}}/>}
      <div style={{fontSize:32,marginBottom:18,filter:hov?"drop-shadow(0 0 16px rgba(99,102,241,.9))":"none",transition:"filter .3s",display:"inline-block",animation:hov?"floatY 2s ease-in-out infinite":"none"}}>{icon}</div>
      <div style={{fontSize:17,fontWeight:700,color:hov?"#c4b5fd":"#f1f5f9",fontFamily:"'Syne',sans-serif",marginBottom:10,transition:"color .3s"}}>{title}</div>
      <div style={{fontSize:13.5,color:"rgba(255,255,255,.4)",lineHeight:1.75}}>{desc}</div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   PREMIUM CONTACT MODAL
─────────────────────────────────────────────── */
function ContactModal({ isOpen, onClose }) {
  const [form, setForm] = useState({ fullName:"", email:"", company:"", businessType:"", service:"", description:"" });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) { setTimeout(() => setVisible(true), 10); document.body.style.overflow="hidden"; }
    else { setVisible(false); document.body.style.overflow=""; }
    return () => { document.body.style.overflow=""; };
  }, [isOpen]);

  const handleClose = () => { setVisible(false); setTimeout(onClose, 320); };

  const handleChange = e => setForm(f => ({...f, [e.target.name]: e.target.value}));

  const handleSubmit = () => {
    if (!form.fullName || !form.email || !form.company) {
      setError("Please fill in all required fields."); return;
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setError("Please enter a valid email address."); return;
    }
    setError(""); setSubmitting(true);

    // JSONP-style script tag injection — zero CORS, works 100% with Apps Script doGet
    // Apps Script must use doGet(e) and return ContentService.createTextOutput(...)
    const callbackName = "gsCb_" + Date.now();
    const params = new URLSearchParams({
      callback:     callbackName,
      name:         form.fullName,
      email:        form.email,
      company:      form.company,
      businessType: form.businessType || "Not specified",
      service:      form.service      || "Not specified",
      description:  form.description  || "",
      timestamp:    new Date().toLocaleString(),
    });

    const script = document.createElement("script");
    script.src = SHEET_URL + "?" + params.toString();

    // Cleanup helper
    const cleanup = () => {
      if (script.parentNode) script.parentNode.removeChild(script);
      delete window[callbackName];
    };

    // Called by Apps Script response: callback({success:true})
    window[callbackName] = (data) => {
      cleanup();
      setSubmitting(false);
      if (data && data.success) {
        setForm({ fullName:"", email:"", company:"", businessType:"", service:"", description:"" });
        setSuccess(true);
      } else {
        setError("Submission failed. Please try again.");
      }
    };

    // Timeout fallback — if Apps Script doesn't call back in 10s
    const timer = setTimeout(() => {
      cleanup();
      setSubmitting(false);
      setError("Request timed out. Please try again.");
    }, 10000);

    // Override callback to clear timer too
    const origCb = window[callbackName];
    window[callbackName] = (data) => { clearTimeout(timer); origCb(data); };

    script.onerror = () => {
      cleanup();
      clearTimeout(timer);
      setSubmitting(false);
      setError("Could not reach server. Please check your connection.");
    };

    document.head.appendChild(script);
  };

  if (!isOpen) return null;

  return (
    <div style={{position:"fixed",inset:0,zIndex:2000,display:"flex",alignItems:"center",justifyContent:"center",padding:"20px"}}>
      {/* Backdrop */}
      <div onClick={handleClose} style={{position:"absolute",inset:0,background:"rgba(0,0,0,.75)",backdropFilter:"blur(20px)",opacity:visible?1:0,transition:"opacity .3s"}}/>

      {/* Modal */}
      <div style={{
        position:"relative",zIndex:1,width:"100%",maxWidth:560,maxHeight:"90vh",overflowY:"auto",
        background:"linear-gradient(135deg,rgba(10,8,35,.97) 0%,rgba(5,4,20,.99) 100%)",
        border:"1px solid rgba(99,102,241,.3)",borderRadius:24,
        boxShadow:"0 0 0 1px rgba(99,102,241,.1),0 40px 120px rgba(0,0,0,.8),0 0 80px rgba(99,102,241,.15),inset 0 1px 0 rgba(255,255,255,.06)",
        animation:visible?"modalSlideIn .32s cubic-bezier(.34,1.56,.64,1) both":"modalSlideOut .3s ease both",
        scrollbarWidth:"thin",scrollbarColor:"rgba(99,102,241,.3) transparent",
      }}>
        {/* Glow edges */}
        <div style={{position:"absolute",inset:0,borderRadius:24,background:"radial-gradient(ellipse at top,rgba(99,102,241,.08) 0%,transparent 60%)",pointerEvents:"none"}}/>
        <div style={{position:"absolute",top:0,left:"10%",right:"10%",height:1,background:"linear-gradient(to right,transparent,rgba(99,102,241,.6),transparent)"}}/>

        {success ? (
          /* SUCCESS STATE */
          <div style={{padding:"60px 40px",textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:24}}>
            <div style={{width:90,height:90,borderRadius:"50%",background:"linear-gradient(135deg,rgba(99,102,241,.2),rgba(167,139,250,.1))",border:"1px solid rgba(99,102,241,.4)",display:"flex",alignItems:"center",justifyContent:"center",animation:"successPop .6s cubic-bezier(.34,1.56,.64,1) both,successGlow 3s ease-in-out infinite",boxShadow:"0 0 40px rgba(99,102,241,.3)"}}>
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <path d="M8 20 L17 29 L32 12" stroke="#a78bfa" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="60" strokeDashoffset="60" style={{animation:"checkDraw .6s .3s ease both forwards"}}/>
              </svg>
            </div>
            <div>
              <div style={{fontSize:22,fontWeight:800,fontFamily:"'Syne',sans-serif",background:"linear-gradient(135deg,#6366f1,#a78bfa,#22d3ee)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",marginBottom:12}}>Thank you for connecting with Kasha Tech.</div>
              <div style={{color:"rgba(255,255,255,.55)",fontSize:15,lineHeight:1.8,fontFamily:"'DM Sans',sans-serif",maxWidth:360,margin:"0 auto"}}>
                We're excited to learn more about your vision. Our team will reach out to you shortly.
              </div>
            </div>
            <div style={{display:"flex",gap:20,marginTop:8}}>
              {["✓ Request Received","✓ Team Notified","✓ Response in 2h"].map((t,i)=>(
                <div key={i} style={{fontSize:12,color:"#22d3ee",fontFamily:"'DM Sans',sans-serif",display:"flex",alignItems:"center",gap:6}}>
                  <span style={{color:"#6366f1"}}>{t.split(" ")[0]}</span> {t.slice(2)}
                </div>
              ))}
            </div>
            <button onClick={handleClose} style={{marginTop:8,background:"linear-gradient(135deg,#6366f1,#8b5cf6)",border:"none",borderRadius:12,padding:"12px 32px",color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"'Syne',sans-serif",boxShadow:"0 0 30px rgba(99,102,241,.4)",transition:"all .3s"}}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 8px 40px rgba(99,102,241,.7)";}}
              onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 0 30px rgba(99,102,241,.4)";}}>
              Close
            </button>
          </div>
        ) : (
          /* FORM STATE */
          <div style={{padding:"40px"}}>
            {/* Header */}
            <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:32}}>
              <div>
                <div style={{fontSize:11,letterSpacing:3,color:"#6366f1",fontFamily:"'DM Sans',sans-serif",fontWeight:600,marginBottom:8}}>LET'S CONNECT</div>
                <h2 style={{fontSize:26,fontWeight:800,fontFamily:"'Syne',sans-serif",background:"linear-gradient(135deg,#fff,rgba(255,255,255,.7))",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",lineHeight:1.15}}>Start Your Project</h2>
                <p style={{color:"rgba(255,255,255,.35)",fontSize:13.5,fontFamily:"'DM Sans',sans-serif",marginTop:8,lineHeight:1.6}}>Tell us about your vision. Our team will craft a tailored strategy for you.</p>
              </div>
              <button onClick={handleClose} style={{background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.08)",borderRadius:10,width:36,height:36,color:"rgba(255,255,255,.5)",cursor:"pointer",fontSize:20,display:"flex",alignItems:"center",justifyContent:"center",transition:"all .2s",flexShrink:0,marginLeft:16,marginTop:4}}
                onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,.1)";e.currentTarget.style.color="#fff";}}
                onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,.05)";e.currentTarget.style.color="rgba(255,255,255,.5)";}}>
                ×
              </button>
            </div>

            {/* Form fields */}
            <div style={{display:"flex",flexDirection:"column",gap:16}}>
              {/* Row 1: Name + Email */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                <div style={{display:"flex",flexDirection:"column",gap:6}}>
                  <label style={{fontSize:11,color:"rgba(255,255,255,.4)",fontFamily:"'DM Sans',sans-serif",letterSpacing:.5}}>FULL NAME <span style={{color:"#6366f1"}}>*</span></label>
                  <input className="modal-input" name="fullName" value={form.fullName} onChange={handleChange} placeholder="Alex Johnson" />
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:6}}>
                  <label style={{fontSize:11,color:"rgba(255,255,255,.4)",fontFamily:"'DM Sans',sans-serif",letterSpacing:.5}}>EMAIL ADDRESS <span style={{color:"#6366f1"}}>*</span></label>
                  <input className="modal-input" name="email" value={form.email} onChange={handleChange} placeholder="alex@company.com" type="email" />
                </div>
              </div>

              {/* Row 2: Company + Business Type */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                <div style={{display:"flex",flexDirection:"column",gap:6}}>
                  <label style={{fontSize:11,color:"rgba(255,255,255,.4)",fontFamily:"'DM Sans',sans-serif",letterSpacing:.5}}>COMPANY NAME <span style={{color:"#6366f1"}}>*</span></label>
                  <input className="modal-input" name="company" value={form.company} onChange={handleChange} placeholder="Your Company" />
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:6}}>
                  <label style={{fontSize:11,color:"rgba(255,255,255,.4)",fontFamily:"'DM Sans',sans-serif",letterSpacing:.5}}>BUSINESS TYPE</label>
                  <select className="modal-input" name="businessType" value={form.businessType} onChange={handleChange}
                    style={{background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.1)",borderRadius:12,padding:"14px 16px",color:form.businessType?"#fff":"rgba(255,255,255,.25)",fontSize:14,fontFamily:"'DM Sans',sans-serif",outline:"none",cursor:"pointer",appearance:"none",transition:"border .25s,box-shadow .25s"}}>
                    <option value="" disabled style={{background:"#0a0823"}}>Select type</option>
                    {["Startup","SMB","Enterprise","Agency","E-Commerce","SaaS","Other"].map(t=><option key={t} value={t} style={{background:"#0a0823",color:"#fff"}}>{t}</option>)}
                  </select>
                </div>
              </div>

              {/* Service */}
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                <label style={{fontSize:11,color:"rgba(255,255,255,.4)",fontFamily:"'DM Sans',sans-serif",letterSpacing:.5}}>WHAT SERVICE ARE YOU LOOKING FOR?</label>
                <select className="modal-input" name="service" value={form.service} onChange={handleChange}
                  style={{background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.1)",borderRadius:12,padding:"14px 16px",color:form.service?"#fff":"rgba(255,255,255,.25)",fontSize:14,fontFamily:"'DM Sans',sans-serif",outline:"none",cursor:"pointer",appearance:"none",transition:"border .25s,box-shadow .25s"}}>
                  <option value="" disabled style={{background:"#0a0823"}}>Select service</option>
                  {["AI Automation","SaaS Development","Premium Web Design","AI Chatbot Integration","Workflow Automation","Business Systems","Landing Pages","API Integrations","Full Digital Transformation"].map(s=><option key={s} value={s} style={{background:"#0a0823",color:"#fff"}}>{s}</option>)}
                </select>
              </div>

              {/* Description */}
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                <label style={{fontSize:11,color:"rgba(255,255,255,.4)",fontFamily:"'DM Sans',sans-serif",letterSpacing:.5}}>SHORT PROJECT DESCRIPTION</label>
                <textarea className="modal-input" name="description" value={form.description} onChange={handleChange} placeholder="Tell us about your project goals, challenges, and what success looks like for you..." rows={4} style={{resize:"vertical",minHeight:100}}/>
              </div>

              {error && (
                <div style={{background:"rgba(239,68,68,.08)",border:"1px solid rgba(239,68,68,.25)",borderRadius:10,padding:"10px 14px",color:"#fca5a5",fontSize:13,fontFamily:"'DM Sans',sans-serif"}}>
                  ⚠ {error}
                </div>
              )}

              {/* Buttons */}
              <div style={{display:"flex",gap:12,marginTop:8}}>
                <button onClick={handleSubmit} disabled={submitting} style={{flex:1,background:submitting?"rgba(99,102,241,.3)":"linear-gradient(135deg,#6366f1,#8b5cf6)",border:"none",borderRadius:12,padding:"15px 24px",color:"#fff",fontSize:15,fontWeight:700,cursor:submitting?"not-allowed":"pointer",fontFamily:"'Syne',sans-serif",letterSpacing:.5,boxShadow:submitting?"none":"0 0 40px rgba(99,102,241,.4)",transition:"all .3s",display:"flex",alignItems:"center",justifyContent:"center",gap:10}}
                  onMouseEnter={e=>{if(!submitting){e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 8px 40px rgba(99,102,241,.7)";}}}
                  onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 0 40px rgba(99,102,241,.4)";}}>
                  {submitting ? (
                    <><div style={{width:18,height:18,border:"2px solid rgba(255,255,255,.3)",borderTopColor:"#fff",borderRadius:"50%",animation:"spin .7s linear infinite"}}/> Submitting...</>
                  ) : "Submit Request →"}
                </button>
                <button onClick={handleClose} style={{background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.1)",borderRadius:12,padding:"15px 24px",color:"rgba(255,255,255,.6)",fontSize:15,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",transition:"all .3s"}}
                  onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,.08)";e.currentTarget.style.color="#fff";}}
                  onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,.04)";e.currentTarget.style.color="rgba(255,255,255,.6)";}}>
                  Close
                </button>
              </div>

              <div style={{display:"flex",justifyContent:"center",gap:24,marginTop:4}}>
                {["🔒 Secure & Private","⚡ 2h Response","✓ No Commitment"].map((t,i)=>(
                  <span key={i} style={{fontSize:11.5,color:"rgba(255,255,255,.25)",fontFamily:"'DM Sans',sans-serif"}}>{t}</span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   PREMIUM AI CHATBOT
─────────────────────────────────────────────── */

// AI personality responses — no pricing, focus on value/curiosity/leads
const BOT_RESPONSES = [
  { trigger: ["hello","hi","hey","start","begin"], reply: "Welcome to Kasha Tech. I'm your AI business consultant — here to help you explore how intelligent systems can transform your operations. What kind of business are you building?" },
  { trigger: ["service","offer","what do","what can","capability","capabilities"], reply: "Kasha Tech specializes in intelligent digital systems — AI automation, premium web design, SaaS development, chatbot integration, and workflow orchestration. Which area resonates most with your current goals?" },
  { trigger: ["automat","workflow","manual","repetitive","process"], reply: "Automation is where the real transformation happens. Most businesses reclaim 60–85% of their manual workload when we deploy intelligent pipelines. Are you looking to automate internal operations, customer interactions, or both?" },
  { trigger: ["website","web design","landing","design","ui","ux"], reply: "Kasha Tech creates cinematic, conversion-engineered digital experiences — not just websites. Our designs position brands at the apex of their industry. What impression do you want visitors to leave with?" },
  { trigger: ["saas","platform","app","software","product"], reply: "We architect scalable SaaS platforms built on modern infrastructure — real-time data, multi-tenant architecture, and AI woven in from day one. What problem is your product solving in the market?" },
  { trigger: ["chatbot","bot","ai assistant","conversational"], reply: "Our AI chatbots are fine-tuned on your business context — they qualify leads, handle FAQs, book meetings, and escalate intelligently, 24/7. They don't just respond — they convert. Want to see how this could work for your business?" },
  { trigger: ["scale","grow","growth","expand","bigger"], reply: "Scaling is where most digital systems break down. Kasha Tech builds infrastructure that compounds — the more you grow, the more intelligent and efficient your systems become. What's your growth horizon?" },
  { trigger: ["time","how long","fast","quick","timeline"], reply: "Most projects go live within 2–6 weeks. We run parallel workstreams to compress timelines without sacrificing quality. Speed-to-market is a competitive advantage — let's talk about your launch window." },
  { trigger: ["book","call","meet","consult","talk","schedule"], reply: "Excellent. A strategy call is the best next step — our team will audit your current systems and map exactly how Kasha Tech can generate ROI for you. Click 'Book a Call' in the top right to schedule your free session." },
  { trigger: ["result","roi","impact","success","outcome"], reply: "Our clients typically see 10x faster workflows, 340% improvement in conversion, and 85% reduction in manual work within the first quarter. The ROI compounds as the systems learn. What metric matters most to your business?" },
  { trigger: ["ai","artificial intelligence","machine learning","intelligence"], reply: "Kasha Tech is AI-native — every system we build has intelligence at its core, not bolted on as an afterthought. AI isn't a feature for us, it's the foundation. What aspect of AI transformation are you most interested in?" },
];

function getAIReply(msg) {
  const ml = msg.toLowerCase();
  for (const r of BOT_RESPONSES) {
    if (r.trigger.some(t => ml.includes(t))) return r.reply;
  }
  return "Great question. Kasha Tech exists to help ambitious businesses operate at the cutting edge of digital possibility — through automation, intelligent design, and scalable architecture. What's the biggest challenge your business faces right now?";
}

const QUICK_REPLIES = [
  "What services do you offer?",
  "How does AI automation work?",
  "Tell me about web design",
  "How fast can you deliver?",
  "Book a strategy call",
];

function AIOrb({ size = 56, pulse = true }) {
  return (
    <div style={{position:"relative",width:size,height:size,flexShrink:0}}>
      {/* Outer ring */}
      {pulse && <div className="orb-ring" style={{position:"absolute",inset:-4,borderRadius:"50%",border:"2px solid rgba(99,102,241,.4)",pointerEvents:"none"}}/>}
      {/* Main orb */}
      <div style={{width:"100%",height:"100%",borderRadius:"50%",background:"conic-gradient(from 0deg,#6366f1,#a78bfa,#22d3ee,#6366f1)",animation:"orbRotate 4s linear infinite",position:"relative",boxShadow:"0 0 20px rgba(99,102,241,.6),0 0 40px rgba(99,102,241,.2)"}}>
        <div style={{position:"absolute",inset:3,borderRadius:"50%",background:"linear-gradient(135deg,#0a0823,#06041a)",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <div style={{width:"45%",height:"45%",borderRadius:"50%",background:"radial-gradient(circle at 35% 35%,rgba(167,139,250,.9),rgba(99,102,241,.4))",boxShadow:"0 0 12px rgba(99,102,241,.8)"}}/>
        </div>
      </div>
    </div>
  );
}

function Chatbot({ onOpenModal }) {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([
    { from:"bot", text:"Hey! I'm Kasha Tech's AI consultant 👋\n\nI help businesses discover how intelligent automation and premium digital systems can transform their operations.\n\nWhat kind of business are you building?" }
  ]);
  const [inp, setInp] = useState("");
  const [typing, setTyping] = useState(false);
  const [showQuick, setShowQuick] = useState(true);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior:"smooth" }); }, [msgs, typing]);

  const send = useCallback((msg) => {
    const text = (msg || inp).trim();
    if (!text) return;
    setInp(""); setShowQuick(false);
    setMsgs(p => [...p, { from:"user", text }]);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const reply = getAIReply(text);
      // Check if reply is about booking → offer modal
      const shouldOfferModal = text.toLowerCase().includes("book")||text.toLowerCase().includes("call")||text.toLowerCase().includes("consult")||reply.includes("Book a Call");
      setMsgs(p => [...p, { from:"bot", text: reply, cta: shouldOfferModal }]);
    }, 800 + Math.random()*700);
  }, [inp]);

  return (
    <>
      {/* Launcher */}
      <div onClick={() => setOpen(o=>!o)} className="orb-launcher" style={{position:"fixed",bottom:28,right:28,zIndex:1001,cursor:"pointer",transition:"transform .2s"}}>
        <AIOrb size={60} pulse={!open}/>
        {!open && (
          <div style={{position:"absolute",top:-8,right:-8,width:20,height:20,borderRadius:"50%",background:"linear-gradient(135deg,#22d3ee,#6366f1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,color:"#fff",fontFamily:"'Syne',sans-serif",boxShadow:"0 0 10px rgba(34,211,238,.6)",animation:"pulse 2s infinite"}}>AI</div>
        )}
      </div>

      {open && (
        <div style={{position:"fixed",bottom:100,right:28,width:390,maxHeight:580,zIndex:1001,display:"flex",flexDirection:"column",background:"linear-gradient(160deg,rgba(8,6,28,.98) 0%,rgba(4,3,18,.99) 100%)",border:"1px solid rgba(99,102,241,.25)",borderRadius:24,overflow:"hidden",backdropFilter:"blur(40px)",boxShadow:"0 40px 100px rgba(0,0,0,.7),0 0 80px rgba(99,102,241,.1),inset 0 1px 0 rgba(255,255,255,.04)",animation:"chatSlideIn .3s cubic-bezier(.34,1.56,.64,1) both"}}>
          {/* Glow */}
          <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at top,rgba(99,102,241,.06) 0%,transparent 60%)",pointerEvents:"none"}}/>
          <div style={{position:"absolute",top:0,left:"20%",right:"20%",height:1,background:"linear-gradient(to right,transparent,rgba(99,102,241,.5),transparent)"}}/>

          {/* Header */}
          <div style={{padding:"16px 20px",borderBottom:"1px solid rgba(99,102,241,.1)",display:"flex",alignItems:"center",gap:12,position:"relative",flexShrink:0}}>
            <AIOrb size={40} pulse={false}/>
            <div style={{flex:1}}>
              <div style={{color:"#fff",fontSize:14,fontWeight:700,fontFamily:"'Syne',sans-serif"}}>Kasha Tech AI Consultant</div>
              <div style={{fontSize:11,color:"#22d3ee",display:"flex",alignItems:"center",gap:6,marginTop:2}}>
                <span style={{width:6,height:6,borderRadius:"50%",background:"#22d3ee",display:"inline-block",animation:"pulse 1.5s infinite",boxShadow:"0 0 6px #22d3ee"}}/>
                Online · Instant Response
              </div>
            </div>
            <div style={{display:"flex",gap:8}}>
              <div style={{fontSize:9,color:"#a78bfa",border:"1px solid rgba(167,139,250,.3)",borderRadius:4,padding:"3px 6px",letterSpacing:1,fontFamily:"'DM Sans',sans-serif",background:"rgba(167,139,250,.05)"}}>AI POWERED</div>
              <div onClick={()=>setOpen(false)} style={{color:"rgba(255,255,255,.4)",cursor:"pointer",fontSize:22,lineHeight:1,fontFamily:"system-ui",transition:"color .2s"}}
                onMouseEnter={e=>e.target.style.color="#fff"} onMouseLeave={e=>e.target.style.color="rgba(255,255,255,.4)"}>×</div>
            </div>
          </div>

          {/* Messages */}
          <div style={{flex:1,overflowY:"auto",padding:16,display:"flex",flexDirection:"column",gap:12,scrollbarWidth:"thin",scrollbarColor:"rgba(99,102,241,.2) transparent"}}>
            {msgs.map((m,i) => (
              <div key={i} style={{display:"flex",flexDirection:"column",alignItems:m.from==="user"?"flex-end":"flex-start",gap:6,animation:"msgIn .3s ease both"}}>
                {m.from==="bot" && (
                  <div style={{display:"flex",alignItems:"flex-end",gap:8,maxWidth:"88%"}}>
                    <div style={{width:24,height:24,borderRadius:"50%",background:"conic-gradient(from 0deg,#6366f1,#a78bfa,#22d3ee,#6366f1)",animation:"orbRotate 4s linear infinite",flexShrink:0,position:"relative",boxShadow:"0 0 8px rgba(99,102,241,.5)"}}>
                      <div style={{position:"absolute",inset:2,borderRadius:"50%",background:"#0a0823",display:"flex",alignItems:"center",justifyContent:"center"}}>
                        <div style={{width:8,height:8,borderRadius:"50%",background:"rgba(167,139,250,.9)"}}/>
                      </div>
                    </div>
                    <div style={{padding:"12px 15px",borderRadius:"18px 18px 18px 4px",background:"rgba(255,255,255,.05)",border:"1px solid rgba(99,102,241,.15)",color:"rgba(255,255,255,.88)",fontSize:13.5,lineHeight:1.7,whiteSpace:"pre-wrap",boxShadow:"0 4px 20px rgba(0,0,0,.3)"}}>
                      {m.text}
                      {m.cta && (
                        <button onClick={onOpenModal} style={{display:"block",marginTop:12,background:"linear-gradient(135deg,#6366f1,#8b5cf6)",border:"none",borderRadius:8,padding:"9px 16px",color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'Syne',sans-serif",boxShadow:"0 0 20px rgba(99,102,241,.4)",transition:"all .2s",width:"100%",textAlign:"center"}}>
                          📅 Book a Free Strategy Call →
                        </button>
                      )}
                    </div>
                  </div>
                )}
                {m.from==="user" && (
                  <div style={{maxWidth:"80%",padding:"11px 15px",borderRadius:"18px 18px 4px 18px",background:"linear-gradient(135deg,#6366f1,#7c3aed)",color:"#fff",fontSize:13.5,lineHeight:1.65,boxShadow:"0 0 20px rgba(99,102,241,.3),0 4px 20px rgba(0,0,0,.3)"}}>
                    {m.text}
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {typing && (
              <div style={{display:"flex",alignItems:"flex-end",gap:8}}>
                <div style={{width:24,height:24,borderRadius:"50%",background:"conic-gradient(from 0deg,#6366f1,#a78bfa,#22d3ee,#6366f1)",animation:"orbRotate 4s linear infinite",flexShrink:0,position:"relative",boxShadow:"0 0 8px rgba(99,102,241,.5)"}}>
                  <div style={{position:"absolute",inset:2,borderRadius:"50%",background:"#0a0823",display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <div style={{width:8,height:8,borderRadius:"50%",background:"rgba(167,139,250,.9)"}}/>
                  </div>
                </div>
                <div style={{padding:"12px 16px",background:"rgba(255,255,255,.05)",border:"1px solid rgba(99,102,241,.15)",borderRadius:"18px 18px 18px 4px",display:"flex",gap:5,alignItems:"center"}}>
                  {[0,1,2].map(i=><div key={i} style={{width:7,height:7,borderRadius:"50%",background:"linear-gradient(135deg,#6366f1,#a78bfa)",animation:`thinkDot 1.4s ${i*.16}s ease-in-out infinite`}}/>)}
                </div>
              </div>
            )}

            {/* Quick replies */}
            {showQuick && !typing && (
              <div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:4}}>
                {QUICK_REPLIES.map((q,i)=>(
                  <button key={i} onClick={()=>send(q)} style={{background:"rgba(99,102,241,.08)",border:"1px solid rgba(99,102,241,.25)",borderRadius:20,padding:"7px 14px",color:"#a5b4fc",fontSize:12,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",transition:"all .2s",whiteSpace:"nowrap"}}
                    onMouseEnter={e=>{e.currentTarget.style.background="rgba(99,102,241,.2)";e.currentTarget.style.borderColor="rgba(99,102,241,.5)";e.currentTarget.style.color="#fff";}}
                    onMouseLeave={e=>{e.currentTarget.style.background="rgba(99,102,241,.08)";e.currentTarget.style.borderColor="rgba(99,102,241,.25)";e.currentTarget.style.color="#a5b4fc";}}>
                    {q}
                  </button>
                ))}
              </div>
            )}
            <div ref={endRef}/>
          </div>

          {/* Input */}
          <div style={{padding:"12px 16px",borderTop:"1px solid rgba(99,102,241,.1)",display:"flex",gap:8,position:"relative",flexShrink:0,background:"rgba(0,0,0,.2)"}}>
            <input value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Ask about our services, automation, results..."
              style={{flex:1,background:"rgba(255,255,255,.04)",border:"1px solid rgba(99,102,241,.18)",borderRadius:12,padding:"11px 14px",color:"#fff",fontSize:13,outline:"none",fontFamily:"'DM Sans',sans-serif",transition:"border .2s,box-shadow .2s"}}
              onFocus={e=>{e.target.style.borderColor="rgba(99,102,241,.6)";e.target.style.boxShadow="0 0 0 2px rgba(99,102,241,.15),0 0 20px rgba(99,102,241,.08)";}}
              onBlur={e=>{e.target.style.borderColor="rgba(99,102,241,.18)";e.target.style.boxShadow="none";}}/>
            <button onClick={()=>send()} style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)",border:"none",borderRadius:12,padding:"0 16px",color:"#fff",cursor:"pointer",fontSize:16,boxShadow:"0 0 16px rgba(99,102,241,.4)",transition:"box-shadow .2s,transform .2s",display:"flex",alignItems:"center",justifyContent:"center"}}
              onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 0 28px rgba(99,102,241,.8)";e.currentTarget.style.transform="scale(1.05)";}}
              onMouseLeave={e=>{e.currentTarget.style.boxShadow="0 0 16px rgba(99,102,241,.4)";e.currentTarget.style.transform="scale(1)";}}>↑</button>
          </div>

          {/* Footer */}
          <div style={{padding:"8px 16px 12px",textAlign:"center",borderTop:"1px solid rgba(255,255,255,.03)"}}>
            <span style={{fontSize:10.5,color:"rgba(255,255,255,.2)",fontFamily:"'DM Sans',sans-serif",letterSpacing:.3}}>Powered by Kasha Intelligence · Never discusses pricing</span>
          </div>
        </div>
      )}
    </>
  );
}

/* ─────────────────────────────────────────────
   SECTION WRAPPER
─────────────────────────────────────────────── */
function Section({ children, id, style={} }) {
  const [ref, inView] = useInView(0.08);
  return (
    <section id={id} ref={ref} style={{opacity:inView?1:0,transform:inView?"translateY(0)":"translateY(24px)",transition:"opacity .8s, transform .8s",...style}}>
      {children}
    </section>
  );
}

/* ─────────────────────────────────────────────
   DATA
─────────────────────────────────────────────── */
const SERVICES = [
  { icon:"⚡",title:"AI Automation",desc:"End-to-end intelligent automation pipelines that eliminate repetitive tasks and unlock scale." },
  { icon:"🌐",title:"SaaS Development",desc:"Scalable, production-ready SaaS platforms built with modern architecture and real-time data." },
  { icon:"✦",title:"Premium Web Design",desc:"Cinematic, conversion-optimized websites that position your brand at the apex of your industry." },
  { icon:"🤖",title:"AI Chatbot Integration",desc:"Context-aware conversational AI that qualifies leads, answers queries, and books meetings 24/7." },
  { icon:"⚙",title:"Workflow Automation",desc:"Intelligent business workflows that self-optimize and reduce human error to near zero." },
  { icon:"🚀",title:"Landing Pages",desc:"High-converting landing pages engineered with A/B testing frameworks and analytics built in." },
  { icon:"🔗",title:"API Integrations",desc:"Seamlessly connect your entire tech stack with intelligent, fault-tolerant API orchestration." },
];

const PROCESS = [
  { n:"01",t:"Discovery",d:"Deep-dive into your goals, pain points, and technical landscape." },
  { n:"02",t:"Strategy",d:"Map a precise roadmap with milestones, deliverables, and ROI targets." },
  { n:"03",t:"Design",d:"Craft pixel-perfect, conversion-engineered interfaces and architectures." },
  { n:"04",t:"Automation",d:"Build intelligent pipelines that work continuously in the background." },
  { n:"05",t:"Development",d:"Write clean, scalable code with modern frameworks and best practices." },
  { n:"06",t:"Launch",d:"Deploy with zero downtime, full monitoring, and dedicated support." },
];

const NAV = ["Home","Services","Solutions","Process","About","Contact"];

/* ─────────────────────────────────────────────
   MAIN APP
─────────────────────────────────────────────── */
export default function KashaTech() {
  const [loaded, setLoaded] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mouse, setMouse] = useState({ x:0, y:0 });
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const s = () => setScrolled(window.scrollY > 50);
    const m = e => setMouse({ x:e.clientX, y:e.clientY });
    window.addEventListener("scroll", s);
    window.addEventListener("mousemove", m);
    return () => { window.removeEventListener("scroll",s); window.removeEventListener("mousemove",m); };
  }, []);

  const scrollTo = id => document.getElementById(id)?.scrollIntoView({ behavior:"smooth" });
  const openModal = () => setModalOpen(true);

  const parallaxStyle = (strength=30) => ({
    transform:`translate(${(mouse.x/window.innerWidth-.5)*strength}px,${(mouse.y/window.innerHeight-.5)*strength}px)`,
    transition:"transform .15s ease-out",
  });

  return (
    <div style={{fontFamily:"'DM Sans',system-ui,sans-serif",background:"#02020a",color:"#fff",minHeight:"100vh",overflowX:"hidden"}}>
      <style>{GLOBAL_CSS}</style>
      {!loaded && <Loader onDone={()=>setLoaded(true)}/>}
      <ParticleCanvas mouseX={mouse.x} mouseY={mouse.y}/>
      <ContactModal isOpen={modalOpen} onClose={()=>setModalOpen(false)}/>

      {/* Ambient orbs */}
      <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0,overflow:"hidden"}}>
        <div style={{position:"absolute",top:"-20%",left:"-10%",width:700,height:700,borderRadius:"50%",background:"radial-gradient(circle,rgba(99,102,241,.07) 0%,transparent 70%)",filter:"blur(60px)",animation:"orb1 15s ease-in-out infinite",...parallaxStyle(20)}}/>
        <div style={{position:"absolute",top:"40%",right:"-15%",width:600,height:600,borderRadius:"50%",background:"radial-gradient(circle,rgba(34,211,238,.05) 0%,transparent 70%)",filter:"blur(60px)",animation:"orb2 18s ease-in-out infinite",...parallaxStyle(-15)}}/>
        <div style={{position:"absolute",bottom:"-10%",left:"30%",width:500,height:500,borderRadius:"50%",background:"radial-gradient(circle,rgba(167,139,250,.04) 0%,transparent 70%)",filter:"blur(60px)",animation:"orb3 12s ease-in-out infinite"}}/>
      </div>

      {/* Grid overlay */}
      <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0,opacity:.35}}>
        <svg width="100%" height="100%" style={{position:"absolute",inset:0}}>
          <defs>
            <pattern id="smallgrid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(99,102,241,.08)" strokeWidth=".5"/></pattern>
            <pattern id="grid" width="200" height="200" patternUnits="userSpaceOnUse"><rect width="200" height="200" fill="url(#smallgrid)"/><path d="M 200 0 L 0 0 0 200" fill="none" stroke="rgba(99,102,241,.12)" strokeWidth="1"/></pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)"/>
        </svg>
      </div>

      {/* NAVBAR */}
      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,height:68,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 max(40px,4vw)",background:scrolled?"rgba(2,2,10,.8)":"transparent",backdropFilter:scrolled?"blur(32px)":"none",borderBottom:scrolled?"1px solid rgba(99,102,241,.1)":"none",transition:"all .4s"}}>
        <KashaLogo size="nav" />
        <div style={{display:"flex",gap:36,alignItems:"center"}}>
          {NAV.map(l=>(
            <button key={l} onClick={()=>scrollTo(l.toLowerCase())} style={{background:"none",border:"none",color:"rgba(255,255,255,.45)",fontSize:14,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontWeight:500,transition:"color .2s",padding:"4px 0",letterSpacing:.3}}
              onMouseEnter={e=>e.target.style.color="#fff"} onMouseLeave={e=>e.target.style.color="rgba(255,255,255,.45)"}>{l}</button>
          ))}
          <button onClick={openModal} style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)",border:"none",borderRadius:10,padding:"10px 22px",color:"#fff",fontSize:13.5,fontWeight:600,cursor:"pointer",fontFamily:"'Syne',sans-serif",letterSpacing:.5,boxShadow:"0 0 24px rgba(99,102,241,.45)",transition:"all .3s"}}
            onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 0 40px rgba(99,102,241,.8)";e.currentTarget.style.transform="translateY(-1px)";}}
            onMouseLeave={e=>{e.currentTarget.style.boxShadow="0 0 24px rgba(99,102,241,.45)";e.currentTarget.style.transform="translateY(0)";}}>
            Book a Call
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section id="home" style={{minHeight:"100vh",display:"flex",alignItems:"center",padding:"120px max(60px,6vw) 80px",position:"relative",zIndex:1}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:80,alignItems:"center",maxWidth:1280,margin:"0 auto",width:"100%"}}>
          <div style={{animation:"fadeUp .9s ease both",animationDelay:".3s"}}>
            <div style={{display:"inline-flex",alignItems:"center",gap:10,background:"rgba(99,102,241,.08)",border:"1px solid rgba(99,102,241,.25)",borderRadius:100,padding:"8px 18px",marginBottom:28,backdropFilter:"blur(20px)"}}>
              <span style={{width:7,height:7,borderRadius:"50%",background:"#22d3ee",display:"inline-block",animation:"pulse 1.5s infinite",boxShadow:"0 0 10px #22d3ee"}}/>
              <span style={{fontSize:12,color:"#a5b4fc",letterSpacing:1.5,fontWeight:600,fontFamily:"'DM Sans',sans-serif"}}>NEXT-GEN AI SOLUTIONS</span>
            </div>
            <h1 style={{fontSize:"clamp(36px,5.5vw,66px)",fontWeight:800,lineHeight:1.06,letterSpacing:-2,fontFamily:"'Syne',sans-serif",marginBottom:24}}>
              Building{" "}
              <span style={{background:"linear-gradient(135deg,#6366f1 0%,#a78bfa 40%,#22d3ee 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundSize:"200% auto",animation:"shimmer 3s linear infinite",display:"inline-block"}}>Intelligent</span>
              <br/>Digital Experiences
            </h1>
            <p style={{fontSize:17,color:"rgba(255,255,255,.45)",lineHeight:1.8,marginBottom:40,maxWidth:460,fontFamily:"'DM Sans',sans-serif"}}>
              Kasha Tech helps ambitious businesses automate workflows, create premium websites, integrate AI systems, and build scalable digital experiences that dominate their market.
            </p>
            <div style={{display:"flex",gap:14,flexWrap:"wrap",marginBottom:48}}>
              <button onClick={openModal} style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)",border:"none",borderRadius:12,padding:"15px 32px",color:"#fff",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"'Syne',sans-serif",boxShadow:"0 0 40px rgba(99,102,241,.45)",transition:"all .3s"}}
                onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 10px 40px rgba(99,102,241,.7)";}}
                onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 0 40px rgba(99,102,241,.45)";}}>
                Start Your Project →
              </button>
              <button onClick={()=>scrollTo("services")} style={{background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.1)",borderRadius:12,padding:"15px 32px",color:"rgba(255,255,255,.8)",fontSize:15,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",transition:"all .3s",backdropFilter:"blur(10px)"}}
                onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,.07)";e.currentTarget.style.borderColor="rgba(255,255,255,.2)";}}
                onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,.03)";e.currentTarget.style.borderColor="rgba(255,255,255,.1)";}}>
                Explore Services
              </button>
            </div>
            <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
              {[{label:"Automation Active",color:"#22d3ee",delay:"0s"},{label:"AI Running",color:"#a78bfa",delay:".2s"},{label:"System Optimized",color:"#34d399",delay:".4s"}].map((c,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:7,background:"rgba(255,255,255,.03)",border:`1px solid ${c.color}30`,borderRadius:8,padding:"7px 14px",backdropFilter:"blur(10px)",animation:`floatY ${2.5+i*.5}s ease-in-out infinite`,animationDelay:c.delay}}>
                  <div style={{width:6,height:6,borderRadius:"50%",background:c.color,boxShadow:`0 0 8px ${c.color}`,animation:"pulse 1.5s infinite"}}/>
                  <span style={{fontSize:12,color:c.color,fontWeight:500,fontFamily:"'DM Sans',sans-serif"}}>{c.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{animation:"fadeIn 1.2s ease both",animationDelay:".5s"}}>
            <HeroHologram mouseX={mouse.x} mouseY={mouse.y}/>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <div style={{position:"relative",zIndex:1,padding:"48px max(60px,6vw)",borderTop:"1px solid rgba(255,255,255,.04)",borderBottom:"1px solid rgba(255,255,255,.04)",background:"rgba(99,102,241,.025)"}}>
        <div style={{maxWidth:1280,margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:40}}>
          {[{v:10,s:"x",l:"Faster Workflows"},{v:340,s:"%",l:"Better Conversion"},{v:85,s:"%",l:"Less Manual Work"},{v:48,s:"h",l:"Avg. Turnaround"}].map((s,i)=>(
            <div key={i} style={{textAlign:"center"}}>
              <div style={{fontSize:52,fontWeight:800,fontFamily:"'Syne',sans-serif",background:"linear-gradient(135deg,#6366f1,#a78bfa,#22d3ee)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",lineHeight:1.1}}>
                <Counter val={s.v} suffix={s.s}/>
              </div>
              <div style={{color:"rgba(255,255,255,.4)",fontSize:13,marginTop:6,fontFamily:"'DM Sans',sans-serif",letterSpacing:.5}}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* SERVICES */}
      <Section id="services" style={{padding:"120px max(60px,6vw)",position:"relative",zIndex:1}}>
        <div style={{maxWidth:1280,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:72}}>
            <div style={{color:"#6366f1",fontSize:12,letterSpacing:3,marginBottom:14,fontWeight:600,fontFamily:"'DM Sans',sans-serif"}}>CAPABILITIES</div>
            <h2 style={{fontSize:"clamp(32px,4vw,52px)",fontWeight:800,letterSpacing:-1.5,fontFamily:"'Syne',sans-serif",marginBottom:16}}>Everything Your Business Needs</h2>
            <p style={{color:"rgba(255,255,255,.4)",fontSize:17,maxWidth:480,margin:"0 auto",fontFamily:"'DM Sans',sans-serif",lineHeight:1.7}}>A complete suite of intelligent digital services, delivered with precision and speed.</p>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:20}}>
            {SERVICES.slice(0,4).map((s,i)=><ServiceCard key={i} {...s} delay={i*60}/>)}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20,marginTop:20,maxWidth:"75%",margin:"20px auto 0"}}>
            {SERVICES.slice(4).map((s,i)=><ServiceCard key={i+4} {...s} delay={(i+4)*60}/>)}
          </div>
        </div>
      </Section>

      {/* WHY KASHA TECH */}
      <Section id="solutions" style={{padding:"120px max(60px,6vw)",background:"rgba(99,102,241,.02)",borderTop:"1px solid rgba(255,255,255,.04)",borderBottom:"1px solid rgba(255,255,255,.04)",position:"relative",zIndex:1}}>
        <div style={{maxWidth:1280,margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1fr",gap:100,alignItems:"center"}}>
          <div>
            <div style={{color:"#6366f1",fontSize:12,letterSpacing:3,marginBottom:14,fontWeight:600,fontFamily:"'DM Sans',sans-serif"}}>WHY KASHA TECH</div>
            <h2 style={{fontSize:"clamp(30px,3.5vw,48px)",fontWeight:800,fontFamily:"'Syne',sans-serif",letterSpacing:-1.5,marginBottom:20,lineHeight:1.1}}>Built for the Next Generation of Business</h2>
            <p style={{color:"rgba(255,255,255,.4)",fontSize:16,lineHeight:1.8,marginBottom:40,fontFamily:"'DM Sans',sans-serif"}}>We architect intelligent digital ecosystems that evolve with your business, automate your operations, and create compounding competitive advantage.</p>
            {[["⚡","Fast Delivery","Parallel workstreams compress timelines without cutting corners."],["🧠","AI-Native","Every system we build has intelligence woven in from day one."],["📐","Modern UI/UX","Interfaces engineered for beauty, usability, and conversion."],["🔒","Scalable Architecture","Infrastructure that grows with you from MVP to enterprise."]].map(([icon,t,d],i)=>(
              <div key={i} style={{display:"flex",gap:18,marginBottom:28}}>
                <div style={{width:48,height:48,borderRadius:12,background:"rgba(99,102,241,.08)",border:"1px solid rgba(99,102,241,.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0,boxShadow:"0 0 20px rgba(99,102,241,.1)"}}>{icon}</div>
                <div>
                  <div style={{fontWeight:700,marginBottom:5,fontFamily:"'Syne',sans-serif",fontSize:15}}>{t}</div>
                  <div style={{color:"rgba(255,255,255,.4)",fontSize:14,lineHeight:1.7,fontFamily:"'DM Sans',sans-serif"}}>{d}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            {[["10x","Faster Workflows","⚡"],["340%","Better Conversion","📈"],["85%","Less Manual Work","🤖"],["48h","Avg. Turnaround","⏱"]].map(([v,l,ic],i)=>(
              <div key={i} style={{background:"rgba(255,255,255,.02)",border:"1px solid rgba(255,255,255,.06)",borderRadius:20,padding:"32px 24px",textAlign:"center",position:"relative",overflow:"hidden",transition:"all .3s"}}
                onMouseEnter={e=>{e.currentTarget.style.background="rgba(99,102,241,.06)";e.currentTarget.style.borderColor="rgba(99,102,241,.3)";e.currentTarget.style.transform="translateY(-4px)";}}
                onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,.02)";e.currentTarget.style.borderColor="rgba(255,255,255,.06)";e.currentTarget.style.transform="translateY(0)";}}>
                <div style={{position:"absolute",top:0,right:0,fontSize:36,opacity:.08,transform:"translate(5px,-5px)"}}>{ic}</div>
                <div style={{fontSize:42,fontWeight:800,fontFamily:"'Syne',sans-serif",background:"linear-gradient(135deg,#6366f1,#a78bfa,#22d3ee)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",marginBottom:8}}>{v}</div>
                <div style={{fontSize:12,color:"rgba(255,255,255,.4)",fontFamily:"'DM Sans',sans-serif",letterSpacing:.5}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* PROCESS */}
      <Section id="process" style={{padding:"120px max(60px,6vw)",position:"relative",zIndex:1}}>
        <div style={{maxWidth:1280,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:72}}>
            <div style={{color:"#6366f1",fontSize:12,letterSpacing:3,marginBottom:14,fontWeight:600,fontFamily:"'DM Sans',sans-serif"}}>OUR PROCESS</div>
            <h2 style={{fontSize:"clamp(30px,4vw,52px)",fontWeight:800,fontFamily:"'Syne',sans-serif",letterSpacing:-1.5}}>How We Deliver Excellence</h2>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:24}}>
            {PROCESS.map((p,i)=>(
              <div key={i} style={{position:"relative",background:"rgba(255,255,255,.015)",border:"1px solid rgba(255,255,255,.06)",borderRadius:20,padding:"36px 28px",overflow:"hidden",transition:"all .3s",cursor:"default"}}
                onMouseEnter={e=>{e.currentTarget.style.background="rgba(99,102,241,.06)";e.currentTarget.style.borderColor="rgba(99,102,241,.3)";e.currentTarget.style.transform="translateY(-6px)";e.currentTarget.style.boxShadow="0 20px 60px rgba(99,102,241,.15)";}}
                onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,.015)";e.currentTarget.style.borderColor="rgba(255,255,255,.06)";e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none";}}>
                <div style={{position:"absolute",top:16,right:20,fontSize:56,fontWeight:900,color:"rgba(99,102,241,.06)",fontFamily:"'Syne',sans-serif",lineHeight:1}}>{p.n}</div>
                <div style={{width:40,height:40,borderRadius:10,background:"linear-gradient(135deg,#6366f1,#8b5cf6)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:20,fontSize:15,fontWeight:700,color:"#fff",fontFamily:"'Syne',sans-serif",boxShadow:"0 0 24px rgba(99,102,241,.4)"}}>{parseInt(p.n)}</div>
                <div style={{fontWeight:700,fontSize:18,marginBottom:10,fontFamily:"'Syne',sans-serif"}}>{p.t}</div>
                <div style={{color:"rgba(255,255,255,.4)",fontSize:14,lineHeight:1.7,fontFamily:"'DM Sans',sans-serif"}}>{p.d}</div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ABOUT */}
      <Section id="about" style={{padding:"120px max(60px,6vw)",background:"rgba(99,102,241,.02)",borderTop:"1px solid rgba(255,255,255,.04)",position:"relative",zIndex:1}}>
        <div style={{maxWidth:900,margin:"0 auto",textAlign:"center"}}>
          <div style={{color:"#6366f1",fontSize:12,letterSpacing:3,marginBottom:14,fontWeight:600,fontFamily:"'DM Sans',sans-serif"}}>ABOUT KASHA TECH</div>
          <h2 style={{fontSize:"clamp(28px,4vw,52px)",fontWeight:800,fontFamily:"'Syne',sans-serif",letterSpacing:-1.5,marginBottom:24}}>A Next-Generation Digital Solutions Studio</h2>
          <p style={{color:"rgba(255,255,255,.45)",fontSize:18,lineHeight:1.85,marginBottom:60,fontFamily:"'DM Sans',sans-serif"}}>
            Kasha Tech is where automation intelligence meets premium web craft. We exist to help forward-thinking businesses shed the weight of manual operations and step into a future where their digital infrastructure works continuously, intelligently, and at scale.
          </p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20}}>
            {[["🎯","Mission","To make intelligent automation accessible to every ambitious business, regardless of size."],["🔭","Vision","A world where every business operates at the cutting edge of digital possibility."],["⚡","Values","Speed, precision, innovation, and an uncompromising commitment to quality."]].map(([ic,t,d],i)=>(
              <div key={i} style={{background:"rgba(255,255,255,.015)",border:"1px solid rgba(255,255,255,.06)",borderRadius:20,padding:"32px 24px",transition:"all .3s",cursor:"default"}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(99,102,241,.3)";e.currentTarget.style.background="rgba(99,102,241,.05)";e.currentTarget.style.transform="translateY(-4px)";}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,.06)";e.currentTarget.style.background="rgba(255,255,255,.015)";e.currentTarget.style.transform="translateY(0)";}}>
                <div style={{fontSize:30,marginBottom:14}}>{ic}</div>
                <div style={{fontWeight:700,fontSize:16,marginBottom:10,fontFamily:"'Syne',sans-serif"}}>{t}</div>
                <div style={{color:"rgba(255,255,255,.4)",fontSize:13.5,lineHeight:1.75,fontFamily:"'DM Sans',sans-serif"}}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* CTA */}
      <section id="contact" style={{padding:"140px max(60px,6vw)",position:"relative",zIndex:1,overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,pointerEvents:"none"}}>
          <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:900,height:600,background:"radial-gradient(ellipse,rgba(99,102,241,.12) 0%,transparent 65%)",filter:"blur(40px)"}}/>
          <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:600,height:600,borderRadius:"50%",border:"1px solid rgba(99,102,241,.07)",animation:"spin 30s linear infinite"}}/>
          <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:450,height:450,borderRadius:"50%",border:"1px solid rgba(34,211,238,.05)",animation:"spinR 20s linear infinite"}}/>
          <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:300,height:300,borderRadius:"50%",border:"1px solid rgba(167,139,250,.06)",animation:"spin 15s linear infinite"}}/>
          <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",opacity:.04}}>
            <defs><pattern id="ctag" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="#6366f1" strokeWidth=".5"/></pattern></defs>
            <rect width="100%" height="100%" fill="url(#ctag)"/>
          </svg>
        </div>
        <div style={{maxWidth:720,margin:"0 auto",textAlign:"center",position:"relative",zIndex:1}}>
          <div style={{color:"#6366f1",fontSize:12,letterSpacing:3,marginBottom:20,fontWeight:600,fontFamily:"'DM Sans',sans-serif"}}>GET STARTED</div>
          <h2 style={{fontSize:"clamp(32px,5vw,68px)",fontWeight:800,fontFamily:"'Syne',sans-serif",letterSpacing:-2,lineHeight:1.05,marginBottom:22}}>
            Let's Build Something{" "}
            <span style={{background:"linear-gradient(135deg,#6366f1,#a78bfa,#22d3ee)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundSize:"200% auto",animation:"shimmer 3s linear infinite"}}>Intelligent</span>
          </h2>
          <p style={{color:"rgba(255,255,255,.4)",fontSize:18,marginBottom:48,lineHeight:1.7,fontFamily:"'DM Sans',sans-serif"}}>Book a free 30-minute strategy call. We'll audit your systems and map exactly how Kasha Tech can transform your digital operations.</p>
          <button onClick={openModal} style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)",border:"none",borderRadius:14,padding:"18px 44px",color:"#fff",fontSize:17,fontWeight:700,cursor:"pointer",fontFamily:"'Syne',sans-serif",letterSpacing:.5,boxShadow:"0 0 50px rgba(99,102,241,.5)",transition:"all .3s"}}
            onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow="0 16px 60px rgba(99,102,241,.8)";}}
            onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 0 50px rgba(99,102,241,.5)";}}>
            Let's Connect →
          </button>
          <div style={{marginTop:32,display:"flex",justifyContent:"center",gap:40}}>
            {["Free consultation","No commitment","Results in days"].map((t,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:8,color:"rgba(255,255,255,.35)",fontSize:13,fontFamily:"'DM Sans',sans-serif"}}>
                <span style={{color:"#22d3ee",fontSize:16}}>✓</span>{t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{padding:"40px max(60px,6vw)",borderTop:"1px solid rgba(255,255,255,.04)",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:24,position:"relative",zIndex:1}}>
        <div>
          <KashaLogo size="footer" />
          <div style={{color:"rgba(255,255,255,.25)",fontSize:13,fontFamily:"'DM Sans',sans-serif"}}>© 2025 Kasha Tech. All rights reserved.</div>
        </div>
        <div style={{display:"flex",gap:28}}>
          {NAV.map(l=>(
            <button key={l} onClick={()=>scrollTo(l.toLowerCase())} style={{background:"none",border:"none",color:"rgba(255,255,255,.3)",fontSize:13,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",transition:"color .2s"}}
              onMouseEnter={e=>e.target.style.color="#fff"} onMouseLeave={e=>e.target.style.color="rgba(255,255,255,.3)"}>{l}</button>
          ))}
        </div>
        <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4}}>
          <div style={{color:"rgba(255,255,255,.3)",fontSize:13,fontFamily:"'DM Sans',sans-serif"}}>hello@kashatech.ai</div>
          <div style={{display:"flex",gap:14}}>
            {["𝕏","in","gh"].map((s,i)=>(
              <span key={i} style={{color:"rgba(255,255,255,.2)",fontSize:14,cursor:"pointer",transition:"color .2s",fontFamily:"system-ui"}}
                onMouseEnter={e=>e.target.style.color="#6366f1"} onMouseLeave={e=>e.target.style.color="rgba(255,255,255,.2)"}>{s}</span>
            ))}
          </div>
        </div>
      </footer>

      <Chatbot onOpenModal={openModal}/>
    </div>
  );
}
