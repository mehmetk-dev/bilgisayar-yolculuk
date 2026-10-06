// Windows Not Defteri benzeri pencere. İçindeki yazı alanı gerçek bir <textarea> olduğu için
// Ctrl+A/C/V/X/Z tarayıcının kendisi tarafından yapılır; biz yalnızca ne olduğunu izleyip derse bildiririz.
import { esc } from './dialog.js';

const isCtrl = (e) => e.ctrlKey || e.metaKey;

const MENUS = {
  Dosya: [['new', 'Yeni', 'Ctrl+N'], ['open', 'Aç…', 'Ctrl+O'], ['save', 'Kaydet', 'Ctrl+S'], ['saveAs', 'Farklı kaydet…', 'Ctrl+Shift+S'], null, ['print', 'Yazdır…', 'Ctrl+P'], ['exit', 'Çıkış', '']],
  Düzen: [['undo', 'Geri al', 'Ctrl+Z'], ['redo', 'Yinele', 'Ctrl+Y'], null, ['cut', 'Kes', 'Ctrl+X'], ['copy', 'Kopyala', 'Ctrl+C'], ['paste', 'Yapıştır', 'Ctrl+V'], ['delete', 'Sil', 'Del'], null, ['selectAll', 'Tümünü seç', 'Ctrl+A']],
  Görünüm: [['zoomIn', 'Yakınlaştır', 'Ctrl++'], ['zoomOut', 'Uzaklaştır', 'Ctrl+-'], ['zoomReset', 'Varsayılan yakınlaştırma', 'Ctrl+0']],
};

