// Ekrandaki Türkçe Q klavye. Gerçek tuşa basılınca aynı tuş yanar; adımın istediği tuşlar sarı yanıp söner.
// Tuşlar fiziksel konuma (KeyboardEvent.code) göre eşlenir, bu yüzden klavye düzeni ne olursa olsun doğru tuş yanar.

const ROWS = [
  [['Backquote', '"'], ['Digit1', '1'], ['Digit2', '2'], ['Digit3', '3'], ['Digit4', '4'], ['Digit5', '5'], ['Digit6', '6'], ['Digit7', '7'], ['Digit8', '8'], ['Digit9', '9'], ['Digit0', '0'], ['Minus', '*'], ['Equal', '-'], ['Backspace', '⌫ Backspace', 2]],
  [['Tab', 'Tab', 1.5], ['KeyQ', 'Q'], ['KeyW', 'W'], ['KeyE', 'E'], ['KeyR', 'R'], ['KeyT', 'T'], ['KeyY', 'Y'], ['KeyU', 'U'], ['KeyI', 'I'], ['KeyO', 'O'], ['KeyP', 'P'], ['BracketLeft', 'Ğ'], ['BracketRight', 'Ü'], ['Enter', 'Enter ↵', 1.5]],
  [['CapsLock', 'Caps Lock', 1.75], ['KeyA', 'A'], ['KeyS', 'S'], ['KeyD', 'D'], ['KeyF', 'F'], ['KeyG', 'G'], ['KeyH', 'H'], ['KeyJ', 'J'], ['KeyK', 'K'], ['KeyL', 'L'], ['Semicolon', 'Ş'], ['Quote', 'İ'], ['Backslash', ','], ['Enter', '', 1.25]],
  [['ShiftLeft', '⇧ Shift', 1.25], ['IntlBackslash', '<'], ['KeyZ', 'Z'], ['KeyX', 'X'], ['KeyC', 'C'], ['KeyV', 'V'], ['KeyB', 'B'], ['KeyN', 'N'], ['KeyM', 'M'], ['Comma', 'Ö'], ['Period', 'Ç'], ['Slash', '.'], ['ShiftRight', '⇧ Shift', 2.75]],
  [['ControlLeft', 'Ctrl', 1.5], ['MetaLeft', '⊞', 1.25], ['AltLeft', 'Alt', 1.25], ['Space', 'Boşluk', 7], ['AltRight', 'AltGr', 1.25], ['ContextMenu', '☰', 1.25], ['ControlRight', 'Ctrl', 1.5]],
];

// Sağdaki küçük blok: Delete, Home, End ve ok tuşları (boş hücreler null)
const SIDE = [
  [['Delete', 'Delete'], ['Home', 'Home'], ['End', 'End']],
  [null, null, null],
  [null, null, null],
  [null, ['ArrowUp', '↑'], null],
  [['ArrowLeft', '←'], ['ArrowDown', '↓'], ['ArrowRight', '→']],
];

// Derslerde kullanılan mantıksal adlar → fiziksel tuşlar ve etiketler
const ALIAS = { Ctrl: ['ControlLeft', 'ControlRight'], Shift: ['ShiftLeft', 'ShiftRight'], Meta: ['MetaLeft'] };
const LABEL = { Ctrl: 'Ctrl', Shift: '⇧ Shift', Meta: '⊞ Windows', Enter: 'Enter ↵', Backspace: '⌫ Backspace', Space: 'Boşluk', AltRight: 'AltGr', AltLeft: 'Alt', CapsLock: 'Caps Lock', ArrowUp: '↑', ArrowDown: '↓', ArrowLeft: '←', ArrowRight: '→' };

export function keyLabel(name) {
  if (LABEL[name]) return LABEL[name];
  for (const row of [...ROWS, ...SIDE]) for (const k of row) if (k && k[0] === name) return k[1];
  return name;
}

// Bir tuşa basıldığında hem fiziksel hem mantıksal ad (ör. ControlLeft ve Ctrl) yanmalı
function namesFor(code) {
  const out = [code];
  for (const [k, list] of Object.entries(ALIAS)) if (list.includes(code)) out.push(k);
  return out;
}

export class Keyboard {
  constructor(el) {
    this.el = el;
    const key = ([code, lbl, w = 1]) => `<span class="key${lbl.length > 2 ? ' wide' : ''}${lbl.length > 7 ? ' long' : ''}" data-code="${code}" style="flex:${w} ${w} 0">${lbl}</span>`;
    el.innerHTML = `<div class="kb-main">${ROWS.map((row) => '<div class="kr">' + row.map(key).join('') + '</div>').join('')}</div>
      <div class="kb-side">${SIDE.map((row) => '<div class="kr">' + row.map((k) => (k ? key(k) : '<span class="key gap"></span>')).join('') + '</div>').join('')}</div>`;
    this.down = new Set();
    const set = (code, on) => {
      for (const n of namesFor(code)) document.querySelectorAll(`[data-code="${n}"]`).forEach((k) => k.classList.toggle('down', on));
    };
    addEventListener('keydown', (e) => { this.down.add(e.code); set(e.code, true); }, true);
    addEventListener('keyup', (e) => { this.down.delete(e.code); set(e.code, false); }, true);
    // Pencere odak kaybedince (ör. Alt+Tab) tuşlar basılı kalmasın
    addEventListener('blur', () => { this.down.forEach((c) => set(c, false)); this.down.clear(); });
  }

  want(names = []) {
    const codes = new Set(names.flatMap((n) => ALIAS[n] || [n]));
    this.el.querySelectorAll('.key').forEach((k) => k.classList.toggle('want', codes.has(k.dataset.code)));
  }
}
