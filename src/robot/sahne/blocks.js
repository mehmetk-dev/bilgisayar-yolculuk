// Scratch benzeri blok tanımları (Türkçe Scratch 3 sözcükleri ve renkleriyle)
// text içindeki {ad} yerine girdi gelir. Girdi türleri: num (sayı), text (yazı), cond (koşul),
// key, msg, costume, backdrop, sound, note, color, var (seçim listeleri)

export const CATS = {
  motion: { name: 'Hareket', color: '#4c97ff' },
  looks: { name: 'Görünüm', color: '#9966ff' },
  sound: { name: 'Ses', color: '#cf63cf' },
  events: { name: 'Olaylar', color: '#ffbf00' },
  control: { name: 'Kontrol', color: '#ffab19' },
  sensing: { name: 'Algılama', color: '#5cb1d6' },
  pen: { name: 'Kalem', color: '#0fbd8c' },
  vars: { name: 'Değişkenler', color: '#ff8c1a' },
};

// kind: hat (olay başlığı), stack (normal), c (içine blok alan), c2 (eğer-değilse), cap (sonu olmayan)
export const BLOCKS = {
  flag: { cat: 'events', kind: 'hat', text: '🏁 tıklandığında' },
  key: { cat: 'events', kind: 'hat', text: '{key} tuşuna basılınca', args: { key: ['key', 'space'] } },
  click: { cat: 'events', kind: 'hat', text: 'bu kukla tıklanınca' },
  recv: { cat: 'events', kind: 'hat', text: '{msg} haberini aldığımda', args: { msg: ['msg', 'mesaj1'] } },
  bcast: { cat: 'events', text: '{msg} haberini sal', args: { msg: ['msg', 'mesaj1'] } },
  bcastw: { cat: 'events', text: '{msg} haberini sal ve bekle', args: { msg: ['msg', 'mesaj1'] } },

  move: { cat: 'motion', text: '{n} adım git', args: { n: ['num', 10] } },
  turnR: { cat: 'motion', text: '↻ {n} derece dön', args: { n: ['num', 15] } },
  turnL: { cat: 'motion', text: '↺ {n} derece dön', args: { n: ['num', 15] } },
  goto: { cat: 'motion', text: 'x: {x} y: {y} konumuna git', args: { x: ['num', 0], y: ['num', 0] } },
  gotoRand: { cat: 'motion', text: 'rastgele konuma git' },
  gotoMouse: { cat: 'motion', text: 'fare imlecine git' },
  glide: { cat: 'motion', text: '{s} saniyede x: {x} y: {y} konumuna süzül', args: { s: ['num', 1], x: ['num', 0], y: ['num', 0] } },
  point: { cat: 'motion', text: '{d} yönüne dön', args: { d: ['num', 90] } },
  chx: { cat: 'motion', text: 'x\'i {n} değiştir', args: { n: ['num', 10] } },
  setx: { cat: 'motion', text: 'x\'i {n} yap', args: { n: ['num', 0] } },
  chy: { cat: 'motion', text: 'y\'yi {n} değiştir', args: { n: ['num', 10] } },
  sety: { cat: 'motion', text: 'y\'yi {n} yap', args: { n: ['num', 0] } },
  bounce: { cat: 'motion', text: 'kenara geldiyse sek' },

  sayFor: { cat: 'looks', text: '{t} de {s} saniye', args: { t: ['text', 'Merhaba!'], s: ['num', 2] } },
  say: { cat: 'looks', text: '{t} de', args: { t: ['text', 'Merhaba!'] } },
  thinkFor: { cat: 'looks', text: '{t} diye düşün {s} saniye', args: { t: ['text', 'Hmm…'], s: ['num', 2] } },
  costume: { cat: 'looks', text: '{c} kostümüne geç', args: { c: ['costume', 1] } },
  costumeN: { cat: 'looks', text: '{n}. kostüme geç', args: { n: ['num', 1] } },
  next: { cat: 'looks', text: 'sonraki kostüm' },
  backdrop: { cat: 'looks', text: 'dekoru {b} yap', args: { b: ['backdrop', 'cayir'] } },
  size: { cat: 'looks', text: 'büyüklüğü %{n} yap', args: { n: ['num', 100] } },
  chsize: { cat: 'looks', text: 'büyüklüğü {n} değiştir', args: { n: ['num', 10] } },
  color: { cat: 'looks', text: 'renk etkisini {n} değiştir', args: { n: ['num', 25] } },
  clearfx: { cat: 'looks', text: 'görsel etkileri temizle' },
  show: { cat: 'looks', text: 'göster' },
  hide: { cat: 'looks', text: 'gizle' },

  sound: { cat: 'sound', text: '{snd} sesini başlat', args: { snd: ['sound', 'pop'] } },
  soundW: { cat: 'sound', text: '{snd} sesini bitene kadar çal', args: { snd: ['sound', 'pop'] } },
  note: { cat: 'sound', text: '♪ {note} notasını {b} vuruş çal', args: { note: ['note', 60], b: ['num', 0.5] } },
  rest: { cat: 'sound', text: '♪ {b} vuruş sus', args: { b: ['num', 0.5] } },

  wait: { cat: 'control', text: '{s} saniye bekle', args: { s: ['num', 1] } },
  repeat: { cat: 'control', kind: 'c', text: '{n} kez tekrarla', args: { n: ['num', 10] } },
  forever: { cat: 'control', kind: 'c', cap: true, text: 'sürekli tekrarla' },
  if: { cat: 'control', kind: 'c', text: 'eğer {c} ise', args: { c: ['cond', null] } },
  ife: { cat: 'control', kind: 'c2', text: 'eğer {c} ise', args: { c: ['cond', null] } },
  waitUntil: { cat: 'control', text: '{c} olana kadar bekle', args: { c: ['cond', null] } },
  until: { cat: 'control', kind: 'c', text: '{c} olana kadar tekrarla', args: { c: ['cond', null] } },
  stop: { cat: 'control', cap: true, text: 'tümünü durdur' },

  clear: { cat: 'pen', text: 'tümünü sil' },
  down: { cat: 'pen', text: 'kalemi bastır' },
  up: { cat: 'pen', text: 'kalemi kaldır' },
  pcolor: { cat: 'pen', text: 'kalem rengini {col} yap', args: { col: ['color', '#4c97ff'] } },
  psize: { cat: 'pen', text: 'kalem kalınlığını {n} yap', args: { n: ['num', 3] } },
  stamp: { cat: 'pen', text: 'damga' },

  setv: { cat: 'vars', text: '{v} değişkenini {n} yap', args: { v: ['var', null], n: ['num', 0] } },
  chv: { cat: 'vars', text: '{v} değişkenini {n} değiştir', args: { v: ['var', null], n: ['num', 1] } },
};

