// Windows 11 Not Defteri benzeri pencere. İçindeki yazı alanı gerçek bir <textarea> olduğu için
// Ctrl+A/C/V/X/Z tarayıcının kendisi tarafından yapılır; biz yalnızca ne olduğunu izleyip derse bildiririz.
// Görünüm: üstte sekme şeridi (Adsız ✕, +), altında Dosya / Düzenle / Görünüm menüsü ve dişli (Ayarlar), altta durum çubuğu.
// Tek sekme vardır: "Yeni sekme" kaydedilmemiş yazıyı sorup sayfayı boşaltır (derslerin akışı buna bağlı).
import { esc } from './dialog.js';
import { ico } from './w11ikon.js';
import { SYS_ICONS, APP_ICONS } from './apps/appicons.js';

const isCtrl = (e) => e.ctrlKey || e.metaKey;

// Menüler: [komut, ad, kısayol, seçenekler]. null = ayraç. Seçenekler: chk = işaretli olabilen ayar, sub = alt menü
const MENUS = {
  Dosya: [['new', 'Yeni sekme', 'Ctrl+N'], ['newWindow', 'Yeni pencere', 'Ctrl+Shift+N'], ['open', 'Aç…', 'Ctrl+O'], ['save', 'Kaydet', 'Ctrl+S'], ['saveAs', 'Farklı kaydet…', 'Ctrl+Shift+S'], ['saveAll', 'Tümünü kaydet', 'Ctrl+Alt+S'], null, ['pageSetup', 'Sayfa yapısı', ''], ['print', 'Yazdır…', 'Ctrl+P'], null, ['closeTab', 'Sekmeyi kapat', 'Ctrl+W'], ['closeWin', 'Pencereyi kapat', 'Ctrl+Shift+W'], ['exit', 'Çıkış', '']],
  Düzenle: [['undo', 'Geri al', 'Ctrl+Z'], ['redo', 'Yinele', 'Ctrl+Y'], null, ['cut', 'Kes', 'Ctrl+X'], ['copy', 'Kopyala', 'Ctrl+C'], ['paste', 'Yapıştır', 'Ctrl+V'], ['delete', 'Sil', 'Del'], null, ['find', 'Bul', 'Ctrl+F'], ['findNext', 'Sonrakini bul', 'F3'], ['findPrev', 'Öncekini bul', 'Shift+F3'], ['replace', 'Değiştir', 'Ctrl+H'], ['goto', 'Git', 'Ctrl+G'], null, ['selectAll', 'Tümünü seç', 'Ctrl+A'], ['datetime', 'Saat/Tarih', 'F5'], null, ['font', 'Yazı tipi', '']],
  Görünüm: [['zoom', 'Yakınlaştır', '', { sub: [['zoomIn', 'Yakınlaştır', 'Ctrl+Artı'], ['zoomOut', 'Uzaklaştır', 'Ctrl+Eksi'], ['zoomReset', 'Varsayılan yakınlaştırma', 'Ctrl+0']] }], ['statusBar', 'Durum çubuğu', '', { chk: 'status' }], ['wrap', 'Sözcük kaydırma', '', { chk: 'wrap' }]],
};

const FONTS = [['Consolas', 'Consolas, "Cascadia Mono", "DejaVu Sans Mono", monospace'], ['Cascadia Mono', '"Cascadia Mono", Consolas, "DejaVu Sans Mono", monospace'], ['Courier New', '"Courier New", Courier, monospace'], ['Arial', 'Arial, "Liberation Sans", sans-serif'], ['Segoe UI', '"Segoe UI", "Noto Sans", sans-serif'], ['Times New Roman', '"Times New Roman", "Liberation Serif", serif']];
const SIZES = [8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 36];
const pad2 = (n) => String(n).padStart(2, '0');

// Tek başına (masaüstü olmadan) kullanılan basit dosya deposu
const SIMPLE_FOLDERS = [['Masaüstü', SYS_ICONS['folder-desktop']], ['Belgeler', SYS_ICONS['folder-docs']], ['İndirilenler', SYS_ICONS['folder-down']], ['Resimler', SYS_ICONS['folder-pics']]];
const SIMPLE_SEED = { Masaüstü: [], Belgeler: [{ name: 'alışveriş listesi.txt', content: 'Ekmek\nSüt\nYumurta' }, { name: 'telefon numaraları.txt', content: 'Eczane: 0212 000 33 44' }], İndirilenler: [{ name: 'fatura.pdf' }], Resimler: [{ name: 'tatil.jpg' }] };

export function simpleFs(data = structuredClone(SIMPLE_SEED)) {
  return {
    data,
    folders: () => SIMPLE_FOLDERS.map(([id, icon]) => ({ id, label: id, icon })),
    list: (id) => (data[id] || []).map((f) => ({ id: f.name, name: f.name, folder: false })),
    label: (id) => id,
    read: (id, name) => (data[id] || []).find((f) => f.name === name)?.content ?? null,
    write: (id, name, content) => {
      const list = (data[id] ||= []);
      const f = list.find((x) => x.name === name);
      if (f) f.content = content; else list.push({ name, content });
    },
  };
}

