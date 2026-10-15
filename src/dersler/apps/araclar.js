// Erişilebilirlik araçları: Ekran Klavyesi ve Büyüteç'in başlatıcısı (Büyüteç'in kendisi desktop.js'te, Ayarlar'daki düğmeyle aynı).
import { esc } from './util.js';

// ------------------------------------------------------------------ Ekran Klavyesi (Türkçe Q)
const ROWS = [
  ['"', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '*', '-', ['Backspace', '⌫ Geri', 2]],
  [['Tab', 'Sekme', 1.5], 'q', 'w', 'e', 'r', 't', 'y', 'u', 'ı', 'o', 'p', 'ğ', 'ü', ['Enter', 'Enter ↵', 1.5]],
  [['Caps', 'Caps Lock', 1.9], 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ş', 'i', ',', ['Enter', '↵', 1.1]],
  [['Shift', '⇧ Shift', 1.5], '<', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'ö', 'ç', '.', ['Shift', '⇧ Shift', 2.5]],
  [['Ctrl', 'Ctrl', 1.4], ['Alt', 'Alt', 1.2], [' ', 'Boşluk', 7.4], ['AltGr', 'Alt Gr', 1.4], ['Left', '←', 1], ['Right', '→', 1], ['Close', '✕', 1.2]],
];
const SHIFT = { '"': 'é', 1: '!', 2: "'", 3: '^', 4: '+', 5: '%', 6: '&', 7: '/', 8: '(', 9: ')', 0: '=', '*': '?', '-': '_', ',': ';', '.': ':', '<': '>' };
const ALTGR = { q: '@', e: '€', 2: '£', 3: '#', 4: '$', 5: '½', 7: '{', 8: '[', 9: ']', 0: '}', '*': '\\', '-': '|', '<': '|', ü: '~' };
const up = (c) => c.toLocaleUpperCase('tr');

export function osk({ desk, win, body, emit }) {
  body.classList.add('osk');
  const st = { shift: false, caps: false, altgr: false };
  // Ekranın altına yerleşir
  const scr = desk.winsEl.getBoundingClientRect();
  win.y = Math.max(4, scr.height - win.h - 6);

  function label(k) {
    if (st.altgr && ALTGR[k]) return ALTGR[k];
    if (/^\p{L}$/u.test(k)) return st.shift !== st.caps ? up(k) : k;
    return st.shift && SHIFT[k] ? SHIFT[k] : k;
  }
  function render() {
    body.innerHTML = ROWS.map((r) => `<div class="osk-row">${r.map((k) => {
      if (Array.isArray(k)) {
        const [code, l, w] = k;
        const on = (code === 'Shift' && st.shift) || (code === 'Caps' && st.caps) || (code === 'AltGr' && st.altgr);
        return `<button type="button" data-k="${code}" class="osk-sp ${on ? 'on' : ''}" style="flex:${w}">${l}</button>`;
      }
      return `<button type="button" data-k="${esc(k)}">${esc(label(k))}</button>`;
    }).join('')}</div>`).join('');
  }

  function target() {
    const t = desk.lastInput;
    if (!t || !t.isConnected) return null;
    if (document.activeElement !== t) t.focus({ preventScroll: true });
    return t;
  }
  function press(k) {
    if (k === 'Shift') { st.shift = !st.shift; render(); return; }
    if (k === 'Caps') { st.caps = !st.caps; render(); return; }
    if (k === 'AltGr') { st.altgr = !st.altgr; render(); return; }
    if (k === 'Close') { desk.close(win); return; }
    if (k === 'Ctrl' || k === 'Alt') return;
    const t = target();
    if (!t) { desk.toast('Ekran Klavyesi', 'Önce yazı yazacağınız yere (Not Defteri, arama kutusu…) bir kez tıklayın.', '⌨', 4000); return; }
    const field = t.matches('input, textarea');
    if (k === 'Backspace') document.execCommand('delete');
    else if (k === 'Enter') {
      if (t.matches('input')) t.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', bubbles: true }));
      else if (field) document.execCommand('insertText', false, '\n');
      else document.execCommand('insertParagraph');
    } else if (k === 'Tab') document.execCommand('insertText', false, '\t');
    else if (k === 'Left' || k === 'Right') {
      const d = k === 'Left' ? -1 : 1;
      if (field) { const p = Math.max(0, (d < 0 ? t.selectionStart : t.selectionEnd) + d); t.setSelectionRange(p, p); } else getSelection().modify('move', d < 0 ? 'backward' : 'forward', 'character');
    } else {
      document.execCommand('insertText', false, label(k));
      if (st.shift || st.altgr) { st.shift = false; st.altgr = false; render(); }
    }
    emit('osk-key', { key: k });
  }
  body.addEventListener('click', (e) => { const b = e.target.closest('[data-k]'); if (b) press(b.dataset.k); });
  render();
  return { press };
}

// ------------------------------------------------------------------ Büyüteç: pencere açmaz; Başlat'tan açılınca Ayarlar'daki düğme gibi açıp kapatır
export const magnifier = (desk) => desk.magnify(desk.settings.magnifier ? 0 : 1);