export const KEYS = { space: 'boşluk', right: 'sağ ok', left: 'sol ok', up: 'yukarı ok', down: 'aşağı ok', a: 'a', s: 's', d: 'd', w: 'w' };

export const SOUNDS = { pop: 'Pop', miyav: 'Miyav', hav: 'Hav hav', davul: 'Davul', zil: 'Zil', boing: 'Boing', alkis: 'Alkış', kazandin: 'Kazandın' };

export const NOTES = { 60: 'Do', 62: 'Re', 64: 'Mi', 65: 'Fa', 67: 'Sol', 69: 'La', 71: 'Si', 72: 'İnce Do' };

export const COLORS = { '#4c97ff': 'mavi', '#ff4d4d': 'kırmızı', '#2fbf71': 'yeşil', '#ffbf00': 'sarı', '#9966ff': 'mor', '#ff8a3d': 'turuncu', '#ff6fb5': 'pembe', '#2b2340': 'siyah' };

// Sayı yerine konabilen değer blokları (yeşil/mavi/turuncu yuvarlak bloklar)
export const REPORTERS = {
  rand: { cat: 'operators', label: 'rastgele' },
  x: { cat: 'motion', label: 'x konumu' },
  y: { cat: 'motion', label: 'y konumu' },
  dir: { cat: 'motion', label: 'yön' },
  mx: { cat: 'sensing', label: 'fare x' },
  my: { cat: 'sensing', label: 'fare y' },
  var: { cat: 'vars', label: 'değişken' },
};

// Koşul türleri
export const COND_KINDS = {
  touch: 'dokunuyor mu?',
  key: 'tuşuna basılı mı?',
  mouse: 'fare tıklandı mı?',
  cmp: 'karşılaştır',
};

// Kısa yazımla blok: ['move', 10] ya da ['repeat', 4, [[...]]] ya da ['ife', cond, [..], [..]]
export function mk(spec, id) {
  const [op, ...rest] = spec;
  const def = BLOCKS[op];
  if (!def) throw new Error('Bilinmeyen blok: ' + op);
  const b = { id: id(), op, args: {} };
  const keys = Object.keys(def.args || {});
  keys.forEach((k, i) => { b.args[k] = rest[i] !== undefined ? rest[i] : def.args[k][1]; });
  const after = rest.slice(keys.length);
  if (def.kind === 'c' || def.kind === 'c2') b.body = (after[0] || []).map((s) => mk(s, id));
  if (def.kind === 'c2') b.body2 = (after[1] || []).map((s) => mk(s, id));
  return b;
}

export const isHat = (b) => BLOCKS[b.op].kind === 'hat';
export const isC = (b) => BLOCKS[b.op].kind === 'c' || BLOCKS[b.op].kind === 'c2';
export const slotsOf = (b) => (BLOCKS[b.op].kind === 'c2' ? ['body', 'body2'] : BLOCKS[b.op].kind === 'c' ? ['body'] : []);

export function usesOp(scripts, op) {
  const any = (list) => list.some((b) => b.op === op || slotsOf(b).some((s) => any(b[s])));
  return scripts.some(any);
}
