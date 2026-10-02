
/* ===================== AUDIO ===================== */
const AC = new (window.AudioContext||window.webkitAudioContext)();
function beep(freq,dur,type='sine',vol=.18,delay=0){
  const t0=AC.currentTime+delay;
  const o=AC.createOscillator(), g=AC.createGain();
  o.type=type; o.frequency.setValueAtTime(freq,t0);
  g.gain.setValueAtTime(0,t0); g.gain.linearRampToValueAtTime(vol,t0+.02); g.gain.exponentialRampToValueAtTime(.0001,t0+dur);
  o.connect(g); g.connect(AC.destination); o.start(t0); o.stop(t0+dur+.02);
}
const SFX={
  hit:()=>{beep(120,.25,'sawtooth',.22); beep(80,.3,'square',.15,.04);},
  correct:()=>{beep(660,.09,'sine'); beep(880,.12,'sine',.16,.09); beep(1180,.16,'sine',.14,.18);},
  wrong:()=>{beep(220,.18,'square',.2); beep(140,.22,'square',.18,.08);},
  laser:()=>beep(1400,.05,'sawtooth',.05),
  star:()=>{beep(880,.09,'sine',.18); beep(1320,.14,'sine',.16,.08); beep(1760,.18,'sine',.14,.16);},
  levelup:()=>{beep(520,.1,'triangle',.15); beep(780,.1,'triangle',.15,.1); beep(1040,.18,'triangle',.16,.2);},
  gameover:()=>{beep(300,.3,'sawtooth',.2); beep(200,.4,'sawtooth',.18,.15); beep(120,.6,'sawtooth',.16,.32);},
  victory:()=>{[523,659,784,1046].forEach((f,i)=>beep(f,.22,'triangle',.16,i*.13));}
};

/* ===================== QUESTIONS ===================== */
const R=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
function shuffle(arr){for(let i=arr.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[arr[i],arr[j]]=[arr[j],arr[i]];}return arr;}
function mkQ(topic,q,correct,wrongs,explain){
  const opts=shuffle([correct,...wrongs].map(String));
  return {topic,q,options:opts,correctIndex:opts.indexOf(String(correct)),explain};
}
const GEN=[
 // --- GEOMETRÍA ANALÍTICA ---
 ()=>{
  const trip=[[3,4,5],[6,8,10],[5,12,13],[8,6,10],[9,12,15]][R(0,4)];
  return mkQ('Distancia entre puntos',`Distancia entre (0,0) y (${trip[0]},${trip[1]}) = ?`,trip[2],shuffle([trip[2]+1,trip[2]-1,trip[0]+trip[1]]),
   `d=√(x²+y²)=√(${trip[0]}²+${trip[1]}²)=√${trip[0]*trip[0]+trip[1]*trip[1]}=${trip[2]}.`);
 },
 ()=>{
  const signs=[[1,1,'I'],[-1,1,'II'],[-1,-1,'III'],[1,-1,'IV']];
  const [sx,sy,quad]=signs[R(0,3)];
  const x=sx*R(2,9), y=sy*R(2,9);
  return mkQ('Plano cartesiano',`¿En qué cuadrante está el punto (${x}, ${y})?`,'Cuadrante '+quad,['Cuadrante '+signs[(signs.findIndex(s=>s[2]===quad)+1)%4][2],'Cuadrante '+signs[(signs.findIndex(s=>s[2]===quad)+2)%4][2],'Cuadrante '+signs[(signs.findIndex(s=>s[2]===quad)+3)%4][2]],
   `El signo de x es ${sx>0?'positivo':'negativo'} y el de y es ${sy>0?'positivo':'negativo'}, eso ubica el punto en el cuadrante ${quad}.`);
 },
 ()=>{
  const a=R(1,6);
  const kind=R(0,1);
  if(kind===0) return mkQ('Intervalos',`x > ${a}  se escribe como intervalo:`,`(${a}, ∞)`,[`[${a}, ∞)`,`(−∞, ${a})`,`(${a}, ${a+1})`],
   `Como x es mayor pero no igual a ${a}, el paréntesis va abierto en ${a} y se extiende hasta infinito: (${a}, ∞).`);
  return mkQ('Intervalos',`x ≤ ${a}  se escribe como intervalo:`,`(−∞, ${a}]`,[`(−∞, ${a})`,`[${a}, ∞)`,`(${a}, ∞]`],
   `Como x puede ser igual a ${a}, el corchete va cerrado en ${a}: (−∞, ${a}].`);
 },
 ()=>{
  const m=R(2,6),b=R(1,9);
  return mkQ('Pendiente (y=mx+b)',`En  y = ${m}x + ${b},  ¿cuál es la pendiente?`,m,shuffle([b,m+1,m-1>0?m-1:m+2]),
   `En la forma y=mx+b, el coeficiente que multiplica a x es la pendiente, aquí m=${m}.`);
 },
 ()=>{
  const x1=R(1,6), y1=R(1,8), m=R(2,5);
  return mkQ('Ecuación punto-pendiente',`Recta que pasa por (${x1},${y1}) con pendiente ${m}:`,`y − ${y1} = ${m}(x − ${x1})`,[`y − ${x1} = ${m}(x − ${y1})`,`y + ${y1} = ${m}(x + ${x1})`,`y − ${y1} = ${x1}(x − ${m})`],
   `La forma punto-pendiente es y − y₁ = m(x − x₁); con (x₁,y₁)=(${x1},${y1}) y m=${m} queda y − ${y1} = ${m}(x − ${x1}).`);
 },
 // --- TEORÍA DE FUNCIONES ---
 ()=>{
  const a=R(2,5), b=R(1,8), c=R(1,6);
  return mkQ('Evaluación de funciones',`Si f(x) = ${a}x + ${b}, ¿cuánto es f(${c})?`,a*c+b,shuffle([a*c,a+b+c,a*c+b+1]),
   `Sustituyes x por ${c}: f(${c})=${a}(${c})+${b}=${a*c}+${b}=${a*c+b}.`);
 },
 ()=>{
  const kind=R(0,1);
  if(kind===0) return mkQ('Dominio de funciones','¿Cuál es el dominio de f(x) = 1/x ?','x ≠ 0',['Todos los reales','x > 0','x ≠ 1'],
   'La división entre 0 no existe, así que el dominio excluye x=0.');
  return mkQ('Dominio de funciones','¿Cuál es el dominio de f(x) = √x ?','x ≥ 0',['Todos los reales','x ≤ 0','x ≠ 0'],
   'La raíz cuadrada de un número negativo no es real, así que x debe ser mayor o igual a 0.');
 },
 ()=>{
  const a=R(2,5), b=R(1,8);
  return mkQ('Función inversa',`Si f(x) = ${a}x + ${b}, ¿cuál es f⁻¹(x)?`,`(x − ${b}) / ${a}`,[`${a}x − ${b}`,`(x + ${b}) / ${a}`,`(x − ${a}) / ${b}`],
   `Despejas x: y=${a}x+${b} → y−${b}=${a}x → x=(y−${b})/${a}. Por eso f⁻¹(x)=(x−${b})/${a}.`);
 },
 ()=>{
  const a=R(1,5), b=R(1,6), c=R(1,5), d=R(1,6), x=R(1,4);
  const sum=(a*x+b)+(c*x+d);
  return mkQ('Operaciones entre funciones',`Si f(x)=${a}x+${b} y g(x)=${c}x+${d}, ¿cuánto es (f+g)(${x})?`,sum,shuffle([sum+1,sum-1,(a*x+b)*(c*x+d)]),
   `(f+g)(x)=f(x)+g(x). f(${x})=${a*x+b}, g(${x})=${c*x+d}, suma = ${sum}.`);
 },
 ()=>{
  const kind=R(0,1);
  if(kind===0) return mkQ('Concepto de función','El conjunto de pares {(1,2),(2,3),(3,5)} — ¿es una función?','Sí, cada x tiene un único y',['No, un x se repite','No, un y se repite','No se puede saber'],
   'Una relación es función si cada valor de x tiene exactamente un valor de y asociado; aquí no se repite ningún x.');
  return mkQ('Concepto de función','El conjunto de pares {(2,1),(2,4),(3,5)} — ¿es una función?','No, el valor x=2 se repite con dos y distintos',['Sí, es función','No, falta un par','No se puede saber'],
   'Como x=2 aparece asociado a dos valores distintos de y (1 y 4), no cumple la definición de función.');
 },
 // --- INTRODUCCIÓN A LÍMITES ---
 ()=>{
  const m=R(2,5), b=R(1,8), a=R(1,5);
  const val=m*a+b;
  return mkQ('Límites',`lim(x→${a}) de (${m}x + ${b}) = ?`,val,shuffle([val+1,val-1,m+b]),
   `Para una función continua como esta, el límite se calcula sustituyendo directamente: ${m}(${a})+${b}=${val}.`);
 },
 ()=>{
  return mkQ('Concepto de límite','¿Qué significa  lim(x→a) f(x) = L ?','El valor de f(x) se acerca a L cuando x se acerca a a',['f(a) siempre es igual a L',' f(x) nunca llega a L','x siempre es igual a a'],
   'El límite describe el valor al que se aproxima f(x) a medida que x se acerca a "a", sin que f(x) necesariamente tome ese valor exacto en a.');
 }
];
function randomQuestion(){ return GEN[R(0,GEN.length-1)](); }

