// Sahne sesleri ve notalar: dosya gerekmez, tarayıcı kendisi üretir
import { prefs } from '../robo.js';

let ctx = null;
function ac() {
  ctx ||= new (window.AudioContext || window.webkitAudioContext)();
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function tone(f, t, dur, type = 'sine', vol = 0.15, f2 = f) {
  const c = ac();
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(f, c.currentTime + t);
  o.frequency.exponentialRampToValueAtTime(Math.max(20, f2), c.currentTime + t + dur);
  g.gain.setValueAtTime(0.0001, c.currentTime + t);
  g.gain.exponentialRampToValueAtTime(vol, c.currentTime + t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + t + dur);
  o.connect(g).connect(c.destination);
  o.start(c.currentTime + t);
  o.stop(c.currentTime + t + dur + 0.05);
}

function noise(t, dur, vol = 0.3, hp = 800) {
  const c = ac();
  const buf = c.createBuffer(1, Math.ceil(c.sampleRate * dur), c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
  const s = c.createBufferSource();
  const f = c.createBiquadFilter();
  const g = c.createGain();
  f.type = 'highpass';
  f.frequency.value = hp;
  g.gain.value = vol;
  s.buffer = buf;
  s.connect(f).connect(g).connect(c.destination);
  s.start(c.currentTime + t);
}

const SND = {
  pop: () => tone(700, 0, 0.12, 'sine', 0.25, 180),
  miyav: () => { tone(520, 0, 0.25, 'sawtooth', 0.06, 820); tone(820, 0.22, 0.35, 'sawtooth', 0.06, 420); tone(1040, 0, 0.55, 'sine', 0.05, 840); },
  hav: () => { tone(260, 0, 0.14, 'square', 0.08, 170); tone(260, 0.22, 0.16, 'square', 0.08, 160); },
  davul: () => { tone(150, 0, 0.3, 'sine', 0.5, 45); noise(0, 0.08, 0.2, 1500); },
  zil: () => { tone(1500, 0, 0.8, 'triangle', 0.12); tone(2250, 0, 0.6, 'sine', 0.06); tone(3010, 0, 0.4, 'sine', 0.03); },
  boing: () => { tone(180, 0, 0.45, 'sine', 0.25, 650); tone(650, 0.05, 0.3, 'triangle', 0.05, 300); },
  alkis: () => { for (let i = 0; i < 5; i++) noise(i * 0.12 + Math.random() * 0.03, 0.08, 0.35, 1200); },
  kazandin: () => [523, 659, 784, 1047, 784, 1047].forEach((f, i) => tone(f, i * 0.12, 0.18, 'triangle', 0.14)),
};

export function playSound(name) {
  if (!prefs.sound) return;
  try { SND[name]?.(); } catch { /* ses yoksa sessiz devam */ }
}

export function playNote(n, dur) {
  if (!prefs.sound) return;
  try {
    const f = 440 * 2 ** ((n - 69) / 12);
    const d = Math.max(0.12, dur * 0.95);
    tone(f, 0, d, 'triangle', 0.18);
    tone(f * 2, 0, d * 0.6, 'sine', 0.04);
  } catch { /* ses yoksa sessiz devam */ }
}