export class Notepad {
  // opts: { fs, dialogs, embedded, global, onTitle, printers, onExit, onNewWindow, now }
  constructor(root, onEvent, opts = {}) {
    this.emit = (type, data = {}) => onEvent({ type, app: 'notepad', ...data });
    this.opts = opts;
    this.fs = opts.fs || simpleFs();
    this.dialogs = opts.dialogs;
    this.fileName = null;
    this.folder = this.fs.folders()[1]?.id || this.fs.folders()[0].id;
    this.dirty = false;
    this.zoom = 100;
    this.clip = '';
    this.font = 'Consolas';
    this.fsize = 11;
    this.wrap = true;
    this.status = true;
    this.fcase = false;
    this.fwrap = true;
    this.pageSetup = { top: '25,4', bottom: '25,4', left: '25,4', right: '25,4', header: '&f', footer: 'Sayfa &p' };
    this.active = !opts.global; // tek başına kullanımda ders açıkken true yapılır

    root.classList.add('np-win');
    if (opts.embedded) root.classList.add('np-embedded');
    root.innerHTML = `
      <div class="np-tabs"><div class="np-tab" title="Not Defteri"><span class="np-tico">${APP_ICONS.notepad}</span><span class="np-name"></span><button type="button" class="np-tabx" title="Sekmeyi kapat" aria-label="Sekmeyi kapat">${ico('x')}</button></div>
        <button type="button" class="np-plus" title="Yeni sekme" aria-label="Yeni sekme">${ico('plus')}</button><span class="np-grow"></span>
        <span class="np-ctl" title="Bu pencere bir alıştırma penceresidir"><i>${ico('minus')}</i><i>${ico('maximize')}</i><i>${ico('x')}</i></span></div>
      <div class="np-menu">${Object.keys(MENUS).map((m) => `<button type="button" data-menu="${m}">${m}</button>`).join('')}<span class="np-grow"></span><button type="button" class="np-gear" title="Ayarlar" aria-label="Ayarlar">${ico('gear')}</button></div>
      <div class="np-drop" hidden></div>
      <div class="np-edit">
        <div class="np-find" hidden>
          <div class="np-fr"><input class="np-fi" type="text" placeholder="Bul" aria-label="Bul" autocomplete="off" spellcheck="false"><span class="np-fcnt"></span>
            <button type="button" data-f="prev" title="Önceki (Shift+F3)" aria-label="Önceki">${ico('arrowUp')}</button><button type="button" data-f="next" title="Sonraki (F3)" aria-label="Sonraki">${ico('arrowDown')}</button>
            <button type="button" data-f="case" class="np-aa" title="Büyük/küçük harf eşleştir">Aa</button><button type="button" data-f="wrap" title="Sona gelince başa dön" aria-label="Sarmala">${ico('reset')}</button>
            <button type="button" data-f="rep" class="np-frep" title="Değiştir" aria-label="Değiştir">${ico('swap')}</button><button type="button" data-f="close" title="Kapat (Esc)" aria-label="Kapat">${ico('x')}</button></div>
          <div class="np-fr np-rr" hidden><input class="np-ri" type="text" placeholder="Değiştir" aria-label="Yerine yazılacak" autocomplete="off" spellcheck="false"><button type="button" data-f="one">Değiştir</button><button type="button" data-f="all">Tümünü değiştir</button></div>
        </div>
        <textarea class="np-ta" spellcheck="false" autocomplete="off" autocapitalize="off" aria-label="Not Defteri yazı alanı"></textarea>
        <div class="np-mirror" aria-hidden="true" hidden></div>
        <div class="np-set" hidden>
          <div class="np-seth"><button type="button" class="np-setback" title="Geri" aria-label="Geri">${ico('arrowL')}</button><b>Ayarlar</b></div>
          <div class="np-setb"><h4>Görünüm</h4>
            <label class="np-srow"><span>Yazı tipi</span><select class="np-sfont">${FONTS.map(([n]) => `<option>${n}</option>`).join('')}</select></label>
            <label class="np-srow"><span>Yazı boyutu</span><select class="np-ssize">${SIZES.map((n) => `<option>${n}</option>`).join('')}</select></label>
            <label class="np-srow"><span>Sözcük kaydırma</span><input type="checkbox" class="np-sw np-swrap"></label>
            <label class="np-srow"><span>Durum çubuğu</span><input type="checkbox" class="np-sw np-sstat"></label>
            <p class="np-snote">Not Defteri, Windows'un renk ayarına uyar.</p></div>
        </div>
      </div>
      <div class="np-status"><span class="np-pos"></span><span class="np-cnt"></span><span class="np-grow"></span><span class="np-ins" hidden>Üzerine yaz (INS)</span><span class="np-zoom"></span><span>Windows (CRLF)</span><span>UTF-8</span></div>`;
    this.root = root;
    this.ta = root.querySelector('.np-ta');
    this.prev = '';
    this.bindTextarea();
    this.bindMenu();
    this.bindTabs();
    this.bindFind();
    this.bindSettings();
    // Çoğu dizüstünde Insert tuşu yok: durum çubuğundaki yazıya tıklayınca da kip değişsin
    const ins = root.querySelector('.np-ins');
    ins.title = 'Üzerine yazmayı kapatmak için tıklayın (ya da Insert tuşuna basın)';
    ins.addEventListener('mousedown', (e) => e.preventDefault()); // yazı alanının odağı gitmesin
    ins.addEventListener('click', () => {
      this.setOverwrite(!this.overwrite);
      this.emit('insert-toggle', { on: this.overwrite });
      this.focus();
    });
    if (opts.global) {
      // Odak yazı alanında değilken de Ctrl+S/O/P sayfanın kendi işlevlerini açmasın
      document.addEventListener('keydown', (e) => {
        if (!this.active || !isCtrl(e) || this.dialogs.busy || e.target === this.ta) return;
        if (e.target.closest?.('.np-win input, .np-win select')) return;
        this.shortcut(e);
      });
    }
    this.refresh();
  }