/* ===================== LEVELS (path) ===================== */
const LEVELS=[
 {title:'Órbita Inicial',short:'1 · Fácil',name:'NIVEL 1 · FÁCIL',color:'#00f0ff',speed:3.3,spawnMs:108,gapH:148,doubleProb:0.12,tripleProb:0,obsMin:46,obsMax:76,laserMin:80,laserMax:112,target:100,zig:0.85},
 {title:'Cinturón de Asteroides',short:'2 · Medio',name:'NIVEL 2 · MEDIO',color:'#ffd23f',speed:4.9,spawnMs:60,gapH:98,doubleProb:0.42,tripleProb:0.16,obsMin:52,obsMax:86,laserMin:90,laserMax:130,target:100,zig:1.2},
 {title:'Zona Roja: Última Frontera',short:'3 · Difícil',name:'NIVEL 3 · DIFÍCIL',color:'#ff2ee6',speed:6.6,spawnMs:32,gapH:64,doubleProb:0.68,tripleProb:0.42,obsMin:58,obsMax:96,laserMin:100,laserMax:150,target:100,zig:1.6}
];
let curLevel=0;
let obstacleCount=0;

/* ===================== SHIP CUSTOMIZATION + SHOP ===================== */
const COLORS=[
 {key:'cyan',a:'#0aa8c9',b:'#4ff2ff',c:'#f4feff',glow:'#00f0ff'},
 {key:'magenta',a:'#7a0a63',b:'#ff5fe0',c:'#ffe6fb',glow:'#ff2ee6'},
 {key:'gold',a:'#8a6a06',b:'#ffd23f',c:'#fff6d0',glow:'#ffd23f'},
 {key:'green',a:'#0a7a53',b:'#4ffcc0',c:'#eafff6',glow:'#26ffb0'},
 {key:'red',a:'#7a0a1e',b:'#ff5f7a',c:'#ffe3e8',glow:'#ff3b5c'},
 {key:'violet',a:'#3d0a7a',b:'#b98bff',c:'#ede0ff',glow:'#7b2fff'}
];
const ACCESSORIES=[
 {key:'none',label:'Ninguno'},
 {key:'wingsGold',label:'Alerones Dorados'},
 {key:'noseAntenna',label:'Antena Radar'},
 {key:'flagBasic',label:'Bandera Piloto'},
 {key:'wingsSilver',label:'Alerones Plateados'},
 {key:'wingsRed',label:'Alerones Rojos'},
 {key:'wingsGreen',label:'Alerones Verdes'},
 {key:'wingsPurple',label:'Alerones Morados'},
 {key:'noseSpike',label:'Punta de Combate'},
 {key:'noseOrb',label:'Orbe de Energía'},
 {key:'noseScanner',label:'Escáner Frontal'},
 {key:'flagRed',label:'Bandera Roja'},
 {key:'flagCyan',label:'Bandera Cian'},
 {key:'flagPurple',label:'Bandera Morada'},
 {key:'decalCyan',label:'Franjas Cian'},
 {key:'decalMagenta',label:'Franjas Magenta'},
 {key:'decalGold',label:'Franjas Doradas'},
 {key:'glowPurple',label:'Estela Morada'},
 {key:'glowGreen',label:'Estela Verde'},
 {key:'chrome',label:'Blindaje Cromado'},
 {key:'halo',label:'Anillo de Energía'}
];
const FREE_COUNT=4;
function priceFor(i){ return i<FREE_COUNT?0:15+(i-FREE_COUNT)*7; }

let shipColorIdx=0, shipAccIdx=1;
let coins=0, unlocked=ACCESSORIES.map((a,i)=>i<FREE_COUNT);
let maxUnlocked=0;
const authorName='MARIA JOSE OLIVEROS B';
function saveProgress(){ try{ localStorage.setItem('mf_save_v1',JSON.stringify({coins,unlocked,colorIdx:shipColorIdx,accIdx:shipAccIdx,maxUnlocked})); }catch(e){} }
function loadProgress(){
  try{
    const raw=localStorage.getItem('mf_save_v1');
    if(raw){ const d=JSON.parse(raw);
      if(typeof d.coins==='number') coins=d.coins;
      if(Array.isArray(d.unlocked)&&d.unlocked.length===ACCESSORIES.length) unlocked=d.unlocked;
      if(typeof d.colorIdx==='number') shipColorIdx=d.colorIdx;
      if(typeof d.accIdx==='number') shipAccIdx=d.accIdx;
      if(typeof d.maxUnlocked==='number') maxUnlocked=d.maxUnlocked;
    }
  }catch(e){}
}
loadProgress();
function updateCoinBadge(){
  const a=document.getElementById('hudCoins'); if(a) a.textContent=coins;
  const b=document.getElementById('coinBalance'); if(b) b.textContent=coins;
}

