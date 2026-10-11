// Robo karakteri, sesler, konfeti ve kayıtlı tercihler

export function load(key, def) {
  try {
    const v = localStorage.getItem(key);
    return v == null ? def : JSON.parse(v);
  } catch {
    return def;
  }
}
export function save(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch { /* gizli pencere vb. */ }
}

export const prefs = { fast: load('robo-hizli', false), sound: load('robo-ses', true) };

export function roboSVG() {
  return `<svg class="robo" viewBox="0 0 100 106" aria-hidden="true">
  <g class="ant"><line x1="50" y1="7" x2="50" y2="20"/><circle class="bulb" cx="50" cy="7" r="5.5"/></g>
  <g class="arm arm-l"><rect x="9" y="62" width="17" height="8" rx="4"/><circle cx="10" cy="66" r="5.5"/></g>
  <g class="arm arm-r"><rect x="74" y="62" width="17" height="8" rx="4"/><circle cx="90" cy="66" r="5.5"/></g>
  <rect class="wheel" x="27" y="88" width="17" height="13" rx="5"/><rect class="wheel" x="56" y="88" width="17" height="13" rx="5"/>
  <rect class="body" x="25" y="57" width="50" height="34" rx="11"/>
  <circle class="heart" cx="50" cy="74" r="6.5"/>
  <rect class="head" x="16" y="18" width="68" height="45" rx="17"/>
  <rect class="face" x="24" y="25" width="52" height="31" rx="12"/>
  <g class="eye"><circle cx="39" cy="38" r="7.5"/><circle class="pup" cx="39" cy="38" r="3.8"/></g>
  <g class="eye"><circle cx="61" cy="38" r="7.5"/><circle class="pup" cx="61" cy="38" r="3.8"/></g>
  <path class="mouth smile" d="M42 47 Q50 54 58 47"/>
  <path class="mouth frown" d="M42 51 Q50 45 58 51"/>
  <circle class="cheek" cx="29" cy="49" r="3.5"/><circle class="cheek" cx="71" cy="49" r="3.5"/>
</svg>`;
}

// Yönü belli, tek karelik küçük Robo (sorularda kullanılır)
export function miniBot(d) {
  return `<div class="mini"><div class="board" style="--w:1;--h:1;--t:5em"><div class="tile t-floor"></div>${robotHTML(d)}</div></div>`;
}

export function robotHTML(d, x = 0, y = 0) {
  return `<div class="rb d${d}" style="--x:${x};--y:${y}"><div class="rbi"><div class="rarrow" style="--r:${d * 90}deg"><i></i></div>${roboSVG()}</div></div>`;
}

// Basit sesler: dosya gerekmez, tarayıcı kendisi üretir
let ctx = null;
function tone(f, t, dur, type = 'sine', vol = 0.12, f2 = f) {
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(f, ctx.currentTime + t);
  o.frequency.exponentialRampToValueAtTime(f2, ctx.currentTime + t + dur);
  g.gain.setValueAtTime(vol, ctx.currentTime + t);
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + dur);
  o.connect(g).connect(ctx.destination);
  o.start(ctx.currentTime + t);
  o.stop(ctx.currentTime + t + dur + 0.02);
}
const SOUNDS = {
  click: () => tone(700, 0, 0.05, 'triangle', 0.08),
  add: () => tone(520, 0, 0.08, 'triangle', 0.1, 780),
  del: () => tone(400, 0, 0.1, 'triangle', 0.1, 200),
  step: () => tone(330, 0, 0.09, 'square', 0.04, 440),
  turn: () => tone(500, 0, 0.12, 'sine', 0.08, 650),
  star: () => { tone(988, 0, 0.1, 'triangle'); tone(1319, 0.08, 0.18, 'triangle'); },
  bump: () => tone(180, 0, 0.3, 'sawtooth', 0.1, 70),
  splash: () => { tone(900, 0, 0.35, 'sine', 0.1, 120); tone(300, 0.1, 0.3, 'triangle', 0.06, 90); },
  ok: () => { tone(660, 0, 0.1, 'triangle'); tone(880, 0.09, 0.16, 'triangle'); },
  wrong: () => tone(220, 0, 0.22, 'square', 0.06, 160),
  win: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.11, i === 3 ? 0.4 : 0.14, 'triangle', 0.12)),
};
export function play(name) {
  if (!prefs.sound) return;
  try {
    ctx ||= new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    SOUNDS[name]?.();
  } catch { /* ses yoksa sessiz devam */ }
}

export function confetti(n = 70) {
  const fx = document.getElementById('fx');
  if (!fx || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const colors = ['#ff8a3d', '#2fbf71', '#2f8cff', '#e0457b', '#8a5cff', '#ffd23f'];
  for (let i = 0; i < n; i++) {
    const s = document.createElement('i');
    s.style.cssText = `left:${Math.random() * 100}vw;background:${colors[i % colors.length]};--dx:${(Math.random() - 0.5) * 30}vw;--rz:${Math.random() * 900 - 450}deg;animation-delay:${Math.random() * 0.4}s;animation-duration:${1.8 + Math.random() * 1.2}s`;
    fx.appendChild(s);
    setTimeout(() => s.remove(), 3500);
  }
}

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
export const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

// Ekranın üstünde kısa süreli bildirim (sayfanın düzenini kaydırmaz)
const TOAST_IC = { ok: '🎉', bad: '😵', warn: '✋' };
let toastTimer = 0;
export function toast(kind, html, ms = 6000) {
  let t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    t.setAttribute('role', 'status');
    t.setAttribute('aria-live', 'polite');
    t.addEventListener('click', hideToast);
    document.body.appendChild(t);
  }
  t.className = 'toast ' + kind;
  t.innerHTML = `<span class="tic">${TOAST_IC[kind] || '🤖'}</span><div class="tbody">${html}</div><button type="button" class="tclose" aria-label="Bildirimi kapat">✖</button>`;
  void t.offsetWidth;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(hideToast, ms);
}
export function hideToast() {
  clearTimeout(toastTimer);
  document.getElementById('toast')?.classList.remove('show');
}