  get value() { return this.ta.value; }
  sel() {
    const { selectionStart: start, selectionEnd: end, value } = this.ta;
    return { start, end, text: value.slice(start, end) };
  }
  focus() { this.ta.focus({ preventScroll: true }); }
  $(q) { return this.root.querySelector(q); }

  // Üzerine yazma kipini (Insert) derslerden açıp kapatmak için
  setOverwrite(on) {
    this.overwrite = on;
    this.$('.np-ins').hidden = !on;
  }
  get title() { return (this.dirty ? '*' : '') + (this.fileName ? this.fileName.replace(/\.txt$/i, '') : 'Adsız') + ' - Not Defteri'; }

  setText(text, fileName = null, folder = this.folder) {
    this.ta.value = this.prev = text;
    this.fileName = fileName;
    this.folder = folder;
    this.dirty = false;
    this.ta.setSelectionRange(0, 0);
    this.ta.scrollTop = 0;
    this.refresh();
  }

  bindTextarea() {
    const ta = this.ta;
    ta.addEventListener('input', (e) => {
      let inputType = e.inputType || '';
      if (this.menuPaste) { inputType = 'insertFromPaste'; this.menuPaste = false; }
      if (inputType === 'historyUndo') this.undoSeen = true;
      if (inputType === 'historyRedo') this.redoSeen = true;
      const prev = this.prev;
      this.prev = ta.value;
      this.dirty = true;
      this.refresh();
      this.emit('input', { inputType, data: e.data, prev, value: ta.value });
      if (inputType === 'historyUndo') this.emit('undo');
      if (inputType === 'historyRedo') this.emit('redo');
    });

    const checkSel = () => {
      if (document.activeElement !== ta) return;
      const { selectionStart: s, selectionEnd: e } = ta;
      this.refreshPos();
      if (s === this.ls && e === this.le && ta.value.length === this.ll) return;
      this.ls = s; this.le = e; this.ll = ta.value.length;
      this.emit('select', { start: s, end: e, text: ta.value.slice(s, e) });
    };
    this.checkSel = checkSel;
    document.addEventListener('selectionchange', checkSel);
    for (const ev of ['select', 'mouseup', 'keyup', 'focus']) ta.addEventListener(ev, checkSel);
    ta.addEventListener('dblclick', () => { checkSel(); this.emit('dblclick'); });
    ta.addEventListener('contextmenu', (e) => { e.stopPropagation(); this.emit('contextmenu'); });
    ta.addEventListener('focus', () => this.clearMirror());
    ta.addEventListener('scroll', () => {
      const mir = this.$('.np-mirror');
      mir.scrollTop = ta.scrollTop; mir.scrollLeft = ta.scrollLeft;
      const atBottom = ta.scrollTop + ta.clientHeight >= ta.scrollHeight - 4;
      this.emit('scroll', { atBottom, top: ta.scrollTop });
    });

    ta.addEventListener('copy', () => { this.clip = this.sel().text; this.emit('copy', { text: this.clip }); });
    ta.addEventListener('cut', () => { this.clip = this.sel().text; this.emit('cut', { text: this.clip }); });
    ta.addEventListener('paste', (e) => this.emit('paste', { text: e.clipboardData?.getData('text') ?? '' }));

    ta.addEventListener('keydown', (e) => {
      this.emit('key', { e });
      if (isCtrl(e)) this.shortcut(e);
      else if (e.key === 'F3') { e.preventDefault(); this.findNext(e.shiftKey ? -1 : 1); }
      else if (e.key === 'F5') { e.preventDefault(); this.insertDateTime(); }
      // Insert: "üzerine yaz" kipi. Yazılan harf imlecin sağındaki harfi siler (gerçek programlardaki gibi)
      if (e.code === 'Insert' && !isCtrl(e)) {
        this.setOverwrite(!this.overwrite);
        this.emit('insert-toggle', { on: this.overwrite });
      } else if (this.overwrite && e.key.length === 1 && !isCtrl(e) && !e.altKey && ta.selectionStart === ta.selectionEnd && ta.value[ta.selectionStart] && ta.value[ta.selectionStart] !== '\n') {
        ta.setSelectionRange(ta.selectionStart, ta.selectionStart + 1);
      }
    });
    ta.addEventListener('wheel', (e) => {
      if (!isCtrl(e)) return;
      e.preventDefault();
      this.setZoom(this.zoom + (e.deltaY < 0 ? 10 : -10));
    }, { passive: false });
  }