function drawAccessory(ctx2,w,h,key){
  if(!key||key==='none') return;
  if(key.indexOf('wings')===0){
    const cm={wingsGold:'#ffd23f',wingsSilver:'#dfe6ea',wingsRed:'#ff3b5c',wingsGreen:'#26ffb0',wingsPurple:'#b98bff'};
    ctx2.strokeStyle=cm[key]||'#ffd23f'; ctx2.lineWidth=2.4;
    ctx2.beginPath(); ctx2.moveTo(w*0.16,h*0.2); ctx2.lineTo(-w*0.04,h*-0.08); ctx2.lineTo(w*0.3,h*0.3); ctx2.closePath(); ctx2.stroke();
    ctx2.beginPath(); ctx2.moveTo(w*0.16,h*0.8); ctx2.lineTo(-w*0.04,h*1.08); ctx2.lineTo(w*0.3,h*0.7); ctx2.closePath(); ctx2.stroke();
  } else if(key.indexOf('nose')===0){
    if(key==='noseAntenna'){
      ctx2.strokeStyle='#eafcff'; ctx2.lineWidth=1.6;
      ctx2.beginPath(); ctx2.moveTo(w*0.92,h*0.18); ctx2.lineTo(w*1.02,h*0.0); ctx2.stroke();
      ctx2.fillStyle='#ff3b5c'; ctx2.beginPath(); ctx2.arc(w*1.02,h*0.0,2.6,0,7); ctx2.fill();
    } else if(key==='noseSpike'){
      ctx2.fillStyle='#dfe6ea'; ctx2.beginPath(); ctx2.moveTo(w*0.97,h*0.5); ctx2.lineTo(w*1.16,h*0.5-3); ctx2.lineTo(w*1.16,h*0.5+3); ctx2.closePath(); ctx2.fill();
    } else if(key==='noseOrb'){
      const og=ctx2.createRadialGradient(w*1.0,h*0.5,0,w*1.0,h*0.5,7);
      og.addColorStop(0,'#fff'); og.addColorStop(1,'#7b2fff');
      ctx2.fillStyle=og; ctx2.shadowColor='#7b2fff'; ctx2.shadowBlur=10; ctx2.beginPath(); ctx2.arc(w*1.0,h*0.5,5,0,7); ctx2.fill(); ctx2.shadowBlur=0;
    } else if(key==='noseScanner'){
      ctx2.strokeStyle='#00f0ff'; ctx2.lineWidth=1.6;
      ctx2.beginPath(); ctx2.arc(w*0.94,h*0.5,8,0,Math.PI*1.4); ctx2.stroke();
    }
  } else if(key.indexOf('flag')===0){
    const cm={flagBasic:'#ffd23f',flagRed:'#ff3b5c',flagCyan:'#00f0ff',flagPurple:'#7b2fff'};
    ctx2.fillStyle=cm[key]||'#ffd23f';
    ctx2.beginPath(); ctx2.moveTo(w*0.12,h*0.02); ctx2.lineTo(w*0.12,h*-0.16); ctx2.lineTo(w*0.26,h*-0.08); ctx2.closePath(); ctx2.fill();
  } else if(key.indexOf('decal')===0){
    const cm={decalCyan:'#00f0ff',decalMagenta:'#ff2ee6',decalGold:'#ffd23f'};
    ctx2.strokeStyle=cm[key]||'#00f0ff'; ctx2.lineWidth=2; ctx2.globalAlpha=.85;
    ctx2.beginPath(); ctx2.arc(w*0.42,h*0.5,h*0.42,0.15,Math.PI-0.15); ctx2.stroke();
    ctx2.globalAlpha=1;
  } else if(key.indexOf('glow')===0){
    const cm={glowPurple:'#7b2fff',glowGreen:'#26ffb0'};
    const c=cm[key]||'#7b2fff';
    const gg=ctx2.createRadialGradient(-4,h/2,0,-4,h/2,32);
    gg.addColorStop(0,c+'aa'); gg.addColorStop(1,c+'00');
    ctx2.fillStyle=gg; ctx2.beginPath(); ctx2.ellipse(-4,h/2,28,15,0,0,7); ctx2.fill();
  } else if(key==='chrome'){
    ctx2.strokeStyle='rgba(255,255,255,.9)'; ctx2.lineWidth=1.6;
    ctx2.beginPath(); ctx2.moveTo(w*0.2,h*0.1); ctx2.quadraticCurveTo(w*0.55,h*0.0,w*0.8,h*0.14); ctx2.stroke();
  } else if(key==='halo'){
    ctx2.strokeStyle='#ffd23f'; ctx2.lineWidth=2.2; ctx2.globalAlpha=.85;
    ctx2.beginPath(); ctx2.ellipse(w*0.42,h*0.5,h*0.62,h*0.58,0,0,7); ctx2.stroke();
    ctx2.globalAlpha=1;
  }
}

