// Dokunmatik ekran (telefon, tablet): klavyesi ve faresi olmayanlar için tuş şeridi.
// Şeritteki bir tuşa basınca gerçek tuşa basılmış gibi keydown/keyup olayları gönderilir; dersler ve
// benzetimler bunları gerçek klavyeden ayırmaz. Tarayıcının kendi yaptığı işler (harf yazma, silme,
// kopyala/yapıştır, geri al) sahte olaylarda kendiliğinden olmadığı için burada elle yapılır.
// "Sağ tık" ve "Çift tık" düğmeleri bir sonraki dokunuşu sağ tıklamaya ya da çift tıklamaya çevirir.

const MODS = { Ctrl: 'ctrlKey', ControlLeft: 'ctrlKey', ControlRight: 'ctrlKey', Shift: 'shiftKey', ShiftLeft: 'shiftKey', ShiftRight: 'shiftKey', Alt: 'altKey', AltLeft: 'altKey', Meta: 'metaKey', MetaLeft: 'metaKey' };
const MOD_KEY = { ctrlKey: ['Control', 'ControlLeft'], shiftKey: ['Shift', 'ShiftLeft'], altKey: ['Alt', 'AltLeft'], metaKey: ['Meta', 'MetaLeft'] };
// Türkçe Q klavyede harf dışı tuşların yazdığı karakter
const TRQ = { KeyI: 'ı', BracketLeft: 'ğ', BracketRight: 'ü', Semicolon: 'ş', Quote: 'i', Comma: 'ö', Period: 'ç', Slash: '.', Backslash: ',', Minus: '*', Equal: '-', Backquote: '"', IntlBackslash: '<' };
const ALTGR = { KeyQ: '@', KeyE: '€', Digit2: '£', Digit3: '#', Digit4: '$', Digit7: '{', Digit8: '[', Digit9: ']', Digit0: '}', Minus: '\\', Equal: '|' };
const NAMED = { Space: ' ', ControlLeft: 'Control', ControlRight: 'Control', ShiftLeft: 'Shift', ShiftRight: 'Shift', AltLeft: 'Alt', AltRight: 'AltGraph', MetaLeft: 'Meta', Ctrl: 'Control', Shift: 'Shift', Meta: 'Meta', Alt: 'Alt' };
const CODE = { Ctrl: 'ControlLeft', Shift: 'ShiftLeft', Meta: 'MetaLeft', Alt: 'AltLeft' };

// Şeritte her zaman duran tuşlar
// (sık kullanılanlar önde; fare düğmeleri ve Ctrl/Shift/Alt bunların arasına girer)
const FIRST = [['Escape', 'Esc'], ['Enter', 'Enter ↵'], ['Backspace', '⌫']];
const FIXED = [['Delete', 'Delete'], ['Tab', 'Tab'], ['Meta', '⊞'], ['F2', 'F2'], ['F5', 'F5'],
  ['ArrowLeft', '←'], ['ArrowUp', '↑'], ['ArrowDown', '↓'], ['ArrowRight', '→'], ['Home', 'Home'], ['End', 'End']];