  shortcut(e) {
    const ta = this.ta;
    if (e.ctrlKey && e.altKey && e.code !== 'KeyS') return; // Alt Gr (Türkçe Q'da @ € gibi harfler) kısayol sayılmaz
    const k = e.key.toLowerCase();
    const stop = () => e.preventDefault();
    switch (e.code) {
      case 'KeyS': stop(); return e.altKey ? this.save(false) : this.save(e.shiftKey);
      case 'KeyO': stop(); return this.openFile();
      case 'KeyP': stop(); return this.print();
      case 'KeyN': stop(); return e.shiftKey ? this.command('newWindow') : this.newFile(); // tarayıcı çoğu zaman yeni pencere açar; menüden de yapılabilir
      case 'KeyF': stop(); return this.openFind(false);
      case 'KeyH': stop(); return this.openFind(true);
      case 'KeyG': stop(); return this.gotoLine();
      case 'KeyY': stop(); return this.redo();
      case 'KeyZ':
        if (e.shiftKey) { stop(); return this.redo(); }
        if (e.target !== ta) return;
        {
          // Geri al: tarayıcı kendisi yapar; inputType gelmezse değişiklikten anlarız
          const before = ta.value;
          this.undoSeen = false;
          setTimeout(() => { if (!this.undoSeen && ta.value !== before) this.emit('undo'); }, 60);
          if (!before) this.emit('nothing', { what: 'undo' });
        }
        return;
      case 'KeyC': case 'KeyX':
        if (e.target === ta && ta.selectionStart === ta.selectionEnd) this.emit('nothing', { what: e.code === 'KeyC' ? 'copy' : 'cut' });
        return;
    }
    if (k === '+' || k === '=' || e.code === 'NumpadAdd') { stop(); this.setZoom(this.zoom + 10); }
    else if (k === '-' || e.code === 'NumpadSubtract') { stop(); this.setZoom(this.zoom - 10); }
    else if (k === '0' || e.code === 'Numpad0') { stop(); this.setZoom(100); }
  }

  redo() {
    const before = this.ta.value;
    this.redoSeen = false;
    this.focus();
    document.execCommand('redo');
    if (this.ta.value === before) this.emit('nothing', { what: 'redo' });
    else if (!this.redoSeen) this.emit('redo');
  }

  // ---- Sekme şeridi ----
  bindTabs() {
    this.$('.np-plus').addEventListener('click', () => { this.emit('menu-cmd', { cmd: 'new' }); this.newFile(); });
    this.$('.np-tabx').addEventListener('click', () => this.closeTab());
    this.$('.np-gear').addEventListener('mousedown', (e) => e.preventDefault());
    this.$('.np-gear').addEventListener('click', () => { this.closeMenus(); this.toggleSettings(); });
  }

  // Tek sekme: kapatınca pencere kapanır (masaüstünde); tek başına kullanımda sayfa boşalır
  closeTab() {
    if (this.opts.onExit) return this.opts.onExit();
    return this.newFile();
  }

  // ---- Menü ----
  closeMenus() {
    this.$('.np-drop').hidden = true;
    this.root.querySelectorAll('[data-menu]').forEach((b) => b.classList.remove('on'));
  }