function renderShip(ctx2,w,h,accKey){
  const col=COLORS[shipColorIdx];
  const time=performance.now();
  const flick=Math.sin(time*0.025)*4;

  // layered flame trail (3 tapering layers, like the reference art)
  for(let i=0;i<3;i++){
    const len=20+i*11+flick;
    const spread=h*0.22-i*3;
    ctx2.beginPath();
    ctx2.moveTo(-w*0.02,h*0.5-spread);
    ctx2.quadraticCurveTo(-len,h*0.5,-w*0.02,h*0.5+spread);
    ctx2.closePath();
    const fg=ctx2.createLinearGradient(-len,0,-w*0.02,0);
    fg.addColorStop(0,'#fff6c8'); fg.addColorStop(.45,'#ffb347'); fg.addColorStop(1,col.glow);
    ctx2.globalAlpha=0.95-i*0.24; ctx2.fillStyle=fg; ctx2.fill();
  }
  ctx2.globalAlpha=1;

  drawAccessory(ctx2,w,h,(accKey==='glowPurple'||accKey==='glowGreen')?accKey:null);

  // rear fins (behind body)
  const finGrad=ctx2.createLinearGradient(0,0,w*0.3,0);
  finGrad.addColorStop(0,col.a); finGrad.addColorStop(1,col.b);
  ctx2.fillStyle=finGrad; ctx2.strokeStyle='rgba(255,255,255,.5)'; ctx2.lineWidth=1;
  ctx2.beginPath(); ctx2.moveTo(w*0.16,h*0.2); ctx2.lineTo(-w*0.04,h*-0.08); ctx2.lineTo(w*0.3,h*0.3); ctx2.closePath(); ctx2.fill(); ctx2.stroke();
  ctx2.beginPath(); ctx2.moveTo(w*0.16,h*0.8); ctx2.lineTo(-w*0.04,h*1.08); ctx2.lineTo(w*0.3,h*0.7); ctx2.closePath(); ctx2.fill(); ctx2.stroke();
  drawAccessory(ctx2,w,h,accKey&&accKey.indexOf('wings')===0?accKey:null);

  drawAccessory(ctx2,w,h,accKey&&accKey.indexOf('flag')===0?accKey:null);

  // rounded capsule body
  ctx2.beginPath();
  ctx2.moveTo(w*0.03,h*0.18);
  ctx2.quadraticCurveTo(w*0.05,h*-0.04, w*0.26,h*0.0);
  ctx2.quadraticCurveTo(w*0.74,h*0.0, w*0.99,h*0.5);
  ctx2.quadraticCurveTo(w*0.74,h*1.0, w*0.26,h*1.0);
  ctx2.quadraticCurveTo(w*0.05,h*1.04, w*0.03,h*0.82);
  ctx2.closePath();
  const bodyGrad=ctx2.createLinearGradient(0,0,w*0.95,0);
  bodyGrad.addColorStop(0,col.a); bodyGrad.addColorStop(.55,col.b); bodyGrad.addColorStop(1,col.c);
  ctx2.fillStyle=bodyGrad; ctx2.shadowColor=col.glow; ctx2.shadowBlur=14; ctx2.fill();
  ctx2.shadowBlur=0; ctx2.strokeStyle='rgba(255,255,255,.85)'; ctx2.lineWidth=1.6; ctx2.stroke();

  // nose-cap tint for a two-tone cartoon look
  ctx2.save(); ctx2.beginPath();
  ctx2.moveTo(w*0.03,h*0.18); ctx2.quadraticCurveTo(w*0.05,h*-0.04, w*0.26,h*0.0);
  ctx2.quadraticCurveTo(w*0.74,h*0.0, w*0.99,h*0.5);
  ctx2.quadraticCurveTo(w*0.74,h*1.0, w*0.26,h*1.0);
  ctx2.quadraticCurveTo(w*0.05,h*1.04, w*0.03,h*0.82); ctx2.closePath(); ctx2.clip();
  ctx2.fillStyle='rgba(255,255,255,.16)';
  ctx2.beginPath(); ctx2.moveTo(w*0.66,-h*0.1); ctx2.quadraticCurveTo(w*0.92,h*0.5,w*0.66,h*1.1); ctx2.quadraticCurveTo(w*0.5,h*0.5,w*0.66,-h*0.1); ctx2.fill();
  ctx2.restore();

  // rivets
  ctx2.fillStyle='rgba(0,0,0,.18)';
  for(let rx=0.32; rx<0.6; rx+=0.09){ ctx2.beginPath(); ctx2.arc(w*rx,h*0.1,1.3,0,7); ctx2.fill(); ctx2.beginPath(); ctx2.arc(w*rx,h*0.9,1.3,0,7); ctx2.fill(); }

  drawAccessory(ctx2,w,h,accKey&&accKey.indexOf('decal')===0?accKey:null);
  drawAccessory(ctx2,w,h,(accKey==='chrome'||accKey==='halo')?accKey:null);

  // signature big porthole window
  const winCx=w*0.42, winCy=h*0.5, winR=h*0.36;
  ctx2.beginPath(); ctx2.arc(winCx,winCy,winR+3.5,0,7);
  ctx2.fillStyle='#0e1f2e'; ctx2.fill();
  ctx2.beginPath(); ctx2.arc(winCx,winCy,winR,0,7);
  const winGrad=ctx2.createRadialGradient(winCx-winR*0.3,winCy-winR*0.3,1,winCx,winCy,winR);
  winGrad.addColorStop(0,'#eafcff'); winGrad.addColorStop(.45,'#6fe3ff'); winGrad.addColorStop(1,'#0a5c8a');
  ctx2.fillStyle=winGrad; ctx2.shadowColor='#6fe3ff'; ctx2.shadowBlur=9; ctx2.fill(); ctx2.shadowBlur=0;
  ctx2.strokeStyle='rgba(255,255,255,.85)'; ctx2.lineWidth=2; ctx2.stroke();
  ctx2.beginPath(); ctx2.ellipse(winCx-winR*0.32,winCy-winR*0.34,winR*0.34,winR*0.18,-0.6,0,7);
  ctx2.fillStyle='rgba(255,255,255,.8)'; ctx2.fill();

  drawAccessory(ctx2,w,h,accKey&&accKey.indexOf('nose')===0?accKey:null);

  if(Math.sin(time*0.01)>0.3){ ctx2.fillStyle='#ff3b5c'; ctx2.beginPath(); ctx2.arc(w*0.12,h*0.14,2.2,0,7); ctx2.fill(); }
  ctx2.fillStyle='#26ffb0'; ctx2.beginPath(); ctx2.arc(w*0.12,h*0.86,2.2,0,7); ctx2.fill();
}

/* ===================== CANVAS / STATE ===================== */
const canvas=document.getElementById('game'), ctx=canvas.getContext('2d');
let W,H,DPR;
function resize(){DPR=Math.min(window.devicePixelRatio||1,2); W=canvas.clientWidth=window.innerWidth; H=canvas.clientHeight=window.innerHeight; canvas.width=W*DPR; canvas.height=H*DPR; ctx.setTransform(DPR,0,0,DPR,0,0);}
window.addEventListener('resize',resize); resize();

const hud=document.getElementById('hud');
const startScreen=document.getElementById('startScreen');
const pathScreen=document.getElementById('pathScreen');
const customizeScreen=document.getElementById('customizeScreen');
const qOverlay=document.getElementById('qOverlay');
const tipOverlayEl=document.getElementById('tipOverlay');
const goScreen=document.getElementById('gameOverScreen');
const lcScreen=document.getElementById('levelCompleteScreen');
const vicScreen=document.getElementById('victoryScreen');
const touchctrl=document.getElementById('touchctrl');
const flashEl=document.getElementById('flash');
const hudLvlBox=document.getElementById('hudLvlBox'), hudScore=document.getElementById('hudScore'), hudLives=document.getElementById('hudLives');

const TOPIC_NAMES=['Propiedades','Exponentes','Raíces','Factorización','Productos notables','Polinomios','Intervalos','Rectas','Distancias','Desigualdades','Cónicas','Dominio/Rango','Logaritmos','Trigonometría'];

function hideAllOverlays(){
  [startScreen,pathScreen,customizeScreen,qOverlay,tipOverlayEl,goScreen,lcScreen,vicScreen,document.getElementById('helpOverlay')].forEach(e=>e.classList.add('hidden'));
}

function buildPathScreen(){
  const wrap=document.getElementById('pathWrap'); wrap.innerHTML='';
  LEVELS.forEach((l,i)=>{
    if(i>0){ const line=document.createElement('div'); line.className='pathLine'; wrap.appendChild(line); }
    const locked = i>maxUnlocked;
    const done = i<maxUnlocked;
    const node=document.createElement('div'); node.className='pathNode';
    if(locked) node.style.opacity='.45';
    const badgeColor = locked ? '#555a66' : l.color;
    const statusTxt = locked ? '🔒 Bloqueado' : (done ? '✔ Superado' : 'Meta ' + l.target + ' pts');
    node.innerHTML=`<div class="pathBadge" style="background:${badgeColor};box-shadow:0 0 14px ${locked?'transparent':badgeColor}">${locked?'🔒':(i+1)}</div>
      <div class="pathInfo"><div class="pname" style="color:${locked?'#8a8fa0':l.color}">${l.title}</div><div class="ptag">${l.short.split('·')[1].trim()} · ${statusTxt}</div></div>`;
    wrap.appendChild(node);
  });
}

/* customize UI */
function buildCustomizeUI(){
  const cr=document.getElementById('colorRow'); cr.innerHTML='';
  COLORS.forEach((c,i)=>{
    const sw=document.createElement('div'); sw.className='swatch'+(i===shipColorIdx?' selected':'');
    sw.style.background=`linear-gradient(135deg,${c.b},${c.a})`;
    sw.onclick=()=>{ shipColorIdx=i; saveProgress(); buildCustomizeUI(); };
    cr.appendChild(sw);
  });
  const ar=document.getElementById('accRow'); ar.innerHTML='';
  ACCESSORIES.forEach((a,i)=>{
    const owned=unlocked[i];
    const price=priceFor(i);
    const chip=document.createElement('div');
    chip.className='accChip'+(owned&&i===shipAccIdx?' selected':'')+(!owned?' locked':'');
    chip.textContent= owned ? (a.label+(i===shipAccIdx?' ✓':'')) : (a.label+' · 🪙'+price);
    chip.onclick=()=>{
      if(unlocked[i]){ shipAccIdx=i; }
      else if(coins>=price){ coins-=price; unlocked[i]=true; shipAccIdx=i; SFX.correct(); }
      else { SFX.wrong(); }
      saveProgress(); updateCoinBadge(); buildCustomizeUI();
    };
    ar.appendChild(chip);
  });
  updateCoinBadge();
}
function drawPreview(){
  const pc=document.getElementById('shipPreview'); const pctx=pc.getContext('2d');
  pctx.clearRect(0,0,pc.width,pc.height);
  pctx.save(); pctx.translate(60,pc.height/2-30);
  renderShip(pctx,140,60,ACCESSORIES[shipAccIdx].key);
  pctx.restore();
  if(!customizeScreen.classList.contains('hidden')) requestAnimationFrame(drawPreview);
}