const editable = (el) => el && (el.isContentEditable || (el.tagName === 'TEXTAREA') || (el.tagName === 'INPUT' && /^(text|search|email|url|tel|password|number|)$/.test(el.type)));
const textField = (el) => el && (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT');

export function isTouch() {
  return matchMedia('(pointer: coarse)').matches || localStorage.getItem('dokunmatik') === '1';
}

export function setupTouch({ bar, keyLabel, work }) {
  if (!isTouch()) return { want() {}, press() {} };
  document.body.classList.add('touch');
  const mods = { ctrlKey: false, shiftKey: false, altKey: false };
  let caps = false, mouse = null, lastFocus = null, clip = '';

  addEventListener('focusin', (e) => { if (!bar.contains(e.target)) lastFocus = e.target; }, true);
  // Kopyalanan yazı saklanır: sahte Ctrl + V gerçek panoyu okuyamaz
  const keep = () => {
    const a = document.activeElement;
    clip = textField(a) ? a.value.slice(a.selectionStart, a.selectionEnd) : String(getSelection());
  };
  addEventListener('copy', keep, true);
  addEventListener('cut', keep, true);

  function target() {
    const a = document.activeElement;
    if (a && a !== document.body && !bar.contains(a)) return a;
    if (lastFocus?.isConnected && lastFocus.offsetParent !== null) return lastFocus;
    return work.querySelector('.dk-screen, .np-ta') || document.body;
  }

  function keyFor(code, m) {
    if (m.ctrlKey && m.altKey && ALTGR[code]) return ALTGR[code];
    if (NAMED[code]) return NAMED[code];
    let ch = null;
    if (/^Key[A-Z]$/.test(code)) ch = TRQ[code] || code[3].toLowerCase();
    else if (/^Digit\d$/.test(code)) ch = code[5];
    else if (TRQ[code]) ch = TRQ[code];
    if (ch === null) return code; // Escape, Enter, F5, ArrowLeft… adları zaten tuş adıdır
    return m.shiftKey !== (caps && /\p{L}/u.test(ch)) ? ch.toLocaleUpperCase('tr') : ch;
  }

  function fire(el, type, key, code, m) {
    const ev = new KeyboardEvent(type, { key, code, bubbles: true, cancelable: true, composed: true, view: window, ...m, modifierCapsLock: caps });
    el.dispatchEvent(ev);
    return ev;
  }

  // names: ['Ctrl', 'KeyS'] gibi bir tuş birleşimi
  function press(names) {
    const m = { ...mods, metaKey: false };
    let main = null;
    for (const n of names) {
      if (n === 'AltRight') { m.ctrlKey = m.altKey = true; continue; }
      if (MODS[n]) m[MODS[n]] = true; else main = n;
    }
    // Yalnızca bir değiştirici tuş istenmişse (ör. ⊞ Windows) o tuşun kendisine basılır
    if (!main) main = CODE[names[names.length - 1]] || names[names.length - 1];
    if (main === 'CapsLock') caps = !caps;
    const el = target();
    const down = [];
    for (const [prop, [k, c]] of Object.entries(MOD_KEY)) if (m[prop] && c !== main) { fire(el, 'keydown', k, c, m); down.push([k, c]); }
    const key = keyFor(main, m);
    const ev = fire(el, 'keydown', key, main, m);
    if (!ev.defaultPrevented) defaults(el, key, main, m);
    fire(el, 'keyup', key, main, m);
    for (const [k, c] of down.reverse()) fire(el, 'keyup', k, c, m);
    // Basılı tutulan Ctrl/Shift/Alt bir tuştan sonra bırakılır
    mods.ctrlKey = mods.shiftKey = mods.altKey = false;
    render();
  }

  // Gerçek klavyede tarayıcının kendiliğinden yaptığı işler
  function defaults(el, key, code, m) {
    const ed = editable(el);
    const ctrl = m.ctrlKey && !m.altKey;
    if (ctrl) {
      if (code === 'KeyA') { if (textField(el)) el.select(); else document.execCommand('selectAll'); }
      else if (code === 'KeyC') document.execCommand('copy');
      else if (code === 'KeyX' && ed) document.execCommand('cut');
      else if (code === 'KeyV' && ed) paste(el);
      else if (code === 'KeyZ' && ed) document.execCommand(m.shiftKey ? 'redo' : 'undo');
      else if (code === 'KeyY' && ed) document.execCommand('redo');
      else if (textField(el) && /^(ArrowLeft|ArrowRight|Home|End)$/.test(code)) caret(el, code, m.shiftKey, true);
      else if (el.isContentEditable) move(code, m.shiftKey, true);
      return;
    }
    if (m.metaKey || (m.altKey && !m.ctrlKey)) return;
    if (!ed) {
      if (code === 'Tab') moveFocus(el, m.shiftKey ? -1 : 1);
      else if (code === 'Enter' && el.matches?.('button, a[href], [role="button"]')) el.click();
      return;
    }
    if (key.length === 1) document.execCommand('insertText', false, key);
    else if (code === 'Enter') {
      if (el.tagName === 'INPUT') el.form?.requestSubmit?.();
      else if (el.isContentEditable) document.execCommand('insertParagraph');
      else exec('insertText', '\n', 'insertLineBreak');
    } else if (code === 'Backspace') document.execCommand('delete');
    else if (code === 'Delete') document.execCommand('forwardDelete');
    else if (code === 'Tab') moveFocus(el, m.shiftKey ? -1 : 1);
    else if (textField(el) && /^(ArrowLeft|ArrowRight|Home|End)$/.test(code)) caret(el, code, m.shiftKey);
    else if (el.isContentEditable) move(code, m.shiftKey, false);
  }

  // Word sayfası gibi düzenlenebilir alanlarda imleç: Shift ile seçerek, Ctrl ile kelime kelime / belgenin başı-sonu
  function move(code, shift, ctrl) {
    const how = { ArrowLeft: ['backward', ctrl ? 'word' : 'character'], ArrowRight: ['forward', ctrl ? 'word' : 'character'], ArrowUp: ['backward', 'line'], ArrowDown: ['forward', 'line'],
      Home: ['backward', ctrl ? 'documentboundary' : 'lineboundary'], End: ['forward', ctrl ? 'documentboundary' : 'lineboundary'] }[code];
    if (!how) return;
    getSelection().modify?.(shift ? 'extend' : 'move', ...how);
    document.dispatchEvent(new Event('selectionchange'));
  }

  // execCommand ile yazılınca input olayı "insertText" der; gerçek klavyedeki türü (yapıştırma, yeni satır) taşısın
  function exec(cmd, value, inputType) {
    const fix = (e) => {
      if (e.inputType === inputType) return;
      e.stopImmediatePropagation();
      e.target.dispatchEvent(new InputEvent('input', { inputType, data: e.data, bubbles: true }));
    };
    addEventListener('input', fix, true);
    try { document.execCommand(cmd, false, value); } finally { removeEventListener('input', fix, true); }
  }

  function paste(el) {
    const dt = new DataTransfer();
    dt.setData('text/plain', clip);
    const ev = new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true });
    el.dispatchEvent(ev);
    if (!ev.defaultPrevented && clip) exec('insertText', clip, 'insertFromPaste');
  }

  // İmleç taşıma; Ctrl ile kelime kelime (oklar) ya da yazının başına/sonuna (Home/End)
  function caret(el, code, shift, ctrl = false) {
    const v = el.value, s = el.selectionStart, e = el.selectionEnd;
    const lineStart = v.lastIndexOf('\n', s - 1) + 1;
    const lineEnd = v.indexOf('\n', e) < 0 ? v.length : v.indexOf('\n', e);
    const wordL = (i) => { while (i > 0 && /\s/.test(v[i - 1])) i--; while (i > 0 && !/\s/.test(v[i - 1])) i--; return i; };
    const wordR = (i) => { while (i < v.length && !/\s/.test(v[i])) i++; while (i < v.length && /\s/.test(v[i])) i++; return i; };
    const pos = ctrl
      ? { ArrowLeft: wordL(s), ArrowRight: wordR(e), Home: 0, End: v.length }[code]
      : { ArrowLeft: shift ? s - 1 : (s !== e ? s : s - 1), ArrowRight: shift ? e + 1 : (s !== e ? e : e + 1), Home: lineStart, End: lineEnd }[code];
    const p = Math.max(0, Math.min(v.length, pos));
    if (!shift) el.setSelectionRange(p, p);
    else if (code === 'ArrowLeft' || code === 'Home') el.setSelectionRange(Math.min(p, e), e, 'backward');
    else el.setSelectionRange(s, Math.max(p, s), 'forward');
    el.dispatchEvent(new Event('select', { bubbles: true }));
  }

  function moveFocus(el, dir) {
    const scope = el.closest?.('.win, [role="dialog"], .dk-screen') || work;
    const list = [...scope.querySelectorAll('input, textarea, select, button, a[href], [tabindex]:not([tabindex="-1"])')].filter((x) => !x.disabled && x.offsetParent !== null);
    if (!list.length) return;
    const i = list.indexOf(el);
    list[(i + dir + list.length) % list.length].focus();
  }

  // ---- Sağ tık / çift tık: bir sonraki dokunuşa uygulanır ----
  const mev = (type, x, y, button, detail = 1) => new MouseEvent(type, { bubbles: true, cancelable: true, composed: true, view: window, clientX: x, clientY: y, button, buttons: type.endsWith('down') ? (button === 2 ? 2 : 1) : 0, detail });
  const pev = (type, x, y, button) => new PointerEvent(type, { bubbles: true, cancelable: true, composed: true, view: window, clientX: x, clientY: y, button, buttons: type === 'pointerdown' ? 2 : 0, pointerType: 'mouse', isPrimary: true, pointerId: 1 });
  addEventListener('click', (e) => {
    if (!mouse || !work.contains(e.target) || !e.isTrusted) return;
    const kind = mouse, x = e.clientX, y = e.clientY, t = e.target;
    mouse = null;
    render();
    if (kind === 'right') {
      e.preventDefault(); e.stopPropagation();
      t.dispatchEvent(pev('pointerdown', x, y, 2));
      t.dispatchEvent(mev('mousedown', x, y, 2));
      t.dispatchEvent(pev('pointerup', x, y, 2));
      t.dispatchEvent(mev('mouseup', x, y, 2));
      t.dispatchEvent(mev('contextmenu', x, y, 2));
    } else {
      // İlk tıklama olduğu gibi geçer; ardından ikinci tıklama ve çift tıklama gelir
      setTimeout(() => {
        const el = t.isConnected ? t : document.elementFromPoint(x, y);
        if (!el) return;
        el.dispatchEvent(pev('pointerdown', x, y, 0));
        el.dispatchEvent(mev('mousedown', x, y, 0, 2));
        el.dispatchEvent(pev('pointerup', x, y, 0));
        el.dispatchEvent(mev('mouseup', x, y, 0, 2));
        el.dispatchEvent(mev('click', x, y, 0, 2));
        el.dispatchEvent(mev('dblclick', x, y, 0, 2));
      }, 0);
    }
  }, true);

  // ---- Basılı Ctrl/Shift/Alt ile dokunmak: Shift + tık (aralık seçme), Ctrl + tık (birden çok seçme) ----
  const MOUSE = ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click', 'dblclick'];
  for (const type of MOUSE) addEventListener(type, (e) => {
    if (!e.isTrusted || mouse || !work.contains(e.target) || !(mods.ctrlKey || mods.shiftKey || mods.altKey)) return;
    e.stopImmediatePropagation();
    if (type !== 'pointerdown' && type !== 'pointerup') e.preventDefault();
    const init = { bubbles: true, cancelable: true, composed: true, view: window, clientX: e.clientX, clientY: e.clientY, button: e.button, buttons: e.buttons, detail: e.detail, ...mods };
    e.target.dispatchEvent(type.startsWith('pointer') ? new PointerEvent(type, { ...init, pointerType: 'mouse', isPrimary: true, pointerId: 1 }) : new MouseEvent(type, init));
    if (type === 'click') { mods.ctrlKey = mods.shiftKey = mods.altKey = false; render(); }
  }, true);

  // ---- Şeritte Ctrl/Alt basılıyken telefon klavyesinden yazılan harf kısayol olur (Ctrl + R gibi) ----
  const CODE_OF = { ...Object.fromEntries(Object.entries(TRQ).map(([c, ch]) => [ch, c])), i: 'KeyI' }; // i de ı da I tuşu sayılır
  addEventListener('beforeinput', (e) => {
    if (!(mods.ctrlKey || mods.altKey) || e.inputType !== 'insertText' || e.data?.length !== 1) return;
    const ch = e.data.toLocaleLowerCase('tr');
    const code = CODE_OF[ch] || (/^[a-z]$/.test(ch) ? 'Key' + ch.toUpperCase() : /^\d$/.test(ch) ? 'Digit' + ch : null);
    if (!code) return;
    e.preventDefault();
    press([code]);
  }, true);

  // ---- Şerit ----
  let wanted = [], singles = [], singleMods = [];
  function render() {
    const btn = (data, label, cls = '') => `<button type="button" class="tk ${cls}" ${data}>${label}</button>`;
    const parts = [];
    if (wanted.length) parts.push(btn(`data-combo="${wanted.join(' ')}"`, wanted.map(keyLabel).join(' + '), 'want'));
    for (const k of singles) parts.push(btn(`data-combo="${k}"`, keyLabel(k), 'want'));
    for (const [c, l] of FIRST) parts.push(btn(`data-combo="${c}"`, l));
    parts.push(btn('data-mouse="right"', '🖱 Sağ tık', mouse === 'right' ? 'on' : ''));
    parts.push(btn('data-mouse="double"', '🖱 Çift tık', mouse === 'double' ? 'on' : ''));
    // Tek başına istenen Ctrl/Shift/Alt basılı tutulacak tuştur: o düğme sarı yanar
    const wantMod = new Set(singleMods.map((k) => MODS[k]));
    for (const [p, l] of [['ctrlKey', 'Ctrl'], ['shiftKey', '⇧ Shift'], ['altKey', 'Alt']]) parts.push(btn(`data-mod="${p}"`, l, (mods[p] ? 'on ' : '') + (wantMod.has(p) ? 'want' : '')));
    // Ctrl/Alt basılıyken harfler de çıkar (Ctrl + R gibi adımın istemediği kısayollar için)
    if (mods.ctrlKey || mods.altKey) for (const ch of 'ABCDEFGHIJKLMNOPQRSTUVWXYZ') parts.push(btn(`data-combo="Key${ch}"`, ch, 'let'));
    for (const [c, l] of FIXED) parts.push(btn(`data-combo="${c}"`, l));
    bar.innerHTML = parts.join('');
    const hint = mouse === 'right' ? 'Şimdi sağ tıklanacak yere dokunun' : mouse === 'double' ? 'Şimdi çift tıklanacak yere dokunun' : '';
    bar.dataset.hint = hint;
  }
  // Odak yazı alanında kalsın: şeride dokunmak odağı almasın
  for (const t of ['pointerdown', 'mousedown']) bar.addEventListener(t, (e) => { if (e.target.closest('.tk')) e.preventDefault(); });
  // Sona gelince sağdaki solma kalksın
  bar.addEventListener('scroll', () => bar.classList.toggle('end', bar.scrollLeft + bar.clientWidth >= bar.scrollWidth - 4), { passive: true });
  bar.addEventListener('click', (e) => {
    const b = e.target.closest('.tk');
    if (!b) return;
    if (b.dataset.mod) { mods[b.dataset.mod] = !mods[b.dataset.mod]; render(); return; }
    if (b.dataset.mouse) { mouse = mouse === b.dataset.mouse ? null : b.dataset.mouse; render(); return; }
    press(b.dataset.combo.split(' '));
  });
  render();

  return {
    // Adımın istediği tuşlar şeridin başında sarı görünür
    want(combo = [], keys = []) {
      wanted = combo;
      const rest = keys.filter((k) => !combo.includes(k));
      singleMods = rest.filter((k) => MODS[k] && k !== 'Meta' && k !== 'MetaLeft');
      singles = rest.filter((k) => !singleMods.includes(k));
      render();
      bar.scrollLeft = 0;
    },
    press,
  };
}