  bindMenu() {
    const drop = this.$('.np-drop');
    const close = () => this.closeMenus();
    const check = (key) => (key === 'status' ? this.status : this.wrap);
    const item = (it, sub) => {
      const [cmd, label, key, o = {}] = it;
      if (cmd === 'exit' || cmd === 'closeWin') { if (!this.opts.embedded) return ''; }
      const dis = cmd === 'newWindow' && !this.opts.onNewWindow;
      const mark = o.chk ? `<i class="np-mchk">${check(o.chk) ? ico('check') : ''}</i>` : '<i class="np-mchk"></i>';
      if (o.sub) return `<button type="button" data-sub="${cmd}" class="np-mi"><i class="np-mchk"></i><span>${label}</span><i class="np-marr">${ico('chevR')}</i></button><div class="np-subl" hidden>${o.sub.map((x) => item(x, true)).join('')}</div>`;
      return `<button type="button" data-cmd="${cmd}" class="np-mi${sub ? ' np-msub' : ''}" ${dis ? 'disabled' : ''}>${mark}<span>${label}</span><kbd>${key}</kbd></button>`;
    };
    const open = (btn) => {
      close();
      btn.classList.add('on');
      drop.innerHTML = MENUS[btn.dataset.menu].map((it) => (it ? item(it) : '<hr>')).join('');
      const menu = this.$('.np-menu');
      drop.style.left = btn.offsetLeft + 'px';
      drop.style.top = menu.offsetTop + menu.offsetHeight + 'px';
      drop.hidden = false;
      this.emit('menu', { menu: btn.dataset.menu });
    };
    this.root.querySelectorAll('[data-menu]').forEach((btn) => {
      // mousedown'ı engelleyerek yazı alanındaki seçimin kaybolmasını önlüyoruz
      btn.addEventListener('mousedown', (e) => e.preventDefault());
      btn.addEventListener('click', () => {
        if (btn.classList.contains('on')) return close();
        open(btn);
      });
      // Bir menü açıkken öbürünün üstüne gelmek onu açar (gerçek programlardaki gibi)
      btn.addEventListener('mouseenter', () => { if (!drop.hidden && !btn.classList.contains('on')) open(btn); });
    });
    drop.addEventListener('mousedown', (e) => e.preventDefault());
    drop.addEventListener('click', (e) => {
      const s = e.target.closest('[data-sub]');
      if (s) { const l = s.nextElementSibling; l.hidden = !l.hidden; s.classList.toggle('open', !l.hidden); return; }
      const b = e.target.closest('[data-cmd]');
      if (!b || b.disabled) return;
      close();
      this.emit('menu-cmd', { cmd: b.dataset.cmd });
      this.command(b.dataset.cmd);
    });
    document.addEventListener('mousedown', (e) => { if (!e.target.closest('.np-drop') && !e.target.closest('[data-menu]')) { if (!this.root.contains(e.target) || !drop.hidden) close(); } });
    this.root.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      if (!drop.hidden) { close(); this.focus(); }
      else if (!this.$('.np-set').hidden) { this.toggleSettings(false); }
      else if (!this.$('.np-find').hidden) { this.closeFind(); }
    });
  }

  async command(cmd) {
    this.focus();
    const exec = (c, v) => document.execCommand(c, false, v);
    switch (cmd) {
      case 'new': return this.newFile();
      case 'newWindow': return this.opts.onNewWindow?.();
      case 'open': return this.openFile();
      case 'save': return this.save(false);
      case 'saveAs': return this.save(true);
      case 'saveAll': return this.save(false);
      case 'pageSetup': return this.pageSetupDialog();
      case 'print': return this.print();
      case 'closeTab': return this.closeTab();
      case 'closeWin': case 'exit': return this.opts.onExit?.();
      case 'undo': return exec('undo');
      case 'redo': return this.redo();
      case 'cut': case 'copy':
        if (this.ta.selectionStart === this.ta.selectionEnd) return this.emit('nothing', { what: cmd });
        return exec(cmd);
      case 'delete': return exec('delete');
      case 'find': return this.openFind(false);
      case 'findNext': return this.findNext(1);
      case 'findPrev': return this.findNext(-1);
      case 'replace': return this.openFind(true);
      case 'goto': return this.gotoLine();
      case 'selectAll': this.ta.select(); return this.checkSel();
      case 'datetime': return this.insertDateTime();
      case 'font': return this.toggleSettings(true);
      case 'paste': {
        let t = this.clip;
        try { t = (await navigator.clipboard.readText()) || t; } catch { /* izin yoksa kendi panomuzu kullanırız */ }
        if (!t) return this.emit('nothing', { what: 'paste' });
        this.focus();
        this.menuPaste = true;
        exec('insertText', t);
        return;
      }
      case 'zoomIn': return this.setZoom(this.zoom + 10);
      case 'zoomOut': return this.setZoom(this.zoom - 10);
      case 'zoomReset': return this.setZoom(100);
      case 'statusBar': this.status = !this.status; this.refresh(); return this.emit('view', { status: this.status });
      case 'wrap': this.wrap = !this.wrap; this.refresh(); return this.emit('view', { wrap: this.wrap });
    }
  }

  setZoom(z) {
    this.zoom = Math.max(50, Math.min(300, z));
    this.refresh();
    this.emit('zoom', { zoom: this.zoom });
  }

  // ---- Bul / Değiştir (sağ üstte açılan küçük kutu) ----
  bindFind() {
    const box = this.$('.np-find');
    const fi = this.$('.np-fi');
    this.$('.np-aa').classList.toggle('on', this.fcase);
    box.addEventListener('mousedown', (e) => { if (!e.target.closest('input')) e.preventDefault(); });
    box.addEventListener('click', (e) => {
      const b = e.target.closest('[data-f]');
      if (!b) return;
      const a = b.dataset.f;
      if (a === 'next') this.findNext(1);
      else if (a === 'prev') this.findNext(-1);
      else if (a === 'case') { this.fcase = !this.fcase; b.classList.toggle('on', this.fcase); this.updateFindCount(); }
      else if (a === 'wrap') { this.fwrap = !this.fwrap; b.classList.toggle('off', !this.fwrap); }
      else if (a === 'rep') this.$('.np-rr').hidden = !this.$('.np-rr').hidden;
      else if (a === 'one') this.replaceOne();
      else if (a === 'all') this.replaceAll();
      else if (a === 'close') this.closeFind();
    });
    fi.addEventListener('input', () => { this.updateFindCount(); this.emit('find-text', { text: fi.value }); });
    box.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter') return;
      e.preventDefault();
      if (e.target.classList.contains('np-ri')) this.replaceOne();
      else this.findNext(e.shiftKey ? -1 : 1);
    });
  }

  openFind(withReplace) {
    this.toggleSettings(false);
    const box = this.$('.np-find'), fi = this.$('.np-fi');
    const { text } = this.sel();
    if (text && !text.includes('\n')) fi.value = text;
    box.hidden = false;
    this.$('.np-rr').hidden = !withReplace;
    this.updateFindCount();
    fi.focus();
    fi.select();
    this.emit(withReplace ? 'replace-open' : 'find-open');
  }

  closeFind() {
    this.$('.np-find').hidden = true;
    this.clearMirror();
    this.focus();
  }

  // Aranacak yazının yerlerini bulur
  matches() {
    const q = this.$('.np-fi').value;
    if (!q) return [];
    const fold = (s) => (this.fcase ? s : s.toLocaleLowerCase('tr'));
    const hay = fold(this.ta.value), needle = fold(q);
    const out = [];
    for (let i = hay.indexOf(needle); i >= 0; i = hay.indexOf(needle, i + Math.max(1, needle.length))) out.push(i);
    return out;
  }

  updateFindCount() {
    const q = this.$('.np-fi').value;
    const n = this.matches().length;
    this.$('.np-fcnt').textContent = q ? (n ? `${n} sonuç` : 'Sonuç yok') : '';
    this.$('.np-find').classList.toggle('none', !!q && !n);
  }

  findNext(dir = 1) {
    if (!this.$('.np-fi').value) return this.openFind(false);
    const ms = this.matches();
    const len = this.$('.np-fi').value.length;
    if (!ms.length) { this.updateFindCount(); this.emit('find', { found: false }); return false; }
    const { selectionStart: s, selectionEnd: e } = this.ta;
    let at;
    if (dir > 0) { at = ms.find((i) => i >= e) ?? (this.fwrap ? ms[0] : undefined); if (at === undefined) at = ms.find((i) => i >= s + 1); }
    else { at = [...ms].reverse().find((i) => i < s) ?? (this.fwrap ? ms.at(-1) : undefined); }
    if (at === undefined) { this.emit('find', { found: false }); return false; }
    this.showMatch(at, at + len);
    this.emit('find', { found: true, start: at, count: ms.length });
    return true;
  }

  // Bulunan yeri seçer ve görünür yapar. Odak bul kutusunda kaldığı için (yazı alanı odaksızken seçim görünmez)
  // yazı alanının birebir kopyası olan şeffaf bir katmanda bulunan yerin üstüne renkli bir işaret çizilir.
  showMatch(a, b) {
    const ta = this.ta;
    const keep = document.activeElement;
    ta.focus({ preventScroll: true });
    ta.setSelectionRange(a, b);
    const m = this.drawMirror(a, b);
    if (m) {
      const top = m.offsetTop;
      if (top < ta.scrollTop || top + m.offsetHeight > ta.scrollTop + ta.clientHeight) ta.scrollTop = Math.max(0, top - ta.clientHeight / 3);
      this.$('.np-mirror').scrollTop = ta.scrollTop;
    }
    if (keep && keep !== ta && keep.matches?.('.np-fi, .np-ri')) keep.focus(); else this.clearMirror();
    this.refreshPos();
  }

  drawMirror(a, b) {
    const ta = this.ta, mir = this.$('.np-mirror');
    const cs = getComputedStyle(ta);
    for (const k of ['fontFamily', 'fontSize', 'lineHeight', 'letterSpacing', 'tabSize', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft']) mir.style[k] = cs[k];
    mir.style.whiteSpace = this.wrap ? 'pre-wrap' : 'pre';
    mir.style.right = ta.offsetWidth - ta.clientWidth + 'px';
    mir.style.bottom = ta.offsetHeight - ta.clientHeight + 'px';
    const v = ta.value;
    mir.innerHTML = esc(v.slice(0, a)) + '<mark>' + esc(v.slice(a, b)) + '</mark>' + esc(v.slice(b));
    mir.hidden = false;
    mir.scrollTop = ta.scrollTop;
    mir.scrollLeft = ta.scrollLeft;
    return mir.querySelector('mark');
  }

  clearMirror() { this.$('.np-mirror').hidden = true; }

  replaceOne() {
    const q = this.$('.np-fi').value;
    if (!q) return;
    const { text, start } = this.sel();
    const same = this.fcase ? text === q : text.toLocaleLowerCase('tr') === q.toLocaleLowerCase('tr');
    if (!same) { this.findNext(1); return; }
    const rep = this.$('.np-ri').value;
    this.ta.focus({ preventScroll: true });
    this.ta.setSelectionRange(start, start + q.length);
    document.execCommand('insertText', false, rep);
    this.emit('replace', { all: false });
    this.updateFindCount();
    this.findNext(1);
    this.$('.np-ri').focus();
  }

  replaceAll() {
    const q = this.$('.np-fi').value;
    const ms = this.matches();
    if (!q || !ms.length) return;
    const rep = this.$('.np-ri').value;
    const v = this.ta.value;
    let out = '', last = 0;
    for (const i of ms) { out += v.slice(last, i) + rep; last = i + q.length; }
    out += v.slice(last);
    this.ta.focus({ preventScroll: true });
    this.ta.select();
    document.execCommand('insertText', false, out);
    this.emit('replace', { all: true, count: ms.length });
    this.updateFindCount();
    this.$('.np-ri').focus();
  }

  // ---- Git (satıra git), Saat/Tarih, Sayfa yapısı ----
  async gotoLine() {
    if (this.dialogs.busy) return;
    const total = this.ta.value.split('\n').length;
    const cur = this.ta.value.slice(0, this.ta.selectionEnd).split('\n').length;
    const r = await this.dialogs.form({
      title: 'Satıra git', fields: [{ name: 'line', label: 'Satır numarası:', value: String(cur) }], ok: 'Git',
      check: (v) => { const n = +v.line; return Number.isInteger(n) && n >= 1 && n <= total ? '' : `Satır numarası 1 ile ${total} arasında olmalı.`; },
    });
    this.focus();
    if (!r) return;
    const lines = this.ta.value.split('\n');
    const n = +r.line;
    const pos = lines.slice(0, n - 1).reduce((a, l) => a + l.length + 1, 0);
    this.ta.setSelectionRange(pos, pos);
    this.refreshPos();
    this.emit('goto', { line: n });
  }

  insertDateTime() {
    const d = this.opts.now?.() || new Date();
    this.focus();
    document.execCommand('insertText', false, `${pad2(d.getHours())}:${pad2(d.getMinutes())} ${pad2(d.getDate())}.${pad2(d.getMonth() + 1)}.${d.getFullYear()}`);
    this.emit('datetime');
  }

  async pageSetupDialog() {
    if (this.dialogs.busy) return;
    const p = this.pageSetup;
    const r = await this.dialogs.form({
      title: 'Sayfa yapısı', text: 'Kâğıt: <b>A4</b>, yön: <b>Dikey</b>. Kenar boşlukları (mm):',
      fields: [{ name: 'top', label: 'Üst:', value: p.top }, { name: 'bottom', label: 'Alt:', value: p.bottom }, { name: 'left', label: 'Sol:', value: p.left }, { name: 'right', label: 'Sağ:', value: p.right }, { name: 'header', label: 'Üst bilgi:', value: p.header }, { name: 'footer', label: 'Alt bilgi:', value: p.footer }],
      ok: 'Tamam',
    });
    this.focus();
    if (!r) return;
    this.pageSetup = r;
    this.emit('page-setup', { ...r });
  }

  // ---- Ayarlar sayfası (dişli ya da Düzenle → Yazı tipi) ----
  bindSettings() {
    const set = this.$('.np-set');
    this.$('.np-setback').addEventListener('click', () => this.toggleSettings(false));
    this.$('.np-sfont').addEventListener('change', (e) => { this.font = e.target.value; this.refresh(); this.emit('font', { font: this.font, size: this.fsize }); });
    this.$('.np-ssize').addEventListener('change', (e) => { this.fsize = +e.target.value; this.refresh(); this.emit('font', { font: this.font, size: this.fsize }); });
    this.$('.np-swrap').addEventListener('change', (e) => { this.wrap = e.target.checked; this.refresh(); this.emit('view', { wrap: this.wrap }); });
    this.$('.np-sstat').addEventListener('change', (e) => { this.status = e.target.checked; this.refresh(); this.emit('view', { status: this.status }); });
    set.addEventListener('mousedown', (e) => { if (!e.target.closest('select, input')) e.preventDefault(); });
  }

  toggleSettings(on = this.$('.np-set').hidden) {
    const set = this.$('.np-set');
    const was = !set.hidden;
    set.hidden = !on;
    this.root.classList.toggle('np-inset', on);
    if (on) { this.$('.np-find').hidden = true; this.refresh(); this.emit('settings'); }
    else if (was) this.focus();
  }

  refresh() {
    const name = this.title.replace(/ - Not Defteri$/, '');
    this.$('.np-name').textContent = name;
    this.$('.np-tab').title = this.title;
    this.$('.np-tab').classList.toggle('dirty', this.dirty);
    this.$('.np-zoom').textContent = '%' + this.zoom;
    const ta = this.ta;
    ta.style.fontSize = (1.05 * (this.zoom / 100) * (this.fsize / 11)) + 'em';
    ta.style.fontFamily = FONTS.find((f) => f[0] === this.font)?.[1] || '';
    ta.wrap = this.wrap ? 'soft' : 'off';
    ta.classList.toggle('np-nowrap', !this.wrap);
    this.$('.np-status').hidden = !this.status;
    this.$('.np-sfont').value = this.font;
    this.$('.np-ssize').value = String(this.fsize);
    this.$('.np-swrap').checked = this.wrap;
    this.$('.np-sstat').checked = this.status;
    this.refreshPos();
    if (!this.$('.np-find').hidden) this.updateFindCount();
    this.opts.onTitle?.(this.title);
  }

  refreshPos() {
    const { ta } = this;
    const pos = ta.selectionDirection === 'backward' ? ta.selectionStart : ta.selectionEnd;
    const before = ta.value.slice(0, pos).split('\n');
    this.$('.np-pos').textContent = `Sat ${before.length}, Süt ${before.at(-1).length + 1}`;
    const n = ta.value.length;
    this.$('.np-cnt').textContent = `${n} karakter`;
  }

  // ---- Dosya işlemleri ----
  // Kaydedilmemiş değişiklik varsa sorar. Devam edilebilecekse true döner.
  async confirmDiscard() {
    if (!this.dirty) return true;
    const name = this.fileName ? this.fileName.replace(/\.txt$/i, '') : 'Adsız';
    const a = await this.dialogs.ask({
      title: 'Not Defteri',
      text: `<b>${esc(name)}</b> dosyasındaki değişiklikleri kaydetmek istiyor musunuz?`,
      buttons: [['save', 'Kaydet', true], ['discard', 'Kaydetme'], ['cancel', 'İptal']],
    });
    this.emit('ask', { answer: a || 'cancel' });
    if (a === 'save') return this.save(false);
    return a === 'discard';
  }

  async save(asNew) {
    if (this.dialogs.busy) return false;
    if (this.fileName && !asNew) {
      this.fs.write(this.folder, this.fileName, this.ta.value);
      this.dirty = false;
      this.refresh();
      this.emit('save', { name: this.fileName, folder: this.folder, label: this.fs.label(this.folder), quick: true });
      return true;
    }
    const r = await this.dialogs.file({ mode: 'save', fs: this.fs, folder: this.folder, name: this.fileName || '', types: [['.txt', 'Metin Belgeleri (*.txt)'], ['*', 'Tüm Dosyalar (*.*)']] });
    this.focus();
    if (!r) return false;
    this.fs.write(r.folder, r.name, this.ta.value);
    this.fileName = r.name;
    this.folder = r.folder;
    this.dirty = false;
    this.refresh();
    this.emit('save', { name: r.name, folder: r.folder, label: this.fs.label(r.folder), quick: false });
    return true;
  }

  async openFile() {
    if (this.dialogs.busy || !(await this.confirmDiscard())) return;
    const r = await this.dialogs.file({ mode: 'open', fs: this.fs, folder: this.folder, accept: /\.(txt|html?)$/i });
    this.focus();
    if (!r) return;
    const content = this.fs.read(r.folder, r.name);
    this.setText(typeof content === 'string' ? content : '', r.name, r.folder);
    this.emit('open', { name: r.name, folder: r.folder, label: this.fs.label(r.folder) });
  }

  async newFile() {
    if (this.dialogs.busy || !(await this.confirmDiscard())) return;
    this.setText('', null);
    this.focus();
    this.emit('new');
  }

  async print() {
    if (this.dialogs.busy) return;
    const printers = this.opts.printers?.() || ['PDF olarak kaydet'];
    const r = await this.dialogs.print({ printers, doc: this.fileName || 'Adsız' });
    this.focus();
    if (r) this.emit('print', { ...r, doc: this.fileName || 'Adsız' });
  }

  // ---- Durum (sayfa yenilenince kaldığı yerden devam için) ----
  getState() {
    return { value: this.ta.value, fileName: this.fileName, folder: this.folder, dirty: this.dirty, zoom: this.zoom, clip: this.clip, fs: this.fs.data, font: this.font, fsize: this.fsize, wrap: this.wrap, status: this.status };
  }
  setState(s = {}) {
    if (s.fs && this.fs.data) Object.assign(this.fs.data, s.fs);
    if (!s.fs && this.fs.data) { for (const k of Object.keys(this.fs.data)) delete this.fs.data[k]; Object.assign(this.fs.data, structuredClone(SIMPLE_SEED)); }
    this.ta.value = this.prev = s.value || '';
    this.fileName = s.fileName || null;
    this.folder = s.folder || this.fs.folders()[1]?.id;
    this.dirty = !!s.dirty;
    this.zoom = s.zoom || 100;
    this.clip = s.clip || '';
    this.font = s.font || 'Consolas';
    this.fsize = s.fsize || 11;
    this.wrap = s.wrap !== false;
    this.status = s.status !== false;
    this.dialogs?.closeAll();
    this.closeMenus();
    this.$('.np-find').hidden = true;
    this.toggleSettings(false);
    this.refresh();
  }
}