/* ===================== GAME STATE ===================== */
let state='start';
let score=0, lives=5, elapsed=0;
let stars=Array.from({length:120},()=>({x:Math.random()*W,y:Math.random()*H,z:Math.random()*.8+.2,s:Math.random()*2+.5}));

const player={x:110,y:H/2,w:58,h:30,vy:0,tilt:0};
let keys={up:false,down:false};

let obstacles=[]; let particles=[]; let spawnTimer=0; let zigzagPhase=0;
let pickups=[]; let starTimer=460;
const TIPS=[
 'Tip: en a·(b+c)=a·b+a·c estás repartiendo la multiplicación (distributiva).',
 'Tip: √(a²) = a — la raíz cuadrada deshace el cuadrado.',
 'Tip: x²−a² siempre factoriza como (x−a)(x+a).',
 'Tip: (a+b)² = a² + 2ab + b², nunca a²+b² solo.',
 'Tip: en y = mx + b, "m" es la pendiente y "b" el punto donde cruza el eje y.',
 'Tip: distancia entre puntos = √((x2−x1)² + (y2−y1)²).',
 'Tip: x > a se escribe como intervalo (a, ∞).',
 'Tip: log_b(v) = n significa lo mismo que b elevado a n = v.',
 'Tip: sen(90°) = 1 y cos(0°) = 1, revisa el círculo unitario.',
 'Tip: el dominio son los valores de x que SÍ puede tomar la función.'
];

function cfg(){return LEVELS[curLevel];}

function resetGame(){
  score=0; lives=5; elapsed=0; zigzagPhase=0; obstacleCount=0;
  player.y=H/2; player.vy=0;
  obstacles=[]; particles=[]; spawnTimer=0;
  pickups=[]; starTimer=R(340,420);
  updateHUD();
}
function updateHUD(){
  hudLvlBox.textContent=cfg().short.toUpperCase();
  hudLvlBox.style.color=cfg().color; hudLvlBox.style.borderColor=cfg().color+'80';
  hudScore.textContent=Math.floor(score)+'/'+cfg().target;
  hudLives.textContent='❤'.repeat(lives)+'♡'.repeat(5-lives);
  updateCoinBadge();
}

function startLevel(idx){
  curLevel=idx; AC.resume();
  hideAllOverlays(); hud.classList.remove('hidden'); touchctrl.classList.remove('hidden');
  resetGame(); state='playing';
}

function rectHit(a,b){return a.x<b.x+b.w && a.x+a.w>b.x && a.y<b.y+b.h && a.y+a.h>b.y;}

function sizeScale(){
  const r=Math.random();
  if(r<0.2) return 0.65;   // pequeño
  if(r>0.82) return 1.45;  // grande
  return 1;                 // normal
}
function spawnObstacle(){
  const c=cfg();
  obstacleCount++;
  const forceWall=(obstacleCount%4===0);
  const type=forceWall?'wall':['comet','satellite','fighter','mine'][R(0,3)];
  zigzagPhase+=c.zig;
  const wave=Math.sin(zigzagPhase);
  if(type==='wall'){
    const gapH=c.gapH;
    const center=H/2 + wave*(H/2-gapH/2-24);
    const gapY=Math.max(18,Math.min(H-18-gapH,center-gapH/2));
    obstacles.push({type:'wallTop',x:W+20,y:0,w:34,h:gapY,hit:false,t:0});
    obstacles.push({type:'wallBot',x:W+20,y:gapY+gapH,w:34,h:H-(gapY+gapH),hit:false,t:0});
  } else {
    const sc=sizeScale();
    const h=Math.round(R(c.obsMin,c.obsMax)*sc);
    const w=Math.round(R(c.obsMin-4,c.obsMax-10)*sc);
    const center=H/2 + wave*(H/2-h/2-24);
    const y=Math.max(16,Math.min(H-16-h,center-h/2));
    obstacles.push({type,x:W+20,y,w,h,hit:false,t:0});
    if(Math.random()<c.doubleProb){
      const type2=['comet','satellite','fighter','mine'][R(0,3)];
      const sc2=sizeScale();
      const h2=Math.round(R(c.obsMin,c.obsMax)*sc2); const w2=Math.round(R(c.obsMin-4,c.obsMax-10)*sc2);
      const band2 = wave>0 ? R(16,Math.max(17,Math.floor(H*0.38)-h2)) : R(Math.floor(H*0.62),H-16-h2);
      obstacles.push({type:type2,x:W+20+w+R(130,190),y:Math.max(16,Math.min(H-16-h2,band2)),w:w2,h:h2,hit:false,t:0});
    }
    if(Math.random()<c.tripleProb){
      const type3=['comet','satellite','fighter','mine'][R(0,3)];
      const sc3=sizeScale();
      const h3=Math.round(R(c.obsMin,c.obsMax)*sc3); const w3=Math.round(R(c.obsMin-4,c.obsMax-10)*sc3);
      const band3=R(Math.floor(H*0.32),Math.max(Math.floor(H*0.32)+10,Math.floor(H*0.68)-h3));
      obstacles.push({type:type3,x:W+20+w+R(260,340),y:Math.max(16,band3),w:w3,h:h3,hit:false,t:0});
    }
  }
}

function spawnStar(){
  const size=24;
  const wave=Math.sin(zigzagPhase+0.6);
  const cy=H/2 + wave*(H/2-40);
  const y=Math.max(20,Math.min(H-20-size,cy-12));
  // offset ahead of the spawn edge so it never lands stacked on an obstacle group
  pickups.push({x:W+20+R(130,200),y,w:size,h:size,t:R(0,600)});
}
let tipPauseInt=null;
function collectStar(s){
  pickups=pickups.filter(x=>x!==s);
  SFX.star();
  const amt=10;
  coins+=amt; saveProgress();
  updateHUD();
  for(let i=0;i<14;i++) particles.push({x:s.x+s.w/2,y:s.y+s.h/2,vx:(Math.random()-.5)*5,vy:(Math.random()-.5)*5,life:26,c:'#ffd23f'});
  showTipPause(amt);
}
function showTipPause(amt){
  state='tip';
  document.getElementById('tipLifeMsg').textContent = '+'+amt+' MONEDAS';
  document.getElementById('tipText').textContent = TIPS[R(0,TIPS.length-1)];
  tipOverlayEl.classList.remove('hidden');
  clearInterval(tipPauseInt);
  let left=100;
  const fill=document.getElementById('tipTimerFill'); fill.style.width='100%';
  const DURATION=6000, step=100/(DURATION/100);
  tipPauseInt=setInterval(()=>{
    left-=step;
    fill.style.width=Math.max(0,left)+'%';
    if(left<=0){ endTipPause(); }
  },100);
}
function endTipPause(){
  clearInterval(tipPauseInt);
  tipOverlayEl.classList.add('hidden');
  if(state==='tip') state='playing';
}

