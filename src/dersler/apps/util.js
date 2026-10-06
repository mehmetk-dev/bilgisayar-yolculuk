// Uygulamaların ortak yardımcıları
export { esc } from '../dialog.js';

const picCache = new Map();

// Resim dosyasının içeriğinden görüntülenebilir bir adres üretir.
// İçerik ya bir data: adresidir (Paint'te çizilen) ya da { emoji, bg } biçiminde örnek bir fotoğraftır.
export function pictureURL(content) {
  if (typeof content === 'string' && content.startsWith('data:')) return content;
  const c = content && typeof content === 'object' ? content : { emoji: '🖼', bg: ['#cfd8dc', '#90a4ae'] };
  const key = c.emoji + c.bg.join();
  if (picCache.has(key)) return picCache.get(key);
  const cv = document.createElement('canvas');
  cv.width = 480; cv.height = 320;
  const g = cv.getContext('2d');
  const grad = g.createLinearGradient(0, 0, 480, 320);
  grad.addColorStop(0, c.bg[0]); grad.addColorStop(1, c.bg[1]);
  g.fillStyle = grad;
  g.fillRect(0, 0, 480, 320);
  g.font = '170px "Noto Color Emoji", "Segoe UI Emoji", sans-serif';
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillText(c.emoji, 240, 170);
  const url = cv.toDataURL('image/png');
  picCache.set(key, url);
  return url;
}

export const isImage = (name) => /\.(png|jpe?g|bmp)$/i.test(name);
export const wait = (ms) => new Promise((r) => setTimeout(r, ms));

// Basit ilerleme çubuğu animasyonu: el içine çubuk çizer, bitince çözülür
export function progress(el, ms, label = '') {
  el.innerHTML = `<div class="prg-l">${label}</div><div class="prg"><i></i></div>`;
  const bar = el.querySelector('.prg i');
  const t0 = performance.now();
  return new Promise((resolve) => {
    const step = (t) => {
      const p = Math.min(1, (t - t0) / ms);
      bar.style.width = (p * 100).toFixed(1) + '%';
      if (p < 1) requestAnimationFrame(step); else resolve();
    };
    requestAnimationFrame(step);
  });
}

// Masaüstündeki ses düzeyine uyan kısa bir melodi çalar (ses kapalıysa sessiz)
let actx = null;
export function playTune(desk, notes = [392, 440, 494, 523, 494, 440, 392], dur = 0.28) {
  const s = desk.settings;
  if (s.muted || !s.volume) return 0;
  try {
    actx ||= new AudioContext();
    const t = actx.currentTime;
    notes.forEach((f, i) => {
      const o = actx.createOscillator(), g = actx.createGain();
      o.type = 'triangle';
      o.frequency.value = f;
      const v = 0.25 * s.volume / 100;
      g.gain.setValueAtTime(0.0001, t + i * dur);
      g.gain.exponentialRampToValueAtTime(Math.max(0.0002, v), t + i * dur + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + i * dur + dur * 0.95);
      o.connect(g).connect(actx.destination);
      o.start(t + i * dur);
      o.stop(t + i * dur + dur);
    });
  } catch { /* ses aygıtı yoksa sorun değil */ }
  return notes.length * dur;
}
