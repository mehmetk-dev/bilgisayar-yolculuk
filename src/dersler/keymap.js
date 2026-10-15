// Klavye düzenleri: gerçek klavyede basılan fiziksel tuşa (event.code) göre hangi harfin yazılacağı.
// Gerçek klavye Türkçe Q varsayılır; “trq” düzeninde tarayıcının kendi yazdığı harf kullanılır.
export const KB = {
  trq: ['TUR', 'Türkçe Q klavye'],
  trf: ['TUR', 'Türkçe F klavye'],
  eng: ['ENG', 'İngilizce (ABD) klavye'],
};

// Türkçe F: tuşun Q klavyedeki yerine göre [normal, Shift]
const F = {
  KeyQ: ['f', 'F'], KeyW: ['g', 'G'], KeyE: ['ğ', 'Ğ'], KeyR: ['ı', 'I'], KeyT: ['o', 'O'], KeyY: ['d', 'D'], KeyU: ['r', 'R'], KeyI: ['n', 'N'], KeyO: ['h', 'H'], KeyP: ['p', 'P'],
  BracketLeft: ['q', 'Q'], BracketRight: ['w', 'W'], Backslash: ['x', 'X'],
  KeyA: ['u', 'U'], KeyS: ['i', 'İ'], KeyD: ['e', 'E'], KeyF: ['a', 'A'], KeyG: ['ü', 'Ü'], KeyH: ['t', 'T'], KeyJ: ['k', 'K'], KeyK: ['m', 'M'], KeyL: ['l', 'L'], Semicolon: ['y', 'Y'], Quote: ['ş', 'Ş'],
  KeyZ: ['j', 'J'], KeyX: ['ö', 'Ö'], KeyC: ['v', 'V'], KeyV: ['c', 'C'], KeyB: ['ç', 'Ç'], KeyN: ['z', 'Z'], KeyM: ['s', 'S'], Comma: ['b', 'B'], Period: ['.', ':'], Slash: [',', ';'],
};

// İngilizce (ABD): Türkçe harfli tuşlar işaret verir (ş tuşu ; , ğ tuşu [ gibi)
const ENG = {
  BracketLeft: ['[', '{'], BracketRight: [']', '}'], Semicolon: [';', ':'], Quote: ["'", '"'], Comma: [',', '<'], Period: ['.', '>'], Slash: ['/', '?'],
  Backslash: ['\\', '|'], Minus: ['-', '_'], Equal: ['=', '+'], Backquote: ['`', '~'],
};
const ENG_DIGIT = { Digit1: '!', Digit2: '@', Digit3: '#', Digit4: '$', Digit5: '%', Digit6: '^', Digit7: '&', Digit8: '*', Digit9: '(', Digit0: ')' };

// Basılan tuş için yazılacak karakteri verir; hiçbir şey değişmeyecekse null
export function mapKey(layout, e) {
  if (e.ctrlKey || e.altKey || e.metaKey || e.isComposing) return null;
  const shift = e.shiftKey;
  const caps = !!e.getModifierState?.('CapsLock');
  if (layout === 'trf') {
    const m = F[e.code];
    if (!m) return null;
    const isLetter = /^(Key|Bracket|Semicolon|Quote|Backslash)/.test(e.code) && m[0].toLocaleUpperCase('tr') !== m[0];
    return (isLetter ? shift !== caps : shift) ? m[1] : m[0];
  }
  if (layout === 'eng') {
    if (/^Key[A-Z]$/.test(e.code)) { const ch = e.code[3]; return shift !== caps ? ch : ch.toLowerCase(); }
    if (shift && ENG_DIGIT[e.code]) return ENG_DIGIT[e.code];
    const m = ENG[e.code];
    return m ? m[shift ? 1 : 0] : null;
  }
  return null;
}