function triggerCollision(ob){
  if(ob.hit) return;
  ob.hit=true;
  SFX.hit();
  flashEl.style.transition='none'; flashEl.style.opacity='.55';
  requestAnimationFrame(()=>{flashEl.style.transition='opacity .3s'; flashEl.style.opacity='0';});
  for(let i=0;i<16;i++) particles.push({x:player.x+30,y:player.y+15,vx:(Math.random()-.5)*6,vy:(Math.random()-.5)*6,life:30,c:Math.random()<.5?'#00f0ff':'#ff2ee6'});
  state='question';
  askQuestion();
}

let currentQ=null;
function askQuestion(){
  currentQ=randomQuestion();
  document.getElementById('qTopic').textContent=currentQ.topic.toUpperCase();
  document.getElementById('qText').textContent=currentQ.q;
  const expEl=document.getElementById('qExplain'); expEl.textContent=''; expEl.classList.remove('show');
  document.getElementById('btnSkipExplain').classList.add('hidden');
  const optsEl=document.getElementById('qOpts'); optsEl.innerHTML='';
  currentQ.options.forEach((opt,i)=>{
    const b=document.createElement('button'); b.className='opt'; b.textContent=opt;
    b.onclick=()=>answerQuestion(i,b,optsEl);
    optsEl.appendChild(b);
  });
  qOverlay.classList.remove('hidden');
  startQTimer();
}
const QUESTION_TIME_MS=45000;
let qTimerInt=null, qTimeLeft=0;
function startQTimer(){
  clearInterval(qTimerInt);
  qTimeLeft=100;
  const fill=document.getElementById('qTimerFill'); fill.style.width='100%';
  const step=100/(QUESTION_TIME_MS/100);
  qTimerInt=setInterval(()=>{
    qTimeLeft-=step;
    fill.style.width=Math.max(0,qTimeLeft)+'%';
    if(qTimeLeft<=0){ clearInterval(qTimerInt);
      const opts=document.querySelectorAll('#qOpts .opt'); opts.forEach(o=>o.onclick=null);
      answerTimeout();
    }
  },100);
}
let pendingAdvance=null;
function scheduleAdvance(fn,delay){
  clearTimeout(pendingAdvance);
  pendingAdvance=setTimeout(fn,delay);
  const skipBtn=document.getElementById('btnSkipExplain');
  skipBtn.classList.remove('hidden');
  skipBtn.onclick=()=>{ clearTimeout(pendingAdvance); skipBtn.classList.add('hidden'); fn(); };
}
function showExplain(){
  const e=document.getElementById('qExplain');
  e.textContent = currentQ && currentQ.explain ? currentQ.explain : '';
  e.classList.add('show');
}
function answerTimeout(){
  SFX.wrong();
  const all=document.querySelectorAll('#qOpts .opt');
  if(currentQ && all[currentQ.correctIndex]) all[currentQ.correctIndex].classList.add('correct');
  showExplain();
  scheduleAdvance(()=>{ loseLife(); },7000);
}
function answerQuestion(i,btn,optsEl){
  clearInterval(qTimerInt);
  const all=optsEl.querySelectorAll('.opt'); all.forEach(o=>o.onclick=null);
  if(i===currentQ.correctIndex){
    btn.classList.add('correct'); SFX.correct(); score+=10;
    showExplain();
    scheduleAdvance(()=>{ resumeAfterQuestion(); },2800);
  } else {
    btn.classList.add('wrong'); all[currentQ.correctIndex].classList.add('correct'); SFX.wrong();
    showExplain();
    scheduleAdvance(()=>{ loseLife(); },7000);
  }
}
function loseLife(){
  lives--; updateHUD();
  if(lives<=0){ resumeAfterQuestion(true); } else { resumeAfterQuestion(false); }
}
function resumeAfterQuestion(dead){
  qOverlay.classList.add('hidden');
  obstacles=obstacles.filter(o=>!o.hit);
  if(dead){ endGame(); return; }
  updateHUD();
  if(score>=cfg().target){ completeLevel(); return; }
  state='playing';
}

function endGame(){
  state='gameover';
  hud.classList.add('hidden'); touchctrl.classList.add('hidden');
  SFX.gameover();
  document.getElementById('goStats').innerHTML=`${cfg().title}<br>Puntuación: <b>${Math.floor(score)}/${cfg().target}</b>${authorName?`<br><span style="font-size:12px;opacity:.75">🎖 Creado por: ${authorName}</span>`:''}`;
  goScreen.classList.remove('hidden');
}
let lcInt=null;
function completeLevel(){
  state='levelComplete';
  hud.classList.add('hidden'); touchctrl.classList.add('hidden');
  const isLast=curLevel>=LEVELS.length-1;
  if(isLast){
    SFX.victory();
    document.getElementById('vicStats').innerHTML=`Completaste el recorrido de los 3 niveles de Math Flight.<br>Puntuación final: <b>${Math.floor(score)}</b> · Monedas: <b>${coins}</b> 🪙${authorName?`<br><span style="font-size:13px;opacity:.8">🎖 Creado por: ${authorName}</span>`:''}`;
    vicScreen.classList.remove('hidden');
    return;
  }
  SFX.levelup();
  maxUnlocked=Math.max(maxUnlocked,curLevel+1); saveProgress();
  const next=LEVELS[curLevel+1];
  document.getElementById('lcStats').innerHTML=`${cfg().title} superado con <b>${score}</b> puntos.<br>Preparando: <b style="color:${next.color}">${next.title}</b>`;
  const badges=document.getElementById('pathBadges'); badges.innerHTML='';
  LEVELS.forEach((l,i)=>{
    const d=document.createElement('div'); d.className='pathDot'+(i<=curLevel?' active':'');
    d.style.background=l.color; d.style.color=l.color; d.title=l.title; d.textContent=i+1;
    badges.appendChild(d);
  });
  lcScreen.classList.remove('hidden');
  let left=100; const DURATION=4000; const step=100/(DURATION/100);
  const fill=document.getElementById('lcTimerFill'); fill.style.width='100%';
  clearInterval(lcInt);
  lcInt=setInterval(()=>{
    left-=step; fill.style.width=Math.max(0,left)+'%';
    if(left<=0){ clearInterval(lcInt); startLevel(curLevel+1); }
  },100);
}

/* input */
window.addEventListener('keydown',e=>{
  if(['ArrowUp','w','W'].includes(e.key)) keys.up=true;
  if(['ArrowDown','s','S'].includes(e.key)) keys.down=true;
});
window.addEventListener('keyup',e=>{
  if(['ArrowUp','w','W'].includes(e.key)) keys.up=false;
  if(['ArrowDown','s','S'].includes(e.key)) keys.down=false;
});
function bindHold(el,onDown,onUp){
  el.addEventListener('pointerdown',e=>{e.preventDefault(); onDown();});
  el.addEventListener('pointerup',onUp); el.addEventListener('pointerleave',onUp); el.addEventListener('pointercancel',onUp);
}
bindHold(document.getElementById('btnUp'),()=>keys.up=true,()=>keys.up=false);
bindHold(document.getElementById('btnDown'),()=>keys.down=true,()=>keys.down=false);

