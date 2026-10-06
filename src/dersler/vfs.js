// Benzetim bilgisayarın dosya sistemi. Gerçek diske dokunmaz; her şey bellekte durur.
// Düğüm: { id, name, type: 'folder'|'file'|'link', parent, content?, app?, deletedFrom? }

export const ROOTS = [
  ['desktop', 'Masaüstü', '🖥'],
  ['docs', 'Belgeler', '📄'],
  ['downloads', 'İndirilenler', '⬇'],
  ['pictures', 'Resimler', '🖼'],
  ['music', 'Müzik', '🎵'],
];
export const RECYCLE = 'recycle';
export const USB = 'usb';

const BAD_CHARS = /[\\/:*?"<>|]/;
const lower = (s) => s.toLocaleLowerCase('tr');

function seed() {
  return [
    ['desktop', 'link', 'Not Defteri', { app: 'notepad' }],
    ['desktop', 'link', 'Hesap Makinesi', { app: 'calc' }],
    ['desktop', 'link', 'Paint', { app: 'paint' }],
    ['desktop', 'link', 'İnternet', { app: 'browser' }],
    ['docs', 'file', 'alışveriş listesi.txt', { content: 'Ekmek\nSüt\nYumurta\nPeynir\nDomates' }],
    ['docs', 'file', 'telefon numaraları.txt', { content: 'Ahmet amca: 0555 000 11 22\nEczane: 0212 000 33 44\nTorunum Elif: 0555 000 55 66' }],
    ['docs', 'folder', 'Faturalar', {}],
    ['downloads', 'file', 'kampanya broşürü.pdf', {}],
    ['pictures', 'file', 'tatil.jpg', { content: { emoji: '🏖', bg: ['#4fc3f7', '#ffe082'] } }],
    ['pictures', 'file', 'çiçekler.jpg', { content: { emoji: '🌻', bg: ['#aed581', '#fff59d'] } }],
    ['pictures', 'file', 'kedimiz.jpg', { content: { emoji: '🐈', bg: ['#ffccbc', '#d7ccc8'] } }],
    ['music', 'file', 'türkü.mp3', {}],
  ];
}

export class VFS {
  constructor() {
    this.listeners = [];
    this.reset();
  }

  onChange(fn) { this.listeners.push(fn); }
  changed(op, node) { this.listeners.forEach((fn) => fn(op, node)); }

  reset() {
    this.nodes = {};
    this.seq = 1;
    for (const [id, name] of ROOTS) this.nodes[id] = { id, name, type: 'folder', parent: null, root: true };
    this.nodes[RECYCLE] = { id: RECYCLE, name: 'Geri Dönüşüm Kutusu', type: 'folder', parent: null, root: true };
    for (const [p, type, name, extra] of seed()) this.create(p, { type, name, ...extra }, true);
    const fat = this.find('docs', 'Faturalar');
    this.create(fat.id, { type: 'file', name: 'elektrik faturası.pdf' }, true);
    this.create(fat.id, { type: 'file', name: 'su faturası.pdf' }, true);
    this.usb = false;
    this.changed('reset');
  }

  get(id) { return this.nodes[id]; }
  label(id) { return this.nodes[id]?.name ?? ''; }

  children(id) {
    return Object.values(this.nodes)
      .filter((n) => n.parent === id)
      .sort((a, b) => (a.type === 'folder' ? 0 : 1) - (b.type === 'folder' ? 0 : 1) || a.name.localeCompare(b.name, 'tr'));
  }

  find(parent, name) { return this.children(parent).find((n) => lower(n.name) === lower(name)); }
  findPath(path) {
    let cur = null;
    for (const part of path.split('/')) {
      cur = cur ? this.find(cur.id, part) : this.nodes[part];
      if (!cur) return null;
    }
    return cur;
  }

  path(id) {
    const out = [];
    for (let n = this.nodes[id]; n; n = this.nodes[n.parent]) out.unshift(n);
    return out;
  }

  isInside(id, ancestor) { return this.path(id).some((n) => n.id === ancestor); }
  inRecycle(id) { return this.isInside(id, RECYCLE); }

  uniqueName(parent, name, except) {
    const m = name.match(/^(.*?)(\.[^.]+)?$/);
    const base = m[1], ext = m[2] || '';
    let n = name, i = 2;
    while (this.children(parent).some((c) => c.id !== except && lower(c.name) === lower(n))) n = `${base} (${i++})${ext}`;
    return n;
  }

  create(parent, { type, name, content, app }, quiet) {
    const id = 'n' + this.seq++;
    const node = { id, type, parent, name: this.uniqueName(parent, name), content, app };
    this.nodes[id] = node;
    if (!quiet) this.changed('create', node);
    return node;
  }

  checkName(name) {
    const n = name.trim();
    if (!n) return 'Ad boş olamaz.';
    if (BAD_CHARS.test(n)) return 'Adda şu işaretler olamaz:  \\ / : * ? " < > |';
    return '';
  }

  rename(id, name) {
    const node = this.nodes[id];
    const err = this.checkName(name);
    if (err) return err;
    name = name.trim();
    if (this.children(node.parent).some((c) => c.id !== id && lower(c.name) === lower(name))) return `Bu klasörde “${name}” adında başka bir öğe var.`;
    const old = node.name;
    node.name = name;
    this.changed('rename', { ...node, old });
    return '';
  }

  move(id, parent) {
    const node = this.nodes[id];
    if (!node || node.root) return 'Bu öğe taşınamaz.';
    if (node.parent === parent) return '';
    if (id === parent || this.isInside(parent, id)) return 'Bir klasör kendi içine taşınamaz.';
    if (parent === RECYCLE) return this.remove(id);
    const from = node.parent;
    node.parent = parent;
    node.name = this.uniqueName(parent, node.name, id);
    delete node.deletedFrom;
    this.changed('move', { ...node, from });
    return '';
  }

  copy(id, parent) {
    const src = this.nodes[id];
    const node = this.create(parent, { type: src.type, name: src.name, content: structuredClone(src.content), app: src.app }, true);
    for (const c of this.children(id)) this.copy(c.id, node.id);
    this.changed('copy', { ...node, src: id });
    return node;
  }

  remove(id) {
    const node = this.nodes[id];
    if (!node || node.root) return 'Bu öğe silinemez.';
    if (this.inRecycle(id)) return this.purge(id);
    node.deletedFrom = node.parent;
    node.parent = RECYCLE;
    node.name = this.uniqueName(RECYCLE, node.name, id);
    this.changed('delete', node);
    return '';
  }

  restore(id) {
    const node = this.nodes[id];
    if (!node?.deletedFrom) return 'Geri yüklenemedi.';
    const to = this.nodes[node.deletedFrom] ? node.deletedFrom : 'desktop';
    node.parent = to;
    node.name = this.uniqueName(to, node.name, id);
    delete node.deletedFrom;
    this.changed('restore', node);
    return '';
  }

  purge(id, quiet) {
    for (const c of this.children(id)) this.purge(c.id, true);
    const node = this.nodes[id];
    delete this.nodes[id];
    if (!quiet) this.changed('purge', node);
    return '';
  }

  emptyRecycle() {
    for (const c of this.children(RECYCLE)) this.purge(c.id, true);
    this.changed('empty');
  }

  write(parent, name, content) {
    const f = this.find(parent, name);
    if (f) { f.content = content; this.changed('write', f); return f; }
    const n = this.create(parent, { type: 'file', name, content }, true);
    this.changed('write', n);
    return n;
  }

  search(text) {
    const t = lower(text.trim());
    if (!t) return [];
    return Object.values(this.nodes).filter((n) => !n.root && !this.inRecycle(n.id) && lower(n.name).includes(t));
  }

  plugUsb(on) {
    if (on === this.usb) return;
    this.usb = on;
    if (on) {
      this.nodes[USB] = { id: USB, name: 'USB Bellek (E:)', type: 'folder', parent: null, root: true, drive: true };
      this.create(USB, { type: 'file', name: 'okul fotoğrafı.jpg', content: { emoji: '🏫', bg: ['#90caf9', '#e1bee7'] } }, true);
    } else {
      this.purge(USB, true);
    }
    this.changed('usb', { on });
  }

  // Dosya kaydetme/açma pencerelerinin beklediği arayüz
  dialogApi() {
    const roots = () => [...ROOTS, ...(this.usb ? [[USB, 'USB Bellek (E:)', '💾']] : [])];
    return {
      folders: () => roots().map(([id, label, icon]) => ({ id, label, icon })),
      list: (id) => this.children(id).filter((n) => n.type !== 'link').map((n) => ({ id: n.id, name: n.name, folder: n.type === 'folder' })),
      label: (id) => this.label(id),
      read: (id, name) => this.find(id, name)?.content ?? null,
      write: (id, name, content) => this.write(id, name, content),
    };
  }
}