// Tek başına (masaüstü olmadan) kullanılan basit dosya deposu
const SIMPLE_FOLDERS = [['Masaüstü', '🖥'], ['Belgeler', '📄'], ['İndirilenler', '⬇'], ['Resimler', '🖼']];
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
  // opts: { fs, dialogs, embedded, global, onTitle, printers, onExit }
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
    this.active = !opts.global; // tek başına kullanımda ders açıkken true yapılır

    root.classList.add('np-win');
    if (opts.embedded) root.classList.add('np-embedded');
    root.innerHTML = `
      <div class="np-title"><span class="np-ico">📝</span><span class="np-name"></span>
        <span class="np-ctl" title="Bu pencere bir alıştırma penceresidir"><i>—</i><i>☐</i><i>✕</i></span></div>
      <div class="np-menu">${Object.keys(MENUS).map((m) => `<button type="button" data-menu="${m}">${m}</button>`).join('')}</div>
      <div class="np-drop" hidden></div>
      <textarea class="np-ta" spellcheck="false" autocomplete="off" autocapitalize="off" aria-label="Not Defteri yazı alanı"></textarea>
      <div class="np-status"><span class="np-pos"></span><span class="np-zoom"></span><span>Windows (CRLF)</span><span>UTF-8</span></div>`;
    this.root = root;
    this.ta = root.querySelector('.np-ta');
    this.prev = '';
    this.bindTextarea();
    this.bindMenu();
    if (opts.global) {
      // Odak yazı alanında değilken de Ctrl+S/O/P sayfanın kendi işlevlerini açmasın
      document.addEventListener('keydown', (e) => {
        if (!this.active || !isCtrl(e) || this.dialogs.busy || e.target === this.ta) return;
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
    ta.addEventListener('scroll', () => {
      const atBottom = ta.scrollTop + ta.clientHeight >= ta.scrollHeight - 4;
      this.emit('scroll', { atBottom, top: ta.scrollTop });
    });

    ta.addEventListener('copy', () => { this.clip = this.sel().text; this.emit('copy', { text: this.clip }); });
    ta.addEventListener('cut', () => { this.clip = this.sel().text; this.emit('cut', { text: this.clip }); });
    ta.addEventListener('paste', (e) => this.emit('paste', { text: e.clipboardData?.getData('text') ?? '' }));

    ta.addEventListener('keydown', (e) => {
      this.emit('key', { e });
      if (isCtrl(e)) this.shortcut(e);
    });
    ta.addEventListener('wheel', (e) => {
      if (!isCtrl(e)) return;
      e.preventDefault();
      this.setZoom(this.zoom + (e.deltaY < 0 ? 10 : -10));
    }, { passive: false });
  }

  shortcut(e) {
    const ta = this.ta;
    const k = e.key.toLowerCase();
    const stop = () => e.preventDefault();
    switch (e.code) {
      case 'KeyS': stop(); return this.save(e.shiftKey);
      case 'KeyO': stop(); return this.openFile();
      case 'KeyP': stop(); return this.print();
      case 'KeyN': stop(); return this.newFile(); // tarayıcı çoğu zaman yeni pencere açar; menüden de yapılabilir
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

  bindMenu() {
    const drop = this.root.querySelector('.np-drop');
    const close = () => { drop.hidden = true; this.root.querySelectorAll('[data-menu]').forEach((b) => b.classList.remove('on')); };
    this.root.querySelectorAll('[data-menu]').forEach((btn) => {
      // mousedown'ı engelleyerek yazı alanındaki seçimin kaybolmasını önlüyoruz
      btn.addEventListener('mousedown', (e) => e.preventDefault());
      btn.addEventListener('click', () => {
        const open = btn.classList.contains('on');
        close();
        if (open) return;
        btn.classList.add('on');
        drop.innerHTML = MENUS[btn.dataset.menu].filter((it) => !(it && it[0] === 'exit' && !this.opts.embedded))
          .map((it) => it ? `<button type="button" data-cmd="${it[0]}"><span>${it[1]}</span><kbd>${it[2]}</kbd></button>` : '<hr>').join('');
        drop.style.left = btn.offsetLeft + 'px';
        drop.hidden = false;
        this.emit('menu', { menu: btn.dataset.menu });
      });
    });
    drop.addEventListener('mousedown', (e) => e.preventDefault());
    drop.addEventListener('click', (e) => {
      const b = e.target.closest('[data-cmd]');
      if (!b) return;
      close();
      this.emit('menu-cmd', { cmd: b.dataset.cmd });
      this.command(b.dataset.cmd);
    });
    document.addEventListener('mousedown', (e) => { if (!this.root.contains(e.target)) close(); });
  }

  async command(cmd) {
    this.focus();
    const exec = (c, v) => document.execCommand(c, false, v);
    switch (cmd) {
      case 'new': return this.newFile();
      case 'open': return this.openFile();
      case 'save': return this.save(false);
      case 'saveAs': return this.save(true);
      case 'print': return this.print();
      case 'exit': return this.opts.onExit?.();
      case 'undo': return exec('undo');
      case 'redo': return this.redo();
      case 'cut': case 'copy':
        if (this.ta.selectionStart === this.ta.selectionEnd) return this.emit('nothing', { what: cmd });
        return exec(cmd);
      case 'delete': return exec('delete');
      case 'selectAll': this.ta.select(); return this.checkSel();
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
    }
  }

  setZoom(z) {
    this.zoom = Math.max(50, Math.min(300, z));
    this.refresh();
    this.emit('zoom', { zoom: this.zoom });
  }

  refresh() {
    this.root.querySelector('.np-name').textContent = this.title;
    this.root.querySelector('.np-zoom').textContent = '%' + this.zoom;
    this.ta.style.fontSize = (1.05 * this.zoom / 100) + 'em';
    this.refreshPos();
    this.opts.onTitle?.(this.title);
  }

  refreshPos() {
    const { ta } = this;
    const pos = ta.selectionDirection === 'backward' ? ta.selectionStart : ta.selectionEnd;
    const before = ta.value.slice(0, pos).split('\n');
    this.root.querySelector('.np-pos').textContent = `Satır ${before.length}, Sütun ${before.at(-1).length + 1}`;
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
    const r = await this.dialogs.file({ mode: 'save', fs: this.fs, folder: this.folder, name: this.fileName || '' });
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
    const r = await this.dialogs.file({ mode: 'open', fs: this.fs, folder: this.folder });
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
    return { value: this.ta.value, fileName: this.fileName, folder: this.folder, dirty: this.dirty, zoom: this.zoom, clip: this.clip, fs: this.fs.data };
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
    this.dialogs?.closeAll();
    this.refresh();
  }
}