/* buttons */
document.getElementById('btnStart').onclick=()=>{ hideAllOverlays(); pathScreen.classList.remove('hidden'); buildPathScreen(); };

document.getElementById('btnLaunch').onclick=()=>{ startLevel(maxUnlocked); };
document.getElementById('btnBackFromPath').onclick=()=>{ hideAllOverlays(); startScreen.classList.remove('hidden'); };
document.getElementById('btnCustomize').onclick=()=>{ hideAllOverlays(); customizeScreen.classList.remove('hidden'); buildCustomizeUI(); drawPreview(); };
document.getElementById('btnSaveShip').onclick=()=>{ hideAllOverlays(); startScreen.classList.remove('hidden'); };
document.getElementById('btnHelp').onclick=()=>{ document.getElementById('helpOverlay').classList.remove('hidden'); };
document.getElementById('btnCloseHelp').onclick=()=>{ document.getElementById('helpOverlay').classList.add('hidden'); };
document.getElementById('btnSkipTip').onclick=()=>{ endTipPause(); };
document.getElementById('btnRetry').onclick=()=>{ hideAllOverlays(); hud.classList.remove('hidden'); touchctrl.classList.remove('hidden'); resetGame(); state='playing'; };
document.getElementById('btnMainMenuFromGO').onclick=()=>{ hideAllOverlays(); startScreen.classList.remove('hidden'); };
document.getElementById('btnContinueNow').onclick=()=>{ clearInterval(lcInt); startLevel(curLevel+1); };
document.getElementById('btnPlayAgain').onclick=()=>{ hideAllOverlays(); startScreen.classList.remove('hidden'); };

/* ===================== DRAW ===================== */
function drawStars(){
  ctx.fillStyle='#050414'; ctx.fillRect(0,0,W,H);
  const g=ctx.createRadialGradient(W*.7,H*.25,0,W*.7,H*.25,W*.6);
  g.addColorStop(0,'rgba(123,47,255,.18)'); g.addColorStop(1,'rgba(123,47,255,0)');
  ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
  ctx.save();
  stars.forEach(s=>{
    s.x-=s.z*(state==='playing'?2.2:0.4);
    if(s.x<-5){s.x=W+5; s.y=Math.random()*H;}
    ctx.globalAlpha=s.z; ctx.fillStyle='#bfe9ff'; ctx.fillRect(s.x,s.y,s.s,s.s);
  });
  ctx.restore();
}

function drawPlayer(){
  const {x,y,w,h}=player;
  if(state==='playing' && Math.random()<0.7){
    particles.push({x:x-2,y:y+h/2+(Math.random()-0.5)*8,vx:-3-Math.random()*2.2,vy:(Math.random()-0.5)*1.2,life:16,c:COLORS[shipColorIdx].glow});
  }
  ctx.save();
  ctx.translate(x+w/2,y+h/2);
  ctx.rotate(player.tilt);
  ctx.translate(-w/2,-h/2);
  renderShip(ctx,w,h,ACCESSORIES[shipAccIdx].key);
  ctx.restore();
}

function drawObstacle(o){
  ctx.save();
  if(o.type==='comet'){
    o.t=(o.t||0)+1;
    const cx=o.x+o.w/2, cy=o.y+o.h/2;
    for(let i=6;i>=1;i--){
      const tx=cx+i*7, ty=cy+Math.sin(o.t*.05+i)*2;
      const rad=(o.w*0.22)*(1-i/8);
      ctx.globalAlpha=0.5*(1-i/7);
      const tg=ctx.createRadialGradient(tx,ty,0,tx,ty,Math.max(1,rad));
      tg.addColorStop(0,'#bfefff'); tg.addColorStop(1,'rgba(191,239,255,0)');
      ctx.fillStyle=tg; ctx.beginPath(); ctx.arc(tx,ty,Math.max(1,rad),0,7); ctx.fill();
    }
    ctx.globalAlpha=1;
    const coreGrad=ctx.createRadialGradient(cx-3,cy-3,1,cx,cy,o.w*0.3);
    coreGrad.addColorStop(0,'#ffffff'); coreGrad.addColorStop(.5,'#8fe9ff'); coreGrad.addColorStop(1,'#0a5c8a');
    ctx.shadowColor='#6fe3ff'; ctx.shadowBlur=14;
    ctx.fillStyle=coreGrad; ctx.beginPath(); ctx.arc(cx,cy,o.w*0.3,0,7); ctx.fill();
    ctx.shadowBlur=0; ctx.strokeStyle='rgba(255,255,255,.6)'; ctx.lineWidth=1; ctx.stroke();
  } else if(o.type==='satellite'){
    o.t=(o.t||0)+1;
    ctx.translate(o.x+o.w/2,o.y+o.h/2); ctx.rotate(o.t*.012);
    ctx.shadowColor='#9fd8ff'; ctx.shadowBlur=10;
    ctx.fillStyle='#123a5e'; ctx.strokeStyle='#00f0ff'; ctx.lineWidth=1;
    ctx.fillRect(-o.w*0.55,-o.h*0.14,o.w*0.3,o.h*0.28); ctx.strokeRect(-o.w*0.55,-o.h*0.14,o.w*0.3,o.h*0.28);
    ctx.fillRect(o.w*0.25,-o.h*0.14,o.w*0.3,o.h*0.28); ctx.strokeRect(o.w*0.25,-o.h*0.14,o.w*0.3,o.h*0.28);
    for(let gx=-0.52;gx<-0.28;gx+=0.08){ ctx.beginPath(); ctx.moveTo(o.w*gx,-o.h*0.14); ctx.lineTo(o.w*gx,o.h*0.14); ctx.stroke(); }
    for(let gx=0.28;gx<0.52;gx+=0.08){ ctx.beginPath(); ctx.moveTo(o.w*gx,-o.h*0.14); ctx.lineTo(o.w*gx,o.h*0.14); ctx.stroke(); }
    const bg=ctx.createLinearGradient(-o.w*0.2,0,o.w*0.2,0);
    bg.addColorStop(0,'#5a6472'); bg.addColorStop(1,'#c7d0da');
    ctx.fillStyle=bg; ctx.strokeStyle='#eafcff'; ctx.lineWidth=1.4;
    ctx.fillRect(-o.w*0.22,-o.h*0.22,o.w*0.44,o.h*0.44); ctx.strokeRect(-o.w*0.22,-o.h*0.22,o.w*0.44,o.h*0.44);
    ctx.strokeStyle='#eafcff'; ctx.beginPath(); ctx.moveTo(0,-o.h*0.22); ctx.lineTo(0,-o.h*0.4); ctx.stroke();
    if(Math.sin(o.t*.15)>0){ ctx.fillStyle='#ff3b5c'; ctx.beginPath(); ctx.arc(0,-o.h*0.4,2.2,0,7); ctx.fill(); }
  } else if(o.type==='fighter'){
    o.t=(o.t||0)+1; const bob=Math.sin(o.t*.08)*3;
    ctx.translate(o.x+o.w/2,o.y+o.h/2+bob);
    ctx.shadowColor='#ff2ee6'; ctx.shadowBlur=12;
    ctx.beginPath();
    ctx.moveTo(-o.w*0.5,0); ctx.lineTo(o.w*0.1,-o.h*0.4); ctx.lineTo(o.w*0.5,-o.h*0.08);
    ctx.lineTo(o.w*0.5,o.h*0.08); ctx.lineTo(o.w*0.1,o.h*0.4); ctx.closePath();
    const fg=ctx.createLinearGradient(-o.w*0.5,0,o.w*0.5,0);
    fg.addColorStop(0,'#3a1a4e'); fg.addColorStop(1,'#7b2fff');
    ctx.fillStyle=fg; ctx.fill(); ctx.strokeStyle='#ff2ee6'; ctx.lineWidth=1.4; ctx.stroke();
    ctx.fillStyle='#ff3b5c'; ctx.shadowColor='#ff3b5c'; ctx.shadowBlur=8;
    ctx.beginPath(); ctx.arc(o.w*0.22,0,3,0,7); ctx.fill(); ctx.shadowBlur=0;
    ctx.fillStyle='rgba(255,46,230,.7)';
    ctx.beginPath(); ctx.ellipse(-o.w*0.52,0,6,3,0,0,7); ctx.fill();
  } else if(o.type==='mine'){
    o.t=(o.t||0)+1;
    const cx=o.x+o.w/2, cy=o.y+o.h/2;
    const pulse=0.6+Math.sin(o.t*.12)*.4;
    ctx.shadowColor='#ff3b5c'; ctx.shadowBlur=18*pulse;
    ctx.strokeStyle=`rgba(255,59,92,${0.35+pulse*.3})`; ctx.lineWidth=2;
    ctx.beginPath(); ctx.arc(cx,cy,o.w*0.52,0,7); ctx.stroke();
    ctx.strokeStyle='#fff8d0'; ctx.lineWidth=1.4;
    for(let i=0;i<4;i++){
      const ang=o.t*.05+i*(Math.PI/2);
      const x1=cx+Math.cos(ang)*o.w*0.22, y1=cy+Math.sin(ang)*o.w*0.22;
      const x2=cx+Math.cos(ang)*o.w*0.5, y2=cy+Math.sin(ang)*o.w*0.5;
      const mx=(x1+x2)/2+Math.sin(o.t*.3+i)*4, my=(y1+y2)/2+Math.cos(o.t*.3+i)*4;
      ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(mx,my); ctx.lineTo(x2,y2); ctx.stroke();
    }
    const coreGrad=ctx.createRadialGradient(cx,cy,0,cx,cy,o.w*0.22);
    coreGrad.addColorStop(0,'#fff6c8'); coreGrad.addColorStop(.5,'#ff8f5c'); coreGrad.addColorStop(1,'#7a0a1e');
    ctx.fillStyle=coreGrad; ctx.beginPath(); ctx.arc(cx,cy,o.w*0.22,0,7); ctx.fill();
    ctx.strokeStyle='#ff3b5c'; ctx.lineWidth=1.4; ctx.stroke();
  } else {
    o.t+=1;
    ctx.shadowColor='#00f0ff'; ctx.shadowBlur=14;
    const grad=ctx.createLinearGradient(o.x,0,o.x+o.w,0);
    grad.addColorStop(0,'#0a1e3a'); grad.addColorStop(1,'#123a5e');
    ctx.fillStyle=grad; ctx.fillRect(o.x,o.y,o.w,o.h);
    ctx.strokeStyle='#00f0ff'; ctx.lineWidth=2; ctx.strokeRect(o.x,o.y,o.w,o.h);
    ctx.save(); ctx.beginPath(); ctx.rect(o.x,o.y,o.w,o.h); ctx.clip();
    ctx.strokeStyle='rgba(255,210,63,.55)'; ctx.lineWidth=6;
    for(let d=-o.h;d<o.w+o.h;d+=18){ ctx.beginPath(); ctx.moveTo(o.x+d,o.y); ctx.lineTo(o.x+d-o.h,o.y+o.h); ctx.stroke(); }
    ctx.restore();
    const scanY=o.y + (o.h>4? (Math.sin(o.t*.06)*0.5+0.5)*o.h : 0);
    ctx.fillStyle='rgba(0,240,255,.85)'; ctx.fillRect(o.x,scanY-1,o.w,2);
    for(let yy=o.y+6;yy<o.y+o.h-4;yy+=14){ctx.fillStyle='rgba(0,240,255,.35)'; ctx.fillRect(o.x+4,yy,o.w-8,2);}
  }
  ctx.restore();
}

