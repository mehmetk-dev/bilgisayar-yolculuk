// Derslerin ortak yardımcıları
//
// Bir dersin alanları:
//   id, icon, title, desc, minutes
//   stage: 'notepad' | 'desktop' | 'scene'
//   desktop: { power, settings }  → masaüstü derslerinde başlangıç durumu
//   setup(c)                      → ders açılınca bir kez (ör. masaüstüne dosya koymak)
//   summary: [[kısayol/yol, açıklama], …] → son adımdaki özet ve yazdırılabilir kart
//   parkur: true                  → son adımda her görevin süresi listelenir
//   test: true                    → son adımda puan (ilk denemede doğru bilinen `quiz: true` adımlar)
//
// Bir adımın alanları:
//   title, html (metin ya da c => metin), combo, keys, mouse, target, hint
//   on(ev, c)  → her olayda çağrılır; true dönerse adım tamamlanır
//   check(c)   → adım açılırken koşul zaten sağlanmışsa hemen tamamlar
//   setup(c)   → adım açılırken (ör. bir pencereyi hazırlamak)
//   leave(c)   → adımdan çıkarken
//   manual     → "Yaptım ✔" gibi bir düğme; algılanamayan işler için
//   scene(el, c) → 'scene' derslerinde sağ taraftaki etkinlik
//   done       → tebrik metni (metin ya da c => metin)
//   final: true → son (özet) adımı
//
// c: { d: masaüstü, np: Not Defteri, s: adıma özel durum, L: derse özel durum, warn(), note(), complete(), emit() }

export const K = (...names) => names.map((n) => `<kbd>${n}</kbd>`).join(' + ');

export const norm = (s) => s.toLocaleLowerCase('tr').replace(/[^\p{L}\p{N}\s@.]/gu, '').replace(/\s+/g, ' ').trim();

function lev(a, b) {
  const d = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let p = d[0];
    d[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const t = d[j];
      d[j] = Math.min(d[j] + 1, d[j - 1] + 1, p + (a[i - 1] === b[j - 1] ? 0 : 1));
      p = t;
    }
  }
  return d[b.length];
}

// Küçük yazım hatalarına (ve Türkçe karakter yerine düz harf kullanmaya) göz yumarak karşılaştırır
export function closeEnough(line, target) {
  const a = norm(line).replace(/[@.]/g, ''), b = norm(target).replace(/[@.]/g, '');
  return lev(a, b) <= Math.max(2, Math.round(b.length * 0.15));
}

export const lines = (v) => v.split('\n').map((l) => l.trim());

// Masaüstü kısayolları
export const open = (c, app) => !!c.d?.find(app);
export const ensure = (c, app, args) => c.d.ensure(app, args);
export const maxed = (c, app, args) => { const w = c.d.ensure(app, args); if (!w.max) c.d.maximize(w); return w; };
export const desktopReady = (c) => { if (c.d.power !== 'desktop') c.d.setPower('desktop', true); };
export const nodeOnDesktop = (c, name) => c.d.fs.find('desktop', name);

// Masaüstüne/klasöre dosya koyar (yoksa)
export function put(c, folder, name, type = 'file', content = '') {
  return c.d.fs.find(folder, name) || c.d.fs.create(folder, { type, name, content });
}

export const PIC = (emoji, a, b) => ({ emoji, bg: [a, b] });