function drawStar(s){
  s.t+=1;
  const cx=s.x+s.w/2, cy=s.y+s.h/2+Math.sin(s.t*.08)*4;
  const spin=s.t*.06;
  ctx.save(); ctx.translate(cx,cy); ctx.rotate(spin);
  ctx.shadowColor='#ffd23f'; ctx.shadowBlur=18+Math.sin(s.t*.15)*6;
  ctx.beginPath();
  for(let i=0;i<10;i++){const ang=i*Math.PI/5; const rad=i%2===0? s.w/2 : s.w/4.5;
    ctx.lineTo(Math.cos(ang)*rad, Math.sin(ang)*rad);}
  ctx.closePath();
  const g=ctx.createLinearGradient(-s.w/2,0,s.w/2,0);
  g.addColorStop(0,'#ffd23f'); g.addColorStop(1,'#fff6d0');
  ctx.fillStyle=g; ctx.fill();
  ctx.strokeStyle='#fff'; ctx.lineWidth=1; ctx.stroke();
  ctx.restore();
}

/* ===================== LOOP ===================== */
let last=performance.now();
function loop(now){
  const dt=Math.min(40,now-last); last=now;
  drawStars();

  if(state==='playing'){
    elapsed+=dt;
    const speed=7.6;
    if(keys.up) player.vy=-speed; else if(keys.down) player.vy=speed; else player.vy*=0.85;
    player.y+=player.vy;
    player.y=Math.max(6,Math.min(H-player.h-6,player.y));
    player.tilt=Math.max(-0.35,Math.min(0.35,player.vy*0.05));

    const c=cfg();
    spawnTimer-=dt/16.6;
    if(spawnTimer<=0){ spawnObstacle(); spawnTimer=c.spawnMs*(0.97+Math.random()*0.08); }
    starTimer-=dt/16.6;
    if(starTimer<=0){ spawnStar(); starTimer=R(380,460); }

    const spd=c.speed*(dt/16.6);
    obstacles.forEach(o=>o.x-=spd);
    obstacles=obstacles.filter(o=>o.x> -100);
    pickups.forEach(s=>s.x-=spd);
    pickups=pickups.filter(s=>s.x> -60);

    const pBox={x:player.x+5,y:player.y+3,w:player.w-10,h:player.h-6};
    for(const o of obstacles){
      if(!o.hit && rectHit(pBox,o)){ triggerCollision(o); break; }
    }
    if(state==='playing'){
      for(const s of pickups){
        if(rectHit(pBox,s)){ collectStar(s); break; }
      }
    }
    if(state==='playing'){
      score=Math.min(cfg().target, score + dt*0.0011);
      updateHUD();
      if(score>=cfg().target){ completeLevel(); }
    }
  }

  particles.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.life--;});
  particles=particles.filter(p=>p.life>0);

  obstacles.forEach(drawObstacle);
  pickups.forEach(drawStar);
  particles.forEach(p=>{ctx.globalAlpha=Math.max(0,p.life/30); ctx.fillStyle=p.c; ctx.fillRect(p.x,p.y,3,3); ctx.globalAlpha=1;});
  drawPlayer();

  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
